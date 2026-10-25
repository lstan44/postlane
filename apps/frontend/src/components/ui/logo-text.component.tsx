import React from 'react';

export const LogoTextComponent = () => (
  <span className="inline-flex items-center gap-2 text-[22px] font-semibold tracking-tight text-current">
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#715CFF" />
      <path d="M7 8h7a5 5 0 0 1 0 10h-2m9 2h-7a5 5 0 0 1 0-10h2" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <path d="m16 7 3 3-3 3M12 15l-3 3 3 3" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>Postlane</span>
  </span>
);
