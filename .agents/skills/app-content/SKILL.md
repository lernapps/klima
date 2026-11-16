---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, chapters, pages, rounds, questions, exercises, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

Die App "Klima in Europa" ist ein Explainer (format 2) für Erdkunde, Klasse 6: Lernende lesen kurze Erklärseiten zu
Wetter, Klima und Klimadiagrammen und üben auf jeder Seite. Plan: `.vibe/plans/01-klima.md`.

## Curriculum

- Fach Erdkunde, Klasse 6, kein Land und keine Schulform genannt. Die KMK hat keine Bildungsstandards für Erdkunde;
  es wird kein Lehrplan zitiert ("not checked"). Orientierung ist die Lernlandkarte
  https://lernapps.net/apps/map/erdkunde.json, Strang `erdkunde/klima` ("Wetter, Klima und Landschaftszonen").
- Die Kompetenzen `klimadiagramm-lesen`, `klimadiagramm-zeichnen`, `seeklima-landklima` und `klimazonen-europas` liegen
  auf der Karte im Klassenband 7–8; die App zieht sie für Klasse 6 vor (Wunsch der Ersteller:in). Der Katalogeintrag
  sagt es (`grades: [6]`).
- Kein eigenes Material der Ersteller:in; alle Inhalte stammen aus offenen Quellen (siehe Sources).

## Competencies

Wortlaut und ids der Lernlandkarte, nicht umformulieren. Pro Kapitel ein Ordner in `src/`, pro Seite eine Datei
`src/<kapitel>/<seite>.yaml` mit `competencies: [<id>]`.

- Kapitel `wetter-klima` "Wetter oder Klima?"
  - `wetter-und-klima`: Ich kann Wetter und Klima unterscheiden und die Wetterelemente Temperatur, Niederschlag,
    Luftdruck und Wind nennen. Seite `wetter-klima/wetter-und-klima`.
  - `wetter-messen`: Ich kann Temperatur und Niederschlag messen, die Werte in eine Tabelle eintragen und als Diagramm
    darstellen. Seite `wetter-klima/wetter-messen`.
- Kapitel `diagramme` "Klimadiagramme knacken"
  - `klimadiagramm-lesen`: Ich kann ein Klimadiagramm lesen und damit das Klima eines Ortes beschreiben. Seiten
    `diagramme/lesen` (ablesen) und `diagramme/humid-arid` (humide und aride Monate).
  - `klimadiagramm-zeichnen`: Ich kann aus einer Klimatabelle ein Klimadiagramm zeichnen. Seite `diagramme/zeichnen`
    (Komponente `ZeichneDiagramm`) und `detektiv/vorhersage` (Komponente `KlimaDetektiv`, Anwendung am Ende).
- Kapitel `europa` "Klima in Europa"
  - `seeklima-landklima`: Ich kann erklären, warum es in Westeuropa milde Winter und kühle Sommer gibt und im Osten
    kalte Winter und heiße Sommer, auch mit dem Golfstrom. Seite `europa/see-land`.
  - `klimazonen-europas`: Ich kann die Klima- und Vegetationszonen Europas nennen und auf einer Karte zeigen. Seiten
    `europa/zonen` (Überblick) und `europa/zonen-orte` (Orte und Diagramme je Zone). `topographie-europa` wird nicht
    geübt: Link im Text von `europa/zonen` auf https://lernapps.net/apps/map/erdkunde/c/topographie-europa/.
- Kapitel `detektiv` "Klimadetektiv": Seite `detektiv/vorhersage`.
- Übungs-ids: `<seite>-<nr>` (z. B. `lesen-1`); ids bleiben stabil.

## Content structure

- Jede Seite hat dieselben Abschnitte (`section`), ids fest, Titel passen zur Seite:
  - `einstieg`: eine Situation aus dem Alltag von 12-Jährigen (Urlaub, Koffer packen, Training im Regen), dann ein
    Satz "Das kannst du danach: …" und wie die Seite auf der vorigen aufbaut (`explainer-page-goal`).
  - `erklaerung`: eine neue Idee (`explainer-one-step`) mit Figur oder Diagramm. Vor jeder Figur steht, was sie
    zeigt, was Linie, Säule und Farbe bedeuten und welche Fehllesung häufig ist.
  - `beispiel`: ein `example`-Kasten mit einem durchgerechneten Ort.
  - `uebung`: 3–5 Aufgaben von Erkennen über Anwenden zu einer neuen Situation (`explainer-exercise-progression`).
