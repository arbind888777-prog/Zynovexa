import { PrismaClient, Role, Plan } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Zynovexa database...');

  const hash = async (pw: string) => bcrypt.hash(pw, 12);

  // ── Admin user ─────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zynovexa.ai' },
    update: {},
    create: {
      email: 'admin@zynovexa.ai',
      password: await hash('admin123'),
      name: 'Zynovexa Admin',
      role: Role.ADMIN,
      plan: Plan.BUSINESS,
      isVerified: true,
      isActive: true,
      bio: 'Platform administrator',
      subscription: {
        create: { plan: Plan.BUSINESS, status: 'ACTIVE', currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      },
    },
  });

  // ── Demo Pro user ───────────────────────────────────────────────
  const demo = await prisma.user.upsert({
    where: { email: 'demo@zynovexa.com' },
    update: {},
    create: {
      email: 'demo@zynovexa.com',
      password: await hash('demo123'),
      name: 'Demo Creator',
      role: Role.USER,
      plan: Plan.PRO,
      isVerified: true,
      isActive: true,
      bio: 'Content creator & digital marketer 🚀',
      website: 'https://zynovexa.com',
      onboardingCompleted: true,
      subscription: {
        create: { plan: Plan.PRO, status: 'ACTIVE', currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      },
      socialAccounts: {
        create: [
          { platform: 'INSTAGRAM', handle: '@democreator', displayName: 'Demo Creator', accessToken: 'dummy_token', followersCount: 12400 },
          { platform: 'YOUTUBE', handle: 'DemoCreatorYT', displayName: 'Demo Creator YT', accessToken: 'dummy_token', followersCount: 8200 },
          { platform: 'TIKTOK', handle: '@democreator', displayName: 'Demo Creator', accessToken: 'dummy_token', followersCount: 31500 },
        ],
      },
    },
  });

  // ── Sample posts ────────────────────────────────────────────────
  await prisma.post.createMany({
    skipDuplicates: true,
    data: [
      { userId: demo.id, title: 'Morning Motivation', caption: 'Rise and grind! ☀️ Start your day with purpose and passion. What\'s your morning routine? #motivation #creator #productivity', platforms: ['INSTAGRAM', 'TIKTOK'], status: 'PUBLISHED', mediaType: 'IMAGE', hashtags: ['motivation', 'creator', 'productivity'], viralScore: 78 },
      { userId: demo.id, title: 'Content Creation Tips 2025', caption: 'Top 5 tips to grow your audience in 2025 🚀 Consistency is key! Drop a 🔥 if you found this helpful!', platforms: ['YOUTUBE', 'INSTAGRAM'], status: 'PUBLISHED', mediaType: 'VIDEO', hashtags: ['contentcreator', 'tips2025', 'grow'], viralScore: 91 },
      { userId: demo.id, title: 'Weekly Vlog Coming Soon', caption: 'Behind the scenes of a full content week! 🎬 Dropping this Friday — stay tuned!', platforms: ['YOUTUBE', 'INSTAGRAM', 'TIKTOK'], status: 'SCHEDULED', mediaType: 'VIDEO', hashtags: ['vlog', 'behindthescenes', 'creator'], scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), viralScore: 65 },
      { userId: demo.id, title: 'Product Review Draft', caption: 'Honest review of the new DJI drone 🚁', platforms: ['YOUTUBE'], status: 'DRAFT', mediaType: 'VIDEO', hashtags: ['review', 'drone', 'dji'], viralScore: 45 },
    ],
  });

  // ── Sample analytics ────────────────────────────────────────────
  const platforms = ['INSTAGRAM', 'YOUTUBE', 'TIKTOK'] as const;
  const metrics = ['impressions', 'engagements', 'reach', 'clicks'];

  for (let i = 30; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    for (const platform of platforms) {
      for (const metric of metrics) {
        const base = metric === 'impressions' ? 5000 : metric === 'reach' ? 3500 : metric === 'engagements' ? 200 : 50;
        await prisma.analytics.create({
          data: { userId: demo.id, platform: platform as any, metricName: metric, metricValue: Math.floor(base * (0.7 + Math.random() * 0.6)), createdAt: date },
        });
      }
    }
  }

  // ── Sample notifications ────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { userId: demo.id, title: 'Welcome to Zynovexa! 🎉', message: 'Your Pro plan is active. Explore AI tools, analytics, and more!', type: 'SUCCESS' },
      { userId: demo.id, title: 'Post Scheduled', message: 'Your "Weekly Vlog Coming Soon" post is scheduled for Friday.', type: 'INFO' },
      { userId: demo.id, title: 'Viral Score Alert 🔥', message: 'Content Creation Tips 2025 has a viral score of 91! Boost it now.', type: 'INFO' },
    ],
  });

  console.log('✅ Seed complete');
  console.log('─────────────────────────────────────────');
  console.log('👤 Admin:  admin@zynovexa.ai  / admin123');
  console.log('👤 Demo:   demo@zynovexa.com  / demo123');
  console.log('─────────────────────────────────────────');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
