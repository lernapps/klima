<script setup lang="ts">
// The climate diagram of one place after Walter and Lieth: the red line is the temperature (left scale, °C), the blue
// columns are the precipitation (right scale, mm). It only shows the data of the place; it checks nothing.
// Where the page lets learners tap a month, the values of that month appear as text below. Its logic is in
// KlimaDiagramm.ts.
import { computed, ref } from "vue";
import { fuelle, humideMonate, layout, liste, niederschlagAlsGrad, zahl, KNICK_MM, type Ort } from "./KlimaDiagramm.ts";

type Texte = {
  /** The title above the diagram, with {ort} for the name. */
  titel: string;
  /** What a screen reader hears, with {ort}; it names what is shown and gives no value. */
  alt: string;
  /** The text for a hidden name. */
  verdecktName: string;
  /** The twelve month names, January first. */
  monate: string[];
  /** The twelve first letters for the scale. */
  monateKurz: string[];
  /** The words of the legend and the axes. */
  legende: {
    temperatur: string;
    niederschlag: string;
    niederschlagHoch: string;
    humid: string;
    arid: string;
    achseGrad: string;
    achseMm: string;
  };
  /** The values of a tapped month, with {monat}, {t} and {n}. */
  monatText: string;
  /** What shows before any month is tapped. */
  monatLeer: string;
  /** The label of the switch for humid and arid months. */
  schalter: string;
  /** The result when the switch is on, with {humid} and {arid} as lists of months. */
  schalterText: string;
};

const props = defineProps<{
  /** The records of the data file: the places. */
  orte: { id: string; name: string; temperaturen: number[]; niederschlag: number[] }[];
  /** The one record of the data file with the texts of the diagram. */
  texte: Texte[];
  /** The id of the place to draw. */
  ort: string;
  /** True: the name of the place stays hidden. */
  verdeckt?: boolean;
  /** True: the learner may tap a month and read its values. */
  monatswerte?: boolean;
  /** True: the learner may switch humid and arid months on. */
  humidSchalter?: boolean;
}>();

const tx = computed<Texte>(() => {
  const erster = props.texte[0];
  if (!erster) throw new Error("KlimaDiagramm: the texts are missing in the data");
  return erster;
});
const legende = computed(() => tx.value.legende);
const monate = computed(() => tx.value.monate);

const daten = computed<Ort>(() => {
  const gefunden = props.orte.find((o) => o.id === props.ort);
  if (!gefunden) throw new Error(`KlimaDiagramm: place "${props.ort}" not in the data`);
  return gefunden;
});
const name = computed(() => (props.verdeckt ? tx.value.verdecktName : daten.value.name));
const l = computed(() => layout(daten.value));
const humid = computed(() => humideMonate(daten.value));
const gewaehlt = ref<number | null>(null);
const zeigeHumid = ref(false);

const linie = computed(() =>
  daten.value.temperaturen.map((t, m) => `${l.value.x(m).toFixed(1)},${l.value.y(t).toFixed(1)}`).join(" "),
);
const saeulen = computed(() =>
  daten.value.niederschlag.map((p, m) => {
    const unten = l.value.y(0);
    const knick = l.value.y(niederschlagAlsGrad(Math.min(p, KNICK_MM)));
    const oben = l.value.y(niederschlagAlsGrad(p));
    const w = l.value.spalte * 0.5;
    return { x: l.value.x(m) - w / 2, w, unten, knick, oben, hoch: p > KNICK_MM };
  }),
);
const monatsText = computed(() => {
  const m = gewaehlt.value;
  if (m === null) return tx.value.monatLeer;
  return fuelle(tx.value.monatText, {
    monat: monate.value[m] ?? "",
    t: zahl(daten.value.temperaturen[m] ?? 0),
    n: zahl(daten.value.niederschlag[m] ?? 0),
  });
});
const humidText = computed(() =>
  fuelle(tx.value.schalterText, {
    humid: liste(monate.value.filter((_, m) => humid.value[m])) || "–",
    arid: liste(monate.value.filter((_, m) => !humid.value[m])) || "–",
  }),
);
// the same on the server and in the browser: the pattern is the same for every diagram of a page
const uid = "kd";
function waehle(m: number): void {
  if (props.monatswerte) gewaehlt.value = gewaehlt.value === m ? null : m;
}
</script>

