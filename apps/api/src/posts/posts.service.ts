import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';
import { Platform, PostStatus } from '@prisma/client';
import { AccountsService } from '../accounts/accounts.service';
import { basename, join } from 'path';
import { readFile, stat } from 'fs/promises';
import { resolveUploadCategory } from '../uploads/upload-category';

import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private prisma: PrismaService,
    private accountsService: AccountsService,
    private config: ConfigService,
    private gamification: GamificationService,
  ) {}

  private isYoutubeVideoPost(post: { mediaType?: string; mediaUrls?: string[] }) {
    return ['VIDEO', 'REEL', 'SHORT'].includes(post.mediaType || '') && Boolean(post.mediaUrls?.length);
  }

  private getYoutubePublishBlocker(post: any) {
    if (!['VIDEO', 'REEL', 'SHORT'].includes(post.mediaType || '')) {
      return 'YouTube text/image posts are not supported for direct publish yet. Use a video post or publish manually on YouTube.';
    }

    if (!post.mediaUrls?.length) {
      return 'Upload a video file before publishing a YouTube video post.';
    }

    return null;
  }

  private getPublishBlockers(post: Pick<CreatePostDto, 'mediaType' | 'mediaUrls'> & { platforms: Platform[] }) {
    const blockers: string[] = [];

    if ((post.mediaType || 'TEXT') !== 'TEXT' && !post.mediaUrls?.length) {
      blockers.push(`Add media before scheduling a ${(post.mediaType || 'MEDIA').toLowerCase()} post.`);
    }

    return blockers;
  }

  private validateScheduledPublish(post: Pick<CreatePostDto, 'mediaType' | 'mediaUrls'> & { platforms: Platform[] }) {
    const blockers = this.getPublishBlockers(post);
    if (blockers.length > 0) {
      throw new BadRequestException(blockers.join(' '));
    }
  }

  private getPublishErrorMessage(error: any) {
    if (Array.isArray(error?.response?.message)) {
      return error.response.message.join(' ');
    }

    return error?.response?.message || error?.message || 'Publish failed';
  }

  private isRecoverablePublishError(error: any, message: string) {
    if (!(error instanceof BadRequestException)) {
      return false;
    }

    const nonRecoverablePatterns = [
      /not supported for direct publish/i,
      /upload a video file/i,
      /video source required/i,
      /unable to fetch media from url/i,
      /file type .* is not allowed/i,
      /select an image or video file/i,
      /did not return an upload url/i,
    ];

    return !nonRecoverablePatterns.some((pattern) => pattern.test(message));
  }

  private getFailureMode(platform: Platform, message: string) {
    if (platform === 'YOUTUBE' && /not supported for direct publish/i.test(message)) {
      return 'youtube-unsupported';
    }

    return platform === 'YOUTUBE' ? 'youtube-live' : 'simulated';
  }

  private buildYoutubeManualResult(post: { title?: string | null; caption?: string | null }) {
    return {
      success: false,
      mode: 'youtube-manual',
      manualRequired: true,
      error: 'YouTube API sirf video upload support karta hai. Text/image post ke liye YouTube Studio mein jaake Community tab se manually post karo. Agar video post karna hai toh video attach karke dubara try karo.',
      publishedAt: new Date().toISOString(),
      manualTitle: post.title || post.caption?.slice(0, 90) || 'YouTube post',
      manualUrl: 'https://studio.youtube.com',
      hint: 'YouTube Studio > Community tab se text post create karo, ya video attach karke app se publish karo.',
    };
  }

  private async buildPostAccountLinks(userId: string, postId: string, platforms: Platform[]) {
    const accounts = await this.prisma.socialAccount.findMany({
      where: { userId, isActive: true, platform: { in: platforms } },
      select: { id: true },
    });

    if (!accounts.length) {
      return;
    }

    await this.prisma.postAccount.createMany({
      data: accounts.map((account) => ({
        postId,
        socialAccountId: account.id,
      })),
      skipDuplicates: true,
    });
  }

  private async loadMediaSource(mediaUrl: string) {
    const mediaFile = await this.prisma.mediaFile.findFirst({ where: { url: mediaUrl } });

    if (/^https?:\/\//i.test(mediaUrl)) {
      const remoteResponse = await fetch(mediaUrl);
      if (!remoteResponse.ok) {
        throw new BadRequestException(`Unable to fetch media from URL: ${remoteResponse.statusText}`);
      }

      const arrayBuffer = await remoteResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return {
        buffer,
        size: buffer.length,
        mimeType: remoteResponse.headers.get('content-type')?.split(';')[0] || mediaFile?.mimeType || 'application/octet-stream',
      };
    }

    const uploadDir = this.config.get('UPLOAD_DIR', join(process.cwd(), 'uploads'));
    const fileName = basename(mediaUrl);

    const folder = resolveUploadCategory(fileName, mediaFile?.mimeType)
      || (mediaUrl.includes('/uploads/videos/') ? 'videos' : null)
      || (mediaUrl.includes('/uploads/images/') ? 'images' : null)
      || (mediaUrl.includes('/uploads/audio/') ? 'audio' : null)
      || 'documents';

    const localPath = join(uploadDir, folder, fileName);
    const [buffer, fileStats] = await Promise.all([
      readFile(localPath),
      stat(localPath),
    ]);

    return {
      buffer,
      size: fileStats.size,
      mimeType: mediaFile?.mimeType || 'application/octet-stream',
    };
  }

  private async uploadYoutubeVideo(post: any, userId: string) {
    const publishBlocker = this.getYoutubePublishBlocker(post);
    if (publishBlocker) {
      throw new BadRequestException(publishBlocker);
    }

    const { account, accessToken } = await this.accountsService.getConnectedAccountWithTokens(userId, 'YOUTUBE');

    if (!account.scopes?.includes('https://www.googleapis.com/auth/youtube.upload')) {
      await this.accountsService.markReconnectRequired(account.id);
      throw new BadRequestException('Reconnect your YouTube account to grant upload permission.');
    }

    const mediaSource = await this.loadMediaSource(post.mediaUrls[0]);

    const metadata = {
      snippet: {
        title: post.title || post.caption.slice(0, 90),
        description: [post.caption, ...(post.hashtags || []).map((tag: string) => tag.startsWith('#') ? tag : `#${tag}`)].join('\n\n'),
        tags: (post.hashtags || []).map((tag: string) => tag.replace(/^#/, '')),
        categoryId: '22',
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
      },
    };

    const startRes = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': String(mediaSource.size),
        'X-Upload-Content-Type': mediaSource.mimeType,
      },
      body: JSON.stringify(metadata),
    });

    if (!startRes.ok) {
      const err = await startRes.text();
      if (startRes.status === 401 || startRes.status === 403) {
        await this.accountsService.markReconnectRequired(account.id);
      }
      throw new BadRequestException(`YouTube upload init failed: ${err}`);
    }

    const uploadUrl = startRes.headers.get('location');
    if (!uploadUrl) {
      throw new BadRequestException('YouTube did not return an upload URL.');
    }

    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Length': String(mediaSource.size),
        'Content-Type': mediaSource.mimeType,
      },
      body: mediaSource.buffer,
    });

    const uploadPayload = await uploadRes.json().catch(async () => ({ raw: await uploadRes.text() }));
    if (!uploadRes.ok) {
      if (uploadRes.status === 401 || uploadRes.status === 403) {
        await this.accountsService.markReconnectRequired(account.id);
      }
      throw new BadRequestException(`YouTube publish failed: ${uploadPayload?.error?.message || uploadPayload?.raw || uploadRes.statusText}`);
    }

    return {
      success: true,
      mode: 'youtube-live',
      platformPostId: uploadPayload.id,
      publishedAt: new Date().toISOString(),
      publishedUrl: `https://www.youtube.com/watch?v=${uploadPayload.id}`,
    };
  }

  private async publishToPlatform(post: any, userId: string, platform: Platform) {
    if (platform === 'YOUTUBE') {
      if (!this.isYoutubeVideoPost(post)) {
        throw new BadRequestException('YouTube text/image posts are not supported for direct publish yet. Use a video post or publish manually on YouTube.');
      }

      return this.uploadYoutubeVideo(post, userId);
    }

    return {
      success: true,
      mode: 'simulated',
      platformPostId: `sim_${platform.toLowerCase()}_${Date.now()}`,
      publishedAt: new Date().toISOString(),
      publishedUrl: `https://${platform.toLowerCase()}.com/p/sim_${Date.now()}`,
    };
  }

  async create(userId: string, dto: CreatePostDto) {
    if (dto.scheduledAt) {
      this.validateScheduledPublish({
        mediaType: dto.mediaType || 'TEXT',
        mediaUrls: dto.mediaUrls || [],
        platforms: dto.platforms,
      });
    }

    // Calculate a simple viral score based on platforms count and hashtags
    const viralScore = Math.min(100, (dto.platforms.length * 15) + ((dto.hashtags?.length || 0) * 3));

    const post = await this.prisma.post.create({
      data: {
        userId,
        title: dto.title,
        caption: dto.caption,
        mediaUrls: dto.mediaUrls || [],
        mediaType: dto.mediaType || 'TEXT',
        platforms: dto.platforms,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        hashtags: dto.hashtags || [],
        location: dto.location,
        attachedProductId: dto.attachedProductId || null,
        viralScore,
        status: dto.scheduledAt ? 'SCHEDULED' : 'DRAFT',
      },
    });

    await this.buildPostAccountLinks(userId, post.id, dto.platforms);

    // Record action for gamification without blocking the response
    this.gamification.recordAction(userId, 'post_created').catch(err => 
      this.logger.error(`Failed to record gamification action: ${err.message}`)
    );

    return post;
  }

  async findAll(userId: string, query: PostQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.status) where.status = query.status;
    if (query.platform) where.platforms = { has: query.platform };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        // Select only fields needed for list view — avoids fetching large
        // publishResults JSON / full payload unnecessarily
        select: {
          id: true,
          title: true,
          caption: true,
          status: true,
          platforms: true,
          mediaType: true,
          mediaUrls: true,
          hashtags: true,
          scheduledAt: true,
          publishedAt: true,
          viralScore: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, userId: string) {
    const post = await this.prisma.post.findFirst({ where: { id, userId } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, userId: string, dto: UpdatePostDto) {
    const existing = await this.findOne(id, userId);

    const nextPlatforms = dto.platforms || existing.platforms;
    const nextMediaType = dto.mediaType || existing.mediaType;
    const nextMediaUrls = dto.mediaUrls || existing.mediaUrls;
    const nextScheduledAt = dto.clearSchedule
      ? null
      : dto.scheduledAt === undefined
        ? existing.scheduledAt
        : new Date(dto.scheduledAt);

    if (nextScheduledAt) {
      this.validateScheduledPublish({
        mediaType: nextMediaType,
        mediaUrls: nextMediaUrls,
        platforms: nextPlatforms,
      });
    }

    const nextStatus = nextScheduledAt
      ? PostStatus.SCHEDULED
      : existing.status === PostStatus.PUBLISHED
        ? PostStatus.PUBLISHED
        : PostStatus.DRAFT;

    const { clearSchedule, ...updateData } = dto;

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        scheduledAt: clearSchedule
          ? null
          : dto.scheduledAt
            ? new Date(dto.scheduledAt)
            : undefined,
        status: nextStatus,
        publishedAt: nextStatus === PostStatus.PUBLISHED ? existing.publishedAt : null,
        publishResults: nextStatus === PostStatus.PUBLISHED ? existing.publishResults : null,
      },
    });

    return updatedPost;
  }

  async remove(id: string, userId: string) {
    const post = await this.findOne(id, userId);

    await this.prisma.post.delete({ where: { id } });
    return { message: 'Post deleted' };
  }

  async publish(
    id: string,
    userId: string,
    options?: { suppressRecoverableError?: boolean },
  ) {
    const post = await this.findOne(id, userId);
    const publishResults: Record<string, any> = {};

    for (const platform of post.platforms) {
      if (platform === 'YOUTUBE' && !this.isYoutubeVideoPost(post)) {
        publishResults[platform] = this.buildYoutubeManualResult(post);
        continue;
      }

      try {
        publishResults[platform] = await this.publishToPlatform(post, userId, platform);
      } catch (error: any) {
        const message = this.getPublishErrorMessage(error);
        publishResults[platform] = {
          success: false,
          mode: this.getFailureMode(platform, message),
          error: message,
          recoverable: this.isRecoverablePublishError(error, message),
          publishedAt: new Date().toISOString(),
        };
      }
    }

    const successfulPlatforms = Object.entries(publishResults).filter(([, result]) => result?.success);
    const manualRequiredPlatforms = Object.values(publishResults).filter((result: any) => result?.manualRequired);
    const onlyManualRequired =
      successfulPlatforms.length === 0
      && manualRequiredPlatforms.length > 0
      && manualRequiredPlatforms.length === Object.values(publishResults).length;
    const onlyRecoverableFailures =
      successfulPlatforms.length === 0
      && Object.values(publishResults).length > 0
      && Object.values(publishResults).every((result: any) => result?.recoverable);

    const nextStatus = successfulPlatforms.length > 0
      ? PostStatus.PUBLISHED
      : onlyManualRequired
        ? PostStatus.DRAFT
      : onlyRecoverableFailures
        ? post.status
        : PostStatus.FAILED;

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        status: nextStatus,
        publishedAt: successfulPlatforms.length > 0 ? new Date() : null,
        publishResults,
        scheduledAt: onlyManualRequired ? null : undefined,
      },
    });

    if (successfulPlatforms.length > 0) {
      this.gamification.recordAction(userId, 'post_published').catch(err => 
        this.logger.error(`Failed to record publish action: ${err.message}`)
      );
    }

    if (onlyManualRequired && post.status === PostStatus.SCHEDULED) {
      await this.prisma.notification.create({
        data: {
          userId,
          title: 'YouTube Manual Publish Required',
          message: `YouTube API sirf video upload support karta hai. "${post.title || post.caption.slice(0, 40)}..." ko YouTube Studio > Community tab se manually post karo, ya video attach karke dubara schedule karo. Link: https://studio.youtube.com`,
          type: 'INFO',
        },
      });
    }

    const accountLinks = await this.prisma.postAccount.findMany({
      where: { postId: id },
      include: { socialAccount: true },
    });

    for (const link of accountLinks) {
      const result = publishResults[link.socialAccount.platform];
      await this.prisma.postAccount.update({
        where: { id: link.id },
        data: {
          status: result?.success
            ? PostStatus.PUBLISHED
            : result?.manualRequired
              ? PostStatus.DRAFT
            : onlyRecoverableFailures
              ? link.status
              : PostStatus.FAILED,
          publishedAt: result?.success ? new Date() : null,
          publishedUrl: result?.publishedUrl,
          error: result?.success ? null : result?.error || 'Publish failed',
        },
      });
    }

    if (onlyRecoverableFailures && !options?.suppressRecoverableError) {
      const firstError = Object.values(publishResults).find((result: any) => result?.error) as { error?: string } | undefined;
      throw new BadRequestException(firstError?.error || 'Post is not ready to publish yet.');
    }

    return updatedPost;
  }

  async getScheduled(userId: string) {
    return this.prisma.post.findMany({
      where: { userId, status: 'SCHEDULED', scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async getStats(userId: string) {
    const [total, published, scheduled, drafts, avgViral] = await Promise.all([
      this.prisma.post.count({ where: { userId } }),
      this.prisma.post.count({ where: { userId, status: 'PUBLISHED' } }),
      this.prisma.post.count({ where: { userId, status: 'SCHEDULED' } }),
      this.prisma.post.count({ where: { userId, status: 'DRAFT' } }),
      this.prisma.post.aggregate({ where: { userId }, _avg: { viralScore: true } }),
    ]);
    return { total, published, scheduled, drafts, avgViralScore: avgViral._avg.viralScore || 0 };
  }
}
