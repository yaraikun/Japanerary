import { 
  useEffect 
} from 'react';

import { 
  motion, 
  AnimatePresence 
} from 'framer-motion';

import { 
  Settings2 
} from 'lucide-react';

import { 
  useItinerary, 
  STICKY_TABS_OFFSET 
} from '../hooks/useItinerary';

import { 
  useItineraryData 
} from '../hooks/useItineraryData';

import { 
  useSwipeNavigation 
} from '../hooks/useSwipeNavigation';

import { 
  useItineraryView 
} from '../hooks/useItineraryView';

import { 
  ItineraryNav 
} from './ItineraryNav';

import { 
  ItineraryBody 
} from './ItineraryBody';

import { 
  SelectionFooter 
} from './SelectionFooter';

import { 
  ReorderControls 
} from './ReorderControls';

import { 
  ItineraryOverlays 
} from './ItineraryOverlays';

import { 
  Header, 
  Footer 
} from '@/components/layout';

import { 
  Toast 
} from '@/components/ui';

import { 
  UserRole 
} from '@/features/auth/hooks/useAuthStatus';

import { 
  cn, 
  getCenteredScrollTarget 
} from '@/lib/utils';

interface ItineraryViewProps {
  role: UserRole;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const ItineraryView = ({
  role,
  isDark,
  onToggleTheme,
  onLogout
}: ItineraryViewProps) => {
  const dataStore = useItineraryData();
  
  const itineraryData = useItinerary(dataStore.data);
  
  const view = useItineraryView({
    activeDay: itineraryData.activeDay,
    activeDayId: itineraryData.activeDayId,
    reorderItems: dataStore.reorderItems,
    deleteItems: dataStore.deleteItems,
    moveItemsToDay: dataStore.moveItemsToDay,
    deleteDay: dataStore.deleteDay,
    swapDays: dataStore.swapDays
  });

  useEffect(() => {
    if (view.isReorderMode && view.selectedItemIds.size > 0) {
      const firstId = Array.from(view.selectedItemIds)[0];
      
      const el = document.querySelector(`[data-item-id="${firstId}"]`);
      
      if (el) {
        const rect = el.getBoundingClientRect();
        
        const scrollTarget = getCenteredScrollTarget(
          rect, 
          STICKY_TABS_OFFSET
        );

        window.scrollTo({ 
          top: scrollTarget, 
          behavior: 'smooth' 
        });
      }
    }
  }, [view.localItems, view.isReorderMode, view.selectedItemIds]);

  const isOverlayActive = view.isManageMenuOpen || 
    !!view.editingItem || 
    view.isBulkDeleteModalOpen || 
    view.isBulkRescheduleModalOpen ||
    !!view.managingDay ||
    !!view.editingDayDate ||
    !!view.swappingDay ||
    !!view.deletingDay;

  const isNavigationDisabled = (view.isSelectionMode || view.isReorderMode) && 
    view.selectedItemIds.size > 0;

  const { handleDragEnd } = useSwipeNavigation({
    itinerary: itineraryData.itinerary,
    activeDayId: itineraryData.activeDayId || '',
    onNavigate: (id) => {
      if (!isNavigationDisabled) {
        itineraryData.setActiveDayId(id);
      }
    },
  });

  return (
    <div className={cn(
      "min-h-screen bg-bg dark:bg-bg-dark transition-colors duration-300",
      (view.isReorderMode || view.isSelectionMode) && "overscroll-none"
    )}>
      <div className="bg-dark-nav dark:bg-slate-900">
        <Header 
          isDark={isDark} 
          role={role}
          onToggleTheme={onToggleTheme} 
          onLogout={onLogout}
          onExport={dataStore.exportData}
        />
      </div>
      
      <div className="min-h-screen flex flex-col relative">
        {itineraryData.activeDayId && (
          <ItineraryNav 
            itinerary={itineraryData.itinerary}
            activeDayId={itineraryData.activeDayId}
            role={role}
            isDisabled={isNavigationDisabled}
            onTabChange={itineraryData.setActiveDayId}
            onAddDay={dataStore.addDay}
            onManageDay={(day, index) => view.setManagingDay({ day, index })}
          />
        )}
        
        <motion.div 
          className="flex-grow touch-pan-y"
          drag={isNavigationDisabled ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          <div className="max-w-xl mx-auto">
            <ItineraryBody 
              {...itineraryData} 
              role={role} 
              onUpdateDay={dataStore.updateDay} 
              onAddItem={dataStore.addItem}
              onUpdateItem={dataStore.updateItem}
              onDeleteItem={dataStore.deleteItem}
              onMoveItem={dataStore.moveItemToDay}
              isReorderMode={view.isReorderMode}
              onEnterReorderMode={view.startReorderMode}
              onReorderItems={async () => {}}
              isSelectionMode={view.isSelectionMode || view.isReorderMode}
              selectedItemIds={view.selectedItemIds}
              onToggleSelection={view.toggleSelection}
              onStartSelection={view.startSelectionMode}
              reorderedItems={view.localItems}
            />
          </div>
        </motion.div>
        
        <Footer />

        <AnimatePresence>
          <ReorderControls
            isVisible={view.isReorderMode && !isOverlayActive}
            onMoveUp={() => view.handleBulkMoveStep('up')}
            onMoveDown={() => view.handleBulkMoveStep('down')}
            disabled={view.selectedItemIds.size === 0 || view.isSyncing}
          />

          <SelectionFooter
            isVisible={view.isReorderMode && !isOverlayActive}
            onCancel={view.cancelReorder}
            onAction={view.handleReorderDone}
            actionLabel={view.isSyncing ? "SAVING..." : "SAVE"}
            actionIcon={null}
            isActionDisabled={view.selectedItemIds.size === 0 || view.isSyncing}
            isCancelDisabled={view.isSyncing}
            isSaveMode={true}
          />

          <SelectionFooter
            isVisible={view.isSelectionMode && !isOverlayActive}
            onCancel={view.cancelSelection}
            onAction={() => view.setIsManageMenuOpen(true)}
            actionLabel={`MANAGE (${view.selectedItemIds.size})`}
            actionIcon={<Settings2 className="w-4 h-4 mr-2" />}
            isActionDisabled={view.selectedItemIds.size === 0}
          />
        </AnimatePresence>

        <ItineraryOverlays
          {...view}
          activeDay={itineraryData.activeDay}
          days={dataStore.data}
          onStartReorder={view.startReorderMode}
          onUpdateItem={dataStore.updateItem}
          onUpdateDay={dataStore.updateDay}
          onBulkDelete={view.handleBulkDelete}
          onBulkMove={view.handleBulkMoveToDay}
          onDayDelete={view.handleDayDelete}
          onDaySwap={view.handleDaySwap}
          onCancelSelection={view.cancelSelection}
        />

        <Toast 
          message={view.toastMessage} 
          onClose={() => view.setToastMessage(null)} 
        />
      </div>
    </div>
  );
};
