// The logic of KlimaDetektiv.vue: the learner draws the climate diagram a place probably has, from hints about its
// position, not from a table. The answer is checked by features of the diagram, never value by value: the annual
// mean, the span between the warmest and the coldest month, the months of the warmest and the coldest, the annual
// precipitation, the number of humid months and whether the rain falls in summer or in winter. Each feature has a
// tolerance, so a plausible diagram passes. Pure functions, which the build tests over fixed seeds (the exercise
// contract). The explainer checks an answer with check and gives the message of reason.
import { fuelle, humideMonate, jahresmittel, jahressumme, zahl } from "./KlimaDiagramm.ts";

export type Texte = {
  /** The task, with {ort}. */
  task: string;
  /** The hints, with {ort}, {breite}, {hoehe} and {lage}. */
  hinweise: string;
  /** The message for a missing value, with {monat} and {reihe}. */
  fehlt: string;
  /** The message for a temperature that cannot be: a precipitation entered as a temperature. */
  vertauscht: string;
  /** One message per feature that does not fit; each asks a question and names no value. */
  mittelZuWarm: string;
  mittelZuKalt: string;
  spanneZuGross: string;
  spanneZuKlein: string;
  warmsterMonat: string;
  kaeltesterMonat: string;
  niederschlagZuViel: string;
  niederschlagZuWenig: string;
  humideZuViele: string;
  humideZuWenige: string;
  jahreszeitRegen: string;
  /** The names of the two series. */
  reiheTemperatur: string;
  reiheNiederschlag: string;
  /** The twelve month names. */
  monate: string[];
};

/** The props the logic needs: the places and the texts. */
export interface Props {
  orte: {
    id: string;
    name: string;
    breite: number;
    hoehe: number;
    lage: string;
    temperaturen: number[];
    niederschlag: number[];
  }[];
  texte: Texte[];
}

export interface Task {
  id: string;
  name: string;
  breite: number;
  hoehe: number;
  lage: string;
  temperaturen: number[];
  niederschlag: number[];
}

/** The twelve temperatures and the twelve precipitation sums the learner set; null where nothing is set. */
export interface Answer {
  t: (number | null)[];
  n: (number | null)[];
}

/** How far each feature of the learner's diagram may be from the place's. */
export const TOLERANZ = {
  /** annual mean temperature, °C */
  mittel: 4,
  /** span between the warmest and the coldest month, K */
  spanne: 6,
  /** months between the learner's warmest (coldest) month and the place's */
  monate: 1,
  /** annual precipitation, as a share of the place's, with at least 50 mm */
  niederschlag: 0.3,
  /** number of humid months */
  humide: 1,
  /** the ratio of summer to winter rain, as a difference of the natural logarithms */
  jahreszeit: 0.5,
};

/** A complete answer's twelve values, or null when one is missing. */
type Vollstaendig = { t: number[]; n: number[] };

function vollstaendig(answer: Answer): Vollstaendig | null {
  if (answer.t.length !== 12 || answer.n.length !== 12) return null;
  if (answer.t.some((w) => w === null || w === undefined) || answer.n.some((w) => w === null || w === undefined))
    return null;
  return { t: answer.t as number[], n: answer.n as number[] };
}

/** The features of a diagram. */
export interface Merkmale {
  mittel: number;
  spanne: number;
  /** month index (0 = January) of the warmest month */
  warm: number;
  /** month index of the coldest month */
  kalt: number;
  summe: number;
  humide: number;
  /** ln(rain from April to September / rain from October to March) */
  jahreszeit: number;
}

export function merkmale(temperaturen: number[], niederschlag: number[]): Merkmale {
  const ort = { id: "", name: "", temperaturen, niederschlag };
  const hoechst = Math.max(...temperaturen);
  const tiefst = Math.min(...temperaturen);
  const sommer = niederschlag.slice(3, 9).reduce((a, b) => a + b, 0);
  const winter = [...niederschlag.slice(9), ...niederschlag.slice(0, 3)].reduce((a, b) => a + b, 0);
  return {
    mittel: jahresmittel(ort),
    spanne: hoechst - tiefst,
    warm: temperaturen.indexOf(hoechst),
    kalt: temperaturen.indexOf(tiefst),
    summe: jahressumme(ort),
    humide: humideMonate(ort).filter(Boolean).length,
    jahreszeit: Math.log((sommer + 1) / (winter + 1)),
  };
}

