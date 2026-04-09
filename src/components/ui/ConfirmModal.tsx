import { Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText: string;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  isLoading
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} showHeader={false}>
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 
          flex items-center justify-center mb-6">
          <Trash2 className="w-10 h-10 text-red-500" />
        </div>
        
        <h3 className="text-2xl font-black text-dark dark:text-white mb-3">
          Are you sure?
        </h3>
        
        <div className="text-sm text-subtext dark:text-slate-400 mb-10 
          px-2 leading-relaxed">
          {message}
        </div>

        <div className="w-full space-y-3">
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="w-full py-4 bg-red-500 shadow-lg shadow-red-500/20 
              text-white rounded-2xl"
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isLoading}
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
