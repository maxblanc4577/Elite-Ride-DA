import React from 'react';

export interface EliteRideLogoProps {
  variant?: 'horizontal' | 'full' | 'mark' | 'badge';
  theme?: 'dark' | 'light' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const EliteRideLogo: React.FC<EliteRideLogoProps> = ({
  variant = 'horizontal',
  theme = 'dark',
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  // Sizing definitions
  const sizeMap = {
    xs: { emblemH: 24, text: 'text-sm', subText: 'text-[9px]', gap: 'gap-2' },
    sm: { emblemH: 30, text: 'text-base', subText: 'text-[10px]', gap: 'gap-2.5' },
    md: { emblemH: 40, text: 'text-xl', subText: 'text-xs', gap: 'gap-3' },
    lg: { emblemH: 54, text: 'text-2xl', subText: 'text-sm', gap: 'gap-3.5' },
    xl: { emblemH: 72, text: 'text-3xl', subText: 'text-base', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size];

  // SVG Emblem Component with metallic wind streams and stylized 'E'
  const EmblemSVG = ({ h = currentSize.emblemH, isLight = false }: { h?: number; isLight?: boolean }) => {
    // Aspect ratio: width is ~ 1.83x height
    const w = Math.round(h * 1.83);
    const navyColor = isLight ? '#0a192f' : '#ffffff';

    return (
      <svg
        width={w}
        height={h}
        viewBox="0 0 550 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`er-emblem-navy-${isLight ? 'l' : 'd'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#132845' : '#38bdf8'} />
            <stop offset="60%" stopColor={isLight ? '#0a192f' : '#0284c7'} />
            <stop offset="100%" stopColor={isLight ? '#040d1a' : '#0369a1'} />
          </linearGradient>

          <linearGradient id={`er-stream-top-${isLight ? 'l' : 'd'}`} x1="0%" y1="0%" x2="100%" y2="25%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#cbd5e1" />
            <stop offset="55%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id={`er-stream-mid-${isLight ? 'l' : 'd'}`} x1="0%" y1="0%" x2="100%" y2="15%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.7" />
            <stop offset="20%" stopColor="#94a3b8" />
            <stop offset="45%" stopColor="#ffffff" />
            <stop offset="80%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id={`er-stream-main-${isLight ? 'l' : 'd'}`} x1="0%" y1="0%" x2="100%" y2="5%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.7" />
            <stop offset="18%" stopColor="#cbd5e1" />
            <stop offset="40%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#94a3b8" />
            <stop offset="88%" stopColor="#334155" />
            <stop offset="100%" stopColor={isLight ? '#0a192f' : '#0ea5e9'} />
          </linearGradient>

          <linearGradient id={`er-stream-bot-${isLight ? 'l' : 'd'}`} x1="0%" y1="0%" x2="100%" y2="10%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.5" />
            <stop offset="30%" stopColor="#cbd5e1" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="85%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        <g transform="translate(10, 10)">
          {/* Base Navy 'E' Structure */}
          {/* Top Horizontal Bar */}
          <path
            d="M 275 22 L 465 22 C 450 38, 418 52, 365 66 L 255 66 Z"
            fill={isLight ? 'url(#er-emblem-navy-l)' : '#ffffff'}
          />

          {/* Slanted Spine */}
          <path
            d="M 268 66 L 315 66 L 225 258 L 180 258 Z"
            fill={isLight ? 'url(#er-emblem-navy-l)' : '#f8fafc'}
          />

          {/* Middle Crossbar */}
          <path
            d="M 245 162 L 380 162 L 368 192 L 230 192 Z"
            fill={isLight ? 'url(#er-emblem-navy-l)' : '#ffffff'}
          />

          {/* Lower Base Bar */}
          <path
            d="M 225 218 L 425 218 L 405 258 L 180 258 Z"
            fill={isLight ? 'url(#er-emblem-navy-l)' : '#ffffff'}
          />

          {/* Dynamic Aerodynamic Metallic Speed Streams */}
          {/* Stream 1 */}
          <path
            d="M 85 88 C 135 56, 195 38, 272 32 C 342 26, 408 22, 465 22 C 412 34, 350 44, 280 52 C 210 60, 142 76, 85 88 Z"
            fill={`url(#er-stream-top-${isLight ? 'l' : 'd'})`}
          />

          {/* Stream 2 */}
          <path
            d="M 60 120 C 112 84, 182 64, 270 57 C 345 51, 412 55, 452 66 C 392 75, 320 80, 245 87 C 168 94, 108 110, 60 120 Z"
            fill={`url(#er-stream-mid-${isLight ? 'l' : 'd'})`}
          />

          {/* Stream 3: Coupe hood / wingtip */}
          <path
            d="M 40 155 C 96 126, 172 104, 265 93 C 362 82, 448 93, 505 120 C 535 132, 550 137, 555 139 C 532 141, 482 144, 422 139 C 346 133, 260 137, 178 158 C 122 172, 76 182, 40 155 Z"
            fill={`url(#er-stream-main-${isLight ? 'l' : 'd'})`}
          />

          {/* Stream 4 */}
          <path
            d="M 90 180 C 146 154, 218 142, 305 138 C 386 134, 462 140, 500 142 C 456 154, 390 161, 314 164 C 238 167, 162 180, 90 180 Z"
            fill={`url(#er-stream-bot-${isLight ? 'l' : 'd'})`}
          />

          {/* Stream 5 */}
          <path
            d="M 125 208 C 182 188, 254 178, 330 176 C 396 174, 452 179, 478 182 C 432 194, 368 200, 298 200 C 226 200, 172 210, 125 208 Z"
            fill={`url(#er-stream-mid-${isLight ? 'l' : 'd'})`}
          />
        </g>
      </svg>
    );
  };

  // MARK ONLY VARIANT
  if (variant === 'mark') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center cursor-pointer select-none ${className}`}
        title="Elite Ride Dominica"
      >
        <EmblemSVG isLight={theme === 'light'} />
      </div>
    );
  }

  // BADGE VARIANT (Displays the logo in its original luxury white-card presentation as in IMG_6570.jpeg)
  if (variant === 'badge' || theme === 'badge') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex flex-col items-center bg-gradient-to-b from-white via-slate-50 to-slate-100/90 text-slate-900 border border-slate-200/80 rounded-2xl p-5 shadow-xl text-center select-none ${
          onClick ? 'cursor-pointer hover:shadow-2xl transition-all' : ''
        } ${className}`}
      >
        <EmblemSVG h={Math.max(currentSize.emblemH, 50)} isLight={true} />
        <div className="mt-3 font-black tracking-[0.2em] text-[#0a192f] text-2xl uppercase">
          ELITE RIDE
        </div>
        <p className="mt-1 text-xs sm:text-sm font-serif italic text-blue-600 tracking-wide max-w-xs">
          Dominica&apos;s premier ride-sharing platform with real-time tracking
        </p>
      </div>
    );
  }

