// ============================================================
// Zynovexa - SEO Tools API Routes
// Keyword research, SEO score, meta optimizer, tag generator
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const seo = new Hono<{ Bindings: Bindings; Variables: Variables }>();

seo.use('*', authMiddleware);

// POST /api/seo/analyze — Analyze title, description, tags for SEO score
seo.post('/analyze', async (c) => {
  try {
    const userId = c.get('userId');
    const { title, description, tags, platform } = await c.req.json();
    
    if (!title) return c.json(apiError('Title is required'), 400);
    
    // === SEO Scoring Engine ===
    let score = 0;
    const suggestions: string[] = [];
    const checks: { label: string; pass: boolean; detail: string }[] = [];

    // 1. Title length (YouTube ideal: 50-70 chars)
    const titleLen = (title || '').length;
    if (titleLen >= 40 && titleLen <= 70) {
      score += 20; checks.push({ label: 'Title Length', pass: true, detail: titleLen + ' chars — optimal range (40-70)' });
    } else if (titleLen > 0 && titleLen < 40) {
      score += 10; checks.push({ label: 'Title Length', pass: false, detail: titleLen + ' chars — too short, aim for 40-70' });
      suggestions.push('Lengthen your title to 40-70 characters for better search ranking.');
    } else if (titleLen > 70) {
      score += 8; checks.push({ label: 'Title Length', pass: false, detail: titleLen + ' chars — will be truncated in search results' });
      suggestions.push('Shorten your title to under 70 characters to avoid truncation.');
    } else {
      checks.push({ label: 'Title Length', pass: false, detail: 'No title entered' });
    }

    // 2. Title has number/power word
    const hasNumber = /\d/.test(title);
    const powerWords = ['how to', 'best', 'top', 'ultimate', 'complete', 'guide', 'secret', 'proven', 'easy', 'free', 'new', 'amazing', 'tips', 'tricks', 'review', 'vs', 'tutorial'];
    const hasPowerWord = powerWords.some(w => title.toLowerCase().includes(w));
    if (hasNumber || hasPowerWord) {
      score += 15; checks.push({ label: 'Title Power', pass: true, detail: 'Contains ' + (hasNumber ? 'numbers' : '') + (hasNumber && hasPowerWord ? ' & ' : '') + (hasPowerWord ? 'power words' : '') });
    } else {
      score += 5; checks.push({ label: 'Title Power', pass: false, detail: 'No numbers or power words found' });
      suggestions.push('Add numbers (e.g., "5 Tips") or power words (e.g., "Ultimate Guide") to boost CTR.');
    }

    // 3. Description length (YouTube ideal: 200-5000 chars, first 150 visible)
    const descLen = (description || '').length;
    if (descLen >= 200) {
      score += 20; checks.push({ label: 'Description', pass: true, detail: descLen + ' chars — good detail' });
    } else if (descLen >= 50) {
      score += 10; checks.push({ label: 'Description', pass: false, detail: descLen + ' chars — add more detail (aim for 200+)' });
      suggestions.push('Expand your description to 200+ characters. Include keywords naturally in the first 2 lines.');
    } else {
      score += 0; checks.push({ label: 'Description', pass: false, detail: descLen + ' chars — too short or empty' });
      suggestions.push('Write a detailed description (200+ chars) with keywords in the first 2 lines.');
    }

    // 4. Description has links/timestamps
    const hasLinks = /(https?:\/\/|www\.)/.test(description || '');
    const hasTimestamps = /\d{1,2}:\d{2}/.test(description || '');
    if (hasTimestamps) {
      score += 5; checks.push({ label: 'Timestamps', pass: true, detail: 'Timestamps found — helps YouTube create chapters' });
    } else {
      checks.push({ label: 'Timestamps', pass: false, detail: 'No timestamps detected' });
      suggestions.push('Add timestamps (e.g., 0:00 Intro, 1:30 Topic) for YouTube chapters and better SEO.');
    }

    // 5. Tags
    const tagList: string[] = Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean);
    if (tagList.length >= 5 && tagList.length <= 15) {
      score += 15; checks.push({ label: 'Tags', pass: true, detail: tagList.length + ' tags — optimal (5-15)' });
    } else if (tagList.length >= 1) {
      score += 8; checks.push({ label: 'Tags', pass: false, detail: tagList.length + ' tags — ' + (tagList.length < 5 ? 'add more' : 'too many, keep under 15') });
      suggestions.push(tagList.length < 5 ? 'Add more tags (5-15 recommended) mixing broad + niche keywords.' : 'Reduce tags to 15 or fewer. Focus on most relevant.');
    } else {
      checks.push({ label: 'Tags', pass: false, detail: 'No tags added' });
      suggestions.push('Add 5-15 relevant tags mixing broad keywords and niche-specific terms.');
    }

    // 6. Keyword in title AND description
    const titleWords = title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
    const descLower = (description || '').toLowerCase();
    const keywordMatch = titleWords.some((w: string) => descLower.includes(w));
    if (keywordMatch && descLen > 50) {
      score += 10; checks.push({ label: 'Keyword Match', pass: true, detail: 'Title keywords found in description' });
    } else {
      score += 3; checks.push({ label: 'Keyword Match', pass: false, detail: 'Title keywords not found in description' });
      suggestions.push('Include your main title keywords naturally in the description for SEO consistency.');
    }

    // 7. First-line hook
    const firstLine = (description || '').split('\n')[0] || '';
    if (firstLine.length >= 50 && firstLine.length <= 160) {
      score += 10; checks.push({ label: 'Hook Line', pass: true, detail: 'First line has good length for search preview' });
    } else {
      score += 3; checks.push({ label: 'Hook Line', pass: false, detail: 'First line should be 50-160 chars (search preview)' });
      suggestions.push('Make the first line of description 50-160 chars — this shows in YouTube search results.');
    }

    // 8. CTA presence
    const ctaWords = ['subscribe', 'like', 'comment', 'share', 'follow', 'click', 'link', 'watch'];
    const hasCTA = ctaWords.some(w => (description || '').toLowerCase().includes(w));
    if (hasCTA) {
      score += 5; checks.push({ label: 'Call to Action', pass: true, detail: 'CTA found in description' });
    } else {
      checks.push({ label: 'Call to Action', pass: false, detail: 'No CTA detected' });
      suggestions.push('Add a call-to-action (Subscribe, Like, Comment) in your description.');
    }

    score = Math.min(100, score);
    const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';

    // Log AI usage
    await c.env.DB.prepare(
      'INSERT INTO ai_requests (id, user_id, request_type, input_text, output_text, tokens_used, model) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(generateId('ai'), userId, 'seo_analyze', title, JSON.stringify({ score, grade }), 50, 'seo-engine').run();

    return c.json(apiSuccess({ score, grade, checks, suggestions }));
  } catch (e: any) {
    return c.json(apiError(e.message || 'SEO analysis failed'), 500);
  }
});

