export function PelviCareIcon({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded square background */}
      <rect width="36" height="36" rx="9" fill="#1e3a5f" />

      {/* Pelvis arch — dome shape representing pelvic floor */}
      <path
        d="M6 27 C6 13 30 13 30 27"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* EMS pulse wave — runs across the base */}
      <path
        d="M3 27 L8 27 L10 23 L13 31 L18 19 L23 31 L26 23 L28 27 L33 27"
        stroke="#0d9488"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function PelviCareLogotype({ iconSize = 36, dark = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <PelviCareIcon size={iconSize} />
      <span
        className="font-extrabold tracking-tight"
        style={{
          fontSize: iconSize * 0.58,
          color: dark ? 'white' : '#1e3a5f',
          letterSpacing: '-0.02em',
        }}
      >
        Pelvi<span style={{ color: '#0d9488' }}>Care</span>
      </span>
    </div>
  );
}
