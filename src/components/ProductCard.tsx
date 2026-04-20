import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  key?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative bg-white overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-brand-black/5"
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-brand-grey m-3 rounded-[2rem]">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {product.featured && (
          <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-brand-black text-[10px] uppercase tracking-widest px-4 py-2 font-bold rounded-full shadow-sm">
            Top Pick
          </span>
        )}
      </Link>
      
      <div className="p-8 pt-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight group-hover:text-brand-accent transition-colors">
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="text-sm font-medium text-brand-muted mt-1">{product.category}</p>
          </div>
          <p className="text-xl font-extrabold tracking-tight">₹{product.price}</p>
        </div>

        <div className="mt-8">
          <Link 
            to={`/product/${product.id}`}
            className="w-full flex items-center justify-center gap-2 bg-brand-black text-white py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-brand-accent transition-all shadow-md active:scale-95"
          >
            Explore
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
