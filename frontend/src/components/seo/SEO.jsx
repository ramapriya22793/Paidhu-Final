import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, type = 'website', productData }) => {
  const siteName = "Paidhu - The Edible Flower Co.";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = "Discover premium quality edible flowers, saffron, and natural organic products at Paidhu. Enhance your culinary experience with our carefully sourced selection.";
  const defaultImage = "https://paidhu.com/Paidhulogo.png";
  const defaultUrl = "https://paidhu.com";

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description || defaultDesc} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || defaultUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description || defaultDesc} />
      <meta property="twitter:image" content={image || defaultImage} />

      {/* Product JSON-LD Structured Data */}
      {productData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": productData.name,
            "image": productData.image,
            "description": productData.description,
            "brand": {
              "@type": "Brand",
              "name": "Paidhu"
            },
            "offers": {
              "@type": "Offer",
              "url": url || defaultUrl,
              "priceCurrency": "INR",
              "price": productData.price,
              "availability": productData.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
