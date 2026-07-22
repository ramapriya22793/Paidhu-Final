import React, { useState, useEffect } from 'react';
import { FiTrash2, FiDownload, FiExternalLink, FiSearch, FiFileText } from 'react-icons/fi';
import axios from 'axios';
import authService from '../services/authService';

const CareerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${baseUrl}/api/careers/applications`, config);
      setApplications(res.data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.patch(`${baseUrl}/api/careers/applications/${id}/status`, { status: newStatus }, config);
      fetchApplications();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${baseUrl}/api/careers/applications/${id}`, config);
      fetchApplications();
    } catch (error) {
      console.error('Failed to delete application', error);
    }
  };

  const downloadResume = (app) => {
    if (!app.resumeData) return;
    const link = document.createElement('a');
    link.href = app.resumeData;
    link.download = app.resumeName || `${app.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCSV = () => {
    if (applications.length === 0) return;
    const headers = ['Date', 'Full Name', 'Email', 'Phone', 'Position', 'Location', 'College', 'Degree', 'Graduation Year', 'Portfolio URL', 'Status'];
    const rows = applications.map(a => [
      new Date(a.createdAt).toLocaleDateString(),
      `"${a.fullName}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.position}"`,
      `"${a.location}"`,
      `"${a.college}"`,
      `"${a.degree}"`,
      `"${a.graduationYear}"`,
      `"${a.portfolioUrl || ''}"`,
      `"${a.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Career_Applications_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.phone.includes(searchTerm);
    const matchesPosition = positionFilter === 'ALL' || app.position === positionFilter;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesPosition && matchesStatus;
  });

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Career Applications...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Career Applications</h1>
          <p className="text-gray-500 mt-1">View and manage internship applications received through the Careers page.</p>
        </div>
        <button
          onClick={exportCSV}
          className="bg-brand-plum text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-plum/90 transition-colors flex items-center gap-2 shadow-sm"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center w-full md:w-80 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <FiSearch className="text-gray-400 mr-2" />
          <input 
            type="text"
            placeholder="Search by name, email, college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-700"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select 
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Positions</option>
            <option value="Sales Intern">Sales Intern</option>
            <option value="Digital Marketing Intern">Digital Marketing Intern</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            No applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Applicant</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Position</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Education & Location</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Resume / Portfolio</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 align-top whitespace-nowrap text-xs text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                      <div className="text-[11px] text-gray-400">{new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-gray-900">{app.fullName}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{app.email}</div>
                      <div className="text-xs text-brand-plum font-semibold mt-0.5">{app.phone}</div>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <span className="inline-block bg-purple-50 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-purple-200">
                        {app.position}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-top text-xs space-y-1">
                      <div className="font-semibold text-gray-800">{app.college}</div>
                      <div className="text-gray-600">{app.degree} ({app.graduationYear})</div>
                      <div className="text-gray-400">{app.location}</div>
                    </td>

                    <td className="px-6 py-4 align-top text-xs space-y-2">
                      {app.resumeData ? (
                        <button
                          onClick={() => downloadResume(app)}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <FiFileText /> {app.resumeName || 'Download Resume'}
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">No resume attached</span>
                      )}

                      {app.portfolioUrl && (
                        <div>
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-brand-plum hover:underline"
                          >
                            <FiExternalLink /> Portfolio / LinkedIn
                          </a>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 align-top">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border outline-none cursor-pointer ${
                          app.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          app.status === 'Reviewed' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 align-top text-right">
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title="Delete Application"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerApplications;
