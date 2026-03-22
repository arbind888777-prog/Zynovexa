import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export enum AIPlatform {
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  ALL = 'all',
}

export enum AIAudience {
  GEN_Z = 'gen_z',
  MILLENNIALS = 'millennials',
  PROFESSIONALS = 'professionals',
  ENTREPRENEURS = 'entrepreneurs',
  GENERAL = 'general',
}

export enum AITone {
  CASUAL = 'casual',
  PROFESSIONAL = 'professional',
  HINGLISH = 'hinglish',
  HUMOROUS = 'humorous',
  MOTIVATIONAL = 'motivational',
}

export enum AIContentType {
  CAPTION = 'caption',
  SCRIPT = 'script',
  HOOK = 'hook',
  HASHTAGS = 'hashtags',
  VIRAL_REEL = 'viral_reel',
  YOUTUBE_SCRIPT = 'youtube_script',
}

export class NicheGenerateDto {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsEnum(AIContentType)
  type: AIContentType;

  @IsOptional()
  @IsEnum(AIPlatform)
  platform?: AIPlatform;

  @IsOptional()
  @IsEnum(AIAudience)
  audience?: AIAudience;

  @IsOptional()
  @IsEnum(AITone)
  tone?: AITone;

  @IsOptional()
  @IsString()
  niche?: string;
}

export class ScoreContentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  type?: string;
}
