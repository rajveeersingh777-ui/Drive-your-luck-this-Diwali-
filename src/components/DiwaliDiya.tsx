import React from 'react';

interface DiwaliDiyaProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const DiwaliDiya: React.FC<DiwaliDiyaProps> = ({
  className = '',
  size = 40,
  glow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Diwali Diya Official Campaign Logo"
    >
      {/* Dynamic festive radial aura */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/25 to-yellow-400/30 blur-md pointer-events-none animate-pulse"
          style={{ transform: 'scale(1.3)' }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full relative z-10 drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flame Gradient */}
          <radialGradient id="diyaFlameCore" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#FFF3B0" />
            <stop offset="55%" stopColor="#FFB703" />
            <stop offset="85%" stopColor="#FB8500" />
            <stop offset="100%" stopColor="#D90429" />
          </radialGradient>

          {/* Diya Bowl Outer Metallic Gradient */}
          <linearGradient id="diyaGoldBowl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF0B3" />
            <stop offset="25%" stopColor="#FFD166" />
            <stop offset="60%" stopColor="#F48C06" />
            <stop offset="85%" stopColor="#9D0208" />
            <stop offset="100%" stopColor="#370617" />
          </linearGradient>

          {/* Diya Oil/Ghee Gradient */}
          <linearGradient id="diyaGhee" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E85D04" />
            <stop offset="50%" stopColor="#FFBA08" />
            <stop offset="100%" stopColor="#E85D04" />
          </linearGradient>

          {/* Diya Base Pedestal Gradient */}
          <linearGradient id="diyaBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD166" />
            <stop offset="50%" stopColor="#D00000" />
            <stop offset="100%" stopColor="#220901" />
          </linearGradient>

          {/* Halo Glow Filter */}
          <filter id="diyaGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Radiant Rays / Aura */}
        <g opacity="0.6" stroke="#FFD166" strokeWidth="1.2" strokeLinecap="round">
          <line x1="50" y1="8" x2="50" y2="14" />
          <line x1="33" y1="13" x2="37" y2="18" />
          <line x1="67" y1="13" x2="63" y2="18" />
          <line x1="20" y1="25" x2="26" y2="28" />
          <line x1="80" y1="25" x2="74" y2="28" />
        </g>

        {/* Flame Halo */}
        <circle cx="50" cy="30" r="14" fill="#FFB703" opacity="0.25" filter="url(#diyaGlowFilter)" />

        {/* Outer Flame (Teardrop contour) */}
        <path
          d="M50 12 C55 24, 63 32, 60 41 C57 50, 43 50, 40 41 C37 32, 45 24, 50 12 Z"
          fill="url(#diyaFlameCore)"
          className="animate-pulse"
          style={{ transformOrigin: '50% 40%' }}
        />

        {/* Inner Flame Glow Core */}
        <path
          d="M50 20 C53 28, 57 34, 55 39 C53 43, 47 43, 45 39 C43 34, 47 28, 50 20 Z"
          fill="#FFF9DB"
          opacity="0.9"
        />

        {/* Wick (Batti) */}
        <path
          d="M48.5 44 C49 41, 51 40, 51.5 37"
          stroke="#3A0D04"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Diya Base Pedestal */}
        <ellipse cx="50" cy="84" rx="22" ry="5.5" fill="url(#diyaBaseGrad)" />
        <path
          d="M32 82 C34 78, 42 75, 50 75 C58 75, 66 78, 68 82 Z"
          fill="#FFB703"
          opacity="0.5"
        />

        {/* Diya Clay/Brass Main Bowl */}
        <path
          d="M12 52 C14 74, 32 82, 50 82 C68 82, 86 74, 88 52 C88 50, 84 50, 78 52 C68 55, 32 55, 22 52 C16 50, 12 50, 12 52 Z"
          fill="url(#diyaGoldBowl)"
          stroke="#FFE699"
          strokeWidth="1.5"
        />

        {/* Diya Oil Well (Surface Ghee Layer) */}
        <ellipse cx="50" cy="52.5" rx="36" ry="6.5" fill="url(#diyaGhee)" opacity="0.95" />
        <ellipse cx="50" cy="52.5" rx="30" ry="3.5" fill="#FFEAA7" opacity="0.6" />

        {/* Traditional Ornamental Engravings on Bowl Rim */}
        <g fill="#FFE699" opacity="0.9">
          <circle cx="28" cy="62" r="1.6" />
          <circle cx="36" cy="66" r="1.8" />
          <circle cx="45" cy="68" r="2.0" />
          <circle cx="50" cy="68.5" r="2.2" />
          <circle cx="55" cy="68" r="2.0" />
          <circle cx="64" cy="66" r="1.8" />
          <circle cx="72" cy="62" r="1.6" />
        </g>

        {/* Golden Highlights Along Rim Curve */}
        <path
          d="M18 55 C26 70, 40 76, 50 76 C60 76, 74 70, 82 55"
          stroke="#FFF275"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
};
