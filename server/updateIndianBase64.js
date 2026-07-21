const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const heroPath = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\indian_hero_1783015053311.png";
    const tribePath = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\indian_tribe_1783015066030.png";
    const recipePath = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\indian_recipes_1783015076782.png";
    const meetPath = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\indian_meet_1783015087425.png";
    const tastingPath = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\indian_tasting_1783015097704.png";

    const base64Hero = 'data:image/png;base64,' + fs.readFileSync(heroPath).toString('base64');
    const base64Tribe = 'data:image/png;base64,' + fs.readFileSync(tribePath).toString('base64');
    const base64Recipe = 'data:image/png;base64,' + fs.readFileSync(recipePath).toString('base64');
    const base64Meet = 'data:image/png;base64,' + fs.readFileSync(meetPath).toString('base64');
    const base64Tasting = 'data:image/png;base64,' + fs.readFileSync(tastingPath).toString('base64');

    console.log('Loaded all 5 base64 Indian images successfully.');

    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      let ourCommunityData = settings.ourCommunityData || {};
      
      // Update Hero
      if (!ourCommunityData.hero) ourCommunityData.hero = {};
      ourCommunityData.hero.image = base64Hero;
      
      // Update Tribe
      if (!ourCommunityData.findYourTribe) ourCommunityData.findYourTribe = {};
      ourCommunityData.findYourTribe.image = base64Tribe;

      // Update Connect
      if (!ourCommunityData.connect || !Array.isArray(ourCommunityData.connect)) {
        ourCommunityData.connect = [
          { id: 1, text: 'Share experiences, recipes and wellness insights' },
          { id: 2, text: 'Meet fellow enthusiasts in your city' },
          { id: 3, text: 'Get invited to exclusive meet-ups and tasting sessions' }
        ];
      }
      ourCommunityData.connect[0].image = base64Recipe;
      ourCommunityData.connect[1].image = base64Meet;
      ourCommunityData.connect[2].image = base64Tasting;

      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          ourCommunityData: ourCommunityData
        }
      });
      console.log('Database updated successfully for all 5 Indian images.');
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
