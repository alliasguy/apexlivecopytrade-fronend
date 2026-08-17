import React from 'react';
import './card.css';

export function Card({ as: Tag = 'div', padding = 'md', glass = false, hoverable = false, className = '', children, ...rest }) {
  const classes = [
    'ui-card',
    `ui-card--${padding}`,
    glass ? 'ui-card--glass' : '',
    hoverable ? 'ui-card--hoverable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`ui-card__header ${className}`}>
      <div className="ui-card__header-text">
        {title && <h3 className="ui-card__title">{title}</h3>}
        {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="ui-card__header-action">{action}</div>}
    </div>
  );
}

export function CardFooter({ className = '', children }) {
  return <div className={`ui-card__footer ${className}`}>{children}</div>;
}

export default Card;
