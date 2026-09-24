import React from 'react';

export const SheepIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M19 10c0-1.1-.9-2-2-2h-.3c-.4-1.2-1.5-2-2.7-2-.3 0-.6.1-.9.2C12.4 5.4 11.3 5 10 5c-2.2 0-4 1.8-4 4 0 .3 0 .7.1 1-1.2.4-2.1 1.5-2.1 2.8 0 1.5 1.1 2.7 2.5 2.9C6.8 16.5 7.8 17 9 17h.5l-.5 2h2l.5-2h3l-.5 2h2l.5-2h.5c1.7 0 3-1.3 3-3 0-.6-.2-1.2-.5-1.7 1.2-.4 2-1.5 2-2.3zM9 10c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
  </svg>
);

export const ShepherdIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8a2 2 0 0 0-2-2 2 2 0 0 0-2 2v13" />
    <path d="M15 8c0-1.1.9-2 2-2a2 2 0 0 1 2 2" />
  </svg>
);

export const CraftsmanIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
    <path d="M17.64 15 22 10.64" />
    <path d="m20.91 3.26-1.25-1.25a2 2 0 0 0-2.83 0l-1.8 1.8 4.07 4.08 1.81-1.8a2 2 0 0 0 0-2.83Z" />
    <path d="m15 7-4-4" />
  </svg>
);

export const SailorIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    <path d="m7 12 5-4 5 4" />
  </svg>
);

export const ShearerIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

export const PoundCoinIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M14.5 8.5c-.5-.9-1.4-1.5-2.5-1.5-1.7 0-3 1.3-3 3v2.5H8v1.5h1v3.5H8v1.5h8v-1.5h-5.5v-3.5H13v-1.5h-2.5v-2.5c0-.8.7-1.5 1.5-1.5.6 0 1.1.3 1.4.8l1.1-.8z" fill="currentColor" />
  </svg>
);

export const GoldBarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16l3-8h10l3 8H4z" fill="#eab308" fillOpacity="0.3" />
    <path d="M7 8l2-4h6l2 4" />
    <path d="M4 16l3 4h10l3-4" />
    <line x1="7" y1="8" x2="4" y2="16" />
    <line x1="17" y1="8" x2="20" y2="16" />
  </svg>
);

export const ExchangeTokenIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" />
    <path d="M7 9h8l-3-3" stroke="#93c5fd" />
    <path d="M17 15H9l3 3" stroke="#93c5fd" />
  </svg>
);

export const CertificateIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" fill="#a855f7" fillOpacity="0.2" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

export const StorehouseIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 10v11h18V10l-9-7-9 7zm8 9H6v-6h5v6zm7 0h-5v-6h5v6z" opacity="0.85" />
  </svg>
);

export const SteeringWheelIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="3" x2="12" y2="9" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="3" y1="12" x2="9" y2="12" />
    <line x1="15" y1="12" x2="21" y2="12" />
  </svg>
);

export const BarrelIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="7" ry="2" />
    <path d="M5 5c-1 3.5-1 10.5 0 14" />
    <path d="M19 5c1 3.5 1 10.5 0 14" />
    <ellipse cx="12" cy="19" rx="7" ry="2" />
    <line x1="4.5" y1="10" x2="19.5" y2="10" />
    <line x1="4.5" y1="14" x2="19.5" y2="14" />
  </svg>
);

export const BellIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const CompassIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#f59e0b" fillOpacity="0.4" />
  </svg>
);

export const PathfinderIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m4 15 4-4 4 4 8-8" />
    <polyline points="16 7 20 7 20 11" />
  </svg>
);

export const HazardRockfallIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="m2 22 10-18 10 18H2zm10-5c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1zm0 3c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" fill="#f97316" />
  </svg>
);

export const HazardFloodIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#06b6d4" fillOpacity="0.3" stroke="#22d3ee" />
  </svg>
);
