# Model bundles

The active bundle is selected in `settings.json`. Each bundle folder keeps the exact `model_bundle.joblib`, its `imu_features.py` implementation, and any evaluation report together.

To switch models, copy the new bundle folder here, update `model.bundle` and its trained `mountSite`, `bodyPart`, and `side` in `settings.json`, then restart the Python bridge. The bridge checks that the bundle and feature extractor report the same feature version before connecting to MQTT.

The included bundle is trained for `bodyPart=lumbar`, `mountSite=lumbar`, and `side=center`. It needs a calibrated IMU stream at 20 Hz with accelerometer, gyroscope, relative pitch/roll, calibration ID, and calibration method version 1. The example `planko/imu` payload does not include several of those fields yet, so the game displays live sensor values and the model's missing-input status until the gateway publishes them.
