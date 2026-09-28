/* Ausgabe: Blockmodell zu HTML (Vorschau und Teilnehmer-Website) und zu Word (.docx). */

const RENDER = (() => {
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(https?:\/\/[^\s)<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

  /* ---------- HTML ---------- */
  function blockHTML(x) {
    switch (x.t) {
      case 'h2': return `<h2>${fmt(x.x)}</h2>`;
      case 'h3': return `<h3>${fmt(x.x)}</h3>`;
      case 'p': return `<p>${fmt(x.x)}</p>`;
      case 'ul': return `<ul>${x.l.map(i => `<li>${fmt(i)}</li>`).join('')}</ul>`;
      case 'ol': return `<ol>${x.l.map(i => `<li>${fmt(i)}</li>`).join('')}</ol>`;
      case 'table': return `<div class="tw"><table><thead><tr>${x.kopf.map(k => `<th>${fmt(k)}</th>`).join('')}</tr></thead><tbody>${x.zeilen.map(r => `<tr>${r.map(c => `<td>${fmt(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      case 'box': return `<div class="box ${x.art}"><p class="bt">${fmt(x.titel)}</p><p>${fmt(x.x)}</p></div>`;
      case 'code': return `<div class="code">${x.titel ? `<p class="ct">${fmt(x.titel)}</p>` : ''}<pre>${esc(x.x)}</pre><button type="button" class="copy" aria-live="polite">Kopieren</button></div>`;
      case 'kv': return `<dl class="kv">${x.l.map(([k, v]) => `<dt>${fmt(k)}</dt><dd>${fmt(v)}</dd>`).join('')}</dl>`;
      case 'linie': return x.x.trim() ? `<p class="linie">${fmt(x.x)}</p>` : `<div class="schreib"></div>`;
    }
    return '';
  }
  const docBody = d => `<p class="unter">${fmt(d.unter)}</p><h1>${fmt(d.titel)}</h1>${d.bloecke.map(blockHTML).join('\n')}`;

  /* Gemeinsames Stylesheet für Vorschau und Teilnehmer-Website */
  function css(akzent) {
    return `:root{--a:${akzent};--ad:color-mix(in srgb,var(--a) 72%,#000);--al:color-mix(in srgb,var(--a) 9%,#fff);--line:#dce6df;
--ink:#16241c;--mut:#5d6b62;--bg:#f3f6f3;--card:#fbfcfa;--code:#123125;--code-tx:#e6f2ea;--warn:#a8690f;--warn-bg:#f8ecd7;
--disp:"Barlow","Segoe UI Semibold",system-ui,sans-serif;--text:"IBM Plex Sans","Segoe UI",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ad:color-mix(in srgb,var(--a) 45%,#fff);--al:color-mix(in srgb,var(--a) 18%,#101713);
--line:#26372d;--ink:#e8efe9;--mut:#9fb0a5;--bg:#0e1712;--card:#141f19;--code:#0a1710;--warn:#e0a94a;--warn-bg:#2c2216}}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--text);color:var(--ink);background:var(--bg);line-height:1.65;font-size:16.5px;-webkit-font-smoothing:antialiased}
a{color:var(--ad)}
:focus-visible{outline:3px solid var(--a);outline-offset:2px;border-radius:4px}
.wrap{max-width:860px;margin-inline:auto;padding-inline:16px}
.doc h1{font-family:var(--disp);font-weight:800;font-size:clamp(28px,4vw,40px);line-height:1.1;color:var(--ad);margin:4px 0 14px;max-width:22ch}
.doc .unter{font-family:var(--disp);font-weight:600;color:var(--mut);font-size:15px}
.doc h2{font-family:var(--disp);font-weight:700;font-size:24px;color:var(--ad);margin:34px 0 10px;line-height:1.2}
.doc h3{font-family:var(--disp);font-weight:700;font-size:18.5px;margin:22px 0 6px;line-height:1.25}
.doc p{margin:8px 0;max-width:68ch}
.doc ul,.doc ol{margin:8px 0 8px 22px;max-width:66ch}
.doc li{margin:4px 0}
.doc .tw{overflow-x:auto;margin:12px 0}
.doc table{border-collapse:collapse;width:100%;font-size:15px;min-width:520px}
.doc th{font-family:var(--disp);text-align:left;background:var(--al);color:var(--ad);padding:8px 10px;border-bottom:2px solid var(--a)}
.doc td{padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
.doc td:first-child{font-variant-numeric:tabular-nums}
.doc .box{background:var(--al);border-radius:12px;padding:14px 18px;margin:16px 0}
.doc .box.warn{background:var(--warn-bg)}
.doc .box .bt{font-family:var(--disp);font-weight:700;color:var(--ad);margin:0 0 2px}
.doc .box.warn .bt{color:var(--warn)}
.doc .code{position:relative;background:var(--code);color:var(--code-tx);border-radius:12px;padding:14px 16px 14px;margin:10px 0}
.doc .code .ct{font-family:var(--disp);font-weight:700;font-size:13.5px;opacity:.75;margin:0 0 4px}
.doc pre{white-space:pre-wrap;font:14.5px/1.55 var(--text);padding-right:92px}
.doc .copy{position:absolute;top:10px;right:10px;min-height:44px;min-width:80px;border:0;border-radius:10px;background:#fff;color:var(--code);
  font-family:var(--disp);font-weight:700;font-size:14px;cursor:pointer}
.doc .kv{display:grid;grid-template-columns:minmax(120px,30%) 1fr;gap:6px 16px;margin:10px 0;max-width:72ch}
.doc dt{font-family:var(--disp);font-weight:700;color:var(--ad)}
.doc .linie{font-family:var(--disp);font-weight:600;color:var(--mut);border-top:1px solid var(--line);padding-top:10px;margin-top:22px}
.doc .schreib{height:70px;border-bottom:1px solid var(--line);margin-bottom:10px}
@media (max-width:560px){.doc .kv{grid-template-columns:1fr}.doc dd{margin-bottom:8px}.doc pre{padding-right:0;padding-top:48px}}
`;
  }

  const copyJS = `document.addEventListener('click',function(e){var b=e.target.closest('.copy');if(!b)return;var t=b.parentNode.querySelector('pre').innerText;
function ok(){b.textContent='Kopiert';setTimeout(function(){b.textContent='Kopieren'},1500)}
if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(ok)}else{var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(x){}a.remove()}});`;

  /* ---------- Teilnehmer-Website ---------- */
  function website(C, docs, fontCSS) {
    const seiten = docs.filter(d => d.web);
    const nav = aktiv => `<nav class="nav" aria-label="Seiten"><a href="index.html"${aktiv === 'index' ? ' class="on"' : ''}>Start</a>${seiten.map(d => `<a href="${d.web}.html"${aktiv === d.web ? ' class="on"' : ''}>${esc(kurztitel(d))}</a>`).join('')}</nav>`;
    const extra = `
header{background:var(--card);border-bottom:1px solid var(--line)}
.kopf{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;padding-block:12px}
.marke{font-family:var(--disp);font-weight:800;font-size:19px;color:var(--ink);text-decoration:none;margin-right:auto}
.marke small{display:block;font-weight:500;font-size:12.5px;color:var(--mut)}
.nav{display:flex;flex-wrap:wrap;gap:2px}
.nav a{font-family:var(--disp);font-weight:600;font-size:15px;color:var(--mut);text-decoration:none;padding:10px 11px;border-radius:10px;min-height:44px;display:inline-flex;align-items:center}
.nav a:hover{background:var(--al);color:var(--ink)}
.nav a.on{background:var(--al);color:var(--ad)}
main{padding-block:28px 60px}
footer{border-top:1px solid var(--line);color:var(--mut);font-size:14px;padding-block:18px 30px}
.phase{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin:14px 0}
.phase a{display:block;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;text-decoration:none;color:var(--ink)}
.phase a:hover{border-color:var(--a)}
.phase b{font-family:var(--disp);font-size:18px;color:var(--ad);display:block}
.phase span{font-size:14.5px;color:var(--mut)}
.board{display:inline-flex;align-items:center;min-height:44px;padding:10px 18px;border-radius:10px;background:var(--a);color:#fff;font-family:var(--disp);font-weight:700;text-decoration:none;margin:6px 0}
`;
    const seite = (titel, aktiv, inhalt) => `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titel)} · KI-Tag</title><link rel="stylesheet" href="style.css"></head>
<body><header><div class="wrap kopf"><a class="marke" href="index.html">KI-Tag<small>${esc(C.kopf)}</small></a>${nav(aktiv)}</div></header>
<main class="wrap doc">${inhalt}</main>
<footer><div class="wrap">${esc(C.team || 'Moderationsteam')} · ${esc(C.kopf)}${C.kontakt ? ' · ' + esc(C.kontakt) : ''} · <a href="impressum.html">Impressum</a></div></footer>
<script>${copyJS}</script></body></html>`;

    const zeilen = [...C.Z.vm, ...(C.Z.mittag ? [{ von: C.Z.mittag.von, bis: C.Z.mittag.bis, phase: 'Mittag', inhalt: '' }] : []), ...C.Z.nm].filter(r => r.phase !== 'Pause');
    const start = `<p class="unter">${esc(C.kopf)}</p><h1>Willkommen zum KI-Tag</h1>
<p>Der Tag hat zwei Hälften. Vormittags baut ihr ein KI-Lernszenario für eure Klasse mit ${esc(C.P.name)}. Nachmittags arbeitet die KI für euch: Mit ${esc(C.werkzeugNamen)} entsteht ein Material für den eigenen Unterricht.</p>
${C.board ? `<p><a class="board" href="${esc(C.board)}" target="_blank" rel="noopener">Zum gemeinsamen Board</a></p>` : '<p>Den Link zum gemeinsamen Board gibt es zu Beginn im Plenum.</p>'}
<h2>Vormittag: mit der Klasse arbeiten</h2><div class="phase">${seiten.filter(d => d.phase === 'vm').map(d => `<a href="${d.web}.html"><b>${esc(d.titel)}</b><span>${esc(d.unter)}</span></a>`).join('')}</div>
<h2>Nachmittag: die KI arbeitet für euch</h2><div class="phase">${seiten.filter(d => d.phase === 'nm').map(d => `<a href="${d.web}.html"><b>${esc(d.titel)}</b><span>${esc(d.unter)}</span></a>`).join('')}</div>
<h2>Der Ablauf</h2><div class="tw"><table><thead><tr><th>Zeit</th><th>Phase</th><th>Inhalt</th></tr></thead><tbody>${zeilen.map(r => `<tr><td>${r.von}–${r.bis}</td><td>${esc(r.phase)}</td><td>${esc(r.inhalt)}</td></tr>`).join('')}</tbody></table></div>`;
    const impressum = `<h1>Impressum</h1><p>Verantwortlich für den Inhalt:</p><p>${esc(C.team || '[Name]')}<br>${esc(C.schule || '[Schule]')}<br>${esc(C.kontakt || '[Dienstanschrift und E-Mail]')}</p>
<div class="box warn"><p class="bt">Vor dem Veröffentlichen ergänzen</p><p>Wer die Seite öffentlich ins Netz stellt, braucht ein vollständiges Impressum mit Dienstanschrift und eine Datenschutzerklärung. Die Seite selbst setzt keine Cookies und lädt nichts von fremden Servern.</p></div>`;

    const files = {
      'style.css': fontCSS + css(C.akzent) + extra,
      'index.html': seite('Start', 'index', start),
      'impressum.html': seite('Impressum', '', impressum)
    };
    seiten.forEach(d => { files[d.web + '.html'] = seite(d.titel, d.web, docBody(d)); });
    return files;
  }
  const kurztitel = d => ({ 'vormittag-auftrag': 'Auftrag VM', 'vormittag-themen': 'Themen', 'vormittag-baukasten': 'Baukasten', 'vormittag-plattform': 'Klickweg', 'nachmittag-auftrag': 'Auftrag NM', 'nachmittag-werkzeugkasten': 'Werkzeuge', 'sammeln': 'Sammeln' }[d.web] || d.titel);

  /* ---------- Word ---------- */
  function docx(d, C) {
    const D = window.docx;
    const A = (C.akzent || '#1a6b47').replace('#', '').toUpperCase();
    const DUNKEL = dunkler(A, 0.72);
    const HELL = heller(A, 0.9);
    const run = (t, o = {}) => {
      const teile = String(t).split(/\*\*(.+?)\*\*/);
      return teile.map((x, i) => new D.TextRun({ text: x, bold: o.bold || i % 2 === 1, color: o.color, size: o.size, font: o.font, italics: o.italics }));
    };
    const para = (t, o = {}) => new D.Paragraph({ children: run(t, o), spacing: { after: o.after ?? 120, before: o.before ?? 0, line: 290 }, keepNext: o.keepNext, alignment: o.align });
    const rand = { top: { style: D.BorderStyle.NONE, size: 0, color: 'FFFFFF' }, bottom: { style: D.BorderStyle.NONE, size: 0, color: 'FFFFFF' }, left: { style: D.BorderStyle.NONE, size: 0, color: 'FFFFFF' }, right: { style: D.BorderStyle.NONE, size: 0, color: 'FFFFFF' } };
    const breite = 9000; /* A4 mit 2,5 cm Rand ≈ 16 cm ≈ 9070 twips */
    const kasten = (kinder, fill) => new D.Table({
      width: { size: breite, type: D.WidthType.DXA }, columnWidths: [breite],
      rows: [new D.TableRow({ children: [new D.TableCell({ children: kinder, shading: { fill, type: D.ShadingType.CLEAR, color: 'auto' }, margins: { top: 140, bottom: 140, left: 200, right: 200 }, borders: rand, width: { size: breite, type: D.WidthType.DXA } })] })]
    });
    const abstand = () => new D.Paragraph({ children: [], spacing: { after: 60 } });

    const out = [];
    out.push(para(d.unter.toUpperCase(), { color: '5D6B62', size: 18, bold: true, after: 40 }));
    out.push(new D.Paragraph({ heading: D.HeadingLevel.TITLE, children: [new D.TextRun({ text: d.titel, bold: true, size: 36, color: DUNKEL })], spacing: { after: 200 } }));
    for (const x of d.bloecke) {
      switch (x.t) {
        case 'h2': out.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, children: [new D.TextRun({ text: x.x, bold: true, size: 28, color: DUNKEL })], spacing: { before: 300, after: 100 }, keepNext: true })); break;
        case 'h3': out.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_2, children: run(x.x, { bold: true, size: 24, color: '16241C' }), spacing: { before: 200, after: 80 }, keepNext: true })); break;
        case 'p': out.push(para(x.x)); break;
        case 'ul': x.l.forEach(i => out.push(new D.Paragraph({ children: run(i), bullet: { level: 0 }, spacing: { after: 60, line: 290 } }))); out.push(abstand()); break;
        case 'ol': {
          const ref = 'nr-' + out.length;
          nummern.push(ref);
          x.l.forEach(i => out.push(new D.Paragraph({ children: run(i), numbering: { reference: ref, level: 0 }, spacing: { after: 60, line: 290 } })));
          out.push(abstand()); break;
        }
        case 'table': {
          const w = x.breiten || x.kopf.map(() => 100 / x.kopf.length);
          const cw = w.map(p => Math.round(breite * p / 100));
          const zelle = (t, i, kopf) => new D.TableCell({
            children: [new D.Paragraph({ children: run(t, { bold: kopf, color: kopf ? DUNKEL : undefined, size: 20 }), spacing: { after: 0, line: 270 } })],
            width: { size: cw[i], type: D.WidthType.DXA }, margins: { top: 70, bottom: 70, left: 100, right: 100 },
            shading: kopf ? { fill: HELL, type: D.ShadingType.CLEAR, color: 'auto' } : undefined,
            borders: { ...rand, bottom: { style: D.BorderStyle.SINGLE, size: kopf ? 12 : 4, color: kopf ? A : 'DCE6DF' } }
          });
          out.push(new D.Table({ width: { size: breite, type: D.WidthType.DXA }, columnWidths: cw, rows: [
            new D.TableRow({ tableHeader: true, children: x.kopf.map((k, i) => zelle(k, i, true)) }),
            ...x.zeilen.map(r => new D.TableRow({ cantSplit: true, children: r.map((c, i) => zelle(c, i, false)) }))
          ] }), abstand());
          break;
        }
        case 'box': out.push(kasten([para(x.titel, { bold: true, color: x.art === 'warn' ? 'A8690F' : DUNKEL, after: 60 }), para(x.x, { after: 0 })], x.art === 'warn' ? 'F8ECD7' : HELL), abstand()); break;
        case 'code': out.push(kasten([...(x.titel ? [para(x.titel, { bold: true, size: 18, color: '5D6B62', after: 40 })] : []), ...x.x.split('\n').map((z, i, a) => para(z || ' ', { after: i === a.length - 1 ? 0 : 40 }))], 'EEF3EF'), abstand()); break;
        case 'kv': out.push(new D.Table({ width: { size: breite, type: D.WidthType.DXA }, columnWidths: [2700, breite - 2700], rows: x.l.map(([k, v]) => new D.TableRow({ cantSplit: true, children: [
          new D.TableCell({ children: [para(k, { bold: true, color: DUNKEL, after: 0 })], width: { size: 2700, type: D.WidthType.DXA }, borders: { ...rand, bottom: { style: D.BorderStyle.SINGLE, size: 4, color: 'DCE6DF' } }, margins: { top: 70, bottom: 70, left: 0, right: 120 } }),
          new D.TableCell({ children: [para(v, { after: 0 })], width: { size: breite - 2700, type: D.WidthType.DXA }, borders: { ...rand, bottom: { style: D.BorderStyle.SINGLE, size: 4, color: 'DCE6DF' } }, margins: { top: 70, bottom: 70, left: 0, right: 0 } })
        ] })) }), abstand()); break;
        case 'linie': out.push(new D.Paragraph({ children: run(x.x.trim() ? x.x : ' ', { color: '5D6B62', bold: true }), border: x.x.trim() ? { top: { style: D.BorderStyle.SINGLE, size: 4, color: 'DCE6DF', space: 6 } } : { bottom: { style: D.BorderStyle.SINGLE, size: 4, color: 'DCE6DF', space: 40 } }, spacing: { before: x.x.trim() ? 200 : 600, after: 120 } })); break;
      }
    }
    return new D.Document({
      creator: C.team || 'KI-Tag-Generator', title: d.titel,
      styles: { default: { document: { run: { font: 'Calibri', size: 22, color: '16241C' } } } },
      numbering: { config: nummern.splice(0).map(ref => ({ reference: ref, levels: [{ level: 0, format: D.LevelFormat.DECIMAL, text: '%1.', alignment: D.AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } } } }] })) },
      sections: [{
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1300, left: 1418, right: 1418 } } },
        headers: { default: new D.Header({ children: [para(`KI-Tag · ${C.kopf}`, { size: 16, color: '5D6B62', after: 0, align: D.AlignmentType.RIGHT })] }) },
        footers: { default: new D.Footer({ children: [new D.Paragraph({ alignment: D.AlignmentType.RIGHT, children: [new D.TextRun({ text: d.unter + ' · Seite ', size: 16, color: '5D6B62' }), new D.TextRun({ children: [D.PageNumber.CURRENT], size: 16, color: '5D6B62' })] })] }) },
        children: out
      }]
    });
  }
  const nummern = [];
  function mix(hex, ziel, t) { const n = parseInt(hex, 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => Math.round(v * t + ziel * (1 - t))); return c.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase(); }
  const dunkler = (h, t) => mix(h, 0, t);
  const heller = (h, t) => mix(h, 255, 1 - t);

  async function docxBlob(d, C) { return window.docx.Packer.toBlob(docx(d, C)); }

  return { docBody, css, copyJS, website, docxBlob, esc };
})();
