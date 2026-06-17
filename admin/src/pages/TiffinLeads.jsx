import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiSearch, FiDownload, FiCheckCircle, FiXCircle, FiCalendar } from 'react-icons/fi';

const TiffinLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/tiffin-registrations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setLeads(res.data);
      } catch (error) {
        console.error('Failed to fetch tiffin registrations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Filter leads by phone number search
  const filteredLeads = leads.filter(lead => 
    lead.phone.toLowerCase().includes(search.toLowerCase())
  );

  // Function to export leads as a CSV file
  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;
    
    // Headers and rows
    const headers = ['ID', 'Phone Number', 'Consent Status', 'Registration Date'];
    const rows = filteredLeads.map(lead => [
      lead.id,
      lead.phone,
      lead.consent ? 'YES' : 'NO',
      new Date(lead.createdAt).toLocaleString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Paidhu_Tiffin_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8 text-brand-plum flex items-center space-x-2">
        <div className="w-5 h-5 border-2 border-brand-plum border-t-transparent rounded-full animate-spin"></div>
        <span>Loading tiffin leads...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-800">WhatsApp Leads</h1>
          <p className="text-gray-500 mt-1">View and export subscribers who signed up for kids' school tiffin updates.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-2">
            <FiUsers className="text-brand-plum" />
            <span className="font-bold text-gray-800">{leads.length} Subscribers</span>
          </div>
          <button
            onClick={exportToCSV}
            disabled={filteredLeads.length === 0}
            className="flex items-center gap-2 bg-brand-plum hover:bg-brand-plum/90 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-bold transition-all shadow cursor-pointer active:scale-95 text-sm"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Table container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="p-5 border-b border-gray-100 flex items-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-plum text-sm transition-all"
            />
            <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Leads Table */}
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <FiUsers size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600">No subscribers found matching search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6 text-center">Consent Status</th>
                  <th className="py-4 px-6">Date Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/45 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-500">#{lead.id}</td>
                    <td className="py-4 px-6 font-bold text-gray-800">{lead.phone}</td>
                    <td className="py-4 px-6 text-center">
                      {lead.consent ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                          <FiCheckCircle /> CONSENTED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                          <FiXCircle /> NO CONSENT
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FiCalendar /> {new Date(lead.createdAt).toLocaleString()}
                      </span>
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

export default TiffinLeads;
