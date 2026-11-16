<script setup lang="ts">
// The learner draws the climate diagram of a place from its table. The axes are drawn; the learner sets, month by
// month, a temperature (the red line) and a precipitation (the blue column): by tapping the height in the chart or by
// writing the number in a field. Only what the learner set is drawn, nothing of the right answer. Its logic is in
// ZeichneDiagramm.ts. It is the input of the task: it emits what the learner set with answer, and the explainer draws
// "Prüfen", checks the answer and gives the message of a typical mistake.
import { computed, ref } from "vue";
import { gradAlsNiederschlag, layout, niederschlagAlsGrad, zahl, fuelle, KNICK_MM, type Ort } from "./KlimaDiagramm.ts";
import { generate, type Answer } from "./ZeichneDiagramm.ts";

type Texte = {
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
  /** The names of the two series. */
  reiheTemperatur: string;
  reiheNiederschlag: string;
  /** The twelve month names. */
  monate: string[];
};

type Anzeige = {
  /** The task, with {ort}. */
  task: string;
  /** What a screen reader hears for the chart, with {ort}. */
  alt: string;
  /** The caption of the table. */
  tabelle: string;
  /** The three column heads of the table. */
  kopfMonat: string;
  kopfTemperatur: string;
  kopfNiederschlag: string;
  /** What to do with the chart. */
  anleitung: string;
  /** The label of the choice of the series, and its two options. */
  reiheWahl: string;
  reiheTemperatur: string;
  reiheNiederschlag: string;
  /** The selected month: "Monat: {monat}". */
  monatKopf: string;
  /** The fields for the selected month. */
  feldTemperatur: string;
  feldNiederschlag: string;
  /** The buttons to go to the previous and next month, and to start again. */
  zurueck: string;
  weiter: string;
  zuruecksetzen: string;
  /** How many of the 24 values are set, with {n}. */
  zaehler: string;
  /** The legend of the drawing. */
  legendeTemperatur: string;
  legendeNiederschlag: string;
  achseGrad: string;
  achseMm: string;
  /** The note for an input that is no number, and for one outside the axes, with {wert}. */
  keineZahl: string;
  begrenzt: string;
  /** The twelve month names and their short forms. */
  monate: string[];
  monateKurz: string[];
};

const props = defineProps<{
  /** The records of the data file: the places. */
  orte: { id: string; name: string; temperaturen: number[]; niederschlag: number[] }[];
  /** The one record of the data file with the texts of the logic. */
  texte: Texte[];
  /** The one record of the data file with the texts of the screen. */
  anzeige: Anzeige[];
  /** The task number, which the explainer gives. */
  seed: number;
  /** Whether the explainer checked the answer the learner gives now. */
  checked: boolean;
}>();
const emit = defineEmits<{ answer: [Answer | undefined] }>();

const az = computed<Anzeige>(() => {
  const erster = props.anzeige[0];
  if (!erster) throw new Error("ZeichneDiagramm: the texts of the screen are missing in the data");
  return erster;
});
const aufgabe = computed(() => generate(props.seed, { orte: props.orte, texte: props.texte }));
// the axes come from the place, as every drawing of a climate diagram has a scale; they do not show the values
const achsen = computed(() => {
  const ort: Ort = {
    id: aufgabe.value.id,
    name: aufgabe.value.name,
    temperaturen: aufgabe.value.temperaturen,
    niederschlag: aufgabe.value.niederschlag,
  };
  return layout(ort, 360);
});

const t = ref<(number | null)[]>(Array.from({ length: 12 }, () => null));
const n = ref<(number | null)[]>(Array.from({ length: 12 }, () => null));
const monat = ref(0);
const meldung = ref("");
const reihe = ref<"t" | "n">("t");
const svg = ref<SVGSVGElement | null>(null);
const gesetzt = computed(() => t.value.filter((w) => w !== null).length + n.value.filter((w) => w !== null).length);

function melde(): void {
  emit("answer", gesetzt.value === 0 ? undefined : { t: [...t.value], n: [...n.value] });
}

function begrenze(wert: number, von: number, bis: number): number {
  return Math.min(bis, Math.max(von, wert));
}

function setzeT(m: number, wert: number | null): void {
  const vorher = t.value.filter((w) => w !== null).length;
  t.value[m] = wert === null ? null : Math.round(begrenze(wert, achsen.value.tMin, achsen.value.tMax) * 10) / 10;
  // all twelve temperatures set and no precipitation yet: go on with the precipitation
  if (vorher < 12 && t.value.every((w) => w !== null) && n.value.every((w) => w === null)) reihe.value = "n";
  melde();
}

function setzeN(m: number, wert: number | null): void {
  n.value[m] = wert === null ? null : Math.round(begrenze(wert, 0, gradAlsNiederschlag(achsen.value.tMax)));
  melde();
}

