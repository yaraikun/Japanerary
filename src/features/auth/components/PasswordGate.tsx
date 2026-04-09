import { useState } from 'react';

import { motion } from 'framer-motion';

import { 
  Lock, 
  ArrowRight, 
  ShieldAlert, 
  Eye, 
  EyeOff 
} from 'lucide-react';

import { hashPassword } from '../utils';

import { cn } from '@/lib/utils';

import { UserRole } from '../hooks/useAuthStatus';

interface PasswordGateProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  onSuccess: (
    role: UserRole, 
    hash?: string
  ) => void;
}

const VIEWER_HASH = 
  (import.meta as any).env.VITE_VIEWER_HASH;

const ADMIN_HASH = 
  (import.meta as any).env.VITE_ADMIN_HASH;

const APP_YEAR = 
  (import.meta as any).env.VITE_APP_YEAR || '';

export const PasswordGate = ({ 
  children, 
  isAuthenticated, 
  onSuccess 
}: PasswordGateProps) => {
  const [
    input, 
    setInput
  ] = useState('');
  
  const [
    error, 
    setError
  ] = useState(false);
  
  const [
    loading, 
    setLoading
  ] = useState(false);
  
  const [
    showPassword, 
    setShowPassword
  ] = useState(false);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    
    setLoading(true);
    
    setError(false);

    try {
      const hashed = await hashPassword(
        input.toLowerCase().trim()
      );
      
      if (hashed === ADMIN_HASH) {
        onSuccess(
          'admin', 
          hashed
        );
      } else if (hashed === VIEWER_HASH) {
        onSuccess('viewer');
      } else {
        setError(true);
        
        setInput('');
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark dark:bg-bg-dark flex flex-col 
      items-center justify-start pt-16 p-6 text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-2">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            Private Access
          </h1>
          
          <p className="text-white/50 dark:text-slate-400 text-sm font-medium">
            Enter the password to view the {APP_YEAR} itinerary.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              autoFocus
              className={cn(
                "w-full bg-white/5 dark:bg-slate-800 border-2 rounded-2xl",
                "px-5 py-4 outline-none transition-all text-center",
                "font-bold text-lg text-white",
                !showPassword && "tracking-widest",
                error 
                  ? "border-red-500" 
                  : "border-white/10 dark:border-slate-700 focus:border-primary"
              )}
            />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 
                text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !input}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 
              py-4 rounded-2xl font-black uppercase tracking-widest flex 
              items-center justify-center gap-2 transition-all 
              active:scale-[0.98] text-white shadow-lg shadow-primary/20"
          >
            {loading ? "Verifying..." : "Enter Site"}
            
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-red-400 
              text-sm font-bold"
          >
            <ShieldAlert className="w-4 h-4" />
            Incorrect Password
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
