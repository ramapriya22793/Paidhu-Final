const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst();
  
  if (!product) {
    console.log("No product found to review.");
    return;
  }
  
  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Absolutely incredible! The quality is amazing, and I loved the packaging. Will definitely buy again! 🌸",
      reviewerName: "Priya Sharma",
      productId: product.id,
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200",
      isApproved: true
    }
  });
  
  console.log("Dummy review added successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
