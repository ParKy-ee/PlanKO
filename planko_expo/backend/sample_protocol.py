"""Validation and unit conversion for the ESP32 `planko/imu` payload."""

from __future__ import annotations

import math
from typing import Any

G = 9.80665


def _finite_number(value: Any) -> float | None:
    if isinstance(value, bool):
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def _integer(value: Any) -> int | None:
    number = _finite_number(value)
    if number is None or number < 0 or not number.is_integer():
        return None
    return int(number)


def _vector(value: Any) -> list[float] | None:
    if not isinstance(value, (list, tuple)) or len(value) != 3:
        return None
    values = [_finite_number(item) for item in value]
    return values if all(item is not None for item in values) else None


def _first_vector(payload: dict[str, Any], array_key: str, axis_keys: tuple[str, ...]):
    vector = _vector(payload.get(array_key))
    if vector is not None:
        return vector
    if all(axis in payload for axis in axis_keys):
        return _vector([payload[axis] for axis in axis_keys])
    return None


def parse_imu_payload(raw: str | bytes) -> dict[str, Any]:
    import json

    try:
        payload = json.loads(raw)
    except (json.JSONDecodeError, UnicodeDecodeError, TypeError) as error:
        raise ValueError("invalid_json") from error
    if not isinstance(payload, dict) or payload.get("type") != "imu_stream":
        raise ValueError("unexpected_payload_type")

    gateway = payload.get("gateway")
    pressure = payload.get("pressure")
    nodes = payload.get("nodes")
    if not isinstance(gateway, dict) or not isinstance(pressure, dict) or not isinstance(nodes, list):
        raise ValueError("missing_gateway_pressure_or_nodes")

    connected_nodes = _integer(gateway.get("connectedNodes"))
    uptime_ms = _integer(gateway.get("uptimeMs"))
    raw_pressure = _finite_number(pressure.get("raw"))
    voltage = _finite_number(pressure.get("voltage"))
    if connected_nodes is None or uptime_ms is None or raw_pressure is None or voltage is None:
        raise ValueError("invalid_gateway_or_pressure_fields")
    if not isinstance(pressure.get("pressed"), bool):
        raise ValueError("invalid_pressure_pressed")

    normalized_nodes = []
    seen_node_ids: set[int] = set()
    for node in nodes:
        if not isinstance(node, dict):
            continue
        node_id = _integer(node.get("nodeId"))
        seq = _integer(node.get("seq"))
        ts_ms = _integer(node.get("ts"))
        if node_id is None or seq is None or ts_ms is None or node_id in seen_node_ids:
            continue
        seen_node_ids.add(node_id)

        accel = _first_vector(node, "accel", ("ax", "ay", "az"))
        gyro = _first_vector(node, "gyro", ("gx", "gy", "gz"))
        angles = {
            key: _finite_number(node.get(key))
            for key in ("pitch", "roll", "yaw")
        }
        if any(value is None for value in angles.values()):
            continue

        bio = node.get("bio") if isinstance(node.get("bio"), dict) else {}
        bpm = _finite_number(bio.get("bpm"))
        spo2 = _finite_number(bio.get("spo2"))
        finger = bio.get("finger") is True
        calibration_id = node.get("calibrationId", node.get("calibration_id", ""))
        if not isinstance(calibration_id, str):
            calibration_id = ""

        normalized_nodes.append(
            {
                "nodeId": node_id,
                "seq": seq,
                "ts": ts_ms,
                "pitch": angles["pitch"],
                "roll": angles["roll"],
                "yaw": angles["yaw"],
                "dropped": _integer(node.get("dropped")) or 0,
                "isMock": node.get("isMock") is True,
                "accel": accel,
                "gyro": gyro,
                "bio": {
                    "bpm": bpm if finger and bpm and bpm > 0 else None,
                    "spo2": spo2 if finger and spo2 and 0 < spo2 <= 100 else None,
                    "finger": finger,
                },
                "calibrated": node.get("calibrated") is True,
                "relativeOrientationValid": node.get(
                    "relative_orientation_valid",
                    node.get("relativeOrientationValid", False),
                ) is True,
                "relativeRoll": _finite_number(
                    node.get("relative_roll_deg", node.get("relativeRollDeg"))
                ),
                "relativePitch": _finite_number(
                    node.get("relative_pitch_deg", node.get("relativePitchDeg"))
                ),
                "calibrationId": calibration_id,
                "calibrationMethodVersion": _integer(
                    node.get("calibration_method_version", node.get("calibrationMethodVersion"))
                ) or 0,
                "valid": node.get("valid", True) is True,
                "streamEpoch": _integer(node.get("boot_id", node.get("streamEpoch"))) or 0,
                "sensorUid": str(node.get("sensor_uid", node.get("sensorUid", f"imu-node-{node_id}"))),
            }
        )

    return {
        "gateway": {"uptimeMs": uptime_ms, "connectedNodes": connected_nodes},
        "pressure": {"raw": raw_pressure, "voltage": voltage, "pressed": pressure["pressed"]},
        "nodes": normalized_nodes,
    }


def make_model_row(
    node: dict[str, Any],
    accel_unit: str,
    gyro_unit: str,
    mount_site: str,
    body_part: str,
    side: str,
) -> tuple[dict[str, Any] | None, list[str]]:
    """Convert one MQTT IMU sample to the units/schema used by the trained bundle."""
    missing = []
    accel = node.get("accel")
    gyro = node.get("gyro")
    if accel is None:
        missing.append("accel")
    if gyro is None:
        missing.append("gyro")
    if node.get("relativeRoll") is None or node.get("relativePitch") is None:
        missing.append("relative_orientation")
    if not node["calibrated"]:
        missing.append("calibration")
    if not node["calibrationId"]:
        missing.append("calibration_id")

    row: dict[str, Any] = {
        "seq": node["seq"],
        "device_time_s": node["ts"] / 1000.0,
        "stream_epoch": node["streamEpoch"],
        "sensor_uid": node["sensorUid"],
        "mount_site": mount_site,
        "body_part": body_part,
        "side": side,
        "valid": node["valid"],
        "calibrated": node["calibrated"],
        "relative_orientation_valid": node["relativeOrientationValid"],
        "relative_roll_deg": node["relativeRoll"],
        "relative_pitch_deg": node["relativePitch"],
        "calibration_id": node["calibrationId"],
        "calibration_method_version": node["calibrationMethodVersion"],
    }
    if accel is not None:
        if accel_unit == "g":
            accel = [value * G for value in accel]
        elif accel_unit != "m/s^2":
            raise ValueError(f"Unsupported accelUnit: {accel_unit}")
        row.update({f"accel_{axis}": value for axis, value in zip("xyz", accel)})
    if gyro is not None:
        if gyro_unit == "deg/s":
            gyro = [math.radians(value) for value in gyro]
        elif gyro_unit != "rad/s":
            raise ValueError(f"Unsupported gyroUnit: {gyro_unit}")
        row.update({f"gyro_{axis}": value for axis, value in zip("xyz", gyro)})
    return (row if not missing else None), missing
