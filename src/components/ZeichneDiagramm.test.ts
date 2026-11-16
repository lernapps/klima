import { expect, test } from "vite-plus/test";
import {
  about,
  check,
  describe,
  generate,
  mistakes,
  params,
  reason,
  show,
  solution,
  template,
  toleranzMm,
  wrong,
  type Answer,
  type Props,
} from "./ZeichneDiagramm.ts";

const props: Props = {
  orte: [
    {
      id: "madrid",
      name: "Madrid",
      temperaturen: [6.3, 7.9, 11.2, 12.9, 16.7, 22.2, 25.6, 25.1, 20.9, 15.1, 9.9, 6.9],
      niederschlag: [33, 34, 25, 45, 50, 21, 12, 10, 22, 60, 58, 51],
    },
    {
      id: "bergen",
      name: "Bergen",
      temperaturen: [2.6, 2.5, 4.1, 7.5, 10.9, 13.9, 16.0, 15.9, 13.0, 8.9, 5.4, 3.1],
      niederschlag: [252, 209, 202, 138, 109, 132, 158, 208, 251, 275, 272, 288],
    },
    {
      id: "zugspitze",
      name: "Zugspitze",
      temperaturen: [-10.3, -11.1, -9.1, -6.4, -2.4, 1.4, 3.2, 3.6, 0.4, -2.1, -6.2, -9.4],
      niederschlag: [176.5, 157.4, 208.1, 171.7, 192.7, 181.4, 184.5, 184.6, 150.2, 127.6, 157.4, 183.3],
    },
  ],
  texte: [
    {
      task: "Zeichne das Klimadiagramm von {ort}.",
      fehlt: "Im {monat} fehlt noch die {reihe}.",
      saeulenHalb: "Deine Säulen sind nur halb so hoch wie nötig.",
      vertauscht: "Temperatur und Niederschlag sind vertauscht.",
      temperaturFalsch: "Im {monat} passt die Temperatur nicht zur Tabelle.",
      niederschlagFalsch: "Im {monat} passt der Niederschlag nicht zur Tabelle.",
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
    },
  ],
};

test("the table's values are right; the typical mistakes and an empty answer are wrong", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const task = generate(seed, props);
    expect(check(task, solution(task))).toBe(true);
    expect(check(task, wrong(task))).toBe(false);
    for (const answer of mistakes(task)) if (answer !== undefined) expect(check(task, answer)).toBe(false);
    expect(check(task, { t: Array(12).fill(null), n: Array(12).fill(null) })).toBe(false);
  }
});

test("the same seed gives the same place; the seeds reach every place", () => {
  expect(generate(7, props)).toEqual(generate(7, props));
  const ids = new Set(Array.from({ length: 50 }, (_, i) => generate(i + 1, props).id));
  expect(ids.size).toBe(props.orte.length);
});

test("values inside the tolerance are right, one month outside is wrong", () => {
  const task = generate(1, props);
  const knapp = {
    t: task.temperaturen.map((t) => t + 0.9),
    n: task.niederschlag.map((n) => n - toleranzMm(n)),
  };
  expect(check(task, knapp)).toBe(true);
  const daneben: Answer = { ...knapp, t: knapp.t.map((t, m) => (m === 3 ? t + 0.5 : t)) };
  expect(check(task, daneben)).toBe(false);
});

test("each wrong answer gets the message that names what does not fit, and never the values", () => {
  const task = generate(1, props);
  const [halb, getauscht] = mistakes(task);
  expect(reason(task, halb as Answer, props)).toBe(props.texte[0]?.saeulenHalb);
  expect(reason(task, getauscht as Answer, props)).toBe(props.texte[0]?.vertauscht);
  const falsch = solution(task);
  falsch.t[6] = (falsch.t[6] ?? 0) + 5;
  expect(reason(task, falsch, props)).toBe("Im Juli passt die Temperatur nicht zur Tabelle.");
  const andere = solution(task);
  andere.n[2] = (andere.n[2] ?? 0) + 80;
  expect(reason(task, andere, props)).toBe("Im März passt der Niederschlag nicht zur Tabelle.");
  const fehlt = solution(task);
  fehlt.n[4] = null;
  expect(reason(task, fehlt, props)).toBe("Im Mai fehlt noch die Niederschlag.");
  expect(reason(task, solution(task), props)).toBeUndefined();
});

test("describe, template, params and show", () => {
  const task = generate(1, props);
  const d = describe(task, props, "de");
  expect(d.task).toBe(`Zeichne das Klimadiagramm von ${task.name}.`);
  expect(d.solution.split("\n")).toHaveLength(12);
  expect(template(props, "de")).toBe("Zeichne das Klimadiagramm von {ort}.");
  expect(params(task, props, "de")).toEqual({ ort: task.name });
  expect(show({ t: [1.5, null, ...Array(10).fill(0)], n: Array(12).fill(10) }, task)).toContain("1,5; –");
  expect(about.mistakes).toHaveLength(mistakes(task).length);
});
