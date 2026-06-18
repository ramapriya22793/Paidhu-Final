import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MessageSquare, CheckCircle, Info, 
  MapPin, Globe, User, Award, ShieldCheck, Heart 
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultData = {
  heroSection: {
    heading: 'BUY YOUR PAIDHU\nfavourites in bulk\n& resell ahead!',
    discountBtnText: 'Click Here For Discounts',
    bannerImage: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
    buttons: [
      { id: 1, label: 'Explore Bulk Offers', link: '#offers' },
      { id: 2, label: 'Download catalogue', link: '#catalogue' },
      { id: 3, label: 'Order in Bulk', link: '#order' }
    ]
  },
  formSection: {
    disclaimer: 'Disclaimer: We do not accept international bulk orders. For Further Queries Contact us at +91 8754787774 or help@paidhu.com',
    formTitle: 'Fill in Your Details',
    buttonText: 'Send Request'
  },
  whyChooseUs: {
    title: 'WHY CHOOSE PAIDHU?',
    trustedText: 'TRUSTED BY\n1 MILLION PARENTS',
    bullets: 'No artificial colors\nMade with real floral ingredients\nNo preservatives',
    image: '/bulk_why_choose_us.png'
  },
  foundersNote: {
    title: 'MADE BY\nTwo Friends',
    text: 'Choose wellness which is good for you. At Paidhu, we love using a diverse range of premium superfoods! Our products are made with a variety of nutrient-dense ingredients such as Kashmiri Saffron, Dried Rose Petals, and pure honey combined with natural sweetness.',
    logosTitle: 'ALSO AVAILABLE ON',
    logos: [
      { id: 1, image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }
    ]
  },
  contactAssistance: {
    title: 'Need help with your order? Contact us!',
    text: 'Ready to place a bulk order? Contact us today for a special discount and dedicated assistance.',
    phone: '+91 87547 87774',
    email: 'help@paidhu.com',
    buttonText: 'Chat with us'
  }
};

