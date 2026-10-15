import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiDownload, 
  FiTrash2, 
  FiExternalLink, 
  FiFileText, 
  FiEye, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle, 
  FiImage, 
  FiVideo, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiUser, 
  FiFilter, 
  FiRefreshCw, 
  FiX, 
  FiCheck,
  FiLayers
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const getApiBase = () => {
  return (import.meta.env && import.meta.env.VITE_API_URL) || 
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : 'https://paidhu-final-anm2.vercel.app');
};

const JustBHappyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [landTypeFilter, setLandTypeFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const API_BASE = getApiBase();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const res = await axios.get(`${API_BASE}/api/farm-applications`, config);
      if (res.data.success) {
        setApplications(res.data.applications || []);
      } else {
        setApplications(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch farm applications:', error);
      toast.error('Could not load farm applications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, notesToSave) => {
    setUpdatingStatus(true);
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const payload = { status: newStatus };
      if (notesToSave !== undefined) payload.notes = notesToSave;

      const res = await axios.patch(`${API_BASE}/api/farm-applications/${id}/status`, payload, config);
      
      toast.success(`Application marked as ${newStatus}`);
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus, notes: notesToSave !== undefined ? notesToSave : app.notes } : app
      ));

      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(prev => ({
          ...prev,
          status: newStatus,
          notes: notesToSave !== undefined ? notesToSave : prev.notes
        }));
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this application?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      await axios.delete(`${API_BASE}/api/farm-applications/${id}`, config);
      toast.success('Application deleted successfully');
      setApplications(prev => prev.filter(a => a.id !== id));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null);
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
      toast.error('Failed to delete application');
    }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setAdminNotes(app.notes || '');
  };

  const exportCSV = () => {
    if (applications.length === 0) {
      toast.info('No applications to export');
      return;
    }
    const headers = [
      'Application ID',
      'Date',
      'Applicant Name',
      'Aadhar Number',
      'Phone',
      'Email',
      'Permanent Address',
      'Land Type',
      'Total Cultivation Area',
      'Edible Flower Area',
      'Previous Crops',
      'Status',
      'Notes'
    ];

    const rows = applications.map(a => [
      `"${a.id}"`,
      new Date(a.createdAt).toLocaleDateString(),
      `"${a.name || ''}"`,
      `"${a.aadharNumber || ''}"`,
      `"${a.phone || ''}"`,
      `"${a.email || ''}"`,
      `"${(a.permanentAddress || '').replace(/"/g, '""')}"`,
      `"${a.landType || ''}"`,
      `"${a.totalCultivationArea || ''}"`,
      `"${a.flowerCultivationArea || ''}"`,
      `"${(a.previousCrops || '').replace(/"/g, '""')}"`,
      `"${a.status || ''}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Just_B_Happy_Farm_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to resolve URLs (relative to backend or full URL)
  const resolveFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Filter applications
  const filteredApps = applications.filter(app => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      (app.name && app.name.toLowerCase().includes(q)) ||
      (app.email && app.email.toLowerCase().includes(q)) ||
      (app.phone && app.phone.includes(q)) ||
      (app.aadharNumber && app.aadharNumber.includes(q)) ||
      (app.permanentAddress && app.permanentAddress.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesLand = landTypeFilter === 'ALL' || app.landType === landTypeFilter;

    return matchesSearch && matchesStatus && matchesLand;
  });

  // KPI Calculations
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const ownCount = applications.filter(a => a.landType === 'Own').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><FiCheckCircle /> Approved</span>;
      case 'Under Review':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><FiClock /> Under Review</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><FiXCircle /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><FiClock /> Pending</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto overflow-x-hidden">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl border border-[#F9E086]/50 shadow-md flex-shrink-0 overflow-hidden flex items-center justify-center bg-[#4E580F]/10">
            <img src="/just_b_happy_logo.png" alt="Paidhu - Just b happy farms" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-playfair font-bold text-[#4E580F]">
                Just B Happy Farm Applications
              </h1>
              <span className="text-xs bg-[#4E580F]/10 text-[#4E580F] border border-[#4E580F]/20 font-bold px-2.5 py-0.5 rounded-full">
                Agrarian Portal
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Review and verify incoming contract farming enrollment forms, title deeds, soil reports, and plot media.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchApplications}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition cursor-pointer"
            title="Refresh List"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <FiDownload />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Pending Review</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{pendingCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Approved Farms</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{approvedCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-brand-plum font-bold uppercase tracking-wider">Own Land vs Leased</p>
          <p className="text-2xl font-bold text-brand-plum mt-2">
            {ownCount} <span className="text-sm font-normal text-gray-400">/ {totalCount - ownCount}</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Phone, Email, Aadhar, City..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-plum/30 focus:border-brand-plum"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-plum/30 bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Land type filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Land:</span>
            <select
              value={landTypeFilter}
              onChange={(e) => setLandTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-plum/30 bg-white"
            >
              <option value="ALL">All Land Types</option>
              <option value="Own">Own Land</option>
              <option value="Leased">Leased Land</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold">Loading Farm Applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Farm Applications Found</h3>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm || statusFilter !== 'ALL' || landTypeFilter !== 'ALL'
                ? 'Try clearing the search or filters.'
                : 'Applications submitted via the website will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-[11px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">Applicant & Aadhar</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Land Type</th>
                  <th className="py-3.5 px-4">Cultivation Area</th>
                  <th className="py-3.5 px-4">Flower Area</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Applicant & Aadhar */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{app.name}</div>
                      <div className="text-xs font-mono text-gray-400 tracking-wide mt-0.5">
                        UID: {app.aadharNumber}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-800">{app.phone}</span>
                        <a
                          href={`https://wa.me/91${app.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${app.name}, this is from Paidhu regarding your Just B Happy Farm Application.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#25D366] hover:text-[#20b858] transition"
                          title="Message on WhatsApp"
                        >
                          <FaWhatsapp className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-[180px]">{app.email}</div>
                    </td>

                    {/* Land Type */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        app.landType === 'Own' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        {app.landType} Land
                      </span>
                    </td>

                    {/* Total Cultivation Area */}
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {app.totalCultivationArea}
                    </td>

                    {/* Flower Cultivation Area */}
                    <td className="py-3.5 px-4 font-semibold text-[#4E580F]">
                      {app.flowerCultivationArea}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openDetails(app)}
                          className="px-3 py-1.5 rounded-lg bg-[#4E580F] text-[#F9E086] text-xs font-bold hover:bg-[#3A420B] transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <FiEye className="w-3.5 h-3.5 text-[#F9E086]" />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Application"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ──────────────── DETAIL INSPECTION MODAL ──────────────── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-100 my-3 sm:my-8">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#F9E086] bg-[#4E580F] p-0.5 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                  <img src="/just_b_happy_logo.png" alt="Just b happy" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{selectedApp.name}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 font-mono truncate">ID: {selectedApp.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {getStatusBadge(selectedApp.status)}
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 text-xs sm:text-sm">
              
              {/* Section 1: Identification & Contact */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Applicant Identification & Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 block">Aadhar Number</span>
                    <span className="font-mono font-bold text-gray-800">{selectedApp.aadharNumber}</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block">Contact Phone</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-gray-800">{selectedApp.phone}</span>
                      <a
                        href={`https://wa.me/91${selectedApp.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedApp.name}, this is Paidhu regarding your Just B Happy Farm Application.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:text-[#20b858]"
                      >
                        <FaWhatsapp className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block">Email Address</span>
                    <span className="font-medium text-gray-800">{selectedApp.email}</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block">Submitted On</span>
                    <span className="font-medium text-gray-800">{new Date(selectedApp.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-xs text-gray-400 block">Permanent Address</span>
                    <span className="font-medium text-gray-800 leading-relaxed block mt-0.5">
                      {selectedApp.permanentAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Land & Farming Metrics */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Agrarian Plot Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 block">Land Holding</span>
                    <span className="font-bold text-gray-900">{selectedApp.landType} Land</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block">Total Cultivation Area</span>
                    <span className="font-bold text-gray-900">{selectedApp.totalCultivationArea}</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block">Edible Flower Proposed</span>
                    <span className="font-bold text-[#662654]">{selectedApp.flowerCultivationArea}</span>
                  </div>

                  {selectedApp.previousCrops && (
                    <div className="sm:col-span-3">
                      <span className="text-xs text-gray-400 block">Previous Crops Cultivated</span>
                      <p className="text-gray-800 mt-0.5">{selectedApp.previousCrops}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Uploaded Documents & Layouts */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Enclosed Legal & Soil Documents
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Soil Test Report */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FiFileText className="w-5 h-5 text-brand-plum flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-800">Soil Test Report</p>
                        <p className="text-[11px] text-gray-400 truncate">{selectedApp.soilTestReportName || 'soil_report'}</p>
                      </div>
                    </div>
                    {selectedApp.soilTestReport ? (
                      <a
                        href={resolveFileUrl(selectedApp.soilTestReport)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-brand-plum hover:text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <FiExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not Uploaded</span>
                    )}
                  </div>

                  {/* Land Registration Doc */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FiFileText className="w-5 h-5 text-brand-plum flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-800">Land Registration Doc</p>
                        <p className="text-[11px] text-gray-400 truncate">{selectedApp.landRegistrationDocName || 'title_deed'}</p>
                      </div>
                    </div>
                    {selectedApp.landRegistrationDoc ? (
                      <a
                        href={resolveFileUrl(selectedApp.landRegistrationDoc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-brand-plum hover:text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <FiExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not Uploaded</span>
                    )}
                  </div>

                  {/* Land Layout */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FiLayers className="w-5 h-5 text-brand-plum flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-800">Land Layout Map</p>
                        <p className="text-[11px] text-gray-400 truncate">{selectedApp.landLayoutName || 'layout_sketch'}</p>
                      </div>
                    </div>
                    {selectedApp.landLayout ? (
                      <a
                        href={resolveFileUrl(selectedApp.landLayout)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-brand-plum hover:text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <FiExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not Uploaded</span>
                    )}
                  </div>

                  {/* EB & Water Details */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FiFileText className="w-5 h-5 text-brand-plum flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-800">EB / Borewell Details</p>
                        <p className="text-[11px] text-gray-400 truncate">{selectedApp.waterSourceDetailsName || 'water_source'}</p>
                      </div>
                    </div>
                    {selectedApp.waterSourceDetails ? (
                      <a
                        href={resolveFileUrl(selectedApp.waterSourceDetails)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-brand-plum hover:text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <FiExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not Uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Photos of all views */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Photos of All Views ({selectedApp.photos?.length || 0})
                </h4>
                {selectedApp.photos && selectedApp.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedApp.photos.map((item, idx) => {
                      const photoUrl = typeof item === 'string' ? item : item.url;
                      const resolved = resolveFileUrl(photoUrl);
                      return (
                        <div
                          key={idx}
                          onClick={() => setLightboxImage(resolved)}
                          className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group cursor-pointer"
                        >
                          <img
                            src={resolved}
                            alt={`Farm photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                            <FiEye className="w-4 h-4 mr-1" /> View
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-xl">
                    No plot photos were attached.
                  </p>
                )}
              </div>

              {/* Section 5: Videography */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Farm Videography Walkthrough
                </h4>
                {selectedApp.videography ? (
                  <div className="bg-black/5 p-4 rounded-2xl border border-gray-200">
                    <video
                      controls
                      src={resolveFileUrl(selectedApp.videography)}
                      className="w-full max-h-72 rounded-xl bg-black"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500">{selectedApp.videographyName || 'Walkthrough video'}</span>
                      <a
                        href={resolveFileUrl(selectedApp.videography)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-plum font-bold hover:underline flex items-center gap-1"
                      >
                        <FiDownload /> Download Video
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-xl">
                    No walkthrough video was uploaded.
                  </p>
                )}
              </div>

              {/* Section 6: Admin Notes & Status Transition */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Agronomist Inspection Notes & Status
                </h4>

                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter internal inspection feedback, soil suitability notes, or buyback agreement progress..."
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-plum/30"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500 font-semibold mr-1">Set Status:</span>
                    {['Pending', 'Under Review', 'Approved', 'Rejected'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedApp.id, st, adminNotes)}
                        disabled={updatingStatus}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          selectedApp.status === st
                            ? 'bg-brand-plum text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApp.id, selectedApp.status, adminNotes)}
                    disabled={updatingStatus}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between rounded-b-3xl">
              <button
                type="button"
                onClick={() => handleDelete(selectedApp.id)}
                className="text-red-600 hover:text-red-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FiTrash2 /> Delete Application
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-xs text-gray-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Lightbox for Photos */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Full plot preview"
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/20 hover:bg-white/40"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      )}

    </div>
  );
};

export default JustBHappyApplications;
