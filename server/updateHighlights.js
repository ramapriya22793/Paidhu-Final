const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const imgPath = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\community_highlights_1783016464589.png";
    const base64Img = 'data:image/png;base64,' + fs.readFileSync(imgPath).toString('base64');

    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      console.error("Settings not found");
      return;
    }

    const currentData = settings.ourCommunityData || {};
    currentData.highlights = {
      image: base64Img,
      videoUrl: "" // Removed video URL
    };

    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: { ourCommunityData: currentData }
    });

    console.log("Database updated successfully with highlights image!");
  } catch (error) {
    console.error("Error updating database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
