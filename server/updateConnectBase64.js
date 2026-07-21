const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const img1Path = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\connect_recipes_1783014880897.png";
    const img2Path = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\connect_meet_1783014892861.png";
    const img3Path = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\connect_tasting_1783014905982.png";

    const base64Img1 = 'data:image/png;base64,' + fs.readFileSync(img1Path).toString('base64');
    const base64Img2 = 'data:image/png;base64,' + fs.readFileSync(img2Path).toString('base64');
    const base64Img3 = 'data:image/png;base64,' + fs.readFileSync(img3Path).toString('base64');

    console.log('Loaded all 3 base64 images successfully.');

    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      let ourCommunityData = settings.ourCommunityData || {};
      
      // Default structure if it doesn't exist
      if (!ourCommunityData.connect || !Array.isArray(ourCommunityData.connect)) {
        ourCommunityData.connect = [
          { id: 1, text: 'Share experiences, recipes and wellness insights' },
          { id: 2, text: 'Meet fellow enthusiasts in your city' },
          { id: 3, text: 'Get invited to exclusive meet-ups and tasting sessions' }
        ];
      }

      // Update the images
      ourCommunityData.connect[0].image = base64Img1;
      ourCommunityData.connect[1].image = base64Img2;
      ourCommunityData.connect[2].image = base64Img3;

      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          ourCommunityData: ourCommunityData
        }
      });
      console.log('Database updated successfully for Connect section.');
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
