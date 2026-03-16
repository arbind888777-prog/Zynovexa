import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { resolveUploadCategory } from './upload-category';

const DEFAULT_MAX_FILE_SIZE = 256 * 1024 * 1024;

export function multerConfig(config: ConfigService) {
  const uploadDir = config.get('UPLOAD_DIR', join(process.cwd(), 'uploads'));
  const maxFileSize = Number(config.get('UPLOAD_MAX_FILE_SIZE', DEFAULT_MAX_FILE_SIZE));

  // Ensure upload directories exist
  const dirs = ['images', 'videos', 'audio', 'documents'].map(d => join(uploadDir, d));
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  return {
    storage: diskStorage({
      destination: (_req: any, file: Express.Multer.File, cb: Function) => {
        const subfolder = resolveUploadCategory(file.originalname, file.mimetype);
        if (!subfolder) {
          cb(new BadRequestException(`File type ${file.mimetype || extname(file.originalname)} is not allowed`), null);
          return;
        }

        cb(null, join(uploadDir, subfolder));
      },
      filename: (_req: any, file: Express.Multer.File, cb: Function) => {
        const uniqueName = `${Date.now()}-${randomUUID()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    limits: { fileSize: maxFileSize },
    fileFilter: (_req: any, file: Express.Multer.File, cb: Function) => {
      if (!resolveUploadCategory(file.originalname, file.mimetype)) {
        return cb(new BadRequestException(`File type ${file.mimetype || extname(file.originalname)} is not allowed`), false);
      }
      cb(null, true);
    },
  };
}
