// The logic of ZeichneDiagramm.vue: the learner draws the climate diagram of a place from a table of its twelve
// monthly values. A task is a place (from the data file); an answer is twelve temperatures and twelve precipitation
// sums, null where the learner has set none yet. Pure functions, which the build tests over fixed seeds (the exercise
// contract). The explainer checks an answer with check and gives the message of reason.
import { fuelle, zahl } from "./KlimaDiagramm.ts";

export type Texte = {
  /** The task, with {ort}. */
  task: string;
  /** The message for a missing value, with {monat} and {reihe}. */
  fehlt: string;
  /** The message when the columns are only half as high as the table says. */
  saeulenHalb: string;
  /** The message when temperature and precipitation are swapped. */
  vertauscht: string;
  /** The message for a temperature that does not fit the table, with {monat}. */
  temperaturFalsch: string;
  /** The message for a precipitation that does not fit the table, with {monat}. */
  niederschlagFalsch: string;
  /** The names of the two series, for the message of a missing value. */
  reiheTemperatur: string;
  reiheNiederschlag: string;
  /** The twelve month names. */
  monate: string[];
};

/** The props the logic needs: the places and the texts. */
export interface Props {
  orte: { id: string; name: string; temperaturen: number[]; niederschlag: number[] }[];
  texte: Texte[];
}

export interface Task {
  id: string;
  name: string;
  temperaturen: number[];
  niederschlag: number[];
}

/** The twelve temperatures and the twelve precipitation sums the learner set; null where nothing is set. */
export interface Answer {
  t: (number | null)[];
  n: (number | null)[];
}

/** A temperature may be this far off (°C). */
export const TOLERANZ_GRAD = 1;

/** A precipitation may be this far off (mm): the squeezed scale above 100 mm allows more. */
export function toleranzMm(soll: number): number {
  return soll <= 100 ? 10 : 25;
}

/** A small seeded random generator (mulberry32). */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function texte(props: Props): Texte {
  const erster = props.texte[0];
  if (!erster) throw new Error("ZeichneDiagramm: the texts are missing in the data");
  return erster;
}

/** The task of `seed`: one place of the data. */
export function generate(seed: number, props: Props): Task {
  const next = random(seed);
  const orte = props.orte;
  const ort = orte[Math.floor(next() * orte.length)] ?? orte[0];
  if (!ort) throw new Error("ZeichneDiagramm: no places in the data");
  return { id: ort.id, name: ort.name, temperaturen: [...ort.temperaturen], niederschlag: [...ort.niederschlag] };
}

const nahe = (ist: number | null, soll: number, toleranz: number): boolean =>
  ist !== null && Math.abs(ist - soll) <= toleranz;

function temperaturOk(task: Task, answer: Answer, m: number): boolean {
  return nahe(answer.t[m] ?? null, task.temperaturen[m] ?? 0, TOLERANZ_GRAD);
}

function niederschlagOk(task: Task, answer: Answer, m: number): boolean {
  const soll = task.niederschlag[m] ?? 0;
  return nahe(answer.n[m] ?? null, soll, toleranzMm(soll));
}

/** Whether every month's temperature and precipitation are within the tolerance of the table. */
export function check(task: Task, answer: Answer): boolean {
  return task.temperaturen.every((_, m) => temperaturOk(task, answer, m) && niederschlagOk(task, answer, m));
}

/** The right answer: the values of the table. */
export function solution(task: Task): Answer {
  return { t: [...task.temperaturen], n: [...task.niederschlag] };
}

/** The columns read on the left axis: only half as high as they should be. */
function saeulenHalb(task: Task): Answer {
  return { t: [...task.temperaturen], n: task.niederschlag.map((n) => n / 2) };
}

/** Temperature and precipitation swapped. */
function vertauscht(task: Task): Answer {
  return { t: [...task.niederschlag], n: task.temperaturen.map((t) => Math.max(0, t)) };
}

/** A wrong answer: the columns half as high. */
export function wrong(task: Task): Answer {
  return saeulenHalb(task);
}

