const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if we have any products to link
  const product = await prisma.product.findFirst();
  
  const order = await prisma.order.create({
    data: {
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      shippingAddress: "123 Floral Lane, Mumbai, MH 400001",
      totalPrice: 1499.00,
      paymentMethod: "Razorpay",
      orderStatus: "PROCESSING",
      items: product ? {
        create: [
          {
            productId: product.id,
            quantity: 2,
            price: product.offerPrice || product.price
          }
        ]
      } : undefined
    }
  });

  console.log("Dummy order created:", order);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
