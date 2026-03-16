import { IsString, IsOptional, IsEnum, IsArray, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Platform } from '@prisma/client';

export class ConnectAccountDto {
  @ApiProperty({ enum: Platform, description: 'Social platform to connect' })
  @IsEnum(Platform)
  platform: Platform;

  @ApiPropertyOptional({ description: 'OAuth access token (encrypted before storage)' })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional({ description: 'OAuth refresh token (encrypted before storage)' })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiProperty({ example: '@myhandle' })
  @IsString()
  handle: string;

  @ApiProperty({ example: 'My Channel Name' })
  @IsString()
  displayName: string;

  @ApiPropertyOptional({ example: 'https://yt3.ggpht.com/...' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 42000 })
  @IsOptional()
  @IsNumber()
  followersCount?: number;

  @ApiPropertyOptional({ description: 'Platform user/channel ID from OAuth response' })
  @IsOptional()
  @IsString()
  platformUserId?: string;

  @ApiPropertyOptional({ description: 'OAuth scopes granted', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];

  @ApiPropertyOptional({ description: 'ISO datetime when access token expires' })
  @IsOptional()
  @IsDateString()
  tokenExpiresAt?: string;
}

export class UpdateAccountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  followersCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  reconnectRequired?: boolean;
}
