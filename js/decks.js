/* Vortragsfolien als einzelne, offline lauffähige HTML-Datei.
   Steuerung wie im Master-Paket: Pfeiltasten oder Klick blättern, S Sprechnotizen, F Vollbild. */

const DECKS = (() => {
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  /* Minuten eines Vortrags auf Folien verteilen, nach Gewicht */
  function zeiten(slides, gesamt) {
    const g = slides.map(s => s.w || 2);
    const summe = g.reduce((a, b) => a + b, 0);
    let rest = gesamt;
    return g.map((x, i) => { const m = i === g.length - 1 ? rest : Math.max(1, Math.round(gesamt * x / summe)); rest -= m; return Math.max(1, m); });
  }

  function vormittag(C) {
    const P = C.P;
    const vortrag = Math.max(10, (C.Z.dauer('start') || 30) - 10);
    const S = [
      { art: 'titel', h: 'KI im Unterricht. Und KI für euch.', lead: 'Ein Tag in zwei Hälften: vormittags mit den Lernenden, nachmittags für die eigene Arbeit.', fuss: `Vormittag · ${C.kopf}`, w: 1, n: `Heute geht es um zwei konkrete Sachen: KI mit der Klasse und KI für die eigene Vorbereitung. Der Vortrag dauert etwa ${vortrag} Minuten, danach kommt die Einführung in ${P.name}.` },
      { h: 'KI ist längst in ihrer Welt', karten: [['Unterhaltung', 'Die Feeds sind KI-kuratiert, oft auch KI-gemacht.'], ['Meinungsbildung', 'Fake News und KI-Videos formen mit, was für wahr gehalten wird.'], ['Lernbegleiter', 'Vom Hausaufgaben-Helfer bis zum Ersatz-Gesprächspartner.'], ['Arbeitswerkzeug', 'In fast jedem Beruf, den unsere Lernenden ergreifen werden.']], merk: 'Ihnen den kompetenten Umgang beizubringen, ist Bildungsauftrag.', w: 3, n: 'Pointe: Wenn das alles Teil ihrer Welt ist, ist es unser Auftrag, ihnen den kompetenten Umgang beizubringen.' },
      { art: 'zitat', h: C.LEG.zitat, quelle: C.LEG.quelle, w: 3, n: C.bundesland === 'NRW' ? 'Betonen: verpflichtend, in allen Jahrgangsstufen, und die Leistungsbewertung muss Bedienung und kritischen Umgang abbilden.' : 'Den Wortlaut des eigenen Bundeslandes vor dem Tag hier eintragen.' },
      { h: 'Das Verdummungspotential', lead: 'Nimmt die KI das Denken ab, wo sie es anregen sollte, lernt niemand etwas.', art: 'denkweg', merk: 'Nicht das Schummeln ist das Problem. Es ist die abgesparte Denkleistung, und die sieht man keinem Text an.', w: 2, n: 'Beide Wege enden bei einem Ergebnis, nur bei einem ist etwas hängengeblieben. Ein eigenes Beispiel aus dem Unterricht wirkt hier am stärksten.' },
      { h: 'KI, die zum Denken zwingt', lead: 'Sie begleitet, strukturiert und gibt Feedback. Was sie nicht tut: die Lösung liefern.', punkte: C.F.map(f => `**${f.name}:** ${f.kurz}`), art: C.formen.includes('pingpong') && C.F.length <= 2 ? 'pingpong' : null, merk: 'Die KI stellt die Fragen. Denken sollen die Lernenden.', w: 3, n: `Die ${C.F.length > 1 ? 'Arbeitsformen' : 'Arbeitsform'} für heute kurz vorstellen. Genau dieses Hin und Her baut ihr am Vormittag.` },
      { h: 'Vormittag: mit der Klasse arbeiten', lead: `Datenschutzkonform geht das mit ${P.kurz}. Die Lernenden kommen so hinein: ${P.schuelerZugang}.`, merk: 'Die Lernenden arbeiten nur mit Text. Fotos geben sie nicht an die KI.', w: 3, n: P.textRegel + ' Das prägt die Themenwahl.' },
      { h: 'Nachmittag: die KI arbeitet für euch', lead: `Auf euren eigenen Konten mit ${C.werkzeugNamen}: Arbeitsblätter, Erwartungshorizonte, Material umbauen.`, merk: 'Am Ende hat jede Gruppe ein Ergebnis, das sie zeigen kann.', w: 1, n: 'Nur ein Ausblick, Details kommen nach der Mittagspause.' },
      { h: 'Der Tag', zeit: [...C.Z.vm, ...(C.Z.mittag ? [{ von: C.Z.mittag.von, phase: 'Mittag', inhalt: '' }] : []), ...C.Z.nm].filter(r => r.phase !== 'Pause').map(r => [r.von, r.phase, r.inhalt]), w: 1, n: 'Kurz den Ablauf zeigen, Räume nennen.' },
      { art: 'ende', h: 'Ausprobieren ist der Sinn des Tages', lead: `Fachaffine Kleingruppen, die Moderation kommt bei euch vorbei, nach jeder Phase sammeln wir kurz${C.board ? ' im Board' : ''}. Und wenn etwas schiefgeht: genau dafür ist heute Zeit.`, fuss: `Weiter mit der Einführung in ${P.name}.`, w: 2, n: 'Letzter Satz mit Energie: Es darf auch etwas schiefgehen. Dann Bühne frei für die Einführung.' }
    ];
    const z = zeiten(S, vortrag);
    S.forEach((s, i) => { s.n = `(${z[i]} Min) ` + s.n; });
    return { titel: 'Einstieg Vormittag', datei: '12_Vortrag_Vormittag.html', slides: S };
  }

  function plattform(C) {
    const P = C.P;
    const S = [
      { art: 'titel', h: `${P.name} mit Lerngruppen nutzen`, lead: 'Einen eigenen Bot bauen, für die Klasse freigeben und die Schülersicht testen.', fuss: `Vormittag · Einführung · ${C.kopf}`, n: 'Wer will, klickt parallel mit. Die Website hat Aufträge und Baukasten.' },
      { h: 'Die Stationen', karten: P.stationen.map((s, i) => [`${i + 1} ${s.t}`, s.d.split('. ')[0] + '.']), n: 'Die Stationen an die Wand, dann gehen wir sie einzeln durch.' },
      ...P.stationen.map((s, i) => ({ h: `Station ${i + 1}: ${s.t}`, lead: s.d, n: 'Live in der Oberfläche zeigen. Screenshots vom eigenen Konto können hier ergänzt werden.' })),
      { h: 'Vorher erledigt?', punkte: P.voraussetzung, n: 'Wer hier noch Lücken hat, meldet sich jetzt, damit die Moderation in der Pause hilft.' },
      { h: 'Die Schülersicht testen', lead: P.testen, merk: 'Der wichtigste Test: nach der Lösung fragen.', n: 'Wenn der Bot die Lösung herausgibt, die Guardrails aus dem Baukasten nachschärfen.' },
      { art: 'ende', h: 'Ziel für heute', lead: 'Ein Bot, für die Klasse freigegeben und einmal von einer anderen Gruppe durchgespielt.', fuss: 'Gruppen bilden und los.', n: 'Die Moderation kommt rum. Räume ansagen.' }
    ];
    return { titel: `Einführung ${P.name}`, datei: '13_Einfuehrung_' + P.name.replace(/[^A-Za-z0-9]+/g, '') + '.html', slides: S };
  }

  function nachmittag(C) {
    const vortrag = C.Z.dauer('in2') || 30;
    const S = [
      { art: 'titel', h: 'Jetzt arbeitet die KI für euch.', lead: 'Material erstellen, umbauen und aufbereiten.', fuss: `Nachmittag · ${C.kopf}`, w: 1, n: 'Heute Vormittag habt ihr für die Klasse gearbeitet, jetzt arbeitet die KI für euch.' },
      { h: 'Was ihr davon habt', lead: 'Ein Arbeitsblatt fängt nicht mehr beim leeren Blatt an. Ihr beschreibt, was ihr braucht, und habt in Minuten einen Entwurf.', merk: 'Geprüft wird trotzdem. Aber prüfen geht schneller als erfinden.', w: 2, n: 'Die fachliche Verantwortung bleibt bei euch. Am stärksten wirkt hier ein eigenes Beispiel aus der letzten Woche.' },
      { h: 'Andere Lage, andere Werkzeuge', lead: `Am Vormittag waren Schülerdaten im Spiel, deshalb ${C.P.name} und nur Text. Jetzt arbeitet ihr mit eurem eigenen Material auf eurem eigenen Konto.`, merk: 'Fotografieren, hochladen, diktieren. Schülerdaten bleiben draußen.', w: 2, n: C.W.map(w => w.datenschutz).join(' ') },
      ...C.W.map(w => ({ h: `${w.name} (${w.anbieter})`, lead: w.kurz, punkte: [w.start, w.kosten], w: 2, n: w.quellen })),
      ...(C.agent ? [{ h: 'Chat oder Agent', karten: [['Chat', 'Ihr schreibt, die KI antwortet. Ein Ergebnis pro Schritt, im Browser.'], ['Agent', 'Ihr gebt einen Auftrag, der Agent erledigt mehrere Schritte und legt Dateien in einem Ordner an.']], merk: 'Agentisch arbeiten heißt Abo und Installation.', w: 2, n: 'Agenten lohnen sich, wenn viele Dateien entstehen oder umgebaut werden sollen. Für ein einzelnes Arbeitsblatt reicht der Chat.' }] : []),
      { h: 'Drei Schritte zu einem guten Prompt', art: 'prompt', merk: 'Beschreibt nicht, was ihr meint. Zeigt es.', w: 3, n: 'Ein Beispiel ist mehr wert als drei Absätze Erklärung, und abtippen muss es niemand.' },
      { h: C.WG.length > 1 ? `${C.WG.length} Wege, ein Ergebnis` : 'Euer Weg', punkte: C.WG.map((w, i) => `**${C.WG.length > 1 ? DOCS.buchstabe(i) + ' ' : ''}${w.name}:** ${w.kurz}`), merk: 'Am Ende hat jede Gruppe ein Ergebnis, das sie zeigen kann.', w: 2, n: 'Die entscheidende Ansage: ein Ergebnis, nicht drei halbe. Wer nichts dabei hat, nimmt die nächste Stunde, die ansteht.' },
      { art: 'ende', h: 'Nehmt euch eine Sache vor', lead: 'Alle Aufträge, Beispiele und Kopiervorlagen stehen auf der Website. Die Moderation kommt bei euch vorbei. Fragt früh, nicht erst nach 40 Minuten.', fuss: 'Es muss nichts perfekt werden. Es soll nur etwas entstehen.', w: 1, n: 'Raumaufteilung sagen und loslassen.' }
    ];
    const z = zeiten(S, vortrag);
    S.forEach((s, i) => { s.n = `(${z[i]} Min) ` + s.n; });
    return { titel: 'Input Nachmittag', datei: '14_Vortrag_Nachmittag.html', slides: S };
  }

  let farbe = x => x;
  function slideHTML(s, i) {
    const cls = ['s', s.art || 'std'];
    let h = '';
    if (s.art === 'zitat') {
      h = `<blockquote>${fmt(s.h)}</blockquote><p class="quelle">${fmt(s.quelle)}</p>`;
    } else {
      h = (s.art === 'titel' ? `<h1>${fmt(s.h)}</h1>` : `<h2>${fmt(s.h)}</h2>`);
      if (s.lead) h += `<p class="lead">${fmt(s.lead)}</p>`;
      if (s.karten) h += `<div class="karten k${s.karten.length}">${s.karten.map(k => `<div class="karte"><b>${fmt(k[0])}</b><span>${fmt(k[1])}</span></div>`).join('')}</div>`;
      if (s.punkte) h += `<ul>${s.punkte.map(p => `<li>${fmt(p)}</li>`).join('')}</ul>`;
      if (s.art && ART[s.art]) h += `<div class="art">${farbe(ART[s.art])}</div>`;
      if (s.zeit) h += `<table class="zeit">${s.zeit.map(z => `<tr><td>${esc(z[0])}</td><th>${esc(z[1])}</th><td>${esc(z[2])}</td></tr>`).join('')}</table>`;
      if (s.merk) h += `<p class="merk">${fmt(s.merk)}</p>`;
      if (s.fuss) h += `<p class="fuss">${fmt(s.fuss)}</p>`;
    }
    return `<section class="${cls.join(' ')}${i === 0 ? ' on' : ''}" data-notes="${esc(s.n || '')}"><div class="in">${h}</div></section>`;
  }

  function html(deck, C, fontCSS = '') {
    const a = C.akzent || '#1a6b47';
    const t = { '{A}': a, '{AD}': mix(a, '#000000', .72), '{AL}': mix(a, '#ffffff', .1), '{AM}': mix(a, '#ffffff', .75) };
    farbe = x => x.replace(/\{A[DLM]?\}/g, m => t[m]).replace(/ width="\d+" height="\d+"/, '');
    return `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(deck.titel)}</title>
<style>
${fontCSS}
:root{--a:${a};--ad:color-mix(in srgb,var(--a) 70%,#000);--al:color-mix(in srgb,var(--a) 10%,#fff);--ink:#16241c;--mut:#5d6b62;--bg:#fbfcfa;
--disp:"Barlow","Segoe UI Semibold",system-ui,sans-serif;--text:"IBM Plex Sans","Segoe UI",system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#1c2420;overflow:hidden}
body{font-family:var(--text);color:var(--ink)}
.deck{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
.s{display:none;width:min(100vw,177.78vh);height:min(56.25vw,100vh);background:var(--bg);position:relative;overflow:hidden}
.s.on{display:flex}
.s .in{margin:auto 0;padding:5.5% 7%;width:100%;display:flex;flex-direction:column;gap:2.2vmin}
.s h1{font-family:var(--disp);font-weight:800;font-size:7.4vmin;line-height:1.05;color:var(--ad);max-width:16ch}
.s h2{font-family:var(--disp);font-weight:800;font-size:5.6vmin;line-height:1.1;color:var(--ad);max-width:22ch}
.s .lead{font-size:3.1vmin;line-height:1.45;max-width:52ch;color:var(--ink)}
.s ul{list-style:none;display:flex;flex-direction:column;gap:1.4vmin;font-size:2.8vmin;line-height:1.4;max-width:60ch}
.s li{padding-left:3.2vmin;position:relative}
.s li::before{content:"";position:absolute;left:0;top:1.3vmin;width:1.4vmin;height:1.4vmin;border-radius:50%;background:var(--a)}
.s .karten{display:grid;gap:2vmin;grid-template-columns:repeat(auto-fit,minmax(24%,1fr))}
.s .karten.k4{grid-template-columns:repeat(4,1fr)}
.s .karte{background:var(--al);border-radius:1.8vmin;padding:2.6vmin;display:flex;flex-direction:column;gap:1vmin}
.s .karte b{font-family:var(--disp);font-size:2.9vmin;color:var(--ad)}
.s .karte span{font-size:2.3vmin;line-height:1.4}
.s .art svg{display:block;width:100%;height:auto;max-height:34vmin}
.s .merk{font-family:var(--disp);font-weight:700;font-size:3.3vmin;color:var(--a);max-width:40ch;margin-top:1vmin}
.s .fuss{font-size:2.3vmin;color:var(--mut);margin-top:3vmin}
.s.titel{background:linear-gradient(135deg,var(--al),var(--bg) 60%)}
.s.titel .lead{font-size:3.4vmin}
.s.ende{background:var(--ad);color:#fff}
.s.ende h2,.s.ende .lead,.s.ende .fuss{color:#fff}
.s.ende .fuss{font-family:var(--disp);font-weight:700;font-size:3.2vmin;opacity:.92}
.s.zitat .in{justify-content:center}
.s blockquote{font-family:var(--disp);font-weight:600;font-size:4vmin;line-height:1.3;color:var(--ad);max-width:40ch;border-left:.8vmin solid var(--a);padding-left:3vmin}
.s .quelle{font-size:2.2vmin;color:var(--mut);max-width:70ch;padding-left:3.8vmin}
.s table.zeit{border-collapse:collapse;font-size:2.5vmin}
.s table.zeit td,.s table.zeit th{padding:.8vmin 2vmin .8vmin 0;text-align:left;vertical-align:top}
.s table.zeit th{font-family:var(--disp);color:var(--ad);white-space:nowrap}
.s table.zeit td:first-child{font-variant-numeric:tabular-nums;color:var(--mut)}
.bar{position:fixed;left:0;bottom:0;height:4px;width:100%;background:var(--a);transform-origin:left;transform:scaleX(0);transition:transform .25s}
.nr{position:fixed;right:14px;bottom:10px;color:#9fb0a5;font:13px var(--text)}
.hilfe{position:fixed;left:14px;bottom:10px;color:#9fb0a5;font:13px var(--text)}
.notes{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);width:min(900px,92vw);background:#0f1713;color:#e8efe9;
  border-radius:12px;padding:16px 20px;font:16px/1.5 var(--text);display:none;box-shadow:0 8px 30px rgba(0,0,0,.4)}
.notes b{display:block;font-family:var(--disp);margin-bottom:4px;color:#a8dcc0}
body.shownotes .notes{display:block}
</style></head>
<body>
<div class="deck">
${deck.slides.map(slideHTML).join('\n')}
</div>
<div class="bar"></div><div class="nr"></div><div class="hilfe">← → blättern · S Notizen · F Vollbild</div>
<div class="notes"><b>Sprechnotiz</b><span></span></div>
<script>
(function(){
  var S=[].slice.call(document.querySelectorAll('.s')),i=0,bar=document.querySelector('.bar'),nr=document.querySelector('.nr'),no=document.querySelector('.notes span');
  function go(n){i=Math.max(0,Math.min(S.length-1,n));S.forEach(function(s,k){s.classList.toggle('on',k===i)});
    bar.style.transform='scaleX('+((i+1)/S.length)+')';nr.textContent=(i+1)+' / '+S.length;no.textContent=S[i].getAttribute('data-notes')||'';
    try{history.replaceState(null,'','#'+(i+1))}catch(e){}}
  document.addEventListener('keydown',function(e){
    if(['ArrowRight','PageDown',' ','Enter'].indexOf(e.key)>-1){e.preventDefault();go(i+1)}
    else if(['ArrowLeft','PageUp','Backspace'].indexOf(e.key)>-1){e.preventDefault();go(i-1)}
    else if(e.key==='Home')go(0);else if(e.key==='End')go(S.length-1);
    else if(e.key==='s'||e.key==='S')document.body.classList.toggle('shownotes');
    else if(e.key==='f'||e.key==='F'){if(!document.fullscreenElement)document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();else document.exitFullscreen()}
  });
  document.querySelector('.deck').addEventListener('click',function(e){go(e.clientX>innerWidth/3?i+1:i-1)});
  go((parseInt(location.hash.slice(1),10)||1)-1);
})();
</script>
</body></html>`;
  }

  function mix(h1, h2, t) {
    const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const [a, b] = [p(h1), p(h2)];
    return '#' + a.map((v, i) => Math.round(v * t + b[i] * (1 - t)).toString(16).padStart(2, '0')).join('');
  }

  function alle(C) { return [vormittag(C), plattform(C), nachmittag(C)]; }
  return { alle, html };
})();