<template>
  <figure class="klima-diagramm">
    <figcaption>{{ fuelle(tx.titel, { ort: name }) }}</figcaption>
    <svg
      :viewBox="`0 0 ${l.breite} ${l.hoehe}`"
      :role="monatswerte ? 'group' : 'img'"
      :aria-label="fuelle(tx.alt, { ort: name })"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern :id="`${uid}-arid`" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" class="kd-arid-grund" />
          <circle cx="3" cy="3" r="1" class="kd-arid-punkt" />
        </pattern>
      </defs>
      <!-- humid and arid months: a band behind each month, only when the learner switched it on -->
      <g v-if="zeigeHumid">
        <rect
          v-for="(istH, m) in humid"
          :key="`band-${m}`"
          :x="l.x(m) - l.spalte / 2"
          :y="l.oben"
          :width="l.spalte"
          :height="l.hoehe - l.oben - l.unten"
          :fill="istH ? 'var(--kd-humid-band)' : `url(#${uid}-arid)`"
        />
      </g>
      <!-- grid and scales -->
      <g class="kd-gitter">
        <line
          v-for="t in l.gradTicks"
          :key="`g-${t}`"
          :x1="l.links"
          :x2="l.breite - l.rechts"
          :y1="l.y(t)"
          :y2="l.y(t)"
        />
      </g>
      <g class="kd-achse">
        <text v-for="t in l.gradTicks" :key="`tl-${t}`" :x="l.links - 6" :y="l.y(t) + 4" text-anchor="end">
          {{ t }}
        </text>
        <text v-for="tick in l.mmTicks" :key="`tr-${tick.t}`" :x="l.breite - l.rechts + 6" :y="l.y(tick.t) + 4">
          {{ tick.mm }}
        </text>
        <text :x="l.links - 6" :y="l.oben - 7" text-anchor="end" class="kd-temp-text">{{ legende.achseGrad }}</text>
        <text :x="l.breite - l.rechts + 6" :y="l.oben - 7" class="kd-nied-text">{{ legende.achseMm }}</text>
        <text v-for="m in 12" :key="`mo-${m}`" :x="l.x(m - 1)" :y="l.hoehe - l.unten + 16" text-anchor="middle">
          {{ tx.monateKurz[m - 1] }}
        </text>
      </g>
      <line class="kd-null" :x1="l.links" :x2="l.breite - l.rechts" :y1="l.y(0)" :y2="l.y(0)" />
      <!-- precipitation columns; the part above 100 mm in the darker, striped colour -->
      <g>
        <template v-for="(s, m) in saeulen" :key="`s-${m}`">
          <rect
            class="kd-saeule"
            :x="s.x"
            :y="s.hoch ? s.knick : s.oben"
            :width="s.w"
            :height="s.unten - (s.hoch ? s.knick : s.oben)"
          />
          <rect v-if="s.hoch" class="kd-saeule-hoch" :x="s.x" :y="s.oben" :width="s.w" :height="s.knick - s.oben" />
        </template>
      </g>
      <!-- temperature line with a circle at each month -->
      <polyline class="kd-linie" :points="linie" fill="none" />
      <circle
        v-for="(t, m) in daten.temperaturen"
        :key="`p-${m}`"
        class="kd-punkt"
        :class="{ 'kd-punkt-gewaehlt': gewaehlt === m }"
        :cx="l.x(m)"
        :cy="l.y(t)"
        r="3.5"
      />
      <rect
        v-if="gewaehlt !== null"
        class="kd-auswahl"
        :x="l.x(gewaehlt) - l.spalte / 2"
        :y="l.oben"
        :width="l.spalte"
        :height="l.hoehe - l.oben - l.unten"
      />
      <!-- the months to tap: a transparent area over each month, reachable with the keyboard -->
      <g v-if="monatswerte">
        <rect
          v-for="m in 12"
          :key="`h-${m}`"
          class="kd-treffer"
          role="button"
          tabindex="0"
          :aria-label="monate[m - 1]"
          :aria-pressed="gewaehlt === m - 1"
          :x="l.x(m - 1) - l.spalte / 2"
          :y="l.oben"
          :width="l.spalte"
          :height="l.hoehe - l.oben"
          @click="waehle(m - 1)"
          @keydown.enter.prevent="waehle(m - 1)"
          @keydown.space.prevent="waehle(m - 1)"
        />
      </g>
    </svg>
    <ul class="kd-legende">
      <li><span class="kd-zeichen kd-zeichen-linie"></span>{{ legende.temperatur }}</li>
      <li><span class="kd-zeichen kd-zeichen-saeule"></span>{{ legende.niederschlag }}</li>
      <li v-if="saeulen.some((s) => s.hoch)">
        <span class="kd-zeichen kd-zeichen-hoch"></span>{{ legende.niederschlagHoch }}
      </li>
      <template v-if="zeigeHumid">
        <li><span class="kd-zeichen kd-zeichen-humid"></span>{{ legende.humid }}</li>
        <li><span class="kd-zeichen kd-zeichen-arid"></span>{{ legende.arid }}</li>
      </template>
    </ul>
    <div v-if="humidSchalter" class="kd-schalter">
      <label><input v-model="zeigeHumid" type="checkbox" /> {{ tx.schalter }}</label>
      <p v-if="zeigeHumid" aria-live="polite">{{ humidText }}</p>
    </div>
    <p v-if="monatswerte" class="kd-wert" aria-live="polite">{{ monatsText }}</p>
  </figure>
