import React, { useId } from 'react';
import './input.css';

/**
 * Shared labeled input, replaces the hand-rolled input_containers/
 * input_labels/input_field markup duplicated across Login/Signup/
 * ForgotPassword (see AUDIT.md §4).
 */
const Input = React.forwardRef(function Input(
  {
    label,
    id,
    error,
    helperText,
    required = false,
    icon = null,
    trailingAction = null,
    className = '',
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className={`ui-field ${className}`}>
      {label && (
        <label className="ui-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="ui-field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={`ui-field__control ${error ? 'ui-field__control--error' : ''}`}>
        {icon && <span className="ui-field__icon" aria-hidden="true">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className="ui-field__input"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          {...rest}
        />
        {trailingAction && <span className="ui-field__trailing">{trailingAction}</span>}
      </div>
      {error && (
        <p id={errorId} className="ui-field__error" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="ui-field__helper">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
