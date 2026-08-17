/* YPGT Cybersecurity — Certificate of Completion (shared renderer)
 *
 * ONE function, used in two places so the certificate is pixel-identical everywhere:
 *   - the Showrunner's /certificate page (participant issues + downloads it during the event)
 *   - the portfolio's /verify page (re-renders it from the verified token)
 *
 * buildYpgtCertSvg({ name, date, id, qrHref, sigB64 }) -> SVG markup string
 *   viewBox is 1050 x 743 — SAME as the REAP certificate on purpose, so the verify page's existing
 *   rasterize / PNG / PDF helpers (2100x1486 canvas, [1050,743]pt PDF) work with no changes.
 *
 * Design: YPGT brand on cream parchment (prints well): emerald frame + gold corner ticks, the YP mark,
 * two signature blocks (Ryan James F. Indangan · Greek Legaspi), QR + certificate ID centre-bottom.
 * Fonts are system serif/sans (Georgia / Segoe UI) — webfonts don't survive SVG->canvas rasterising.
 *
 * Plain script (no modules) so it can be <script src>'d by both pages. Exposes window.buildYpgtCertSvg.
 */
(function (root) {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Greek Legaspi's baked signature (transparent PNG, ~3.7KB). Embedded here so BOTH call sites
  // (Showrunner /certificate and the portfolio /verify) render it with no extra wiring.
  var GREEK_SIG_B64 = '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';

  var EM = '#0c6b4e', EM2 = '#169a72', GOLD = '#b8891f', GOLD2 = '#e8b13a', INK = '#12241b', DIM = '#5f7a6e', CREAM = '#fbf7ea', LINE = '#d9c98f';

  // The YP monogram from the poster lockup, recoloured for print.
  var YP_MARK = '<g transform="translate(493,52) scale(1.0)"><rect x="0" y="0" width="64" height="64" rx="16" fill="#0a1f17"/>' +
    '<rect x="0.75" y="0.75" width="62.5" height="62.5" rx="15.25" fill="none" stroke="#34e29b" stroke-opacity="0.5" stroke-width="1.5"/>' +
    '<path d="M11.5 16 L19 29 L19 45" fill="none" stroke="#2fd39a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M26.5 16 L19 29" fill="none" stroke="#2fd39a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M33 45 L33 16 L42 16 A9.5 9.5 0 0 1 42 35 L33 35" fill="none" stroke="#2fd39a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M26.5 15.5 C26.5 9 31.6 4.8 37.6 4.3 C37.1 10.6 33 15 26.5 15.5 Z" fill="#f0c65a"/></g>';

  function buildYpgtCertSvg(o) {
    o = o || {};
    var name = o.name || 'Participant Name', date = o.date || '', id = o.id || '';
    var sig = (typeof o.sigB64 === 'string' && o.sigB64.length > 100)
      ? '<image x="128" y="556" width="176" height="110" xlink:href="data:image/png;base64,' + o.sigB64 + '" href="data:image/png;base64,' + o.sigB64 + '" preserveAspectRatio="xMidYMid meet"/>'
      : '';
    var qr = o.qrHref
      ? '<image x="475" y="560" width="100" height="100" xlink:href="' + o.qrHref + '" href="' + o.qrHref + '" preserveAspectRatio="xMidYMid meet"/>'
      : '<rect x="475" y="560" width="100" height="100" fill="none" stroke="' + LINE + '" stroke-dasharray="4 4"/>';

    return '<svg id="certSvg" viewBox="0 0 1050 743" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" font-family="Segoe UI,Arial,sans-serif" role="img" aria-label="Certificate of Completion">' +
      '<defs><linearGradient id="yg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + GOLD + '"/><stop offset=".5" stop-color="' + GOLD2 + '"/><stop offset="1" stop-color="' + GOLD + '"/></linearGradient>' +
      '<linearGradient id="eg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + EM + '"/><stop offset="1" stop-color="' + EM2 + '"/></linearGradient></defs>' +
      // parchment + frames
      '<rect x="0" y="0" width="1050" height="743" fill="' + CREAM + '"/>' +
      '<rect x="22" y="22" width="1006" height="699" fill="none" stroke="url(#eg)" stroke-width="6"/>' +
      '<rect x="34" y="34" width="982" height="675" fill="none" stroke="url(#yg)" stroke-width="1.5"/>' +
      '<g fill="none" stroke="' + GOLD2 + '" stroke-width="4"><path d="M48 88 L48 48 L88 48"/><path d="M962 48 L1002 48 L1002 88"/><path d="M48 655 L48 695 L88 695"/><path d="M962 695 L1002 695 L1002 655"/></g>' +
      // faint binary texture band behind the title (the talk's opening motif)
      '<text x="525" y="45" text-anchor="middle" font-family="Consolas,Menlo,monospace" font-size="9" letter-spacing="3" fill="' + EM + '" fill-opacity=".16">01000111 01010101 01000001 01010010 01000100 00100000 01010100 01001000 01000101 00100000 01000111 01000001 01010100 01000101</text>' +
      // lockup
      YP_MARK +
      '<text x="525" y="140" text-anchor="middle" font-size="12.5" font-weight="700" letter-spacing="4.5" fill="' + EM + '">YOUNG PRO MINISTRY  ·  FAITH TEMPLE BAPTIST CHURCH</text>' +
      '<text x="525" y="162" text-anchor="middle" font-size="10.5" letter-spacing="3" fill="' + DIM + '">YOUNG PRO GET TOGETHER  ·  22 AUGUST 2026  ·  FTB AUDITORIUM, QUEZON CITY</text>' +
      // title
      '<text x="525" y="228" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-size="46" font-weight="800" fill="' + INK + '">Certificate of Completion</text>' +
      '<line x1="436" y1="252" x2="496" y2="252" stroke="' + GOLD2 + '" stroke-width="1.5"/><path d="M517 245 l8 7 -8 7 -8 -7 z" fill="' + GOLD2 + '"/><line x1="554" y1="252" x2="614" y2="252" stroke="' + GOLD2 + '" stroke-width="1.5"/>' +
      '<text x="525" y="292" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-style="italic" font-size="20" fill="' + DIM + '">This certificate is proudly presented to</text>' +
      // name
      '<text id="cnm" x="525" y="360" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-size="56" font-weight="800" fill="' + EM + '">' + esc(name) + '</text>' +
      '<line id="cnl" x1="305" y1="380" x2="745" y2="380" stroke="' + LINE + '" stroke-width="2"/>' +
      // body
      '<text x="525" y="424" text-anchor="middle" font-size="19" fill="#3c5047"><tspan x="525" dy="0">for successfully completing</tspan></text>' +
      '<text x="525" y="466" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-size="30" font-weight="800" letter-spacing="1" fill="' + INK + '">CYBERSECURITY</text>' +
      '<text x="525" y="494" text-anchor="middle" font-size="17" fill="#3c5047">Digital Safety &amp; Security Essentials — a talk for young professionals on how</text>' +
      '<text x="525" y="518" text-anchor="middle" font-size="17" fill="#3c5047">computers work, password math, real-world scams, and guarding your digital life.</text>' +
      // signatures — left: Ryan (baked signature image), right: Greek
      sig +
      '<image x="746" y="556" width="176" height="88" xlink:href="data:image/png;base64,' + GREEK_SIG_B64 + '" href="data:image/png;base64,' + GREEK_SIG_B64 + '" preserveAspectRatio="xMidYMax meet"/>' +
      '<line x1="106" y1="650" x2="326" y2="650" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<text x="216" y="672" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-size="16" font-weight="800" fill="' + INK + '">Ryan James F. Indangan</text>' +
      '<text x="216" y="690" text-anchor="middle" font-size="11" letter-spacing="2" fill="' + DIM + '">SPEAKER</text>' +
      '<line x1="724" y1="650" x2="944" y2="650" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<text x="834" y="672" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-size="16" font-weight="800" fill="' + INK + '">Greek Legaspi</text>' +
      '<text x="834" y="690" text-anchor="middle" font-size="11" letter-spacing="2" fill="' + DIM + '">SPEAKER</text>' +
      // verify block
      qr +
      '<text x="525" y="676" text-anchor="middle" font-size="9.5" letter-spacing="1.4" fill="' + DIM + '">SCAN OR TAP TO VERIFY</text>' +
      '<text x="525" y="692" text-anchor="middle" font-size="11.5" font-weight="800" fill="' + EM + '">ID  ' + esc(id) + '</text>' +
      // date + footer
      '<text x="525" y="551" text-anchor="middle" font-size="9.5" letter-spacing="1.4" fill="' + DIM + '">ISSUED ' + esc(String(date).toUpperCase()) + '</text>' +
      '<text x="525" y="708" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-style="italic" font-size="9.5" fill="' + GOLD + '">“Above all else, guard your heart, for everything you do flows from it.” — Proverbs 4:23</text>' +
      '</svg>';
  }

  root.buildYpgtCertSvg = buildYpgtCertSvg;
  // Match the verify page's event string EXACTLY (it selects the design from payload.e).
  root.YPGT_CERT_EVENT = 'Cybersecurity: Digital Safety & Security Essentials · Young Pro Get Together';
})(typeof window !== 'undefined' ? window : this);
