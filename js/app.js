/* Oberfläche: Formular lesen, Zeitplan anzeigen, Material erzeugen und ausliefern. */

(() => {
  const STANDARD = {
    schule: '', datum: '', team: '', kontakt: '', bundesland: 'NRW', board: '', akzent: '#1a6b47',
    start: '08:30', ende: '16:00', mittag: '60',
    tn: 60, mods: 3, niveau: 'gemischt',
    plattform: 'fobizz', plattformFrei: '', formen: ['pingpong'],
    werkzeuge: ['gemini'], wege: ['interaktiv', 'erwartung', 'umbauen']
  };
  const BEISPIEL = {
    ...STANDARD, schule: 'Gymnasium Odenthal', datum: '2026-09-30', team: 'Medienberatung Rheinisch-Bergischer Kreis',
    board: 'https://nrw.edumaps.de/187377/6785/cxkndmi5a9ip/23py8722qyo1', tn: 55, mods: 3
  };
  const SPEICHER = 'ki-tag-generator-v1';
  const form = document.getElementById('form');
  const $ = id => document.getElementById(id);
  const esc = RENDER.esc;

  /* ---------- Formular <-> Zustand ---------- */
  function lesen() {
    const f = new FormData(form);
    const C = {};
    for (const k of Object.keys(STANDARD)) {
      C[k] = Array.isArray(STANDARD[k]) ? f.getAll(k) : (f.get(k) ?? STANDARD[k]);
    }
    C.tn = Math.max(1, parseInt(C.tn, 10) || 1);
    C.mods = Math.max(0, parseInt(C.mods, 10) || 0);
    return C;
  }
  function schreiben(C) {
    for (const [k, v] of Object.entries({ ...STANDARD, ...C })) {
      const els = form.elements[k];
      if (!els) continue;
      if (els instanceof RadioNodeList || els.length > 1 && els[0]?.type) {
        [...els].forEach(el => { el.checked = Array.isArray(v) ? v.includes(el.value) : el.value === String(v); });
      } else if (els.type === 'checkbox') els.checked = Array.isArray(v) ? v.includes(els.value) : !!v;
      else els.value = v;
    }
  }
  function sichern(C) { try { localStorage.setItem(SPEICHER, JSON.stringify(C)); } catch (e) { /* privater Modus */ } }
  function laden() { try { return JSON.parse(localStorage.getItem(SPEICHER) || 'null'); } catch (e) { return null; } }

  /* Mindestens eine Arbeitsform, ein Werkzeug, ein Weg */
  function pflicht(C) {
    const fehlt = [];
    if (!C.formen.length) fehlt.push('eine Arbeitsform für den Vormittag');
    if (!C.werkzeuge.length) fehlt.push('ein Werkzeug für den Nachmittag');
    const agent = C.werkzeuge.some(w => LIB.werkzeuge[w].typ === 'agent');
    if (!C.wege.filter(w => agent || !LIB.wege[w].nurAgent).length) fehlt.push('einen Weg zum Material');
    return fehlt;
  }

  /* ---------- Seitenleiste ---------- */
  let STAND = null;
  function aktualisieren() {
    const C0 = lesen();
    sichern(C0);
    document.querySelector('.nurandere').hidden = C0.plattform !== 'andere';
    const agent = C0.werkzeuge.some(w => LIB.werkzeuge[w]?.typ === 'agent');
    $('weg-paket').classList.toggle('aus', !agent);
    $('weg-paket').title = agent ? '' : 'Nur mit Claude Code oder Codex';

    const fehlt = pflicht(C0);
    if (fehlt.length) {
      $('hinweise').innerHTML = `<div class="hw fehler">Bitte wählt noch ${fehlt.join(', ')}.</div>`;
      $('liste').innerHTML = ''; $('zip').disabled = true; STAND = null;
      return;
    }
    $('zip').disabled = false;
    const { C, docs } = DOCS.alle(C0);
    const decks = DECKS.alle(C);
    STAND = { C0, C, docs, decks };

    const zeile = r => `<tr class="${r.pause ? 'pause' : ''}${r.arbeit ? ' arbeit' : ''}"><td>${r.von}</td><td>${esc(r.phase)}</td><td>${r.min}′</td></tr>`;
    $('zeitplan').innerHTML = `<table class="zp"><tbody>
      <tr class="teil"><td colspan="3">Vormittag</td></tr>${C.Z.vm.map(zeile).join('')}
      ${C.Z.mittag ? `<tr class="pause"><td>${C.Z.mittag.von}</td><td>Mittagspause</td><td>${C.Z.mittag.min}′</td></tr>` : ''}
      <tr class="teil"><td colspan="3">Nachmittag</td></tr>${C.Z.nm.map(zeile).join('')}
      <tr><td>${C.Z.ende}</td><td>Ende</td><td></td></tr></tbody></table>`;
    const L = C.L;
    $('logistik').innerHTML = [
      ['Gruppen', `etwa ${L.gruppen} zu dritt`], ['Arbeitsräume', `${L.raeume} (je ≈ ${L.proRaum} Personen)`],
      ['Moderation', `${L.modsNoetig} nötig`], ['WLAN', `≈ ${L.wlan} Geräte gleichzeitig`]
    ].map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
    const hw = [...C.Z.warn, ...L.warn];
    if (agent && C.niveau === 'einstieg') hw.push({ art: 'warn', text: 'Agenten sind für ein Einsteiger-Kollegium meist zu viel. Besser im Vortrag zeigen und am Tag im Chat arbeiten.' });
    if (C.plattform === 'ais' && C.bundesland === 'NRW') hw.push({ art: 'info', text: 'AIS.chat in NRW: Der KI-Selbstlernkurs im LMS NRW ist Voraussetzung. Rechtzeitig ankündigen.' });
    $('hinweise').innerHTML = hw.map(w => `<div class="hw ${w.art}">${esc(w.text)}</div>`).join('');

    liste();
  }

  function liste() {
    const { C, docs, decks } = STAND;
    $('mat-lead').textContent = `${docs.length} Word-Dokumente, ${decks.length} Vorträge und eine Teilnehmer-Website mit ${docs.filter(d => d.web).length + 1} Seiten. Alles passt sich an die Eingaben oben an.`;
    const karte = (nr, titel, unter, akt) => `<article class="doc-k"><div class="dt"><span class="nr">${nr}</span><b>${esc(titel)}</b></div><p>${esc(unter)}</p><div class="akt">${akt}</div></article>`;
    const gruppen = [['orga', 'Organisation'], ['vm', 'Vormittag'], ['nm', 'Nachmittag'], ['beide', 'Ergebnisse und Abschluss']];
    let h = '';
    gruppen.forEach(([ph, name]) => {
      h += `<p class="gruppe">${name}</p>`;
      docs.filter(d => d.phase === ph).forEach(d => {
        h += karte(String(d.nr).padStart(2, '0'), d.titel, d.unter + (d.web ? ' · auch auf der Website' : ''),
          `<button type="button" class="btn sm" data-vs="doc:${d.id}">Vorschau</button><button type="button" class="btn sm ghost" data-dl="doc:${d.id}">Word</button>`);
      });
    });
    h += '<p class="gruppe">Vorträge (HTML, offline im Browser)</p>';
    decks.forEach((k, i) => {
      h += karte(k.datei.slice(0, 2), k.titel, `${k.slides.length} Folien mit Sprechnotizen · Pfeiltasten, S, F`,
        `<button type="button" class="btn sm" data-vs="deck:${i}">Ansehen</button><button type="button" class="btn sm ghost" data-dl="deck:${i}">HTML</button>`);
    });
    h += '<p class="gruppe">Für die Teilnehmenden</p>';
    h += karte('15', 'Teilnehmer-Website', 'Startseite mit Ablauf, alle Aufträge mit Kopierknöpfen, Impressum. Ordner zum Hochladen, etwa auf GitHub Pages.',
      `<button type="button" class="btn sm" data-vs="web">Startseite ansehen</button><button type="button" class="btn sm ghost" data-dl="web">ZIP</button>`);
    $('liste').innerHTML = h;
  }

  /* ---------- Schriften für die Ausgabe ---------- */
  const SCHRIFTEN = [['Barlow', 700, 'Barlow-700'], ['Barlow', 800, 'Barlow-800'], ['IBM Plex Sans', 400, 'IBMPlexSans-400'], ['IBM Plex Sans', 600, 'IBMPlexSans-600']];
  let fontCache = null;
  async function schriften() {
    if (fontCache) return fontCache;
    const eingebettet = [], dateien = {};
    for (const [fam, w, f] of SCHRIFTEN) {
      try {
        const r = await fetch('fonts/' + f + '.woff2');
        if (!r.ok) throw 0;
        const buf = await r.arrayBuffer();
        dateien[f + '.woff2'] = buf;
        let bin = ''; const u = new Uint8Array(buf);
        for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
        eingebettet.push(`@font-face{font-family:'${fam}';font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${btoa(bin)}) format('woff2')}`);
      } catch (e) { /* ohne Server (file://): Systemschriften */ }
    }
    const verlinkt = SCHRIFTEN.filter(([, , f]) => dateien[f + '.woff2']).map(([fam, w, f]) => `@font-face{font-family:'${fam}';font-weight:${w};font-display:swap;src:url(fonts/${f}.woff2) format('woff2')}`).join('\n');
    fontCache = { eingebettet: eingebettet.join('\n'), verlinkt: verlinkt ? verlinkt + '\n' : '', dateien };
    return fontCache;
  }

  /* ---------- Erzeugen ---------- */
  const docHTML = (d, C, font) => `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.titel)}</title>
<style>${font}${RENDER.css(C.akzent)} body{padding:28px 0 60px}</style></head><body><main class="wrap doc">${RENDER.docBody(d)}</main><script>${RENDER.copyJS}<\/script></body></html>`;

  async function datei(key) {
    const { C, docs, decks } = STAND;
    const f = await schriften();
    if (key.startsWith('doc:')) {
      const d = docs.find(x => x.id === key.slice(4));
      return { name: d.datei + '.docx', blob: await RENDER.docxBlob(d, C), html: docHTML(d, C, f.eingebettet), titel: d.titel };
    }
    if (key.startsWith('deck:')) {
      const k = decks[+key.slice(5)];
      const html = DECKS.html(k, C, f.eingebettet);
      return { name: k.datei, blob: new Blob([html], { type: 'text/html' }), html, titel: k.titel };
    }
    if (key === 'web') {
      const files = RENDER.website(C, docs, f.verlinkt);
      const zip = new JSZip();
      Object.entries(files).forEach(([n, x]) => zip.file(n, x));
      Object.entries(f.dateien).forEach(([n, b]) => zip.file('fonts/' + n, b));
      const html = files['index.html'].replace('<link rel="stylesheet" href="style.css">', `<style>${f.eingebettet}${files['style.css'].replace(f.verlinkt, '')}</style>`);
      return { name: 'Teilnehmer-Website.zip', blob: await zip.generateAsync({ type: 'blob' }), html, titel: 'Teilnehmer-Website' };
    }
  }

  function speichern(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  const slug = s => (s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');

  async function komplett() {
    const { C0, C, docs, decks } = STAND;
    const f = await schriften();
    const ordner = `KI-Tag_${slug(C.schule) || 'Schule'}_${C.datum || 'Datum'}`;
    const zip = new JSZip();
    const z = zip.folder(ordner);
    for (const d of docs) z.file('Dokumente/' + d.datei + '.docx', await RENDER.docxBlob(d, C));
    decks.forEach(k => z.file('Vortraege/' + k.datei, DECKS.html(k, C, f.eingebettet)));
    const web = RENDER.website(C, docs, f.verlinkt);
    Object.entries(web).forEach(([n, x]) => z.file('Teilnehmer-Website/' + n, x));
    Object.entries(f.dateien).forEach(([n, b]) => z.file('Teilnehmer-Website/fonts/' + n, b));
    z.file('einstellungen.json', JSON.stringify(C0, null, 2));
    z.file('00_LIESMICH.txt', liesmich(C, docs, decks));
    return { name: ordner + '.zip', blob: await zip.generateAsync({ type: 'blob' }) };
  }

  function liesmich(C, docs, decks) {
    const zeilen = [
      `KI-Tag · ${C.kopf}`, '',
      `Vormittag: ${C.P.name}, Arbeitsform${C.F.length > 1 ? 'en' : ''}: ${C.F.map(f => f.name).join(', ')}`,
      `Nachmittag: ${C.W.map(w => w.name).join(', ')}; Wege: ${C.WG.map(w => w.name).join(', ')}`,
      `Zeit: ${C.Z.vm[0].von} bis ${C.Z.ende} Uhr, ${C.L.tn} Teilnehmende, ${C.L.raeume} Arbeitsräume`, '',
      'INHALT', '',
      'Dokumente/  (Word, frei bearbeitbar)',
      ...docs.map(d => `  ${d.datei}.docx  ${d.titel}`), '',
      'Vortraege/  (HTML, laufen offline in jedem Browser; Pfeiltasten blättern, S zeigt Sprechnotizen, F Vollbild)',
      ...decks.map(k => `  ${k.datei}  ${k.titel}, ${k.slides.length} Folien`), '',
      'Teilnehmer-Website/  (index.html öffnen oder den Ordner hochladen, etwa auf GitHub Pages)', '',
      'einstellungen.json  (im Generator über „Einstellungen laden“ wieder öffnen und anpassen)', '',
      'VOR DEM TERMIN',
      '- Orga-Checkliste durchgehen, besonders die Termine T-42 bis Vortag.',
      '- Alle Klickwege einmal selbst durchspielen. Die Oberflächen ändern sich schnell.',
      '- Impressum der Website vervollständigen, bevor sie öffentlich online geht.',
      C.board ? '' : '- Link zum Sammel-Board fehlt noch. Im Generator eintragen und neu erzeugen.'
    ];
    return zeilen.filter(z => z !== null).join('\r\n');
  }

  /* ---------- Ereignisse ---------- */
  let vsKey = null;
  document.addEventListener('click', async e => {
    const vs = e.target.closest('[data-vs]'), dl = e.target.closest('[data-dl]');
    try {
      if (vs) {
        vsKey = vs.dataset.vs;
        const x = await datei(vsKey);
        $('vs-titel').textContent = x.titel;
        $('vs-dl').textContent = vsKey.startsWith('doc:') ? 'Word herunterladen' : vsKey === 'web' ? 'ZIP herunterladen' : 'HTML herunterladen';
        $('vs-frame').srcdoc = x.html;
        $('vorschau').showModal();
      } else if (dl) {
        const x = await datei(dl.dataset.dl);
        speichern(x.blob, x.name);
      }
    } catch (err) { console.error(err); $('status').textContent = 'Fehler beim Erzeugen: ' + err.message; }
  });
  $('vs-dl').addEventListener('click', async () => { const x = await datei(vsKey); speichern(x.blob, x.name); });
  $('vs-zu').addEventListener('click', () => $('vorschau').close());
  $('vorschau').addEventListener('click', e => { if (e.target === $('vorschau')) $('vorschau').close(); });

  $('zip').addEventListener('click', async () => {
    const b = $('zip'); b.disabled = true; $('status').textContent = 'Erzeuge das Komplettpaket …';
    try { const x = await komplett(); speichern(x.blob, x.name); $('status').textContent = `Fertig: ${x.name} (${Math.round(x.blob.size / 1024)} KB).`; }
    catch (err) { console.error(err); $('status').textContent = 'Fehler beim Erzeugen: ' + err.message; }
    b.disabled = false;
  });

  form.addEventListener('input', aktualisieren);
  form.addEventListener('change', aktualisieren);
  form.addEventListener('submit', e => e.preventDefault());
  document.querySelectorAll('[data-zeit]').forEach(b => b.addEventListener('click', () => {
    const [s, en, m] = b.dataset.zeit.split(',');
    form.elements.start.value = s; form.elements.ende.value = en; form.elements.mittag.value = m;
    aktualisieren();
  }));
  $('beispiel').addEventListener('click', () => { schreiben(BEISPIEL); aktualisieren(); });
  $('export').addEventListener('click', () => {
    const C = lesen();
    speichern(new Blob([JSON.stringify(C, null, 2)], { type: 'application/json' }), `ki-tag_${slug(C.schule) || 'einstellungen'}_${C.datum || ''}.json`);
  });
  $('import').addEventListener('change', async e => {
    const f = e.target.files[0]; if (!f) return;
    try { schreiben(JSON.parse(await f.text())); aktualisieren(); $('status').textContent = 'Einstellungen geladen.'; }
    catch (err) { $('status').textContent = 'Die Datei ließ sich nicht lesen.'; }
    e.target.value = '';
  });

  schreiben(laden() || STANDARD);
  aktualisieren();
})();
