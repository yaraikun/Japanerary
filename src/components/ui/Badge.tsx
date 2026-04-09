import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'transport' | 'food' | 'activity';
  className?: string;
}

export const Badge = ({ 
  children, 
  variant = 'transport', 
  className 
}: BadgeProps) => {
  const variants = {
    transport: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
    food: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50',
    activity: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50',
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-[10px] font-black uppercase',
        'tracking-widest shadow-sm border transition-all duration-300',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
