import { 
  MapPin, 
  Plane, 
  Utensils, 
  TrainFront, 
  Navigation2 
} from 'lucide-react';
import { ItineraryItem } from '../types';

export const getTimelineIcon = (item: ItineraryItem) => {
  const p = { className: 'w-4 h-4' };
  const title = item.title.toLowerCase();
  
  if (title.includes('flight')) return <Plane {...p} />;
  if (item.tag?.class === 'food') return <Utensils {...p} />;
  if (item.tag?.class === 'transport') {
    return title.includes('train') 
      ? <TrainFront {...p} /> 
      : <Navigation2 {...p} />;
  }
  return <MapPin {...p} />;
};
