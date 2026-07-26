const prisma = require('./server/prismaClient');

async function main() {
  const blogs = await prisma.blog.findMany({
    where: {
      OR: [
        { title: { contains: 'Blue Pea', mode: 'insensitive' } },
        { title: { contains: 'Butterfly Pea', mode: 'insensitive' } },
        { title: { contains: 'Bluepea', mode: 'insensitive' } },
        { category: { contains: 'Blue Pea', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Found ${blogs.length} Blue Pea blogs.`);

  const bluePeaImage = 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop';

  for (const b of blogs) {
    await prisma.blog.update({
      where: { id: b.id },
      data: {
        image: bluePeaImage,
        featuredImage: bluePeaImage
      }
    });
    console.log(`Updated blog ID #${b.id} ("${b.title}") -> Vibrant Blue Pea Tea Image`);
  }

  console.log('Successfully updated all Blue Pea Flower blog images!');
}

main().finally(() => prisma.$disconnect());
