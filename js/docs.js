/* Baut aus den Rahmenbedingungen die Dokumente als neutrales Blockmodell.
   Dasselbe Modell wird zu Word, zur Vorschau und zur Teilnehmer-Website. */

const DOCS = (() => {
  const b = {
    h2: t => ({ t: 'h2', x: t }),
    h3: t => ({ t: 'h3', x: t }),
    p: t => ({ t: 'p', x: t }),
    ul: l => ({ t: 'ul', l: l.filter(Boolean) }),
    ol: l => ({ t: 'ol', l: l.filter(Boolean) }),
    table: (kopf, zeilen, breiten) => ({ t: 'table', kopf, zeilen, breiten }),
    box: (titel, x, art = 'hinweis') => ({ t: 'box', titel, x, art }),
    code: (x, titel) => ({ t: 'code', x, titel }),
    kv: pairs => ({ t: 'kv', l: pairs }),
    linie: t => ({ t: 'linie', x: t })
  };

  const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const datumLang = d => { if (!d) return '[Datum]'; const [y, m, t] = d.split('-').map(Number); return `${t}. ${MONATE[m - 1]} ${y}`; };
  const datumMinus = (d, tage) => { if (!d) return ''; const x = new Date(d + 'T12:00'); x.setDate(x.getDate() - tage); return `${x.getDate()}.${x.getMonth() + 1}.`; };
  const liste = arr => arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' und ' + arr[arr.length - 1];

  /* Rahmen anreichern: Objekte statt Schlüssel, Namen, Zeitplan, Logistik */
  function kontext(C0) {
    const C = { ...C0 };
    C.P = { ...LIB.plattformen[C.plattform] };
    if (C.plattform === 'andere') C.P.name = C.plattformFrei || 'eure Schul-KI-Plattform';
    C.plattformName = C.P.name;
    C.F = C.formen.map(k => ({ k, ...LIB.formen[k] }));
    C.W = C.werkzeuge.map(k => ({ k, ...LIB.werkzeuge[k] }));
    C.agent = C.W.some(w => w.typ === 'agent');
    C.chat = C.W.some(w => w.typ === 'chat');
    C.WG = C.wege.filter(k => C.agent || !LIB.wege[k].nurAgent).map(k => ({ k, ...LIB.wege[k] }));
    C.werkzeugNamen = liste(nmWerkzeugLabel(C.W));
    C.datumLang = datumLang(C.datum);
    C.ort = [C.schule || '[Schule]'].join('');
    C.kopf = `${C.datumLang} · ${C.schule || '[Schule]'}`;
    C.Z = PLAN.zeitplan(C);
    C.L = PLAN.logistik(C);
    C.LEG = LIB.legitimation[C.bundesland] || LIB.legitimation.anderes;
    C.board = C.board || '';
    C.boardText = C.board ? `ins gemeinsame Board (${C.board})` : 'ins gemeinsame Board (den Link gibt es zu Beginn im Plenum)';
    C.einzelForm = C.F.length === 1;
    return C;
  }

  /* Gemini wird mit Gemini Notebook genannt, weil beide zusammen den Nachmittag tragen */
  function nmWerkzeugLabel(W) {
    if (W.length === 1 && W[0].k === 'gemini') return ['Gemini', 'Gemini Notebook'];
    return W.map(w => w.name);
  }

  const buchstabe = i => String.fromCharCode(65 + i);

  /* ---------- 1 Ablaufplan ---------- */
  function ablaufplan(C) {
    const zeile = r => [r.von + '–' + r.bis, r.phase, r.inhalt, r.wo || '–'];
    const B = [
      b.p(`${C.kopf} · ${C.team || 'Moderation'} (Räume und Zeiten sind Vorschläge)`),
      b.h2('Vormittag: mit KI im Unterricht'),
      b.table(['Zeit', 'Phase', 'Inhalt', 'Wo'], C.Z.vm.map(zeile), [18, 17, 45, 20])
    ];
    if (C.Z.mittag) B.push(b.p(`${C.Z.mittag.von}–${C.Z.mittag.bis} Mittagspause`));
    B.push(b.h2('Nachmittag: KI für die eigene Arbeit'), b.table(['Zeit', 'Phase', 'Inhalt', 'Wo'], C.Z.nm.map(zeile), [18, 17, 45, 20]));
    B.push(b.h2('Damit der Tag rundläuft'), b.ul([
      `Für den Vormittag die Zugangsdaten zu ${C.P.name} bereithalten und vorher einmal testen, ob die Anmeldung klappt.`,
      ...C.W.map(w => `Für den Nachmittag braucht ihr ${w.konto} für ${w.name}. ${w.vorbereitung[0]}`),
      'Bringt eine eigene Unterrichtseinheit oder -reihe mit, am besten digital. Wer am Laptop arbeitet, sollte ihn mitbringen; auf dem iPad ist manches eingeschränkt.',
      `Die Moderation rotiert durch die ${C.L.raeume > 1 ? C.L.raeume + ' Arbeitsräume' : 'Gruppen'}. Bei technischen Fragen einfach fragen, gern auch die KI selbst.`
    ]));
    return { id: 'ablaufplan', nr: 1, datei: '01_Ablaufplan', titel: 'Ablaufplan', unter: 'KI-Tag · Tagesübersicht', phase: 'orga', bloecke: B };
  }

  /* ---------- 2 Orga-Checkliste ---------- */
  function orga(C) {
    const L = C.L;
    const d = C.datum;
    const B = [
      b.p(`Für das Moderationsteam. Der Plan rechnet mit ${L.tn} Teilnehmenden, ${C.Z.vm[0].von} bis ${C.Z.ende} Uhr.`),
      b.h2('Die Zahlen'),
      b.kv([
        ['Teilnehmende', String(L.tn)],
        ['Kleingruppen', `etwa ${L.gruppen} (zu dritt, 2 bis 4 sind in Ordnung)`],
        ['Arbeitsräume', `${L.raeume} mit WLAN und Beamer, je etwa ${L.proRaum} Personen`],
        ['Moderation', `${L.modsNoetig} Personen nötig, ${C.mods || 0} eingetragen`],
        ['WLAN', `mit gut ${L.wlan} gleichzeitigen Geräten rechnen (Laptop plus Handy)`],
        ['Plenum', `ein Raum für alle ${L.tn} mit Beamer, Mikrofon ab etwa 40 Personen`],
        ['Reflexion', L.reflexion]
      ])
    ];
    L.warn.forEach(w => B.push(b.box('Achtung', w.text, 'warn')));
    C.Z.warn.forEach(w => B.push(b.box(w.art === 'info' ? 'Hinweis' : 'Achtung', w.text, w.art === 'info' ? 'hinweis' : 'warn')));

    B.push(b.h2('Vorbereitung nach Zeitplan'));
    const t = (tage, text) => [tage ? `bis ${datumMinus(d, tage)} (${tage === 1 ? 'Vortag' : 'T–' + tage})` : 'am Tag', text];
    const zeilen = [
      t(42, `Termin, Räume und Moderation festmachen. Mit der Schulleitung klären: ${C.P.name} für Lehrkräfte ${C.plattform === 'ais' ? 'registriert und alle Lehrkräfte angelegt' : 'lizenziert'}.`),
      ...(C.plattform === 'ais' && C.bundesland === 'NRW' ? [t(35, 'Den KI-Selbstlernkurs im Lernmanagementsystem NRW ankündigen. Ohne ihn keine Nutzung von AIS.chat.')] : []),
      t(28, 'Einladung ans Kollegium verschicken (Vorlage im Paket), mit der Bitte, Konten vorher anzulegen.'),
      t(21, 'IT und Hausmeister: WLAN-Last, Räume, Beamer, Verlängerungskabel. Prüfen, ob die Webseiten der Werkzeuge im Schulnetz erreichbar sind.'),
      t(14, 'Sammel-Board anlegen (Edumaps, Padlet oder geteiltes Dokument) und den Link in Website und Aufträge eintragen.'),
      t(7, `Alles einmal selbst durchspielen: einen Bot in ${C.P.name} bauen und freigeben, in ${C.W.map(w => w.name).join(' und ')} je ein Material bauen. Oberflächen ändern sich schnell.`),
      t(7, 'Teilnehmer-Website veröffentlichen oder als Ordner im Kollegium teilen.'),
      t(1, 'Vorträge am Beamer testen. Zugangsdaten und Board-Link griffbereit. Raumplan mit Gruppenaufteilung ausdrucken oder projizieren.'),
      t(0, 'Moderation 30 Minuten vorher da. Technik in jedem Raum prüfen. Nach jeder Arbeitsphase kurz im Team abstimmen.')
    ];
    B.push(b.table(['Wann', 'Was'], zeilen, [25, 75]));

    B.push(b.h2('Rollen im Team'), b.ul([
      'Moderation Plenum: Begrüßung, Vorträge, Reflexionen, Zeitansagen.',
      `Raumbetreuung: je eine Person pro Arbeitsraum (${L.raeume}). Rotiert zwischen den Gruppen, fragt früh nach, nicht erst nach 40 Minuten.`,
      L.tn > 40 ? 'Technik und Springer: Zugänge, WLAN, Beamer, hilft dort, wo es hakt.' : '',
      'Ergebnisse: hat das Board im Blick und wählt für die Reflexion Beispiele aus.'
    ]));

    B.push(b.h2(`Vormittag: ${C.P.name}`), b.ul(C.P.voraussetzung), b.ul(C.P.hinweise));
    B.push(b.h2('Nachmittag: Werkzeuge'));
    C.W.forEach(w => { B.push(b.h3(`${w.name} (${w.anbieter})`), b.p(w.kosten), b.ul(w.vorbereitung)); });
    if (C.agent) B.push(b.box('Agenten brauchen Vorlauf', `${C.W.filter(w => w.typ === 'agent').map(w => w.name).join(' und ')} ${C.W.filter(w => w.typ === 'agent').length > 1 ? 'laufen' : 'läuft'} nur mit bezahltem Abo und eigener Installation. Plant dafür eine eigene Gruppe mit Lehrkräften, die das Abo schon haben. Alle anderen arbeiten im Chat.`, 'warn'));
    if (C.agent && C.niveau === 'einstieg') B.push(b.box('Passt das zum Kollegium?', 'Das Kollegium ist als Einsteiger eingetragen. Agenten sind für Einsteiger meist zu viel auf einmal. Empfehlung: im Nachmittagsvortrag zeigen, am Tag selbst im Chat arbeiten.', 'warn'));

    B.push(b.h2('Datenschutz in einem Satz'), b.p(`Vormittags arbeitet ${C.P.name} mit Lernenden, deshalb nur Text und keine personenbezogenen Daten. Nachmittags arbeiten die Lehrkräfte mit eigenem Material auf eigenen Konten: keine Schülerarbeiten mit Namen, keine Noten, keine Fotos von Lernenden.`));
    return { id: 'orga', nr: 2, datei: '02_Orga-Checkliste', titel: 'Orga-Checkliste', unter: 'Für das Moderationsteam', phase: 'orga', bloecke: B };
  }

  /* ---------- 3 Einladung ---------- */
  function einladung(C) {
    const vorab = [
      ...C.P.voraussetzung.filter(v => /Lehrkraft|Lehrkräfte|Selbstlernkurs/.test(v)).map(v => v),
      ...[...new Set(C.W.flatMap(w => w.vorbereitung))]
    ];
    const B = [
      b.p('Liebe Kolleginnen und Kollegen,'),
      b.p(`am ${C.datumLang} findet ${C.schule ? 'an der ' + C.schule + ' ' : ''}unser pädagogischer Tag zum Thema künstliche Intelligenz statt. Wir beginnen um ${C.Z.vm[0].von} Uhr und enden gegen ${C.Z.ende} Uhr.`),
      b.p(`Der Tag hat zwei Hälften. Vormittags bauen wir in kleinen Gruppen ein KI-Lernszenario für die eigene Klasse, datenschutzkonform mit ${C.P.name}. Nachmittags nutzen wir ${C.werkzeugNamen}, um Material für den eigenen Unterricht zu erstellen.`),
      b.h3('Bitte vorher erledigen'),
      b.ul(vorab),
      b.h3('Bitte mitbringen'),
      b.ul(['einen Laptop oder ein Tablet mit Ladekabel (Laptop ist besser)', 'eine eigene Unterrichtseinheit oder -reihe, am besten digital', 'Kopfhörer, wenn ihr diktieren wollt']),
      b.p('Es sind keine Vorkenntnisse nötig. Wer noch nie mit KI gearbeitet hat, ist genau richtig.'),
      b.p('Viele Grüße'),
      b.p(C.team || '[Name / Moderationsteam]')
    ];
    return { id: 'einladung', nr: 3, datei: '03_Einladung_Kollegium', titel: 'Einladung ans Kollegium', unter: `Pädagogischer Tag KI am ${C.datumLang}`, phase: 'orga', bloecke: B };
  }

  /* ---------- 4 Arbeitsauftrag Vormittag ---------- */
  function auftragVm(C) {
    const A = C.Z.dauer('a1') || 90;
    const [t1, t2, t3, t4, t5, t6] = PLAN.verteile(A, [15, 20, 5, 15, 20, 15]);
    const F = C.F;
    const P = C.P;
    const titel = C.einzelForm ? `${F[0].name} im Fachunterricht` : 'Ein KI-Lernszenario für den Fachunterricht';
    const B = [
      b.p(`Ein Lernszenario für ${P.name} bauen: textbasiert, datenschutzkonform, und so, dass die Lernenden denken müssen.`),
      b.h2('Die Idee'),
      C.einzelForm ? b.p(F[0].idee) : b.p('Ihr baut ein Unterrichtselement, in dem die KI eure Klasse zum Denken bringt. Sucht euch dafür eine dieser Arbeitsformen aus:'),
      ...(C.einzelForm ? [] : [b.table(['Arbeitsform', 'Worum es geht'], F.map(f => [f.name, f.kurz]), [30, 70])]),
      b.box('Das solltet ihr zuerst wissen', `Heute arbeitet der Bot nur mit Text. ${P.textRegel} Was die Lernenden abgeben, ist getippt oder diktiert.`, 'warn'),
      b.h2('Was am Ende stehen soll'),
      b.ul([`ein Fach-Bot (${P.botWort}), der nachfragt und die Lösung für sich behält,`, `ein ${P.raumWort}, in dem der Bot für die Klasse freigegeben ist,`, 'ein Schüler-Arbeitsauftrag, der das Szenario in Gang setzt,', 'ein kurzer Eintrag im gemeinsamen Board.']),
      b.h2('So geht ihr vor'),
      b.h3(`Schritt 1 · Thema finden (≈ ${t1} Min)`),
      b.p('Sucht euch aus eurem Fach eine Stunde, in der die Lernenden etwas Sprachliches produzieren: eine Begründung, eine Deutung, einen in Worten erklärten Rechenweg, ein Gespräch. Fällt euch spontan nichts ein, ist das normal. Im Themen-Rezept stehen ausgearbeitete Beispiele und ein Notfall-Thema.'),
      b.h3(`Schritt 2 · Bot bauen und freigeben (≈ ${t2} Min)`),
      b.ol(P.stationen.map(s => `${s.t}: ${s.d}`)),
      b.p('Der wichtigste Teil des System-Prompts sind die Guardrails. Ohne sie rückt der Bot die Lösung heraus, sobald jemand freundlich genug fragt.'),
      b.h3(`Schritt 3 · Eingabeweg klären (≈ ${t3} Min)`),
      b.p('Die Lernenden geben ihr Produkt auf genau zwei Wegen an die KI:'),
      b.ul(['Tippen, für alles, was am Gerät entsteht.', 'Diktieren über die Mikrofon-Taste (am Windows-Rechner: Windows-Taste + H).']),
      b.p('Kein Foto, kein Scan. Baut euer Szenario so, dass niemand zum Handy greifen muss.'),
      b.h3(`Schritt 4 · Den Ablauf für die Klasse bauen (≈ ${t4} Min)`),
      b.p('Formuliert den Auftrag so, dass die Lernenden in Runden arbeiten und nicht in einem Rutsch.' + (C.einzelForm ? ' Zum Beispiel so:' : ' Für die gewählte Arbeitsform etwa so:'))
    ];
    if (C.einzelForm) B.push(b.ol(F[0].ablauf));
    else F.forEach(f => { B.push(b.p(`**${f.name}:** ` + f.ablauf.join(' '))); });
    B.push(
      b.h3(`Schritt 5 · Gegenseitig testen (≈ ${t5} Min)`),
      b.p('Wenn euer Szenario steht, tauscht ihr mit einer anderen Gruppe, am besten aus einem fremden Fach. Die merkt sofort, wenn eure Anweisung nur für Eingeweihte verständlich ist.'),
      b.ul([P.testen, 'In die Schülerrolle schlüpfen und absichtlich schwache oder halbfertige Antworten eingeben.', 'Beobachten: Verrät der Bot die Lösung? Bleibt er beim Fach? Versteht auch ein Fachfremder das Feedback?']),
      b.h3(`Schritt 6 · Ergebnisse sichern (≈ ${t6} Min)`),
      b.p(`Tragt eure Ergebnisse ${C.boardText} ein. Vier Dinge reichen: Fach, Jahrgang und Thema; die Arbeitsform; der Wortlaut eures System-Prompts; eure ehrliche Einschätzung, ob das in einer echten Stunde funktioniert.`),
      b.linie(`${A} Minuten im Überblick: Thema ${t1}′ · Bot ${t2}′ · Eingabeweg ${t3}′ · Ablauf ${t4}′ · Test ${t5}′ · Sichern ${t6}′`)
    );
    return { id: 'auftrag-vm', nr: 4, datei: '04_Arbeitsauftrag_Vormittag', titel, unter: 'Arbeitsphase I · Vormittag', phase: 'vm', bloecke: B, web: 'vormittag-auftrag' };
  }

  /* ---------- 5 Themen-Rezept ---------- */
  function themen(C) {
    const B = [
      b.p('Ein kurzes Rezept und ausgearbeitete Beispiele, alle ohne Foto, alle rein über Text.'),
      b.h2('Die eigentliche Hürde'),
      b.p('Am Vormittag scheitert es selten an der Technik. Schwieriger ist die Frage, welches Thema überhaupt passt. Die Lernenden geben dem Bot nur Text. Alles, dessen Kern eine Zeichnung oder ein Foto ist, fällt damit weg. Es bleibt trotzdem mehr übrig, als man im ersten Moment denkt.'),
      b.h2('Fünf Fragen an euer Thema'),
      b.p('Könnt ihr alle fünf mit Ja beantworten, könnt ihr loslegen:'),
      b.ol(['Entsteht das Schülerprodukt als Text, ohne dass eine Skizze oder ein Foto nötig ist?', 'Gibt es klare Kriterien oder Operatoren, an denen der Bot sein Feedback festmachen kann?', 'Lässt sich das Produkt verbessern? Gibt es also besser und schlechter, nicht bloß richtig und falsch?', 'Muss man dafür wirklich denken, oder reicht Abrufen?', 'Kommt das Ganze ohne persönliche Daten aus?']),
      b.box('Faustregel', 'Was ein Mensch als Fließtext begründen oder erklären kann, kann der Bot bespielen. Was zwingend eine Zeichnung braucht, lässt sich meistens sprachlich umformen, so wie in den MINT-Beispielen unten.')
    ];
    C.F.forEach(f => {
      B.push(b.h2(C.einzelForm ? 'Beispiele zum Mitnehmen' : `Beispiele: ${f.name}`));
      if (!C.einzelForm) B.push(b.p(f.kurz));
      f.beispiele.forEach((e, i) => {
        B.push(b.h3(`Beispiel ${i + 1} · ${e.fach}`), b.kv([['Jahrgang', e.jg], ['Thema', e.thema], ['Schüler-Auftrag', e.auftrag], ['Was der Bot tut', e.bot], ['Kern des System-Prompts', e.kern]]));
      });
    });
    B.push(b.h2('Wenn gar nichts kommt: das Notfall-Thema'), b.p('Funktioniert in fast jedem Fach:'), b.code('Erklär den Begriff X in eigenen Worten so, dass eine Mitschülerin ihn versteht.'), b.p('Der Bot prüft die fachliche Genauigkeit, deckt Lücken auf und fragt nach. Die Lehrbuchdefinition rückt er nicht heraus. Das klingt banal, funktioniert aber verlässlich, weil es ohne Vorlauf auskommt.'));
    return { id: 'themen', nr: 5, datei: '05_Themen-Rezept_und_Beispiele', titel: 'Ein Thema finden', unter: 'Hilfestellung · Vormittag', phase: 'vm', bloecke: B, web: 'vormittag-themen' };
  }

  /* ---------- 6 System-Prompt-Baukasten ---------- */
  function baukasten(C) {
    const rollen = [...new Set(C.F.map(f => f.rolle))].join(' / ');
    const B = [
      b.p('Vier Blöcke, eine Handvoll fertiger Bausteine, und der Bot behält die Lösung für sich.'),
      b.h2('Warum diese eine Anweisung alles entscheidet'),
      b.p(`Der System-Prompt ist die Anweisung, an die sich euer Bot immer hält. In ${C.P.name} tragt ihr ihn beim Anlegen des Bots ein. An ihm hängt, ob die KI ein Werkzeug zum Denken wird oder eine Lösungsmaschine.`),
      b.h2('Der Bauplan: vier Blöcke'),
      b.p('Jeder brauchbare System-Prompt hat dieselben vier Teile. Füllt die Platzhalter in eckigen Klammern aus:'),
      b.h3('1 · Rolle. Wer ist der Bot, für wen?'),
      b.code(`Du bist [${rollen}] für [Fach] in Klasse [X]. Du sprichst die Lernenden freundlich und ermutigend an.`),
      b.h3('2 · Kriterien. Woran misst er das Produkt?'),
      b.code('Bewerte die Einreichung nur an diesen Kriterien: [Kriterium 1], [Kriterium 2], [Kriterium 3]. Erfinde keine weiteren.'),
      b.h3('3 · Verhalten. Wie läuft das Gespräch?'),
      b.code('Gib kurzes, konkretes Feedback als Impuls oder Rückfrage. Nimm dir pro Antwort ein bis zwei Kriterien vor. Lob, wenn etwas gelungen ist, und sag, was als Nächstes dran ist.'),
      b.h3('4 · Verbote. Was der Bot nie tut.'),
      b.p('Hier liegt der eigentliche Schutz. Die passenden Sätze stehen unten.'),
      b.h2('Guardrails zum Kopieren'),
      b.p('Sucht euch die passenden Sätze aus und hängt sie an Block 4:'),
      ...LIB.guardrails.map(g => b.code(g))
    ];
    B.push(b.h2(C.einzelForm ? 'Ein fertiges Beispiel' : 'Fertige Beispiele je Arbeitsform'));
    C.F.forEach(f => { B.push(b.h3(f.name), b.code(f.beispielPrompt)); });
    B.push(b.h2('Der schnelle Test'), b.p('Bevor ihr den Bot auf die Klasse loslasst, spielt ihm vier Bälle zu:'), b.ol(LIB.testBaelle), b.p('Sitzen alle vier, ist der Bot bereit für die Lerngruppe.'));
    return { id: 'baukasten', nr: 6, datei: '06_System-Prompt-Baukasten', titel: 'Der System-Prompt-Baukasten', unter: 'Werkzeug · Vormittag', phase: 'vm', bloecke: B, web: 'vormittag-baukasten' };
  }

  /* ---------- 7 Plattform-Klickweg ---------- */
  function klickweg(C) {
    const P = C.P;
    const B = [
      b.p(`Der Weg vom leeren Konto zum Bot, den eure Klasse benutzt. Die Lernenden kommen so hinein: ${P.schuelerZugang}.`),
      b.h2('Vorher erledigt?'), b.ul(P.voraussetzung),
      b.h2('Die Stationen')
    ];
    P.stationen.forEach((s, i) => B.push(b.h3(`${i + 1} · ${s.t}`), b.p(s.d)));
    B.push(b.h2('Gut zu wissen'), b.ul(P.hinweise), b.box('Datenschutz', P.datenschutz));
    return { id: 'klickweg', nr: 7, datei: '07_Klickweg_' + P.name.replace(/[^A-Za-z0-9]+/g, ''), titel: `${P.name} mit Lerngruppen nutzen`, unter: 'Einführung · Vormittag', phase: 'vm', bloecke: B, web: 'vormittag-plattform' };
  }

  /* ---------- 8 Arbeitsauftrag Nachmittag ---------- */
  function wegAnleitung(wk, w) {
    const agent = w.typ === 'agent';
    if (agent) return {
      interaktiv: `${w.name} legt im Arbeitsordner eine HTML-Datei an, die ihr im Browser öffnet und an die Klasse weitergebt.`,
      erwartung: `${w.name} liest eure Aufgabe aus dem Ordner und legt den Erwartungshorizont als Datei an. Lasst euch vorher den Plan zeigen.`,
      umbauen: `${w.name} liest die Quellen im Arbeitsordner und legt Glossar und Fragen als Dateien an.`,
      differenzieren: `${w.name} legt aus einem Arbeitsblatt im Ordner mehrere Fassungen als eigene Dateien an.`,
      paket: `${w.name} legt aus einem Stundenentwurf mehrere Dateien auf einmal an. Das ist die Stärke eines Agenten.`
    }[wk];
    const bauen = w.k === 'claude' ? 'als Artefakt neben dem Chat' : 'im Canvas';
    return {
      interaktiv: w.k === 'gemini' ? 'Gemini im Canvas-Modus baut aus eurem Text eine kleine interaktive Website. Canvas schaltet ihr über das Plus unter dem Eingabefeld ein.' : `${w.name} baut die Seite ${bauen}. Ihr seht sofort eine Vorschau und könnt Änderungen in normaler Sprache verlangen.`,
      erwartung: `Direkt ${bauen} an einem Dokument arbeiten. Diktiert eure Gedanken per Spracheingabe, die KI formt sie aus. Für Formeln LaTeX verlangen.`,
      umbauen: w.k === 'gemini' ? 'Ladet eure Quellen in Gemini Notebook. Es antwortet aus diesen Quellen und zeigt, woher jede Aussage stammt. Rechts im Bereich „Studio“ entstehen mit einem Klick Karteikarten, Quiz oder eine Audio-Zusammenfassung.' : `Legt ${w.quellenWerkzeug} an und ladet eure Quellen hinein. Verlangt, dass nur Inhalte aus den Quellen verwendet werden.`,
      differenzieren: `Das Arbeitsblatt hochladen oder hineinkopieren und die Fassungen ${bauen} anlegen lassen.`,
      paket: `Im Chat geht das in mehreren Schritten: erst das Arbeitsblatt, dann die Lösung, dann die Übung.`
    }[wk];
  }

  function auftragNm(C) {
    const A = C.Z.dauer('a2') || 90;
    const [t1, t2, t3, t4] = PLAN.verteile(A, [10, 60, 15, 5]);
    const B = [
      b.p(`Mit ${C.werkzeugNamen} ein Material bauen, das ihr nächste Woche im Unterricht einsetzt.`),
      b.h2('Die Idee'),
      b.p(`Jetzt dreht sich der Spieß um. Am Vormittag hat die Klasse mit KI gearbeitet, jetzt arbeitet die KI für euch. Weil ihr mit eurem eigenen Material auf eigenen Konten arbeitet, fallen die Beschränkungen vom Vormittag weg. Fotos, PDFs, Diktate, alles geht.`),
      b.box('Was draußen bleibt', 'Keine Arbeiten von Lernenden mit Namen, keine Noten, keine Fotos, auf denen Schülerinnen und Schüler zu sehen sind. Ganze Schulbücher gehören auch nicht hinein, einzelne Seiten für die eigene Vorbereitung schon. ' + C.W.map(w => w.datenschutz).join(' '), 'warn'),
      b.h2(`Euer Ziel für die ${A} Minuten`),
      b.p('Am Ende hat jede Gruppe ein Ergebnis, das sie zeigen kann. Die Versuchung ist groß, überall hineinzuschnuppern. Sucht euch einen Weg aus und bringt die Sache zu Ende.'),
      b.h2('Drei Schritte zu einem guten Prompt'),
      b.p('Ein Prompt ist die Anweisung, die ihr der KI gebt. Die drei Schritte gelten für jedes Werkzeug.'),
      b.h3('Schritt 1 · Der Grund und das Ziel'),
      b.p('Sagt, für wen das Material ist, wozu es dient und wo eure Lerngruppe gerade steht. Ein Satz reicht. Fehlt er, schreibt die KI für irgendjemanden.'),
      b.h3('Schritt 2 · Zeigen statt beschreiben'),
      b.p('Hängt an, was ihr schon habt: das alte Arbeitsblatt als Foto, eure Notizen, die Schulbuchseite als PDF, einen Link. Ein Beispiel ist mehr wert als drei Absätze Erklärung.'),
      b.h3('Schritt 3 · Was fertig heißt'),
      b.p('Sagt, woran ihr merkt, dass es passt: eine Seite, sechs Aufgaben, Lösungen am Ende. Und sagt dazu, was nicht hineingehört.'),
      b.p('So sehen die drei Schritte zusammen aus:'),
      b.code('Ich brauche ein Arbeitsblatt für eine 8. Klasse Physik, dritte Stunde zum Hebelgesetz, als Übung vor der Klassenarbeit. Das angehängte Blatt vom letzten Jahr zeigt, wie ich so etwas aufbaue. Fertig ist es, wenn es auf eine Seite passt, sechs Aufgaben mit steigender Schwierigkeit enthält und die Lösungen am Ende stehen. Versuchsbeschreibungen brauche ich nicht, die machen wir vorher im Unterricht.'),
      b.h2(C.WG.length > 1 ? 'Sucht euch einen Weg' : 'Euer Weg'),
      b.p('Alle Wege starten mit Material, das ihr schon habt. Nehmt eine Stunde oder Reihe aus eurem Fach als Rohstoff.')
    ];
    C.WG.forEach((wg, i) => {
      B.push(b.h3(`${C.WG.length > 1 ? 'Weg ' + buchstabe(i) + ' · ' : ''}${wg.name}`), b.p(wg.kurz));
      const passend = C.W.filter(w => !(wg.nurAgent && w.typ !== 'agent'));
      if (passend.length > 1) B.push(b.ul(passend.map(w => `**${w.name}:** ${wegAnleitung(wg.k, w)}`)));
      else if (passend.length) B.push(b.p(wegAnleitung(wg.k, passend[0])));
      if (C.chat && !wg.nurAgent) B.push(b.code(wg.prompt.chat, C.agent ? 'Im Chat' : undefined));
      if (C.agent) B.push(b.code(wg.prompt.agent, C.chat ? 'Mit dem Agenten' : undefined));
    });
    B.push(b.h2('So kommt das Ergebnis in den Unterricht'), b.p('Plant die letzten Minuten dafür ein, sonst bleibt das Material im Browser liegen.'));
    C.W.forEach(w => { B.push(b.p(`**${w.name}**`), b.ul(w.export)); });
    B.push(b.h2('Wenn es hakt'), b.ul([...C.W.map(w => `${w.name}: ${w.hakt}`), 'Antwortet die KI auf Englisch, schreibt „Antworte auf Deutsch“.']));
    B.push(b.h2('Kurz festhalten'), b.p(`Tragt euer Ergebnis ${C.boardText} ein: Fach, welcher Weg, welches Werkzeug, und ein Satz dazu, wofür ihr es einsetzen würdet. Zwei Minuten, und die anderen können es nachbauen.`));
    B.push(b.linie(`${A} Minuten im Überblick: Material wählen ${t1}′ · bauen und verfeinern ${t2}′ · ausprobieren und prüfen ${t3}′ · festhalten ${t4}′`));
    B.push(b.p('Es muss nichts perfekt werden. Es soll nur etwas entstehen.'));
    return { id: 'auftrag-nm', nr: 8, datei: '08_Arbeitsauftrag_Nachmittag', titel: 'Material bauen, das die KI für euch macht', unter: 'Arbeitsphase II · Nachmittag', phase: 'nm', bloecke: B, web: 'nachmittag-auftrag' };
  }

  /* ---------- 9 Werkzeugkasten ---------- */
  function werkzeugkasten(C) {
    const B = [b.p('Die Werkzeuge des Nachmittags zum Nachschlagen, und wie ihr Texte ohne Abtippen in die KI bekommt.')];
    if (C.chat && C.agent) B.push(b.h2('Chat oder Agent?'), b.table(['', 'Chat', 'Agent'], [
      ['Wie es arbeitet', 'Ihr schreibt, die KI antwortet. Ein Ergebnis pro Schritt.', 'Ihr gebt einen Auftrag, der Agent erledigt mehrere Schritte selbstständig.'],
      ['Wo das Ergebnis liegt', 'Im Browser, als Dokument, Seite oder Link', 'Als Dateien in einem Ordner auf eurem Rechner'],
      ['Was ihr braucht', 'Ein kostenloses Konto reicht für den Anfang', 'Bezahltes Abo und Installation'],
      ['Gut für', 'ein Arbeitsblatt, eine Seite, einen Erwartungshorizont', 'ganze Materialpakete, viele Dateien auf einmal umbauen']
    ], [22, 39, 39]));
    C.W.forEach(w => {
      B.push(b.h2(`${w.name} (${w.anbieter})`), b.p(w.kurz), b.kv([['Konto', w.konto], ['Kosten', w.kosten], ['So startet ihr', w.start]]));
      if (w.k === 'gemini') {
        B.push(b.h3('Canvas: vier Formate'), b.p('Vier Formate deckt ihr damit ab, alle gleichrangig. Der Zweck entscheidet, wechseln geht jederzeit mit einem Satz.'),
          b.kv([['Arbeitsblatt (Markdown)', 'Sachtexte mit Aufträgen, Tabellen, Checklisten. Lässt sich als Google-Dokument öffnen und als Word-Datei speichern.'], ['Mini-Webseite (HTML)', 'Infoseiten mit etwas Design: Text um Bilder, eingebettete Videos per Link, Klapp-Boxen.'], ['Interaktive Lern-App (React)', 'Simulationen, Quiz mit Feedback, interaktive Graphen, kleine Mathe-Labore.'], ['Wissenschaftlicher Satz (LaTeX)', 'MINT-Klausuren, Formelsammlungen, chemische Gleichungen, exakte Koordinatensysteme.']]));
      }
      B.push(b.h3(`Eure Quellen: ${w.quellenWerkzeug}`), b.p(w.quellen));
      B.push(b.box('Datenschutz', w.datenschutz));
    });
    B.push(b.box('Ergebnisse prüfen', 'Infografiken, Folien und Diagramme sehen schnell fertig aus. Achsen, Beschriftungen und Fachbegriffe sind aber oft falsch. Die fachliche Verantwortung bleibt bei euch.', 'warn'));
    B.push(b.h2('Text ohne Abtippen in die KI'), b.p('Nur für den Nachmittag gedacht, weil auf euren Privat-Konten Fotos von eigenem Material erlaubt sind.'),
      b.h3('Foto und Texterkennung'), b.ul(['Auf dem iPhone oder iPad die Kamera auf den Text halten, den gelben Rahmen abwarten, Text markieren und kopieren.', 'Auf Android Google Lens öffnen, den Modus „Text“ wählen, den Bereich markieren und kopieren.', 'Oder direkt in der App des Werkzeugs auf dem Handy ein Foto hinzufügen und „Extrahiere den Text“ sagen. Ist derselbe Account am Rechner offen, arbeitet ihr dort im selben Chat weiter.']),
      b.h3('Diktieren am Rechner'), b.p('Ins Textfeld klicken, dann Windows-Taste + H (Windows) oder die Diktierfunktion am Mac starten und einfach sprechen.'));
    return { id: 'werkzeugkasten', nr: 9, datei: '09_Werkzeugkasten_Nachmittag', titel: 'Werkzeugkasten Nachmittag', unter: 'Nachschlagen · Nachmittag', phase: 'nm', bloecke: B, web: 'nachmittag-werkzeugkasten' };
  }

  /* ---------- 10 Sammel- und Reflexions-Template ---------- */
  function sammeln(C) {
    const B = [
      b.p('Ein toolneutrales Raster für Edumaps, Padlet oder jedes andere Board.'),
      b.h2('So nutzt ihr das Raster'),
      b.p(`Legt vor dem Tag ein Board an${C.board ? ' (eingetragen: ' + C.board + ')' : ''}. Für jede Gruppe eine Karte mit den Feldern unten. Ausgefüllt wird von den Gruppen selbst. Bei etwa ${C.L.gruppen} Gruppen lohnt es sich, die Karten nach Fächern oder Räumen zu sortieren.`),
      b.h2('Vormittag: was jede Gruppe einträgt'),
      b.table(['Feld', 'Beispiel'], [['Fach, Jahrgang, Thema', 'Deutsch, Klasse 9, Argumentation überarbeiten'], ['Arbeitsform', C.F.map(f => f.name).join(' / ')], ['Wortlaut des System-Prompts', 'der komplette Text, den der Bot befolgt'], ['Eingabeweg der Lernenden', 'getippt oder diktiert'], ['Realistisch umsetzbar?', 'kurze, ehrliche Einschätzung mit einem Satz Begründung']], [35, 65]),
      b.h2('Nachmittag: was jede Gruppe einträgt'),
      b.table(['Feld', 'Beispiel'], [['Fach', 'z. B. Physik'], ['Weg und Werkzeug', `${C.WG.length > 1 ? 'Weg ' + C.WG.map((w, i) => buchstabe(i)).join('/') : C.WG.map(w => w.name).join('')}, mit ${C.W.map(w => w.name).join(' oder ')}`], ['Das Ergebnis', 'kurzer Link oder Screenshot, oder eine Zeile Beschreibung'], ['Wofür einsetzbar?', 'in welcher Stunde, für welchen Zweck']], [35, 65]),
      b.h2('Reflexion: Leitfragen fürs Plenum'),
      b.p(C.L.reflexion + ' Arbeitet die Fragen nicht alle ab, zwei bis drei pro Runde reichen.'),
      b.h3('Nach dem Vormittag'),
      b.ul(['Wo hat der Bot wirklich zum Denken gezwungen, und wo hat er doch die Lösung verschenkt?', 'Was war schwerer: ein Thema finden oder den System-Prompt bauen?', 'Die Text-Grenze: echtes Hindernis oder verkraftbar? Für welche Fächer wird es eng?', 'Würdet ihr das in einer echten Stunde einsetzen? Was müsste sich ändern, damit ihr es tut?']),
      b.h3('Nach dem Nachmittag'),
      b.ul(['Was hat euch echte Arbeit abgenommen, und was war eher Spielerei?', 'Wo war die KI schneller als ihr, wo langsamer oder ungenauer?', 'Welches Material landet nächste Woche wirklich im Unterricht?', 'Was probiert ihr als Erstes zu Hause weiter?']),
      b.h2('Ein Satz zum Mitnehmen'),
      b.p('Bittet zum Schluss jede Gruppe um einen einzigen Satz: „Das nehme ich mit.“ Kurz, konkret, und ein guter Abschluss fürs Protokoll.')
    ];
    return { id: 'sammeln', nr: 10, datei: '10_Sammel-und-Reflexions-Template', titel: 'Sammeln und Reflektieren', unter: 'Ergebnisse · beide Phasen', phase: 'beide', bloecke: B, web: 'sammeln' };
  }

  /* ---------- 11 Feedbackbogen ---------- */
  function feedback(C) {
    const skala = '1 trifft nicht zu · 2 · 3 · 4 trifft voll zu';
    const B = [
      b.p(`Pädagogischer Tag KI, ${C.kopf}. Anonym, fünf Minuten. Als Umfrage im Board oder auf Papier.`),
      b.table(['Aussage', 'Bewertung'], [
        ['Ich weiß jetzt, wie ich einen Bot für meine Klasse baue und freigebe.', skala],
        ['Ich werde ein KI-Lernszenario in den nächsten vier Wochen einsetzen.', skala],
        ['Ich habe am Nachmittag ein Material gebaut, das ich verwenden kann.', skala],
        ['Die Zeit für die Arbeitsphasen war ausreichend.', skala],
        ['Die Begleitung durch die Moderation war hilfreich.', skala],
        ['Ich fühle mich sicherer im Umgang mit KI als heute Morgen.', skala]
      ], [70, 30]),
      b.h3('Was hat Ihnen am meisten gebracht?'), b.linie(' '),
      b.h3('Was sollten wir beim nächsten Mal ändern?'), b.linie(' '),
      b.h3('Wozu wünschen Sie sich eine Folgeveranstaltung?'), b.linie(' ')
    ];
    return { id: 'feedback', nr: 11, datei: '11_Feedbackbogen', titel: 'Feedback zum KI-Tag', unter: 'Abschluss', phase: 'beide', bloecke: B };
  }

  function alle(C0) {
    const C = kontext(C0);
    return { C, docs: [ablaufplan(C), orga(C), einladung(C), auftragVm(C), themen(C), baukasten(C), klickweg(C), auftragNm(C), werkzeugkasten(C), sammeln(C), feedback(C)] };
  }

  return { alle, kontext, datumLang, buchstabe };
})();
