import { 
  useState, 
  useEffect 
} from 'react';

import { 
  Edit2, 
  Move, 
  CalendarDays, 
  Trash2, 
  MoveHorizontal 
} from 'lucide-react';

import { 
  ActionMenu, 
  ConfirmModal,
  Modal,
  Button
} from '@/components/ui';

import { ItemModal } from './ItemModal';

import { RescheduleModal } from './RescheduleModal';

import { SwapDayModal } from './SwapDayModal';

import { 
  ItineraryDay, 
  ItineraryItem 
} from '../types';

import { 
  numberToWords 
} from '@/lib/utils';

interface ItineraryOverlaysProps {
  activeDay?: ItineraryDay;
  days: ItineraryDay[];
  selectedItemIds: Set<string>;
  isManageMenuOpen: boolean;
  setIsManageMenuOpen: (open: boolean) => void;
  editingItem: ItineraryItem | null;
  setEditingItem: (item: ItineraryItem | null) => void;
  isBulkDeleteModalOpen: boolean;
  setIsBulkDeleteModalOpen: (open: boolean) => void;
  isBulkRescheduleModalOpen: boolean;
  setIsBulkRescheduleModalOpen: (open: boolean) => void;
  isBulkDeleting: boolean;
  managingDay: { day: ItineraryDay; index: number } | null;
  setManagingDay: (val: any) => void;
  editingDayDate: ItineraryDay | null;
  setEditingDayDate: (day: ItineraryDay | null) => void;
  swappingDay: ItineraryDay | null;
  setSwappingDay: (day: ItineraryDay | null) => void;
  deletingDay: ItineraryDay | null;
  setDeletingDay: (day: ItineraryDay | null) => void;
  isDayDeleting: boolean;
  onStartReorder: () => void;
  onUpdateItem: (id: string, item: any) => Promise<void>;
  onUpdateDay: (id: string, date: string) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onBulkMove: (targetId: string) => Promise<void>;
  onDayDelete: () => Promise<void>;
  onDaySwap: (targetId: string) => Promise<void>;
  onCancelSelection: () => void;
}

