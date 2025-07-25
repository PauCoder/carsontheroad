import React from 'react';

// New logo for carsontheroad.com
// Features a stylized wheel and three upward-trending data bars.
export const FramedCarGraphIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="45" cy="45" r="30" fill="none" stroke="currentColor" stroke-width="5"/>
  <line x1="68" y1="68" x2="90" y2="90" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>

  <g transform="scale(0.5) translate(40 55)">
    <path d="M 10 60 Q 10 50, 20 50 L 30 50 Q 35 40, 45 40 L 65 40 Q 75 40, 80 50 L 90 50 Q 90 60, 90 60 L 90 70 L 10 70 Z" fill="currentColor" />
    <circle cx="25" cy="70" r="8" fill="currentColor" />
    <circle cx="75" cy="70" r="8" fill="currentColor" />
  </g>

  <polyline points="30,50 40,40 50,45 60,35" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
</svg>
);
