/**
 * Modelos de IA que Clinera sirve en Vertex AI (Google Cloud).
 * Fuente canónica de los nombres públicos y del orden de publicación.
 *
 * No reintroducir OpenRouter / Kimi K2.6 acá: ese stack es residuo y solo
 * aparece como nota histórica en `/blog/efectividad`.
 */
export const VERTEX_IA_MODELS = [
  "GLM 5.2",
  "Gemini 3.7 Flash",
  "Claude Opus 4.8",
  "Claude Sonnet 5",
] as const;

export type VertexIaModel = (typeof VERTEX_IA_MODELS)[number];

function joinEs(names: readonly string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

/** "GLM 5.2, Gemini 3.7 Flash, Claude Opus 4.8 y Claude Sonnet 5" */
export const VERTEX_IA_MODELS_PROSE = joinEs(VERTEX_IA_MODELS);

/** "GLM 5.2 / Gemini 3.7 Flash / Claude Opus 4.8 / Claude Sonnet 5" */
export const VERTEX_IA_MODELS_SLASH = VERTEX_IA_MODELS.join(" / ");
