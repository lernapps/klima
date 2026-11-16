import { expect, test } from "vite-plus/test";
import { parse } from "yaml";
import rohdaten from "../data/orte.yaml?raw";
import {
  abweichungen,
  check,
  generate,
  merkmale,
  mistakes,
  reason,
  solution,
  wrong,
  type Answer,
  type Props,
  type Texte,
} from "./KlimaDetektiv.ts";

const orte = parse(rohdaten) as (Props["orte"][number] & { zone: string })[];
const zoneVon = (id: string): string | undefined => orte.find((o) => o.id === id)?.zone;
const nachricht = (name: string): string => `Meldung ${name} für {ort}`;
const texte: Texte = {
  task: "Wie sieht das Klimadiagramm für {ort} aus?",
  hinweise: "Hinweise: {breite} °N, {hoehe} m, {lage}.",
  fehlt: "Im {monat} fehlt noch die {reihe}.",
  vertauscht: nachricht("vertauscht"),
  mittelZuWarm: nachricht("mittelZuWarm"),
  mittelZuKalt: nachricht("mittelZuKalt"),
  spanneZuGross: nachricht("spanneZuGross"),
  spanneZuKlein: nachricht("spanneZuKlein"),
  warmsterMonat: nachricht("warmsterMonat"),
  kaeltesterMonat: nachricht("kaeltesterMonat"),
  niederschlagZuViel: nachricht("niederschlagZuViel"),
  niederschlagZuWenig: nachricht("niederschlagZuWenig"),
  humideZuViele: nachricht("humideZuViele"),
  humideZuWenige: nachricht("humideZuWenige"),
  jahreszeitRegen: nachricht("jahreszeitRegen"),
  reiheTemperatur: "Temperatur",
  reiheNiederschlag: "Niederschlag",
  monate: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
};
const props: Props = { orte, texte: [texte] };
const aufgaben = orte.map((_, i) => generate(i + 1, props));

test("the places' own values are right for every place; the typical mistakes are wrong", () => {
  for (const task of aufgaben) {
    expect(check(task, solution(task)), task.id).toBe(true);
    expect(check(task, wrong(task)), task.id).toBe(false);
    for (const answer of mistakes(task)) if (answer !== undefined) expect(check(task, answer), task.id).toBe(false);
    expect(check(task, { t: Array(12).fill(null), n: Array(12).fill(null) }), task.id).toBe(false);
  }
});

test("the diagram of one place is never right for a place of another climate zone", () => {
  // places of one zone (Tromsø and Reykjavik, Bergen and Brest, the Mediterranean places) may pass for each other
  for (const a of aufgaben)
    for (const b of aufgaben) {
      if (zoneVon(a.id) === zoneVon(b.id)) continue;
      expect(check(a, solution(b)), `${b.id} must not pass as ${a.id}`).toBe(false);
    }
});

test("a plausible, slightly different diagram passes: a bit warmer, a bit wetter", () => {
  for (const task of aufgaben) {
    const nah: Answer = { t: task.temperaturen.map((t) => t + 1.5), n: task.niederschlag.map((n) => n * 1.1) };
    expect(check(task, nah), task.id).toBe(true);
  }
});

test("each feature outside its tolerance is found and named by its message", () => {
  const task = generate(1, props);
  const s = solution(task);
  const zuWarm = { ...s, t: (s.t as number[]).map((t) => t + 7) };
  expect(reason(task, zuWarm, props)).toBe("Meldung mittelZuWarm für Reykjavik");
  const zuKalt = { ...s, t: (s.t as number[]).map((t) => t - 7) };
  expect(reason(task, zuKalt, props)).toBe("Meldung mittelZuKalt für Reykjavik");
  const zuViel = { ...s, n: (s.n as number[]).map((n) => n * 2) };
  expect(abweichungen(task, { t: zuViel.t as number[], n: zuViel.n as number[] })).toContain("niederschlagZuViel");
  const zuWenig = { ...s, n: (s.n as number[]).map((n) => n * 0.2) };
  expect(abweichungen(task, { t: zuWenig.t as number[], n: zuWenig.n as number[] })).toContain("niederschlagZuWenig");
  expect(reason(task, solution(task), props)).toBeUndefined();
  const fehlt = solution(task);
  fehlt.t[2] = null;
  expect(reason(task, fehlt, props)).toBe("Im März fehlt noch die Temperatur.");
});

test("a precipitation entered as a temperature is found first", () => {
  const task = generate(7, props);
  const falsch = { t: task.niederschlag, n: task.temperaturen };
  expect(reason(task, falsch, props)).toBe("Meldung vertauscht für Madrid");
});

test("the seasons swapped are found by the warmest month, the flat line by the span", () => {
  const task = generate(5, props);
  const [umgekehrt, flach] = mistakes(task) as Answer[];
  expect(abweichungen(task, { t: umgekehrt?.t as number[], n: umgekehrt?.n as number[] })).toContain("warmsterMonat");
  expect(abweichungen(task, { t: flach?.t as number[], n: flach?.n as number[] })).toContain("spanneZuKlein");
});

test("the features of a diagram: Madrid is arid in summer, Bergen is humid all year", () => {
  const madrid = orte.find((o) => o.id === "madrid");
  const bergen = orte.find((o) => o.id === "bergen");
  expect(madrid && merkmale(madrid.temperaturen, madrid.niederschlag).humide).toBe(8);
  expect(bergen && merkmale(bergen.temperaturen, bergen.niederschlag).humide).toBe(12);
  expect(madrid && merkmale(madrid.temperaturen, madrid.niederschlag).warm).toBe(6);
});

test("the task numbers go through the places and start again", () => {
  expect(generate(1, props).id).toBe(orte[0]?.id);
  expect(generate(orte.length + 1, props).id).toBe(orte[0]?.id);
  expect(new Set(Array.from({ length: orte.length }, (_, i) => generate(i + 1, props).id)).size).toBe(orte.length);
});
