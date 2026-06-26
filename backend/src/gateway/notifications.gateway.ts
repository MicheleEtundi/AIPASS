import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // email → socketId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.forEach((socketId, email) => {
      if (socketId === client.id) this.connectedUsers.delete(email);
    });
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { email: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedUsers.set(data.email, client.id);
    console.log(`Registered: ${data.email}`);
  }

  // Notify all teachers when a new query comes in
  notifyTeachers(data: { studentName: string; question: string; category: string }) {
    this.server.emit('new_query', data);
  }

  // Notify specific student when their response is validated
  notifyStudent(studentEmail: string, data: { status: string; question: string }) {
    const socketId = this.connectedUsers.get(studentEmail);
    if (socketId) {
      this.server.to(socketId).emit('response_validated', data);
    }
  }
}