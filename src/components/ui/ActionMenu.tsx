import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  motion, 
  AnimatePresence 
} from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ActionMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isDanger?: boolean;
  hasSeparator?: boolean;
}

interface ActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: ActionMenuItem[];
  title?: string;
  subtitle?: string;
}

export const ActionMenu = ({ 
  isOpen, 
  onClose, 
  items, 
  title,
  subtitle
}: ActionMenuProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center 
          justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 
              rounded-[2.5rem] shadow-2xl overflow-hidden border 
              border-white/10"
          >
            {title && (
              <div className="px-8 pt-10 pb-6 border-b border-gray-100 
                dark:border-slate-800/50 text-center">
                <p className="text-xs font-black uppercase 
                  tracking-[0.25em] text-primary mb-2">
                  {subtitle || "Managing Item"}
                </p>
                
                <h4 className="text-xl font-black text-dark dark:text-white 
                  line-clamp-2 leading-tight tracking-tight">
                  {title}
                </h4>
              </div>
            )}
            
            <div className="p-2">
              {items.map((item, idx) => (
                <div key={idx}>
                  <button
                    onClick={() => {
                      onClose();
                      item.onClick();
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl",
                      "transition-colors active:bg-gray-100",
                      "dark:active:bg-slate-800",
                      item.isDanger 
                        ? "text-red-500" 
                        : "text-dark dark:text-white"
                    )}
                  >
                    <span className="opacity-40">{item.icon}</span>
                    
                    <span className="text-sm font-black uppercase 
                      tracking-widest">
                      {item.label}
                    </span>
                  </button>
                  
                  {item.hasSeparator && (
                    <div className="mx-6 my-2 border-t border-gray-100 
                      dark:border-slate-800" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-2 bg-gray-50 dark:bg-slate-800/50">
              <button
                onClick={onClose}
                className="w-full py-4 text-[10px] font-black uppercase 
                  tracking-[0.3em] text-subtext"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
