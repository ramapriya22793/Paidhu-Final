import { useState, useEffect } from 'react';
import deliveryService from '../services/deliveryService';
import { FiTruck, FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';

const DeliveryManagement = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    type: '',
    charge: '',
    freeAbove: '',
    estimatedDays: '',
    regions: '',
    isActive: true
  });

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    setLoading(true);
    try {
      const data = await deliveryService.getDeliveryCharges();
      setCharges(data);
    } catch (error) {
      console.error("Error fetching delivery charges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const charge = charges.find(c => c.id === id);
      await deliveryService.updateDeliveryCharge(id, { ...charge, isActive: !currentStatus });
      fetchCharges();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery rule?")) {
      try {
        await deliveryService.deleteDeliveryCharge(id);
        fetchCharges();
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  const handleEdit = (charge) => {
    setEditingId(charge.id);
    setFormData({
      type: charge.type,
      charge: charge.charge,
      freeAbove: charge.freeAbove || '',
      estimatedDays: charge.estimatedDays,
      regions: charge.regions || '',
      isActive: charge.isActive
    });
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ type: '', charge: '', freeAbove: '', estimatedDays: '', regions: '', isActive: true });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await deliveryService.updateDeliveryCharge(editingId, formData);
      } else {
        await deliveryService.createDeliveryCharge(formData);
      }
      setShowModal(false);
      fetchCharges();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save delivery charge");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
          <FiTruck className="mr-2 text-brand-plum" /> Delivery Management
        </h1>
        <button 
          onClick={openNewModal}
          className="bg-brand-plum text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-plum/90 transition-colors flex items-center shadow-sm"
        >
          <FiPlus className="mr-2" /> Add Delivery Rule
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Delivery Type</th>
                <th className="px-6 py-4">Charge</th>
                <th className="px-6 py-4">Free Above</th>
                <th className="px-6 py-4">Est. Days</th>
                <th className="px-6 py-4">Target Regions</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-brand-plum">Loading delivery rules...</td>
                </tr>
              ) : charges.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FiTruck size={32} className="text-gray-300" />
                      <p>No delivery rules found. Create one to calculate shipping at checkout.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                charges.map((charge) => (
                  <tr key={charge.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-plum">
                      {charge.type}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      ₹{charge.charge}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {charge.freeAbove ? `₹${charge.freeAbove}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {charge.estimatedDays}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {charge.regions ? (
                        <span className="truncate max-w-[150px] inline-block" title={charge.regions}>{charge.regions}</span>
                      ) : (
                        <span className="text-brand-plum font-semibold">All Regions</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleToggleActive(charge.id, charge.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                          charge.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {charge.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(charge)}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors"
                        title="Edit Rule"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(charge.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Delete Rule"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-playfair font-bold text-gray-800">
                {editingId ? 'Edit Delivery Rule' : 'Create Delivery Rule'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Standard, Express"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-plum outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Charge (₹) *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-plum outline-none"
                  value={formData.charge}
                  onChange={(e) => setFormData({...formData, charge: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Free Delivery Threshold (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="Leave empty for no free delivery"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-plum outline-none"
                  value={formData.freeAbove}
                  onChange={(e) => setFormData({...formData, freeAbove: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Days *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 3-5 Business Days"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-plum outline-none"
                  value={formData.estimatedDays}
                  onChange={(e) => setFormData({...formData, estimatedDays: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Regions (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Maharashtra, 400001 (Leave blank for all)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-plum outline-none"
                  value={formData.regions}
                  onChange={(e) => setFormData({...formData, regions: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-brand-plum rounded focus:ring-brand-plum"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Rule is active
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-brand-plum text-white rounded-lg hover:bg-brand-plum/90 transition-colors font-medium disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;
