import { 
  useState, 
  useEffect 
} from 'react';

import { 
  motion, 
  AnimatePresence 
} from 'framer-motion';

import { 
  Edit2 
} from 'lucide-react';

import { 
  TimelineCard 
} from './TimelineCard';

import { 
  AddCardButton 
} from './AddCardButton';

import { 
  ItemModal 
} from './ItemModal';

import { 
  RescheduleModal 
} from './RescheduleModal';

import { 
  ItineraryDay, 
  ItineraryItem 
} from '../types';

import { 
  UserRole 
} from '@/features/auth/hooks/useAuthStatus';

import { 
  Modal, 
  Button 
} from '@/components/ui';

import { 
  cn, 
  getCenteredScrollTarget 
} from '@/lib/utils';

interface ItineraryBodyProps {
  activeDay?: ItineraryDay;
  activeDayId: string | null;
  expandedItems: Set<string>;
  toggleExpand: (dayId: string, index: number) => void;
  itinerary: ItineraryDay[];
  setActiveDayId: (id: string | null) => void;
  role: UserRole;
  onUpdateDay: (id: string, date: string) => Promise<void>;
  onAddItem: (dayId: string, item: Omit<ItineraryItem, 'id'>) => Promise<void>;
  onUpdateItem: (id: string, item: Omit<ItineraryItem, 'id'>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onMoveItem: (itemId: string, targetDayId: string) => Promise<void>;
  isReorderMode: boolean;
  onEnterReorderMode: () => void;
  onReorderItems: (itemIds: string[]) => Promise<void>;
  isSelectionMode?: boolean;
  selectedItemIds?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onStartSelection?: (id: string) => void;
  reorderedItems?: ItineraryItem[] | null;
}

export const ItineraryBody = ({
  activeDay,
  activeDayId,
  expandedItems,
  toggleExpand,
  itinerary,
  role,
  onUpdateDay,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onMoveItem,
  isReorderMode,
  onEnterReorderMode,
  onReorderItems,
  isSelectionMode,
  selectedItemIds,
  onToggleSelection,
  onStartSelection,
  reorderedItems,
}: ItineraryBodyProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [
    reschedulingItem, 
    setReschedulingItem
  ] = useState<ItineraryItem | null>(null);
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const [editedDate, setEditedDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeDay && isEditModalOpen) {
      setEditedDate(activeDay.date);
    }
  }, [activeDay, isEditModalOpen]);

  useEffect(() => {
    setSelectedItemId(null);
  }, [isReorderMode, activeDayId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeDay && editedDate.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        await onUpdateDay(activeDay.id, editedDate.trim());
        
        setIsEditModalOpen(false);
      } catch (err) {
        alert("Failed to update date.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleMoveStep = (itemId: string, direction: 'up' | 'down') => {
    if (!activeDay) return;
    
    const items = [...activeDay.items];
    
    const idx = items.findIndex(i => i.id === itemId);
    
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    
    if (targetIdx < 0 || targetIdx >= items.length) return;
    
    const newItems = [...items];
    
    [newItems[idx], newItems[targetIdx]] = [newItems[targetIdx], newItems[idx]];
    
    onReorderItems(newItems.map(i => i.id));
  };

  const itemsToRender = isReorderMode && reorderedItems 
    ? reorderedItems 
    : activeDay?.items;

  return (
    <main className="px-3 py-8">
      <AnimatePresence 
        mode="wait" 
        initial={false}
      >
        <motion.div
          key={activeDayId ?? 'loading'}
          initial={{ opacity: 0, scale: 0.99, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.99, y: -5 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div 
            className={cn(
              "mb-8 ml-2 group inline-block", 
              role === 'admin' && !isReorderMode && !isSelectionMode && 
                "cursor-pointer"
            )}
            onClick={() => 
              role === 'admin' && !isReorderMode && !isSelectionMode && 
                setIsEditModalOpen(true)
            }
          >
            <h2 className="text-3xl font-black text-dark dark:text-white 
              tracking-tighter uppercase italic flex items-center gap-3">
              {activeDay?.date}
              
              {role === 'admin' && !isReorderMode && !isSelectionMode && (
                <Edit2 className="w-4 h-4 text-primary opacity-40" />
              )}
            </h2>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              className="h-1.5 bg-primary mt-1 rounded-full"
            />
          </div>

          <div className="timeline-container">
            {itemsToRender?.map((item, idx) => (
              <TimelineCard
                key={item.id}
                item={item}
                isExpanded={expandedItems.has(`${activeDayId}-${idx}`)}
                onToggle={() => toggleExpand(activeDayId || '', idx)}
                role={role}
                onUpdateItem={onUpdateItem}
                onDeleteItem={onDeleteItem}
                onRescheduleClick={(item) => setReschedulingItem(item)}
                isReorderMode={isReorderMode}
                onEnterReorderMode={onEnterReorderMode}
                isSelected={
                  selectedItemId === item.id || 
                  selectedItemIds?.has(item.id)
                }
                onSelect={() => 
                  isSelectionMode 
                    ? onToggleSelection?.(item.id) 
                    : setSelectedItemId(item.id)
                }
                onMoveStep={(dir) => handleMoveStep(item.id, dir)}
                isFirst={idx === 0}
                isLast={idx === (itemsToRender.length - 1)}
                isSelectionMode={isSelectionMode}
                onStartSelection={onStartSelection}
              />
            ))}
            
            {role === 'admin' && activeDay && !isReorderMode && !isSelectionMode && (
              <div className="pt-2">
                <AddCardButton onClick={() => setIsAddModalOpen(true)} />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {role === 'admin' && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => !isSubmitting && setIsEditModalOpen(false)}
            title="Edit Day Date"
            position="top"
          >
            <form 
              onSubmit={handleUpdate} 
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
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
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
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl text-dark dark:text-white"
                >
                  Cancel
                </Button>
                
                <Button 
                  type="submit"
                  disabled={!editedDate.trim() || isSubmitting}
                  className="flex-1 py-3 rounded-2xl disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Modal>

          {activeDay && (
            <ItemModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              title="Add New Card"
              onSave={(item) => onAddItem(activeDay.id, item)}
            />
          )}

          {activeDay && reschedulingItem && (
            <RescheduleModal
              isOpen={!!reschedulingItem}
              onClose={() => setReschedulingItem(null)}
              onConfirm={(targetDayId) => 
                onMoveItem(reschedulingItem.id, targetDayId)
              }
              days={itinerary}
              currentDayId={activeDay.id}
              itemTitle={reschedulingItem.title}
            />
          )}
        </>
      )}
    </main>
  );
};
