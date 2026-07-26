const prisma = require('./server/prismaClient');

async function main() {
  const blogs = await prisma.blog.findMany({
    where: {
      title: { contains: 'Aavaram', mode: 'insensitive' }
    }
  });

  console.log('Found Aavaram blogs:', JSON.stringify(blogs, null, 2));
}

main().finally(() => prisma.$disconnect());
