import { DayTabs } from './DayTabs';
import { ItineraryDay } from '../types';
import { UserRole } from '@/features/auth/hooks/useAuthStatus';

interface ItineraryNavProps {
  itinerary: ItineraryDay[];
  activeDayId: string;
  role: UserRole;
  isDisabled?: boolean;
  onTabChange: (id: string) => void;
  onAddDay: (date: string) => Promise<void>;
  onManageDay: (day: ItineraryDay, index: number) => void;
}

export const ItineraryNav = ({
  itinerary,
  activeDayId,
  role,
  isDisabled,
  onTabChange,
  onAddDay,
  onManageDay
}: ItineraryNavProps) => {
  return (
    <div 
      className="sticky top-0 z-[1000] bg-dark-nav dark:bg-slate-900 
        border-b border-white/5 dark:border-white/10 shadow-xl 
        transition-colors duration-300"
    >
      <DayTabs 
        itinerary={itinerary} 
        activeDayId={activeDayId} 
        role={role}
        isDisabled={isDisabled}
        onTabChange={onTabChange} 
        onAddDay={onAddDay}
        onManageDay={onManageDay}
      />
    </div>
  );
};
