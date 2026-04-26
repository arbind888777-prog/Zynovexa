import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateCaptionDto {
  @ApiProperty({ example: 'A photo of me hiking in the mountains' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'lifestyle' })
  @IsOptional()
  @IsString()
  niche?: string;

  @ApiPropertyOptional({ example: ['instagram', 'tiktok'] })
  @IsOptional()
  @IsArray()
  platforms?: string[];

  @ApiPropertyOptional({ example: 'casual', enum: ['casual', 'professional', 'funny', 'inspirational'] })
  @IsOptional()
  @IsString()
  tone?: string;

  @ApiPropertyOptional({ example: 'Bold, witty, creator-first voice with short punchy lines' })
  @IsOptional()
  @IsString()
  brandVoice?: string;

  @ApiPropertyOptional({ example: 'English' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  includeHashtags?: boolean;
  
  @ApiPropertyOptional()
  @IsOptional()
  includeEmojis?: boolean;
}

export class GenerateScriptDto {
  @ApiProperty({ example: 'Top 5 productivity hacks for creators' })
  @IsString()
  topic: string;

  @ApiPropertyOptional({ enum: ['youtube', 'tiktok', 'instagram', 'shorts'] })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({ example: 60, description: 'Video duration in seconds' })
  @IsOptional()
  durationSeconds?: number;

  @ApiPropertyOptional()
  @IsOptional()
  niche?: string;

  @ApiPropertyOptional({ example: 'Energetic & Hype' })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiPropertyOptional({ example: '18-25 year old fitness enthusiasts' })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiPropertyOptional({ example: ['Point 1', 'Point 2'] })
  @IsOptional()
  @IsArray()
  keyPoints?: string[];

  @ApiPropertyOptional({ example: 'Bold, witty, creator-first voice with short punchy lines' })
  @IsOptional()
  @IsString()
  brandVoice?: string;

  @ApiPropertyOptional({ example: 'English' })
  @IsOptional()
  @IsString()
  language?: string;
}

export class GenerateHashtagsDto {
  @ApiProperty({ example: 'Morning workout routine for beginners' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'fitness' })
  @IsOptional()
  @IsString()
  niche?: string;

  @ApiPropertyOptional()
  @IsOptional()
  count?: number;

  @ApiPropertyOptional({ example: ['instagram', 'tiktok'] })
  @IsOptional()
  @IsArray()
  platforms?: string[];

  @ApiPropertyOptional({ example: 'English' })
  @IsOptional()
  @IsString()
  language?: string;
}

export class GenerateImageDto {
  @ApiProperty({ example: 'A stunning sunset over mountains, professional photography style' })
  @IsString()
  prompt: string;
  
  @ApiPropertyOptional({ enum: ['1:1', '4:5', '16:9', '9:16', '4:3', '3:4', '21:9'], example: '1:1' })
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiPropertyOptional({ enum: ['1024x1024', '1792x1024', '1024x1792'] })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ enum: ['natural', 'vivid'] })
  @IsOptional()
  @IsString()
  style?: string;
}

export class GenerateVideoDto {
  @ApiProperty({ example: 'A cinematic drone shot of a coastal city at sunset' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({ enum: ['16:9', '9:16', '1:1'], example: '16:9' })
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiPropertyOptional({ example: 5, description: 'Video duration in seconds (5-10)' })
  @IsOptional()
  durationSeconds?: number;
}

export class CheckVideoDto {
  @ApiProperty({ example: 'operations/generate-video-xxxx' })
  @IsString()
  operationName: string;
}

export class ChatMessageDto {
  @ApiProperty({ example: 'How do I grow my Instagram following?' })
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  history?: { role: string; content: string }[];

  @ApiPropertyOptional({ example: 'English' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: 'Friendly mentor tone with clear action steps' })
  @IsOptional()
  @IsString()
  brandVoice?: string;
}

export class BestTimeDto {
  @ApiPropertyOptional({ example: 'instagram' })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({ example: 'lifestyle' })
  @IsOptional()
  @IsString()
  niche?: string;

  @ApiPropertyOptional({ example: 'America/New_York' })
  @IsOptional()
  @IsString()
  timezone?: string;
}
