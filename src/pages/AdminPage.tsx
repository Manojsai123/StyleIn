import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order, Product } from '../types';
import { LayoutDashboard, ShoppingCart, Package, Users, PlusCircle } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (user?.role === 'admin') {
      api.getAllOrders().then(setOrders);
      api.getProducts().then(setProducts);
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return <div className="pt-40 text-center text-4xl font-bold tracking-tight">Access Restricted.</div>;
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-grey">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-6 bg-brand-accent" />
              <span className="text-brand-accent font-bold uppercase tracking-widest text-[10px]">Command Panel</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex bg-white px-2 py-2 rounded-2xl shadow-sm border border-brand-black/5 overflow-x-auto">
             {[
               { id: 'orders', icon: ShoppingCart, label: 'Orders' },
               { id: 'products', icon: Package, label: 'Inventory' },
               { id: 'users', icon: Users, label: 'Customers' }
             ].map(tab => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-black text-white shadow-lg' : 'text-brand-muted hover:text-brand-black'}`}
               >
                 <tab.icon size={16} /> {tab.label}
               </button>
             ))}
          </div>
        </header>

        <main>
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 gap-6">
              {orders.length === 0 ? (
                <div className="bg-white p-20 text-center rounded-[3rem] shadow-sm italic font-serif text-brand-muted">No orders found in database.</div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between gap-12 hover:shadow-md transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="bg-brand-grey text-brand-black px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest border border-brand-black/5">
                          ID: {order.id.slice(-6)}
                        </span>
                        <span className="text-brand-muted text-[11px] font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{order.address.fullName}</h3>
                      <p className="text-sm font-medium text-brand-muted mb-8">{order.address.street}, {order.address.city}</p>
                      <div className="flex flex-wrap gap-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="bg-brand-grey px-4 py-2.5 rounded-xl text-xs font-bold border border-brand-black/5">
                            {item.quantity}x {item.name} <span className="text-[10px] opacity-50 ml-1">{item.selectedSize}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between items-end gap-6">
                       <p className="text-4xl font-bold tracking-tight">₹{order.total}</p>
                       <select className="bg-brand-grey border-none rounded-xl px-5 py-4 font-bold text-xs uppercase tracking-widest cursor-pointer focus:ring-2 focus:ring-brand-accent transition-all">
                         <option>Pending Shipment</option>
                         <option>Dispatched</option>
                         <option>Delivered</option>
                       </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center bg-brand-black text-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-black/10">
                <p className="font-bold uppercase tracking-widest text-[11px]">Active SKU Count: {products.length}</p>
                <button className="flex items-center gap-3 bg-brand-accent px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-brand-accent/20">
                  <PlusCircle size={20} /> Add Product
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <div key={product.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm flex items-center gap-8 hover:shadow-md transition-all">
                    <img src={product.images[0]} className="w-24 h-24 rounded-[1.5rem] object-cover bg-brand-grey" alt="" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg truncate mb-1">{product.name}</h4>
                      <p className="text-[10px] text-brand-muted uppercase tracking-widest font-bold mb-4">{product.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xl tracking-tight">₹{product.price}</span>
                        <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full ${product.stock < 20 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {product.stock} Units
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
             <div className="bg-white p-32 text-center rounded-[3rem] shadow-sm italic font-serif text-brand-muted text-xl">
                Customer Database access pending authorization.
             </div>
          )}
        </main>
      </div>
    </div>
  );
}
