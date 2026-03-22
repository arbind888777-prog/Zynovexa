import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrustService {
  constructor(private prisma: PrismaService) {}

  // ── Testimonials ──────────────────────────────────────────

  async getApprovedTestimonials(featured?: boolean) {
    // Use raw query since these tables may not be in Prisma schema yet
    const where = featured
      ? `WHERE approved = true AND featured = true`
      : `WHERE approved = true`;

    return this.prisma.$queryRawUnsafe(`
      SELECT id, name, avatar_url, role, company, platform,
             result_text, before_followers, after_followers,
             before_engagement, after_engagement, growth_percentage,
             video_url, rating, created_at
      FROM testimonials ${where}
      ORDER BY created_at DESC LIMIT 20
    `);
  }

  async createTestimonial(data: {
    name: string;
    avatarUrl?: string;
    role?: string;
    company?: string;
    platform?: string;
    resultText: string;
    beforeFollowers?: number;
    afterFollowers?: number;
    beforeEngagement?: number;
    afterEngagement?: number;
    videoUrl?: string;
    rating?: number;
    featured?: boolean;
  }) {
    const growth =
      data.beforeFollowers && data.beforeFollowers > 0
        ? (((data.afterFollowers ?? 0) - data.beforeFollowers) / data.beforeFollowers) * 100
        : 0;

    return this.prisma.$executeRawUnsafe(
      `INSERT INTO testimonials (name, avatar_url, role, company, platform, result_text,
        before_followers, after_followers, before_engagement, after_engagement,
        growth_percentage, video_url, rating, featured, approved)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,false)`,
      data.name,
      data.avatarUrl ?? '',
      data.role ?? '',
      data.company ?? '',
      data.platform ?? '',
      data.resultText,
      data.beforeFollowers ?? 0,
      data.afterFollowers ?? 0,
      data.beforeEngagement ?? 0,
      data.afterEngagement ?? 0,
      Math.round(growth * 10) / 10,
      data.videoUrl ?? '',
      data.rating ?? 5,
      data.featured ?? false,
    );
  }

  async approveTestimonial(id: string) {
    return this.prisma.$executeRawUnsafe(
      `UPDATE testimonials SET approved = true WHERE id = $1`,
      id,
    );
  }

  // ── Case Studies ──────────────────────────────────────────

  async getPublishedCaseStudies() {
    const rows: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT id, title, niche, duration_days,
             before_metrics, after_metrics, strategy_used, tools_used,
             growth_followers, growth_engagement, growth_revenue,
             created_at
      FROM case_studies WHERE published = true
      ORDER BY created_at DESC LIMIT 10
    `);

    return rows.map((s) => ({
      ...s,
      beforeMetrics: typeof s.before_metrics === 'string' ? JSON.parse(s.before_metrics) : s.before_metrics,
      afterMetrics: typeof s.after_metrics === 'string' ? JSON.parse(s.after_metrics) : s.after_metrics,
      toolsUsed: typeof s.tools_used === 'string' ? JSON.parse(s.tools_used) : s.tools_used,
      growthPercentage: this.calculateGrowth(
        typeof s.before_metrics === 'string' ? JSON.parse(s.before_metrics) : s.before_metrics,
        typeof s.after_metrics === 'string' ? JSON.parse(s.after_metrics) : s.after_metrics,
      ),
    }));
  }

  async createCaseStudy(data: {
    title: string;
    niche?: string;
    durationDays?: number;
    beforeMetrics?: Record<string, number>;
    afterMetrics?: Record<string, number>;
    strategyUsed?: string;
    toolsUsed?: string[];
    growthFollowers?: number;
    growthEngagement?: number;
    growthRevenue?: number;
  }) {
    return this.prisma.$executeRawUnsafe(
      `INSERT INTO case_studies (title, niche, duration_days, before_metrics, after_metrics,
        strategy_used, tools_used, growth_followers, growth_engagement, growth_revenue, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,false)`,
      data.title,
      data.niche ?? '',
      data.durationDays ?? 30,
      JSON.stringify(data.beforeMetrics ?? {}),
      JSON.stringify(data.afterMetrics ?? {}),
      data.strategyUsed ?? '',
      JSON.stringify(data.toolsUsed ?? []),
      data.growthFollowers ?? 0,
      data.growthEngagement ?? 0,
      data.growthRevenue ?? 0,
    );
  }

  // ── Roadmap ───────────────────────────────────────────────

  async getRoadmap() {
    const items: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT id, title, description, category, status, votes, target_date, released_at
      FROM roadmap_items ORDER BY priority DESC, votes DESC
    `);

    return {
      planned: items.filter((i) => i.status === 'planned'),
      in_progress: items.filter((i) => i.status === 'in_progress'),
      released: items.filter((i) => i.status === 'released'),
    };
  }

  async voteOnRoadmapItem(id: string) {
    return this.prisma.$executeRawUnsafe(
      `UPDATE roadmap_items SET votes = votes + 1 WHERE id = $1`,
      id,
    );
  }

  async createRoadmapItem(data: {
    title: string;
    description?: string;
    category?: string;
    status?: string;
    priority?: number;
    targetDate?: string;
  }) {
    return this.prisma.$executeRawUnsafe(
      `INSERT INTO roadmap_items (title, description, category, status, priority, target_date)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      data.title,
      data.description ?? '',
      data.category ?? 'feature',
      data.status ?? 'planned',
      data.priority ?? 0,
      data.targetDate ?? '',
    );
  }

  async updateRoadmapItem(id: string, data: Partial<{ title: string; description: string; status: string; priority: number }>) {
    const released = data.status === 'released' ? new Date().toISOString() : null;
    return this.prisma.$executeRawUnsafe(
      `UPDATE roadmap_items SET title = COALESCE($2, title), description = COALESCE($3, description),
       status = COALESCE($4, status), priority = COALESCE($5, priority),
       released_at = COALESCE($6, released_at) WHERE id = $1`,
      id,
      data.title ?? null,
      data.description ?? null,
      data.status ?? null,
      data.priority ?? null,
      released,
    );
  }

  // ── Helpers ───────────────────────────────────────────────

  private calculateGrowth(before: Record<string, number>, after: Record<string, number>) {
    const metrics: Record<string, string> = {};
    for (const key of Object.keys(after)) {
      if (before[key] && before[key] > 0) {
        metrics[key] = ((after[key] - before[key]) / before[key] * 100).toFixed(1) + '%';
      }
    }
    return metrics;
  }
}
