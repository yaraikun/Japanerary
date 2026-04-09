import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast = ({ message }: ToastProps) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.95 }}
          className="fixed bottom-12 left-1/2 z-[5000] 
            bg-red-500 text-white px-4 py-2.5 rounded-xl shadow-2xl 
            flex items-center gap-2.5 w-max max-w-[calc(100vw-3rem)]"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-wider 
            truncate">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