/** The distance of two months of the year, 0 to 6. */
function monatsabstand(a: number, b: number): number {
  const d = Math.abs(a - b) % 12;
  return Math.min(d, 12 - d);
}

/** The features that do not fit, in the order the messages come. */
export type Abweichung =
  | "vertauscht"
  | "mittelZuWarm"
  | "mittelZuKalt"
  | "spanneZuGross"
  | "spanneZuKlein"
  | "warmsterMonat"
  | "kaeltesterMonat"
  | "niederschlagZuViel"
  | "niederschlagZuWenig"
  | "humideZuViele"
  | "humideZuWenige"
  | "jahreszeitRegen";

export function abweichungen(task: Task, answer: Vollstaendig): Abweichung[] {
  const soll = merkmale(task.temperaturen, task.niederschlag);
  const ist = merkmale(answer.t, answer.n);
  const gefunden: Abweichung[] = [];
  // no month of Europe has a mean temperature of more than 45 °C: those are millimetres of precipitation
  if (Math.max(...answer.t) > 45) gefunden.push("vertauscht");
  if (ist.mittel - soll.mittel > TOLERANZ.mittel) gefunden.push("mittelZuWarm");
  if (soll.mittel - ist.mittel > TOLERANZ.mittel) gefunden.push("mittelZuKalt");
  if (ist.spanne - soll.spanne > TOLERANZ.spanne) gefunden.push("spanneZuGross");
  if (soll.spanne - ist.spanne > TOLERANZ.spanne) gefunden.push("spanneZuKlein");
  if (monatsabstand(ist.warm, soll.warm) > TOLERANZ.monate) gefunden.push("warmsterMonat");
  if (monatsabstand(ist.kalt, soll.kalt) > TOLERANZ.monate) gefunden.push("kaeltesterMonat");
  const spielraum = Math.max(50, soll.summe * TOLERANZ.niederschlag);
  if (ist.summe - soll.summe > spielraum) gefunden.push("niederschlagZuViel");
  if (soll.summe - ist.summe > spielraum) gefunden.push("niederschlagZuWenig");
  if (ist.humide - soll.humide > TOLERANZ.humide) gefunden.push("humideZuViele");
  if (soll.humide - ist.humide > TOLERANZ.humide) gefunden.push("humideZuWenige");
  if (Math.abs(ist.jahreszeit - soll.jahreszeit) > TOLERANZ.jahreszeit) gefunden.push("jahreszeitRegen");
  return gefunden;
}

/** A small seeded random generator is not needed: the task numbers go through the places in order. */
function texte(props: Props): Texte {
  const erster = props.texte[0];
  if (!erster) throw new Error("KlimaDetektiv: the texts are missing in the data");
  return erster;
}

/** The task of `seed`: the places one after the other. */
export function generate(seed: number, props: Props): Task {
  const orte = props.orte;
  const ort = orte[(Math.max(1, Math.round(seed)) - 1) % orte.length];
  if (!ort) throw new Error("KlimaDetektiv: no places in the data");
  return {
    id: ort.id,
    name: ort.name,
    breite: ort.breite,
    hoehe: ort.hoehe,
    lage: ort.lage,
    temperaturen: [...ort.temperaturen],
    niederschlag: [...ort.niederschlag],
  };
}

/** Whether every feature of the learner's diagram is within the tolerance of the place's. */
export function check(task: Task, answer: Answer): boolean {
  const voll = vollstaendig(answer);
  return voll !== null && abweichungen(task, voll).length === 0;
}

/** The right answer: the place's values. */
export function solution(task: Task): Answer {
  return { t: [...task.temperaturen], n: [...task.niederschlag] };
}

/** The temperatures of the place shifted by half a year: the warmest month falls into the winter. */
function umgedreht(task: Task): Answer {
  return { t: task.temperaturen.map((_, m) => task.temperaturen[(m + 6) % 12] ?? 0), n: [...task.niederschlag] };
}

