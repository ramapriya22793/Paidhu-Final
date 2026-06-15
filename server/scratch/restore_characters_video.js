const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    const updated = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        videoUrl: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/starting-floral-food-habitat/WhatsApp%20Video%202026-06-15%20at%2012.39.48%20PM.mp4"
      }
    });
    console.log("Updated SiteSettings in DB successfully!");
    console.log({
      id: updated.id,
      videoUrl: updated.videoUrl,
      videoTitle: updated.videoTitle
    });
  } else {
    console.error("No SiteSettings found in DB to update.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
