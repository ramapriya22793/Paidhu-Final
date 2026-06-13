const prisma = require("../prismaClient");

async function check() {
  try {
    const banners = await prisma.banner.findMany();
    console.log("=== BANNERS IN DB ===");
    console.log(JSON.stringify(banners, null, 2));
  } catch (err) {
    console.error("Error querying Banner table:", err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
