import {
  IsString, IsOptional, IsArray, IsEnum, IsDateString, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus, Platform, MediaType } from '@prisma/client';

export class CreatePostDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200)
  title?: string;

  @ApiProperty() @IsString()
  caption: string;

  @ApiPropertyOptional() @IsOptional() @IsArray()
  mediaUrls?: string[];

  @ApiPropertyOptional({ enum: MediaType }) @IsOptional() @IsEnum(MediaType)
  mediaType?: MediaType;

  @ApiProperty({ type: [String], enum: Platform })
  @IsArray()
  @IsEnum(Platform, { each: true })
  platforms: Platform[];

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional() @IsOptional() @IsArray()
  hashtags?: string[];

  @ApiPropertyOptional() @IsOptional() @IsString()
  location?: string;
}

export class UpdatePostDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  caption?: string;

  @ApiPropertyOptional() @IsOptional() @IsArray()
  mediaUrls?: string[];

  @ApiPropertyOptional({ enum: MediaType }) @IsOptional() @IsEnum(MediaType)
  mediaType?: MediaType;

  @ApiPropertyOptional({ type: [String], enum: Platform })
  @IsOptional() @IsArray() @IsEnum(Platform, { each: true })
  platforms?: Platform[];

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional() @IsOptional() @IsArray()
  hashtags?: string[];
}

export class PostQueryDto {
  @IsOptional() page?: number = 1;
  @IsOptional() limit?: number = 20;
  @IsOptional() status?: PostStatus;
  @IsOptional() platform?: Platform;
}
