const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const imagePaths = [
      "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\nourish_1_1783016211546.png",
      "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\nourish_2_1783016228818.png",
      "C:\\Users\\admin\\.gemini\\antigravity\\brain\\3b0c3540-ab76-4b49-b204-35ea358f5c54\\nourish_3_1783016239432.png"
    ];

    const base64Images = imagePaths.map(imgPath => {
      const fileData = fs.readFileSync(imgPath);
      return `data:image/png;base64,${fileData.toString('base64')}`;
    });

    console.log("Converted images to base64. Updating DB...");

    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      console.error("Settings not found");
      return;
    }

    const currentData = settings.ourCommunityData || {};

    const texts = [
      'Help your family develop a positive relationship with wellness',
      'Get easy, healthy and yummy floral recipes',
      'Tips on how to make healthy eating easy and delicious'
    ];

    currentData.nourish = base64Images.map((b64, index) => ({
      id: index + 1,
      image: b64,
      text: texts[index]
    }));

    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: { ourCommunityData: currentData }
    });

    console.log("Database updated successfully with base64 nourish images!");
  } catch (error) {
    console.error("Error updating database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
