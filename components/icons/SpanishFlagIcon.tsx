import React from 'react';

export const SpanishFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 4" {...props} aria-hidden="true">
    <rect width="6" height="4" fill="#C60B1E"/>
    <rect width="6" height="2" y="1" fill="#FFC400"/>
    {/* Simplified coat of arms placeholder */}
    <rect width="0.8" height="1.2" x="1.8" y="1.4" fill="#AD1519" opacity="0.7"/> 
    <rect width="0.4" height="0.6" x="2.0" y="1.7" fill="#FABD00" opacity="0.7"/>
  </svg>
);