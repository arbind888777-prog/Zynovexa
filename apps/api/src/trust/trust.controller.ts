import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TrustService } from './trust.service';

@Controller('trust')
export class TrustController {
  constructor(private trustService: TrustService) {}

  @Get('testimonials')
  getTestimonials(@Query('featured') featured?: string) {
    return this.trustService.getApprovedTestimonials(featured === '1');
  }

  @Get('case-studies')
  getCaseStudies() {
    return this.trustService.getPublishedCaseStudies();
  }

  @Get('roadmap')
  getRoadmap() {
    return this.trustService.getRoadmap();
  }

  @Post('roadmap/:id/vote')
  voteRoadmap(@Param('id') id: string) {
    return this.trustService.voteOnRoadmapItem(id);
  }
}
