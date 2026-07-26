const prisma = require('./server/prismaClient');

async function main() {
  const blogs = await prisma.blog.findMany({
    where: { title: { contains: 'Chamomile', mode: 'insensitive' } },
    select: { id: true, title: true, image: true, featuredImage: true }
  });
  console.log(JSON.stringify(blogs, null, 2));
}

main().finally(() => prisma.$disconnect());
