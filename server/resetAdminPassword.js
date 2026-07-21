process.env.DATABASE_URL = "postgresql://postgres.szgqtggokqqaoomryljr:Paidhu%4022793@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function run() {
  try {
    const hashedPassword = await bcrypt.hash("Paidhu2026", 10);
    const updated = await prisma.user.update({
      where: { email: "ecompaidhu@gmail.com" },
      data: { password: hashedPassword }
    });
    console.log("Successfully reset admin password in database for ecompaidhu@gmail.com!");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
