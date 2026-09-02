import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  hidden?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.filter((item) => !item.hidden);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-400/40"
        aria-label="Open actions menu"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.1 }}
            className={`absolute z-30 mt-1 min-w-[170px] rounded-lg bg-white p-1.5 shadow-xl ring-1 ring-black/5 border border-slate-200 focus:outline-hidden ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <div className="py-0.5" role="menu">
              {visibleItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={item.disabled}
                  title={item.disabledReason}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.disabled) {
                      setIsOpen(false);
                      item.onClick();
                    }
                  }}
                  className={`group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    item.disabled
                      ? 'text-slate-400 cursor-not-allowed opacity-60'
                      : item.danger
                      ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  role="menuitem"
                >
                  {item.icon && (
                    <span
                      className={`shrink-0 ${
                        item.disabled
                          ? 'text-slate-400'
                          : item.danger
                          ? 'text-red-500'
                          : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
