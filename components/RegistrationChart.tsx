
import React from 'react';
import type { RegistrationHistoryPoint } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface RegistrationChartProps {
  history: RegistrationHistoryPoint[];
}

export const RegistrationChart: React.FC<RegistrationChartProps> = ({ history }) => {
  const { t, locale } = useLanguage();

  if (!history || history.length === 0) {
    return <p className="text-gray-500 text-center py-10">{t('chart.noData')}</p>;
  }

  const sortedHistory = [...history].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('.').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const [dayB, monthB, yearB] = b.date.split('.').map(Number);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA.getTime() - dateB.getTime();
  });

  const padding = { top: 20, right: 20, bottom: 60, left: 70 }; 
  const chartWidth = 500; 
  const chartHeight = 300;

  const dataCounts = sortedHistory.map(p => p.count);
  const maxCount = Math.max(...dataCounts, 0);
  const minDataPoint = Math.min(...dataCounts);
  const minCount = Math.max(0, minDataPoint - (maxCount - minDataPoint) * 0.1);

  const numPoints = sortedHistory.length;
  
  const xScale = (index: number) => {
    if (numPoints <= 1) return padding.left;
    return padding.left + (index / (numPoints - 1)) * (chartWidth - padding.left - padding.right);
  };
  
  const yScale = (value: number) => {
    const dataRange = maxCount - minCount;
    if (dataRange === 0) return chartHeight - padding.bottom; 
    return chartHeight - padding.bottom - ((value - minCount) / dataRange) * (chartHeight - padding.top - padding.bottom);
  };
  
  const numYTicks = 5;
  const yTicks = Array.from({ length: numYTicks + 1 }, (_, i) => {
    const tickValue = minCount + (maxCount - minCount) * (i / numYTicks);
    return {
      value: Math.round(tickValue),
      y: yScale(tickValue)
    };
  });

  const xTicks = sortedHistory.reduce((acc, point, index) => {
    const yearLabel = point.date.substring(6);
    if (index === 0 || index === numPoints - 1 || (point.date.startsWith("01.01."))) {
       if (!acc.some(tick => tick.label === yearLabel && Math.abs(tick.x - xScale(index)) < 40 )) {
            acc.push({
                value: point.date,
                x: xScale(index),
                label: yearLabel 
            });
       }
    } else if (index % 4 === 0 && numPoints > 8) { 
        if (!acc.some(tick => tick.label === yearLabel && Math.abs(tick.x - xScale(index)) < 40 )) {
             acc.push({
                value: point.date,
                x: xScale(index),
                label: yearLabel
            });
        }
    }
    return acc;
  }, [] as { value: string; x: number; label: string }[]);

  const linePath = sortedHistory
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xScale(index)} ${yScale(point.count)}`)
    .join(' ');

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden" role="img" aria-label={t('chart.ariaLabel')}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet" className="max-w-full max-h-full">
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight - padding.bottom} stroke="#9ca3af" strokeWidth="1" />
        {yTicks.map(tick => (
          <g key={`ytick-${tick.value}`}>
            <line x1={padding.left - 5} y1={tick.y} x2={padding.left} y2={tick.y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={padding.left - 10} y={tick.y + 4} textAnchor="end" fontSize="10" fill="#6b7280">
              {tick.value.toLocaleString(locale)}
            </text>
          </g>
        ))}
        
        <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} stroke="#9ca3af" strokeWidth="1" />
        {xTicks.map(tick => (
          <g key={`xtick-${tick.value}`}>
            <text x={tick.x} y={chartHeight - padding.bottom + 20} textAnchor="middle" fontSize="10" fill="#6b7280">
              {tick.label}
            </text>
          </g>
        ))}

        {linePath && (
            <path d={linePath} fill="none" stroke="rgb(59 130 246 / 0.9)" strokeWidth="2" />
        )}

        {sortedHistory.map((point, index) => (
          <circle
            key={`point-${point.date}-${index}`}
            cx={xScale(index)}
            cy={yScale(point.count)}
            r="3.5"
            fill="rgb(59 130 246)"
            stroke="#fff"
            strokeWidth="1.5"
            className="transition-all duration-150 ease-in-out hover:r-5"
            aria-label={`${t('table.dateHeader')}: ${point.date}, ${t('table.countHeader')}: ${point.count.toLocaleString(locale)}`}
          >
            <title>{`${point.date}: ${point.count.toLocaleString(locale)}`}</title>
          </circle>
        ))}

        <text x={(chartWidth - padding.left - padding.right) / 2 + padding.left} y={chartHeight - padding.bottom / 2 + 10} textAnchor="middle" fontSize="12" fill="#374151" fontWeight="medium">{t('chart.xAxisLabel')}</text>
        <text transform={`translate(${padding.left / 2 - 10}, ${(chartHeight - padding.top - padding.bottom) / 2 + padding.top}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#374151" fontWeight="medium">{t('chart.yAxisLabel')}</text>
      </svg>
    </div>
  );
};
