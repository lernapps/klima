---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype, null until chosen in Explore. Allowed values: explainer, interactive, quiz.
archetype: explainer
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: written by the pre-push hook. Never change it.
prePushFailures: 0
# failedChecks: failed rules and runs, written by lernapps check and the hooks. Never change it.
failedChecks: { accessible: 1, checks-pass: 6, usable-at-360px: 1 }
---

# Plan: Klima in Europa, first version

<!--
For you, the assistant.
1. Path: `.vibe/plans/01-<short name>.md`. Every later change gets its own plan from the increment template.
2. Read this plan before each step. One phase at a time, tasks in order.
3. Task done → tick `[x]` at once and move it to "Completed" of its phase. An unticked box counts as not done.
4. New task found → add it.
5. Each phase names its skills. Load a skill when its task comes, not before. Read it in full, from its file.
6. Checkpoint: stop, ask, wait for the creator's answer. A message sent before the question is no yes.
   Only a checkpoint waits. A phase's last box → set the next phase and go on in the same message.
7. At most 2 questions per message, one topic each. No questions inside drafts or lists.
8. Work on the branch `work`, locally: push nothing before Commit. Commit puts the app on GitHub and brings `work`
   into `main`.
9. Plan in the creator's language. Keep headings and front matter keys. Delete a comment once its part is filled.
10. Begin each reply to the creator with the phase in `phase:`, and at a checkpoint the word checkpoint:
    "**Plan · Checkpoint**", "**Code**". The creator always knows where you are.
-->

*Started 2026-11-15. Explore, Plan, Code, Commit.*

## Goal

Schülerinnen und Schüler der 6. Klasse lesen kurze Erklärseiten zu Wetter und Klima, vor allem zu Europa, und üben dann an Klimadiagrammen: lesen, einem Ort in Europa zuordnen, selbst zeichnen. Sie lernen, ein Klimadiagramm zu deuten und die Klimazonen Europas zu begründen.

## Key decisions

- Archetype `explainer`: Lernende lesen erst Erklärseiten (Klima, Europa), üben dann; für Klimadiagramme verstehen, verorten, selbst erstellen braucht es Vue-Komponenten (Zuordnen auf Karte, Diagramm zeichnen). Kein Spiel, kein Timer.
- Lehrplan: kein Bundesland genannt, Antwort "mach beides selbst" → KMK-Bildungsstandards; die KMK hat keine für Erdkunde, daher folgt der Aufbau der Lernlandkarte (guess).
- Inhalt: ich recherchiere und schreibe ihn aus offenen Quellen, kein eigenes Material des Creators (Antwort "mach beides selbst").
- Ton und Rahmen für 12-Jährige: Anrede "du", kurze Sätze, jede Seite beginnt mit einer Situation aus ihrem Alltag (Urlaub, Koffer packen, Fußballtraining im Regen); die App ist eine "Klimadetektiv"-Spur: Diagramme sind Hinweise, Orte sind Fälle (guess). Keine Punkte, kein Timer.
- Kein `scope` und kein `open-task` (nur Fragen mit festen Antworten); der Tutor bekommt den Seiteninhalt (guess).
- Strand `erdkunde/klima` der Lernlandkarte (`explainerFocus: strand`). Pro Kompetenz eine Seite.
- Sprache: nur Deutsch (guess). Aussehen: ruhig wie ein Arbeitsblatt, Dunkelmodus folgt dem Gerät (fest durch den Typ).
- Klimadaten: Orte in Deutschland aus DWD-Open-Data (Mittel 1991–2020); Orte in Europa aus offiziellen Klimanormalwerten, jeder Wert mit Quelle (guess, Quelle in Code zu prüfen).

## Notes

