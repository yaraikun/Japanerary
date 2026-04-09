import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Eye, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui';
import { MarkdownContent } from './MarkdownContent';

interface FullscreenEditorProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (val: string) => void;
  title: string;
}

export const FullscreenEditor = ({
  isOpen,
  onClose,
  value,
  onChange,
  title
}: FullscreenEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);

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
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[4000] bg-white dark:bg-bg-dark 
            flex flex-col"
        >
          <div className="px-6 py-4 border-b border-gray-100 
            dark:border-slate-800 flex justify-between items-center 
            bg-white dark:bg-bg-dark">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase 
                tracking-widest text-primary">
                Editing Content
              </span>
              <h3 className="text-sm font-bold text-dark dark:text-white 
                truncate max-w-[180px]">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsPreview(!isPreview)}
                className="p-2.5 rounded-xl text-subtext border-none"
              >
                {isPreview ? (
                  <Edit3 className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </Button>
              <Button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl flex gap-2"
              >
                <Check className="w-4 h-4" />
                <span className="text-xs font-black tracking-widest">
                  DONE
                </span>
              </Button>
            </div>
          </div>

          <div className="flex-grow overflow-hidden relative">
            {isPreview ? (
              <div className="h-full overflow-y-auto px-8 py-8">
                <div className="max-w-xl mx-auto">
                  <MarkdownContent content={value || '*No content to preview*'} />
                </div>
              </div>
            ) : (
              <textarea
                autoFocus
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write your detailed itinerary here (Markdown supported)..."
                className="w-full h-full p-8 bg-transparent outline-none 
                  resize-none text-base font-medium leading-relaxed 
                  text-dark dark:text-white placeholder:opacity-20"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
