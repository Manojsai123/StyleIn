import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-brand-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-sans font-black text-2xl tracking-tight hover:text-brand-accent transition-colors uppercase">
              Style In
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="nav-link">New Arrivals</Link>
            <Link to="/shop" className="nav-link">Shop All</Link>
            <Link to="/about" className="nav-link">Editorial</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative p-2 text-brand-black hover:text-brand-accent transition-colors">
              <ShoppingBag size={22} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    key="cart-counter"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-brand-accent text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="p-2 hover:text-brand-accent transition-colors">
                    <Settings size={22} />
                  </Link>
                )}
                <Link to="/profile" className="p-2 hover:text-brand-accent transition-colors">
                  <User size={22} />
                </Link>
                <button onClick={logout} className="p-2 hover:text-brand-accent transition-colors">
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary !px-6 !py-2 !text-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
             <Link to="/cart" className="relative p-2">
              <ShoppingBag size={24} />
               {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-white border-b border-brand-black/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="block text-2xl font-serif py-2">Home</Link>
              <Link to="/shop" onClick={() => setIsOpen(false)} className="block text-2xl font-serif py-2">Shop</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block text-2xl font-serif py-2">About</Link>
              <hr className="border-brand-black/10" />
              {user ? (
                <>
                   {user.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2">Admin Dashboard</Link>}
                   <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2">My Profile</Link>
                   <button onClick={() => { logout(); setIsOpen(false); }} className="block py-2 text-brand-accent">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 font-bold">Login / Sign Up</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
