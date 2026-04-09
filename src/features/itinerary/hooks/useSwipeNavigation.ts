import { PanInfo } from 'framer-motion';
import { ItineraryDay } from '../types';

interface SwipeOptions {
  itinerary: ItineraryDay[];
  activeDayId: string;
  onNavigate: (id: string) => void;
}

export function useSwipeNavigation({
  itinerary,
  activeDayId,
  onNavigate,
}: SwipeOptions) {
  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 70;
    const velocity = 300;
    const curIdx = itinerary.findIndex((d) => d.id === activeDayId);

    if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      if (curIdx < itinerary.length - 1) {
        onNavigate(itinerary[curIdx + 1].id);
      }
    } else if (info.offset.x > threshold || info.velocity.x > velocity) {
      if (curIdx > 0) {
        onNavigate(itinerary[curIdx - 1].id);
      }
    }
  };

  return { handleDragEnd };
}
