import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-brand-white">
      <div className="max-w-md w-full px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <header className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-brand-muted text-sm font-medium">
              {isLogin ? 'Sign in to access your Style In account.' : 'Join the elite sneaker society today.'}
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-brand-white/50 border border-brand-black/5 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-brand-white/50 border border-brand-black/5 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-brand-white/50 border border-brand-black/5 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')} 
              <ArrowRight size={20} />
            </button>
          </form>

          <footer className="mt-10 pt-8 border-t border-brand-black/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold uppercase tracking-widest hover:text-brand-accent transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </footer>
        </motion.div>
         {isLogin && (
            <p className="text-center mt-6 text-xs opacity-50 font-bold uppercase tracking-widest leading-loose">
              Demo Admin: admin@stylein.com / admin123
            </p>
          )}
      </div>
    </div>
  );
}
