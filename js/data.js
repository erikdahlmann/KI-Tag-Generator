/* Inhaltsbibliothek des KI-Tag-Generators.
   Alles, was fachlich im Material steht, liegt hier. Die Bausteine stammen aus dem
   Master-Paket KI-Tag (Stand September 2026) und sind nach Plattform, Arbeitsform
   und Werkzeug aufgefächert. Oberflächen ändern sich schnell: Vor jedem Termin die
   Stellen mit "pruefen" in der Orga-Checkliste einmal gegen die echte Oberfläche halten. */

const LIB = {};

/* ---------- Vormittag: Plattformen für die Arbeit mit Lernenden ---------- */
LIB.plattformen = {
  fobizz: {
    name: 'fobizz',
    kurz: 'fobizz-Klassenräume mit eigenen KI-Assistenten',
    schuelerZugang: 'Zugangscodes, Anmeldung auf go.fobizz.com ohne Namen und ohne Konto',
    botWort: 'KI-Assistent',
    raumWort: 'Klassenraum mit Projekt',
    voraussetzung: [
      'Die Schule hat eine fobizz-Lizenz, mit der alle Lehrkräfte eigene KI-Assistenten anlegen können.',
      'Jede Lehrkraft hat ihr fobizz-Konto vor dem Tag aktiviert und sich einmal angemeldet.'
    ],
    stationen: [
      { t: 'Assistent bauen', d: 'Bei fobizz anmelden, unter „Eigene KI-Assistenten“ einen Assistenten anlegen. Name, ein Satz Beschreibung (den sehen die Lernenden) und die Instruktionen aus dem System-Prompt-Baukasten. Plugins nur, wenn der Bot sie für seine Aufgabe braucht. Einen Chatstarter setzen, also den ersten Satz, den die Lernenden nur anklicken. Speichern.' },
      { t: 'Selbst testen', d: 'Über „Chat starten“ den Bot ausprobieren. Der wichtigste Test: direkt nach der Lösung fragen. Gibt er sie heraus, die Guardrails nachschärfen.' },
      { t: 'Klassenraum und Projekt', d: 'Unter „Organisieren“ einen Klassenraum anlegen. Für heute reicht die Variante für 24 Stunden, für eine echte Lerngruppe nehmt ihr ein Jahr. Zugänge: eine Zahl über der Klassenstärke. Darin ein neues Projekt mit dem Arbeitsauftrag anlegen.' },
      { t: 'Bot freigeben', d: 'Im Projekt unter „Inhalte hinzufügen“ den Bot aus „Meine Ablage“ wählen. Bei den freigegebenen Tools nur anhaken, was die Lernenden brauchen. Das KI Multimedia Tool bleibt aus.' },
      { t: 'Codes an die Klasse', d: 'Über „Zugangscodes anzeigen“ die Liste drucken. Jede Karte trägt Adresse, Code und Kürzel. Wer welches Kürzel hat, notiert ihr auf Papier. Die Lernenden öffnen go.fobizz.com und tippen den Code ein.' }
    ],
    testen: 'Einen eurer Zugangscodes an die andere Gruppe geben. Sie öffnet go.fobizz.com in einem privaten Browserfenster, sonst stört die eigene Lehrkraft-Anmeldung.',
    textRegel: 'fobizz hat ein KI Multimedia Tool, mit dem Lehrkräfte Bilder auswerten können. Im Projekt lässt es sich sogar freigeben. Für die Klasse bleibt es aus: Lernende dürfen keine personenbezogenen Daten eingeben, und auf Fotos von Heften stehen schnell Namen, Gesichter und Handschrift.',
    datenschutz: 'Die Lernenden melden sich mit Codes an, ohne Namen, E-Mail oder Konto. Die Lehrkraft sieht die Chats pseudonymisiert unter „Aktivitäten“.',
    hinweise: [
      'Erst den Bot bauen, dann den Klassenraum. Im Projekt wählt ihr den Bot nur noch aus der Ablage.',
      'Ein Projekt im 24-Stunden-Raum läuft 24 Stunden, danach ist es pausiert.',
      'Unter „Aktivitäten“ seht ihr die Chats der Lernenden. Das ist für die Reflexion nützlich.'
    ]
  },
  ais: {
    name: 'AIS.chat',
    kurz: 'AIS.chat, der Schul-Chatbot der Länder (FWU)',
    schuelerZugang: 'Link oder QR-Code zu einem Klassendialog, ohne eigenes Konto',
    botWort: 'Dialogpartner',
    raumWort: 'Lernszenario beziehungsweise Klassendialog',
    voraussetzung: [
      'Die Schulleitung hat die Schule bei AIS.chat registriert und der Auftragsverarbeitung zugestimmt.',
      'Alle Lehrkräfte sind als Nutzerinnen und Nutzer angelegt und haben sich vor dem Tag einmal angemeldet.',
      'In NRW ist der kostenlose KI-Selbstlernkurs im Lernmanagementsystem NRW Voraussetzung für die Nutzung. Den Kurs rechtzeitig vorher ankündigen.'
    ],
    stationen: [
      { t: 'Anmelden', d: 'Über den Zugang eures Landes bei AIS.chat anmelden (in NRW über lernen-digital.nrw). Oben seht ihr einen Balken mit dem Tokenkontingent. Er zeigt, wie viel vom Monatsvolumen noch übrig ist.' },
      { t: 'Dialogpartner oder Lernszenario anlegen', d: 'Einen neuen Dialogpartner beziehungsweise ein Lernszenario anlegen. Name, kurze Beschreibung für die Lernenden und die Anweisung aus dem System-Prompt-Baukasten eintragen. Ein Sprachmodell wählen. Speichern.' },
      { t: 'Selbst testen', d: 'Den Dialog selbst durchspielen. Der wichtigste Test: direkt nach der Lösung fragen. Gibt er sie heraus, die Guardrails nachschärfen.' },
      { t: 'Klassendialog teilen', d: 'Den Dialog für die Klasse freigeben. Ihr bekommt einen Link und einen QR-Code. Beides auf die Tafel oder in den Kursordner, die Lernenden brauchen kein Konto.' },
      { t: 'Auftrag dazulegen', d: 'Den Schüler-Arbeitsauftrag in die Beschreibung schreiben oder als Text neben den Link stellen, damit die Lernenden wissen, was sie abgeben sollen.' }
    ],
    testen: 'Den Link oder QR-Code eures Dialogs an die andere Gruppe geben. Sie öffnet ihn in einem privaten Browserfenster, sonst stört die eigene Lehrkraft-Anmeldung.',
    textRegel: 'AIS.chat kann Dokumente verarbeiten. Die Lernenden laden trotzdem nichts hoch: Sie dürfen keine personenbezogenen Daten eingeben, und auf Fotos und Scans von Heften stehen schnell Namen und Handschrift.',
    datenschutz: 'AIS.chat läuft in der EU, Eingaben werden nicht zum Training genutzt und nicht an Dritte weitergegeben. Lernende arbeiten ohne eigenes Konto über den geteilten Link.',
    hinweise: [
      'Das Tokenkontingent gilt pro Monat. Ein Fortbildungstag mit vielen Testläufen verbraucht spürbar davon.',
      'Die Bezeichnungen in der Oberfläche (Dialogpartner, Lernszenario, Klassendialog) können sich mit Updates ändern.',
      'Wer den Selbstlernkurs noch nicht gemacht hat, kann am Tag nicht mitarbeiten. Das früh klären.'
    ]
  },
  andere: {
    name: '', /* wird aus der Eingabe übernommen */
    kurz: 'die an eurer Schule freigegebene KI-Plattform',
    schuelerZugang: 'Zugang ohne personenbezogene Daten, so wie die Plattform es vorsieht',
    botWort: 'Assistent',
    raumWort: 'Lernraum',
    voraussetzung: [
      'Die Plattform ist von der Schule datenschutzrechtlich geprüft und für Lernende freigegeben.',
      'Alle Lehrkräfte haben vor dem Tag ein Konto und haben sich einmal angemeldet.'
    ],
    stationen: [
      { t: 'Assistent anlegen', d: 'In der Plattform einen eigenen Assistenten oder Bot anlegen. Name, kurze Beschreibung und die Anweisung aus dem System-Prompt-Baukasten eintragen. Speichern.' },
      { t: 'Selbst testen', d: 'Den Bot selbst durchspielen und direkt nach der Lösung fragen. Gibt er sie heraus, die Guardrails nachschärfen.' },
      { t: 'Für die Klasse freigeben', d: 'Einen Lernraum oder Link für die Lerngruppe anlegen und den Bot dort freigeben.' },
      { t: 'Auftrag dazulegen', d: 'Den Schüler-Arbeitsauftrag neben den Bot stellen.' }
    ],
    testen: 'Den Zugang eures Bots an die andere Gruppe geben. Sie öffnet ihn in einem privaten Browserfenster.',
    textRegel: 'Die Lernenden geben nur Text an die KI. Fotos und Scans bleiben draußen, weil darauf schnell Namen, Gesichter und Handschrift stehen.',
    datenschutz: 'Die Lernenden arbeiten ohne Klarnamen und geben keine personenbezogenen Daten ein.',
    hinweise: ['Vor dem Tag klären, wie die Lernenden in den Lernraum kommen und was die Lehrkraft davon sieht.']
  }
};

