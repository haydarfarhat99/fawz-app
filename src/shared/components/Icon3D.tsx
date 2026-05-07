/**
 * 3D-illustrated icon set — true volumetric shading via internal gradients.
 *
 * Each icon uses:
 *  - Multiple gradient stops for highlight/midtone/shadow
 *  - Inner highlight overlay (lit-from-above effect)
 *  - White accent strokes for extra dimension
 *
 * No SVG drop-shadow filter — icons composite cleanly onto any background
 * without a "pasted image" rectangle. Add CSS drop-shadow at the call site
 * if depth is needed against the surrounding card.
 *
 * Icons scale cleanly from 16px → 200px+.
 */

import { useId } from 'react';

interface Icon3DProps {
  size?: number;
  className?: string;
}

/* =============================== TROPHY =============================== */
export function Trophy3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
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
        <linearGradient id={`${id}-stem`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="35%" cy="25%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Base — narrower elliptical pad */}
      <ellipse cx="32" cy="56" rx="11" ry="2" fill="#A16207" />
      <ellipse cx="32" cy="55.4" rx="11" ry="1.5" fill={`url(#${id}-stem)`} />
      {/* Stem */}
      <rect x="29" y="42" width="6" height="12" rx="1" fill={`url(#${id}-stem)`} />
      <rect x="29.5" y="42" width="1.4" height="12" fill="white" fillOpacity="0.45" />
      {/* Cup body */}
      <path d="M16 12 L48 12 L46 32 Q46 44 32 44 Q18 44 18 32 Z" fill={`url(#${id}-cup)`} />
      <path d="M16 12 L48 12 L46 32 Q46 44 32 44 Q18 44 18 32 Z" fill={`url(#${id}-cup-hi)`} />
      {/* Lit highlight on left side */}
      <path d="M21 14 L21 32 Q21 40 26 42" stroke="white" strokeWidth="2" strokeOpacity="0.55" strokeLinecap="round" fill="none" />
      {/* Handles */}
      <path d="M16 16 Q8 16 8 24 Q8 32 16 32" stroke={`url(#${id}-cup)`} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M48 16 Q56 16 56 24 Q56 32 48 32" stroke={`url(#${id}-cup)`} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Inner shine */}
      <ellipse cx="26" cy="20" rx="6" ry="3" fill={`url(#${id}-shine)`} />
      {/* Top rim */}
      <ellipse cx="32" cy="12" rx="16" ry="3" fill="#92400E" />
      <ellipse cx="32" cy="11" rx="16" ry="2.5" fill={`url(#${id}-cup)`} />
      <ellipse cx="32" cy="11" rx="14" ry="1.5" fill="#451A03" opacity="0.4" />
    </svg>
  );
}

/* =============================== COIN =============================== */
export function Coin3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
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
      <ellipse cx="32" cy="36" rx="22" ry="18" fill={`url(#${id}-edge)`} />
      <ellipse cx="32" cy="32" rx="22" ry="18" fill={`url(#${id}-face)`} />
      <ellipse cx="32" cy="32" rx="18" ry="14.5" fill="none" stroke="#A16207" strokeWidth="0.6" strokeOpacity="0.4" />
      <text x="32" y="40" textAnchor="middle" fontSize="22" fontWeight="900" fill="#78350F" fontFamily="ui-sans-serif, system-ui">$</text>
      <ellipse cx="26" cy="22" rx="9" ry="5" fill={`url(#${id}-shine)`} />
    </svg>
  );
}

/* =============================== TICKET =============================== */
interface TonedIconProps extends Icon3DProps {
  tone?: 'default' | 'teal' | 'gold';
}

/**
 * Ticket3D — image-based 3D render. The `tone` prop is kept for API
 * compatibility but ignored since the image carries its own color treatment.
 */
export function Ticket3D({ size = 64, className }: TonedIconProps) {
  return (
    <img
      src="/brand/ticket-3d.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: 'drop-shadow(0 6px 12px rgba(15,23,42,0.18))',
        userSelect: 'none',
      }}
      draggable={false}
    />
  );
}

