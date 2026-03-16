import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
  constructor(private gateway: EventsGateway) {}

  /** Push notification to user in real-time */
  sendNotification(userId: string, notification: {
    id: string; title: string; message: string; type: string;
  }) {
    this.gateway.emitNotification(userId, notification);
  }

  /** Notify post published */
  notifyPostPublished(userId: string, post: {
    id: string; title: string; platforms: string[];
  }) {
    this.gateway.emitPostPublished(userId, post);
  }

  /** Notify post failed */
  notifyPostFailed(userId: string, post: {
    id: string; title: string; error: string;
  }) {
    this.gateway.emitPostFailed(userId, post);
  }

  /** Push analytics update */
  pushAnalyticsUpdate(userId: string, data: any) {
    this.gateway.emitAnalyticsUpdate(userId, data);
  }

  /** Admin broadcast */
  broadcast(event: string, data: any) {
    this.gateway.emitBroadcast(event, data);
  }

  /** Get online stats */
  getOnlineStats() {
    return {
      onlineUsers: this.gateway.getConnectedUsersCount(),
    };
  }

  /** Check user online status */
  isOnline(userId: string): boolean {
    return this.gateway.isUserOnline(userId);
  }
}