- Strand: `erdkunde/klima` (Wetter, Klima und Landschaftszonen), Lernlandkarte https://lernapps.net/apps/map/erdkunde.json, gelesen.
- Lehrplan: kein Land genannt → KMK-Bildungsstandards; die KMK hat keine für Erdkunde → keine Einheit zitiert, "not checked"; Orientierung ist die Lernlandkarte (Klassenband 5–6 bzw. 7–8). Der Wunsch "Europa" liegt im Klassenband 7–8 der Karte; die App zieht ihn für Klasse 6 vor (grade [6]) und sagt es im Eintrag.
- Kompetenzen nach Kapitel (ids der Karte, Wortlaut der Karte):
  - Kapitel 1 "Wetter und Klima":
    - `wetter-und-klima`: Ich kann Wetter und Klima unterscheiden und die Wetterelemente Temperatur, Niederschlag, Luftdruck und Wind nennen.
    - `wetter-messen`: Ich kann Temperatur und Niederschlag messen, die Werte in eine Tabelle eintragen und als Diagramm darstellen.
  - Kapitel 2 "Klimadiagramme":
    - `klimadiagramm-lesen`: Ich kann ein Klimadiagramm lesen und damit das Klima eines Ortes beschreiben. Zwei Seiten: (a) Temperatur und Niederschlag ablesen; (b) humide und aride Monate erkennen (Niederschlagssäule über der Temperaturkurve, Skala 10 °C : 20 mm, Walter/Lieth) und das Klima des Ortes beschreiben. Arid/humid hat keine eigene Kompetenz auf der Karte; es gehört zu "lesen" und wird dort nicht neu erfunden (guess).
    - `klimadiagramm-zeichnen`: Ich kann aus einer Klimatabelle ein Klimadiagramm zeichnen. Komponente zum Zeichnen. Danach die Übung "Wie sieht das Klimadiagramm für <Ort> aus?" (Lernende zeichnen eine Vorhersage aus Lage, Meeresnähe, Höhe; die Komponente prüft sie rechnerisch, siehe Notes).
  - Kapitel 3 "Klima in Europa":
    - `seeklima-landklima`: Ich kann erklären, warum es in Westeuropa milde Winter und kühle Sommer gibt und im Osten kalte Winter und heiße Sommer, auch mit dem Golfstrom.
    - `klimazonen-europas`: Ich kann die Klima- und Vegetationszonen Europas nennen und auf einer Karte zeigen. Zu jeder typischen Zone (z. B. Mittelmeerklima, ozeanisches Klima, kontinentales Klima, Subpolar/Tundra, Hochgebirge) ein Beispielort mit Klimadiagramm, arid/humid-Monaten und Vegetation; Zuordnen von Diagramm, Zone und Ort. Mehrere Seiten möglich (eine pro Zone-Gruppe), Zonenliste in Code aus geprüfter Quelle (not checked).
  - Reihenfolge nach `requires`: wetter-und-klima → wetter-messen → klimadiagramm-lesen → klimadiagramm-zeichnen / seeklima-landklima → klimazonen-europas.
