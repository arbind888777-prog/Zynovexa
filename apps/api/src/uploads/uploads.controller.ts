import {
  BadRequestException, Controller, Get, Post, Delete, Param, Query, Request,
  UseGuards, UseInterceptors, UploadedFile, UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('single')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string' },
        alt: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
    @Query('alt') alt?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Select an image or video file to upload.');
    }

    return this.uploadsService.saveFile(req.user.id, file, folder, alt);
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files (max 10)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        folder: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    if (!files?.length) {
      throw new BadRequestException('Select at least one file to upload.');
    }

    return this.uploadsService.saveFiles(req.user.id, files, folder);
  }

  @Get('library')
  @ApiOperation({ summary: 'Get media library (paginated)' })
  async getLibrary(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('folder') folder?: string,
    @Query('type') mimeType?: string,
  ) {
    return this.uploadsService.getMediaLibrary(req.user.id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      folder,
      mimeType,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get storage usage stats' })
  async getStats(@Request() req) {
    return this.uploadsService.getStorageStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single file details' })
  async getFile(@Request() req, @Param('id') id: string) {
    return this.uploadsService.getFile(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  async deleteFile(@Request() req, @Param('id') id: string) {
    return this.uploadsService.deleteFile(id, req.user.id);
  }
}
