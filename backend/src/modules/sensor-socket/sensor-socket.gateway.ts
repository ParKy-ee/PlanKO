import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SensorSocketService } from './sensor-socket.service';
import { SensorPayloadDto } from './dto/sensor-payload.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SensorSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(SensorSocketGateway.name);

  constructor(private readonly sensorSocketService: SensorSocketService) {}

  handleConnection(client: any) {
    this.logger.log(`Socket connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('sensor:data')
  async handleSensorData(
    @ConnectedSocket() client: any,
    @MessageBody() payload: SensorPayloadDto,
  ) {
    this.logger.log(`Received data from ${client.id}: ${JSON.stringify(payload)}`);
    const normalized = this.sensorSocketService.normalizePayload(payload);

    this.server.emit('sensor:updated', normalized);

    return {
      event: 'sensor:ack',
      data: {
        clientId: client.id,
        receivedAt: normalized.receivedAt,
      },
    };
  }
}
