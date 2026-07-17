import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, FileText, Truck, ArrowLeft } from 'lucide-react';
import SEO from '../components/seo/SEO';

const LegalPage = () => {
  const { type } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const getContent = () => {
    switch (type) {
      case 'terms-conditions':
        return {
          title: "Terms & Conditions",
          icon: <ShieldAlert className="w-12 h-12 text-[#662654]" />,
          seoDesc: "Read the Terms & Conditions of Paidhu Ethical Foods.",
          sections: [
            {
              heading: "1. Acceptance of Terms",
              content: "By accessing and placing an order with Paidhu (Paidhu Ethical Foods Private Limited), you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Paidhu."
            },
            {
              heading: "2. Product Usage",
              content: "All Paidhu products, including edible flowers, saffron, and floral jams, are intended for personal culinary consumption. We ensure our products are culinary-grade and organically grown. However, customers are advised to consume them responsibly and consult medical professionals if they have specific allergies or pre-existing conditions."
            },
            {
              heading: "3. User Accounts",
              content: "To place orders, you may be required to register an account. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
            },
            {
              heading: "4. Pricing and Payment",
              content: "Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue any product or service. Payment must be made through our authorized payment gateways (e.g., Razorpay) before order dispatch."
            }
          ]
        };
      case 'privacy-policy':
        return {
          title: "Privacy Policy",
          icon: <FileText className="w-12 h-12 text-[#662654]" />,
          seoDesc: "Understand how Paidhu handles and protects your personal data.",
          sections: [
            {
              heading: "1. Information We Collect",
              content: "We collect personal data you provide directly to us when registering an account, placing an order, subscribing to our newsletter, or filling out a form. This includes your name, email address, mobile number, shipping address, and payment information."
            },
            {
              heading: "2. How We Use Your Information",
              content: "We use the collected information to process transactions, deliver orders, communicate updates regarding your purchases, improve our website offerings, and send promotional newsletters (which you can opt-out of at any time)."
            },
            {
              heading: "3. Data Security",
              content: "We implement a variety of security measures, including SSL encryption, to maintain the safety of your personal information when you place an order or enter, submit, or access your personal data."
            },
            {
              heading: "4. Third-Party Sharing",
              content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties, except trusted partners who assist us in operating our website, conducting B2B sales, or delivering packages to your doorstep."
            }
          ]
        };
      case 'shipping-policy':
        return {
          title: "Shipping Policy",
          icon: <Truck className="w-12 h-12 text-[#662654]" />,
          seoDesc: "Read about our delivery timelines, shipping rates, and logistics partners.",
          sections: [
            {
              heading: "1. Shipping Destinations",
              content: "Paidhu ships to all pin codes across India. By default, international bulk shipping is not supported through the standard checkout unless arranged separately through our Bulk Sales department (info@paidhu.com)."
            },
            {
              heading: "2. Shipping Costs",
              content: "Shipping charges are calculated at the time of checkout based on the total order value, weight, and delivery destination. Free shipping is provided for standard qualifying retail orders over ₹500."
            },
            {
              heading: "3. Delivery Timeline",
              content: "Orders are processed and dispatched within 24 to 48 hours. Standard domestic shipping takes between 3 to 7 business days, depending on the delivery region and logistics availability."
            },
            {
              heading: "4. Damaged or Lost Shipments",
              content: "If your order arrives damaged, please reach out immediately to info@paidhu.com with your order number and package photographs. We will arrange a replacement or refund within 48 hours."
            }
          ]
        };
      default:
        return {
          title: "Legal Policy",
          icon: <FileText className="w-12 h-12 text-[#662654]" />,
          seoDesc: "Paidhu Ethical Foods Legal Policies.",
          sections: []
        };
    }
  };

  const currentPolicy = getContent();

  return (
    <div className="font-sans text-gray-800 bg-[#faf9f7] py-16 px-6 min-h-screen">
      <SEO 
        title={`${currentPolicy.title} | Paidhu`} 
        description={currentPolicy.seoDesc} 
        keywords="Paidhu, terms, privacy, shipping, legal" 
      />

      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-[2.5rem] shadow-xl p-8 md:p-12 relative overflow-hidden">
        {/* Back navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#662654] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        {/* Title Header */}
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-8">
          <div className="p-3 bg-[#662654]/5 rounded-2xl">
            {currentPolicy.icon}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#662654] bg-[#662654]/5 px-2.5 py-1 rounded">
              Paidhu Policies
            </span>
            <h1 className="font-serif text-3xl font-black text-gray-900 mt-1">
              {currentPolicy.title}
            </h1>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {currentPolicy.sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <h2 className="text-lg font-black text-gray-900 font-serif">
                {section.heading}
              </h2>
              <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
