"""Inference adapter for the replaceable scikit-learn joblib bundles."""

from __future__ import annotations

import math
import importlib.util
import hashlib
from collections import deque
from pathlib import Path
import sys
from typing import Any

import joblib
import numpy as np

def _unknown(bundle: dict[str, Any], reason: str, **extra: Any) -> dict[str, Any]:
    return {
        "action": "unknown",
        "stage": "unknown",
        "score": None,
        "phaseScore": None,
        "scoreKind": bundle.get("score_kind", "unavailable"),
        "modelVersion": bundle.get("model_version", "unavailable"),
        "reason": reason,
        **extra,
    }


class NodeModel:
    """A separate temporal window and smoothing state for one IMU node."""

    def __init__(
        self,
        bundle_path: Path,
        body_part: str,
        mount_site: str,
        side: str,
    ) -> None:
        self.bundle_path = bundle_path
        self.body_part = body_part
        self.mount_site = mount_site
        self.side = side
        self.bundle = joblib.load(bundle_path)
        feature_path = bundle_path.with_name("imu_features.py")
        if not feature_path.is_file():
            raise FileNotFoundError(
                f"The selected model needs its own imu_features.py beside {bundle_path.name}"
            )
        module_name = "planko_model_features_" + hashlib.sha256(
            str(feature_path.resolve()).encode("utf-8")
        ).hexdigest()[:16]
        feature_module = sys.modules.get(module_name)
        if feature_module is None:
            spec = importlib.util.spec_from_file_location(module_name, feature_path)
            if spec is None or spec.loader is None:
                raise ImportError(f"Could not load model feature extractor: {feature_path}")
            feature_module = importlib.util.module_from_spec(spec)
            sys.modules[module_name] = feature_module
            spec.loader.exec_module(feature_module)
        self.feature_module = feature_module
        self._validate_bundle()
        config = self.bundle["config"]["prediction"]
        self.buffer = self.feature_module.StreamBuffer(
            float(self.bundle["window_seconds"]),
            float(self.bundle["sampling_hz"]),
            float(config["gap_reset_seconds"]),
        )
        self.history_limit = int(config["smoothing_windows"])
        self.action_history: deque[str] = deque(maxlen=self.history_limit)
        self.phase_history: deque[str] = deque(maxlen=self.history_limit)
        self.stable_action: str | None = None
        self.stable_phase: str | None = None
        self.hold_action: str | None = None
        self.hold_started: float | None = None

    def _validate_bundle(self) -> None:
        if self.bundle.get("feature_version") != self.feature_module.FEATURE_VERSION:
            raise ValueError(
                "Model feature version does not match the selected imu_features.py: "
                f"{self.bundle.get('feature_version')} != {self.feature_module.FEATURE_VERSION}"
            )
        if self.mount_site not in self.bundle.get("mount_sites", []):
            raise ValueError(f"Model does not support mount site {self.mount_site!r}")
        if self.body_part not in self.bundle.get("body_parts", []):
            raise ValueError(f"Model does not support body part {self.body_part!r}")
        supported_pairs = {
            tuple(pair) for pair in self.bundle.get("supported_pairs", [])
        }
        if supported_pairs and (self.body_part, self.mount_site) not in supported_pairs:
            raise ValueError(
                f"Model was not trained for {self.body_part!r} at {self.mount_site!r}"
            )
        supported_contexts = {
            tuple(context) for context in self.bundle.get("supported_contexts", [])
        }
        if supported_contexts and (
            self.body_part,
            self.mount_site,
            self.side,
        ) not in supported_contexts:
            raise ValueError(
                f"Model was not trained for {self.body_part!r}, "
                f"{self.mount_site!r}, {self.side!r}"
            )

    def reset(self) -> None:
        self.buffer.reset()
        self.action_history.clear()
        self.phase_history.clear()
        self.stable_action = None
        self.stable_phase = None
        self.hold_action = None
        self.hold_started = None

    def predict(self, row: dict[str, Any]) -> dict[str, Any]:
        item = self.bundle
        calibrated = bool(row.get("calibrated"))
        required_versions = {
            int(value)
            for value in item.get("calibration_requirements", {}).get(
                "method_versions", []
            )
        }

        if item.get("requires_calibration"):
            if (
                not calibrated
                or not row.get("relative_orientation_valid")
                or not row.get("calibration_id")
            ):
                self.reset()
                return _unknown(
                    item,
                    "calibration_required",
                    calibrated=calibrated,
                    mountSite=self.mount_site,
                    bodyPart=self.body_part,
                )
            if int(row.get("calibration_method_version", 0)) not in required_versions:
                self.reset()
                return _unknown(
                    item,
                    "calibration_method_version_unavailable",
                    calibrated=calibrated,
                    mountSite=self.mount_site,
                    bodyPart=self.body_part,
                )

        if not self.buffer.add(row):
            return _unknown(
                item,
                "duplicate_or_invalid_sample",
                calibrated=calibrated,
                mountSite=self.mount_site,
                bodyPart=self.body_part,
            )

        features = self.buffer.features(
            self.mount_site, bool(item.get("requires_calibration"))
        )
        if features is None:
            return _unknown(
                item,
                "warming_up",
                calibrated=calibrated,
                mountSite=self.mount_site,
                bodyPart=self.body_part,
            )

        x = np.asarray(
            [[float(features.get(name, 0.0)) for name in item["feature_columns"]]],
            dtype=float,
        )
        action_model = item.get("action_model")
        if action_model is None:
            return _unknown(item, "action_model_unavailable")
        action_probabilities = {
            str(label): float(probability)
            for label, probability in zip(
                action_model.classes_, action_model.predict_proba(x)[0]
            )
        }
        allowed_actions = {
            entry["id"]
            for entry in (
                item.get("config", {})
                .get("body_parts", {})
                .get(self.body_part, {})
                .get("actions", [])
            )
        }
        action_probabilities = {
            label: score
            for label, score in action_probabilities.items()
            if label in allowed_actions
        }
        if not action_probabilities:
            self.reset()
            return _unknown(item, "no_action_classes_for_body_part")

        action, score = max(action_probabilities.items(), key=lambda pair: pair[1])
        if score < float(item["config"]["prediction"]["minimum_action_score"]):
            self.reset()
            return _unknown(
                item,
                "low_action_score",
                score=round(score, 4),
                calibrated=calibrated,
                mountSite=self.mount_site,
                bodyPart=self.body_part,
            )

        self.action_history.append(action)
        action_counts = {candidate: self.action_history.count(candidate) for candidate in self.action_history}
        majority_action = max(action_counts, key=action_counts.get)
        if action_counts[majority_action] >= 2 or self.stable_action is None:
            self.stable_action = majority_action
        action = self.stable_action
        score = action_probabilities.get(action, score)

        phase_model = item.get("phase_model")
        phase_score: float | None = None
        phase_reason = ""
        if phase_model is not None:
            phase_probabilities = {
                str(label): float(probability)
                for label, probability in zip(
                    phase_model.classes_, phase_model.predict_proba(x)[0]
                )
            }
            stage, phase_score = max(
                phase_probabilities.items(), key=lambda pair: pair[1]
            )
            if phase_score < float(item["config"]["prediction"]["minimum_phase_score"]):
                stage = "unknown"
                phase_reason = "low_phase_score"
            elif stage in {"neutral", "approaching", "holding", "returning"}:
                self.phase_history.append(stage)
                phase_counts = {
                    candidate: self.phase_history.count(candidate)
                    for candidate in self.phase_history
                }
                majority_phase = max(phase_counts, key=phase_counts.get)
                if phase_counts[majority_phase] >= 2 or self.stable_phase is None:
                    self.stable_phase = majority_phase
                stage = self.stable_phase
                phase_score = phase_probabilities.get(stage, phase_score)
            else:
                self.phase_history.clear()
                self.stable_phase = None
        else:
            stage = "unknown"
            phase_reason = item.get("phase_unavailable_reason") or "phase_model_unavailable"

        held_ms = 0
        device_time = float(row["device_time_s"])
        if stage == "holding":
            if self.hold_action != action:
                self.hold_action = action
                self.hold_started = device_time
            started_at = self.hold_started if self.hold_started is not None else device_time
            held_ms = max(0, int((device_time - started_at) * 1000))
            if held_ms < float(item["config"]["prediction"]["holding_stable_seconds"]) * 1000:
                stage = "unknown"
                phase_reason = "confirming_holding"
        else:
            self.hold_action = None
            self.hold_started = None

        return {
            "action": action,
            "stage": stage,
            "score": round(score, 4),
            "phaseScore": None if phase_score is None else round(phase_score, 4),
            "scoreKind": item["score_kind"],
            "modelVersion": item["model_version"],
            "reason": phase_reason,
            "heldMs": held_ms,
            "calibrated": calibrated,
            "mountSite": self.mount_site,
            "bodyPart": self.body_part,
        }