/** The month under an x of the drawing, and the value level with a y of it. */
function klick(ereignis: MouseEvent): void {
  const element = svg.value;
  if (!element) return;
  const rechteck = element.getBoundingClientRect();
  const a = achsen.value;
  const x = ((ereignis.clientX - rechteck.left) / rechteck.width) * a.breite;
  const y = ((ereignis.clientY - rechteck.top) / rechteck.height) * a.hoehe;
  const m = Math.floor((x - a.links) / a.spalte);
  if (m < 0 || m > 11 || y < a.oben || y > a.hoehe - a.unten) return;
  monat.value = m;
  const grad = a.tMin + (1 - (y - a.oben) / (a.hoehe - a.oben - a.unten)) * (a.tMax - a.tMin);
  if (reihe.value === "t") setzeT(m, Math.round(grad));
  else setzeN(m, Math.round(gradAlsNiederschlag(Math.max(0, grad))));
}

function feld(ereignis: Event, art: "t" | "n"): void {
  const eingabe = ereignis.target as HTMLInputElement;
  const text = eingabe.value.trim().replace(",", ".");
  meldung.value = "";
  if (text === "") {
    if (art === "t") setzeT(monat.value, null);
    else setzeN(monat.value, null);
    return;
  }
  const wert = Number(text);
  if (!Number.isFinite(wert)) {
    meldung.value = fuelle(az.value.keineZahl, { wert: eingabe.value });
    eingabe.value = feldWert((art === "t" ? t.value[monat.value] : n.value[monat.value]) ?? null);
    return;
  }
  if (art === "t") setzeT(monat.value, wert);
  else setzeN(monat.value, wert);
  const gesetzt = art === "t" ? t.value[monat.value] : n.value[monat.value];
  if (gesetzt !== null && gesetzt !== undefined && gesetzt !== wert) {
    meldung.value = fuelle(az.value.begrenzt, { wert: zahl(gesetzt) });
    eingabe.value = feldWert(gesetzt);
  }
}

/** Arrow keys on a month: up and down change the value of the series chosen, left and right go to the next month. */
function taste(ereignis: KeyboardEvent, m: number): void {
  const schlüssel = ereignis.key;
  if (schlüssel === "ArrowLeft" || schlüssel === "ArrowRight") {
    ereignis.preventDefault();
    const ziel = (schlüssel === "ArrowLeft" ? -1 : 1) + m;
    if (ziel < 0 || ziel > 11) return;
    monat.value = ziel;
    const geschwister = (ereignis.currentTarget as SVGElement).parentElement?.children[ziel];
    if (geschwister instanceof SVGElement) geschwister.focus();
    return;
  }
  if (schlüssel !== "ArrowUp" && schlüssel !== "ArrowDown") return;
  ereignis.preventDefault();
  monat.value = m;
  const richtung = schlüssel === "ArrowUp" ? 1 : -1;
  if (reihe.value === "t") setzeT(m, (t.value[m] ?? 10) + richtung);
  else setzeN(m, (n.value[m] ?? 50) + richtung * 5);
}

function zuruecksetzen(): void {
  t.value = Array.from({ length: 12 }, () => null);
  n.value = Array.from({ length: 12 }, () => null);
  monat.value = 0;
  melde();
}

function gehe(schritt: number): void {
  monat.value = (monat.value + schritt + 12) % 12;
}

const linie = computed(() =>
  t.value
    .map((wert, m) => (wert === null ? null : `${achsen.value.x(m).toFixed(1)},${achsen.value.y(wert).toFixed(1)}`))
    .filter((p): p is string => p !== null)
    .join(" "),
);
const saeulen = computed(() =>
  n.value.flatMap((wert, m) => {
    if (wert === null) return [];
    const a = achsen.value;
    const w = a.spalte * 0.5;
    return [{ m, x: a.x(m) - w / 2, w, oben: a.y(niederschlagAlsGrad(wert)), unten: a.y(0), hoch: wert > KNICK_MM }];
  }),
);
const feldWert = (wert: number | null): string => (wert === null ? "" : zahl(wert));
</script>

