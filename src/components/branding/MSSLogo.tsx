import React from 'react';

export type LogoMode = 'full' | 'compact' | 'collapsed' | 'login' | 'document-header' | 'badge-only';

interface MSSLogoProps {
  mode?: LogoMode;
  className?: string;
  light?: boolean; // For dark backgrounds like sidebar & login
  size?: number;
  onClick?: () => void;
}

export const MSSLogo: React.FC<MSSLogoProps> = ({
  mode = 'full',
  className = '',
  light = false,
  size,
  onClick,
}) => {
  // Official Mountain Security Services (MSS) Heraldic Shield Emblem
  const renderOfficialBadge = (badgeSize: number = 44) => (
    <svg
      width={badgeSize}
      height={badgeSize}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 drop-shadow-md select-none"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="shieldRedGrad" x1="250" y1="20" x2="250" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA1D24" />
          <stop offset="45%" stopColor="#C41318" />
          <stop offset="100%" stopColor="#960B0F" />
        </linearGradient>
        
        <linearGradient id="goldTrimGrad" x1="50" y1="50" x2="450" y2="450" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#F5B301" />
          <stop offset="100%" stopColor="#B37D00" />
        </linearGradient>

        <linearGradient id="navyLettersGrad" x1="100" y1="180" x2="400" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#082166" />
          <stop offset="100%" stopColor="#0E3CA8" />
        </linearGradient>

        <linearGradient id="redCenterSGrad" x1="200" y1="170" x2="300" y2="310" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF2A2A" />
          <stop offset="50%" stopColor="#E61017" />
          <stop offset="100%" stopColor="#AA080D" />
        </linearGradient>

        <linearGradient id="mountainBgGrad" x1="250" y1="130" x2="250" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9EEF7" />
          <stop offset="100%" stopColor="#CFD9EA" />
        </linearGradient>

        {/* Text curve path for MOUNTAIN at top */}
        <path id="mountainTopCurve" d="M 85 92 Q 250 56 415 92" />

        {/* Text curve path for SECURITY SERVICES at bottom */}
        <path id="securityServicesBottomCurve" d="M 68 308 Q 250 488 432 308" />
      </defs>

      {/* 1. Outer Gold Trim Rim */}
      <path
        d="M 46 40 
           Q 250 18 454 40 
           C 460 100, 466 276, 440 348 
           C 404 410, 312 458, 250 488 
           C 188 458, 96 410, 60 348 
           C 34 276, 40 100, 46 40 Z"
        fill="url(#goldTrimGrad)"
      />

      {/* 2. Outer Deep Crimson Red Shield Base */}
      <path
        d="M 52 46 
           Q 250 26 448 46 
           C 453 102, 458 272, 434 342 
           C 399 402, 310 448, 250 478 
           C 190 448, 101 402, 66 342 
           C 42 272, 47 102, 52 46 Z"
        fill="url(#shieldRedGrad)"
      />

      {/* 3. Top "MOUNTAIN" Curved Text */}
      <text
        fill="#FFFFFF"
        fontFamily="Arial Black, Impact, sans-serif"
        fontWeight="900"
        fontSize="46"
        letterSpacing="5"
        textAnchor="middle"
      >
        <textPath href="#mountainTopCurve" startOffset="50%">
          MOUNTAIN
        </textPath>
      </text>

      {/* 4. Top Stars Accents */}
      <g fill="url(#goldTrimGrad)">
        <polygon points="68,66 73,78 86,78 75,86 79,98 68,90 57,98 61,86 50,78 63,78" transform="scale(0.4) translate(100, 100)" />
        <polygon points="432,66 437,78 450,78 439,86 443,98 432,90 421,98 425,86 414,78 427,78" transform="scale(0.4) translate(920, 100)" />
      </g>

      {/* 5. Inner Shield (White with Silver/Mountain Background) */}
      <path
        d="M 88 104 
           Q 250 90 412 104 
           C 416 142, 420 256, 400 306 
           C 374 350, 305 388, 250 414 
           C 195 388, 126 350, 100 306 
           C 80 256, 84 142, 88 104 Z"
        fill="#FFFFFF"
        stroke="#0A2A7A"
        strokeWidth="7"
      />

      {/* 6. Mountain Silhouette in Background of Inner Shield */}
      <path
        d="M 94 280 L 175 185 L 215 225 L 265 160 L 335 245 L 406 280 C 374 340, 305 380, 250 410 C 195 380, 126 340, 94 280 Z"
        fill="url(#mountainBgGrad)"
        opacity="0.6"
      />
      {/* Mountain Snow Caps */}
      <polygon points="265,160 252,185 265,180 278,185" fill="#FFFFFF" opacity="0.9" />
      <polygon points="175,185 165,202 175,198 185,202" fill="#FFFFFF" opacity="0.9" />

      {/* 7. MSS Dynamic Lettering Emblem Inside White Shield */}
      <g transform="translate(15, -12)">
        {/* Letter 'M' (Left Deep Navy) */}
        <path
          d="M 90 280 L 115 178 L 165 178 L 180 228 L 202 178 L 250 178 L 230 280 L 195 280 L 208 215 L 182 278 L 154 278 L 140 215 L 126 280 Z"
          fill="url(#navyLettersGrad)"
          stroke="#FFFFFF"
          strokeWidth="3"
        />

        {/* Lower Blue Banner Ribbon Under MSS */}
        <path
          d="M 165 272 C 220 260, 290 255, 350 282 C 318 305, 238 315, 170 304 Z"
          fill="#0A2A7A"
          stroke="#F5B301"
          strokeWidth="2"
        />

        {/* Word "Security" on Ribbon */}
        <text
          x="252"
          y="296"
          fill="#FFFFFF"
          fontFamily="Brush Script MT, cursive, Arial, sans-serif"
          fontStyle="italic"
          fontWeight="bold"
          fontSize="23"
          textAnchor="middle"
        >
          Security
        </text>

        {/* Letter 'S' (Right Navy) */}
        <path
          d="M 330 178 L 385 178 C 394 195, 396 210, 386 222 C 375 230, 355 232, 345 237 C 335 242, 330 250, 335 260 C 340 270, 355 274, 375 272 L 370 288 C 340 293, 310 282, 305 262 C 300 242, 315 228, 330 220 C 345 212, 365 210, 360 198 C 358 192, 348 190, 335 192 Z"
          fill="url(#navyLettersGrad)"
          stroke="#FFFFFF"
          strokeWidth="3"
        />

        {/* Center 'S' (Red Overlapping with Bold White Outline Contour) */}
        <path
          d="M 230 170 L 290 170 C 310 190, 314 212, 298 226 C 285 238, 260 240, 248 248 C 235 255, 228 266, 235 278 C 242 290, 262 296, 288 294 L 282 312 C 248 316, 215 304, 208 278 C 200 254, 218 234, 236 224 C 255 214, 278 210, 272 196 C 268 188, 255 186, 238 188 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinejoin="round"
        />
        {/* Center Red 'S' Body */}
        <path
          d="M 230 170 L 290 170 C 310 190, 314 212, 298 226 C 285 238, 260 240, 248 248 C 235 255, 228 266, 235 278 C 242 290, 262 296, 288 294 L 282 312 C 248 316, 215 304, 208 278 C 200 254, 218 234, 236 224 C 255 214, 278 210, 272 196 C 268 188, 255 186, 238 188 Z"
          fill="url(#redCenterSGrad)"
        />
      </g>

      {/* 8. Bottom "SECURITY SERVICES" Curved Text */}
      <text
        fill="#FFFFFF"
        fontFamily="Arial Black, Impact, sans-serif"
        fontWeight="900"
        fontSize="35"
        letterSpacing="3.5"
        textAnchor="middle"
      >
        <textPath href="#securityServicesBottomCurve" startOffset="50%">
          SECURITY SERVICES
        </textPath>
      </text>
    </svg>
  );

  const badgeElement = renderOfficialBadge(size || (mode === 'collapsed' ? 38 : mode === 'login' ? 96 : mode === 'document-header' ? 56 : 44));

  if (mode === 'badge-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} onClick={onClick}>
        {badgeElement}
      </div>
    );
  }

  if (mode === 'collapsed') {
    return (
      <div
        className={`flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${className}`}
        title="Mountain Security Services (MSS)"
        onClick={onClick}
      >
        {badgeElement}
      </div>
    );
  }

  if (mode === 'compact') {
    return (
      <div
        className={`flex items-center gap-2.5 cursor-pointer ${className}`}
        onClick={onClick}
      >
        {badgeElement}
        <div className="flex flex-col">
          <span className={`font-black tracking-wider text-base leading-none font-['Space_Grotesk'] ${light ? 'text-white' : 'text-slate-900'}`}>
            MSS
          </span>
          <span className="text-[10px] tracking-widest uppercase font-bold text-red-500 leading-tight">
            Security Services
          </span>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative mb-4 p-3.5 bg-slate-950/80 rounded-3xl border-2 border-red-600/40 shadow-2xl backdrop-blur-md">
          {badgeElement}
          <div className="absolute -bottom-2.5 -right-2 px-2.5 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-[9px] tracking-widest uppercase rounded-full shadow-lg border border-amber-400">
            MSS OFFICIAL
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white font-['Space_Grotesk']">
          MOUNTAIN SECURITY SERVICES
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-300 font-bold mt-1 flex items-center gap-2">
          <span className="w-6 h-px bg-red-600"></span>
          Enterprise Security & ERP Platform
          <span className="w-6 h-px bg-red-600"></span>
        </p>
      </div>
    );
  }

  if (mode === 'document-header') {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-red-600 pb-4 min-w-0 max-w-full ${className}`}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="shrink-0">{badgeElement}</div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-950 font-['Space_Grotesk'] leading-tight truncate">
              MOUNTAIN SECURITY SERVICES
            </h2>
            <p className="text-[11px] sm:text-xs font-bold text-red-600 tracking-wider uppercase mt-0.5 truncate">
              Private Security & Guarding Company • License PPO-99482-SEC
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-600 mt-0.5 font-medium truncate">
              Head Office • 24/7 Dispatch: +92 300 1234567 • info@mountainsecurity.com
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="inline-block px-3 py-1 bg-slate-950 text-white font-bold text-xs tracking-wider rounded border border-red-600/40">
            OFFICIAL ERP RECORD
          </span>
          <p className="text-[10px] text-slate-500 font-mono mt-1">SECURE VERIFIED DOCUMENT</p>
        </div>
      </div>
    );
  }

  // Default: Full Mode
  return (
    <div className={`flex items-center gap-3 cursor-pointer ${className}`} onClick={onClick}>
      {badgeElement}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-base font-['Space_Grotesk'] leading-tight ${light ? 'text-white' : 'text-slate-900'}`}>
            MOUNTAIN SECURITY
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-black uppercase bg-red-600 text-white rounded tracking-wider shadow-sm border border-red-400">
            MSS
          </span>
        </div>
        <span className={`text-[11px] tracking-wider uppercase font-semibold leading-none mt-0.5 ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          Security Services ERP
        </span>
      </div>
    </div>
  );
};
