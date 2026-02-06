import { prisma } from '../lib/prisma';

async function checkLinks() {
  try {
    const links = await prisma.link.findMany({
      include: {
        user: {
          select: { email: true }
        }
      },
    });

    console.log('Total links:', links.length);
    console.log('\nLinks:');
    links.forEach((link, idx) => {
      console.log(`\n${idx + 1}. Platform: "${link.platform}"`);
      console.log(`   URL: ${link.url}`);
      console.log(`   User: ${link.user.email}`);
      console.log(`   Created: ${link.createdAt}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLinks();
