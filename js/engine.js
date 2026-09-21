(function (g) {
  'use strict';

  var PI = Math.PI;
  var CONST_LIST = [
    ['π', Math.PI, 'pi'],
    ['e', Math.E, 'Euler’s number'],
    ['g', 9.80665, 'gravity  m/s²'],
    ['c', 299792458, 'speed of light  m/s'],
    ['h', 6.62607015e-34, 'Planck  J·s'],
    ['ħ', 1.054571817e-34, 'reduced Planck  J·s'],
    ['G', 6.67430e-11, 'grav. const  N·m²/kg²'],
    ['Na', 6.02214076e23, 'Avogadro  /mol'],
    ['R', 8.314462618, 'gas const  J/mol·K'],
    ['kB', 1.380649e-23, 'Boltzmann  J/K'],
    ['qe', 1.602176634e-19, 'elementary charge  C'],
    ['eV', 1.602176634e-19, 'electronvolt  J'],
    ['me', 9.1093837015e-31, 'electron mass  kg'],
    ['mp', 1.67262192369e-27, 'proton mass  kg'],
    ['mn', 1.67492749804e-27, 'neutron mass  kg'],
    ['u', 1.66053906660e-27, 'atomic mass unit  kg'],
    ['ε0', 8.8541878128e-12, 'permittivity  F/m'],
    ['μ0', 1.25663706212e-6, 'permeability  H/m'],
    ['ke', 8.9875517873681764e9, 'Coulomb const  N·m²/C²'],
    ['F', 96485.33212, 'Faraday  C/mol'],
    ['σ', 5.670374419e-8, 'Stefan–Boltzmann  W/m²K⁴'],
    ['bW', 2.897771955e-3, 'Wien displacement  m·K'],
    ['Rinf', 1.0973731568160e7, 'Rydberg  /m'],
    ['a0', 5.29177210903e-11, 'Bohr radius  m'],
    ['atm', 101325, 'atmosphere  Pa'],
    ['Vm', 0.02241396954, 'molar volume STP  m³/mol'],
    ['Me', 5.9722e24, 'Earth mass  kg'],
    ['Re', 6.371e6, 'Earth radius  m'],
    ['ly', 9.4607304725808e15, 'light year  m'],
    ['au', 1.495978707e11, 'astronomical unit  m']
  ];
  var CONSTS = {};
  for (var ci = 0; ci < CONST_LIST.length; ci++) CONSTS[CONST_LIST[ci][0]] = CONST_LIST[ci][1];

  /* errors */
  function CErr(m) { this.message = m; }
  CErr.prototype.toString = function () { return this.message; };
  function err(m) { throw new CErr(m); }

  /* special functions */
  function gamma(z) {
    var p = [676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012,
      9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return PI / (Math.sin(PI * z) * gamma(1 - z));
    z -= 1;
    var x = 0.99999999999980993;
    for (var i = 0; i < 8; i++) x += p[i] / (z + i + 1);
    var t = z + 7.5;
    return Math.sqrt(2 * PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }

  function factorial(n) {
    if (Number.isInteger(n)) {
      if (n < 0) err('Math Error');
      if (n > 170) return Infinity;
      var r = 1;
      for (var i = 2; i <= n; i++) r *= i;
      return r;
    }
    if (n < 0) err('Math Error');
    return gamma(n + 1);
  }

  function gcdi(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }

  function nPr(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r) || r < 0 || n < 0 || r > n) err('Math Error');
    var p = 1;
    for (var i = 0; i < r; i++) p *= (n - i);
    return p;
  }
  function nCr(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r) || r < 0 || n < 0 || r > n) err('Math Error');
    r = Math.min(r, n - r);
    var c = 1;
    for (var i = 1; i <= r; i++) c = c * (n - r + i) / i;
    return c < 9e15 ? Math.round(c) : c;
  }

  /* angle mode */
  function toRad(x, env) {
    if (env.angle === 'DEG') return x * PI / 180;
    if (env.angle === 'GRA') return x * PI / 200;
    return x;
  }
  function fromRad(x, env) {
    if (env.angle === 'DEG') return x * 180 / PI;
    if (env.angle === 'GRA') return x * 200 / PI;
    return x;
  }
  function trig(name, x, env) {
    if (env.angle !== 'RAD') {
      var per = env.angle === 'DEG' ? 360 : 400;
      var q = env.angle === 'DEG' ? 90 : 100;
      var r = x % per;
      if (Math.abs(r % q) < 1e-11) {
        var k = ((Math.round(r / q) % 4) + 4) % 4;
        if (name === 'sin') return [0, 1, 0, -1][k];
        if (name === 'cos') return [1, 0, -1, 0][k];
        if (k === 1 || k === 3) err('Math Error');
        return 0;
      }
    }
    var v = Math[name](toRad(x, env));
    if (env.angle !== 'RAD' && Math.abs(v) < 1e-12) v = 0;
    return v;
  }

  /* function tables */
  var FN1 = {
    sin: function (x, e) { return trig('sin', x, e); },
    cos: function (x, e) { return trig('cos', x, e); },
    tan: function (x, e) { return trig('tan', x, e); },
    asin: function (x, e) { if (x < -1 || x > 1) err('Math Error'); return fromRad(Math.asin(x), e); },
    acos: function (x, e) { if (x < -1 || x > 1) err('Math Error'); return fromRad(Math.acos(x), e); },
    atan: function (x, e) { return fromRad(Math.atan(x), e); },
    sec: function (x, e) { var c = trig('cos', x, e); if (c === 0) err('Math Error'); return 1 / c; },
    csc: function (x, e) { var v = trig('sin', x, e); if (v === 0) err('Math Error'); return 1 / v; },
    cot: function (x, e) { var v = trig('sin', x, e); if (v === 0) err('Math Error'); return trig('cos', x, e) / v; },
    asec: function (x, e) { if (Math.abs(x) < 1) err('Math Error'); return fromRad(Math.acos(1 / x), e); },
    acsc: function (x, e) { if (Math.abs(x) < 1) err('Math Error'); return fromRad(Math.asin(1 / x), e); },
    acot: function (x, e) {
      var r = x === 0 ? PI / 2 : (x > 0 ? Math.atan(1 / x) : PI + Math.atan(1 / x));
      return fromRad(r, e);
    },
    sinh: function (x) { return Math.sinh(x); },
    cosh: function (x) { return Math.cosh(x); },
    tanh: function (x) { return Math.tanh(x); },
    asinh: function (x) { return Math.asinh(x); },
    acosh: function (x) { if (x < 1) err('Math Error'); return Math.acosh(x); },
    atanh: function (x) { if (x <= -1 || x >= 1) err('Math Error'); return Math.atanh(x); },
    ln: function (x) { if (x <= 0) err('Math Error'); return Math.log(x); },
    log: function (x) { if (x <= 0) err('Math Error'); return Math.log(x) / Math.LN10; },
    log2: function (x) { if (x <= 0) err('Math Error'); return Math.log(x) / Math.LN2; },
    sqrt: function (x) { if (x < 0) err('Math Error'); return Math.sqrt(x); },
    cbrt: function (x) { return Math.cbrt(x); },
    abs: function (x) { return Math.abs(x); },
    exp: function (x) { return Math.exp(x); },
    sign: function (x) { return Math.sign(x); },
    floor: function (x) { return Math.floor(x); },
    ceil: function (x) { return Math.ceil(x); },
    round: function (x) { return Math.round(x); },
    deg: function (x) { return x * 180 / PI; },
    rad: function (x) { return x * PI / 180; },
    fact: factorial
  };

  var FN2 = {
    nCr: nCr,
    nPr: nPr,
    mod: function (a, b) { if (b === 0) err('Math Error'); return a % b; },
    gcd: function (a, b) { return gcdi(a, b); },
    lcm: function (a, b) { var d = gcdi(a, b); return d ? Math.abs(a * b) / d : 0; },
    logb: function (b, x) { if (x <= 0 || b <= 0 || b === 1) err('Math Error'); return Math.log(x) / Math.log(b); },
    root: function (n, x) {
      if (n === 0) err('Math Error');
      if (x < 0) {
        if (Number.isInteger(n) && Math.abs(n % 2) === 1) return -Math.pow(-x, 1 / n);
        err('Math Error');
      }
      return Math.pow(x, 1 / n);
    },
    max: function (a, b) { return Math.max(a, b); },
    min: function (a, b) { return Math.min(a, b); }
  };

  var NAMES = Object.keys(FN1).concat(Object.keys(FN2), Object.keys(CONSTS), ['Ans', 'M'])
    .sort(function (a, b) { return b.length - a.length; });

  /* tokenizer */
  var NUM_RE = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/;

  function tokenize(src, env) {
    var out = [], i = 0, n = src.length;
    while (i < n) {
      var ch = src.charAt(i);
      if (ch === ' ') { i++; continue; }

      var m = NUM_RE.exec(src.slice(i));
      if (m) { out.push({ t: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue; }

      var name = null;
      for (var k = 0; k < NAMES.length; k++) {
        if (src.substr(i, NAMES[k].length) === NAMES[k]) { name = NAMES[k]; break; }
      }
      if (name) {
        if (FN1[name]) out.push({ t: 'f1', v: name });
        else if (FN2[name]) out.push({ t: 'f2', v: name });
        else if (name === 'Ans') out.push({ t: 'num', v: env.Ans });
        else if (name === 'M') out.push({ t: 'num', v: env.M });
        else out.push({ t: 'num', v: CONSTS[name] });
        i += name.length;
        continue;
      }

      if (ch === '×') { out.push({ t: 'op', v: '*' }); i++; continue; }
      if (ch === '÷') { out.push({ t: 'op', v: '/' }); i++; continue; }
      if (ch === '−') { out.push({ t: 'op', v: '-' }); i++; continue; }
      if ('+-*/^'.indexOf(ch) > -1) { out.push({ t: 'op', v: ch }); i++; continue; }
      if (ch === '(' || ch === ')' || ch === ',') { out.push({ t: ch }); i++; continue; }
      if (ch === '!' || ch === '%') { out.push({ t: 'post', v: ch }); i++; continue; }

      err('Syntax Error');
    }
    return out;
  }

  /* precedence */
  var PREC = { '+': 2, '-': 2, '*': 3, '/': 3, 'IMUL': 4, 'u-': 5, '^': 6 };
  var RIGHT = { 'u-': 1, '^': 1 };
  var INFIX = 3.5;

  function toRPN(toks) {
    var out = [], st = [], prev = null;

    function precOf(t) {
      if (t === '(') return -1;
      if (t.charAt(0) === '@') return INFIX;
      if (FN1[t] || FN2[t]) return -1;
      return PREC[t];
    }
    function emit(o) {
      if (o.charAt(0) === '@') return { t: 'fn', v: o.slice(1) };
      return { t: (FN1[o] || FN2[o]) ? 'fn' : 'op', v: o };
    }
    function popWhile(p, right) {
      while (st.length) {
        var tp = precOf(st[st.length - 1]);
        if (tp < 0) break;
        if (tp > p || (tp === p && !right)) out.push(emit(st.pop()));
        else break;
      }
    }
    function imul() { popWhile(PREC.IMUL, false); st.push('IMUL'); }

    for (var i = 0; i < toks.length; i++) {
      var tk = toks[i];

      if (tk.t === 'num') {
        if (prev === 'value') imul();
        out.push(tk); prev = 'value';

      } else if (tk.t === 'f2' && prev === 'value') {
        popWhile(INFIX, false);
        st.push('@' + tk.v); prev = 'op';

      } else if (tk.t === 'f1' || tk.t === 'f2') {
        if (prev === 'value') imul();
        st.push(tk.v); prev = 'func';

      } else if (tk.t === '(') {
        if (prev === 'value') imul();
        st.push('('); prev = 'open';

      } else if (tk.t === ')') {
        while (st.length && st[st.length - 1] !== '(') out.push(emit(st.pop()));
        if (!st.length) err('Syntax Error');
        st.pop();
        if (st.length && (FN1[st[st.length - 1]] || FN2[st[st.length - 1]])) {
          out.push({ t: 'fn', v: st.pop() });
        }
        prev = 'value';

      } else if (tk.t === ',') {
        while (st.length && st[st.length - 1] !== '(') out.push(emit(st.pop()));
        if (!st.length) err('Syntax Error');
        prev = 'comma';

      } else if (tk.t === 'op') {
        var unary = (prev === null || prev === 'open' || prev === 'comma' || prev === 'op');
        if (unary) {
          if (tk.v === '-') st.push('u-');
          else if (tk.v !== '+') err('Syntax Error');
        } else {
          popWhile(PREC[tk.v], RIGHT[tk.v]);
          st.push(tk.v);
        }
        prev = 'op';

      } else if (tk.t === 'post') {
        if (prev !== 'value') err('Syntax Error');
        out.push({ t: 'post', v: tk.v });
        prev = 'value';
      }
    }
    while (st.length) {
      var o = st.pop();
      if (o === '(') err('Syntax Error');
      out.push(emit(o));
    }
    if (!out.length) err('Syntax Error');
    return out;
  }

  function evalRPN(rpn, env) {
    var s = [];
    function pop() { if (!s.length) err('Syntax Error'); return s.pop(); }
    for (var i = 0; i < rpn.length; i++) {
      var tk = rpn[i], a, b;
      if (tk.t === 'num') { s.push(tk.v); continue; }
      if (tk.t === 'post') {
        a = pop();
        s.push(tk.v === '!' ? factorial(a) : a / 100);
        continue;
      }
      if (tk.t === 'fn') {
        if (FN1[tk.v]) { s.push(FN1[tk.v](pop(), env)); }
        else { b = pop(); a = pop(); s.push(FN2[tk.v](a, b, env)); }
        continue;
      }
      switch (tk.v) {
        case 'u-': s.push(-pop()); break;
        case '+': b = pop(); a = pop(); s.push(a + b); break;
        case '-': b = pop(); a = pop(); s.push(a - b); break;
        case '*':
        case 'IMUL': b = pop(); a = pop(); s.push(a * b); break;
        case '/': b = pop(); a = pop(); if (b === 0) err('Divide by 0'); s.push(a / b); break;
        case '^': b = pop(); a = pop();
          if (a < 0 && !Number.isInteger(b)) err('Math Error');
          s.push(Math.pow(a, b)); break;
        default: err('Syntax Error');
      }
    }
    if (s.length !== 1) err('Syntax Error');
    var r = s[0];
    if (typeof r !== 'number' || isNaN(r)) err('Math Error');
    return r;
  }

  function evaluate(src, env) {
    env = env || { angle: 'DEG', Ans: 0, M: 0 };
    return evalRPN(toRPN(tokenize(src, env)), env);
  }

  /* output formatting */
  var SUP = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '-': '⁻', '+': ''
  };
  function sup(s) {
    var o = '';
    s = String(s);
    for (var i = 0; i < s.length; i++) o += (SUP[s.charAt(i)] !== undefined ? SUP[s.charAt(i)] : s.charAt(i));
    return o;
  }
  function trimNum(s) {
    if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('-', '−');
  }
  function fmt(x, sig) {
    sig = sig || 10;
    if (typeof x !== 'number' || isNaN(x)) return 'Math Error';
    if (!isFinite(x)) return (x > 0 ? '∞' : '−∞');
    if (x === 0) return '0';
    var ax = Math.abs(x), p;
    if (ax >= 1e13 || ax < 1e-9) {
      p = x.toExponential(sig - 1).split('e');
      return trimNum(p[0]) + '×10' + sup(p[1]);
    }
    var s = String(Number(x.toPrecision(sig)));
    if (s.indexOf('e') > -1) {
      p = s.split('e');
      return trimNum(p[0]) + '×10' + sup(p[1]);
    }
    return trimNum(s);
  }

  /* exact form */
  function cfrac(x, maxDen, tol) {
    maxDen = maxDen || 4096; tol = tol || 1e-11;
    if (!isFinite(x)) return null;
    var neg = x < 0; x = Math.abs(x);
    if (x > 1e7) return null;
    var h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = x;
    for (var i = 0; i < 32; i++) {
      var a = Math.floor(b);
      var h2 = a * h1 + h0, k2 = a * k1 + k0;
      if (k2 > maxDen) break;
      h0 = h1; h1 = h2; k0 = k1; k1 = k2;
      if (Math.abs(h1 / k1 - x) <= tol * Math.max(1, x)) return { n: neg ? -h1 : h1, d: k1 };
      var f = b - a;
      if (f < 1e-13) break;
      b = 1 / f;
    }
    return null;
  }
  function simpRad(n) {
    var a = 1, b = n;
    for (var f = 2; f * f <= b; f++) {
      while (b % (f * f) === 0) { b /= f * f; a *= f; }
    }
    return { a: a, b: b };
  }
  function exact(x) {
    if (!isFinite(x) || x === 0 || Math.abs(x) > 1e6) return null;
    var r = cfrac(x, 2000);
    if (r) {
      if (r.d === 1) return null;
      if (Math.abs(r.n) < 100000) return (r.n < 0 ? '−' : '') + Math.abs(r.n) + '/' + r.d;
    }
    var rp = cfrac(x / PI, 400);
    if (rp && Math.abs(rp.n) < 400) {
      var num = Math.abs(rp.n) === 1 ? '' : Math.abs(rp.n);
      return (rp.n < 0 ? '−' : '') + num + 'π' + (rp.d === 1 ? '' : '/' + rp.d);
    }
    var rs = cfrac(x * x, 400);
    if (rs && rs.n > 0 && rs.n < 100000) {
      var s = simpRad(rs.n * rs.d);
      if (s.b > 1) {
        var a = s.a, d = rs.d, gg = gcdi(a, d);
        a /= gg; d /= gg;
        return (x < 0 ? '−' : '') + (a === 1 ? '' : a) + '√' + s.b + (d === 1 ? '' : '/' + d);
      }
    }
    return null;
  }

  var PRETTY = [
    [/asinh\(/g, 'sinh⁻¹('], [/acosh\(/g, 'cosh⁻¹('], [/atanh\(/g, 'tanh⁻¹('],
    [/asin\(/g, 'sin⁻¹('], [/acos\(/g, 'cos⁻¹('], [/atan\(/g, 'tan⁻¹('],
    [/asec\(/g, 'sec⁻¹('], [/acsc\(/g, 'cosec⁻¹('], [/acot\(/g, 'cot⁻¹('],
    [/csc\(/g, 'cosec('],
    [/nCr/g, 'C'], [/nPr/g, 'P'], [/root/g, 'ʸ√'], [/logb/g, 'log_'],
    [/mod/g, ' mod '], [/gcd/g, ' gcd '], [/lcm/g, ' lcm '],
    [/sqrt\(/g, '√('], [/cbrt\(/g, '³√('],
    [/\*/g, '×'], [/\//g, '÷'], [/-/g, '−']
  ];
  function pretty(s) {
    for (var i = 0; i < PRETTY.length; i++) s = s.replace(PRETTY[i][0], PRETTY[i][1]);
    return s;
  }

  /* number theory (the prime-factorisation page) ----------
     Trial division by a mod-30 wheel up to 10^5 fully factors anything up to
     10^10. Past that the leftover is split with Miller-Rabin + Pollard rho,
     which needs exact 64-bit modular multiplication and therefore BigInt. */
  var HAS_BIG = (typeof BigInt === 'function');

  function mulmodB(a, b, m) { return Number((BigInt(a) * BigInt(b)) % BigInt(m)); }
  function powmodB(a, e, m) {
    var ONE = BigInt(1), ZERO = BigInt(0), TWO = BigInt(2);
    var M = BigInt(m), A = BigInt(a) % M, E = BigInt(e), R = ONE;
    while (E > ZERO) {
      if (E % TWO === ONE) R = (R * A) % M;
      A = (A * A) % M;
      E = E / TWO;
    }
    return Number(R);
  }

  var MR_BASES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

  function isPrime(n) {
    if (n < 2) return false;
    for (var i = 0; i < MR_BASES.length; i++) {
      if (n === MR_BASES[i]) return true;
      if (n % MR_BASES[i] === 0) return false;
    }
    if (n < 41 * 41) return true;
    var d = n - 1, r = 0;
    while (d % 2 === 0) { d /= 2; r++; }
    for (i = 0; i < MR_BASES.length; i++) {
      var x = powmodB(MR_BASES[i], d, n);
      if (x === 1 || x === n - 1) continue;
      var witness = true;
      for (var j = 1; j < r; j++) {
        x = mulmodB(x, x, n);
        if (x === n - 1) { witness = false; break; }
      }
      if (witness) return false;
    }
    return true;
  }

  /* Brent's variant of Pollard rho */
  function pollard(n) {
    if (n % 2 === 0) return 2;
    for (var c = 1; c < 100; c++) {
      var x = 2, y = 2, d = 1;
      for (var guard = 0; guard < 2000000 && d === 1; guard++) {
        x = (mulmodB(x, x, n) + c) % n;
        y = (mulmodB(y, y, n) + c) % n;
        y = (mulmodB(y, y, n) + c) % n;
        d = gcdi(Math.abs(x - y), n);
      }
      if (d !== 1 && d !== n) return d;
    }
    return 0;
  }

  function factorize(n) {
    if (!Number.isInteger(n) || n < 1 || n > 9007199254740991) return null;
    if (!HAS_BIG && n > 1e12) return null;

    var map = {}, order = [];
    function add(p) {
      if (map[p] === undefined) { map[p] = 0; order.push(p); }
      map[p]++;
    }

    var m = n, i;
    var seeds = [2, 3, 5];
    for (i = 0; i < 3; i++) while (m % seeds[i] === 0) { add(seeds[i]); m /= seeds[i]; }

    var wheel = [4, 2, 4, 2, 4, 6, 2, 6], f = 7, k = 0;
    while (f <= 100000 && f * f <= m) {
      if (m % f === 0) { while (m % f === 0) { add(f); m /= f; } }
      f += wheel[k]; k = (k + 1) % 8;
    }

    var stack = m > 1 ? [m] : [];
    while (stack.length) {
      var v = stack.pop();
      if (v === 1) continue;
      if (v <= 1e10 || isPrime(v)) { add(v); continue; }
      var g = pollard(v);
      if (!g) { add(v); continue; }
      stack.push(g); stack.push(v / g);
    }

    order.sort(function (a, b) { return a - b; });
    var factors = [], d = 1, sigma = 1, phi = 1;
    for (i = 0; i < order.length; i++) {
      var p = order[i], e = map[p];
      factors.push([p, e]);
      d *= (e + 1);
      var term = 1, pk = 1;
      for (var j = 0; j < e; j++) { pk *= p; term += pk; }
      sigma *= term;
      phi *= (pk / p) * (p - 1);
    }
    return { factors: factors, d: d, sigma: sigma, phi: phi };
  }

  function factorString(factors) {
    var out = '';
    for (var i = 0; i < factors.length; i++) {
      if (i) out += '×';
      out += factors[i][0] + (factors[i][1] > 1 ? sup(factors[i][1]) : '');
    }
    return out;
  }

  g.Calc = {
    evaluate: evaluate, fmt: fmt, exact: exact, pretty: pretty, sup: sup,
    factorize: factorize, factorString: factorString, isPrime: isPrime,
    CONST_LIST: CONST_LIST, CErr: CErr
  };
})(typeof window !== 'undefined' ? window : this);
