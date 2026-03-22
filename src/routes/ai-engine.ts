// ============================================================
// Zynovexa - Enhanced AI Engine with Niche-Specific Prompts,
// Scoring System, and Template Library
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const aiEngine = new Hono<{ Bindings: Bindings; Variables: Variables }>();

aiEngine.use('*', authMiddleware);

// ── Platform-specific prompt parameters ─────────────────────
interface AIGenerationParams {
  input: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'linkedin' | 'twitter' | 'all';
  audience: 'gen_z' | 'millennials' | 'professionals' | 'entrepreneurs' | 'general';
  tone: 'casual' | 'professional' | 'hinglish' | 'humorous' | 'motivational';
  niche: string;
  type: 'caption' | 'script' | 'hook' | 'hashtags' | 'viral_reel' | 'youtube_script';
}

// ── POST /api/ai-engine/generate — Niche-specific content ───
aiEngine.post('/generate', async (c) => {
  const userId = c.get('userId');
  const params: AIGenerationParams = await c.req.json();

  if (!params.input || !params.type) {
    return c.json(apiError('Input and type are required'), 400);
  }

  // Check AI usage limits based on plan
  const user = await c.env.DB.prepare('SELECT plan FROM users WHERE id = ?').bind(userId).first() as any;
  const todayUsage = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM ai_requests WHERE user_id = ? AND created_at >= date('now')"
  ).bind(userId).first() as any;

  const limits: Record<string, number> = { free: 10, pro: 100, promax: 500, business: 9999 };
  const userLimit = limits[user?.plan || 'free'] || 10;
  if ((todayUsage?.count || 0) >= userLimit) {
    return c.json(apiError(`Daily AI limit reached (${userLimit}). Upgrade your plan for more.`), 429);
  }

  const platform = params.platform || 'all';
  const audience = params.audience || 'general';
  const tone = params.tone || 'professional';
  const niche = params.niche || 'general';

  // Generate content based on type
  let output: string;
  switch (params.type) {
    case 'viral_reel':
      output = generateViralReelCaption(params.input, platform, audience, tone, niche);
      break;
    case 'youtube_script':
      output = generateYouTubeScript(params.input, audience, tone, niche);
      break;
    case 'hook':
      output = generateHooks(params.input, platform, tone, niche);
      break;
    case 'script':
      output = generateVideoScript(params.input, platform, audience, tone, niche);
      break;
    case 'caption':
      output = generateNicheCaption(params.input, platform, audience, tone, niche);
      break;
    case 'hashtags':
      output = generateSmartHashtags(params.input, platform, niche);
      break;
    default:
      output = generateNicheCaption(params.input, platform, audience, tone, niche);
  }

  // Score the output
  const score = scoreContent(output, params.type);

  // Log the AI request
  const requestId = generateId('aire');
  await c.env.DB.prepare(
    'INSERT INTO ai_requests (id, user_id, request_type, input_text, output_text, tokens_used, model) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(requestId, userId, params.type, params.input, output, output.length, 'zynovexa-ai-v2').run();

  // Save content score
  await c.env.DB.prepare(
    'INSERT INTO content_scores (id, user_id, content_text, overall_score, hook_score, readability_score, engagement_score, suggestions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(generateId('cs'), userId, output, score.overall, score.hook, score.readability, score.engagement, JSON.stringify(score.suggestions)).run();

  // Record gamification action
  await c.env.DB.prepare('UPDATE user_streaks SET total_ai_uses = total_ai_uses + 1, xp_points = xp_points + 5 WHERE user_id = ?').bind(userId).run();

  return c.json(apiSuccess({
    content: output,
    score,
    metadata: { platform, audience, tone, niche, type: params.type },
    usage: { used: (todayUsage?.count || 0) + 1, limit: userLimit },
  }));
});

// ── GET /api/ai-engine/templates — Prompt template library ──
aiEngine.get('/templates', async (c) => {
  const platform = c.req.query('platform') || '';
  const category = c.req.query('category') || '';
  const userId = c.get('userId');
  const user = await c.env.DB.prepare('SELECT plan FROM users WHERE id = ?').bind(userId).first() as any;
  const isPro = ['pro', 'promax', 'business'].includes(user?.plan || '');

  let query = 'SELECT id, name, category, platform, audience_type, tone, is_premium FROM ai_prompt_templates WHERE 1=1';
  const params: any[] = [];
  if (platform) { query += ' AND (platform = ? OR platform = \'all\')'; params.push(platform); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  query += ' ORDER BY usage_count DESC LIMIT 50';

  const result = await c.env.DB.prepare(query).bind(...params).all();
  const templates = (result.results || []).map((t: any) => ({
    ...t,
    locked: t.is_premium && !isPro,
  }));

  return c.json(apiSuccess({ templates }));
});

// ── POST /api/ai-engine/score — Score existing content ──────
aiEngine.post('/score', async (c) => {
  const userId = c.get('userId');
  const { content, type } = await c.req.json();
  if (!content) return c.json(apiError('Content is required'), 400);

  const score = scoreContent(content, type || 'caption');

  await c.env.DB.prepare(
    'INSERT INTO content_scores (id, user_id, content_text, overall_score, hook_score, readability_score, engagement_score, suggestions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(generateId('cs'), userId, content, score.overall, score.hook, score.readability, score.engagement, JSON.stringify(score.suggestions)).run();

  return c.json(apiSuccess({ score }));
});

// ════════════════════════════════════════════════════════════
// CONTENT GENERATION FUNCTIONS
// ════════════════════════════════════════════════════════════

function generateViralReelCaption(input: string, platform: string, audience: string, tone: string, niche: string): string {
  const hooks: Record<string, string[]> = {
    casual: ['Stop scrolling — you need to see this 👀', 'POV: you just discovered the best thing ever', 'This is your sign to try this today'],
    professional: ['Here\'s what most people get wrong about this:', 'The data is clear — and surprising.', 'I spent 100 hours researching this so you don\'t have to:'],
    hinglish: ['Yaar ye dekho — sab badal jayega 🔥', 'Aisa content kahi nahi milega, save karo', 'Bhai isko miss mat karo — life changing hai'],
    humorous: ['My brain at 3 AM: "Let me share this with everyone"', 'Nobody asked but everyone needs this 😂', 'I\'m about to ruin your algorithm — in a good way'],
    motivational: ['This one habit changed everything for me 🚀', 'If you\'re struggling right now, watch this', 'Your future self will thank you for this ✨'],
  };

  const closers: Record<string, string[]> = {
    casual: ['Save this for later! 💾', 'Share with someone who needs this 👇', 'Follow for more 🤝'],
    professional: ['Save for reference. Share with your team.', 'Follow for data-driven insights.', 'Bookmark this and revisit in 30 days.'],
    hinglish: ['Save karo aur share karo 🔥', 'Follow for more aisi content 💪', 'Comment mein batao kya lagta hai'],
    humorous: ['You made it to the end — you deserve a follow 😤', 'If this helped, smash that like button', 'Send this to someone who needs a reality check 😂'],
    motivational: ['Double tap if this resonated with you ❤️', 'Tag someone who needs to hear this today', 'Your journey starts now. Follow for daily motivation 🌟'],
  };

  const hook = pickRandom(hooks[tone] || hooks.casual);
  const closer = pickRandom(closers[tone] || closers.casual);

  return `${hook}\n\n${input}\n\nHere's what I learned:\n\n1️⃣ Start with a strong foundation\n2️⃣ Be consistent, not perfect\n3️⃣ Track your progress weekly\n4️⃣ Iterate based on data\n5️⃣ Never stop experimenting\n\n${closer}\n\n#${niche} #creator #growth #viral`;
}

function generateYouTubeScript(input: string, audience: string, tone: string, niche: string): string {
  const hooks: Record<string, string> = {
    casual: `What's up everyone! Today we're diving into something that's going to blow your mind`,
    professional: `In this video, I'm going to show you exactly how to master ${input} — backed by real data`,
    hinglish: `Dosto aaj main aapko bataunga ${input} ke baare mein — ye video poori dekho`,
    humorous: `Okay so hear me out — this is going to sound crazy but ${input} is about to change your life`,
    motivational: `If you've ever struggled with ${input}, this video is going to be a game-changer`,
  };

  return `📹 YOUTUBE VIDEO SCRIPT: "${input}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 HOOK [0:00 - 0:15]
"${hooks[tone] || hooks.casual}."

📋 INTRO [0:15 - 0:45]
"Before we get into it, let me give you some context..."
- Who this video is for: ${audience === 'gen_z' ? 'Gen Z creators' : audience === 'professionals' ? 'working professionals' : 'aspiring creators'}
- What you'll learn: 3 actionable strategies
- Why it matters: [Insert compelling statistic]
"Make sure to like and subscribe if you find value — let's get into it."

📖 MAIN CONTENT [0:45 - 6:00]

Section 1: The Foundation [0:45 - 2:30]
"The first thing you need to understand about ${input} is..."
- Key point 1 with example
- Show proof/screenshot/data
- Quick tip viewers can apply immediately

Section 2: The Strategy [2:30 - 4:15]
"Now here's where it gets interesting..."
- Key point 2 with case study
- Step-by-step walkthrough
- Common mistakes to avoid

Section 3: Advanced Tips [4:15 - 6:00]
"This is the part most people miss..."
- Key point 3 (the "secret sauce")
- Real results demonstration
- Timeline and expectations

🎯 CTA [6:00 - 6:30]
"If this helped, smash that like button. Subscribe for weekly ${niche} content."
"Drop a comment: which tip was most useful?"
"Check the description for all the resources mentioned."

📊 METADATA:
- Suggested title: "How to ${input} (Complete Guide ${new Date().getFullYear()})"
- Tags: ${niche}, tutorial, how to, guide, ${input.split(' ').slice(0, 3).join(', ')}
- Estimated length: 6-8 minutes
- Best thumbnail: Before/after or surprised face with text overlay`;
}

function generateHooks(input: string, platform: string, tone: string, niche: string): string {
  const platformHooks: Record<string, string[]> = {
    instagram: [
      `Stop scrolling. This ${niche} tip will save you hours.`,
      `I was wrong about ${input}. Here's the truth...`,
      `The #1 mistake in ${niche}: ${input}`,
      `99% of people don't know this about ${input}`,
      `Watch this before you ${input.toLowerCase()} again`,
    ],
    tiktok: [
      `POV: You just discovered the ${niche} hack of the year`,
      `This is the ${input.toLowerCase()} content you didn't know you needed`,
      `Wait till the end — this changed everything for me`,
      `Bro this ${niche} trick is actually insane`,
      `Replying to everyone who asked about ${input}`,
    ],
    youtube: [
      `In the next 60 seconds, I'll show you how to ${input.toLowerCase()}`,
      `I spent 1,000 hours mastering ${input}. Here's what I learned.`,
      `This is the video I wish I had when I started ${niche}`,
      `The complete ${input} guide — from zero to pro`,
      `Why everyone is wrong about ${input} (and what actually works)`,
    ],
    linkedin: [
      `I've helped 500+ ${niche} professionals with ${input}. Here's my framework:`,
      `Unpopular opinion: ${input} is overrated. Here's what matters more.`,
      `3 years ago I knew nothing about ${input}. Today, I lead a team of 50.`,
      `The ${niche} playbook nobody talks about:`,
      `After 10 years in ${niche}, here are the ${input} lessons that actually matter:`,
    ],
    twitter: [
      `Thread: Everything I know about ${input} 🧵`,
      `${input} > Everything else. Here's why:`,
      `Hot take: ${input} is the most underrated skill in ${niche}`,
      `The ${input} mistakes that cost me $10K:`,
      `10 ${niche} tips in 10 tweets. Let's go 👇`,
    ],
  };

  const hooks = platformHooks[platform] || platformHooks.instagram;
  return `🎯 HOOK IDEAS for "${input}" (${platform || 'all platforms'})\n\n${hooks.map((h, i) => `${i + 1}. ${h}`).join('\n\n')}\n\n💡 TIP: Test 2-3 hooks on the same content. The one with best retention wins.`;
}

function generateVideoScript(input: string, platform: string, audience: string, tone: string, niche: string): string {
  const duration = platform === 'tiktok' || platform === 'instagram' ? '60 seconds' : '3-5 minutes';
  return `📹 VIDEO SCRIPT: "${input}"\nPlatform: ${platform} | Duration: ${duration} | Tone: ${tone}\n\n[HOOK — 0:00-0:03]\n"Stop. You need to hear this about ${input.toLowerCase()}."\n\n[CONTEXT — 0:03-0:10]\n"Most people in ${niche} get this wrong. I did too, until I discovered..."\n\n[VALUE — 0:10-0:40]\n"Here are the 3 things that actually work:\n1. [Key insight with proof]\n2. [Actionable step]\n3. [The mindset shift]"\n\n[PROOF — 0:40-0:50]\n"Since applying this, I've seen [specific result]. The numbers speak for themselves."\n\n[CTA — 0:50-1:00]\n"Follow for daily ${niche} tips. Save this. Share with someone who needs it."\n\n📊 Performance notes:\n- Strong hook: ✅ Pattern interrupt + curiosity gap\n- Value density: ✅ 3 actionable points\n- CTA: ✅ Multi-action (follow + save + share)`;
}

function generateNicheCaption(input: string, platform: string, audience: string, tone: string, niche: string): string {
  const toneTemplates: Record<string, (input: string, niche: string) => string> = {
    casual: (inp, n) => `Real talk about ${inp.toLowerCase()} 👇\n\nThis is the stuff nobody tells you in ${n}.\n\nI learned it the hard way so you don't have to.\n\nHere's what actually works:\n→ Be consistent (not perfect)\n→ Track everything\n→ Double down on what the data says\n→ Ignore the noise\n\nSave this for when you need a reminder 💾`,
    professional: (inp, n) => `${inp}\n\nThree evidence-based strategies for ${n} professionals:\n\n1. Start with data, not assumptions\n2. Test small, scale what works\n3. Measure outcomes, not activity\n\nThe most successful ${n} creators I've worked with all share one trait: relentless consistency over perfection.\n\nWhat's your biggest challenge right now?`,
    hinglish: (inp, n) => `${inp} — ye sun lo dosto 🔥\n\nMain ${n} mein 2 saal se kaam kar raha hun aur ye hai mera honest experience:\n\n1️⃣ Pehle consistency build karo\n2️⃣ Data dekho, feelings nahi\n3️⃣ Audience ki sumo, algorithm ki nahi\n4️⃣ Har hafte kuch naya try karo\n\nComment mein batao — tumhare liye kya kaam karta hai? 👇\n\nShare karo agar ye helpful laga ❤️`,
    humorous: (inp, n) => `Me: I'll figure out ${inp.toLowerCase()} tomorrow\n\nAlso me: *3 months later* still figuring it out 😂\n\nBut seriously, here&apos;s what actually clicked in ${n}:\n\n• Stop overthinking. Post the thing.\n• Your first 100 posts will be bad. That's normal.\n• The algorithm isn't against you, your content just needs work\n• Consistency > one viral post\n\nTag someone who needs this reality check 😤`,
    motivational: (inp, n) => `${inp}\n\n✨ Every expert was once a beginner.\n\nI started my ${n} journey with zero followers, zero knowledge, and zero confidence.\n\nToday, everything is different — not because I'm special, but because I showed up every single day.\n\nHere's your reminder:\n🌟 You're capable of more than you think\n🌟 Small steps compound into big results\n🌟 The best time to start was yesterday. The second best is NOW.\n\nDouble tap if this resonated ❤️`,
  };

  const generator = toneTemplates[tone] || toneTemplates.casual;
  return generator(input, niche);
}

function generateSmartHashtags(input: string, platform: string, niche: string): string {
  const words = input.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const nicheHashtags: Record<string, string[]> = {
    tech: ['#tech', '#technology', '#coding', '#developer', '#startup', '#ai', '#innovation', '#software'],
    lifestyle: ['#lifestyle', '#dailylife', '#livingmybestlife', '#selfcare', '#wellness', '#mindfulness'],
    fitness: ['#fitness', '#gym', '#workout', '#health', '#fitlife', '#exercise', '#bodybuilding'],
    food: ['#food', '#foodie', '#recipe', '#cooking', '#homemade', '#delicious', '#foodporn'],
    general: ['#content', '#creator', '#value', '#growth', '#tips', '#learn', '#trending'],
  };
  const platformHashtags: Record<string, string[]> = {
    instagram: ['#instagood', '#reels', '#explore', '#viral'],
    tiktok: ['#fyp', '#foryou', '#trending', '#viral'],
    youtube: ['#youtube', '#youtuber', '#subscribe'],
    linkedin: ['#linkedin', '#professional', '#career'],
    twitter: ['#thread', '#mustread'],
  };

  const nTags = nicheHashtags[niche] || nicheHashtags.general;
  const pTags = platformHashtags[platform] || [];
  const inputTags = words.slice(0, 3).map(w => `#${w}`);

  const all = [...new Set([...inputTags, ...nTags.slice(0, 5), ...pTags.slice(0, 3)])];

  return `#️⃣ OPTIMIZED HASHTAG SET\n\n🎯 Primary (high relevance):\n${inputTags.join(' ')}\n\n📊 Niche (medium competition):\n${nTags.slice(0, 5).join(' ')}\n\n🔥 Platform (trending):\n${pTags.join(' ')}\n\n📋 Ready to copy:\n${all.join(' ')}\n\n💡 Strategy: Use 8-12 hashtags on Instagram, 3-5 on TikTok, 2-3 on LinkedIn. Mix sizes: 3 big, 4 medium, 3 small niche tags.`;
}

// ════════════════════════════════════════════════════════════
// CONTENT SCORING SYSTEM (0-100)
// ════════════════════════════════════════════════════════════

function scoreContent(content: string, type: string): {
  overall: number;
  hook: number;
  readability: number;
  engagement: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];

  // Hook score (0-100): First line quality
  let hookScore = 50;
  const firstLine = content.split('\n')[0] || '';
  if (firstLine.length > 10) hookScore += 10;
  if (/stop|wait|pov|secret|truth|wrong|mistake|hack|nobody/i.test(firstLine)) hookScore += 15;
  if (/\?/.test(firstLine)) hookScore += 10;
  if (/[🔥💡👀🚀✨😂❤️⭐]/.test(firstLine)) hookScore += 5;
  if (firstLine.length < 60) hookScore += 10; // Concise hooks perform better
  if (hookScore < 60) suggestions.push('Strengthen your opening hook — use curiosity, a question, or a bold statement');
  hookScore = Math.min(100, hookScore);

  // Readability score (0-100): Structure and formatting
  let readabilityScore = 40;
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length > 3) readabilityScore += 10;
  if (lines.length > 7) readabilityScore += 10;
  const hasEmojis = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u.test(content);
  if (hasEmojis) readabilityScore += 10;
  const hasNumberedList = /[1-9][️⃣.]|\d\)/.test(content);
  if (hasNumberedList) readabilityScore += 10;
  const avgLineLength = content.length / Math.max(lines.length, 1);
  if (avgLineLength < 80) readabilityScore += 10;
  if (content.length > 50 && content.length < 2200) readabilityScore += 10;
  if (readabilityScore < 60) suggestions.push('Improve readability by using shorter paragraphs, bullet points, or numbered lists');
  readabilityScore = Math.min(100, readabilityScore);

  // Engagement score (0-100): CTA and interaction potential
  let engagementScore = 40;
  if (/\?/.test(content)) engagementScore += 15; // Has questions
  if (/save|share|tag|follow|comment|like|double tap|bookmark/i.test(content)) engagementScore += 15;
  if (/dm|reply|tell me|let me know|what do you think/i.test(content)) engagementScore += 10;
  if (/#\w+/.test(content)) engagementScore += 5;
  if (/👇|↓|below|thread/i.test(content)) engagementScore += 5;
  if (/you|your|you're/i.test(content)) engagementScore += 10; // Direct address
  if (engagementScore < 60) suggestions.push('Add a clear call-to-action (question, "save this", "share with someone")');
  engagementScore = Math.min(100, engagementScore);

  // Overall: Weighted average
  const overall = Math.round(hookScore * 0.4 + readabilityScore * 0.3 + engagementScore * 0.3);

  if (overall >= 80) suggestions.unshift('Great content! Minor tweaks could push this to viral territory.');
  else if (overall >= 60) suggestions.unshift('Solid content. Focus on the suggestions below to improve performance.');

  return { overall, hook: hookScore, readability: readabilityScore, engagement: engagementScore, suggestions };
}

// ── Utility ─────────────────────────────────────────────────
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default aiEngine;
