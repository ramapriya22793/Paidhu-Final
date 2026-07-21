const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const imagePath = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\find_your_tribe_1783014663995.png";
    const fileBuffer = fs.readFileSync(imagePath);
    const base64Image = 'data:image/png;base64,' + fileBuffer.toString('base64');

    console.log('Converted Find Your Tribe image to base64, length:', base64Image.length);

    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      let ourCommunityData = settings.ourCommunityData || {};
      
      if (!ourCommunityData.findYourTribe) {
        ourCommunityData.findYourTribe = {};
      }
      
      ourCommunityData.findYourTribe.image = base64Image;

      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          ourCommunityData: ourCommunityData
        }
      });
      console.log('Database updated successfully for Find Your Tribe.');
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
