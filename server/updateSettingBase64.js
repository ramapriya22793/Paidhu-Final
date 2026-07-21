const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const imagePath = path.join(__dirname, '..', 'frontend', 'public', 'hero_family.png');
    const fileBuffer = fs.readFileSync(imagePath);
    const base64Image = 'data:image/png;base64,' + fileBuffer.toString('base64');

    console.log('Converted image to base64, length:', base64Image.length);

    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      let ourCommunityData = settings.ourCommunityData || {};
      
      if (!ourCommunityData.hero) {
        ourCommunityData.hero = {};
      }
      
      ourCommunityData.hero.image = base64Image;

      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          ourCommunityData: ourCommunityData
        }
      });
      console.log('Database updated successfully with base64 image.');
    } else {
        console.log('Settings not found in DB!');
    }

  } catch (error) {
    console.error('Error in script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
