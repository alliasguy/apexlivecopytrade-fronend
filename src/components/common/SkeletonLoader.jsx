import React from 'react';
import './skeletonloader.css';

export const TraderCardSkeleton = () => {
  return (
    <div className="skeleton-trader-card">
      <div className="skeleton-header">
        <div className="skeleton-avatar skeleton-shimmer"></div>
        <div className="skeleton-info">
          <div className="skeleton-line skeleton-title skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-subtitle skeleton-shimmer"></div>
        </div>
      </div>
      <div className="skeleton-sparkline skeleton-shimmer"></div>
      <div className="skeleton-stats-grid">
        <div className="skeleton-stat-item">
          <div className="skeleton-line skeleton-stat-label skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-stat-value skeleton-shimmer"></div>
        </div>
        <div className="skeleton-stat-item">
          <div className="skeleton-line skeleton-stat-label skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-stat-value skeleton-shimmer"></div>
        </div>
        <div className="skeleton-stat-item">
          <div className="skeleton-line skeleton-stat-label skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-stat-value skeleton-shimmer"></div>
        </div>
      </div>
      <div className="skeleton-actions">
        <div className="skeleton-button skeleton-shimmer"></div>
        <div className="skeleton-button skeleton-shimmer"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <tr className="skeleton-table-row">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-line skeleton-table-cell skeleton-shimmer"></div>
        </td>
      ))}
    </tr>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="skeleton-stat-card">
      <div className="skeleton-line skeleton-subtitle skeleton-shimmer"></div>
      <div className="skeleton-line skeleton-title skeleton-shimmer"></div>
    </div>
  );
};

export default { TraderCardSkeleton, TableRowSkeleton, StatCardSkeleton };
