/* ==========================================================================
   Go Milku — interaksi halaman (vanilla JS, tanpa dependensi)
   ========================================================================== */
(function () {
  'use strict';

  const D = window.GOMILKU;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /** Escape teks agar aman disisipkan lewat innerHTML. */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  /** Path aset lokal berisi spasi — harus di-encode agar valid sebagai URL. */
  const asset = (p) => encodeURI(p);

  /* -------------------------------- link CTA --------------------------------
     Mode 'affiliate' memakai URL dari D.CTA.affiliate; kalau URL varian itu
     masih kosong, otomatis jatuh balik ke WhatsApp. Jadi aman diisi sebagian.
     -------------------------------------------------------------------- */
  const DEFAULT_CTA_TEXT = 'Halo, saya ingin bertanya tentang SR12 Go Milku.';

  function ctaHref(variantId, text) {
    const cfg = D.CTA;
    if (cfg.mode === 'affiliate') {
      const url = (cfg.affiliate[variantId] || cfg.affiliate.default || '').trim();
      if (url) return url;
    }
    return 'https://wa.me/' + cfg.waNumber +
      '?text=' + encodeURIComponent(text || DEFAULT_CTA_TEXT);
  }

  function wireCta() {
    const off = D.CTA.mode === 'off';

    $$('[data-cta]').forEach((el) => {
      if (off) {
        el.href = '#';
        el.classList.add('is-disabled');
        el.setAttribute('aria-disabled', 'true');
        el.title = 'Link pemesanan segera tersedia';
        el.removeAttribute('target');
        el.removeAttribute('rel');
      } else {
        el.href = ctaHref(el.dataset.ctaVariant, el.dataset.ctaText);
        el.classList.remove('is-disabled');
        el.removeAttribute('aria-disabled');
        el.removeAttribute('title');
        el.target = '_blank';
        el.rel = 'noopener';
      }
    });
  }
  window.wireCta = wireCta;   // dipanggil ulang setelah mengubah D.CTA saat uji coba

  // satu listener di document: menahan klik selama mode 'off'
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-cta]');
    if (el && el.getAttribute('aria-disabled') === 'true') e.preventDefault();
  });

  /* ------------------------------- video ---------------------------------
     Sumber video boleh Google Drive atau YouTube. Keduanya menerima ID
     telanjang maupun URL lengkap yang disalin dari address bar.
     ---------------------------------------------------------------------- */

  /** Ambil FILE_ID dari URL Drive, atau kembalikan apa adanya kalau sudah ID. */
  function driveId(v) {
    const s = String(v || '').trim();
    if (!s) return '';
    const m = s.match(/\/file\/d\/([^/?#]+)/) || s.match(/[?&]id=([^&#]+)/);
    return m ? m[1] : (s.includes('/') ? '' : s);
  }

  /** Ambil ID video dari URL YouTube (watch, youtu.be, shorts, embed). */
  function youtubeId(v) {
    const s = String(v || '').trim();
    if (!s) return '';
    const m = s.match(/(?:youtu\.be\/|\/shorts\/|\/embed\/|[?&]v=)([^/?&#]+)/);
    return m ? m[1] : (s.includes('/') ? '' : s);
  }

  const iframeTag = (src, title) =>
    `<iframe src="${src}" title="${esc(title || 'Video Go Milku')}" frameborder="0"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
             allowfullscreen></iframe>`;

  /**
   * Bangun iframe dari entri video. Drive diprioritaskan bila keduanya diisi.
   * Mengembalikan '' kalau tidak ada sumber online — pemanggil jatuh ke file lokal.
   */
  function embedFor(entry, title) {
    const d = driveId(entry.drive);
    if (d) return iframeTag(`https://drive.google.com/file/d/${encodeURIComponent(d)}/preview`, title);

    // pakai youtube.com biasa, bukan youtube-nocookie.com — domain nocookie
    // lebih ketat dan sering memunculkan error "Playback ID" pada embed
    const y = youtubeId(entry.youtube);
    if (y) {
      const p = `autoplay=1&rel=0&playsinline=1&origin=${encodeURIComponent(location.origin)}`;
      return iframeTag(`https://www.youtube.com/embed/${encodeURIComponent(y)}?${p}`, title);
    }

    return '';
  }

  /** <picture> WebP + fallback untuk aset di assets/img/ (tanpa ekstensi). */
  const picture = (stem, ext, alt, cls, extra) => `
    <picture>
      <source srcset="${asset(stem)}.webp" type="image/webp">
      <img src="${asset(stem)}.${ext}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} ${extra || ''}>
    </picture>`;

  /* -------------------------------- navbar -------------------------------- */
  function initNav() {
    const nav = $('#nav');
    const burger = $('#navBurger');
    const links = $('#navLinks');

    const onScroll = () => {
      nav.classList.toggle('is-stuck', window.scrollY > 40);
      $('#fab').classList.toggle('is-on', window.scrollY > 500);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const closeDrawer = () => {
      links.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Buka menu');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('is-open')) closeDrawer();
    });

    // scrollspy
    const anchors = $$('#navLinks a[href^="#"]:not(.btn)');
    const sections = anchors
      .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          anchors.forEach((a) => {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ----------------------------- varian produk ----------------------------- */
  function renderVariants() {
    $('#variantGrid').innerHTML = D.variants.map((v) => `
      <article class="pcard reveal">
        <div class="pcard__art">
          ${picture(v.image, 'png', 'Kemasan ' + v.full, '', 'loading="lazy"')}
        </div>
        <div class="pcard__body">
          <h3 class="pcard__name">${esc(v.name)}</h3>
          <p class="pcard__tag">${esc(v.tagline)}</p>
          <div class="pcard__stats">
            ${v.highlights.map((h) => `
              <div class="pcard__stat"><b>${esc(h.value)}</b><span>${esc(h.label)}</span></div>
            `).join('')}
          </div>
          <ul class="sizes">${D.sizes.map((s) => `<li class="size">${esc(s)}</li>`).join('')}</ul>
          <p class="pcard__komposisi"><strong>Komposisi:</strong> ${esc(v.komposisi)}</p>
          <p class="pcard__bpom">${esc(v.bpom)}</p>
          <a class="btn btn--primary pcard__cta" data-cta data-cta-variant="${esc(v.id)}"
             data-cta-text="Halo, saya ingin memesan ${esc(v.full)}. Boleh info harga dan ukuran yang tersedia?" href="#">
            Pesan ${esc(v.name)}
          </a>
        </div>
      </article>
    `).join('');
  }

  /* --------------------------- banner & tujuan --------------------------- */
  function renderWholesale() {
    const w = D.wholesale;
    $('#wholesaleBanner').innerHTML = `
      <div class="banner__text">
        <p class="eyebrow eyebrow--gold">${esc(w.eyebrow)}</p>
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.desc)}</p>
      </div>
      <a class="btn btn--gold" data-cta data-cta-text="Halo, saya ingin konsultasi paket grosir / reseller SR12 Go Milku." href="#">
        ${esc(w.cta)} &nbsp;&rarr;
      </a>`;
  }

  function renderGoals() {
    $('#goalsList').innerHTML = D.businessGoals.map((g) => `<li>${esc(g)}</li>`).join('');
  }

  /* ---------------------------- kandungan utama ---------------------------- */
  function renderIngredients() {
    $('#ingredientGrid').innerHTML = D.ingredients.map((ing) => `
      <article class="icard reveal">
        <div class="icard__top">
          <h4 class="icard__name">${esc(ing.name)}</h4>
          <span class="badge">${esc(ing.badge)}</span>
        </div>
        <p class="icard__lead">${esc(ing.lead)}</p>
        <div class="acc">
          ${ing.points.map(([title, body]) => `
            <details>
              <summary>${esc(title)}</summary>
              <div class="acc__body">${esc(body)}</div>
            </details>
          `).join('')}
        </div>
      </article>
    `).join('');
  }

  /* ------------------------------- nilai gizi ------------------------------- */
  function nutriRow(name, value, akg) {
    const hasAkg = typeof akg === 'number';
    const pct = hasAkg ? Math.min(akg, 100) : 0;
    return `
      <div class="nrow">
        <span class="nrow__name">${esc(name)}</span>
        <span class="nrow__val">${value ? esc(value) : ''}${
          hasAkg ? ` <span class="nrow__akg">${akg}% AKG</span>` : ''
        }</span>
        ${hasAkg ? `<span class="nrow__bar"><i style="width:${pct}%"></i></span>` : ''}
      </div>`;
  }

  function renderNutrition(id) {
    const n = D.nutrition[id];
    const v = D.variants.find((x) => x.id === id);

    $('#nutriPanel').innerHTML = `
      <div class="energy">
        <div><b>${esc(n.energi.total)}</b><span>Energi Total</span></div>
        <div><b>${esc(n.energi.lemak)}</b><span>Energi dari Lemak</span></div>
        <div><b>${esc(n.energi.lemakJenuh)}</b><span>Energi Lemak Jenuh</span></div>
      </div>
      <div class="nutri__cols">
        <div>
          <h4>Zat Gizi Makro</h4>
          ${n.makro.map((r) => nutriRow(r.name, r.value, r.akg)).join('')}
        </div>
        <div>
          <h4>Vitamin &amp; Mineral</h4>
          ${n.mikro.map((r) => nutriRow(r.name, '', r.akg)).join('')}
        </div>
      </div>
      <p class="nutri__foot">
        ${esc(v.full)} · ${esc(v.bpom)} — *Persen AKG berdasarkan kebutuhan energi 2.150 kkal.
        Kebutuhan energi Anda mungkin lebih tinggi atau lebih rendah.
      </p>`;
  }

  function initNutriTabs() {
    const tabs = $('#nutriTabs');
    tabs.innerHTML = D.variants.map((v, i) => `
      <button class="tab" type="button" role="tab" data-variant="${esc(v.id)}"
              aria-selected="${i === 0}">${esc(v.name)}</button>
    `).join('');

    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab');
      if (!btn) return;
      $$('.tab', tabs).forEach((t) => t.setAttribute('aria-selected', String(t === btn)));
      renderNutrition(btn.dataset.variant);
    });

    renderNutrition(D.variants[0].id);
  }

  /* ------------------------------ perbandingan ------------------------------ */
  function renderComparison() {
    $('#cmpTable tbody').innerHTML = D.comparison.map(([aspek, kambing, sapi]) => `
      <tr>
        <th scope="row">${esc(aspek)}</th>
        <td>${esc(kambing)}</td>
        <td>${esc(sapi)}</td>
      </tr>
    `).join('');
  }

  /* --------------------------- konsumsi & reaksi --------------------------- */
  function renderServing() {
    $('#stepList').innerHTML = D.servingSteps.map(([t, b]) => `
      <li><b>${esc(t)}</b><span>${esc(b)}</span></li>
    `).join('');

    $('#noteList').innerHTML = D.servingNotes.map((n) => `<li>${esc(n)}</li>`).join('');

    $('#reactionAcc').innerHTML = D.reactions.map(([t, b]) => `
      <details>
        <summary>${esc(t)}</summary>
        <div class="acc__body">${esc(b)}</div>
      </details>
    `).join('');
  }

  /* -------------------------------- proses -------------------------------- */
  function renderProcess() {
    $('#processGrid').innerHTML = D.process.map(([title, body], i) => `
      <article class="pstep reveal">
        <span class="pstep__num">${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(title)}</h3>
        <p>${esc(body)}</p>
      </article>
    `).join('');
  }

  function initProductionVideo() {
    const frame = $('#prodVideoFrame');
    const video = $('#prodVideo');
    const btn = $('#prodPlay');

    btn.addEventListener('click', () => {
      frame.classList.add('is-playing');

      const embed = embedFor(
        { drive: D.productionDrive, youtube: D.productionYoutube },
        'Proses produksi SR12 Go Milku'
      );
      if (embed) {
        video.remove();
        frame.insertAdjacentHTML('afterbegin', embed);
        return;
      }

      if (!video.src) video.src = asset(D.productionVideo);
      video.play().catch(() => {});
    });

    video.addEventListener('error', () => showVideoMissing(frame));
  }

  /** File .mp4 tidak ada (tidak ikut di repo) — beri pesan, jangan layar hitam. */
  function showVideoMissing(host) {
    host.innerHTML = `
      <p class="videomissing">
        Video belum tersedia versi online-nya.<br>
        <span>Isi link Google Drive atau YouTube-nya di <code>assets/js/data.js</code>.</span>
      </p>`;
  }

  /* ----------------------------- tenaga ahli ----------------------------- */
  function renderExperts() {
    $('#expertGrid').innerHTML = D.experts.map((v, i) => `
      <button class="vcard reveal" type="button" data-expert="${i}">
        <span class="vcard__thumb"></span>
        <span class="vcard__body">
          <b>${esc(v.title)}</b>
          <span>${esc(v.desc)}</span>
        </span>
      </button>
    `).join('');

    $('#expertGrid').addEventListener('click', (e) => {
      const card = e.target.closest('[data-expert]');
      if (!card) return;
      const v = D.experts[Number(card.dataset.expert)];
      openLightbox({ type: 'video', entry: v, src: v.src, caption: v.title, portrait: v.portrait }, card);
    });
  }

  /* ------------------------------- testimoni ------------------------------- */
  function renderTestimonials() {
    $('#testiGrid').innerHTML = D.testimonials.map((stem, i) => `
      <button type="button" data-testi="${i}" aria-label="Perbesar testimoni ${i + 1}">
        ${picture(stem, 'jpg', 'Percakapan testimoni pengguna Go Milku ' + (i + 1), '', 'loading="lazy"')}
      </button>
    `).join('');

    $('#testiGrid').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-testi]');
      if (!btn) return;
      openLightbox({ type: 'gallery', index: Number(btn.dataset.testi) }, btn);
    });
  }

  /* -------------------------------- lightbox -------------------------------- */
  const lb = {
    el: null, stage: null, caption: null, prev: null, next: null,
    index: 0, mode: null, opener: null
  };

  function paintGallery() {
    const stem = D.testimonials[lb.index];
    lb.stage.innerHTML = picture(stem, 'jpg', 'Percakapan testimoni pengguna Go Milku ' + (lb.index + 1));
    lb.caption.textContent = `Testimoni ${lb.index + 1} dari ${D.testimonials.length}`;
  }

  function openLightbox(opts, opener) {
    lb.opener = opener || null;
    lb.mode = opts.type;

    if (opts.type === 'gallery') {
      lb.index = opts.index;
      lb.prev.hidden = false;
      lb.next.hidden = false;
      paintGallery();
    } else {
      lb.prev.hidden = true;
      lb.next.hidden = true;

      const embed = embedFor(opts.entry || {}, opts.caption);
      if (embed) {
        lb.stage.innerHTML =
          `<div class="lb__embed${opts.portrait ? ' lb__embed--portrait' : ''}">${embed}</div>`;
      } else {
        lb.stage.innerHTML =
          `<video src="${asset(opts.src)}" controls autoplay playsinline preload="metadata"></video>`;
        $('video', lb.stage).addEventListener('error', () => showVideoMissing(lb.stage));
      }
      lb.caption.textContent = opts.caption || '';
    }

    lb.el.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }

  function closeLightbox() {
    const video = $('video', lb.stage);
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    lb.stage.innerHTML = '';
    lb.el.hidden = true;
    document.body.style.overflow = '';
    if (lb.opener) lb.opener.focus();
  }

  function step(delta) {
    if (lb.mode !== 'gallery') return;
    const n = D.testimonials.length;
    lb.index = (lb.index + delta + n) % n;
    paintGallery();
  }

  function initLightbox() {
    lb.el = $('#lightbox');
    lb.stage = $('#lbStage');
    lb.caption = $('#lbCaption');
    lb.prev = $('#lbPrev');
    lb.next = $('#lbNext');

    $('#lbClose').addEventListener('click', closeLightbox);
    lb.prev.addEventListener('click', () => step(-1));
    lb.next.addEventListener('click', () => step(1));

    lb.el.addEventListener('click', (e) => {
      if (e.target === lb.el || e.target === lb.stage) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lb.el.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'Tab') {
        // jaga fokus tetap di dalam dialog
        const focusable = $$('button, video, iframe, a[href]', lb.el).filter((n) => !n.hidden);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ------------------------------ scroll reveal ------------------------------ */
  function initReveal() {
    const targets = $$('.reveal, .section__head, .subhead, .nutri, .tablewrap, .split, .videoframe, .disclaimer, .goals > *');
    targets.forEach((t) => t.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    targets.forEach((t) => io.observe(t));
  }

  /* --------------------------------- init --------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderVariants();
    renderWholesale();
    renderIngredients();
    initNutriTabs();
    renderComparison();
    renderServing();
    renderProcess();
    renderExperts();
    renderTestimonials();
    renderGoals();

    initNav();
    initProductionVideo();
    initLightbox();
    wireCta();        // setelah render agar tombol dinamis ikut terpasang
    initReveal();

    $('#year').textContent = new Date().getFullYear();
  });
})();
