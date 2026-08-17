import React from 'react';
import './financialFigure.css';

/**
 * Renders a monetary/percentage figure with AAA-contrast-safe color
 * (--color-success-text / --color-error-text, see tokens.css) and a
 * direction glyph + sign, so meaning never depends on color alone -
 * critical for P&L, balances and any figure a screen-reader or
 * color-blind user needs to read unambiguously.
 *
 * value: number (negative renders as a loss)
 * format: 'currency' | 'percent' | 'plain'
 */
export default function FinancialFigure({
  value,
  format = 'currency',
  size = 'md',
  showSign = true,
  className = '',
  currency = 'USD',
}) {
  const numeric = Number(value);
  const isNegative = numeric < 0;
  const isZero = numeric === 0;
  const tone = isZero ? 'neutral' : isNegative ? 'error' : 'success';

  const formatted = (() => {
    const abs = Math.abs(numeric);
    if (format === 'currency') {
      return abs.toLocaleString(undefined, { style: 'currency', currency, maximumFractionDigits: 2 });
    }
    if (format === 'percent') {
      return `${abs.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
    }
    return abs.toLocaleString();
  })();

  const sign = isZero ? '' : isNegative ? '−' : '+';
  const directionLabel = isZero ? 'unchanged' : isNegative ? 'down' : 'up';

  return (
    <span
      className={`ui-fig ui-fig--${tone} ui-fig--${size} ${className}`}
      aria-label={`${directionLabel} ${formatted}`}
    >
      {showSign && (
        <span className="ui-fig__glyph" aria-hidden="true">
          {isZero ? '•' : isNegative ? '▼' : '▲'}
        </span>
      )}
      <span aria-hidden="true">{showSign ? sign : ''}{formatted}</span>
    </span>
  );
}
