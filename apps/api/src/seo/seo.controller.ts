import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SeoService } from './seo.service';
import { CreateSeoAnalysisDto, SeoQueryDto } from './dto/seo.dto';

@ApiTags('SEO')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('seo')
export class SeoController {
  constructor(private seoService: SeoService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze a URL and save results' })
  analyze(@Request() req, @Body() dto: CreateSeoAnalysisDto) {
    return this.seoService.analyzeAndSave(req.user.id, dto);
  }

  @Post('quick-analyze')
  @ApiOperation({ summary: 'Quick analyze without saving (no auth required for demo)' })
  quickAnalyze(@Body() dto: CreateSeoAnalysisDto) {
    return this.seoService.quickAnalyze(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all saved SEO analyses (paginated)' })
  findAll(@Request() req, @Query() query: SeoQueryDto) {
    return this.seoService.getAnalyses(req.user.id, query);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get SEO score overview and distribution' })
  getOverview(@Request() req) {
    return this.seoService.getScoreOverview(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single SEO analysis' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.seoService.getAnalysis(id, req.user.id);
  }

  @Put(':id/re-analyze')
  @ApiOperation({ summary: 'Re-run analysis on existing URL' })
  reAnalyze(@Request() req, @Param('id') id: string) {
    return this.seoService.reAnalyze(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an SEO analysis' })
  remove(@Request() req, @Param('id') id: string) {
    return this.seoService.deleteAnalysis(id, req.user.id);
  }
}
