import { useState } from 'react';

import { 
  ItineraryDay, 
  ItineraryItem 
} from '../types';

interface UseItineraryViewProps {
  activeDay?: ItineraryDay;
  activeDayId: string | null;
  reorderItems: (dayId: string, itemIds: string[]) => Promise<void>;
  deleteItems: (ids: string[]) => Promise<void>;
  moveItemsToDay: (itemIds: string[], targetDayId: string) => Promise<void>;
  deleteDay: (id: string) => Promise<void>;
  swapDays: (idA: string, idB: string) => Promise<void>;
}

export function useItineraryView({
  activeDay,
  activeDayId,
  reorderItems,
  deleteItems,
  moveItemsToDay,
  deleteDay,
  swapDays
}: UseItineraryViewProps) {
  const [isReorderMode, setIsReorderMode] = useState(false);
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  
  const [localItems, setLocalItems] = useState<ItineraryItem[] | null>(null);
  
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  
  const [
    isBulkRescheduleModalOpen, 
    setIsBulkRescheduleModalOpen
  ] = useState(false);
  
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [managingDay, setManagingDay] = useState<{ 
    day: ItineraryDay; 
    index: number; 
  } | null>(null);
  
  const [editingDayDate, setEditingDayDate] = useState<ItineraryDay | null>(null);
  
  const [swappingDay, setSwappingDay] = useState<ItineraryDay | null>(null);
  
  const [deletingDay, setDeletingDay] = useState<ItineraryDay | null>(null);
  
  const [isDayDeleting, setIsDayDeleting] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedItemIds);
    
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    
    setSelectedItemIds(next);
  };

  const startSelectionMode = (initialId: string) => {
    setIsSelectionMode(true);
    
    setSelectedItemIds(new Set([initialId]));
  };

  const startReorderMode = () => {
    if (activeDay) {
      setLocalItems(activeDay.items);
      
      setIsReorderMode(true);
      
      setIsSelectionMode(false);
    }
  };

  const cancelSelection = () => {
    setIsSelectionMode(false);
    
    setIsReorderMode(false);
    
    setSelectedItemIds(new Set());
    
    setLocalItems(null);
    
    setIsManageMenuOpen(false);
  };

  const cancelReorder = () => {
    setIsReorderMode(false);
    
    setIsSelectionMode(true);
    
    setLocalItems(null);
    
    setIsManageMenuOpen(true);
  };

  const handleReorderDone = async () => {
    if (localItems && activeDayId) {
      setIsSyncing(true);
      
      try {
        await reorderItems(activeDayId, localItems.map(i => i.id));
        
        cancelSelection();
        
        showToast("Order saved");
      } catch (err) {
        showToast("Failed to save order");
      } finally {
        setIsSyncing(false);
      }
    } else {
      cancelSelection();
    }
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    
    try {
      await deleteItems(Array.from(selectedItemIds));
      
      setIsBulkDeleteModalOpen(false);
      
      cancelSelection();
      
      showToast("Items deleted");
    } catch (err) {
      showToast("Failed to delete items");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleBulkMoveToDay = async (targetDayId: string) => {
    try {
      await moveItemsToDay(Array.from(selectedItemIds), targetDayId);
      
      setIsBulkRescheduleModalOpen(false);
      
      cancelSelection();
      
      showToast("Items rescheduled");
    } catch (err) {
      showToast("Failed to move items");
    }
  };

  const handleBulkMoveStep = (direction: 'up' | 'down') => {
    setLocalItems((prev) => {
      if (!prev) {
        return prev;
      }
      
      const items = [...prev];
      
      const selectedIndices = items
        .map((item, index) => selectedItemIds.has(item.id) ? index : -1)
        .filter(index => index !== -1);

      if (selectedIndices.length === 0) {
        return prev;
      }

      if (direction === 'up') {
        selectedIndices.sort((a, b) => a - b);
        
        if (selectedIndices[0] <= 0) {
          return prev;
        }
        
        selectedIndices.forEach(idx => {
          [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];
        });
      } else {
        selectedIndices.sort((a, b) => b - a);
        
        if (selectedIndices[selectedIndices.length - 1] >= items.length - 1) {
          return prev;
        }
        
        selectedIndices.forEach(idx => {
          [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
        });
      }
      
      return items;
    });
  };

  const handleDayDelete = async () => {
    if (!deletingDay) {
      return;
    }
    
    setIsDayDeleting(true);
    
    try {
      await deleteDay(deletingDay.id);
      
      setDeletingDay(null);
      
      setManagingDay(null);
      
      showToast("Day deleted");
    } catch (err) {
      showToast("Failed to delete day");
    } finally {
      setIsDayDeleting(false);
    }
  };

  const handleDaySwap = async (targetId: string) => {
    if (!swappingDay) {
      return;
    }
    
    try {
      await swapDays(swappingDay.id, targetId);
      
      setSwappingDay(null);
      
      setManagingDay(null);
    } catch (err) {
      showToast("Swap cancelled");
    }
  };

  return {
    isReorderMode,
    isSelectionMode,
    selectedItemIds,
    localItems,
    isManageMenuOpen,
    setIsManageMenuOpen,
    editingItem,
    setEditingItem,
    isBulkDeleteModalOpen,
    setIsBulkDeleteModalOpen,
    isBulkRescheduleModalOpen,
    setIsBulkRescheduleModalOpen,
    isBulkDeleting,
    isSyncing,
    managingDay,
    setManagingDay,
    editingDayDate,
    setEditingDayDate,
    swappingDay,
    setSwappingDay,
    deletingDay,
    setDeletingDay,
    isDayDeleting,
    toastMessage,
    setToastMessage,
    toggleSelection,
    startSelectionMode,
    startReorderMode,
    cancelSelection,
    cancelReorder,
    handleReorderDone,
    handleBulkDelete,
    handleBulkMoveToDay,
    handleBulkMoveStep,
    handleDayDelete,
    handleDaySwap
  };
}
