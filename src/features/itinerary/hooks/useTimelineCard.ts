import { 
  useRef, 
  useEffect, 
  useCallback 
} from 'react';

import { 
  STICKY_TABS_OFFSET 
} from './useItinerary';

import { 
  UserRole 
} from '@/features/auth/hooks/useAuthStatus';

import { 
  getCenteredScrollTarget 
} from '@/lib/utils';

interface UseTimelineCardProps {
  isExpanded: boolean;
  role: UserRole;
  onToggle: () => void;
  itemId: string;
  onStartSelection?: (id: string) => void;
  isSelectionMode?: boolean;
}

export function useTimelineCard({
  isExpanded,
  role,
  onToggle,
  itemId,
  onStartSelection,
  isSelectionMode,
}: UseTimelineCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  
  const timerRef = useRef<any>(null);
  
  const longPressTriggered = useRef(false);

  const centerCard = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    
    const scrollTarget = getCenteredScrollTarget(
      rect, 
      STICKY_TABS_OFFSET
    );
    
    window.scrollTo({ 
      top: scrollTarget, 
      behavior: 'smooth' 
    });
  }, []);

  useEffect(() => {
    if (isExpanded) {
      const timeout = setTimeout(() => {
        centerCard();
      }, 200);
      
      return () => clearTimeout(timeout);
    }
  }, [isExpanded, centerCard]);

  const handlePointerDown = () => {
    if (role !== 'admin' || isSelectionMode) {
      return;
    }

    longPressTriggered.current = false;
    
    timerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      
      onStartSelection?.(itemId);
    }, 600);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      
      timerRef.current = null;
    }
  };

  const handlePointerMove = () => {
    if (timerRef.current && !longPressTriggered.current) {
      clearTimeout(timerRef.current);
      
      timerRef.current = null;
    }
  };

  const handleClick = (hasDetails: boolean) => {
    if (longPressTriggered.current) {
      return;
    }

    if (hasDetails) {
      onToggle();
    }
  };

  return {
    containerRef,
    contentRef,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    handleClick,
    centerCard
  };
}
