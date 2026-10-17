"""Maintain independent live telemetry and inference state for IMU nodes."""

from __future__ import annotations

import threading
import time
from pathlib import Path
from typing import Any

from .model_runtime import NodeModel
from .sample_protocol import make_model_row, parse_imu_payload


class ImuPipeline:
    def __init__(self, root: Path, settings: dict[str, Any]) -> None:
        self.root = root
        self.settings = settings
        self.node_ids = [int(node_id) for node_id in settings["nodes"]]
        self.stale_after = float(settings["staleAfterSeconds"])
        self.accel_unit = str(settings["accelUnit"])
        self.gyro_unit = str(settings["gyroUnit"])
        model_settings = settings["model"]
        bundle_path = (root / "Model" / model_settings["bundle"]).resolve()
        model_root = (root / "Model").resolve()
        if not bundle_path.is_relative_to(model_root):
            raise ValueError("Model bundle must stay inside the Model directory")
        if not bundle_path.is_file():
            raise FileNotFoundError(f"Model bundle not found: {bundle_path}")

        self.model_nodes: dict[int, NodeModel] = {
            node_id: NodeModel(
                bundle_path,
                str(model_settings["bodyPart"]),
                str(model_settings["mountSite"]),
                str(model_settings["side"]),
            )
            for node_id in self.node_ids
        }
        self.lock = threading.RLock()
        self.mqtt_status = "connecting"
        self.mqtt_error: str | None = None
        self.last_received_at_ms: int | None = None
        self.gateway: dict[str, Any] | None = None
        self.gateway_epoch = 0
        self.pressure: dict[str, Any] | None = None
        self.dropped_payloads = 0
        self.nodes = {
            node_id: {
                "nodeId": node_id,
                "status": "missing",
                "lastSeenMonotonic": None,
                "lastSignature": None,
                "telemetry": None,
                "prediction": self._unknown_for(node_id, "waiting_for_imu"),
                "missingFields": [],
            }
            for node_id in self.node_ids
        }

    def _unknown_for(self, node_id: int, reason: str) -> dict[str, Any]:
        model = self.model_nodes[node_id]
        return {
            "action": "unknown",
            "stage": "unknown",
            "score": None,
            "phaseScore": None,
            "scoreKind": model.bundle.get("score_kind", "unavailable"),
            "modelVersion": model.bundle.get("model_version", "unavailable"),
            "reason": reason,
            "calibrated": False,
            "mountSite": model.mount_site,
            "bodyPart": model.body_part,
        }

    def set_mqtt_status(self, status: str, error: str | None = None) -> None:
        with self.lock:
            self.mqtt_status = status
            self.mqtt_error = error

    def reset_streams(self) -> None:
        with self.lock:
            for node_model in self.model_nodes.values():
                node_model.reset()

    def note_dropped_payloads(self, amount: int) -> None:
        with self.lock:
            self.dropped_payloads += amount

    def process_payload(self, raw: str | bytes) -> None:
        parsed = parse_imu_payload(raw)
        now_monotonic = time.monotonic()
        now_wall_ms = int(time.time() * 1000)
        with self.lock:
            previous_uptime = self.gateway.get("uptimeMs") if self.gateway else None
            if previous_uptime is not None and parsed["gateway"]["uptimeMs"] < previous_uptime:
                self.gateway_epoch += 1
                for node_id, node_model in self.model_nodes.items():
                    node_model.reset()
                    self.nodes[node_id]["lastSignature"] = None
                    self.nodes[node_id]["lastSeenMonotonic"] = None
            self.gateway = parsed["gateway"]
            self.pressure = parsed["pressure"]
            self.last_received_at_ms = now_wall_ms

            for node in parsed["nodes"]:
                node_id = node["nodeId"]
                state = self.nodes.get(node_id)
                if state is None:
                    continue

                signature = (
                    self.gateway_epoch,
                    node["streamEpoch"],
                    node["seq"],
                    node["ts"],
                )
                sample_is_new = signature != state["lastSignature"]
                if sample_is_new:
                    state["lastSeenMonotonic"] = now_monotonic
                    state["lastSignature"] = signature
                state["telemetry"] = {
                    "seq": node["seq"],
                    "ts": node["ts"],
                    "pitch": node["pitch"],
                    "roll": node["roll"],
                    "yaw": node["yaw"],
                    "dropped": node["dropped"],
                    "isMock": node["isMock"],
                    "accel": node["accel"],
                    "gyro": node["gyro"],
                    "bio": node["bio"],
                }

                if not sample_is_new:
                    continue

                node_model = self.model_nodes[node_id]
                if node["isMock"]:
                    state["prediction"] = self._unknown_for(node_id, "mock_sample")
                    state["missingFields"] = []
                    node_model.reset()
                    continue

                row, missing_fields = make_model_row(
                    node,
                    self.accel_unit,
                    self.gyro_unit,
                    node_model.mount_site,
                    node_model.body_part,
                    node_model.side,
                )
                state["missingFields"] = missing_fields
                if row is None:
                    reason = "missing_" + "_and_".join(missing_fields)
                    state["prediction"] = self._unknown_for(node_id, reason)
                    node_model.reset()
                    continue

                try:
                    state["prediction"] = node_model.predict(row)
                except (KeyError, TypeError, ValueError, FloatingPointError) as error:
                    state["prediction"] = self._unknown_for(
                        node_id, f"invalid_model_input: {error}"
                    )
                    node_model.reset()

    def snapshot(self) -> dict[str, Any]:
        now_monotonic = time.monotonic()
        with self.lock:
            nodes = []
            for node_id in self.node_ids:
                state = self.nodes[node_id]
                last_seen = state["lastSeenMonotonic"]
                if last_seen is None:
                    status = "missing"
                elif now_monotonic - last_seen > self.stale_after:
                    status = "stale"
                else:
                    status = "live"
                nodes.append(
                    {
                        "nodeId": node_id,
                        "status": status,
                        "telemetry": state["telemetry"],
                        "prediction": (
                            state["prediction"]
                            if status == "live"
                            else self._unknown_for(node_id, "node_not_live")
                        ),
                        "missingFields": state["missingFields"],
                    }
                )

            model_settings = self.settings["model"]
            model_versions = sorted(
                {model.bundle["model_version"] for model in self.model_nodes.values()}
            )
            return {
                "type": "game_snapshot",
                "mqttStatus": self.mqtt_status,
                "mqttError": self.mqtt_error,
                "topic": self.settings["mqtt"]["topic"],
                "receivedAt": self.last_received_at_ms,
                "gateway": self.gateway,
                "pressure": self.pressure,
                "droppedPayloads": self.dropped_payloads,
                "model": {
                    "bundle": model_settings["bundle"],
                    "versions": model_versions,
                    "requiresCalibration": any(
                        model.bundle.get("requires_calibration", False)
                        for model in self.model_nodes.values()
                    ),
                    "windowSeconds": max(
                        float(model.bundle["window_seconds"])
                        for model in self.model_nodes.values()
                    ),
                    "samplingHz": max(
                        float(model.bundle["sampling_hz"])
                        for model in self.model_nodes.values()
                    ),
                },
                "nodes": nodes,
            }
