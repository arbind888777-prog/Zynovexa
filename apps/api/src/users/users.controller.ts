import { Controller, Get, Put, Delete, Body, Request, UseGuards, Patch, Query, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from '../auth/dto/auth.dto';

export class CompleteOnboardingDto {
  @IsOptional() @IsString() userType?: string;
  @IsOptional() @IsString() niche?: string;
  @IsOptional() @IsArray() platforms?: string[];
  @IsOptional() @IsString() goal?: string;
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get profile with stats' })
  getMe(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get dashboard overview stats' })
  getDashboardStats(@Request() req) {
    return this.usersService.getDashboardStats(req.user.id);
  }

  @Get('admin/list')
  @ApiOperation({ summary: 'Admin: list users with plan and last login info' })
  getAdminUsers(
    @Request() req,
    @Query('q') query?: string,
    @Query('plan') plan?: string,
    @Query('role') role?: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }

    return this.usersService.getAdminUsers({ query, plan, role });
  }

  @Put('me')
  @ApiOperation({ summary: 'Update profile' })
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Change password' })
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.id, dto.currentPassword, dto.newPassword);
  }

  @Patch('onboarding')
  @ApiOperation({ summary: 'Complete onboarding questionnaire' })
  completeOnboarding(@Request() req, @Body() dto: CompleteOnboardingDto) {
    return this.usersService.completeOnboarding(req.user.id, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete account permanently' })
  deleteAccount(@Request() req) {
    return this.usersService.deleteAccount(req.user.id);
  }
}
