// Logic of the climate diagram after Walter and Lieth: 12 monthly mean temperatures (°C) and precipitation sums (mm).
// The scales are 1:2, so 10 °C stand level with 20 mm; above 100 mm the precipitation scale is squeezed to a tenth.
// Pure functions only; KlimaDiagramm.vue draws what they return.

export type Ort = {
  id: string;
  name: string;
  temperaturen: number[];
  niederschlag: number[];
};

export const MONATE = 12;
/** Precipitation above this value is drawn with the squeezed scale (mm). */
export const KNICK_MM = 100;
/** The temperature that stands level with KNICK_MM. */
export const KNICK_GRAD = KNICK_MM / 2;

/** The value on the temperature scale that stands level with a precipitation of p mm. */
export function niederschlagAlsGrad(p: number): number {
  return p <= KNICK_MM ? p / 2 : KNICK_GRAD + (p - KNICK_MM) / 10;
}

/** The precipitation (mm) that stands level with a value t of the temperature scale. */
export function gradAlsNiederschlag(t: number): number {
  return t <= KNICK_GRAD ? t * 2 : KNICK_MM + (t - KNICK_GRAD) * 10;
}

/** A month is humid when its precipitation column rises above the temperature line, so mm > 2 · °C. */
export function istHumid(temperatur: number, niederschlag: number): boolean {
  return niederschlag > 2 * temperatur;
}

export function humideMonate(ort: Ort): boolean[] {
  return ort.temperaturen.map((t, m) => istHumid(t, ort.niederschlag[m] ?? 0));
}

export function jahresmittel(ort: Ort): number {
  return ort.temperaturen.reduce((a, b) => a + b, 0) / ort.temperaturen.length;
}

export function jahressumme(ort: Ort): number {
  return ort.niederschlag.reduce((a, b) => a + b, 0);
}

export type Layout = {
  breite: number;
  hoehe: number;
  links: number;
  rechts: number;
  oben: number;
  unten: number;
  tMin: number;
  tMax: number;
  /** y of a value of the temperature scale */
  y: (t: number) => number;
  /** x of the middle of a month (0 = January) */
  x: (monat: number) => number;
  spalte: number;
  gradTicks: number[];
  /** the precipitation (mm) at each tick of the right axis, level with the left ticks */
  mmTicks: { t: number; mm: number }[];
};

export function layout(ort: Ort, hoehe = 300): Layout {
  const breite = 480;
  const links = 46;
  const rechts = 56;
  const oben = 20;
  const unten = 28;
  const hoechst = Math.max(...ort.temperaturen, ...ort.niederschlag.map(niederschlagAlsGrad), KNICK_GRAD * 0.6);
  const tMax = Math.max(30, Math.ceil(hoechst / 10) * 10);
  const tMin = Math.min(0, Math.floor(Math.min(...ort.temperaturen) / 10) * 10);
  const innen = hoehe - oben - unten;
  const y = (t: number): number => oben + innen * (1 - (t - tMin) / (tMax - tMin));
  const spalte = (breite - links - rechts) / MONATE;
  const x = (monat: number): number => links + spalte * (monat + 0.5);
  const gradTicks: number[] = [];
  for (let t = tMin; t <= tMax; t += 10) gradTicks.push(t);
  const mmTicks = gradTicks.filter((t) => t >= 0).map((t) => ({ t, mm: gradAlsNiederschlag(t) }));
  return { breite, hoehe, links, rechts, oben, unten, tMin, tMax, y, x, spalte, gradTicks, mmTicks };
}

/** Fills {name} placeholders of a text with values. */
export function fuelle(text: string, werte: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (all, name: string) => (name in werte ? String(werte[name]) : all));
}

/** A number as the page writes it: one decimal at most, with a comma. */
export function zahl(n: number): string {
  return (Math.round(n * 10) / 10).toString().replace(".", ",");
}

export function liste(monate: string[]): string {
  if (monate.length <= 1) return monate.join("");
  return monate.slice(0, -1).join(", ") + " und " + monate[monate.length - 1];
}
