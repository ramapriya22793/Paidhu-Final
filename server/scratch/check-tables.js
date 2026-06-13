const prisma = require("../prismaClient");

async function check() {
  try {
    console.log("Checking CartItem model...");
    const cartCount = await prisma.cartItem.count();
    console.log("CartItem count:", cartCount);

    console.log("Checking WishlistItem model...");
    const wishlistCount = await prisma.wishlistItem.count();
    console.log("WishlistItem count:", wishlistCount);

    console.log("All tables are queryable!");
  } catch (err) {
    console.error("Error querying models:", err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