- Länge: eine Seite lässt sich in 10–15 Minuten bearbeiten; ein Absatz hat höchstens drei kurze Sätze.
- Jede Übung hat `explanation`, bei falschen Optionen je ein `info` mit dem Grund, und einen `hint`.

## Zones

- Zonen Europas (Quelle: Wikipedia "Europa", Abschnitte Klima und Flora; Seeklima und Kontinentalklima: Wikipedia
  "Seeklima", "Kontinentalklima"): Mittelmeerklima (`mediterran`), ozeanisches Klima (`ozeanisch`), Kontinentalklima
  (`kontinental`), kalter Norden (`norden`: Taiga und Tundra), Hochgebirge (`gebirge`: Höhenstufen). `uebergang` ist nur
  Berlin (Mitteleuropa zwischen See- und Landklima), keine Zone zum Üben.
- Beispielorte: Athen und Lissabon (mediterran; Madrid auch, aber auf einer Hochebene), Brest und Bergen (ozeanisch), Moskau
  (kontinental), Tromsø und Reykjavik (Norden), Zugspitze (Gebirge).

## Terminology

- Anrede "du", kurze Sätze, Ton neugierig und klar; Rahmen "Klimadetektiv": Diagramme sind Hinweise, Orte sind
  Fälle. Keine Punkte, keine Zeitlimits, kein Druck.
- Wörter der App: Klimadiagramm, Temperaturkurve (rote Linie), Niederschlagssäulen (blaue Säulen), humid (feucht:
  Niederschlag liegt über der Temperaturkurve), arid (trocken: Temperaturkurve liegt darüber), Seeklima, Landklima,
  Klimazone, Vegetation. Nicht: "Wettergraph", "Regenbalken".
- Einheiten: Temperatur in °C, Niederschlag in mm; Jahresmittel und Jahressumme werden gesagt ("Jahresniederschlag").
- Walter/Lieth: 10 °C entsprechen 20 mm Niederschlag auf der Skala; ein Monat ist humid, wenn mm > 2 × °C.
- Glossar: Begriffe als `definition`-Block bei ihrer ersten Verwendung: Wetter, Klima, Klimadiagramm, humid, arid,
  Seeklima, Landklima, Klimazone, Vegetation.

## Exercise patterns

Jede Seite endet in `uebung` mit Aufgaben von Erkennen über Anwenden zur neuen Situation. Muster je Seite (Ids in der Datei):

- `Wetter oder Klima` (`wetter-klima/wetter-und-klima`): `single-choice` (welcher Satz ist Wetter), `multiple-choice` (welche
  Aussagen sind Klima), `matching` Wetterelement ↔ Frage, `true-false` mit Begründung. Fehlvorstellung "Klima = Wetter von heute".
- `Mittelwert und Summe` (`wetter-klima/wetter-messen`): `matching` Messung ↔ Darstellung (Linie, Säulen), zwei `generated`
  (Mittelwert aus fünf Temperaturen, Monatssumme aus vier Wochen; `mistakes` für Summe statt Mittelwert und falsche Anzahl),
  `number` (mm ↔ Liter). Die Zahlen: fünf Tage, damit der Mittelwert höchstens eine Nachkommastelle hat.
- `Diagramm ablesen` (`diagramme/lesen`): `KlimaDiagramm` mit `ort` gegeben, danach `single-choice`, `number` (Toleranz ±1 °C),
  `single-choice`, `true-false`, neuer Ort (Madrid) mit `single-choice`. Fehllesung "Säulenhöhe = Temperatur" in `info`.
  Denkfrage "Wo in Europa könnte dieser Ort liegen?" nach dem Diagramm ohne Namen.
- `Humid und arid` (`diagramme/humid-arid`): `KlimaDiagramm` mit Schalter "Feuchte und trockene Monate zeigen" (`humidSchalter`) nur
  zum Erklären; in den Übungen ohne Schalter: `true-false`, `multiple-choice` (Athen), `single-choice`, `number` (aride Monate) und `generated`
  `humid-arid-5` (Grenze zwischen humid und arid bei gegebener Temperatur: 2 · °C; Fehler: halbiert, Temperatur übernommen).
