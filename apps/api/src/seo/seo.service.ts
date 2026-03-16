import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeoAnalysisDto, UpdateSeoAnalysisDto, SeoQueryDto } from './dto/seo.dto';

export interface SeoIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SeoSuggestion {
  category: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

@Injectable()
export class SeoService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  async analyzeAndSave(userId: string, dto: CreateSeoAnalysisDto) {
    // Run analysis
    const analysis = this.performAnalysis(dto.url, dto.title, dto.metaDescription, dto.keywords || []);

    return this.prisma.seoAnalysis.create({
      data: {
        userId,
        url: dto.url,
        title: dto.title || '',
        metaDescription: dto.metaDescription || '',
        keywords: dto.keywords || [],
        score: analysis.score,
        issues: analysis.issues as any,
        suggestions: analysis.suggestions as any,
        headings: analysis.headings as any,
        wordCount: analysis.wordCount,
        readabilityScore: analysis.readabilityScore,
        lastCrawledAt: new Date(),
      },
    });
  }

  async getAnalyses(userId: string, query: SeoQueryDto) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const orderBy: any = {};
    switch (query.sortBy) {
      case 'score': orderBy.score = 'desc'; break;
      case 'oldest': orderBy.createdAt = 'asc'; break;
      default: orderBy.createdAt = 'desc';
    }

