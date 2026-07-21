import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const API_BASE = 'https://paidhu-final-anm2.vercel.app';

const SEO = ({ 
  slug, // New prop to fetch database-driven settings dynamically
  title: initialTitle, 
  description: initialDescription, 
  keywords: initialKeywords, 
  image, 
  url, 
  type = 'website', 
  robots = 'index, follow',
  productData,
  faqData,
  breadcrumbData,
  articleData
}) => {
  const [dbSeo, setDbSeo] = useState(null);

  useEffect(() => {
    if (slug) {
      fetch(`${API_BASE}/api/seo/${slug}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setDbSeo(data);
        })
        .catch(err => console.error("Failed to fetch page SEO for:", slug, err));
    }
  }, [slug]);

  const title = initialTitle || dbSeo?.title;
  const description = initialDescription || dbSeo?.description;
  const keywords = initialKeywords || dbSeo?.keywords;

  const siteName = "Paidhu - The Edible Flower Co.";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = "Discover premium quality edible flowers, saffron, and natural organic products at Paidhu. Enhance your culinary experience with our carefully sourced selection.";
  const defaultImage = "https://paidhu.com/Paidhulogo.png";
  const defaultUrl = "https://paidhu.com";
  const currentUrl = url || defaultUrl;

  // 1. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Paidhu",
    "url": "https://paidhu.com",
    "logo": "https://paidhu.com/Paidhulogo.png",
    "email": "info@paidhu.com",
    "telephone": "+91-87547-87774",
    "sameAs": [
      "https://www.instagram.com/paidhu_edibleflower/",
      "https://www.youtube.com/@Paidhu"
    ]
  };

  // 2. Website & SearchAction Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Paidhu",
    "url": "https://paidhu.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://paidhu.com/shop?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // 3. LocalBusiness Schema (Pollachi, Tamil Nadu)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Paidhu Ethical Foods",
    "image": "https://paidhu.com/Paidhulogo.png",
    "telephone": "+91-87547-87774",
    "email": "info@paidhu.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pollachi",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "priceRange": "$$"
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description || defaultDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <meta name="theme-color" content="#522742" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description || defaultDesc} />
      <meta property="twitter:image" content={image || defaultImage} />

      {/* Global Brand JSON-LD Schemas */}
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>

      {/* Product JSON-LD Structured Data with Review/Rating fallbacks */}
      {productData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": productData.name,
            "image": productData.image,
            "description": productData.description || defaultDesc,
            "brand": {
              "@type": "Brand",
              "name": "Paidhu"
            },
            "aggregateRating": productData.rating ? {
              "@type": "AggregateRating",
              "ratingValue": productData.rating,
              "reviewCount": productData.reviewCount || 5
            } : undefined,
            "review": productData.reviews ? productData.reviews.map(r => ({
              "@type": "Review",
              "author": { "@type": "Person", "name": r.userName },
              "reviewRating": { "@type": "Rating", "ratingValue": r.rating },
              "reviewBody": r.comment
            })) : undefined,
            "offers": {
              "@type": "Offer",
              "url": currentUrl,
              "priceCurrency": "INR",
              "price": productData.price,
              "availability": productData.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })}
        </script>
      )}

      {/* FAQ Schema */}
      {faqData && faqData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })}
        </script>
      )}

      {/* Breadcrumb Schema */}
      {breadcrumbData && breadcrumbData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbData.map((item, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "name": item.name,
              "item": item.url ? `https://paidhu.com${item.url}` : undefined
            }))
          })}
        </script>
      )}

      {/* Article & BlogPosting Schema */}
      {articleData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": articleData.title,
            "image": articleData.image || defaultImage,
            "author": {
              "@type": "Person",
              "name": articleData.author || "Paidhu Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": siteName,
              "logo": {
                "@type": "ImageObject",
                "url": defaultImage
              }
            },
            "datePublished": articleData.datePublished || new Date().toISOString(),
            "description": articleData.description || defaultDesc
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
