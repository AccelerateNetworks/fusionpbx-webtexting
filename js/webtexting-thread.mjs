const hr = {
  data() {
    return {
      messages: []
    };
  },
  props: {
    remoteNumber: {
      type: String
    },
    groupUUID: {
      type: String
    },
    displayName: {
      type: String
    }
  }
};
function gn(e, t) {
  const n = /* @__PURE__ */ Object.create(null), s = e.split(",");
  for (let r = 0; r < s.length; r++)
    n[s[r]] = !0;
  return t ? (r) => !!n[r.toLowerCase()] : (r) => !!n[r];
}
const $ = {}, Le = [], ce = () => {
}, pr = () => !1, gr = /^on[^a-z]/, Nt = (e) => gr.test(e), mn = (e) => e.startsWith("onUpdate:"), J = Object.assign, _n = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, mr = Object.prototype.hasOwnProperty, N = (e, t) => mr.call(e, t), P = Array.isArray, We = (e) => jt(e) === "[object Map]", ws = (e) => jt(e) === "[object Set]", A = (e) => typeof e == "function", W = (e) => typeof e == "string", bn = (e) => typeof e == "symbol", B = (e) => e !== null && typeof e == "object", vs = (e) => B(e) && A(e.then) && A(e.catch), Es = Object.prototype.toString, jt = (e) => Es.call(e), _r = (e) => jt(e).slice(8, -1), Cs = (e) => jt(e) === "[object Object]", xn = (e) => W(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Et = /* @__PURE__ */ gn(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), St = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, br = /-(\w)/g, me = St((e) => e.replace(br, (t, n) => n ? n.toUpperCase() : "")), xr = /\B([A-Z])/g, Ve = St(
  (e) => e.replace(xr, "-$1").toLowerCase()
), Ht = St(
  (e) => e.charAt(0).toUpperCase() + e.slice(1)
), Yt = St(
  (e) => e ? `on${Ht(e)}` : ""
), It = (e, t) => !Object.is(e, t), Vt = (e, t) => {
  for (let n = 0; n < e.length; n++)
    e[n](t);
}, At = (e, t, n) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, yr = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let zn;
const tn = () => zn || (zn = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function yn(e) {
  if (P(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = W(s) ? Cr(s) : yn(s);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else {
    if (W(e))
      return e;
    if (B(e))
      return e;
  }
}
const wr = /;(?![^(]*\))/g, vr = /:([^]+)/, Er = /\/\*[^]*?\*\//g;
function Cr(e) {
  const t = {};
  return e.replace(Er, "").split(wr).forEach((n) => {
    if (n) {
      const s = n.split(vr);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function wn(e) {
  let t = "";
  if (W(e))
    t = e;
  else if (P(e))
    for (let n = 0; n < e.length; n++) {
      const s = wn(e[n]);
      s && (t += s + " ");
    }
  else if (B(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Or = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Tr = /* @__PURE__ */ gn(Or);
function Os(e) {
  return !!e || e === "";
}
const Pr = (e) => W(e) ? e : e == null ? "" : P(e) || B(e) && (e.toString === Es || !A(e.toString)) ? JSON.stringify(e, Ts, 2) : String(e), Ts = (e, t) => t && t.__v_isRef ? Ts(e, t.value) : We(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce((n, [s, r]) => (n[`${s} =>`] = r, n), {})
} : ws(t) ? {
  [`Set(${t.size})`]: [...t.values()]
} : B(t) && !P(t) && !Cs(t) ? String(t) : t;
let re;
class Ir {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this.effects = [], this.cleanups = [], this.parent = re, !t && re && (this.index = (re.scopes || (re.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(t) {
    if (this._active) {
      const n = re;
      try {
        return re = this, t();
      } finally {
        re = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    re = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    re = this.parent;
  }
  stop(t) {
    if (this._active) {
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.scopes)
        for (n = 0, s = this.scopes.length; n < s; n++)
          this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function Ar(e, t = re) {
  t && t.active && t.effects.push(e);
}
function Mr() {
  return re;
}
const vn = (e) => {
  const t = new Set(e);
  return t.w = 0, t.n = 0, t;
}, Ps = (e) => (e.w & Pe) > 0, Is = (e) => (e.n & Pe) > 0, Fr = ({ deps: e }) => {
  if (e.length)
    for (let t = 0; t < e.length; t++)
      e[t].w |= Pe;
}, Rr = (e) => {
  const { deps: t } = e;
  if (t.length) {
    let n = 0;
    for (let s = 0; s < t.length; s++) {
      const r = t[s];
      Ps(r) && !Is(r) ? r.delete(e) : t[n++] = r, r.w &= ~Pe, r.n &= ~Pe;
    }
    t.length = n;
  }
}, nn = /* @__PURE__ */ new WeakMap();
let tt = 0, Pe = 1;
const sn = 30;
let ie;
const He = Symbol(""), rn = Symbol("");
class En {
  constructor(t, n = null, s) {
    this.fn = t, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, Ar(this, s);
  }
  run() {
    if (!this.active)
      return this.fn();
    let t = ie, n = Oe;
    for (; t; ) {
      if (t === this)
        return;
      t = t.parent;
    }
    try {
      return this.parent = ie, ie = this, Oe = !0, Pe = 1 << ++tt, tt <= sn ? Fr(this) : qn(this), this.fn();
    } finally {
      tt <= sn && Rr(this), Pe = 1 << --tt, ie = this.parent, Oe = n, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    ie === this ? this.deferStop = !0 : this.active && (qn(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function qn(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
let Oe = !0;
const As = [];
function Xe() {
  As.push(Oe), Oe = !1;
}
function Ze() {
  const e = As.pop();
  Oe = e === void 0 ? !0 : e;
}
function te(e, t, n) {
  if (Oe && ie) {
    let s = nn.get(e);
    s || nn.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || s.set(n, r = vn()), Ms(r);
  }
}
function Ms(e, t) {
  let n = !1;
  tt <= sn ? Is(e) || (e.n |= Pe, n = !Ps(e)) : n = !e.has(ie), n && (e.add(ie), ie.deps.push(e));
}
function ye(e, t, n, s, r, i) {
  const o = nn.get(e);
  if (!o)
    return;
  let c = [];
  if (t === "clear")
    c = [...o.values()];
  else if (n === "length" && P(e)) {
    const u = Number(s);
    o.forEach((a, m) => {
      (m === "length" || m >= u) && c.push(a);
    });
  } else
    switch (n !== void 0 && c.push(o.get(n)), t) {
      case "add":
        P(e) ? xn(n) && c.push(o.get("length")) : (c.push(o.get(He)), We(e) && c.push(o.get(rn)));
        break;
      case "delete":
        P(e) || (c.push(o.get(He)), We(e) && c.push(o.get(rn)));
        break;
      case "set":
        We(e) && c.push(o.get(He));
        break;
    }
  if (c.length === 1)
    c[0] && on(c[0]);
  else {
    const u = [];
    for (const a of c)
      a && u.push(...a);
    on(vn(u));
  }
}
function on(e, t) {
  const n = P(e) ? e : [...e];
  for (const s of n)
    s.computed && Jn(s);
  for (const s of n)
    s.computed || Jn(s);
}
function Jn(e, t) {
  (e !== ie || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run());
}
const Nr = /* @__PURE__ */ gn("__proto__,__v_isRef,__isVue"), Fs = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(bn)
), jr = /* @__PURE__ */ Cn(), Sr = /* @__PURE__ */ Cn(!1, !0), Hr = /* @__PURE__ */ Cn(!0), Yn = /* @__PURE__ */ Ur();
function Ur() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const s = j(this);
      for (let i = 0, o = this.length; i < o; i++)
        te(s, "get", i + "");
      const r = s[t](...n);
      return r === -1 || r === !1 ? s[t](...n.map(j)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      Xe();
      const s = j(this)[t].apply(this, n);
      return Ze(), s;
    };
  }), e;
}
function $r(e) {
  const t = j(this);
  return te(t, "has", e), t.hasOwnProperty(e);
}
function Cn(e = !1, t = !1) {
  return function(s, r, i) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_isShallow")
      return t;
    if (r === "__v_raw" && i === (e ? t ? ei : Hs : t ? Ss : js).get(s))
      return s;
    const o = P(s);
    if (!e) {
      if (o && N(Yn, r))
        return Reflect.get(Yn, r, i);
      if (r === "hasOwnProperty")
        return $r;
    }
    const c = Reflect.get(s, r, i);
    return (bn(r) ? Fs.has(r) : Nr(r)) || (e || te(s, "get", r), t) ? c : G(c) ? o && xn(r) ? c : c.value : B(c) ? e ? Us(c) : Pn(c) : c;
  };
}
const Br = /* @__PURE__ */ Rs(), Dr = /* @__PURE__ */ Rs(!0);
function Rs(e = !1) {
  return function(n, s, r, i) {
    let o = n[s];
    if (ot(o) && G(o) && !G(r))
      return !1;
    if (!e && (!ln(r) && !ot(r) && (o = j(o), r = j(r)), !P(n) && G(o) && !G(r)))
      return o.value = r, !0;
    const c = P(n) && xn(s) ? Number(s) < n.length : N(n, s), u = Reflect.set(n, s, r, i);
    return n === j(i) && (c ? It(r, o) && ye(n, "set", s, r) : ye(n, "add", s, r)), u;
  };
}
function Kr(e, t) {
  const n = N(e, t);
  e[t];
  const s = Reflect.deleteProperty(e, t);
  return s && n && ye(e, "delete", t, void 0), s;
}
function Lr(e, t) {
  const n = Reflect.has(e, t);
  return (!bn(t) || !Fs.has(t)) && te(e, "has", t), n;
}
function Wr(e) {
  return te(e, "iterate", P(e) ? "length" : He), Reflect.ownKeys(e);
}
const Ns = {
  get: jr,
  set: Br,
  deleteProperty: Kr,
  has: Lr,
  ownKeys: Wr
}, zr = {
  get: Hr,
  set(e, t) {
    return !0;
  },
  deleteProperty(e, t) {
    return !0;
  }
}, qr = /* @__PURE__ */ J(
  {},
  Ns,
  {
    get: Sr,
    set: Dr
  }
), On = (e) => e, Ut = (e) => Reflect.getPrototypeOf(e);
function _t(e, t, n = !1, s = !1) {
  e = e.__v_raw;
  const r = j(e), i = j(t);
  n || (t !== i && te(r, "get", t), te(r, "get", i));
  const { has: o } = Ut(r), c = s ? On : n ? Mn : An;
  if (o.call(r, t))
    return c(e.get(t));
  if (o.call(r, i))
    return c(e.get(i));
  e !== r && e.get(t);
}
function bt(e, t = !1) {
  const n = this.__v_raw, s = j(n), r = j(e);
  return t || (e !== r && te(s, "has", e), te(s, "has", r)), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function xt(e, t = !1) {
  return e = e.__v_raw, !t && te(j(e), "iterate", He), Reflect.get(e, "size", e);
}
function Vn(e) {
  e = j(e);
  const t = j(this);
  return Ut(t).has.call(t, e) || (t.add(e), ye(t, "add", e, e)), this;
}
function Xn(e, t) {
  t = j(t);
  const n = j(this), { has: s, get: r } = Ut(n);
  let i = s.call(n, e);
  i || (e = j(e), i = s.call(n, e));
  const o = r.call(n, e);
  return n.set(e, t), i ? It(t, o) && ye(n, "set", e, t) : ye(n, "add", e, t), this;
}
function Zn(e) {
  const t = j(this), { has: n, get: s } = Ut(t);
  let r = n.call(t, e);
  r || (e = j(e), r = n.call(t, e)), s && s.call(t, e);
  const i = t.delete(e);
  return r && ye(t, "delete", e, void 0), i;
}
function Qn() {
  const e = j(this), t = e.size !== 0, n = e.clear();
  return t && ye(e, "clear", void 0, void 0), n;
}
function yt(e, t) {
  return function(s, r) {
    const i = this, o = i.__v_raw, c = j(o), u = t ? On : e ? Mn : An;
    return !e && te(c, "iterate", He), o.forEach((a, m) => s.call(r, u(a), u(m), i));
  };
}
function wt(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, i = j(r), o = We(i), c = e === "entries" || e === Symbol.iterator && o, u = e === "keys" && o, a = r[e](...s), m = n ? On : t ? Mn : An;
    return !t && te(
      i,
      "iterate",
      u ? rn : He
    ), {
      // iterator protocol
      next() {
        const { value: w, done: E } = a.next();
        return E ? { value: w, done: E } : {
          value: c ? [m(w[0]), m(w[1])] : m(w),
          done: E
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Ee(e) {
  return function(...t) {
    return e === "delete" ? !1 : this;
  };
}
function Jr() {
  const e = {
    get(i) {
      return _t(this, i);
    },
    get size() {
      return xt(this);
    },
    has: bt,
    add: Vn,
    set: Xn,
    delete: Zn,
    clear: Qn,
    forEach: yt(!1, !1)
  }, t = {
    get(i) {
      return _t(this, i, !1, !0);
    },
    get size() {
      return xt(this);
    },
    has: bt,
    add: Vn,
    set: Xn,
    delete: Zn,
    clear: Qn,
    forEach: yt(!1, !0)
  }, n = {
    get(i) {
      return _t(this, i, !0);
    },
    get size() {
      return xt(this, !0);
    },
    has(i) {
      return bt.call(this, i, !0);
    },
    add: Ee("add"),
    set: Ee("set"),
    delete: Ee("delete"),
    clear: Ee("clear"),
    forEach: yt(!0, !1)
  }, s = {
    get(i) {
      return _t(this, i, !0, !0);
    },
    get size() {
      return xt(this, !0);
    },
    has(i) {
      return bt.call(this, i, !0);
    },
    add: Ee("add"),
    set: Ee("set"),
    delete: Ee("delete"),
    clear: Ee("clear"),
    forEach: yt(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
    e[i] = wt(
      i,
      !1,
      !1
    ), n[i] = wt(
      i,
      !0,
      !1
    ), t[i] = wt(
      i,
      !1,
      !0
    ), s[i] = wt(
      i,
      !0,
      !0
    );
  }), [
    e,
    n,
    t,
    s
  ];
}
const [
  Yr,
  Vr,
  Xr,
  Zr
] = /* @__PURE__ */ Jr();
function Tn(e, t) {
  const n = t ? e ? Zr : Xr : e ? Vr : Yr;
  return (s, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    N(n, r) && r in s ? n : s,
    r,
    i
  );
}
const Qr = {
  get: /* @__PURE__ */ Tn(!1, !1)
}, kr = {
  get: /* @__PURE__ */ Tn(!1, !0)
}, Gr = {
  get: /* @__PURE__ */ Tn(!0, !1)
}, js = /* @__PURE__ */ new WeakMap(), Ss = /* @__PURE__ */ new WeakMap(), Hs = /* @__PURE__ */ new WeakMap(), ei = /* @__PURE__ */ new WeakMap();
function ti(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function ni(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ti(_r(e));
}
function Pn(e) {
  return ot(e) ? e : In(
    e,
    !1,
    Ns,
    Qr,
    js
  );
}
function si(e) {
  return In(
    e,
    !1,
    qr,
    kr,
    Ss
  );
}
function Us(e) {
  return In(
    e,
    !0,
    zr,
    Gr,
    Hs
  );
}
function In(e, t, n, s, r) {
  if (!B(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = r.get(e);
  if (i)
    return i;
  const o = ni(e);
  if (o === 0)
    return e;
  const c = new Proxy(
    e,
    o === 2 ? s : n
  );
  return r.set(e, c), c;
}
function ze(e) {
  return ot(e) ? ze(e.__v_raw) : !!(e && e.__v_isReactive);
}
function ot(e) {
  return !!(e && e.__v_isReadonly);
}
function ln(e) {
  return !!(e && e.__v_isShallow);
}
function $s(e) {
  return ze(e) || ot(e);
}
function j(e) {
  const t = e && e.__v_raw;
  return t ? j(t) : e;
}
function Bs(e) {
  return At(e, "__v_skip", !0), e;
}
const An = (e) => B(e) ? Pn(e) : e, Mn = (e) => B(e) ? Us(e) : e;
function ri(e) {
  Oe && ie && (e = j(e), Ms(e.dep || (e.dep = vn())));
}
function ii(e, t) {
  e = j(e);
  const n = e.dep;
  n && on(n);
}
function G(e) {
  return !!(e && e.__v_isRef === !0);
}
function oi(e) {
  return G(e) ? e.value : e;
}
const li = {
  get: (e, t, n) => oi(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return G(r) && !G(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Ds(e) {
  return ze(e) ? e : new Proxy(e, li);
}
class ci {
  constructor(t, n, s, r) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this._dirty = !0, this.effect = new En(t, () => {
      this._dirty || (this._dirty = !0, ii(this));
    }), this.effect.computed = this, this.effect.active = this._cacheable = !r, this.__v_isReadonly = s;
  }
  get value() {
    const t = j(this);
    return ri(t), (t._dirty || !t._cacheable) && (t._dirty = !1, t._value = t.effect.run()), t._value;
  }
  set value(t) {
    this._setter(t);
  }
}
function fi(e, t, n = !1) {
  let s, r;
  const i = A(e);
  return i ? (s = e, r = ce) : (s = e.get, r = e.set), new ci(s, r, i || !r, n);
}
function Te(e, t, n, s) {
  let r;
  try {
    r = s ? e(...s) : e();
  } catch (i) {
    $t(i, t, n);
  }
  return r;
}
function fe(e, t, n, s) {
  if (A(e)) {
    const i = Te(e, t, n, s);
    return i && vs(i) && i.catch((o) => {
      $t(o, t, n);
    }), i;
  }
  const r = [];
  for (let i = 0; i < e.length; i++)
    r.push(fe(e[i], t, n, s));
  return r;
}
function $t(e, t, n, s = !0) {
  const r = t ? t.vnode : null;
  if (t) {
    let i = t.parent;
    const o = t.proxy, c = n;
    for (; i; ) {
      const a = i.ec;
      if (a) {
        for (let m = 0; m < a.length; m++)
          if (a[m](e, o, c) === !1)
            return;
      }
      i = i.parent;
    }
    const u = t.appContext.config.errorHandler;
    if (u) {
      Te(
        u,
        null,
        10,
        [e, o, c]
      );
      return;
    }
  }
  ui(e, n, r, s);
}
function ui(e, t, n, s = !0) {
  console.error(e);
}
let lt = !1, cn = !1;
const Z = [];
let ge = 0;
const qe = [];
let be = null, je = 0;
const Ks = /* @__PURE__ */ Promise.resolve();
let Fn = null;
function ai(e) {
  const t = Fn || Ks;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function di(e) {
  let t = ge + 1, n = Z.length;
  for (; t < n; ) {
    const s = t + n >>> 1;
    ct(Z[s]) < e ? t = s + 1 : n = s;
  }
  return t;
}
function Rn(e) {
  (!Z.length || !Z.includes(
    e,
    lt && e.allowRecurse ? ge + 1 : ge
  )) && (e.id == null ? Z.push(e) : Z.splice(di(e.id), 0, e), Ls());
}
function Ls() {
  !lt && !cn && (cn = !0, Fn = Ks.then(zs));
}
function hi(e) {
  const t = Z.indexOf(e);
  t > ge && Z.splice(t, 1);
}
function pi(e) {
  P(e) ? qe.push(...e) : (!be || !be.includes(
    e,
    e.allowRecurse ? je + 1 : je
  )) && qe.push(e), Ls();
}
function kn(e, t = lt ? ge + 1 : 0) {
  for (; t < Z.length; t++) {
    const n = Z[t];
    n && n.pre && (Z.splice(t, 1), t--, n());
  }
}
function Ws(e) {
  if (qe.length) {
    const t = [...new Set(qe)];
    if (qe.length = 0, be) {
      be.push(...t);
      return;
    }
    for (be = t, be.sort((n, s) => ct(n) - ct(s)), je = 0; je < be.length; je++)
      be[je]();
    be = null, je = 0;
  }
}
const ct = (e) => e.id == null ? 1 / 0 : e.id, gi = (e, t) => {
  const n = ct(e) - ct(t);
  if (n === 0) {
    if (e.pre && !t.pre)
      return -1;
    if (t.pre && !e.pre)
      return 1;
  }
  return n;
};
function zs(e) {
  cn = !1, lt = !0, Z.sort(gi);
  const t = ce;
  try {
    for (ge = 0; ge < Z.length; ge++) {
      const n = Z[ge];
      n && n.active !== !1 && Te(n, null, 14);
    }
  } finally {
    ge = 0, Z.length = 0, Ws(), lt = !1, Fn = null, (Z.length || qe.length) && zs();
  }
}
function mi(e, t, ...n) {
  if (e.isUnmounted)
    return;
  const s = e.vnode.props || $;
  let r = n;
  const i = t.startsWith("update:"), o = i && t.slice(7);
  if (o && o in s) {
    const m = `${o === "modelValue" ? "model" : o}Modifiers`, { number: w, trim: E } = s[m] || $;
    E && (r = n.map((I) => W(I) ? I.trim() : I)), w && (r = n.map(yr));
  }
  let c, u = s[c = Yt(t)] || // also try camelCase event handler (#2249)
  s[c = Yt(me(t))];
  !u && i && (u = s[c = Yt(Ve(t))]), u && fe(
    u,
    e,
    6,
    r
  );
  const a = s[c + "Once"];
  if (a) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[c])
      return;
    e.emitted[c] = !0, fe(
      a,
      e,
      6,
      r
    );
  }
}
function qs(e, t, n = !1) {
  const s = t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let o = {}, c = !1;
  if (!A(e)) {
    const u = (a) => {
      const m = qs(a, t, !0);
      m && (c = !0, J(o, m));
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  return !i && !c ? (B(e) && s.set(e, null), null) : (P(i) ? i.forEach((u) => o[u] = null) : J(o, i), B(e) && s.set(e, o), o);
}
function Bt(e, t) {
  return !e || !Nt(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), N(e, t[0].toLowerCase() + t.slice(1)) || N(e, Ve(t)) || N(e, t));
}
let oe = null, Js = null;
function Mt(e) {
  const t = oe;
  return oe = e, Js = e && e.type.__scopeId || null, t;
}
function _i(e, t = oe, n) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && fs(-1);
    const i = Mt(t);
    let o;
    try {
      o = e(...r);
    } finally {
      Mt(i), s._d && fs(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function Xt(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    props: i,
    propsOptions: [o],
    slots: c,
    attrs: u,
    emit: a,
    render: m,
    renderCache: w,
    data: E,
    setupState: I,
    ctx: K,
    inheritAttrs: R
  } = e;
  let z, Y;
  const V = Mt(e);
  try {
    if (n.shapeFlag & 4) {
      const M = r || s;
      z = pe(
        m.call(
          M,
          M,
          w,
          i,
          I,
          E,
          K
        )
      ), Y = u;
    } else {
      const M = t;
      z = pe(
        M.length > 1 ? M(
          i,
          { attrs: u, slots: c, emit: a }
        ) : M(
          i,
          null
          /* we know it doesn't need it */
        )
      ), Y = t.props ? u : bi(u);
    }
  } catch (M) {
    rt.length = 0, $t(M, e, 1), z = xe(ft);
  }
  let X = z;
  if (Y && R !== !1) {
    const M = Object.keys(Y), { shapeFlag: ve } = X;
    M.length && ve & 7 && (o && M.some(mn) && (Y = xi(
      Y,
      o
    )), X = Je(X, Y));
  }
  return n.dirs && (X = Je(X), X.dirs = X.dirs ? X.dirs.concat(n.dirs) : n.dirs), n.transition && (X.transition = n.transition), z = X, Mt(V), z;
}
const bi = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || Nt(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, xi = (e, t) => {
  const n = {};
  for (const s in e)
    (!mn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function yi(e, t, n) {
  const { props: s, children: r, component: i } = e, { props: o, children: c, patchFlag: u } = t, a = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && u >= 0) {
    if (u & 1024)
      return !0;
    if (u & 16)
      return s ? Gn(s, o, a) : !!o;
    if (u & 8) {
      const m = t.dynamicProps;
      for (let w = 0; w < m.length; w++) {
        const E = m[w];
        if (o[E] !== s[E] && !Bt(a, E))
          return !0;
      }
    }
  } else
    return (r || c) && (!c || !c.$stable) ? !0 : s === o ? !1 : s ? o ? Gn(s, o, a) : !0 : !!o;
  return !1;
}
function Gn(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (t[i] !== e[i] && !Bt(n, i))
      return !0;
  }
  return !1;
}
function wi({ vnode: e, parent: t }, n) {
  for (; t && t.subTree === e; )
    (e = t.vnode).el = n, t = t.parent;
}
const vi = (e) => e.__isSuspense;
function Ei(e, t) {
  t && t.pendingBranch ? P(e) ? t.effects.push(...e) : t.effects.push(e) : pi(e);
}
const vt = {};
function Zt(e, t, n) {
  return Ys(e, t, n);
}
function Ys(e, t, { immediate: n, deep: s, flush: r, onTrack: i, onTrigger: o } = $) {
  var c;
  const u = Mr() === ((c = q) == null ? void 0 : c.scope) ? q : null;
  let a, m = !1, w = !1;
  if (G(e) ? (a = () => e.value, m = ln(e)) : ze(e) ? (a = () => e, s = !0) : P(e) ? (w = !0, m = e.some((M) => ze(M) || ln(M)), a = () => e.map((M) => {
    if (G(M))
      return M.value;
    if (ze(M))
      return Ke(M);
    if (A(M))
      return Te(M, u, 2);
  })) : A(e) ? t ? a = () => Te(e, u, 2) : a = () => {
    if (!(u && u.isUnmounted))
      return E && E(), fe(
        e,
        u,
        3,
        [I]
      );
  } : a = ce, t && s) {
    const M = a;
    a = () => Ke(M());
  }
  let E, I = (M) => {
    E = V.onStop = () => {
      Te(M, u, 4);
    };
  }, K;
  if (at)
    if (I = ce, t ? n && fe(t, u, 3, [
      a(),
      w ? [] : void 0,
      I
    ]) : a(), r === "sync") {
      const M = Oo();
      K = M.__watcherHandles || (M.__watcherHandles = []);
    } else
      return ce;
  let R = w ? new Array(e.length).fill(vt) : vt;
  const z = () => {
    if (V.active)
      if (t) {
        const M = V.run();
        (s || m || (w ? M.some(
          (ve, Qe) => It(ve, R[Qe])
        ) : It(M, R))) && (E && E(), fe(t, u, 3, [
          M,
          // pass undefined as the old value when it's changed for the first time
          R === vt ? void 0 : w && R[0] === vt ? [] : R,
          I
        ]), R = M);
      } else
        V.run();
  };
  z.allowRecurse = !!t;
  let Y;
  r === "sync" ? Y = z : r === "post" ? Y = () => ee(z, u && u.suspense) : (z.pre = !0, u && (z.id = u.uid), Y = () => Rn(z));
  const V = new En(a, Y);
  t ? n ? z() : R = V.run() : r === "post" ? ee(
    V.run.bind(V),
    u && u.suspense
  ) : V.run();
  const X = () => {
    V.stop(), u && u.scope && _n(u.scope.effects, V);
  };
  return K && K.push(X), X;
}
function Ci(e, t, n) {
  const s = this.proxy, r = W(e) ? e.includes(".") ? Vs(s, e) : () => s[e] : e.bind(s, s);
  let i;
  A(t) ? i = t : (i = t.handler, n = t);
  const o = q;
  Ye(this);
  const c = Ys(r, i.bind(s), n);
  return o ? Ye(o) : Ue(), c;
}
function Vs(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
function Ke(e, t) {
  if (!B(e) || e.__v_skip || (t = t || /* @__PURE__ */ new Set(), t.has(e)))
    return e;
  if (t.add(e), G(e))
    Ke(e.value, t);
  else if (P(e))
    for (let n = 0; n < e.length; n++)
      Ke(e[n], t);
  else if (ws(e) || We(e))
    e.forEach((n) => {
      Ke(n, t);
    });
  else if (Cs(e))
    for (const n in e)
      Ke(e[n], t);
  return e;
}
function Re(e, t, n, s) {
  const r = e.dirs, i = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    const c = r[o];
    i && (c.oldValue = i[o].value);
    let u = c.dir[s];
    u && (Xe(), fe(u, n, 8, [
      e.el,
      c,
      e,
      t
    ]), Ze());
  }
}
const Ct = (e) => !!e.type.__asyncLoader, Xs = (e) => e.type.__isKeepAlive;
function Oi(e, t) {
  Zs(e, "a", t);
}
function Ti(e, t) {
  Zs(e, "da", t);
}
function Zs(e, t, n = q) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (Dt(t, s, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      Xs(r.parent.vnode) && Pi(s, t, n, r), r = r.parent;
  }
}
function Pi(e, t, n, s) {
  const r = Dt(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Qs(() => {
    _n(s[t], r);
  }, n);
}
function Dt(e, t, n = q, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...o) => {
      if (n.isUnmounted)
        return;
      Xe(), Ye(n);
      const c = fe(t, n, e, o);
      return Ue(), Ze(), c;
    });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const we = (e) => (t, n = q) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!at || e === "sp") && Dt(e, (...s) => t(...s), n)
), Ii = we("bm"), Ai = we("m"), Mi = we("bu"), Fi = we("u"), Ri = we("bum"), Qs = we("um"), Ni = we("sp"), ji = we(
  "rtg"
), Si = we(
  "rtc"
);
function Hi(e, t = q) {
  Dt("ec", e, t);
}
const ks = "components";
function Ui(e, t) {
  return Bi(ks, e, !0, t) || e;
}
const $i = Symbol.for("v-ndc");
function Bi(e, t, n = !0, s = !1) {
  const r = oe || q;
  if (r) {
    const i = r.type;
    if (e === ks) {
      const c = wo(
        i,
        !1
        /* do not include inferred name to avoid breaking existing code */
      );
      if (c && (c === t || c === me(t) || c === Ht(me(t))))
        return i;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      es(r[e] || i[e], t) || // global registration
      es(r.appContext[e], t)
    );
    return !o && s ? i : o;
  }
}
function es(e, t) {
  return e && (e[t] || e[me(t)] || e[Ht(me(t))]);
}
function Di(e, t, n, s) {
  let r;
  const i = n && n[s];
  if (P(e) || W(e)) {
    r = new Array(e.length);
    for (let o = 0, c = e.length; o < c; o++)
      r[o] = t(e[o], o, void 0, i && i[o]);
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let o = 0; o < e; o++)
      r[o] = t(o + 1, o, void 0, i && i[o]);
  } else if (B(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (o, c) => t(o, c, void 0, i && i[c])
      );
    else {
      const o = Object.keys(e);
      r = new Array(o.length);
      for (let c = 0, u = o.length; c < u; c++) {
        const a = o[c];
        r[c] = t(e[a], a, c, i && i[c]);
      }
    }
  else
    r = [];
  return n && (n[s] = r), r;
}
const fn = (e) => e ? fr(e) ? Un(e) || e.proxy : fn(e.parent) : null, st = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ J(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => fn(e.parent),
    $root: (e) => fn(e.root),
    $emit: (e) => e.emit,
    $options: (e) => Nn(e),
    $forceUpdate: (e) => e.f || (e.f = () => Rn(e.update)),
    $nextTick: (e) => e.n || (e.n = ai.bind(e.proxy)),
    $watch: (e) => Ci.bind(e)
  })
), Qt = (e, t) => e !== $ && !e.__isScriptSetup && N(e, t), Ki = {
  get({ _: e }, t) {
    const { ctx: n, setupState: s, data: r, props: i, accessCache: o, type: c, appContext: u } = e;
    let a;
    if (t[0] !== "$") {
      const I = o[t];
      if (I !== void 0)
        switch (I) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Qt(s, t))
          return o[t] = 1, s[t];
        if (r !== $ && N(r, t))
          return o[t] = 2, r[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (a = e.propsOptions[0]) && N(a, t)
        )
          return o[t] = 3, i[t];
        if (n !== $ && N(n, t))
          return o[t] = 4, n[t];
        un && (o[t] = 0);
      }
    }
    const m = st[t];
    let w, E;
    if (m)
      return t === "$attrs" && te(e, "get", t), m(e);
    if (
      // css module (injected by vue-loader)
      (w = c.__cssModules) && (w = w[t])
    )
      return w;
    if (n !== $ && N(n, t))
      return o[t] = 4, n[t];
    if (
      // global properties
      E = u.config.globalProperties, N(E, t)
    )
      return E[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: i } = e;
    return Qt(r, t) ? (r[t] = n, !0) : s !== $ && N(s, t) ? (s[t] = n, !0) : N(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, propsOptions: i }
  }, o) {
    let c;
    return !!n[o] || e !== $ && N(e, o) || Qt(t, o) || (c = i[0]) && N(c, o) || N(s, o) || N(st, o) || N(r.config.globalProperties, o);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : N(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function ts(e) {
  return P(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let un = !0;
function Li(e) {
  const t = Nn(e), n = e.proxy, s = e.ctx;
  un = !1, t.beforeCreate && ns(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: i,
    methods: o,
    watch: c,
    provide: u,
    inject: a,
    // lifecycle
    created: m,
    beforeMount: w,
    mounted: E,
    beforeUpdate: I,
    updated: K,
    activated: R,
    deactivated: z,
    beforeDestroy: Y,
    beforeUnmount: V,
    destroyed: X,
    unmounted: M,
    render: ve,
    renderTracked: Qe,
    renderTriggered: dt,
    errorCaptured: Ie,
    serverPrefetch: Wt,
    // public API
    expose: Ae,
    inheritAttrs: ke,
    // assets
    components: ht,
    directives: pt,
    filters: zt
  } = t;
  if (a && Wi(a, s, null), o)
    for (const D in o) {
      const H = o[D];
      A(H) && (s[D] = H.bind(n));
    }
  if (r) {
    const D = r.call(n, n);
    B(D) && (e.data = Pn(D));
  }
  if (un = !0, i)
    for (const D in i) {
      const H = i[D], Me = A(H) ? H.bind(n, n) : A(H.get) ? H.get.bind(n, n) : ce, gt = !A(H) && A(H.set) ? H.set.bind(n) : ce, Fe = Eo({
        get: Me,
        set: gt
      });
      Object.defineProperty(s, D, {
        enumerable: !0,
        configurable: !0,
        get: () => Fe.value,
        set: (ue) => Fe.value = ue
      });
    }
  if (c)
    for (const D in c)
      Gs(c[D], s, n, D);
  if (u) {
    const D = A(u) ? u.call(n) : u;
    Reflect.ownKeys(D).forEach((H) => {
      Xi(H, D[H]);
    });
  }
  m && ns(m, e, "c");
  function Q(D, H) {
    P(H) ? H.forEach((Me) => D(Me.bind(n))) : H && D(H.bind(n));
  }
  if (Q(Ii, w), Q(Ai, E), Q(Mi, I), Q(Fi, K), Q(Oi, R), Q(Ti, z), Q(Hi, Ie), Q(Si, Qe), Q(ji, dt), Q(Ri, V), Q(Qs, M), Q(Ni, Wt), P(Ae))
    if (Ae.length) {
      const D = e.exposed || (e.exposed = {});
      Ae.forEach((H) => {
        Object.defineProperty(D, H, {
          get: () => n[H],
          set: (Me) => n[H] = Me
        });
      });
    } else
      e.exposed || (e.exposed = {});
  ve && e.render === ce && (e.render = ve), ke != null && (e.inheritAttrs = ke), ht && (e.components = ht), pt && (e.directives = pt);
}
function Wi(e, t, n = ce) {
  P(e) && (e = an(e));
  for (const s in e) {
    const r = e[s];
    let i;
    B(r) ? "default" in r ? i = Ot(
      r.from || s,
      r.default,
      !0
      /* treat default function as factory */
    ) : i = Ot(r.from || s) : i = Ot(r), G(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (o) => i.value = o
    }) : t[s] = i;
  }
}
function ns(e, t, n) {
  fe(
    P(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Gs(e, t, n, s) {
  const r = s.includes(".") ? Vs(n, s) : () => n[s];
  if (W(e)) {
    const i = t[e];
    A(i) && Zt(r, i);
  } else if (A(e))
    Zt(r, e.bind(n));
  else if (B(e))
    if (P(e))
      e.forEach((i) => Gs(i, t, n, s));
    else {
      const i = A(e.handler) ? e.handler.bind(n) : t[e.handler];
      A(i) && Zt(r, i, e);
    }
}
function Nn(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: o }
  } = e.appContext, c = i.get(t);
  let u;
  return c ? u = c : !r.length && !n && !s ? u = t : (u = {}, r.length && r.forEach(
    (a) => Ft(u, a, o, !0)
  ), Ft(u, t, o)), B(t) && i.set(t, u), u;
}
function Ft(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && Ft(e, i, n, !0), r && r.forEach(
    (o) => Ft(e, o, n, !0)
  );
  for (const o in t)
    if (!(s && o === "expose")) {
      const c = zi[o] || n && n[o];
      e[o] = c ? c(e[o], t[o]) : t[o];
    }
  return e;
}
const zi = {
  data: ss,
  props: rs,
  emits: rs,
  // objects
  methods: nt,
  computed: nt,
  // lifecycle
  beforeCreate: k,
  created: k,
  beforeMount: k,
  mounted: k,
  beforeUpdate: k,
  updated: k,
  beforeDestroy: k,
  beforeUnmount: k,
  destroyed: k,
  unmounted: k,
  activated: k,
  deactivated: k,
  errorCaptured: k,
  serverPrefetch: k,
  // assets
  components: nt,
  directives: nt,
  // watch
  watch: Ji,
  // provide / inject
  provide: ss,
  inject: qi
};
function ss(e, t) {
  return t ? e ? function() {
    return J(
      A(e) ? e.call(this, this) : e,
      A(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function qi(e, t) {
  return nt(an(e), an(t));
}
function an(e) {
  if (P(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function k(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function nt(e, t) {
  return e ? J(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function rs(e, t) {
  return e ? P(e) && P(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : J(
    /* @__PURE__ */ Object.create(null),
    ts(e),
    ts(t ?? {})
  ) : t;
}
function Ji(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  const n = J(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = k(e[s], t[s]);
  return n;
}
function er() {
  return {
    app: null,
    config: {
      isNativeTag: pr,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Yi = 0;
function Vi(e, t) {
  return function(s, r = null) {
    A(s) || (s = J({}, s)), r != null && !B(r) && (r = null);
    const i = er(), o = /* @__PURE__ */ new Set();
    let c = !1;
    const u = i.app = {
      _uid: Yi++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: To,
      get config() {
        return i.config;
      },
      set config(a) {
      },
      use(a, ...m) {
        return o.has(a) || (a && A(a.install) ? (o.add(a), a.install(u, ...m)) : A(a) && (o.add(a), a(u, ...m))), u;
      },
      mixin(a) {
        return i.mixins.includes(a) || i.mixins.push(a), u;
      },
      component(a, m) {
        return m ? (i.components[a] = m, u) : i.components[a];
      },
      directive(a, m) {
        return m ? (i.directives[a] = m, u) : i.directives[a];
      },
      mount(a, m, w) {
        if (!c) {
          const E = xe(
            s,
            r
          );
          return E.appContext = i, m && t ? t(E, a) : e(E, a, w), c = !0, u._container = a, a.__vue_app__ = u, Un(E.component) || E.component.proxy;
        }
      },
      unmount() {
        c && (e(null, u._container), delete u._container.__vue_app__);
      },
      provide(a, m) {
        return i.provides[a] = m, u;
      },
      runWithContext(a) {
        Rt = u;
        try {
          return a();
        } finally {
          Rt = null;
        }
      }
    };
    return u;
  };
}
let Rt = null;
function Xi(e, t) {
  if (q) {
    let n = q.provides;
    const s = q.parent && q.parent.provides;
    s === n && (n = q.provides = Object.create(s)), n[e] = t;
  }
}
function Ot(e, t, n = !1) {
  const s = q || oe;
  if (s || Rt) {
    const r = s ? s.parent == null ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : Rt._context.provides;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && A(t) ? t.call(s && s.proxy) : t;
  }
}
function Zi(e, t, n, s = !1) {
  const r = {}, i = {};
  At(i, Lt, 1), e.propsDefaults = /* @__PURE__ */ Object.create(null), tr(e, t, r, i);
  for (const o in e.propsOptions[0])
    o in r || (r[o] = void 0);
  n ? e.props = s ? r : si(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function Qi(e, t, n, s) {
  const {
    props: r,
    attrs: i,
    vnode: { patchFlag: o }
  } = e, c = j(r), [u] = e.propsOptions;
  let a = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const m = e.vnode.dynamicProps;
      for (let w = 0; w < m.length; w++) {
        let E = m[w];
        if (Bt(e.emitsOptions, E))
          continue;
        const I = t[E];
        if (u)
          if (N(i, E))
            I !== i[E] && (i[E] = I, a = !0);
          else {
            const K = me(E);
            r[K] = dn(
              u,
              c,
              K,
              I,
              e,
              !1
              /* isAbsent */
            );
          }
        else
          I !== i[E] && (i[E] = I, a = !0);
      }
    }
  } else {
    tr(e, t, r, i) && (a = !0);
    let m;
    for (const w in c)
      (!t || // for camelCase
      !N(t, w) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((m = Ve(w)) === w || !N(t, m))) && (u ? n && // for camelCase
      (n[w] !== void 0 || // for kebab-case
      n[m] !== void 0) && (r[w] = dn(
        u,
        c,
        w,
        void 0,
        e,
        !0
        /* isAbsent */
      )) : delete r[w]);
    if (i !== c)
      for (const w in i)
        (!t || !N(t, w)) && (delete i[w], a = !0);
  }
  a && ye(e, "set", "$attrs");
}
function tr(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let o = !1, c;
  if (t)
    for (let u in t) {
      if (Et(u))
        continue;
      const a = t[u];
      let m;
      r && N(r, m = me(u)) ? !i || !i.includes(m) ? n[m] = a : (c || (c = {}))[m] = a : Bt(e.emitsOptions, u) || (!(u in s) || a !== s[u]) && (s[u] = a, o = !0);
    }
  if (i) {
    const u = j(n), a = c || $;
    for (let m = 0; m < i.length; m++) {
      const w = i[m];
      n[w] = dn(
        r,
        u,
        w,
        a[w],
        e,
        !N(a, w)
      );
    }
  }
  return o;
}
function dn(e, t, n, s, r, i) {
  const o = e[n];
  if (o != null) {
    const c = N(o, "default");
    if (c && s === void 0) {
      const u = o.default;
      if (o.type !== Function && !o.skipFactory && A(u)) {
        const { propsDefaults: a } = r;
        n in a ? s = a[n] : (Ye(r), s = a[n] = u.call(
          null,
          t
        ), Ue());
      } else
        s = u;
    }
    o[
      0
      /* shouldCast */
    ] && (i && !c ? s = !1 : o[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === Ve(n)) && (s = !0));
  }
  return s;
}
function nr(e, t, n = !1) {
  const s = t.propsCache, r = s.get(e);
  if (r)
    return r;
  const i = e.props, o = {}, c = [];
  let u = !1;
  if (!A(e)) {
    const m = (w) => {
      u = !0;
      const [E, I] = nr(w, t, !0);
      J(o, E), I && c.push(...I);
    };
    !n && t.mixins.length && t.mixins.forEach(m), e.extends && m(e.extends), e.mixins && e.mixins.forEach(m);
  }
  if (!i && !u)
    return B(e) && s.set(e, Le), Le;
  if (P(i))
    for (let m = 0; m < i.length; m++) {
      const w = me(i[m]);
      is(w) && (o[w] = $);
    }
  else if (i)
    for (const m in i) {
      const w = me(m);
      if (is(w)) {
        const E = i[m], I = o[w] = P(E) || A(E) ? { type: E } : J({}, E);
        if (I) {
          const K = cs(Boolean, I.type), R = cs(String, I.type);
          I[
            0
            /* shouldCast */
          ] = K > -1, I[
            1
            /* shouldCastTrue */
          ] = R < 0 || K < R, (K > -1 || N(I, "default")) && c.push(w);
        }
      }
    }
  const a = [o, c];
  return B(e) && s.set(e, a), a;
}
function is(e) {
  return e[0] !== "$";
}
function os(e) {
  const t = e && e.toString().match(/^\s*(function|class) (\w+)/);
  return t ? t[2] : e === null ? "null" : "";
}
function ls(e, t) {
  return os(e) === os(t);
}
function cs(e, t) {
  return P(t) ? t.findIndex((n) => ls(n, e)) : A(t) && ls(t, e) ? 0 : -1;
}
const sr = (e) => e[0] === "_" || e === "$stable", jn = (e) => P(e) ? e.map(pe) : [pe(e)], ki = (e, t, n) => {
  if (t._n)
    return t;
  const s = _i((...r) => jn(t(...r)), n);
  return s._c = !1, s;
}, rr = (e, t, n) => {
  const s = e._ctx;
  for (const r in e) {
    if (sr(r))
      continue;
    const i = e[r];
    if (A(i))
      t[r] = ki(r, i, s);
    else if (i != null) {
      const o = jn(i);
      t[r] = () => o;
    }
  }
}, ir = (e, t) => {
  const n = jn(t);
  e.slots.default = () => n;
}, Gi = (e, t) => {
  if (e.vnode.shapeFlag & 32) {
    const n = t._;
    n ? (e.slots = j(t), At(t, "_", n)) : rr(
      t,
      e.slots = {}
    );
  } else
    e.slots = {}, t && ir(e, t);
  At(e.slots, Lt, 1);
}, eo = (e, t, n) => {
  const { vnode: s, slots: r } = e;
  let i = !0, o = $;
  if (s.shapeFlag & 32) {
    const c = t._;
    c ? n && c === 1 ? i = !1 : (J(r, t), !n && c === 1 && delete r._) : (i = !t.$stable, rr(t, r)), o = t;
  } else
    t && (ir(e, t), o = { default: 1 });
  if (i)
    for (const c in r)
      !sr(c) && !(c in o) && delete r[c];
};
function hn(e, t, n, s, r = !1) {
  if (P(e)) {
    e.forEach(
      (E, I) => hn(
        E,
        t && (P(t) ? t[I] : t),
        n,
        s,
        r
      )
    );
    return;
  }
  if (Ct(s) && !r)
    return;
  const i = s.shapeFlag & 4 ? Un(s.component) || s.component.proxy : s.el, o = r ? null : i, { i: c, r: u } = e, a = t && t.r, m = c.refs === $ ? c.refs = {} : c.refs, w = c.setupState;
  if (a != null && a !== u && (W(a) ? (m[a] = null, N(w, a) && (w[a] = null)) : G(a) && (a.value = null)), A(u))
    Te(u, c, 12, [o, m]);
  else {
    const E = W(u), I = G(u);
    if (E || I) {
      const K = () => {
        if (e.f) {
          const R = E ? N(w, u) ? w[u] : m[u] : u.value;
          r ? P(R) && _n(R, i) : P(R) ? R.includes(i) || R.push(i) : E ? (m[u] = [i], N(w, u) && (w[u] = m[u])) : (u.value = [i], e.k && (m[e.k] = u.value));
        } else
          E ? (m[u] = o, N(w, u) && (w[u] = o)) : I && (u.value = o, e.k && (m[e.k] = o));
      };
      o ? (K.id = -1, ee(K, n)) : K();
    }
  }
}
const ee = Ei;
function to(e) {
  return no(e);
}
function no(e, t) {
  const n = tn();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: r,
    patchProp: i,
    createElement: o,
    createText: c,
    createComment: u,
    setText: a,
    setElementText: m,
    parentNode: w,
    nextSibling: E,
    setScopeId: I = ce,
    insertStaticContent: K
  } = e, R = (l, f, d, p = null, h = null, b = null, y = !1, _ = null, x = !!f.dynamicChildren) => {
    if (l === f)
      return;
    l && !et(l, f) && (p = mt(l), ue(l, h, b, !0), l = null), f.patchFlag === -2 && (x = !1, f.dynamicChildren = null);
    const { type: g, ref: C, shapeFlag: v } = f;
    switch (g) {
      case Kt:
        z(l, f, d, p);
        break;
      case ft:
        Y(l, f, d, p);
        break;
      case Tt:
        l == null && V(f, d, p, y);
        break;
      case he:
        ht(
          l,
          f,
          d,
          p,
          h,
          b,
          y,
          _,
          x
        );
        break;
      default:
        v & 1 ? ve(
          l,
          f,
          d,
          p,
          h,
          b,
          y,
          _,
          x
        ) : v & 6 ? pt(
          l,
          f,
          d,
          p,
          h,
          b,
          y,
          _,
          x
        ) : (v & 64 || v & 128) && g.process(
          l,
          f,
          d,
          p,
          h,
          b,
          y,
          _,
          x,
          $e
        );
    }
    C != null && h && hn(C, l && l.ref, b, f || l, !f);
  }, z = (l, f, d, p) => {
    if (l == null)
      s(
        f.el = c(f.children),
        d,
        p
      );
    else {
      const h = f.el = l.el;
      f.children !== l.children && a(h, f.children);
    }
  }, Y = (l, f, d, p) => {
    l == null ? s(
      f.el = u(f.children || ""),
      d,
      p
    ) : f.el = l.el;
  }, V = (l, f, d, p) => {
    [l.el, l.anchor] = K(
      l.children,
      f,
      d,
      p,
      l.el,
      l.anchor
    );
  }, X = ({ el: l, anchor: f }, d, p) => {
    let h;
    for (; l && l !== f; )
      h = E(l), s(l, d, p), l = h;
    s(f, d, p);
  }, M = ({ el: l, anchor: f }) => {
    let d;
    for (; l && l !== f; )
      d = E(l), r(l), l = d;
    r(f);
  }, ve = (l, f, d, p, h, b, y, _, x) => {
    y = y || f.type === "svg", l == null ? Qe(
      f,
      d,
      p,
      h,
      b,
      y,
      _,
      x
    ) : Wt(
      l,
      f,
      h,
      b,
      y,
      _,
      x
    );
  }, Qe = (l, f, d, p, h, b, y, _) => {
    let x, g;
    const { type: C, props: v, shapeFlag: O, transition: T, dirs: F } = l;
    if (x = l.el = o(
      l.type,
      b,
      v && v.is,
      v
    ), O & 8 ? m(x, l.children) : O & 16 && Ie(
      l.children,
      x,
      null,
      p,
      h,
      b && C !== "foreignObject",
      y,
      _
    ), F && Re(l, null, p, "created"), dt(x, l, l.scopeId, y, p), v) {
      for (const S in v)
        S !== "value" && !Et(S) && i(
          x,
          S,
          null,
          v[S],
          b,
          l.children,
          p,
          h,
          _e
        );
      "value" in v && i(x, "value", null, v.value), (g = v.onVnodeBeforeMount) && de(g, p, l);
    }
    F && Re(l, null, p, "beforeMount");
    const U = (!h || h && !h.pendingBranch) && T && !T.persisted;
    U && T.beforeEnter(x), s(x, f, d), ((g = v && v.onVnodeMounted) || U || F) && ee(() => {
      g && de(g, p, l), U && T.enter(x), F && Re(l, null, p, "mounted");
    }, h);
  }, dt = (l, f, d, p, h) => {
    if (d && I(l, d), p)
      for (let b = 0; b < p.length; b++)
        I(l, p[b]);
    if (h) {
      let b = h.subTree;
      if (f === b) {
        const y = h.vnode;
        dt(
          l,
          y,
          y.scopeId,
          y.slotScopeIds,
          h.parent
        );
      }
    }
  }, Ie = (l, f, d, p, h, b, y, _, x = 0) => {
    for (let g = x; g < l.length; g++) {
      const C = l[g] = _ ? Ce(l[g]) : pe(l[g]);
      R(
        null,
        C,
        f,
        d,
        p,
        h,
        b,
        y,
        _
      );
    }
  }, Wt = (l, f, d, p, h, b, y) => {
    const _ = f.el = l.el;
    let { patchFlag: x, dynamicChildren: g, dirs: C } = f;
    x |= l.patchFlag & 16;
    const v = l.props || $, O = f.props || $;
    let T;
    d && Ne(d, !1), (T = O.onVnodeBeforeUpdate) && de(T, d, f, l), C && Re(f, l, d, "beforeUpdate"), d && Ne(d, !0);
    const F = h && f.type !== "foreignObject";
    if (g ? Ae(
      l.dynamicChildren,
      g,
      _,
      d,
      p,
      F,
      b
    ) : y || H(
      l,
      f,
      _,
      null,
      d,
      p,
      F,
      b,
      !1
    ), x > 0) {
      if (x & 16)
        ke(
          _,
          f,
          v,
          O,
          d,
          p,
          h
        );
      else if (x & 2 && v.class !== O.class && i(_, "class", null, O.class, h), x & 4 && i(_, "style", v.style, O.style, h), x & 8) {
        const U = f.dynamicProps;
        for (let S = 0; S < U.length; S++) {
          const L = U[S], se = v[L], Be = O[L];
          (Be !== se || L === "value") && i(
            _,
            L,
            se,
            Be,
            h,
            l.children,
            d,
            p,
            _e
          );
        }
      }
      x & 1 && l.children !== f.children && m(_, f.children);
    } else
      !y && g == null && ke(
        _,
        f,
        v,
        O,
        d,
        p,
        h
      );
    ((T = O.onVnodeUpdated) || C) && ee(() => {
      T && de(T, d, f, l), C && Re(f, l, d, "updated");
    }, p);
  }, Ae = (l, f, d, p, h, b, y) => {
    for (let _ = 0; _ < f.length; _++) {
      const x = l[_], g = f[_], C = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        x.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (x.type === he || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !et(x, g) || // - In the case of a component, it could contain anything.
        x.shapeFlag & 70) ? w(x.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          d
        )
      );
      R(
        x,
        g,
        C,
        null,
        p,
        h,
        b,
        y,
        !0
      );
    }
  }, ke = (l, f, d, p, h, b, y) => {
    if (d !== p) {
      if (d !== $)
        for (const _ in d)
          !Et(_) && !(_ in p) && i(
            l,
            _,
            d[_],
            null,
            y,
            f.children,
            h,
            b,
            _e
          );
      for (const _ in p) {
        if (Et(_))
          continue;
        const x = p[_], g = d[_];
        x !== g && _ !== "value" && i(
          l,
          _,
          g,
          x,
          y,
          f.children,
          h,
          b,
          _e
        );
      }
      "value" in p && i(l, "value", d.value, p.value);
    }
  }, ht = (l, f, d, p, h, b, y, _, x) => {
    const g = f.el = l ? l.el : c(""), C = f.anchor = l ? l.anchor : c("");
    let { patchFlag: v, dynamicChildren: O, slotScopeIds: T } = f;
    T && (_ = _ ? _.concat(T) : T), l == null ? (s(g, d, p), s(C, d, p), Ie(
      f.children,
      d,
      C,
      h,
      b,
      y,
      _,
      x
    )) : v > 0 && v & 64 && O && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    l.dynamicChildren ? (Ae(
      l.dynamicChildren,
      O,
      d,
      h,
      b,
      y,
      _
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (f.key != null || h && f === h.subTree) && or(
      l,
      f,
      !0
      /* shallow */
    )) : H(
      l,
      f,
      d,
      C,
      h,
      b,
      y,
      _,
      x
    );
  }, pt = (l, f, d, p, h, b, y, _, x) => {
    f.slotScopeIds = _, l == null ? f.shapeFlag & 512 ? h.ctx.activate(
      f,
      d,
      p,
      y,
      x
    ) : zt(
      f,
      d,
      p,
      h,
      b,
      y,
      x
    ) : $n(l, f, x);
  }, zt = (l, f, d, p, h, b, y) => {
    const _ = l.component = mo(
      l,
      p,
      h
    );
    if (Xs(l) && (_.ctx.renderer = $e), _o(_), _.asyncDep) {
      if (h && h.registerDep(_, Q), !l.el) {
        const x = _.subTree = xe(ft);
        Y(null, x, f, d);
      }
      return;
    }
    Q(
      _,
      l,
      f,
      d,
      h,
      b,
      y
    );
  }, $n = (l, f, d) => {
    const p = f.component = l.component;
    if (yi(l, f, d))
      if (p.asyncDep && !p.asyncResolved) {
        D(p, f, d);
        return;
      } else
        p.next = f, hi(p.update), p.update();
    else
      f.el = l.el, p.vnode = f;
  }, Q = (l, f, d, p, h, b, y) => {
    const _ = () => {
      if (l.isMounted) {
        let { next: C, bu: v, u: O, parent: T, vnode: F } = l, U = C, S;
        Ne(l, !1), C ? (C.el = F.el, D(l, C, y)) : C = F, v && Vt(v), (S = C.props && C.props.onVnodeBeforeUpdate) && de(S, T, C, F), Ne(l, !0);
        const L = Xt(l), se = l.subTree;
        l.subTree = L, R(
          se,
          L,
          // parent may have changed if it's in a teleport
          w(se.el),
          // anchor may have changed if it's in a fragment
          mt(se),
          l,
          h,
          b
        ), C.el = L.el, U === null && wi(l, L.el), O && ee(O, h), (S = C.props && C.props.onVnodeUpdated) && ee(
          () => de(S, T, C, F),
          h
        );
      } else {
        let C;
        const { el: v, props: O } = f, { bm: T, m: F, parent: U } = l, S = Ct(f);
        if (Ne(l, !1), T && Vt(T), !S && (C = O && O.onVnodeBeforeMount) && de(C, U, f), Ne(l, !0), v && Jt) {
          const L = () => {
            l.subTree = Xt(l), Jt(
              v,
              l.subTree,
              l,
              h,
              null
            );
          };
          S ? f.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !l.isUnmounted && L()
          ) : L();
        } else {
          const L = l.subTree = Xt(l);
          R(
            null,
            L,
            d,
            p,
            l,
            h,
            b
          ), f.el = L.el;
        }
        if (F && ee(F, h), !S && (C = O && O.onVnodeMounted)) {
          const L = f;
          ee(
            () => de(C, U, L),
            h
          );
        }
        (f.shapeFlag & 256 || U && Ct(U.vnode) && U.vnode.shapeFlag & 256) && l.a && ee(l.a, h), l.isMounted = !0, f = d = p = null;
      }
    }, x = l.effect = new En(
      _,
      () => Rn(g),
      l.scope
      // track it in component's effect scope
    ), g = l.update = () => x.run();
    g.id = l.uid, Ne(l, !0), g();
  }, D = (l, f, d) => {
    f.component = l;
    const p = l.vnode.props;
    l.vnode = f, l.next = null, Qi(l, f.props, p, d), eo(l, f.children, d), Xe(), kn(), Ze();
  }, H = (l, f, d, p, h, b, y, _, x = !1) => {
    const g = l && l.children, C = l ? l.shapeFlag : 0, v = f.children, { patchFlag: O, shapeFlag: T } = f;
    if (O > 0) {
      if (O & 128) {
        gt(
          g,
          v,
          d,
          p,
          h,
          b,
          y,
          _,
          x
        );
        return;
      } else if (O & 256) {
        Me(
          g,
          v,
          d,
          p,
          h,
          b,
          y,
          _,
          x
        );
        return;
      }
    }
    T & 8 ? (C & 16 && _e(g, h, b), v !== g && m(d, v)) : C & 16 ? T & 16 ? gt(
      g,
      v,
      d,
      p,
      h,
      b,
      y,
      _,
      x
    ) : _e(g, h, b, !0) : (C & 8 && m(d, ""), T & 16 && Ie(
      v,
      d,
      p,
      h,
      b,
      y,
      _,
      x
    ));
  }, Me = (l, f, d, p, h, b, y, _, x) => {
    l = l || Le, f = f || Le;
    const g = l.length, C = f.length, v = Math.min(g, C);
    let O;
    for (O = 0; O < v; O++) {
      const T = f[O] = x ? Ce(f[O]) : pe(f[O]);
      R(
        l[O],
        T,
        d,
        null,
        h,
        b,
        y,
        _,
        x
      );
    }
    g > C ? _e(
      l,
      h,
      b,
      !0,
      !1,
      v
    ) : Ie(
      f,
      d,
      p,
      h,
      b,
      y,
      _,
      x,
      v
    );
  }, gt = (l, f, d, p, h, b, y, _, x) => {
    let g = 0;
    const C = f.length;
    let v = l.length - 1, O = C - 1;
    for (; g <= v && g <= O; ) {
      const T = l[g], F = f[g] = x ? Ce(f[g]) : pe(f[g]);
      if (et(T, F))
        R(
          T,
          F,
          d,
          null,
          h,
          b,
          y,
          _,
          x
        );
      else
        break;
      g++;
    }
    for (; g <= v && g <= O; ) {
      const T = l[v], F = f[O] = x ? Ce(f[O]) : pe(f[O]);
      if (et(T, F))
        R(
          T,
          F,
          d,
          null,
          h,
          b,
          y,
          _,
          x
        );
      else
        break;
      v--, O--;
    }
    if (g > v) {
      if (g <= O) {
        const T = O + 1, F = T < C ? f[T].el : p;
        for (; g <= O; )
          R(
            null,
            f[g] = x ? Ce(f[g]) : pe(f[g]),
            d,
            F,
            h,
            b,
            y,
            _,
            x
          ), g++;
      }
    } else if (g > O)
      for (; g <= v; )
        ue(l[g], h, b, !0), g++;
    else {
      const T = g, F = g, U = /* @__PURE__ */ new Map();
      for (g = F; g <= O; g++) {
        const ne = f[g] = x ? Ce(f[g]) : pe(f[g]);
        ne.key != null && U.set(ne.key, g);
      }
      let S, L = 0;
      const se = O - F + 1;
      let Be = !1, Kn = 0;
      const Ge = new Array(se);
      for (g = 0; g < se; g++)
        Ge[g] = 0;
      for (g = T; g <= v; g++) {
        const ne = l[g];
        if (L >= se) {
          ue(ne, h, b, !0);
          continue;
        }
        let ae;
        if (ne.key != null)
          ae = U.get(ne.key);
        else
          for (S = F; S <= O; S++)
            if (Ge[S - F] === 0 && et(ne, f[S])) {
              ae = S;
              break;
            }
        ae === void 0 ? ue(ne, h, b, !0) : (Ge[ae - F] = g + 1, ae >= Kn ? Kn = ae : Be = !0, R(
          ne,
          f[ae],
          d,
          null,
          h,
          b,
          y,
          _,
          x
        ), L++);
      }
      const Ln = Be ? so(Ge) : Le;
      for (S = Ln.length - 1, g = se - 1; g >= 0; g--) {
        const ne = F + g, ae = f[ne], Wn = ne + 1 < C ? f[ne + 1].el : p;
        Ge[g] === 0 ? R(
          null,
          ae,
          d,
          Wn,
          h,
          b,
          y,
          _,
          x
        ) : Be && (S < 0 || g !== Ln[S] ? Fe(ae, d, Wn, 2) : S--);
      }
    }
  }, Fe = (l, f, d, p, h = null) => {
    const { el: b, type: y, transition: _, children: x, shapeFlag: g } = l;
    if (g & 6) {
      Fe(l.component.subTree, f, d, p);
      return;
    }
    if (g & 128) {
      l.suspense.move(f, d, p);
      return;
    }
    if (g & 64) {
      y.move(l, f, d, $e);
      return;
    }
    if (y === he) {
      s(b, f, d);
      for (let v = 0; v < x.length; v++)
        Fe(x[v], f, d, p);
      s(l.anchor, f, d);
      return;
    }
    if (y === Tt) {
      X(l, f, d);
      return;
    }
    if (p !== 2 && g & 1 && _)
      if (p === 0)
        _.beforeEnter(b), s(b, f, d), ee(() => _.enter(b), h);
      else {
        const { leave: v, delayLeave: O, afterLeave: T } = _, F = () => s(b, f, d), U = () => {
          v(b, () => {
            F(), T && T();
          });
        };
        O ? O(b, F, U) : U();
      }
    else
      s(b, f, d);
  }, ue = (l, f, d, p = !1, h = !1) => {
    const {
      type: b,
      props: y,
      ref: _,
      children: x,
      dynamicChildren: g,
      shapeFlag: C,
      patchFlag: v,
      dirs: O
    } = l;
    if (_ != null && hn(_, null, d, l, !0), C & 256) {
      f.ctx.deactivate(l);
      return;
    }
    const T = C & 1 && O, F = !Ct(l);
    let U;
    if (F && (U = y && y.onVnodeBeforeUnmount) && de(U, f, l), C & 6)
      dr(l.component, d, p);
    else {
      if (C & 128) {
        l.suspense.unmount(d, p);
        return;
      }
      T && Re(l, null, f, "beforeUnmount"), C & 64 ? l.type.remove(
        l,
        f,
        d,
        h,
        $e,
        p
      ) : g && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (b !== he || v > 0 && v & 64) ? _e(
        g,
        f,
        d,
        !1,
        !0
      ) : (b === he && v & 384 || !h && C & 16) && _e(x, f, d), p && Bn(l);
    }
    (F && (U = y && y.onVnodeUnmounted) || T) && ee(() => {
      U && de(U, f, l), T && Re(l, null, f, "unmounted");
    }, d);
  }, Bn = (l) => {
    const { type: f, el: d, anchor: p, transition: h } = l;
    if (f === he) {
      ar(d, p);
      return;
    }
    if (f === Tt) {
      M(l);
      return;
    }
    const b = () => {
      r(d), h && !h.persisted && h.afterLeave && h.afterLeave();
    };
    if (l.shapeFlag & 1 && h && !h.persisted) {
      const { leave: y, delayLeave: _ } = h, x = () => y(d, b);
      _ ? _(l.el, b, x) : x();
    } else
      b();
  }, ar = (l, f) => {
    let d;
    for (; l !== f; )
      d = E(l), r(l), l = d;
    r(f);
  }, dr = (l, f, d) => {
    const { bum: p, scope: h, update: b, subTree: y, um: _ } = l;
    p && Vt(p), h.stop(), b && (b.active = !1, ue(y, l, f, d)), _ && ee(_, f), ee(() => {
      l.isUnmounted = !0;
    }, f), f && f.pendingBranch && !f.isUnmounted && l.asyncDep && !l.asyncResolved && l.suspenseId === f.pendingId && (f.deps--, f.deps === 0 && f.resolve());
  }, _e = (l, f, d, p = !1, h = !1, b = 0) => {
    for (let y = b; y < l.length; y++)
      ue(l[y], f, d, p, h);
  }, mt = (l) => l.shapeFlag & 6 ? mt(l.component.subTree) : l.shapeFlag & 128 ? l.suspense.next() : E(l.anchor || l.el), Dn = (l, f, d) => {
    l == null ? f._vnode && ue(f._vnode, null, null, !0) : R(f._vnode || null, l, f, null, null, null, d), kn(), Ws(), f._vnode = l;
  }, $e = {
    p: R,
    um: ue,
    m: Fe,
    r: Bn,
    mt: zt,
    mc: Ie,
    pc: H,
    pbc: Ae,
    n: mt,
    o: e
  };
  let qt, Jt;
  return t && ([qt, Jt] = t(
    $e
  )), {
    render: Dn,
    hydrate: qt,
    createApp: Vi(Dn, qt)
  };
}
function Ne({ effect: e, update: t }, n) {
  e.allowRecurse = t.allowRecurse = n;
}
function or(e, t, n = !1) {
  const s = e.children, r = t.children;
  if (P(s) && P(r))
    for (let i = 0; i < s.length; i++) {
      const o = s[i];
      let c = r[i];
      c.shapeFlag & 1 && !c.dynamicChildren && ((c.patchFlag <= 0 || c.patchFlag === 32) && (c = r[i] = Ce(r[i]), c.el = o.el), n || or(o, c)), c.type === Kt && (c.el = o.el);
    }
}
function so(e) {
  const t = e.slice(), n = [0];
  let s, r, i, o, c;
  const u = e.length;
  for (s = 0; s < u; s++) {
    const a = e[s];
    if (a !== 0) {
      if (r = n[n.length - 1], e[r] < a) {
        t[s] = r, n.push(s);
        continue;
      }
      for (i = 0, o = n.length - 1; i < o; )
        c = i + o >> 1, e[n[c]] < a ? i = c + 1 : o = c;
      a < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, o = n[i - 1]; i-- > 0; )
    n[i] = o, o = t[o];
  return n;
}
const ro = (e) => e.__isTeleport, he = Symbol.for("v-fgt"), Kt = Symbol.for("v-txt"), ft = Symbol.for("v-cmt"), Tt = Symbol.for("v-stc"), rt = [];
let le = null;
function kt(e = !1) {
  rt.push(le = e ? null : []);
}
function io() {
  rt.pop(), le = rt[rt.length - 1] || null;
}
let ut = 1;
function fs(e) {
  ut += e;
}
function lr(e) {
  return e.dynamicChildren = ut > 0 ? le || Le : null, io(), ut > 0 && le && le.push(e), e;
}
function us(e, t, n, s, r, i) {
  return lr(
    it(
      e,
      t,
      n,
      s,
      r,
      i,
      !0
      /* isBlock */
    )
  );
}
function oo(e, t, n, s, r) {
  return lr(
    xe(
      e,
      t,
      n,
      s,
      r,
      !0
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function lo(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function et(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Lt = "__vInternal", cr = ({ key: e }) => e ?? null, Pt = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? W(e) || G(e) || A(e) ? { i: oe, r: e, k: t, f: !!n } : e : null);
function it(e, t = null, n = null, s = 0, r = null, i = e === he ? 0 : 1, o = !1, c = !1) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && cr(t),
    ref: t && Pt(t),
    scopeId: Js,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: oe
  };
  return c ? (Sn(u, n), i & 128 && e.normalize(u)) : n && (u.shapeFlag |= W(n) ? 8 : 16), ut > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  le && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (u.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  u.patchFlag !== 32 && le.push(u), u;
}
const xe = co;
function co(e, t = null, n = null, s = 0, r = null, i = !1) {
  if ((!e || e === $i) && (e = ft), lo(e)) {
    const c = Je(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Sn(c, n), ut > 0 && !i && le && (c.shapeFlag & 6 ? le[le.indexOf(e)] = c : le.push(c)), c.patchFlag |= -2, c;
  }
  if (vo(e) && (e = e.__vccOpts), t) {
    t = fo(t);
    let { class: c, style: u } = t;
    c && !W(c) && (t.class = wn(c)), B(u) && ($s(u) && !P(u) && (u = J({}, u)), t.style = yn(u));
  }
  const o = W(e) ? 1 : vi(e) ? 128 : ro(e) ? 64 : B(e) ? 4 : A(e) ? 2 : 0;
  return it(
    e,
    t,
    n,
    s,
    r,
    o,
    i,
    !0
  );
}
function fo(e) {
  return e ? $s(e) || Lt in e ? J({}, e) : e : null;
}
function Je(e, t, n = !1) {
  const { props: s, ref: r, patchFlag: i, children: o } = e, c = t ? ho(s || {}, t) : s;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: c,
    key: c && cr(c),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? P(r) ? r.concat(Pt(t)) : [r, Pt(t)] : Pt(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: o,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== he ? i === -1 ? 16 : i | 16 : i,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Je(e.ssContent),
    ssFallback: e.ssFallback && Je(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
}
function uo(e = " ", t = 0) {
  return xe(Kt, null, e, t);
}
function ao(e, t) {
  const n = xe(Tt, null, e);
  return n.staticCount = t, n;
}
function pe(e) {
  return e == null || typeof e == "boolean" ? xe(ft) : P(e) ? xe(
    he,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : typeof e == "object" ? Ce(e) : xe(Kt, null, String(e));
}
function Ce(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Je(e);
}
function Sn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (P(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Sn(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !(Lt in t) ? t._ctx = oe : r === 3 && oe && (oe.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else
    A(t) ? (t = { default: t, _ctx: oe }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [uo(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function ho(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = wn([t.class, s.class]));
      else if (r === "style")
        t.style = yn([t.style, s.style]);
      else if (Nt(r)) {
        const i = t[r], o = s[r];
        o && i !== o && !(P(i) && i.includes(o)) && (t[r] = i ? [].concat(i, o) : o);
      } else
        r !== "" && (t[r] = s[r]);
  }
  return t;
}
function de(e, t, n, s = null) {
  fe(e, t, 7, [
    n,
    s
  ]);
}
const po = er();
let go = 0;
function mo(e, t, n) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || po, i = {
    uid: go++,
    vnode: e,
    type: s,
    parent: t,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new Ir(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(r.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: nr(s, r),
    emitsOptions: qs(s, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: $,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: $,
    data: $,
    props: $,
    attrs: $,
    slots: $,
    refs: $,
    setupState: $,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = mi.bind(null, i), e.ce && e.ce(i), i;
}
let q = null, Hn, De, as = "__VUE_INSTANCE_SETTERS__";
(De = tn()[as]) || (De = tn()[as] = []), De.push((e) => q = e), Hn = (e) => {
  De.length > 1 ? De.forEach((t) => t(e)) : De[0](e);
};
const Ye = (e) => {
  Hn(e), e.scope.on();
}, Ue = () => {
  q && q.scope.off(), Hn(null);
};
function fr(e) {
  return e.vnode.shapeFlag & 4;
}
let at = !1;
function _o(e, t = !1) {
  at = t;
  const { props: n, children: s } = e.vnode, r = fr(e);
  Zi(e, n, r, t), Gi(e, s);
  const i = r ? bo(e, t) : void 0;
  return at = !1, i;
}
function bo(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = Bs(new Proxy(e.ctx, Ki));
  const { setup: s } = n;
  if (s) {
    const r = e.setupContext = s.length > 1 ? yo(e) : null;
    Ye(e), Xe();
    const i = Te(
      s,
      e,
      0,
      [e.props, r]
    );
    if (Ze(), Ue(), vs(i)) {
      if (i.then(Ue, Ue), t)
        return i.then((o) => {
          ds(e, o, t);
        }).catch((o) => {
          $t(o, e, 0);
        });
      e.asyncDep = i;
    } else
      ds(e, i, t);
  } else
    ur(e, t);
}
function ds(e, t, n) {
  A(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : B(t) && (e.setupState = Ds(t)), ur(e, n);
}
let hs;
function ur(e, t, n) {
  const s = e.type;
  if (!e.render) {
    if (!t && hs && !s.render) {
      const r = s.template || Nn(e).template;
      if (r) {
        const { isCustomElement: i, compilerOptions: o } = e.appContext.config, { delimiters: c, compilerOptions: u } = s, a = J(
          J(
            {
              isCustomElement: i,
              delimiters: c
            },
            o
          ),
          u
        );
        s.render = hs(r, a);
      }
    }
    e.render = s.render || ce;
  }
  Ye(e), Xe(), Li(e), Ze(), Ue();
}
function xo(e) {
  return e.attrsProxy || (e.attrsProxy = new Proxy(
    e.attrs,
    {
      get(t, n) {
        return te(e, "get", "$attrs"), t[n];
      }
    }
  ));
}
function yo(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    get attrs() {
      return xo(e);
    },
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Un(e) {
  if (e.exposed)
    return e.exposeProxy || (e.exposeProxy = new Proxy(Ds(Bs(e.exposed)), {
      get(t, n) {
        if (n in t)
          return t[n];
        if (n in st)
          return st[n](e);
      },
      has(t, n) {
        return n in t || n in st;
      }
    }));
}
function wo(e, t = !0) {
  return A(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function vo(e) {
  return A(e) && "__vccOpts" in e;
}
const Eo = (e, t) => fi(e, t, at), Co = Symbol.for("v-scx"), Oo = () => Ot(Co), To = "3.3.4", Po = "http://www.w3.org/2000/svg", Se = typeof document < "u" ? document : null, ps = Se && /* @__PURE__ */ Se.createElement("template"), Io = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const r = t ? Se.createElementNS(Po, e) : Se.createElement(e, n ? { is: n } : void 0);
    return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
  },
  createText: (e) => Se.createTextNode(e),
  createComment: (e) => Se.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Se.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, r, i) {
    const o = n ? n.previousSibling : t.lastChild;
    if (r && (r === i || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), n), !(r === i || !(r = r.nextSibling)); )
        ;
    else {
      ps.innerHTML = s ? `<svg>${e}</svg>` : e;
      const c = ps.content;
      if (s) {
        const u = c.firstChild;
        for (; u.firstChild; )
          c.appendChild(u.firstChild);
        c.removeChild(u);
      }
      t.insertBefore(c, n);
    }
    return [
      // first
      o ? o.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
};
function Ao(e, t, n) {
  const s = e._vtc;
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
function Mo(e, t, n) {
  const s = e.style, r = W(n);
  if (n && !r) {
    if (t && !W(t))
      for (const i in t)
        n[i] == null && pn(s, i, "");
    for (const i in n)
      pn(s, i, n[i]);
  } else {
    const i = s.display;
    r ? t !== n && (s.cssText = n) : t && e.removeAttribute("style"), "_vod" in e && (s.display = i);
  }
}
const gs = /\s*!important$/;
function pn(e, t, n) {
  if (P(n))
    n.forEach((s) => pn(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = Fo(e, t);
    gs.test(n) ? e.setProperty(
      Ve(s),
      n.replace(gs, ""),
      "important"
    ) : e[s] = n;
  }
}
const ms = ["Webkit", "Moz", "ms"], Gt = {};
function Fo(e, t) {
  const n = Gt[t];
  if (n)
    return n;
  let s = me(t);
  if (s !== "filter" && s in e)
    return Gt[t] = s;
  s = Ht(s);
  for (let r = 0; r < ms.length; r++) {
    const i = ms[r] + s;
    if (i in e)
      return Gt[t] = i;
  }
  return t;
}
const _s = "http://www.w3.org/1999/xlink";
function Ro(e, t, n, s, r) {
  if (s && t.startsWith("xlink:"))
    n == null ? e.removeAttributeNS(_s, t.slice(6, t.length)) : e.setAttributeNS(_s, t, n);
  else {
    const i = Tr(t);
    n == null || i && !Os(n) ? e.removeAttribute(t) : e.setAttribute(t, i ? "" : n);
  }
}
function No(e, t, n, s, r, i, o) {
  if (t === "innerHTML" || t === "textContent") {
    s && o(s, r, i), e[t] = n ?? "";
    return;
  }
  const c = e.tagName;
  if (t === "value" && c !== "PROGRESS" && // custom elements may use _value internally
  !c.includes("-")) {
    e._value = n;
    const a = c === "OPTION" ? e.getAttribute("value") : e.value, m = n ?? "";
    a !== m && (e.value = m), n == null && e.removeAttribute(t);
    return;
  }
  let u = !1;
  if (n === "" || n == null) {
    const a = typeof e[t];
    a === "boolean" ? n = Os(n) : n == null && a === "string" ? (n = "", u = !0) : a === "number" && (n = 0, u = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  u && e.removeAttribute(t);
}
function jo(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function So(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
function Ho(e, t, n, s, r = null) {
  const i = e._vei || (e._vei = {}), o = i[t];
  if (s && o)
    o.value = s;
  else {
    const [c, u] = Uo(t);
    if (s) {
      const a = i[t] = Do(s, r);
      jo(e, c, a, u);
    } else
      o && (So(e, c, o, u), i[t] = void 0);
  }
}
const bs = /(?:Once|Passive|Capture)$/;
function Uo(e) {
  let t;
  if (bs.test(e)) {
    t = {};
    let s;
    for (; s = e.match(bs); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Ve(e.slice(2)), t];
}
let en = 0;
const $o = /* @__PURE__ */ Promise.resolve(), Bo = () => en || ($o.then(() => en = 0), en = Date.now());
function Do(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    fe(
      Ko(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = Bo(), n;
}
function Ko(e, t) {
  if (P(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map((s) => (r) => !r._stopped && s && s(r));
  } else
    return t;
}
const xs = /^on[a-z]/, Lo = (e, t, n, s, r = !1, i, o, c, u) => {
  t === "class" ? Ao(e, s, r) : t === "style" ? Mo(e, n, s) : Nt(t) ? mn(t) || Ho(e, t, n, s, o) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Wo(e, t, s, r)) ? No(
    e,
    t,
    s,
    i,
    o,
    c,
    u
  ) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Ro(e, t, s, r));
};
function Wo(e, t, n, s) {
  return s ? !!(t === "innerHTML" || t === "textContent" || t in e && xs.test(t) && A(n)) : t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA" || xs.test(t) && W(n) ? !1 : t in e;
}
const zo = /* @__PURE__ */ J({ patchProp: Lo }, Io);
let ys;
function qo() {
  return ys || (ys = to(zo));
}
const Jo = (...e) => {
  const t = qo().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const r = Yo(s);
    if (!r)
      return;
    const i = t._component;
    !A(i) && !i.render && !i.template && (i.template = r.innerHTML), r.innerHTML = "";
    const o = n(r, !1, r instanceof SVGElement);
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, t;
};
function Yo(e) {
  return W(e) ? document.querySelector(e) : e;
}
const Vo = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, Xo = { class: "thread-header" }, Zo = { class: "thread" }, Qo = { class: "message-container" }, ko = /* @__PURE__ */ ao('<div class="attachment-preview"></div><div class="sendbox"><textarea class="textentry" autofocus="true"></textarea><label for="attachment-upload" class="btn btn-attach"><span class="fas fa-paperclip fa-fw"></span></label><input type="file" multiple id="attachment-upload" style="display:none;"><button class="btn btn-send" disabled><span class="fas fa-paper-plane fa-fw"></span></button></div><div class="statusbox">loading</div>', 3);
function Go(e, t, n, s, r, i) {
  const o = Ui("Message");
  return kt(), us("main", null, [
    it("div", Xo, Pr(n.displayName), 1),
    it("div", Zo, [
      it("div", Qo, [
        (kt(!0), us(he, null, Di(r.messages, (c) => (kt(), oo(o))), 256))
      ]),
      ko
    ])
  ]);
}
const el = /* @__PURE__ */ Vo(hr, [["render", Go]]);
function tl(e) {
  Jo(el).mount(e);
}
export {
  tl as mountConversation
};