<template>
  <div class="zeichne-diagramm">
    <p>{{ fuelle(az.task, { ort: aufgabe.name }) }}</p>
    <table class="zd-tabelle">
      <caption>
        {{
          az.tabelle
        }}
      </caption>
      <thead>
        <tr>
          <th scope="col">{{ az.kopfMonat }}</th>
          <th scope="col">{{ az.kopfTemperatur }}</th>
          <th scope="col">{{ az.kopfNiederschlag }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(grad, m) in aufgabe.temperaturen" :key="`z-${m}`">
          <th scope="row">{{ az.monate[m] }}</th>
          <td>{{ zahl(grad) }}</td>
          <td>{{ zahl(aufgabe.niederschlag[m] ?? 0) }}</td>
        </tr>
      </tbody>
    </table>
    <p>{{ az.anleitung }}</p>
    <fieldset class="zd-reihe">
      <legend>{{ az.reiheWahl }}</legend>
      <label><input v-model="reihe" type="radio" value="t" /> {{ az.reiheTemperatur }}</label>
      <label><input v-model="reihe" type="radio" value="n" /> {{ az.reiheNiederschlag }}</label>
    </fieldset>
    <svg
      ref="svg"
      :viewBox="`0 0 ${achsen.breite} ${achsen.hoehe}`"
      role="group"
      :aria-label="fuelle(az.alt, { ort: aufgabe.name })"
      @click="klick"
    >
      <g class="zd-gitter">
        <line
          v-for="g in achsen.gradTicks"
          :key="`g-${g}`"
          :x1="achsen.links"
          :x2="achsen.breite - achsen.rechts"
          :y1="achsen.y(g)"
          :y2="achsen.y(g)"
        />
      </g>
      <g class="zd-achse" aria-hidden="true">
        <text
          v-for="g in achsen.gradTicks"
          :key="`l-${g}`"
          :x="achsen.links - 6"
          :y="achsen.y(g) + 4"
          text-anchor="end"
        >
          {{ g }}
        </text>
        <text
          v-for="tick in achsen.mmTicks"
          :key="`r-${tick.t}`"
          :x="achsen.breite - achsen.rechts + 6"
          :y="achsen.y(tick.t) + 4"
        >
          {{ tick.mm }}
        </text>
        <text :x="achsen.links - 6" :y="achsen.oben - 7" text-anchor="end" class="zd-temp-text">
          {{ az.achseGrad }}
        </text>
        <text :x="achsen.breite - achsen.rechts + 6" :y="achsen.oben - 7" class="zd-nied-text">{{ az.achseMm }}</text>
        <text
          v-for="m in 12"
          :key="`m-${m}`"
          :x="achsen.x(m - 1)"
          :y="achsen.hoehe - achsen.unten + 16"
          text-anchor="middle"
        >
          {{ az.monateKurz[m - 1] }}
        </text>
      </g>
      <line
        class="zd-null"
        :x1="achsen.links"
        :x2="achsen.breite - achsen.rechts"
        :y1="achsen.y(0)"
        :y2="achsen.y(0)"
      />
      <rect
        class="zd-auswahl"
        :x="achsen.x(monat) - achsen.spalte / 2"
        :y="achsen.oben"
        :width="achsen.spalte"
        :height="achsen.hoehe - achsen.oben - achsen.unten"
      />
      <g>
        <template v-for="s in saeulen" :key="`s-${s.m}`">
          <rect
            class="zd-saeule"
            :x="s.x"
            :y="s.oben"
            :width="s.w"
            :height="Math.max(0, s.unten - s.oben)"
            :class="{ 'zd-saeule-hoch': s.hoch }"
          />
        </template>
      </g>
      <polyline v-if="linie" class="zd-linie" :points="linie" fill="none" />
      <g>
        <template v-for="(wert, m) in t" :key="`p-${m}`">
          <circle v-if="wert !== null" class="zd-punkt" :cx="achsen.x(m)" :cy="achsen.y(wert)" r="3.5" />
        </template>
      </g>
      <g>
        <rect
          v-for="m in 12"
          :key="`h-${m}`"
          class="zd-treffer"
          role="button"
          tabindex="0"
          :aria-label="az.monate[m - 1]"
          :aria-pressed="monat === m - 1"
          :x="achsen.x(m - 1) - achsen.spalte / 2"
          :y="achsen.oben"
          :width="achsen.spalte"
          :height="achsen.hoehe - achsen.oben"
          @keydown.enter.prevent.stop="monat = m - 1"
          @keydown.space.prevent.stop="monat = m - 1"
          @keydown.arrow-up.stop="taste($event, m - 1)"
          @keydown.arrow-down.stop="taste($event, m - 1)"
          @keydown.arrow-left.stop="taste($event, m - 1)"
          @keydown.arrow-right.stop="taste($event, m - 1)"
        />
      </g>
    </svg>
    <ul class="zd-legende">
      <li><span class="zd-zeichen zd-zeichen-linie"></span>{{ az.legendeTemperatur }}</li>
      <li><span class="zd-zeichen zd-zeichen-saeule"></span>{{ az.legendeNiederschlag }}</li>
    </ul>
    <div class="zd-monat">
      <p class="zd-monatname">{{ fuelle(az.monatKopf, { monat: az.monate[monat] ?? "" }) }}</p>
      <div class="zd-felder">
        <label>
          {{ az.feldTemperatur }}
          <input type="text" inputmode="decimal" :value="feldWert(t[monat] ?? null)" @change="feld($event, 't')" />
        </label>
        <label>
          {{ az.feldNiederschlag }}
          <input type="text" inputmode="decimal" :value="feldWert(n[monat] ?? null)" @change="feld($event, 'n')" />
        </label>
      </div>
      <p v-if="meldung" class="zd-meldung" role="status">{{ meldung }}</p>
      <div class="zd-knoepfe">
        <button type="button" @click="gehe(-1)">{{ az.zurueck }}</button>
        <button type="button" @click="gehe(1)">{{ az.weiter }}</button>
        <button type="button" @click="zuruecksetzen">{{ az.zuruecksetzen }}</button>
      </div>
    </div>
    <p aria-live="polite">{{ fuelle(az.zaehler, { n: gesetzt }) }}</p>
  </div>
</template>

<style scoped>
.zeichne-diagramm {
  --zd-temp: #b3261e;
  --zd-nied: #1f5fa8;
  --zd-nied-hoch: #0d2f57;
  margin: 1rem 0;
}
@media (prefers-color-scheme: dark) {
  .zeichne-diagramm {
    --zd-temp: #ff8f84;
    --zd-nied: #7db4ee;
    --zd-nied-hoch: #b7d6f7;
  }
}
.zd-tabelle {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  max-width: 24rem;
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem;
}
.zd-tabelle caption {
  text-align: left;
  font-weight: 600;
  padding-bottom: 0.25rem;
}
.zd-tabelle th,
.zd-tabelle td {
  border: 1px solid var(--page-border);
  padding: 0.1rem 0.4rem;
  text-align: right;
  hyphens: auto;
  overflow-wrap: break-word;
}
.zd-tabelle th[scope="row"],
.zd-tabelle th:first-child {
  text-align: left;
}
.zd-reihe {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  border: 1px solid var(--page-border);
  border-radius: 0.25rem;
  margin: 0 0 0.75rem;
  padding: 0.5rem 0.75rem;
}
.zd-reihe label {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  min-height: 2.75rem;
}
svg {
  display: block;
  width: 100%;
  max-width: 34rem;
  height: auto;
  background: var(--page-surface);
  border: 1px solid var(--page-border);
  border-radius: 0.25rem;
  cursor: crosshair;
}
.zd-gitter line {
  stroke: var(--page-border);
}
.zd-null {
  stroke: var(--page-text);
  stroke-width: 1.2;
}
.zd-achse text {
  fill: var(--page-text);
  font-size: 14px;
}
.zd-achse .zd-temp-text {
  fill: var(--zd-temp);
  font-weight: 600;
}
.zd-achse .zd-nied-text {
  fill: var(--zd-nied);
  font-weight: 600;
}
.zd-auswahl {
  fill: none;
  stroke: var(--page-text);
  stroke-width: 1.5;
  stroke-dasharray: 3 2;
}
.zd-saeule {
  fill: var(--zd-nied);
}
.zd-saeule-hoch {
  fill: var(--zd-nied-hoch);
}
.zd-linie {
  stroke: var(--zd-temp);
  stroke-width: 2.5;
  stroke-linejoin: round;
}
.zd-punkt {
  fill: var(--page-surface);
  stroke: var(--zd-temp);
  stroke-width: 2;
}
.zd-treffer {
  fill: transparent;
}
.zd-treffer:focus-visible {
  outline: none;
  stroke: var(--page-accent);
  stroke-width: 2;
}
.zd-legende {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}
.zd-zeichen {
  display: inline-block;
  width: 1.25rem;
  height: 0.75rem;
  margin-right: 0.35rem;
  vertical-align: middle;
}
.zd-zeichen-linie {
  height: 0;
  border-top: 3px solid var(--zd-temp);
}
.zd-zeichen-saeule {
  background: var(--zd-nied);
}
.zd-monatname {
  font-weight: 600;
  margin: 0.5rem 0 0.25rem;
}
.zd-felder {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}
.zd-felder label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.zd-felder input {
  min-height: 2.75rem;
  width: 8rem;
  padding: 0 0.5rem;
}
.zd-meldung {
  margin: 0.5rem 0 0;
  padding: 0.25rem 0.5rem;
  border-left: 3px solid var(--page-wrong);
  background: var(--page-wrong-background);
}
.zd-knoepfe {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0;
}
.zd-knoepfe button {
  min-height: 2.75rem;
  padding: 0 0.75rem;
  border: 1px solid var(--page-border);
  border-radius: 0.25rem;
  background: var(--page-surface);
  color: var(--page-text);
}
</style>
