"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CLINERA_PLANS,
  EXTRA_CREDIT_PACK_CREDITS,
  EXTRA_CREDIT_PACK_USD,
  EXTRA_USER_USD,
  SEMESTER_DISCOUNT_PERCENT,
  SEMESTER_MONTHS,
  SETUP_FEE_USD,
} from "@/content/pricing";
import styles from "./cotizacion.module.css";

type Billing = "monthly" | "semester";

type Discounts = {
  plan: number;
  users: number;
  credits: number;
  setup: number;
  global: number;
};

type QuoteBuilderProps = {
  initialDate: string;
  initialValidUntil: string;
  initialQuoteNumber: string;
};

type QuoteRow = {
  id: "plan" | "users" | "credits" | "setup";
  name: string;
  detail: string;
  quantity: string;
  base: number;
  discount: number;
  total: number;
};

const DEFAULT_NOTES =
  "La fecha de inicio del servicio se coordina según disponibilidad del equipo de implementación.";

const clampPercent = (value: number) => Math.min(100, Math.max(0, value || 0));
const applyDiscount = (amount: number, discount: number) =>
  amount * (1 - clampPercent(discount) / 100);

const formatUsd = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(value);

const formatDate = (value: string) => {
  if (!value) return "Por definir";
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
};

function DiscountField({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`${styles.discountField} ${disabled ? styles.discountDisabled : ""}`}>
      <span>{label}</span>
      <span className={styles.percentInput}>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(clampPercent(Number(event.target.value)))}
          aria-label={`Descuento para ${label}`}
        />
        <span aria-hidden="true">%</span>
      </span>
    </label>
  );
}

function QuantityControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const update = (next: number) => onChange(Math.min(999, Math.max(0, next || 0)));

  return (
    <div className={styles.quantityControl}>
      <button type="button" onClick={() => update(value - 1)} aria-label={`Restar ${label}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M2.25 7h9.5" />
        </svg>
      </button>
      <input
        type="number"
        min="0"
        max="999"
        value={value}
        onChange={(event) => update(Number(event.target.value))}
        aria-label={label}
      />
      <button type="button" onClick={() => update(value + 1)} aria-label={`Sumar ${label}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M7 2.25v9.5M2.25 7h9.5" />
        </svg>
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className={styles.field}>
      <span>
        {label}
        {required && <small>Requerido</small>}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default function QuoteBuilder({
  initialDate,
  initialValidUntil,
  initialQuoteNumber,
}: QuoteBuilderProps) {
  const [clientName, setClientName] = useState("Clínica Estética Aurora");
  const [quoteOwner, setQuoteOwner] = useState("Catalina Fuentes");
  const [ownerEmail, setOwnerEmail] = useState("catalina.fuentes@oacg.cl");
  const [ownerPhone, setOwnerPhone] = useState("+56 9 7882 4985");
  const [quoteNumber, setQuoteNumber] = useState(initialQuoteNumber);
  const [quoteDate, setQuoteDate] = useState(initialDate);
  const [validUntil, setValidUntil] = useState(initialValidUntil);
  const [selectedPlanId, setSelectedPlanId] =
    useState<(typeof CLINERA_PLANS)[number]["id"]>("atlas");
  const [billing, setBilling] = useState<Billing>("semester");
  const [extraUsers, setExtraUsers] = useState(0);
  const [extraCreditPacks, setExtraCreditPacks] = useState(0);
  const [includeSetup, setIncludeSetup] = useState(true);
  const [discounts, setDiscounts] = useState<Discounts>({
    plan: 0,
    users: 0,
    credits: 0,
    setup: 0,
    global: 0,
  });
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const selectedPlan =
    CLINERA_PLANS.find((plan) => plan.id === selectedPlanId) ?? CLINERA_PLANS[0];
  const periodMonths = billing === "semester" ? SEMESTER_MONTHS : 1;
  const periodLabel = billing === "semester" ? "Semestral" : "Mensual";

  const rows = useMemo<QuoteRow[]>(() => {
    const planBase =
      billing === "semester" ? selectedPlan.semesterTotal : selectedPlan.monthlyPrice;
    const userBase = extraUsers * EXTRA_USER_USD * periodMonths;
    const creditBase = extraCreditPacks * EXTRA_CREDIT_PACK_USD * periodMonths;

    return [
      {
        id: "plan",
        name: `Plan ${selectedPlan.name}`,
        detail:
          billing === "semester"
            ? `${SEMESTER_MONTHS} meses · ${SEMESTER_DISCOUNT_PERCENT}% de ahorro semestral incluido`
            : "Facturación mes a mes",
        quantity: "1",
        base: planBase,
        discount: discounts.plan,
        total: applyDiscount(planBase, discounts.plan),
      },
      ...(extraUsers > 0
        ? [
            {
              id: "users" as const,
              name: "Usuarios / profesionales extra",
              detail: `${formatUsd(EXTRA_USER_USD)} por usuario/mes · ${periodMonths} ${
                periodMonths === 1 ? "mes" : "meses"
              }`,
              quantity: String(extraUsers),
              base: userBase,
              discount: discounts.users,
              total: applyDiscount(userBase, discounts.users),
            },
          ]
        : []),
      ...(extraCreditPacks > 0
        ? [
            {
              id: "credits" as const,
              name: "Créditos IA extra",
              detail: `${formatNumber(
                EXTRA_CREDIT_PACK_CREDITS,
              )} créditos por pack/mes · ${periodMonths} ${
                periodMonths === 1 ? "mes" : "meses"
              }`,
              quantity: String(extraCreditPacks),
              base: creditBase,
              discount: discounts.credits,
              total: applyDiscount(creditBase, discounts.credits),
            },
          ]
        : []),
      ...(includeSetup
        ? [
            {
              id: "setup" as const,
              name: "Configuración inicial",
              detail: "Pago único · migración, configuración y capacitación",
              quantity: "1",
              base: SETUP_FEE_USD,
              discount: discounts.setup,
              total: applyDiscount(SETUP_FEE_USD, discounts.setup),
            },
          ]
        : []),
    ];
  }, [
    billing,
    discounts,
    extraCreditPacks,
    extraUsers,
    includeSetup,
    periodMonths,
    selectedPlan,
  ]);

  const catalogSubtotal = rows.reduce((sum, row) => sum + row.base, 0);
  const afterItemDiscounts = rows.reduce((sum, row) => sum + row.total, 0);
  const itemDiscountSavings = catalogSubtotal - afterItemDiscounts;
  const globalDiscountAmount =
    afterItemDiscounts * (clampPercent(discounts.global) / 100);
  const total = afterItemDiscounts - globalDiscountAmount;
  const totalCredits =
    selectedPlan.credits + extraCreditPacks * EXTRA_CREDIT_PACK_CREDITS;
  const totalUsers = selectedPlan.users + extraUsers;

  const updateDiscount = (key: keyof Discounts, value: number) =>
    setDiscounts((current) => ({ ...current, [key]: clampPercent(value) }));

  const reset = () => {
    setClientName("Clínica Estética Aurora");
    setQuoteOwner("Catalina Fuentes");
    setOwnerEmail("catalina.fuentes@oacg.cl");
    setOwnerPhone("+56 9 7882 4985");
    setQuoteNumber(initialQuoteNumber);
    setQuoteDate(initialDate);
    setValidUntil(initialValidUntil);
    setSelectedPlanId("atlas");
    setBilling("semester");
    setExtraUsers(0);
    setExtraCreditPacks(0);
    setIncludeSetup(true);
    setDiscounts({ plan: 0, users: 0, credits: 0, setup: 0, global: 0 });
    setNotes(DEFAULT_NOTES);
    setCopyState("idle");
  };

  const copySummary = async () => {
    const summary = [
      `Cotización ${quoteNumber || "Clinera"}`,
      `Cliente: ${clientName || "Por definir"}`,
      `Plan: ${selectedPlan.name} · ${periodLabel.toLowerCase()}`,
      `${formatNumber(totalCredits)} créditos/mes · ${totalUsers} usuarios`,
      `Total: ${formatUsd(total)}`,
      `Válida hasta: ${formatDate(validUntil)}`,
    ].join("\n");

    await navigator.clipboard.writeText(summary);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1800);
  };

  return (
    <main id="contenido" className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <Image
            src="/images/brand/quote-logo.svg"
            width={32}
            height={32}
            alt="Clinera"
            priority
          />
          <span>clinera.io</span>
          <i aria-hidden="true" />
          <strong>Cotizaciones</strong>
        </div>
        <div className={styles.topbarActions}>
          <button type="button" className={styles.ghostButton} onClick={reset}>
            Restablecer
          </button>
          <button type="button" className={styles.secondaryButton} onClick={copySummary}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <rect x="5.25" y="5.25" width="7.5" height="7.5" rx="1.25" />
              <path d="M10.75 5V3.75a1.5 1.5 0 0 0-1.5-1.5h-5.5a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5H5" />
            </svg>
            {copyState === "copied" ? "Resumen copiado" : "Copiar resumen"}
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => window.print()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4.25 5V2.25h7.5V5M4.25 11v2.75h7.5V11" />
              <path d="M3 5.25h10A1.75 1.75 0 0 1 14.75 7v3H1.25V7A1.75 1.75 0 0 1 3 5.25Z" />
              <path d="M11.75 7.75h.01" />
            </svg>
            Imprimir / guardar PDF
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <form className={styles.editor} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.editorIntro}>
            <span>Constructor comercial</span>
            <h1>Arma una cotización clara en minutos.</h1>
            <p>Configura la propuesta y revisa el documento final en tiempo real.</p>
          </div>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>01</span>
              <div>
                <h2>Datos de la propuesta</h2>
                <p>Identifica al cliente y a quien presenta la cotización.</p>
              </div>
            </div>
            <div className={styles.fieldGrid}>
              <Field
                label="Nombre del cliente"
                value={clientName}
                onChange={setClientName}
                placeholder="Clínica o empresa"
                required
              />
              <Field
                label="Nombre del cotizante"
                value={quoteOwner}
                onChange={setQuoteOwner}
                placeholder="Nombre y apellido"
                required
              />
              <Field
                label="Correo del cotizante"
                type="email"
                value={ownerEmail}
                onChange={setOwnerEmail}
                placeholder="nombre@clinera.io"
              />
              <Field
                label="Teléfono del cotizante"
                type="tel"
                value={ownerPhone}
                onChange={setOwnerPhone}
                placeholder="+56 9"
              />
              <Field
                label="N.º de cotización"
                value={quoteNumber}
                onChange={setQuoteNumber}
              />
              <Field
                label="Fecha"
                type="date"
                value={quoteDate}
                onChange={setQuoteDate}
              />
              <Field
                label="Válida hasta"
                type="date"
                value={validUntil}
                onChange={setValidUntil}
              />
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>02</span>
              <div>
                <h2>Plan y modalidad</h2>
                <p>Los valores se mantienen sincronizados con la página de planes.</p>
              </div>
            </div>

            <div className={styles.planList}>
              {CLINERA_PLANS.map((plan) => (
                <label
                  className={`${styles.planOption} ${
                    selectedPlan.id === plan.id ? styles.planOptionSelected : ""
                  }`}
                  key={plan.id}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selectedPlan.id === plan.id}
                    onChange={() => setSelectedPlanId(plan.id)}
                  />
                  <span className={styles.radioMark} aria-hidden="true" />
                  <span className={styles.planName}>
                    <strong>{plan.name}</strong>
                    <small>
                      {formatNumber(plan.credits)} créditos · {plan.users} usuarios
                    </small>
                  </span>
                  <span className={styles.planPrice}>
                    <strong>{formatUsd(plan.monthlyPrice)}</strong>
                    <small>/mes</small>
                  </span>
                </label>
              ))}
            </div>

            <fieldset className={styles.billingFieldset}>
              <legend>Modalidad de pago</legend>
              <div className={styles.billingOptions}>
                <label className={billing === "monthly" ? styles.billingSelected : ""}>
                  <input
                    type="radio"
                    name="billing"
                    value="monthly"
                    checked={billing === "monthly"}
                    onChange={() => setBilling("monthly")}
                  />
                  <strong>Mensual</strong>
                  <small>Pago mes a mes</small>
                </label>
                <label className={billing === "semester" ? styles.billingSelected : ""}>
                  <input
                    type="radio"
                    name="billing"
                    value="semester"
                    checked={billing === "semester"}
                    onChange={() => setBilling("semester")}
                  />
                  <strong>Semestral</strong>
                  <small>{SEMESTER_MONTHS} meses · {SEMESTER_DISCOUNT_PERCENT}% OFF</small>
                </label>
              </div>
            </fieldset>

            <label className={styles.setupToggle}>
              <span>
                <input
                  type="checkbox"
                  checked={includeSetup}
                  onChange={(event) => setIncludeSetup(event.target.checked)}
                />
                <i aria-hidden="true" />
              </span>
              <span>
                <strong>Incluir configuración inicial</strong>
                <small>Migración, configuración y capacitación · pago único</small>
              </span>
              <b>{formatUsd(SETUP_FEE_USD)}</b>
            </label>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>03</span>
              <div>
                <h2>Capacidad adicional</h2>
                <p>Las cantidades corresponden a cada mes del período elegido.</p>
              </div>
            </div>
            <div className={styles.addonList}>
              <div className={styles.addonRow}>
                <div>
                  <strong>Usuarios extra</strong>
                  <small>{formatUsd(EXTRA_USER_USD)} por usuario/mes</small>
                </div>
                <QuantityControl
                  label="Usuarios extra"
                  value={extraUsers}
                  onChange={setExtraUsers}
                />
              </div>
              <div className={styles.addonRow}>
                <div>
                  <strong>Créditos IA extra</strong>
                  <small>
                    {formatNumber(EXTRA_CREDIT_PACK_CREDITS)} créditos por{" "}
                    {formatUsd(EXTRA_CREDIT_PACK_USD)}
                  </small>
                </div>
                <QuantityControl
                  label="Packs de créditos extra"
                  value={extraCreditPacks}
                  onChange={setExtraCreditPacks}
                />
              </div>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>04</span>
              <div>
                <h2>Descuentos</h2>
                <p>Cada descuento se aplica sobre su línea. El global se calcula al final.</p>
              </div>
            </div>
            <div className={styles.discountGrid}>
              <DiscountField
                label={`Plan ${selectedPlan.name}`}
                value={discounts.plan}
                onChange={(value) => updateDiscount("plan", value)}
              />
              <DiscountField
                label="Usuarios extra"
                value={discounts.users}
                disabled={extraUsers === 0}
                onChange={(value) => updateDiscount("users", value)}
              />
              <DiscountField
                label="Créditos IA extra"
                value={discounts.credits}
                disabled={extraCreditPacks === 0}
                onChange={(value) => updateDiscount("credits", value)}
              />
              <DiscountField
                label="Configuración inicial"
                value={discounts.setup}
                disabled={!includeSetup}
                onChange={(value) => updateDiscount("setup", value)}
              />
            </div>
            <div className={styles.globalDiscount}>
              <div>
                <strong>Descuento global</strong>
                <small>Se aplica después de los descuentos por ítem.</small>
              </div>
              <span className={styles.percentInput}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={discounts.global}
                  onChange={(event) =>
                    updateDiscount("global", Number(event.target.value))
                  }
                  aria-label="Descuento global"
                />
                <span aria-hidden="true">%</span>
              </span>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
              <span>05</span>
              <div>
                <h2>Nota comercial</h2>
                <p>Aparece al pie de la cotización.</p>
              </div>
            </div>
            <label className={styles.field}>
              <span>Nota</span>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
            </label>
          </section>
        </form>

        <section className={styles.previewColumn} aria-label="Vista previa de la cotización">
          <div className={styles.previewLabel}>
            <span>
              <i aria-hidden="true" />
              Vista previa
            </span>
            <small>Formato A4 · se actualiza en tiempo real</small>
          </div>

          <div className={styles.paperViewport}>
            <article className={styles.quotePaper} aria-live="polite">
              <div className={styles.documentRail} aria-hidden="true">
                <span>CLINERA</span>
                <i />
                <small>{quoteNumber || "COTIZACIÓN"}</small>
              </div>

              <header className={styles.quoteHeader}>
                <div className={styles.quoteBrand}>
                  <Image
                    src="/images/brand/quote-logo.svg"
                    width={44}
                    height={44}
                    alt="Logo de Clinera"
                    priority
                  />
                  <div>
                    <strong>clinera.io</strong>
                    <small>Operación clínica inteligente</small>
                  </div>
                </div>
                <div className={styles.quoteMeta}>
                  <span>Cotización</span>
                  <strong>{quoteNumber || "Sin número"}</strong>
                  <small>{formatDate(quoteDate)}</small>
                </div>
              </header>

              <div className={styles.quoteHero}>
                <div>
                  <span>Propuesta comercial</span>
                  <h2>{clientName || "Nombre del cliente"}</h2>
                </div>
                <div className={styles.ownerBlock}>
                  <span>Preparada por</span>
                  <strong>{quoteOwner || "Nombre del cotizante"}</strong>
                  {ownerEmail && <small>{ownerEmail}</small>}
                  {ownerPhone && <small>{ownerPhone}</small>}
                </div>
              </div>

              <section className={styles.planSummary}>
                <div>
                  <span>Plan seleccionado</span>
                  <strong>{selectedPlan.name}</strong>
                  <small>{periodLabel} · valores en USD</small>
                </div>
                <dl>
                  <div>
                    <dt>Créditos / mes</dt>
                    <dd>{formatNumber(totalCredits)}</dd>
                  </div>
                  <div>
                    <dt>Usuarios</dt>
                    <dd>{formatNumber(totalUsers)}</dd>
                  </div>
                  <div>
                    <dt>Sucursales</dt>
                    <dd>{selectedPlan.branches}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.quoteDetail}>
                <div className={styles.detailHeading}>
                  <h3>Detalle de inversión</h3>
                  <span>{periodLabel}</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Cant.</th>
                      <th>Desc.</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.name}</strong>
                          <small>{row.detail}</small>
                        </td>
                        <td>{row.quantity}</td>
                        <td>{row.discount > 0 ? `${row.discount}%` : "—"}</td>
                        <td>
                          {row.discount > 0 && <del>{formatUsd(row.base)}</del>}
                          <strong>{formatUsd(row.total)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className={styles.quoteTotals}>
                <div className={styles.savingsNote}>
                  <span>Condición comercial</span>
                  <p>
                    {billing === "semester"
                      ? `El plan ya incorpora ${SEMESTER_DISCOUNT_PERCENT}% de ahorro por pago semestral.`
                      : `Facturación mensual con permanencia mínima de ${SEMESTER_MONTHS} meses.`}
                  </p>
                  {itemDiscountSavings + globalDiscountAmount > 0 && (
                    <strong>
                      Ahorro adicional:{" "}
                      {formatUsd(itemDiscountSavings + globalDiscountAmount)}
                    </strong>
                  )}
                </div>
                <dl>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatUsd(catalogSubtotal)}</dd>
                  </div>
                  {itemDiscountSavings > 0 && (
                    <div>
                      <dt>Descuentos por ítem</dt>
                      <dd>− {formatUsd(itemDiscountSavings)}</dd>
                    </div>
                  )}
                  {globalDiscountAmount > 0 && (
                    <div>
                      <dt>Descuento global ({discounts.global}%)</dt>
                      <dd>− {formatUsd(globalDiscountAmount)}</dd>
                    </div>
                  )}
                  <div className={styles.grandTotal}>
                    <dt>Total {billing === "semester" ? "semestral" : "inicial"}</dt>
                    <dd>{formatUsd(total)}</dd>
                  </div>
                </dl>
              </section>

              <footer className={styles.quoteFooter}>
                <div>
                  <span>Validez</span>
                  <strong>Hasta el {formatDate(validUntil)}</strong>
                  {notes && <p>{notes}</p>}
                </div>
                <div className={styles.legalNote}>
                  <p>
                    Valores expresados en USD. Impuestos no incluidos. Los créditos se
                    renuevan mensualmente y los extras se consideran por cada mes del período.
                  </p>
                  <span>www.clinera.io</span>
                </div>
              </footer>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
