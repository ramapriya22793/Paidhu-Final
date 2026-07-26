const prisma = require('./server/prismaClient');

async function main() {
  const blogs = await prisma.blog.findMany({ select: { id: true, title: true, image: true } });
  console.log(`Total blogs: ${blogs.length}`);
  const counts = {};
  blogs.forEach(b => {
    counts[b.image] = (counts[b.image] || 0) + 1;
  });
  console.log('Image distributions in DB:', JSON.stringify(counts, null, 2));
}

main().finally(() => prisma.$disconnect());
