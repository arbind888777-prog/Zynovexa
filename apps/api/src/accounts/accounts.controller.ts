import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { ConnectAccountDto, UpdateAccountDto } from './dto/account.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all connected social accounts' })
  getAll(@Request() req) { return this.accountsService.getAll(req.user.id); }

  @Get('stats')
  @ApiOperation({ summary: 'Get account stats (total followers, platforms)' })
  getStats(@Request() req) { return this.accountsService.getStats(req.user.id); }

  @Post('connect')
  @ApiOperation({ summary: 'Connect a new social account' })
  connect(@Request() req, @Body() dto: ConnectAccountDto) { return this.accountsService.connect(req.user.id, dto); }

  @Put(':id')
  @ApiOperation({ summary: 'Update account tokens/info' })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateAccountDto) { return this.accountsService.update(req.user.id, id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Disconnect a social account' })
  disconnect(@Request() req, @Param('id') id: string) { return this.accountsService.disconnect(req.user.id, id); }
}
