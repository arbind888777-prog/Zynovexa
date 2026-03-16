import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MonetizationService } from './monetization.service';
import { CreateBrandDealDto, UpdateBrandDealDto, BrandDealQueryDto } from './dto/monetization.dto';

@ApiTags('Monetization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monetization')
export class MonetizationController {
  constructor(private monetizationService: MonetizationService) {}

  // ─── Brand Deals ───────────────────────────────────────────────────────────

  @Post('deals')
  @ApiOperation({ summary: 'Create a new brand deal' })
  createDeal(@Request() req, @Body() dto: CreateBrandDealDto) {
    return this.monetizationService.createDeal(req.user.id, dto);
  }

  @Get('deals')
  @ApiOperation({ summary: 'Get all brand deals (paginated, filterable)' })
  getDeals(@Request() req, @Query() query: BrandDealQueryDto) {
    return this.monetizationService.getDeals(req.user.id, query);
  }

  @Get('deals/:id')
  @ApiOperation({ summary: 'Get single brand deal' })
  getDeal(@Request() req, @Param('id') id: string) {
    return this.monetizationService.getDeal(id, req.user.id);
  }

  @Put('deals/:id')
  @ApiOperation({ summary: 'Update a brand deal' })
  updateDeal(@Request() req, @Param('id') id: string, @Body() dto: UpdateBrandDealDto) {
    return this.monetizationService.updateDeal(id, req.user.id, dto);
  }

  @Delete('deals/:id')
  @ApiOperation({ summary: 'Delete a brand deal' })
  deleteDeal(@Request() req, @Param('id') id: string) {
    return this.monetizationService.deleteDeal(id, req.user.id);
  }

  // ─── Earnings & Analytics ──────────────────────────────────────────────────

  @Get('earnings')
  @ApiOperation({ summary: 'Get earnings overview with monthly breakdown' })
  getEarnings(@Request() req) {
    return this.monetizationService.getEarningsOverview(req.user.id);
  }

  // ─── Rate Calculator ───────────────────────────────────────────────────────

  @Get('rates')
  @ApiOperation({ summary: 'Calculate suggested rates per platform' })
  getRates(@Request() req) {
    return this.monetizationService.calculateRates(req.user.id);
  }

  // ─── Media Kit ─────────────────────────────────────────────────────────────

  @Get('media-kit')
  @ApiOperation({ summary: 'Generate media kit data for brand pitching' })
  getMediaKit(@Request() req) {
    return this.monetizationService.generateMediaKit(req.user.id);
  }
}
