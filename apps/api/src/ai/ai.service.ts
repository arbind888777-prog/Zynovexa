import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';
import {
  GenerateCaptionDto, GenerateScriptDto, GenerateHashtagsDto,
  GenerateImageDto, ChatMessageDto, BestTimeDto,
} from './dto/ai.dto';

// Plan limits for AI requests per month
const PLAN_LIMITS = {
  FREE: 20,
  STARTER: 100,
  PRO: 500,
  GROWTH: Infinity,
  BUSINESS: Infinity,
};

type AiJson = Record<string, any>;

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;
  private isDemoMode: boolean;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.config.get('OPENAI_API_KEY') || '';
    this.isDemoMode = !apiKey || apiKey.includes('your-openai') || apiKey === 'sk-your-openai-key-here';
    if (!this.isDemoMode) {
      this.openai = new OpenAI({ apiKey });
    }
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

    const result = await this.callOpenAI(userId, prompt, 'CAPTION');
    const parsed = this.safeJsonParse(result, { captions: [result], hashtags: [] });
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

    const result = await this.callOpenAI(userId, prompt, 'VIDEO_SCRIPT');
    const parsed = this.safeJsonParse(result, { script: result });
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

    const result = await this.callOpenAI(userId, prompt, 'HASHTAGS');
    const parsed = this.safeJsonParse(result, { hashtags: [] });
    return { ...parsed, qualityScore: this.scoreHashtagOutput(parsed, count) };
  }

  // ─── AI Image Generation ──────────────────────────────────────────────────

  async generateImage(userId: string, dto: GenerateImageDto) {
    await this.checkUsageLimit(userId);
    if (this.isDemoMode || !this.openai) {
      throw new BadRequestException('OpenAI API key nahi hai. .env file mein OPENAI_API_KEY add karo.');
    }
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: dto.prompt,
      n: 1,
      size: (dto.size as any) || '1024x1024',
      style: (dto.style as any) || 'natural',
      quality: 'hd',
    });

    await this.logRequest(userId, dto.prompt, response.data[0]?.url || '', 0, 'IMAGE');

    return { imageUrl: response.data[0]?.url, revisedPrompt: response.data[0]?.revised_prompt };
  }

  // ─── AI Chatbot ───────────────────────────────────────────────────────────

  async chat(userId: string, dto: ChatMessageDto) {
    await this.checkUsageLimit(userId);
    if (this.isDemoMode || !this.openai) {
      return { reply: '⚠️ OpenAI key nahi hai. .env mein OPENAI_API_KEY add karo: https://platform.openai.com/api-keys', tokensUsed: 0 };
    }
    const brandVoice = this.buildBrandVoiceInstruction(dto.brandVoice);
    const language = dto.language || 'English';
    const historyLimit = Number(this.config.get('AI_CHAT_MEMORY_MESSAGES') || 30);
    const longTermMemory = await this.getRecentChatMemory(userId, Number(this.config.get('AI_CHAT_MEMORY_DB') || 20));
    const systemPrompt = `You are Zyx, an AI assistant for Zynovexa creator platform.
You help content creators grow their audience, create better content, understand analytics, and manage their social media presence.
Be concise (max 3 paragraphs), practical, and encouraging. Always give actionable advice.
Respond in: ${language}
${brandVoice}

Long-term user memory (recent chat context):
${longTermMemory || 'No prior memory available.'}`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...(dto.history || []).slice(-historyLimit),
      { role: 'user', content: dto.message },
    ];

    const completion = await this.openai.chat.completions.create({
      model: this.config.get('OPENAI_MODEL') || 'gpt-4o',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || '';
    await this.logRequest(userId, dto.message, reply, completion.usage?.total_tokens || 0, 'CHATBOT');

    return { reply, tokensUsed: completion.usage?.total_tokens };
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

    const result = await this.callOpenAI(userId, prompt, 'BEST_TIME');
  return this.safeJsonParse(result, { bestTimes: [], insights: result });
  }

  // ─── Usage Stats ──────────────────────────────────────────────────────────

  async getUsageStats(userId: string) {
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

  private async callOpenAI(userId: string, prompt: string, type: any): Promise<string> {
    if (this.isDemoMode || !this.openai) {
      throw new BadRequestException('OpenAI API key nahi hai. .env file mein OPENAI_API_KEY add karo. Get key: https://platform.openai.com/api-keys');
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
          max_tokens: 1500,
          temperature: 0.8,
          response_format: { type: 'json_object' },
        });

        const result = completion.choices[0]?.message?.content || '';
        await this.logRequest(userId, prompt, result, completion.usage?.total_tokens || 0, type);
        return result;
      } catch (err: any) {
        lastError = err;
      }
    }

    throw new BadRequestException(lastError?.message || 'AI request failed. Please try again.');
  }

  private async logRequest(userId: string, prompt: string, result: string, tokens: number, type: any) {
    await this.prisma.aiRequest.create({
      data: { userId, requestType: type, prompt: prompt.substring(0, 500), result: result.substring(0, 2000), tokensUsed: tokens },
    });
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
