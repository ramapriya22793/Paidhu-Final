import { useState, useEffect } from 'react';
import { FiTrash2, FiRefreshCw, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import authService from '../services/authService';

const API = import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app';

const STATUS_STYLES = {
  Pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  Contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  Resolved:  'bg-green-50 text-green-700 border-green-200',
};

const SaffronGuidanceLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ total: 0, pending: 0, contacted: 0, resolved: 0 });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const res = await axios.get(`${API}/api/saffron-guidance`, config);
      setLeads(res.data);
      setCounts({
        total: res.data.length,
        pending:   res.data.filter(l => l.status === 'Pending').length,
        contacted: res.data.filter(l => l.status === 'Contacted').length,
        resolved:  res.data.filter(l => l.status === 'Resolved').length,
      });
    } catch (err) {
      console.error('Failed to fetch saffron leads', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      await axios.patch(`${API}/api/saffron-guidance/${id}/status`, { status }, config);
      fetchLeads();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      await axios.delete(`${API}/api/saffron-guidance/${id}`, config);
      fetchLeads();
    } catch (err) {
      console.error('Failed to delete entry', err);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Date', 'Your Name', 'Spouse Name', 'Phone', 'Purpose', 'Pregnancy Month', 'Doctor Permission', 'Status'];
    const csvRows = [
      headers.join(','),
      ...leads.map(lead => {
        return [
          new Date(lead.createdAt).toLocaleString('en-IN').replace(/,/g, ' '),
          `"${(lead.yourName || '').replace(/"/g, '""')}"`,
          `"${(lead.spouseName || '').replace(/"/g, '""')}"`,
          `"${lead.phone || ''}"`,
          `"${(lead.purpose || '').replace(/"/g, '""')}"`,
          lead.pregnancyMonth || '',
          `"${lead.doctorPermission || ''}"`,
          `"${lead.status || ''}"`
        ].join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Saffron_Guidance_Leads_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="p-8 text-center text-gray-500 flex items-center justify-center gap-3">
      <FiRefreshCw className="animate-spin" /> Loading Saffron Guidance Leads...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 flex items-center gap-3">
            🌸 Saffron Guidance Leads
          </h1>
          <p className="text-gray-500 mt-1">
            All form submissions from the Saffron Guidance page on the website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-semibold transition-colors"
          >
            <FiDownload size={14} /> Export to Excel
          </button>
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold transition-colors border border-transparent"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: counts.total, color: 'from-[#662654] to-[#7a2e64]', emoji: '📋' },
          { label: 'Pending',     value: counts.pending,   color: 'from-yellow-500 to-yellow-400', emoji: '⏳' },
          { label: 'Contacted',   value: counts.contacted, color: 'from-blue-500 to-blue-400',     emoji: '📞' },
          { label: 'Resolved',    value: counts.resolved,  color: 'from-emerald-500 to-emerald-400', emoji: '✅' },
        ].map(card => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="text-3xl mb-1">{card.emoji}</div>
            <div className="text-3xl font-black">{card.value}</div>
            <div className="text-sm font-semibold opacity-80 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-5xl mb-4">🌸</div>
            <p className="text-gray-500 font-medium text-lg">No Saffron Guidance submissions yet.</p>
            <p className="text-gray-400 text-sm mt-2">They will appear here when customers fill the form.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Date</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Names</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Phone</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Purpose</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Pregnancy</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Doctor Permission</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 align-top whitespace-nowrap text-sm text-gray-600">
                      <div className="font-semibold">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="font-bold text-gray-900">{lead.yourName}</div>
                      {lead.purpose === 'Pregnancy Support' && lead.spouseName && lead.spouseName !== 'N/A' && (
                        <div className="text-sm text-gray-500 mt-0.5">Spouse: {lead.spouseName}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <a href={`tel:${lead.phone}`} className="text-[#662654] font-semibold text-sm hover:underline">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-gray-700 max-w-[140px]">
                      {lead.purpose}
                    </td>
                    <td className="px-5 py-4 align-top">
                      {lead.purpose === 'Pregnancy Support' ? (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
                          🤰 Month {lead.pregnancyMonth}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top">
                      {lead.purpose === 'Pregnancy Support' ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold rounded-full px-3 py-1 border ${
                          lead.doctorPermission === 'Yes'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {lead.doctorPermission === 'Yes' ? '✅ Yes' : '❌ No'}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <select
                        value={lead.status}
                        onChange={e => updateStatus(lead.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1.5 border outline-none cursor-pointer ${STATUS_STYLES[lead.status] || STATUS_STYLES.Pending}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 align-top text-right">
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title="Delete"
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

export default SaffronGuidanceLeads;
