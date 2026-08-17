import React, { useId } from 'react';
import { motion } from 'framer-motion';
import './tabs.css';

/**
 * items: [{ key, label }]
 * Follows the WAI-ARIA tabs pattern (roving tabindex + arrow-key nav),
 * with Framer Motion active indicator animation.
 */
export default function Tabs({ items, activeKey, onChange }) {
  const baseId = useId();

  const handleKeyDown = (e, index) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = (index + dir + items.length) % items.length;
    onChange(items[next].key);
    document.getElementById(`${baseId}-tab-${items[next].key}`)?.focus();
  };

  return (
    <div className="ui-tabs" role="tablist">
      {items.map((item, index) => {
        const active = item.key === activeKey;
        return (
          <button
            key={item.key}
            id={`${baseId}-tab-${item.key}`}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={`ui-tabs__tab ${active ? 'ui-tabs__tab--active' : ''}`}
            onClick={() => onChange(item.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <span className="ui-tabs__label">{item.label}</span>
            {active && (
              <motion.div
                layoutId={`activeTabIndicator-${baseId}`}
                className="ui-tabs__active-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
