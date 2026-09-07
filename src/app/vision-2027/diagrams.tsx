export function IdentityDiagram() {
  return (
    <svg
      className="v27-svg"
      viewBox="0 0 920 340"
      role="img"
      aria-label="Un usuario al centro conectado a tres clínicas: dos con acceso a ficha y una en gris como perfil público"
    >
      <line x1="460" y1="168" x2="150" y2="78" stroke="#111" strokeWidth="1.2" />
      <line x1="460" y1="168" x2="150" y2="258" stroke="#111" strokeWidth="1.2" />
      <line
        x1="460"
        y1="168"
        x2="770"
        y2="168"
        stroke="#cfcfcf"
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />

      <rect x="330" y="118" width="260" height="100" fill="#fff" stroke="#111" strokeWidth="1.4" />
      <text x="460" y="158" textAnchor="middle" fontSize="22" fontWeight="700">
        Ricardo21
      </text>
      <text className="lbl" x="460" y="186" textAnchor="middle" fontSize="11">
        Google · Apple · correo
      </text>

      <rect x="40" y="38" width="220" height="80" fill="#fff" stroke="#111" strokeWidth="1.2" />
      <text className="lbl" x="150" y="68" textAnchor="middle" fontSize="10">
        Dada de alta
      </text>
      <text x="150" y="96" textAnchor="middle" fontSize="16" fontWeight="600">
        Acceso a ficha
      </text>

      <rect x="40" y="218" width="220" height="80" fill="#fff" stroke="#111" strokeWidth="1.2" />
      <text className="lbl" x="150" y="248" textAnchor="middle" fontSize="10">
        Dada de alta
      </text>
      <text x="150" y="276" textAnchor="middle" fontSize="16" fontWeight="600">
        Acceso a ficha
      </text>

      <rect
        x="660"
        y="128"
        width="220"
        height="80"
        fill="#f7f7f5"
        stroke="#cfcfcf"
        strokeWidth="1.2"
      />
      <text className="lbl" x="770" y="158" textAnchor="middle" fontSize="10">
        Sin alta
      </text>
      <text className="muted" x="770" y="186" textAnchor="middle" fontSize="16" fontWeight="600">
        Perfil público
      </text>
    </svg>
  );
}

export function CircleDiagram() {
  const cx = 550;
  const cy = 270;
  const r = 128;
  const labels = [
    "La clínica entra por el software",
    "Sus pacientes entran a Mi Clinera",
    "El paciente descubre otras clínicas",
    "Esas clínicas quieren estar",
    "Más clínicas, más pacientes",
  ];
  const nodes = labels.map((label, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    const lx = cx + (r + 78) * Math.cos(a);
    const ly = cy + (r + 78) * Math.sin(a);
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
      lx,
      ly,
      label,
      n: String(i + 1).padStart(2, "0"),
      anchor: Math.cos(a) > 0.35 ? "start" : Math.cos(a) < -0.35 ? "end" : "middle",
    };
  });

  const ring = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`;

  return (
    <svg
      className="v27-svg"
      viewBox="0 0 1100 540"
      role="img"
      aria-label="Círculo de cinco pasos: software, pacientes, descubrimiento, clínicas nuevas, más red"
    >
      <defs>
        <linearGradient id="v27-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#009fe3" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#c850c0" />
        </linearGradient>
      </defs>
      <path d={ring} fill="none" stroke="url(#v27-ring)" strokeWidth="1.8" />
      {nodes.map((n) => (
        <g key={n.n}>
          <circle cx={n.x} cy={n.y} r="5" fill="#111" />
          <text className="lbl" x={n.lx} y={n.ly - 8} textAnchor={n.anchor} fontSize="11">
            {n.n}
          </text>
          <text
            x={n.lx}
            y={n.ly + 14}
            textAnchor={n.anchor}
            fontSize="16"
            fontWeight="600"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
