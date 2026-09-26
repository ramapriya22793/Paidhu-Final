const prisma = require('./server/prismaClient');

async function main() {
  try {
    const adminUsers = await prisma.user.findMany({
      where: { isAdmin: true }
    });
    console.log('ADMIN USERS IN DB:', adminUsers.map(u => ({ id: u.id, email: u.email, role: u.role, isAdmin: u.isAdmin })));

    try {
      const history = await prisma.loginHistory.findMany({ take: 5 });
      console.log('LOGIN HISTORY WORKS! Count:', history.length);
    } catch (hErr) {
      console.error('LOGIN HISTORY ERROR:', hErr.message);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
