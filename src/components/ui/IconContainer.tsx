import { cn } from '@/lib/utils';

interface IconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isActive?: boolean;
}

export const IconContainer = ({
  children,
  isActive,
  className,
  ...props
}: IconContainerProps) => {
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-all duration-300',
        isActive
          ? 'bg-primary text-white shadow-lg shadow-primary/20 border-bg dark:border-bg-dark'
          : 'bg-white dark:bg-slate-700 text-gray-400 dark:text-slate-400 border-bg dark:border-bg-dark shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
