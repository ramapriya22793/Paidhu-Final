const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      console.log('No settings found. Creating one...');
      settings = await prisma.siteSettings.create({
        data: {}
      });
    }

    let ourCommunityData = settings.ourCommunityData || {};
    
    // Default structure if it doesn't exist
    if (!ourCommunityData.hero) {
      ourCommunityData.hero = {
        image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop',
        title: 'WELCOME TO THE PAIDHU COMMUNITY!',
        subtitle: 'Your supportive space for elegant living and floral wellness, together.'
      };
    }

    ourCommunityData.hero.image = '/hero_family.png';

    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        ourCommunityData: ourCommunityData
      }
    });

    console.log('Successfully updated the database!');
  } catch (error) {
    console.error('Error updating the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
