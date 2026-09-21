/* WatchCalc UI */
(function () {
  'use strict';

  var C = window.Calc;

  var BK = { l: '⌫', a: 'back', s: { l: 'AC', a: 'ac' }, c: 'op' };
  var PR = { l: '( )', a: 'paren', s: { l: ',', i: ',' }, c: 'op' };
  var EQ = { l: '=', a: 'eq', c: 'eq' };

  var PAGES = [
    {
      name: '123', keys: [
        ['7', '8', '9', { l: '÷', i: '/', s: { l: '%', i: '%' }, c: 'op' }, BK],
        ['4', '5', '6', { l: '×', i: '*', s: { l: '^', i: '^' }, c: 'op' }, PR],
        ['1', '2', '3', { l: '−', i: '-', s: { l: 'Ans', i: 'Ans' }, c: 'op' },
          { l: '+', i: '+', c: 'op' }],
        ['0', { l: '.', i: '.', s: { l: 'E', i: 'E' } }, EQ]
      ]
    },
    {
      name: 'log', keys: [
        [{ l: '√', i: 'sqrt(', c: 'fn' },
        { l: 'x²', i: '^2', c: 'fn' },
        { l: 'x³', i: '^3', c: 'fn' },
        { l: 'xʸ', i: '^', c: 'fn' }, BK],
        [{ l: '³√', i: 'cbrt(', c: 'fn' },
        { l: 'ln', i: 'ln(', c: 'fn' },
        { l: 'log', i: 'log(', s: { l: 'log₂', i: 'log2(' }, c: 'fn sm' },
        { l: '10ˣ', i: '10^(', c: 'fn sm' }, PR],
        [{ l: 'eˣ', i: 'exp(', c: 'fn' },
        { l: 'x⁻¹', i: '^(-1)', c: 'fn sm' },
        { l: '|x|', i: 'abs(', c: 'fn' },
        { l: 'logᵇ', i: 'logb', c: 'fn xs' },
        { l: 'ʸ√', i: 'root', c: 'fn' }],
        [{ l: 'π', i: 'π', c: 'fn' }, { l: 'e', i: 'e', c: 'fn' }, EQ]
      ]
    },
    {
      name: 'trig', keys: [
        [{ l: 'sin', i: 'sin(', s: { l: 'sin⁻¹', i: 'asin(' }, c: 'fn sm' },
        { l: 'cos', i: 'cos(', s: { l: 'cos⁻¹', i: 'acos(' }, c: 'fn sm' },
        { l: 'tan', i: 'tan(', s: { l: 'tan⁻¹', i: 'atan(' }, c: 'fn sm' },
        { l: 'DRG', a: 'drg', c: 'fn sm' }, BK],
        [{ l: 'sec', i: 'sec(', s: { l: 'sec⁻¹', i: 'asec(' }, c: 'fn sm' },
        { l: 'cosec', i: 'csc(', s: { l: 'cosec⁻¹', i: 'acsc(' }, c: 'fn xs' },
        { l: 'cot', i: 'cot(', s: { l: 'cot⁻¹', i: 'acot(' }, c: 'fn sm' },
        { l: 'π', i: 'π', c: 'fn' }, PR],
        [{ l: 'sinh', i: 'sinh(', s: { l: 'sinh⁻¹', i: 'asinh(' }, c: 'fn xs' },
        { l: 'cosh', i: 'cosh(', s: { l: 'cosh⁻¹', i: 'acosh(' }, c: 'fn xs' },
        { l: 'tanh', i: 'tanh(', s: { l: 'tanh⁻¹', i: 'atanh(' }, c: 'fn xs' },
        { l: 'D→R', i: 'rad(', c: 'fn xs' },
        { l: 'R→D', i: 'deg(', c: 'fn xs' }],
        [{ l: 'Ans', i: 'Ans', c: 'fn sm' }, { l: 'xʸ', i: '^', c: 'op' }, EQ]
      ]
    },
    {
      name: 'more', keys: [
        [{ l: 'nCr', i: 'nCr', c: 'fn xs' },
        { l: 'nPr', i: 'nPr', c: 'fn xs' },
        { l: 'n!', i: '!', c: 'fn' },
        { l: '%', i: '%', c: 'fn' }, BK],
        [{ l: 'mod', i: 'mod', c: 'fn xs' },
        { l: 'gcd', i: 'gcd', c: 'fn xs' },
        { l: 'lcm', i: 'lcm', c: 'fn xs' },
        { l: 'E', i: 'E', c: 'fn' }, PR],
        [{ l: 'CONST', a: 'const', c: 'fn xs' },
        { l: 'HIST', a: 'hist', c: 'fn xs' },
        { l: 'DRG', a: 'drg', c: 'fn xs' },
        { l: 'M+', a: 'mplus', s: { l: 'M−', a: 'mminus' }, c: 'fn sm' },
        { l: 'MR', i: 'M', s: { l: 'MC', a: 'mc' }, c: 'fn sm' }],
        [{ l: 'Ans', i: 'Ans', c: 'fn sm' }, { l: 'SIG', a: 'sig', c: 'fn sm' }, EQ]
      ]
    },
    /* standalone page so its keys do not return to the main number pad. */
    {
      name: 'prime', standalone: true, keys: [
        ['7', '8', '9', { l: '00', i: '00', c: 'op' }, BK],
        ['4', '5', '6', { l: '000', i: '000', c: 'op sm' }, { l: 'AC', a: 'ac', c: 'op sm' }],
        ['1', '2', '3', '0', { l: 'Ans', i: 'Ans', c: 'fn sm' }],
        [{ l: 'FACTOR', a: 'factor', c: 'eq' }]
      ]
    }
  ];

  var S = {
    expr: '', page: 0, angle: 'DEG', Ans: 0, M: 0, sig: 10,
    done: false, hist: [], haptic: true
  };
  try {
    var saved = JSON.parse(localStorage.getItem('watchcalc') || '{}');
    ['angle', 'Ans', 'M', 'sig', 'haptic'].forEach(function (k) {
      if (saved[k] !== undefined) S[k] = saved[k];
    });
    if (Array.isArray(saved.hist)) S.hist = saved.hist;
  } catch (e) { }

  function save() {
    try {
      localStorage.setItem('watchcalc', JSON.stringify({
        angle: S.angle, Ans: S.Ans, M: S.M, sig: S.sig,
        haptic: S.haptic, hist: S.hist.slice(0, 40)
      }));
    } catch (e) { }
  }

  var $ = function (id) { return document.getElementById(id); };
  var elExpr, elRes, elExact, elAngle, elMem, elPage, elTrack, elDots;

  /* render */
  function buildPad() {
    elTrack = $('track');
    var frag = document.createDocumentFragment();
    PAGES.forEach(function (pg) {
      var p = document.createElement('div');
      p.className = 'page';
      pg.keys.forEach(function (row, ri) {
        var r = document.createElement('div');
        r.className = 'row r' + (ri + 1);
        row.forEach(function (k) {
          if (typeof k === 'string') k = { l: k, i: k };
          var b = document.createElement('div');
          b.className = 'k' + (k.c ? ' ' + k.c : '');
          b.textContent = k.l;
          if (k.s) {
            var h = document.createElement('span');
            h.className = 'hint';
            h.textContent = k.s.l;
            b.appendChild(h);
          }
          b._k = k;
          r.appendChild(b);
        });
        p.appendChild(r);
      });
      frag.appendChild(p);
    });
    elTrack.appendChild(frag);

    elDots = $('dots');
    PAGES.forEach(function () { elDots.appendChild(document.createElement('i')); });
  }

  function paint() {
    elExpr.textContent = C.pretty(S.expr);
    elExpr.scrollLeft = elExpr.scrollWidth;
    elAngle.textContent = S.angle;
    elMem.textContent = S.M !== 0 ? 'M' : '';
    elMem.className = S.M !== 0 ? 'on' : '';
    elPage.textContent = PAGES[S.page].name;
    for (var i = 0; i < elDots.children.length; i++) {
      elDots.children[i].className = i === S.page ? 'on' : '';
    }
  }

  function fitText(el, maxU, minU) {
    var u = parseFloat(document.documentElement.style.getPropertyValue('--u')) || 4.5;
    var sz = maxU, guard = 0;
    el.style.fontSize = (sz * u) + 'px';
    while (sz > minU && el.scrollWidth > el.clientWidth + 1 && guard++ < 40) {
      sz -= 0.25;
      el.style.fontSize = (sz * u) + 'px';
    }
  }

  function showResult(text, isErr, exactStr) {
    elRes.textContent = text;
    elRes.className = isErr ? 'err' : '';
    elExact.textContent = exactStr || '';
    fitText(elRes, isErr ? 5.4 : 7.6, 3.2);
    fitText(elExact, 3.4, 2.3);
  }

  function goPage(n) {
    S.page = Math.max(0, Math.min(PAGES.length - 1, n));
    elTrack.style.transform = 'translateX(' + (-S.page * $('pad').clientWidth) + 'px)';
    paint();
  }

  function setUnit() {
    var d = document.documentElement;
    var w = d.clientWidth, h = d.clientHeight;
    if (w < 80 || h < 80) return;
    d.style.setProperty('--u', (Math.min(w, h) / 100) + 'px');
    d.style.setProperty('--vw', w + 'px');
  }

  /* actions */
  function buzz(ms) {
    if (S.haptic && navigator.vibrate) { try { navigator.vibrate(ms || 12); } catch (e) { } }
  }

  function insert(txt) {
    if (S.done) {
      if ('+-*/^'.indexOf(txt) > -1 || txt === '!' || txt === '%') S.expr = 'Ans';
      else S.expr = '';
      S.done = false;
      showResult('', false, '');
    }
    S.expr += txt;
    paint();
  }

  function smartParen() {
    var open = 0;
    for (var i = 0; i < S.expr.length; i++) {
      if (S.expr.charAt(i) === '(') open++;
      else if (S.expr.charAt(i) === ')') open--;
    }
    var last = S.expr.charAt(S.expr.length - 1);
    var wantClose = open > 0 && last !== '' && '(+-*/^,'.indexOf(last) === -1;
    insert(wantClose ? ')' : '(');
  }

  /* delete one whole token, not one character */
  var TOKENS = ['asinh(', 'acosh(', 'atanh(', 'sinh(', 'cosh(', 'tanh(',
    'asin(', 'acos(', 'atan(', 'asec(', 'acsc(', 'acot(',
    'sqrt(', 'cbrt(', 'logb(', 'log2(', 'root(',
    'nCr(', 'nPr(', 'mod(', 'gcd(', 'lcm(', 'abs(', 'exp(', 'sin(', 'cos(',
    'tan(', 'sec(', 'csc(', 'cot(', 'log(', 'deg(', 'rad(', 'ln(',
    'logb', 'root', 'nCr', 'nPr', 'mod', 'gcd', 'lcm',
    'Ans', '^(-1)', '10^(',
    'Rinf', 'atm', 'eV', 'Na', 'kB', 'qe', 'me', 'mp', 'mn', 'ke', 'bW',
    'Vm', 'Me', 'Re', 'a0', 'ly', 'au', 'ε0', 'μ0'];

  function backspace() {
    if (S.done) { S.expr = ''; S.done = false; showResult('', false, ''); paint(); return; }
    for (var i = 0; i < TOKENS.length; i++) {
      var t = TOKENS[i];
      if (S.expr.length >= t.length && S.expr.slice(-t.length) === t) {
        S.expr = S.expr.slice(0, -t.length);
        paint();
        return;
      }
    }
    S.expr = S.expr.slice(0, -1);
    paint();
  }

  /* autoclose brackets on ex "sin(30" */
  function autoClose(expr) {
    var open = 0;
    for (var i = 0; i < expr.length; i++) {
      var c = expr.charAt(i);
      if (c === '(') open++;
      else if (c === ')') open--;
    }
    while (open-- > 0) expr += ')';
    return expr;
  }

  function equals() {
    if (!S.expr) return;
    S.expr = autoClose(S.expr);
    paint();
    var v;
    try {
      v = C.evaluate(S.expr, S);
    } catch (e) {
      showResult(e.message || 'Error', true, '');
      buzz(60);
      return;
    }
    S.Ans = v;
    S.done = true;
    var txt = C.fmt(v, S.sig);
    var ex = C.exact(v);
    showResult(txt, false, ex && ex !== txt ? ex : '');
    S.hist.unshift({ e: S.expr, r: txt });
    S.hist = S.hist.slice(0, 40);
    save();
    paint();
  }

  var ACTIONS = {
    back: backspace,
    ac: function () { S.expr = ''; S.done = false; showResult('', false, ''); paint(); },
    paren: smartParen,
    eq: equals,
    drg: function () {
      S.angle = S.angle === 'DEG' ? 'RAD' : S.angle === 'RAD' ? 'GRA' : 'DEG';
      save(); paint();
    },
    sig: function () {
      S.sig = S.sig >= 12 ? 4 : S.sig + 2;
      elExact.textContent = S.sig + ' sig fig';
      if (S.done) { showResult(C.fmt(S.Ans, S.sig), false, C.exact(S.Ans) || ''); }
      save();
    },
    mplus: function () { S.M += S.Ans; save(); paint(); },
    mminus: function () { S.M -= S.Ans; save(); paint(); },
    mc: function () { S.M = 0; save(); paint(); },
    factor: function () {
      if (!S.expr) return;
      var n;
      S.expr = autoClose(S.expr);
      paint();
      try { n = C.evaluate(S.expr, S); }
      catch (e) { showResult(e.message || 'Error', true, ''); buzz(60); return; }

      var r = C.factorize(n);
      if (!r) {
        showResult(n > 9007199254740991 ? 'Too large' : 'Whole number ≥ 1', true, '');
        buzz(60);
        return;
      }
      S.Ans = n;
      S.done = true;
      var whole = function (v) {
        return (typeof v === 'number' && isFinite(v) && Math.abs(v) <= 9007199254740991 &&
          Math.floor(v) === v) ? String(v) : C.fmt(v, 12);
      };
      var stats = 'd ' + whole(r.d) + ' · σ ' + whole(r.sigma) + ' · φ ' + whole(r.phi);
      if (n === 1) showResult('1', false, 'no prime factors');
      else if (r.factors.length === 1 && r.factors[0][1] === 1) showResult('prime', false, stats);
      else showResult(C.factorString(r.factors), false, stats);
      save();
    },
    const: function () { openSheet('sheet-const'); },
    hist: function () { renderHist(); openSheet('sheet-hist'); }
  };

  function fire(k, secondary) {
    var a = secondary && k.s ? k.s : k;
    buzz(secondary ? 25 : 10);
    if (a.a) { ACTIONS[a.a](); return; }
    if (!a.i) return;
    insert(a.i);
    /* hop back to the number pad instead of making the user swipe home. */
    if (S.page !== 0 && !a.stay && !PAGES[S.page].standalone) goPage(0);
  }

  /* input handling */
  var LONG_MS = 420;

  function bindPad() {
    var pad = $('pad');
    var timer = null, longFired = false, curKey = null;
    var x0 = 0, y0 = 0, dragging = false, swiped = false;

    function clearPress() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (curKey) { curKey.classList.remove('press'); curKey = null; }
    }

    pad.addEventListener('touchstart', function (ev) {
      var t = ev.touches[0];
      x0 = t.clientX; y0 = t.clientY;
      dragging = true; swiped = false; longFired = false;
      var el = ev.target.closest ? ev.target.closest('.k') : null;
      if (!el) return;
      curKey = el;
      el.classList.add('press');
      timer = setTimeout(function () {
        if (curKey && curKey._k.s && !swiped) { longFired = true; fire(curKey._k, true); }
        clearPress();
      }, LONG_MS);
    }, { passive: true });

    pad.addEventListener('touchmove', function (ev) {
      if (!dragging) return;
      var t = ev.touches[0];
      var dx = t.clientX - x0, dy = t.clientY - y0;
      if (!swiped && Math.abs(dx) > 22 && Math.abs(dx) > Math.abs(dy)) {
        swiped = true;
        clearPress();
        goPage(S.page + (dx < 0 ? 1 : -1));
        buzz(8);
      } else if (Math.abs(dx) > 12 || Math.abs(dy) > 12) {
        clearPress();
      }
    }, { passive: true });

    pad.addEventListener('touchend', function (ev) {
      dragging = false;
      var el = curKey;
      var fired = longFired;
      clearPress();
      if (el && !fired && !swiped) { ev.preventDefault(); fire(el._k, false); }
    }, { passive: false });

    pad.addEventListener('touchcancel', function () { dragging = false; clearPress(); }, { passive: true });

    /* allow mouse */
    pad.addEventListener('click', function (ev) {
      if ('ontouchstart' in window) return;
      var el = ev.target.closest('.k');
      if (el) fire(el._k, false);
    });

    window.addEventListener('wheel', function (ev) {
      if (document.querySelector('.sheet.open')) return;
      goPage(S.page + (ev.deltaY > 0 || ev.deltaX > 0 ? 1 : -1));
      buzz(8);
    }, { passive: true });

    /* physical keyboard support */
    window.addEventListener('keydown', function (ev) {
      var k = ev.key;
      if (/^[0-9.+\-*/^()!%,]$/.test(k)) insert(k);
      else if (k === 'e' || k === 'E') insert('E');
      else if (k === 'p') insert('π');
      else if (k === 'Enter' || k === '=') equals();
      else if (k === 'Backspace') backspace();
      else if (k === 'Escape') ACTIONS.ac();
      else if (k === 'ArrowRight') goPage(S.page + 1);
      else if (k === 'ArrowLeft') goPage(S.page - 1);
      else return;
      ev.preventDefault();
    });

    /* tap the page name to cycle keypads */
    elPage.addEventListener('click', function () {
      goPage(S.page >= PAGES.length - 1 ? 0 : S.page + 1);
    });
    /* tap the result to push it back into the expression */
    elRes.addEventListener('click', function () {
      if (S.done) { S.expr = 'Ans'; S.done = false; showResult('', false, ''); paint(); }
    });
  }

  /* sheets */
  function curveList(sheet) {
    var W = document.documentElement.clientWidth;
    var H = document.documentElement.clientHeight;
    var R = Math.min(W, H) / 2, cy = H / 2;
    var items = sheet.getElementsByClassName('item');
    var top = sheet.scrollTop;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var y0 = it.offsetTop - top, y1 = y0 + it.offsetHeight;
      if (y1 < -H || y0 > 2 * H) continue;
      var dy = Math.max(Math.abs(y0 - cy), Math.abs(y1 - cy));
      var half = dy >= R ? 0 : Math.sqrt(R * R - dy * dy);
      it.style.width = Math.max(R * 0.5, 2 * half - 6) + 'px';
    }
  }

  function bindCurve(sheet) {
    var ticking = false;
    sheet.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { curveList(sheet); ticking = false; });
    }, { passive: true });
  }

  function openSheet(id) {
    var s = $(id);
    s.classList.add('open');
    s.scrollTop = 0;
    curveList(s);
  }
  function closeSheets() {
    var s = document.querySelectorAll('.sheet.open');
    for (var i = 0; i < s.length; i++) s[i].classList.remove('open');
  }

  function buildConst() {
    var box = $('const-list');
    C.CONST_LIST.forEach(function (c) {
      var d = document.createElement('div');
      d.className = 'item';
      d.innerHTML = '<div><span class="sym">' + c[0] + '</span> ' +
        '<span class="val">' + C.fmt(c[1], 12) + '</span></div>' +
        '<div class="lab">' + c[2] + '</div>';
      d.onclick = function () { closeSheets(); insert(c[0]); buzz(); };
      box.appendChild(d);
    });
  }

  function renderHist() {
    var box = $('hist-list');
    box.innerHTML = '';
    if (!S.hist.length) {
      box.innerHTML = '<div class="empty">no history yet</div>';
      return;
    }
    S.hist.forEach(function (h) {
      var d = document.createElement('div');
      d.className = 'item';
      d.innerHTML = '<div class="hexpr">' + C.pretty(h.e) + '</div>' +
        '<div class="hres">' + h.r + '</div>';
      d.onclick = function () { closeSheets(); insert('(' + h.e + ')'); buzz(); };
      box.appendChild(d);
    });
  }

  /* boot */
  function init() {
    elExpr = $('expr'); elRes = $('res'); elExact = $('exact');
    elAngle = $('angle'); elMem = $('mem'); elPage = $('page-name');
    setUnit();
    var resync = function () { setUnit(); goPage(S.page); };
    window.addEventListener('resize', resync);
    window.addEventListener('orientationchange', resync);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') resync();
    });
    buildPad();
    buildConst();
    bindPad();
    var cl = document.querySelectorAll('.close');
    for (var i = 0; i < cl.length; i++) cl[i].onclick = closeSheets;
    var sh = document.querySelectorAll('.sheet');
    for (var j = 0; j < sh.length; j++) bindCurve(sh[j]);
    goPage(0);
    paint();

    if ('serviceWorker' in navigator && location.search.indexOf('nosw') === -1) {
      navigator.serviceWorker.register('sw.js').catch(function () { });
    }
    /* keep the watch screen alive while calculating */
    if (navigator.wakeLock) {
      var req = function () {
        navigator.wakeLock.request('screen').catch(function () { });
      };
      req();
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') req();
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
