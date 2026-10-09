(function () {
  'use strict';

  var CONFIG = window.BASE_DATA.CONFIG;
  var PACKAGES = window.BASE_DATA.PACKAGES;
  var ICONS = window.BASE_DATA.ICONS;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function itemsLabel(n) { return n + (n === 1 ? ' item incluído' : ' itens incluídos'); }
  function priceParts(v) { var p = v.toFixed(2).split('.'); return { int: p[0], cents: p[1] }; }
  function priceHTML(label, icon, v) {
    var p = priceParts(v);
    return '<div class="price"><span class="price-k"><i data-lucide="' + icon + '"></i>' + label + '</span>' +
      '<span class="price-v" aria-label="R$ ' + p.int + ',' + p.cents + '"><span class="cur" aria-hidden="true">R$</span>' +
      '<span aria-hidden="true">' + p.int + '</span><span class="cents" aria-hidden="true">,' + p.cents + '</span></span></div>';
  }

  /* ---------- Render dos pacotes ---------- */
  function renderPackages() {
    var list = $('#pk-list');
    var chips = $('#pk-chips');
    if (!list) return;
    list.innerHTML = PACKAGES.map(function (p, i) {
      return '<article class="pkg' + (p.destaque ? ' pkg--top' : '') + (i === 0 ? ' is-active' : '') + '" id="pacote-' + p.num + '" aria-labelledby="pkg-name-' + p.num + '">' +
        '<div class="pkg-media"><canvas data-art="' + p.art + '" data-seed="' + (i * 7 + 3) + '" aria-hidden="true"></canvas>' +
        '<span class="pkg-num" aria-hidden="true">' + p.num + '</span>' +
        (p.destaque ? '<span class="pkg-badge"><i data-lucide="gem"></i>Nível máximo</span>' : '') + '</div>' +
        '<div class="pkg-body"><div class="pkg-main">' +
        '<p class="pkg-kicker">' + p.kicker + '</p>' +
        '<h3 class="h-display pkg-name" id="pkg-name-' + p.num + '">' + p.nome + '</h3>' +
        (p.descricao ? '<p class="pkg-desc">' + p.descricao + '</p>' : '') +
        '<p class="pkg-count">' + itemsLabel(p.itens.length) + '</p>' +
        '<ul class="pkg-items">' + p.itens.map(function (it) {
          return '<li><i data-lucide="' + (ICONS[it] || 'check') + '"></i><span>' + it + '</span></li>';
        }).join('') + '</ul></div>' +
        '<div class="pkg-side"><div class="pkg-prices">' +
        priceHTML('Carros', 'car', p.precos.carro) + priceHTML('SUVs', 'truck', p.precos.suv) +
        '</div><a class="btn ' + (p.destaque ? 'btn--light' : 'btn--red') + '" href="' + CONFIG.whatsapp + '" target="_blank" rel="noopener" data-wa ' +
        'aria-label="Consultar disponibilidade do pacote ' + p.num + ', ' + p.nome + ', pelo WhatsApp">Consultar disponibilidade <i data-lucide="arrow-right"></i></a>' +
        '</div></div></article>';
    }).join('');

    if (chips) {
      chips.innerHTML = PACKAGES.map(function (p, i) {
        return '<a href="#pacote-' + p.num + '"' + (i === 0 ? ' class="is-on"' : '') + '>Nível ' + p.num + '</a>';
      }).join('');
    }
  }

  /* ---------- Links ---------- */
  function bindLinks() {
    $$('[data-wa]').forEach(function (a) { a.href = CONFIG.whatsapp; a.target = '_blank'; a.rel = 'noopener'; });
    $$('[data-maps]').forEach(function (a) { a.href = CONFIG.maps; });
    $$('[data-tel]').forEach(function (a) { a.href = CONFIG.phoneTel; });
    var y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ---------- Header, menu e copiar ---------- */
  function initUI() {
    var header = $('.site-header');
    var hero = $('.hero');
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      // modo "ilha": quando a seção principal (hero) sai da tela, o header vira uma pílula flutuante
      if (hero) header.classList.toggle('is-island', hero.getBoundingClientRect().bottom <= header.offsetHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var btn = $('.menu-btn'), nav = $('#menu');
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
    btn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 979) setMenu(false); });

    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var label = $('.copy-label', b);
        var done = function () {
          label.textContent = 'Copiado';
          setTimeout(function () { label.textContent = 'Copiar'; }, 1800);
        };
        var fallback = function () {
          var t = $(b.getAttribute('data-target'));
          if (!t) return;
          var r = document.createRange(); r.selectNodeContents(t);
          var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
          label.textContent = 'Selecionado';
          setTimeout(function () { label.textContent = 'Copiar'; }, 1800);
        };
        try { navigator.clipboard.writeText(b.getAttribute('data-copy')).then(done, fallback); }
        catch (e) { fallback(); }
      });
    });
  }

  /* ---------- Divide a frase da seção 2 em palavras ---------- */
  function splitWords(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1) { splitWords(n); }
    });
  }

  /* =========================================================
     ARTE PROCEDURAL — imagens provisórias, substituíveis por fotos
     ========================================================= */
  var Art = (function () {
    function rng(seed) {
      var a = (seed >>> 0) || 1;
      return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    function glow(ctx, w, h, x, y, rad, color) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    function vignette(ctx, w, h, s) {
      var g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.hypot(w, h) / 2);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + s + ')');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    function base(ctx, w, h, c1, c2) {
      var g = ctx.createLinearGradient(0, 0, w * 0.4, h);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }

    function foam(ctx, w, h, r) {
      base(ctx, w, h, '#101012', '#050505');
      glow(ctx, w, h, w * 0.8, h * 1.05, Math.max(w, h) * 0.7, 'rgba(209,10,22,.45)');
      glow(ctx, w, h, w * 0.15, h * 0.05, Math.max(w, h) * 0.5, 'rgba(255,255,255,.07)');
      ctx.save(); ctx.filter = 'blur(16px)';
      for (var k = 0; k < 40; k++) {
        ctx.beginPath(); ctx.arc(r() * w, h * (0.8 + r() * 0.3), 24 + r() * 70, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fill();
      }
      ctx.restore();
      var n = Math.min(1100, Math.round(w * h / 650));
      for (var i = 0; i < n; i++) {
        var x = r() * w, y = h * (0.15 + Math.pow(r(), 0.55) * 0.92);
        var rad = 1.5 + Math.pow(r(), 3.2) * Math.min(w, h) * 0.09;
        var a = 0.18 + r() * 0.5;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (a * 0.08) + ')'; ctx.fill();
        ctx.lineWidth = Math.max(0.6, rad * 0.06); ctx.strokeStyle = 'rgba(255,255,255,' + a + ')'; ctx.stroke();
        ctx.beginPath(); ctx.arc(x - rad * 0.35, y - rad * 0.4, rad * 0.17, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, a + 0.3) + ')'; ctx.fill();
        if (rad > 6) {
          ctx.beginPath(); ctx.arc(x, y, rad * 0.86, 0.1 * Math.PI, 0.6 * Math.PI);
          ctx.strokeStyle = 'rgba(240,24,36,' + (a * 0.75) + ')'; ctx.lineWidth = Math.max(0.8, rad * 0.07); ctx.stroke();
        }
      }
    }

    function paint(ctx, w, h, r) {
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#1d0407'); g.addColorStop(0.45, '#070707'); g.addColorStop(1, '#160305');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      var n = Math.min(7000, Math.round(w * h / 260));
      for (var i = 0; i < n; i++) {
        var s = r() * 1.1 + 0.3, a = r() * 0.22;
        ctx.fillStyle = r() < 0.35 ? 'rgba(240,24,36,' + (a * 1.7) + ')' : 'rgba(255,255,255,' + a + ')';
        ctx.fillRect(r() * w, r() * h, s, s);
      }
      var bands = [{ y: 0.3, amp: 0.18, wid: 0.09, a: 0.55 }, { y: 0.6, amp: -0.12, wid: 0.05, a: 0.35 }, { y: 0.84, amp: 0.08, wid: 0.12, a: 0.18 }];
      bands.forEach(function (b) {
        var lg = ctx.createLinearGradient(0, 0, w, 0);
        lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.3 + r() * 0.25, 'rgba(255,255,255,' + b.a + ')'); lg.addColorStop(1, 'rgba(255,255,255,0)');
        var path = function () {
          ctx.beginPath(); ctx.moveTo(-w * 0.1, h * b.y);
          ctx.bezierCurveTo(w * 0.3, h * (b.y - b.amp), w * 0.7, h * (b.y + b.amp), w * 1.1, h * (b.y - b.amp * 0.5));
        };
        ctx.save(); ctx.filter = 'blur(' + Math.max(6, h * b.wid * 0.35) + 'px)';
        ctx.strokeStyle = lg; ctx.lineWidth = h * b.wid; ctx.lineCap = 'round'; path(); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.strokeStyle = lg; ctx.lineWidth = Math.max(1, h * 0.004); path(); ctx.stroke(); ctx.restore();
      });
      glow(ctx, w, h, w, h, Math.max(w, h) * 0.6, 'rgba(209,10,22,.28)');
    }

    function wheel(ctx, w, h, r) {
      base(ctx, w, h, '#0d0d0e', '#030303');
      glow(ctx, w, h, w * 0.15, h * 0.1, Math.max(w, h) * 0.6, 'rgba(255,255,255,.06)');
      var R = Math.max(w, h) * 0.46, cx = w * 0.6, cy = h * 0.56, k, a;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = '#070707'; ctx.fill();
      ctx.lineWidth = R * 0.02; ctx.strokeStyle = '#1b1b1c'; ctx.beginPath(); ctx.arc(cx, cy, R * 0.96, 0, Math.PI * 2); ctx.stroke();
      var rg = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.05, cx, cy, R * 0.8);
      rg.addColorStop(0, '#46464a'); rg.addColorStop(1, '#0e0e0f');
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.8, 0, Math.PI * 2); ctx.fillStyle = rg; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.6, 0, Math.PI * 2); ctx.fillStyle = '#19191a'; ctx.fill();
      for (k = 0; k < 24; k++) {
        a = k / 24 * Math.PI * 2;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * R * 0.5, cy + Math.sin(a) * R * 0.5, R * 0.018, 0, Math.PI * 2);
        ctx.fillStyle = '#050505'; ctx.fill();
      }
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-2.4);
      var cg = ctx.createLinearGradient(R * 0.42, 0, R * 0.66, 0); cg.addColorStop(0, '#8a050c'); cg.addColorStop(1, '#F01824');
      ctx.beginPath(); ctx.arc(0, 0, R * 0.65, -0.45, 0.45); ctx.arc(0, 0, R * 0.43, 0.45, -0.45, true); ctx.closePath();
      ctx.fillStyle = cg; ctx.fill(); ctx.restore();
      for (k = 0; k < 5; k++) {
        [-1, 1].forEach(function (s) {
          var ang = k * Math.PI * 2 / 5 + s * 0.11;
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
          var sg = ctx.createLinearGradient(-R * 0.05, 0, R * 0.05, 0);
          sg.addColorStop(0, '#c4c4c8'); sg.addColorStop(1, '#3e3e42');
          ctx.beginPath(); ctx.moveTo(-R * 0.035, -R * 0.15); ctx.lineTo(R * 0.035, -R * 0.15); ctx.lineTo(R * 0.02, -R * 0.77); ctx.lineTo(-R * 0.02, -R * 0.77); ctx.closePath();
          ctx.fillStyle = sg; ctx.fill(); ctx.restore();
        });
      }
      ctx.lineWidth = R * 0.025; ctx.strokeStyle = 'rgba(220,220,225,.55)';
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.79, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.15, 0, Math.PI * 2); ctx.fillStyle = '#1c1c1e'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.07, 0, Math.PI * 2); ctx.fillStyle = '#0a0a0a'; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.stroke();
      for (k = 0; k < 5; k++) {
        a = k / 5 * Math.PI * 2 + 0.6;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * R * 0.11, cy + Math.sin(a) * R * 0.11, R * 0.018, 0, Math.PI * 2);
        ctx.fillStyle = '#727276'; ctx.fill();
      }
      var lg = ctx.createLinearGradient(0, 0, w, h);
      lg.addColorStop(0, 'rgba(255,255,255,.09)'); lg.addColorStop(0.5, 'rgba(255,255,255,0)');
      ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h);
    }

    function leather(ctx, w, h, r) {
      ctx.fillStyle = '#0b0a0a'; ctx.fillRect(0, 0, w, h);
      var s = Math.max(40, Math.min(w, h) / 4);
      for (var j = -1; j * s < h + s; j++) {
        for (var i = -1; i * 2 * s < w + 2 * s; i++) {
          var cx = i * 2 * s + (j % 2 ? s : 0), cy = j * s;
          var g = ctx.createRadialGradient(cx - s * 0.2, cy - s * 0.25, s * 0.05, cx, cy, s);
          g.addColorStop(0, '#2c2526'); g.addColorStop(1, '#0a0909');
          ctx.beginPath(); ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s, cy); ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s, cy); ctx.closePath();
          ctx.fillStyle = g; ctx.fill();
          var d = s * 0.86;
          ctx.save(); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(209,10,22,.85)';
          ctx.beginPath(); ctx.moveTo(cx, cy - d); ctx.lineTo(cx + d, cy); ctx.lineTo(cx, cy + d); ctx.lineTo(cx - d, cy); ctx.closePath(); ctx.stroke(); ctx.restore();
        }
      }
      glow(ctx, w, h, w * 0.2, h * 0.1, Math.max(w, h) * 0.6, 'rgba(255,255,255,.07)');
      glow(ctx, w, h, w, h, Math.max(w, h) * 0.6, 'rgba(209,10,22,.18)');
    }

    function beads(ctx, w, h, r) {
      base(ctx, w, h, '#0c0c0d', '#040404');
      ctx.save(); ctx.filter = 'blur(30px)';
      ctx.fillStyle = 'rgba(255,255,255,.07)';
      ctx.beginPath(); ctx.moveTo(0, h * 0.2); ctx.lineTo(w, h * 0.05); ctx.lineTo(w, h * 0.25); ctx.lineTo(0, h * 0.42); ctx.closePath(); ctx.fill();
      ctx.restore();
      glow(ctx, w, h, w * 0.85, h * 0.9, Math.max(w, h) * 0.6, 'rgba(209,10,22,.3)');
      var n = Math.min(520, Math.round(w * h / 850));
      for (var i = 0; i < n; i++) {
        var x = r() * w, y = r() * h;
        var rx = 2 + Math.pow(r(), 2.2) * Math.min(w, h) * 0.055, ry = rx * (0.8 + r() * 0.15);
        ctx.beginPath(); ctx.ellipse(x + rx * 0.15, y + ry * 0.35, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fill();
        var g = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.3, rx * 0.1, x, y, rx);
        g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(0.7, 'rgba(255,255,255,.04)'); g.addColorStop(1, 'rgba(255,255,255,.24)');
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.ellipse(x - rx * 0.35, y - ry * 0.4, rx * 0.28, ry * 0.17, -0.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
        if (rx > 5) {
          ctx.beginPath(); ctx.arc(x, y, rx * 0.8, 0.15 * Math.PI, 0.55 * Math.PI);
          ctx.strokeStyle = 'rgba(240,24,36,.6)'; ctx.lineWidth = rx * 0.12; ctx.stroke();
        }
      }
    }

    function lights(ctx, w, h, r) {
      ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, w, h);
      glow(ctx, w, h, w * 0.5, h * 1.1, Math.max(w, h) * 0.8, 'rgba(40,40,44,.9)');
      for (var k = 0; k < 7; k++) {
        var t = k / 6, y0 = h * (0.12 + t * 0.78), curv = h * (0.22 - t * 0.12);
        var red = k === 3;
        var lg = ctx.createLinearGradient(0, 0, w, 0);
        var col = red ? '240,24,36' : '255,255,255';
        var al = red ? 0.95 : 0.75 * (1 - t * 0.55);
        lg.addColorStop(0, 'rgba(' + col + ',0)'); lg.addColorStop(0.2 + r() * 0.15, 'rgba(' + col + ',' + al + ')');
        lg.addColorStop(0.75 + r() * 0.1, 'rgba(' + col + ',' + (al * 0.6) + ')'); lg.addColorStop(1, 'rgba(' + col + ',0)');
        var lw = h * (0.006 + 0.016 * (1 - t));
        var path = function () { ctx.beginPath(); ctx.moveTo(-w * 0.05, y0); ctx.quadraticCurveTo(w * 0.5, y0 - curv, w * 1.05, y0 + h * 0.05); };
        ctx.save(); ctx.filter = 'blur(' + Math.max(4, lw * 2) + 'px)'; ctx.strokeStyle = lg; ctx.lineWidth = lw * 3; path(); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.strokeStyle = lg; ctx.lineWidth = lw; path(); ctx.stroke(); ctx.restore();
      }
      var fg = ctx.createLinearGradient(0, h * 0.6, 0, h);
      fg.addColorStop(0, 'rgba(5,5,5,0)'); fg.addColorStop(1, 'rgba(5,5,5,.75)');
      ctx.fillStyle = fg; ctx.fillRect(0, 0, w, h);
    }

    function steam(ctx, w, h, r) {
      base(ctx, w, h, '#0d0d0e', '#040404');
      for (var i = 0; i < 6; i++) {
        var x = r() * w * 0.9, y = h * (0.55 + r() * 0.35), ww = w * (0.15 + r() * 0.25), hh = h * (0.1 + r() * 0.15);
        var g = ctx.createLinearGradient(x, y, x, y + hh); g.addColorStop(0, '#202022'); g.addColorStop(1, '#0a0a0b');
        ctx.fillStyle = g; ctx.fillRect(x, y, ww, hh);
        ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, ww - 1, hh - 1);
        [[x + 8, y + 8], [x + ww - 8, y + 8]].forEach(function (p) {
          ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, Math.PI * 2); ctx.fillStyle = '#4a4a4e'; ctx.fill();
        });
      }
      glow(ctx, w, h, w * 0.5, h * 1.15, Math.max(w, h) * 0.75, 'rgba(209,10,22,.5)');
      ctx.save(); ctx.filter = 'blur(12px)'; ctx.lineCap = 'round';
      for (var k = 0; k < 28; k++) {
        var x0 = r() * w, y0 = h * (0.6 + r() * 0.4);
        ctx.beginPath(); ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(x0 + (r() - 0.5) * w * 0.3, y0 - h * 0.3, x0 + (r() - 0.5) * w * 0.4, y0 - h * 0.6, x0 + (r() - 0.5) * w * 0.3, -h * 0.1);
        ctx.lineWidth = 12 + r() * 50; ctx.strokeStyle = 'rgba(255,255,255,' + (0.03 + r() * 0.06) + ')'; ctx.stroke();
      }
      ctx.restore();
      ctx.save(); ctx.lineCap = 'round';
      for (var m = 0; m < 10; m++) {
        var x1 = r() * w, y1 = h * (0.5 + r() * 0.4);
        ctx.beginPath(); ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 + (r() - 0.5) * 80, y1 - h * 0.2, x1 + (r() - 0.5) * 120, y1 - h * 0.4, x1 + (r() - 0.5) * 60, y1 - h * 0.6);
        ctx.lineWidth = 1 + r() * 2; ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.stroke();
      }
      ctx.restore();
    }

    var kinds = { foam: foam, paint: paint, wheel: wheel, leather: leather, beads: beads, lights: lights, steam: steam };

    function draw(c) {
      var w = c.clientWidth, h = c.clientHeight;
      if (!w || !h) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = Math.round(w * dpr), H = Math.round(h * dpr);
      if (c.width === W && c.height === H && c.getAttribute('data-drawn')) return;
      c.width = W; c.height = H;
      var ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      (kinds[c.getAttribute('data-art')] || paint)(ctx, w, h, rng(+c.getAttribute('data-seed') || 1));
      ctx.filter = 'none';
      vignette(ctx, w, h, 0.7);
      c.setAttribute('data-drawn', '1');
    }

    function init() {
      var list = $$('canvas[data-art]');
      var pending = new Set(), raf = 0;
      var flush = function () { raf = 0; pending.forEach(draw); pending.clear(); };
      var queue = function (c) { pending.add(c); if (!raf) raf = requestAnimationFrame(flush); };
      if ('ResizeObserver' in window) {
        var ro = new ResizeObserver(function (entries) { entries.forEach(function (e) { queue(e.target); }); });
        list.forEach(function (c) { ro.observe(c); });
      } else {
        list.forEach(draw);
        window.addEventListener('resize', function () { list.forEach(queue); });
      }
    }
    return { init: init };
  })();

  /* =========================================================
     MOVIMENTO — GSAP + ScrollTrigger
     gsap.matchMedia separa desktop, mobile e movimento reduzido.
     Ao mudar de contexto, todos os tweens e gatilhos do bloco são revertidos.
     (Em React/Next: crie isso dentro de useGSAP/gsap.context e chame mm.revert() no unmount.)
     ========================================================= */
  function railController(animate) {
    var rail = $('.pk-rail');
    var num = rail && $('.rail-num', rail), name = rail && $('.rail-name', rail), count = rail && $('.rail-count', rail);
    var bars = rail ? $$('.rail-bar', rail) : [];
    var cards = $$('.pkg'), chips = $$('#pk-chips a');
    var current = 0;
    function swap(p) {
      if (!rail) return;
      num.textContent = p.num;
      name.textContent = p.nivel ? p.nome + ' · ' + p.nivel : p.nome;
      count.textContent = itemsLabel(p.itens.length);
      rail.classList.toggle('is-top', !!p.destaque);
    }
    return function set(i) {
      if (i === current) return;
      var dir = i > current ? 1 : -1;
      current = i;
      var p = PACKAGES[i];
      bars.forEach(function (b, k) { b.classList.toggle('is-on', k <= i); });
      cards.forEach(function (c, k) { c.classList.toggle('is-active', k === i); });
      chips.forEach(function (c, k) { c.classList.toggle('is-on', k === i); });
      if (!rail) return;
      if (animate && rail.offsetParent !== null) {
        gsap.timeline()
          .to([num, name, count], { yPercent: -dir * 35, opacity: 0, duration: 0.18, ease: 'power2.in', onComplete: function () { swap(p); } })
          .fromTo([num, name, count], { yPercent: dir * 35, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
      } else { swap(p); }
    };
  }

  function watchPackages(set) {
    $$('.pkg').forEach(function (card, i) {
      ScrollTrigger.create({
        trigger: card, start: 'top 55%', end: 'bottom 55%',
        onToggle: function (self) { if (self.isActive) set(i); }
      });
    });
  }

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();

    mm.add({
      desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 899.98px) and (prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)'
    }, function (context) {
      var c = context.conditions;
      if (c.reduce) { watchPackages(railController(false)); return; }
      var desktop = c.desktop;

      /* Hero: entrada cinematográfica */
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.hero-car', { xPercent: desktop ? 9 : 5, opacity: 0, duration: 1.9 }, 0)
        .fromTo('.hero-lines path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.14, ease: 'power3.inOut' }, 0.15)
        .from('.hero-title .line > span', { yPercent: 112, duration: 1.15, stagger: 0.11 }, 0.3)
        .from('.hero-inner .eyebrow, .hero-sub, .hero-actions, .cred-tag', { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.75);
      gsap.from('#wheelArt .spin', { rotation: -160, svgOrigin: '0 0', duration: 2.1, ease: 'expo.out' });
      gsap.fromTo('.car-sweep', { attr: { x: -400 } }, { attr: { x: 1500 }, duration: 2.4, ease: 'power2.inOut', repeat: -1, repeatDelay: 5, delay: 0.9 });

      if (desktop) {
        gsap.to('.hero-car', { yPercent: -7, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.hero-inner', { y: -90, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '35% top', end: 'bottom top', scrub: true } });
        gsap.to('.hero-lines', { opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      }

      /* Seção 2: frase revelada palavra por palavra, fundo do preto ao vermelho escuro */
      var words = $$('.statement .w');
      if (desktop) {
        var dur = (words.length - 1) * 0.1 + 0.5;
        gsap.timeline({ scrollTrigger: { trigger: '.exp-track', start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
          .fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, duration: 0.5, ease: 'none' }, 0)
          .fromTo('.exp-canvas, .exp-stage .bg-video', { scale: 1.28 }, { scale: 1, duration: dur, ease: 'none' }, 0)
          .fromTo('.exp-tint', { opacity: 0.35 }, { opacity: 1, duration: dur, ease: 'none' }, 0);
      } else {
        gsap.fromTo(words, { opacity: 0.16 }, { opacity: 1, stagger: 0.06, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 80%', end: 'bottom 50%', scrub: 0.5 } });
      }

      /* Linhas vermelhas desenhadas com a rolagem */
      $$('.rule path').forEach(function (p) {
        gsap.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: p.closest('.rule'), start: 'top 92%', end: 'top 50%', scrub: 0.6 } });
      });

      /* Entradas de texto */
      $$('[data-reveal]').forEach(function (el) {
        gsap.from(el, { y: desktop ? 40 : 22, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
      $$('[data-stagger]').forEach(function (group) {
        gsap.from(group.children, { y: desktop ? 46 : 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
      });

      /* Pacotes */
      $$('.pkg').forEach(function (card) {
        gsap.from(card, { y: desktop ? 70 : 34, opacity: 0, duration: 1.15, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
        gsap.from($$('.pkg-items li', card), { x: -14, opacity: 0, duration: 0.6, stagger: 0.045, ease: 'power3.out', scrollTrigger: { trigger: $('.pkg-items', card), start: 'top 88%', once: true } });
        if (desktop) {
          gsap.fromTo($('.pkg-media canvas', card), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
        }
      });
      watchPackages(railController(desktop));

      /* Diferenciais: parallax da imagem */
      gsap.fromTo('.dif-visual canvas', { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: '.dif-visual', start: 'top bottom', end: 'bottom top', scrub: true } });

      /* Credenciamento: palavra vazada desliza */
      gsap.fromTo('.cred-word', { xPercent: desktop ? -8 : -4 }, { xPercent: desktop ? 6 : 3, ease: 'none', scrollTrigger: { trigger: '.cred', start: 'top bottom', end: 'bottom top', scrub: true } });

      /* Galeria: revelação por recorte e zoom discreto */
      $$('.gal-item').forEach(function (it) {
        gsap.fromTo(it, { clipPath: 'inset(16% 0% 16% 0%)', opacity: 0.2 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: it, start: 'top 90%', once: true } });
        if (desktop) {
          gsap.fromTo($('canvas', it), { scale: 1.16 }, { scale: 1.02, ease: 'none', scrollTrigger: { trigger: it, start: 'top bottom', end: 'bottom top', scrub: true } });
        }
      });
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }


  /* =========================================================
     VÍDEOS DE FUNDO
     - toca só o vídeo visível e pausa os que saem da tela
     - com vários vídeos no mesmo bloco, alterna em ciclo infinito
     - vídeo que não carrega é removido (o fundo original continua)
     ========================================================= */
  function initVideos() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $$('.bg-video').forEach(function (box) {
      var host = box.parentElement;
      var interval = (parseFloat(box.getAttribute('data-interval')) || 7) * 1000;
      var idx = 0, timer = null, visible = false;
      var list = function () { return $$('video', box); };

      function playSafe(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      function show(i) {
        var vids = list(); if (!vids.length) return;
        idx = ((i % vids.length) + vids.length) % vids.length;
        vids.forEach(function (v, k) {
          if (k === idx) {
            v.classList.add('is-on');
            if (vids.length > 1) { try { v.currentTime = 0; } catch (e) {} }
            if (visible && !reduce) playSafe(v);
          } else if (v.classList.contains('is-on')) {
            v.classList.remove('is-on');
            setTimeout(function () { if (!v.classList.contains('is-on')) v.pause(); }, 1500);
          }
        });
      }
      function start() {
        clearInterval(timer);
        var cur = list()[idx]; if (cur && !reduce) playSafe(cur);
        if (!reduce && list().length > 1) timer = setInterval(function () { show(idx + 1); }, interval);
      }
      function stop() { clearInterval(timer); list().forEach(function (v) { v.pause(); }); }

      list().forEach(function (v) {
        v.muted = true; v.loop = true; v.playsInline = true;
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        v.addEventListener('loadeddata', function () { host.classList.add('has-video'); });
        v.addEventListener('error', function () {
          var wasOn = v.classList.contains('is-on');
          v.remove();
          if (!list().length) { host.classList.remove('has-video'); clearInterval(timer); return; }
          if (wasOn) show(0);
          if (list().length < 2) clearInterval(timer);
        });
      });
      show(0);

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { visible = e.isIntersecting; if (visible) start(); else stop(); });
        }, { threshold: 0.05 }).observe(box);
      } else { visible = true; start(); }
    });
  }

  /* ---------- Inicialização ---------- */
  renderPackages();
  bindLinks();
  splitWords($('#statement'));
  if (window.lucide && lucide.createIcons) lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
  initUI();
  Art.init();
  initVideos();
  initMotion();
})();
