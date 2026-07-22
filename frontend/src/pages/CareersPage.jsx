import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Clock, UserCheck, CheckCircle, ChevronDown, 
  ChevronUp, Upload, Send, Award, Heart, TrendingUp, 
  BookOpen, Shield, Smile, MapPin, Calendar, FileText
} from 'lucide-react';
import SEO from '../components/seo/SEO';


const CareersPage = () => {
  const formRef = useRef(null);
  
  // Accordion open states for positions
  const [openPosition, setOpenPosition] = useState('sales'); // 'sales' | 'marketing' | null
  
  // FAQ accordion open states
  const [openFaq, setOpenFaq] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    college: '',
    degree: '',
    graduationYear: '',
    position: 'Sales Intern',
    portfolioUrl: '',
    coverLetter: '',
    agreed: false
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const scrollToForm = (positionName) => {
    if (positionName) {
      setFormData(prev => ({ ...prev, position: positionName }));
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('File size should not exceed 5MB');
        return;
      }
      setSubmitError('');
      setResumeName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      setSubmitError('Please confirm that your information is accurate.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/careers/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          resumeData: resumeFile,
          resumeName: resumeName
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          location: '',
          college: '',
          degree: '',
          graduationYear: '',
          position: 'Sales Intern',
          portfolioUrl: '',
          coverLetter: '',
          agreed: false
        });
        setResumeFile(null);
        setResumeName('');
      } else {
        setSubmitError(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const positions = [
    {
      id: 'sales',
      title: 'Sales Intern',
      type: 'Unpaid Internship',
      duration: '6 Months',
      eligibility: 'Female Candidates Only',
      workMode: 'Remote / Hybrid (Based on Requirement)',
      buttonText: 'Apply for Sales Internship',
      responsibilities: [
        'Assist in lead generation and customer outreach.',
        'Support sales calls and follow-ups.',
        'Maintain customer data and CRM records.',
        'Coordinate with the sales team.',
        'Prepare sales reports.',
        'Help achieve monthly sales targets.'
      ],
      skills: [
        'Good communication skills',
        'Basic MS Excel knowledge',
        'Confidence in speaking with customers',
        'Positive attitude',
        'Willingness to learn'
      ],
      qualifications: [
        'Any Degree (Final Year Students or Freshers)',
        'MBA/BBA students are welcome.'
      ]
    },
    {
      id: 'marketing',
      title: 'Digital Marketing Intern',
      type: 'Unpaid Internship',
      duration: '6 Months',
      eligibility: 'Female Candidates Only',
      workMode: 'Remote / Hybrid (Based on Requirement)',
      buttonText: 'Apply for Digital Marketing Internship',
      responsibilities: [
        'Create social media content.',
        'Schedule posts across platforms.',
        'Assist in SEO activities.',
        'Write captions and blog content.',
        'Support Meta Ads campaigns.',
        'Monitor website and social media performance.',
        'Research marketing trends.'
      ],
      skills: [
        'Basic Canva knowledge',
        'Social Media Management',
        'Content Writing',
        'SEO Fundamentals',
        'Creativity',
        'Communication Skills'
      ],
      qualifications: [
        'Any Degree',
        'Freshers are welcome.',
        'Digital Marketing learners are encouraged to apply.'
      ]
    }
  ];

  const whyJoin = [
    { icon: <BookOpen className="text-3xl text-[#662654]" />, title: 'Learn from Real Industry Projects' },
    { icon: <Clock className="text-3xl text-[#662654]" />, title: 'Flexible Working Environment' },
    { icon: <Heart className="text-3xl text-[#662654]" />, title: 'Mentorship & Guidance' },
    { icon: <TrendingUp className="text-3xl text-[#662654]" />, title: 'Improve Professional Skills' },
    { icon: <Briefcase className="text-3xl text-[#662654]" />, title: 'Opportunity to Build Your Portfolio' },
    { icon: <Award className="text-3xl text-[#662654]" />, title: 'Certificate of Internship on Completion' },
    { icon: <UserCheck className="text-3xl text-[#662654]" />, title: 'Potential Full-Time Opportunity' }
  ];


  const faqs = [
    { q: 'Is this a paid internship?', a: 'No. This is an unpaid internship designed for learning and hands-on industry experience.' },
    { q: 'What is the internship duration?', a: '6 Months.' },
    { q: 'Who can apply?', a: 'Female students and fresh graduates who are eager to learn and grow.' },
    { q: 'Will I receive a certificate?', a: 'Yes. An Internship Completion Certificate will be provided upon successful completion.' },
    { q: 'Is there a chance of a full-time job?', a: 'Outstanding performers may be considered for future full-time opportunities based on performance.' }
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-gray-800 font-sans pb-16">
      <SEO 
        title="Careers - Paidhu Ethical Foods"
        description="Join the Paidhu team and grow your career with a purpose-driven food brand. Explore internship openings in Sales and Digital Marketing."
        slug="careers"
        url="https://paidhu.com/careers"
      />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#662654] to-[#4a1b3d] text-[#ede7d7] py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ede7d7_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative z-10 space-y-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#ede7d7]/15 text-[#ede7d7] text-xs font-semibold tracking-wider uppercase border border-[#ede7d7]/20">
            Work with Purpose
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
            Join the Paidhu Team
          </h1>
          <p className="text-lg md:text-xl text-[#ede7d7]/90 max-w-2xl mx-auto leading-relaxed">
            Grow your career with a purpose-driven food brand. We're looking for passionate individuals who want to learn, innovate, and make an impact.
          </p>
          <div className="pt-4">
            <button 
              onClick={() => scrollToForm()}
              className="bg-[#ede7d7] hover:bg-white text-[#662654] font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Apply Now
            </button>
          </div>
        </motion.div>
      </section>

      {/* OPEN POSITIONS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#662654]">Open Positions</h2>
          <p className="text-gray-600 mt-2">Explore exciting internship opportunities to kickstart your career.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {positions.map((pos) => (
            <motion.div 
              key={pos.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-md border border-[#ede7d7] overflow-hidden flex flex-col justify-between"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-[#662654]">{pos.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-[#662654]/10 text-[#662654] text-xs font-semibold px-3 py-1 rounded-full">
                        {pos.type}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12} /> {pos.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 border-t border-b border-gray-100 py-4">
                  <p className="flex items-center gap-2">
                    <UserCheck className="text-[#662654]" /> <strong className="text-gray-800">Eligibility:</strong> {pos.eligibility}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="text-[#662654]" /> <strong className="text-gray-800">Work Mode:</strong> {pos.workMode}
                  </p>
                </div>


                {/* Responsibilities */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Responsibilities:</h4>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    {pos.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#662654] font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Required */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Skills Required:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pos.skills.map((s, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Qualification */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Preferred Qualification:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pos.qualifications.map((q, i) => (
                      <li key={i}>• {q}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => scrollToForm(pos.title)}
                  className="w-full bg-[#662654] hover:bg-[#521f43] text-white font-bold py-3 px-6 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  {pos.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY JOIN PAIDHU */}
      <section className="bg-[#ede7d7]/40 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#662654]">Why Join Paidhu?</h2>
            <p className="text-gray-600 mt-2">Empowering culture, hands-on learning, and real growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {whyJoin.map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -3 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-[#ede7d7] text-center flex flex-col items-center space-y-4"
              >
                <div className="p-4 rounded-2xl bg-[#662654]/5">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-base leading-snug">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNSHIP DETAILS & APPLICATION PROCESS */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Information Card */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#ede7d7] space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Shield className="text-3xl text-[#662654]" />
            <h3 className="text-2xl font-serif font-bold text-[#662654]">Internship Details</h3>
          </div>
          <ul className="space-y-4 text-gray-700">
            <li className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500 font-medium">Duration</span>
              <span className="font-semibold">6 Months</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500 font-medium">Type</span>
              <span className="font-semibold">Unpaid Internship</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500 font-medium">Eligibility</span>
              <span className="font-semibold text-[#662654]">Female Candidates Only</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500 font-medium">Experience Required</span>
              <span className="font-semibold">Freshers Can Apply</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500 font-medium">Working Days</span>
              <span className="font-semibold">Monday to Friday</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500 font-medium">Working Hours</span>
              <span className="font-semibold">Flexible</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500 font-medium">Certificate</span>
              <span className="font-semibold text-emerald-700">Provided after completion</span>
            </li>
          </ul>
        </div>

        {/* 4-Step Timeline */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#ede7d7] space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <CheckCircle className="text-3xl text-[#662654]" />
            <h3 className="text-2xl font-serif font-bold text-[#662654]">Application Process</h3>
          </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#662654]/20">
            {[
              { step: '1', title: 'Submit Your Application', desc: 'Fill out the form below with your accurate details and resume.' },
              { step: '2', title: 'Resume Screening', desc: 'Our HR team reviews applications based on skills and enthusiasm.' },
              { step: '3', title: 'Interview', desc: 'Shortlisted candidates will be invited for a short virtual interview.' },
              { step: '4', title: 'Internship Offer', desc: 'Selected interns receive an official offer letter to start.' }
            ].map((s) => (
              <div key={s.step} className="relative flex items-start gap-4 pl-2">
                <div className="w-8 h-8 rounded-full bg-[#662654] text-white flex items-center justify-center font-bold text-sm z-10 shrink-0 shadow">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{s.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLY NOW FORM */}
      <section ref={formRef} className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-[#ede7d7] p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif font-bold text-[#662654]">Apply Now Form</h2>
            <p className="text-gray-600 text-sm">Please fill out the form carefully to submit your application.</p>
          </div>

          {submitSuccess ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-8 text-center space-y-4"
            >
              <CheckCircle className="text-5xl text-emerald-600 mx-auto" />

              <h3 className="text-2xl font-bold">Application Submitted!</h3>
              <p className="text-sm text-emerald-700 max-w-md mx-auto">
                Thank you for applying to Paidhu Ethical Foods. We have received your application and will get back to you soon.
              </p>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Current Location *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, State"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">College / University *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="XYZ University"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Degree *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="BBA / MBA / B.Com / B.Tech"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Graduation Year *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    placeholder="2024 / 2025"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Position Applying For *</label>
                  <select 
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors bg-white cursor-pointer"
                  >
                    <option value="Sales Intern">Sales Intern</option>
                    <option value="Digital Marketing Intern">Digital Marketing Intern</option>
                  </select>
                </div>
              </div>

              {/* Upload Resume */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Upload Resume (PDF/DOC)</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#662654] transition-colors cursor-pointer bg-gray-50/50">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="text-3xl text-[#662654] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">
                    {resumeName ? `Selected: ${resumeName}` : 'Click or Drag & Drop to upload Resume'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF or DOC up to 5MB</p>
                </div>
              </div>

              {/* Portfolio / LinkedIn */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Portfolio / LinkedIn (Optional)</label>
                <input 
                  type="url" 
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://linkedin.in/in/yourprofile or portfolio link"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Cover Letter (Optional)</label>
                <textarea 
                  rows={4}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  placeholder="Tell us why you would like to join Paidhu..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#662654] text-sm transition-colors"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="agreed"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  className="w-4 h-4 text-[#662654] accent-[#662654] rounded cursor-pointer"
                />
                <label htmlFor="agreed" className="text-sm text-gray-600 cursor-pointer">
                  I confirm that all the information provided is accurate.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#662654] hover:bg-[#521f43] text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <Send size={18} /> Submit Application
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#662654]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-[#ede7d7] overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-6 text-left font-bold text-gray-800 flex justify-between items-center hover:text-[#662654] transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === index ? <ChevronUp className="text-[#662654]" /> : <ChevronDown className="text-gray-400" />}
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-6 text-sm text-gray-600 border-t border-gray-50 pt-4"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-gradient-to-r from-[#662654] to-[#4a1b3d] text-[#ede7d7] py-16 px-6 text-center mt-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Ready to Start Your Career?</h2>
          <p className="text-lg text-[#ede7d7]/90 leading-relaxed">
            Become part of Paidhu and gain hands-on experience in a fast-growing ethical food brand.
          </p>
          <div>
            <button 
              onClick={() => scrollToForm()}
              className="bg-[#ede7d7] hover:bg-white text-[#662654] font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              Apply Today
            </button>
          </div>
        </div>
      </section>

      {/* STICKY MOBILE APPLY NOW BUTTON */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <button
          onClick={() => scrollToForm()}
          className="bg-[#662654] text-white font-bold px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-[#ede7d7] active:scale-95"
        >
          <Send size={18} /> Apply Now
        </button>
      </div>

    </div>
  );
};

export default CareersPage;
