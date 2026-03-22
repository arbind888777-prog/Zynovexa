const { PrismaClient } = require('@prisma/client');

async function main() {
  const userId = process.argv[2];
  if (!userId) {
    throw new Error('User ID is required');
  }

  const prisma = new PrismaClient();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
    });
    console.log(`Promoted ${userId} to ADMIN`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