</template>

<style scoped>
.klima-diagramm {
  --kd-temp: #b3261e;
  --kd-nied: #1f5fa8;
  --kd-nied-hoch: #0d2f57;
  --kd-humid-band: #cfe3f7;
  --kd-arid-grund: #fbf0c4;
  --kd-arid-punkt: #b58a00;
  margin: 1rem 0;
}
@media (prefers-color-scheme: dark) {
  .klima-diagramm {
    --kd-temp: #ff8f84;
    --kd-nied: #7db4ee;
    --kd-nied-hoch: #b7d6f7;
    --kd-humid-band: #1d3b5c;
    --kd-arid-grund: #4a3f12;
    --kd-arid-punkt: #e6c24d;
  }
}
figcaption {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
svg {
  display: block;
  width: 100%;
  max-width: 34rem;
  height: auto;
  background: var(--page-surface);
  border: 1px solid var(--page-border);
  border-radius: 0.25rem;
}
.kd-gitter line {
  stroke: var(--page-border);
  stroke-width: 1;
}
.kd-null {
  stroke: var(--page-text);
  stroke-width: 1.2;
}
.kd-achse text {
  fill: var(--page-text);
  font-size: 14px;
}
.kd-achse .kd-temp-text {
  fill: var(--kd-temp);
  font-weight: 600;
}
.kd-achse .kd-nied-text {
  fill: var(--kd-nied);
  font-weight: 600;
}
.kd-saeule {
  fill: var(--kd-nied);
}
.kd-saeule-hoch {
  fill: var(--kd-nied-hoch);
}
.kd-linie {
  stroke: var(--kd-temp);
  stroke-width: 2.5;
  stroke-linejoin: round;
}
.kd-punkt {
  fill: var(--page-surface);
  stroke: var(--kd-temp);
  stroke-width: 2;
}
.kd-punkt-gewaehlt {
  fill: var(--kd-temp);
}
.kd-treffer {
  fill: transparent;
  cursor: pointer;
}
.kd-treffer:focus-visible {
  outline: none;
  stroke: var(--page-accent);
  stroke-width: 2;
}
.kd-auswahl {
  fill: none;
  stroke: var(--page-text);
  stroke-width: 1.5;
  stroke-dasharray: 3 2;
}
.kd-arid-grund {
  fill: var(--kd-arid-grund);
}
.kd-arid-punkt {
  fill: var(--kd-arid-punkt);
}
.kd-legende {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}
.kd-zeichen {
  display: inline-block;
  width: 1.25rem;
  height: 0.75rem;
  margin-right: 0.35rem;
  vertical-align: middle;
}
.kd-zeichen-linie {
  height: 0;
  border-top: 3px solid var(--kd-temp);
}
.kd-zeichen-saeule {
  background: var(--kd-nied);
}
.kd-zeichen-hoch {
  background: var(--kd-nied-hoch);
}
.kd-zeichen-humid {
  background: var(--kd-humid-band);
  border: 1px solid var(--page-border);
}
.kd-zeichen-arid {
  background: radial-gradient(var(--kd-arid-punkt) 1px, var(--kd-arid-grund) 1.5px);
  background-size: 6px 6px;
  border: 1px solid var(--page-border);
}
.kd-schalter label {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  min-height: 2.75rem;
}
.kd-wert {
  min-height: 1.5rem;
  margin: 0.5rem 0 0;
}
</style>