const BulkOrdersSection = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    region: '',
    country: 'India',
    purpose: 'Reseller / Distribution'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((settings) => {
        if (settings && settings.bulkOrdersData) {
          setData({
            heroSection: { ...defaultData.heroSection, ...settings.bulkOrdersData.heroSection },
            formSection: { ...defaultData.formSection, ...settings.bulkOrdersData.formSection },
            whyChooseUs: { ...defaultData.whyChooseUs, ...settings.bulkOrdersData.whyChooseUs },
            foundersNote: { ...defaultData.foundersNote, ...settings.bulkOrdersData.foundersNote },
            contactAssistance: { ...defaultData.contactAssistance, ...settings.bulkOrdersData.contactAssistance }
          });
        }
      })
      .catch((err) => console.warn('Failed to load bulk orders content:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/bulk-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let resData = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        resData = await res.json();
      } else {
        throw new Error('Inquiry server is currently offline or unreachable. Please try again later.');
      }

      if (res.ok) {
        setIsSuccess(true);
        setSubmitMessage(resData.message || 'Inquiry submitted successfully!');
        setFormData({
          fullName: '',
          email: '',
          mobile: '',
          region: '',
          country: 'India',
          purpose: 'Reseller / Distribution'
        });
      } else {
        setIsSuccess(false);
        setSubmitMessage(resData.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setSubmitMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };



  // Format line breaks for titles
  const renderTextWithBreaks = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="w-full bg-[#faf9f7] font-sans pb-16">
      
      {/* ══════════════════════════════════════════════════
          HERO BANNER SECTION
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_10px_50px_rgba(102,38,84,0.05)] grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 p-8 md:p-12">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {data.heroSection.discountBtnText && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#662654]/10 border border-[#662654]/20 rounded-full text-xs font-black uppercase tracking-wider text-[#662654] shadow-sm">
                ⚡ {data.heroSection.discountBtnText}
              </span>
            )}
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#5a2141] tracking-tight leading-[1.15] uppercase">
              {renderTextWithBreaks(data.heroSection.heading)}
            </h1>

            <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed max-w-xl">
              Partner with Paidhu to bring pure, premium flower-infused delicacies to your local market, store, corporate clients, or events. Enjoy custom volumes, competitive B2B discounts, and priority logistics.
            </p>

            {/* Configured Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              {data.heroSection.buttons?.map((btn) => (
                <a
                  key={btn.id}
                  href="#inquiry-form"
                  className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg ${
                    btn.id === 1 
                      ? 'bg-gradient-to-r from-[#662654] to-[#7f2d68] text-white hover:from-[#7a2e64] hover:to-[#913b7e]' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Image Graphic */}
          <div className="lg:col-span-5 h-[320px] md:h-[420px] rounded-[2rem] overflow-hidden relative shadow-lg">
            <img
              src={data.heroSection.bannerImage}
              alt="Paidhu Bulk Orders"
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY CHOOSE US SECTION
          ══════════════════════════════════════════════════ */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          {/* Graphic Side */}
          <div className="lg:col-span-5 h-[340px] md:h-[440px] rounded-[2rem] overflow-hidden relative shadow-md">
            <img
              src={data.whyChooseUs.image}
              alt="Why Choose Paidhu B2B"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/bulk_why_choose_us.png';
              }}
            />
          </div>

          {/* Text Side */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block">
              B2B Benefits
            </span>
            
            <h2 className="text-3xl md:text-4xl font-black text-[#5a2141] uppercase tracking-tight">
              {data.whyChooseUs.title}
            </h2>

            <div className="py-3 px-5 bg-amber-50/60 border border-amber-100 rounded-2xl inline-block">
              <span className="text-amber-800 font-extrabold text-xs tracking-wider uppercase block">
                ⭐ {renderTextWithBreaks(data.whyChooseUs.trustedText)}
              </span>
            </div>

            {/* Bullet points mapping */}
            <div className="space-y-4 pt-2">
              {data.whyChooseUs.bullets?.split('\n').filter(Boolean).map((bullet, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#662654]/10 flex items-center justify-center text-[#662654] shrink-0 mt-0.5">
                    <CheckCircle size={14} className="fill-[#662654] text-white" />
                  </div>
                  <span className="text-gray-600 font-semibold text-sm md:text-base">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          INQUIRY FORM & ASSISTANCE SECTION
          ══════════════════════════════════════════════════ */}
      <section id="inquiry-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#662654] to-[#501b41] rounded-[2rem] p-8 md:p-10 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_60%)] pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                {data.contactAssistance.title}
              </h3>
              <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                {data.contactAssistance.text}
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <a href={`tel:${data.contactAssistance.phone}`} className="flex items-center gap-4 group/contact">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/contact:bg-white group-hover/contact:text-[#662654] transition-colors">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Call Us</p>
                    <p className="text-sm font-bold">{data.contactAssistance.phone}</p>
                  </div>
                </a>

                <a href={`mailto:${data.contactAssistance.email}`} className="flex items-center gap-4 group/contact">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/contact:bg-white group-hover/contact:text-[#662654] transition-colors">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Email Us</p>
                    <p className="text-sm font-bold">{data.contactAssistance.email}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Chat WhatsApp Action */}
            <div className="pt-8 relative z-10">
              <a
                href={`https://wa.me/${data.contactAssistance.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#fde047] hover:from-[#ffd700] hover:to-[#fff] text-[#662654] font-black uppercase text-xs sm:text-sm tracking-wider py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <MessageSquare size={16} className="fill-[#662654]" />
                <span>{data.contactAssistance.buttonText}</span>
              </a>
            </div>
          </div>

          {/* Right: Submission Form */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-[#662654] uppercase tracking-tight">
                  {data.formSection.formTitle}
                </h3>
                <p className="text-gray-400 text-xs mt-1 font-semibold uppercase tracking-wider">B2B / Reseller Application</p>
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-xl font-bold text-xs ${isSuccess ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" required name="fullName" value={formData.fullName} onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-[13px] focus:outline-none focus:border-[#662654] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email" required name="email" value={formData.email} onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-[13px] focus:outline-none focus:border-[#662654] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel" required name="mobile" value={formData.mobile} onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-[13px] focus:outline-none focus:border-[#662654] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">State / Region</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" required name="region" value={formData.region} onChange={handleChange}
                      placeholder="Maharashtra"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-[13px] focus:outline-none focus:border-[#662654] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" required name="country" value={formData.country} onChange={handleChange}
                      placeholder="India"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-[13px] focus:outline-none focus:border-[#662654] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Purpose */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Purpose of Inquiry</label>
                  <select
                    name="purpose" value={formData.purpose} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-[#662654] focus:bg-white transition-all font-semibold"
                  >
                    <option value="Reseller / Distribution">Reseller / Distribution</option>
                    <option value="Corporate Gifting">Corporate Gifting</option>
                    <option value="Retail / Shop Sales">Retail / Shop Sales</option>
                    <option value="Events / Weddings">Events / Weddings</option>
                    <option value="Other">Other / General Queries</option>
                  </select>
                </div>

                {/* Submit button */}
                <div className="sm:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-[#662654] to-[#7f2d68] hover:from-[#7a2e64] hover:to-[#913b7e] disabled:from-[#662654]/50 disabled:to-[#7f2d68]/50 text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    {submitting ? 'Submitting...' : data.formSection.buttonText || 'Send Request'}
                  </button>
                </div>
              </form>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-start gap-2 text-[11px] text-gray-400 font-semibold leading-relaxed">
              <Info size={14} className="shrink-0 text-gray-400 mt-0.5" />
              <span>{data.formSection.disclaimer}</span>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOUNDERS NOTE & RETAIL CHANNELS
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.01)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Notes Text */}
          <div className="lg:col-span-8 space-y-6">
            <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block">
              Co-Founders Note
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#5a2141] uppercase tracking-tight">
              {data.foundersNote.title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed italic">
              "{data.foundersNote.text}"
            </p>
          </div>

          {/* Brands list */}
          <div className="lg:col-span-4 bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center text-center">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">
              {data.foundersNote.logosTitle}
            </h4>
            <div className="flex flex-col items-center gap-6 w-full">
              {data.foundersNote.logos?.map((logo) => (
                <div key={logo.id} className="h-8 max-w-[140px] flex items-center justify-center filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <img
                    src={logo.image}
                    alt="Channel Partner"
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default BulkOrdersSection;
