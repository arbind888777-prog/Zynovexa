import { Controller, Get, Put, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get platform-wide stats' })
  getStats() { return this.adminService.getStats(); }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  getUsers(@Query('page') page: string, @Query('limit') limit: string, @Query('search') search: string) {
    return this.adminService.getUsers(parseInt(page) || 1, parseInt(limit) || 20, search);
  }

  @Put('users/:id/ban')
  @ApiOperation({ summary: 'Ban a user' })
  banUser(@Param('id') id: string) { return this.adminService.banUser(id); }

  @Put('users/:id/unban')
  @ApiOperation({ summary: 'Unban a user' })
  unbanUser(@Param('id') id: string) { return this.adminService.unbanUser(id); }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user' })
  deleteUser(@Param('id') id: string) { return this.adminService.deleteUser(id); }

  @Get('activity-logs')
  @ApiOperation({ summary: 'Get activity logs' })
  getLogs(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getActivityLogs(parseInt(page) || 1, parseInt(limit) || 50);
  }
}
