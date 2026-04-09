import { 
  useState 
} from 'react';

import { 
  Plus 
} from 'lucide-react';

import { 
  ItineraryDay 
} from '../types';

import { 
  UserRole 
} from '@/features/auth/hooks/useAuthStatus';

import { 
  TabButton 
} from './TabButton';

import { 
  Modal, 
  Button 
} from '@/components/ui';

interface DayTabsProps {
  itinerary: ItineraryDay[];
  activeDayId: string;
  role: UserRole;
  isDisabled?: boolean;
  onTabChange: (id: string) => void;
  onAddDay: (date: string) => Promise<void>;
  onManageDay: (day: ItineraryDay, index: number) => void;
}

export const DayTabs = ({ 
  itinerary, 
  activeDayId, 
  role,
  isDisabled,
  onTabChange,
  onAddDay,
  onManageDay
}: DayTabsProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newDate, setNewDate] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newDate.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        await onAddDay(newDate.trim());
        
        setNewDate('');
        
        setIsCreateOpen(false);
      } catch (err) {
        alert("Failed to add day.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex items-center max-w-xl mx-auto pl-4 pr-4">
      <div className="flex overflow-x-auto no-scrollbar flex-grow">
        {itinerary.map((day, idx) => (
          <TabButton
            key={day.id}
            day={day}
            idx={idx}
            isActive={activeDayId === day.id}
            isAdmin={role === 'admin'}
            isDisabled={isDisabled}
            onClick={() => !isDisabled && onTabChange(day.id)}
            onManage={onManageDay}
          />
        ))}
      </div>
      
      {role === 'admin' && !isDisabled && (
        <>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="ml-2 p-2 bg-primary/10 text-primary hover:bg-primary/20 
              rounded-xl transition-all active:scale-90 flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>

          <Modal
            isOpen={isCreateOpen}
            onClose={() => !isSubmitting && setIsCreateOpen(false)}
            title="Add New Day"
            position="top"
          >
            <form 
              onSubmit={handleCreate} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase 
                  tracking-widest text-subtext">
                  Date Label
                </label>
                
                <input
                  autoFocus
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. April 17"
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 dark:bg-slate-800 border-2 
                    border-gray-100 dark:border-slate-700 rounded-2xl px-4 
                    py-3 outline-none focus:border-primary transition-all 
                    text-dark dark:text-white font-bold disabled:opacity-50"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl text-dark dark:text-white"
                >
                  Cancel
                </Button>
                
                <Button 
                  type="submit"
                  disabled={!newDate.trim() || isSubmitting}
                  className="flex-1 py-3 rounded-2xl disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
};
