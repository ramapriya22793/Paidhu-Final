import { useState, useEffect } from 'react';
import { FiUser, FiKey, FiLock } from 'react-icons/fi';
import axios from 'axios';
import authService from '../services/authService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const token = authService.getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.put(
        (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/admin/change-password',
        { newPassword },
        config
      );

      setSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair">Admin Profile</h1>
      </div>

      {success && (
        <div className="p-4 rounded-lg bg-green-50 text-green-700 font-medium text-sm border border-green-100">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 font-medium text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-brand-cream text-brand-plum rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-inner">
            {user.name?.charAt(0) || <FiUser />}
          </div>
          <h3 className="text-xl font-bold text-gray-800 font-playfair">{user.name}</h3>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          <span className="mt-4 px-3 py-1 bg-brand-plum/10 text-brand-plum text-xs font-semibold uppercase tracking-wider rounded-full">
            {user.role?.replace('_', ' ') || 'SUPER ADMIN'}
          </span>
        </div>

        {/* Password Reset Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-cream p-3 rounded-lg text-brand-plum">
              <FiKey size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
              <p className="text-gray-500 text-sm">Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  disabled={submitting}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  required
                  disabled={submitting}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-brand-plum text-white px-6 py-2.5 rounded-lg font-bold hover:bg-brand-plum/90 transition-all shadow-md disabled:opacity-70 text-sm"
              >
                <FiLock size={18} />
                {submitting ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