/* =============================== CLOVER =============================== */
export function Clover3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
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
      {[0, 90, 180, 270].map((rot) => (
        <g key={rot} transform={`rotate(${rot} 32 32)`}>
          <path d="M32 32 Q32 18 24 18 Q14 18 14 28 Q14 36 24 36 Q32 36 32 32" fill={`url(#${id}-leaf)`} />
          <path d="M22 22 Q19 22 18 26" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="32" cy="32" r="4" fill="#15803D" />
      <circle cx="32" cy="32" r="3" fill={`url(#${id}-shine)`} />
      <path d="M32 36 Q34 44 30 50" stroke="#15803D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* =============================== GIFT =============================== */
/**
 * Gift3D — image-based 3D render. The `tone` prop is kept for API
 * compatibility but ignored since the image carries its own color treatment.
 */
export function Gift3D({ size = 64, className }: TonedIconProps) {
  return (
    <img
      src="/brand/gift-3d.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: 'drop-shadow(0 6px 12px rgba(15,23,42,0.18))',
        userSelect: 'none',
      }}
      draggable={false}
    />
  );
}

/* =============================== CALENDAR =============================== */
/**
 * Calendar3D — image-based 3D render. Drop-in replacement for the previous
 * SVG version. The `tone` prop is kept for API compatibility but ignored
 * since the image carries its own color treatment.
 */
export function Calendar3D({ size = 64, className }: TonedIconProps) {
  return (
    <img
      src="/brand/calendar-3d.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: 'drop-shadow(0 6px 12px rgba(15,23,42,0.18))',
        userSelect: 'none',
      }}
      draggable={false}
    />
  );
}

/* =============================== TRENDING UP =============================== */
export function TrendingUp3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bar1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <linearGradient id={`${id}-bar2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <linearGradient id={`${id}-bar3`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id={`${id}-arrow`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>
      {/* Bar chart bars */}
      <rect x="10" y="38" width="10" height="18" rx="1.5" fill={`url(#${id}-bar1)`} />
      <rect x="10" y="38" width="3" height="18" fill="white" fillOpacity="0.35" />
      <rect x="22" y="30" width="10" height="26" rx="1.5" fill={`url(#${id}-bar2)`} />
      <rect x="22" y="30" width="3" height="26" fill="white" fillOpacity="0.35" />
      <rect x="34" y="20" width="10" height="36" rx="1.5" fill={`url(#${id}-bar3)`} />
      <rect x="34" y="20" width="3" height="36" fill="white" fillOpacity="0.35" />
      {/* Trend arrow line */}
      <path d="M14 36 L26 28 L38 18 L52 8" stroke={`url(#${id}-arrow)`} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arrow head */}
      <path d="M52 8 L46 8 M52 8 L52 14" stroke={`url(#${id}-arrow)`} strokeWidth="2.5" strokeLinecap="round" />
      {/* Floor */}
      <rect x="6" y="56" width="48" height="2" rx="1" fill="#94A3B8" opacity="0.3" />
    </svg>
  );
}

/* =============================== STAR =============================== */
export function Star3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-star`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.85" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M32 6 L39 24 L58 26 L43 38 L48 56 L32 46 L16 56 L21 38 L6 26 L25 24 Z"
        fill={`url(#${id}-star)`}
        stroke="#92400E"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      {/* Inner highlight on upper-left point */}
      <path d="M32 6 L39 24 L32 22 Z" fill="white" fillOpacity="0.45" />
      {/* Big top shine */}
      <ellipse cx="26" cy="22" rx="6" ry="4" fill={`url(#${id}-shine)`} />
    </svg>
  );
}

/* =============================== FLAME =============================== */
export function Flame3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-outer`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="35%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id={`${id}-core`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Outer flame */}
      <path
        d="M32 6 Q24 16 22 24 Q14 28 14 38 Q14 52 32 56 Q50 52 50 38 Q50 26 40 22 Q36 16 32 6 Z"
        fill={`url(#${id}-outer)`}
      />
      {/* Inner flame */}
      <path
        d="M32 16 Q26 22 24 30 Q22 38 24 44 Q28 52 32 52 Q38 50 40 44 Q42 36 38 28 Q35 22 32 16 Z"
        fill={`url(#${id}-inner)`}
      />
      {/* Core glow */}
      <ellipse cx="32" cy="40" rx="6" ry="10" fill={`url(#${id}-core)`} />
    </svg>
  );
}

