import { prisma } from '../lib/prisma';

async function cleanupLinks() {
  try {
    // Delete links with empty platform or empty URL
    const result = await prisma.link.deleteMany({
      where: {
        OR: [
          { platform: '' },
          { url: '' },
        ]
      }
    });

    console.log(`✅ Cleaned up ${result.count} invalid links`);
    
    // Show remaining links
    const remainingLinks = await prisma.link.findMany({
      include: {
        user: {
          select: { email: true }
        }
      },
    });

    console.log(`\n📋 Remaining links: ${remainingLinks.length}`);
    remainingLinks.forEach((link, idx) => {
      console.log(`\n${idx + 1}. Platform: ${link.platform}`);
      console.log(`   URL: ${link.url}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupLinks();
