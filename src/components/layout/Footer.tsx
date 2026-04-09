import { 
  Smartphone, 
  MoveHorizontal 
} from 'lucide-react';

const APP_TITLE = 
  (import.meta as any).env.VITE_APP_TITLE || 'Trip';

const APP_YEAR = 
  (import.meta as any).env.VITE_APP_YEAR || '';

export const Footer = () => (
  <footer className="max-w-xl mx-auto w-full px-6 py-8 border-t 
    border-gray-100 dark:border-slate-800/50 text-center space-y-4">
    <div className="flex flex-col items-center gap-1 text-subtext 
      dark:text-subtext-dark">
      <MoveHorizontal className="w-3.5 h-3.5 opacity-40" />
      
      <p className="text-[9px] font-black uppercase tracking-[0.2em]">
        Swipe left or right to switch days
      </p>
    </div>
    
    <div className="flex flex-col items-center gap-1 text-subtext 
      dark:text-subtext-dark">
      <Smartphone className="w-3.5 h-3.5 opacity-40" />
      
      <p className="text-[9px] font-black uppercase tracking-[0.2em]">
        Add to homescreen to install as app
      </p>
    </div>

    <div className="pt-2 opacity-20">
      <p className="text-[8px] font-bold uppercase tracking-tighter">
        {APP_TITLE} {APP_YEAR} • v1.0.0
      </p>
    </div>
  </footer>
);
