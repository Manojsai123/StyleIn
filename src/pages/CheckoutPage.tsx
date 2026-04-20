import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, LogIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', street: '', city: '', zipCode: ''
  });
  const [isOrdered, setIsOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthPopup(true);
      return;
    }
    setLoading(true);
    try {
      try {
        // Using form-data approach as it is often more compatible with "simple" Google Apps Scripts
        // that expect e.parameter instead of e.postData.contents
        const params = new URLSearchParams();
        params.append('name', formData.fullName);
        params.append('address', formData.street);
        params.append('city', formData.city);
        params.append('zipcode', formData.zipCode);
        params.append('productname', cart.map(item => `${item.name} (${item.selectedSize}) x${item.quantity}`).join(', '));
        params.append('amount', totalPrice.toString());

        await fetch('https://script.google.com/macros/s/AKfycbw3gGL119vvth611d6mX57D_XgoFpWiUMPvqD079AIK6lRkRL609XqWGjfw7B6pZObi/exec', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
      } catch (scriptErr) {
        console.error('Error initiating Google Script delivery:', scriptErr);
      }

      await api.createOrder({
        items: cart,
        total: totalPrice,
        address: formData
      });
      setIsOrdered(true);
      clearCart();
    } catch (err) {
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-4 bg-brand-grey">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-brand-accent mb-8"
        >
          <CheckCircle2 size={120} />
        </motion.div>
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Order Received</h1>
        <p className="text-brand-muted text-center max-w-sm mb-10 font-medium text-lg">
          Your style is on its way. We've sent a confirmation email with your tracking details.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">Return Home</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-brand-grey min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-12 tracking-tight text-center lg:text-left">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Form */}
          <div className="space-y-10">
            <section className="bg-white p-10 rounded-[3rem] shadow-sm">
              <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-[11px] mb-10 text-brand-black/40">
                <Truck className="text-brand-accent" size={18} /> 01. Shipping Destination
              </div>
              <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest font-black mb-3 text-brand-black/30">Recipient Full Name</label>
                  <input 
                    type="text" required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-brand-grey border-none rounded-2xl py-5 px-8 focus:outline-none focus:ring-2 focus:ring-brand-accent font-bold transition-all"
                  />
                </div>
                <div className="col-span-2">
                   <label className="block text-[10px] uppercase tracking-widest font-black mb-3 text-brand-black/30">Street Address</label>
                  <input 
                    type="text" required
                    placeholder="123 Sneaker St."
                    value={formData.street}
                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                    className="w-full bg-brand-grey border-none rounded-2xl py-5 px-8 focus:outline-none focus:ring-2 focus:ring-brand-accent font-bold transition-all"
                  />
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest font-black mb-3 text-brand-black/30">City</label>
                  <input 
                    type="text" required
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-brand-grey border-none rounded-2xl py-5 px-8 focus:outline-none focus:ring-2 focus:ring-brand-accent font-bold transition-all"
                  />
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest font-black mb-3 text-brand-black/30">Zip Code</label>
                  <input 
                    type="text" required
                    placeholder="10001"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    className="w-full bg-brand-grey border-none rounded-2xl py-5 px-8 focus:outline-none focus:ring-2 focus:ring-brand-accent font-bold transition-all"
                  />
                </div>
              </form>
            </section>

            <section className="bg-white p-10 rounded-[3rem] shadow-sm">
               <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-[11px] mb-10 text-brand-black/40">
                <CreditCard className="text-brand-accent" size={18} /> 02. Payment Method
              </div>
              <div className="p-10 border-2 border-brand-accent/20 bg-brand-accent/5 rounded-[2rem] flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg mb-1">Dummy Integration</p>
                  <p className="text-sm font-medium text-brand-muted">Your card will not be charged for this simulation.</p>
                </div>
                <div className="hidden sm:flex gap-3">
                   <div className="w-12 h-8 bg-brand-black/10 rounded-lg"></div>
                   <div className="w-12 h-8 bg-brand-black/10 rounded-lg"></div>
                </div>
              </div>
            </section>
          </div>

          {/* Order Review */}
          <div className="bg-white rounded-[3rem] p-12 h-fit sticky top-32 shadow-xl shadow-brand-black/5 border border-brand-black/5">
            <h2 className="text-xl font-bold mb-12 uppercase tracking-widest text-brand-black/40 text-center">Your Selection</h2>
            <div className="space-y-6 mb-12">
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center text-base font-bold">
                   <span className="text-brand-muted">{item.name} <span className="text-[10px] uppercase tracking-widest ml-1">{item.selectedSize}</span> <span className="text-[11px] ml-1">x{item.quantity}</span></span>
                   <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-base font-bold">
                 <span className="text-brand-muted">Priority Shipping</span>
                 <span className="text-brand-accent">Complimentary</span>
              </div>
              <hr className="border-brand-black/5" />
              <div className="flex justify-between items-center text-3xl font-bold tracking-tight py-4">
                 <span>Grand Total</span>
                 <span>₹{totalPrice}</span>
              </div>
            </div>

            <button 
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-7 text-lg flex items-center justify-center gap-4 shadow-xl shadow-brand-black/10"
            >
               {loading ? 'Processing...' : (
                 <>
                   <ShieldCheck size={24} /> Complete Order
                 </>
               )}
            </button>
            <p className="text-center mt-6 text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">
              Encrypted 128-bit SSL Secure Transaction
            </p>
          </div>
        </div>
      </div>

      {/* Auth Popup Modal */}
      <AnimatePresence>
        {showAuthPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthPopup(false)}
              className="absolute inset-0 bg-brand-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-12 overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setShowAuthPopup(false)}
                className="absolute top-8 right-8 text-brand-black/20 hover:text-brand-black transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-brand-grey flex items-center justify-center mb-8 text-brand-accent">
                   <LogIn size={32} />
                </div>
                
                <h2 className="text-4xl font-bold tracking-tight mb-4">Identify Yourself.</h2>
                <p className="text-brand-muted font-medium text-lg leading-relaxed mb-10 max-w-sm">
                  To secure your order and track your delivery, please sign in to your membership account.
                </p>

                <div className="grid grid-cols-1 w-full gap-4">
                  <button 
                    onClick={() => navigate('/login')}
                    className="btn-primary flex items-center justify-center gap-3 !py-6 text-sm"
                  >
                    Login / Join Member
                  </button>
                  <button 
                    onClick={() => setShowAuthPopup(false)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] py-4 text-brand-black/40 hover:text-brand-black transition-colors"
                  >
                    I'll do it later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