  // FULL VERTICAL VARIANT (Emblem on top, ELITE RIDE below, tagline underneath)
  if (variant === 'full') {
    const isLight = theme === 'light';
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center text-center select-none ${
          onClick ? 'cursor-pointer group' : ''
        } ${className}`}
      >
        <EmblemSVG h={Math.max(currentSize.emblemH, 48)} isLight={isLight} />
        <div
          className={`mt-2 font-black tracking-[0.22em] uppercase ${
            isLight ? 'text-[#0a192f]' : 'text-white'
          } ${currentSize.text}`}
        >
          ELITE RIDE
        </div>
        {(showTagline || true) && (
          <p
            className={`mt-1 font-serif italic tracking-wide text-center text-blue-500 ${
              isLight ? 'text-blue-600' : 'text-sky-400'
            } ${currentSize.subText}`}
          >
            Dominica&apos;s premier ride-sharing platform with real-time tracking
          </p>
        )}
      </div>
    );
  }

  // HORIZONTAL VARIANT (Default: Emblem on left, typography on right)
  const isLight = theme === 'light';
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${currentSize.gap} select-none group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <EmblemSVG isLight={isLight} />
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-[0.18em] uppercase ${
              isLight ? 'text-[#0a192f]' : 'text-white'
            } ${currentSize.text}`}
          >
            ELITE RIDE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
        </div>
        <span
          className={`font-sans tracking-wider uppercase text-[10px] font-bold ${
            isLight ? 'text-slate-500' : 'text-emerald-400'
          }`}
        >
          Dominica Transit
        </span>
        {showTagline && (
          <span
            className={`font-serif italic text-[10px] mt-0.5 ${
              isLight ? 'text-blue-600' : 'text-sky-400'
            }`}
          >
            Dominica&apos;s premier ride-sharing platform
          </span>
        )}
      </div>
    </div>
  );
};
