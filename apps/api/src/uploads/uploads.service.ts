import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { resolveUploadCategory } from './upload-category';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly baseUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.baseUrl = this.config.get('API_URL') || `http://localhost:${this.config.get('PORT', 4000)}`;
  }

  /** Save uploaded file metadata to database */
  async saveFile(userId: string, file: Express.Multer.File, folder = 'general', alt?: string) {
    const subfolder = resolveUploadCategory(file.originalname, file.mimetype) || 'documents';

    const url = `${this.baseUrl}/uploads/${subfolder}/${file.filename}`;

    const mediaFile = await this.prisma.mediaFile.create({
      data: {
        userId,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        folder,
        alt,
      },
    });

    this.logger.log(`File uploaded: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB)`);
    return mediaFile;
  }

  /** Save multiple uploaded files */
  async saveFiles(userId: string, files: Express.Multer.File[], folder = 'general') {
    return Promise.all(files.map(file => this.saveFile(userId, file, folder)));
  }

  /** Get user's media library with pagination and filtering */
  async getMediaLibrary(userId: string, query: {
    page?: number; limit?: number; folder?: string; mimeType?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.folder) where.folder = query.folder;
    if (query.mimeType) where.mimeType = { startsWith: query.mimeType };

    const [files, total] = await Promise.all([
      this.prisma.mediaFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.mediaFile.count({ where }),
    ]);

    return {
      files,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /** Get single file by ID */
  async getFile(id: string, userId: string) {
    const file = await this.prisma.mediaFile.findFirst({
      where: { id, userId },
    });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

  /** Delete file from storage and database */
  async deleteFile(id: string, userId: string) {
    const file = await this.getFile(id, userId);

    // Remove physical file
    const uploadDir = this.config.get('UPLOAD_DIR', join(process.cwd(), 'uploads'));
    const subfolder = resolveUploadCategory(file.originalName, file.mimeType) || 'documents';

    const filePath = join(uploadDir, subfolder, file.filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    await this.prisma.mediaFile.delete({ where: { id } });
    this.logger.log(`File deleted: ${file.originalName}`);
    return { message: 'File deleted' };
  }

  /** Get storage usage stats */
  async getStorageStats(userId: string) {
    const files = await this.prisma.mediaFile.findMany({
      where: { userId },
      select: { size: true, mimeType: true },
    });

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const byType = files.reduce((acc: Record<string, { count: number; size: number }>, f) => {
      const type = f.mimeType.split('/')[0];
      if (!acc[type]) acc[type] = { count: 0, size: 0 };
      acc[type].count++;
      acc[type].size += f.size;
      return acc;
    }, {});

    return {
      totalFiles: files.length,
      totalSize,
      totalSizeMB: +(totalSize / (1024 * 1024)).toFixed(2),
      byType,
    };
  }
}
