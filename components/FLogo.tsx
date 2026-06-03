import React from 'react';

interface FLogoProps {
  size?: number;
  className?: string;
}

const FLogo: React.FC<FLogoProps> = ({ size = 48, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="fGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Clean rounded square frame */}
        <rect 
          x="15" y="15" 
          width="70" height="70" 
          rx="12" 
          fill="none" 
          stroke="url(#fGrad)" 
          strokeWidth="2"
          opacity="0.3"
        />

        {/* Modern F design */}
        <g fill="url(#fGrad)" filter="url(#softGlow)">
          {/* Main vertical stroke */}
          <rect x="30" y="30" width="6" height="40" rx="3" />
          
          {/* Top horizontal stroke */}
          <rect x="30" y="30" width="25" height="6" rx="3" />
          
          {/* Middle horizontal stroke */}
          <rect x="30" y="47" width="20" height="6" rx="3" />
          
          {/* Modern accent dots */}
          <circle cx="58" cy="33" r="2" opacity="0.8" />
          <circle cx="53" cy="50" r="2" opacity="0.8" />
          <circle cx="42" cy="65" r="1.5" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};

export default FLogo;
