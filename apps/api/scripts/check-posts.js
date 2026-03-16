const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const scheduled = await p.post.findMany({
    where: { status: 'SCHEDULED' },
    select: { id: true, title: true, caption: true, status: true, scheduledAt: true, platforms: true, mediaType: true, mediaUrls: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  console.log('=== SCHEDULED POSTS ===');
  console.log(JSON.stringify(scheduled, null, 2));

  const drafts = await p.post.findMany({
    where: { status: 'DRAFT' },
    select: { id: true, title: true, caption: true, status: true, scheduledAt: true, publishResults: true, platforms: true, mediaType: true, createdAt: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 5,
  });
  console.log('\n=== RECENT DRAFTS ===');
  console.log(JSON.stringify(drafts, null, 2));

  const failed = await p.post.findMany({
    where: { status: 'FAILED' },
    select: { id: true, title: true, caption: true, status: true, scheduledAt: true, publishResults: true, platforms: true, mediaType: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.log('\n=== FAILED POSTS ===');
  console.log(JSON.stringify(failed, null, 2));

  console.log('\nNow:', new Date().toISOString());
  await p.$disconnect();
})();
