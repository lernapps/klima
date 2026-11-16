import { expect, test } from "vite-plus/test";
import {
  fuelle,
  gradAlsNiederschlag,
  humideMonate,
  istHumid,
  jahresmittel,
  jahressumme,
  layout,
  liste,
  niederschlagAlsGrad,
  zahl,
  type Ort,
} from "./KlimaDiagramm.ts";

const madrid: Ort = {
  id: "madrid",
  name: "Madrid",
  temperaturen: [6.3, 7.9, 11.2, 12.9, 16.7, 22.2, 25.6, 25.1, 20.9, 15.1, 9.9, 6.9],
  niederschlag: [33, 34, 25, 45, 50, 21, 12, 10, 22, 60, 58, 51],
};

test("the scales are level 1:2 and squeezed above 100 mm, and they are each other's inverse", () => {
  expect(niederschlagAlsGrad(40)).toBe(20);
  expect(niederschlagAlsGrad(100)).toBe(50);
  expect(niederschlagAlsGrad(200)).toBe(60);
  for (const mm of [0, 12, 99, 100, 101, 250]) expect(gradAlsNiederschlag(niederschlagAlsGrad(mm))).toBeCloseTo(mm, 9);
});

test("a month is humid when the column rises above the line (mm > 2 · °C)", () => {
  expect(istHumid(10, 21)).toBe(true);
  expect(istHumid(10, 20)).toBe(false);
  expect(istHumid(-5, 0)).toBe(true);
  // Madrid: the summer is arid, May and the winter months are humid
  const humid = humideMonate(madrid);
  expect(humid.slice(5, 9)).toEqual([false, false, false, false]);
  expect(humid[0]).toBe(true);
  expect(humid[4]).toBe(true);
  expect(humid[9]).toBe(true);
});

test("annual mean and annual sum", () => {
  expect(jahresmittel(madrid)).toBeCloseTo(15.06, 1);
  expect(jahressumme(madrid)).toBe(421);
});

test("the layout keeps every month and every value inside the drawing", () => {
  const l = layout(madrid);
  expect(l.tMax).toBeGreaterThanOrEqual(30);
  for (let m = 0; m < 12; m++) {
    expect(l.x(m)).toBeGreaterThan(l.links);
    expect(l.x(m)).toBeLessThan(l.breite - l.rechts);
    expect(l.y(madrid.temperaturen[m] ?? 0)).toBeGreaterThanOrEqual(l.oben);
    expect(l.y(madrid.temperaturen[m] ?? 0)).toBeLessThanOrEqual(l.hoehe - l.unten);
  }
  const nass: Ort = { ...madrid, niederschlag: madrid.niederschlag.map(() => 250) };
  expect(layout(nass).tMax).toBeGreaterThanOrEqual(niederschlagAlsGrad(250));
  const kalt: Ort = { ...madrid, temperaturen: madrid.temperaturen.map(() => -12) };
  expect(layout(kalt).tMin).toBe(-20);
});

test("the right axis ticks stand level with the left ones", () => {
  const l = layout(madrid);
  expect(l.mmTicks.find((t) => t.t === 10)?.mm).toBe(20);
  const nass: Ort = { ...madrid, niederschlag: madrid.niederschlag.map(() => 250) };
  expect(layout(nass).mmTicks.find((t) => t.t === 50)?.mm).toBe(100);
  expect(layout(nass).mmTicks.find((t) => t.t === 60)?.mm).toBe(200);
});

test("text helpers", () => {
  expect(fuelle("{monat}: {t} °C", { monat: "Juli", t: "25,6" })).toBe("Juli: 25,6 °C");
  expect(fuelle("{unbekannt}", {})).toBe("{unbekannt}");
  expect(zahl(25.64)).toBe("25,6");
  expect(zahl(3)).toBe("3");
  expect(liste(["Mai", "Juni", "Juli"])).toBe("Mai, Juni und Juli");
  expect(liste(["Mai"])).toBe("Mai");
  expect(liste([])).toBe("");
});
