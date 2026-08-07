import styles from "./seguridad.module.css";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const SANS = "Outfit, ui-sans-serif, system-ui, sans-serif";

const NODOS = [
  { kicker: "Titular", nombre: "El paciente", nota: "Los datos son suyos." },
  {
    kicker: "Responsable",
    nombre: "Tu clínica",
    nota: "Decide para qué se tratan.",
    destacado: true,
  },
  {
    kicker: "Encargado",
    nombre: "Clinera",
    nota: "Trata por instrucción, no por cuenta propia.",
    destacado: true,
  },
  {
    kicker: "Subencargados",
    nombre: "Proveedores de Clinera",
    nota: "Mismas obligaciones, por contrato.",
  },
];

const RELACIONES = ["entrega sus datos a", "instruye por contrato a", "sub-encarga a"];

const NODO_H = 84;
const GAP = 52;

export default function RolesDiagram() {
  const alto = NODOS.length * NODO_H + (NODOS.length - 1) * GAP;

  return (
    <svg
      viewBox={`0 0 360 ${alto}`}
      className={styles.diagram}
      role="img"
      aria-labelledby="roles-diagrama-titulo roles-diagrama-desc"
    >
      <title id="roles-diagrama-titulo">
        Cadena de responsabilidad sobre los datos del paciente
      </title>
      <desc id="roles-diagrama-desc">
        El paciente es el titular y entrega sus datos a la clínica, que es la
        responsable del tratamiento. La clínica instruye por contrato a Clinera,
        que actúa como encargada. Clinera sub-encarga a sus proveedores, sujetos
        a las mismas obligaciones.
      </desc>

      <defs>
        <marker
          id="roles-punta"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M1 1 L5 4 L1 7" fill="none" stroke="#6B6B6B" strokeWidth="1.2" />
        </marker>
      </defs>

      {NODOS.map((n, i) => {
        const y = i * (NODO_H + GAP);
        const relacion = RELACIONES[i];

        return (
          <g key={n.kicker}>
            <rect
              x="0.5"
              y={y + 0.5}
              width="359"
              height={NODO_H}
              rx="10"
              fill="#FFFFFF"
              stroke="#EAEAEA"
            />
            {n.destacado && (
              <rect x="0.5" y={y + 14} width="2" height={NODO_H - 28} fill="#7C3AED" />
            )}

            <text
              x="24"
              y={y + 28}
              fontFamily={MONO}
              fontSize="9"
              letterSpacing="0.09em"
              fill={n.destacado ? "#7C3AED" : "#6B6B6B"}
            >
              {n.kicker.toUpperCase()}
            </text>
            <text x="24" y={y + 50} fontFamily={SANS} fontSize="15" fontWeight="600" fill="#111111">
              {n.nombre}
            </text>
            <text x="24" y={y + 69} fontFamily={SANS} fontSize="12.5" fill="#6B6B6B">
              {n.nota}
            </text>

            {relacion && (
              <>
                <line
                  x1="28"
                  y1={y + NODO_H + 12}
                  x2="28"
                  y2={y + NODO_H + GAP - 12}
                  stroke="#6B6B6B"
                  strokeWidth="1"
                  markerEnd="url(#roles-punta)"
                />
                <text
                  x="44"
                  y={y + NODO_H + GAP / 2 + 3}
                  fontFamily={MONO}
                  fontSize="9"
                  letterSpacing="0.09em"
                  fill="#6B6B6B"
                >
                  {relacion.toUpperCase()}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
