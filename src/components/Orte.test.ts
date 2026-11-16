import { expect, test } from "vite-plus/test";
import { parse } from "yaml";
import rohdaten from "../data/orte.yaml?raw";
import { humideMonate, jahresmittel, jahressumme, type Ort } from "./KlimaDiagramm.ts";

type Datensatz = Ort & { zone: string; lage: string; land: string; breite: number; hoehe: number; quelle: string };

const orte = parse(rohdaten) as Datensatz[];

test("every place is there once, with twelve plausible values per row and a source", () => {
  expect(orte.length).toBeGreaterThanOrEqual(10);
  expect(new Set(orte.map((o) => o.id)).size).toBe(orte.length);
  for (const o of orte) {
    expect(o.temperaturen, o.id).toHaveLength(12);
    expect(o.niederschlag, o.id).toHaveLength(12);
    for (const t of o.temperaturen) expect(t >= -30 && t <= 40, `${o.id} temperature ${t}`).toBe(true);
    for (const p of o.niederschlag) expect(p >= 0 && p <= 400, `${o.id} precipitation ${p}`).toBe(true);
    expect(o.breite >= 30 && o.breite <= 75, `${o.id} latitude`).toBe(true);
    expect(o.hoehe >= 0 && o.hoehe <= 3000, `${o.id} height`).toBe(true);
    expect(o.quelle.length, `${o.id} source`).toBeGreaterThan(20);
    expect(o.lage.length, `${o.id} position hint`).toBeGreaterThan(20);
    expect(o.lage, `${o.id} hint gives no value`).not.toMatch(/°C|mm Niederschlag/);
    expect(o.name.length).toBeGreaterThan(1);
    expect(["norden", "ozeanisch", "uebergang", "kontinental", "mediterran", "gebirge"], o.id).toContain(o.zone);
  }
});

test("the annual values are in the range known for the place", () => {
  const nach = (id: string): Datensatz => {
    const o = orte.find((x) => x.id === id);
    if (!o) throw new Error(`place ${id} missing`);
    return o;
  };
  expect(jahresmittel(nach("moskau"))).toBeGreaterThan(4);
  expect(jahresmittel(nach("moskau"))).toBeLessThan(8);
  expect(jahresmittel(nach("athen"))).toBeGreaterThan(17);
  expect(jahresmittel(nach("zugspitze"))).toBeLessThan(0);
  expect(jahressumme(nach("bergen"))).toBeGreaterThan(2000);
  expect(jahressumme(nach("madrid"))).toBeLessThan(500);
});

test("the Mediterranean places are arid in summer and humid in winter; Bergen and Reykjavik are humid all year", () => {
  const monate = (id: string): boolean[] => humideMonate(orte.find((o) => o.id === id) as Ort);
  for (const id of ["madrid", "lissabon", "athen"]) {
    const h = monate(id);
    expect(h.slice(5, 8), id).toEqual([false, false, false]);
    expect(h[11], id).toBe(true);
  }
  for (const id of ["bergen", "reykjavik", "zugspitze"]) expect(monate(id).every(Boolean), id).toBe(true);
});
