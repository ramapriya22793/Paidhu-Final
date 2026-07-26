const prisma = require('./server/prismaClient');

async function main() {
  const blogs = await prisma.blog.findMany({
    orderBy: { id: 'asc' }
  });
  console.log(`Auditing ${blogs.length} blogs...`);
  blogs.forEach(b => {
    console.log(`[ID ${b.id}] [Cat: ${b.category || 'None'}] "${b.title}" -> ${b.image}`);
  });
}

main().finally(() => prisma.$disconnect());
