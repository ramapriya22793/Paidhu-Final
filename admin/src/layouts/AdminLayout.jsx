import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FiBell, FiSearch } from 'react-icons/fi';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-brand-gray overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm shrink-0 z-40">
          <div className="flex items-center w-96 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
            <FiSearch className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search products, orders..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
            />
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-500 hover:text-brand-plum transition-colors">
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                3
              </span>
            </button>
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
              <div className="w-10 h-10 bg-brand-plum rounded-full flex items-center justify-center text-white font-bold shadow-md">
                AD
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Store Manager</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