/* =============================== HASH =============================== */
export function Hash3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Two horizontal bars */}
      <rect x="8" y="22" width="48" height="6" rx="2" fill={`url(#${id}-bar)`} transform="rotate(-8 32 25)" />
      <rect x="8" y="22" width="48" height="2" rx="1" fill={`url(#${id}-shine)`} transform="rotate(-8 32 23)" />
      <rect x="8" y="38" width="48" height="6" rx="2" fill={`url(#${id}-bar)`} transform="rotate(-8 32 41)" />
      <rect x="8" y="38" width="48" height="2" rx="1" fill={`url(#${id}-shine)`} transform="rotate(-8 32 39)" />
      {/* Two vertical bars */}
      <rect x="22" y="8" width="6" height="48" rx="2" fill={`url(#${id}-bar)`} transform="rotate(-8 25 32)" />
      <rect x="22" y="8" width="2" height="48" rx="1" fill={`url(#${id}-shine)`} transform="rotate(-8 23 32)" />
      <rect x="36" y="8" width="6" height="48" rx="2" fill={`url(#${id}-bar)`} transform="rotate(-8 39 32)" />
      <rect x="36" y="8" width="2" height="48" rx="1" fill={`url(#${id}-shine)`} transform="rotate(-8 37 32)" />
    </svg>
  );
}

/* =============================== KEY (LOGIN) =============================== */
export function Key3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-key`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="35%" cy="35%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.85" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Key head (round) */}
      <circle cx="22" cy="32" r="14" fill={`url(#${id}-key`} />
      <circle cx="22" cy="32" r="14" fill="none" stroke="#92400E" strokeWidth="0.7" strokeOpacity="0.4" />
      <circle cx="22" cy="32" r="6" fill="#7C2D12" />
      <circle cx="22" cy="32" r="5" fill="#92400E" />
      <circle cx="18" cy="28" rx="3" ry="2" fill={`url(#${id}-shine)`} />
      {/* Key shaft */}
      <rect x="36" y="29" width="22" height="6" rx="1" fill={`url(#${id}-key)`} />
      <rect x="36" y="29" width="22" height="1.5" rx="0.5" fill="white" fillOpacity="0.5" />
      {/* Key teeth */}
      <rect x="46" y="35" width="3" height="6" rx="0.5" fill={`url(#${id}-key)`} />
      <rect x="52" y="35" width="3" height="4" rx="0.5" fill={`url(#${id}-key)`} />
    </svg>
  );
}

/* =============================== SHIELD =============================== */
export function Shield3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-shield`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M32 6 L52 12 L52 32 Q52 48 32 58 Q12 48 12 32 L12 12 Z"
        fill={`url(#${id}-shield)`}
      />
      <path
        d="M32 6 L52 12 L52 32 Q52 48 32 58 Q12 48 12 32 L12 12 Z"
        fill={`url(#${id}-shine)`}
      />
      {/* Star inside shield */}
      <path
        d="M32 22 L35 30 L43 30 L37 35 L39 43 L32 38 L25 43 L27 35 L21 30 L29 30 Z"
        fill="#FBBF24"
      />
    </svg>
  );
}

/* =============================== BELL =============================== */
export function Bell3D({ size = 64, className }: Icon3DProps) {
  return (
    <img
      src="/brand/bell-3d.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: 'drop-shadow(0 4px 10px rgba(15,23,42,0.18))',
        userSelect: 'none',
      }}
      draggable={false}
    />
  );
}

/* =============================== GLOBE / LANGUAGE =============================== */
export function Globe3D({ size = 64, className }: Icon3DProps) {
  return (
    <img
      src="/brand/language-3d.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: 'drop-shadow(0 4px 10px rgba(15,23,42,0.18))',
        userSelect: 'none',
      }}
      draggable={false}
    />
  );
}

