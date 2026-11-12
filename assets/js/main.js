/* Millwaar: site interactions. No dependencies. */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const catById = Object.fromEntries(MW.categories.map(c => [c.id, c]));
  const icon = (name, attrs = '') =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${attrs}>${MW.icons[name] || ''}</svg>`;
  const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const postUrl = p => `post.html?p=${encodeURIComponent(p.slug)}`;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
  };

  /* ---------- Theme ---------- */
  const themeBtn = $('.theme-toggle');
  themeBtn?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    store.set('mw-theme', next);
  });

  /* ---------- Header ---------- */
  const header = $('.site-header');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = $('.menu-toggle');
  const navLinks = $('.nav__links');
  menuBtn?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Cursor glow ---------- */
  const glow = $('.cursor-glow');
  if (glow && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.opacity = 1;
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Syntax highlighting (KQL / GraphQL, lightweight) ---------- */
  const KW = 'where|summarize|project|extend|order|by|let|join|kind|on|take|mv-expand|in|has_any|has|matches|regex|and|or|not|desc|asc|query|top|count|distinct|union|sort|between|contains';
  const tokenRe = new RegExp(
    String.raw`(\/\/[^\n]*|(?:^|(?<=\n))\s*#[^\n]*)|(@"[^"]*"|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(\d+(?:\.\d+)?[dhms]?)\b|\b(${KW})\b|\b([A-Za-z_][\w]*)(?=\()|(\||==|=~|!in~|in~|!=|>|<)`,
    'g'
  );
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function highlight(code) {
    let out = '', last = 0, m;
    tokenRe.lastIndex = 0;
    while ((m = tokenRe.exec(code))) {
      if (m[0] === '') { tokenRe.lastIndex++; continue; }
      out += esc(code.slice(last, m.index));
      const cls = m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'num' : m[4] ? 'kw' : m[5] ? 'fn' : 'op';
      out += `<span class="tok-${cls}">${esc(m[0])}</span>`;
      last = tokenRe.lastIndex;
    }
    return out + esc(code.slice(last));
  }
  $$('pre code[data-highlight]').forEach(el => { el.innerHTML = highlight(el.textContent); });

  /* ---------- Copy buttons ---------- */
  document.addEventListener('click', async e => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const code = btn.closest('.code-block')?.querySelector('pre')?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(code);
      const label = btn.querySelector('span');
      btn.classList.add('is-copied');
      if (label) label.textContent = 'Copied';
      setTimeout(() => { btn.classList.remove('is-copied'); if (label) label.textContent = 'Copy'; }, 1600);
    } catch { toast('Copy failed: select the text manually'); }
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    let t = $('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast'; t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span></span>`;
    t.querySelector('span').textContent = msg;
    requestAnimationFrame(() => t.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-visible'), 3200);
  }

  /* ---------- Generated post artwork ---------- */
  function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function postArt(post) {
    const cat = catById[post.cat];
    const r = rng(hash(post.slug));
    const id = 'a' + hash(post.slug).toString(36);
    const nodes = Array.from({ length: 9 }, () => [20 + r() * 360, 20 + r() * 185]);
    let edges = '';
    nodes.forEach((n, i) => {
      const j = (i + 1 + Math.floor(r() * 3)) % nodes.length;
      edges += `<line x1="${n[0].toFixed(1)}" y1="${n[1].toFixed(1)}" x2="${nodes[j][0].toFixed(1)}" y2="${nodes[j][1].toFixed(1)}"/>`;
    });
    const dots = nodes.map(n => `<circle cx="${n[0].toFixed(1)}" cy="${n[1].toFixed(1)}" r="${(2 + r() * 3).toFixed(1)}"/>`).join('');
    const angle = Math.floor(r() * 360);
    return `<svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="${id}g" gradientTransform="rotate(${angle} .5 .5)">
          <stop offset="0" stop-color="${cat.accent}" stop-opacity=".55"/>
          <stop offset="1" stop-color="#8b5cf6" stop-opacity=".12"/>
        </linearGradient>
        <pattern id="${id}p" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="${cat.accent}" opacity=".25"/></pattern>
      </defs>
      <rect width="400" height="225" fill="#0b0f1a"/>
      <rect width="400" height="225" fill="url(#${id}g)"/>
      <rect width="400" height="225" fill="url(#${id}p)"/>
      <g stroke="${cat.accent}" stroke-opacity=".45" stroke-width="1">${edges}</g>
      <g fill="${cat.accent}">${dots}</g>
      <g transform="translate(168 80.5)">
        <rect width="64" height="64" rx="16" fill="#0b0f1a" fill-opacity=".75" stroke="${cat.accent}" stroke-opacity=".6"/>
        <g transform="translate(14 14) scale(1.5)" fill="none" stroke="${cat.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${MW.icons[cat.icon]}</g>
      </g>
    </svg>`;
  }

  const levelHtml = (n, label = true) =>
    `<span class="level" title="${['Intro', 'Practitioner', 'Deep dive'][n - 1]}">${[1, 2, 3].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}${label ? `<span style="margin-left:6px">${['Intro', 'Practitioner', 'Deep dive'][n - 1]}</span>` : ''}</span>`;

  function postCard(p, featured = false, delay = 0) {
    const cat = catById[p.cat];
    return `<article class="post-card${featured ? ' post-card--featured' : ''}" style="--accent:${cat.accent};animation-delay:${delay}ms">
      <div class="post-card__art">${postArt(p)}</div>
      <div class="post-card__body">
        <div class="post-card__meta"><span class="tag">${cat.name}</span><time datetime="${p.date}">${fmtDate(p.date)}</time></div>
        <h3><a href="${postUrl(p)}">${p.title}</a></h3>
        <p>${p.excerpt}</p>
        <div class="post-card__foot">${levelHtml(p.level)}<span>${p.read} min read</span></div>
      </div>
    </article>`;
  }

  /* 3D tilt on cards */
  function bindTilt(root) {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    $$('.post-card', root).forEach(card => {
      card.addEventListener('pointermove', e => {
        const b = card.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - .5;
        const y = (e.clientY - b.top) / b.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- HOME PAGE ---------- */

  /* Hero network canvas */
  const canvas = $('.hero__canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, pts, raf, mouse = { x: -999, y: -999 };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 14000));
      pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const light = document.documentElement.dataset.theme === 'light';
      const col = light ? '37,99,235' : '34,211,238';
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120) { p.x += dx / d * .8; p.y += dy / d * .8; }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${col},${(1 - d / 130) * .22})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${col},.55)`;
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    canvas.parentElement.addEventListener('pointermove', e => {
      const b = canvas.getBoundingClientRect(); mouse = { x: e.clientX - b.left, y: e.clientY - b.top };
    });
    canvas.parentElement.addEventListener('pointerleave', () => { mouse = { x: -999, y: -999 }; });
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) draw();
    }).observe(canvas);
  }

  /* Typed rotating words */
  const typed = $('.typed');
  if (typed) {
    const words = JSON.parse(typed.dataset.words);
    if (reduceMotion) typed.textContent = words[0];
    else {
      let wi = 0, ci = 0, del = false;
      const tick = () => {
        const word = words[wi];
        typed.textContent = word.slice(0, ci);
        if (!del && ci === word.length) { del = true; return setTimeout(tick, 1800); }
        if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
        ci += del ? -1 : 1;
        setTimeout(tick, del ? 40 : 85);
      };
      tick();
    }
  }

  /* Hero console */
  const consoleBody = $('.console__body');
  if (consoleBody) {
    let timer;
    const file = $('.console__title'), result = $('.console__result');
    const run = key => {
      clearTimeout(timer);
      const s = MW.consoleSnippets[key];
      file.textContent = s.file;
      result.innerHTML = '<span>Running…</span><span></span>';
      $$('.console__tab').forEach(t => {
        const on = t.dataset.tab === key;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on);
      });
      if (reduceMotion) { consoleBody.innerHTML = highlight(s.code); done(s); return; }
      let i = 0;
      const step = () => {
        i = Math.min(s.code.length, i + 2);
        consoleBody.innerHTML = highlight(s.code.slice(0, i)) + '<span class="caret"></span>';
        if (i < s.code.length) timer = setTimeout(step, 18);
        else timer = setTimeout(() => done(s), 350);
      };
      step();
    };
    const done = s => { result.innerHTML = `<span><strong>●</strong> Completed</span><span>${s.rows}</span>`; };
    $$('.console__tab').forEach(t => t.addEventListener('click', () => run(t.dataset.tab)));
    run('sentinel');
  }

  /* Stack tiles */
  const stackGrid = $('#stack-grid');
  if (stackGrid) {
    stackGrid.innerHTML = MW.categories.map(c => {
      const n = MW.posts.filter(p => p.cat === c.id).length;
      return `<button class="stack-tile${c.wide ? ' stack-tile--wide' : ''} reveal" style="--accent:${c.accent}" data-filter="${c.id}" aria-label="Show ${c.name} articles">
        <span class="stack-tile__count">${String(n).padStart(2, '0')} posts</span>
        <span class="stack-tile__icon">${icon(c.icon)}</span>
        <span><h3>${c.name}</h3><p>${c.blurb}</p></span>
      </button>`;
    }).join('');
    $$('.stack-tile', stackGrid).forEach(t => {
      io.observe(t);
      t.addEventListener('pointermove', e => {
        const b = t.getBoundingClientRect();
        t.style.setProperty('--mx', `${e.clientX - b.left}px`);
        t.style.setProperty('--my', `${e.clientY - b.top}px`);
      });
      t.addEventListener('click', () => {
        setFilter(t.dataset.filter);
        $('#articles').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* Posts grid + filters + search */
  const grid = $('#posts-grid');
  let currentFilter = 'all', query = '', visible = 7;
  function setFilter(f) {
    currentFilter = f; visible = 7;
    $$('.filters .chip').forEach(c => {
      const on = c.dataset.filter === f;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on);
    });
    renderPosts();
  }
  function matches(p, q) {
    if (!q) return true;
    const hay = `${p.title} ${p.excerpt} ${catById[p.cat].name}`.toLowerCase();
    return q.toLowerCase().split(/\s+/).every(t => hay.includes(t));
  }
  function renderPosts() {
    if (!grid) return;
    const list = MW.posts.filter(p => (currentFilter === 'all' || p.cat === currentFilter) && matches(p, query));
    const shown = list.slice(0, visible);
    const showFeatured = currentFilter === 'all' && !query;
    grid.innerHTML = shown.length
      ? shown.map((p, i) => postCard(p, showFeatured && i === 0 && p.featured, i * 50)).join('')
      : `<div class="empty-state">No articles match that yet. Try another search or filter.</div>`;
    const more = $('#load-more');
    if (more) more.hidden = list.length <= visible;
    bindTilt(grid);
  }
  if (grid) {
    const filters = $('.filters');
    filters.innerHTML = `<button class="chip is-active" data-filter="all" aria-pressed="true">All</button>` +
      MW.categories.map(c => `<button class="chip" data-filter="${c.id}" aria-pressed="false">${c.name}</button>`).join('');
    filters.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) setFilter(c.dataset.filter); });
    $('#post-search')?.addEventListener('input', e => { query = e.target.value.trim(); visible = 7; renderPosts(); });
    $('#load-more')?.addEventListener('click', () => { visible += 6; renderPosts(); });
    renderPosts();
  }

  /* Attack path graph */
  const graph = $('#attack-graph');
  if (graph) {
    const steps = $$('.step');
    let fixed = false, current = 0, autoTimer;
    const apply = n => {
      current = n;
      $$('[data-step]', graph).forEach(el => {
        const s = +el.dataset.step;
        el.classList.toggle('is-hot', !fixed && s <= n && n > 0);
      });
      $$('.g-badge', graph).forEach(b => { b.style.opacity = (!fixed && n >= 2) ? 1 : 0; });
      $('.g-node[data-fix]', graph).classList.toggle('is-fixed', fixed);
      steps.forEach(s => s.classList.toggle('is-active', +s.dataset.goto === n));
    };
    steps.forEach(s => s.addEventListener('click', () => { stopAuto(); fixed = false; updateFixBtn(); apply(+s.dataset.goto); }));
    const fixBtn = $('#fix-path');
    const updateFixBtn = () => { fixBtn.innerHTML = fixed ? 'Replay attack path' : 'Remediate the VM'; };
    fixBtn.addEventListener('click', () => {
      stopAuto();
      fixed = !fixed; updateFixBtn();
      apply(4);
      if (fixed) toast('Patched the CVE and removed the public IP: path broken');
    });
    const stopAuto = () => clearInterval(autoTimer);
    const startAuto = () => {
      if (reduceMotion) { apply(4); return; }
      let n = 0;
      autoTimer = setInterval(() => { n = n >= 4 ? 1 : n + 1; apply(n); }, 1600);
    };
    new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { startAuto(); obs.disconnect(); } }, { threshold: .4 }).observe(graph);
    apply(0);
  }

  /* KQL vault */
  const kqlList = $('#kql-list');
  if (kqlList) {
    const codeEl = $('#kql-code'), fileEl = $('#kql-file'), descEl = $('#kql-desc');
    kqlList.innerHTML = MW.kql.map((q, i) =>
      `<button class="kql-item${i === 0 ? ' is-active' : ''}" data-id="${q.id}" role="tab" aria-selected="${i === 0}"><strong>${q.title}</strong><span>${q.table}</span></button>`).join('');
    const show = id => {
      const q = MW.kql.find(k => k.id === id);
      codeEl.innerHTML = highlight(q.code);
      fileEl.textContent = `${q.table} · ${catById[q.cat].name}`;
      descEl.innerHTML = q.desc;
      $$('.kql-item', kqlList).forEach(b => { const on = b.dataset.id === id; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
    };
    kqlList.addEventListener('click', e => { const b = e.target.closest('.kql-item'); if (b) show(b.dataset.id); });
    show(MW.kql[0].id);
  }

  /* Newsletter */
  $$('.subscribe-wrap').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const input = f.querySelector('input');
    if (!input.checkValidity()) { input.reportValidity(); return; }
    input.value = '';
    toast('Thanks! Check your inbox to confirm your subscription.');
  }));

  /* Counters */
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || '';
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      if (reduceMotion) { el.textContent = target + suffix; return; }
      const t0 = performance.now();
      const step = t => {
        const k = Math.min(1, (t - t0) / 1200), v = Math.round(target * (1 - Math.pow(1 - k, 3)));
        el.textContent = v + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    obs.observe(el);
  });

  /* ---------- Search modal (Ctrl/Cmd + K) ---------- */
  const modal = $('.search-modal');
  if (modal) {
    const input = $('input', modal), results = $('.search-results', modal);
    let sel = 0, items = [];
    const render = () => {
      const q = input.value.trim();
      items = MW.posts.filter(p => matches(p, q)).slice(0, 8);
      sel = Math.min(sel, Math.max(0, items.length - 1));
      results.innerHTML = items.length
        ? items.map((p, i) => `<li class="${i === sel ? 'is-selected' : ''}" role="option" aria-selected="${i === sel}"><a href="${postUrl(p)}"><span class="tag" style="--accent:${catById[p.cat].accent}">${catById[p.cat].short}</span><span class="sr-title">${p.title}</span></a></li>`).join('')
        : `<li class="sr-empty">Nothing found for "${esc(q)}"</li>`;
    };
    const open = () => { modal.classList.add('is-open'); input.value = ''; sel = 0; render(); setTimeout(() => input.focus(), 10); document.body.style.overflow = 'hidden'; };
    const close = () => { modal.classList.remove('is-open'); document.body.style.overflow = ''; };
    $$('.search-trigger').forEach(b => b.addEventListener('click', open));
    $('.search-modal__backdrop', modal).addEventListener('click', close);
    input.addEventListener('input', () => { sel = 0; render(); });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); modal.classList.contains('is-open') ? close() : open(); return; }
      if (e.key === '/' && !modal.classList.contains('is-open') && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); return; }
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, items.length); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + items.length) % Math.max(1, items.length); render(); }
      else if (e.key === 'Enter' && items[sel]) { location.href = postUrl(items[sel]); }
    });
  }

  /* ---------- ARTICLE PAGE ---------- */
  const article = $('.prose');
  if (article) {
    const slug = new URLSearchParams(location.search).get('p') || MW.posts[0].slug;
    const idx = Math.max(0, MW.posts.findIndex(p => p.slug === slug));
    const post = MW.posts[idx];
    const cat = catById[post.cat];

    document.title = `${post.title} · Millwaar`;
    $('#a-title').textContent = post.title;
    $('#a-lead').textContent = post.excerpt;
    $('#a-tag').textContent = cat.name;
    $('#a-tag').style.setProperty('--accent', cat.accent);
    $('#a-crumb').textContent = cat.name;
    $('#a-date').textContent = fmtDate(post.date);
    $('#a-date').setAttribute('datetime', post.date);
    $('#a-read').textContent = `${post.read} min read`;
    $('#a-level').innerHTML = levelHtml(post.level);
    $('#a-level').style.setProperty('--accent', cat.accent);

    // Only the first sample post has a full body; the rest show a template placeholder.
    if (post.slug !== MW.posts[0].slug) {
      article.innerHTML = `
        <div class="callout" style="--accent:${cat.accent}">${icon('bug')}<p><strong>Draft placeholder.</strong> This article hasn't been written yet. Open <code>post.html</code> to see the full article template, or add the content for <code>${post.slug}</code>.</p></div>
        <h2 id="overview">Overview</h2>
        <p>${post.excerpt}</p>
        <h2 id="next">What's next</h2>
        <p>Subscribe to the newsletter to hear when this one lands.</p>`;
    }

    // Build TOC from headings
    const toc = $('#toc-list');
    const heads = $$('h2[id]', article);
    toc.innerHTML = heads.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('');
    const tocLinks = $$('a', toc);
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) tocLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    heads.forEach(h => spy.observe(h));

    // Highlight article code
    $$('pre code', article).forEach(el => { el.innerHTML = highlight(el.textContent); });

    // Prev / next
    const prev = MW.posts[idx + 1], next = MW.posts[idx - 1];
    $('#article-nav').innerHTML =
      (prev ? `<a href="${postUrl(prev)}"><small>← Previous</small>${prev.title}</a>` : '<span></span>') +
      (next ? `<a href="${postUrl(next)}"><small>Next →</small>${next.title}</a>` : '<span></span>');

    // Related
    const related = MW.posts.filter(p => p.slug !== post.slug && (p.cat === post.cat || p.cat === 'wiz' || p.cat === 'sentinel')).slice(0, 3);
    const rel = $('#related');
    if (rel) { rel.innerHTML = related.map((p, i) => postCard(p, false, i * 60)).join(''); bindTilt(rel); }

    // Reading progress
    const bar = $('.progress');
    const prog = () => {
      const b = article.getBoundingClientRect();
      const total = b.height - window.innerHeight * .6;
      const pct = Math.min(100, Math.max(0, (-b.top + window.innerHeight * .3) / total * 100));
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', prog, { passive: true });
    prog();

    // Share
    $('#share-copy')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); toast('Link copied to clipboard'); } catch { toast('Could not copy the link'); }
    });
  }

  /* Footer year */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
