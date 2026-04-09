import { motion, AnimatePresence } from 'framer-motion';

import { Clock, ChevronDown, Info } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Card, Badge, IconContainer } from '@/components/ui';

import { ItineraryItem } from '../types';

import { springConfig } from '../hooks/useItinerary';

import { MarkdownContent } from './MarkdownContent';

import { UserRole } from '@/features/auth/hooks/useAuthStatus';

import { useTimelineCard } from '../hooks/useTimelineCard';

import { getTimelineIcon } from '../utils/iconUtils';

interface TimelineCardProps {
  item: ItineraryItem;
  isExpanded: boolean;
  onToggle: () => void;
  role: UserRole;
  onUpdateItem: (id: string, item: Omit<ItineraryItem, 'id'>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onRescheduleClick: (item: ItineraryItem) => void;
  isReorderMode?: boolean;
  onEnterReorderMode?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onMoveStep?: (direction: 'up' | 'down') => void;
  isFirst?: boolean;
  isLast?: boolean;
  isSelectionMode?: boolean;
  onStartSelection?: (id: string) => void;
}

export const TimelineCard = ({ 
  item, 
  isExpanded, 
  onToggle, 
  role, 
  onRescheduleClick, 
  isReorderMode, 
  onEnterReorderMode, 
  isSelected, 
  onSelect, 
  isSelectionMode, 
  onStartSelection
}: TimelineCardProps) => {
  const {
    containerRef, 
    contentRef,
    handlePointerDown, 
    handlePointerUp, 
    handlePointerMove, 
    handleClick
  } = useTimelineCard({ 
    isExpanded, 
    role, 
    onToggle, 
    itemId: item.id, 
    onStartSelection, 
    isSelectionMode 
  });

  return (
    <div 
      className="relative" 
      data-item-id={item.id}
    >
      <motion.div 
        ref={containerRef} 
        layout="position" 
        transition={springConfig} 
        className="relative will-change-transform"
      >
        <div className={cn(
          "absolute -left-5 -translate-x-1/2 -translate-y-1/2 -ml-[1px] top-1/2 z-10",
          "transition-all duration-300"
        )}>
          <IconContainer isActive={isExpanded || isSelected}>
            {getTimelineIcon(item)}
          </IconContainer>
        </div>

        <Card 
          isHoverable={!isReorderMode && !isSelectionMode && !!item.full} 
          isActive={isExpanded || isSelected} 
          onClick={() => {
            if (isReorderMode || isSelectionMode) {
              onSelect?.();
            } else {
              handleClick(!!item.full);
            }
          }}
          onPointerDown={handlePointerDown} 
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove} 
          onPointerLeave={handlePointerUp}
          onContextMenu={(e: React.MouseEvent) => 
            role === 'admin' && !isSelectionMode && e.preventDefault()
          }
          className={cn(
            "select-none transition-all duration-300",
            (isReorderMode || isSelectionMode) && !isSelected && 
              "opacity-60 grayscale-[0.5]",
            isSelected && "ring-4 ring-primary/30 border-primary shadow-2xl"
          )}
        >
          <div className="flex justify-between items-start gap-4 mb-3">
            <div className="min-w-0">
              {item.time && (
                <div className="flex items-center gap-1.5 text-primary 
                  font-black text-[10px] uppercase tracking-widest mb-1.5">
                  <Clock className="w-3 h-3" />{item.time}
                </div>
              )}
              
              <h3 className="text-xl font-black text-dark dark:text-white 
                leading-[1.1] tracking-tight break-words">
                {item.title}
              </h3>
            </div>
            
            {!isReorderMode && !isSelectionMode && !!item.full && (
              <div className={cn(
                'p-2 rounded-full transition-colors duration-200 shrink-0', 
                isExpanded ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-gray-50 dark:bg-slate-700 text-gray-400'
              )}>
                <motion.div 
                  animate={{ rotate: isExpanded ? 180 : 0 }} 
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>
            )}
          </div>

          <p className={cn(
            'text-[13px] leading-relaxed transition-colors duration-200', 
            isExpanded ? 'text-text dark:text-text-dark font-medium' 
              : 'text-subtext dark:text-subtext-dark'
          )}>
            {item.short}
          </p>

          <AnimatePresence initial={false}>
            {isExpanded && !isReorderMode && !isSelectionMode && item.full && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }} 
                transition={springConfig} 
                className="overflow-hidden"
              >
                <div 
                  ref={contentRef}
                  className="mt-6 pt-6 border-t border-dashed 
                    border-gray-200 dark:border-slate-700"
                >
                  <div className="flex items-start gap-3 text-text 
                    dark:text-text-dark">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-1 
                      opacity-50" />
                    
                    <MarkdownContent content={item.full} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {item.tag && (
            <div className="mt-5">
              <Badge variant={item.tag.class}>{item.tag.text}</Badge>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
