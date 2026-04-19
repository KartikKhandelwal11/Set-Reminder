import { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function BottomSheet({ isOpen, onClose, children, title, className }: BottomSheetProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-white",
              "max-h-[calc(100dvh-120px)] pb-safe",
              className
            )}
            // Constrain width on larger screens to match mobile layout
            style={{ 
              maxWidth: '28rem', // max-w-md
              margin: '0 auto'
            }}
          >
            {/* Pill/Drag indicator */}
            <div className="flex w-full items-center justify-center pt-4 pb-2">
              <div className="h-1.5 w-12 rounded-full bg-gray-300" />
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
              {children}
            </div>

            {/* Floating Close Button (above the sheet, matching the design) */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2">
              <button 
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