/* =============================== BEAKER / FLASK =============================== */
export function Beaker3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.85" />
          <stop offset="60%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE7A3" />
          <stop offset="50%" stopColor="#FFC94D" />
          <stop offset="100%" stopColor="#F2B324" />
        </linearGradient>
        <radialGradient id={`${id}-bubble`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      {/* Neck */}
      <rect x="26" y="10" width="12" height="14" rx="2" fill={`url(#${id}-glass)`} stroke="#00766A" strokeOpacity="0.45" strokeWidth="1.5" />
      {/* Body — flask outline */}
      <path
        d="M22 24 L42 24 L52 50 Q53 56 47 56 L17 56 Q11 56 12 50 Z"
        fill={`url(#${id}-glass)`}
        stroke="#00766A"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Liquid */}
      <path
        d="M16 38 L48 38 L52 50 Q53 56 47 56 L17 56 Q11 56 12 50 Z"
        fill={`url(#${id}-liquid)`}
      />
      {/* Bubbles */}
      <circle cx="24" cy="46" r="2.5" fill={`url(#${id}-bubble)`} />
      <circle cx="36" cy="42" r="1.6" fill={`url(#${id}-bubble)`} />
      <circle cx="40" cy="50" r="2" fill={`url(#${id}-bubble)`} />
      {/* Top opening */}
      <ellipse cx="32" cy="10" rx="6" ry="2" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

/* =============================== USER / PROFILE =============================== */
export function User3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-bg`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#5EE5C2" />
          <stop offset="55%" stopColor="#00C6A7" />
          <stop offset="100%" stopColor="#00312E" />
        </radialGradient>
        <linearGradient id={`${id}-head`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE7A3" />
          <stop offset="100%" stopColor="#F2B324" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE7A3" />
          <stop offset="100%" stopColor="#C8901A" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill={`url(#${id}-bg)`} />
      <circle cx="32" cy="32" r="28" fill="white" fillOpacity="0.06" />
      {/* Head */}
      <circle cx="32" cy="26" r="9" fill={`url(#${id}-head)`} />
      <circle cx="29" cy="23" r="3" fill="white" fillOpacity="0.4" />
      {/* Shoulders */}
      <path
        d="M14 56 Q14 42 32 42 Q50 42 50 56 Z"
        fill={`url(#${id}-body)`}
      />
      <path d="M18 50 Q24 46 32 46 Q40 46 46 50" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* =============================== PARTY POPPER (celebration, multicolor) =============================== */
export function Party3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-cone`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="60%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id={`${id}-cone-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Cone body — angled lower-left to upper-right */}
      <path d="M8 56 L26 38 L36 48 L14 58 Z" fill={`url(#${id}-cone)`} />
      <path d="M8 56 L26 38 L36 48 L14 58 Z" fill={`url(#${id}-cone-shine)`} />
      {/* Cone rim stripe */}
      <path d="M22 42 L32 52" stroke="white" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
      {/* Streamers (curly lines) */}
      <path d="M30 36 Q40 24 52 22" stroke="#FBBF24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M28 40 Q44 32 58 36" stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M34 42 Q48 44 56 50" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Confetti pieces — multicolour squares + dots */}
      <rect x="46" y="14" width="3.5" height="3.5" fill="#EF4444" transform="rotate(20 47.75 15.75)" />
      <rect x="56" y="28" width="3.5" height="3.5" fill="#FBBF24" transform="rotate(-15 57.75 29.75)" />
      <rect x="40" y="22" width="3" height="3" fill="#22C55E" transform="rotate(40 41.5 23.5)" />
      <circle cx="50" cy="42" r="1.8" fill="#EC4899" />
      <circle cx="56" cy="20" r="1.5" fill="#3B82F6" />
      <circle cx="38" cy="30" r="1.4" fill="#FBBF24" />
      <circle cx="52" cy="36" r="1.6" fill="#22C55E" />
      <rect x="34" y="14" width="2.5" height="2.5" fill="#A855F7" transform="rotate(30 35.25 15.25)" />
      {/* Top sparkle */}
      <path d="M44 8 L46 12 L50 14 L46 16 L44 20 L42 16 L38 14 L42 12 Z" fill="#FFE7A3" />
    </svg>
  );
}

