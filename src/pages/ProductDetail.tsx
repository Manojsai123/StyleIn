import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.getProduct(id)
        .then(setProduct)
        .catch(() => navigate('/shop'));
    }
  }, [id, navigate]);

  if (!product) return <div className="pt-32 text-center font-bold text-2xl tracking-tight text-brand-muted">Authenticating Style...</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }
    setError('');
    addToCart(product, selectedSize);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="pt-32 pb-24 bg-brand-grey min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-[10px] text-brand-black/40 mb-12 uppercase tracking-widest font-black">
          <button onClick={() => navigate('/')} className="hover:text-brand-black transition-colors">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate('/shop')} className="hover:text-brand-black transition-colors">Catalog</button>
          <ChevronRight size={12} />
          <span className="text-brand-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Images Section */}
          <div className="space-y-6">
            <motion.div 
               layoutId={`product-image-${product.id}`}
               className="aspect-square rounded-[3rem] overflow-hidden bg-white shadow-xl shadow-brand-black/5"
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-6">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${activeImage === i ? 'border-brand-accent scale-95 shadow-lg' : 'border-white hover:border-brand-black/20'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col bg-white p-10 md:p-16 rounded-[3rem] shadow-sm">
            <header className="mb-12">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-[2px] w-6 bg-brand-accent" />
                  <span className="text-brand-accent font-bold uppercase tracking-widest text-[10px]">{product.category}</span>
               </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                {product.name}
              </h1>
              <p className="text-4xl font-extrabold text-brand-black tracking-tight">₹{product.price}</p>
            </header>

            <div className="mb-12">
              <p className="text-brand-muted font-medium leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold uppercase tracking-widest text-[11px] text-brand-black/40">Select Your Size</span>
                <button className="text-[10px] uppercase tracking-widest font-bold border-b border-brand-black/20 hover:border-brand-black">Size Guide</button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                        setSelectedSize(size);
                        setError('');
                    }}
                    className={`py-5 rounded-2xl font-bold text-sm transition-all border-2 ${selectedSize === size ? 'bg-brand-black text-white border-brand-black shadow-lg shadow-brand-black/20' : 'bg-brand-grey border-transparent hover:border-brand-black/20 text-brand-muted hover:text-brand-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-brand-accent text-xs font-bold uppercase tracking-widest"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                className="btn-primary w-full flex items-center justify-center gap-4 py-8 text-lg font-bold shadow-xl shadow-brand-black/10 active:scale-95 relative"
              >
                <ShoppingBag size={22} /> Add to Cart
              </button>
              
              <AnimatePresence>
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-green-500 text-white p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest"
                  >
                    <ShieldCheck size={18} /> Added to your bag
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 mt-12 border-t border-brand-black/5">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-grey flex items-center justify-center">
                    <Truck size={18} className="text-brand-black" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-brand-muted">Complimentary <br/> Logistics</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-brand-grey flex items-center justify-center">
                    <RotateCcw size={18} className="text-brand-black" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-brand-muted">30 Day <br/> Exchange</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-brand-grey flex items-center justify-center">
                    <ShieldCheck size={18} className="text-brand-black" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-brand-muted">Authentic <br/> Guarantee</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
