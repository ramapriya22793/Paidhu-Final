import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { 
  FiHome, FiBox, FiShoppingCart, FiUsers, 
  FiTag, FiStar, FiFileText, FiSearch, 
  FiSettings, FiLogOut, FiImage, FiLayout, FiFeather, FiGrid, FiBookOpen, FiHeart, FiActivity
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: <FiHome /> },
  { name: 'Products', path: '/products', icon: <FiBox /> },
  { name: 'Orders', path: '/orders', icon: <FiShoppingCart /> },
  { name: 'Active Carts', path: '/active-carts', icon: <FiShoppingCart /> },
  { name: 'Wishlists', path: '/wishlists', icon: <FiHeart /> },
  { name: 'Customers', path: '/customers', icon: <FiUsers /> },
  { name: 'Login History', path: '/login-history', icon: <FiActivity /> },
  { name: 'WhatsApp Leads', path: '/whatsapp-leads', icon: <FaWhatsapp /> },
  { name: 'Payments', path: '/payments', icon: <FiShoppingCart /> },
  { name: 'Coupons', path: '/coupons', icon: <FiTag /> },
  { name: 'Delivery Rules', path: '/delivery-charges', icon: <FiShoppingCart /> },
  { name: 'Reviews', path: '/reviews', icon: <FiStar /> },
  { name: 'Blogs', path: '/blogs', icon: <FiFileText /> },
  { name: 'Pages', path: '/pages', icon: <FiLayout /> },
  { name: 'SEO', path: '/seo', icon: <FiSearch /> },
  { name: 'Banners', path: '/banners', icon: <FiImage /> },
  { name: 'Tracking Codes', path: '/tracking', icon: <FiActivity /> },
  { name: 'Deals', path: '/deals-management', icon: <FiTag /> },
  { name: 'Category Grid', path: '/category-grid-management', icon: <FiGrid /> },
  { name: 'Family Combos', path: '/family-management', icon: <FiUsers /> },
  { name: 'Floral Habitat', path: '/floral-habitat-management', icon: <FiFeather /> },
  { name: 'BYOC Management', path: '/byoc-management', icon: <FiGrid /> },
  { name: 'Community Management', path: '/community-management', icon: <FiUsers /> },
  { name: 'Our Philosophy', path: '/philosophy-management', icon: <FiBookOpen /> },
  { name: 'Bulk Orders Content', path: '/bulk-orders-management', icon: <FiLayout /> },
  { name: 'Bulk Inquiries', path: '/bulk-order-inquiries', icon: <FiFileText /> },
  { name: 'About Us', path: '/about-us-management', icon: <FiUsers /> },
  { name: 'Saffron Guidance Leads', path: '/saffron-guidance-leads', icon: <FiFileText /> },
  { name: 'Career Applications', path: '/career-applications', icon: <FiUsers /> },
];


const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 shadow-sm z-50">
      <div className="p-6 bg-brand-plum border-b border-brand-plum/20 flex items-center justify-center">
        <img src="/logo.png" alt="Paidhu Logo" className="h-10 object-contain" />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-plum text-brand-cream shadow-md' 
                    : 'text-gray-600 hover:bg-brand-cream/50 hover:text-brand-plum'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 space-y-1">
        <NavLink to="/settings" className={({ isActive }) => `flex w-full items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brand-plum text-brand-cream' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
          <span className="text-lg"><FiSettings /></span>
          <span className="font-medium text-sm tracking-wide">Settings</span>
        </NavLink>
        <button 
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <span className="text-lg"><FiLogOut /></span>
          <span className="font-medium text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
