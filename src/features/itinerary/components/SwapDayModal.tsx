import { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/components/ui';
import { ItineraryDay } from '../types';
import { cn } from '@/lib/utils';

interface SwapDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetDayId: string) => Promise<void>;
  days: ItineraryDay[];
  currentDayId: string;
}

export const SwapDayModal = ({
  isOpen,
  onClose,
  onConfirm,
  days,
  currentDayId,
}: SwapDayModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const currentDayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedDayId(currentDayId);
      setTimeout(() => {
        currentDayRef.current?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }, 100);
    }
  }, [isOpen, currentDayId]);

  const handleSwap = async () => {
    if (!selectedDayId || selectedDayId === currentDayId) return;
    setIsSubmitting(true);
    try {
      await onConfirm(selectedDayId);
      onClose();
    } catch (err) {
      alert("Failed to swap days.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDay = days.find(d => d.id === currentDayId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Swap Day Contents">
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest 
            text-primary mb-1">
            Swapping Contents Of
          </p>
          <h4 className="text-sm font-bold text-dark dark:text-white">
            {currentDay?.date}
          </h4>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-3 py-4 px-2">
          {days.map((day, idx) => {
            const isCurrent = day.id === currentDayId;
            const isSelected = selectedDayId === day.id;
            
            return (
              <button
                key={day.id}
                ref={isCurrent ? currentDayRef : null}
                disabled={isSubmitting}
                onClick={() => setSelectedDayId(day.id)}
                className={cn(
                  "flex-shrink-0 w-32 flex flex-col items-center justify-center",
                  "p-6 rounded-[2rem] border-2 transition-all outline-none",
                  "select-none focus:outline-none active:bg-transparent",
                  isSelected
                    ? "bg-primary/10 border-primary ring-4 ring-primary/10"
                    : "bg-white dark:bg-slate-900 border-gray-100 " +
                      "dark:border-slate-800"
                )}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-tighter mb-1",
                  isSelected ? "text-primary" : "text-subtext"
                )}>
                  Day {idx + 1}
                </span>
                <span className="text-xs font-bold text-dark dark:text-white 
                  text-center line-clamp-2">
                  {day.date}
                </span>
                {isCurrent && (
                  <div className="mt-3 px-2 py-0.5 bg-gray-100 
                    dark:bg-slate-800 rounded-full">
                    <span className="text-[8px] font-black uppercase 
                      text-subtext opacity-60">
                      Current
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleSwap}
            disabled={isSubmitting || !selectedDayId || selectedDayId === currentDayId}
            className="w-full py-4 rounded-2xl disabled:opacity-50"
          >
            {isSubmitting ? "Swapping..." : "Swap with Selected Day"}
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full py-3 border-none shadow-none text-subtext 
              font-bold hover:text-dark dark:hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