/* ---------- Vormittag: Arbeitsformen mit der Klasse ---------- */
LIB.formen = {
  pingpong: {
    name: 'KI-Ping-Pong',
    kurz: 'Die Klasse schreibt, die KI gibt kriterienbasiertes Feedback, die Klasse überarbeitet.',
    idee: 'Die Lernenden schreiben etwas, die KI spielt kriterienbasiertes Feedback zurück, sie überarbeiten. Die Kunst liegt darin, dass die KI nachfragt und die Lösung für sich behält.',
    ablauf: ['Sie schreiben einen ersten Entwurf.', 'Sie geben ihn ab und lesen das Feedback des Bots.', 'Sie prüfen die Hinweise kritisch und übernehmen sie nicht blind.', 'Sie überarbeiten. Wenn Zeit ist, über mehrere Runden.'],
    rolle: 'Schreibcoach',
    beispielPrompt: 'Du bist ein Schreibcoach für Deutsch in Klasse 9. Du sprichst die Lernenden freundlich und ermutigend an.\n\nBewerte den Argumentationsabsatz nur an diesen Kriterien: klare These, tragfähige Begründung, passender Beleg, ein berücksichtigtes Gegenargument. Erfinde keine weiteren.\n\nGib kurzes, konkretes Feedback, höchstens vier Sätze. Nimm dir pro Runde ein bis zwei Kriterien vor. Lob, was gelungen ist, und nenn einen nächsten Schritt.\n\nGib nie eine fertige Formulierung. Fragt jemand nach der Lösung, stell eine Rückfrage. Feedback immer als Impuls, nie als Korrektur. Bleib beim Thema. Sag offen, wenn du etwas nicht sicher weißt.',
    beispiele: [
      { fach: 'Deutsch / Sprachen', jg: 'ab Klasse 9', thema: 'Einen Argumentationsabsatz überarbeiten', auftrag: 'Schreib einen Absatz mit These, Begründung, Beleg und einem Einwand. Gib ihn ab und feile am Feedback entlang nach.', bot: 'Er prüft die Struktur: Fehlt der Beleg? Trägt die Begründung? Einen fertigen Absatz liefert er nicht, er fragt nach.', kern: 'Rolle: Schreibcoach. Kriterien: These, Begründung, Beleg, Einwand. Guardrail: keine Musterformulierung, nur Rückfragen.' },
      { fach: 'Gesellschaftswissenschaften', jg: 'Sek I und II', thema: 'Eine Stellungnahme aus einer Perspektive', auftrag: 'Beziehe begründet Stellung zur Leitfrage, aus deiner zugewiesenen Perspektive, mit mindestens zwei Sachargumenten. Dann nachschärfen.', bot: 'Er achtet darauf, ob die Perspektive durchgehalten wird, ob Sach- und Werturteil getrennt sind und ob die Argumente belegt sind.', kern: 'Rolle: kritischer Gegenpart. Kriterien: Perspektive, Sach-/Werturteil, Beleg. Guardrail: keine eigene Meinung äußern.' },
      { fach: 'MINT', jg: 'Sek I und II', thema: 'Den Rechenweg oder die Hypothese in Worten begründen', auftrag: 'Erklär deinen Lösungsweg Schritt für Schritt in eigenen Worten, nur als Text. Begründe jeden Schritt und gib die Erklärung ab.', bot: 'Er sucht Lücken in der Begründung: Welcher Schritt ist nicht begründet? Wo passt eine Einheit nicht? Das Ergebnis nennt er nie.', kern: 'Rolle: sokratischer Tutor. Kriterien: Korrektheit der Begründung, Vollständigkeit, Einheiten. Guardrail: niemals das Ergebnis verraten.' },
      { fach: 'Nebenfach / kreativ', jg: 'Sek I und II', thema: 'Eine Analyse oder ein Dilemma in Worten', auftrag: 'Beschreib oder analysiere in Worten (etwa eine Bildwirkung oder einen musikalischen Verlauf) oder argumentiere zu einem ethischen Dilemma. Text abgeben, nachschärfen.', bot: 'Er prüft die Fachbegriffe, trennt Beschreibung von Deutung oder wiegt beide Seiten ab. Bewerten tut er nicht, er fragt nach.', kern: 'Rolle: Fachcoach. Kriterien: Fachbegriffe, Beschreibung und Deutung bzw. Pro und Contra. Guardrail: keine fertige Analyse.' }
    ]
  },
  tutor: {
    name: 'Sokratischer Tutor',
    kurz: 'Die KI begleitet beim Lösen einer Aufgabe und hilft nur mit Fragen weiter.',
    idee: 'Die Lernenden arbeiten an einer Aufgabe und holen sich Hilfe beim Bot, wenn sie hängen. Der Bot fragt, was sie schon wissen, und gibt den kleinsten Impuls, der weiterhilft. Die Lösung schreiben die Lernenden selbst.',
    ablauf: ['Sie lesen die Aufgabe und notieren einen ersten Ansatz.', 'Wenn sie hängen, beschreiben sie dem Bot, wo genau.', 'Der Bot antwortet mit einer Frage oder einem kleinen Hinweis.', 'Am Ende schreiben sie in zwei Sätzen auf, welcher Hinweis geholfen hat.'],
    rolle: 'sokratischer Tutor',
    beispielPrompt: 'Du bist ein sokratischer Tutor für Mathematik in Klasse 8. Die Lernenden bearbeiten Aufgaben zu linearen Funktionen.\n\nFrag zuerst, was die Person schon versucht hat. Gib dann den kleinsten Hinweis, der weiterhilft, am besten als Frage. Steigere die Hilfe nur, wenn sie nach zwei Versuchen noch feststeckt.\n\nAntworte in höchstens drei Sätzen.\n\nNenne nie das Ergebnis und rechne keine Aufgabe vor. Fragt jemand nach der Lösung, frag zurück, welcher Schritt gerade unklar ist. Bleib beim Thema. Sag offen, wenn du etwas nicht sicher weißt.',
    beispiele: [
      { fach: 'Deutsch / Sprachen', jg: 'Klasse 7 bis 10', thema: 'Grammatik- oder Übersetzungsfrage klären', auftrag: 'Übersetze den Satz. Wenn du bei einer Form hängst, frag den Tutor und beschreibe, was du schon erkannt hast.', bot: 'Er fragt nach Kasus, Tempus oder Satzbau und lässt die Form selbst bestimmen. Die Übersetzung liefert er nicht.', kern: 'Rolle: Sprachtutor. Kriterien: grammatische Analyse. Guardrail: keine fertige Übersetzung.' },
      { fach: 'Gesellschaftswissenschaften', jg: 'Sek I', thema: 'Eine Quelle erschließen', auftrag: 'Erschließe die Quelle mit den W-Fragen. Frag den Tutor, wenn dir eine Angabe fehlt oder unklar ist.', bot: 'Er lenkt den Blick auf Verfasser, Zeit und Absicht und fragt, woran man das im Text erkennt.', kern: 'Rolle: Quellen-Tutor. Kriterien: W-Fragen, Belegstellen. Guardrail: keine fertige Quellenanalyse.' },
      { fach: 'MINT', jg: 'Sek I und II', thema: 'Eine Übungsaufgabe lösen', auftrag: 'Löse die Aufgabe. Wenn du feststeckst, beschreib dem Tutor deinen Ansatz und wo es hakt.', bot: 'Er fragt nach gegebenen Größen, passenden Formeln und dem nächsten Schritt. Er rechnet nie vor.', kern: 'Rolle: sokratischer Tutor. Kriterien: Lösungsweg. Guardrail: kein Ergebnis, keine Rechnung.' },
      { fach: 'Nebenfach / kreativ', jg: 'Sek I und II', thema: 'Einen Fachbegriff anwenden', auftrag: 'Wende den Begriff auf das Beispiel an. Frag den Tutor, wenn du nicht weißt, wie du anfangen sollst.', bot: 'Er fragt nach Merkmalen des Begriffs und danach, welche davon im Beispiel zu finden sind.', kern: 'Rolle: Fachtutor. Kriterien: Merkmale des Begriffs. Guardrail: keine fertige Anwendung.' }
    ]
  },
  rollenspiel: {
    name: 'Dialogpartner im Rollenspiel',
    kurz: 'Die KI spielt eine Figur, eine Zeitzeugin oder ein Gegenüber in der Fremdsprache.',
    idee: 'Der Bot übernimmt eine Rolle: eine historische Person, eine Figur aus der Lektüre, einen Gesprächspartner in der Fremdsprache. Die Lernenden befragen ihn gezielt und prüfen die Antworten gegen das, was sie im Unterricht erarbeitet haben.',
    ablauf: ['Sie bereiten drei bis fünf Fragen an die Figur vor.', 'Sie führen das Gespräch und notieren wichtige Antworten.', 'Sie prüfen die Antworten an Quellen oder am Text: Was stimmt, was ist erfunden?', 'Sie halten fest, was sie über die Figur gelernt haben.'],
    rolle: 'Figur im Rollenspiel',
    beispielPrompt: 'Du spielst Sophie Scholl im Februar 1943. Die Lernenden einer 10. Klasse befragen dich für den Geschichtsunterricht.\n\nAntworte in der Ich-Form und nur mit dem, was Sophie Scholl zu diesem Zeitpunkt wissen konnte. Halte dich an gesicherte historische Fakten. Wenn du etwas nicht sicher weißt, sag, dass du dich nicht erinnerst.\n\nAntworte in höchstens fünf Sätzen und stell am Ende eine Gegenfrage an die Lernenden.\n\nVerlass die Rolle nicht. Beantworte keine Fragen zu Ereignissen nach 1943. Schreib keine Aufsätze oder Zusammenfassungen für die Lernenden.',
    beispiele: [
      { fach: 'Fremdsprachen', jg: 'ab Klasse 7', thema: 'Ein Alltagsgespräch führen', auftrag: 'Du bist in London und fragst nach dem Weg zum Museum. Führe das Gespräch auf Englisch.', bot: 'Er spielt einen Passanten, spricht auf dem Niveau der Klasse und korrigiert Fehler nur, indem er die richtige Form in seiner Antwort aufgreift.', kern: 'Rolle: Gesprächspartner. Kriterien: Sprachniveau A2. Guardrail: nicht ins Deutsche wechseln, keine Vokabellisten.' },
      { fach: 'Gesellschaftswissenschaften', jg: 'Sek I und II', thema: 'Eine Zeitzeugin befragen', auftrag: 'Befrage die Figur zu ihren Motiven. Prüfe danach zwei Antworten an der Quelle aus dem Buch.', bot: 'Er antwortet in der Rolle, bleibt bei gesicherten Fakten und gibt Unsicherheit zu.', kern: 'Rolle: historische Person. Kriterien: Faktentreue. Guardrail: Rolle nicht verlassen, nichts erfinden.' },
      { fach: 'Deutsch', jg: 'Sek I und II', thema: 'Eine Figur aus der Lektüre interviewen', auftrag: 'Stell der Figur Fragen zu ihrer Entscheidung im dritten Kapitel. Belege danach eine Antwort mit einer Textstelle.', bot: 'Er antwortet aus Sicht der Figur und bleibt beim Stand der Handlung.', kern: 'Rolle: literarische Figur. Kriterien: Textnähe. Guardrail: keine Interpretation liefern, nichts über das Ende verraten.' },
      { fach: 'MINT', jg: 'Sek I', thema: 'Eine Forscherin befragen', auftrag: 'Befrage Marie Curie zu ihrem Vorgehen bei der Entdeckung des Radiums.', bot: 'Er erzählt vom Vorgehen und fragt die Lernenden, was sie als Nächstes untersucht hätten.', kern: 'Rolle: Forscherin. Kriterien: Faktentreue, Methode. Guardrail: Rolle halten, keine Zusammenfassung liefern.' }
    ]
  },
  debatte: {
    name: 'Streitpartner',
    kurz: 'Die KI vertritt die Gegenposition und prüft die Argumente der Lernenden.',
    idee: 'Die Lernenden vertreten eine Position, der Bot hält dagegen. Er bringt Einwände, fragt nach Belegen und zwingt so zum Nachschärfen. Am Ende steht eine begründete eigene Stellungnahme.',
    ablauf: ['Sie formulieren ihre These mit zwei Argumenten.', 'Der Bot widerspricht mit einem Einwand pro Runde.', 'Sie entkräften den Einwand oder passen ihre These an.', 'Nach drei Runden schreiben sie eine überarbeitete Stellungnahme.'],
    rolle: 'Streitpartner',
    beispielPrompt: 'Du bist ein fairer Streitpartner für Politik in Klasse 10. Die Lernenden vertreten eine Position zur Frage, ob das Wahlalter auf 16 gesenkt werden soll.\n\nVertritt immer die Gegenposition zur These der Lernenden. Bring pro Runde genau einen sachlichen Einwand und frag nach einem Beleg für ihr stärkstes Argument.\n\nAntworte in höchstens vier Sätzen. Erkenne gute Argumente ausdrücklich an.\n\nÄußere keine eigene politische Meinung außerhalb der Rolle. Schreib keine Stellungnahme für die Lernenden. Bleib sachlich, auch wenn der Ton schärfer wird.',
    beispiele: [
      { fach: 'Deutsch / Sprachen', jg: 'ab Klasse 8', thema: 'Eine Erörterung vorbereiten', auftrag: 'Vertrete deine Position zur Leitfrage. Der Bot hält dagegen. Nach drei Runden schreibst du deine Einleitung neu.', bot: 'Er bringt je einen Einwand und fragt nach Beispielen.', kern: 'Rolle: Streitpartner. Kriterien: Argument, Beleg, Beispiel. Guardrail: keine fertige Erörterung.' },
      { fach: 'Gesellschaftswissenschaften', jg: 'Sek I und II', thema: 'Ein Urteil begründen', auftrag: 'Beziehe Stellung zur Leitfrage und verteidige sie gegen die Einwände des Bots.', bot: 'Er trennt Sach- und Werturteil und fragt, welche Werte hinter dem Urteil stehen.', kern: 'Rolle: Gegenpart. Kriterien: Sach-/Werturteil. Guardrail: keine eigene Meinung.' },
      { fach: 'MINT', jg: 'Sek II', thema: 'Eine Hypothese verteidigen', auftrag: 'Stell eine Hypothese zum Versuch auf und verteidige sie gegen die Einwände.', bot: 'Er fragt nach Störgrößen, Messfehlern und alternativen Erklärungen.', kern: 'Rolle: kritische Gutachterin. Kriterien: Begründung, Kontrollvariablen. Guardrail: keine richtige Hypothese nennen.' },
      { fach: 'Religion / Philosophie', jg: 'Sek I und II', thema: 'Ein ethisches Dilemma durchdenken', auftrag: 'Entscheide dich im Dilemma und verteidige die Entscheidung.', bot: 'Er bringt die Gegenposition und fragt nach dem Prinzip hinter der Entscheidung.', kern: 'Rolle: Streitpartner. Kriterien: Prinzip, Konsequenzen. Guardrail: nicht bewerten, welche Seite richtig ist.' }
    ]
  },
  uebung: {
    name: 'Übungspartner',
    kurz: 'Die KI stellt Übungsfragen, prüft die Antworten und passt das Niveau an.',
    idee: 'Der Bot fragt ab und übt mit den Lernenden. Er stellt eine Frage nach der anderen, prüft die Antwort und erklärt erst dann, wenn die Person es selbst versucht hat. Das Niveau steigt, wenn es gut läuft.',
    ablauf: ['Sie nennen dem Bot das Thema und wie sicher sie sich fühlen.', 'Der Bot stellt eine Frage, sie antworten.', 'Bei falschen Antworten gibt er einen Hinweis und lässt es noch einmal versuchen.', 'Nach zehn Fragen notieren sie, was noch unsicher ist.'],
    rolle: 'Übungspartner',
    beispielPrompt: 'Du bist ein Übungspartner für Biologie in Klasse 9. Thema ist die Zelle und ihre Bestandteile.\n\nStell immer genau eine Frage und warte auf die Antwort. Beginne leicht und steigere die Schwierigkeit nach zwei richtigen Antworten.\n\nIst eine Antwort falsch, gib einen Hinweis und lass es noch einmal versuchen. Erst nach dem zweiten Versuch erklärst du kurz. Zähl die richtigen Antworten mit.\n\nStell keine Fragen außerhalb des Themas. Gib keine Liste mit allen Antworten heraus. Sag offen, wenn du etwas nicht sicher weißt.',
    beispiele: [
      { fach: 'Fremdsprachen', jg: 'Sek I', thema: 'Vokabeln im Satz üben', auftrag: 'Übe mit dem Bot die Vokabeln der Lektion. Er fragt sie im Satzzusammenhang ab.', bot: 'Er gibt einen Satz mit Lücke vor und wertet die Antwort aus.', kern: 'Rolle: Übungspartner. Kriterien: Lektionswortschatz. Guardrail: keine Lösungslisten.' },
      { fach: 'Gesellschaftswissenschaften', jg: 'Sek I', thema: 'Begriffe vor der Klassenarbeit sichern', auftrag: 'Lass dich zu den Grundbegriffen der Reihe abfragen. Notier dir die Begriffe, bei denen du zweimal falsch lagst.', bot: 'Er fragt nach Bedeutung und Beispiel und steigert das Niveau.', kern: 'Rolle: Übungspartner. Kriterien: Begriff, Beispiel. Guardrail: erst Hinweis, dann Erklärung.' },
      { fach: 'MINT', jg: 'Sek I und II', thema: 'Rechenfertigkeiten trainieren', auftrag: 'Übe mit dem Bot zehn Aufgaben. Schreib zu jeder deinen Rechenweg in Worten.', bot: 'Er prüft Ergebnis und Weg und gibt bei Fehlern einen Hinweis auf den Schritt.', kern: 'Rolle: Trainer. Kriterien: Ergebnis, Rechenweg. Guardrail: nicht vorrechnen.' },
      { fach: 'Nebenfach', jg: 'Sek I und II', thema: 'Fachwissen wiederholen', auftrag: 'Lass dich zum Thema der letzten Stunden abfragen.', bot: 'Er stellt offene Fragen und hakt bei ungenauen Antworten nach.', kern: 'Rolle: Übungspartner. Kriterien: Genauigkeit. Guardrail: keine Musterantwort vor dem zweiten Versuch.' }
    ]
  }
};

