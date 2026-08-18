import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/authService';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    setLoading(true);

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

      setSuccess('Password updated successfully! Redirecting to login page...');
      
      // Logout current temporary session
      setTimeout(() => {
        authService.logout();
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-[#662654] rounded-2xl flex items-center justify-center p-3 shadow-md mb-4">
            <img className="h-16 w-auto object-contain" src="/logo.png" alt="Paidhu Logo" />
          </div>
          <h2 className="mt-6 text-3xl font-playfair font-bold text-brand-plum">Change Temporary Password</h2>
          <p className="mt-2 text-sm text-gray-600">For security, you must update your temporary password before proceeding.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleChangePassword}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center border border-green-100 font-medium">
              {success}
            </div>
          )}

          <div className="rounded-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none transition-all"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none transition-all"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-plum hover:bg-brand-plum/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-plum transition-all shadow-md disabled:opacity-70"
            >
              {loading ? 'Updating password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
