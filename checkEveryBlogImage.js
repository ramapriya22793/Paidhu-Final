const prisma = require('./server/prismaClient');

async function main() {
  const blogs = await prisma.blog.findMany();
  console.log(`Checking all ${blogs.length} database records...`);

  const nonUnsplash = blogs.filter(b => 
    !b.image || 
    !b.image.startsWith('https://images.unsplash.com')
  );

  console.log(`Found ${nonUnsplash.length} non-Unsplash images:`);
  nonUnsplash.forEach(b => {
    console.log(`ID: ${b.id} | Title: "${b.title}" | Image: ${b.image}`);
  });
}

main().finally(() => prisma.$disconnect());