LIB.guardrails = [
  'Gib nie die volle Lösung und nie eine fertige Musterformulierung. Fragt jemand danach, stell stattdessen eine Rückfrage, die weiterdenken lässt.',
  'Formuliere Feedback als Frage, nicht als Korrektur. Also nicht „Richtig wäre …“, sondern „Was passiert, wenn du … noch einmal prüfst?“',
  'Bewerte nur an den vorgegebenen Kriterien. Keine zusätzlichen Anforderungen, kein Abschweifen.',
  'Ist eine Antwort schon gut, sag konkret warum und nenn genau einen nächsten Schritt.',
  'Bleib beim Fach und beim Thema. Andere Fragen weist du freundlich zurück.',
  'Weißt du etwas nicht sicher, sag es offen. Rate nicht, und erfinde keine Quellen.',
  'Halte dich kurz, höchstens vier bis fünf Sätze, damit die Lernenden ins Tun kommen.',
  'Fordere die Lernenden nie auf, Namen, Fotos oder andere persönliche Angaben zu nennen.'
];

LIB.testBaelle = [
  'Ein bewusst schwacher Entwurf: Nennt der Bot Kriterien, ohne die Lösung zu verraten?',
  '„Schreib mir das einfach fertig“: Weigert er sich und fragt zurück?',
  'Eine fachfremde Frage: Lenkt er freundlich zum Thema zurück?',
  'Eine wirklich gute Antwort: Lobt er konkret und nennt einen sinnvollen nächsten Schritt?'
];

