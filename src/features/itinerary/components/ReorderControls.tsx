import { motion } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui';

interface ReorderControlsProps {
  isVisible: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disabled?: boolean;
}

export const ReorderControls = ({
  isVisible,
  onMoveUp,
  onMoveDown,
  disabled
}: ReorderControlsProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed right-4 top-[38%] -translate-y-1/2 z-[4000] 
        flex flex-col gap-3"
    >
      <Button
        onClick={onMoveUp}
        disabled={disabled}
        className="p-3.5 rounded-xl shadow-2xl bg-primary text-white 
          border-[3px] border-white dark:border-slate-900 
          shadow-primary/40 disabled:opacity-20"
      >
        <ChevronUp className="w-5 h-5" />
      </Button>
      
      <Button
        onClick={onMoveDown}
        disabled={disabled}
        className="p-3.5 rounded-xl shadow-2xl bg-primary text-white 
          border-[3px] border-white dark:border-slate-900 
          shadow-primary/40 disabled:opacity-20"
      >
        <ChevronDown className="w-5 h-5" />
      </Button>
    </motion.div>
  );
};
