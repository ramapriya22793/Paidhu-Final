const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reset() {
  await prisma.siteSettings.updateMany({
    data: {
      aboutUsData: null
    }
  });
  console.log("Reset aboutUsData to null");
  process.exit(0);
}

reset();