- `Diagramm zeichnen` (`diagramme/zeichnen`): `true-false`, `number` (Säulenhöhe an der linken Achse), dann Komponente
  `ZeichneDiagramm` (Tabelle gegeben; Lernende wählen Temperatur oder Niederschlag, tippen im Achsenkreuz oder schreiben die Zahl; Pfeiltasten
  gehen auch; prüft jeden Monat mit ±1 °C und ±10 mm, über 100 mm ±25 mm; `reason` nennt Monat und Merkmal, erkennt halbe Säulen und
  vertauschte Reihen). Texte: `src/data/zeichentexte.yaml` (Meldungen) und `src/data/zeichenanzeige.yaml` (Bildschirm); Aufgabe
  `zeichnen-3`. Der Ort kommt aus `orte.yaml` je Aufgabennummer; `examples` im Block nennen Seeds und die Werte des Ortes.
- `See- und Landklima vergleichen` (`europa/see-land`): `number` (Temperaturspanne, Toleranz ±1,5 °C), `single-choice` "Warum?" mit
  plausiblen falschen Erklärungen, `multiple-choice`, `true-false` (Golfstrom). Löst die Denkfrage von `diagramme/lesen` auf (Berlin).
- `Zone zuordnen` (`europa/zonen`, `europa/zonen-orte`): `single-choice`, `matching` Zone ↔ Pflanzen, `matching` mit Karte als `material`
  (`pairsFrom: material`, Marker A–E), `true-false`; auf `zonen-orte` Diagramm ohne Namen mit `single-choice`, `matching` Ort ↔ Zone,
  `single-choice` mit Karte.
- `Klimadetektiv` (`detektiv/vorhersage`): `single-choice` (Meer und Spanne, Höhe und Temperatur), dann Komponente `KlimaDetektiv`
  (Hinweise zum Ort aus `orte.yaml`: Breite, Höhe, `lage`; feste Achsen). Geprüft werden berechnete Merkmale mit Toleranzen
  (`TOLERANZ` in `src/components/KlimaDetektiv.ts`: Jahresmittel ±4 °C, Spanne ±6 K, wärmster und kältester Monat ±1 Monat, Jahresniederschlag
  ±30 %, humide Monate ±1, Verhältnis Sommer- zu Winterregen; Temperatur über 45 °C gilt als vertauscht); `reason` stellt eine Frage,
  nie die Lösung. Der Ort kommt aus der Aufgabennummer (Reihenfolge in `orte.yaml`). Texte: `src/data/detektivtexte.yaml` und
  `src/data/detektivanzeige.yaml`; Aufgabe `detektiv-3`. Ein neuer Ort in `orte.yaml` braucht ein `lage` ohne Klimawerte und muss sich vom
  Diagramm jedes Orts einer anderen Zone unterscheiden (Test in `KlimaDetektiv.test.ts`; Orte einer Zone dürfen füreinander durchgehen).

## Figures

- Klimadiagramm: nur die Komponente `KlimaDiagramm` (`src/components/`; Monat antippen im Diagramm); rote Linie Temperatur links in °C, blaue Säulen
  Niederschlag rechts in mm, Skala 10 °C : 20 mm, humide Fläche blau, aride Fläche gelb gepunktet; Monate J F M A M J J A S O N D
  mit ausgeschriebenem Namen im `nojs`-Text. Farben und ein zweites Merkmal (Muster, Beschriftung) in Hell und Dunkel.
- Karten und Zeichnungen: SVG in `src/images/`, mit `source` und `licence`: `europa.svg` und `golfstrom.svg` sind eigene
  Karten nach Natural-Earth-Daten (gemeinfrei, Lambert-Azimutalprojektion; Skript nicht im Repo, Marker-Positionen in Prozent
  stehen in den Seiten). Europakarte mit Markern A–E per `labelled-figure`; bei `legend: false` muss `alt` jede Marke mit
  ihrer Lage nennen. Orientierung Norden oben. Jede Figur hat `alt` (was zu sehen
  ist) und `caption` (worauf achten); sie zeigt das Gegebene, nie die Lösung (`explainer-figure-hides-answer`).
- Alle Figuren funktionieren bei 360 px (Diagramm skaliert, Beschriftung bleibt lesbar).

## Sources

- Diagrammaufbau: https://de.wikipedia.org/wiki/Klimadiagramm (Titel "Klimadiagramm", CC BY-SA 4.0; verified,
  Fakten, keine Sätze übernommen).
