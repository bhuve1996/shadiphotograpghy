import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff2d6" />
          <stop offset="35%" stopColor="#e3c27e" />
          <stop offset="70%" stopColor="#c5a059" />
          <stop offset="100%" stopColor="#8d6b2c" />
        </linearGradient>
        <radialGradient id="logoBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1610" />
          <stop offset="100%" stopColor="#0a0b0e" />
        </radialGradient>
      </defs>

      {/* Exterior Crest */}
      <circle cx="50" cy="50" r="47" fill="url(#logoBg)" stroke="url(#logoGold)" strokeWidth="2" />
      <circle cx="50" cy="50" r="43" fill="none" stroke="url(#logoGold)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

      {/* Monogram H & B */}
      <g stroke="url(#logoGold)" strokeLinecap="round" strokeLinejoin="round">
        {/* H */}
        <line x1="28" y1="31" x2="28" y2="69" strokeWidth="3" />
        <line x1="42" y1="31" x2="42" y2="69" strokeWidth="3" />
        <line x1="28" y1="50" x2="42" y2="50" strokeWidth="2.5" />

        {/* Central Union Knot */}
        <circle cx="49" cy="50" r="5.5" strokeWidth="1.8" fill="#13110c" />

        {/* B */}
        <line x1="56" y1="31" x2="56" y2="69" strokeWidth="3" />
        <path d="M 56 31 H 66 C 73 31 73 49 65 49 H 56" strokeWidth="2.5" />
        <path d="M 56 49 H 67 C 75 49 75 69 66 69 H 56" strokeWidth="2.5" />
      </g>

      {/* Royal Crown Diamond */}
      <polygon points="50,15 52,20 57,22 52,24 50,29 48,24 43,22 48,20" fill="url(#logoGold)" />
    </svg>
  );
};
