import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-32 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-bold text-3xl tracking-tight mb-8 block hover:text-brand-accent transition-colors">
              style in
            </Link>
            <p className="max-w-sm text-white/50 text-lg font-medium leading-relaxed mb-10">
              Style In is a movement towards precision, performance, and peak aesthetics in modern footwear.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-black transition-all"><Instagram size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-black transition-all"><Twitter size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-black transition-all"><Facebook size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-10 text-white/40">Navigation</h4>
            <ul className="space-y-5 text-base font-semibold">
              <li><Link to="/shop" className="hover:text-brand-accent transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-brand-accent transition-colors">Our Story</Link></li>
              <li><Link to="/register" className="hover:text-brand-accent transition-colors">Member Club</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-10 text-white/40">Newsletter</h4>
            <p className="text-sm text-white/50 mb-8 font-medium">Get the latest drops directly in your inbox.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-white/5 border-none rounded-2xl py-5 px-8 focus:outline-none focus:ring-2 focus:ring-brand-accent font-bold transition-all"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-accent text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-brand-accent/20">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">© 2026 STYLE IN FOOTWEAR CO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10 text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">
             <span>NYC / LONDON / TOKYO</span>
             <span>SINCE 2021</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
