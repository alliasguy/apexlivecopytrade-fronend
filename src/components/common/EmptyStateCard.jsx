import React from 'react';
import { FiInbox, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './emptystatecard.css';

/**
 * EmptyStateCard renders a clean, accessible empty state card.
 * @param {string} title - Main header title
 * @param {string} description - Explanatory text
 * @param {string} actionText - Optional button CTA text
 * @param {string} actionLink - Optional router link destination
 * @param {Function} onActionClick - Optional button click callback
 */
const EmptyStateCard = ({
  title = 'No Trades Found',
  description = 'Your trader has not placed any trades yet. Active copied positions will appear here once executed.',
  actionText = 'Explore Traders',
  actionLink = '/traders',
  onActionClick,
  icon: Icon = FiInbox,
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon-wrapper">
        <Icon className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="empty-state-cta">
            <FiTrendingUp className="btn-icon" />
            {actionText}
          </Link>
        ) : (
          <button onClick={onActionClick} className="empty-state-cta">
            <FiTrendingUp className="btn-icon" />
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyStateCard;
