const WP_API_BASE = process.env.WORDPRESS_API_URL || 'https://wp.paidhu.com/wp-json/wp/v2';

/**
 * Clean WPBakery Page Builder shortcodes & unneeded wrapper tags
 * Preserves actual HTML tags like <h1>, <p>, <img>, <ul>, <a>, <table>, etc.
 */
function cleanWPBakeryShortcodes(content) {
  if (!content) return '';

  let cleaned = content;

  // 1. Remove WPBakery container shortcodes (opening and closing)
  cleaned = cleaned.replace(/\[\/?vc_[^\]]*\]/gi, '');
  cleaned = cleaned.replace(/\[\/?wpb_[^\]]*\]/gi, '');

  // 2. Remove other common WordPress shortcodes
  cleaned = cleaned.replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gi, '$1');
  cleaned = cleaned.replace(/\[gallery[^\]]*\]/gi, '');
  cleaned = cleaned.replace(/\[embed[^\]]*\](.*?)\[\/embed\]/gi, '$1');
  cleaned = cleaned.replace(/\[audio[^\]]*\](.*?)\[\/audio\]/gi, '');
  cleaned = cleaned.replace(/\[video[^\]]*\](.*?)\[\/video\]/gi, '');

  // 3. Clean any remaining custom bracketed shortcodes
  cleaned = cleaned.replace(/\[\/?[a-zA-Z0-9_-]+(\s+[^\]]*)?\]/g, '');

  // 4. Remove empty paragraph tags or double breaks caused by shortcode removal
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');

  return cleaned.trim();
}

/**
 * Strip HTML tags to get raw plain text for excerpts & word count
 */
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

/**
 * Calculate reading time in minutes based on ~200 wpm
 */
function calculateReadingTime(text) {
  const plainText = stripHtml(text);
  const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Fetch all posts from WordPress API with automatic pagination
 */
async function fetchAllPosts() {
  const allPosts = [];
  let page = 1;
  const perPage = 100;
  let totalPages = 1;

  console.log(`📡 Starting WordPress API fetch from: ${WP_API_BASE}/posts`);

  try {
    while (page <= totalPages) {
      const url = `${WP_API_BASE}/posts?_embed&per_page=${perPage}&page=${page}`;
      console.log(`Fetching page ${page}...`);

      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 400 && page > 1) {
          // Reached end of pagination
          break;
        }
        throw new Error(`WordPress API returned status ${response.status}: ${response.statusText}`);
      }

      const totalHeader = response.headers.get('x-wp-totalpages');
      if (totalHeader) {
        totalPages = parseInt(totalHeader, 10);
      }

      const posts = await response.json();
      if (!Array.isArray(posts) || posts.length === 0) {
        break;
      }

      allPosts.push(...posts);
      console.log(`Fetched ${posts.length} posts from page ${page} (Total so far: ${allPosts.length})`);
      page++;
    }

    console.log(`✅ Total WordPress posts fetched: ${allPosts.length}`);
    return allPosts.map(transformPostData);
  } catch (error) {
    console.error('❌ Error fetching posts from WordPress API:', error.message);
    throw error;
  }
}

function getCuratedFloralImage(title = '', category = '', originalUrl = '') {
  const text = (title + ' ' + (category || '')).toLowerCase();

  const isGeneric = !originalUrl || 
    originalUrl.includes('placeholder') || 
    originalUrl.includes('default') || 
    originalUrl.includes('child') || 
    originalUrl.includes('camera') || 
    originalUrl.includes('toy') ||
    originalUrl.includes('516627145497') ||
    originalUrl.includes('kms');

  if (originalUrl && !isGeneric && originalUrl.startsWith('http')) {
    return originalUrl;
  }

  if (text.includes('hibiscus')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('rose') || text.includes('gulkand') || text.includes('damask')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('saffron') || text.includes('kesar')) {
    return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('blue pea') || text.includes('butterfly pea') || text.includes('bluepea')) {
    return 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('chamomile')) {
    return 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('neem') || text.includes('aavaram') || text.includes('kondrai') || text.includes('cassia')) {
    return 'https://images.unsplash.com/photo-1546852199-2d7e912e98c6?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('lavender')) {
    return 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('jasmine')) {
    return 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('salad') || text.includes('fruit')) {
    return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('rasam') || text.includes('tea') || text.includes('drink') || text.includes('syrup') || text.includes('lemonade')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('idli') || text.includes('rice') || text.includes('pancake') || text.includes('cookie') || text.includes('halwa') || text.includes('panna cotta')) {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop';
  }

  return 'https://images.unsplash.com/photo-1546852199-2d7e912e98c6?q=80&w=800&auto=format&fit=crop';
}

/**
 * Transform raw WordPress post object into Paidhu Blog schema structure
 */
function transformPostData(post) {
  const embeddedMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const embeddedAuthor = post._embedded?.['author']?.[0];
  const terms = post._embedded?.['wp:term'] || [];

  // Extract categories & tags
  const categoriesList = [];
  const tagsList = [];

  if (Array.isArray(terms)) {
    terms.forEach(termGroup => {
      if (Array.isArray(termGroup)) {
        termGroup.forEach(term => {
          if (term.taxonomy === 'category') {
            categoriesList.push(term.name);
          } else if (term.taxonomy === 'post_tag') {
            tagsList.push(term.name);
          }
        });
      }
    });
  }

  const rawContent = post.content?.rendered || '';
  const cleanedContent = cleanWPBakeryShortcodes(rawContent);
  const rawExcerpt = post.excerpt?.rendered || '';
  const cleanedExcerpt = stripHtml(rawExcerpt) || stripHtml(cleanedContent).slice(0, 160) + '...';

  const rawFeaturedImgUrl = embeddedMedia?.source_url || null;
  const primaryCategory = categoriesList.length > 0 ? categoriesList[0] : 'Wellness';
  const featuredImgUrl = getCuratedFloralImage(post.title?.rendered, primaryCategory, rawFeaturedImgUrl);

  const featuredImgAlt = embeddedMedia?.alt_text || post.title?.rendered || '';
  const mediaDetails = embeddedMedia?.media_details || {};

  return {
    wordpressId: post.id,
    title: post.title?.rendered || 'Untitled Post',
    slug: post.slug || `post-${post.id}`,
    excerpt: cleanedExcerpt,
    content: cleanedContent,
    image: featuredImgUrl,
    featuredImage: featuredImgUrl,
    featuredImageAlt: featuredImgAlt,
    featuredImageWidth: mediaDetails.width || null,
    featuredImageHeight: mediaDetails.height || null,
    author: embeddedAuthor?.name || 'Paidhu Team',
    authorId: post.author || null,
    categories: categoriesList,
    tags: tagsList,
    category: primaryCategory,
    status: post.status || 'publish',
    readingTime: calculateReadingTime(cleanedContent),
    seoTitle: post.title?.rendered || '',
    seoDescription: cleanedExcerpt.slice(0, 160),
    canonicalUrl: post.link || `https://wp.paidhu.com/${post.slug}`,
    metaKeywords: tagsList.join(', '),
    createdAt: post.date ? new Date(post.date) : new Date(),
    updatedAt: post.modified ? new Date(post.modified) : new Date(),
    lastSynced: new Date()
  };
}

module.exports = {
  fetchAllPosts,
  transformPostData,
  cleanWPBakeryShortcodes
};
