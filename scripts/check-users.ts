import { prisma } from '../lib/prisma';

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        links: true,
      },
    });

    console.log('Total users:', users.length);
    console.log('\nUsers:');
    users.forEach((user, idx) => {
      console.log(`\n${idx + 1}. User ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Has Profile: ${!!user.profile}`);
      if (user.profile) {
        console.log(`   Profile ID: ${user.profile.id}`);
        console.log(`   Name: ${user.profile.firstName} ${user.profile.lastName}`);
      }
      console.log(`   Links: ${user.links.length}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
