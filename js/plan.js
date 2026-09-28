/* Zeitplan und Logistik aus den Rahmenbedingungen.
   Grundlage ist das Raster des KI-Tags (08:30 bis 16:00, 60 Min Mittag, zweimal 90 Min
   Arbeitsphase). Passt die Zeit nicht, wird in fester Reihenfolge gekürzt oder gestreckt. */

const PLAN = (() => {
  const toMin = t => { const [h, m] = String(t || '0:0').split(':').map(Number); return h * 60 + (m || 0); };
  const toStr = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  const r5 = m => Math.max(0, Math.round(m / 5) * 5);

  function bloecke(C) {
    const gross = C.tn > 60;
    const einf = { einstieg: 35, gemischt: 30, erfahren: 20 }[C.niveau] || 30;
    const refl = C.tn > 80 ? 35 : 30;
    const wechsel = gross ? 20 : 15;
    const pn = C.plattformName;
    const nm = C.werkzeugNamen;
    return {
      vm: [
        { k: 'start', phase: 'Ankommen', inhalt: 'Begrüßung und Einstiegsvortrag', wo: 'Plenum', min: 30, ideal: 30, low: 20 },
        { k: 'einf', phase: 'Einführung', inhalt: pn + ' mit Lerngruppen nutzen: Bot bauen, freigeben, Schülersicht', wo: 'Plenum', min: einf, ideal: einf, low: 20 },
        { k: 'w1', phase: 'Pause', inhalt: 'Raumwechsel, Gruppen bilden (2 bis 4, fachaffin)', wo: 'Arbeitsräume', min: wechsel, ideal: wechsel, low: 10, pause: true },
        { k: 'a1', phase: 'Arbeitsphase I', inhalt: 'KI-Lernszenario bauen und gegenseitig testen (' + pn + ')', wo: 'Arbeitsräume', min: 90, ideal: 90, low: 45, arbeit: true },
        { k: 'p1', phase: 'Pause', inhalt: 'Zurück ins Plenum', wo: '', min: 15, ideal: 15, low: 5, pause: true },
        { k: 'r1', phase: 'Reflexion I', inhalt: 'Ergebnisse zeigen und einordnen', wo: 'Plenum', min: refl, ideal: refl, low: 20 }
      ],
      nm: [
        { k: 'in2', phase: 'Input', inhalt: 'Material erstellen und umbauen mit KI', wo: 'Plenum', min: 30, ideal: 30, low: 20 },
        { k: 'w2', phase: 'Pause', inhalt: 'Raumwechsel, Gruppen bilden (2 bis 4, fachaffin)', wo: 'Arbeitsräume', min: wechsel, ideal: wechsel, low: 10, pause: true },
        { k: 'a2', phase: 'Arbeitsphase II', inhalt: nm + ': ein Material für den eigenen Unterricht bauen', wo: 'Arbeitsräume', min: 90, ideal: 90, low: 45, arbeit: true },
        { k: 'p2', phase: 'Pause', inhalt: 'Wechsel ins Plenum', wo: '', min: 15, ideal: 15, low: 5, pause: true },
        { k: 'r2', phase: 'Reflexion II', inhalt: 'Abschlussrunde und Feedback', wo: 'Plenum', min: refl, ideal: refl, low: 20 }
      ]
    };
  }

  function zeitplan(C) {
    const B = bloecke(C);
    const alle = [...B.vm, ...B.nm];
    const by = k => alle.find(b => b.k === k);
    const start = toMin(C.start), ende = toMin(C.ende), mittag = Number(C.mittag) || 0;
    const verfuegbar = ende - start - mittag;
    const summe = () => alle.reduce((s, b) => s + b.min, 0);
    const warn = [];

    let diff = verfuegbar - summe();
    if (diff < 0) {
      /* Kürzen in fester Reihenfolge. Die Arbeitsphasen kommen spät dran, weil dort das Ergebnis entsteht. */
      const schritte = [
        ['p1', 5], ['p2', 5],
        ['a1', 75], ['a2', 75],
        ['start', 25], ['einf', 25], ['in2', 25], ['r1', 25], ['r2', 25],
        ['a1', 60], ['a2', 60],
        ['start', 20], ['einf', 20], ['in2', 20], ['r1', 20], ['r2', 20], ['w1', 10], ['w2', 10],
        ['a1', 45], ['a2', 45]
      ];
      for (const [k, ziel] of schritte) {
        diff = verfuegbar - summe();
        if (diff >= 0) break;
        const b = by(k);
        const neu = Math.max(ziel, b.min + diff);
        if (neu < b.min) b.min = neu;
      }
      diff = verfuegbar - summe();
      if (diff < 0) warn.push({ art: 'fehler', text: `Es fehlen ${-diff} Minuten, selbst mit allen Kürzungen. Für beide Hälften braucht ihr mindestens ${Math.floor((summe() + mittag) / 60)} Std. ${(summe() + mittag) % 60} Min. Späteres Ende, kürzere Mittagspause oder den Tag auf zwei Termine verteilen.` });
      const a1 = by('a1').min;
      if (a1 < 60 && diff >= 0) warn.push({ art: 'warn', text: `Die Arbeitsphasen haben nur ${a1} Minuten. Das reicht für einen Bot oder ein Material, aber kaum für das gegenseitige Testen. Wenn möglich, eine Viertelstunde mehr einplanen.` });
    } else if (diff > 0) {
      /* Strecken: zuerst die Arbeitsphasen, bis 120 Minuten. */
      const plus = Math.min(30, Math.floor(diff / 2 / 5) * 5);
      by('a1').min += plus; by('a2').min += plus;
      diff = verfuegbar - summe();
      if (diff >= 15) {
        warn.push({ art: 'info', text: `Der Zeitrahmen ist länger als nötig. Der Plan endet ${diff} Minuten vor dem eingetragenen Ende. Die Zeit kann als offene Werkstatt oder Sprechstunde dienen.` });
      }
    }

    alle.forEach(b => { b.min = r5(b.min); });
    let t = start;
    const rows = list => list.filter(b => b.min > 0).map(b => { const r = { ...b, von: toStr(t), bis: toStr(t + b.min) }; t += b.min; return r; });
    const vm = rows(B.vm);
    const mittagVon = t; t += mittag;
    const nm = rows(B.nm);
    const ist = { vm, nm, mittag: mittag ? { von: toStr(mittagVon), bis: toStr(mittagVon + mittag), min: mittag } : null, ende: toStr(t), warn: warn.filter(w => w.text) };
    ist.dauer = k => (vm.concat(nm).find(b => b.k === k) || { min: 0 }).min;
    return ist;
  }

  /* Minuten auf Teilschritte verteilen, gerundet auf 5, Summe bleibt exakt. */
  function verteile(gesamt, gewichte) {
    const s = gewichte.reduce((a, b) => a + b, 0);
    const out = gewichte.map(g => Math.max(5, r5(gesamt * g / s)));
    let rest = gesamt - out.reduce((a, b) => a + b, 0);
    let i = out.indexOf(Math.max(...out));
    out[i] += rest;
    return out;
  }

  function logistik(C) {
    const tn = Math.max(1, Number(C.tn) || 1);
    const gruppen = Math.ceil(tn / 3);
    const raeume = Math.max(1, Math.ceil(tn / 24));
    const modsNoetig = raeume + (tn > 40 ? 1 : 0);
    const warn = [];
    if ((Number(C.mods) || 0) < modsNoetig) warn.push({ art: 'warn', text: `Für ${raeume} Arbeitsräume braucht ihr ${modsNoetig} Personen in der Moderation (eine pro Raum${tn > 40 ? ', dazu eine für Technik und Plenum' : ''}). Eingetragen sind ${C.mods || 0}.` });
    let reflexion;
    if (tn <= 25) reflexion = 'Runde im Plenum: jede Gruppe zeigt ihr Ergebnis in zwei Minuten am Beamer.';
    else if (tn <= 60) reflexion = 'Galeriegang am Board (fünf Minuten), dann stellen drei bis vier Gruppen im Plenum vor. Die Moderation wählt vorher Ergebnisse aus unterschiedlichen Fächern.';
    else reflexion = 'Galeriegang am Board, dann Austausch in den Arbeitsräumen entlang von zwei Leitfragen. Im Plenum nur ein kurzes Stimmungsbild und zwei ausgewählte Ergebnisse.';
    return {
      tn, gruppen, raeume, modsNoetig, reflexion, warn,
      proRaum: Math.ceil(tn / raeume),
      wlan: Math.ceil(tn * 1.5),
      testpaare: Math.floor(gruppen / 2)
    };
  }

  return { zeitplan, logistik, verteile, toMin, toStr };
})();
