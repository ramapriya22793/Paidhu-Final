const prisma = require('./server/prismaClient');

async function main() {
  const blogs = await prisma.blog.findMany();
  console.log(`Checking ${blogs.length} database records...`);

  let count = 0;
  for (const b of blogs) {
    if (b.image?.includes('516627145497') || b.featuredImage?.includes('516627145497')) {
      const newImg = 'https://images.unsplash.com/photo-1546852199-2d7e912e98c6?q=80&w=800&auto=format&fit=crop';
      await prisma.blog.update({
        where: { id: b.id },
        data: {
          image: newImg,
          featuredImage: newImg
        }
      });
      count++;
      console.log(`Replaced child camera photo for blog #${b.id} ("${b.title}")`);
    }
  }

  console.log(`Successfully replaced ${count} database image records!`);
}

main().finally(() => prisma.$disconnect());
