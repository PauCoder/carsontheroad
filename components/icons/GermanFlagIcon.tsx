export const GermanFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" {...props} aria-hidden="true">
    <rect width="5" height="3" y="0" fill="#000000"/> {/* Black */}
    <rect width="5" height="2" y="1" fill="#DD0000"/> {/* Red - KBA red D00 also works */}
    <rect width="5" height="1" y="2" fill="#FFCC00"/> {/* Gold - KBA gold FFCE00 also works */}
  </svg>
);