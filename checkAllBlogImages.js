const prisma = require('./server/prismaClient');

async function checkImages() {
  const blogs = await prisma.blog.findMany({
    select: { id: true, title: true, category: true, image: true, featuredImage: true }
  });

  console.log(`Checking ${blogs.length} blogs...`);
  const wpUploads = blogs.filter(b => (b.image && b.image.includes('wp-content')) || (b.featuredImage && b.featuredImage.includes('wp-content')));

  console.log(`Found ${wpUploads.length} blogs still pointing to wp-content/uploads:`);
  wpUploads.forEach(b => {
    console.log(`ID: ${b.id} | Title: "${b.title}" | Category: "${b.category}" | Image: ${b.image}`);
  });
}

checkImages().finally(() => prisma.$disconnect());
