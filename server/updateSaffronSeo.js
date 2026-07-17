const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSaffronSeo() {
  console.log("Updating Super Negin Saffron SEO in DB...");
  const result = await prisma.product.updateMany({
    where: { slug: 'super-negin-saffron' },
    data: {
      seoTitle: "Buy Premium Super Negin Saffron Online | Pure Iranian Saffron Threads | Paidhu",
      seoDescription: "Buy Super Negin Saffron online from Paidhu. Our handpicked, pure Iranian saffron threads offer deep red color, rich aroma, and highest potency for cooking and health.",
      seoKeywords: "Super Negin Saffron, Buy Super Negin Saffron Online, Premium Super Negin Saffron, Pure Super Negin Saffron, Original Super Negin Saffron, Authentic Super Negin Saffron, Best Super Negin Saffron, Iranian Super Negin Saffron, Premium Iranian Saffron, Buy Iranian Saffron Online, Iranian Saffron Threads, Premium Saffron Threads, Pure Iranian Saffron, Authentic Iranian Saffron, Luxury Saffron Threads, High Quality Saffron, Finest Saffron, Grade A Saffron, Grade 1 Saffron, Handpicked Saffron, Natural Saffron Threads, Deep Red Saffron Threads, High Crocin Saffron, High Aroma Saffron, Premium Kesar, Pure Kesar, Buy Kesar Online, Best Kesar Online, Organic Saffron, Gourmet Saffron, Culinary Saffron, Imported Iranian Saffron, Saffron for Cooking, Saffron for Biryani, Saffron for Desserts, Saffron for Tea, Saffron for Milk, Saffron for Health, Luxury Spice, Premium Spice, Natural Food Ingredient, Healthy Spice, Rich Aroma Saffron, Vibrant Colour Saffron, Premium Food Ingredients, Buy Premium Iranian Saffron, Premium Saffron India, Best Saffron Brand India, Premium Saffron Online India, Saffron Threads Online, Buy Saffron Online India, Premium Saffron, Pure Saffron, Authentic Saffron, Original Saffron, Best Saffron India, Iranian Kesar, Imported Saffron, Red Saffron Threads, Premium Spice India, Paidhu, Paidhu Saffron, Paidhu Premium Saffron, Paidhu Super Negin Saffron, Paidhu Iranian Saffron, The Edible Flower Co"
    }
  });
  console.log(`Updated ${result.count} products.`);
}

updateSaffronSeo()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