export const ItineraryOverlays = ({
  activeDay,
  days,
  selectedItemIds,
  isManageMenuOpen,
  setIsManageMenuOpen,
  editingItem,
  setEditingItem,
  isBulkDeleteModalOpen,
  setIsBulkDeleteModalOpen,
  isBulkRescheduleModalOpen,
  setIsBulkRescheduleModalOpen,
  isBulkDeleting,
  managingDay,
  setManagingDay,
  editingDayDate,
  setEditingDayDate,
  swappingDay,
  setSwappingDay,
  deletingDay,
  setDeletingDay,
  isDayDeleting,
  onStartReorder,
  onUpdateItem,
  onUpdateDay,
  onBulkDelete,
  onBulkMove,
  onDayDelete,
  onDaySwap,
  onCancelSelection
}: ItineraryOverlaysProps) => {
  const [localEditedDate, setLocalEditedDate] = useState('');
  
  const [isSubmittingDate, setIsSubmittingDate] = useState(false);

  useEffect(() => {
    if (editingDayDate) {
      setLocalEditedDate(editingDayDate.date);
    }
  }, [editingDayDate]);

  const handleUpdateDate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDayDate && localEditedDate.trim() && !isSubmittingDate) {
      setIsSubmittingDate(true);
      
      try {
        await onUpdateDay(editingDayDate.id, localEditedDate.trim());
        
        setEditingDayDate(null);
      } catch (err) {
        alert("Failed to update date.");
      } finally {
        setIsSubmittingDate(false);
      }
    }
  };

  const isSingle = selectedItemIds.size === 1;
  
  const selectedItems = activeDay?.items.filter(
    i => selectedItemIds.has(i.id)
  ) || [];

  const itemMenuTitle = isSingle 
    ? selectedItems[0]?.title || "Item" 
    : selectedItems.map(i => i.title).join(', ');

  const itemMenuSubtitle = isSingle 
    ? "Managing Item" 
    : `Managing ${numberToWords(selectedItemIds.size)} items`;

  const manageMenuItems = isSingle ? [
    { 
      label: 'Edit Card', 
      icon: <Edit2 className="w-5 h-5" />, 
      onClick: () => {
        if (selectedItems[0]) setEditingItem(selectedItems[0]);
      } 
    },
    { 
      label: 'Move Card', 
      icon: <Move className="w-5 h-5" />, 
      onClick: onStartReorder
    },
    { 
      label: 'Schedule to different day', 
      icon: <CalendarDays className="w-5 h-5" />, 
      onClick: () => setIsBulkRescheduleModalOpen(true),
      hasSeparator: true 
    },
    { 
      label: 'Delete Card', 
      icon: <Trash2 className="w-5 h-5" />, 
      onClick: () => setIsBulkDeleteModalOpen(true),
      isDanger: true 
    },
  ] : [
    { 
      label: 'Move Cards', 
      icon: <Move className="w-5 h-5" />, 
      onClick: onStartReorder
    },
    { 
      label: 'Schedule to different day', 
      icon: <CalendarDays className="w-5 h-5" />, 
      onClick: () => setIsBulkRescheduleModalOpen(true),
      hasSeparator: true 
    },
    { 
      label: 'Delete Cards', 
      icon: <Trash2 className="w-5 h-5" />, 
      onClick: () => setIsBulkDeleteModalOpen(true),
      isDanger: true 
    },
  ];

  const manageDayMenuItems = managingDay ? [
    { 
      label: 'Edit Date', 
      icon: <Edit2 className="w-5 h-5" />, 
      onClick: () => {
        setEditingDayDate(managingDay.day);
        setManagingDay(null);
      } 
    },
    { 
      label: 'Swap Day', 
      icon: <MoveHorizontal className="w-5 h-5" />, 
      onClick: () => {
        setSwappingDay(managingDay.day);
        setManagingDay(null);
      },
      hasSeparator: true
    },
    { 
      label: 'Delete Day', 
      icon: <Trash2 className="w-5 h-5" />, 
      onClick: () => {
        setDeletingDay(managingDay.day);
        setManagingDay(null);
      },
      isDanger: true 
    },
  ] : [];

  return (
    <>
      <ActionMenu
        isOpen={isManageMenuOpen}
        onClose={() => setIsManageMenuOpen(false)}
        title={itemMenuTitle}
        subtitle={itemMenuSubtitle}
        items={manageMenuItems}
      />

      <ActionMenu
        isOpen={!!managingDay}
        onClose={() => setManagingDay(null)}
        title={
          managingDay 
            ? `Day ${managingDay.index + 1}: ${managingDay.day.date}` 
            : ""
        }
        items={manageDayMenuItems}
      />

      {editingDayDate && (
        <Modal
          isOpen={!!editingDayDate}
          onClose={() => {
            setEditingDayDate(null);
            setManagingDay({ 
              day: editingDayDate, 
              index: days.findIndex(d => d.id === editingDayDate.id) 
            });
          }}
          title="Edit Day Date"
          position="top"
        >
          <form 
            onSubmit={handleUpdateDate} 
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
                value={localEditedDate}
                onChange={(e) => setLocalEditedDate(e.target.value)}
                placeholder="e.g. April 17"
                disabled={isSubmittingDate}
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
                onClick={() => {
                  setEditingDayDate(null);
                  setManagingDay({ 
                    day: editingDayDate, 
                    index: days.findIndex(d => d.id === editingDayDate.id) 
                  });
                }}
                disabled={isSubmittingDate}
                className="flex-1 py-3 rounded-2xl text-dark dark:text-white"
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                disabled={!localEditedDate.trim() || isSubmittingDate}
                className="flex-1 py-3 rounded-2xl disabled:opacity-50"
              >
                {isSubmittingDate ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {editingItem && (
        <ItemModal
          isOpen={!!editingItem}
          onClose={() => { 
            setEditingItem(null); 
            setIsManageMenuOpen(true); 
          }}
          title="Edit Card"
          initialData={editingItem}
          onSave={async (updated) => {
            await onUpdateItem(editingItem.id, updated);
            setEditingItem(null);
            onCancelSelection();
          }}
        />
      )}

      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => {
          setIsBulkDeleteModalOpen(false);
          setIsManageMenuOpen(true);
        }}
        onConfirm={onBulkDelete}
        isLoading={isBulkDeleting}
        title="Delete Items"
        confirmText={`Delete ${selectedItemIds.size} Items`}
        message={
          <>
            Are you sure you want to delete <span className="text-dark 
            dark:text-white font-bold">{selectedItemIds.size} items</span>? 
            This action cannot be undone.
          </>
        }
      />

      {isBulkRescheduleModalOpen && (
        <RescheduleModal
          isOpen={isBulkRescheduleModalOpen}
          onClose={() => {
            setIsBulkRescheduleModalOpen(false);
            setIsManageMenuOpen(true);
          }}
          onConfirm={onBulkMove}
          days={days}
          currentDayId={activeDay?.id || ''}
          itemTitle={`${selectedItemIds.size} selected items`}
        />
      )}

      {swappingDay && (
        <SwapDayModal
          isOpen={!!swappingDay}
          onClose={() => {
            const idx = days.findIndex(d => d.id === swappingDay.id);
            setManagingDay({ day: swappingDay, index: idx });
            setSwappingDay(null);
          }}
          onConfirm={onDaySwap}
          days={days}
          currentDayId={swappingDay.id}
        />
      )}

      {deletingDay && (
        <ConfirmModal
          isOpen={!!deletingDay}
          onClose={() => {
            const idx = days.findIndex(d => d.id === deletingDay.id);
            setManagingDay({ day: deletingDay, index: idx });
            setDeletingDay(null);
          }}
          onConfirm={onDayDelete}
          isLoading={isDayDeleting}
          title="Delete Day"
          confirmText="Delete Day"
          message={
            <>
              Are you sure you want to delete <span className="text-dark 
              dark:text-white font-bold">{deletingDay.date}</span>? 
              This action cannot be undone.
            </>
          }
        />
      )}
    </>
  );
};