/** The answer of each typical mistake of about.mistakes: the columns half as high, the two series swapped. */
export function mistakes(task: Task, _props?: Props): (Answer | undefined)[] {
  return [saeulenHalb(task), vertauscht(task)];
}

/** Whether a mistake's answer is what the learner gave, within the tolerance of its pattern. */
function gleich(task: Task, answer: Answer, muster: Answer): boolean {
  return task.temperaturen.every(
    (_, m) =>
      nahe(answer.t[m] ?? null, muster.t[m] ?? 0, TOLERANZ_GRAD) &&
      nahe(answer.n[m] ?? null, muster.n[m] ?? 0, toleranzMm((muster.n[m] ?? 0) * 2)),
  );
}

/** The app's message for a wrong answer: what does not fit and where to look, never the values. */
export function reason(task: Task, answer: Answer, props: Props, _lang?: string): string | undefined {
  if (check(task, answer)) return undefined;
  const t = texte(props);
  for (let m = 0; m < 12; m++) {
    const monat = t.monate[m] ?? "";
    if (answer.t[m] === null || answer.t[m] === undefined) return fuelle(t.fehlt, { monat, reihe: t.reiheTemperatur });
    if (answer.n[m] === null || answer.n[m] === undefined)
      return fuelle(t.fehlt, { monat, reihe: t.reiheNiederschlag });
  }
  if (gleich(task, answer, saeulenHalb(task))) return t.saeulenHalb;
  if (gleich(task, answer, vertauscht(task))) return t.vertauscht;
  for (let m = 0; m < 12; m++) {
    const monat = t.monate[m] ?? "";
    if (!temperaturOk(task, answer, m)) return fuelle(t.temperaturFalsch, { monat });
    if (!niederschlagOk(task, answer, m)) return fuelle(t.niederschlagFalsch, { monat });
  }
  return undefined;
}

/** The task as a learner sees it, and its solution. */
export function describe(task: Task, props: Props, _lang: string): { task: string; solution: string } {
  const t = texte(props);
  const zeilen = task.temperaturen.map(
    (grad, m) => `- ${t.monate[m] ?? ""}: ${zahl(grad)} °C, ${zahl(task.niederschlag[m] ?? 0)} mm`,
  );
  return {
    task: fuelle(t.task, { ort: task.name }),
    solution: zeilen.join("\n"),
  };
}

/** The task once, with {ort} for the place. */
export function template(props: Props, _lang: string): string {
  return texte(props).task;
}

/** What sets a task: the place. */
export function params(task: Task, _props: Props, _lang: string): Record<string, string> {
  return { ort: task.name };
}

/** An answer as text. */
export function show(answer: Answer, _task?: Task, _props?: Props, _lang?: string): string {
  const werte = (reihe: (number | null)[]): string => reihe.map((w) => (w === null ? "–" : zahl(w))).join("; ");
  return `Temperatur in °C: ${werte(answer.t)}. Niederschlag in mm: ${werte(answer.n)}.`;
}

/** What the exercise is, for a tutor. */
export const about = {
  task: "Das Kind bekommt die zwölf Monatswerte von Temperatur und Niederschlag eines Ortes als Tabelle und zeichnet daraus das Klimadiagramm: Es wählt einen Monat, tippt im Achsenkreuz auf die Höhe oder schreibt die Zahl in ein Feld, einmal für die Temperatur und einmal für den Niederschlag. Danach drückt es „Prüfen“.",
  answer: "Zwölf Temperaturen in °C und zwölf Niederschlagssummen in mm, wie es sie eingetragen hat.",
  correct:
    "Richtig, wenn jede Temperatur höchstens 1 °C und jeder Niederschlag höchstens 10 mm (über 100 mm: 25 mm) von der Tabelle abweicht.",
  mistakes: [
    "Den Niederschlag an der linken Achse abgelesen: Die Säulen sind nur halb so hoch wie in der Tabelle.",
    "Temperatur und Niederschlag vertauscht: die Zahlen der einen Reihe in die andere eingetragen.",
  ],
};
