import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import './modal.css';

/**
 * Accessible, animated modal primitive.
 * Handles: focus-on-open, Escape to close, backdrop click to close,
 * scroll lock, Framer Motion scale-spring transitions, and returning focus on close.
 */
export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => dialogRef.current?.focus());
      return () => {
        document.body.style.overflow = previousOverflow;
        if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="ui-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
        >
          <motion.div
            className={`ui-modal ui-modal--${size}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <div className="ui-modal__header">
              {title && <h2 className="ui-modal__title">{title}</h2>}
              <button type="button" className="ui-modal__close" onClick={onClose} aria-label="Close dialog">
                <MdClose />
              </button>
            </div>
            <div className="ui-modal__body">{children}</div>
            {footer && <div className="ui-modal__footer">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