    const [analyses, total] = await Promise.all([
      this.prisma.seoAnalysis.findMany({
        where: { userId },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.seoAnalysis.count({ where: { userId } }),
    ]);

    return {
      analyses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getAnalysis(id: string, userId: string) {
    const analysis = await this.prisma.seoAnalysis.findFirst({ where: { id, userId } });
    if (!analysis) throw new NotFoundException('SEO analysis not found');
    return analysis;
  }

  async reAnalyze(id: string, userId: string) {
    const existing = await this.getAnalysis(id, userId);
    const analysis = this.performAnalysis(
      existing.url,
      existing.title,
      existing.metaDescription,
      existing.keywords,
    );

    return this.prisma.seoAnalysis.update({
      where: { id },
      data: {
        score: analysis.score,
        issues: analysis.issues as any,
        suggestions: analysis.suggestions as any,
        headings: analysis.headings as any,
        wordCount: analysis.wordCount,
        readabilityScore: analysis.readabilityScore,
        lastCrawledAt: new Date(),
      },
    });
  }

  async deleteAnalysis(id: string, userId: string) {
    await this.getAnalysis(id, userId);
    await this.prisma.seoAnalysis.delete({ where: { id } });
    return { message: 'SEO analysis deleted' };
  }

  // ─── Quick Analyze (no save) ───────────────────────────────────────────────

  quickAnalyze(dto: CreateSeoAnalysisDto) {
    return this.performAnalysis(dto.url, dto.title, dto.metaDescription, dto.keywords || []);
  }

  // ─── SEO Score Overview ────────────────────────────────────────────────────

  async getScoreOverview(userId: string) {
    const analyses = await this.prisma.seoAnalysis.findMany({
      where: { userId },
      select: { score: true, url: true, createdAt: true, issues: true },
      orderBy: { createdAt: 'desc' },
    });

    if (analyses.length === 0) {
      return { averageScore: 0, totalPages: 0, issuesBreakdown: {} };
    }

    const avgScore = +(analyses.reduce((s, a) => s + a.score, 0) / analyses.length).toFixed(1);

    // Score distribution
    const scoreDistribution = {
      excellent: analyses.filter(a => a.score >= 90).length,
      good: analyses.filter(a => a.score >= 70 && a.score < 90).length,
      needsWork: analyses.filter(a => a.score >= 50 && a.score < 70).length,
      poor: analyses.filter(a => a.score < 50).length,
    };

    return {
      averageScore: avgScore,
      totalPages: analyses.length,
      scoreDistribution,
      recentAnalyses: analyses.slice(0, 5),
    };
  }

  // ─── Core Analysis Engine ──────────────────────────────────────────────────

  private performAnalysis(
    url: string,
    title?: string,
    metaDescription?: string,
    keywords: string[] = [],
  ) {
    const issues: SeoIssue[] = [];
    const suggestions: SeoSuggestion[] = [];
    let score = 100;

    // ─── Title Analysis ──────────────────────────────────────────────────
    if (!title || title.length === 0) {
      issues.push({ type: 'error', category: 'title', message: 'Page title is missing', impact: 'high' });
      score -= 25;
    } else if (title.length < 30) {
      issues.push({ type: 'warning', category: 'title', message: `Title too short (${title.length} chars). Aim for 50-60.`, impact: 'medium' });
      score -= 10;
    } else if (title.length > 60) {
      issues.push({ type: 'warning', category: 'title', message: `Title too long (${title.length} chars). May be truncated in search results.`, impact: 'medium' });
      score -= 5;
    }

    // Check keyword in title
    if (title && keywords.length > 0) {
      const titleLower = title.toLowerCase();
      const hasKeyword = keywords.some(k => titleLower.includes(k.toLowerCase()));
      if (!hasKeyword) {
        suggestions.push({ category: 'title', suggestion: 'Include your primary keyword in the title', priority: 'high' });
        score -= 5;
      }
    }

    // ─── Meta Description Analysis ───────────────────────────────────────
    if (!metaDescription || metaDescription.length === 0) {
      issues.push({ type: 'error', category: 'meta', message: 'Meta description is missing', impact: 'high' });
      score -= 20;
    } else if (metaDescription.length < 120) {
      issues.push({ type: 'warning', category: 'meta', message: `Meta description too short (${metaDescription.length} chars). Aim for 150-160.`, impact: 'medium' });
      score -= 5;
    } else if (metaDescription.length > 160) {
      issues.push({ type: 'warning', category: 'meta', message: `Meta description too long (${metaDescription.length} chars). May be truncated.`, impact: 'low' });
      score -= 3;
    }

    // ─── URL Analysis ────────────────────────────────────────────────────
    if (url.length > 75) {
      issues.push({ type: 'warning', category: 'url', message: 'URL is too long. Keep it under 75 characters.', impact: 'low' });
      score -= 3;
    }

    if (/[A-Z]/.test(url)) {
      issues.push({ type: 'info', category: 'url', message: 'URL contains uppercase characters. Use lowercase for consistency.', impact: 'low' });
      score -= 2;
    }

    if (/[_]/.test(url)) {
      suggestions.push({ category: 'url', suggestion: 'Use hyphens (-) instead of underscores (_) in URLs', priority: 'low' });
      score -= 2;
    }

    // ─── Keywords Analysis ───────────────────────────────────────────────
    if (keywords.length === 0) {
      suggestions.push({ category: 'keywords', suggestion: 'Add target keywords for better tracking', priority: 'medium' });
      score -= 5;
    } else if (keywords.length > 10) {
      suggestions.push({ category: 'keywords', suggestion: 'Too many keywords. Focus on 3-5 primary keywords.', priority: 'medium' });
      score -= 3;
    }

    // ─── General Suggestions ─────────────────────────────────────────────
    suggestions.push(
      { category: 'content', suggestion: 'Add structured data (Schema.org) for rich snippets', priority: 'medium' },
      { category: 'performance', suggestion: 'Ensure page loads in under 3 seconds', priority: 'high' },
      { category: 'mobile', suggestion: 'Verify mobile-friendliness with Google Mobile Test', priority: 'high' },
    );

    // Estimate word count and readability
    const wordCount = (metaDescription || '').split(/\s+/).filter(Boolean).length + (title || '').split(/\s+/).filter(Boolean).length;
    const readabilityScore = this.calculateReadability(title, metaDescription);

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      issues,
      suggestions,
      headings: { h1: title ? 1 : 0, h2: 0, h3: 0 },
      wordCount,
      readabilityScore,
      grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 50 ? 'D' : 'F',
    };
  }

  private calculateReadability(title?: string, description?: string): number {
    const text = `${title || ''} ${description || ''}`.trim();
    if (!text) return 0;

    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
    const syllables = text.split(/[aeiouy]+/i).length - 1;

    // Simplified Flesch Reading Ease
    const flesch = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.max(0, Math.min(100, +flesch.toFixed(1)));
  }
}
