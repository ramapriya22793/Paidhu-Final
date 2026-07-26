const prisma = require('./server/prismaClient');

async function main() {
  const blogs = await prisma.blog.findMany({
    where: { title: { contains: 'Aavaram', mode: 'insensitive' } }
  });
  console.log('Found Aavaram blogs count:', blogs.length);
  blogs.forEach(b => {
    console.log(`ID: ${b.id}, Title: "${b.title}", Image: "${b.image}"`);
  });
}

main().finally(() => prisma.$disconnect());
