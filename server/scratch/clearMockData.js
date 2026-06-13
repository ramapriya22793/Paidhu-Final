const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting deletion of mock data...');

  try {
    // 1. Delete Refunds
    const deletedRefunds = await prisma.refund.deleteMany({});
    console.log(`Deleted ${deletedRefunds.count} refunds.`);

    // 2. Delete Payments
    const deletedPayments = await prisma.payment.deleteMany({});
    console.log(`Deleted ${deletedPayments.count} payments.`);

    // 3. Delete OrderItems
    const deletedOrderItems = await prisma.orderItem.deleteMany({});
    console.log(`Deleted ${deletedOrderItems.count} order items.`);

    // 4. Delete Orders
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`Deleted ${deletedOrders.count} orders.`);

    // 5. Delete CartItems
    const deletedCartItems = await prisma.cartItem.deleteMany({});
    console.log(`Deleted ${deletedCartItems.count} active cart items.`);

    // 6. Delete WishlistItems
    const deletedWishlistItems = await prisma.wishlistItem.deleteMany({});
    console.log(`Deleted ${deletedWishlistItems.count} wishlist items.`);

    // 7. Delete Reviews
    const deletedReviews = await prisma.review.deleteMany({});
    console.log(`Deleted ${deletedReviews.count} reviews.`);

    // 8. Delete BulkOrderInquiries
    const deletedInquiries = await prisma.bulkOrderInquiry.deleteMany({});
    console.log(`Deleted ${deletedInquiries.count} bulk order inquiries.`);

    // 9. Delete Addresses
    const deletedAddresses = await prisma.address.deleteMany({});
    console.log(`Deleted ${deletedAddresses.count} addresses.`);

    // 10. Delete Users (except the admin user)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: {
          not: 'ecompaidhu@gmail.com'
        }
      }
    });
    console.log(`Deleted ${deletedUsers.count} mock users (kept the admin account ecompaidhu@gmail.com).`);

    console.log('\n✅ Mock data cleared successfully!');
  } catch (error) {
    console.error('Error clearing mock data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
