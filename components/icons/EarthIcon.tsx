import React from 'react';

export const EarthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.542 12H20.458" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-2.485 0-4.782.93-6.542 2.5M12 21c2.485 0 4.782-.93 6.542-2.5M12 3c2.485 0 4.782.93 6.542 2.5M12 21c-2.485 0-4.782-.93-6.542-2.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.132A9.034 9.034 0 0 0 12 3c-1.795 0-3.47.523-4.868 1.424M8 20.868A9.034 9.034 0 0 0 12 21c1.795 0 3.47-.523 4.868-1.424" />
  </svg>
);