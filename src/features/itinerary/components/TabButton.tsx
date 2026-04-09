import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ItineraryDay } from '../types';
import { springConfig } from '../hooks/useItinerary';

interface TabButtonProps {
  day: ItineraryDay;
  idx: number;
  isActive: boolean;
  isAdmin: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  onManage: (day: ItineraryDay, index: number) => void;
}

export const TabButton = ({ 
  day, 
  idx, 
  isActive, 
  isAdmin, 
  isDisabled,
  onClick, 
  onManage,
}: TabButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  
  const timerRef = useRef<any>(null);
  
  const longPressTriggered = useRef(false);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center', 
        block: 'nearest' 
      });
    }
  }, [isActive]);

  const handlePointerDown = () => {
    if (!isAdmin || isDisabled) return;
    
    longPressTriggered.current = false;
    
    timerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      onManage(day, idx);
    }, 700);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = () => {
    if (longPressTriggered.current || isDisabled) return;
    onClick();
  };

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={ref}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => isAdmin && !isDisabled && e.preventDefault()}
        className={cn(
          'flex flex-col items-center justify-center px-5 py-4 transition-colors relative min-w-[70px] select-none',
          isActive ? 'text-white' : 'text-white/40 dark:text-slate-500',
          isDisabled && !isActive && 'opacity-20 grayscale'
        )}
      >
        <span className="text-[10px] font-black uppercase tracking-tighter">
          Day
        </span>
        
        <span className="text-lg font-black leading-none">
          {idx + 1}
        </span>
        
        {isActive && (
          <motion.div 
            layoutId="activeTab" 
            transition={springConfig} 
            className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" 
          />
        )}
      </button>
    </div>
  );
};
