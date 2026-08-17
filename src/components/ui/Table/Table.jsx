import React from 'react';
import './table.css';

/**
 * Shared table shell - replaces the four separate hand-rolled <table>
 * implementations found in Userdashboardtransactions, WithdrawalLogs,
 * components/deposit/Deposit and Userdashboardreferrals (see AUDIT.md §4).
 *
 * columns: [{ key, header, render?(row), align? }]
 * rows: array of data objects
 */
export default function Table({ columns, rows, loading = false, emptyState, getRowKey }) {
  return (
    <div className="ui-table__scroll">
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`ui-table__th ui-table__th--${col.align || 'left'}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="ui-table__row">
                {columns.map((col) => (
                  <td key={col.key} className="ui-table__td">
                    <span className="ui-table__skeleton" />
                  </td>
                ))}
              </tr>
            ))}

          {!loading && rows.length === 0 && (
            <tr>
              <td className="ui-table__empty" colSpan={columns.length}>
                {emptyState || 'No records yet.'}
              </td>
            </tr>
          )}

          {!loading &&
            rows.map((row, i) => (
              <tr key={getRowKey ? getRowKey(row, i) : i} className="ui-table__row">
                {columns.map((col) => (
                  <td key={col.key} className={`ui-table__td ui-table__td--${col.align || 'left'}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
