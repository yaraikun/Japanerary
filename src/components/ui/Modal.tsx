import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  motion, 
  AnimatePresence 
} from 'framer-motion';

import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showHeader?: boolean;
  position?: 'center' | 'top';
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  showHeader = true,
  position = 'center'
}: ModalProps) => {
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
        <div className={cn(
          "fixed inset-0 z-[3000] flex justify-center p-4 overflow-hidden",
          position === 'center' ? "items-center" : "items-start pt-12"
        )}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
          />
          
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8
            }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 
              rounded-3xl shadow-2xl overflow-hidden border border-white/10 
              flex flex-col max-h-full"
          >
            {showHeader && (
              <div className="px-6 py-5 border-b border-gray-100 
                dark:border-slate-800 flex justify-center items-center 
                shrink-0">
                <h3 className="text-sm font-black uppercase tracking-widest 
                  text-dark dark:text-white">
                  {title}
                </h3>
              </div>
            )}
            
            <div className="p-6 overflow-y-auto no-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
