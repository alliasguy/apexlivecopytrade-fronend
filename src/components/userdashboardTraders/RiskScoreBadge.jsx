import React from 'react';

/**
 * RiskScoreBadge renders a color-coded risk badge (1-10 scale).
 * @param {number|string} score - Risk score value between 1 and 10
 */
const RiskScoreBadge = ({ score = 3 }) => {
  const numScore = Number(score) || 3;

  let label = 'Low Risk';
  let badgeClass = 'risk-low';

  if (numScore <= 3) {
    label = `Risk ${numScore}/10 · Low`;
    badgeClass = 'risk-low';
  } else if (numScore <= 6) {
    label = `Risk ${numScore}/10 · Moderate`;
    badgeClass = 'risk-med';
  } else {
    label = `Risk ${numScore}/10 · High`;
    badgeClass = 'risk-high';
  }

  return (
    <div className={`risk-score-badge ${badgeClass}`}>
      <span className="risk-dot"></span>
      <span className="risk-text">{label}</span>
    </div>
  );
};

export default RiskScoreBadge;
