import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'icon';
}

export const Button = ({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary text-white shadow-lg shadow-primary/20',
    ghost: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
    icon: 'p-1.5 rounded-full transition-colors',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center justify-center font-black uppercase transition-all',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
