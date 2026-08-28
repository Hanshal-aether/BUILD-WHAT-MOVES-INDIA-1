export default function Logo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rsLogoGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6d5bf6" />
          <stop offset="55%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      <rect x="2" y="4" width="36" height="32" rx="9" fill="url(#rsLogoGrad)" />
      <path
        d="M13 27V17.5C13 15.0147 15.0147 13 17.5 13C19.9853 13 22 15.0147 22 17.5V27"
        stroke="#fbbf24"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 13V9.5"
        stroke="#fbbf24"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M13 20.5H22"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="27.5" cy="26.5" r="6" fill="#fbbf24" />
      <path
        d="M25 26.6L26.8 28.4L30.2 24.8"
        stroke="#1e1b4b"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
