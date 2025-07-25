
import React from 'react';
import type { RegistrationHistoryPoint } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface RegistrationTableProps {
  history: RegistrationHistoryPoint[];
}

export const RegistrationTable: React.FC<RegistrationTableProps> = ({ history }) => {
  const { t, locale } = useLanguage();

  if (!history || history.length === 0) {
    return <p className="text-gray-500 text-center py-5">{t('table.noData')}</p>;
  }

  // Sort history chronologically (oldest first)
  const sortedHistory = [...history].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('.').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA); // Month is 0-indexed
    const [dayB, monthB, yearB] = b.date.split('.').map(Number);
    const dateB = new Date(yearB, monthB - 1, dayB); // Month is 0-indexed
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t('table.dateHeader')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t('table.countHeader')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedHistory.map((point) => (
            <tr key={point.date}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{point.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {point.count.toLocaleString(locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
