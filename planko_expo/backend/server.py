"""Subscribe to planko/imu, run the local model, and stream results to the app."""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import threading
import uuid
from pathlib import Path
from typing import Any

import paho.mqtt.client as mqtt
from websockets.asyncio.server import ServerConnection, serve

from .pipeline import ImuPipeline

ROOT = Path(__file__).resolve().parents[1]
LOG = logging.getLogger("planko_model_bridge")


class ModelBridge:
    def __init__(self, settings_path: Path) -> None:
        self.settings_path = settings_path.resolve()
        self.settings = json.loads(self.settings_path.read_text(encoding="utf-8"))
        self.pipeline = ImuPipeline(ROOT, self.settings)
        self.loop: asyncio.AbstractEventLoop | None = None
        self.payload_queue: asyncio.Queue[bytes] = asyncio.Queue(maxsize=128)
        self.stopping = threading.Event()
        self.mqtt_client = self._create_mqtt_client()
        self.websocket_clients: set[ServerConnection] = set()

    def _create_mqtt_client(self) -> mqtt.Client:
        client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2,
            client_id=f"PlanKO_App_{uuid.uuid4().hex[:12]}",
            clean_session=True,
        )
        client.on_connect = self._on_mqtt_connect
        client.on_disconnect = self._on_mqtt_disconnect
        client.on_message = self._on_mqtt_message
        return client

    def _on_mqtt_connect(self, client, userdata, flags, reason_code, properties) -> None:
        if reason_code.is_failure:
            self.pipeline.set_mqtt_status("disconnected", str(reason_code))
            LOG.error("MQTT connection was rejected: %s", reason_code)
            return
        topic = self.settings["mqtt"]["topic"]
        result, _ = client.subscribe(topic, qos=int(self.settings["mqtt"].get("qos", 0)))
        if result != mqtt.MQTT_ERR_SUCCESS:
            self.pipeline.set_mqtt_status("disconnected", "subscribe_failed")
            LOG.error("MQTT subscribe failed for %s (code %s)", topic, result)
            return
        self.pipeline.set_mqtt_status("connected")
        LOG.info("MQTT connected; subscribed only to %s", topic)

    def _on_mqtt_disconnect(self, client, userdata, disconnect_flags, reason_code, properties) -> None:
        if self.stopping.is_set():
            self.pipeline.set_mqtt_status("disconnected")
            return
        self.pipeline.set_mqtt_status("disconnected", str(reason_code))
        LOG.warning("MQTT disconnected: %s", reason_code)

    def _on_mqtt_message(self, client, userdata, message) -> None:
        if message.topic != self.settings["mqtt"]["topic"] or message.retain:
            return
        if len(message.payload) > 256 * 1024:
            LOG.warning("Skipped an oversized MQTT payload (%s bytes)", len(message.payload))
            return
        loop = self.loop
        if loop is not None and loop.is_running():
            loop.call_soon_threadsafe(self._enqueue_payload, bytes(message.payload))

    def _enqueue_payload(self, payload: bytes) -> None:
        if self.payload_queue.full():
            dropped = 0
            while not self.payload_queue.empty():
                try:
                    self.payload_queue.get_nowait()
                    self.payload_queue.task_done()
                    dropped += 1
                except asyncio.QueueEmpty:
                    break
            self.pipeline.note_dropped_payloads(dropped)
            self.pipeline.reset_streams()
            LOG.warning("Inference fell behind; dropped %s queued samples and reset windows", dropped)
        self.payload_queue.put_nowait(payload)

    async def _consume_payloads(self) -> None:
        while True:
            payload = await self.payload_queue.get()
            try:
                await asyncio.to_thread(self.pipeline.process_payload, payload)
            except ValueError as error:
                LOG.warning("Skipped invalid planko/imu payload: %s", error)
            except Exception:
                LOG.exception("Model inference failed for an IMU payload")
            finally:
                self.payload_queue.task_done()

    async def _stream_updates(self) -> None:
        while True:
            if self.websocket_clients:
                payload = json.dumps(self.pipeline.snapshot(), separators=(",", ":"))
                clients = tuple(self.websocket_clients)
                results = await asyncio.gather(
                    *(client.send(payload) for client in clients),
                    return_exceptions=True,
                )
                for client, result in zip(clients, results):
                    if isinstance(result, Exception):
                        self.websocket_clients.discard(client)
            await asyncio.sleep(0.2)

    async def _handle_websocket(self, connection: ServerConnection) -> None:
        if connection.request.path != self.settings["bridge"].get("path", "/ws"):
            await connection.close(code=1008, reason="Use the configured /ws path")
            return
        self.websocket_clients.add(connection)
        LOG.info("Game UI connected to the model bridge")
        try:
            await connection.send(
                json.dumps(self.pipeline.snapshot(), separators=(",", ":"))
            )
            await connection.wait_closed()
        finally:
            self.websocket_clients.discard(connection)
            LOG.info("Game UI disconnected from the model bridge")

    async def run(self) -> None:
        self.loop = asyncio.get_running_loop()
        bridge = self.settings["bridge"]
        mqtt_settings = self.settings["mqtt"]
        consume_task = asyncio.create_task(self._consume_payloads())
        stream_task = asyncio.create_task(self._stream_updates())
        self.mqtt_client.connect_async(
            mqtt_settings["host"], int(mqtt_settings["port"]), keepalive=30
        )
        self.mqtt_client.loop_start()
        try:
            async with serve(
                self._handle_websocket,
                bridge["host"],
                int(bridge["port"]),
                ping_interval=20,
                ping_timeout=20,
                max_size=64 * 1024,
            ):
                LOG.info(
                    "Game model bridge listening on ws://%s:%s%s",
                    bridge["host"],
                    bridge["port"],
                    bridge.get("path", "/ws"),
                )
                await asyncio.Future()
        finally:
            self.stopping.set()
            consume_task.cancel()
            stream_task.cancel()
            self.mqtt_client.disconnect()
            self.mqtt_client.loop_stop()
            await asyncio.gather(consume_task, stream_task, return_exceptions=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--settings",
        type=Path,
        default=ROOT / "Model" / "settings.json",
        help="Path to the MQTT, node, and model settings JSON file.",
    )
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    bridge = ModelBridge(args.settings)
    try:
        asyncio.run(bridge.run())
    except KeyboardInterrupt:
        LOG.info("Stopping the game model bridge")


if __name__ == "__main__":
    main()
