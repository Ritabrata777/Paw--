'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TabItem {
  key: string;
  label: string;
  /** Optional count badge */
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  /** Controlled active key */
  activeKey?: string;
  /** Default active key (uncontrolled) */
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Tabs({
  tabs,
  activeKey: controlledKey,
  defaultActiveKey,
  onChange,
  className,
}: TabsProps) {
  const [internalKey, setInternalKey] = useState(
    defaultActiveKey ?? tabs[0]?.key ?? '',
  );
  const activeKey = controlledKey ?? internalKey;

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current.get(activeKey);
    if (el) {
      const parent = el.parentElement;
      if (parent) {
        setIndicator({
          left: el.offsetLeft - parent.offsetLeft,
          width: el.offsetWidth,
        });
      }
    }
  }, [activeKey]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const handleSelect = (key: string) => {
    if (controlledKey === undefined) setInternalKey(key);
    onChange?.(key);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex gap-1 border-b border-border-light" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.key, el);
              }}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(tab.key)}
              className={cn(
                'relative px-4 py-2.5 text-sm font-body font-medium',
                'transition-colors duration-200 whitespace-nowrap',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 rounded-t',
                isActive
                  ? 'text-forest'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-1.5 inline-flex items-center justify-center',
                    'rounded-full px-1.5 py-px text-[10px] font-semibold leading-none',
                    isActive
                      ? 'bg-forest/10 text-forest'
                      : 'bg-cream text-text-tertiary',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Animated underline indicator */}
      <motion.div
        className="absolute bottom-0 h-[2px] bg-forest rounded-full"
        animate={{ left: indicator.left, width: indicator.width }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    </div>
  );
}
