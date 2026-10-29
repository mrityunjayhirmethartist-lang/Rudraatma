import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showSubtitle = true
}) => {
  const [imgError, setImgError] = useState(false);

  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    xs: { title: 'text-sm', sub: 'text-[8px]' },
    sm: { title: 'text-base', sub: 'text-[9px]' },
    md: { title: 'text-lg', sub: 'text-[10px]' },
    lg: { title: 'text-xl', sub: 'text-[11px]' },
    xl: { title: 'text-2xl', sub: 'text-[12px]' }
  };

  const currentText = textSizes[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Icon squircle emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl overflow-hidden bg-black/90 border border-amber-500/30 shadow-md group-hover:border-amber-400 transition-all flex items-center justify-center p-0.5`}>
        {!imgError ? (
          <img
            src="/logo.png"
            alt="Rudraatma Music Logo"
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High-fidelity Vector Fallback */
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="22" fill="#09090b" stroke="#eab308" strokeWidth="2" strokeOpacity="0.4" />
            {/* Equalizer bars left */}
            <rect x="14" y="44" width="3" height="12" rx="1.5" fill="#f59e0b" />
            <rect x="20" y="38" width="3.5" height="24" rx="1.75" fill="#f59e0b" />
            <rect x="27" y="32" width="3.5" height="36" rx="1.75" fill="#fbbf24" />
            {/* White R stem */}
            <path d="M36 28 H48 C58 28 64 34 64 42 C64 49 59 54 51 55 L65 72 H55 L43 57 H42 V72 H36 V28 Z" fill="#ffffff" />
            {/* Golden Music Note embedded */}
            <circle cx="48" cy="56" r="6" fill="#f59e0b" />
            <path d="M52 56 V36 C55 36 60 38 62 43" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            {/* Equalizer bars right */}
            <rect x="70" y="32" width="3.5" height="36" rx="1.75" fill="#fbbf24" />
            <rect x="77" y="38" width="3.5" height="24" rx="1.75" fill="#f59e0b" />
            <rect x="83" y="44" width="3" height="12" rx="1.5" fill="#f59e0b" />
          </svg>
        )}
      </div>

      {variant === 'full' && (
        <div className="flex flex-col select-none">
          <span className={`${currentText.title} font-bold tracking-tight text-white font-display leading-tight flex items-center gap-1`}>
            <span>Rudraatma</span>
          </span>
          {showSubtitle && (
            <span className={`${currentText.sub} font-semibold uppercase tracking-[0.2em] text-amber-400 font-mono -mt-0.5`}>
              Music Distribution
            </span>
          )}
        </div>
      )}
    </div>
  );
};
