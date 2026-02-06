import { prisma } from '../lib/prisma';

async function deleteAllLinks() {
  try {
    const result = await prisma.link.deleteMany({});
    console.log(`✅ Deleted all ${result.count} links from database`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllLinks();
