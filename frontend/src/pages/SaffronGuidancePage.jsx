import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2, User, Users, Phone, Heart, Calendar, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import saffronIcon from '../assets/saffron_icon.png';
import pregnancyBanner from '../assets/pregnancy_saffron_banner.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PURPOSES = [
  'General Wellness',
  'Pregnancy Support',
  'Skin Glow & Beauty',
  'Digestive Health',
  'Energy & Immunity',
  'Other',
];

const PREGNANCY_MONTHS = Array.from({ length: 9 }, (_, i) => i + 1);

const FIELD_CONFIGS = [
  {
    key: 'yourName',
    label: 'Your Name',
    placeholder: 'Enter your full name',
    type: 'text',
    icon: User,
    required: true,
  },
  {
    key: 'spouseName',
    label: 'Spouse Name',
    placeholder: 'Enter spouse full name',
    type: 'text',
    icon: Users,
    required: true,
  },
  {
    key: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    type: 'tel',
    icon: Phone,
    required: true,
  },
];

const SaffronGuidancePage = () => {
  const [form, setForm] = useState({
    yourName: '',
    spouseName: '',
    phone: '',
    purpose: '',
    pregnancyMonth: '',
    doctorPermission: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.yourName.trim()) return setError('Please enter your name.');
    if (!form.spouseName.trim()) return setError('Please enter spouse name.');
    if (!form.phone.trim() || form.phone.length < 10) return setError('Please enter a valid phone number.');
    if (!form.purpose) return setError('Please select your purpose.');
    if (!form.pregnancyMonth) return setError('Please select the pregnancy month.');
    if (!form.doctorPermission) return setError('Please indicate if you have doctor permission.');

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/saffron-guidance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      let data;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error('Server returned an invalid response. Please try again later.');
      }

      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="w-full min-h-screen bg-[#fcfbfa] font-sans"
    >
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-[#3b1030] py-20 px-4">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${pregnancyBanner})` }}
        />
        <div className="absolute inset-0 bg-[#662654]/50" />
        
        {/* Decorative petals */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {['🌸','🌺','✨','🌼','🌸','🌺'].map((p, i) => (
            <span
              key={i}
              className="absolute text-white/10 text-5xl animate-pulse"
              style={{
                top: `${[10, 60, 30, 80, 20, 70][i]}%`,
                left: `${[5, 15, 50, 70, 85, 95][i]}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            >{p}</span>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-white/60 hover:text-white font-semibold text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-6">
              <img src={saffronIcon} alt="Saffron Guidance" className="w-24 h-24 object-cover rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] border-4 border-white/20" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Saffron Guidance
            </h1>
            <p className="mt-4 text-white/70 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Let our experts guide you on the right way to use saffron during pregnancy. Fill in your details and we'll get back to you personally.
            </p>
          </motion.div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: '🏥', text: 'Doctor Approved Protocol' },
              { icon: '🔒', text: '100% Private & Confidential' },
              { icon: '📞', text: 'Personal Callback' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-xs font-bold">
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form / Success ── */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-10 text-center"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Request Submitted! 🌸</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Thank you for reaching out. Our saffron expert will personally call you within <strong>24 hours</strong> with tailored guidance.
              </p>
              <div className="bg-[#662654]/5 border border-[#662654]/10 rounded-2xl p-5 text-left mb-8 space-y-2">
                <p className="text-sm font-bold text-[#662654]">What happens next?</p>
                {[
                  '📞 You will receive a personal callback from our expert',
                  '🌸 We\'ll guide you on saffron dosage & timing',
                  '🏥 All advice is aligned with doctor protocols',
                ].map((s, i) => (
                  <p key={i} className="text-sm text-gray-600">{s}</p>
                ))}
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#662654] to-[#7a2e64] text-white px-8 py-3.5 rounded-full font-black text-sm uppercase tracking-wider shadow-lg shadow-[#662654]/20 hover:brightness-110 transition-all"
              >
                Back to Home
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* Form header */}
              <div className="bg-gradient-to-r from-[#662654]/5 to-[#d4af37]/5 border-b border-gray-100 px-8 py-6">
                <h2 className="text-xl font-black text-gray-900">Fill Your Details</h2>
                <p className="text-sm text-gray-500 mt-1">All fields are required. Your data is safe with us.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">

                {/* Text fields */}
                {FIELD_CONFIGS.map(({ key, label, placeholder, type, icon: Icon }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                      {label} <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#662654]/50">
                        <Icon size={18} />
                      </div>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={e => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-12 pr-4 py-3.5 bg-[#faf9f7] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#662654]/20 focus:border-[#662654] transition-all"
                      />
                    </div>
                  </div>
                ))}

                {/* Purpose */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                    Purpose <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#662654]/50">
                      <Heart size={18} />
                    </div>
                    <select
                      value={form.purpose}
                      onChange={e => handleChange('purpose', e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-[#faf9f7] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#662654]/20 focus:border-[#662654] transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select your purpose</option>
                      {PURPOSES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pregnancy Month */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                    Pregnancy Month <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#662654]/50">
                      <Calendar size={18} />
                    </div>
                    <select
                      value={form.pregnancyMonth}
                      onChange={e => handleChange('pregnancyMonth', e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-[#faf9f7] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#662654]/20 focus:border-[#662654] transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select month of pregnancy</option>
                      {PREGNANCY_MONTHS.map(m => (
                        <option key={m} value={m}>Month {m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Doctor Permission */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                    Do you have Doctor's Permission? <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
                    {['Yes', 'No'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange('doctorPermission', opt)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 font-black text-sm transition-all ${
                          form.doctorPermission === opt
                            ? opt === 'Yes'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-rose-400 bg-rose-50 text-rose-700'
                            : 'border-gray-200 bg-[#faf9f7] text-gray-500 hover:border-[#662654]/30'
                        }`}
                      >
                        <Stethoscope size={16} />
                        {opt === 'Yes' ? '✅ Yes, I have permission' : '❌ No, not yet'}
                      </button>
                    ))}
                  </div>
                  {form.doctorPermission === 'No' && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-medium"
                    >
                      ⚠️ We strongly recommend consulting your doctor before using saffron during pregnancy. Our expert will help guide you.
                    </motion.p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl"
                  >
                    ⚠️ {error}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#662654] via-[#7a2e64] to-[#662654] hover:brightness-110 disabled:opacity-70 text-white rounded-full py-4 px-8 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#662654]/20 hover:shadow-2xl cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>🌸</span>
                      <span>Submit for Saffron Guidance</span>
                    </>
                  )}
                </motion.button>

                <p className="text-center text-[11px] text-gray-400 font-medium">
                  🔒 Your information is 100% private and will never be shared.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SaffronGuidancePage;
