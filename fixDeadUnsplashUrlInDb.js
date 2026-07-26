const prisma = require('./server/prismaClient');

async function main() {
  const result = await prisma.blog.updateMany({
    where: {
      OR: [
        { image: { contains: '546852199-2d7e912e98c6' } },
        { featuredImage: { contains: '546852199-2d7e912e98c6' } }
      ]
    },
    data: {
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop',
      featuredImage: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop'
    }
  });

  console.log(`Updated ${result.count} records in PostgreSQL DB!`);
}

main().finally(() => prisma.$disconnect());
