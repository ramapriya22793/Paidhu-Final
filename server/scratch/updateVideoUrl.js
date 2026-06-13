const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    const updated = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        videoUrl: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Landing%20-%20Videos/Videos.mp4"
      }
    });
    console.log("Updated SiteSettings in DB:", JSON.stringify(updated, null, 2));
  } else {
    console.error("No SiteSettings found in DB to update.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
