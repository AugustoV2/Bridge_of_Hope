import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, Info, MessageCircle, LogIn } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://envs.sh/ov.png"
                alt="Bridge of Hope Logo"
                className="h-10 w-auto" // Adjust height as needed
              />
              <span className="text-xl font-bold text-gray-800">Bridge of Hope</span>
            </Link>
          </div>


            <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<Home size={18} />} text="Home" isActive={isActive('/')} />
            <NavLink to="/about" icon={<Info size={18} />} text="About" isActive={isActive('/about')} />
            <NavLink to="/contact" icon={<MessageCircle size={18} />} text="Contact" isActive={isActive('/contact')} />
            <NavLink to="/LeaderBoard" icon={<MessageCircle size={18} />} text="Leader Board" isActive={isActive('/LeaderBoard')} />
            {!(localStorage.getItem('donor_id') || localStorage.getItem('organizations_id')) && (
              <NavLink to="/login" icon={<LogIn size={18} />} text="Login" isActive={isActive('/login')} />
            )}
            </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text, isActive }: { to: string; icon: React.ReactNode; text: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
        ? 'text-rose-600 bg-rose-50'
        : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50'
      }`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;