// POST /api/seo/keywords — AI keyword research
seo.post('/keywords', async (c) => {
  try {
    const userId = c.get('userId');
    const { topic, platform } = await c.req.json();
    if (!topic) return c.json(apiError('Topic is required'), 400);

    const topicLower = topic.toLowerCase();
    // Simulated keyword research engine (production: YouTube Data API + Google Trends)
    const baseKeywords = topicLower.split(/\s+/).filter((w: string) => w.length > 2);
    
    const keywords = [
      { keyword: topic, volume: Math.floor(Math.random() * 50000) + 10000, competition: 'high', cpc: (Math.random() * 3 + 0.5).toFixed(2), trend: 'up' },
      { keyword: 'how to ' + topic, volume: Math.floor(Math.random() * 30000) + 5000, competition: 'medium', cpc: (Math.random() * 2 + 0.3).toFixed(2), trend: 'up' },
      { keyword: topic + ' tutorial', volume: Math.floor(Math.random() * 20000) + 3000, competition: 'medium', cpc: (Math.random() * 2 + 0.2).toFixed(2), trend: 'stable' },
      { keyword: topic + ' for beginners', volume: Math.floor(Math.random() * 15000) + 2000, competition: 'low', cpc: (Math.random() * 1.5 + 0.1).toFixed(2), trend: 'up' },
      { keyword: 'best ' + topic, volume: Math.floor(Math.random() * 25000) + 4000, competition: 'high', cpc: (Math.random() * 4 + 1).toFixed(2), trend: 'stable' },
      { keyword: topic + ' tips', volume: Math.floor(Math.random() * 18000) + 3000, competition: 'low', cpc: (Math.random() * 1 + 0.1).toFixed(2), trend: 'up' },
      { keyword: topic + ' 2026', volume: Math.floor(Math.random() * 12000) + 2000, competition: 'low', cpc: (Math.random() * 1.5 + 0.2).toFixed(2), trend: 'up' },
      { keyword: topic + ' vs', volume: Math.floor(Math.random() * 10000) + 1500, competition: 'medium', cpc: (Math.random() * 2.5 + 0.5).toFixed(2), trend: 'stable' },
      { keyword: topic + ' review', volume: Math.floor(Math.random() * 15000) + 2500, competition: 'medium', cpc: (Math.random() * 3 + 0.8).toFixed(2), trend: 'down' },
      { keyword: topic + ' guide complete', volume: Math.floor(Math.random() * 8000) + 1000, competition: 'low', cpc: (Math.random() * 1 + 0.1).toFixed(2), trend: 'up' },
    ];

    // Related topics
    const related = [
      topic + ' alternatives', topic + ' mistakes', topic + ' course',
      topic + ' tools', topic + ' examples', topic + ' strategy'
    ];

    // Trending queries
    const trending = [
      'AI ' + topic, topic + ' automation', topic + ' with ChatGPT',
      topic + ' no experience', topic + ' free'
    ];

    await c.env.DB.prepare(
      'INSERT INTO ai_requests (id, user_id, request_type, input_text, output_text, tokens_used, model) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(generateId('ai'), userId, 'seo_keywords', topic, JSON.stringify(keywords.slice(0, 3)), 80, 'seo-engine').run();

    return c.json(apiSuccess({ keywords, related_topics: related, trending_queries: trending }));
  } catch (e: any) {
    return c.json(apiError(e.message || 'Keyword research failed'), 500);
  }
});

// POST /api/seo/generate-tags — AI tag generation from title/description
seo.post('/generate-tags', async (c) => {
  try {
    const { title, description } = await c.req.json();
    if (!title) return c.json(apiError('Title is required'), 400);
    
    const words = (title + ' ' + (description || '')).toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w: string) => w.length > 3);
    const unique = [...new Set(words)];
    
    const tags: string[] = [];
    // Main keyword
    tags.push(title.toLowerCase().replace(/[^a-z0-9\\s]/g, '').trim());
    // Individual words
    unique.slice(0, 5).forEach((w: string) => tags.push(w));
    // Combinations
    if (unique.length >= 2) tags.push(unique[0] + ' ' + unique[1]);
    if (unique.length >= 3) tags.push(unique[1] + ' ' + unique[2]);
    // Common additions
    const additions = ['tutorial', 'how to', '2026', 'tips', 'guide', 'beginner', 'explained'];
    additions.forEach(a => { if (!tags.some(t => t.includes(a))) tags.push(unique[0] + ' ' + a); });
    
    return c.json(apiSuccess({ tags: [...new Set(tags)].slice(0, 15) }));
  } catch (e: any) {
    return c.json(apiError(e.message || 'Tag generation failed'), 500);
  }
});

// POST /api/seo/optimize-title — AI title optimization suggestions
seo.post('/optimize-title', async (c) => {
  try {
    const { title } = await c.req.json();
    if (!title) return c.json(apiError('Title is required'), 400);
    
    const base = title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const variations = [
      `How to ${base} (Complete Guide 2026)`,
      `${base} — ${Math.floor(Math.random() * 5) + 5} Tips That Actually Work`,
      `The Ultimate ${base} Tutorial for Beginners`,
      `I Tried ${base} for 30 Days — Here's What Happened`,
      `${base}: Everything You Need to Know in ${new Date().getFullYear()}`,
      `Stop Making These ${base} Mistakes (Do This Instead)`,
      `${base} Explained in ${Math.floor(Math.random() * 5) + 5} Minutes`,
      `Why ${base} Is Changing Everything in 2026`
    ];
    
    return c.json(apiSuccess({ original: title, suggestions: variations }));
  } catch (e: any) {
    return c.json(apiError(e.message || 'Title optimization failed'), 500);
  }
});

export default seo;
