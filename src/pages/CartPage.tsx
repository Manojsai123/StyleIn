import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center px-4">
        <div className="text-brand-black/5 mb-8">
          <ShoppingBag size={120} />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Your bag is empty.</h1>
        <p className="text-brand-muted text-center max-w-sm mb-10 font-medium text-lg">
          Looks like you haven't added any elite kicks to your collection yet.
        </p>
        <Link to="/shop" className="btn-primary">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-brand-grey min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-12 tracking-tight">My Bag</h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={`${item.id}-${item.selectedSize}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-full sm:w-40 aspect-square rounded-[1.5rem] overflow-hidden bg-brand-grey">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row justify-between w-full h-full">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
                      <p className="text-xs text-brand-muted font-bold uppercase tracking-widest mb-6">
                        {item.brand} • SIZE: {item.selectedSize}
                      </p>
                      
                      <div className="flex items-center space-x-6">
                         <div className="flex items-center border border-brand-black/5 rounded-2xl overflow-hidden bg-brand-grey">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            className="p-3 hover:bg-brand-black hover:text-white transition-colors"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-12 text-center font-bold text-base">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                            className="p-3 hover:bg-brand-black hover:text-white transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-brand-muted hover:text-red-500 transition-colors bg-white p-3 rounded-2xl border border-brand-black/5"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-6 sm:mt-0 text-right flex flex-col justify-center">
                      <p className="text-2xl font-bold">₹{item.price * item.quantity}</p>
                      <p className="text-sm text-brand-muted font-medium">₹{item.price} each</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white p-10 rounded-[3rem] sticky top-32 shadow-sm border border-brand-black/5">
              <h2 className="text-xl font-bold mb-10 uppercase tracking-widest text-brand-black/40">Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between font-medium">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="font-bold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-brand-muted">Shipping</span>
                  <span className="text-brand-accent font-bold">Free</span>
                </div>
                <hr className="border-brand-black/5" />
                <div className="flex justify-between text-2xl font-bold tracking-tight">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary !py-6 text-base flex items-center justify-center gap-3 shadow-xl shadow-brand-black/10"
              >
                Checkout <ArrowRight size={20} />
              </button>
              
              <p className="mt-6 text-[10px] text-center opacity-40 uppercase tracking-[0.2em] leading-relaxed">
                All taxes and duties included. Secure encrypted transaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
