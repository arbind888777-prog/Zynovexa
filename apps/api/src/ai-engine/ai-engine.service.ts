import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiEngineService {
  private openai: OpenAI | null = null;
  private geminiApiKey = '';
  private aiProvider: 'openai' | 'gemini' | 'demo' = 'demo';
  private isDemoMode: boolean;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const openAiKey = this.config.get('OPENAI_API_KEY') || '';
    const geminiKey = this.config.get('GEMINI_API_KEY') || '';
    const hasOpenAi = !!openAiKey && !openAiKey.includes('your-openai') && openAiKey !== 'sk-your-openai-key-here';
    const hasGemini = !!geminiKey && !geminiKey.includes('your-gemini');

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

    this.isDemoMode = this.aiProvider === 'demo';
  }

  async generate(userId: string, dto: { niche: string; platform: string; tone: string; audience: string; contentType: string; topic?: string }) {
    const { niche, platform, tone, audience, contentType, topic } = dto;

    // Check usage limit
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    const plan = user?.plan || 'FREE';

    const usageCount = await this.prisma.aiRequest.count({
      where: { userId, createdAt: { gte: monthStart } },
    });

    const limits: Record<string, number> = { FREE: 20, STARTER: 100, PRO: 500, GROWTH: 9999, BUSINESS: 9999 };
    const limit = limits[plan] || 20;

    if (usageCount >= limit) {
      return {
        content: 'You have reached your AI usage limit for this month. Please upgrade your plan for more credits.',
        score: null,
        usage: { used: usageCount, limit },
      };
    }

    if (this.isDemoMode) {
      const content = this.generateDemoContent(contentType, topic || niche, platform, tone, audience);
      const score = this.scoreContent(content, platform);

      await this.prisma.aiRequest.create({
        data: { userId, requestType: 'CAPTION', prompt: topic || niche, result: content, tokensUsed: 0 },
      });

      return { content, score, usage: { used: usageCount + 1, limit } };
    }

    // Real OpenAI call
    const prompt = this.buildPrompt(contentType, topic || niche, platform, tone, audience, niche);
    try {
      const content = await this.generateWithProvider(prompt);
      const score = this.scoreContent(content, platform);

      await this.prisma.aiRequest.create({
        data: { userId, requestType: 'CAPTION', prompt: topic || niche, result: content, tokensUsed: 0 },
      });

      return { content, score, usage: { used: usageCount + 1, limit } };
    } catch {
      const content = this.generateDemoContent(contentType, topic || niche, platform, tone, audience);
      return { content, score: this.scoreContent(content, platform), usage: { used: usageCount, limit } };
    }
  }

  private async generateWithProvider(prompt: string) {
    if (this.aiProvider === 'openai' && this.openai) {
      const completion = await this.openai.chat.completions.create({
        model: this.config.get('OPENAI_MODEL') || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.8,
      });

      return completion.choices[0]?.message?.content || '';
    }

    if (this.aiProvider === 'gemini') {
      const model = this.config.get('GEMINI_MODEL') || 'gemini-2.5-flash';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 1000 },
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json() as any;
      return (data?.candidates || [])
        .flatMap((candidate: any) => candidate?.content?.parts || [])
        .map((part: any) => part?.text || '')
        .join('')
        .trim();
    }

    throw new Error('AI provider not configured');
  }

  async scoreContentEndpoint(dto: { content: string; platform: string }) {
    const score = this.scoreContent(dto.content, dto.platform);
    return { score };
  }

  private scoreContent(content: string, platform: string) {
    const words = content.split(/\s+/).length;
    const hasQuestion = /\?/.test(content);
    const hasEmoji = /[\u{1F600}-\u{1F9FF}]/u.test(content);
    const hasCTA = /comment|share|follow|subscribe|link|click|tap|save|dm/i.test(content);
    const hasHook = content.split('\n')[0]?.length > 10;
    const hasHashtags = /#\w+/.test(content);

    let hook = 50;
    if (hasHook) hook += 20;
    if (hasQuestion) hook += 15;
    if (content.split('\n')[0]?.length < 80) hook += 15;

    let readability = 50;
    if (words > 20 && words < 300) readability += 30;
    if (content.includes('\n')) readability += 10;
    if (hasEmoji) readability += 10;

    let engagement = 50;
    if (hasCTA) engagement += 20;
    if (hasQuestion) engagement += 15;
    if (hasHashtags) engagement += 10;
    if (hasEmoji) engagement += 5;

    hook = Math.min(hook, 100);
    readability = Math.min(readability, 100);
    engagement = Math.min(engagement, 100);

    const overall = Math.round((hook + readability + engagement) / 3);

    const suggestions: string[] = [];
    if (!hasHook) suggestions.push('Add a stronger opening hook to grab attention in the first line.');
    if (!hasCTA) suggestions.push('Include a clear call-to-action (e.g., "Comment below", "Save this post").');
    if (!hasEmoji) suggestions.push('Add emojis to make the content more visually engaging.');
    if (!hasHashtags && (platform === 'instagram' || platform === 'tiktok')) {
      suggestions.push('Add relevant hashtags for better discoverability.');
    }
    if (words < 20) suggestions.push('Your content is too short. Add more value and detail.');
    if (!hasQuestion) suggestions.push('Ask a question to boost comment engagement.');

    return { overall, hook, readability, engagement, suggestions };
  }

  private buildPrompt(contentType: string, topic: string, platform: string, tone: string, audience: string, niche: string): string {
    const base = `You are an expert social media content creator specializing in ${niche} niche.
Platform: ${platform}
Tone: ${tone}
Target audience: ${audience}
Topic: ${topic}`;

    switch (contentType) {
      case 'viral_reel':
        return `${base}\n\nWrite a viral reel/short caption with:\n- Scroll-stopping hook in first line\n- Value-packed body\n- Strong CTA\n- 5-8 relevant hashtags\n\nKeep it under 150 words.`;
      case 'youtube_script':
        return `${base}\n\nWrite a full YouTube video script with:\n- Attention-grabbing intro (first 5 seconds)\n- Clear sections with timestamps\n- Key takeaways\n- Engaging outro with CTA\n- SEO-optimized title and description suggestions\n\nTarget length: 5-8 minutes of speaking.`;
      case 'hook':
        return `${base}\n\nGenerate 5 scroll-stopping hooks for ${platform}. Each hook should:\n- Be under 10 words\n- Create curiosity or urgency\n- Be platform-appropriate\n\nReturn as a numbered list.`;
      case 'caption':
        return `${base}\n\nWrite an engaging caption for ${platform} about "${topic}".\n- Include emojis\n- Add a question for engagement\n- Include 5-8 hashtags\n- Keep the tone ${tone}\n\nKeep under 120 words.`;
      case 'hashtags':
        return `${base}\n\nGenerate 3 hashtag sets for a ${platform} post about "${topic}":\n1. High-volume (500K+ posts)\n2. Medium-volume (50K-500K posts)\n3. Niche-specific (under 50K posts)\n\n10 hashtags per set. Format as lists.`;
      case 'script':
        return `${base}\n\nWrite a short-form video script (30-60 seconds) with:\n- Hook (first 3 seconds)\n- Value section\n- CTA\n- Visual notes for each section\n\nKeep it punchy and engaging.`;
      default:
        return `${base}\n\nGenerate engaging content about "${topic}" optimized for ${platform}.`;
    }
  }

  private generateDemoContent(contentType: string, topic: string, platform: string, tone: string, audience: string): string {
    switch (contentType) {
      case 'viral_reel':
        return `🔥 STOP SCROLLING! This changes everything about ${topic}...

Here's what nobody tells you about ${topic}:

1️⃣ The hidden truth most people miss
2️⃣ Why timing matters more than talent  
3️⃣ The one hack that 10x your results

The best part? You can start TODAY. 💪

Save this for later and share with someone who needs to hear this! 👇

#${topic.replace(/\s+/g, '')} #growth #viral #trending #motivation #${platform} #contentcreator #tips`;

      case 'youtube_script':
        return `📹 YOUTUBE VIDEO SCRIPT: "${topic}"

🎬 HOOK (0:00 - 0:05)
"What if I told you everything you know about ${topic} is wrong?"

📌 INTRO (0:05 - 0:30)  
Hey everyone! Welcome back to the channel. Today we're diving deep into ${topic}, and trust me — by the end of this video, you'll have a completely different perspective.

📌 SECTION 1: The Basics (0:30 - 2:00)
Let's start with the fundamentals...
[Visual: Show key statistics or infographic]

📌 SECTION 2: Common Mistakes (2:00 - 4:00)
Most people get this wrong. Here are the top 3 mistakes...
[Visual: Before/After comparison]

📌 SECTION 3: The Strategy (4:00 - 6:00)
Now here's what actually works...
[Visual: Step-by-step demonstration]

📌 OUTRO (6:00 - 6:30)
If you found this helpful, smash that like button and subscribe! Drop a comment below with your biggest takeaway. See you in the next one! 🚀

📝 TITLE OPTIONS:
1. "The Truth About ${topic} Nobody Tells You"
2. "${topic}: 3 Mistakes You're Making Right Now"

📝 DESCRIPTION:
In this video, I break down everything you need to know about ${topic}...`;

      case 'hook':
        return `🎯 5 Scroll-Stopping Hooks for ${platform}:

1. "Nobody talks about this side of ${topic}..."
2. "I was wrong about ${topic}. Here's the truth."
3. "Stop doing ${topic} the old way. Try this instead 👇"
4. "What ${topic} looks like at every level (0 → Expert)"
5. "The ${topic} mistake costing you everything 🚫"`;

      case 'caption':
        return `✨ Let's talk about ${topic}!

Most people overcomplicate this, but here's the simple truth...

The key is consistency + strategy. 📈

Here's my 3-step approach:
→ Start small, but start today
→ Track what works
→ Double down on winners

What's your experience with ${topic}? Drop it below! 👇

#${topic.replace(/\s+/g, '')} #growthmindset #contentcreator #${platform} #motivation #dailytips`;

      case 'hashtags':
        return `#️⃣ HASHTAG STRATEGY for "${topic}" on ${platform}:

🔵 HIGH-VOLUME (500K+ posts):
#motivation #success #growth #trending #viral #instagood #explore #fyp #content #creator

🟡 MEDIUM-VOLUME (50K-500K):
#${topic.replace(/\s+/g, '')} #growthhacking #contentmarketing #creatortips #socialmediatips #digitalstrategy #onlinebusiness #contentcreation #buildyourbrand #entrepreneurlife

🟢 NICHE-SPECIFIC (under 50K):
#${topic.replace(/\s+/g, '')}tips #${topic.replace(/\s+/g, '')}strategy #${platform}growth #nichecontent #microinfluencer #contentplaybook #socialstrategy #growthplaybook #${platform}tips #creatoreconmy`;

      case 'script':
        return `🎬 SHORT-FORM VIDEO SCRIPT (45 seconds)

⏱️ HOOK (0-3s):
"This one thing changed my entire ${topic} game..."
[Visual: Quick zoom-in on face, text overlay of topic]

⏱️ VALUE (3-30s):
"So here's what happened — I was struggling with ${topic} for months. Then I discovered this simple framework:

Step 1: Define your goal clearly
Step 2: Break it into daily actions  
Step 3: Review and adjust weekly"
[Visual: Show each step as text overlay]

⏱️ CTA (30-45s):
"Try this for just 7 days and watch what happens. Follow for more ${topic} tips!"
[Visual: Point to follow button, add text "Follow for more"]`;

      default:
        return `📝 Content about "${topic}" for ${platform}:\n\nHere's a ${tone} take on ${topic} for ${audience}...`;
    }
  }
}
