const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    // 1. Pick a product and make it INACTIVE
    const sample = await prisma.product.findFirst();
    if (!sample) {
      console.log("No products found in DB to test with.");
      return;
    }
    
    console.log(`Setting product "${sample.name}" (ID: ${sample.id}) to INACTIVE...`);
    await prisma.product.update({
      where: { id: sample.id },
      data: { status: 'INACTIVE' }
    });

    // 2. Fetch default (status ACTIVE) from API
    console.log("Fetching default (should exclude the inactive product)...");
    const resDefault = await fetch('http://localhost:5000/api/products');
    const dataDefault = await resDefault.json();
    const foundDefault = dataDefault.products?.some(p => p.id === sample.id);
    console.log(`> Excluded from default fetch? ${!foundDefault}`);

    // 3. Fetch status=all from API
    console.log("Fetching status=all (should include the inactive product)...");
    const resAll = await fetch('http://localhost:5000/api/products?status=all&limit=1000');
    const dataAll = await resAll.json();
    const foundAll = dataAll.products?.some(p => p.id === sample.id);
    console.log(`> Included in status=all fetch? ${foundAll}`);

    // 4. Restore status to ACTIVE
    console.log(`Restoring product "${sample.name}" to ACTIVE...`);
    await prisma.product.update({
      where: { id: sample.id },
      data: { status: 'ACTIVE' }
    });

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