/** Every month at the annual mean: no span at all. */
function flach(task: Task): Answer {
  const mittel = jahresmittel({ id: "", name: "", temperaturen: task.temperaturen, niederschlag: task.niederschlag });
  return { t: task.temperaturen.map(() => Math.round(mittel * 10) / 10), n: [...task.niederschlag] };
}

/** A wrong answer: the warmest month in the winter. */
export function wrong(task: Task): Answer {
  return umgedreht(task);
}

/** The answer of each typical mistake of about.mistakes: the seasons swapped, a flat temperature line. */
export function mistakes(task: Task, _props?: Props): (Answer | undefined)[] {
  return [umgedreht(task), flach(task)];
}

/** The app's message for a wrong answer: the first feature that does not fit, as a question, never a value. */
export function reason(task: Task, answer: Answer, props: Props, _lang?: string): string | undefined {
  const t = texte(props);
  for (let m = 0; m < 12; m++) {
    const monat = t.monate[m] ?? "";
    if (answer.t[m] === null || answer.t[m] === undefined) return fuelle(t.fehlt, { monat, reihe: t.reiheTemperatur });
    if (answer.n[m] === null || answer.n[m] === undefined)
      return fuelle(t.fehlt, { monat, reihe: t.reiheNiederschlag });
  }
  const voll = vollstaendig(answer);
  if (!voll) return undefined;
  const erste = abweichungen(task, voll)[0];
  return erste === undefined ? undefined : fuelle(t[erste], { ort: task.name });
}

/** The task as a learner sees it, and its solution. */
export function describe(task: Task, props: Props, _lang: string): { task: string; solution: string } {
  const t = texte(props);
  const werte = { ort: task.name, breite: zahl(task.breite), hoehe: task.hoehe, lage: task.lage };
  const zeilen = task.temperaturen.map(
    (grad, m) => `- ${t.monate[m] ?? ""}: ${zahl(grad)} °C, ${zahl(task.niederschlag[m] ?? 0)} mm`,
  );
  return {
    task: `${fuelle(t.task, werte)} ${fuelle(t.hinweise, werte)}`,
    solution: zeilen.join("\n"),
  };
}

/** The task once, with {ort} and the hints as {breite}, {hoehe} and {lage}. */
export function template(props: Props, _lang: string): string {
  const t = texte(props);
  return `${t.task} ${t.hinweise}`;
}

/** What sets a task: the place and its hints. */
export function params(task: Task, _props: Props, _lang: string): Record<string, string | number> {
  return { ort: task.name, breite: zahl(task.breite), hoehe: task.hoehe, lage: task.lage };
}

/** An answer as text. */
export function show(answer: Answer, _task?: Task, _props?: Props, _lang?: string): string {
  const werte = (reihe: (number | null)[]): string => reihe.map((w) => (w === null ? "–" : zahl(w))).join("; ");
  return `Temperatur in °C: ${werte(answer.t)}. Niederschlag in mm: ${werte(answer.n)}.`;
}

/** What the exercise is, for a tutor. */
export const about = {
  task: "Das Kind bekommt nur Hinweise zu einem Ort (Breite, Höhe, Lage) und zeichnet, wie sein Klimadiagramm aussehen könnte: zwölf Temperaturen und zwölf Niederschlagssummen, im Achsenkreuz oder in Zahlenfeldern. Danach drückt es „Prüfen“.",
  answer: "Zwölf Temperaturen in °C und zwölf Niederschlagssummen in mm, wie es sie gezeichnet hat.",
  correct:
    "Richtig, wenn Jahresmittel (höchstens 4 °C daneben), Temperaturspanne (6 K), wärmster und kältester Monat (1 Monat), Jahresniederschlag (30 %), Zahl der humiden Monate (1) und die Verteilung des Regens auf Sommer und Winter zum Ort passen. Ein anderer, aber plausibler Verlauf kann bestehen.",
  mistakes: [
    "Den Jahresverlauf der Temperatur um ein halbes Jahr verschoben: der wärmste Monat liegt im Winter.",
    "Eine flache Temperaturlinie gezeichnet: kein Unterschied zwischen Sommer und Winter.",
  ],
};
