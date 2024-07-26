import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  transports: ['websocket', 'polling'],
  upgrade: true,
  credentials: true,
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('NotificationGateway');

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleConnection(client, ...args: any[]) {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  sendNotification(userId: string, type: string, data: unknown): void {
    if (typeof data === 'object' && data !== null) {
      const payload = { id: data['id'], type, details: { ...data } };
      this.server.emit(`notifications/${userId}`, payload);
    } else {
      const payload = { type, details: data };
      this.server.emit(`notifications/${userId}`, payload);
    }
  }
}
