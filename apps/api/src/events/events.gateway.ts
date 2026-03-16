import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
  namespace: '/ws',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private readonly connectedUsers = new Map<string, Set<string>>(); // userId -> socketIds

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET', 'zynovexa-secret-key'),
      });

      client.userId = payload.sub;

      // Track connection
      if (!this.connectedUsers.has(client.userId)) {
        this.connectedUsers.set(client.userId, new Set());
      }
      this.connectedUsers.get(client.userId).add(client.id);

      // Join user's personal room
      client.join(`user:${client.userId}`);

      this.logger.log(`Client connected: ${client.id} (user: ${client.userId})`);
      client.emit('connected', { message: 'Connected to Zynovexa real-time' });
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSockets = this.connectedUsers.get(client.userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedUsers.delete(client.userId);
        }
      }
      this.logger.log(`Client disconnected: ${client.id} (user: ${client.userId})`);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() room: string) {
    // Only allow joining user's own rooms
    if (room.startsWith(`user:${client.userId}`)) {
      client.join(room);
      return { joined: room };
    }
    return { error: 'Unauthorized room' };
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', data: { timestamp: Date.now() } };
  }

  // ─── Emit Methods (called from services) ──────────────────────────────────

  /** Send notification to specific user */
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /** Send notification about a new notification */
  emitNotification(userId: string, notification: {
    id: string; title: string; message: string; type: string;
  }) {
    this.emitToUser(userId, 'notification', notification);
  }

  /** Notify user that a post was published */
  emitPostPublished(userId: string, post: { id: string; title: string; platforms: string[] }) {
    this.emitToUser(userId, 'post:published', post);
  }

  /** Notify user that a post failed */
  emitPostFailed(userId: string, post: { id: string; title: string; error: string }) {
    this.emitToUser(userId, 'post:failed', post);
  }

  /** Send real-time analytics update */
  emitAnalyticsUpdate(userId: string, data: any) {
    this.emitToUser(userId, 'analytics:update', data);
  }

  /** Broadcast to all connected users (admin announcements) */
  emitBroadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  /** Get number of connected users */
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  /** Check if user is online */
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}
