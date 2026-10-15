import React, { useState, useRef } from 'react';
import { 
  Sprout, 
  Upload, 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Layers, 
  Info, 
  X,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import SEO from '../components/seo/SEO';
import FarmBannerSlider from '../components/farm/FarmBannerSlider';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://paidhu-final-anm2.vercel.app');

// Exact Brand Colors from Just B Happy Logo
// Primary Olive Green: #4E580F
// Primary Warm Gold:   #F9E086
// Dark Olive Shade:    #3A420B
// Light Natural Tint:  #F7F8F0

const JustBHappyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    aadharNumber: '',
    email: '',
    phone: '',
    permanentAddress: '',
    landType: 'Own', // 'Own' | 'Leased'
    totalCultivationArea: '',
    flowerCultivationArea: '',
    previousCrops: '',
    notes: '',
    declaration: false
  });

  const [files, setFiles] = useState({
    soilTestReport: null,
    landRegistrationDoc: null,
    landLayout: null,
    waterSourceDetails: null,
    photos: [],
    videography: null
  });

  const [previews, setPreviews] = useState({
    photos: []
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Refs for custom file pickers
  const soilRef = useRef(null);
  const landDocRef = useRef(null);
  const layoutRef = useRef(null);
  const waterRef = useRef(null);
  const photosRef = useRef(null);
  const videoRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Auto-format Aadhar with spaces: XXXX XXXX XXXX
  const handleAadharChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    let formatted = '';
    for (let i = 0; i < raw.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += raw[i];
    }
    setFormData(prev => ({ ...prev, aadharNumber: formatted }));
  };

  // Single file handlers
  const handleSingleFile = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setSubmitError(`File "${file.name}" exceeds the 50MB limit.`);
        return;
      }
      setFiles(prev => ({ ...prev, [field]: file }));
      setSubmitError('');
    }
  };

  // Multiple photos handler
  const handlePhotos = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length + files.photos.length > 10) {
      setSubmitError('You can upload up to 10 photos of the farm plot.');
      return;
    }

    const newPhotos = [...files.photos, ...selected];
    setFiles(prev => ({ ...prev, photos: newPhotos }));

    // Generate preview thumbnails
    const newPreviews = selected.map(file => URL.createObjectURL(file));
    setPreviews(prev => ({ ...prev, photos: [...prev.photos, ...newPreviews] }));
    setSubmitError('');
  };

  const removePhoto = (index) => {
    setFiles(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPreviews(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Video file handler
  const handleVideo = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setSubmitError('Video file size exceeds the 100MB limit.');
        return;
      }
      setFiles(prev => ({ ...prev, videography: file }));
      setSubmitError('');
    }
  };

  const validateStep1 = () => {
    setSubmitError('');
    if (!formData.name.trim()) {
      setSubmitError('Please enter your full Name in Applicant Identification.');
      return false;
    }
    const cleanAadhar = formData.aadharNumber.replace(/\s+/g, '');
    if (!cleanAadhar || cleanAadhar.length !== 12 || !/^\d{12}$/.test(cleanAadhar)) {
      setSubmitError('Please enter a valid 12-digit UIDAI Aadhar Number.');
      return false;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setSubmitError('Please enter a valid 10-digit mobile phone number.');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setSubmitError('Please enter a valid email address.');
      return false;
    }
    if (!formData.permanentAddress.trim()) {
      setSubmitError('Please enter your Permanent Address.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    setSubmitError('');
    if (!formData.totalCultivationArea.trim()) {
      setSubmitError('Please specify the Total Cultivation Area in Step 2.');
      return false;
    }
    if (!formData.flowerCultivationArea.trim()) {
      setSubmitError('Please specify the Area of Edible Flower Cultivation Proposing in Step 2.');
      return false;
    }
    return true;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) {
      setSubmitError('');
      setCurrentStep(2);
      setTimeout(() => {
        const el = document.getElementById('farm-application-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleNextStep2 = () => {
    if (validateStep2()) {
      setSubmitError('');
      setCurrentStep(3);
      setTimeout(() => {
        const el = document.getElementById('farm-application-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handlePrevStep1 = () => {
    setCurrentStep(1);
    setSubmitError('');
    setTimeout(() => {
      const el = document.getElementById('farm-application-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handlePrevStep2 = () => {
    setCurrentStep(2);
    setSubmitError('');
    setTimeout(() => {
      const el = document.getElementById('farm-application-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }

    if (!formData.declaration) {
      setSubmitError('Please acknowledge the declaration checkbox before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('aadharNumber', formData.aadharNumber);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('permanentAddress', formData.permanentAddress);
      data.append('landType', formData.landType);
      data.append('totalCultivationArea', formData.totalCultivationArea);
      data.append('flowerCultivationArea', formData.flowerCultivationArea);
      data.append('previousCrops', formData.previousCrops);
      if (formData.notes) data.append('notes', formData.notes);

      // Append documents
      if (files.soilTestReport) data.append('soilTestReport', files.soilTestReport);
      if (files.landRegistrationDoc) data.append('landRegistrationDoc', files.landRegistrationDoc);
      if (files.landLayout) data.append('landLayout', files.landLayout);
      if (files.waterSourceDetails) data.append('waterSourceDetails', files.waterSourceDetails);
      if (files.videography) data.append('videography', files.videography);

      // Append photos
      files.photos.forEach(photo => {
        data.append('photos', photo);
      });

      const response = await fetch(`${API_BASE}/api/farm-applications`, {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit application. Please check your network and try again.');
      }

      setApplicationId(result.applicationId || result.application?.id || 'PAIDHU-JBH');
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-gray-800 overflow-x-hidden">
      <SEO 
        title="PAIDHU - Just B Happy Farm Application | Contract Botanical Farming"
        description="Official PAIDHU - Just B Happy Farm Application. Partner with us for guaranteed buyback, ethical edible flower cultivation, and technical farming support."
        slug="just-b-happy"
        image="/just_b_happy_logo.png"
      />

      {/* ──────────────── SCROLLING BANNER IMAGE CAROUSEL ──────────────── */}
      <FarmBannerSlider onScrollToForm={() => {
        const el = document.getElementById('farm-application-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* ──────────────── MAIN FORM CONTAINER ──────────────── */}
      <div id="farm-application-form" className="max-w-3xl sm:max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
        
        {/* Success Screen */}
        {submitSuccess ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#4E580F]/20 p-5 sm:p-10 md:p-12 text-center animate-fade-in">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5 relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center bg-[#4E580F]/5">
                <img 
                  src="/just_b_happy_logo.png" 
                  alt="Just b happy farms" 
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 sm:p-1.5 rounded-full border-2 border-white shadow">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#4E580F] bg-[#F7F8F0] px-3.5 py-1 rounded-full border border-[#4E580F]/30">
              Application Enrolled Successfully
            </span>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-4 mb-2">
              Welcome to Just b happy, {formData.name}!
            </h2>

            <p className="text-gray-600 max-w-lg mx-auto text-xs sm:text-sm md:text-base mb-6 leading-relaxed">
              Your application for the <strong>PAIDHU - Just b happy Farm</strong> initiative has been registered in our central agrarian verification system.
            </p>

            <div className="bg-[#F7F8F0] border-2 border-[#4E580F]/20 rounded-2xl p-4 sm:p-5 max-w-md mx-auto mb-6 text-left shadow-sm">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider">Application Reference ID</p>
              <p className="text-sm sm:text-base md:text-lg font-mono font-bold text-[#4E580F] break-all">{applicationId}</p>
              <div className="mt-2.5 pt-2.5 border-t border-[#4E580F]/15 text-[11px] sm:text-xs text-gray-600">
                Our farm inspection agronomist will review your submitted land documents and connect with you on <strong className="text-gray-900">{formData.phone}</strong>.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/918754787774?text=${encodeURIComponent(`Hello Paidhu Team, I have submitted my Just B Happy Farm Application (ID: ${applicationId}). Please verify my details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#20b858] transition-all cursor-pointer"
              >
                <span>Connect with Agronomist on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setCurrentStep(1);
                  setFormData({
                    name: '',
                    aadharNumber: '',
                    email: '',
                    phone: '',
                    permanentAddress: '',
                    landType: 'Own',
                    totalCultivationArea: '',
                    flowerCultivationArea: '',
                    previousCrops: '',
                    notes: '',
                    declaration: false
                  });
                  setFiles({
                    soilTestReport: null,
                    landRegistrationDoc: null,
                    landLayout: null,
                    waterSourceDetails: null,
                    photos: [],
                    videography: null
                  });
                  setPreviews({ photos: [] });
                }}
                className="px-6 py-3.5 rounded-full bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm hover:bg-gray-200 transition-all cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* Application Form Card */
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#4E580F]/20 overflow-hidden">
            
            {/* Form Header with Centered Just B Happy Farms Logo */}
            <div className="bg-gradient-to-b from-[#F7F8F0] via-white to-white border-b border-[#4E580F]/15 p-6 sm:p-8 text-center flex flex-col items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg mb-3.5 flex items-center justify-center p-0.5 bg-[#4E580F]/5">
                <img 
                  src="/just_b_happy_logo.png" 
                  alt="Paidhu - Just b happy farms" 
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-[#4E580F] tracking-tight">
                PAIDHU-Just B Happy Farm Application
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl mx-auto leading-relaxed">
                Please provide accurate personal identity, land boundaries, water sources, and agrarian history. All documents submitted are held securely under our strict confidentiality policy.
              </p>

              {/* 3-Step Progress Tracker */}
              <div className="w-full max-w-xl mx-auto mt-6 pt-5 border-t border-[#4E580F]/15">
                <div className="flex items-center justify-between">
                  {/* Step 1 Indicator */}
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep > 1) handlePrevStep1();
                    }}
                    className={`flex items-center gap-2 sm:gap-2.5 transition text-left ${
                      currentStep > 1 ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                    }`}
                  >
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                      currentStep === 1 
                        ? 'bg-[#4E580F] text-[#F9E086] ring-4 ring-[#4E580F]/20 shadow-md' 
                        : currentStep > 1
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                    </span>
                    <div className="hidden xs:block sm:block">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-bold">Step 1</p>
                      <p className={`text-[11px] sm:text-xs font-bold ${currentStep === 1 ? 'text-[#4E580F]' : 'text-gray-700'}`}>Applicant</p>
                    </div>
                  </button>

                  <div className={`flex-1 h-1 mx-2 sm:mx-3 rounded-full transition-all duration-300 ${
                    currentStep >= 2 ? 'bg-[#4E580F]' : 'bg-gray-200'
                  }`} />

                  {/* Step 2 Indicator */}
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 3) handlePrevStep2();
                      else if (currentStep === 1) handleNextStep1();
                    }}
                    className={`flex items-center gap-2 sm:gap-2.5 transition text-left ${
                      currentStep === 3 ? 'cursor-pointer hover:opacity-80' : currentStep === 1 ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                      currentStep === 2 
                        ? 'bg-[#4E580F] text-[#F9E086] ring-4 ring-[#4E580F]/20 shadow-md' 
                        : currentStep > 2
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                    </span>
                    <div className="hidden xs:block sm:block">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-bold">Step 2</p>
                      <p className={`text-[11px] sm:text-xs font-bold ${currentStep === 2 ? 'text-[#4E580F]' : currentStep > 2 ? 'text-gray-700' : 'text-gray-400'}`}>Land Metrics</p>
                    </div>
                  </button>

                  <div className={`flex-1 h-1 mx-2 sm:mx-3 rounded-full transition-all duration-300 ${
                    currentStep === 3 ? 'bg-[#4E580F]' : 'bg-gray-200'
                  }`} />

                  {/* Step 3 Indicator */}
                  <div className="flex items-center gap-2 sm:gap-2.5 transition text-left">
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                      currentStep === 3 
                        ? 'bg-[#4E580F] text-[#F9E086] ring-4 ring-[#4E580F]/20 shadow-md' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      3
                    </span>
                    <div className="hidden xs:block sm:block">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-bold">Step 3</p>
                      <p className={`text-[11px] sm:text-xs font-bold ${currentStep === 3 ? 'text-[#4E580F]' : 'text-gray-400'}`}>Documents & Submit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="mx-4 sm:mx-8 mt-5 p-3.5 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-2.5 text-red-700 text-xs sm:text-sm">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Submission Notice</p>
                  <p className="mt-0.5">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="p-4 sm:p-7 md:p-8 space-y-7 sm:space-y-10">

              {/* ──────────────── STEP 1: APPLICANT DETAILS ──────────────── */}
              {currentStep === 1 && (
                <div className="space-y-6 sm:space-y-8 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2 pb-2.5 mb-5 border-b border-[#4E580F]/15">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#4E580F] text-[#F9E086] text-xs font-bold flex items-center justify-center shadow-sm flex-shrink-0">
                    1
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#4E580F] uppercase tracking-wide">
                    Applicant Identification
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4E580F]/30 focus:border-[#4E580F] transition text-sm bg-[#F7F8F0]/40"
                    />
                  </div>

                  {/* Aadhar Number */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Aadhar Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      required
                      value={formData.aadharNumber}
                      onChange={handleAadharChange}
                      maxLength={14}
                      placeholder="XXXX XXXX XXXX"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4E580F]/30 focus:border-[#4E580F] transition text-sm font-mono tracking-wider bg-[#F7F8F0]/40"
                    />
                    <span className="text-[10px] sm:text-[11px] text-gray-400 mt-1 block">12-digit UIDAI number</span>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4E580F] font-bold text-xs sm:text-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={12}
                        placeholder="98765 43210"
                        className="w-full pl-11 pr-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4E580F]/30 focus:border-[#4E580F] transition text-sm bg-[#F7F8F0]/40"
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-gray-400 mt-1 block">Direct WhatsApp reachable number</span>
                  </div>

                  {/* Mail Id */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Mail Id <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="farmer.name@gmail.com"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4E580F]/30 focus:border-[#4E580F] transition text-sm bg-[#F7F8F0]/40"
                    />
                  </div>

                  {/* Permanent Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Permanent Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="permanentAddress"
                      required
                      rows={3}
                      value={formData.permanentAddress}
                      onChange={handleInputChange}
                      placeholder="Door No, Street Name, Village/Town, Taluk/District, State, Pincode"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4E580F]/30 focus:border-[#4E580F] transition text-sm bg-[#F7F8F0]/40 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Next Step Action Button */}
              <div className="pt-4 sm:pt-6 border-t border-[#4E580F]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
                  <span>Step 1 of 3: Please complete applicant details to continue</span>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-full bg-gradient-to-r from-[#4E580F] via-[#5A6611] to-[#3A420B] text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:from-[#3A420B] hover:to-[#4E580F] border-2 border-[#F9E086]/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-[#F9E086]">Next: Land & Cultivation Metrics</span>
                  <ArrowRight className="w-4 h-4 text-[#F9E086]" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: SECTIONS 2 & 3 (LAND, DOCUMENTS & SUBMIT) ──────────────── */}
          {currentStep === 2 && (
            <div className="space-y-7 sm:space-y-10 animate-fade-in">
              {/* ──────────────── SECTION 2: LAND & CULTIVATION ──────────────── */}
              <div>
                <div className="flex items-center gap-2 pb-2.5 mb-5 border-b border-[#4E580F]/15">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#4E580F] text-[#F9E086] text-xs font-bold flex items-center justify-center shadow-sm flex-shrink-0">
                    2
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#4E580F] uppercase tracking-wide">
                    Land & Cultivation Metrics
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Land Type */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Land Type: Own/Leased <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      {['Own', 'Leased'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, landType: type }))}
                          className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            formData.landType === type
                              ? 'border-[#4E580F] bg-[#4E580F] text-[#F9E086] shadow-md'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-[#4E580F]/50'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            formData.landType === type ? 'border-[#F9E086]' : 'border-gray-400'
                          }`}>
                            {formData.landType === type && <div className="w-1.5 h-1.5 rounded-full bg-[#F9E086]" />}
                          </div>
                          <span>{type} Land</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total Cultivation Area */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Total Cultivation Area <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="totalCultivationArea"
                      required
                      value={formData.totalCultivationArea}
                      onChange={handleInputChange}
                      placeholder="e.g. 5 Acres / 200 Cents"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4E580F]/30 focus:border-[#4E580F] transition text-sm bg-[#F7F8F0]/40"
                    />
                  </div>

                  {/* Area of Edible Flower Cultivation Proposing */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Area of Edible Flower Cultivation Proposing <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="flowerCultivationArea"
                      required
                      value={formData.flowerCultivationArea}
                      onChange={handleInputChange}
                      placeholder="e.g. 2 Acres / 50 Cents"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4E580F]/30 focus:border-[#4E580F] transition text-sm bg-[#F7F8F0]/40"
                    />
                  </div>

                  {/* Previous Crops Cultivated */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Previous Crops Cultivated in the Proposed Area
                    </label>
                    <textarea
                      name="previousCrops"
                      rows={2}
                      value={formData.previousCrops}
                      onChange={handleInputChange}
                      placeholder="e.g. Organic Paddy, Vegetables, Cotton, Turmeric, or Fallow Land for last 2 years..."
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4E580F]/30 focus:border-[#4E580F] transition text-sm bg-[#F7F8F0]/40 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 Action Buttons */}
              <div className="pt-4 sm:pt-6 border-t border-[#4E580F]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handlePrevStep1}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-300"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                  <span>Back to Applicant Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-full bg-gradient-to-r from-[#4E580F] via-[#5A6611] to-[#3A420B] text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:from-[#3A420B] hover:to-[#4E580F] border-2 border-[#F9E086]/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-[#F9E086]">Next: Upload Farm Documents</span>
                  <ArrowRight className="w-4 h-4 text-[#F9E086]" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: SECTION 3 (DOCUMENTS & DECLARATION) ──────────────── */}
          {currentStep === 3 && (
            <div className="space-y-7 sm:space-y-10 animate-fade-in">
              {/* ──────────────── SECTION 3: PROPOSED AREA DOCS & MEDIA ──────────────── */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#4E580F]/15">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#4E580F] text-[#F9E086] text-xs font-bold flex items-center justify-center shadow-sm flex-shrink-0">
                    3
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#4E580F] uppercase tracking-wide">
                    Proposed Area Doc’s to be Uploaded
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mb-5">
                  Please upload clear PDF or image documents up to 50MB, and land walkthrough video up to 100MB.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">

                  {/* 1. Soil Test Report */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#4E580F]/20 bg-[#F7F8F0]/50 hover:bg-white hover:border-[#4E580F] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileCheck className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
                          Soil Test Report
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">PDF / Image</span>
                    </div>

                    <input
                      ref={soilRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) => handleSingleFile('soilTestReport', e)}
                      className="hidden"
                    />

                    {files.soilTestReport ? (
                      <div className="flex items-center justify-between p-2 sm:p-2.5 bg-white border border-[#4E580F] rounded-xl text-xs text-[#4E580F] font-bold">
                        <span className="truncate flex-1 min-w-0 mr-2">{files.soilTestReport.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(prev => ({ ...prev, soilTestReport: null }))}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => soilRef.current?.click()}
                        className="w-full py-2.5 sm:py-3 px-3 border border-dashed border-[#4E580F]/40 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#4E580F] hover:border-[#4E580F] flex items-center justify-center gap-1.5 bg-white transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#4E580F]" />
                        <span>Choose Soil Test Report</span>
                      </button>
                    )}
                  </div>

                  {/* 2. Land Registration Document */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#4E580F]/20 bg-[#F7F8F0]/50 hover:bg-white hover:border-[#4E580F] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
                          Land Registration Document
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">Patta / Title</span>
                    </div>

                    <input
                      ref={landDocRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) => handleSingleFile('landRegistrationDoc', e)}
                      className="hidden"
                    />

                    {files.landRegistrationDoc ? (
                      <div className="flex items-center justify-between p-2 sm:p-2.5 bg-white border border-[#4E580F] rounded-xl text-xs text-[#4E580F] font-bold">
                        <span className="truncate flex-1 min-w-0 mr-2">{files.landRegistrationDoc.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(prev => ({ ...prev, landRegistrationDoc: null }))}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => landDocRef.current?.click()}
                        className="w-full py-2.5 sm:py-3 px-3 border border-dashed border-[#4E580F]/40 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#4E580F] hover:border-[#4E580F] flex items-center justify-center gap-1.5 bg-white transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#4E580F]" />
                        <span>Choose Land Document</span>
                      </button>
                    )}
                  </div>

                  {/* 3. Land Layout */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#4E580F]/20 bg-[#F7F8F0]/50 hover:bg-white hover:border-[#4E580F] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <Layers className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
                          Land Layout
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">Survey Map</span>
                    </div>

                    <input
                      ref={layoutRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) => handleSingleFile('landLayout', e)}
                      className="hidden"
                    />

                    {files.landLayout ? (
                      <div className="flex items-center justify-between p-2 sm:p-2.5 bg-white border border-[#4E580F] rounded-xl text-xs text-[#4E580F] font-bold">
                        <span className="truncate flex-1 min-w-0 mr-2">{files.landLayout.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(prev => ({ ...prev, landLayout: null }))}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => layoutRef.current?.click()}
                        className="w-full py-2.5 sm:py-3 px-3 border border-dashed border-[#4E580F]/40 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#4E580F] hover:border-[#4E580F] flex items-center justify-center gap-1.5 bg-white transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#4E580F]" />
                        <span>Choose Land Layout Map</span>
                      </button>
                    )}
                  </div>

                  {/* 4. EB; Borewell/Water Source Details & Layout */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#4E580F]/20 bg-[#F7F8F0]/50 hover:bg-white hover:border-[#4E580F] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <Sparkles className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
                          EB; Borewell / Water Source Layout
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">Power / Water</span>
                    </div>

                    <input
                      ref={waterRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) => handleSingleFile('waterSourceDetails', e)}
                      className="hidden"
                    />

                    {files.waterSourceDetails ? (
                      <div className="flex items-center justify-between p-2 sm:p-2.5 bg-white border border-[#4E580F] rounded-xl text-xs text-[#4E580F] font-bold">
                        <span className="truncate flex-1 min-w-0 mr-2">{files.waterSourceDetails.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(prev => ({ ...prev, waterSourceDetails: null }))}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => waterRef.current?.click()}
                        className="w-full py-2.5 sm:py-3 px-3 border border-dashed border-[#4E580F]/40 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#4E580F] hover:border-[#4E580F] flex items-center justify-center gap-1.5 bg-white transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#4E580F]" />
                        <span>Choose EB / Water Source Doc</span>
                      </button>
                    )}
                  </div>

                  {/* 5. Photos of all views (Multiple images) */}
                  <div className="md:col-span-2 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#4E580F]/20 bg-[#F7F8F0]/50 hover:bg-white hover:border-[#4E580F] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <ImageIcon className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
                          Photos of all Views
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">Up to 10 photos</span>
                    </div>

                    <input
                      ref={photosRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotos}
                      className="hidden"
                    />

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => photosRef.current?.click()}
                        className="w-full py-2.5 sm:py-3 px-3 border border-dashed border-[#4E580F]/40 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#4E580F] hover:border-[#4E580F] flex items-center justify-center gap-1.5 bg-white transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#4E580F]" />
                        <span>Add Land View Photos ({files.photos.length}/10 selected)</span>
                      </button>

                      {previews.photos.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-1.5">
                          {previews.photos.map((src, idx) => (
                            <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-[#4E580F]/30 aspect-square shadow-sm">
                              <img src={src} alt={`Farm view ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removePhoto(idx)}
                                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 6. Videography */}
                  <div className="md:col-span-2 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#4E580F]/20 bg-[#F7F8F0]/50 hover:bg-white hover:border-[#4E580F] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <Video className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
                          Videography (Plot Walkthrough Video)
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">Up to 100MB</span>
                    </div>

                    <input
                      ref={videoRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      onChange={handleVideo}
                      className="hidden"
                    />

                    {files.videography ? (
                      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white border border-[#4E580F] rounded-xl text-xs text-[#4E580F] font-bold">
                        <div className="flex items-center gap-1.5 truncate flex-1 min-w-0 mr-2">
                          <Video className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
                          <span className="truncate">{files.videography.name} ({(files.videography.size / (1024 * 1024)).toFixed(1)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFiles(prev => ({ ...prev, videography: null }))}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => videoRef.current?.click()}
                        className="w-full py-2.5 sm:py-3 px-3 border border-dashed border-[#4E580F]/40 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#4E580F] hover:border-[#4E580F] flex items-center justify-center gap-1.5 bg-white transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#4E580F]" />
                        <span>Upload Video Walkthrough of Proposed Land</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* ──────────────── DECLARATION & SUBMIT ──────────────── */}
              <div className="pt-3 sm:pt-4 border-t border-[#4E580F]/15">
                <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="declaration"
                    required
                    checked={formData.declaration}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#4E580F] focus:ring-[#4E580F] cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 transition leading-relaxed">
                    I hereby declare that all information provided above and enclosed documents are true, accurate, and correspond to my lawful land holding / valid lease tenancy. I understand that false statements will result in immediate disqualification.
                  </span>
                </label>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep2}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                    <span>Back to Land Metrics</span>
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-1.5 font-medium text-center sm:text-left">
                      <ShieldCheck className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
                      <span>Encrypted & Verified via Paidhu Agrarian Database</span>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-full bg-gradient-to-r from-[#4E580F] via-[#5A6611] to-[#3A420B] text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:from-[#3A420B] hover:to-[#4E580F] border-2 border-[#F9E086]/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Application & Files...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#F9E086]">Submit Farm Application</span>
                          <ArrowRight className="w-4 h-4 text-[#F9E086]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default JustBHappyPage;
