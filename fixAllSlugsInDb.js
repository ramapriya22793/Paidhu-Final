const prisma = require('./server/prismaClient');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fixSlugs() {
  const blogs = await prisma.blog.findMany();
  console.log(`Checking ${blogs.length} blogs for missing or null slugs...`);

  let count = 0;
  for (const b of blogs) {
    if (!b.slug || b.slug === 'null') {
      const generatedSlug = slugify(b.title) || `blog-${b.id}`;
      await prisma.blog.update({
        where: { id: b.id },
        data: { slug: generatedSlug }
      });
      count++;
      console.log(`Updated blog #${b.id} title "${b.title}" -> slug: "${generatedSlug}"`);
    }
  }

  console.log(`Fixed ${count} blog slugs in database!`);
}

fixSlugs().finally(() => prisma.$disconnect());
