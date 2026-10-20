import React from 'react';

export default function HuranowLogo({ className = "w-7 h-7", showText = false, textClassName = "text-2xl" }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hnGrad" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFB000" />
            <stop offset="40%" stopColor="#FF5A1F" />
            <stop offset="68%" stopColor="#F01AA6" />
            <stop offset="100%" stopColor="#5C28E6" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="9.05" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="9.2" stroke="url(#hnGrad)" strokeWidth="1.22" />
        <circle cx="10.1" cy="7.9" r="1.48" fill="#17171C" />
        <circle cx="13.95" cy="7.72" r="1.42" fill="#17171C" />
        <path
          d="M8.05 14.2C9.45 11 12.05 9.48 15.55 9.48H15.86"
          stroke="#17171C"
          strokeWidth="2.28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.18 10.55C9.08 11.92 8.58 13.72 8.58 16.02V17.28"
          stroke="#17171C"
          strokeWidth="2.28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.78 10.92V17.12"
          stroke="#17171C"
          strokeWidth="2.34"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className={`font-black tracking-wider uppercase text-white font-display ${textClassName}`}>
          HURANOW
        </span>
      )}
    </div>
  );
}
