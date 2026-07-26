const prisma = require('./server/prismaClient');

async function main() {
  const blog = await prisma.blog.findFirst({
    where: { title: { contains: 'Aavaram Poo', mode: 'insensitive' } }
  });
  console.log('Aavaram Poo Blog in DB:', JSON.stringify(blog, null, 2));
}

main().finally(() => prisma.$disconnect());