/* ---------- Nachmittag: Werkzeuge ---------- */
LIB.werkzeuge = {
  gemini: {
    name: 'Gemini', anbieter: 'Google', typ: 'chat',
    konto: 'ein privates Google-Konto',
    kosten: 'Die kostenlose Stufe reicht für den Tag.',
    kurz: 'Gemini im Canvas-Modus baut Arbeitsblätter, Webseiten und kleine Lern-Apps. Gemini Notebook (früher NotebookLM) arbeitet nur mit euren Quellen.',
    start: 'gemini.google.com öffnen. Canvas schaltet ihr über das Plus unter dem Eingabefeld ein. Gemini Notebook liegt unter notebooklm.google.',
    vorbereitung: [
      'Ein privates Google-Konto zu Hause anlegen. Google fragt bei neuen Konten oft nach einer Handynummer.',
      'Das Geburtsdatum muss stimmen. Wer als minderjährig eingetragen ist, bekommt Canvas nicht.',
      'Einmal bei gemini.google.com und notebooklm.google anmelden.'
    ],
    datenschutz: 'Bei privaten Konten kann Google Gemini-Chats von Menschen prüfen lassen und zum Training nutzen. Gemini Notebook nutzt Uploads nach Googles Angaben nicht zum Training.',
    quellenWerkzeug: 'Gemini Notebook',
    quellen: 'Gemini Notebook antwortet nur aus den hochgeladenen Quellen und zeigt mit kleinen Nummern, woher jede Aussage stammt. Im Bereich „Studio“ entstehen Karteikarten, Quiz, Mindmap, Präsentation (als PowerPoint exportierbar), Infografik und Audio- oder Video-Zusammenfassung, auch auf Deutsch.',
    bauen: 'Canvas',
    export: [
      'Texte aus dem Canvas als Google-Dokument öffnen und von dort als Word-Datei oder PDF speichern.',
      'Interaktive Seiten über einen Link teilen. Der öffnet sich nur auf gemini.google.com. Vorher testen, ob er bei den Lernenden aufgeht.',
      'Präsentationen aus Gemini Notebook als PowerPoint exportieren.'
    ],
    hakt: 'Meldet Gemini, dass die Grenze erreicht ist, oben auf das schnellere Modell wechseln oder in Gemini Notebook weitermachen. Die Grenze setzt sich nach einigen Stunden zurück.'
  },
  claude: {
    name: 'Claude', anbieter: 'Anthropic', typ: 'chat',
    konto: 'ein privates Claude-Konto (claude.ai)',
    kosten: 'Die kostenlose Stufe reicht für einfache Materialien. Wer viel baut, stößt schnell an das Tageslimit.',
    kurz: 'Claude baut Dokumente, Webseiten und kleine Lern-Apps als Artefakt neben dem Chat. In einem Projekt legt ihr eure Quellen ab, auf die Claude sich dann stützt.',
    start: 'claude.ai öffnen und anmelden. Artefakte entstehen von selbst, wenn ihr eine Seite, ein Dokument oder eine App verlangt. Für Quellen links ein Projekt anlegen.',
    vorbereitung: [
      'Ein Konto auf claude.ai anlegen und einmal anmelden.',
      'In den Einstellungen unter Datenschutz prüfen, ob Chats zur Verbesserung der Modelle genutzt werden dürfen, und das ausschalten.'
    ],
    datenschutz: 'Bei privaten Konten entscheidet eine Einstellung, ob Chats zum Training genutzt werden. Vor dem Tag ausschalten.',
    quellenWerkzeug: 'ein Claude-Projekt',
    quellen: 'In einem Projekt ladet ihr PDFs, Texte und eigene Skripte hoch. Claude stützt jede Antwort in diesem Projekt auf diese Dateien. Fragt nach, woher eine Aussage stammt, und prüft die Stelle.',
    bauen: 'Artefakt',
    export: [
      'Dokumente aus dem Artefakt kopieren oder herunterladen und in Word weiterbearbeiten.',
      'Interaktive Artefakte über „Veröffentlichen“ als Link teilen. Vorher prüfen, ob eure Schule das erlaubt.',
      'Claude kann auf Wunsch auch Word-, PowerPoint- und PDF-Dateien erzeugen.'
    ],
    hakt: 'Ist das Limit erreicht, sagt Claude, wann es weitergeht. Dann in der Gruppe am Rechner einer anderen Person weiterarbeiten.'
  },
  claudecode: {
    name: 'Claude Code', anbieter: 'Anthropic', typ: 'agent',
    konto: 'ein Claude-Konto mit bezahltem Abo',
    kosten: 'Claude Code braucht ein bezahltes Abo. Ohne Abo geht es nicht.',
    kurz: 'Claude Code ist ein Agent: Er arbeitet in einem Ordner auf eurem Rechner, liest eure Dateien und legt selbstständig mehrere fertige Dateien an, etwa ein Arbeitsblatt als Word-Datei, die Lösung und eine interaktive Übungsseite.',
    start: 'Die Claude-App auf dem Rechner öffnen und in den Bereich „Code“ wechseln, einen Arbeitsordner wählen und den Auftrag in normaler Sprache schreiben. Claude Code fragt nach, bevor es Dateien anlegt oder Befehle ausführt.',
    vorbereitung: [
      'Die Claude-App vor dem Tag installieren und mit dem Abo-Konto anmelden. Das klappt auf Dienstgeräten oft nicht ohne Adminrechte.',
      'Einen leeren Arbeitsordner anlegen und ein, zwei eigene Materialien hineinlegen.',
      'In den Datenschutz-Einstellungen das Training mit eigenen Chats ausschalten.'
    ],
    datenschutz: 'Der Agent liest alle Dateien im gewählten Ordner. Deshalb nur einen Ordner mit eigenem Material öffnen, nie einen mit Schülerarbeiten oder Noten.',
    quellenWerkzeug: 'der Arbeitsordner',
    quellen: 'Alles, was im Arbeitsordner liegt, kann Claude Code lesen: Word-Dateien, PDFs, Bilder, alte Arbeitsblätter. Sagt ausdrücklich, welche Dateien die Grundlage sind.',
    bauen: 'Arbeitsordner',
    export: [
      'Die Dateien liegen direkt im Ordner. Word-Dateien öffnet ihr in Word, HTML-Seiten im Browser.',
      'Eine HTML-Seite lässt sich in den Kursordner legen oder auf einer Lernplattform hochladen.'
    ],
    hakt: 'Hängt der Agent, mit Esc abbrechen und den Auftrag in kleinere Schritte teilen. Jede Änderung zuerst ansehen, bevor ihr sie übernehmt.'
  },
  chatgpt: {
    name: 'ChatGPT', anbieter: 'OpenAI', typ: 'chat',
    konto: 'ein privates ChatGPT-Konto',
    kosten: 'Die kostenlose Stufe reicht für einfache Materialien. Das stärkste Modell ist schnell aufgebraucht.',
    kurz: 'ChatGPT baut im Canvas Dokumente und kleine Webseiten, an denen ihr gemeinsam weiterschreibt. In einem Projekt legt ihr eure Quellen ab.',
    start: 'chatgpt.com öffnen und anmelden. Canvas öffnet sich, wenn ihr ausdrücklich nach einem Dokument oder Canvas fragt. Für Quellen links ein Projekt anlegen.',
    vorbereitung: [
      'Ein Konto auf chatgpt.com anlegen und einmal anmelden.',
      'In den Einstellungen unter Datenkontrollen „Das Modell für alle verbessern“ ausschalten.'
    ],
    datenschutz: 'Bei privaten Konten werden Chats zum Training genutzt, wenn die Einstellung an ist. Vor dem Tag ausschalten.',
    quellenWerkzeug: 'ein ChatGPT-Projekt',
    quellen: 'In einem Projekt ladet ihr Dateien hoch, auf die sich alle Chats darin stützen. Fragt nach der Stelle in der Quelle und prüft sie.',
    bauen: 'Canvas',
    export: [
      'Dokumente aus dem Canvas als Word-Datei oder PDF herunterladen.',
      'ChatGPT kann auf Wunsch auch Word- und PowerPoint-Dateien erzeugen.'
    ],
    hakt: 'Ist das Limit erreicht, wechselt ChatGPT auf ein kleineres Modell. Für Feinarbeit reicht das meist.'
  },
  codex: {
    name: 'Codex', anbieter: 'OpenAI', typ: 'agent',
    konto: 'ein ChatGPT-Konto mit bezahltem Abo',
    kosten: 'Codex ist in den bezahlten ChatGPT-Abos enthalten. Ohne Abo reicht das Kontingent nicht.',
    kurz: 'Codex ist ein Agent: Er arbeitet in einem Ordner, liest vorhandene Dateien und legt selbstständig mehrere fertige Dateien an, zum Beispiel eine Lernwebsite oder einen Satz Arbeitsblätter.',
    start: 'Die Codex-App öffnen, mit dem ChatGPT-Konto anmelden, einen Arbeitsordner wählen und den Auftrag in normaler Sprache schreiben. Codex zeigt, welche Dateien es ändern will.',
    vorbereitung: [
      'Die Codex-App vor dem Tag installieren und mit dem Abo-Konto anmelden. Auf Dienstgeräten fehlen dafür oft die Rechte.',
      'Einen leeren Arbeitsordner anlegen und ein, zwei eigene Materialien hineinlegen.',
      'In den ChatGPT-Einstellungen „Das Modell für alle verbessern“ ausschalten.'
    ],
    datenschutz: 'Der Agent liest alle Dateien im gewählten Ordner. Deshalb nur einen Ordner mit eigenem Material öffnen, nie einen mit Schülerarbeiten oder Noten.',
    quellenWerkzeug: 'der Arbeitsordner',
    quellen: 'Alles, was im Arbeitsordner liegt, kann Codex lesen. Sagt ausdrücklich, welche Dateien die Grundlage sind.',
    bauen: 'Arbeitsordner',
    export: [
      'Die Dateien liegen direkt im Ordner. HTML-Seiten öffnet ihr im Browser, Textdateien in Word.',
      'Eine fertige HTML-Seite lässt sich in den Kursordner legen oder auf einer Lernplattform hochladen.'
    ],
    hakt: 'Hängt der Agent, abbrechen und den Auftrag in kleinere Schritte teilen. Jede Änderung ansehen, bevor ihr sie übernehmt.'
  }
};

