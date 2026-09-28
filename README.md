# KI-Tag-Generator

Meta-Tool für pädagogische Tage zum Thema KI nach dem Muster des Master-Pakets KI-Tag
(`../Master-Paket_KI-Tag`): vormittags KI mit der Klasse auf einer datenschutzkonformen
Plattform, nachmittags Materialerstellung mit einer starken KI.

## Start

Statische Website, kein Build. Lokal über einen Webserver öffnen, damit die Schriften
eingebettet werden können:

    python3 -m http.server 8796

Dann http://localhost:8796 öffnen. Preview-Config in `~/Claude/.claude/launch.json`: `ki-generator`.
Direkt als Datei (file://) läuft das Tool auch, dann mit Systemschriften in den Vorträgen.

## Eingaben

Schule, Datum, Moderation, Bundesland, Board-Link, Farbe · Beginn, Ende, Mittagspause ·
Teilnehmende, Moderationsteam, Vorkenntnisse · Vormittag: fobizz, AIS.chat oder andere
Plattform, fünf Arbeitsformen (Ping-Pong, Tutor, Dialogpartner, Streitpartner, Übungspartner) ·
Nachmittag: Gemini, Claude, ChatGPT, Claude Code, Codex und fünf Wege zum Material.

## Ausgabe

11 Word-Dateien (Ablaufplan, Orga-Checkliste, Einladung, Arbeitsaufträge, Themen-Rezept,
System-Prompt-Baukasten, Klickweg der Plattform, Werkzeugkasten, Sammel-Template, Feedbackbogen),
3 Vorträge als offline-HTML mit Sprechnotizen, eine Teilnehmer-Website. Alles einzeln oder als ZIP,
dazu `einstellungen.json` zum späteren Weiterbearbeiten.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `js/data.js` | Inhaltsbibliothek: Plattformen, Arbeitsformen, Werkzeuge, Wege, Guardrails |
| `js/plan.js` | Zeitplan (kürzt und streckt in fester Reihenfolge) und Logistik aus der Teilnehmerzahl |
| `js/docs.js` | Dokumente als Blockmodell |
| `js/decks.js` | Folien und Deck-Template |
| `js/art.js` | drei Grafiken aus dem Master-Paket, umfärbbar |
| `js/render.js` | Blockmodell zu HTML, Website und Word (docx-Bibliothek) |
| `js/app.js` | Oberfläche, Vorschau, Downloads, ZIP |
| `vendor/` | docx 9.8.1 und JSZip 3.10.2, lokal |

## Pflege

Fachliche Texte stehen nur in `js/data.js`. Oberflächen von fobizz, AIS.chat und den
KI-Werkzeugen ändern sich schnell: vor jedem Termin die Klickwege gegen die echte Oberfläche halten.
Stand der Inhalte: September 2026.
