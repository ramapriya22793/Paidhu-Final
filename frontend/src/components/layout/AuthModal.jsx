import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthModal = ({ isOpen, onClose, onLoginSuccess, user, onLogout }) => {
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot', 'reset'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Register specific
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Reset specific
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const resetState = () => {
    setError('');
    setPassword('');
    setResetToken('');
    setNewPassword('');
    // keep phone, name, email for convenience if they switch tabs
  };

  const handleSwitchView = (newView) => {
    setView(newView);
    resetState();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('paidhu_token', data.token);
        if (onLoginSuccess) onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, email, password, addressLine1, city, state, pincode })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('paidhu_token', data.token);
        if (onLoginSuccess) onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (res.ok) {
        // Mock showing the token for testing purposes, normally sent via SMS
        alert(`Reset token sent: ${data.resetToken}`);
        setView('reset');
      } else {
        setError(data.message || 'Failed to request reset');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, token: resetToken, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password reset successfully! Please login.');
        setView('login');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-[10000] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center space-x-2">
                {view !== 'login' && view !== 'register' && (
                  <button onClick={() => handleSwitchView('login')} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h2 className="text-xl font-black text-gray-800 tracking-tight">
                  {user ? 'My Account' : (
                    view === 'login' ? 'Welcome Back' :
                    view === 'register' ? 'Create Account' :
                    view === 'forgot' ? 'Reset Password' :
                    'New Password'
                  )}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {error && !user && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {/* PROFILE VIEW */}
              {user && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100 mb-4">
                    <div className="w-20 h-20 rounded-full bg-[#662654]/10 text-[#662654] flex items-center justify-center text-3xl font-black mb-3">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h3 className="text-xl font-black text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500 font-medium">{user.phone}</p>
                  </div>
                  
                  {user.isAdmin && (
                    <a href="/admin" className="block text-center w-full py-3 bg-[#662654]/10 hover:bg-[#662654]/20 text-[#662654] font-bold rounded-xl transition-colors mb-2">
                      Go to Admin Panel
                    </a>
                  )}

                  <button
                    onClick={onLogout}
                    className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors active:scale-[0.98]"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* LOGIN FORM */}
              {!user && view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all pr-12"
                        placeholder="Enter your password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => handleSwitchView('forgot')} className="text-sm font-semibold text-[#662654] hover:underline">
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#662654] hover:bg-[#7a2e64] text-white font-bold rounded-xl shadow-lg shadow-[#662654]/20 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => handleSwitchView('register')} className="font-bold text-[#662654] hover:underline">
                      Sign up
                    </button>
                  </p>
                </form>
              )}

              {/* REGISTER FORM */}
              {!user && view === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Phone Number</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all" placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all pr-12" placeholder="Create a password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100 mt-4 mb-2">
                    <p className="text-sm font-bold text-gray-800 mb-3">Delivery Address</p>
                    <div className="space-y-3">
                      <input type="text" required value={addressLine1} onChange={e => setAddressLine1(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all text-sm" placeholder="Flat / House No. / Building" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" required value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all text-sm" placeholder="City" />
                        <input type="text" required value={state} onChange={e => setState(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all text-sm" placeholder="State" />
                      </div>
                      <input type="text" required value={pincode} onChange={e => setPincode(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all text-sm" placeholder="Pincode" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#662654] hover:bg-[#7a2e64] text-white font-bold rounded-xl shadow-lg shadow-[#662654]/20 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{' '}
                    <button type="button" onClick={() => handleSwitchView('login')} className="font-bold text-[#662654] hover:underline">
                      Login
                    </button>
                  </p>
                </form>
              )}

              {/* FORGOT PASSWORD FORM */}
              {!user && view === 'forgot' && (
                <form onSubmit={handleForgotRequest} className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Enter your registered phone number to receive a password reset token.</p>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#662654] hover:bg-[#7a2e64] text-white font-bold rounded-xl shadow-lg shadow-[#662654]/20 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
                  >
                    {loading ? 'Sending...' : 'Send Reset Token'}
                  </button>
                </form>
              )}

              {/* RESET PASSWORD FORM */}
              {!user && view === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Enter the token sent to your phone and your new password.</p>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Reset Token</label>
                    <input
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all tracking-widest uppercase font-mono"
                      placeholder="e.g. A1B2C3D4"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#662654] outline-none transition-all pr-12"
                        placeholder="Enter new password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#662654] hover:bg-[#7a2e64] text-white font-bold rounded-xl shadow-lg shadow-[#662654]/20 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
