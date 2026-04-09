import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  isHoverable?: boolean;
  isActive?: boolean;
}

const fastTransition = { 
  type: "tween", 
  ease: [0.23, 1, 0.32, 1], 
  duration: 0.25 
} as const;

export const Card = ({
  children,
  className,
  isHoverable,
  isActive,
  ...props
}: CardProps) => {
  return (
    <motion.div
      layout="position"
      transition={fastTransition}
      whileTap={isHoverable ? { 
        scale: 0.992,
        transition: { duration: 0.1 } 
      } : undefined}
      className={cn(
        'bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-sm border',
        'border-gray-100 dark:border-slate-700/50 will-change-transform transition-colors duration-300',
        isHoverable && 'cursor-pointer hover:shadow-md dark:hover:bg-slate-800',
        isActive && 'ring-2 ring-primary/20 dark:ring-primary/40 shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