/* ===================== LUCK BADGE (gold rosette + shamrock + ribbons) ===================== */
export function LuckBadge3D({ size = 64, className }: Icon3DProps) {
  const id = useId().replace(/[:]/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-disc`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFF5D6" />
          <stop offset="35%" stopColor="#FFD978" />
          <stop offset="70%" stopColor="#F2B324" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <radialGradient id={`${id}-disc-shine`} cx="32%" cy="22%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.85" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE7A3" />
          <stop offset="100%" stopColor="#C8901A" />
        </linearGradient>
        <radialGradient id={`${id}-leaf`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#9DECC0" />
          <stop offset="45%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#0F5D2F" />
        </radialGradient>
        <radialGradient id={`${id}-leaf-shine`} cx="35%" cy="25%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="0.65" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#0F5D2F" />
        </linearGradient>
      </defs>

      {/* Ribbon tails behind the disc */}
      <path d="M22 36 L18 60 L25 54 L28 56 L26 36 Z" fill={`url(#${id}-ribbon)`} />
      <path d="M22 36 L18 60 L25 54" stroke="white" strokeOpacity="0.25" strokeWidth="0.7" fill="none" />
      <path d="M42 36 L46 60 L39 54 L36 56 L38 36 Z" fill={`url(#${id}-ribbon)`} />
      <path d="M42 36 L46 60 L39 54" stroke="white" strokeOpacity="0.25" strokeWidth="0.7" fill="none" />

      {/* Outer rim — slightly darker gold halo */}
      <circle cx="32" cy="28" r="22" fill={`url(#${id}-rim)`} />
      {/* Inner disc */}
      <circle cx="32" cy="28" r="19" fill={`url(#${id}-disc)`} />
      {/* Top-left specular */}
      <circle cx="32" cy="28" r="19" fill={`url(#${id}-disc-shine)`} />
      {/* Subtle pleat marks around the rim */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const x1 = 32 + Math.cos(a) * 19.2;
        const y1 = 28 + Math.sin(a) * 19.2;
        const x2 = 32 + Math.cos(a) * 21.6;
        const y2 = 28 + Math.sin(a) * 21.6;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#92400E"
            strokeOpacity="0.35"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        );
      })}

      {/* Shamrock — three rounded heart-shaped leaves + stem */}
      {/* Top leaf */}
      <path
        d="M32 14 Q26.5 11 25 16 Q24 21 30 22 Q33 22.4 32 19.5 Q34 22.4 35 21 Q41 21 39 16 Q37.5 11 32 14 Z"
        fill={`url(#${id}-leaf)`}
      />
      {/* Bottom-left leaf */}
      <path
        d="M22 26 Q18.5 24 17.5 28.5 Q17.5 33 23 33.5 Q26 33.5 25.5 30 Q27 33 28.5 32 Q31 28.5 28.5 25.5 Q25.5 23.5 22 26 Z"
        fill={`url(#${id}-leaf)`}
      />
      {/* Bottom-right leaf */}
      <path
        d="M42 26 Q45.5 24 46.5 28.5 Q46.5 33 41 33.5 Q38 33.5 38.5 30 Q37 33 35.5 32 Q33 28.5 35.5 25.5 Q38.5 23.5 42 26 Z"
        fill={`url(#${id}-leaf)`}
      />
      {/* Soft inner highlights on each leaf */}
      <path d="M32 14 Q26.5 11 25 16 Q24 21 30 22 Q33 22.4 32 19.5 Q34 22.4 35 21 Q41 21 39 16 Q37.5 11 32 14 Z" fill={`url(#${id}-leaf-shine)`} />
      <path d="M22 26 Q18.5 24 17.5 28.5 Q17.5 33 23 33.5 Q26 33.5 25.5 30 Q27 33 28.5 32 Q31 28.5 28.5 25.5 Q25.5 23.5 22 26 Z" fill={`url(#${id}-leaf-shine)`} />
      <path d="M42 26 Q45.5 24 46.5 28.5 Q46.5 33 41 33.5 Q38 33.5 38.5 30 Q37 33 35.5 32 Q33 28.5 35.5 25.5 Q38.5 23.5 42 26 Z" fill={`url(#${id}-leaf-shine)`} />
      {/* Center node */}
      <circle cx="32" cy="26" r="2.2" fill="#0F5D2F" />
      {/* Stem */}
      <path d="M32 28 Q33.5 34 31 40" stroke="#0F5D2F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ===================== LUCK CLOVER (PNG-based, full 3D render) ===================== */
export function LuckClover3D({ size = 64, className }: Icon3DProps) {
  return (
    <img
      src="/brand/luck-clover.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: 'drop-shadow(0 6px 12px rgba(15,93,47,0.3))',
        userSelect: 'none',
      }}
      draggable={false}
    />
  );
}