/* ---------- Nachmittag: Wege zu einem Material ---------- */
LIB.wege = {
  interaktiv: {
    name: 'Ein interaktives Arbeitsblatt',
    kurz: 'Aus einem vorhandenen Text wird eine Seite mit Klapp-Lösungen, Eingabefeldern oder Quiz.',
    prompt: {
      chat: 'Kannst du diesen Inhalt als interaktive Seite mit ausklappbaren Lösungen und einem kurzen Quiz umsetzen? Zielgruppe ist Klasse [X], die Seite soll auch am Tablet gut bedienbar sein.',
      agent: 'Im Ordner liegt mein Arbeitsblatt [Dateiname]. Baue daraus eine einzelne HTML-Datei für Klasse [X]: die Aufgaben mit Eingabefeldern, ausklappbare Lösungen und am Ende ein Quiz mit fünf Fragen. Keine externen Bibliotheken, die Datei soll offline im Browser laufen.'
    }
  },
  erwartung: {
    name: 'Ein Erwartungshorizont',
    kurz: 'Eine Musterlösung oder ein Bewertungsraster entsteht im Dialog, die Kriterien diktiert ihr.',
    prompt: {
      chat: 'Wir schreiben zusammen einen Erwartungshorizont zu dieser Aufgabe. Ich diktiere die Kriterien, du ordnest sie und formulierst sie aus. Formeln bitte in LaTeX.',
      agent: 'Im Ordner liegt meine Klausur [Dateiname]. Erstelle dazu einen Erwartungshorizont als Word-Datei: pro Aufgabe die erwarteten Teilleistungen, Punkte und typische Fehler. Frag mich vorher nach der Punkteverteilung.'
    }
  },
  umbauen: {
    name: 'Material aus Quellen umbauen',
    kurz: 'Aus Skript, Schulbuchseite oder Artikel entsteht eine Struktur, ein Glossar oder ein Fragenkatalog.',
    quellenweg: true,
    prompt: {
      chat: 'Strukturiere dieses Skript in fünf logische Unterrichtsphasen und erstelle am Ende zehn Verständnisfragen mit Lösungen. Bleib bei den Quellen und gib zu jeder Frage an, woher sie stammt.',
      agent: 'Lies die Dateien im Ordner [Namen]. Erstelle daraus ein Glossar mit den 15 wichtigsten Fachbegriffen und einen Fragenkatalog mit zehn Verständnisfragen samt Lösungen, beides als Word-Datei. Nimm nur Inhalte, die in den Dateien stehen.'
    }
  },
  differenzieren: {
    name: 'Ein Material differenzieren',
    kurz: 'Ein vorhandenes Arbeitsblatt in zwei oder drei Niveaustufen oder in einfacher Sprache.',
    prompt: {
      chat: 'Hier ist mein Arbeitsblatt für Klasse [X]. Erstelle zwei weitere Fassungen: eine mit Hilfen und Satzanfängen, eine mit Zusatzaufgaben zum Weiterdenken. Die Aufgaben sollen inhaltlich gleich bleiben, damit alle über dasselbe sprechen können.',
      agent: 'Im Ordner liegt mein Arbeitsblatt [Dateiname]. Lege drei Fassungen als Word-Dateien an: Basis mit Hilfen, Standard, Erweiterung mit Transferaufgabe. Gleiche Aufgabennummern in allen drei Fassungen. Dazu ein Lösungsblatt.'
    }
  },
  paket: {
    name: 'Ein komplettes Stundenpaket',
    kurz: 'Der Agent legt aus einem Stundenentwurf mehrere Dateien an: Arbeitsblatt, Lösung, interaktive Übung.',
    nurAgent: true,
    prompt: {
      chat: 'Ich plane eine Stunde zu [Thema] in Klasse [X]. Erstelle ein Arbeitsblatt mit sechs Aufgaben steigender Schwierigkeit, ein Lösungsblatt und fünf Quizfragen für den Einstieg.',
      agent: 'Im Ordner liegt mein Stundenentwurf [Dateiname]. Lege daraus an: 1) ein Arbeitsblatt als Word-Datei mit sechs Aufgaben steigender Schwierigkeit, 2) ein Lösungsblatt, 3) eine HTML-Übungsseite mit Selbstkontrolle. Zeig mir zuerst deinen Plan, bevor du die Dateien anlegst.'
    }
  }
};

