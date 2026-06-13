const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function drop() {
  try {
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    await prisma.$executeRawUnsafe('DROP TABLE CartItem;');
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('CartItem table dropped successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

drop();
