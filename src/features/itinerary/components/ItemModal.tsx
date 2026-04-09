import { 
  useState, 
  useEffect 
} from 'react';

import { 
  Maximize2 
} from 'lucide-react';

import { 
  Modal, 
  Button, 
  Toast 
} from '@/components/ui';

import { 
  ItineraryItem 
} from '../types';

import { 
  FullscreenEditor 
} from './FullscreenEditor';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ItineraryItem, 'id'>) => Promise<void>;
  initialData?: ItineraryItem;
  title: string;
}

export const ItemModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  title 
}: ItemModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    short: '',
    full: '',
    tag_text: '',
    tag_class: '' as 'transport' | 'food' | 'activity' | ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        time: initialData?.time || '',
        title: initialData?.title || '',
        short: initialData?.short || '',
        full: initialData?.full || '',
        tag_text: initialData?.tag?.text || '',
        tag_class: initialData?.tag?.class || ''
      });
    }
  }, [isOpen, initialData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return showToast("Title is required");
    }
    
    if (!formData.short.trim()) {
      return showToast("Subtitle is required");
    }

    setIsSubmitting(true);
    
    try {
      await onSave({
        time: formData.time || undefined,
        title: formData.title,
        short: formData.short,
        full: formData.full || undefined,
        tag: formData.tag_text ? {
          text: formData.tag_text,
          class: formData.tag_class as 'transport' | 'food' | 'activity'
        } : undefined
      });
      
      onClose();
    } catch (err) {
      showToast("Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={title}
        position="top"
      >
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4 pb-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40">
                Time (24h)
              </label>
              
              <input
                type="time"
                value={formData.time}
                onChange={(e) => 
                  setFormData({ 
                    ...formData, 
                    time: e.target.value 
                  })
                }
                className="w-full bg-gray-50 dark:bg-slate-800 border-2 
                  border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 
                  text-sm font-bold outline-none focus:border-primary 
                  appearance-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40">
                Tag Type
              </label>
              
              <select
                value={formData.tag_class}
                onChange={(e) => 
                  setFormData({ 
                    ...formData, 
                    tag_class: e.target.value as any 
                  })
                }
                className="w-full bg-gray-50 dark:bg-slate-800 border-2 
                  border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 
                  text-sm font-bold outline-none focus:border-primary"
              >
                <option value="">None</option>
                <option value="transport">Transport</option>
                <option value="food">Food</option>
                <option value="activity">Activity</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase opacity-40">
              Title
            </label>
            
            <input
              type="text"
              value={formData.title}
              onChange={(e) => 
                setFormData({ 
                  ...formData, 
                  title: e.target.value 
                })
              }
              placeholder="Activity Title"
              className="w-full bg-gray-50 dark:bg-slate-800 border-2 
                border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 
                text-sm font-bold outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase opacity-40">
              Subtitle / Short Description
            </label>
            
            <input
              type="text"
              value={formData.short}
              onChange={(e) => 
                setFormData({ 
                  ...formData, 
                  short: e.target.value 
                })
              }
              placeholder="Brief summary"
              className="w-full bg-gray-50 dark:bg-slate-800 border-2 
                border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 
                text-sm font-bold outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase opacity-40">
              Tag Label
            </label>
            
            <input
              type="text"
              value={formData.tag_text}
              onChange={(e) => 
                setFormData({ 
                  ...formData, 
                  tag_text: e.target.value 
                })
              }
              placeholder="e.g. Flight, Walkable"
              className="w-full bg-gray-50 dark:bg-slate-800 border-2 
                border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 
                text-sm font-bold outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase opacity-40">
                Detailed Content
              </label>
              
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="p-1 text-primary hover:bg-primary/10 rounded-md 
                  transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <textarea
              rows={3}
              value={formData.full}
              onChange={(e) => 
                setFormData({ 
                  ...formData, 
                  full: e.target.value 
                })
              }
              placeholder="Detailed info (Markdown supported)..."
              className="w-full bg-gray-50 dark:bg-slate-800 border-2 
                border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 
                text-sm font-medium outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-4 rounded-2xl"
            >
              {isSubmitting ? "Saving..." : "Save Card"}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              disabled={isSubmitting} 
              className="w-full py-3 rounded-2xl border-none shadow-none 
                text-subtext hover:text-dark dark:hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <FullscreenEditor
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        title={formData.title || 'New Card'}
        value={formData.full}
        onChange={(val) => 
          setFormData({ 
            ...formData, 
            full: val 
          })
        }
      />

      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage(null)} 
      />
    </>
  );
};
