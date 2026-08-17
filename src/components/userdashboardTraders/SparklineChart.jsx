import React from 'react';

/**
 * SparklineChart renders an SVG mini line chart for performance metrics.
 * @param {Array<number>} data - Data points array (e.g. [10, 15, 12, 22, 28, 35, 42])
 * @param {boolean} isPositive - Whether the trend is positive (green) or negative (red)
 * @param {number} height - Height of SVG canvas
 */
const SparklineChart = ({ data = [12, 18, 14, 25, 30, 28, 45, 42, 58], isPositive = true, height = 44 }) => {
  const width = 180;
  
  if (!data || data.length < 2) {
    data = [10, 15, 20, 25, 30, 35, 40];
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  const color = isPositive ? '#10B981' : '#EF4444';
  const gradientId = `sparkline-grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="sparkline-wrapper" style={{ width: '100%', height: `${height}px`, overflow: 'hidden' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradientId})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default SparklineChart;
