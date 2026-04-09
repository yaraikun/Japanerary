import { 
  useState, 
  useMemo, 
  useEffect, 
  useRef 
} from 'react';

import { 
  ItineraryDay 
} from '../types';

export const HEADER_OFFSET = 108;

export const STICKY_TABS_OFFSET = 80;

export const springConfig = { 
  type: "spring",
  stiffness: 450,
  damping: 38,
  mass: 1,
  restDelta: 0.01
} as const;

export function useItinerary(
  itinerary: ItineraryDay[]
) {
  const [
    activeDayId, 
    setActiveDayId
  ] = useState<string | null>(null);

  const [
    expandedItems, 
    setExpandedItems
  ] = useState<Set<string>>(new Set());

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (itinerary.length === 0) {
      setActiveDayId(null);
      
      return;
    }

    if (!activeDayId) {
      setActiveDayId(itinerary[0].id);
      
      return;
    }

    const dayExists = itinerary.some(
      d => d.id === activeDayId
    );

    if (!dayExists) {
      setActiveDayId(itinerary[0].id);
    }
  }, [itinerary, activeDayId]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      return;
    }

    if (activeDayId) {
      window.scrollTo({ 
        top: HEADER_OFFSET, 
        behavior: 'smooth' 
      });
    }
  }, [activeDayId]);

  const toggleExpand = (
    dayId: string, 
    index: number
  ) => {
    const key = `${dayId}-${index}`;
    
    const next = new Set(expandedItems);

    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }

    setExpandedItems(next);
  };

  const activeDay = useMemo(() => 
    itinerary.find(
      (d) => d.id === activeDayId
    ), 
    [activeDayId, itinerary]
  );

  return {
    activeDay,
    activeDayId,
    setActiveDayId,
    expandedItems,
    toggleExpand,
    itinerary
  };
}
