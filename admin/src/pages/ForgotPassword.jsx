import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl text-center">
        <div>
          <img className="mx-auto h-16 w-auto object-contain" src="/logo.png" alt="Paidhu Logo" />
          <h2 className="mt-6 text-3xl font-playfair font-bold text-brand-plum">Forgot Password?</h2>
          <p className="mt-4 text-sm text-gray-600">
            For security reasons, password resets are not currently automated. 
            Please contact the system administrator or the development team to reset your admin password.
          </p>
        </div>
        
        <div className="mt-8">
          <Link
            to="/login"
            className="w-full flex justify-center py-3 px-4 border border-brand-plum text-sm font-medium rounded-lg text-brand-plum bg-transparent hover:bg-brand-plum hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-plum transition-all shadow-sm"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
