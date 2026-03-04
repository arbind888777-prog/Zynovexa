import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  name?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  website?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  niche?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  timezone?: string;
}
