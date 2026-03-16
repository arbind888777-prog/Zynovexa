import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MailService } from './mail.service';
import { IsEmail, IsString, IsOptional } from 'class-validator';

class SendTestEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  template: string;

  @IsOptional()
  context?: Record<string, any>;
}

@ApiTags('Mail (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('test')
  @ApiOperation({ summary: 'Send a test email (Admin only)' })
  async sendTest(@Body() dto: SendTestEmailDto) {
    return this.mailService.send({
      to: dto.to,
      subject: dto.subject,
      html: `<p>${dto.context?.message || 'Test email from Zynovexa'}</p>`,
    });
  }
}
