/**
 * 3D-illustrated icon set — true volumetric shading, no outline-only icons.
 *
 * Each icon uses:
 *  - Multiple gradient stops for highlight/midtone/shadow
 *  - Inner highlight overlay (lit-from-above effect)
 *  - Drop shadow filter for depth
 *  - White accent strokes for extra dimension
 *
 * Icons scale cleanly from 24px → 96px+. Designed to render as full-color
 * illustrations on white or colored backgrounds.
 */

import { useId } from 'react';

interface Icon3DProps {
  size?: number;
  className?: string;
}

function dropShadow(id: string) {
  return (
    <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
      <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.15" />
    </filter>
  );
}

/* =============================== TROPHY =============================== */
export function Trophy3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        {dropShadow(`${id}-s`)}
        <linearGradient id={`${id}-cup`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#FACC15" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id={`${id}-cup-hi`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="50%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A16207" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="35%" cy="25%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={`url(#${id}-s)`}>
        {/* Base */}
        <rect x="22" y="50" width="20" height="6" rx="2" fill={`url(#${id}-base)`} />
        <rect x="18" y="54" width="28" height="5" rx="2" fill={`url(#${id}-base)`} />
        {/* Stem */}
        <rect x="29" y="42" width="6" height="10" fill={`url(#${id}-cup)`} />
        <rect x="29" y="42" width="2" height="10" fill="white" fillOpacity="0.4" />
        {/* Cup body */}
        <path d="M16 12 L48 12 L46 32 Q46 44 32 44 Q18 44 18 32 Z" fill={`url(#${id}-cup)`} />
        {/* Cup highlight */}
        <path d="M16 12 L48 12 L46 32 Q46 44 32 44 Q18 44 18 32 Z" fill={`url(#${id}-cup-hi)`} />
        {/* Lit highlight on left side */}
        <path d="M20 14 L20 32 Q20 40 26 42" stroke="white" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" fill="none" />
        {/* Handles */}
        <path d="M16 16 Q8 16 8 24 Q8 32 16 32" stroke={`url(#${id}-cup)`} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M48 16 Q56 16 56 24 Q56 32 48 32" stroke={`url(#${id}-cup)`} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Inner shine */}
        <ellipse cx="26" cy="20" rx="6" ry="3" fill={`url(#${id}-shine)`} />
        {/* Top rim */}
        <ellipse cx="32" cy="12" rx="16" ry="3" fill="#92400E" />
        <ellipse cx="32" cy="11" rx="16" ry="2.5" fill={`url(#${id}-cup)`} />
        <ellipse cx="32" cy="11" rx="14" ry="1.5" fill="#451A03" opacity="0.5" />
      </g>
    </svg>
  );
}

/* =============================== COIN =============================== */
export function Coin3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        {dropShadow(`${id}-s`)}
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <radialGradient id={`${id}-face`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="40%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#A16207" />
        </radialGradient>
        <radialGradient id={`${id}-shine`} cx="35%" cy="25%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={`url(#${id}-s)`}>
        {/* Edge (3D depth) */}
        <ellipse cx="32" cy="38" rx="24" ry="20" fill={`url(#${id}-edge)`} />
        {/* Coin face */}
        <ellipse cx="32" cy="32" rx="24" ry="20" fill={`url(#${id}-face)`} />
        {/* Inner ring */}
        <ellipse cx="32" cy="32" rx="20" ry="16.5" fill="none" stroke="#A16207" strokeWidth="0.7" strokeOpacity="0.4" />
        {/* IQD text-mark — stylized (the FAWZ-meaningful ف letter for the coin face) */}
        <text x="32" y="40" textAnchor="middle" fontSize="22" fontWeight="900" fill="#78350F" fontFamily="ui-sans-serif, system-ui">$</text>
        {/* Top shine */}
        <ellipse cx="26" cy="22" rx="9" ry="5" fill={`url(#${id}-shine)`} />
      </g>
    </svg>
  );
}