- Klimadaten Deutschland: DWD Open Data, Mittelwerte 1991–2020
  https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/multi_annual/mean_91-20/ (Verzeichnis
  verified; Nutzungsbedingungen noch lesen: not checked).
- Klimadaten, zehn Orte in `src/data/orte.yaml`, jede Zeile mit `quelle`: Reykjavik (Isländischer Wetterdienst, Monatswerte
  der Station, Mittel 1991–2020 selbst berechnet), Berlin-Dahlem und Zugspitze (DWD Open Data, Mittel 1991–2020), Madrid
  Retiro (AEMET, Normalwerte 1981–2010), Tromsø, Bergen, Brest, Moskau, Lissabon, Athen (NOAA NCEI, Global Summary of the
  Month, Mittel 1991–2020 selbst berechnet; Athen hat 20 bis 27 Jahre je Monat, Rom wurde wegen zu weniger Temperatur-
  jahre nicht aufgenommen). Quelldaten gelesen und gerechnet am 2026-11-15. Nutzungsbedingungen von DWD und
  Isländischem Wetterdienst nicht bestätigt (not checked); NOAA-Daten sind frei nutzbar (nicht eigens geprüft).
- Wikipedia-Klimatabellen und Wetterkontor wurden nicht verwendet (Herkunft der Zahlen unklar).
- Zonenliste Europas, zweite Quellen pro Kompetenz: noch nicht geprüft; ohne geprüfte Quelle weglassen. Nichts aus dem
  Gedächtnis.
- Kein eigenes Material der Ersteller:in. Nichts über echte Lernende.

## Adding a chapter or round

1. Kompetenz aus der Lernlandkarte wählen (`https://lernapps.net/apps/map/erdkunde.json`, Strang `klima`), id und
   "Ich kann …"-Satz übernehmen; `requires` beachten, Voraussetzung vor die Seite oder verlinken.
2. Neuen Ort für Diagramme: Datensatz in `src/data/orte.yaml` (id, name, land, zone, breite, meer, hoehe, temperaturen[12],
   niederschlag[12], zone, lage, quelle); Test `src/components/Orte.test.ts` prüft die Reihen (12 Werte, Bereiche, Quelle, Zone, Lage).
3. Ordner `src/<kapitel>/` mit `chapter.yaml` (title, summary, pages), Kapitel in `src/app.yaml` unter `chapters`
   eintragen; je Seite eine Datei `src/<kapitel>/<seite>.yaml` nach dem Muster von `src/diagramme/lesen.yaml`
   (Abschnitte `einstieg`, `erklaerung`, `beispiel`, `uebung`; `competencies: [<id>]`).
4. Übungen aus den Mustern oben; jede falsche Option mit `info`.
5. Glossarbegriffe als `definition`; Bilder mit `source` und `licence` in `src/images/`.
   1 bis 3 ihrer Übungen in `selfAssessment` (`chapter.yaml`) aufnehmen, wie Skill `lernapps-explainer-self-assessment` sagt:
   nur Übungen, die ohne ihre Seite klar sind (nicht die mit einem Diagramm über der Übung), je Seite 2 bis 3, eine `generated`
   oder Komponente möglichst doppelt aufgelistet. Die Seiten `diagramme/lesen` sind nicht dabei: ihre Übungen brauchen das
   Diagramm der Seite ("Nicht abgefragt").
6. Diesen Leitfaden und `.vibe/plans/` ändern, wenn sich eine Entscheidung ändert.
7. `npx --no -- lernapps check`, dann Commit auf `work`.

## Rules learned from mistakes

- Fehlermeldungen und Texte benennen Achse und Zeichen richtig: die linke Achse gehört zur Temperatur (rote Linie), die
  rechte zum Niederschlag (blaue Säulen). Nie "die Säule an der linken Achse" sagen; sagen, wie man sie falsch gelesen
  hat und wohin sie gehört.
- Im Klimadiagramm wählt man einen Monat im Diagramm selbst (Säule oder Monatsname antippen), nicht über eine eigene
  Reihe großer Knöpfe.
- Jede Seite, die ein Diagramm ohne Ort zeigt, stellt die Denkfrage "Wo in Europa könnte dieser Ort liegen?"; die Antwort
  kommt im Kapitel `europa` (die Seite `europa/see-land` löst die Denkfrage von `diagramme/lesen` auf, Berlin, und verweist
  zurück).
