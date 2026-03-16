import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertStoreDto {
  @ApiProperty({ example: 'Creator Store' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'creator-store' })
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

  @ApiPropertyOptional({ example: 'usd' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  slug: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(320)
  shortDescription?: string;

  @ApiProperty({ example: 2900, description: 'Amount in minor currency units (e.g. cents)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'usd' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiProperty({ example: 'https://private-storage.example.com/assets/file.pdf' })
  @IsUrl()
  assetUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  previewUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiPropertyOptional({ enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT' })
  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class UpdateProductDto extends CreateProductDto {}

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  resourceUrl?: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  position: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;
}

export class UpdateLessonDto extends CreateLessonDto {}

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  slug: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(8000)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(320)
  shortDescription?: string;

  @ApiProperty({ example: 9900, description: 'Amount in minor currency units (e.g. cents)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'usd' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  introVideoUrl?: string;

  @ApiPropertyOptional({ enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT' })
  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  @ApiPropertyOptional({ type: [CreateLessonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  lessons?: CreateLessonDto[];
}

export class UpdateCourseDto extends CreateCourseDto {}

export class CreateCommerceCheckoutDto {
  @ApiProperty({ enum: ['PRODUCT', 'COURSE'] })
  @IsString()
  @IsNotEmpty()
  itemType: 'PRODUCT' | 'COURSE';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  courseId?: string;
}

export class RevenueQueryDto {
  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(7)
  @Max(365)
  days?: number;
}

export class UpdateLessonProgressDto {
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}