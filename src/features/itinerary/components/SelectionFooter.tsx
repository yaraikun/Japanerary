import { motion } from 'framer-motion';

import { 
  X, 
  Settings2, 
  Check 
} from 'lucide-react';

import { Button } from '@/components/ui';

interface SelectionFooterProps {
  isVisible: boolean;
  onCancel: () => void;
  onAction: () => void;
  actionLabel: string;
  actionIcon: React.ReactNode;
  isActionDisabled?: boolean;
  isCancelDisabled?: boolean;
  isSaveMode?: boolean;
}

export const SelectionFooter = ({
  isVisible,
  onCancel,
  onAction,
  actionLabel,
  actionIcon,
  isActionDisabled,
  isCancelDisabled,
  isSaveMode
}: SelectionFooterProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      exit={{ y: 100, x: '-50%', opacity: 0 }}
      className="fixed bottom-10 left-1/2 z-[4000] w-full max-w-sm px-6"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl 
        border border-gray-100 dark:border-slate-800 p-2 flex gap-2">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isCancelDisabled}
          className="flex-1 py-3 rounded-xl text-subtext border-none 
            bg-gray-50 dark:bg-slate-800/50"
        >
          <X className="w-4 h-4 mr-2" />
          
          <span className="text-[10px] font-black tracking-widest">
            CANCEL
          </span>
        </Button>
        
        <Button
          onClick={onAction}
          disabled={isActionDisabled}
          className="flex-1 py-3 rounded-xl shadow-primary/20"
        >
          {isSaveMode ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            actionIcon
          )}
          
          <span className="text-[10px] font-black tracking-widest">
            {actionLabel}
          </span>
        </Button>
      </div>
    </motion.div>
  );
};