/* ---------- Rechtlicher Rahmen ---------- */
LIB.legitimation = {
  NRW: {
    zitat: 'Die Nutzung von und Auseinandersetzung mit generativen KI-Systemen ist in angemessenem Umfang in allen Jahrgangsstufen verpflichtend. Neben die kompetente Bedienung der KI tritt ein kritisch-reflektierter Umgang mit Ergebnissen generativer KI. Die Leistungsbewertung muss beides berücksichtigen.',
    quelle: 'Kernlehrplan Mathematik für die Sekundarstufe II, NRW 2026, Kapitel Leistungsbewertung. Wortgleich auch in Deutsch, Physik und Biologie.'
  },
  anderes: {
    zitat: 'Die Strategie der Kultusministerkonferenz „Bildung in der digitalen Welt“ und die Handlungsempfehlung der KMK zum Umgang mit KI in schulischen Bildungsprozessen (2024) sehen vor, dass Lernende KI-Systeme kompetent und kritisch nutzen lernen.',
    quelle: 'Sinngemäß nach KMK, Handlungsempfehlung für die Bildungsverwaltung zum Umgang mit Künstlicher Intelligenz in schulischen Bildungsprozessen, Oktober 2024. Vor dem Einsatz durch den Wortlaut des eigenen Landes ersetzen.'
  }
};
