import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { ArrowRight, Footprints, Zap, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts().then(products => {
      setFeaturedProducts(products.filter(p => p.featured));
    });
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] m-4 rounded-[3rem] overflow-hidden bg-brand-black">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background"
            className="w-full h-full object-cover grayscale-[0.2]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60" />
        </div>
        
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[2px] w-8 bg-brand-accent" />
              <span className="text-brand-accent font-bold uppercase tracking-[0.2em] text-xs">New Era Footwear</span>
            </motion.div>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold leading-tight tracking-tight text-white mb-8 uppercase"
            >
              Stylish <br /> <span className="text-brand-accent">Footwear.</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/60 mb-12 max-w-lg leading-relaxed font-medium"
            >
              Experience the pinnacle of footwear engineering. Our latest drops combine athletic performance with runway-ready silhouettes.
            </motion.p>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6"
            >
              <Link to="/shop" className="btn-primary !px-10 !py-5 text-base">
                Explore Drop
              </Link>
              <Link to="/about" className="flex items-center gap-3 text-white hover:text-brand-accent transition-colors font-bold uppercase text-xs tracking-widest">
                Our Story <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Zap, title: "Velocity", text: "Proprietary foam tech for energy return." },
              { icon: ShieldCheck, title: "Armor", text: "Military-grade materials built for any city." },
              { icon: Truck, title: "Express", text: "Complementary global shipping on all orders." },
              { icon: Footprints, title: "Anatomic", text: "Ergonomic designs tailored for your gait." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left group">
                <div className="w-14 h-14 rounded-2xl bg-brand-grey flex items-center justify-center mb-6 group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-brand-grey m-4 rounded-[3rem]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">All Collections</h2>
              <p className="text-brand-muted font-medium text-lg leading-relaxed">Discover this season's most anticipated arrivals and exclusive collaborations.</p>
            </div>
            <Link to="/shop" className="btn-outline">
              View All Arrivals
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter/Membership Banner */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative bg-brand-black rounded-[3rem] overflow-hidden p-10 md:p-20 flex flex-col items-center text-center text-white">
            <div className="absolute inset-0 z-0 opacity-20">
               <Footprints size={600} className="absolute -right-20 -top-20 rotate-45" />
               <Footprints size={600} className="absolute -left-20 -bottom-20 rotate-45" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Join the Inner Circle.</h2>
              <p className="text-white/60 text-lg mb-12 font-medium">Gain early access to drops, member-only events, and zero shipping costs globally.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <Link to="/register" className="btn-primary !bg-white !text-brand-black hover:!bg-brand-accent hover:!text-white border-none w-full sm:w-auto">
                   Sign Up Now
                 </Link>
                 <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Free for a limited time</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
