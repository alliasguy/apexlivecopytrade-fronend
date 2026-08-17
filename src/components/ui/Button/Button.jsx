import React from 'react';
import './button.css';

/**
 * variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
const Button = React.forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    iconLeft = null,
    iconRight = null,
    type = 'button',
    className = '',
    children,
    ...rest
  },
  ref
) {
  const classes = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    fullWidth ? 'ui-btn--full' : '',
    loading ? 'ui-btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="ui-btn__spinner" aria-hidden="true" />}
      {!loading && iconLeft && <span className="ui-btn__icon ui-btn__icon--left">{iconLeft}</span>}
      <span className="ui-btn__label">{children}</span>
      {!loading && iconRight && <span className="ui-btn__icon ui-btn__icon--right">{iconRight}</span>}
    </button>
  );
});

export default Button;
