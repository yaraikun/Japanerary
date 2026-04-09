import { useRef } from 'react';

import { motion } from 'framer-motion';

import { 
  Sun, 
  Moon, 
  Download 
} from 'lucide-react';

import { Button } from '../ui';

import { UserRole } from '@/features/auth/hooks/useAuthStatus';

interface HeaderProps {
  isDark: boolean;
  role: UserRole;
  onToggleTheme: () => void;
  onLogout: () => void;
  onExport?: () => void;
}

const APP_TITLE = 
  (import.meta as any).env.VITE_APP_TITLE || 'Trip';

const APP_YEAR = 
  (import.meta as any).env.VITE_APP_YEAR || '';

const APP_SUBTITLE = 
  (import.meta as any).env.VITE_APP_SUBTITLE || 'Itinerary';

export const Header = ({ 
  isDark, 
  role, 
  onToggleTheme, 
  onLogout,
  onExport
}: HeaderProps) => {
  const timerRef = useRef<any>(null);

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      onLogout();
    }, 1000);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      
      timerRef.current = null;
    }
  };

  return (
    <div className="pt-10 pb-4 px-6 relative overflow-hidden 
      transition-colors duration-300">
      <div className="max-w-xl mx-auto flex justify-between items-start 
        relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-black tracking-tighter uppercase 
            text-white">
            {APP_TITLE} <span className="text-primary">{APP_YEAR}</span>
          </h1>
          
          <p className="text-white/50 dark:text-slate-400 text-xs font-bold 
            mt-1 uppercase">
            {APP_SUBTITLE}
          </p>
        </motion.div>

        <div className="flex items-center gap-2">
          {role === 'admin' && onExport && (
            <Button
              variant="ghost"
              onClick={onExport}
              className="p-3 rounded-full"
            >
              <Download className="w-5 h-5 text-white/60" />
            </Button>
          )}

          <Button 
            variant="ghost" 
            onClick={onToggleTheme} 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="p-3 rounded-full touch-none select-none"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 
        rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
