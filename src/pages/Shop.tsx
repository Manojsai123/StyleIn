import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest');

  useEffect(() => {
    api.getProducts().then(data => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  useEffect(() => {
    let result = [...products];
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    
    if (sort === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [category, sort, products]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="pt-32 pb-24 bg-brand-grey min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-[2px] w-6 bg-brand-accent" />
             <span className="text-brand-accent font-bold uppercase tracking-widest text-[10px]">Style In Catalog</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">The Collection</h1>
          <p className="text-brand-muted font-medium text-lg max-w-2xl">Browse our meticulously curated selection of high-performance sneakers and limited edition drops.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 space-y-12">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[11px] mb-8 text-brand-black/40">
                <Filter size={14} /> Categories
              </div>
              <div className="space-y-4">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`block text-left w-full text-lg font-bold transition-all ${category === cat ? 'text-brand-accent translate-x-1' : 'text-brand-black/40 hover:text-brand-black'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[11px] mb-6 text-brand-black/40">
                <SlidersHorizontal size={14} /> Sort By
              </div>
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-brand-grey border-none rounded-2xl px-4 py-4 focus:ring-2 focus:ring-brand-accent transition-all font-bold text-sm tracking-tight appearance-none cursor-pointer"
              >
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
             {filteredProducts.length === 0 ? (
               <div className="text-center py-40 bg-white rounded-[3rem] shadow-sm">
                 <p className="text-2xl font-bold tracking-tight mb-4">No results found.</p>
                 <button onClick={() => { setCategory('All'); setSort('Newest'); }} className="text-brand-accent font-bold underline">Clear filters</button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
}
