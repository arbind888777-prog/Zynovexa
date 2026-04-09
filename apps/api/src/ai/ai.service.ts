import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';
import {
  GenerateCaptionDto, GenerateScriptDto, GenerateHashtagsDto,
  GenerateImageDto, GenerateVideoDto, ChatMessageDto, BestTimeDto,
} from './dto/ai.dto';

type GoogleImagePart = {
  inlineData?: { data?: string; mimeType?: string };
  inline_data?: { data?: string; mime_type?: string };
};

// Plan limits for AI requests per month
const PLAN_LIMITS = {
  FREE: 20,
  STARTER: 100,
  PRO: 500,
  GROWTH: Infinity,
  BUSINESS: Infinity,
};

type AiJson = Record<string, any>;
type TextModelResponse = { text: string; tokensUsed: number };
type ChatOptions = { includeLongTermMemory: boolean };

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;
  private geminiApiKey = '';
  private nanoBananaApiKey = '';
  private veo3ApiKey = '';
  private aiProvider: 'openai' | 'gemini' | 'demo' = 'demo';
  private imageProvider: 'google' | 'demo' = 'demo';
  private videoProvider: 'veo3' | 'demo' = 'demo';
  private isDemoMode: boolean;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const openAiKey = this.config.get('OPENAI_API_KEY') || '';
    const geminiKey = this.config.get('GEMINI_API_KEY') || '';
    const nanoBananaKey = this.config.get('NANO_BANANA_API_KEY') || this.config.get('IMAGEN_API_KEY') || '';
    const veo3Key = this.config.get('VEO3_API_KEY') || '';
    const hasOpenAi = !!openAiKey && !openAiKey.includes('your-openai') && openAiKey !== 'sk-your-openai-key-here';
    const hasGemini = !!geminiKey && !geminiKey.includes('your-gemini');
    const hasNanoBanana = !!nanoBananaKey && !nanoBananaKey.includes('your-nano') && !nanoBananaKey.includes('your-imagen');
    const hasVeo3 = !!veo3Key && !veo3Key.includes('your-veo3');

    if (hasGemini) {
      this.geminiApiKey = geminiKey;
      this.aiProvider = 'gemini';
    }

    if (hasOpenAi) {
      this.openai = new OpenAI({ apiKey: openAiKey });
      if (this.aiProvider === 'demo') {
        this.aiProvider = 'openai';
      }
    }

    // Image generation is Google-only: Nano Banana key first, then Gemini key.
    if (hasNanoBanana) {
      this.nanoBananaApiKey = nanoBananaKey;
      this.imageProvider = 'google';
    } else if (hasGemini) {
      this.nanoBananaApiKey = geminiKey;
      this.imageProvider = 'google';
    }

    // Video provider
    if (hasVeo3 || hasGemini) {
      this.veo3ApiKey = veo3Key;
      this.videoProvider = 'veo3';
    }

    this.isDemoMode = this.aiProvider === 'demo' && this.imageProvider === 'demo';
  }

  // ─── Caption Generator ────────────────────────────────────────────────────

  async generateCaption(userId: string, dto: GenerateCaptionDto) {
    await this.checkUsageLimit(userId);

    const platformHint = dto.platforms?.join(', ') || 'social media';
    const tone = dto.tone || 'engaging';
    const language = dto.language || 'English';
    const emojis = dto.includeEmojis !== false ? 'Include relevant emojis.' : '';
    const hashtags = dto.includeHashtags !== false ? 'Add 5-10 trending hashtags at the end.' : '';
    const platformRules = this.getPlatformRules(dto.platforms || []);
    const brandVoice = this.buildBrandVoiceInstruction(dto.brandVoice);

    const prompt = `You are an expert social media content writer for creators.

Write ${dto.platforms?.length || 3} variations of an engaging ${tone} caption for a ${platformHint} post.
Niche: ${dto.niche || 'general'}
Content description: ${dto.description}
Write in: ${language}
${platformRules}
${brandVoice}
${emojis}
${hashtags}

Return as JSON: { "captions": ["caption1", "caption2", "caption3"], "hashtags": ["#tag1", ...] }`;

    const response = await this.callTextModel(userId, prompt, 'CAPTION', { jsonMode: true, maxTokens: 1500, temperature: 0.8 });
    const parsed = this.safeJsonParse(response.text, { captions: [response.text], hashtags: [] });
    return { ...parsed, qualityScore: this.scoreCaptionOutput(parsed) };
  }

  // ─── Video Script Writer ──────────────────────────────────────────────────

  async generateScript(userId: string, dto: GenerateScriptDto) {
    await this.checkUsageLimit(userId);

    const duration = dto.durationSeconds || 60;
    const platform = dto.platform || 'youtube';
    const style = dto.style || 'Energetic & Hype';
    const language = dto.language || 'English';
    const audience = dto.targetAudience || 'general audience';
    const keyPointsText = dto.keyPoints?.length ? `Key points to cover:\n${dto.keyPoints.map((p, i) => `${i+1}. ${p}`).join('\n')}` : '';
    const platformRules = this.getPlatformRules(platform ? [platform] : []);
    const brandVoice = this.buildBrandVoiceInstruction(dto.brandVoice);

    const prompt = `You are a professional content creator and scriptwriter.

Write a ${duration}-second video script for ${platform} about: "${dto.topic}"
Style: ${style}
Target Audience: ${audience}
Niche: ${dto.niche || 'general'}
  Language: ${language}
  ${platformRules}
  ${brandVoice}
${keyPointsText}

Instructions:
- Hook must grab attention in first 3 seconds
- For short-form (TikTok/Shorts/Reels < 90s): Keep it punchy, fast-paced
- For YouTube (> 90s): Add detailed sections with timestamps
- Include visual notes for each section
- CTA should be platform-appropriate

Return as JSON:
{
  "hook": "opening line to grab attention in first 3 sec",
  "sections": [{ "title": "section name", "script": "spoken text", "timeCode": "0:05-0:20", "visualNote": "what to show on screen" }],
  "cta": "call to action text",
  "estimatedDuration": "${duration} seconds",
  "bRoll": ["visual suggestion 1", "visual suggestion 2"]
}`;

    const response = await this.callTextModel(userId, prompt, 'VIDEO_SCRIPT', { jsonMode: true, maxTokens: 1500, temperature: 0.8 });
    const parsed = this.safeJsonParse(response.text, { script: response.text });
    return { ...parsed, qualityScore: this.scoreScriptOutput(parsed) };
  }

  // ─── Hashtag Generator ────────────────────────────────────────────────────

  async generateHashtags(userId: string, dto: GenerateHashtagsDto) {
    await this.checkUsageLimit(userId);

    const count = dto.count || 30;
    const language = dto.language || 'English';
    const platformRules = this.getPlatformRules(dto.platforms || []);
    const prompt = `Generate ${count} relevant hashtags for this social media post.
Content: ${dto.content}
Niche: ${dto.niche || 'general'}
Language: ${language}
${platformRules}

Mix: trending (40%), niche-specific (40%), broad (20%)
Return as JSON: { "hashtags": ["#tag1", "#tag2", ...], "categories": { "trending": [...], "niche": [...], "broad": [...] } }`;

    const response = await this.callTextModel(userId, prompt, 'HASHTAGS', { jsonMode: true, maxTokens: 1200, temperature: 0.7 });
    const parsed = this.safeJsonParse(response.text, { hashtags: [] });
    return { ...parsed, qualityScore: this.scoreHashtagOutput(parsed, count) };
  }

  // ─── AI Image Generation ──────────────────────────────────────────────────

  async generateImage(userId: string, dto: GenerateImageDto) {
    await this.checkUsageLimit(userId);
    if (this.imageProvider !== 'google' || !this.nanoBananaApiKey) {
      throw new BadRequestException('AI image generation ke liye NANO_BANANA_API_KEY ya GEMINI_API_KEY required hai.');
    }

    return this.generateImageWithNanoBanana(userId, dto);
  }

  // ─── AI Chatbot ───────────────────────────────────────────────────────────

  async chat(userId: string, dto: ChatMessageDto) {
    await this.checkUsageLimit(userId);
    if (this.isDemoMode) {
      return { reply: '⚠️ AI provider configure nahi hai. .env mein OPENAI_API_KEY ya GEMINI_API_KEY add karo.', tokensUsed: 0 };
    }
    const prompt = await this.buildChatPrompt(userId, dto, { includeLongTermMemory: true });
    const response = await this.callTextModel(userId, prompt, 'CHATBOT', { maxTokens: 700, temperature: 0.7 });

    return { reply: response.text, tokensUsed: response.tokensUsed };
  }

  async publicChat(dto: ChatMessageDto) {
    if (this.isDemoMode) {
      return { reply: '⚠️ AI provider configure nahi hai. .env mein OPENAI_API_KEY ya GEMINI_API_KEY add karo.', tokensUsed: 0 };
    }

    const prompt = await this.buildChatPrompt(null, dto, { includeLongTermMemory: false });
    const response = await this.callTextModel(null, prompt, 'CHATBOT', { maxTokens: 500, temperature: 0.7 });

    return { reply: response.text, tokensUsed: response.tokensUsed, mode: 'guest' };
  }

  // ─── Best Time to Post ────────────────────────────────────────────────────

  async getBestTimes(userId: string, dto: BestTimeDto) {
    await this.checkUsageLimit(userId);

    // Use analytics data + AI to suggest best times
    const analytics = await this.prisma.analytics.findMany({
      where: { userId },
      orderBy: { metricValue: 'desc' },
      take: 50,
    });

    const prompt = `Analyze social media posting patterns and suggest optimal posting times.
Platform: ${dto.platform || 'all platforms'}
Niche: ${dto.niche || 'general'}
Creator timezone: ${dto.timezone || 'UTC'}
Historical engagements data points: ${analytics.length}

Return as JSON:
{
  "bestTimes": [
    { "day": "Monday", "times": ["9:00 AM", "7:00 PM"], "expectedReach": "high" },
    ...
  ],
  "insights": "brief explanation",
  "topDays": ["Monday", "Wednesday", "Friday"]
}`;

    const response = await this.callTextModel(userId, prompt, 'BEST_TIME', { jsonMode: true, maxTokens: 1200, temperature: 0.6 });
    return this.safeJsonParse(response.text, { bestTimes: [], insights: response.text });
  }

  // ─── Usage Stats ──────────────────────────────────────────────────────────

  async getUsageStats(userId: string) {
    if (this.config.get('NODE_ENV') !== 'production') {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const used = await this.prisma.aiRequest.count({
        where: { userId, createdAt: { gte: startOfMonth } },
      });

      return { used, limit: null, plan: 'DEV' };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    const plan = user?.subscription?.plan || 'FREE';
    const limit = PLAN_LIMITS[plan];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const used = await this.prisma.aiRequest.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    });

    return { used, limit: limit === Infinity ? null : limit, plan };
  }

  async getChatMemory(userId: string) {
    const rows = await this.prisma.aiRequest.findMany({
      where: { userId, requestType: 'CHATBOT' },
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { prompt: true, result: true, tokensUsed: true, createdAt: true },
    });

    return {
      total: rows.length,
      messages: rows.reverse().map((r) => ({
        user: r.prompt,
        assistant: r.result,
        tokensUsed: r.tokensUsed,
        createdAt: r.createdAt,
      })),
    };
  }

  async clearChatMemory(userId: string) {
    const result = await this.prisma.aiRequest.deleteMany({
      where: { userId, requestType: 'CHATBOT' },
    });

    return { deleted: result.count };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private async callTextModel(
    userId: string | null,
    prompt: string,
    type: any,
    options?: { jsonMode?: boolean; maxTokens?: number; temperature?: number },
  ): Promise<TextModelResponse> {
    if (this.isDemoMode) {
      throw new BadRequestException('AI provider configure nahi hai. .env file mein OPENAI_API_KEY ya GEMINI_API_KEY add karo.');
    }

    if (this.aiProvider === 'gemini') {
      return this.callGemini(userId, prompt, type, options);
    }

    const primaryModel = this.config.get('OPENAI_MODEL') || 'gpt-4o';
    const fallbackModel = this.config.get('OPENAI_FALLBACK_MODEL') || 'gpt-4o-mini';
    let lastError: any;

    for (let attempt = 0; attempt < 2; attempt++) {
      const model = attempt === 0 ? primaryModel : fallbackModel;
      try {
        const completion = await this.openai.chat.completions.create({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options?.maxTokens || 1500,
          temperature: options?.temperature ?? 0.8,
          ...(options?.jsonMode ? { response_format: { type: 'json_object' as const } } : {}),
        });

        const result = completion.choices[0]?.message?.content || '';
        await this.logRequest(userId, prompt, result, completion.usage?.total_tokens || 0, type);
        return { text: result, tokensUsed: completion.usage?.total_tokens || 0 };
      } catch (err: any) {
        lastError = err;
      }
    }

    throw new BadRequestException(lastError?.message || 'AI request failed. Please try again.');
  }

  private async callGemini(
    userId: string | null,
    prompt: string,
    type: any,
    options?: { jsonMode?: boolean; maxTokens?: number; temperature?: number },
  ): Promise<TextModelResponse> {
    const model = this.config.get('GEMINI_MODEL') || 'gemini-2.5-flash';
    const finalPrompt = options?.jsonMode
      ? `${prompt}\n\nReturn valid JSON only. Do not wrap it in markdown code fences.`
      : prompt;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }],
        generationConfig: {
          temperature: options?.temperature ?? 0.8,
          maxOutputTokens: options?.maxTokens || 1500,
          responseMimeType: options?.jsonMode ? 'application/json' : 'text/plain',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(`Gemini request failed: ${errorText}`);
    }

    const data = await response.json() as any;
    const text = (data?.candidates || [])
      .flatMap((candidate: any) => candidate?.content?.parts || [])
      .map((part: any) => part?.text || '')
      .join('')
      .trim();

    const tokensUsed = data?.usageMetadata?.totalTokenCount || 0;
    await this.logRequest(userId, prompt, text, tokensUsed, type);
    return { text, tokensUsed };
  }

  // ─── Google Nano Banana Image Generation ──────────────────────────────────

  private async generateImageWithNanoBanana(userId: string, dto: GenerateImageDto) {
    const aspectRatio = this.mapImageSizeToAspectRatio(dto.size);
    const preferredModel = this.config.get('NANO_BANANA_MODEL') || 'gemini-3.1-flash-image-preview';
    const models = Array.from(new Set([
      preferredModel,
      'gemini-3.1-flash-image-preview',
      'gemini-2.5-flash-image',
    ]));
    const apiKeys = Array.from(new Set([
      this.nanoBananaApiKey,
      this.geminiApiKey,
    ].filter(Boolean)));

    let lastError = 'Nano Banana image generation failed.';

    for (const apiKey of apiKeys) {
      for (const model of models) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: dto.prompt }] }],
              generationConfig: {
                responseModalities: ['IMAGE'],
                imageConfig: {
                  aspectRatio,
                  imageSize: '1K',
                },
              },
            }),
          },
        );

        const payload = await response.json().catch(() => null) as any;
        if (!response.ok) {
          lastError = payload?.error?.message || payload?.message || lastError;
          continue;
        }

        const imagePart = (payload?.candidates || [])
          .flatMap((candidate: any) => candidate?.content?.parts || [])
          .find((part: GoogleImagePart) => part?.inlineData?.data || part?.inline_data?.data);

        const inlineData = imagePart?.inlineData || imagePart?.inline_data;
        if (!inlineData?.data) {
          lastError = 'Nano Banana ne image payload return nahi kiya.';
          continue;
        }

        const mimeType = inlineData?.mimeType || inlineData?.mime_type || 'image/png';
        const imageUrl = `data:${mimeType};base64,${inlineData.data}`;
        await this.logRequest(userId, dto.prompt, imageUrl, 0, 'IMAGE');

        return {
          imageUrl,
          provider: model,
          mimeType,
        };
      }
    }

    throw new BadRequestException(lastError);
  }

  // ─── Veo 3 Video Generation ───────────────────────────────────────────────

  async generateVideo(userId: string, dto: GenerateVideoDto) {
    await this.checkUsageLimit(userId);

    if (this.videoProvider !== 'veo3') {
      throw new BadRequestException('Video generation ke liye VEO3_API_KEY required hai.');
    }

    const aspectRatio = dto.aspectRatio || '16:9';
    const durationSeconds = dto.durationSeconds || 6;
    const model = this.config.get('VEO3_MODEL') || 'veo-3.1-generate-preview';
    const apiKeys = Array.from(new Set([
      this.veo3ApiKey,
      this.geminiApiKey,
    ].filter(Boolean)));

    let lastError = 'Veo 3 video generation failed.';

    for (const apiKey of apiKeys) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: dto.prompt }],
            parameters: {
              aspectRatio,
              durationSeconds,
              personGeneration: 'allow_all',
              resolution: '720p',
            },
          }),
        },
      );

      const payload = await response.json().catch(() => null) as any;
      if (!response.ok) {
        lastError = payload?.error?.message || payload?.message || lastError;
        continue;
      }

      const operationName = payload?.name;
      if (!operationName) {
        lastError = 'Veo 3 did not return an operation ID.';
        continue;
      }

      await this.logRequest(userId, dto.prompt, `operation:${operationName}`, 0, 'VIDEO');

      return {
        operationName,
        status: 'PROCESSING',
        message: 'Video generation started. Use the check-video endpoint to poll for results.',
        provider: 'veo-3',
      };
    }

    throw new BadRequestException(lastError);
  }

  async checkVideoStatus(userId: string, operationName: string) {
    if (this.videoProvider !== 'veo3') {
      throw new BadRequestException('Video generation ke liye VEO3_API_KEY required hai.');
    }

    const apiKeys = Array.from(new Set([
      this.veo3ApiKey,
      this.geminiApiKey,
    ].filter(Boolean)));

    let payload: any = null;
    let lastError = 'Failed to check video status.';

    for (const apiKey of apiKeys) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${apiKey}`,
        { method: 'GET' },
      );

      const nextPayload = await response.json().catch(() => null) as any;
      if (response.ok) {
        payload = nextPayload;
        break;
      }

      payload = null;
      lastError = nextPayload?.error?.message || nextPayload?.message || lastError;
    }

    if (!payload) {
      throw new BadRequestException(lastError);
    }

    if (!payload?.done) {
      return {
        operationName,
        status: 'PROCESSING',
        message: 'Video is still being generated. Check again in a few seconds.',
      };
    }

    const generatedVideos = payload?.response?.generatedVideos || payload?.response?.generated_videos || [];
    const video = generatedVideos?.[0]?.video;
    const videoUri = video?.uri || video?.fileUri || null;
    const playableVideoUrl = videoUri ? await this.buildGoogleMediaDataUrl(videoUri, video?.mimeType || 'video/mp4') : null;

    return {
      operationName,
      status: 'COMPLETED',
      videoUrl: playableVideoUrl || videoUri,
      sourceFileUri: videoUri,
      encoding: video?.encoding || video?.mimeType || 'video/mp4',
      provider: 'veo-3',
    };
  }

  private async buildGoogleMediaDataUrl(fileUri: string, fallbackMimeType: string) {
    const apiKeys = Array.from(new Set([
      this.veo3ApiKey,
      this.geminiApiKey,
    ].filter(Boolean)));

    for (const apiKey of apiKeys) {
      try {
        const separator = fileUri.includes('?') ? '&' : '?';
        const response = await fetch(`${fileUri}${separator}alt=media&key=${apiKey}`);
        if (!response.ok) {
          continue;
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const mimeType = response.headers.get('content-type') || fallbackMimeType;
        return `data:${mimeType};base64,${buffer.toString('base64')}`;
      } catch {
        continue;
      }
    }

    return null;
  }

  private mapImageSizeToAspectRatio(size?: string) {
    switch (size) {
      case '1792x1024':
        return '16:9';
      case '1024x1792':
        return '9:16';
      default:
        return '1:1';
    }
  }

  private async generateLocalPreviewImage(userId: string, prompt: string) {
    const title = this.escapeSvgText(prompt.trim() || 'Creative image preview').slice(0, 120);
    const lines = this.wrapSvgText(title, 22, 4);
    const textSvg = lines
      .map((line, index) => `<tspan x="80" dy="${index === 0 ? 0 : 36}">${line}</tspan>`)
      .join('');

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#111827"/>
            <stop offset="50%" stop-color="#4f46e5"/>
            <stop offset="100%" stop-color="#a855f7"/>
          </linearGradient>
        </defs>
        <rect width="1024" height="1024" rx="64" fill="url(#bg)"/>
        <circle cx="830" cy="180" r="120" fill="rgba(255,255,255,0.12)"/>
        <circle cx="170" cy="830" r="150" fill="rgba(255,255,255,0.08)"/>
        <rect x="64" y="64" width="896" height="896" rx="48" fill="rgba(10,10,25,0.28)" stroke="rgba(255,255,255,0.18)"/>
        <text x="80" y="140" fill="#cbd5e1" font-size="34" font-family="Arial, Helvetica, sans-serif">Local image preview</text>
        <text x="80" y="240" fill="#ffffff" font-size="44" font-weight="700" font-family="Arial, Helvetica, sans-serif">${textSvg}</text>
        <text x="80" y="900" fill="#d8b4fe" font-size="28" font-family="Arial, Helvetica, sans-serif">Live image credits unavailable, so this preview was generated locally.</text>
      </svg>
    `.trim();

    const imageUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await this.logRequest(userId, prompt, imageUrl, 0, 'IMAGE');

    return {
      imageUrl,
      provider: 'local-preview',
      finishReason: 'LOCAL_FALLBACK',
    };
  }

  private escapeSvgText(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private wrapSvgText(value: string, wordsPerLine: number, maxLines: number) {
    const words = value.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= wordsPerLine) {
        current = candidate;
        continue;
      }

      if (current) {
        lines.push(current);
      }
      current = word;

      if (lines.length === maxLines - 1) {
        break;
      }
    }

    if (current && lines.length < maxLines) {
      lines.push(current);
    }

    if (!lines.length) {
      return ['Creative image preview'];
    }

    if (words.length > 0 && lines.length === maxLines) {
      const last = lines[maxLines - 1];
      lines[maxLines - 1] = last.length > wordsPerLine - 3 ? `${last.slice(0, wordsPerLine - 3)}...` : `${last}...`;
    }

    return lines;
  }

  private async logRequest(userId: string | null, prompt: string, result: string, tokens: number, type: any) {
    if (!userId) return;

    await this.prisma.aiRequest.create({
      data: { userId, requestType: type, prompt: prompt.substring(0, 500), result: result.substring(0, 2000), tokensUsed: tokens },
    });
  }

  private async buildChatPrompt(userId: string | null, dto: ChatMessageDto, options: ChatOptions) {
    const brandVoice = this.buildBrandVoiceInstruction(dto.brandVoice);
    const language = dto.language || 'English';
    const historyLimit = Number(this.config.get('AI_CHAT_MEMORY_MESSAGES') || 30);
    const longTermMemory = options.includeLongTermMemory && userId
      ? await this.getRecentChatMemory(userId, Number(this.config.get('AI_CHAT_MEMORY_DB') || 20))
      : '';
    const memoryText = options.includeLongTermMemory
      ? (longTermMemory || 'No prior memory available.')
      : 'Guest session only. No long-term memory available.';

    const systemPrompt = `You are Zyx, an AI assistant for Zynovexa creator platform.
You help content creators grow their audience, create better content, understand analytics, and manage their social media presence.
Be concise (max 3 paragraphs), practical, and encouraging. Always give actionable advice.
Respond in: ${language}
${brandVoice}

Long-term user memory (recent chat context):
${memoryText}`;

    const historyText = (dto.history || [])
      .slice(-historyLimit)
      .map((message: any) => `${message.role === 'assistant' ? 'Assistant' : 'User'}: ${message.content}`)
      .join('\n');

    return `${systemPrompt}\n\nRecent live conversation:\n${historyText || 'No recent conversation.'}\n\nUser: ${dto.message}\nAssistant:`;
  }

  private async checkUsageLimit(userId: string) {
    const stats = await this.getUsageStats(userId);
    if (stats.limit !== null && stats.used >= stats.limit) {
      throw new BadRequestException(`AI limit reached (${stats.used}/${stats.limit}). Upgrade your plan.`);
    }
  }

  private safeJsonParse<T extends AiJson>(raw: string, fallback: T): T {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private buildBrandVoiceInstruction(brandVoice?: string) {
    if (!brandVoice?.trim()) return '';
    return `Brand voice to follow strictly: ${brandVoice.trim()}`;
  }

  private async getRecentChatMemory(userId: string, take: number) {
    const rows = await this.prisma.aiRequest.findMany({
      where: { userId, requestType: 'CHATBOT' },
      orderBy: { createdAt: 'desc' },
      take,
      select: { prompt: true, result: true, createdAt: true },
    });

    if (!rows.length) return '';

    return rows
      .reverse()
      .map((r, idx) => {
        const q = (r.prompt || '').replace(/\s+/g, ' ').trim().slice(0, 220);
        const a = (r.result || '').replace(/\s+/g, ' ').trim().slice(0, 260);
        return `${idx + 1}. User: ${q}\nAssistant: ${a}`;
      })
      .join('\n\n');
  }

  private getPlatformRules(platforms: string[]) {
    if (!platforms.length) return '';
    const normalized = platforms.map((p) => p.toLowerCase());
    const rules: string[] = [];
    if (normalized.some((p) => p.includes('tiktok') || p.includes('reel') || p.includes('short'))) {
      rules.push('- Keep hook ultra-strong in first line and use short punchy lines.');
    }
    if (normalized.some((p) => p.includes('linkedin'))) {
      rules.push('- Maintain professional tone, include one insight and one CTA.');
    }
    if (normalized.some((p) => p.includes('youtube'))) {
      rules.push('- Optimize for watch-time and curiosity with clear value framing.');
    }
    if (normalized.some((p) => p.includes('instagram'))) {
      rules.push('- Blend storytelling + relatability + save/share CTA.');
    }
    return rules.length ? `Platform rules:\n${rules.join('\n')}` : '';
  }

  private scoreCaptionOutput(payload: AiJson) {
    const captions = Array.isArray(payload?.captions) ? payload.captions : [];
    const hashtags = Array.isArray(payload?.hashtags) ? payload.hashtags : [];
    const avgLength = captions.length ? captions.reduce((s: number, c: string) => s + (c?.length || 0), 0) / captions.length : 0;
    const lengthScore = Math.min(40, avgLength / 4);
    const volumeScore = Math.min(40, captions.length * 12);
    const hashtagScore = Math.min(20, hashtags.length * 2);
    return Math.round(lengthScore + volumeScore + hashtagScore);
  }

  private scoreScriptOutput(payload: AiJson) {
    const hasHook = payload?.hook ? 20 : 0;
    const sections = Array.isArray(payload?.sections) ? payload.sections.length : 0;
    const hasCta = payload?.cta ? 20 : 0;
    const hasBroll = Array.isArray(payload?.bRoll) && payload.bRoll.length ? 20 : 0;
    const sectionScore = Math.min(40, sections * 8);
    return hasHook + sectionScore + hasCta + hasBroll;
  }

  private scoreHashtagOutput(payload: AiJson, targetCount: number) {
    const hashtags = Array.isArray(payload?.hashtags) ? payload.hashtags : [];
    const ratio = targetCount > 0 ? hashtags.length / targetCount : 0;
    const countScore = Math.min(70, Math.round(ratio * 70));
    const hasCategories = payload?.categories ? 30 : 0;
    return Math.min(100, countScore + hasCategories);
  }
}
