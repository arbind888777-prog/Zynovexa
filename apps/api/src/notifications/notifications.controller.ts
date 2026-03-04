import { Controller, Get, Post, Put, Delete, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  getAll(@Request() req, @Query('page') page: string, @Query('limit') limit: string) {
    return this.notificationsService.getAll(req.user.id, parseInt(page) || 1, parseInt(limit) || 20);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@Request() req) { return this.notificationsService.getUnreadCount(req.user.id); }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markRead(@Request() req, @Param('id') id: string) { return this.notificationsService.markRead(req.user.id, id); }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@Request() req) { return this.notificationsService.markAllRead(req.user.id); }

  @Delete()
  @ApiOperation({ summary: 'Delete all notifications' })
  deleteAll(@Request() req) { return this.notificationsService.deleteAll(req.user.id); }
}
