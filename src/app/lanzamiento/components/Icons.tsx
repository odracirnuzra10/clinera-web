type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ChatDots({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 18.5V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8l-4 2.5Z" />
      <path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" />
    </svg>
  );
}

export function Waveform({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 11v2" />
      <path d="M8 8v8" />
      <path d="M12 4.5v15" />
      <path d="M16 8v8" />
      <path d="M20 11v2" />
    </svg>
  );
}

export function ChartBars({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20h16" />
      <path d="M7 20v-6" />
      <path d="M12 20V6" />
      <path d="M17 20v-9" />
    </svg>
  );
}

export function Compass({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m14.8 9.2-1.6 4-4 1.6 1.6-4Z" />
    </svg>
  );
}

export function Check({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function Minus({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function Plus({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function PinMap({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M19 10.5c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </svg>
  );
}

export function Spinner({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WarningCircle({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.75v5" />
      <path d="M12 16.1h.01" />
    </svg>
  );
}

export function MetaMark({ className }: IconProps) {
  return (
    <svg {...base} className={className} viewBox="0 0 24 24">
      <path d="M7.4 6.8c-2.4 0-3.9 1.9-3.9 5.2s1.5 5.2 3.7 5.2c1.6 0 2.7-1 4.3-3.6l1.3-2.2c1.6-2.7 2.9-4.6 5-4.6 2.5 0 4.2 2.4 4.2 5.2 0 3.5-1.7 5.2-4 5.2-1.9 0-3.2-1.3-4.7-3.8l-1.2-2C10.6 8.6 9.3 6.8 7.4 6.8Z" />
    </svg>
  );
}

export function WhatsAppMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12.03 2.5c-5.24 0-9.5 4.24-9.5 9.47 0 1.67.44 3.3 1.28 4.74L2.5 21.5l4.94-1.28a9.5 9.5 0 0 0 4.59 1.17h.01c5.24 0 9.5-4.24 9.5-9.47 0-2.53-.99-4.9-2.78-6.69a9.44 9.44 0 0 0-6.73-2.73Zm0 17.36h-.01a7.9 7.9 0 0 1-4.01-1.1l-.29-.17-2.93.76.78-2.85-.19-.29a7.83 7.83 0 0 1-1.21-4.21 7.9 7.9 0 0 1 7.9-7.87c2.11 0 4.09.82 5.58 2.31a7.8 7.8 0 0 1 2.31 5.57c0 4.34-3.55 7.85-7.93 7.85Zm4.33-5.88c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.53.12-.16.24-.61.77-.75.93-.14.16-.28.18-.51.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.18-1.39-1.31-1.63-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.28-.73-1.75-.19-.46-.39-.4-.53-.4l-.45-.01a.87.87 0 0 0-.63.29c-.22.24-.83.81-.83 1.97s.85 2.29.97 2.45c.12.16 1.67 2.55 4.05 3.58.57.24 1.01.39 1.35.5.57.18 1.09.15 1.5.09.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function StripeMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M10.4 8.4c0-1 .9-1.5 2.3-1.5 2 0 4.5.7 6.5 1.7V4.1a16.4 16.4 0 0 0-6.5-1.1c-4.5 0-7.5 2.3-7.5 6.2 0 6 8.3 5 8.3 7.6 0 1.1-1 1.5-2.5 1.5-2.1 0-4.9-.9-7.1-2.1v4.9c2.3 1 4.8 1.4 7.1 1.4 4.6 0 7.8-2.2 7.8-6.2 0-6.4-8.4-5.3-8.4-7.9Z" />
    </svg>
  );
}