- Voraussetzung ohne eigene Seite: `topographie-europa` (Europa auf der Karte; geübt von der App geo-quizzer, https://lernapps.net/apps/start/geo-quizzer/) für `klimazonen-europas` → Link zur Karte oder Wiederholungsseite (Entscheidung im Plan). `klimadiagramm-lesen` braucht nur `wetter-messen`.
- Vorhersage-Übung "Wie würde das Klimadiagramm für <Ort> aussehen?" (Wunsch des Creators): Der Ort kommt mit Hinweisen (Breite, Entfernung zum Meer, Höhe, Meeresströmung). Lernende zeichnen 12 Temperaturpunkte und 12 Niederschlagssäulen. Die Komponente vergleicht mit den echten Werten des Orts nicht Wert für Wert, sondern über berechnete Merkmale mit Toleranz: Jahresmittel, Temperaturspanne, wärmster/kältester Monat, Jahresniederschlag, Zahl humider/arider Monate, Form des Niederschlags (Sommer/Winter/gleichmäßig). Toleranzen stehen im Datensatz; die Logik liegt in einem eigenen Modul mit Test (echte Werte bestehen immer, vertauschte Achsen und fremde Orte fallen durch). Jede Rückmeldung nennt das verletzte Merkmal. Grenze: ein plausibler, aber anderer Verlauf kann bestehen; die App sagt das (guess).
- Nicht in der App (Absicht): Klimazonen der Erde, Höhenstufen, Klimawandel (andere Kompetenzen der Karte, Klasse 7–10); nur Europa. Klimadaten: ca. 8–10 Orte, quer durch Europa (z. B. Küste West, Mittelmeer, Binnenland Ost, Norden, Hochgebirge), jeder Ort einmal als Datensatz (guess).
- Didaktik: ableiten statt nur ablesen. Beispiel: Monatswerte in eine Tabelle → Punkte im Diagramm → Kurve und Säulen; Fehlvorstellungen, die die Rückmeldung abfängt: Klima = heutiges Wetter; Temperatur und Niederschlag liegen auf derselben Achse; Säulenhöhe zeigt Temperatur; Klimadiagramm zeigt einen einzelnen Jahrgang.
- Wie Lernende zu jeder Kompetenz kommen:
  - `wetter-und-klima`: Beispielsätze sortieren (Wetter heute / Klima als langjähriger Durchschnitt); Fehlvorstellung "Klima = Wetter von heute".
  - `wetter-messen`: Werte eines Monats in eine Tabelle, Mittelwert bilden; Fehlvorstellung "Niederschlag in °C".
  - `klimadiagramm-lesen`: Linie = Temperatur (linke Achse), Säulen = Niederschlag (rechte Achse); Werte ablesen, wärmsten/niederschlagsreichsten Monat nennen, Jahresmittel und -summe schätzen; Fehlvorstellung: Säulenhöhe als Temperatur lesen.
  - `klimadiagramm-zeichnen`: aus Tabelle selbst Punkte setzen und Säulen ziehen; Rückmeldung nennt den falschen Monat oder die vertauschte Achse.
  - `seeklima-landklima`: zwei Diagramme vergleichen (z. B. Westküste und Binnenland Ost), Temperaturspanne ausrechnen, Ursache (Meer, Golfstrom) aus Auswahl wählen; Fehlvorstellung "der Golfstrom macht Europa insgesamt wärmer als Kanada, nur im Westen".
  - `klimazonen-europas`: Orte und Klimadiagramme einer Zone zuordnen und auf einer Europakarte zeigen; Fehlvorstellung: Zonen verlaufen nur nach Breitengrad.
- Quellen (geöffnet und geprüft, 2026-11-15):
  - https://de.wikipedia.org/wiki/Klimadiagramm, Titel "Klimadiagramm", Lizenz CC BY-SA 4.0; verified. Nur Fakten, keine Sätze (Walter/Lieth, Skala 10 °C : 20 mm).
  - https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/multi_annual/mean_91-20/: verified (Verzeichnis lädt; Temperatur_1991-2020.txt, Niederschlag_1991-2020.txt); Nutzungsbedingungen noch zu lesen (Beschreibung_Datenquelle) → not checked.
  - https://de.wikipedia.org/wiki/Klimazonen_Europas: 404, nicht benutzt; Zonen Europas und Klimadaten außerhalb Deutschlands: not checked, in Code aus offiziellen Quellen zu holen, jeder Wert mit Quelle.
  - Zweite Quellen (Artikel oder Video pro Kompetenz): noch nicht geprüft, in Code nachtragen; ohne geprüften Treffer weggelassen.
- Offene Fragen: keine für den Creator, außer der Prüfung am Checkpoint.
- Selbsteinschätzung (Commit): in jedem Kapitel, nur mit Übungen, die ohne ihre Seite klar sind; die Seiten `diagramme/lesen` und `europa/zonen-orte` (Diagrammaufgaben) sind teilweise nicht abgefragt, weil ihre Übungen das Diagramm der Seite brauchen. Dafür gibt es die neue `generated`-Übung `humid-arid-5`.
- Bildschirmprüfung (Code): Alle 9 Seiten, Startseite und die vier Abbildungen (`npx --no -- lernapps screenshots --desktop`, Computer und 360 px) angesehen; die beiden Zeichen-Übungen zusätzlich im Browser mit Tastatur, Eingabefehlern und richtigen/falschen Antworten durchgespielt. Abweichung von der Skizze `03`: Nach "Prüfen" zeigt die App nicht das echte Diagramm, sondern nur die Rückmeldung und "Lösung" (die Werte als Text), damit eine falsche Antwort die Lösung nicht verrät. Lernenden-Checks (Sub-Agent) für die Musterseite und die beiden Zeichen-Seiten; Befunde eingearbeitet.


## Explore

<!--
- Find out what the app teaches, for whom, how much and how it looks. All content questions belong here; Plan only
  maps the answers onto the archetype.
- Ask. Write no code, run no `create`.
- An answer counts only in the creator's words under "Answers". Never tick a topic you assumed.
- Skills: `lernapps-app`, `lernapps-exercise-patterns`, `lernapps-<archetype>-design`, `lernapps-content-research`.
-->

### Tasks

- [x] The skills of the phases are in `.agents/skills/` (`npx --yes @lernapps/tooling init <short name>` put them there
      and wrote this plan; the app commits them). `.agents/skills/lernapps-app` missing → stop and tell the creator
      the folder was not started with `init`. `git branch --show-current` prints `work`; else `git switch -c work`.
- [x] Load skill `lernapps-app`. Tell the creator in two sentences what a lernapps app is and where it will live: at
      their own address, free, public, and once listed as a copy on lernapps.net. The technical part (GitHub) comes at the end, and you do it.
- [x] Interview: ask the topics "Goal" and "Learners" of "Answers".
- [x] No fixed content yet ("an app for my class", "a gap on the map") → load skill `lernapps-map-assignment` and
      write its assignment first; its yes answers the topics it covers.
- [x] Load skill `lernapps-exercise-patterns` and read the patterns of the subject: how will learners practise what
      the goal names? The kind of practice points to the archetype, as the skill says.
- [x] Choose the archetype as skill `lernapps-app` says, from the kind of practice: read the README of each
      archetype in question, tell the creator what the chosen one can and cannot do. Write it and its reason under
      "Key decisions". Set `archetype`.
- [x] Install the archetype's skills: `npx --no -- lernapps skills --archetype <archetype>`. Load skill
      `lernapps-<archetype>-design`.
- [x] Interview: ask the other topics of "Answers" in order. Skip a topic an earlier answer covers; note which.
      A confirmed assignment covers Goal, Learners, Content, Amount and Languages; an explainer has no "Look and
      feel" (its look is the runtime's): note "covered by the assignment" or "fixed by the archetype", ask only the
      rest. No answer → ask once more; still none → write your assumption with "(guess)". Done when every topic has
      an answer, a note or a guess.
- [x] Load skill `lernapps-content-research`. Research as it says. Under "Notes": curriculum orientation (none
      when the content comes from the map, an assignment or a strand: the map gives the order), competencies by
      chapter as "Ich kann …", verified sources. No competencies → not done. First the learning map as
      skill `lernapps-content-research` says: recommend a strand that fits (`<subject>/<strand>`), else `none`; with a
      strand, only its competencies, by their ids from the map. A map with `explainerFocus: competency` also allows a
      unit app across strands (`subject: <subject>`), one strand per page. Write both under "Notes", and how they map onto
      chapters and pages (an explainer: as a rule one page per competency; competencies that build on each other, by
      the map's `requires`, share a chapter, in that order).
- [x] Under "Notes", one line per competency: how learners get there (derive, not only read off; e.g. a tree diagram
      shows how a probability comes about), which misconception the feedback catches.
- [x] Under "Notes", the scope: what is in, what is out and why, the data range (e.g. "all main-group elements",
      never a silent "1–20"), the languages.
- [x] Fetch https://lernapps.net/apps/schemas/entry.v1.schema.json and read each property's description. Ask what
      helps teachers and parents find the app. Fill "Entry draft". Search words: one or two words each, as people
      type them.
- [x] **Checkpoint:** research. Show in plain words: the strand or why none, curriculum orientation (not with a
      strand), competencies by chapter (with their ids) and their pages, didactic approach, scope, every "(guess)", sources and how you
      checked them, what is unchecked, archetype and reason. With a strand, the map decides the structure: competencies
      that build on each other (its `requires`) share a chapter, in that order; no curriculum search is needed for it.
      Stop and wait. Changes → change, ask again.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

<!-- The interview: per topic the creator's answer, in their words. Keep the topics. -->

- Goal: siehe oben: informieren über Klima, vor allem Europa nach Lehrplan; Klimadiagramme verstehen, verorten, selbst erstellen (creator).
- Learners: Erdkunde, Klasse 6 (creator). Land und Schulform: nicht genannt ("mach beides selbst") → KMK-Bildungsstandards (guess).
- Model and focus: kein Vorbild genannt; Schwerpunkt Visualisierung und Klimadiagramme (aus der Antwort des Creators; guess für Vorbild: keines).
- Hurdles: nicht genannt → übliche Fehlvorstellungen siehe "Notes" (guess).
- Content: ich recherchiere und schreibe ihn aus offenen Quellen (creator: "mach beides selbst").
- Amount: 6 Seiten in 3 Kapiteln, ca. 8–10 Klimaorte (guess); später Klimazonen der Erde möglich.
- Languages: nur Deutsch (guess).
- Look and feel: fest durch den Typ, ruhig wie ein Arbeitsblatt, Dunkelmodus folgt dem Gerät (fixed by the archetype).
- Terms: Klimadiagramm, Temperaturkurve, Niederschlagssäulen, Seeklima, Landklima, Klimazone (guess).

### Entry draft

<!-- YAML valid against the entry schema, with its property names. Only known values, never invented. -->

```yaml
title: Klima in Europa
subject: erdkunde
strand: erdkunde/klima
grades: [6]
summary: >-
  Was ist Klima, und warum ist es im Westen Europas milder als im Osten? Die Lernenden lesen Klimadiagramme von Orten
  in Europa, zeichnen eigene und finden als Klimadetektive heraus, wie das Klima eines Ortes aussieht. Auf jeder Seite
  üben sie selbst.
url: https://lernapps.net/klima/
keywords: [Klimadiagramm, Klima, Europa, Wetter, Klimazonen, Seeklima, Landklima, humid arid]
creator: { name: "Oliver", url: "https://github.com/mrsimpson" }
source: https://github.com/lernapps/klima
commit: 04c6177d57be42832f0aec59b62ab1e816af2f33
fitness:
  account: false
  install: false
  storage: device
  thirdParty: none
  checked: false
```

### Completed

## Plan

<!--
- Map the confirmed content onto the archetype: structure, screens or pages, exercise patterns, data files,
  components.
- No new content questions. A content gap → back to Explore; say so.
- Confirmable in one read. After the yes, work on your own: at most 3 creator turns until the listing.
- Skills: `lernapps-<archetype>-design` and `lernapps-exercise-patterns`, both loaded in Explore.
-->

### Tasks

- [x] `grep '^phase:'` prints `phase: plan`; else set it.
- [x] Map the content as skill `lernapps-<archetype>-design` says; reread it if it is no longer in view.
- [x] Choose a pattern per competency as skill `lernapps-exercise-patterns` says (loaded in Explore; reread it if it
      is no longer in view). Write "Content method".
- [x] Write the Code tasks under "Code": pages or screens, their content, what each shows. Each ends in a commit:
      one task, one commit. Steps too small for a commit of their own → one task.
      The first task: one complete page or screen as the pattern for the others (`early-preview`).
- [x] Each screen, component or interactive exercise: a sketch (static SVG or image, or the steps with what
      learners see after each). Words alone are not enough. Keep sketch files in `.vibe/sketches/`, which `create` leaves alone.
- [x] Show the creator, short: goal, competencies by chapter (chapters along the map's `requires`), entry draft, tasks, sketches; the content method in
      plain words (what learners see and do, what it cannot do). At most 2 questions.
- [x] **Checkpoint:** confirm the plan and the content method, with the sketches shown. Stop and wait for an
      explicit yes. Changes → change, ask again. No `create` before the yes.
- [x] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Skizzen

In `.vibe/sketches/`: `01-klimadiagramm-lesen.svg` (Seite), `02-zeichnen-komponente.svg` (Zeichnen), `03-klimadetektiv-komponente.svg` (Detektiv), `04-karte-zuordnen.svg` (Frage mit Karte). Die übrigen Seiten folgen dem Muster von `01`.

### Content method

- **Aufbau jeder Seite** (feste Abschnitt-ids): `einstieg` (Situation aus dem Alltag und "Das kannst du danach"), `erklaerung` (Figur, Diagramm oder Tabelle mit Beschriftung), `beispiel` (Kasten mit durchgerechnetem Fall), `uebung` (von Erkennen zu Anwenden). Titel passen zur Aufgabe des Abschnitts.
- **Seiten und Kompetenzen** (Reihenfolge nach `requires`):
  - Kapitel `wetter-klima` "Wetter oder Klima?": `wetter-und-klima` (Seite `wetter-und-klima`), `wetter-messen` (Seite `wetter-messen`).
  - Kapitel `diagramme` "Klimadiagramme knacken": `klimadiagramm-lesen` (Seiten `lesen`, `humid-arid`), `klimadiagramm-zeichnen` (Seite `zeichnen`).
  - Kapitel `europa` "Klima in Europa": `seeklima-landklima` (Seite `see-land`), `klimazonen-europas` (Seiten `zonen`, `zonen-orte`).
  - Kapitel `detektiv` "Klimadetektiv": `klimadiagramm-zeichnen` (Seite `vorhersage`), Abschluss und Anwendung; hat als einzige Seite eine zweite Seite derselben Kompetenz (mehrere Seiten für eine große Kompetenz sind erlaubt).
  - `klimazonen-europas` braucht `topographie-europa`: nicht in der App, geübt von geo-quizzer → Link im Text der Seite `zonen` auf https://lernapps.net/apps/map/erdkunde/c/topographie-europa/ (kein Wiederholungsseite; guess).
- **Übungsmuster** (je Kompetenz):
  - `wetter-und-klima` → *judge/decide*: `true-false` mit Begründung ("Gestern war es heiß, also ist das Klima dort heiß") und `matching` Aussage ↔ "Wetter"/"Klima". Fehlvorstellung "Klima = Wetter von heute" steht in `info`.
  - `wetter-messen` → *compute*: `generated` "Mittelwert aus 7 Tageswerten" und "Niederschlag in mm eines Monats summieren" (`given` Zahlen, `mistakes` Einheit vertauscht, durch falsche Anzahl geteilt).
  - `klimadiagramm-lesen` → *read off*: Diagramm gegeben, Wert gefragt (`number` mit Toleranz), Aussagen `true-false`, `single-choice` mit Markern auf der Europakarte (`material`: `labelled-figure`). `humid-arid`: Monate erkennen mit `multiple-choice` ("Welche Monate sind humid?"), Begriff als `definition`.
  - `klimadiagramm-zeichnen` → *apply*: Komponente `ZeichneDiagramm`, danach `vorhersage`-Seite mit Komponente `KlimaDetektiv`.
  - `seeklima-landklima` → *explain / compare*: zwei Diagramme (Westküste, Osten) vergleichen: Spanne mit `number` ausrechnen, `single-choice` "Warum?" mit plausiblen falschen Erklärungen (Höhe, Breitengrad).
  - `klimazonen-europas` → *assign*: `matching` Diagramm ↔ Zone, Zone ↔ Vegetation, `single-choice` mit Karte.
- **Figuren und wie sie entstehen:**
  - Klimadiagramm: eine Komponente `KlimaDiagramm` zeichnet es nach Walter/Lieth aus dem Datensatz des Ortes (Linie Temperatur links, Säulen Niederschlag rechts, Skala 10 °C : 20 mm, humide Fläche blau, aride Fläche gelb gepunktet). Zeigt, was gegeben ist, nie die Antwort (`explainer-figure-hides-answer`): Übungen blenden Hinweise aus. Eingebaute `figure` kann so ein Diagramm nicht; Grund für die Komponente (`prefer-built-in-block`).
  - Europakarte: SVG mit Umriss Europas in `src/images/`, Quelle und Lizenz aus Wikimedia Commons oder eigene Zeichnung; `labelled-figure` mit Markern. Zonenfarben ebenfalls eigene SVG-Fläche (not checked, Lizenz in Code prüfen; fällt zurück auf Marker ohne Flächen).
  - Golfstrom-Pfeil: eigene SVG-Zeichnung in `src/images/`.
- **Datendatei** `src/data/orte.yaml`: pro Ort `id`, `name`, `land`, `zone`, `breite` (° N), `meer` (km zur nächsten Küste), `hoehe` (m), `temperaturen` (12 Zahlen, °C, Jahresanfang Januar), `niederschlag` (12 Zahlen, mm), `vegetation`, `quelle`. Jeder Ort einmal; alle Komponenten und Fragen nehmen die Werte von dort (`{ data: orte }`).
- **Komponenten** (je `.vue`, `.ts`, `.test.ts`, mit `nojs`-Text; Logik rein in `.ts`):
  - `KlimaDiagramm` (Anzeige, kein Übungsbaustein): Kurve und Säulen aus Props; Bedienung: Auswahl eines Monats (Tippen oder Pfeiltasten) zeigt Temperatur und Niederschlag als Text; Schalter "Humid/arid zeigen" nur auf der Seite `humid-arid` (`explainer-control-purpose`). `nojs`: Tabelle des Ortes in Wörtern.
  - `ZeichneDiagramm` (Übung): gegeben die Tabelle, Lernende stellen für jeden Monat Temperatur und Niederschlag mit Zahlenfeld und − / + ein; das Diagramm zeigt nur, was sie eingestellt haben. `check`: jeder Monat innerhalb Toleranz (±1 °C, ±10 mm, Datei-Konstante); `reason` nennt den ersten falschen Monat und das Merkmal (Temperatur oder Niederschlag), erkennt vertauschte Achsen (Temperatur-Werte in der Niederschlags-Spalte). Kann nicht: freihändiges Zeichnen mit dem Finger (bewusst: zugänglich mit Tastatur).
  - `KlimaDetektiv` (Übung): Hinweise zum Ort (Breite, Meerentfernung, Höhe, Lage), keine Werte. Lernende stellen 12 + 12 Werte ein. `check` über berechnete Merkmale (`klima.ts`, geteilt mit `ZeichneDiagramm`): Jahresmittel (±3 °C), Temperaturspanne (±4 K), wärmster und kältester Monat (±1 Monat), Jahresniederschlag (±30 %), Zahl humider Monate (±1; humid wenn mm > 2 × °C), Niederschlagsform (Sommer-/Winter-/Gleichverteilt). `reason` nennt das erste verletzte Merkmal als Frage ("Im Sommer ist es dort kühl. Was heißt das für die Linie?"), nie die Lösung. Tests: echte Werte jedes Ortes bestehen; Werte eines anderen Ortes mit anderem Merkmal fallen durch; zufällige Störungen innerhalb der Toleranzen bestehen, außerhalb fallen durch (200 feste Seeds); Daten-Test: 12 Werte je Reihe, plausible Bereiche, `quelle` gefüllt. Grenze (wird in der App gesagt): ein plausibler, anderer Verlauf kann bestehen.
  - Jede Komponente prüft nur, was sie sagt: `KlimaDiagramm` prüft nichts; die zwei Übungen prüfen Merkmale gegen die Daten, nicht Schönheit.
- **Tutor/Scope:** kein `open-task`, kein `scope`.
- **Neue Seite später:** ein Ort in `orte.yaml` ergänzen; eine Seite = eine YAML-Datei in `src/<kapitel>/`, in `chapter.yaml` eintragen; Fragen nach dem Muster der Seite `lesen`.
- **Orte** (in Code festgelegt, Werte gelesen und gerechnet): Reykjavik, Tromsø, Bergen, Brest, Berlin, Moskau, Madrid, Lissabon, Athen, Zugspitze. Rom und Kiruna fielen weg (zu lückenhafte oder nicht abrufbare Daten).


### Completed

## Code

<!--
- Build the app from the archetype and the confirmed plan, locally on `work`. Work on your own.
- Commit after each task, literally: one task, one commit, its box ticked in it; the hooks check. Never one commit
  for several tasks: join them into one task in the plan first. A check fails → skill `lernapps-cli`. Fix from the message; never
  bypass a hook.
- Undecidable → choose, mark "(guess)" under "Key decisions", go on.
- Creator asks for a change → first say your reading in one sentence ("Ich nehme alle 44 Hauptgruppenelemente
  auf."); never narrow it silently. Content change → update "Notes" too.
- Skills: `lernapps-cli`, `lernapps-<archetype>`, `lernapps-content-questions`, and the app's content guide
  `app-content`.
-->

### Tasks

- [x] `grep '^phase:'` prints `phase: code`; else set it.
- [x] Load skill `lernapps-cli`. Create the app in this plan's folder as it says. `create` keeps this plan. Never
      write the app by hand.
- [x] Fill the content guide `.agents/skills/app-content/SKILL.md` from "Notes" and "Content method"
      (`app-content-guide`). Keep its nine headings and fill each: Curriculum, Competencies, Content structure,
      Terminology, Exercise patterns, Figures, Sources, Adding a chapter or round, Rules learned from mistakes
      ("None yet." until the first). `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` prints 0. Commit it
      before any content.
- [x] Load skill `lernapps-<archetype>` and the content guide. Questions with options and feedback: also skill
      `lernapps-content-questions`.
- [x] An explainer: decide on `scope` as `references/structure.md` of skill `lernapps-explainer` says. Needed with an
      `open-task` or the creator's material: then `scope` in `src/app.yaml` and on every page
      (`explainer-scope-matches`). Write the choice under "Key decisions".
- [x] **Musterseite `diagramme/lesen`**: Komponente `KlimaDiagramm` mit Test, Datei `src/data/orte.yaml` mit 3 Orten (Reykjavik, Berlin, Madrid; Werte mit Quelle), Seite mit Einstieg ("Was packst du für Reykjavik ein?"), Erklärung (Figur mit Achsen und Legende; Fehllesung Säulenhöhe = Temperatur benannt), Beispiel, Übung (4 Fragen wie Skizze `01`); Frage mit Karte wie Skizze `04` nur, wenn die Karte da ist, sonst später; Commit auf `work`.
- [x] **Checkpoint:** the pattern page (`early-preview`): check it against the design rules, let a sub-agent check
      it as a learner, show it to the creator, wait for the answer. A change → change the pattern first.
- [x] Kapitel `wetter-klima`: Seiten `wetter-und-klima` und `wetter-messen` nach dem Muster der Seite `lesen`, mit `true-false`, `matching`, `generated`; Commit.
- [x] Alle Orte in `orte.yaml` (8–10), jeder Wert mit Quelle und Lizenz in `src/app.yaml` `sources`; Daten-Test; Commit.
- [x] Seite `diagramme/humid-arid`: `KlimaDiagramm` mit Schalter, `definition` humid/arid, Übung; Commit.
- [x] Komponente `ZeichneDiagramm` mit Test und Seite `diagramme/zeichnen` (Skizze `02`); Commit.
- [x] Europakarte und Golfstrom-Zeichnung (SVG, mit Quelle und Lizenz); Seite `europa/see-land`; Commit.
- [x] Seiten `europa/zonen` und `europa/zonen-orte`: Zonenliste aus geprüfter Quelle, Beispiele pro Zone, Zuordnen (Skizze `04`);; löst die Denkfrage von `diagramme/lesen` auf (Berlin) und verlinkt von dort zurück; Commit.
- [x] Komponente `KlimaDetektiv` mit `klima.ts`-Merkmalen und Tests, Seite `detektiv/vorhersage` (Skizze `03`); Commit.
- [x] Startseite (`intro` in `src/app.yaml`), Wörterbuch aus `definition`-Blöcken, Quellenliste, Alt-Texte; Commit. (Die Zwischenrückmeldung entfällt: Die Selbsteinschätzung kommt in der Commit-Phase.)
- [x] The content guide matches what was built (`app-content-matches`).
- [x] `npx --no -- lernapps check` passes.
- [x] Look at a screenshot of every screen and state (start, each mode, pause, end), desktop and 360 px. Compare
      each with the confirmed sketches; each figure in its own image (`npx --no -- lernapps screenshots --desktop`).
      Your tools cannot show an image: check each screen in the browser instead (text, element boxes at both widths),
      write that under "Notes" and tick the box.
- [x] Every box of Explore, Plan and Code ticked.
- [x] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).
      No checkpoint here: set it before you ask or report anything, then start Commit in the same message.
      The creator asked to stop before publishing (e.g. a trial) → stop instead: leave this box open, the reason
      under it.

### Completed

## Commit

<!--
- Put the app on GitHub, publish it with the creator's yes, then list it. A push to `main` publishes.
- Open the pull requests (to `main`, to the catalog) without asking: they publish nothing; their preview and result
  are what the creator decides on.
- Skills: `lernapps-explainer-self-assessment` (an explainer), `lernapps-github`, `lernapps-commit`,
  `lernapps-listing`.
-->

### Tasks

- [x] `grep '^phase:'` prints `phase: commit`; else set it.
- [x] An explainer: load skill `lernapps-explainer-self-assessment` (missing → `npx --no -- lernapps skills --archetype
      explainer`). Add the self-assessment as it says, or
      write under "Key decisions" why the app has none. Commit; the hooks check.
- [x] Load skill `lernapps-github`. Repo and Pages as it says: ask the repo name and every click only the creator can
      make in one message.
      Das Projekt `lernapps/klima` war schon da, Pages und die Freischaltung hat der Creator selbst gemacht: Der Push aus dem Codespace scheiterte (403, der Codespace-Schlüssel gilt nur für sein eigenes Projekt), also lud der Creator die App als ZIP über die Webseite hoch.
- [ ] Push `work`, open the preview pull request, see its checks to green as the skill says.
      Offen: Es gab keine Vorschau und keinen Pull Request. Der Creator hat die App direkt auf `main` hochgeladen (Upload als ein Commit, `04c6177`).
- [ ] **Checkpoint:** publish. Show what the app does and the preview link from the comment "Vorschau der App"; ask
      whether it may go online; put any open click into the same question. Wait for the yes.
      Nicht wie beschrieben gelaufen: Der Creator hat ohne Vorschau veröffentlicht ("Ab ins Netz"); live unter https://lernapps.net/klima/.
- [ ] Load skill `lernapps-commit`. Publish as skill `lernapps-github` says: `work` into `main` as one squash commit
      with the message from this plan, the run of `Pages` watched to the end.
      Offen: Die Veröffentlichung war ein Upload des Creators, kein Squash aus `work`; die Nachricht kam aus dem Plan (Skill `lernapps-commit`).
- [x] Open the address the job `deploy` printed; confirm the app shows. Use that address, never a derived one.
      Geprüft am 2026-11-16: https://lernapps.net/klima/ antwortet mit 200 und dem Titel "Klima in Europa".
- [x] Load skill `lernapps-listing`. Complete the entry draft (e.g. the address).
- [x] Fill the retrospective.
- [ ] Commit this plan on `main` and push it: the listing check and the review read it there.
      Offen: Der Codespace darf nicht pushen. Der Creator lädt `.vibe/plans/01-klima.md` selbst auf `main` von `lernapps/klima` hoch.
- [ ] **Checkpoint:** list. Open the listing pull request as the skill says, without asking first: the pull request
      is the review. See it to "bestanden", then show the creator the pull request and its result; change nothing in
      it without their word.
      Offen: Der Eintrag ist geschrieben und lokal geprüft ("bestanden"). Den Pull Request aus einem Fork konnte der Codespace nicht öffnen (kein Push-Zugriff); der Creator legt ihn über die Webseite an oder nutzt das Formular.
- [ ] Plan changed since its last push → commit it on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit, before the listing pull request. Facts, short, no names. Read by review and evals. -->

### Phases reached

Commit erreicht. Checkpoints Recherche (geändert, dann bestätigt), Plan (bestätigt), Musterseite (mit Änderungswünschen bestätigt) bestanden. Veröffentlicht vom Creator per Upload, ohne Vorschau. Eintrag lokal geprüft ("bestanden"); der Pull Request an `lernapps/apps` steht noch aus.

### Creator turns after the plan

Neun Nachrichten nach der Bestätigung des Plans: Rückmeldung zur Musterseite (Monatsknöpfe, Fehlermeldung, Denkfrage), "weitermachen", Veröffentlichen, dann sechs zu GitHub (Ort der App, Name, ZIP, Ursache des Push-Fehlers, Commit-Nachricht, Eintragen). Das Ziel von drei wurde wegen des Push-Zugriffs deutlich überschritten.

### Where I had to guess

- Bundesland und Schulform fehlten: KMK-Standards, die es für Erdkunde nicht gibt; Aufbau nach der Lernlandkarte.
- Sprache nur Deutsch, Anrede "du", Detektivrahmen, Aussehen ruhig wie ein Arbeitsblatt.
- Zehn Orte: Rom und Kiruna entfielen (Datenlage); Madrid zählt zum Mittelmeerklima, obwohl es auf einer Hochebene liegt.
- Klimadaten teils selbst aus Monatswerten gemittelt (Reykjavik, NOAA-Orte); Nutzungsbedingungen von DWD und Isländischem Wetterdienst nicht bestätigt.
- Orte einer Zone dürfen beim Klimadetektiv füreinander durchgehen; Toleranzen nach dem Lernenden-Check geweitet.
- Der Codespace durfte nicht pushen; deshalb Upload als ZIP und kein Squash aus `work`.
