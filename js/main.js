/* ALX Group · Gruppen Website
   Inhalte kommen aus js/daten.js (GRUPPE), die Karte aus js/karte-daten.js, das Sortiment aus js/sortiment.js.
   GSAP 3.13 mit ScrollTrigger und Lenis liegen lokal in vendor/. Lenis nur mit Maus, Touch scrollt nativ.
   Bei "Bewegung reduzieren" bleibt alles statisch lesbar, Videos zeigen nur ihr Standbild. */
(function () {
  'use strict';

  const G = window.GRUPPE;
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const maus = matchMedia('(pointer: fine)').matches;
  const sparen = !!(navigator.connection && navigator.connection.saveData);
  const klein = () => innerWidth < 760;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const marke = id => G.marken.find(m => m.id === id);

  /* ---------- Sprache ---------- */
  const SPRACHEN = ['de', 'en'];
  let lang = 'de';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    lang = SPRACHEN.includes(q) ? q : (localStorage.getItem('alx-lang') || 'de');
  } catch (e) { /* ohne Speicher bleibt Deutsch */ }
  if (!SPRACHEN.includes(lang)) lang = 'de';
  const t = key => (G.texte[lang] && G.texte[lang][key]) || G.texte.de[key] || '';
  const tt = obj => (obj && (obj[lang] || obj.de)) || '';

  function spracheAnwenden() {
    document.documentElement.lang = lang;
    if (lang !== 'de') {
      $$('[data-i18n]').forEach(el => { const v = G.texte[lang][el.dataset.i18n]; if (v) el.innerHTML = v; });
      $$('[data-i18n-a]').forEach(el => {
        const [attr, key] = el.dataset.i18nA.split(':');
        const v = G.texte[lang][key]; if (v) el.setAttribute(attr, v);
      });
    }
    document.title = t('meta.titel');
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $$('[data-lang]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.lang === lang) return;
      try { localStorage.setItem('alx-lang', b.dataset.lang); sessionStorage.setItem('alx-y', String(scrollY)); } catch (e) { /* egal */ }
      const url = new URL(location.href);
      url.searchParams.set('lang', b.dataset.lang);
      location.replace(url.toString());
    }));
  }

  /* ---------- Name der Gruppe ---------- */
  function name() {
    $$('[data-name-kurz]').forEach(el => { el.textContent = G.kurz; });
    $$('[data-name-zusatz]').forEach(el => { el.textContent = G.zusatz; });
    $$('[data-name]').forEach(el => { el.textContent = G.name; });
    $('[data-hero-text]').textContent = G.kurz;
    $('[data-footer-wort]').textContent = G.kurz;
    $('[data-jahr]').textContent = new Date().getFullYear();
  }

  /* ---------- Videos: Quelle je Bildschirm, spielen nur im Bild ---------- */
  const videoBeobachter = 'IntersectionObserver' in window ? new IntersectionObserver(eintraege => {
    eintraege.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src) { v.src = klein() && v.dataset.srcSm ? v.dataset.srcSm : v.dataset.src; }
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      } else if (!v.paused) v.pause();
    });
  }, { rootMargin: '25% 0px' }) : null;
  function videoAn(v) {
    if (ruhig || sparen || !videoBeobachter) return; // nur Standbild
    v.muted = true;
    v.addEventListener('playing', () => v.classList.add('da'), { once: true });
    videoBeobachter.observe(v);
  }

  /* ---------- Rendern aus daten.js ---------- */
  const zahlFormat = (n) => new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-GB').format(n);

  function zahlen() {
    $('[data-zahlen]').innerHTML = G.zahlen.map(z =>
      `<li><span class="zahl"><span data-zahl="${z.n}">${zahlFormat(z.n)}</span>${z.plus ? `<sup>${z.plus}</sup>` : ''}</span><span class="zahl-text mono">${tt(z)}</span></li>`
    ).join('');
  }

  function marken() {
    const n = G.marken.length;
    $('[data-marken]').innerHTML = G.marken.map((m, i) => `
      <article class="marke" data-id="${m.id}" style="--c:${m.farbe}" data-cursor="${t('marke.cursor')}">
        <div class="marke-media">
          <video muted playsinline loop preload="none" poster="assets/video/${m.video}-poster.webp"
                 data-src="assets/video/${m.video}.mp4" data-src-sm="assets/video/${m.video}-sm.mp4" aria-hidden="true"></video>
        </div>
        <div class="marke-inner">
          <header class="marke-top mono"><span><b>${String(i + 1).padStart(2, '0')}</b> / ${String(n).padStart(2, '0')}</span><span>${tt(m.kategorie)}</span><span>${m.bezirk}</span></header>
          <div class="marke-mitte">
            <a class="marke-logo" href="${m.url}" target="_blank" rel="noopener" aria-label="${m.name}, ${t('marke.besuchen')}">
              <img src="${m.logo}" width="${m.logoBreite}" height="${m.logoHoehe}" alt="${m.name}" loading="lazy" decoding="async">
            </a>
          </div>
          <div class="marke-unten">
            <p class="marke-text">${tt(m.text)}<small class="mono">${m.adresse}</small></p>
            <ul class="marke-fakten">${m.fakten.map(f => `<li><b>${f.zahl}</b><span>${tt(f)}</span></li>`).join('')}</ul>
            <a class="btn-xl" href="${m.url}" target="_blank" rel="noopener">${t('marke.besuchen')} <i aria-hidden="true">↗</i></a>
          </div>
        </div>
        <div class="marke-dunkel"></div>
      </article>`).join('');
    $$('.marke video').forEach(videoAn);

    const band = G.marken.map((m, i) => `<span class="${i === 0 ? 'voll' : ''}">${m.name}</span><i>✦</i>`).join('');
    $('[data-laufband]').innerHTML = band + band + band;
  }

  function sortiment() {
    const liste = window.SORTIMENT || [];
    const reihe = (teil, i) => {
      const html = teil.map(([datei, id]) => {
        const m = marke(id);
        return `<figure class="produkt" style="--c:${m.farbe}"><img src="assets/frei/${datei}" alt="" loading="lazy" decoding="async"><span class="mono">${m.name}</span></figure>`;
      }).join('');
      return `<div class="reihe" data-reihe="${i}">${html}${html}</div>`;
    };
    const halb = Math.ceil(liste.length / 2);
    $('[data-sortiment]').innerHTML = reihe(liste.slice(0, halb), 0) + reihe(liste.slice(halb), 1);
  }

  /* Live Status nach Berliner Zeit */
  function berlinJetzt() {
    const teile = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const w = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[teile.find(p => p.type === 'weekday').value];
    const h = +teile.find(p => p.type === 'hour').value, min = +teile.find(p => p.type === 'minute').value;
    return { tag: w, minute: h * 60 + min };
  }
  const minuten = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  function status(ort) {
    if (ort.bald) return { klasse: 'bald', text: t('standorte.bald') };
    if (!ort.zeiten) return { klasse: '', text: t('standorte.zeitenWebsite') };
    const { tag, minute } = berlinJetzt();
    const heute = ort.zeiten[tag];
    if (heute && minute >= minuten(heute[0]) && minute < minuten(heute[1])) {
      return { klasse: 'offen', text: `${t('standorte.offen')} · ${t('standorte.schliesst')} ${heute[1]}` };
    }
    if (heute && minute < minuten(heute[0])) return { klasse: 'zu', text: `${t('standorte.zu')} · ${t('standorte.oeffnet')} ${heute[0]}` };
    const morgen = ort.zeiten[(tag + 1) % 7];
    return { klasse: 'zu', text: `${t('standorte.zu')}${morgen ? ` · ${t('standorte.oeffnet')} ${t('standorte.morgen')} ${morgen[0]}` : ''}` };
  }

  function standorte() {
    const K = window.BERLIN_KARTE;
    const [, , W, H] = K.viewBox;
    const proj = (lon, lat) => [(lon - K.proj.lonMin) * K.proj.kx * K.proj.k, (K.proj.latMax - lat) * K.proj.k];
    const farbeBezirk = {};
    G.standorte.forEach(o => { if (!farbeBezirk[o.bezirkKarte]) farbeBezirk[o.bezirkKarte] = marke(o.marke).farbe; });

    let raster = '';
    for (let x = 100; x < W; x += 100) raster += `<line class="karte-raster" x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
    for (let y = 100; y < H; y += 100) raster += `<line class="karte-raster" x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
    const svg = `<svg viewBox="${K.viewBox.join(' ')}" aria-hidden="true">${raster}${K.bezirke.map(b =>
      `<path class="bezirk${farbeBezirk[b.name] ? ' aktiv' : ''}" data-bezirk="${b.name}" ${farbeBezirk[b.name] ? `style="--c:${farbeBezirk[b.name]}"` : ''} d="${b.d}"/>`).join('')}</svg>`;
    const pins = G.standorte.map((o, i) => {
      const [x, y] = proj(o.lon, o.lat);
      const m = marke(o.marke);
      return `<div class="pin${o.bald ? ' pin--bald' : ''}${o.seite === 'links' ? ' pin--links' : ''}" data-ort="${i}" style="left:${(x / W * 100).toFixed(2)}%;top:${(y / H * 100).toFixed(2)}%;--c:${m.farbe}">
        <span class="pin-punkt"></span><span class="pin-text mono">${o.bezirk}<small> · ${o.bald ? t('standorte.bald') : m.name}</small></span></div>`;
    }).join('');
    $('[data-karte]').innerHTML = svg + pins;

    $('[data-orte]').innerHTML = G.standorte.map((o, i) => {
      const m = marke(o.marke);
      const route = o.adresse ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.name + ' ' + o.adresse)}` : '';
      return `<li class="ort" data-ort="${i}" style="--c:${m.farbe}">
        <span class="ort-nr mono">${String(i + 1).padStart(2, '0')}</span>
        <span class="ort-name">${m.name}</span>
        <span class="ort-bezirk mono">${o.bezirk}</span>
        <span class="ort-adresse">${o.adresse || t('standorte.adresseFolgt')}</span>
        <span class="ort-status mono" data-status="${i}"></span>
        ${route ? `<a class="ort-route mono" href="${route}" target="_blank" rel="noopener">${t('standorte.route')} ↗</a>` : ''}
      </li>`;
    }).join('');
    const statusSetzen = () => G.standorte.forEach((o, i) => {
      const el = $(`[data-status="${i}"]`); const s = status(o);
      el.className = `ort-status mono ${s.klasse}`; el.textContent = s.text;
    });
    statusSetzen(); setInterval(statusSetzen, 60000);

    // Liste und Karte heben sich gegenseitig hervor
    const hell = (i, an) => {
      const o = G.standorte[i];
      $$(`[data-ort="${i}"]`).forEach(el => el.classList.toggle('hell', an));
      const b = $(`[data-bezirk="${o.bezirkKarte}"]`); if (b) b.classList.toggle('hell', an);
    };
    $$('[data-ort]').forEach(el => {
      const i = +el.dataset.ort;
      el.addEventListener('mouseenter', () => hell(i, true));
      el.addEventListener('mouseleave', () => hell(i, false));
    });
  }

  function kontakt() {
    if (G.kontakt.email) {
      const box = $('[data-kontakt-mail]');
      box.hidden = false;
      box.innerHTML = `<a href="mailto:${G.kontakt.email}">${G.kontakt.email} <span aria-hidden="true">↗</span></a>`;
    }
    $('[data-kontakt-marken]').innerHTML = G.marken.map(m => `
      <li style="--c:${m.farbe}"><strong>${m.name}</strong><span class="kontakt-links">
        <a href="${m.url}" target="_blank" rel="noopener">${t('kontakt.website')} ↗</a>
        ${m.instagram ? `<a href="${m.instagram}" target="_blank" rel="noopener">Instagram ↗</a>` : ''}
      </span></li>`).join('');
  }

  function statementPills() {
    const bild = { meat: 'assets/video/meat-poster.webp', wac: 'assets/img/wac-latte.webp', h25: 'assets/img/h25-front.webp' };
    $$('[data-pill]').forEach(p => { p.style.backgroundImage = `url(${bild[p.dataset.pill]})`; p.setAttribute('aria-hidden', 'true'); });
  }

  /* ---------- Modal (Impressum, Datenschutz) ---------- */
  function modal() {
    const box = $('[data-modal-box]'), inhalt = $('[data-modal-inhalt]');
    $$('[data-modal]').forEach(b => b.addEventListener('click', () => {
      const art = b.dataset.modal;
      inhalt.innerHTML = art === 'impressum'
        ? `<h2>${t('modal.impressum')}</h2><p>${G.name}</p><p>${t('modal.folgt')}</p>`
        : `<h2>${t('modal.datenschutz')}</h2><p>${t('modal.ds')}</p><p>${t('modal.folgt')}</p>`;
      if (box.showModal) box.showModal(); else box.setAttribute('open', '');
    }));
    box.addEventListener('click', e => { if (e.target === box) box.close(); });
  }

  /* ---------- Navigation ---------- */
  let lenis = null;
  function navigation() {
    const nav = $('[data-nav]'), burger = $('.burger'), menu = $('#mobilmenu');
    const fest = () => nav.classList.toggle('nav--fest', scrollY > innerHeight * .6);
    fest(); addEventListener('scroll', fest, { passive: true });
    const zu = () => { burger.setAttribute('aria-expanded', 'false'); menu.hidden = true; document.body.style.overflow = ''; if (lenis) lenis.start(); };
    burger.addEventListener('click', () => {
      const auf = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(auf)); menu.hidden = !auf;
      document.body.style.overflow = auf ? 'hidden' : ''; if (lenis) auf ? lenis.stop() : lenis.start();
    });
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const ziel = a.getAttribute('href') === '#top' ? document.body : $(a.getAttribute('href'));
      if (!ziel) return;
      e.preventDefault(); zu();
      if (lenis) lenis.scrollTo(ziel === document.body ? 0 : ziel, { offset: 0, duration: 1.6 });
      else (ziel === document.body ? scrollTo({ top: 0, behavior: ruhig ? 'auto' : 'smooth' }) : ziel.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth' }));
    }));
    // aktiver Menüpunkt
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('aktiv', a.getAttribute('href') === '#' + e.target.id));
      }), { rootMargin: '-45% 0px -50% 0px' });
      ['gruppe', 'marken', 'standorte', 'wachstum', 'kontakt'].forEach(id => io.observe($('#' + id)));
    }
  }

  /* ---------- Hero: Buchstaben als Fenster, Kamera fliegt hindurch ---------- */
  const hero = { W: 0, H: 0, px: 0, py: 0, sMax: 30, q: 0 };

  function heroAufbauen() {
    const svg = $('.hero-maske'), text = $('[data-hero-text]');
    const W = innerWidth, H = $('.hero-pin').clientHeight;
    if (!W || !H) return; // Fenster noch ohne Größe (Tab im Hintergrund), resize baut nach
    hero.W = W; hero.H = H;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    // Schrift so groß, dass das Wort fast die ganze Breite füllt
    text.setAttribute('font-size', 100); text.setAttribute('x', W / 2); text.setAttribute('y', 0);
    const breite = text.getComputedTextLength() || 1;
    const ziel = W * (W < 700 ? .98 : .9);
    let fs = 100 * ziel / breite;
    fs = Math.min(fs, H * .82); // nicht höher als der Bildschirm
    text.setAttribute('font-size', fs.toFixed(1));
    const box = text.getBBox();
    const y = H / 2 - (box.y + box.height / 2) + (W < 700 ? -H * .02 : H * .03);
    text.setAttribute('y', y.toFixed(1));
    hero.fs = fs; hero.y = y;
    zoomPunkt(text, fs, y);
    zoomSetzen(hero.q);
  }

  // Dickste Stelle der Buchstaben finden (größter Abstand zum Rand), dort fliegt die Kamera durch
  function zoomPunkt(text, fs, y) {
    const W = hero.W, H = hero.H;
    const f = Math.min(1, 900 / W); // klein rechnen reicht
    const c = document.createElement('canvas');
    c.width = Math.ceil(W * f); c.height = Math.ceil(H * f);
    const ctx = c.getContext('2d');
    ctx.scale(f, f);
    ctx.font = `800 ${fs}px "Funnel Display"`;
    ctx.textBaseline = 'alphabetic';
    const zeichen = text.textContent;
    for (let i = 0; i < zeichen.length; i++) {
      let x;
      try { x = text.getStartPositionOfChar(i).x; } catch (e) { x = W / 2; }
      ctx.fillText(zeichen[i], x, y);
    }
    const w = c.width, h = c.height, d = ctx.getImageData(0, 0, w, h).data;
    const voll = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) voll[i] = d[i * 4 + 3] > 128 ? 1 : 0;
    const L = new Uint16Array(w * h), R = new Uint16Array(w * h), U = new Uint16Array(w * h), D = new Uint16Array(w * h);
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) { const i = yy * w + xx; L[i] = voll[i] ? (xx ? L[i - 1] : 0) + 1 : 0; }
      for (let xx = w - 1; xx >= 0; xx--) { const i = yy * w + xx; R[i] = voll[i] ? (xx < w - 1 ? R[i + 1] : 0) + 1 : 0; }
    }
    for (let xx = 0; xx < w; xx++) {
      for (let yy = 0; yy < h; yy++) { const i = yy * w + xx; U[i] = voll[i] ? (yy ? U[i - w] : 0) + 1 : 0; }
      for (let yy = h - 1; yy >= 0; yy--) { const i = yy * w + xx; D[i] = voll[i] ? (yy < h - 1 ? D[i + w] : 0) + 1 : 0; }
    }
    let best = 0, bi = -1;
    for (let i = 0; i < w * h; i++) {
      if (!voll[i]) continue;
      const r = Math.min(L[i], R[i], U[i], D[i]);
      // bei Gleichstand lieber nah an der Bildmitte
      if (r > best || (r === best && bi >= 0 && Math.abs((i % w) - w / 2) < Math.abs((bi % w) - w / 2))) { best = r; bi = i; }
    }
    if (bi < 0) { hero.px = W / 2; hero.py = H / 2; hero.sMax = 30; return; }
    hero.px = (bi % w) / f; hero.py = Math.floor(bi / w) / f;
    const radius = Math.max(4, best / f);
    const weit = Math.max(Math.hypot(hero.px, hero.py), Math.hypot(W - hero.px, hero.py), Math.hypot(hero.px, H - hero.py), Math.hypot(W - hero.px, H - hero.py));
    hero.sMax = Math.min(400, weit / radius * 1.25);
  }

  function zoomSetzen(q) {
    hero.q = q;
    const s = Math.pow(hero.sMax, q);
    const vw = hero.W / s, vh = hero.H / s, vx = hero.px - hero.px / s, vy = hero.py - hero.py / s;
    $('.hero-maske').setAttribute('viewBox', `${vx.toFixed(3)} ${vy.toFixed(3)} ${vw.toFixed(3)} ${vh.toFixed(3)}`);
    // Maske und Flächen nur so groß wie der sichtbare Ausschnitt, sonst rechnet Safari die Maske grob und unscharf
    const r = { x: (vx - vw * .02).toFixed(3), y: (vy - vh * .02).toFixed(3), width: (vw * 1.04).toFixed(3), height: (vh * 1.04).toFixed(3) };
    hero.flaechen = hero.flaechen || $$('#heroMaske, #heroMaske rect, .hero-flaeche');
    hero.flaechen.forEach(el => { for (const k in r) el.setAttribute(k, r[k]); });
  }

  function heroReel() {
    const v = $('.hero-video');
    const name = $('[data-reel-name]'), idx = $('[data-reel-index]'), pin = $('.hero-pin');
    let aktuell = -1;
    const setzen = i => {
      if (i === aktuell) return; aktuell = i;
      const m = marke(G.reel[i].marke);
      name.textContent = m.name;
      idx.textContent = `${String(i + 1).padStart(2, '0')} / ${String(G.reel.length).padStart(2, '0')}`;
      pin.style.setProperty('--reel-c', m.farbe);
    };
    setzen(0);
    v.addEventListener('timeupdate', () => {
      const i = G.reel.findIndex(r => v.currentTime >= r.von && v.currentTime < r.bis);
      if (i >= 0) setzen(i);
    });
    if (ruhig || sparen) { v.classList.add('da'); return; }
    v.src = klein() ? v.dataset.srcSm : v.dataset.src;
    v.addEventListener('playing', () => v.classList.add('da'), { once: true });
    const p = v.play(); if (p && p.catch) p.catch(() => v.classList.add('da'));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { if (e.isIntersecting) { const q = v.play(); if (q && q.catch) q.catch(() => {}); } else v.pause(); }).observe(pin);
    }
  }

  /* ---------- Footer Wort auf volle Breite ---------- */
  function footerWort() {
    const svg = $('.footer-wort'), text = $('[data-footer-wort]');
    text.setAttribute('font-size', 400); text.setAttribute('x', 0); text.setAttribute('y', 0);
    const b = text.getBBox();
    svg.setAttribute('viewBox', `${b.x.toFixed(1)} ${(b.y + b.height * .1).toFixed(1)} ${b.width.toFixed(1)} ${(b.height * .74).toFixed(1)}`);
  }

  /* ---------- Bewegung ---------- */
  function bewegung() {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (maus && window.Lenis) {
      lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Hero: Intro, dann Flug durch die Buchstaben
    const text = $('[data-hero-text]');
    gsap.from(text, { yPercent: 18, opacity: 0, duration: 1.6, ease: 'expo.out', delay: .1 });
    gsap.from('.hero-oben > *, .hero-unten > *', { y: 24, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .08, delay: .5 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: () => '+=' + innerHeight * 1.7, pin: '.hero-pin', scrub: true, anticipatePin: 1, invalidateOnRefresh: true }
    });
    const flug = { q: 0 };
    tl.to('.hero-oben, .hero-unten', { opacity: 0, y: -30, duration: .22, ease: 'none' }, 0)
      .to(flug, { q: 1, duration: .78, ease: 'power2.in', onUpdate: () => zoomSetzen(flug.q) }, 0)
      .to('.hero-maske', { opacity: 0, duration: .1, ease: 'none' }, .7)
      .to('.hero-schatten', { opacity: 1, duration: .16, ease: 'none' }, .76)
      .to('.hero-ende', { autoAlpha: 1, duration: .16, ease: 'none' }, .8)
      .from('.hero-titel', { y: 60, duration: .2, ease: 'power2.out' }, .8)
      .to({}, { duration: .1 });

    // Statement: Wort für Wort
    const st = $('[data-woerter]');
    const knoten = [...st.childNodes];
    st.innerHTML = '';
    knoten.forEach(n => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(teil => {
          if (!teil) return;
          if (/^\s+$/.test(teil)) st.appendChild(document.createTextNode(teil));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = teil; st.appendChild(s); }
        });
      } else { if (n.classList) n.classList.add('w'); st.appendChild(n); }
    });
    gsap.fromTo($$('.w', st), { opacity: .14 }, {
      opacity: 1, stagger: .05, ease: 'none',
      scrollTrigger: { trigger: st, start: 'top 82%', end: 'bottom 55%', scrub: true }
    });
    gsap.from($$('.pill', st), { width: 0, marginLeft: 0, marginRight: 0, duration: 1.2, ease: 'expo.out', stagger: .15, scrollTrigger: { trigger: st, start: 'top 70%', once: true } });

    // Titel steigen auf
    $$('.titel, .kopf-text, .label').forEach(el => {
      gsap.from(el, { y: 50, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    // Zahlen zählen hoch
    $$('[data-zahl]').forEach(el => {
      const ziel = +el.dataset.zahl, o = { n: 0 };
      el.textContent = zahlFormat(0);
      gsap.to(o, {
        n: ziel, duration: ziel > 50 ? 2.2 : 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => { el.textContent = zahlFormat(Math.round(o.n)); }
      });
    });
    gsap.from('.zahlen-grid li', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '.zahlen-grid', start: 'top 80%', once: true } });

    // Laufband der Markennamen
    gsap.fromTo('[data-laufband]', { xPercent: 0 }, { xPercent: -33.333, ease: 'none', scrollTrigger: { trigger: '.marken', start: 'top bottom', end: 'bottom top', scrub: .6 } });

    // Marken Stapel: die vorige Karte tritt zurück, wenn die nächste darüber fährt
    const karten = $$('.marke');
    karten.forEach((k, i) => {
      gsap.fromTo($('.marke-logo', k), { y: 60, scale: .94 }, { y: -20, scale: 1, ease: 'none', scrollTrigger: { trigger: k, start: 'top bottom', end: 'top top', scrub: true } });
      const naechste = karten[i + 1];
      if (!naechste) return;
      gsap.to(k, { scale: .9, ease: 'none', scrollTrigger: { trigger: naechste, start: 'top bottom', end: 'top top', scrub: true } });
      gsap.to($('.marke-dunkel', k), { opacity: .7, ease: 'none', scrollTrigger: { trigger: naechste, start: 'top bottom', end: 'top top', scrub: true } });
    });

    // Sortiment: zwei Reihen laufen gegeneinander, Scrolltempo schiebt mit
    const reihen = $$('[data-reihe]').map((el, i) => ({ el, x: 0, richtung: i % 2 ? 1 : -1, breite: 0 }));
    const messen = () => reihen.forEach(r => { r.breite = r.el.scrollWidth / 2; });
    messen(); addEventListener('resize', messen);
    let schub = 0;
    ScrollTrigger.create({ trigger: '.sortiment', start: 'top bottom', end: 'bottom top', onUpdate: self => { schub = Math.min(12, Math.abs(self.getVelocity()) / 220); } });
    gsap.ticker.add((_, dt) => {
      schub *= .94;
      reihen.forEach(r => {
        if (!r.breite) return;
        r.x += r.richtung * (0.045 * dt) * (1 + schub);
        if (r.x <= -r.breite) r.x += r.breite;
        if (r.x > 0) r.x -= r.breite;
        r.el.style.transform = `translate3d(${r.x.toFixed(2)}px,0,0)`;
      });
    });

    // Karte: Bezirke und Punkte erscheinen
    gsap.from('.karte .bezirk', { opacity: 0, scale: .96, transformOrigin: '50% 50%', duration: 1.2, ease: 'expo.out', stagger: .04, scrollTrigger: { trigger: '.karte', start: 'top 80%', once: true } });
    gsap.from('.pin > *', { opacity: 0, y: 20, duration: 1, ease: 'expo.out', stagger: .12, delay: .5, scrollTrigger: { trigger: '.karte', start: 'top 80%', once: true } });
    gsap.from('.ort', { x: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '.orte', start: 'top 85%', once: true } });

    // Prinzipien und Wachstum
    gsap.from('.prinzipien-liste li', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.prinzipien-liste', start: 'top 85%', once: true } });
    gsap.from('.wachstum-grid li', { y: 70, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.wachstum-grid', start: 'top 85%', once: true } });
    gsap.from('.kontakt-marken li', { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '.kontakt-marken', start: 'top 90%', once: true } });

    // Footer Wort fährt hoch
    gsap.from('.footer-wort', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    // Bild folgt der Maus bei den Prinzipien
    if (maus) {
      const bild = $('[data-prinzip-bild]');
      const bx = gsap.quickTo(bild, 'x', { duration: .6, ease: 'power3' }), by = gsap.quickTo(bild, 'y', { duration: .6, ease: 'power3' });
      $$('.prinzipien-liste li').forEach(li => {
        li.addEventListener('mouseenter', () => { bild.src = li.dataset.bild; gsap.to(bild, { opacity: 1, scale: 1, duration: .5, ease: 'expo.out' }); });
        li.addEventListener('mouseleave', () => gsap.to(bild, { opacity: 0, scale: .8, duration: .4, ease: 'power2.out' }));
      });
      addEventListener('mousemove', e => { bx(e.clientX); by(e.clientY); }, { passive: true });
      gsap.set(bild, { xPercent: -50, yPercent: -50 });
    }
  }

  /* ---------- Cursor mit Text über den Marken ---------- */
  function cursor() {
    if (!maus || ruhig || !window.gsap) return;
    const c = $('.cursor'), txt = $('[data-cursor-text]');
    const cx = gsap.quickTo(c, 'x', { duration: .35, ease: 'power3' }), cy = gsap.quickTo(c, 'y', { duration: .35, ease: 'power3' });
    addEventListener('mousemove', e => { cx(e.clientX); cy(e.clientY); }, { passive: true });
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { txt.textContent = el.dataset.cursor; c.classList.add('mit-text'); c.style.setProperty('--c', getComputedStyle(el).getPropertyValue('--c')); });
      el.addEventListener('mouseleave', () => { txt.textContent = ''; c.classList.remove('mit-text'); });
    });
    // über Links und Knöpfen in der Karte normal zeigen
    $$('.marke a').forEach(a => {
      a.addEventListener('mouseenter', () => c.style.opacity = 0);
      a.addEventListener('mouseleave', () => c.style.opacity = 1);
    });
    $$('.marke').forEach(k => k.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      window.open(marke(k.dataset.id).url, '_blank', 'noopener');
    }));
  }

  /* ---------- Start ---------- */
  spracheAnwenden();
  name();
  zahlen();
  marken();
  sortiment();
  standorte();
  kontakt();
  statementPills();
  modal();
  navigation();
  heroReel();

  const fertig = () => {
    heroAufbauen();
    footerWort();
    if (!ruhig && window.gsap && window.ScrollTrigger) bewegung();
    cursor();
    try {
      const y = sessionStorage.getItem('alx-y');
      if (y) { sessionStorage.removeItem('alx-y'); requestAnimationFrame(() => { scrollTo(0, +y); if (window.ScrollTrigger) ScrollTrigger.refresh(); }); }
    } catch (e) { /* egal */ }
    let breite = innerWidth;
    addEventListener('resize', () => {
      clearTimeout(fertig.t);
      fertig.t = setTimeout(() => {
        if (Math.abs(innerWidth - breite) < 2 && klein()) return; // Handy Adressleiste: nichts neu bauen
        breite = innerWidth;
        heroAufbauen(); footerWort();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }, 180);
    });
  };
  const schrift = document.fonts && document.fonts.load ? Promise.all([
    document.fonts.load('800 100px "Funnel Display"'), document.fonts.load('500 100px "Funnel Display"')
  ]) : Promise.resolve();
  Promise.race([schrift, new Promise(r => setTimeout(r, 2500))]).then(fertig);
})();
