import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly client: SupabaseClient | null;
  private readonly projectUrl: string | null;
  private readonly storageBucket: string;

  constructor(private readonly config: ConfigService) {
    this.projectUrl = this.config.get<string>('SUPABASE_URL') || null;
    const serviceRoleKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = this.config.get<string>('SUPABASE_ANON_KEY');
    this.storageBucket = this.config.get<string>('SUPABASE_STORAGE_BUCKET') || 'media';

    if (this.projectUrl && (serviceRoleKey || anonKey)) {
      this.client = createClient(this.projectUrl, serviceRoleKey || anonKey || '', {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
      this.logger.log('Supabase integration enabled');
    } else {
      this.client = null;
      this.logger.log('Supabase integration disabled; falling back to local auth/storage');
    }
  }

  isConfigured(): boolean {
    return Boolean(this.client);
  }

  async verifyAccessToken(accessToken: string): Promise<User | null> {
    if (!this.client) return null;

    const { data, error } = await this.client.auth.getUser(accessToken);
    if (error) {
      this.logger.warn(`Supabase token verification failed: ${error.message}`);
      return null;
    }

    return data.user ?? null;
  }

  async uploadFile(objectPath: string, buffer: Buffer, contentType: string) {
    if (!this.client) {
      throw new Error('Supabase storage is not configured');
    }

    const { error } = await this.client.storage
      .from(this.storageBucket)
      .upload(objectPath, buffer, {
        contentType,
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      throw new Error(`Supabase storage upload failed: ${error.message}`);
    }

    const { data } = this.client.storage.from(this.storageBucket).getPublicUrl(objectPath);
    return { objectPath, publicUrl: data.publicUrl };
  }

  async removeFile(objectPath: string): Promise<void> {
    if (!this.client) return;

    const { error } = await this.client.storage.from(this.storageBucket).remove([objectPath]);
    if (error) {
      this.logger.warn(`Supabase storage delete failed for ${objectPath}: ${error.message}`);
    }
  }

  getObjectPathFromPublicUrl(fileUrl: string): string | null {
    if (!this.projectUrl) return null;

    const publicPrefix = `${this.projectUrl}/storage/v1/object/public/${this.storageBucket}/`;
    if (!fileUrl.startsWith(publicPrefix)) {
      return null;
    }

    return decodeURIComponent(fileUrl.slice(publicPrefix.length));
  }
}