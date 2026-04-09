import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddCardButtonProps {
  onClick: () => void;
}

export const AddCardButton = ({ onClick }: AddCardButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full py-6 border-2 border-dashed border-gray-200 
        dark:border-slate-700 rounded-2xl flex items-center justify-center 
        gap-3 text-subtext dark:text-subtext-dark hover:bg-primary/5 
        hover:border-primary/30 hover:text-primary transition-all 
        duration-300 group"
    >
      <div className="p-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg 
        group-hover:bg-primary/10 transition-colors">
        <Plus className="w-5 h-5" />
      </div>
      <span className="text-sm font-black uppercase tracking-widest">
        Add Card
      </span>
    </motion.button>
  );
};
