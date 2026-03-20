import { Controller, Get, Post, Body, Request, UseGuards, RawBodyRequest, Req, Headers, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { CreateCheckoutDto } from './dto/subscription.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all plan features and pricing' })
  getPlans() { return this.subscriptionsService.getPlanFeatures(); }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user subscription' })
  getSubscription(@Request() req) { return this.subscriptionsService.getSubscription(req.user.id); }

  @Get('invoices')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get billing invoice history' })
  getInvoices(@Request() req) { return this.subscriptionsService.getInvoices(req.user.id); }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create Stripe checkout session' })
  createCheckout(@Request() req, @Body() dto: CreateCheckoutDto) {
    return this.subscriptionsService.createCheckoutSession(
      req.user.id,
      (dto.plan || 'PRO') as any,
      dto.billingCycle || 'monthly',
    );
  }

  @Post('portal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Open Stripe billing portal' })
  createPortal(@Request() req) { return this.subscriptionsService.createPortalSession(req.user.id); }

  @Post('webhook')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  handleWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
    return this.subscriptionsService.handleWebhook(req.rawBody as any, sig);
  }
}