/* =============================== TICKET =============================== */
export function Ticket3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        {dropShadow(`${id}-s`)}
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}-s)`} transform="rotate(-8 32 32)">
        <path
          d="M8 18 L56 18 Q60 18 60 22 L60 26 Q56 26 56 32 Q56 38 60 38 L60 42 Q60 46 56 46 L8 46 Q4 46 4 42 L4 38 Q8 38 8 32 Q8 26 4 26 L4 22 Q4 18 8 18 Z"
          fill={`url(#${id}-body)`}
        />
        <path
          d="M8 18 L56 18 Q60 18 60 22 L60 26 Q56 26 56 32 L8 32 Q8 26 4 26 L4 22 Q4 18 8 18 Z"
          fill={`url(#${id}-shine)`}
        />
        {/* Dashed center line */}
        <line x1="22" y1="22" x2="22" y2="42" stroke="white" strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity="0.5" />
        {/* Star symbol */}
        <path d="M40 28 L42 34 L48 34 L43 38 L45 44 L40 40 L35 44 L37 38 L32 34 L38 34 Z" fill="#FBBF24" />
      </g>
    </svg>
  );
}

/* =============================== CLOVER =============================== */
export function Clover3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        {dropShadow(`${id}-s`)}
        <radialGradient id={`${id}-leaf`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </radialGradient>
        <radialGradient id={`${id}-shine`} cx="35%" cy="25%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={`url(#${id}-s)`}>
        {/* 4 heart-shaped leaves around center */}
        {[0, 90, 180, 270].map((rot) => (
          <g key={rot} transform={`rotate(${rot} 32 32)`}>
            <path
              d="M32 32 Q32 18 24 18 Q14 18 14 28 Q14 36 24 36 Q32 36 32 32"
              fill={`url(#${id}-leaf)`}
            />
            <path
              d="M22 22 Q19 22 18 26"
              stroke="white"
              strokeWidth="1.2"
              strokeOpacity="0.6"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}
        {/* Center shine */}
        <circle cx="32" cy="32" r="4" fill="#15803D" />
        <circle cx="32" cy="32" r="3" fill={`url(#${id}-shine)`} />
        {/* Stem */}
        <path d="M32 36 Q34 44 30 50" stroke="#15803D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* =============================== GIFT =============================== */
export function Gift3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        {dropShadow(`${id}-s`)}
        <linearGradient id={`${id}-box`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="50%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FECACA" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
        <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}-s)`}>
        {/* Box body */}
        <rect x="10" y="26" width="44" height="30" rx="3" fill={`url(#${id}-box)`} />
        <rect x="10" y="26" width="44" height="6" rx="3" fill="white" fillOpacity="0.15" />
        {/* Lid */}
        <rect x="6" y="20" width="52" height="10" rx="3" fill={`url(#${id}-lid)`} />
        <rect x="6" y="20" width="52" height="2" fill="white" fillOpacity="0.4" />
        {/* Vertical ribbon */}
        <rect x="29" y="20" width="6" height="36" fill={`url(#${id}-ribbon)`} />
        <rect x="29" y="20" width="2" height="36" fill="white" fillOpacity="0.4" />
        {/* Bow */}
        <path d="M32 14 Q22 8 22 18 Q22 24 32 22 Q42 24 42 18 Q42 8 32 14" fill={`url(#${id}-ribbon)`} />
        <circle cx="32" cy="20" r="2.5" fill="#92400E" />
      </g>
    </svg>
  );
}

/* =============================== CALENDAR =============================== */
export function Calendar3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        {dropShadow(`${id}-s`)}
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id={`${id}-rings`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}-s)`}>
        {/* Base body */}
        <rect x="8" y="14" width="48" height="44" rx="4" fill={`url(#${id}-body)`} />
        {/* Top header */}
        <rect x="8" y="14" width="48" height="14" rx="4" fill={`url(#${id}-top)`} />
        <rect x="8" y="22" width="48" height="6" fill={`url(#${id}-top)`} />
        {/* Highlight on header */}
        <rect x="8" y="14" width="48" height="3" rx="1.5" fill="white" fillOpacity="0.3" />
        {/* Rings */}
        <rect x="18" y="9" width="3" height="10" rx="1.5" fill={`url(#${id}-rings)`} />
        <rect x="43" y="9" width="3" height="10" rx="1.5" fill={`url(#${id}-rings)`} />
        {/* Date number */}
        <text x="32" y="50" textAnchor="middle" fontSize="20" fontWeight="900" fill="#7C3AED" fontFamily="ui-sans-serif, system-ui">31</text>
        {/* Subtle dot grid */}
        <circle cx="16" cy="36" r="1" fill="#CBD5E1" />
        <circle cx="22" cy="36" r="1" fill="#CBD5E1" />
        <circle cx="42" cy="36" r="1" fill="#CBD5E1" />
        <circle cx="48" cy="36" r="1" fill="#CBD5E1" />
      </g>
    </svg>
  );
}
