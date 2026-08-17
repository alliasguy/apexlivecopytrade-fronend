import React from 'react';
import './badge.css';

/** tone: 'success' | 'error' | 'warning' | 'primary' | 'neutral' */
export default function Badge({ tone = 'neutral', className = '', children }) {
  return <span className={`ui-badge ui-badge--${tone} ${className}`}>{children}</span>;
}
