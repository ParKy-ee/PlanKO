# MQTT to model bridge

The Python bridge owns the TCP MQTT connection because the ESP32 publishes on MQTT port 1883. It subscribes only to `planko/imu`, loads a replaceable scikit-learn bundle from `Model/`, and streams telemetry and per-node predictions to the game screen over a local WebSocket.

## Run on Windows

From the project root, install the Python dependencies and start the bridge:

```powershell
py -3.10 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe -m backend.server
```

Start Expo in LAN mode in a second terminal:

```powershell
npm start -- --lan
```

Keep the phone and computer on the same network. The game reads the Expo development server address and connects to port `8765` on that computer.

## Select a model

Put each model bundle and its matching `imu_features.py` in its own directory under `Model/`. Update `Model/settings.json` to select the bundle and its trained body part, mount site, side, and sensor units, then restart the bridge with `.\.venv\Scripts\python.exe -m backend.server`. Node 1, Node 2, and Node 3 have separate feature windows and prediction histories. If a gateway message omits a node, the other nodes continue independently; the omitted node is shown as missing and becomes stale after the configured timeout. The bridge checks that a bundle's feature version matches its selected extractor and stops with an error if they do not match.

The included lumbar model requires at least 0.5 seconds of samples at 20 Hz, accelerometer and gyroscope channels, calibrated relative roll and pitch, a calibration ID, and calibration method version 1. The MQTT example currently includes accelerometer values and absolute angles, but does not include gyro or those calibration fields. The game therefore shows live telemetry and names the missing fields while this firmware payload is incomplete; it does not invent model output from those values.

Use these MQTT fields to provide the missing inputs when available:

```json
{
  "gyro": [0, 0, 0],
  "relative_roll_deg": 0,
  "relative_pitch_deg": 0,
  "relative_orientation_valid": true,
  "calibrated": true,
  "calibration_id": "cal-example",
  "calibration_method_version": 1
}
```

The gyro values must be in `rad/s` unless `gyroUnit` in `Model/settings.json` is changed. The model's score is an uncalibrated estimator score, not a probability.
