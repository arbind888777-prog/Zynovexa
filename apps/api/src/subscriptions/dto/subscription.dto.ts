import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCheckoutDto {
  @ApiPropertyOptional({ enum: ['PRO', 'BUSINESS', 'CUSTOM'], default: 'PRO' })
  @IsOptional()
  @IsString()
  plan?: 'PRO' | 'BUSINESS' | 'CUSTOM';

  @ApiPropertyOptional({ enum: ['monthly', 'yearly'], default: 'monthly' })
  @IsOptional()
  @IsString()
  billingCycle?: 'monthly' | 'yearly';

  @ApiPropertyOptional({ description: 'Custom plan - number of posts per month' })
  @IsOptional()
  @IsNumber()
  customPosts?: number;

  @ApiPropertyOptional({ description: 'Custom plan - number of AI credits' })
  @IsOptional()
  @IsNumber()
  customAiCredits?: number;
}

export class StripeWebhookDto {
  type: string;
  data: { object: any };
}
