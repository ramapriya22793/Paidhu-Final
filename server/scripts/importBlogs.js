const prisma = require('../prismaClient');
const { fetchAllPosts } = require('../services/wordpressService');

async function importWordPressBlogs() {
  console.log('===================================================');
  console.log('🚀 WORDPRESS BLOG MIGRATION TO PAIDHU STORE DATABASE');
  console.log('===================================================');

  const stats = {
    totalFetched: 0,
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    errorDetails: []
  };

  try {
    const posts = await fetchAllPosts();
    stats.totalFetched = posts.length;

    console.log(`\nProcessing ${posts.length} blogs for database insertion/update...\n`);

    for (const postData of posts) {
      try {
        // Find existing post by wordpressId or slug
        const existingBlog = await prisma.blog.findFirst({
          where: {
            OR: [
              { wordpressId: postData.wordpressId },
              { slug: postData.slug }
            ]
          }
        });

        if (existingBlog) {
          // Update existing blog
          await prisma.blog.update({
            where: { id: existingBlog.id },
            data: {
              ...postData,
              updatedAt: new Date()
            }
          });
          stats.updated++;
          console.log(`[UPDATED] ID #${postData.wordpressId} | Slug: ${postData.slug} | Title: "${postData.title}"`);
        } else {
          // Insert new blog
          await prisma.blog.create({
            data: postData
          });
          stats.imported++;
          console.log(`[IMPORTED] ID #${postData.wordpressId} | Slug: ${postData.slug} | Title: "${postData.title}"`);
        }
      } catch (err) {
        stats.errors++;
        stats.errorDetails.push({ wordpressId: postData.wordpressId, slug: postData.slug, error: err.message });
        console.error(`❌ [ERROR] Failed to import post #${postData.wordpressId} (${postData.slug}):`, err.message);
      }
    }

    console.log('\n===================================================');
    console.log('📊 MIGRATION SUMMARY REPORT');
    console.log('===================================================');
    console.log(`Total Fetched from WordPress: ${stats.totalFetched}`);
    console.log(`New Blogs Imported:          ${stats.imported}`);
    console.log(`Existing Blogs Updated:      ${stats.updated}`);
    console.log(`Errors Encountered:          ${stats.errors}`);
    console.log('===================================================\n');

    return stats;
  } catch (error) {
    console.error('❌ Fatal error during WordPress migration:', error.message);
    throw error;
  }
}

// Execute if run directly from command line
if (require.main === module) {
  importWordPressBlogs()
    .then(() => {
      console.log('🎉 Migration script finished successfully!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = {
  importWordPressBlogs
};
