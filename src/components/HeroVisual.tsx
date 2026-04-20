import Link from 'next/link';

export default function HeroVisual() {
  return (
    <div className="hero-v2__visual">
      <div className="hero-v2__visual-inner" aria-label="Vista previa de Clinera: agenda médica con asistente IA">
        <svg
          viewBox="0 0 720 560"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroGradBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FAFBFC" />
              <stop offset="100%" stopColor="#F0F3F7" />
            </linearGradient>
            <linearGradient id="heroGradBrand" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#009FE3" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#C850C0" />
            </linearGradient>
            <linearGradient id="heroGradCyanSoft" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E6F7FD" />
              <stop offset="100%" stopColor="#F5EDFD" />
            </linearGradient>
            <filter id="heroShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#111318" floodOpacity="0.08" />
            </filter>
          </defs>

          <rect width="720" height="560" fill="url(#heroGradBg)" />

          {/* Soft radial accent */}
          <circle cx="600" cy="100" r="180" fill="#C850C0" opacity="0.05" />
          <circle cx="80" cy="480" r="160" fill="#009FE3" opacity="0.06" />

          {/* Main agenda card */}
          <g filter="url(#heroShadow)">
            <rect x="48" y="56" width="520" height="420" rx="16" fill="#FFFFFF" stroke="#EEF0F3" />

            {/* Card header */}
            <rect x="48" y="56" width="520" height="56" rx="16" fill="#FFFFFF" />
            <rect x="48" y="108" width="520" height="1" fill="#EEF0F3" />
            <rect x="68" y="76" width="32" height="32" rx="8" fill="#7C3AED" />
            <path d="M76 86h16M76 92h16M76 98h10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <text x="112" y="90" fontFamily="Outfit, sans-serif" fontSize="14" fontWeight="600" fill="#111318">Agenda Médica</text>
            <text x="112" y="104" fontFamily="DM Mono, monospace" fontSize="10" fill="#8B92A5">Abril 2026</text>

            {/* Month navigation pills */}
            <rect x="460" y="74" width="92" height="28" rx="14" fill="#FAFBFC" stroke="#EEF0F3" />
            <circle cx="474" cy="88" r="3" fill="#10B981" />
            <text x="484" y="92" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="500" fill="#4A5168">24 citas hoy</text>

            {/* Weekday headers */}
            <g fontFamily="DM Mono, monospace" fontSize="10" fill="#8B92A5" fontWeight="500">
              <text x="92" y="140" textAnchor="middle">LUN</text>
              <text x="160" y="140" textAnchor="middle">MAR</text>
              <text x="228" y="140" textAnchor="middle">MIÉ</text>
              <text x="296" y="140" textAnchor="middle">JUE</text>
              <text x="364" y="140" textAnchor="middle">VIE</text>
              <text x="432" y="140" textAnchor="middle">SÁB</text>
              <text x="500" y="140" textAnchor="middle">DOM</text>
            </g>

            {/* Calendar cells — 4 rows x 7 cols */}
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3, 4, 5, 6].map((col) => {
                const x = 68 + col * 68;
                const y = 156 + row * 72;
                const dayNum = row * 7 + col + 1;
                const hasEvent = [2, 4, 8, 10, 12, 16, 18, 22].includes(dayNum);
                const isToday = dayNum === 10;
                return (
                  <g key={`${row}-${col}`}>
                    <rect
                      x={x}
                      y={y}
                      width="56"
                      height="60"
                      rx="8"
                      fill={isToday ? '#F5EDFD' : '#FAFBFC'}
                      stroke={isToday ? '#7C3AED' : '#EEF0F3'}
                      strokeWidth={isToday ? '1.5' : '1'}
                    />
                    <text
                      x={x + 8}
                      y={y + 16}
                      fontFamily="DM Mono, monospace"
                      fontSize="10"
                      fontWeight={isToday ? '600' : '400'}
                      fill={isToday ? '#7C3AED' : '#4A5168'}
                    >
                      {dayNum <= 30 ? dayNum : ''}
                    </text>
                    {hasEvent && dayNum <= 30 && (
                      <rect
                        x={x + 6}
                        y={y + 24}
                        width="44"
                        height="6"
                        rx="3"
                        fill={dayNum % 3 === 0 ? '#00D4FF' : dayNum % 2 === 0 ? '#7C3AED' : '#C850C0'}
                        opacity="0.75"
                      />
                    )}
                    {hasEvent && dayNum % 2 === 0 && dayNum <= 30 && (
                      <rect
                        x={x + 6}
                        y={y + 34}
                        width="32"
                        height="6"
                        rx="3"
                        fill="#10B981"
                        opacity="0.6"
                      />
                    )}
                  </g>
                );
              }),
            )}
          </g>

          {/* Floating AI assistant card */}
          <g filter="url(#heroShadow)">
            <rect x="440" y="320" width="244" height="200" rx="20" fill="#FFFFFF" stroke="#EEF0F3" />

            {/* Header */}
            <rect x="440" y="320" width="244" height="48" rx="20" fill="url(#heroGradCyanSoft)" />
            <rect x="440" y="356" width="244" height="12" fill="url(#heroGradCyanSoft)" />
            <circle cx="462" cy="344" r="10" fill="#FFFFFF" />
            <circle cx="462" cy="344" r="5" fill="#10B981">
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="482" y="340" fontFamily="Outfit, sans-serif" fontSize="12" fontWeight="600" fill="#111318">AURA · Asistente IA</text>
            <text x="482" y="354" fontFamily="DM Mono, monospace" fontSize="9" fill="#4A5168">Activo · responde 24/7</text>

            {/* Incoming bubble */}
            <rect x="456" y="384" width="156" height="30" rx="14" fill="#F5F6F8" />
            <text x="464" y="403" fontFamily="Outfit, sans-serif" fontSize="10" fill="#111318">Necesito cita mañana 10am</text>

            {/* Outgoing options */}
            <rect x="488" y="422" width="180" height="20" rx="10" fill="#009FE3" opacity="0.12" />
            <text x="496" y="436" fontFamily="Outfit, sans-serif" fontSize="10" fontWeight="500" fill="#009FE3">3 horarios disponibles:</text>

            <rect x="488" y="448" width="180" height="22" rx="8" fill="#FFFFFF" stroke="#E1E5EC" />
            <text x="496" y="463" fontFamily="DM Mono, monospace" fontSize="9" fill="#111318">10:00 · Dra. Meza</text>

            <rect x="488" y="474" width="180" height="22" rx="8" fill="#FFFFFF" stroke="#E1E5EC" />
            <text x="496" y="489" fontFamily="DM Mono, monospace" fontSize="9" fill="#111318">11:30 · Dr. Silva</text>
          </g>

          {/* Small status badge */}
          <g>
            <rect x="68" y="494" width="180" height="32" rx="16" fill="#FFFFFF" stroke="#EEF0F3" />
            <circle cx="86" cy="510" r="4" fill="#10B981" />
            <text x="98" y="514" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="500" fill="#111318">23 citas agendadas hoy por IA</text>
          </g>
        </svg>

        <Link
          href="/demo"
          className="hero-v2__play-btn"
          aria-label="Ver demo completo de 12 minutos"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </Link>

        <span className="hero-v2__video-badge">Video demo · 60s · próximamente</span>
      </div>
    </div>
  );
}
