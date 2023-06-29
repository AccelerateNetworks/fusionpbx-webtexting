function un(t, e) {
  const r = /* @__PURE__ */ Object.create(null), s = t.split(",");
  for (let i = 0; i < s.length; i++)
    r[s[i]] = !0;
  return e ? (i) => !!r[i.toLowerCase()] : (i) => !!r[i];
}
const pe = {}, Sr = [], at = () => {
}, Lc = () => !1, jc = /^on[^a-z]/, Js = (t) => jc.test(t), fn = (t) => t.startsWith("onUpdate:"), Ie = Object.assign, gn = (t, e) => {
  const r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}, Yc = Object.prototype.hasOwnProperty, Q = (t, e) => Yc.call(t, e), B = Array.isArray, Dr = (t) => Xs(t) === "[object Map]", Va = (t) => Xs(t) === "[object Set]", Z = (t) => typeof t == "function", Te = (t) => typeof t == "string", pn = (t) => typeof t == "symbol", me = (t) => t !== null && typeof t == "object", Ga = (t) => me(t) && Z(t.then) && Z(t.catch), Ka = Object.prototype.toString, Xs = (t) => Ka.call(t), Bc = (t) => Xs(t).slice(8, -1), Za = (t) => Xs(t) === "[object Object]", mn = (t) => Te(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Is = /* @__PURE__ */ un(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Qs = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (r) => e[r] || (e[r] = t(r));
}, Wc = /-(\w)/g, bt = Qs((t) => t.replace(Wc, (e, r) => r ? r.toUpperCase() : "")), Vc = /\B([A-Z])/g, Nr = Qs(
  (t) => t.replace(Vc, "-$1").toLowerCase()
), ei = Qs(
  (t) => t.charAt(0).toUpperCase() + t.slice(1)
), Si = Qs(
  (t) => t ? `on${ei(t)}` : ""
), Fs = (t, e) => !Object.is(t, e), Di = (t, e) => {
  for (let r = 0; r < t.length; r++)
    t[r](e);
}, Ns = (t, e, r) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    value: r
  });
}, Gc = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
};
let aa;
const ji = () => aa || (aa = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function wn(t) {
  if (B(t)) {
    const e = {};
    for (let r = 0; r < t.length; r++) {
      const s = t[r], i = Te(s) ? Jc(s) : wn(s);
      if (i)
        for (const n in i)
          e[n] = i[n];
    }
    return e;
  } else {
    if (Te(t))
      return t;
    if (me(t))
      return t;
  }
}
const Kc = /;(?![^(]*\))/g, Zc = /:([^]+)/, zc = /\/\*[^]*?\*\//g;
function Jc(t) {
  const e = {};
  return t.replace(zc, "").split(Kc).forEach((r) => {
    if (r) {
      const s = r.split(Zc);
      s.length > 1 && (e[s[0].trim()] = s[1].trim());
    }
  }), e;
}
function yn(t) {
  let e = "";
  if (Te(t))
    e = t;
  else if (B(t))
    for (let r = 0; r < t.length; r++) {
      const s = yn(t[r]);
      s && (e += s + " ");
    }
  else if (me(t))
    for (const r in t)
      t[r] && (e += r + " ");
  return e.trim();
}
const Xc = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Qc = /* @__PURE__ */ un(Xc);
function za(t) {
  return !!t || t === "";
}
const el = (t) => Te(t) ? t : t == null ? "" : B(t) || me(t) && (t.toString === Ka || !Z(t.toString)) ? JSON.stringify(t, Ja, 2) : String(t), Ja = (t, e) => e && e.__v_isRef ? Ja(t, e.value) : Dr(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce((r, [s, i]) => (r[`${s} =>`] = i, r), {})
} : Va(e) ? {
  [`Set(${e.size})`]: [...e.values()]
} : me(e) && !B(e) && !Za(e) ? String(e) : e;
let Qe;
class tl {
  constructor(e = !1) {
    this.detached = e, this._active = !0, this.effects = [], this.cleanups = [], this.parent = Qe, !e && Qe && (this.index = (Qe.scopes || (Qe.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(e) {
    if (this._active) {
      const r = Qe;
      try {
        return Qe = this, e();
      } finally {
        Qe = r;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    Qe = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    Qe = this.parent;
  }
  stop(e) {
    if (this._active) {
      let r, s;
      for (r = 0, s = this.effects.length; r < s; r++)
        this.effects[r].stop();
      for (r = 0, s = this.cleanups.length; r < s; r++)
        this.cleanups[r]();
      if (this.scopes)
        for (r = 0, s = this.scopes.length; r < s; r++)
          this.scopes[r].stop(!0);
      if (!this.detached && this.parent && !e) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function rl(t, e = Qe) {
  e && e.active && e.effects.push(t);
}
function sl() {
  return Qe;
}
const vn = (t) => {
  const e = new Set(t);
  return e.w = 0, e.n = 0, e;
}, Xa = (t) => (t.w & er) > 0, Qa = (t) => (t.n & er) > 0, il = ({ deps: t }) => {
  if (t.length)
    for (let e = 0; e < t.length; e++)
      t[e].w |= er;
}, nl = (t) => {
  const { deps: e } = t;
  if (e.length) {
    let r = 0;
    for (let s = 0; s < e.length; s++) {
      const i = e[s];
      Xa(i) && !Qa(i) ? i.delete(t) : e[r++] = i, i.w &= ~er, i.n &= ~er;
    }
    e.length = r;
  }
}, Yi = /* @__PURE__ */ new WeakMap();
let Kr = 0, er = 1;
const Bi = 30;
let tt;
const dr = Symbol(""), Wi = Symbol("");
class bn {
  constructor(e, r = null, s) {
    this.fn = e, this.scheduler = r, this.active = !0, this.deps = [], this.parent = void 0, rl(this, s);
  }
  run() {
    if (!this.active)
      return this.fn();
    let e = tt, r = Jt;
    for (; e; ) {
      if (e === this)
        return;
      e = e.parent;
    }
    try {
      return this.parent = tt, tt = this, Jt = !0, er = 1 << ++Kr, Kr <= Bi ? il(this) : oa(this), this.fn();
    } finally {
      Kr <= Bi && nl(this), er = 1 << --Kr, tt = this.parent, Jt = r, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    tt === this ? this.deferStop = !0 : this.active && (oa(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function oa(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let r = 0; r < e.length; r++)
      e[r].delete(t);
    e.length = 0;
  }
}
let Jt = !0;
const eo = [];
function qr() {
  eo.push(Jt), Jt = !1;
}
function Ur() {
  const t = eo.pop();
  Jt = t === void 0 ? !0 : t;
}
function Le(t, e, r) {
  if (Jt && tt) {
    let s = Yi.get(t);
    s || Yi.set(t, s = /* @__PURE__ */ new Map());
    let i = s.get(r);
    i || s.set(r, i = vn()), to(i);
  }
}
function to(t, e) {
  let r = !1;
  Kr <= Bi ? Qa(t) || (t.n |= er, r = !Xa(t)) : r = !t.has(tt), r && (t.add(tt), tt.deps.push(t));
}
function Ft(t, e, r, s, i, n) {
  const a = Yi.get(t);
  if (!a)
    return;
  let o = [];
  if (e === "clear")
    o = [...a.values()];
  else if (r === "length" && B(t)) {
    const c = Number(s);
    a.forEach((l, h) => {
      (h === "length" || h >= c) && o.push(l);
    });
  } else
    switch (r !== void 0 && o.push(a.get(r)), e) {
      case "add":
        B(t) ? mn(r) && o.push(a.get("length")) : (o.push(a.get(dr)), Dr(t) && o.push(a.get(Wi)));
        break;
      case "delete":
        B(t) || (o.push(a.get(dr)), Dr(t) && o.push(a.get(Wi)));
        break;
      case "set":
        Dr(t) && o.push(a.get(dr));
        break;
    }
  if (o.length === 1)
    o[0] && Vi(o[0]);
  else {
    const c = [];
    for (const l of o)
      l && c.push(...l);
    Vi(vn(c));
  }
}
function Vi(t, e) {
  const r = B(t) ? t : [...t];
  for (const s of r)
    s.computed && ca(s);
  for (const s of r)
    s.computed || ca(s);
}
function ca(t, e) {
  (t !== tt || t.allowRecurse) && (t.scheduler ? t.scheduler() : t.run());
}
const al = /* @__PURE__ */ un("__proto__,__v_isRef,__isVue"), ro = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(pn)
), ol = /* @__PURE__ */ _n(), cl = /* @__PURE__ */ _n(!1, !0), ll = /* @__PURE__ */ _n(!0), la = /* @__PURE__ */ dl();
function dl() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...r) {
      const s = ie(this);
      for (let n = 0, a = this.length; n < a; n++)
        Le(s, "get", n + "");
      const i = s[e](...r);
      return i === -1 || i === !1 ? s[e](...r.map(ie)) : i;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...r) {
      qr();
      const s = ie(this)[e].apply(this, r);
      return Ur(), s;
    };
  }), t;
}
function hl(t) {
  const e = ie(this);
  return Le(e, "has", t), e.hasOwnProperty(t);
}
function _n(t = !1, e = !1) {
  return function(s, i, n) {
    if (i === "__v_isReactive")
      return !t;
    if (i === "__v_isReadonly")
      return t;
    if (i === "__v_isShallow")
      return e;
    if (i === "__v_raw" && n === (t ? e ? Cl : oo : e ? ao : no).get(s))
      return s;
    const a = B(s);
    if (!t) {
      if (a && Q(la, i))
        return Reflect.get(la, i, n);
      if (i === "hasOwnProperty")
        return hl;
    }
    const o = Reflect.get(s, i, n);
    return (pn(i) ? ro.has(i) : al(i)) || (t || Le(s, "get", i), e) ? o : Me(o) ? a && mn(i) ? o : o.value : me(o) ? t ? co(o) : En(o) : o;
  };
}
const ul = /* @__PURE__ */ so(), fl = /* @__PURE__ */ so(!0);
function so(t = !1) {
  return function(r, s, i, n) {
    let a = r[s];
    if (rs(a) && Me(a) && !Me(i))
      return !1;
    if (!t && (!Gi(i) && !rs(i) && (a = ie(a), i = ie(i)), !B(r) && Me(a) && !Me(i)))
      return a.value = i, !0;
    const o = B(r) && mn(s) ? Number(s) < r.length : Q(r, s), c = Reflect.set(r, s, i, n);
    return r === ie(n) && (o ? Fs(i, a) && Ft(r, "set", s, i) : Ft(r, "add", s, i)), c;
  };
}
function gl(t, e) {
  const r = Q(t, e);
  t[e];
  const s = Reflect.deleteProperty(t, e);
  return s && r && Ft(t, "delete", e, void 0), s;
}
function pl(t, e) {
  const r = Reflect.has(t, e);
  return (!pn(e) || !ro.has(e)) && Le(t, "has", e), r;
}
function ml(t) {
  return Le(t, "iterate", B(t) ? "length" : dr), Reflect.ownKeys(t);
}
const io = {
  get: ol,
  set: ul,
  deleteProperty: gl,
  has: pl,
  ownKeys: ml
}, wl = {
  get: ll,
  set(t, e) {
    return !0;
  },
  deleteProperty(t, e) {
    return !0;
  }
}, yl = /* @__PURE__ */ Ie(
  {},
  io,
  {
    get: cl,
    set: fl
  }
), xn = (t) => t, ti = (t) => Reflect.getPrototypeOf(t);
function bs(t, e, r = !1, s = !1) {
  t = t.__v_raw;
  const i = ie(t), n = ie(e);
  r || (e !== n && Le(i, "get", e), Le(i, "get", n));
  const { has: a } = ti(i), o = s ? xn : r ? Cn : Dn;
  if (a.call(i, e))
    return o(t.get(e));
  if (a.call(i, n))
    return o(t.get(n));
  t !== i && t.get(e);
}
function _s(t, e = !1) {
  const r = this.__v_raw, s = ie(r), i = ie(t);
  return e || (t !== i && Le(s, "has", t), Le(s, "has", i)), t === i ? r.has(t) : r.has(t) || r.has(i);
}
function xs(t, e = !1) {
  return t = t.__v_raw, !e && Le(ie(t), "iterate", dr), Reflect.get(t, "size", t);
}
function da(t) {
  t = ie(t);
  const e = ie(this);
  return ti(e).has.call(e, t) || (e.add(t), Ft(e, "add", t, t)), this;
}
function ha(t, e) {
  e = ie(e);
  const r = ie(this), { has: s, get: i } = ti(r);
  let n = s.call(r, t);
  n || (t = ie(t), n = s.call(r, t));
  const a = i.call(r, t);
  return r.set(t, e), n ? Fs(e, a) && Ft(r, "set", t, e) : Ft(r, "add", t, e), this;
}
function ua(t) {
  const e = ie(this), { has: r, get: s } = ti(e);
  let i = r.call(e, t);
  i || (t = ie(t), i = r.call(e, t)), s && s.call(e, t);
  const n = e.delete(t);
  return i && Ft(e, "delete", t, void 0), n;
}
function fa() {
  const t = ie(this), e = t.size !== 0, r = t.clear();
  return e && Ft(t, "clear", void 0, void 0), r;
}
function Ts(t, e) {
  return function(s, i) {
    const n = this, a = n.__v_raw, o = ie(a), c = e ? xn : t ? Cn : Dn;
    return !t && Le(o, "iterate", dr), a.forEach((l, h) => s.call(i, c(l), c(h), n));
  };
}
function Es(t, e, r) {
  return function(...s) {
    const i = this.__v_raw, n = ie(i), a = Dr(n), o = t === "entries" || t === Symbol.iterator && a, c = t === "keys" && a, l = i[t](...s), h = r ? xn : e ? Cn : Dn;
    return !e && Le(
      n,
      "iterate",
      c ? Wi : dr
    ), {
      // iterator protocol
      next() {
        const { value: f, done: x } = l.next();
        return x ? { value: f, done: x } : {
          value: o ? [h(f[0]), h(f[1])] : h(f),
          done: x
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Yt(t) {
  return function(...e) {
    return t === "delete" ? !1 : this;
  };
}
function vl() {
  const t = {
    get(n) {
      return bs(this, n);
    },
    get size() {
      return xs(this);
    },
    has: _s,
    add: da,
    set: ha,
    delete: ua,
    clear: fa,
    forEach: Ts(!1, !1)
  }, e = {
    get(n) {
      return bs(this, n, !1, !0);
    },
    get size() {
      return xs(this);
    },
    has: _s,
    add: da,
    set: ha,
    delete: ua,
    clear: fa,
    forEach: Ts(!1, !0)
  }, r = {
    get(n) {
      return bs(this, n, !0);
    },
    get size() {
      return xs(this, !0);
    },
    has(n) {
      return _s.call(this, n, !0);
    },
    add: Yt("add"),
    set: Yt("set"),
    delete: Yt("delete"),
    clear: Yt("clear"),
    forEach: Ts(!0, !1)
  }, s = {
    get(n) {
      return bs(this, n, !0, !0);
    },
    get size() {
      return xs(this, !0);
    },
    has(n) {
      return _s.call(this, n, !0);
    },
    add: Yt("add"),
    set: Yt("set"),
    delete: Yt("delete"),
    clear: Yt("clear"),
    forEach: Ts(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((n) => {
    t[n] = Es(
      n,
      !1,
      !1
    ), r[n] = Es(
      n,
      !0,
      !1
    ), e[n] = Es(
      n,
      !1,
      !0
    ), s[n] = Es(
      n,
      !0,
      !0
    );
  }), [
    t,
    r,
    e,
    s
  ];
}
const [
  bl,
  _l,
  xl,
  Tl
] = /* @__PURE__ */ vl();
function Tn(t, e) {
  const r = e ? t ? Tl : xl : t ? _l : bl;
  return (s, i, n) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? s : Reflect.get(
    Q(r, i) && i in s ? r : s,
    i,
    n
  );
}
const El = {
  get: /* @__PURE__ */ Tn(!1, !1)
}, Sl = {
  get: /* @__PURE__ */ Tn(!1, !0)
}, Dl = {
  get: /* @__PURE__ */ Tn(!0, !1)
}, no = /* @__PURE__ */ new WeakMap(), ao = /* @__PURE__ */ new WeakMap(), oo = /* @__PURE__ */ new WeakMap(), Cl = /* @__PURE__ */ new WeakMap();
function Il(t) {
  switch (t) {
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
function Rl(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : Il(Bc(t));
}
function En(t) {
  return rs(t) ? t : Sn(
    t,
    !1,
    io,
    El,
    no
  );
}
function $l(t) {
  return Sn(
    t,
    !1,
    yl,
    Sl,
    ao
  );
}
function co(t) {
  return Sn(
    t,
    !0,
    wl,
    Dl,
    oo
  );
}
function Sn(t, e, r, s, i) {
  if (!me(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const n = i.get(t);
  if (n)
    return n;
  const a = Rl(t);
  if (a === 0)
    return t;
  const o = new Proxy(
    t,
    a === 2 ? s : r
  );
  return i.set(t, o), o;
}
function Cr(t) {
  return rs(t) ? Cr(t.__v_raw) : !!(t && t.__v_isReactive);
}
function rs(t) {
  return !!(t && t.__v_isReadonly);
}
function Gi(t) {
  return !!(t && t.__v_isShallow);
}
function lo(t) {
  return Cr(t) || rs(t);
}
function ie(t) {
  const e = t && t.__v_raw;
  return e ? ie(e) : t;
}
function ho(t) {
  return Ns(t, "__v_skip", !0), t;
}
const Dn = (t) => me(t) ? En(t) : t, Cn = (t) => me(t) ? co(t) : t;
function Al(t) {
  Jt && tt && (t = ie(t), to(t.dep || (t.dep = vn())));
}
function kl(t, e) {
  t = ie(t);
  const r = t.dep;
  r && Vi(r);
}
function Me(t) {
  return !!(t && t.__v_isRef === !0);
}
function Pl(t) {
  return Me(t) ? t.value : t;
}
const Hl = {
  get: (t, e, r) => Pl(Reflect.get(t, e, r)),
  set: (t, e, r, s) => {
    const i = t[e];
    return Me(i) && !Me(r) ? (i.value = r, !0) : Reflect.set(t, e, r, s);
  }
};
function uo(t) {
  return Cr(t) ? t : new Proxy(t, Hl);
}
class Ol {
  constructor(e, r, s, i) {
    this._setter = r, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this._dirty = !0, this.effect = new bn(e, () => {
      this._dirty || (this._dirty = !0, kl(this));
    }), this.effect.computed = this, this.effect.active = this._cacheable = !i, this.__v_isReadonly = s;
  }
  get value() {
    const e = ie(this);
    return Al(e), (e._dirty || !e._cacheable) && (e._dirty = !1, e._value = e.effect.run()), e._value;
  }
  set value(e) {
    this._setter(e);
  }
}
function Ml(t, e, r = !1) {
  let s, i;
  const n = Z(t);
  return n ? (s = t, i = at) : (s = t.get, i = t.set), new Ol(s, i, n || !i, r);
}
function Xt(t, e, r, s) {
  let i;
  try {
    i = s ? t(...s) : t();
  } catch (n) {
    ri(n, e, r);
  }
  return i;
}
function ot(t, e, r, s) {
  if (Z(t)) {
    const n = Xt(t, e, r, s);
    return n && Ga(n) && n.catch((a) => {
      ri(a, e, r);
    }), n;
  }
  const i = [];
  for (let n = 0; n < t.length; n++)
    i.push(ot(t[n], e, r, s));
  return i;
}
function ri(t, e, r, s = !0) {
  const i = e ? e.vnode : null;
  if (e) {
    let n = e.parent;
    const a = e.proxy, o = r;
    for (; n; ) {
      const l = n.ec;
      if (l) {
        for (let h = 0; h < l.length; h++)
          if (l[h](t, a, o) === !1)
            return;
      }
      n = n.parent;
    }
    const c = e.appContext.config.errorHandler;
    if (c) {
      Xt(
        c,
        null,
        10,
        [t, a, o]
      );
      return;
    }
  }
  Fl(t, r, i, s);
}
function Fl(t, e, r, s = !0) {
  console.error(t);
}
let ss = !1, Ki = !1;
const $e = [];
let wt = 0;
const Ir = [];
let $t = null, ar = 0;
const fo = /* @__PURE__ */ Promise.resolve();
let In = null;
function Nl(t) {
  const e = In || fo;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function ql(t) {
  let e = wt + 1, r = $e.length;
  for (; e < r; ) {
    const s = e + r >>> 1;
    is($e[s]) < t ? e = s + 1 : r = s;
  }
  return e;
}
function Rn(t) {
  (!$e.length || !$e.includes(
    t,
    ss && t.allowRecurse ? wt + 1 : wt
  )) && (t.id == null ? $e.push(t) : $e.splice(ql(t.id), 0, t), go());
}
function go() {
  !ss && !Ki && (Ki = !0, In = fo.then(mo));
}
function Ul(t) {
  const e = $e.indexOf(t);
  e > wt && $e.splice(e, 1);
}
function Ll(t) {
  B(t) ? Ir.push(...t) : (!$t || !$t.includes(
    t,
    t.allowRecurse ? ar + 1 : ar
  )) && Ir.push(t), go();
}
function ga(t, e = ss ? wt + 1 : 0) {
  for (; e < $e.length; e++) {
    const r = $e[e];
    r && r.pre && ($e.splice(e, 1), e--, r());
  }
}
function po(t) {
  if (Ir.length) {
    const e = [...new Set(Ir)];
    if (Ir.length = 0, $t) {
      $t.push(...e);
      return;
    }
    for ($t = e, $t.sort((r, s) => is(r) - is(s)), ar = 0; ar < $t.length; ar++)
      $t[ar]();
    $t = null, ar = 0;
  }
}
const is = (t) => t.id == null ? 1 / 0 : t.id, jl = (t, e) => {
  const r = is(t) - is(e);
  if (r === 0) {
    if (t.pre && !e.pre)
      return -1;
    if (e.pre && !t.pre)
      return 1;
  }
  return r;
};
function mo(t) {
  Ki = !1, ss = !0, $e.sort(jl);
  const e = at;
  try {
    for (wt = 0; wt < $e.length; wt++) {
      const r = $e[wt];
      r && r.active !== !1 && Xt(r, null, 14);
    }
  } finally {
    wt = 0, $e.length = 0, po(), ss = !1, In = null, ($e.length || Ir.length) && mo();
  }
}
function Yl(t, e, ...r) {
  if (t.isUnmounted)
    return;
  const s = t.vnode.props || pe;
  let i = r;
  const n = e.startsWith("update:"), a = n && e.slice(7);
  if (a && a in s) {
    const h = `${a === "modelValue" ? "model" : a}Modifiers`, { number: f, trim: x } = s[h] || pe;
    x && (i = r.map((O) => Te(O) ? O.trim() : O)), f && (i = r.map(Gc));
  }
  let o, c = s[o = Si(e)] || // also try camelCase event handler (#2249)
  s[o = Si(bt(e))];
  !c && n && (c = s[o = Si(Nr(e))]), c && ot(
    c,
    t,
    6,
    i
  );
  const l = s[o + "Once"];
  if (l) {
    if (!t.emitted)
      t.emitted = {};
    else if (t.emitted[o])
      return;
    t.emitted[o] = !0, ot(
      l,
      t,
      6,
      i
    );
  }
}
function wo(t, e, r = !1) {
  const s = e.emitsCache, i = s.get(t);
  if (i !== void 0)
    return i;
  const n = t.emits;
  let a = {}, o = !1;
  if (!Z(t)) {
    const c = (l) => {
      const h = wo(l, e, !0);
      h && (o = !0, Ie(a, h));
    };
    !r && e.mixins.length && e.mixins.forEach(c), t.extends && c(t.extends), t.mixins && t.mixins.forEach(c);
  }
  return !n && !o ? (me(t) && s.set(t, null), null) : (B(n) ? n.forEach((c) => a[c] = null) : Ie(a, n), me(t) && s.set(t, a), a);
}
function si(t, e) {
  return !t || !Js(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), Q(t, e[0].toLowerCase() + e.slice(1)) || Q(t, Nr(e)) || Q(t, e));
}
let st = null, yo = null;
function qs(t) {
  const e = st;
  return st = t, yo = t && t.type.__scopeId || null, e;
}
function Bl(t, e = st, r) {
  if (!e || t._n)
    return t;
  const s = (...i) => {
    s._d && Sa(-1);
    const n = qs(e);
    let a;
    try {
      a = t(...i);
    } finally {
      qs(n), s._d && Sa(1);
    }
    return a;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function Ci(t) {
  const {
    type: e,
    vnode: r,
    proxy: s,
    withProxy: i,
    props: n,
    propsOptions: [a],
    slots: o,
    attrs: c,
    emit: l,
    render: h,
    renderCache: f,
    data: x,
    setupState: O,
    ctx: W,
    inheritAttrs: M
  } = t;
  let le, m;
  const V = qs(t);
  try {
    if (r.shapeFlag & 4) {
      const K = i || s;
      le = gt(
        h.call(
          K,
          K,
          f,
          n,
          O,
          x,
          W
        )
      ), m = c;
    } else {
      const K = e;
      le = gt(
        K.length > 1 ? K(
          n,
          { attrs: c, slots: o, emit: l }
        ) : K(
          n,
          null
          /* we know it doesn't need it */
        )
      ), m = e.props ? c : Wl(c);
    }
  } catch (K) {
    Jr.length = 0, ri(K, t, 1), le = Ot(ns);
  }
  let ye = le;
  if (m && M !== !1) {
    const K = Object.keys(m), { shapeFlag: Ge } = ye;
    K.length && Ge & 7 && (a && K.some(fn) && (m = Vl(
      m,
      a
    )), ye = Or(ye, m));
  }
  return r.dirs && (ye = Or(ye), ye.dirs = ye.dirs ? ye.dirs.concat(r.dirs) : r.dirs), r.transition && (ye.transition = r.transition), le = ye, qs(V), le;
}
const Wl = (t) => {
  let e;
  for (const r in t)
    (r === "class" || r === "style" || Js(r)) && ((e || (e = {}))[r] = t[r]);
  return e;
}, Vl = (t, e) => {
  const r = {};
  for (const s in t)
    (!fn(s) || !(s.slice(9) in e)) && (r[s] = t[s]);
  return r;
};
function Gl(t, e, r) {
  const { props: s, children: i, component: n } = t, { props: a, children: o, patchFlag: c } = e, l = n.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (r && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? pa(s, a, l) : !!a;
    if (c & 8) {
      const h = e.dynamicProps;
      for (let f = 0; f < h.length; f++) {
        const x = h[f];
        if (a[x] !== s[x] && !si(l, x))
          return !0;
      }
    }
  } else
    return (i || o) && (!o || !o.$stable) ? !0 : s === a ? !1 : s ? a ? pa(s, a, l) : !0 : !!a;
  return !1;
}
function pa(t, e, r) {
  const s = Object.keys(e);
  if (s.length !== Object.keys(t).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const n = s[i];
    if (e[n] !== t[n] && !si(r, n))
      return !0;
  }
  return !1;
}
function Kl({ vnode: t, parent: e }, r) {
  for (; e && e.subTree === t; )
    (t = e.vnode).el = r, e = e.parent;
}
const Zl = (t) => t.__isSuspense;
function zl(t, e) {
  e && e.pendingBranch ? B(t) ? e.effects.push(...t) : e.effects.push(t) : Ll(t);
}
const Ss = {};
function Ii(t, e, r) {
  return vo(t, e, r);
}
function vo(t, e, { immediate: r, deep: s, flush: i, onTrack: n, onTrigger: a } = pe) {
  var o;
  const c = sl() === ((o = Ce) == null ? void 0 : o.scope) ? Ce : null;
  let l, h = !1, f = !1;
  if (Me(t) ? (l = () => t.value, h = Gi(t)) : Cr(t) ? (l = () => t, s = !0) : B(t) ? (f = !0, h = t.some((K) => Cr(K) || Gi(K)), l = () => t.map((K) => {
    if (Me(K))
      return K.value;
    if (Cr(K))
      return Tr(K);
    if (Z(K))
      return Xt(K, c, 2);
  })) : Z(t) ? e ? l = () => Xt(t, c, 2) : l = () => {
    if (!(c && c.isUnmounted))
      return x && x(), ot(
        t,
        c,
        3,
        [O]
      );
  } : l = at, e && s) {
    const K = l;
    l = () => Tr(K());
  }
  let x, O = (K) => {
    x = V.onStop = () => {
      Xt(K, c, 4);
    };
  }, W;
  if (os)
    if (O = at, e ? r && ot(e, c, 3, [
      l(),
      f ? [] : void 0,
      O
    ]) : l(), i === "sync") {
      const K = Jd();
      W = K.__watcherHandles || (K.__watcherHandles = []);
    } else
      return at;
  let M = f ? new Array(t.length).fill(Ss) : Ss;
  const le = () => {
    if (V.active)
      if (e) {
        const K = V.run();
        (s || h || (f ? K.some(
          (Ge, jt) => Fs(Ge, M[jt])
        ) : Fs(K, M))) && (x && x(), ot(e, c, 3, [
          K,
          // pass undefined as the old value when it's changed for the first time
          M === Ss ? void 0 : f && M[0] === Ss ? [] : M,
          O
        ]), M = K);
      } else
        V.run();
  };
  le.allowRecurse = !!e;
  let m;
  i === "sync" ? m = le : i === "post" ? m = () => Fe(le, c && c.suspense) : (le.pre = !0, c && (le.id = c.uid), m = () => Rn(le));
  const V = new bn(l, m);
  e ? r ? le() : M = V.run() : i === "post" ? Fe(
    V.run.bind(V),
    c && c.suspense
  ) : V.run();
  const ye = () => {
    V.stop(), c && c.scope && gn(c.scope.effects, V);
  };
  return W && W.push(ye), ye;
}
function Jl(t, e, r) {
  const s = this.proxy, i = Te(t) ? t.includes(".") ? bo(s, t) : () => s[t] : t.bind(s, s);
  let n;
  Z(e) ? n = e : (n = e.handler, r = e);
  const a = Ce;
  Mr(this);
  const o = vo(i, n.bind(s), r);
  return a ? Mr(a) : hr(), o;
}
function bo(t, e) {
  const r = e.split(".");
  return () => {
    let s = t;
    for (let i = 0; i < r.length && s; i++)
      s = s[r[i]];
    return s;
  };
}
function Tr(t, e) {
  if (!me(t) || t.__v_skip || (e = e || /* @__PURE__ */ new Set(), e.has(t)))
    return t;
  if (e.add(t), Me(t))
    Tr(t.value, e);
  else if (B(t))
    for (let r = 0; r < t.length; r++)
      Tr(t[r], e);
  else if (Va(t) || Dr(t))
    t.forEach((r) => {
      Tr(r, e);
    });
  else if (Za(t))
    for (const r in t)
      Tr(t[r], e);
  return t;
}
function sr(t, e, r, s) {
  const i = t.dirs, n = e && e.dirs;
  for (let a = 0; a < i.length; a++) {
    const o = i[a];
    n && (o.oldValue = n[a].value);
    let c = o.dir[s];
    c && (qr(), ot(c, r, 8, [
      t.el,
      o,
      t,
      e
    ]), Ur());
  }
}
const Rs = (t) => !!t.type.__asyncLoader, _o = (t) => t.type.__isKeepAlive;
function Xl(t, e) {
  xo(t, "a", e);
}
function Ql(t, e) {
  xo(t, "da", e);
}
function xo(t, e, r = Ce) {
  const s = t.__wdc || (t.__wdc = () => {
    let i = r;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return t();
  });
  if (ii(e, s, r), r) {
    let i = r.parent;
    for (; i && i.parent; )
      _o(i.parent.vnode) && ed(s, e, r, i), i = i.parent;
  }
}
function ed(t, e, r, s) {
  const i = ii(
    e,
    t,
    s,
    !0
    /* prepend */
  );
  To(() => {
    gn(s[e], i);
  }, r);
}
function ii(t, e, r = Ce, s = !1) {
  if (r) {
    const i = r[t] || (r[t] = []), n = e.__weh || (e.__weh = (...a) => {
      if (r.isUnmounted)
        return;
      qr(), Mr(r);
      const o = ot(e, r, t, a);
      return hr(), Ur(), o;
    });
    return s ? i.unshift(n) : i.push(n), n;
  }
}
const qt = (t) => (e, r = Ce) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!os || t === "sp") && ii(t, (...s) => e(...s), r)
), td = qt("bm"), rd = qt("m"), sd = qt("bu"), id = qt("u"), nd = qt("bum"), To = qt("um"), ad = qt("sp"), od = qt(
  "rtg"
), cd = qt(
  "rtc"
);
function ld(t, e = Ce) {
  ii("ec", t, e);
}
const Eo = "components";
function dd(t, e) {
  return ud(Eo, t, !0, e) || t;
}
const hd = Symbol.for("v-ndc");
function ud(t, e, r = !0, s = !1) {
  const i = st || Ce;
  if (i) {
    const n = i.type;
    if (t === Eo) {
      const o = Gd(
        n,
        !1
        /* do not include inferred name to avoid breaking existing code */
      );
      if (o && (o === e || o === bt(e) || o === ei(bt(e))))
        return n;
    }
    const a = (
      // local registration
      // check instance[type] first which is resolved for options API
      ma(i[t] || n[t], e) || // global registration
      ma(i.appContext[t], e)
    );
    return !a && s ? n : a;
  }
}
function ma(t, e) {
  return t && (t[e] || t[bt(e)] || t[ei(bt(e))]);
}
function fd(t, e, r, s) {
  let i;
  const n = r && r[s];
  if (B(t) || Te(t)) {
    i = new Array(t.length);
    for (let a = 0, o = t.length; a < o; a++)
      i[a] = e(t[a], a, void 0, n && n[a]);
  } else if (typeof t == "number") {
    i = new Array(t);
    for (let a = 0; a < t; a++)
      i[a] = e(a + 1, a, void 0, n && n[a]);
  } else if (me(t))
    if (t[Symbol.iterator])
      i = Array.from(
        t,
        (a, o) => e(a, o, void 0, n && n[o])
      );
    else {
      const a = Object.keys(t);
      i = new Array(a.length);
      for (let o = 0, c = a.length; o < c; o++) {
        const l = a[o];
        i[o] = e(t[l], l, o, n && n[o]);
      }
    }
  else
    i = [];
  return r && (r[s] = i), i;
}
const Zi = (t) => t ? Oo(t) ? Hn(t) || t.proxy : Zi(t.parent) : null, zr = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ie(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => Zi(t.parent),
    $root: (t) => Zi(t.root),
    $emit: (t) => t.emit,
    $options: (t) => $n(t),
    $forceUpdate: (t) => t.f || (t.f = () => Rn(t.update)),
    $nextTick: (t) => t.n || (t.n = Nl.bind(t.proxy)),
    $watch: (t) => Jl.bind(t)
  })
), Ri = (t, e) => t !== pe && !t.__isScriptSetup && Q(t, e), gd = {
  get({ _: t }, e) {
    const { ctx: r, setupState: s, data: i, props: n, accessCache: a, type: o, appContext: c } = t;
    let l;
    if (e[0] !== "$") {
      const O = a[e];
      if (O !== void 0)
        switch (O) {
          case 1:
            return s[e];
          case 2:
            return i[e];
          case 4:
            return r[e];
          case 3:
            return n[e];
        }
      else {
        if (Ri(s, e))
          return a[e] = 1, s[e];
        if (i !== pe && Q(i, e))
          return a[e] = 2, i[e];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (l = t.propsOptions[0]) && Q(l, e)
        )
          return a[e] = 3, n[e];
        if (r !== pe && Q(r, e))
          return a[e] = 4, r[e];
        zi && (a[e] = 0);
      }
    }
    const h = zr[e];
    let f, x;
    if (h)
      return e === "$attrs" && Le(t, "get", e), h(t);
    if (
      // css module (injected by vue-loader)
      (f = o.__cssModules) && (f = f[e])
    )
      return f;
    if (r !== pe && Q(r, e))
      return a[e] = 4, r[e];
    if (
      // global properties
      x = c.config.globalProperties, Q(x, e)
    )
      return x[e];
  },
  set({ _: t }, e, r) {
    const { data: s, setupState: i, ctx: n } = t;
    return Ri(i, e) ? (i[e] = r, !0) : s !== pe && Q(s, e) ? (s[e] = r, !0) : Q(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (n[e] = r, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: r, ctx: s, appContext: i, propsOptions: n }
  }, a) {
    let o;
    return !!r[a] || t !== pe && Q(t, a) || Ri(e, a) || (o = n[0]) && Q(o, a) || Q(s, a) || Q(zr, a) || Q(i.config.globalProperties, a);
  },
  defineProperty(t, e, r) {
    return r.get != null ? t._.accessCache[e] = 0 : Q(r, "value") && this.set(t, e, r.value, null), Reflect.defineProperty(t, e, r);
  }
};
function wa(t) {
  return B(t) ? t.reduce(
    (e, r) => (e[r] = null, e),
    {}
  ) : t;
}
let zi = !0;
function pd(t) {
  const e = $n(t), r = t.proxy, s = t.ctx;
  zi = !1, e.beforeCreate && ya(e.beforeCreate, t, "bc");
  const {
    // state
    data: i,
    computed: n,
    methods: a,
    watch: o,
    provide: c,
    inject: l,
    // lifecycle
    created: h,
    beforeMount: f,
    mounted: x,
    beforeUpdate: O,
    updated: W,
    activated: M,
    deactivated: le,
    beforeDestroy: m,
    beforeUnmount: V,
    destroyed: ye,
    unmounted: K,
    render: Ge,
    renderTracked: jt,
    renderTriggered: mr,
    errorCaptured: d,
    serverPrefetch: wr,
    // public API
    expose: St,
    inheritAttrs: p,
    // assets
    components: v,
    directives: w,
    filters: Re
  } = e;
  if (l && md(l, s, null), a)
    for (const F in a) {
      const se = a[F];
      Z(se) && (s[F] = se.bind(r));
    }
  if (i) {
    const F = i.call(r, r);
    me(F) && (t.data = En(F));
  }
  if (zi = !0, n)
    for (const F in n) {
      const se = n[F], Dt = Z(se) ? se.bind(r, r) : Z(se.get) ? se.get.bind(r, r) : at, ys = !Z(se) && Z(se.set) ? se.set.bind(r) : at, rr = Zd({
        get: Dt,
        set: ys
      });
      Object.defineProperty(s, F, {
        enumerable: !0,
        configurable: !0,
        get: () => rr.value,
        set: (ht) => rr.value = ht
      });
    }
  if (o)
    for (const F in o)
      So(o[F], s, r, F);
  if (c) {
    const F = Z(c) ? c.call(r) : c;
    Reflect.ownKeys(F).forEach((se) => {
      xd(se, F[se]);
    });
  }
  h && ya(h, t, "c");
  function de(F, se) {
    B(se) ? se.forEach((Dt) => F(Dt.bind(r))) : se && F(se.bind(r));
  }
  if (de(td, f), de(rd, x), de(sd, O), de(id, W), de(Xl, M), de(Ql, le), de(ld, d), de(cd, jt), de(od, mr), de(nd, V), de(To, K), de(ad, wr), B(St))
    if (St.length) {
      const F = t.exposed || (t.exposed = {});
      St.forEach((se) => {
        Object.defineProperty(F, se, {
          get: () => r[se],
          set: (Dt) => r[se] = Dt
        });
      });
    } else
      t.exposed || (t.exposed = {});
  Ge && t.render === at && (t.render = Ge), p != null && (t.inheritAttrs = p), v && (t.components = v), w && (t.directives = w);
}
function md(t, e, r = at) {
  B(t) && (t = Ji(t));
  for (const s in t) {
    const i = t[s];
    let n;
    me(i) ? "default" in i ? n = $s(
      i.from || s,
      i.default,
      !0
      /* treat default function as factory */
    ) : n = $s(i.from || s) : n = $s(i), Me(n) ? Object.defineProperty(e, s, {
      enumerable: !0,
      configurable: !0,
      get: () => n.value,
      set: (a) => n.value = a
    }) : e[s] = n;
  }
}
function ya(t, e, r) {
  ot(
    B(t) ? t.map((s) => s.bind(e.proxy)) : t.bind(e.proxy),
    e,
    r
  );
}
function So(t, e, r, s) {
  const i = s.includes(".") ? bo(r, s) : () => r[s];
  if (Te(t)) {
    const n = e[t];
    Z(n) && Ii(i, n);
  } else if (Z(t))
    Ii(i, t.bind(r));
  else if (me(t))
    if (B(t))
      t.forEach((n) => So(n, e, r, s));
    else {
      const n = Z(t.handler) ? t.handler.bind(r) : e[t.handler];
      Z(n) && Ii(i, n, t);
    }
}
function $n(t) {
  const e = t.type, { mixins: r, extends: s } = e, {
    mixins: i,
    optionsCache: n,
    config: { optionMergeStrategies: a }
  } = t.appContext, o = n.get(e);
  let c;
  return o ? c = o : !i.length && !r && !s ? c = e : (c = {}, i.length && i.forEach(
    (l) => Us(c, l, a, !0)
  ), Us(c, e, a)), me(e) && n.set(e, c), c;
}
function Us(t, e, r, s = !1) {
  const { mixins: i, extends: n } = e;
  n && Us(t, n, r, !0), i && i.forEach(
    (a) => Us(t, a, r, !0)
  );
  for (const a in e)
    if (!(s && a === "expose")) {
      const o = wd[a] || r && r[a];
      t[a] = o ? o(t[a], e[a]) : e[a];
    }
  return t;
}
const wd = {
  data: va,
  props: ba,
  emits: ba,
  // objects
  methods: Zr,
  computed: Zr,
  // lifecycle
  beforeCreate: Oe,
  created: Oe,
  beforeMount: Oe,
  mounted: Oe,
  beforeUpdate: Oe,
  updated: Oe,
  beforeDestroy: Oe,
  beforeUnmount: Oe,
  destroyed: Oe,
  unmounted: Oe,
  activated: Oe,
  deactivated: Oe,
  errorCaptured: Oe,
  serverPrefetch: Oe,
  // assets
  components: Zr,
  directives: Zr,
  // watch
  watch: vd,
  // provide / inject
  provide: va,
  inject: yd
};
function va(t, e) {
  return e ? t ? function() {
    return Ie(
      Z(t) ? t.call(this, this) : t,
      Z(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function yd(t, e) {
  return Zr(Ji(t), Ji(e));
}
function Ji(t) {
  if (B(t)) {
    const e = {};
    for (let r = 0; r < t.length; r++)
      e[t[r]] = t[r];
    return e;
  }
  return t;
}
function Oe(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function Zr(t, e) {
  return t ? Ie(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function ba(t, e) {
  return t ? B(t) && B(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : Ie(
    /* @__PURE__ */ Object.create(null),
    wa(t),
    wa(e ?? {})
  ) : e;
}
function vd(t, e) {
  if (!t)
    return e;
  if (!e)
    return t;
  const r = Ie(/* @__PURE__ */ Object.create(null), t);
  for (const s in e)
    r[s] = Oe(t[s], e[s]);
  return r;
}
function Do() {
  return {
    app: null,
    config: {
      isNativeTag: Lc,
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
let bd = 0;
function _d(t, e) {
  return function(s, i = null) {
    Z(s) || (s = Ie({}, s)), i != null && !me(i) && (i = null);
    const n = Do(), a = /* @__PURE__ */ new Set();
    let o = !1;
    const c = n.app = {
      _uid: bd++,
      _component: s,
      _props: i,
      _container: null,
      _context: n,
      _instance: null,
      version: Xd,
      get config() {
        return n.config;
      },
      set config(l) {
      },
      use(l, ...h) {
        return a.has(l) || (l && Z(l.install) ? (a.add(l), l.install(c, ...h)) : Z(l) && (a.add(l), l(c, ...h))), c;
      },
      mixin(l) {
        return n.mixins.includes(l) || n.mixins.push(l), c;
      },
      component(l, h) {
        return h ? (n.components[l] = h, c) : n.components[l];
      },
      directive(l, h) {
        return h ? (n.directives[l] = h, c) : n.directives[l];
      },
      mount(l, h, f) {
        if (!o) {
          const x = Ot(
            s,
            i
          );
          return x.appContext = n, h && e ? e(x, l) : t(x, l, f), o = !0, c._container = l, l.__vue_app__ = c, Hn(x.component) || x.component.proxy;
        }
      },
      unmount() {
        o && (t(null, c._container), delete c._container.__vue_app__);
      },
      provide(l, h) {
        return n.provides[l] = h, c;
      },
      runWithContext(l) {
        Ls = c;
        try {
          return l();
        } finally {
          Ls = null;
        }
      }
    };
    return c;
  };
}
let Ls = null;
function xd(t, e) {
  if (Ce) {
    let r = Ce.provides;
    const s = Ce.parent && Ce.parent.provides;
    s === r && (r = Ce.provides = Object.create(s)), r[t] = e;
  }
}
function $s(t, e, r = !1) {
  const s = Ce || st;
  if (s || Ls) {
    const i = s ? s.parent == null ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : Ls._context.provides;
    if (i && t in i)
      return i[t];
    if (arguments.length > 1)
      return r && Z(e) ? e.call(s && s.proxy) : e;
  }
}
function Td(t, e, r, s = !1) {
  const i = {}, n = {};
  Ns(n, ai, 1), t.propsDefaults = /* @__PURE__ */ Object.create(null), Co(t, e, i, n);
  for (const a in t.propsOptions[0])
    a in i || (i[a] = void 0);
  r ? t.props = s ? i : $l(i) : t.type.props ? t.props = i : t.props = n, t.attrs = n;
}
function Ed(t, e, r, s) {
  const {
    props: i,
    attrs: n,
    vnode: { patchFlag: a }
  } = t, o = ie(i), [c] = t.propsOptions;
  let l = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || a > 0) && !(a & 16)
  ) {
    if (a & 8) {
      const h = t.vnode.dynamicProps;
      for (let f = 0; f < h.length; f++) {
        let x = h[f];
        if (si(t.emitsOptions, x))
          continue;
        const O = e[x];
        if (c)
          if (Q(n, x))
            O !== n[x] && (n[x] = O, l = !0);
          else {
            const W = bt(x);
            i[W] = Xi(
              c,
              o,
              W,
              O,
              t,
              !1
              /* isAbsent */
            );
          }
        else
          O !== n[x] && (n[x] = O, l = !0);
      }
    }
  } else {
    Co(t, e, i, n) && (l = !0);
    let h;
    for (const f in o)
      (!e || // for camelCase
      !Q(e, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((h = Nr(f)) === f || !Q(e, h))) && (c ? r && // for camelCase
      (r[f] !== void 0 || // for kebab-case
      r[h] !== void 0) && (i[f] = Xi(
        c,
        o,
        f,
        void 0,
        t,
        !0
        /* isAbsent */
      )) : delete i[f]);
    if (n !== o)
      for (const f in n)
        (!e || !Q(e, f)) && (delete n[f], l = !0);
  }
  l && Ft(t, "set", "$attrs");
}
function Co(t, e, r, s) {
  const [i, n] = t.propsOptions;
  let a = !1, o;
  if (e)
    for (let c in e) {
      if (Is(c))
        continue;
      const l = e[c];
      let h;
      i && Q(i, h = bt(c)) ? !n || !n.includes(h) ? r[h] = l : (o || (o = {}))[h] = l : si(t.emitsOptions, c) || (!(c in s) || l !== s[c]) && (s[c] = l, a = !0);
    }
  if (n) {
    const c = ie(r), l = o || pe;
    for (let h = 0; h < n.length; h++) {
      const f = n[h];
      r[f] = Xi(
        i,
        c,
        f,
        l[f],
        t,
        !Q(l, f)
      );
    }
  }
  return a;
}
function Xi(t, e, r, s, i, n) {
  const a = t[r];
  if (a != null) {
    const o = Q(a, "default");
    if (o && s === void 0) {
      const c = a.default;
      if (a.type !== Function && !a.skipFactory && Z(c)) {
        const { propsDefaults: l } = i;
        r in l ? s = l[r] : (Mr(i), s = l[r] = c.call(
          null,
          e
        ), hr());
      } else
        s = c;
    }
    a[
      0
      /* shouldCast */
    ] && (n && !o ? s = !1 : a[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === Nr(r)) && (s = !0));
  }
  return s;
}
function Io(t, e, r = !1) {
  const s = e.propsCache, i = s.get(t);
  if (i)
    return i;
  const n = t.props, a = {}, o = [];
  let c = !1;
  if (!Z(t)) {
    const h = (f) => {
      c = !0;
      const [x, O] = Io(f, e, !0);
      Ie(a, x), O && o.push(...O);
    };
    !r && e.mixins.length && e.mixins.forEach(h), t.extends && h(t.extends), t.mixins && t.mixins.forEach(h);
  }
  if (!n && !c)
    return me(t) && s.set(t, Sr), Sr;
  if (B(n))
    for (let h = 0; h < n.length; h++) {
      const f = bt(n[h]);
      _a(f) && (a[f] = pe);
    }
  else if (n)
    for (const h in n) {
      const f = bt(h);
      if (_a(f)) {
        const x = n[h], O = a[f] = B(x) || Z(x) ? { type: x } : Ie({}, x);
        if (O) {
          const W = Ea(Boolean, O.type), M = Ea(String, O.type);
          O[
            0
            /* shouldCast */
          ] = W > -1, O[
            1
            /* shouldCastTrue */
          ] = M < 0 || W < M, (W > -1 || Q(O, "default")) && o.push(f);
        }
      }
    }
  const l = [a, o];
  return me(t) && s.set(t, l), l;
}
function _a(t) {
  return t[0] !== "$";
}
function xa(t) {
  const e = t && t.toString().match(/^\s*(function|class) (\w+)/);
  return e ? e[2] : t === null ? "null" : "";
}
function Ta(t, e) {
  return xa(t) === xa(e);
}
function Ea(t, e) {
  return B(e) ? e.findIndex((r) => Ta(r, t)) : Z(e) && Ta(e, t) ? 0 : -1;
}
const Ro = (t) => t[0] === "_" || t === "$stable", An = (t) => B(t) ? t.map(gt) : [gt(t)], Sd = (t, e, r) => {
  if (e._n)
    return e;
  const s = Bl((...i) => An(e(...i)), r);
  return s._c = !1, s;
}, $o = (t, e, r) => {
  const s = t._ctx;
  for (const i in t) {
    if (Ro(i))
      continue;
    const n = t[i];
    if (Z(n))
      e[i] = Sd(i, n, s);
    else if (n != null) {
      const a = An(n);
      e[i] = () => a;
    }
  }
}, Ao = (t, e) => {
  const r = An(e);
  t.slots.default = () => r;
}, Dd = (t, e) => {
  if (t.vnode.shapeFlag & 32) {
    const r = e._;
    r ? (t.slots = ie(e), Ns(e, "_", r)) : $o(
      e,
      t.slots = {}
    );
  } else
    t.slots = {}, e && Ao(t, e);
  Ns(t.slots, ai, 1);
}, Cd = (t, e, r) => {
  const { vnode: s, slots: i } = t;
  let n = !0, a = pe;
  if (s.shapeFlag & 32) {
    const o = e._;
    o ? r && o === 1 ? n = !1 : (Ie(i, e), !r && o === 1 && delete i._) : (n = !e.$stable, $o(e, i)), a = e;
  } else
    e && (Ao(t, e), a = { default: 1 });
  if (n)
    for (const o in i)
      !Ro(o) && !(o in a) && delete i[o];
};
function Qi(t, e, r, s, i = !1) {
  if (B(t)) {
    t.forEach(
      (x, O) => Qi(
        x,
        e && (B(e) ? e[O] : e),
        r,
        s,
        i
      )
    );
    return;
  }
  if (Rs(s) && !i)
    return;
  const n = s.shapeFlag & 4 ? Hn(s.component) || s.component.proxy : s.el, a = i ? null : n, { i: o, r: c } = t, l = e && e.r, h = o.refs === pe ? o.refs = {} : o.refs, f = o.setupState;
  if (l != null && l !== c && (Te(l) ? (h[l] = null, Q(f, l) && (f[l] = null)) : Me(l) && (l.value = null)), Z(c))
    Xt(c, o, 12, [a, h]);
  else {
    const x = Te(c), O = Me(c);
    if (x || O) {
      const W = () => {
        if (t.f) {
          const M = x ? Q(f, c) ? f[c] : h[c] : c.value;
          i ? B(M) && gn(M, n) : B(M) ? M.includes(n) || M.push(n) : x ? (h[c] = [n], Q(f, c) && (f[c] = h[c])) : (c.value = [n], t.k && (h[t.k] = c.value));
        } else
          x ? (h[c] = a, Q(f, c) && (f[c] = a)) : O && (c.value = a, t.k && (h[t.k] = a));
      };
      a ? (W.id = -1, Fe(W, r)) : W();
    }
  }
}
const Fe = zl;
function Id(t) {
  return Rd(t);
}
function Rd(t, e) {
  const r = ji();
  r.__VUE__ = !0;
  const {
    insert: s,
    remove: i,
    patchProp: n,
    createElement: a,
    createText: o,
    createComment: c,
    setText: l,
    setElementText: h,
    parentNode: f,
    nextSibling: x,
    setScopeId: O = at,
    insertStaticContent: W
  } = t, M = (u, g, b, E = null, T = null, I = null, k = !1, C = null, R = !!g.dynamicChildren) => {
    if (u === g)
      return;
    u && !Br(u, g) && (E = vs(u), ht(u, T, I, !0), u = null), g.patchFlag === -2 && (R = !1, g.dynamicChildren = null);
    const { type: S, ref: U, shapeFlag: N } = g;
    switch (S) {
      case ni:
        le(u, g, b, E);
        break;
      case ns:
        m(u, g, b, E);
        break;
      case As:
        u == null && V(g, b, E, k);
        break;
      case et:
        v(
          u,
          g,
          b,
          E,
          T,
          I,
          k,
          C,
          R
        );
        break;
      default:
        N & 1 ? Ge(
          u,
          g,
          b,
          E,
          T,
          I,
          k,
          C,
          R
        ) : N & 6 ? w(
          u,
          g,
          b,
          E,
          T,
          I,
          k,
          C,
          R
        ) : (N & 64 || N & 128) && S.process(
          u,
          g,
          b,
          E,
          T,
          I,
          k,
          C,
          R,
          yr
        );
    }
    U != null && T && Qi(U, u && u.ref, I, g || u, !g);
  }, le = (u, g, b, E) => {
    if (u == null)
      s(
        g.el = o(g.children),
        b,
        E
      );
    else {
      const T = g.el = u.el;
      g.children !== u.children && l(T, g.children);
    }
  }, m = (u, g, b, E) => {
    u == null ? s(
      g.el = c(g.children || ""),
      b,
      E
    ) : g.el = u.el;
  }, V = (u, g, b, E) => {
    [u.el, u.anchor] = W(
      u.children,
      g,
      b,
      E,
      u.el,
      u.anchor
    );
  }, ye = ({ el: u, anchor: g }, b, E) => {
    let T;
    for (; u && u !== g; )
      T = x(u), s(u, b, E), u = T;
    s(g, b, E);
  }, K = ({ el: u, anchor: g }) => {
    let b;
    for (; u && u !== g; )
      b = x(u), i(u), u = b;
    i(g);
  }, Ge = (u, g, b, E, T, I, k, C, R) => {
    k = k || g.type === "svg", u == null ? jt(
      g,
      b,
      E,
      T,
      I,
      k,
      C,
      R
    ) : wr(
      u,
      g,
      T,
      I,
      k,
      C,
      R
    );
  }, jt = (u, g, b, E, T, I, k, C) => {
    let R, S;
    const { type: U, props: N, shapeFlag: L, transition: Y, dirs: J } = u;
    if (R = u.el = a(
      u.type,
      I,
      N && N.is,
      N
    ), L & 8 ? h(R, u.children) : L & 16 && d(
      u.children,
      R,
      null,
      E,
      T,
      I && U !== "foreignObject",
      k,
      C
    ), J && sr(u, null, E, "created"), mr(R, u, u.scopeId, k, E), N) {
      for (const ae in N)
        ae !== "value" && !Is(ae) && n(
          R,
          ae,
          null,
          N[ae],
          I,
          u.children,
          E,
          T,
          Ct
        );
      "value" in N && n(R, "value", null, N.value), (S = N.onVnodeBeforeMount) && ft(S, E, u);
    }
    J && sr(u, null, E, "beforeMount");
    const he = (!T || T && !T.pendingBranch) && Y && !Y.persisted;
    he && Y.beforeEnter(R), s(R, g, b), ((S = N && N.onVnodeMounted) || he || J) && Fe(() => {
      S && ft(S, E, u), he && Y.enter(R), J && sr(u, null, E, "mounted");
    }, T);
  }, mr = (u, g, b, E, T) => {
    if (b && O(u, b), E)
      for (let I = 0; I < E.length; I++)
        O(u, E[I]);
    if (T) {
      let I = T.subTree;
      if (g === I) {
        const k = T.vnode;
        mr(
          u,
          k,
          k.scopeId,
          k.slotScopeIds,
          T.parent
        );
      }
    }
  }, d = (u, g, b, E, T, I, k, C, R = 0) => {
    for (let S = R; S < u.length; S++) {
      const U = u[S] = C ? Wt(u[S]) : gt(u[S]);
      M(
        null,
        U,
        g,
        b,
        E,
        T,
        I,
        k,
        C
      );
    }
  }, wr = (u, g, b, E, T, I, k) => {
    const C = g.el = u.el;
    let { patchFlag: R, dynamicChildren: S, dirs: U } = g;
    R |= u.patchFlag & 16;
    const N = u.props || pe, L = g.props || pe;
    let Y;
    b && ir(b, !1), (Y = L.onVnodeBeforeUpdate) && ft(Y, b, g, u), U && sr(g, u, b, "beforeUpdate"), b && ir(b, !0);
    const J = T && g.type !== "foreignObject";
    if (S ? St(
      u.dynamicChildren,
      S,
      C,
      b,
      E,
      J,
      I
    ) : k || se(
      u,
      g,
      C,
      null,
      b,
      E,
      J,
      I,
      !1
    ), R > 0) {
      if (R & 16)
        p(
          C,
          g,
          N,
          L,
          b,
          E,
          T
        );
      else if (R & 2 && N.class !== L.class && n(C, "class", null, L.class, T), R & 4 && n(C, "style", N.style, L.style, T), R & 8) {
        const he = g.dynamicProps;
        for (let ae = 0; ae < he.length; ae++) {
          const ve = he[ae], Xe = N[ve], vr = L[ve];
          (vr !== Xe || ve === "value") && n(
            C,
            ve,
            Xe,
            vr,
            T,
            u.children,
            b,
            E,
            Ct
          );
        }
      }
      R & 1 && u.children !== g.children && h(C, g.children);
    } else
      !k && S == null && p(
        C,
        g,
        N,
        L,
        b,
        E,
        T
      );
    ((Y = L.onVnodeUpdated) || U) && Fe(() => {
      Y && ft(Y, b, g, u), U && sr(g, u, b, "updated");
    }, E);
  }, St = (u, g, b, E, T, I, k) => {
    for (let C = 0; C < g.length; C++) {
      const R = u[C], S = g[C], U = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        R.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (R.type === et || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Br(R, S) || // - In the case of a component, it could contain anything.
        R.shapeFlag & 70) ? f(R.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          b
        )
      );
      M(
        R,
        S,
        U,
        null,
        E,
        T,
        I,
        k,
        !0
      );
    }
  }, p = (u, g, b, E, T, I, k) => {
    if (b !== E) {
      if (b !== pe)
        for (const C in b)
          !Is(C) && !(C in E) && n(
            u,
            C,
            b[C],
            null,
            k,
            g.children,
            T,
            I,
            Ct
          );
      for (const C in E) {
        if (Is(C))
          continue;
        const R = E[C], S = b[C];
        R !== S && C !== "value" && n(
          u,
          C,
          S,
          R,
          k,
          g.children,
          T,
          I,
          Ct
        );
      }
      "value" in E && n(u, "value", b.value, E.value);
    }
  }, v = (u, g, b, E, T, I, k, C, R) => {
    const S = g.el = u ? u.el : o(""), U = g.anchor = u ? u.anchor : o("");
    let { patchFlag: N, dynamicChildren: L, slotScopeIds: Y } = g;
    Y && (C = C ? C.concat(Y) : Y), u == null ? (s(S, b, E), s(U, b, E), d(
      g.children,
      b,
      U,
      T,
      I,
      k,
      C,
      R
    )) : N > 0 && N & 64 && L && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    u.dynamicChildren ? (St(
      u.dynamicChildren,
      L,
      b,
      T,
      I,
      k,
      C
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (g.key != null || T && g === T.subTree) && ko(
      u,
      g,
      !0
      /* shallow */
    )) : se(
      u,
      g,
      b,
      U,
      T,
      I,
      k,
      C,
      R
    );
  }, w = (u, g, b, E, T, I, k, C, R) => {
    g.slotScopeIds = C, u == null ? g.shapeFlag & 512 ? T.ctx.activate(
      g,
      b,
      E,
      k,
      R
    ) : Re(
      g,
      b,
      E,
      T,
      I,
      k,
      R
    ) : ne(u, g, R);
  }, Re = (u, g, b, E, T, I, k) => {
    const C = u.component = jd(
      u,
      E,
      T
    );
    if (_o(u) && (C.ctx.renderer = yr), Yd(C), C.asyncDep) {
      if (T && T.registerDep(C, de), !u.el) {
        const R = C.subTree = Ot(ns);
        m(null, R, g, b);
      }
      return;
    }
    de(
      C,
      u,
      g,
      b,
      T,
      I,
      k
    );
  }, ne = (u, g, b) => {
    const E = g.component = u.component;
    if (Gl(u, g, b))
      if (E.asyncDep && !E.asyncResolved) {
        F(E, g, b);
        return;
      } else
        E.next = g, Ul(E.update), E.update();
    else
      g.el = u.el, E.vnode = g;
  }, de = (u, g, b, E, T, I, k) => {
    const C = () => {
      if (u.isMounted) {
        let { next: U, bu: N, u: L, parent: Y, vnode: J } = u, he = U, ae;
        ir(u, !1), U ? (U.el = J.el, F(u, U, k)) : U = J, N && Di(N), (ae = U.props && U.props.onVnodeBeforeUpdate) && ft(ae, Y, U, J), ir(u, !0);
        const ve = Ci(u), Xe = u.subTree;
        u.subTree = ve, M(
          Xe,
          ve,
          // parent may have changed if it's in a teleport
          f(Xe.el),
          // anchor may have changed if it's in a fragment
          vs(Xe),
          u,
          T,
          I
        ), U.el = ve.el, he === null && Kl(u, ve.el), L && Fe(L, T), (ae = U.props && U.props.onVnodeUpdated) && Fe(
          () => ft(ae, Y, U, J),
          T
        );
      } else {
        let U;
        const { el: N, props: L } = g, { bm: Y, m: J, parent: he } = u, ae = Rs(g);
        if (ir(u, !1), Y && Di(Y), !ae && (U = L && L.onVnodeBeforeMount) && ft(U, he, g), ir(u, !0), N && Ei) {
          const ve = () => {
            u.subTree = Ci(u), Ei(
              N,
              u.subTree,
              u,
              T,
              null
            );
          };
          ae ? g.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !u.isUnmounted && ve()
          ) : ve();
        } else {
          const ve = u.subTree = Ci(u);
          M(
            null,
            ve,
            b,
            E,
            u,
            T,
            I
          ), g.el = ve.el;
        }
        if (J && Fe(J, T), !ae && (U = L && L.onVnodeMounted)) {
          const ve = g;
          Fe(
            () => ft(U, he, ve),
            T
          );
        }
        (g.shapeFlag & 256 || he && Rs(he.vnode) && he.vnode.shapeFlag & 256) && u.a && Fe(u.a, T), u.isMounted = !0, g = b = E = null;
      }
    }, R = u.effect = new bn(
      C,
      () => Rn(S),
      u.scope
      // track it in component's effect scope
    ), S = u.update = () => R.run();
    S.id = u.uid, ir(u, !0), S();
  }, F = (u, g, b) => {
    g.component = u;
    const E = u.vnode.props;
    u.vnode = g, u.next = null, Ed(u, g.props, E, b), Cd(u, g.children, b), qr(), ga(), Ur();
  }, se = (u, g, b, E, T, I, k, C, R = !1) => {
    const S = u && u.children, U = u ? u.shapeFlag : 0, N = g.children, { patchFlag: L, shapeFlag: Y } = g;
    if (L > 0) {
      if (L & 128) {
        ys(
          S,
          N,
          b,
          E,
          T,
          I,
          k,
          C,
          R
        );
        return;
      } else if (L & 256) {
        Dt(
          S,
          N,
          b,
          E,
          T,
          I,
          k,
          C,
          R
        );
        return;
      }
    }
    Y & 8 ? (U & 16 && Ct(S, T, I), N !== S && h(b, N)) : U & 16 ? Y & 16 ? ys(
      S,
      N,
      b,
      E,
      T,
      I,
      k,
      C,
      R
    ) : Ct(S, T, I, !0) : (U & 8 && h(b, ""), Y & 16 && d(
      N,
      b,
      E,
      T,
      I,
      k,
      C,
      R
    ));
  }, Dt = (u, g, b, E, T, I, k, C, R) => {
    u = u || Sr, g = g || Sr;
    const S = u.length, U = g.length, N = Math.min(S, U);
    let L;
    for (L = 0; L < N; L++) {
      const Y = g[L] = R ? Wt(g[L]) : gt(g[L]);
      M(
        u[L],
        Y,
        b,
        null,
        T,
        I,
        k,
        C,
        R
      );
    }
    S > U ? Ct(
      u,
      T,
      I,
      !0,
      !1,
      N
    ) : d(
      g,
      b,
      E,
      T,
      I,
      k,
      C,
      R,
      N
    );
  }, ys = (u, g, b, E, T, I, k, C, R) => {
    let S = 0;
    const U = g.length;
    let N = u.length - 1, L = U - 1;
    for (; S <= N && S <= L; ) {
      const Y = u[S], J = g[S] = R ? Wt(g[S]) : gt(g[S]);
      if (Br(Y, J))
        M(
          Y,
          J,
          b,
          null,
          T,
          I,
          k,
          C,
          R
        );
      else
        break;
      S++;
    }
    for (; S <= N && S <= L; ) {
      const Y = u[N], J = g[L] = R ? Wt(g[L]) : gt(g[L]);
      if (Br(Y, J))
        M(
          Y,
          J,
          b,
          null,
          T,
          I,
          k,
          C,
          R
        );
      else
        break;
      N--, L--;
    }
    if (S > N) {
      if (S <= L) {
        const Y = L + 1, J = Y < U ? g[Y].el : E;
        for (; S <= L; )
          M(
            null,
            g[S] = R ? Wt(g[S]) : gt(g[S]),
            b,
            J,
            T,
            I,
            k,
            C,
            R
          ), S++;
      }
    } else if (S > L)
      for (; S <= N; )
        ht(u[S], T, I, !0), S++;
    else {
      const Y = S, J = S, he = /* @__PURE__ */ new Map();
      for (S = J; S <= L; S++) {
        const je = g[S] = R ? Wt(g[S]) : gt(g[S]);
        je.key != null && he.set(je.key, S);
      }
      let ae, ve = 0;
      const Xe = L - J + 1;
      let vr = !1, sa = 0;
      const Yr = new Array(Xe);
      for (S = 0; S < Xe; S++)
        Yr[S] = 0;
      for (S = Y; S <= N; S++) {
        const je = u[S];
        if (ve >= Xe) {
          ht(je, T, I, !0);
          continue;
        }
        let ut;
        if (je.key != null)
          ut = he.get(je.key);
        else
          for (ae = J; ae <= L; ae++)
            if (Yr[ae - J] === 0 && Br(je, g[ae])) {
              ut = ae;
              break;
            }
        ut === void 0 ? ht(je, T, I, !0) : (Yr[ut - J] = S + 1, ut >= sa ? sa = ut : vr = !0, M(
          je,
          g[ut],
          b,
          null,
          T,
          I,
          k,
          C,
          R
        ), ve++);
      }
      const ia = vr ? $d(Yr) : Sr;
      for (ae = ia.length - 1, S = Xe - 1; S >= 0; S--) {
        const je = J + S, ut = g[je], na = je + 1 < U ? g[je + 1].el : E;
        Yr[S] === 0 ? M(
          null,
          ut,
          b,
          na,
          T,
          I,
          k,
          C,
          R
        ) : vr && (ae < 0 || S !== ia[ae] ? rr(ut, b, na, 2) : ae--);
      }
    }
  }, rr = (u, g, b, E, T = null) => {
    const { el: I, type: k, transition: C, children: R, shapeFlag: S } = u;
    if (S & 6) {
      rr(u.component.subTree, g, b, E);
      return;
    }
    if (S & 128) {
      u.suspense.move(g, b, E);
      return;
    }
    if (S & 64) {
      k.move(u, g, b, yr);
      return;
    }
    if (k === et) {
      s(I, g, b);
      for (let N = 0; N < R.length; N++)
        rr(R[N], g, b, E);
      s(u.anchor, g, b);
      return;
    }
    if (k === As) {
      ye(u, g, b);
      return;
    }
    if (E !== 2 && S & 1 && C)
      if (E === 0)
        C.beforeEnter(I), s(I, g, b), Fe(() => C.enter(I), T);
      else {
        const { leave: N, delayLeave: L, afterLeave: Y } = C, J = () => s(I, g, b), he = () => {
          N(I, () => {
            J(), Y && Y();
          });
        };
        L ? L(I, J, he) : he();
      }
    else
      s(I, g, b);
  }, ht = (u, g, b, E = !1, T = !1) => {
    const {
      type: I,
      props: k,
      ref: C,
      children: R,
      dynamicChildren: S,
      shapeFlag: U,
      patchFlag: N,
      dirs: L
    } = u;
    if (C != null && Qi(C, null, b, u, !0), U & 256) {
      g.ctx.deactivate(u);
      return;
    }
    const Y = U & 1 && L, J = !Rs(u);
    let he;
    if (J && (he = k && k.onVnodeBeforeUnmount) && ft(he, g, u), U & 6)
      Uc(u.component, b, E);
    else {
      if (U & 128) {
        u.suspense.unmount(b, E);
        return;
      }
      Y && sr(u, null, g, "beforeUnmount"), U & 64 ? u.type.remove(
        u,
        g,
        b,
        T,
        yr,
        E
      ) : S && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (I !== et || N > 0 && N & 64) ? Ct(
        S,
        g,
        b,
        !1,
        !0
      ) : (I === et && N & 384 || !T && U & 16) && Ct(R, g, b), E && ta(u);
    }
    (J && (he = k && k.onVnodeUnmounted) || Y) && Fe(() => {
      he && ft(he, g, u), Y && sr(u, null, g, "unmounted");
    }, b);
  }, ta = (u) => {
    const { type: g, el: b, anchor: E, transition: T } = u;
    if (g === et) {
      qc(b, E);
      return;
    }
    if (g === As) {
      K(u);
      return;
    }
    const I = () => {
      i(b), T && !T.persisted && T.afterLeave && T.afterLeave();
    };
    if (u.shapeFlag & 1 && T && !T.persisted) {
      const { leave: k, delayLeave: C } = T, R = () => k(b, I);
      C ? C(u.el, I, R) : R();
    } else
      I();
  }, qc = (u, g) => {
    let b;
    for (; u !== g; )
      b = x(u), i(u), u = b;
    i(g);
  }, Uc = (u, g, b) => {
    const { bum: E, scope: T, update: I, subTree: k, um: C } = u;
    E && Di(E), T.stop(), I && (I.active = !1, ht(k, u, g, b)), C && Fe(C, g), Fe(() => {
      u.isUnmounted = !0;
    }, g), g && g.pendingBranch && !g.isUnmounted && u.asyncDep && !u.asyncResolved && u.suspenseId === g.pendingId && (g.deps--, g.deps === 0 && g.resolve());
  }, Ct = (u, g, b, E = !1, T = !1, I = 0) => {
    for (let k = I; k < u.length; k++)
      ht(u[k], g, b, E, T);
  }, vs = (u) => u.shapeFlag & 6 ? vs(u.component.subTree) : u.shapeFlag & 128 ? u.suspense.next() : x(u.anchor || u.el), ra = (u, g, b) => {
    u == null ? g._vnode && ht(g._vnode, null, null, !0) : M(g._vnode || null, u, g, null, null, null, b), ga(), po(), g._vnode = u;
  }, yr = {
    p: M,
    um: ht,
    m: rr,
    r: ta,
    mt: Re,
    mc: d,
    pc: se,
    pbc: St,
    n: vs,
    o: t
  };
  let Ti, Ei;
  return e && ([Ti, Ei] = e(
    yr
  )), {
    render: ra,
    hydrate: Ti,
    createApp: _d(ra, Ti)
  };
}
function ir({ effect: t, update: e }, r) {
  t.allowRecurse = e.allowRecurse = r;
}
function ko(t, e, r = !1) {
  const s = t.children, i = e.children;
  if (B(s) && B(i))
    for (let n = 0; n < s.length; n++) {
      const a = s[n];
      let o = i[n];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = i[n] = Wt(i[n]), o.el = a.el), r || ko(a, o)), o.type === ni && (o.el = a.el);
    }
}
function $d(t) {
  const e = t.slice(), r = [0];
  let s, i, n, a, o;
  const c = t.length;
  for (s = 0; s < c; s++) {
    const l = t[s];
    if (l !== 0) {
      if (i = r[r.length - 1], t[i] < l) {
        e[s] = i, r.push(s);
        continue;
      }
      for (n = 0, a = r.length - 1; n < a; )
        o = n + a >> 1, t[r[o]] < l ? n = o + 1 : a = o;
      l < t[r[n]] && (n > 0 && (e[s] = r[n - 1]), r[n] = s);
    }
  }
  for (n = r.length, a = r[n - 1]; n-- > 0; )
    r[n] = a, a = e[a];
  return r;
}
const Ad = (t) => t.__isTeleport, et = Symbol.for("v-fgt"), ni = Symbol.for("v-txt"), ns = Symbol.for("v-cmt"), As = Symbol.for("v-stc"), Jr = [];
let it = null;
function $i(t = !1) {
  Jr.push(it = t ? null : []);
}
function kd() {
  Jr.pop(), it = Jr[Jr.length - 1] || null;
}
let as = 1;
function Sa(t) {
  as += t;
}
function Po(t) {
  return t.dynamicChildren = as > 0 ? it || Sr : null, kd(), as > 0 && it && it.push(t), t;
}
function Da(t, e, r, s, i, n) {
  return Po(
    Xr(
      t,
      e,
      r,
      s,
      i,
      n,
      !0
      /* isBlock */
    )
  );
}
function Pd(t, e, r, s, i) {
  return Po(
    Ot(
      t,
      e,
      r,
      s,
      i,
      !0
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function Hd(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Br(t, e) {
  return t.type === e.type && t.key === e.key;
}
const ai = "__vInternal", Ho = ({ key: t }) => t ?? null, ks = ({
  ref: t,
  ref_key: e,
  ref_for: r
}) => (typeof t == "number" && (t = "" + t), t != null ? Te(t) || Me(t) || Z(t) ? { i: st, r: t, k: e, f: !!r } : t : null);
function Xr(t, e = null, r = null, s = 0, i = null, n = t === et ? 0 : 1, a = !1, o = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && Ho(e),
    ref: e && ks(e),
    scopeId: yo,
    slotScopeIds: null,
    children: r,
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
    shapeFlag: n,
    patchFlag: s,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: st
  };
  return o ? (kn(c, r), n & 128 && t.normalize(c)) : r && (c.shapeFlag |= Te(r) ? 8 : 16), as > 0 && // avoid a block node from tracking itself
  !a && // has current parent block
  it && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || n & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && it.push(c), c;
}
const Ot = Od;
function Od(t, e = null, r = null, s = 0, i = null, n = !1) {
  if ((!t || t === hd) && (t = ns), Hd(t)) {
    const o = Or(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return r && kn(o, r), as > 0 && !n && it && (o.shapeFlag & 6 ? it[it.indexOf(t)] = o : it.push(o)), o.patchFlag |= -2, o;
  }
  if (Kd(t) && (t = t.__vccOpts), e) {
    e = Md(e);
    let { class: o, style: c } = e;
    o && !Te(o) && (e.class = yn(o)), me(c) && (lo(c) && !B(c) && (c = Ie({}, c)), e.style = wn(c));
  }
  const a = Te(t) ? 1 : Zl(t) ? 128 : Ad(t) ? 64 : me(t) ? 4 : Z(t) ? 2 : 0;
  return Xr(
    t,
    e,
    r,
    s,
    i,
    a,
    n,
    !0
  );
}
function Md(t) {
  return t ? lo(t) || ai in t ? Ie({}, t) : t : null;
}
function Or(t, e, r = !1) {
  const { props: s, ref: i, patchFlag: n, children: a } = t, o = e ? qd(s || {}, e) : s;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: o,
    key: o && Ho(o),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      r && i ? B(i) ? i.concat(ks(e)) : [i, ks(e)] : ks(e)
    ) : i,
    scopeId: t.scopeId,
    slotScopeIds: t.slotScopeIds,
    children: a,
    target: t.target,
    targetAnchor: t.targetAnchor,
    staticCount: t.staticCount,
    shapeFlag: t.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: e && t.type !== et ? n === -1 ? 16 : n | 16 : n,
    dynamicProps: t.dynamicProps,
    dynamicChildren: t.dynamicChildren,
    appContext: t.appContext,
    dirs: t.dirs,
    transition: t.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: t.component,
    suspense: t.suspense,
    ssContent: t.ssContent && Or(t.ssContent),
    ssFallback: t.ssFallback && Or(t.ssFallback),
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
}
function Fd(t = " ", e = 0) {
  return Ot(ni, null, t, e);
}
function Nd(t, e) {
  const r = Ot(As, null, t);
  return r.staticCount = e, r;
}
function gt(t) {
  return t == null || typeof t == "boolean" ? Ot(ns) : B(t) ? Ot(
    et,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : typeof t == "object" ? Wt(t) : Ot(ni, null, String(t));
}
function Wt(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Or(t);
}
function kn(t, e) {
  let r = 0;
  const { shapeFlag: s } = t;
  if (e == null)
    e = null;
  else if (B(e))
    r = 16;
  else if (typeof e == "object")
    if (s & 65) {
      const i = e.default;
      i && (i._c && (i._d = !1), kn(t, i()), i._c && (i._d = !0));
      return;
    } else {
      r = 32;
      const i = e._;
      !i && !(ai in e) ? e._ctx = st : i === 3 && st && (st.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else
    Z(e) ? (e = { default: e, _ctx: st }, r = 32) : (e = String(e), s & 64 ? (r = 16, e = [Fd(e)]) : r = 8);
  t.children = e, t.shapeFlag |= r;
}
function qd(...t) {
  const e = {};
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    for (const i in s)
      if (i === "class")
        e.class !== s.class && (e.class = yn([e.class, s.class]));
      else if (i === "style")
        e.style = wn([e.style, s.style]);
      else if (Js(i)) {
        const n = e[i], a = s[i];
        a && n !== a && !(B(n) && n.includes(a)) && (e[i] = n ? [].concat(n, a) : a);
      } else
        i !== "" && (e[i] = s[i]);
  }
  return e;
}
function ft(t, e, r, s = null) {
  ot(t, e, 7, [
    r,
    s
  ]);
}
const Ud = Do();
let Ld = 0;
function jd(t, e, r) {
  const s = t.type, i = (e ? e.appContext : t.appContext) || Ud, n = {
    uid: Ld++,
    vnode: t,
    type: s,
    parent: e,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new tl(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: e ? e.provides : Object.create(i.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: Io(s, i),
    emitsOptions: wo(s, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: pe,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: pe,
    data: pe,
    props: pe,
    attrs: pe,
    slots: pe,
    refs: pe,
    setupState: pe,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense: r,
    suspenseId: r ? r.pendingId : 0,
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
  return n.ctx = { _: n }, n.root = e ? e.root : n, n.emit = Yl.bind(null, n), t.ce && t.ce(n), n;
}
let Ce = null, Pn, br, Ca = "__VUE_INSTANCE_SETTERS__";
(br = ji()[Ca]) || (br = ji()[Ca] = []), br.push((t) => Ce = t), Pn = (t) => {
  br.length > 1 ? br.forEach((e) => e(t)) : br[0](t);
};
const Mr = (t) => {
  Pn(t), t.scope.on();
}, hr = () => {
  Ce && Ce.scope.off(), Pn(null);
};
function Oo(t) {
  return t.vnode.shapeFlag & 4;
}
let os = !1;
function Yd(t, e = !1) {
  os = e;
  const { props: r, children: s } = t.vnode, i = Oo(t);
  Td(t, r, i, e), Dd(t, s);
  const n = i ? Bd(t, e) : void 0;
  return os = !1, n;
}
function Bd(t, e) {
  const r = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = ho(new Proxy(t.ctx, gd));
  const { setup: s } = r;
  if (s) {
    const i = t.setupContext = s.length > 1 ? Vd(t) : null;
    Mr(t), qr();
    const n = Xt(
      s,
      t,
      0,
      [t.props, i]
    );
    if (Ur(), hr(), Ga(n)) {
      if (n.then(hr, hr), e)
        return n.then((a) => {
          Ia(t, a, e);
        }).catch((a) => {
          ri(a, t, 0);
        });
      t.asyncDep = n;
    } else
      Ia(t, n, e);
  } else
    Mo(t, e);
}
function Ia(t, e, r) {
  Z(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : me(e) && (t.setupState = uo(e)), Mo(t, r);
}
let Ra;
function Mo(t, e, r) {
  const s = t.type;
  if (!t.render) {
    if (!e && Ra && !s.render) {
      const i = s.template || $n(t).template;
      if (i) {
        const { isCustomElement: n, compilerOptions: a } = t.appContext.config, { delimiters: o, compilerOptions: c } = s, l = Ie(
          Ie(
            {
              isCustomElement: n,
              delimiters: o
            },
            a
          ),
          c
        );
        s.render = Ra(i, l);
      }
    }
    t.render = s.render || at;
  }
  Mr(t), qr(), pd(t), Ur(), hr();
}
function Wd(t) {
  return t.attrsProxy || (t.attrsProxy = new Proxy(
    t.attrs,
    {
      get(e, r) {
        return Le(t, "get", "$attrs"), e[r];
      }
    }
  ));
}
function Vd(t) {
  const e = (r) => {
    t.exposed = r || {};
  };
  return {
    get attrs() {
      return Wd(t);
    },
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Hn(t) {
  if (t.exposed)
    return t.exposeProxy || (t.exposeProxy = new Proxy(uo(ho(t.exposed)), {
      get(e, r) {
        if (r in e)
          return e[r];
        if (r in zr)
          return zr[r](t);
      },
      has(e, r) {
        return r in e || r in zr;
      }
    }));
}
function Gd(t, e = !0) {
  return Z(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function Kd(t) {
  return Z(t) && "__vccOpts" in t;
}
const Zd = (t, e) => Ml(t, e, os), zd = Symbol.for("v-scx"), Jd = () => $s(zd), Xd = "3.3.4", Qd = "http://www.w3.org/2000/svg", or = typeof document < "u" ? document : null, $a = or && /* @__PURE__ */ or.createElement("template"), eh = {
  insert: (t, e, r) => {
    e.insertBefore(t, r || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, r, s) => {
    const i = e ? or.createElementNS(Qd, t) : or.createElement(t, r ? { is: r } : void 0);
    return t === "select" && s && s.multiple != null && i.setAttribute("multiple", s.multiple), i;
  },
  createText: (t) => or.createTextNode(t),
  createComment: (t) => or.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => or.querySelector(t),
  setScopeId(t, e) {
    t.setAttribute(e, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(t, e, r, s, i, n) {
    const a = r ? r.previousSibling : e.lastChild;
    if (i && (i === n || i.nextSibling))
      for (; e.insertBefore(i.cloneNode(!0), r), !(i === n || !(i = i.nextSibling)); )
        ;
    else {
      $a.innerHTML = s ? `<svg>${t}</svg>` : t;
      const o = $a.content;
      if (s) {
        const c = o.firstChild;
        for (; c.firstChild; )
          o.appendChild(c.firstChild);
        o.removeChild(c);
      }
      e.insertBefore(o, r);
    }
    return [
      // first
      a ? a.nextSibling : e.firstChild,
      // last
      r ? r.previousSibling : e.lastChild
    ];
  }
};
function th(t, e, r) {
  const s = t._vtc;
  s && (e = (e ? [e, ...s] : [...s]).join(" ")), e == null ? t.removeAttribute("class") : r ? t.setAttribute("class", e) : t.className = e;
}
function rh(t, e, r) {
  const s = t.style, i = Te(r);
  if (r && !i) {
    if (e && !Te(e))
      for (const n in e)
        r[n] == null && en(s, n, "");
    for (const n in r)
      en(s, n, r[n]);
  } else {
    const n = s.display;
    i ? e !== r && (s.cssText = r) : e && t.removeAttribute("style"), "_vod" in t && (s.display = n);
  }
}
const Aa = /\s*!important$/;
function en(t, e, r) {
  if (B(r))
    r.forEach((s) => en(t, e, s));
  else if (r == null && (r = ""), e.startsWith("--"))
    t.setProperty(e, r);
  else {
    const s = sh(t, e);
    Aa.test(r) ? t.setProperty(
      Nr(s),
      r.replace(Aa, ""),
      "important"
    ) : t[s] = r;
  }
}
const ka = ["Webkit", "Moz", "ms"], Ai = {};
function sh(t, e) {
  const r = Ai[e];
  if (r)
    return r;
  let s = bt(e);
  if (s !== "filter" && s in t)
    return Ai[e] = s;
  s = ei(s);
  for (let i = 0; i < ka.length; i++) {
    const n = ka[i] + s;
    if (n in t)
      return Ai[e] = n;
  }
  return e;
}
const Pa = "http://www.w3.org/1999/xlink";
function ih(t, e, r, s, i) {
  if (s && e.startsWith("xlink:"))
    r == null ? t.removeAttributeNS(Pa, e.slice(6, e.length)) : t.setAttributeNS(Pa, e, r);
  else {
    const n = Qc(e);
    r == null || n && !za(r) ? t.removeAttribute(e) : t.setAttribute(e, n ? "" : r);
  }
}
function nh(t, e, r, s, i, n, a) {
  if (e === "innerHTML" || e === "textContent") {
    s && a(s, i, n), t[e] = r ?? "";
    return;
  }
  const o = t.tagName;
  if (e === "value" && o !== "PROGRESS" && // custom elements may use _value internally
  !o.includes("-")) {
    t._value = r;
    const l = o === "OPTION" ? t.getAttribute("value") : t.value, h = r ?? "";
    l !== h && (t.value = h), r == null && t.removeAttribute(e);
    return;
  }
  let c = !1;
  if (r === "" || r == null) {
    const l = typeof t[e];
    l === "boolean" ? r = za(r) : r == null && l === "string" ? (r = "", c = !0) : l === "number" && (r = 0, c = !0);
  }
  try {
    t[e] = r;
  } catch {
  }
  c && t.removeAttribute(e);
}
function ah(t, e, r, s) {
  t.addEventListener(e, r, s);
}
function oh(t, e, r, s) {
  t.removeEventListener(e, r, s);
}
function ch(t, e, r, s, i = null) {
  const n = t._vei || (t._vei = {}), a = n[e];
  if (s && a)
    a.value = s;
  else {
    const [o, c] = lh(e);
    if (s) {
      const l = n[e] = uh(s, i);
      ah(t, o, l, c);
    } else
      a && (oh(t, o, a, c), n[e] = void 0);
  }
}
const Ha = /(?:Once|Passive|Capture)$/;
function lh(t) {
  let e;
  if (Ha.test(t)) {
    e = {};
    let s;
    for (; s = t.match(Ha); )
      t = t.slice(0, t.length - s[0].length), e[s[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : Nr(t.slice(2)), e];
}
let ki = 0;
const dh = /* @__PURE__ */ Promise.resolve(), hh = () => ki || (dh.then(() => ki = 0), ki = Date.now());
function uh(t, e) {
  const r = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= r.attached)
      return;
    ot(
      fh(s, r.value),
      e,
      5,
      [s]
    );
  };
  return r.value = t, r.attached = hh(), r;
}
function fh(t, e) {
  if (B(e)) {
    const r = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      r.call(t), t._stopped = !0;
    }, e.map((s) => (i) => !i._stopped && s && s(i));
  } else
    return e;
}
const Oa = /^on[a-z]/, gh = (t, e, r, s, i = !1, n, a, o, c) => {
  e === "class" ? th(t, s, i) : e === "style" ? rh(t, r, s) : Js(e) ? fn(e) || ch(t, e, r, s, a) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : ph(t, e, s, i)) ? nh(
    t,
    e,
    s,
    n,
    a,
    o,
    c
  ) : (e === "true-value" ? t._trueValue = s : e === "false-value" && (t._falseValue = s), ih(t, e, s, i));
};
function ph(t, e, r, s) {
  return s ? !!(e === "innerHTML" || e === "textContent" || e in t && Oa.test(e) && Z(r)) : e === "spellcheck" || e === "draggable" || e === "translate" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA" || Oa.test(e) && Te(r) ? !1 : e in t;
}
const mh = /* @__PURE__ */ Ie({ patchProp: gh }, eh);
let Ma;
function wh() {
  return Ma || (Ma = Id(mh));
}
const yh = (...t) => {
  const e = wh().createApp(...t), { mount: r } = e;
  return e.mount = (s) => {
    const i = vh(s);
    if (!i)
      return;
    const n = e._component;
    !Z(n) && !n.render && !n.template && (n.template = i.innerHTML), i.innerHTML = "";
    const a = r(i, !1, i instanceof SVGElement);
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), a;
  }, e;
};
function vh(t) {
  return Te(t) ? document.querySelector(t) : t;
}
const bh = "0.21.2";
class gr extends Error {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, new.target.prototype);
  }
}
class tn extends gr {
  constructor(e) {
    super(e || "Unsupported content type.");
  }
}
class rn extends gr {
  /** @internal */
  constructor(e) {
    super(e || "Request pending.");
  }
}
class _h extends gr {
  constructor(e) {
    super(e || "Unspecified session description handler error.");
  }
}
class Pi extends gr {
  constructor() {
    super("The session has terminated.");
  }
}
class Wr extends gr {
  constructor(e) {
    super(e || "An error occurred during state transition.");
  }
}
class xh {
  /** @internal */
  constructor(e) {
    this.incomingAckRequest = e;
  }
  /** Incoming ACK request message. */
  get request() {
    return this.incomingAckRequest.message;
  }
}
class Th {
  /** @internal */
  constructor(e) {
    this.incomingByeRequest = e;
  }
  /** Incoming BYE request message. */
  get request() {
    return this.incomingByeRequest.message;
  }
  /** Accept the request. */
  accept(e) {
    return this.incomingByeRequest.accept(e), Promise.resolve();
  }
  /** Reject the request. */
  reject(e) {
    return this.incomingByeRequest.reject(e), Promise.resolve();
  }
}
class Eh {
  /** @internal */
  constructor(e) {
    this.incomingCancelRequest = e;
  }
  /** Incoming CANCEL request message. */
  get request() {
    return this.incomingCancelRequest;
  }
}
class cs {
  constructor() {
    this.listeners = new Array();
  }
  /**
   * Sets up a function that will be called whenever the target changes.
   * @param listener - Callback function.
   * @param options - An options object that specifies characteristics about the listener.
   *                  If once true, indicates that the listener should be invoked at most once after being added.
   *                  If once true, the listener would be automatically removed when invoked.
   */
  addListener(e, r) {
    const s = (i) => {
      this.removeListener(s), e(i);
    };
    (r == null ? void 0 : r.once) === !0 ? this.listeners.push(s) : this.listeners.push(e);
  }
  /**
   * Emit change.
   * @param data - Data to emit.
   */
  emit(e) {
    this.listeners.slice().forEach((r) => r(e));
  }
  /**
   * Removes all listeners previously registered with addListener.
   */
  removeAllListeners() {
    this.listeners = [];
  }
  /**
   * Removes a listener previously registered with addListener.
   * @param listener - Callback function.
   */
  removeListener(e) {
    this.listeners = this.listeners.filter((r) => r !== e);
  }
  /**
   * Registers a listener.
   * @param listener - Callback function.
   * @deprecated Use addListener.
   */
  on(e) {
    return this.addListener(e);
  }
  /**
   * Unregisters a listener.
   * @param listener - Callback function.
   * @deprecated Use removeListener.
   */
  off(e) {
    return this.removeListener(e);
  }
  /**
   * Registers a listener then unregisters the listener after one event emission.
   * @param listener - Callback function.
   * @deprecated Use addListener.
   */
  once(e) {
    return this.addListener(e, { once: !0 });
  }
}
class Sh {
  /** @internal */
  constructor(e) {
    this.incomingInfoRequest = e;
  }
  /** Incoming MESSAGE request message. */
  get request() {
    return this.incomingInfoRequest.message;
  }
  /** Accept the request. */
  accept(e) {
    return this.incomingInfoRequest.accept(e), Promise.resolve();
  }
  /** Reject the request. */
  reject(e) {
    return this.incomingInfoRequest.reject(e), Promise.resolve();
  }
}
class Fo {
  constructor(e) {
    this.parameters = {};
    for (const r in e)
      e.hasOwnProperty(r) && this.setParam(r, e[r]);
  }
  setParam(e, r) {
    e && (this.parameters[e.toLowerCase()] = typeof r > "u" || r === null ? null : r.toString());
  }
  getParam(e) {
    if (e)
      return this.parameters[e.toLowerCase()];
  }
  hasParam(e) {
    return !!(e && this.parameters[e.toLowerCase()] !== void 0);
  }
  deleteParam(e) {
    if (e = e.toLowerCase(), this.hasParam(e)) {
      const r = this.parameters[e];
      return delete this.parameters[e], r;
    }
  }
  clearParams() {
    this.parameters = {};
  }
}
class qe extends Fo {
  /**
   * Constructor
   * @param uri -
   * @param displayName -
   * @param parameters -
   */
  constructor(e, r, s) {
    super(s), this.uri = e, this._displayName = r;
  }
  get friendlyName() {
    return this.displayName || this.uri.aor;
  }
  get displayName() {
    return this._displayName;
  }
  set displayName(e) {
    this._displayName = e;
  }
  clone() {
    return new qe(this.uri.clone(), this._displayName, JSON.parse(JSON.stringify(this.parameters)));
  }
  toString() {
    let e = this.displayName || this.displayName === "0" ? '"' + this.displayName + '" ' : "";
    e += "<" + this.uri.toString() + ">";
    for (const r in this.parameters)
      this.parameters.hasOwnProperty(r) && (e += ";" + r, this.parameters[r] !== null && (e += "=" + this.parameters[r]));
    return e;
  }
}
class vt extends Fo {
  /**
   * Constructor
   * @param scheme -
   * @param user -
   * @param host -
   * @param port -
   * @param parameters -
   * @param headers -
   */
  constructor(e = "sip", r, s, i, n, a) {
    if (super(n || {}), this.headers = {}, !s)
      throw new TypeError('missing or invalid "host" parameter');
    for (const o in a)
      a.hasOwnProperty(o) && this.setHeader(o, a[o]);
    this.raw = {
      scheme: e,
      user: r,
      host: s,
      port: i
    }, this.normal = {
      scheme: e.toLowerCase(),
      user: r,
      host: s.toLowerCase(),
      port: i
    };
  }
  get scheme() {
    return this.normal.scheme;
  }
  set scheme(e) {
    this.raw.scheme = e, this.normal.scheme = e.toLowerCase();
  }
  get user() {
    return this.normal.user;
  }
  set user(e) {
    this.normal.user = this.raw.user = e;
  }
  get host() {
    return this.normal.host;
  }
  set host(e) {
    this.raw.host = e, this.normal.host = e.toLowerCase();
  }
  get aor() {
    return this.normal.user + "@" + this.normal.host;
  }
  get port() {
    return this.normal.port;
  }
  set port(e) {
    this.normal.port = this.raw.port = e;
  }
  setHeader(e, r) {
    this.headers[this.headerize(e)] = r instanceof Array ? r : [r];
  }
  getHeader(e) {
    if (e)
      return this.headers[this.headerize(e)];
  }
  hasHeader(e) {
    return !!e && !!this.headers.hasOwnProperty(this.headerize(e));
  }
  deleteHeader(e) {
    if (e = this.headerize(e), this.headers.hasOwnProperty(e)) {
      const r = this.headers[e];
      return delete this.headers[e], r;
    }
  }
  clearHeaders() {
    this.headers = {};
  }
  clone() {
    return new vt(this._raw.scheme, this._raw.user || "", this._raw.host, this._raw.port, JSON.parse(JSON.stringify(this.parameters)), JSON.parse(JSON.stringify(this.headers)));
  }
  toRaw() {
    return this._toString(this._raw);
  }
  toString() {
    return this._toString(this._normal);
  }
  get _normal() {
    return this.normal;
  }
  get _raw() {
    return this.raw;
  }
  _toString(e) {
    let r = e.scheme + ":";
    e.scheme.toLowerCase().match("^sips?$") || (r += "//"), e.user && (r += this.escapeUser(e.user) + "@"), r += e.host, (e.port || e.port === 0) && (r += ":" + e.port);
    for (const i in this.parameters)
      this.parameters.hasOwnProperty(i) && (r += ";" + i, this.parameters[i] !== null && (r += "=" + this.parameters[i]));
    const s = [];
    for (const i in this.headers)
      if (this.headers.hasOwnProperty(i))
        for (const n in this.headers[i])
          this.headers[i].hasOwnProperty(n) && s.push(i + "=" + this.headers[i][n]);
    return s.length > 0 && (r += "?" + s.join("&")), r;
  }
  /*
   * Hex-escape a SIP URI user.
   * @private
   * @param {String} user
   */
  escapeUser(e) {
    let r;
    try {
      r = decodeURIComponent(e);
    } catch (s) {
      throw s;
    }
    return encodeURIComponent(r).replace(/%3A/ig, ":").replace(/%2B/ig, "+").replace(/%3F/ig, "?").replace(/%2F/ig, "/");
  }
  headerize(e) {
    const r = {
      "Call-Id": "Call-ID",
      Cseq: "CSeq",
      "Min-Se": "Min-SE",
      Rack: "RAck",
      Rseq: "RSeq",
      "Www-Authenticate": "WWW-Authenticate"
    }, s = e.toLowerCase().replace(/_/g, "-").split("-"), i = s.length;
    let n = "";
    for (let a = 0; a < i; a++)
      a !== 0 && (n += "-"), n += s[a].charAt(0).toUpperCase() + s[a].substring(1);
    return r[n] && (n = r[n]), n;
  }
}
function Fa(t, e) {
  if (t.scheme !== e.scheme || t.user !== e.user || t.host !== e.host || t.port !== e.port)
    return !1;
  function r(n, a) {
    const o = Object.keys(n.parameters), c = Object.keys(a.parameters);
    return !(!o.filter((h) => c.includes(h)).every((h) => n.parameters[h] === a.parameters[h]) || !["user", "ttl", "method", "transport"].every((h) => n.hasParam(h) && a.hasParam(h) || !n.hasParam(h) && !a.hasParam(h)) || !["maddr"].every((h) => n.hasParam(h) && a.hasParam(h) || !n.hasParam(h) && !a.hasParam(h)));
  }
  if (!r(t, e))
    return !1;
  const s = Object.keys(t.headers), i = Object.keys(e.headers);
  if (s.length !== 0 || i.length !== 0) {
    if (s.length !== i.length)
      return !1;
    const n = s.filter((a) => i.includes(a));
    if (n.length !== i.length || !n.every((a) => t.headers[a].length && e.headers[a].length && t.headers[a][0] === e.headers[a][0]))
      return !1;
  }
  return !0;
}
function Hi(t, e, r) {
  return r = r || " ", t.length > e ? t : (e -= t.length, r += r.repeat(e), t + r.slice(0, e));
}
class Rr extends Error {
  static buildMessage(e, r) {
    function s(l) {
      return l.charCodeAt(0).toString(16).toUpperCase();
    }
    function i(l) {
      return l.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (h) => "\\x0" + s(h)).replace(/[\x10-\x1F\x7F-\x9F]/g, (h) => "\\x" + s(h));
    }
    function n(l) {
      return l.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (h) => "\\x0" + s(h)).replace(/[\x10-\x1F\x7F-\x9F]/g, (h) => "\\x" + s(h));
    }
    function a(l) {
      switch (l.type) {
        case "literal":
          return '"' + i(l.text) + '"';
        case "class":
          const h = l.parts.map((f) => Array.isArray(f) ? n(f[0]) + "-" + n(f[1]) : n(f));
          return "[" + (l.inverted ? "^" : "") + h + "]";
        case "any":
          return "any character";
        case "end":
          return "end of input";
        case "other":
          return l.description;
      }
    }
    function o(l) {
      const h = l.map(a);
      let f, x;
      if (h.sort(), h.length > 0) {
        for (f = 1, x = 1; f < h.length; f++)
          h[f - 1] !== h[f] && (h[x] = h[f], x++);
        h.length = x;
      }
      switch (h.length) {
        case 1:
          return h[0];
        case 2:
          return h[0] + " or " + h[1];
        default:
          return h.slice(0, -1).join(", ") + ", or " + h[h.length - 1];
      }
    }
    function c(l) {
      return l ? '"' + i(l) + '"' : "end of input";
    }
    return "Expected " + o(e) + " but " + c(r) + " found.";
  }
  constructor(e, r, s, i) {
    super(), this.message = e, this.expected = r, this.found = s, this.location = i, this.name = "SyntaxError", typeof Object.setPrototypeOf == "function" ? Object.setPrototypeOf(this, Rr.prototype) : this.__proto__ = Rr.prototype, typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, Rr);
  }
  format(e) {
    let r = "Error: " + this.message;
    if (this.location) {
      let s = null, i;
      for (i = 0; i < e.length; i++)
        if (e[i].source === this.location.source) {
          s = e[i].text.split(/\r\n|\n|\r/g);
          break;
        }
      let n = this.location.start, a = this.location.source + ":" + n.line + ":" + n.column;
      if (s) {
        let o = this.location.end, c = Hi("", n.line.toString().length, " "), l = s[n.line - 1], h = n.line === o.line ? o.column : l.length + 1;
        r += `
 --> ` + a + `
` + c + ` |
` + n.line + " | " + l + `
` + c + " | " + Hi("", n.column - 1, " ") + Hi("", h - n.column, "^");
      } else
        r += `
 at ` + a;
    }
    return r;
  }
}
function Dh(t, e) {
  e = e !== void 0 ? e : {};
  const r = {}, s = e.grammarSource, i = { Contact: 119, Name_Addr_Header: 156, Record_Route: 176, Request_Response: 81, SIP_URI: 45, Subscription_State: 186, Supported: 191, Require: 182, Via: 194, absoluteURI: 84, Call_ID: 118, Content_Disposition: 130, Content_Length: 135, Content_Type: 136, CSeq: 146, displayName: 122, Event: 149, From: 151, host: 52, Max_Forwards: 154, Min_SE: 213, Proxy_Authenticate: 157, quoted_string: 40, Refer_To: 178, Replaces: 179, Session_Expires: 210, stun_URI: 217, To: 192, turn_URI: 223, uuid: 226, WWW_Authenticate: 209, challenge: 158, sipfrag: 230, Referred_By: 231 };
  let n = 119;
  const a = [
    `\r
`,
    m(`\r
`, !1),
    /^[0-9]/,
    V([["0", "9"]], !1, !1),
    /^[a-zA-Z]/,
    V([["a", "z"], ["A", "Z"]], !1, !1),
    /^[0-9a-fA-F]/,
    V([["0", "9"], ["a", "f"], ["A", "F"]], !1, !1),
    /^[\0-\xFF]/,
    V([["\0", "ÿ"]], !1, !1),
    /^["]/,
    V(['"'], !1, !1),
    " ",
    m(" ", !1),
    "	",
    m("	", !1),
    /^[a-zA-Z0-9]/,
    V([["a", "z"], ["A", "Z"], ["0", "9"]], !1, !1),
    ";",
    m(";", !1),
    "/",
    m("/", !1),
    "?",
    m("?", !1),
    ":",
    m(":", !1),
    "@",
    m("@", !1),
    "&",
    m("&", !1),
    "=",
    m("=", !1),
    "+",
    m("+", !1),
    "$",
    m("$", !1),
    ",",
    m(",", !1),
    "-",
    m("-", !1),
    "_",
    m("_", !1),
    ".",
    m(".", !1),
    "!",
    m("!", !1),
    "~",
    m("~", !1),
    "*",
    m("*", !1),
    "'",
    m("'", !1),
    "(",
    m("(", !1),
    ")",
    m(")", !1),
    "%",
    m("%", !1),
    function() {
      return " ";
    },
    function() {
      return ":";
    },
    /^[!-~]/,
    V([["!", "~"]], !1, !1),
    /^[\x80-\uFFFF]/,
    V([["", "￿"]], !1, !1),
    /^[\x80-\xBF]/,
    V([["", "¿"]], !1, !1),
    /^[a-f]/,
    V([["a", "f"]], !1, !1),
    "`",
    m("`", !1),
    "<",
    m("<", !1),
    ">",
    m(">", !1),
    "\\",
    m("\\", !1),
    "[",
    m("[", !1),
    "]",
    m("]", !1),
    "{",
    m("{", !1),
    "}",
    m("}", !1),
    function() {
      return "*";
    },
    function() {
      return "/";
    },
    function() {
      return "=";
    },
    function() {
      return "(";
    },
    function() {
      return ")";
    },
    function() {
      return ">";
    },
    function() {
      return "<";
    },
    function() {
      return ",";
    },
    function() {
      return ";";
    },
    function() {
      return ":";
    },
    function() {
      return '"';
    },
    /^[!-']/,
    V([["!", "'"]], !1, !1),
    /^[*-[]/,
    V([["*", "["]], !1, !1),
    /^[\]-~]/,
    V([["]", "~"]], !1, !1),
    function(p) {
      return p;
    },
    /^[#-[]/,
    V([["#", "["]], !1, !1),
    /^[\0-\t]/,
    V([["\0", "	"]], !1, !1),
    /^[\v-\f]/,
    V([["\v", "\f"]], !1, !1),
    /^[\x0E-\x7F]/,
    V([["", ""]], !1, !1),
    function() {
      e = e || { data: {} }, e.data.uri = new vt(e.data.scheme, e.data.user, e.data.host, e.data.port), delete e.data.scheme, delete e.data.user, delete e.data.host, delete e.data.host_type, delete e.data.port;
    },
    function() {
      e = e || { data: {} }, e.data.uri = new vt(e.data.scheme, e.data.user, e.data.host, e.data.port, e.data.uri_params, e.data.uri_headers), delete e.data.scheme, delete e.data.user, delete e.data.host, delete e.data.host_type, delete e.data.port, delete e.data.uri_params, e.startRule === "SIP_URI" && (e.data = e.data.uri);
    },
    "sips",
    m("sips", !0),
    "sip",
    m("sip", !0),
    function(p) {
      e = e || { data: {} }, e.data.scheme = p;
    },
    function() {
      e = e || { data: {} }, e.data.user = decodeURIComponent(M().slice(0, -1));
    },
    function() {
      e = e || { data: {} }, e.data.password = M();
    },
    function() {
      return e = e || { data: {} }, e.data.host = M(), e.data.host;
    },
    function() {
      return e = e || { data: {} }, e.data.host_type = "domain", M();
    },
    /^[a-zA-Z0-9_\-]/,
    V([["a", "z"], ["A", "Z"], ["0", "9"], "_", "-"], !1, !1),
    /^[a-zA-Z0-9\-]/,
    V([["a", "z"], ["A", "Z"], ["0", "9"], "-"], !1, !1),
    function() {
      return e = e || { data: {} }, e.data.host_type = "IPv6", M();
    },
    "::",
    m("::", !1),
    function() {
      return e = e || { data: {} }, e.data.host_type = "IPv6", M();
    },
    function() {
      return e = e || { data: {} }, e.data.host_type = "IPv4", M();
    },
    "25",
    m("25", !1),
    /^[0-5]/,
    V([["0", "5"]], !1, !1),
    "2",
    m("2", !1),
    /^[0-4]/,
    V([["0", "4"]], !1, !1),
    "1",
    m("1", !1),
    /^[1-9]/,
    V([["1", "9"]], !1, !1),
    function(p) {
      return e = e || { data: {} }, p = parseInt(p.join("")), e.data.port = p, p;
    },
    "transport=",
    m("transport=", !0),
    "udp",
    m("udp", !0),
    "tcp",
    m("tcp", !0),
    "sctp",
    m("sctp", !0),
    "tls",
    m("tls", !0),
    function(p) {
      e = e || { data: {} }, e.data.uri_params || (e.data.uri_params = {}), e.data.uri_params.transport = p.toLowerCase();
    },
    "user=",
    m("user=", !0),
    "phone",
    m("phone", !0),
    "ip",
    m("ip", !0),
    function(p) {
      e = e || { data: {} }, e.data.uri_params || (e.data.uri_params = {}), e.data.uri_params.user = p.toLowerCase();
    },
    "method=",
    m("method=", !0),
    function(p) {
      e = e || { data: {} }, e.data.uri_params || (e.data.uri_params = {}), e.data.uri_params.method = p;
    },
    "ttl=",
    m("ttl=", !0),
    function(p) {
      e = e || { data: {} }, e.data.params || (e.data.params = {}), e.data.params.ttl = p;
    },
    "maddr=",
    m("maddr=", !0),
    function(p) {
      e = e || { data: {} }, e.data.uri_params || (e.data.uri_params = {}), e.data.uri_params.maddr = p;
    },
    "lr",
    m("lr", !0),
    function() {
      e = e || { data: {} }, e.data.uri_params || (e.data.uri_params = {}), e.data.uri_params.lr = void 0;
    },
    function(p, v) {
      e = e || { data: {} }, e.data.uri_params || (e.data.uri_params = {}), v === null ? v = void 0 : v = v[1], e.data.uri_params[p.toLowerCase()] = v;
    },
    function(p, v) {
      p = p.join("").toLowerCase(), v = v.join(""), e = e || { data: {} }, e.data.uri_headers || (e.data.uri_headers = {}), e.data.uri_headers[p] ? e.data.uri_headers[p].push(v) : e.data.uri_headers[p] = [v];
    },
    function() {
      e = e || { data: {} }, e.startRule === "Refer_To" && (e.data.uri = new vt(e.data.scheme, e.data.user, e.data.host, e.data.port, e.data.uri_params, e.data.uri_headers), delete e.data.scheme, delete e.data.user, delete e.data.host, delete e.data.host_type, delete e.data.port, delete e.data.uri_params);
    },
    "//",
    m("//", !1),
    function() {
      e = e || { data: {} }, e.data.scheme = M();
    },
    m("SIP", !0),
    function() {
      e = e || { data: {} }, e.data.sip_version = M();
    },
    "INVITE",
    m("INVITE", !1),
    "ACK",
    m("ACK", !1),
    "VXACH",
    m("VXACH", !1),
    "OPTIONS",
    m("OPTIONS", !1),
    "BYE",
    m("BYE", !1),
    "CANCEL",
    m("CANCEL", !1),
    "REGISTER",
    m("REGISTER", !1),
    "SUBSCRIBE",
    m("SUBSCRIBE", !1),
    "NOTIFY",
    m("NOTIFY", !1),
    "REFER",
    m("REFER", !1),
    "PUBLISH",
    m("PUBLISH", !1),
    function() {
      return e = e || { data: {} }, e.data.method = M(), e.data.method;
    },
    function(p) {
      e = e || { data: {} }, e.data.status_code = parseInt(p.join(""));
    },
    function() {
      e = e || { data: {} }, e.data.reason_phrase = M();
    },
    function() {
      e = e || { data: {} }, e.data = M();
    },
    function() {
      var p, v;
      for (e = e || { data: {} }, v = e.data.multi_header.length, p = 0; p < v; p++)
        if (e.data.multi_header[p].parsed === null) {
          e.data = null;
          break;
        }
      e.data !== null ? e.data = e.data.multi_header : e.data = -1;
    },
    function() {
      var p;
      e = e || { data: {} }, e.data.multi_header || (e.data.multi_header = []);
      try {
        p = new qe(e.data.uri, e.data.displayName, e.data.params), delete e.data.uri, delete e.data.displayName, delete e.data.params;
      } catch {
        p = null;
      }
      e.data.multi_header.push({
        position: c,
        offset: le().start.offset,
        parsed: p
      });
    },
    function(p) {
      p = M().trim(), p[0] === '"' && (p = p.substring(1, p.length - 1)), e = e || { data: {} }, e.data.displayName = p;
    },
    "q",
    m("q", !0),
    function(p) {
      e = e || { data: {} }, e.data.params || (e.data.params = {}), e.data.params.q = p;
    },
    "expires",
    m("expires", !0),
    function(p) {
      e = e || { data: {} }, e.data.params || (e.data.params = {}), e.data.params.expires = p;
    },
    function(p) {
      return parseInt(p.join(""));
    },
    "0",
    m("0", !1),
    function() {
      return parseFloat(M());
    },
    function(p, v) {
      e = e || { data: {} }, e.data.params || (e.data.params = {}), v === null ? v = void 0 : v = v[1], e.data.params[p.toLowerCase()] = v;
    },
    "render",
    m("render", !0),
    "session",
    m("session", !0),
    "icon",
    m("icon", !0),
    "alert",
    m("alert", !0),
    function() {
      e = e || { data: {} }, e.startRule === "Content_Disposition" && (e.data.type = M().toLowerCase());
    },
    "handling",
    m("handling", !0),
    "optional",
    m("optional", !0),
    "required",
    m("required", !0),
    function(p) {
      e = e || { data: {} }, e.data = parseInt(p.join(""));
    },
    function() {
      e = e || { data: {} }, e.data = M();
    },
    "text",
    m("text", !0),
    "image",
    m("image", !0),
    "audio",
    m("audio", !0),
    "video",
    m("video", !0),
    "application",
    m("application", !0),
    "message",
    m("message", !0),
    "multipart",
    m("multipart", !0),
    "x-",
    m("x-", !0),
    function(p) {
      e = e || { data: {} }, e.data.value = parseInt(p.join(""));
    },
    function(p) {
      e = e || { data: {} }, e.data = p;
    },
    function(p) {
      e = e || { data: {} }, e.data.event = p.toLowerCase();
    },
    function() {
      e = e || { data: {} };
      var p = e.data.tag;
      e.data = new qe(e.data.uri, e.data.displayName, e.data.params), p && e.data.setParam("tag", p);
    },
    "tag",
    m("tag", !0),
    function(p) {
      e = e || { data: {} }, e.data.tag = p;
    },
    function(p) {
      e = e || { data: {} }, e.data = parseInt(p.join(""));
    },
    function(p) {
      e = e || { data: {} }, e.data = p;
    },
    function() {
      e = e || { data: {} }, e.data = new qe(e.data.uri, e.data.displayName, e.data.params);
    },
    "digest",
    m("Digest", !0),
    "realm",
    m("realm", !0),
    function(p) {
      e = e || { data: {} }, e.data.realm = p;
    },
    "domain",
    m("domain", !0),
    "nonce",
    m("nonce", !0),
    function(p) {
      e = e || { data: {} }, e.data.nonce = p;
    },
    "opaque",
    m("opaque", !0),
    function(p) {
      e = e || { data: {} }, e.data.opaque = p;
    },
    "stale",
    m("stale", !0),
    "true",
    m("true", !0),
    function() {
      e = e || { data: {} }, e.data.stale = !0;
    },
    "false",
    m("false", !0),
    function() {
      e = e || { data: {} }, e.data.stale = !1;
    },
    "algorithm",
    m("algorithm", !0),
    "md5",
    m("MD5", !0),
    "md5-sess",
    m("MD5-sess", !0),
    function(p) {
      e = e || { data: {} }, e.data.algorithm = p.toUpperCase();
    },
    "qop",
    m("qop", !0),
    "auth-int",
    m("auth-int", !0),
    "auth",
    m("auth", !0),
    function(p) {
      e = e || { data: {} }, e.data.qop || (e.data.qop = []), e.data.qop.push(p.toLowerCase());
    },
    function(p) {
      e = e || { data: {} }, e.data.value = parseInt(p.join(""));
    },
    function() {
      var p, v;
      for (e = e || { data: {} }, v = e.data.multi_header.length, p = 0; p < v; p++)
        if (e.data.multi_header[p].parsed === null) {
          e.data = null;
          break;
        }
      e.data !== null ? e.data = e.data.multi_header : e.data = -1;
    },
    function() {
      var p;
      e = e || { data: {} }, e.data.multi_header || (e.data.multi_header = []);
      try {
        p = new qe(e.data.uri, e.data.displayName, e.data.params), delete e.data.uri, delete e.data.displayName, delete e.data.params;
      } catch {
        p = null;
      }
      e.data.multi_header.push({
        position: c,
        offset: le().start.offset,
        parsed: p
      });
    },
    function() {
      e = e || { data: {} }, e.data = new qe(e.data.uri, e.data.displayName, e.data.params);
    },
    function() {
      e = e || { data: {} }, e.data.replaces_from_tag && e.data.replaces_to_tag || (e.data = -1);
    },
    function() {
      e = e || { data: {} }, e.data = {
        call_id: e.data
      };
    },
    "from-tag",
    m("from-tag", !0),
    function(p) {
      e = e || { data: {} }, e.data.replaces_from_tag = p;
    },
    "to-tag",
    m("to-tag", !0),
    function(p) {
      e = e || { data: {} }, e.data.replaces_to_tag = p;
    },
    "early-only",
    m("early-only", !0),
    function() {
      e = e || { data: {} }, e.data.early_only = !0;
    },
    function(p, v) {
      return v;
    },
    function(p, v) {
      return St(p, v);
    },
    function(p) {
      e = e || { data: {} }, e.startRule === "Require" && (e.data = p || []);
    },
    function(p) {
      e = e || { data: {} }, e.data.value = parseInt(p.join(""));
    },
    "active",
    m("active", !0),
    "pending",
    m("pending", !0),
    "terminated",
    m("terminated", !0),
    function() {
      e = e || { data: {} }, e.data.state = M();
    },
    "reason",
    m("reason", !0),
    function(p) {
      e = e || { data: {} }, typeof p < "u" && (e.data.reason = p);
    },
    function(p) {
      e = e || { data: {} }, typeof p < "u" && (e.data.expires = p);
    },
    "retry_after",
    m("retry_after", !0),
    function(p) {
      e = e || { data: {} }, typeof p < "u" && (e.data.retry_after = p);
    },
    "deactivated",
    m("deactivated", !0),
    "probation",
    m("probation", !0),
    "rejected",
    m("rejected", !0),
    "timeout",
    m("timeout", !0),
    "giveup",
    m("giveup", !0),
    "noresource",
    m("noresource", !0),
    "invariant",
    m("invariant", !0),
    function(p) {
      e = e || { data: {} }, e.startRule === "Supported" && (e.data = p || []);
    },
    function() {
      e = e || { data: {} };
      var p = e.data.tag;
      e.data = new qe(e.data.uri, e.data.displayName, e.data.params), p && e.data.setParam("tag", p);
    },
    "ttl",
    m("ttl", !0),
    function(p) {
      e = e || { data: {} }, e.data.ttl = p;
    },
    "maddr",
    m("maddr", !0),
    function(p) {
      e = e || { data: {} }, e.data.maddr = p;
    },
    "received",
    m("received", !0),
    function(p) {
      e = e || { data: {} }, e.data.received = p;
    },
    "branch",
    m("branch", !0),
    function(p) {
      e = e || { data: {} }, e.data.branch = p;
    },
    "rport",
    m("rport", !0),
    function(p) {
      e = e || { data: {} }, typeof p < "u" && (e.data.rport = p.join(""));
    },
    function(p) {
      e = e || { data: {} }, e.data.protocol = p;
    },
    m("UDP", !0),
    m("TCP", !0),
    m("TLS", !0),
    m("SCTP", !0),
    function(p) {
      e = e || { data: {} }, e.data.transport = p;
    },
    function() {
      e = e || { data: {} }, e.data.host = M();
    },
    function(p) {
      e = e || { data: {} }, e.data.port = parseInt(p.join(""));
    },
    function(p) {
      return parseInt(p.join(""));
    },
    function(p) {
      e = e || { data: {} }, e.startRule === "Session_Expires" && (e.data.deltaSeconds = p);
    },
    "refresher",
    m("refresher", !1),
    "uas",
    m("uas", !1),
    "uac",
    m("uac", !1),
    function(p) {
      e = e || { data: {} }, e.startRule === "Session_Expires" && (e.data.refresher = p);
    },
    function(p) {
      e = e || { data: {} }, e.startRule === "Min_SE" && (e.data = p);
    },
    "stuns",
    m("stuns", !0),
    "stun",
    m("stun", !0),
    function(p) {
      e = e || { data: {} }, e.data.scheme = p;
    },
    function(p) {
      e = e || { data: {} }, e.data.host = p;
    },
    "?transport=",
    m("?transport=", !1),
    "turns",
    m("turns", !0),
    "turn",
    m("turn", !0),
    function(p) {
      e = e || { data: {} }, e.data.transport = p;
    },
    function() {
      e = e || { data: {} }, e.data = M();
    },
    "Referred-By",
    m("Referred-By", !1),
    "b",
    m("b", !1),
    "cid",
    m("cid", !1)
  ], o = [
    d('2 ""6 7!'),
    d('4"""5!7#'),
    d('4$""5!7%'),
    d(`4&""5!7'`),
    d(";'.# &;("),
    d('4(""5!7)'),
    d('4*""5!7+'),
    d('2,""6,7-'),
    d('2.""6.7/'),
    d('40""5!71'),
    d('22""6273. &24""6475.} &26""6677.q &28""6879.e &2:""6:7;.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E'),
    d(";).# &;,"),
    d('2F""6F7G.} &2H""6H7I.q &2J""6J7K.e &2L""6L7M.Y &2N""6N7O.M &2P""6P7Q.A &2R""6R7S.5 &2T""6T7U.) &2V""6V7W'),
    d(`%%2X""6X7Y/5#;#/,$;#/#$+#)(#'#("'#&'#/"!&,)`),
    d(`%%$;$0#*;$&/,#; /#$+")("'#&'#." &"/=#$;$/&#0#*;$&&&#/'$8":Z" )("'#&'#`),
    d(';.." &"'),
    d(`%$;'.# &;(0)*;'.# &;(&/?#28""6879/0$;//'$8#:[# )(#'#("'#&'#`),
    d(`%%$;2/&#0#*;2&&&#/g#$%$;.0#*;.&/,#;2/#$+")("'#&'#0=*%$;.0#*;.&/,#;2/#$+")("'#&'#&/#$+")("'#&'#/"!&,)`),
    d('4\\""5!7].# &;3'),
    d('4^""5!7_'),
    d('4`""5!7a'),
    d(';!.) &4b""5!7c'),
    d('%$;). &2F""6F7G. &2J""6J7K.} &2L""6L7M.q &2X""6X7Y.e &2P""6P7Q.Y &2H""6H7I.M &2@""6@7A.A &2d""6d7e.5 &2R""6R7S.) &2N""6N7O/#0*;). &2F""6F7G. &2J""6J7K.} &2L""6L7M.q &2X""6X7Y.e &2P""6P7Q.Y &2H""6H7I.M &2@""6@7A.A &2d""6d7e.5 &2R""6R7S.) &2N""6N7O&&&#/"!&,)'),
    d('%$;). &2F""6F7G.} &2L""6L7M.q &2X""6X7Y.e &2P""6P7Q.Y &2H""6H7I.M &2@""6@7A.A &2d""6d7e.5 &2R""6R7S.) &2N""6N7O/#0*;). &2F""6F7G.} &2L""6L7M.q &2X""6X7Y.e &2P""6P7Q.Y &2H""6H7I.M &2@""6@7A.A &2d""6d7e.5 &2R""6R7S.) &2N""6N7O&&&#/"!&,)'),
    d(`2T""6T7U.ã &2V""6V7W.× &2f""6f7g.Ë &2h""6h7i.¿ &2:""6:7;.³ &2D""6D7E.§ &22""6273. &28""6879. &2j""6j7k. &;&.} &24""6475.q &2l""6l7m.e &2n""6n7o.Y &26""6677.M &2>""6>7?.A &2p""6p7q.5 &2r""6r7s.) &;'.# &;(`),
    d('%$;).ī &2F""6F7G.ğ &2J""6J7K.ē &2L""6L7M.ć &2X""6X7Y.û &2P""6P7Q.ï &2H""6H7I.ã &2@""6@7A.× &2d""6d7e.Ë &2R""6R7S.¿ &2N""6N7O.³ &2T""6T7U.§ &2V""6V7W. &2f""6f7g. &2h""6h7i. &28""6879.w &2j""6j7k.k &;&.e &24""6475.Y &2l""6l7m.M &2n""6n7o.A &26""6677.5 &2p""6p7q.) &2r""6r7s/Ĵ#0ı*;).ī &2F""6F7G.ğ &2J""6J7K.ē &2L""6L7M.ć &2X""6X7Y.û &2P""6P7Q.ï &2H""6H7I.ã &2@""6@7A.× &2d""6d7e.Ë &2R""6R7S.¿ &2N""6N7O.³ &2T""6T7U.§ &2V""6V7W. &2f""6f7g. &2h""6h7i. &28""6879.w &2j""6j7k.k &;&.e &24""6475.Y &2l""6l7m.M &2n""6n7o.A &26""6677.5 &2p""6p7q.) &2r""6r7s&&&#/"!&,)'),
    d(`%;//?#2P""6P7Q/0$;//'$8#:t# )(#'#("'#&'#`),
    d(`%;//?#24""6475/0$;//'$8#:u# )(#'#("'#&'#`),
    d(`%;//?#2>""6>7?/0$;//'$8#:v# )(#'#("'#&'#`),
    d(`%;//?#2T""6T7U/0$;//'$8#:w# )(#'#("'#&'#`),
    d(`%;//?#2V""6V7W/0$;//'$8#:x# )(#'#("'#&'#`),
    d(`%2h""6h7i/0#;//'$8":y" )("'#&'#`),
    d(`%;//6#2f""6f7g/'$8":z" )("'#&'#`),
    d(`%;//?#2D""6D7E/0$;//'$8#:{# )(#'#("'#&'#`),
    d(`%;//?#22""6273/0$;//'$8#:|# )(#'#("'#&'#`),
    d(`%;//?#28""6879/0$;//'$8#:}# )(#'#("'#&'#`),
    d(`%;//0#;&/'$8":~" )("'#&'#`),
    d(`%;&/0#;//'$8":~" )("'#&'#`),
    d(`%;=/T#$;G.) &;K.# &;F0/*;G.) &;K.# &;F&/,$;>/#$+#)(#'#("'#&'#`),
    d('4""5!7.A &4""5!7.5 &4""5!7.) &;3.# &;.'),
    d(`%%;//Q#;&/H$$;J.# &;K0)*;J.# &;K&/,$;&/#$+$)($'#(#'#("'#&'#/"!&,)`),
    d(`%;//]#;&/T$%$;J.# &;K0)*;J.# &;K&/"!&,)/1$;&/($8$:$!!)($'#(#'#("'#&'#`),
    d(';..G &2L""6L7M.; &4""5!7./ &4""5!7.# &;3'),
    d(`%2j""6j7k/J#4""5!7.5 &4""5!7.) &4""5!7/#$+")("'#&'#`),
    d(`%;N/M#28""6879/>$;O." &"/0$;S/'$8$:$ )($'#(#'#("'#&'#`),
    d(`%;N/d#28""6879/U$;O." &"/G$;S/>$;_/5$;l." &"/'$8&:& )(&'#(%'#($'#(#'#("'#&'#`),
    d(`%3""5$7.) &3""5#7/' 8!:!! )`),
    d(`%;P/]#%28""6879/,#;R/#$+")("'#&'#." &"/6$2:""6:7;/'$8#:# )(#'#("'#&'#`),
    d("$;+.) &;-.# &;Q/2#0/*;+.) &;-.# &;Q&&&#"),
    d('2<""6<7=.q &2>""6>7?.e &2@""6@7A.Y &2B""6B7C.M &2D""6D7E.A &22""6273.5 &26""6677.) &24""6475'),
    d('%$;+._ &;-.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E0e*;+._ &;-.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E&/& 8!:! )'),
    d(`%;T/J#%28""6879/,#;^/#$+")("'#&'#." &"/#$+")("'#&'#`),
    d("%;U.) &;\\.# &;X/& 8!:! )"),
    d(`%$%;V/2#2J""6J7K/#$+")("'#&'#0<*%;V/2#2J""6J7K/#$+")("'#&'#&/D#;W/;$2J""6J7K." &"/'$8#:# )(#'#("'#&'#`),
    d('$4""5!7/,#0)*4""5!7&&&#'),
    d(`%4$""5!7%/?#$4""5!70)*4""5!7&/#$+")("'#&'#`),
    d(`%2l""6l7m/?#;Y/6$2n""6n7o/'$8#:# )(#'#("'#&'#`),
    d(`%%;Z/³#28""6879/¤$;Z/$28""6879/$;Z/$28""6879/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+-)(-'#(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#("'#&'#.ސ &%2""67/¤#;Z/$28""6879/$;Z/$28""6879/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+,)(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#("'#&'#.۹ &%2""67/#;Z/$28""6879/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#("'#&'#.ٺ &%2""67/t#;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#("'#&'#.ؓ &%2""67/\\#;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+&)(&'#(%'#($'#(#'#("'#&'#.ׄ &%2""67/D#;Z/;$28""6879/,$;[/#$+$)($'#(#'#("'#&'#.֍ &%2""67/,#;[/#$+")("'#&'#.ծ &%2""67/,#;Z/#$+")("'#&'#.Տ &%;Z/#2""67/$;Z/$28""6879/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$++)(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#("'#&'#.Ӈ &%;Z/ª#%28""6879/,#;Z/#$+")("'#&'#." &"/$2""67/t$;Z/k$28""6879/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#("'#&'#.а &%;Z/¹#%28""6879/,#;Z/#$+")("'#&'#." &"/$%28""6879/,#;Z/#$+")("'#&'#." &"/k$2""67/\\$;Z/S$28""6879/D$;Z/;$28""6879/,$;[/#$+))()'#(('#(''#(&'#(%'#($'#(#'#("'#&'#.Ί &%;Z/È#%28""6879/,#;Z/#$+")("'#&'#." &"/¡$%28""6879/,#;Z/#$+")("'#&'#." &"/z$%28""6879/,#;Z/#$+")("'#&'#." &"/S$2""67/D$;Z/;$28""6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#("'#&'#.˕ &%;Z/×#%28""6879/,#;Z/#$+")("'#&'#." &"/°$%28""6879/,#;Z/#$+")("'#&'#." &"/$%28""6879/,#;Z/#$+")("'#&'#." &"/b$%28""6879/,#;Z/#$+")("'#&'#." &"/;$2""67/,$;[/#$+')(''#(&'#(%'#($'#(#'#("'#&'#.ȑ &%;Z/þ#%28""6879/,#;Z/#$+")("'#&'#." &"/×$%28""6879/,#;Z/#$+")("'#&'#." &"/°$%28""6879/,#;Z/#$+")("'#&'#." &"/$%28""6879/,#;Z/#$+")("'#&'#." &"/b$%28""6879/,#;Z/#$+")("'#&'#." &"/;$2""67/,$;Z/#$+()(('#(''#(&'#(%'#($'#(#'#("'#&'#.Ħ &%;Z/Ĝ#%28""6879/,#;Z/#$+")("'#&'#." &"/õ$%28""6879/,#;Z/#$+")("'#&'#." &"/Î$%28""6879/,#;Z/#$+")("'#&'#." &"/§$%28""6879/,#;Z/#$+")("'#&'#." &"/$%28""6879/,#;Z/#$+")("'#&'#." &"/Y$%28""6879/,#;Z/#$+")("'#&'#." &"/2$2""67/#$+()(('#(''#(&'#(%'#($'#(#'#("'#&'#/& 8!: ! )`),
    d(`%;#/M#;#." &"/?$;#." &"/1$;#." &"/#$+$)($'#(#'#("'#&'#`),
    d(`%;Z/;#28""6879/,$;Z/#$+#)(#'#("'#&'#.# &;\\`),
    d(`%;]/o#2J""6J7K/\`$;]/W$2J""6J7K/H$;]/?$2J""6J7K/0$;]/'$8':¡' )(''#(&'#(%'#($'#(#'#("'#&'#`),
    d(`%2¢""6¢7£/2#4¤""5!7¥/#$+")("'#&'#. &%2¦""6¦7§/;#4¨""5!7©/,$;!/#$+#)(#'#("'#&'#.j &%2ª""6ª7«/5#;!/,$;!/#$+#)(#'#("'#&'#.B &%4¬""5!7­/,#;!/#$+")("'#&'#.# &;!`),
    d(`%%;!." &"/[#;!." &"/M$;!." &"/?$;!." &"/1$;!." &"/#$+%)(%'#($'#(#'#("'#&'#/' 8!:®!! )`),
    d(`$%22""6273/,#;\`/#$+")("'#&'#0<*%22""6273/,#;\`/#$+")("'#&'#&`),
    d(";a.A &;b.; &;c.5 &;d./ &;e.) &;f.# &;g"),
    d(`%3¯""5*7°/a#3±""5#7².G &3³""5#7´.; &3µ""5$7¶./ &3·""5#7¸.# &;6/($8":¹"! )("'#&'#`),
    d(`%3º""5%7»/I#3¼""5%7½./ &3¾""5"7¿.# &;6/($8":À"! )("'#&'#`),
    d(`%3Á""5'7Â/1#;/($8":Ã"! )("'#&'#`),
    d(`%3Ä""5$7Å/1#;ð/($8":Æ"! )("'#&'#`),
    d(`%3Ç""5&7È/1#;T/($8":É"! )("'#&'#`),
    d(`%3Ê""5"7Ë/N#%2>""6>7?/,#;6/#$+")("'#&'#." &"/'$8":Ì" )("'#&'#`),
    d(`%;h/P#%2>""6>7?/,#;i/#$+")("'#&'#." &"/)$8":Í""! )("'#&'#`),
    d('%$;j/&#0#*;j&&&#/"!&,)'),
    d('%$;j/&#0#*;j&&&#/"!&,)'),
    d(";k.) &;+.# &;-"),
    d('2l""6l7m.e &2n""6n7o.Y &24""6475.M &28""6879.A &2<""6<7=.5 &2@""6@7A.) &2B""6B7C'),
    d(`%26""6677/n#;m/e$$%2<""6<7=/,#;m/#$+")("'#&'#0<*%2<""6<7=/,#;m/#$+")("'#&'#&/#$+#)(#'#("'#&'#`),
    d(`%;n/A#2>""6>7?/2$;o/)$8#:Î#"" )(#'#("'#&'#`),
    d("$;p.) &;+.# &;-/2#0/*;p.) &;+.# &;-&&&#"),
    d("$;p.) &;+.# &;-0/*;p.) &;+.# &;-&"),
    d('2l""6l7m.e &2n""6n7o.Y &24""6475.M &26""6677.A &28""6879.5 &2@""6@7A.) &2B""6B7C'),
    d(";.# &;r"),
    d(`%;/G#;'/>$;s/5$;'/,$;/#$+%)(%'#($'#(#'#("'#&'#`),
    d(";M.# &;t"),
    d(`%;/E#28""6879/6$;u.# &;x/'$8#:Ï# )(#'#("'#&'#`),
    d(`%;v.# &;w/J#%26""6677/,#;/#$+")("'#&'#." &"/#$+")("'#&'#`),
    d(`%2Ð""6Ð7Ñ/:#;/1$;w." &"/#$+#)(#'#("'#&'#`),
    d(`%24""6475/,#;{/#$+")("'#&'#`),
    d(`%;z/3#$;y0#*;y&/#$+")("'#&'#`),
    d(";*.) &;+.# &;-"),
    d(';+. &;-. &22""6273.} &26""6677.q &28""6879.e &2:""6:7;.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E'),
    d(`%;|/e#$%24""6475/,#;|/#$+")("'#&'#0<*%24""6475/,#;|/#$+")("'#&'#&/#$+")("'#&'#`),
    d(`%$;~0#*;~&/e#$%22""6273/,#;}/#$+")("'#&'#0<*%22""6273/,#;}/#$+")("'#&'#&/#$+")("'#&'#`),
    d("$;~0#*;~&"),
    d(';+.w &;-.q &28""6879.e &2:""6:7;.Y &2<""6<7=.M &2>""6>7?.A &2@""6@7A.5 &2B""6B7C.) &2D""6D7E'),
    d(`%%;"/#$;".G &;!.A &2@""6@7A.5 &2F""6F7G.) &2J""6J7K0M*;".G &;!.A &2@""6@7A.5 &2F""6F7G.) &2J""6J7K&/#$+")("'#&'#/& 8!:Ò! )`),
    d(";.# &;"),
    d(`%%;O/2#2:""6:7;/#$+")("'#&'#." &"/,#;S/#$+")("'#&'#." &"`),
    d('$;+. &;-.} &2B""6B7C.q &2D""6D7E.e &22""6273.Y &28""6879.M &2:""6:7;.A &2<""6<7=.5 &2>""6>7?.) &2@""6@7A/#0*;+. &;-.} &2B""6B7C.q &2D""6D7E.e &22""6273.Y &28""6879.M &2:""6:7;.A &2<""6<7=.5 &2>""6>7?.) &2@""6@7A&&&#'),
    d("$;y0#*;y&"),
    d(`%3""5#7Ó/q#24""6475/b$$;!/&#0#*;!&&&#/L$2J""6J7K/=$$;!/&#0#*;!&&&#/'$8%:Ô% )(%'#($'#(#'#("'#&'#`),
    d('2Õ""6Õ7Ö'),
    d('2×""6×7Ø'),
    d('2Ù""6Ù7Ú'),
    d('2Û""6Û7Ü'),
    d('2Ý""6Ý7Þ'),
    d('2ß""6ß7à'),
    d('2á""6á7â'),
    d('2ã""6ã7ä'),
    d('2å""6å7æ'),
    d('2ç""6ç7è'),
    d('2é""6é7ê'),
    d("%;.Y &;.S &;.M &;.G &;.A &;.; &;.5 &;./ &;.) &;.# &;6/& 8!:ë! )"),
    d(`%;/G#;'/>$;/5$;'/,$;/#$+%)(%'#($'#(#'#("'#&'#`),
    d("%;/' 8!:ì!! )"),
    d(`%;!/5#;!/,$;!/#$+#)(#'#("'#&'#`),
    d("%$;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(0G*;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(&/& 8!:í! )"),
    d(`%;¶/Y#$%;A/,#;¶/#$+")("'#&'#06*%;A/,#;¶/#$+")("'#&'#&/#$+")("'#&'#`),
    d(`%;9/N#%2:""6:7;/,#;9/#$+")("'#&'#." &"/'$8":î" )("'#&'#`),
    d(`%;:.c &%;/Y#$%;A/,#;/#$+")("'#&'#06*%;A/,#;/#$+")("'#&'#&/#$+")("'#&'#/& 8!:ï! )`),
    d(`%;L.# &;/]#$%;B/,#;/#$+")("'#&'#06*%;B/,#;/#$+")("'#&'#&/'$8":ð" )("'#&'#`),
    d(`%;." &"/>#;@/5$;M/,$;?/#$+$)($'#(#'#("'#&'#`),
    d(`%%;6/Y#$%;./,#;6/#$+")("'#&'#06*%;./,#;6/#$+")("'#&'#&/#$+")("'#&'#.# &;H/' 8!:ñ!! )`),
    d(";.) &;.# &; "),
    d(`%3ò""5!7ó/:#;</1$;/($8#:ô#! )(#'#("'#&'#`),
    d(`%3õ""5'7ö/:#;</1$;/($8#:÷#! )(#'#("'#&'#`),
    d("%$;!/&#0#*;!&&&#/' 8!:ø!! )"),
    d(`%2ù""6ù7ú/o#%2J""6J7K/M#;!." &"/?$;!." &"/1$;!." &"/#$+$)($'#(#'#("'#&'#." &"/'$8":û" )("'#&'#`),
    d(`%;6/J#%;</,#;¡/#$+")("'#&'#." &"/)$8":ü""! )("'#&'#`),
    d(";6.) &;T.# &;H"),
    d(`%;£/Y#$%;B/,#;¤/#$+")("'#&'#06*%;B/,#;¤/#$+")("'#&'#&/#$+")("'#&'#`),
    d(`%3ý""5&7þ.G &3ÿ""5'7Ā.; &3ā""5$7Ă./ &3ă""5%7Ą.# &;6/& 8!:ą! )`),
    d(";¥.# &; "),
    d(`%3Ć""5(7ć/M#;</D$3Ĉ""5(7ĉ./ &3Ċ""5(7ċ.# &;6/#$+#)(#'#("'#&'#`),
    d(`%;6/Y#$%;A/,#;6/#$+")("'#&'#06*%;A/,#;6/#$+")("'#&'#&/#$+")("'#&'#`),
    d("%$;!/&#0#*;!&&&#/' 8!:Č!! )"),
    d("%;©/& 8!:č! )"),
    d(`%;ª/k#;;/b$;¯/Y$$%;B/,#;°/#$+")("'#&'#06*%;B/,#;°/#$+")("'#&'#&/#$+$)($'#(#'#("'#&'#`),
    d(";«.# &;¬"),
    d('3Ď""5$7ď.S &3Đ""5%7đ.G &3Ē""5%7ē.; &3Ĕ""5%7ĕ./ &3Ė""5+7ė.# &;­'),
    d(`3Ę""5'7ę./ &3Ě""5)7ě.# &;­`),
    d(";6.# &;®"),
    d(`%3Ĝ""5"7ĝ/,#;6/#$+")("'#&'#`),
    d(";­.# &;6"),
    d(`%;6/5#;</,$;±/#$+#)(#'#("'#&'#`),
    d(";6.# &;H"),
    d(`%;³/5#;./,$;/#$+#)(#'#("'#&'#`),
    d("%$;!/&#0#*;!&&&#/' 8!:Ğ!! )"),
    d("%;/' 8!:ğ!! )"),
    d(`%;¶/^#$%;B/,#; /#$+")("'#&'#06*%;B/,#; /#$+")("'#&'#&/($8":Ġ"!!)("'#&'#`),
    d(`%%;7/e#$%2J""6J7K/,#;7/#$+")("'#&'#0<*%2J""6J7K/,#;7/#$+")("'#&'#&/#$+")("'#&'#/"!&,)`),
    d(`%;L.# &;/]#$%;B/,#;¸/#$+")("'#&'#06*%;B/,#;¸/#$+")("'#&'#&/'$8":ġ" )("'#&'#`),
    d(";¹.# &; "),
    d(`%3Ģ""5#7ģ/:#;</1$;6/($8#:Ĥ#! )(#'#("'#&'#`),
    d("%$;!/&#0#*;!&&&#/' 8!:ĥ!! )"),
    d("%;/' 8!:Ħ!! )"),
    d(`%$;0#*;&/x#;@/o$;M/f$;?/]$$%;B/,#; /#$+")("'#&'#06*%;B/,#; /#$+")("'#&'#&/'$8%:ħ% )(%'#($'#(#'#("'#&'#`),
    d(";¾"),
    d(`%3Ĩ""5&7ĩ/k#;./b$;Á/Y$$%;A/,#;Á/#$+")("'#&'#06*%;A/,#;Á/#$+")("'#&'#&/#$+$)($'#(#'#("'#&'#.# &;¿`),
    d(`%;6/k#;./b$;À/Y$$%;A/,#;À/#$+")("'#&'#06*%;A/,#;À/#$+")("'#&'#&/#$+$)($'#(#'#("'#&'#`),
    d(`%;6/;#;</2$;6.# &;H/#$+#)(#'#("'#&'#`),
    d(";Â.G &;Ä.A &;Æ.; &;È.5 &;É./ &;Ê.) &;Ë.# &;À"),
    d(`%3Ī""5%7ī/5#;</,$;Ã/#$+#)(#'#("'#&'#`),
    d("%;I/' 8!:Ĭ!! )"),
    d(`%3ĭ""5&7Į/#;</$;D/$;Å/|$$%$;'/&#0#*;'&&&#/,#;Å/#$+")("'#&'#0C*%$;'/&#0#*;'&&&#/,#;Å/#$+")("'#&'#&/,$;E/#$+&)(&'#(%'#($'#(#'#("'#&'#`),
    d(";t.# &;w"),
    d(`%3į""5%7İ/5#;</,$;Ç/#$+#)(#'#("'#&'#`),
    d("%;I/' 8!:ı!! )"),
    d(`%3Ĳ""5&7ĳ/:#;</1$;I/($8#:Ĵ#! )(#'#("'#&'#`),
    d(`%3ĵ""5%7Ķ/]#;</T$%3ķ""5$7ĸ/& 8!:Ĺ! ).4 &%3ĺ""5%7Ļ/& 8!:ļ! )/#$+#)(#'#("'#&'#`),
    d(`%3Ľ""5)7ľ/R#;</I$3Ŀ""5#7ŀ./ &3Ł""5(7ł.# &;6/($8#:Ń#! )(#'#("'#&'#`),
    d(`%3ń""5#7Ņ/#;</$;D/$%;Ì/e#$%2D""6D7E/,#;Ì/#$+")("'#&'#0<*%2D""6D7E/,#;Ì/#$+")("'#&'#&/#$+")("'#&'#/,$;E/#$+%)(%'#($'#(#'#("'#&'#`),
    d(`%3ņ""5(7Ň./ &3ň""5$7ŉ.# &;6/' 8!:Ŋ!! )`),
    d(`%;6/Y#$%;A/,#;6/#$+")("'#&'#06*%;A/,#;6/#$+")("'#&'#&/#$+")("'#&'#`),
    d(`%;Ï/G#;./>$;Ï/5$;./,$;/#$+%)(%'#($'#(#'#("'#&'#`),
    d("%$;!/&#0#*;!&&&#/' 8!:ŋ!! )"),
    d(`%;Ñ/]#$%;A/,#;Ñ/#$+")("'#&'#06*%;A/,#;Ñ/#$+")("'#&'#&/'$8":Ō" )("'#&'#`),
    d(`%;/]#$%;B/,#; /#$+")("'#&'#06*%;B/,#; /#$+")("'#&'#&/'$8":ō" )("'#&'#`),
    d(`%;L.O &;.I &%;@." &"/:#;t/1$;?." &"/#$+#)(#'#("'#&'#/]#$%;B/,#; /#$+")("'#&'#06*%;B/,#; /#$+")("'#&'#&/'$8":Ŏ" )("'#&'#`),
    d(`%;Ô/]#$%;B/,#;Õ/#$+")("'#&'#06*%;B/,#;Õ/#$+")("'#&'#&/'$8":ŏ" )("'#&'#`),
    d("%;/& 8!:Ő! )"),
    d(`%3ő""5(7Œ/:#;</1$;6/($8#:œ#! )(#'#("'#&'#.g &%3Ŕ""5&7ŕ/:#;</1$;6/($8#:Ŗ#! )(#'#("'#&'#.: &%3ŗ""5*7Ř/& 8!:ř! ).# &; `),
    d(`%%;6/k#$%;A/2#;6/)$8":Ś""$ )("'#&'#0<*%;A/2#;6/)$8":Ś""$ )("'#&'#&/)$8":ś""! )("'#&'#." &"/' 8!:Ŝ!! )`),
    d(`%;Ø/Y#$%;A/,#;Ø/#$+")("'#&'#06*%;A/,#;Ø/#$+")("'#&'#&/#$+")("'#&'#`),
    d(`%;/Y#$%;B/,#; /#$+")("'#&'#06*%;B/,#; /#$+")("'#&'#&/#$+")("'#&'#`),
    d("%$;!/&#0#*;!&&&#/' 8!:ŝ!! )"),
    d(`%;Û/Y#$%;B/,#;Ü/#$+")("'#&'#06*%;B/,#;Ü/#$+")("'#&'#&/#$+")("'#&'#`),
    d(`%3Ş""5&7ş.; &3Š""5'7š./ &3Ţ""5*7ţ.# &;6/& 8!:Ť! )`),
    d(`%3ť""5&7Ŧ/:#;</1$;Ý/($8#:ŧ#! )(#'#("'#&'#.} &%3õ""5'7ö/:#;</1$;/($8#:Ũ#! )(#'#("'#&'#.P &%3ũ""5+7Ū/:#;</1$;/($8#:ū#! )(#'#("'#&'#.# &; `),
    d(`3Ŭ""5+7ŭ.k &3Ů""5)7ů._ &3Ű""5(7ű.S &3Ų""5'7ų.G &3Ŵ""5&7ŵ.; &3Ŷ""5*7ŷ./ &3Ÿ""5)7Ź.# &;6`),
    d(';1." &"'),
    d(`%%;6/k#$%;A/2#;6/)$8":Ś""$ )("'#&'#0<*%;A/2#;6/)$8":Ś""$ )("'#&'#&/)$8":ś""! )("'#&'#." &"/' 8!:ź!! )`),
    d(`%;L.# &;/]#$%;B/,#;á/#$+")("'#&'#06*%;B/,#;á/#$+")("'#&'#&/'$8":Ż" )("'#&'#`),
    d(";¹.# &; "),
    d(`%;ã/Y#$%;A/,#;ã/#$+")("'#&'#06*%;A/,#;ã/#$+")("'#&'#&/#$+")("'#&'#`),
    d(`%;ê/k#;./b$;í/Y$$%;B/,#;ä/#$+")("'#&'#06*%;B/,#;ä/#$+")("'#&'#&/#$+$)($'#(#'#("'#&'#`),
    d(";å.; &;æ.5 &;ç./ &;è.) &;é.# &; "),
    d(`%3ż""5#7Ž/:#;</1$;ð/($8#:ž#! )(#'#("'#&'#`),
    d(`%3ſ""5%7ƀ/:#;</1$;T/($8#:Ɓ#! )(#'#("'#&'#`),
    d(`%3Ƃ""5(7ƃ/F#;</=$;\\.) &;Y.# &;X/($8#:Ƅ#! )(#'#("'#&'#`),
    d(`%3ƅ""5&7Ɔ/:#;</1$;6/($8#:Ƈ#! )(#'#("'#&'#`),
    d(`%3ƈ""5%7Ɖ/A#;</8$$;!0#*;!&/($8#:Ɗ#! )(#'#("'#&'#`),
    d(`%;ë/G#;;/>$;6/5$;;/,$;ì/#$+%)(%'#($'#(#'#("'#&'#`),
    d(`%3""5#7Ó.# &;6/' 8!:Ƌ!! )`),
    d(`%3±""5#7ƌ.G &3³""5#7ƍ.; &3·""5#7Ǝ./ &3µ""5$7Ə.# &;6/' 8!:Ɛ!! )`),
    d(`%;î/D#%;C/,#;ï/#$+")("'#&'#." &"/#$+")("'#&'#`),
    d("%;U.) &;\\.# &;X/& 8!:Ƒ! )"),
    d(`%%;!." &"/[#;!." &"/M$;!." &"/?$;!." &"/1$;!." &"/#$+%)(%'#($'#(#'#("'#&'#/' 8!:ƒ!! )`),
    d(`%%;!/?#;!." &"/1$;!." &"/#$+#)(#'#("'#&'#/' 8!:Ɠ!! )`),
    d(";¾"),
    d(`%;/^#$%;B/,#;ó/#$+")("'#&'#06*%;B/,#;ó/#$+")("'#&'#&/($8":Ɣ"!!)("'#&'#`),
    d(";ô.# &; "),
    d(`%2ƕ""6ƕ7Ɩ/L#;</C$2Ɨ""6Ɨ7Ƙ.) &2ƙ""6ƙ7ƚ/($8#:ƛ#! )(#'#("'#&'#`),
    d(`%;/^#$%;B/,#; /#$+")("'#&'#06*%;B/,#; /#$+")("'#&'#&/($8":Ɯ"!!)("'#&'#`),
    d(`%;6/5#;0/,$;÷/#$+#)(#'#("'#&'#`),
    d("$;2.) &;4.# &;.0/*;2.) &;4.# &;.&"),
    d("$;%0#*;%&"),
    d(`%;ú/;#28""6879/,$;û/#$+#)(#'#("'#&'#`),
    d(`%3Ɲ""5%7ƞ.) &3Ɵ""5$7Ơ/' 8!:ơ!! )`),
    d(`%;ü/J#%28""6879/,#;^/#$+")("'#&'#." &"/#$+")("'#&'#`),
    d("%;\\.) &;X.# &;/' 8!:Ƣ!! )"),
    d(';".S &;!.M &2F""6F7G.A &2J""6J7K.5 &2H""6H7I.) &2N""6N7O'),
    d('2L""6L7M. &2B""6B7C. &2<""6<7=.} &2R""6R7S.q &2T""6T7U.e &2V""6V7W.Y &2P""6P7Q.M &2@""6@7A.A &2D""6D7E.5 &22""6273.) &2>""6>7?'),
    d(`%;Ā/b#28""6879/S$;û/J$%2ƣ""6ƣ7Ƥ/,#;ì/#$+")("'#&'#." &"/#$+$)($'#(#'#("'#&'#`),
    d(`%3ƥ""5%7Ʀ.) &3Ƨ""5$7ƨ/' 8!:ơ!! )`),
    d(`%3±""5#7².6 &3³""5#7´.* &$;+0#*;+&/' 8!:Ʃ!! )`),
    d(`%;Ą/#2F""6F7G/x$;ă/o$2F""6F7G/\`$;ă/W$2F""6F7G/H$;ă/?$2F""6F7G/0$;ą/'$8):ƪ) )()'#(('#(''#(&'#(%'#($'#(#'#("'#&'#`),
    d(`%;#/>#;#/5$;#/,$;#/#$+$)($'#(#'#("'#&'#`),
    d(`%;ă/,#;ă/#$+")("'#&'#`),
    d(`%;ă/5#;ă/,$;ă/#$+#)(#'#("'#&'#`),
    d(`%;q/T#$;m0#*;m&/D$%; /,#;ø/#$+")("'#&'#." &"/#$+#)(#'#("'#&'#`),
    d(`%2ƫ""6ƫ7Ƭ.) &2ƭ""6ƭ7Ʈ/w#;0/n$;Ĉ/e$$%;B/2#;ĉ.# &; /#$+")("'#&'#0<*%;B/2#;ĉ.# &; /#$+")("'#&'#&/#$+$)($'#(#'#("'#&'#`),
    d(";.# &;L"),
    d(`%2Ư""6Ư7ư/5#;</,$;Ċ/#$+#)(#'#("'#&'#`),
    d(`%;D/S#;,/J$2:""6:7;/;$;,.# &;T/,$;E/#$+%)(%'#($'#(#'#("'#&'#`)
  ];
  let c = 0, l = 0;
  const h = [{ line: 1, column: 1 }];
  let f = 0, x = [], O = 0, W;
  if (e.startRule !== void 0) {
    if (!(e.startRule in i))
      throw new Error(`Can't start parsing from rule "` + e.startRule + '".');
    n = i[e.startRule];
  }
  function M() {
    return t.substring(l, c);
  }
  function le() {
    return Ge(l, c);
  }
  function m(p, v) {
    return { type: "literal", text: p, ignoreCase: v };
  }
  function V(p, v, w) {
    return { type: "class", parts: p, inverted: v, ignoreCase: w };
  }
  function ye() {
    return { type: "end" };
  }
  function K(p) {
    let v = h[p], w;
    if (v)
      return v;
    for (w = p - 1; !h[w]; )
      w--;
    for (v = h[w], v = {
      line: v.line,
      column: v.column
    }; w < p; )
      t.charCodeAt(w) === 10 ? (v.line++, v.column = 1) : v.column++, w++;
    return h[p] = v, v;
  }
  function Ge(p, v) {
    const w = K(p), Re = K(v);
    return {
      source: s,
      start: {
        offset: p,
        line: w.line,
        column: w.column
      },
      end: {
        offset: v,
        line: Re.line,
        column: Re.column
      }
    };
  }
  function jt(p) {
    c < f || (c > f && (f = c, x = []), x.push(p));
  }
  function mr(p, v, w) {
    return new Rr(Rr.buildMessage(p, v), p, v, w);
  }
  function d(p) {
    return p.split("").map((v) => v.charCodeAt(0) - 32);
  }
  function wr(p) {
    const v = o[p];
    let w = 0;
    const Re = [];
    let ne = v.length;
    const de = [], F = [];
    let se;
    for (; ; ) {
      for (; w < ne; )
        switch (v[w]) {
          case 0:
            F.push(a[v[w + 1]]), w += 2;
            break;
          case 1:
            F.push(void 0), w++;
            break;
          case 2:
            F.push(null), w++;
            break;
          case 3:
            F.push(r), w++;
            break;
          case 4:
            F.push([]), w++;
            break;
          case 5:
            F.push(c), w++;
            break;
          case 6:
            F.pop(), w++;
            break;
          case 7:
            c = F.pop(), w++;
            break;
          case 8:
            F.length -= v[w + 1], w += 2;
            break;
          case 9:
            F.splice(-2, 1), w++;
            break;
          case 10:
            F[F.length - 2].push(F.pop()), w++;
            break;
          case 11:
            F.push(F.splice(F.length - v[w + 1], v[w + 1])), w += 2;
            break;
          case 12:
            F.push(t.substring(F.pop(), c)), w++;
            break;
          case 13:
            de.push(ne), Re.push(w + 3 + v[w + 1] + v[w + 2]), F[F.length - 1] ? (ne = w + 3 + v[w + 1], w += 3) : (ne = w + 3 + v[w + 1] + v[w + 2], w += 3 + v[w + 1]);
            break;
          case 14:
            de.push(ne), Re.push(w + 3 + v[w + 1] + v[w + 2]), F[F.length - 1] === r ? (ne = w + 3 + v[w + 1], w += 3) : (ne = w + 3 + v[w + 1] + v[w + 2], w += 3 + v[w + 1]);
            break;
          case 15:
            de.push(ne), Re.push(w + 3 + v[w + 1] + v[w + 2]), F[F.length - 1] !== r ? (ne = w + 3 + v[w + 1], w += 3) : (ne = w + 3 + v[w + 1] + v[w + 2], w += 3 + v[w + 1]);
            break;
          case 16:
            F[F.length - 1] !== r ? (de.push(ne), Re.push(w), ne = w + 2 + v[w + 1], w += 2) : w += 2 + v[w + 1];
            break;
          case 17:
            de.push(ne), Re.push(w + 3 + v[w + 1] + v[w + 2]), t.length > c ? (ne = w + 3 + v[w + 1], w += 3) : (ne = w + 3 + v[w + 1] + v[w + 2], w += 3 + v[w + 1]);
            break;
          case 18:
            de.push(ne), Re.push(w + 4 + v[w + 2] + v[w + 3]), t.substr(c, a[v[w + 1]].length) === a[v[w + 1]] ? (ne = w + 4 + v[w + 2], w += 4) : (ne = w + 4 + v[w + 2] + v[w + 3], w += 4 + v[w + 2]);
            break;
          case 19:
            de.push(ne), Re.push(w + 4 + v[w + 2] + v[w + 3]), t.substr(c, a[v[w + 1]].length).toLowerCase() === a[v[w + 1]] ? (ne = w + 4 + v[w + 2], w += 4) : (ne = w + 4 + v[w + 2] + v[w + 3], w += 4 + v[w + 2]);
            break;
          case 20:
            de.push(ne), Re.push(w + 4 + v[w + 2] + v[w + 3]), a[v[w + 1]].test(t.charAt(c)) ? (ne = w + 4 + v[w + 2], w += 4) : (ne = w + 4 + v[w + 2] + v[w + 3], w += 4 + v[w + 2]);
            break;
          case 21:
            F.push(t.substr(c, v[w + 1])), c += v[w + 1], w += 2;
            break;
          case 22:
            F.push(a[v[w + 1]]), c += a[v[w + 1]].length, w += 2;
            break;
          case 23:
            F.push(r), O === 0 && jt(a[v[w + 1]]), w += 2;
            break;
          case 24:
            l = F[F.length - 1 - v[w + 1]], w += 2;
            break;
          case 25:
            l = c, w++;
            break;
          case 26:
            se = v.slice(w + 4, w + 4 + v[w + 3]).map(function(Dt) {
              return F[F.length - 1 - Dt];
            }), F.splice(F.length - v[w + 2], v[w + 2], a[v[w + 1]].apply(null, se)), w += 4 + v[w + 3];
            break;
          case 27:
            F.push(wr(v[w + 1])), w += 2;
            break;
          case 28:
            O++, w++;
            break;
          case 29:
            O--, w++;
            break;
          default:
            throw new Error("Invalid opcode: " + v[w] + ".");
        }
      if (de.length > 0)
        ne = de.pop(), w = Re.pop();
      else
        break;
    }
    return F[0];
  }
  e.data = {};
  function St(p, v) {
    return [p].concat(v);
  }
  if (W = wr(n), W !== r && c === t.length)
    return W;
  throw W !== r && c < t.length && jt(ye()), mr(x, f < t.length ? t.charAt(f) : null, f < t.length ? Ge(f, f + 1) : Ge(f, f));
}
const Ch = Dh;
var _e;
(function(t) {
  function e(i, n) {
    const a = { startRule: n };
    try {
      Ch(i, a);
    } catch {
      a.data = -1;
    }
    return a.data;
  }
  t.parse = e;
  function r(i) {
    const n = t.parse(i, "Name_Addr_Header");
    return n !== -1 ? n : void 0;
  }
  t.nameAddrHeaderParse = r;
  function s(i) {
    const n = t.parse(i, "SIP_URI");
    return n !== -1 ? n : void 0;
  }
  t.URIParse = s;
})(_e = _e || (_e = {}));
const Ih = {
  100: "Trying",
  180: "Ringing",
  181: "Call Is Being Forwarded",
  182: "Queued",
  183: "Session Progress",
  199: "Early Dialog Terminated",
  200: "OK",
  202: "Accepted",
  204: "No Notification",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Moved Temporarily",
  305: "Use Proxy",
  380: "Alternative Service",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  410: "Gone",
  412: "Conditional Request Failed",
  413: "Request Entity Too Large",
  414: "Request-URI Too Long",
  415: "Unsupported Media Type",
  416: "Unsupported URI Scheme",
  417: "Unknown Resource-Priority",
  420: "Bad Extension",
  421: "Extension Required",
  422: "Session Interval Too Small",
  423: "Interval Too Brief",
  428: "Use Identity Header",
  429: "Provide Referrer Identity",
  430: "Flow Failed",
  433: "Anonymity Disallowed",
  436: "Bad Identity-Info",
  437: "Unsupported Certificate",
  438: "Invalid Identity Header",
  439: "First Hop Lacks Outbound Support",
  440: "Max-Breadth Exceeded",
  469: "Bad Info Package",
  470: "Consent Needed",
  478: "Unresolvable Destination",
  480: "Temporarily Unavailable",
  481: "Call/Transaction Does Not Exist",
  482: "Loop Detected",
  483: "Too Many Hops",
  484: "Address Incomplete",
  485: "Ambiguous",
  486: "Busy Here",
  487: "Request Terminated",
  488: "Not Acceptable Here",
  489: "Bad Event",
  491: "Request Pending",
  493: "Undecipherable",
  494: "Security Agreement Required",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Server Time-out",
  505: "Version Not Supported",
  513: "Message Too Large",
  580: "Precondition Failure",
  600: "Busy Everywhere",
  603: "Decline",
  604: "Does Not Exist Anywhere",
  606: "Not Acceptable"
};
function cr(t, e = 32) {
  let r = "";
  for (let s = 0; s < t; s++) {
    const i = Math.floor(Math.random() * e);
    r += i.toString(e);
  }
  return r;
}
function oi(t) {
  return Ih[t] || "";
}
function ci() {
  return cr(10);
}
function pt(t) {
  const e = {
    "Call-Id": "Call-ID",
    Cseq: "CSeq",
    "Min-Se": "Min-SE",
    Rack: "RAck",
    Rseq: "RSeq",
    "Www-Authenticate": "WWW-Authenticate"
  }, r = t.toLowerCase().replace(/_/g, "-").split("-"), s = r.length;
  let i = "";
  for (let n = 0; n < s; n++)
    n !== 0 && (i += "-"), i += r[n].charAt(0).toUpperCase() + r[n].substring(1);
  return e[i] && (i = e[i]), i;
}
function ls(t) {
  return encodeURIComponent(t).replace(/%[A-F\d]{2}/g, "U").length;
}
class No {
  constructor() {
    this.headers = {};
  }
  /**
   * Insert a header of the given name and value into the last position of the
   * header array.
   * @param name - header name
   * @param value - header value
   */
  addHeader(e, r) {
    const s = { raw: r };
    e = pt(e), this.headers[e] ? this.headers[e].push(s) : this.headers[e] = [s];
  }
  /**
   * Get the value of the given header name at the given position.
   * @param name - header name
   * @returns Returns the specified header, undefined if header doesn't exist.
   */
  getHeader(e) {
    const r = this.headers[pt(e)];
    if (r) {
      if (r[0])
        return r[0].raw;
    } else
      return;
  }
  /**
   * Get the header/s of the given name.
   * @param name - header name
   * @returns Array - with all the headers of the specified name.
   */
  getHeaders(e) {
    const r = this.headers[pt(e)], s = [];
    if (!r)
      return [];
    for (const i of r)
      s.push(i.raw);
    return s;
  }
  /**
   * Verify the existence of the given header.
   * @param name - header name
   * @returns true if header with given name exists, false otherwise
   */
  hasHeader(e) {
    return !!this.headers[pt(e)];
  }
  /**
   * Parse the given header on the given index.
   * @param name - header name
   * @param idx - header index
   * @returns Parsed header object, undefined if the
   *   header is not present or in case of a parsing error.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseHeader(e, r = 0) {
    if (e = pt(e), this.headers[e]) {
      if (r >= this.headers[e].length)
        return;
    } else
      return;
    const s = this.headers[e][r], i = s.raw;
    if (s.parsed)
      return s.parsed;
    const n = _e.parse(i, e.replace(/-/g, "_"));
    if (n === -1) {
      this.headers[e].splice(r, 1);
      return;
    } else
      return s.parsed = n, n;
  }
  /**
   * Message Header attribute selector. Alias of parseHeader.
   * @param name - header name
   * @param idx - header index
   * @returns Parsed header object, undefined if the
   *   header is not present or in case of a parsing error.
   *
   * @example
   * message.s('via',3).port
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  s(e, r = 0) {
    return this.parseHeader(e, r);
  }
  /**
   * Replace the value of the given header by the value.
   * @param name - header name
   * @param value - header value
   */
  setHeader(e, r) {
    this.headers[pt(e)] = [{ raw: r }];
  }
  toString() {
    return this.data;
  }
}
class $r extends No {
  constructor() {
    super();
  }
}
class tr extends No {
  constructor() {
    super();
  }
}
class ur {
  constructor(e, r, s, i, n, a, o) {
    this.headers = {}, this.extraHeaders = [], this.options = ur.getDefaultOptions(), n && (this.options = Object.assign(Object.assign({}, this.options), n), this.options.optionTags && this.options.optionTags.length && (this.options.optionTags = this.options.optionTags.slice()), this.options.routeSet && this.options.routeSet.length && (this.options.routeSet = this.options.routeSet.slice())), a && a.length && (this.extraHeaders = a.slice()), o && (this.body = {
      body: o.content,
      contentType: o.contentType
    }), this.method = e, this.ruri = r.clone(), this.fromURI = s.clone(), this.fromTag = this.options.fromTag ? this.options.fromTag : ci(), this.from = ur.makeNameAddrHeader(this.fromURI, this.options.fromDisplayName, this.fromTag), this.toURI = i.clone(), this.toTag = this.options.toTag, this.to = ur.makeNameAddrHeader(this.toURI, this.options.toDisplayName, this.toTag), this.callId = this.options.callId ? this.options.callId : this.options.callIdPrefix + cr(15), this.cseq = this.options.cseq, this.setHeader("route", this.options.routeSet), this.setHeader("via", ""), this.setHeader("to", this.to.toString()), this.setHeader("from", this.from.toString()), this.setHeader("cseq", this.cseq + " " + this.method), this.setHeader("call-id", this.callId), this.setHeader("max-forwards", "70");
  }
  /** Get a copy of the default options. */
  static getDefaultOptions() {
    return {
      callId: "",
      callIdPrefix: "",
      cseq: 1,
      toDisplayName: "",
      toTag: "",
      fromDisplayName: "",
      fromTag: "",
      forceRport: !1,
      hackViaTcp: !1,
      optionTags: ["outbound"],
      routeSet: [],
      userAgentString: "sip.js",
      viaHost: ""
    };
  }
  static makeNameAddrHeader(e, r, s) {
    const i = {};
    return s && (i.tag = s), new qe(e, r, i);
  }
  /**
   * Get the value of the given header name at the given position.
   * @param name - header name
   * @returns Returns the specified header, undefined if header doesn't exist.
   */
  getHeader(e) {
    const r = this.headers[pt(e)];
    if (r) {
      if (r[0])
        return r[0];
    } else {
      const s = new RegExp("^\\s*" + e + "\\s*:", "i");
      for (const i of this.extraHeaders)
        if (s.test(i))
          return i.substring(i.indexOf(":") + 1).trim();
    }
  }
  /**
   * Get the header/s of the given name.
   * @param name - header name
   * @returns Array with all the headers of the specified name.
   */
  getHeaders(e) {
    const r = [], s = this.headers[pt(e)];
    if (s)
      for (const i of s)
        r.push(i);
    else {
      const i = new RegExp("^\\s*" + e + "\\s*:", "i");
      for (const n of this.extraHeaders)
        i.test(n) && r.push(n.substring(n.indexOf(":") + 1).trim());
    }
    return r;
  }
  /**
   * Verify the existence of the given header.
   * @param name - header name
   * @returns true if header with given name exists, false otherwise
   */
  hasHeader(e) {
    if (this.headers[pt(e)])
      return !0;
    {
      const r = new RegExp("^\\s*" + e + "\\s*:", "i");
      for (const s of this.extraHeaders)
        if (r.test(s))
          return !0;
    }
    return !1;
  }
  /**
   * Replace the the given header by the given value.
   * @param name - header name
   * @param value - header value
   */
  setHeader(e, r) {
    this.headers[pt(e)] = r instanceof Array ? r : [r];
  }
  /**
   * The Via header field indicates the transport used for the transaction
   * and identifies the location where the response is to be sent.  A Via
   * header field value is added only after the transport that will be
   * used to reach the next hop has been selected (which may involve the
   * usage of the procedures in [4]).
   *
   * When the UAC creates a request, it MUST insert a Via into that
   * request.  The protocol name and protocol version in the header field
   * MUST be SIP and 2.0, respectively.  The Via header field value MUST
   * contain a branch parameter.  This parameter is used to identify the
   * transaction created by that request.  This parameter is used by both
   * the client and the server.
   * https://tools.ietf.org/html/rfc3261#section-8.1.1.7
   * @param branchParameter - The branch parameter.
   * @param transport - The sent protocol transport.
   */
  setViaHeader(e, r) {
    this.options.hackViaTcp && (r = "TCP");
    let s = "SIP/2.0/" + r;
    s += " " + this.options.viaHost + ";branch=" + e, this.options.forceRport && (s += ";rport"), this.setHeader("via", s), this.branch = e;
  }
  toString() {
    let e = "";
    e += this.method + " " + this.ruri.toRaw() + ` SIP/2.0\r
`;
    for (const r in this.headers)
      if (this.headers[r])
        for (const s of this.headers[r])
          e += r + ": " + s + `\r
`;
    for (const r of this.extraHeaders)
      e += r.trim() + `\r
`;
    return e += "Supported: " + this.options.optionTags.join(", ") + `\r
`, e += "User-Agent: " + this.options.userAgentString + `\r
`, this.body ? typeof this.body == "string" ? (e += "Content-Length: " + ls(this.body) + `\r
\r
`, e += this.body) : this.body.body && this.body.contentType ? (e += "Content-Type: " + this.body.contentType + `\r
`, e += "Content-Length: " + ls(this.body.body) + `\r
\r
`, e += this.body.body) : e += `Content-Length: 0\r
\r
` : e += `Content-Length: 0\r
\r
`, e;
  }
}
function qo(t) {
  return t === "application/sdp" ? "session" : "render";
}
function js(t) {
  const e = typeof t == "string" ? t : t.body, r = typeof t == "string" ? "application/sdp" : t.contentType;
  return { contentDisposition: qo(r), contentType: r, content: e };
}
function Uo(t) {
  return t && typeof t.content == "string" && typeof t.contentType == "string" && t.contentDisposition === void 0 ? !0 : typeof t.contentDisposition == "string";
}
function Qr(t) {
  let e, r, s;
  if (t instanceof $r && t.body) {
    const i = t.parseHeader("Content-Disposition");
    e = i ? i.type : void 0, r = t.parseHeader("Content-Type"), s = t.body;
  }
  if (t instanceof tr && t.body) {
    const i = t.parseHeader("Content-Disposition");
    e = i ? i.type : void 0, r = t.parseHeader("Content-Type"), s = t.body;
  }
  if (t instanceof ur && t.body)
    if (e = t.getHeader("Content-Disposition"), r = t.getHeader("Content-Type"), typeof t.body == "string") {
      if (!r)
        throw new Error("Header content type header does not equal body content type.");
      s = t.body;
    } else {
      if (r && r !== t.body.contentType)
        throw new Error("Header content type header does not equal body content type.");
      r = t.body.contentType, s = t.body.body;
    }
  if (Uo(t) && (e = t.contentDisposition, r = t.contentType, s = t.content), !!s) {
    if (r && !e && (e = qo(r)), !e)
      throw new Error("Content disposition undefined.");
    if (!r)
      throw new Error("Content type undefined.");
    return {
      contentDisposition: e,
      contentType: r,
      content: s
    };
  }
}
var Ze;
(function(t) {
  t.Initial = "Initial", t.Early = "Early", t.AckWait = "AckWait", t.Confirmed = "Confirmed", t.Terminated = "Terminated";
})(Ze = Ze || (Ze = {}));
var $;
(function(t) {
  t.Initial = "Initial", t.HaveLocalOffer = "HaveLocalOffer", t.HaveRemoteOffer = "HaveRemoteOffer", t.Stable = "Stable", t.Closed = "Closed";
})($ = $ || ($ = {}));
const It = 500, Rh = 4e3, Oi = 5e3, Se = {
  T1: It,
  T2: Rh,
  T4: Oi,
  TIMER_B: 64 * It,
  TIMER_D: 0 * It,
  TIMER_F: 64 * It,
  TIMER_H: 64 * It,
  TIMER_I: 0 * Oi,
  TIMER_J: 0 * It,
  TIMER_K: 0 * Oi,
  TIMER_L: 64 * It,
  TIMER_M: 64 * It,
  TIMER_N: 64 * It,
  PROVISIONAL_RESPONSE_INTERVAL: 6e4
  // See RFC 3261 Section 13.3.1.1
};
class Vt extends gr {
  constructor(e) {
    super(e || "Transaction state error.");
  }
}
var P;
(function(t) {
  t.ACK = "ACK", t.BYE = "BYE", t.CANCEL = "CANCEL", t.INFO = "INFO", t.INVITE = "INVITE", t.MESSAGE = "MESSAGE", t.NOTIFY = "NOTIFY", t.OPTIONS = "OPTIONS", t.REGISTER = "REGISTER", t.UPDATE = "UPDATE", t.SUBSCRIBE = "SUBSCRIBE", t.PUBLISH = "PUBLISH", t.REFER = "REFER", t.PRACK = "PRACK";
})(P = P || (P = {}));
const Gt = [
  P.ACK,
  P.BYE,
  P.CANCEL,
  P.INFO,
  P.INVITE,
  P.MESSAGE,
  P.NOTIFY,
  P.OPTIONS,
  P.PRACK,
  P.REFER,
  P.REGISTER,
  P.SUBSCRIBE
];
class Lo {
  /** @internal */
  constructor(e) {
    this.incomingMessageRequest = e;
  }
  /** Incoming MESSAGE request message. */
  get request() {
    return this.incomingMessageRequest.message;
  }
  /** Accept the request. */
  accept(e) {
    return this.incomingMessageRequest.accept(e), Promise.resolve();
  }
  /** Reject the request. */
  reject(e) {
    return this.incomingMessageRequest.reject(e), Promise.resolve();
  }
}
class sn {
  /** @internal */
  constructor(e) {
    this.incomingNotifyRequest = e;
  }
  /** Incoming NOTIFY request message. */
  get request() {
    return this.incomingNotifyRequest.message;
  }
  /** Accept the request. */
  accept(e) {
    return this.incomingNotifyRequest.accept(e), Promise.resolve();
  }
  /** Reject the request. */
  reject(e) {
    return this.incomingNotifyRequest.reject(e), Promise.resolve();
  }
}
class $h {
  /** @internal */
  constructor(e, r) {
    this.incomingReferRequest = e, this.session = r;
  }
  get referTo() {
    const e = this.incomingReferRequest.message.parseHeader("refer-to");
    if (!(e instanceof qe))
      throw new Error("Failed to parse Refer-To header.");
    return e;
  }
  get referredBy() {
    return this.incomingReferRequest.message.getHeader("referred-by");
  }
  get replaces() {
    const e = this.referTo.uri.getHeader("replaces");
    return e instanceof Array ? e[0] : e;
  }
  /** Incoming REFER request message. */
  get request() {
    return this.incomingReferRequest.message;
  }
  /** Accept the request. */
  accept(e = { statusCode: 202 }) {
    return this.incomingReferRequest.accept(e), Promise.resolve();
  }
  /** Reject the request. */
  reject(e) {
    return this.incomingReferRequest.reject(e), Promise.resolve();
  }
  /**
   * Creates an inviter which may be used to send an out of dialog INVITE request.
   *
   * @remarks
   * This a helper method to create an Inviter which will execute the referral
   * of the `Session` which was referred. The appropriate headers are set and
   * the referred `Session` is linked to the new `Session`. Note that only a
   * single instance of the `Inviter` will be created and returned (if called
   * more than once a reference to the same `Inviter` will be returned every time).
   *
   * @param options - Options bucket.
   * @param modifiers - Session description handler modifiers.
   */
  makeInviter(e) {
    if (this.inviter)
      return this.inviter;
    const r = this.referTo.uri.clone();
    r.clearHeaders(), e = e || {};
    const s = (e.extraHeaders || []).slice(), i = this.replaces;
    i && s.push("Replaces: " + decodeURIComponent(i));
    const n = this.referredBy;
    return n && s.push("Referred-By: " + n), e.extraHeaders = s, this.inviter = this.session.userAgent._makeInviter(r, e), this.inviter._referred = this.session, this.session._referral = this.inviter, this.inviter;
  }
}
var _;
(function(t) {
  t.Initial = "Initial", t.Establishing = "Establishing", t.Established = "Established", t.Terminating = "Terminating", t.Terminated = "Terminated";
})(_ = _ || (_ = {}));
class ds {
  /**
   * Constructor.
   * @param userAgent - User agent. See {@link UserAgent} for details.
   * @internal
   */
  constructor(e, r = {}) {
    this.pendingReinvite = !1, this.pendingReinviteAck = !1, this._state = _.Initial, this.delegate = r.delegate, this._stateEventEmitter = new cs(), this._userAgent = e;
  }
  /**
   * Destructor.
   */
  dispose() {
    switch (this.logger.log(`Session ${this.id} in state ${this._state} is being disposed`), delete this.userAgent._sessions[this.id], this._sessionDescriptionHandler && this._sessionDescriptionHandler.close(), this.state) {
      case _.Initial:
        break;
      case _.Establishing:
        break;
      case _.Established:
        return new Promise((e) => {
          this._bye({
            // wait for the response to the BYE before resolving
            onAccept: () => e(),
            onRedirect: () => e(),
            onReject: () => e()
          });
        });
      case _.Terminating:
        break;
      case _.Terminated:
        break;
      default:
        throw new Error("Unknown state.");
    }
    return Promise.resolve();
  }
  /**
   * The asserted identity of the remote user.
   */
  get assertedIdentity() {
    return this._assertedIdentity;
  }
  /**
   * The confirmed session dialog.
   */
  get dialog() {
    return this._dialog;
  }
  /**
   * A unique identifier for this session.
   */
  get id() {
    return this._id;
  }
  /**
   * The session being replace by this one.
   */
  get replacee() {
    return this._replacee;
  }
  /**
   * Session description handler.
   * @remarks
   * If `this` is an instance of `Invitation`,
   * `sessionDescriptionHandler` will be defined when the session state changes to "established".
   * If `this` is an instance of `Inviter` and an offer was sent in the INVITE,
   * `sessionDescriptionHandler` will be defined when the session state changes to "establishing".
   * If `this` is an instance of `Inviter` and an offer was not sent in the INVITE,
   * `sessionDescriptionHandler` will be defined when the session state changes to "established".
   * Otherwise `undefined`.
   */
  get sessionDescriptionHandler() {
    return this._sessionDescriptionHandler;
  }
  /**
   * Session description handler factory.
   */
  get sessionDescriptionHandlerFactory() {
    return this.userAgent.configuration.sessionDescriptionHandlerFactory;
  }
  /**
   * SDH modifiers for the initial INVITE transaction.
   * @remarks
   * Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
   * May be set directly at anytime.
   * May optionally be set via constructor option.
   * May optionally be set via options passed to Inviter.invite() or Invitation.accept().
   */
  get sessionDescriptionHandlerModifiers() {
    return this._sessionDescriptionHandlerModifiers || [];
  }
  set sessionDescriptionHandlerModifiers(e) {
    this._sessionDescriptionHandlerModifiers = e.slice();
  }
  /**
   * SDH options for the initial INVITE transaction.
   * @remarks
   * Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
   * May be set directly at anytime.
   * May optionally be set via constructor option.
   * May optionally be set via options passed to Inviter.invite() or Invitation.accept().
   */
  get sessionDescriptionHandlerOptions() {
    return this._sessionDescriptionHandlerOptions || {};
  }
  set sessionDescriptionHandlerOptions(e) {
    this._sessionDescriptionHandlerOptions = Object.assign({}, e);
  }
  /**
   * SDH modifiers for re-INVITE transactions.
   * @remarks
   * Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
   * May be set directly at anytime.
   * May optionally be set via constructor option.
   * May optionally be set via options passed to Session.invite().
   */
  get sessionDescriptionHandlerModifiersReInvite() {
    return this._sessionDescriptionHandlerModifiersReInvite || [];
  }
  set sessionDescriptionHandlerModifiersReInvite(e) {
    this._sessionDescriptionHandlerModifiersReInvite = e.slice();
  }
  /**
   * SDH options for re-INVITE transactions.
   * @remarks
   * Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
   * May be set directly at anytime.
   * May optionally be set via constructor option.
   * May optionally be set via options passed to Session.invite().
   */
  get sessionDescriptionHandlerOptionsReInvite() {
    return this._sessionDescriptionHandlerOptionsReInvite || {};
  }
  set sessionDescriptionHandlerOptionsReInvite(e) {
    this._sessionDescriptionHandlerOptionsReInvite = Object.assign({}, e);
  }
  /**
   * Session state.
   */
  get state() {
    return this._state;
  }
  /**
   * Session state change emitter.
   */
  get stateChange() {
    return this._stateEventEmitter;
  }
  /**
   * The user agent.
   */
  get userAgent() {
    return this._userAgent;
  }
  /**
   * End the {@link Session}. Sends a BYE.
   * @param options - Options bucket. See {@link SessionByeOptions} for details.
   */
  bye(e = {}) {
    let r = "Session.bye() may only be called if established session.";
    switch (this.state) {
      case _.Initial:
        typeof this.cancel == "function" ? (r += " However Inviter.invite() has not yet been called.", r += " Perhaps you should have called Inviter.cancel()?") : typeof this.reject == "function" && (r += " However Invitation.accept() has not yet been called.", r += " Perhaps you should have called Invitation.reject()?");
        break;
      case _.Establishing:
        typeof this.cancel == "function" ? (r += " However a dialog does not yet exist.", r += " Perhaps you should have called Inviter.cancel()?") : typeof this.reject == "function" && (r += " However Invitation.accept() has not yet been called (or not yet resolved).", r += " Perhaps you should have called Invitation.reject()?");
        break;
      case _.Established: {
        const s = e.requestDelegate, i = this.copyRequestOptions(e.requestOptions);
        return this._bye(s, i);
      }
      case _.Terminating:
        r += " However this session is already terminating.", typeof this.cancel == "function" ? r += " Perhaps you have already called Inviter.cancel()?" : typeof this.reject == "function" && (r += " Perhaps you have already called Session.bye()?");
        break;
      case _.Terminated:
        r += " However this session is already terminated.";
        break;
      default:
        throw new Error("Unknown state");
    }
    return this.logger.error(r), Promise.reject(new Error(`Invalid session state ${this.state}`));
  }
  /**
   * Share {@link Info} with peer. Sends an INFO.
   * @param options - Options bucket. See {@link SessionInfoOptions} for details.
   */
  info(e = {}) {
    if (this.state !== _.Established) {
      const i = "Session.info() may only be called if established session.";
      return this.logger.error(i), Promise.reject(new Error(`Invalid session state ${this.state}`));
    }
    const r = e.requestDelegate, s = this.copyRequestOptions(e.requestOptions);
    return this._info(r, s);
  }
  /**
   * Renegotiate the session. Sends a re-INVITE.
   * @param options - Options bucket. See {@link SessionInviteOptions} for details.
   */
  invite(e = {}) {
    if (this.logger.log("Session.invite"), this.state !== _.Established)
      return Promise.reject(new Error(`Invalid session state ${this.state}`));
    if (this.pendingReinvite)
      return Promise.reject(new rn("Reinvite in progress. Please wait until complete, then try again."));
    this.pendingReinvite = !0, e.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiersReInvite = e.sessionDescriptionHandlerModifiers), e.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptionsReInvite = e.sessionDescriptionHandlerOptions);
    const r = {
      onAccept: (n) => {
        const a = Qr(n.message);
        if (!a) {
          this.logger.error("Received 2xx response to re-INVITE without a session description"), this.ackAndBye(n, 400, "Missing session description"), this.stateTransition(_.Terminated), this.pendingReinvite = !1;
          return;
        }
        if (e.withoutSdp) {
          const o = {
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
          };
          this.setOfferAndGetAnswer(a, o).then((c) => {
            n.ack({ body: c });
          }).catch((c) => {
            this.logger.error("Failed to handle offer in 2xx response to re-INVITE"), this.logger.error(c.message), this.state === _.Terminated ? n.ack() : (this.ackAndBye(n, 488, "Bad Media Description"), this.stateTransition(_.Terminated));
          }).then(() => {
            this.pendingReinvite = !1, e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(n);
          });
        } else {
          const o = {
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
          };
          this.setAnswer(a, o).then(() => {
            n.ack();
          }).catch((c) => {
            this.logger.error("Failed to handle answer in 2xx response to re-INVITE"), this.logger.error(c.message), this.state !== _.Terminated ? (this.ackAndBye(n, 488, "Bad Media Description"), this.stateTransition(_.Terminated)) : n.ack();
          }).then(() => {
            this.pendingReinvite = !1, e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(n);
          });
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onProgress: (n) => {
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onRedirect: (n) => {
      },
      onReject: (n) => {
        this.logger.warn("Received a non-2xx response to re-INVITE"), this.pendingReinvite = !1, e.withoutSdp ? e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(n) : this.rollbackOffer().catch((a) => {
          if (this.logger.error("Failed to rollback offer on non-2xx response to re-INVITE"), this.logger.error(a.message), this.state !== _.Terminated) {
            if (!this.dialog)
              throw new Error("Dialog undefined.");
            const o = [];
            o.push("Reason: " + this.getReasonHeaderValue(500, "Internal Server Error")), this.dialog.bye(void 0, { extraHeaders: o }), this.stateTransition(_.Terminated);
          }
        }).then(() => {
          e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(n);
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onTrying: (n) => {
      }
    }, s = e.requestOptions || {};
    if (s.extraHeaders = (s.extraHeaders || []).slice(), s.extraHeaders.push("Allow: " + Gt.toString()), s.extraHeaders.push("Contact: " + this._contact), e.withoutSdp) {
      if (!this.dialog)
        throw this.pendingReinvite = !1, new Error("Dialog undefined.");
      return Promise.resolve(this.dialog.invite(r, s));
    }
    const i = {
      sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
      sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
    };
    return this.getOffer(i).then((n) => {
      if (!this.dialog)
        throw this.pendingReinvite = !1, new Error("Dialog undefined.");
      return s.body = n, this.dialog.invite(r, s);
    }).catch((n) => {
      throw this.logger.error(n.message), this.logger.error("Failed to send re-INVITE"), this.pendingReinvite = !1, n;
    });
  }
  /**
   * Deliver a {@link Message}. Sends a MESSAGE.
   * @param options - Options bucket. See {@link SessionMessageOptions} for details.
   */
  message(e = {}) {
    if (this.state !== _.Established) {
      const i = "Session.message() may only be called if established session.";
      return this.logger.error(i), Promise.reject(new Error(`Invalid session state ${this.state}`));
    }
    const r = e.requestDelegate, s = this.copyRequestOptions(e.requestOptions);
    return this._message(r, s);
  }
  /**
   * Proffer a {@link Referral}. Send a REFER.
   * @param referTo - The referral target. If a `Session`, a REFER w/Replaces is sent.
   * @param options - Options bucket. See {@link SessionReferOptions} for details.
   */
  refer(e, r = {}) {
    if (this.state !== _.Established) {
      const n = "Session.refer() may only be called if established session.";
      return this.logger.error(n), Promise.reject(new Error(`Invalid session state ${this.state}`));
    }
    if (e instanceof ds && !e.dialog) {
      const n = "Session.refer() may only be called with session which is established. You are perhaps attempting to attended transfer to a target for which there is not dialog yet established. Perhaps you are attempting a 'semi-attended' tansfer? Regardless, this is not supported. The recommended approached is to check to see if the target Session is in the Established state before calling refer(); if the state is not Established you may proceed by falling back using a URI as the target (blind transfer).";
      return this.logger.error(n), Promise.reject(new Error(`Invalid session state ${this.state}`));
    }
    const s = r.requestDelegate, i = this.copyRequestOptions(r.requestOptions);
    return i.extraHeaders = i.extraHeaders ? i.extraHeaders.concat(this.referExtraHeaders(this.referToString(e))) : this.referExtraHeaders(this.referToString(e)), this._refer(r.onNotify, s, i);
  }
  /**
   * Send BYE.
   * @param delegate - Request delegate.
   * @param options - Request options bucket.
   * @internal
   */
  _bye(e, r) {
    if (!this.dialog)
      return Promise.reject(new Error("Session dialog undefined."));
    const s = this.dialog;
    switch (s.sessionState) {
      case Ze.Initial:
        throw new Error(`Invalid dialog state ${s.sessionState}`);
      case Ze.Early:
        throw new Error(`Invalid dialog state ${s.sessionState}`);
      case Ze.AckWait:
        return this.stateTransition(_.Terminating), new Promise((i) => {
          s.delegate = {
            // When ACK shows up, say BYE.
            onAck: () => {
              const n = s.bye(e, r);
              return this.stateTransition(_.Terminated), i(n), Promise.resolve();
            },
            // Or the server transaction times out before the ACK arrives.
            onAckTimeout: () => {
              const n = s.bye(e, r);
              this.stateTransition(_.Terminated), i(n);
            }
          };
        });
      case Ze.Confirmed: {
        const i = s.bye(e, r);
        return this.stateTransition(_.Terminated), Promise.resolve(i);
      }
      case Ze.Terminated:
        throw new Error(`Invalid dialog state ${s.sessionState}`);
      default:
        throw new Error("Unrecognized state.");
    }
  }
  /**
   * Send INFO.
   * @param delegate - Request delegate.
   * @param options - Request options bucket.
   * @internal
   */
  _info(e, r) {
    return this.dialog ? Promise.resolve(this.dialog.info(e, r)) : Promise.reject(new Error("Session dialog undefined."));
  }
  /**
   * Send MESSAGE.
   * @param delegate - Request delegate.
   * @param options - Request options bucket.
   * @internal
   */
  _message(e, r) {
    return this.dialog ? Promise.resolve(this.dialog.message(e, r)) : Promise.reject(new Error("Session dialog undefined."));
  }
  /**
   * Send REFER.
   * @param onNotify - Notification callback.
   * @param delegate - Request delegate.
   * @param options - Request options bucket.
   * @internal
   */
  _refer(e, r, s) {
    return this.dialog ? (this.onNotify = e, Promise.resolve(this.dialog.refer(r, s))) : Promise.reject(new Error("Session dialog undefined."));
  }
  /**
   * Send ACK and then BYE. There are unrecoverable errors which can occur
   * while handling dialog forming and in-dialog INVITE responses and when
   * they occur we ACK the response and send a BYE.
   * Note that the BYE is sent in the dialog associated with the response
   * which is not necessarily `this.dialog`. And, accordingly, the
   * session state is not transitioned to terminated and session is not closed.
   * @param inviteResponse - The response causing the error.
   * @param statusCode - Status code for he reason phrase.
   * @param reasonPhrase - Reason phrase for the BYE.
   * @internal
   */
  ackAndBye(e, r, s) {
    e.ack();
    const i = [];
    r && i.push("Reason: " + this.getReasonHeaderValue(r, s)), e.session.bye(void 0, { extraHeaders: i });
  }
  /**
   * Handle in dialog ACK request.
   * @internal
   */
  onAckRequest(e) {
    if (this.logger.log("Session.onAckRequest"), this.state !== _.Established && this.state !== _.Terminating)
      return this.logger.error(`ACK received while in state ${this.state}, dropping request`), Promise.resolve();
    const r = this.dialog;
    if (!r)
      throw new Error("Dialog undefined.");
    const s = {
      sessionDescriptionHandlerOptions: this.pendingReinviteAck ? this.sessionDescriptionHandlerOptionsReInvite : this.sessionDescriptionHandlerOptions,
      sessionDescriptionHandlerModifiers: this.pendingReinviteAck ? this._sessionDescriptionHandlerModifiersReInvite : this._sessionDescriptionHandlerModifiers
    };
    if (this.delegate && this.delegate.onAck) {
      const i = new xh(e);
      this.delegate.onAck(i);
    }
    switch (this.pendingReinviteAck = !1, r.signalingState) {
      case $.Initial: {
        this.logger.error(`Invalid signaling state ${r.signalingState}.`);
        const i = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
        return r.bye(void 0, { extraHeaders: i }), this.stateTransition(_.Terminated), Promise.resolve();
      }
      case $.Stable: {
        const i = Qr(e.message);
        return i ? i.contentDisposition === "render" ? (this._renderbody = i.content, this._rendertype = i.contentType, Promise.resolve()) : i.contentDisposition !== "session" ? Promise.resolve() : this.setAnswer(i, s).catch((n) => {
          this.logger.error(n.message);
          const a = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
          r.bye(void 0, { extraHeaders: a }), this.stateTransition(_.Terminated);
        }) : Promise.resolve();
      }
      case $.HaveLocalOffer: {
        this.logger.error(`Invalid signaling state ${r.signalingState}.`);
        const i = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
        return r.bye(void 0, { extraHeaders: i }), this.stateTransition(_.Terminated), Promise.resolve();
      }
      case $.HaveRemoteOffer: {
        this.logger.error(`Invalid signaling state ${r.signalingState}.`);
        const i = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
        return r.bye(void 0, { extraHeaders: i }), this.stateTransition(_.Terminated), Promise.resolve();
      }
      case $.Closed:
        throw new Error(`Invalid signaling state ${r.signalingState}.`);
      default:
        throw new Error(`Invalid signaling state ${r.signalingState}.`);
    }
  }
  /**
   * Handle in dialog BYE request.
   * @internal
   */
  onByeRequest(e) {
    if (this.logger.log("Session.onByeRequest"), this.state !== _.Established) {
      this.logger.error(`BYE received while in state ${this.state}, dropping request`);
      return;
    }
    if (this.delegate && this.delegate.onBye) {
      const r = new Th(e);
      this.delegate.onBye(r);
    } else
      e.accept();
    this.stateTransition(_.Terminated);
  }
  /**
   * Handle in dialog INFO request.
   * @internal
   */
  onInfoRequest(e) {
    if (this.logger.log("Session.onInfoRequest"), this.state !== _.Established) {
      this.logger.error(`INFO received while in state ${this.state}, dropping request`);
      return;
    }
    if (this.delegate && this.delegate.onInfo) {
      const r = new Sh(e);
      this.delegate.onInfo(r);
    } else
      e.accept();
  }
  /**
   * Handle in dialog INVITE request.
   * @internal
   */
  onInviteRequest(e) {
    if (this.logger.log("Session.onInviteRequest"), this.state !== _.Established) {
      this.logger.error(`INVITE received while in state ${this.state}, dropping request`);
      return;
    }
    this.pendingReinviteAck = !0;
    const r = ["Contact: " + this._contact];
    if (e.message.hasHeader("P-Asserted-Identity")) {
      const i = e.message.getHeader("P-Asserted-Identity");
      if (!i)
        throw new Error("Header undefined.");
      this._assertedIdentity = _e.nameAddrHeaderParse(i);
    }
    const s = {
      sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
      sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
    };
    this.generateResponseOfferAnswerInDialog(s).then((i) => {
      const n = e.accept({ statusCode: 200, extraHeaders: r, body: i });
      this.delegate && this.delegate.onInvite && this.delegate.onInvite(e.message, n.message, 200);
    }).catch((i) => {
      if (this.logger.error(i.message), this.logger.error("Failed to handle to re-INVITE request"), !this.dialog)
        throw new Error("Dialog undefined.");
      if (this.logger.error(this.dialog.signalingState), this.dialog.signalingState === $.Stable) {
        const n = e.reject({ statusCode: 488 });
        this.delegate && this.delegate.onInvite && this.delegate.onInvite(e.message, n.message, 488);
        return;
      }
      this.rollbackOffer().then(() => {
        const n = e.reject({ statusCode: 488 });
        this.delegate && this.delegate.onInvite && this.delegate.onInvite(e.message, n.message, 488);
      }).catch((n) => {
        this.logger.error(n.message), this.logger.error("Failed to rollback offer on re-INVITE request");
        const a = e.reject({ statusCode: 488 });
        if (this.state !== _.Terminated) {
          if (!this.dialog)
            throw new Error("Dialog undefined.");
          const o = [];
          o.push("Reason: " + this.getReasonHeaderValue(500, "Internal Server Error")), this.dialog.bye(void 0, { extraHeaders: o }), this.stateTransition(_.Terminated);
        }
        this.delegate && this.delegate.onInvite && this.delegate.onInvite(e.message, a.message, 488);
      });
    });
  }
  /**
   * Handle in dialog MESSAGE request.
   * @internal
   */
  onMessageRequest(e) {
    if (this.logger.log("Session.onMessageRequest"), this.state !== _.Established) {
      this.logger.error(`MESSAGE received while in state ${this.state}, dropping request`);
      return;
    }
    if (this.delegate && this.delegate.onMessage) {
      const r = new Lo(e);
      this.delegate.onMessage(r);
    } else
      e.accept();
  }
  /**
   * Handle in dialog NOTIFY request.
   * @internal
   */
  onNotifyRequest(e) {
    if (this.logger.log("Session.onNotifyRequest"), this.state !== _.Established) {
      this.logger.error(`NOTIFY received while in state ${this.state}, dropping request`);
      return;
    }
    if (this.onNotify) {
      const r = new sn(e);
      this.onNotify(r);
      return;
    }
    if (this.delegate && this.delegate.onNotify) {
      const r = new sn(e);
      this.delegate.onNotify(r);
    } else
      e.accept();
  }
  /**
   * Handle in dialog PRACK request.
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPrackRequest(e) {
    if (this.logger.log("Session.onPrackRequest"), this.state !== _.Established) {
      this.logger.error(`PRACK received while in state ${this.state}, dropping request`);
      return;
    }
    throw new Error("Unimplemented.");
  }
  /**
   * Handle in dialog REFER request.
   * @internal
   */
  onReferRequest(e) {
    if (this.logger.log("Session.onReferRequest"), this.state !== _.Established) {
      this.logger.error(`REFER received while in state ${this.state}, dropping request`);
      return;
    }
    if (!e.message.hasHeader("refer-to")) {
      this.logger.warn("Invalid REFER packet. A refer-to header is required. Rejecting."), e.reject();
      return;
    }
    const r = new $h(e, this);
    this.delegate && this.delegate.onRefer ? this.delegate.onRefer(r) : (this.logger.log("No delegate available to handle REFER, automatically accepting and following."), r.accept().then(() => r.makeInviter(this._referralInviterOptions).invite()).catch((s) => {
      this.logger.error(s.message);
    }));
  }
  /**
   * Generate an offer or answer for a response to an INVITE request.
   * If a remote offer was provided in the request, set the remote
   * description and get a local answer. If a remote offer was not
   * provided, generates a local offer.
   * @internal
   */
  generateResponseOfferAnswer(e, r) {
    if (this.dialog)
      return this.generateResponseOfferAnswerInDialog(r);
    const s = Qr(e.message);
    return !s || s.contentDisposition !== "session" ? this.getOffer(r) : this.setOfferAndGetAnswer(s, r);
  }
  /**
   * Generate an offer or answer for a response to an INVITE request
   * when a dialog (early or otherwise) has already been established.
   * This method may NOT be called if a dialog has yet to be established.
   * @internal
   */
  generateResponseOfferAnswerInDialog(e) {
    if (!this.dialog)
      throw new Error("Dialog undefined.");
    switch (this.dialog.signalingState) {
      case $.Initial:
        return this.getOffer(e);
      case $.HaveLocalOffer:
        return Promise.resolve(void 0);
      case $.HaveRemoteOffer:
        if (!this.dialog.offer)
          throw new Error(`Session offer undefined in signaling state ${this.dialog.signalingState}.`);
        return this.setOfferAndGetAnswer(this.dialog.offer, e);
      case $.Stable:
        return this.state !== _.Established ? Promise.resolve(void 0) : this.getOffer(e);
      case $.Closed:
        throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
      default:
        throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
    }
  }
  /**
   * Get local offer.
   * @internal
   */
  getOffer(e) {
    const r = this.setupSessionDescriptionHandler(), s = e.sessionDescriptionHandlerOptions, i = e.sessionDescriptionHandlerModifiers;
    try {
      return r.getDescription(s, i).then((n) => js(n)).catch((n) => {
        this.logger.error("Session.getOffer: SDH getDescription rejected...");
        const a = n instanceof Error ? n : new Error("Session.getOffer unknown error.");
        throw this.logger.error(a.message), a;
      });
    } catch (n) {
      this.logger.error("Session.getOffer: SDH getDescription threw...");
      const a = n instanceof Error ? n : new Error(n);
      return this.logger.error(a.message), Promise.reject(a);
    }
  }
  /**
   * Rollback local/remote offer.
   * @internal
   */
  rollbackOffer() {
    const e = this.setupSessionDescriptionHandler();
    if (e.rollbackDescription === void 0)
      return Promise.resolve();
    try {
      return e.rollbackDescription().catch((r) => {
        this.logger.error("Session.rollbackOffer: SDH rollbackDescription rejected...");
        const s = r instanceof Error ? r : new Error("Session.rollbackOffer unknown error.");
        throw this.logger.error(s.message), s;
      });
    } catch (r) {
      this.logger.error("Session.rollbackOffer: SDH rollbackDescription threw...");
      const s = r instanceof Error ? r : new Error(r);
      return this.logger.error(s.message), Promise.reject(s);
    }
  }
  /**
   * Set remote answer.
   * @internal
   */
  setAnswer(e, r) {
    const s = this.setupSessionDescriptionHandler(), i = r.sessionDescriptionHandlerOptions, n = r.sessionDescriptionHandlerModifiers;
    try {
      if (!s.hasDescription(e.contentType))
        return Promise.reject(new tn());
    } catch (a) {
      this.logger.error("Session.setAnswer: SDH hasDescription threw...");
      const o = a instanceof Error ? a : new Error(a);
      return this.logger.error(o.message), Promise.reject(o);
    }
    try {
      return s.setDescription(e.content, i, n).catch((a) => {
        this.logger.error("Session.setAnswer: SDH setDescription rejected...");
        const o = a instanceof Error ? a : new Error("Session.setAnswer unknown error.");
        throw this.logger.error(o.message), o;
      });
    } catch (a) {
      this.logger.error("Session.setAnswer: SDH setDescription threw...");
      const o = a instanceof Error ? a : new Error(a);
      return this.logger.error(o.message), Promise.reject(o);
    }
  }
  /**
   * Set remote offer and get local answer.
   * @internal
   */
  setOfferAndGetAnswer(e, r) {
    const s = this.setupSessionDescriptionHandler(), i = r.sessionDescriptionHandlerOptions, n = r.sessionDescriptionHandlerModifiers;
    try {
      if (!s.hasDescription(e.contentType))
        return Promise.reject(new tn());
    } catch (a) {
      this.logger.error("Session.setOfferAndGetAnswer: SDH hasDescription threw...");
      const o = a instanceof Error ? a : new Error(a);
      return this.logger.error(o.message), Promise.reject(o);
    }
    try {
      return s.setDescription(e.content, i, n).then(() => s.getDescription(i, n)).then((a) => js(a)).catch((a) => {
        this.logger.error("Session.setOfferAndGetAnswer: SDH setDescription or getDescription rejected...");
        const o = a instanceof Error ? a : new Error("Session.setOfferAndGetAnswer unknown error.");
        throw this.logger.error(o.message), o;
      });
    } catch (a) {
      this.logger.error("Session.setOfferAndGetAnswer: SDH setDescription or getDescription threw...");
      const o = a instanceof Error ? a : new Error(a);
      return this.logger.error(o.message), Promise.reject(o);
    }
  }
  /**
   * SDH for confirmed dialog.
   * @internal
   */
  setSessionDescriptionHandler(e) {
    if (this._sessionDescriptionHandler)
      throw new Error("Session description handler defined.");
    this._sessionDescriptionHandler = e;
  }
  /**
   * SDH for confirmed dialog.
   * @internal
   */
  setupSessionDescriptionHandler() {
    var e;
    return this._sessionDescriptionHandler ? this._sessionDescriptionHandler : (this._sessionDescriptionHandler = this.sessionDescriptionHandlerFactory(this, this.userAgent.configuration.sessionDescriptionHandlerFactoryOptions), !((e = this.delegate) === null || e === void 0) && e.onSessionDescriptionHandler && this.delegate.onSessionDescriptionHandler(this._sessionDescriptionHandler, !1), this._sessionDescriptionHandler);
  }
  /**
   * Transition session state.
   * @internal
   */
  stateTransition(e) {
    const r = () => {
      throw new Error(`Invalid state transition from ${this._state} to ${e}`);
    };
    switch (this._state) {
      case _.Initial:
        e !== _.Establishing && e !== _.Established && e !== _.Terminating && e !== _.Terminated && r();
        break;
      case _.Establishing:
        e !== _.Established && e !== _.Terminating && e !== _.Terminated && r();
        break;
      case _.Established:
        e !== _.Terminating && e !== _.Terminated && r();
        break;
      case _.Terminating:
        e !== _.Terminated && r();
        break;
      case _.Terminated:
        r();
        break;
      default:
        throw new Error("Unrecognized state.");
    }
    this._state = e, this.logger.log(`Session ${this.id} transitioned to state ${this._state}`), this._stateEventEmitter.emit(this._state), e === _.Terminated && this.dispose();
  }
  copyRequestOptions(e = {}) {
    const r = e.extraHeaders ? e.extraHeaders.slice() : void 0, s = e.body ? {
      contentDisposition: e.body.contentDisposition || "render",
      contentType: e.body.contentType || "text/plain",
      content: e.body.content || ""
    } : void 0;
    return {
      extraHeaders: r,
      body: s
    };
  }
  getReasonHeaderValue(e, r) {
    const s = e;
    let i = oi(e);
    return !i && r && (i = r), "SIP;cause=" + s + ';text="' + i + '"';
  }
  referExtraHeaders(e) {
    const r = [];
    return r.push("Referred-By: <" + this.userAgent.configuration.uri + ">"), r.push("Contact: " + this._contact), r.push("Allow: " + ["ACK", "CANCEL", "INVITE", "MESSAGE", "BYE", "OPTIONS", "INFO", "NOTIFY", "REFER"].toString()), r.push("Refer-To: " + e), r;
  }
  referToString(e) {
    let r;
    if (e instanceof vt)
      r = e.toString();
    else {
      if (!e.dialog)
        throw new Error("Dialog undefined.");
      const s = e.remoteIdentity.friendlyName, i = e.dialog.remoteTarget.toString(), n = e.dialog.callId, a = e.dialog.remoteTag, o = e.dialog.localTag, c = encodeURIComponent(`${n};to-tag=${a};from-tag=${o}`);
      r = `"${s}" <${i}?Replaces=${c}>`;
    }
    return r;
  }
}
var rt;
(function(t) {
  t.Required = "Required", t.Supported = "Supported", t.Unsupported = "Unsupported";
})(rt = rt || (rt = {}));
const Ah = {
  "100rel": !0,
  199: !0,
  answermode: !0,
  "early-session": !0,
  eventlist: !0,
  explicitsub: !0,
  "from-change": !0,
  "geolocation-http": !0,
  "geolocation-sip": !0,
  gin: !0,
  gruu: !0,
  histinfo: !0,
  ice: !0,
  join: !0,
  "multiple-refer": !0,
  norefersub: !0,
  nosub: !0,
  outbound: !0,
  path: !0,
  policy: !0,
  precondition: !0,
  pref: !0,
  privacy: !0,
  "recipient-list-invite": !0,
  "recipient-list-message": !0,
  "recipient-list-subscribe": !0,
  replaces: !0,
  "resource-priority": !0,
  "sdp-anat": !0,
  "sec-agree": !0,
  tdialog: !0,
  timer: !0,
  uui: !0
  // RFC 7433
};
class kh extends ds {
  /** @internal */
  constructor(e, r) {
    super(e), this.incomingInviteRequest = r, this.disposed = !1, this.expiresTimer = void 0, this.isCanceled = !1, this.rel100 = "none", this.rseq = Math.floor(Math.random() * 1e4), this.userNoAnswerTimer = void 0, this.waitingForPrack = !1, this.logger = e.getLogger("sip.Invitation");
    const s = this.incomingInviteRequest.message, i = s.getHeader("require");
    i && i.toLowerCase().includes("100rel") && (this.rel100 = "required");
    const n = s.getHeader("supported");
    if (n && n.toLowerCase().includes("100rel") && (this.rel100 = "supported"), s.toTag = r.toTag, typeof s.toTag != "string")
      throw new TypeError("toTag should have been a string.");
    if (this.userNoAnswerTimer = setTimeout(() => {
      r.reject({ statusCode: 480 }), this.stateTransition(_.Terminated);
    }, this.userAgent.configuration.noAnswerTimeout ? this.userAgent.configuration.noAnswerTimeout * 1e3 : 6e4), s.hasHeader("expires")) {
      const c = Number(s.getHeader("expires") || 0) * 1e3;
      this.expiresTimer = setTimeout(() => {
        this.state === _.Initial && (r.reject({ statusCode: 487 }), this.stateTransition(_.Terminated));
      }, c);
    }
    const a = this.request.getHeader("P-Asserted-Identity");
    a && (this._assertedIdentity = _e.nameAddrHeaderParse(a)), this._contact = this.userAgent.contact.toString();
    const o = s.parseHeader("Content-Disposition");
    o && o.type === "render" && (this._renderbody = s.body, this._rendertype = s.getHeader("Content-Type")), this._id = s.callId + s.fromTag, this.userAgent._sessions[this._id] = this;
  }
  /**
   * Destructor.
   */
  dispose() {
    if (this.disposed)
      return Promise.resolve();
    switch (this.disposed = !0, this.expiresTimer && (clearTimeout(this.expiresTimer), this.expiresTimer = void 0), this.userNoAnswerTimer && (clearTimeout(this.userNoAnswerTimer), this.userNoAnswerTimer = void 0), this.prackNeverArrived(), this.state) {
      case _.Initial:
        return this.reject().then(() => super.dispose());
      case _.Establishing:
        return this.reject().then(() => super.dispose());
      case _.Established:
        return super.dispose();
      case _.Terminating:
        return super.dispose();
      case _.Terminated:
        return super.dispose();
      default:
        throw new Error("Unknown state.");
    }
  }
  /**
   * If true, a first provisional response after the 100 Trying
   * will be sent automatically. This is false it the UAC required
   * reliable provisional responses (100rel in Require header) or
   * the user agent configuration has specified to not send an
   * initial response, otherwise it is true. The provisional is sent by
   * calling `progress()` without any options.
   */
  get autoSendAnInitialProvisionalResponse() {
    return this.rel100 !== "required" && this.userAgent.configuration.sendInitialProvisionalResponse;
  }
  /**
   * Initial incoming INVITE request message body.
   */
  get body() {
    return this.incomingInviteRequest.message.body;
  }
  /**
   * The identity of the local user.
   */
  get localIdentity() {
    return this.request.to;
  }
  /**
   * The identity of the remote user.
   */
  get remoteIdentity() {
    return this.request.from;
  }
  /**
   * Initial incoming INVITE request message.
   */
  get request() {
    return this.incomingInviteRequest.message;
  }
  /**
   * Accept the invitation.
   *
   * @remarks
   * Accept the incoming INVITE request to start a Session.
   * Replies to the INVITE request with a 200 Ok response.
   * Resolves once the response sent, otherwise rejects.
   *
   * This method may reject for a variety of reasons including
   * the receipt of a CANCEL request before `accept` is able
   * to construct a response.
   * @param options - Options bucket.
   */
  accept(e = {}) {
    if (this.logger.log("Invitation.accept"), this.state !== _.Initial) {
      const r = new Error(`Invalid session state ${this.state}`);
      return this.logger.error(r.message), Promise.reject(r);
    }
    return e.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiers = e.sessionDescriptionHandlerModifiers), e.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptions = e.sessionDescriptionHandlerOptions), this.stateTransition(_.Establishing), this.sendAccept(e).then(({ message: r, session: s }) => {
      s.delegate = {
        onAck: (i) => this.onAckRequest(i),
        onAckTimeout: () => this.onAckTimeout(),
        onBye: (i) => this.onByeRequest(i),
        onInfo: (i) => this.onInfoRequest(i),
        onInvite: (i) => this.onInviteRequest(i),
        onMessage: (i) => this.onMessageRequest(i),
        onNotify: (i) => this.onNotifyRequest(i),
        onPrack: (i) => this.onPrackRequest(i),
        onRefer: (i) => this.onReferRequest(i)
      }, this._dialog = s, this.stateTransition(_.Established), this._replacee && this._replacee._bye();
    }).catch((r) => this.handleResponseError(r));
  }
  /**
   * Indicate progress processing the invitation.
   *
   * @remarks
   * Report progress to the the caller.
   * Replies to the INVITE request with a 1xx provisional response.
   * Resolves once the response sent, otherwise rejects.
   * @param options - Options bucket.
   */
  progress(e = {}) {
    if (this.logger.log("Invitation.progress"), this.state !== _.Initial) {
      const s = new Error(`Invalid session state ${this.state}`);
      return this.logger.error(s.message), Promise.reject(s);
    }
    const r = e.statusCode || 180;
    if (r < 100 || r > 199)
      throw new TypeError("Invalid statusCode: " + r);
    return e.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiers = e.sessionDescriptionHandlerModifiers), e.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptions = e.sessionDescriptionHandlerOptions), this.waitingForPrack ? (this.logger.warn("Unexpected call for progress while waiting for prack, ignoring"), Promise.resolve()) : e.statusCode === 100 ? this.sendProgressTrying().then(() => {
    }).catch((s) => this.handleResponseError(s)) : this.rel100 !== "required" && !(this.rel100 === "supported" && e.rel100) && !(this.rel100 === "supported" && this.userAgent.configuration.sipExtension100rel === rt.Required) ? this.sendProgress(e).then(() => {
    }).catch((s) => this.handleResponseError(s)) : this.sendProgressReliableWaitForPrack(e).then(() => {
    }).catch((s) => this.handleResponseError(s));
  }
  /**
   * Reject the invitation.
   *
   * @remarks
   * Replies to the INVITE request with a 4xx, 5xx, or 6xx final response.
   * Resolves once the response sent, otherwise rejects.
   *
   * The expectation is that this method is used to reject an INVITE request.
   * That is indeed the case - a call to `progress` followed by `reject` is
   * a typical way to "decline" an incoming INVITE request. However it may
   * also be called after calling `accept` (but only before it completes)
   * which will reject the call and cause `accept` to reject.
   * @param options - Options bucket.
   */
  reject(e = {}) {
    if (this.logger.log("Invitation.reject"), this.state !== _.Initial && this.state !== _.Establishing) {
      const a = new Error(`Invalid session state ${this.state}`);
      return this.logger.error(a.message), Promise.reject(a);
    }
    const r = e.statusCode || 480, s = e.reasonPhrase ? e.reasonPhrase : oi(r), i = e.extraHeaders || [];
    if (r < 300 || r > 699)
      throw new TypeError("Invalid statusCode: " + r);
    const n = e.body ? js(e.body) : void 0;
    return r < 400 ? this.incomingInviteRequest.redirect([], { statusCode: r, reasonPhrase: s, extraHeaders: i, body: n }) : this.incomingInviteRequest.reject({ statusCode: r, reasonPhrase: s, extraHeaders: i, body: n }), this.stateTransition(_.Terminated), Promise.resolve();
  }
  /**
   * Handle CANCEL request.
   *
   * @param message - CANCEL message.
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onCancel(e) {
    if (this.logger.log("Invitation._onCancel"), this.state !== _.Initial && this.state !== _.Establishing) {
      this.logger.error(`CANCEL received while in state ${this.state}, dropping request`);
      return;
    }
    if (this.delegate && this.delegate.onCancel) {
      const r = new Eh(e);
      this.delegate.onCancel(r);
    }
    this.isCanceled = !0, this.incomingInviteRequest.reject({ statusCode: 487 }), this.stateTransition(_.Terminated);
  }
  /**
   * Helper function to handle offer/answer in a PRACK.
   */
  handlePrackOfferAnswer(e) {
    if (!this.dialog)
      throw new Error("Dialog undefined.");
    const r = Qr(e.message);
    if (!r || r.contentDisposition !== "session")
      return Promise.resolve(void 0);
    const s = {
      sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
      sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
    };
    switch (this.dialog.signalingState) {
      case $.Initial:
        throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
      case $.Stable:
        return this.setAnswer(r, s).then(() => {
        });
      case $.HaveLocalOffer:
        throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
      case $.HaveRemoteOffer:
        return this.setOfferAndGetAnswer(r, s);
      case $.Closed:
        throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
      default:
        throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
    }
  }
  /**
   * A handler for errors which occur while attempting to send 1xx and 2xx responses.
   * In all cases, an attempt is made to reject the request if it is still outstanding.
   * And while there are a variety of things which can go wrong and we log something here
   * for all errors, there are a handful of common exceptions we pay some extra attention to.
   * @param error - The error which occurred.
   */
  handleResponseError(e) {
    let r = 480;
    if (e instanceof Error ? this.logger.error(e.message) : this.logger.error(e), e instanceof tn ? (this.logger.error("A session description handler occurred while sending response (content type unsupported"), r = 415) : e instanceof _h ? this.logger.error("A session description handler occurred while sending response") : e instanceof Pi ? this.logger.error("Session ended before response could be formulated and sent (while waiting for PRACK)") : e instanceof Vt && this.logger.error("Session changed state before response could be formulated and sent"), this.state === _.Initial || this.state === _.Establishing)
      try {
        this.incomingInviteRequest.reject({ statusCode: r }), this.stateTransition(_.Terminated);
      } catch (s) {
        throw this.logger.error("An error occurred attempting to reject the request while handling another error"), s;
      }
    if (this.isCanceled) {
      this.logger.warn("An error occurred while attempting to formulate and send a response to an incoming INVITE. However a CANCEL was received and processed while doing so which can (and often does) result in errors occurring as the session terminates in the meantime. Said error is being ignored.");
      return;
    }
    throw e;
  }
  /**
   * Callback for when ACK for a 2xx response is never received.
   * @param session - Session the ACK never arrived for.
   */
  onAckTimeout() {
    if (this.logger.log("Invitation.onAckTimeout"), !this.dialog)
      throw new Error("Dialog undefined.");
    this.logger.log("No ACK received for an extended period of time, terminating session"), this.dialog.bye(), this.stateTransition(_.Terminated);
  }
  /**
   * A version of `accept` which resolves a session when the 200 Ok response is sent.
   * @param options - Options bucket.
   */
  sendAccept(e = {}) {
    const r = {
      sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
      sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
    }, s = e.extraHeaders || [];
    return this.waitingForPrack ? this.waitForArrivalOfPrack().then(() => clearTimeout(this.userNoAnswerTimer)).then(() => this.generateResponseOfferAnswer(this.incomingInviteRequest, r)).then((i) => this.incomingInviteRequest.accept({ statusCode: 200, body: i, extraHeaders: s })) : (clearTimeout(this.userNoAnswerTimer), this.generateResponseOfferAnswer(this.incomingInviteRequest, r).then((i) => this.incomingInviteRequest.accept({ statusCode: 200, body: i, extraHeaders: s })));
  }
  /**
   * A version of `progress` which resolves when the provisional response is sent.
   * @param options - Options bucket.
   */
  sendProgress(e = {}) {
    const r = e.statusCode || 180, s = e.reasonPhrase, i = (e.extraHeaders || []).slice(), n = e.body ? js(e.body) : void 0;
    if (r === 183 && !n)
      return this.sendProgressWithSDP(e);
    try {
      const a = this.incomingInviteRequest.progress({ statusCode: r, reasonPhrase: s, extraHeaders: i, body: n });
      return this._dialog = a.session, Promise.resolve(a);
    } catch (a) {
      return Promise.reject(a);
    }
  }
  /**
   * A version of `progress` which resolves when the provisional response with sdp is sent.
   * @param options - Options bucket.
   */
  sendProgressWithSDP(e = {}) {
    const r = {
      sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
      sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
    }, s = e.statusCode || 183, i = e.reasonPhrase, n = (e.extraHeaders || []).slice();
    return this.generateResponseOfferAnswer(this.incomingInviteRequest, r).then((a) => this.incomingInviteRequest.progress({ statusCode: s, reasonPhrase: i, extraHeaders: n, body: a })).then((a) => (this._dialog = a.session, a));
  }
  /**
   * A version of `progress` which resolves when the reliable provisional response is sent.
   * @param options - Options bucket.
   */
  sendProgressReliable(e = {}) {
    return e.extraHeaders = (e.extraHeaders || []).slice(), e.extraHeaders.push("Require: 100rel"), e.extraHeaders.push("RSeq: " + Math.floor(Math.random() * 1e4)), this.sendProgressWithSDP(e);
  }
  /**
   * A version of `progress` which resolves when the reliable provisional response is acknowledged.
   * @param options - Options bucket.
   */
  sendProgressReliableWaitForPrack(e = {}) {
    const r = {
      sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
      sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
    }, s = e.statusCode || 183, i = e.reasonPhrase, n = (e.extraHeaders || []).slice();
    n.push("Require: 100rel"), n.push("RSeq: " + this.rseq++);
    let a;
    return new Promise((o, c) => {
      this.waitingForPrack = !0, this.generateResponseOfferAnswer(this.incomingInviteRequest, r).then((l) => (a = l, this.incomingInviteRequest.progress({ statusCode: s, reasonPhrase: i, extraHeaders: n, body: a }))).then((l) => {
        this._dialog = l.session;
        let h, f;
        l.session.delegate = {
          onPrack: (m) => {
            h = m, clearTimeout(O), clearTimeout(le), this.waitingForPrack && (this.waitingForPrack = !1, this.handlePrackOfferAnswer(h).then((V) => {
              try {
                f = h.accept({ statusCode: 200, body: V }), this.prackArrived(), o({ prackRequest: h, prackResponse: f, progressResponse: l });
              } catch (ye) {
                c(ye);
              }
            }).catch((V) => c(V)));
          }
        };
        const O = setTimeout(() => {
          this.waitingForPrack && (this.waitingForPrack = !1, this.logger.warn("No PRACK received, rejecting INVITE."), clearTimeout(le), this.reject({ statusCode: 504 }).then(() => c(new Pi())).catch((m) => c(m)));
        }, Se.T1 * 64), W = () => {
          try {
            this.incomingInviteRequest.progress({ statusCode: s, reasonPhrase: i, extraHeaders: n, body: a });
          } catch (m) {
            this.waitingForPrack = !1, c(m);
            return;
          }
          le = setTimeout(W, M *= 2);
        };
        let M = Se.T1, le = setTimeout(W, M);
      }).catch((l) => {
        this.waitingForPrack = !1, c(l);
      });
    });
  }
  /**
   * A version of `progress` which resolves when a 100 Trying provisional response is sent.
   */
  sendProgressTrying() {
    try {
      const e = this.incomingInviteRequest.trying();
      return Promise.resolve(e);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * When attempting to accept the INVITE, an invitation waits
   * for any outstanding PRACK to arrive before sending the 200 Ok.
   * It will be waiting on this Promise to resolve which lets it know
   * the PRACK has arrived and it may proceed to send the 200 Ok.
   */
  waitForArrivalOfPrack() {
    if (this.waitingForPrackPromise)
      throw new Error("Already waiting for PRACK");
    return this.waitingForPrackPromise = new Promise((e, r) => {
      this.waitingForPrackResolve = e, this.waitingForPrackReject = r;
    }), this.waitingForPrackPromise;
  }
  /**
   * Here we are resolving the promise which in turn will cause
   * the accept to proceed (it may still fail for other reasons, but...).
   */
  prackArrived() {
    this.waitingForPrackResolve && this.waitingForPrackResolve(), this.waitingForPrackPromise = void 0, this.waitingForPrackResolve = void 0, this.waitingForPrackReject = void 0;
  }
  /**
   * Here we are rejecting the promise which in turn will cause
   * the accept to fail and the session to transition to "terminated".
   */
  prackNeverArrived() {
    this.waitingForPrackReject && this.waitingForPrackReject(new Pi()), this.waitingForPrackPromise = void 0, this.waitingForPrackResolve = void 0, this.waitingForPrackReject = void 0;
  }
}
class Ph extends ds {
  /**
   * Constructs a new instance of the `Inviter` class.
   * @param userAgent - User agent. See {@link UserAgent} for details.
   * @param targetURI - Request URI identifying the target of the message.
   * @param options - Options bucket. See {@link InviterOptions} for details.
   */
  constructor(e, r, s = {}) {
    super(e, s), this.disposed = !1, this.earlyMedia = !1, this.earlyMediaSessionDescriptionHandlers = /* @__PURE__ */ new Map(), this.isCanceled = !1, this.inviteWithoutSdp = !1, this.logger = e.getLogger("sip.Inviter"), this.earlyMedia = s.earlyMedia !== void 0 ? s.earlyMedia : this.earlyMedia, this.fromTag = ci(), this.inviteWithoutSdp = s.inviteWithoutSdp !== void 0 ? s.inviteWithoutSdp : this.inviteWithoutSdp;
    const i = Object.assign({}, s);
    i.params = Object.assign({}, s.params);
    const n = s.anonymous || !1, a = e.contact.toString({
      anonymous: n,
      // Do not add ;ob in initial forming dialog requests if the
      // registration over the current connection got a GRUU URI.
      outbound: n ? !e.contact.tempGruu : !e.contact.pubGruu
    });
    n && e.configuration.uri && (i.params.fromDisplayName = "Anonymous", i.params.fromUri = "sip:anonymous@anonymous.invalid");
    let o = e.userAgentCore.configuration.aor;
    if (i.params.fromUri && (o = typeof i.params.fromUri == "string" ? _e.URIParse(i.params.fromUri) : i.params.fromUri), !o)
      throw new TypeError("Invalid from URI: " + i.params.fromUri);
    let c = r;
    if (i.params.toUri && (c = typeof i.params.toUri == "string" ? _e.URIParse(i.params.toUri) : i.params.toUri), !c)
      throw new TypeError("Invalid to URI: " + i.params.toUri);
    const l = Object.assign({}, i.params);
    l.fromTag = this.fromTag;
    const h = (i.extraHeaders || []).slice();
    n && e.configuration.uri && (h.push("P-Preferred-Identity: " + e.configuration.uri.toString()), h.push("Privacy: id")), h.push("Contact: " + a), h.push("Allow: " + ["ACK", "CANCEL", "INVITE", "MESSAGE", "BYE", "OPTIONS", "INFO", "NOTIFY", "REFER"].toString()), e.configuration.sipExtension100rel === rt.Required && h.push("Require: 100rel"), e.configuration.sipExtensionReplaces === rt.Required && h.push("Require: replaces"), i.extraHeaders = h;
    const f = void 0;
    this.outgoingRequestMessage = e.userAgentCore.makeOutgoingRequestMessage(P.INVITE, r, o, c, l, h, f), this._contact = a, this._referralInviterOptions = i, this._renderbody = s.renderbody, this._rendertype = s.rendertype, s.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiers = s.sessionDescriptionHandlerModifiers), s.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptions = s.sessionDescriptionHandlerOptions), s.sessionDescriptionHandlerModifiersReInvite && (this.sessionDescriptionHandlerModifiersReInvite = s.sessionDescriptionHandlerModifiersReInvite), s.sessionDescriptionHandlerOptionsReInvite && (this.sessionDescriptionHandlerOptionsReInvite = s.sessionDescriptionHandlerOptionsReInvite), this._id = this.outgoingRequestMessage.callId + this.fromTag, this.userAgent._sessions[this._id] = this;
  }
  /**
   * Destructor.
   */
  dispose() {
    if (this.disposed)
      return Promise.resolve();
    switch (this.disposed = !0, this.disposeEarlyMedia(), this.state) {
      case _.Initial:
        return this.cancel().then(() => super.dispose());
      case _.Establishing:
        return this.cancel().then(() => super.dispose());
      case _.Established:
        return super.dispose();
      case _.Terminating:
        return super.dispose();
      case _.Terminated:
        return super.dispose();
      default:
        throw new Error("Unknown state.");
    }
  }
  /**
   * Initial outgoing INVITE request message body.
   */
  get body() {
    return this.outgoingRequestMessage.body;
  }
  /**
   * The identity of the local user.
   */
  get localIdentity() {
    return this.outgoingRequestMessage.from;
  }
  /**
   * The identity of the remote user.
   */
  get remoteIdentity() {
    return this.outgoingRequestMessage.to;
  }
  /**
   * Initial outgoing INVITE request message.
   */
  get request() {
    return this.outgoingRequestMessage;
  }
  /**
   * Cancels the INVITE request.
   *
   * @remarks
   * Sends a CANCEL request.
   * Resolves once the response sent, otherwise rejects.
   *
   * After sending a CANCEL request the expectation is that a 487 final response
   * will be received for the INVITE. However a 200 final response to the INVITE
   * may nonetheless arrive (it's a race between the CANCEL reaching the UAS before
   * the UAS sends a 200) in which case an ACK & BYE will be sent. The net effect
   * is that this method will terminate the session regardless of the race.
   * @param options - Options bucket.
   */
  cancel(e = {}) {
    if (this.logger.log("Inviter.cancel"), this.state !== _.Initial && this.state !== _.Establishing) {
      const s = new Error(`Invalid session state ${this.state}`);
      return this.logger.error(s.message), Promise.reject(s);
    }
    this.isCanceled = !0, this.stateTransition(_.Terminating);
    function r(s, i) {
      if (s && s < 200 || s > 699)
        throw new TypeError("Invalid statusCode: " + s);
      if (s) {
        const n = s, a = oi(s) || i;
        return "SIP;cause=" + n + ';text="' + a + '"';
      }
    }
    if (this.outgoingInviteRequest) {
      let s;
      e.statusCode && e.reasonPhrase && (s = r(e.statusCode, e.reasonPhrase)), this.outgoingInviteRequest.cancel(s, e);
    } else
      this.logger.warn("Canceled session before INVITE was sent"), this.stateTransition(_.Terminated);
    return Promise.resolve();
  }
  /**
   * Sends the INVITE request.
   *
   * @remarks
   * TLDR...
   *  1) Only one offer/answer exchange permitted during initial INVITE.
   *  2) No "early media" if the initial offer is in an INVITE (default behavior).
   *  3) If "early media" and the initial offer is in an INVITE, no INVITE forking.
   *
   * 1) Only one offer/answer exchange permitted during initial INVITE.
   *
   * Our implementation replaces the following bullet point...
   *
   * o  After having sent or received an answer to the first offer, the
   *    UAC MAY generate subsequent offers in requests based on rules
   *    specified for that method, but only if it has received answers
   *    to any previous offers, and has not sent any offers to which it
   *    hasn't gotten an answer.
   * https://tools.ietf.org/html/rfc3261#section-13.2.1
   *
   * ...with...
   *
   * o  After having sent or received an answer to the first offer, the
   *    UAC MUST NOT generate subsequent offers in requests based on rules
   *    specified for that method.
   *
   * ...which in combination with this bullet point...
   *
   * o  Once the UAS has sent or received an answer to the initial
   *    offer, it MUST NOT generate subsequent offers in any responses
   *    to the initial INVITE.  This means that a UAS based on this
   *    specification alone can never generate subsequent offers until
   *    completion of the initial transaction.
   * https://tools.ietf.org/html/rfc3261#section-13.2.1
   *
   * ...ensures that EXACTLY ONE offer/answer exchange will occur
   * during an initial out of dialog INVITE request made by our UAC.
   *
   *
   * 2) No "early media" if the initial offer is in an INVITE (default behavior).
   *
   * While our implementation adheres to the following bullet point...
   *
   * o  If the initial offer is in an INVITE, the answer MUST be in a
   *    reliable non-failure message from UAS back to UAC which is
   *    correlated to that INVITE.  For this specification, that is
   *    only the final 2xx response to that INVITE.  That same exact
   *    answer MAY also be placed in any provisional responses sent
   *    prior to the answer.  The UAC MUST treat the first session
   *    description it receives as the answer, and MUST ignore any
   *    session descriptions in subsequent responses to the initial
   *    INVITE.
   * https://tools.ietf.org/html/rfc3261#section-13.2.1
   *
   * We have made the following implementation decision with regard to early media...
   *
   * o  If the initial offer is in the INVITE, the answer from the
   *    UAS back to the UAC will establish a media session only
   *    only after the final 2xx response to that INVITE is received.
   *
   * The reason for this decision is rooted in a restriction currently
   * inherent in WebRTC. Specifically, while a SIP INVITE request with an
   * initial offer may fork resulting in more than one provisional answer,
   * there is currently no easy/good way to to "fork" an offer generated
   * by a peer connection. In particular, a WebRTC offer currently may only
   * be matched with one answer and we have no good way to know which
   * "provisional answer" is going to be the "final answer". So we have
   * decided to punt and not create any "early media" sessions in this case.
   *
   * The upshot is that if you want "early media", you must not put the
   * initial offer in the INVITE. Instead, force the UAS to provide the
   * initial offer by sending an INVITE without an offer. In the WebRTC
   * case this allows us to create a unique peer connection with a unique
   * answer for every provisional offer with "early media" on all of them.
   *
   *
   * 3) If "early media" and the initial offer is in an INVITE, no INVITE forking.
   *
   * The default behavior may be altered and "early media" utilized if the
   * initial offer is in the an INVITE by setting the `earlyMedia` options.
   * However in that case the INVITE request MUST NOT fork. This allows for
   * "early media" in environments where the forking behavior of the SIP
   * servers being utilized is configured to disallow forking.
   */
  invite(e = {}) {
    if (this.logger.log("Inviter.invite"), this.state !== _.Initial)
      return super.invite(e);
    if (e.sessionDescriptionHandlerModifiers && (this.sessionDescriptionHandlerModifiers = e.sessionDescriptionHandlerModifiers), e.sessionDescriptionHandlerOptions && (this.sessionDescriptionHandlerOptions = e.sessionDescriptionHandlerOptions), e.withoutSdp || this.inviteWithoutSdp)
      return this._renderbody && this._rendertype && (this.outgoingRequestMessage.body = { contentType: this._rendertype, body: this._renderbody }), this.stateTransition(_.Establishing), Promise.resolve(this.sendInvite(e));
    const r = {
      sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
      sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
    };
    return this.getOffer(r).then((s) => (this.outgoingRequestMessage.body = { body: s.content, contentType: s.contentType }, this.stateTransition(_.Establishing), this.sendInvite(e))).catch((s) => {
      throw this.logger.log(s.message), this.state !== _.Terminated && this.stateTransition(_.Terminated), s;
    });
  }
  /**
   * 13.2.1 Creating the Initial INVITE
   *
   * Since the initial INVITE represents a request outside of a dialog,
   * its construction follows the procedures of Section 8.1.1.  Additional
   * processing is required for the specific case of INVITE.
   *
   * An Allow header field (Section 20.5) SHOULD be present in the INVITE.
   * It indicates what methods can be invoked within a dialog, on the UA
   * sending the INVITE, for the duration of the dialog.  For example, a
   * UA capable of receiving INFO requests within a dialog [34] SHOULD
   * include an Allow header field listing the INFO method.
   *
   * A Supported header field (Section 20.37) SHOULD be present in the
   * INVITE.  It enumerates all the extensions understood by the UAC.
   *
   * An Accept (Section 20.1) header field MAY be present in the INVITE.
   * It indicates which Content-Types are acceptable to the UA, in both
   * the response received by it, and in any subsequent requests sent to
   * it within dialogs established by the INVITE.  The Accept header field
   * is especially useful for indicating support of various session
   * description formats.
   *
   * The UAC MAY add an Expires header field (Section 20.19) to limit the
   * validity of the invitation.  If the time indicated in the Expires
   * header field is reached and no final answer for the INVITE has been
   * received, the UAC core SHOULD generate a CANCEL request for the
   * INVITE, as per Section 9.
   *
   * A UAC MAY also find it useful to add, among others, Subject (Section
   * 20.36), Organization (Section 20.25) and User-Agent (Section 20.41)
   * header fields.  They all contain information related to the INVITE.
   *
   * The UAC MAY choose to add a message body to the INVITE.  Section
   * 8.1.1.10 deals with how to construct the header fields -- Content-
   * Type among others -- needed to describe the message body.
   *
   * https://tools.ietf.org/html/rfc3261#section-13.2.1
   */
  sendInvite(e = {}) {
    return this.outgoingInviteRequest = this.userAgent.userAgentCore.invite(this.outgoingRequestMessage, {
      onAccept: (r) => {
        if (this.dialog) {
          this.logger.log("Additional confirmed dialog, sending ACK and BYE"), this.ackAndBye(r);
          return;
        }
        if (this.isCanceled) {
          this.logger.log("Canceled session accepted, sending ACK and BYE"), this.ackAndBye(r), this.stateTransition(_.Terminated);
          return;
        }
        this.notifyReferer(r), this.onAccept(r).then(() => {
          this.disposeEarlyMedia();
        }).catch(() => {
          this.disposeEarlyMedia();
        }).then(() => {
          e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(r);
        });
      },
      onProgress: (r) => {
        this.isCanceled || (this.notifyReferer(r), this.onProgress(r).catch(() => {
          this.disposeEarlyMedia();
        }).then(() => {
          e.requestDelegate && e.requestDelegate.onProgress && e.requestDelegate.onProgress(r);
        }));
      },
      onRedirect: (r) => {
        this.notifyReferer(r), this.onRedirect(r), e.requestDelegate && e.requestDelegate.onRedirect && e.requestDelegate.onRedirect(r);
      },
      onReject: (r) => {
        this.notifyReferer(r), this.onReject(r), e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(r);
      },
      onTrying: (r) => {
        this.notifyReferer(r), this.onTrying(r), e.requestDelegate && e.requestDelegate.onTrying && e.requestDelegate.onTrying(r);
      }
    }), this.outgoingInviteRequest;
  }
  disposeEarlyMedia() {
    this.earlyMediaSessionDescriptionHandlers.forEach((e) => {
      e.close();
    }), this.earlyMediaSessionDescriptionHandlers.clear();
  }
  notifyReferer(e) {
    if (!this._referred)
      return;
    if (!(this._referred instanceof ds))
      throw new Error("Referred session not instance of session");
    if (!this._referred.dialog)
      return;
    if (!e.message.statusCode)
      throw new Error("Status code undefined.");
    if (!e.message.reasonPhrase)
      throw new Error("Reason phrase undefined.");
    const r = e.message.statusCode, s = e.message.reasonPhrase, i = `SIP/2.0 ${r} ${s}`.trim(), n = this._referred.dialog.notify(void 0, {
      extraHeaders: ["Event: refer", "Subscription-State: terminated"],
      body: {
        contentDisposition: "render",
        contentType: "message/sipfrag",
        content: i
      }
    });
    n.delegate = {
      onReject: () => {
        this._referred = void 0;
      }
    };
  }
  /**
   * Handle final response to initial INVITE.
   * @param inviteResponse - 2xx response.
   */
  onAccept(e) {
    if (this.logger.log("Inviter.onAccept"), this.state !== _.Establishing)
      return this.logger.error(`Accept received while in state ${this.state}, dropping response`), Promise.reject(new Error(`Invalid session state ${this.state}`));
    const r = e.message, s = e.session;
    switch (r.hasHeader("P-Asserted-Identity") && (this._assertedIdentity = _e.nameAddrHeaderParse(r.getHeader("P-Asserted-Identity"))), s.delegate = {
      onAck: (i) => this.onAckRequest(i),
      onBye: (i) => this.onByeRequest(i),
      onInfo: (i) => this.onInfoRequest(i),
      onInvite: (i) => this.onInviteRequest(i),
      onMessage: (i) => this.onMessageRequest(i),
      onNotify: (i) => this.onNotifyRequest(i),
      onPrack: (i) => this.onPrackRequest(i),
      onRefer: (i) => this.onReferRequest(i)
    }, this._dialog = s, s.signalingState) {
      case $.Initial:
        return this.logger.error("Received 2xx response to INVITE without a session description"), this.ackAndBye(e, 400, "Missing session description"), this.stateTransition(_.Terminated), Promise.reject(new Error("Bad Media Description"));
      case $.HaveLocalOffer:
        return this.logger.error("Received 2xx response to INVITE without a session description"), this.ackAndBye(e, 400, "Missing session description"), this.stateTransition(_.Terminated), Promise.reject(new Error("Bad Media Description"));
      case $.HaveRemoteOffer: {
        if (!this._dialog.offer)
          throw new Error(`Session offer undefined in signaling state ${this._dialog.signalingState}.`);
        const i = {
          sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
          sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
        };
        return this.setOfferAndGetAnswer(this._dialog.offer, i).then((n) => {
          e.ack({ body: n }), this.stateTransition(_.Established);
        }).catch((n) => {
          throw this.ackAndBye(e, 488, "Invalid session description"), this.stateTransition(_.Terminated), n;
        });
      }
      case $.Stable: {
        if (this.earlyMediaSessionDescriptionHandlers.size > 0) {
          const a = this.earlyMediaSessionDescriptionHandlers.get(s.id);
          if (!a)
            throw new Error("Session description handler undefined.");
          return this.setSessionDescriptionHandler(a), this.earlyMediaSessionDescriptionHandlers.delete(s.id), e.ack(), this.stateTransition(_.Established), Promise.resolve();
        }
        if (this.earlyMediaDialog) {
          if (this.earlyMediaDialog !== s) {
            if (this.earlyMedia) {
              const o = "You have set the 'earlyMedia' option to 'true' which requires that your INVITE requests do not fork and yet this INVITE request did in fact fork. Consequentially and not surprisingly the end point which accepted the INVITE (confirmed dialog) does not match the end point with which early media has been setup (early dialog) and thus this session is unable to proceed. In accordance with the SIP specifications, the SIP servers your end point is connected to determine if an INVITE forks and the forking behavior of those servers cannot be controlled by this library. If you wish to use early media with this library you must configure those servers accordingly. Alternatively you may set the 'earlyMedia' to 'false' which will allow this library to function with any INVITE requests which do fork.";
              this.logger.error(o);
            }
            const a = new Error("Early media dialog does not equal confirmed dialog, terminating session");
            return this.logger.error(a.message), this.ackAndBye(e, 488, "Not Acceptable Here"), this.stateTransition(_.Terminated), Promise.reject(a);
          }
          return e.ack(), this.stateTransition(_.Established), Promise.resolve();
        }
        const i = s.answer;
        if (!i)
          throw new Error("Answer is undefined.");
        const n = {
          sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
          sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
        };
        return this.setAnswer(i, n).then(() => {
          let a;
          this._renderbody && this._rendertype && (a = {
            body: { contentDisposition: "render", contentType: this._rendertype, content: this._renderbody }
          }), e.ack(a), this.stateTransition(_.Established);
        }).catch((a) => {
          throw this.logger.error(a.message), this.ackAndBye(e, 488, "Not Acceptable Here"), this.stateTransition(_.Terminated), a;
        });
      }
      case $.Closed:
        return Promise.reject(new Error("Terminated."));
      default:
        throw new Error("Unknown session signaling state.");
    }
  }
  /**
   * Handle provisional response to initial INVITE.
   * @param inviteResponse - 1xx response.
   */
  onProgress(e) {
    var r;
    if (this.logger.log("Inviter.onProgress"), this.state !== _.Establishing)
      return this.logger.error(`Progress received while in state ${this.state}, dropping response`), Promise.reject(new Error(`Invalid session state ${this.state}`));
    if (!this.outgoingInviteRequest)
      throw new Error("Outgoing INVITE request undefined.");
    const s = e.message, i = e.session;
    s.hasHeader("P-Asserted-Identity") && (this._assertedIdentity = _e.nameAddrHeaderParse(s.getHeader("P-Asserted-Identity")));
    const n = s.getHeader("require"), a = s.getHeader("rseq"), c = !!(n && n.includes("100rel") && a ? Number(a) : void 0), l = [];
    switch (c && l.push("RAck: " + s.getHeader("rseq") + " " + s.getHeader("cseq")), i.signalingState) {
      case $.Initial:
        return c && (this.logger.warn("First reliable provisional response received MUST contain an offer when INVITE does not contain an offer."), e.prack({ extraHeaders: l })), Promise.resolve();
      case $.HaveLocalOffer:
        return c && e.prack({ extraHeaders: l }), Promise.resolve();
      case $.HaveRemoteOffer:
        if (!c)
          return this.logger.warn("Non-reliable provisional response MUST NOT contain an initial offer, discarding response."), Promise.resolve();
        {
          const h = this.sessionDescriptionHandlerFactory(this, this.userAgent.configuration.sessionDescriptionHandlerFactoryOptions || {});
          return !((r = this.delegate) === null || r === void 0) && r.onSessionDescriptionHandler && this.delegate.onSessionDescriptionHandler(h, !0), this.earlyMediaSessionDescriptionHandlers.set(i.id, h), h.setDescription(s.body, this.sessionDescriptionHandlerOptions, this.sessionDescriptionHandlerModifiers).then(() => h.getDescription(this.sessionDescriptionHandlerOptions, this.sessionDescriptionHandlerModifiers)).then((f) => {
            const x = {
              contentDisposition: "session",
              contentType: f.contentType,
              content: f.body
            };
            e.prack({ extraHeaders: l, body: x });
          }).catch((f) => {
            throw this.stateTransition(_.Terminated), f;
          });
        }
      case $.Stable:
        if (c && e.prack({ extraHeaders: l }), this.earlyMedia && !this.earlyMediaDialog) {
          this.earlyMediaDialog = i;
          const h = i.answer;
          if (!h)
            throw new Error("Answer is undefined.");
          const f = {
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
          };
          return this.setAnswer(h, f).catch((x) => {
            throw this.stateTransition(_.Terminated), x;
          });
        }
        return Promise.resolve();
      case $.Closed:
        return Promise.reject(new Error("Terminated."));
      default:
        throw new Error("Unknown session signaling state.");
    }
  }
  /**
   * Handle final response to initial INVITE.
   * @param inviteResponse - 3xx response.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRedirect(e) {
    if (this.logger.log("Inviter.onRedirect"), this.state !== _.Establishing && this.state !== _.Terminating) {
      this.logger.error(`Redirect received while in state ${this.state}, dropping response`);
      return;
    }
    this.stateTransition(_.Terminated);
  }
  /**
   * Handle final response to initial INVITE.
   * @param inviteResponse - 4xx, 5xx, or 6xx response.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onReject(e) {
    if (this.logger.log("Inviter.onReject"), this.state !== _.Establishing && this.state !== _.Terminating) {
      this.logger.error(`Reject received while in state ${this.state}, dropping response`);
      return;
    }
    this.stateTransition(_.Terminated);
  }
  /**
   * Handle final response to initial INVITE.
   * @param inviteResponse - 100 response.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTrying(e) {
    if (this.logger.log("Inviter.onTrying"), this.state !== _.Establishing) {
      this.logger.error(`Trying received while in state ${this.state}, dropping response`);
      return;
    }
  }
}
var oe;
(function(t) {
  t.Initial = "Initial", t.Registered = "Registered", t.Unregistered = "Unregistered", t.Terminated = "Terminated";
})(oe = oe || (oe = {}));
class mt {
  /**
   * Constructs a new instance of the `Registerer` class.
   * @param userAgent - User agent. See {@link UserAgent} for details.
   * @param options - Options bucket. See {@link RegistererOptions} for details.
   */
  constructor(e, r = {}) {
    this.disposed = !1, this._contacts = [], this._retryAfter = void 0, this._state = oe.Initial, this._waiting = !1, this._stateEventEmitter = new cs(), this._waitingEventEmitter = new cs(), this.userAgent = e;
    const s = e.configuration.uri.clone();
    if (s.user = void 0, this.options = Object.assign(Object.assign(Object.assign({}, mt.defaultOptions()), { registrar: s }), mt.stripUndefinedProperties(r)), this.options.extraContactHeaderParams = (this.options.extraContactHeaderParams || []).slice(), this.options.extraHeaders = (this.options.extraHeaders || []).slice(), !this.options.registrar)
      throw new Error("Registrar undefined.");
    if (this.options.registrar = this.options.registrar.clone(), this.options.regId && !this.options.instanceId ? this.options.instanceId = this.userAgent.instanceId : !this.options.regId && this.options.instanceId && (this.options.regId = 1), this.options.instanceId && _e.parse(this.options.instanceId, "uuid") === -1)
      throw new Error("Invalid instanceId.");
    if (this.options.regId && this.options.regId < 0)
      throw new Error("Invalid regId.");
    const i = this.options.registrar, n = this.options.params && this.options.params.fromUri || e.userAgentCore.configuration.aor, a = this.options.params && this.options.params.toUri || e.configuration.uri, o = this.options.params || {}, c = (r.extraHeaders || []).slice();
    if (this.request = e.userAgentCore.makeOutgoingRequestMessage(P.REGISTER, i, n, a, o, c, void 0), this.expires = this.options.expires || mt.defaultExpires, this.expires < 0)
      throw new Error("Invalid expires.");
    if (this.refreshFrequency = this.options.refreshFrequency || mt.defaultRefreshFrequency, this.refreshFrequency < 50 || this.refreshFrequency > 99)
      throw new Error("Invalid refresh frequency. The value represents a percentage of the expiration time and should be between 50 and 99.");
    this.logger = e.getLogger("sip.Registerer"), this.options.logConfiguration && (this.logger.log("Configuration:"), Object.keys(this.options).forEach((l) => {
      const h = this.options[l];
      switch (l) {
        case "registrar":
          this.logger.log("· " + l + ": " + h);
          break;
        default:
          this.logger.log("· " + l + ": " + JSON.stringify(h));
      }
    })), this.id = this.request.callId + this.request.from.parameters.tag, this.userAgent._registerers[this.id] = this;
  }
  /** Default registerer options. */
  static defaultOptions() {
    return {
      expires: mt.defaultExpires,
      extraContactHeaderParams: [],
      extraHeaders: [],
      logConfiguration: !0,
      instanceId: "",
      params: {},
      regId: 0,
      registrar: new vt("sip", "anonymous", "anonymous.invalid"),
      refreshFrequency: mt.defaultRefreshFrequency
    };
  }
  /**
   * Strip properties with undefined values from options.
   * This is a work around while waiting for missing vs undefined to be addressed (or not)...
   * https://github.com/Microsoft/TypeScript/issues/13195
   * @param options - Options to reduce
   */
  static stripUndefinedProperties(e) {
    return Object.keys(e).reduce((r, s) => (e[s] !== void 0 && (r[s] = e[s]), r), {});
  }
  /** The registered contacts. */
  get contacts() {
    return this._contacts.slice();
  }
  /**
   * The number of seconds to wait before retrying to register.
   * @defaultValue `undefined`
   * @remarks
   * When the server rejects a registration request, if it provides a suggested
   * duration to wait before retrying, that value is available here when and if
   * the state transitions to `Unsubscribed`. It is also available during the
   * callback to `onReject` after a call to `register`. (Note that if the state
   * if already `Unsubscribed`, a rejected request created by `register` will
   * not cause the state to transition to `Unsubscribed`. One way to avoid this
   * case is to dispose of `Registerer` when unregistered and create a new
   * `Registerer` for any attempts to retry registering.)
   * @example
   * ```ts
   * // Checking for retry after on state change
   * registerer.stateChange.addListener((newState) => {
   *   switch (newState) {
   *     case RegistererState.Unregistered:
   *       const retryAfter = registerer.retryAfter;
   *       break;
   *   }
   * });
   *
   * // Checking for retry after on request rejection
   * registerer.register({
   *   requestDelegate: {
   *     onReject: () => {
   *       const retryAfter = registerer.retryAfter;
   *     }
   *   }
   * });
   * ```
   */
  get retryAfter() {
    return this._retryAfter;
  }
  /** The registration state. */
  get state() {
    return this._state;
  }
  /** Emits when the registerer state changes. */
  get stateChange() {
    return this._stateEventEmitter;
  }
  /** Destructor. */
  dispose() {
    return this.disposed ? Promise.resolve() : (this.disposed = !0, this.logger.log(`Registerer ${this.id} in state ${this.state} is being disposed`), delete this.userAgent._registerers[this.id], new Promise((e) => {
      const r = () => {
        if (!this.waiting && this._state === oe.Registered) {
          this.stateChange.addListener(() => {
            this.terminated(), e();
          }, { once: !0 }), this.unregister();
          return;
        }
        this.terminated(), e();
      };
      this.waiting ? this.waitingChange.addListener(() => {
        r();
      }, { once: !0 }) : r();
    }));
  }
  /**
   * Sends the REGISTER request.
   * @remarks
   * If successful, sends re-REGISTER requests prior to registration expiration until `unsubscribe()` is called.
   * Rejects with `RequestPendingError` if a REGISTER request is already in progress.
   */
  register(e = {}) {
    if (this.state === oe.Terminated)
      throw this.stateError(), new Error("Registerer terminated. Unable to register.");
    if (this.disposed)
      throw this.stateError(), new Error("Registerer disposed. Unable to register.");
    if (this.waiting) {
      this.waitingWarning();
      const i = new rn("REGISTER request already in progress, waiting for final response");
      return Promise.reject(i);
    }
    e.requestOptions && (this.options = Object.assign(Object.assign({}, this.options), e.requestOptions));
    const r = (this.options.extraHeaders || []).slice();
    r.push("Contact: " + this.generateContactHeader(this.expires)), r.push("Allow: " + ["ACK", "CANCEL", "INVITE", "MESSAGE", "BYE", "OPTIONS", "INFO", "NOTIFY", "REFER"].toString()), this.request.cseq++, this.request.setHeader("cseq", this.request.cseq + " REGISTER"), this.request.extraHeaders = r, this.waitingToggle(!0);
    const s = this.userAgent.userAgentCore.register(this.request, {
      onAccept: (i) => {
        let n;
        i.message.hasHeader("expires") && (n = Number(i.message.getHeader("expires"))), this._contacts = i.message.getHeaders("contact");
        let a = this._contacts.length;
        if (!a) {
          this.logger.error("No Contact header in response to REGISTER, dropping response."), this.unregistered();
          return;
        }
        let o;
        for (; a--; ) {
          if (o = i.message.parseHeader("contact", a), !o)
            throw new Error("Contact undefined");
          if (this.userAgent.contact.pubGruu && Fa(o.uri, this.userAgent.contact.pubGruu)) {
            n = Number(o.getParam("expires"));
            break;
          }
          if (this.userAgent.configuration.contactName === "") {
            if (o.uri.user === this.userAgent.contact.uri.user) {
              n = Number(o.getParam("expires"));
              break;
            }
          } else if (Fa(o.uri, this.userAgent.contact.uri)) {
            n = Number(o.getParam("expires"));
            break;
          }
          o = void 0;
        }
        if (o === void 0) {
          this.logger.error("No Contact header pointing to us, dropping response"), this.unregistered(), this.waitingToggle(!1);
          return;
        }
        if (n === void 0) {
          this.logger.error("Contact pointing to us is missing expires parameter, dropping response"), this.unregistered(), this.waitingToggle(!1);
          return;
        }
        if (o.hasParam("temp-gruu")) {
          const c = o.getParam("temp-gruu");
          c && (this.userAgent.contact.tempGruu = _e.URIParse(c.replace(/"/g, "")));
        }
        if (o.hasParam("pub-gruu")) {
          const c = o.getParam("pub-gruu");
          c && (this.userAgent.contact.pubGruu = _e.URIParse(c.replace(/"/g, "")));
        }
        this.registered(n), e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(i), this.waitingToggle(!1);
      },
      onProgress: (i) => {
        e.requestDelegate && e.requestDelegate.onProgress && e.requestDelegate.onProgress(i);
      },
      onRedirect: (i) => {
        this.logger.error("Redirect received. Not supported."), this.unregistered(), e.requestDelegate && e.requestDelegate.onRedirect && e.requestDelegate.onRedirect(i), this.waitingToggle(!1);
      },
      onReject: (i) => {
        if (i.message.statusCode === 423) {
          if (!i.message.hasHeader("min-expires")) {
            this.logger.error("423 response received for REGISTER without Min-Expires, dropping response"), this.unregistered(), this.waitingToggle(!1);
            return;
          }
          this.expires = Number(i.message.getHeader("min-expires")), this.waitingToggle(!1), this.register();
          return;
        }
        this.logger.warn(`Failed to register, status code ${i.message.statusCode}`);
        let n = NaN;
        if (i.message.statusCode === 500 || i.message.statusCode === 503) {
          const a = i.message.getHeader("retry-after");
          a && (n = Number.parseInt(a, void 0));
        }
        this._retryAfter = isNaN(n) ? void 0 : n, this.unregistered(), e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(i), this._retryAfter = void 0, this.waitingToggle(!1);
      },
      onTrying: (i) => {
        e.requestDelegate && e.requestDelegate.onTrying && e.requestDelegate.onTrying(i);
      }
    });
    return Promise.resolve(s);
  }
  /**
   * Sends the REGISTER request with expires equal to zero.
   * @remarks
   * Rejects with `RequestPendingError` if a REGISTER request is already in progress.
   */
  unregister(e = {}) {
    if (this.state === oe.Terminated)
      throw this.stateError(), new Error("Registerer terminated. Unable to register.");
    if (this.disposed && this.state !== oe.Registered)
      throw this.stateError(), new Error("Registerer disposed. Unable to register.");
    if (this.waiting) {
      this.waitingWarning();
      const i = new rn("REGISTER request already in progress, waiting for final response");
      return Promise.reject(i);
    }
    this._state !== oe.Registered && !e.all && this.logger.warn("Not currently registered, but sending an unregister anyway.");
    const r = (e.requestOptions && e.requestOptions.extraHeaders || []).slice();
    this.request.extraHeaders = r, e.all ? (r.push("Contact: *"), r.push("Expires: 0")) : r.push("Contact: " + this.generateContactHeader(0)), this.request.cseq++, this.request.setHeader("cseq", this.request.cseq + " REGISTER"), this.registrationTimer !== void 0 && (clearTimeout(this.registrationTimer), this.registrationTimer = void 0), this.waitingToggle(!0);
    const s = this.userAgent.userAgentCore.register(this.request, {
      onAccept: (i) => {
        this._contacts = i.message.getHeaders("contact"), this.unregistered(), e.requestDelegate && e.requestDelegate.onAccept && e.requestDelegate.onAccept(i), this.waitingToggle(!1);
      },
      onProgress: (i) => {
        e.requestDelegate && e.requestDelegate.onProgress && e.requestDelegate.onProgress(i);
      },
      onRedirect: (i) => {
        this.logger.error("Unregister redirected. Not currently supported."), this.unregistered(), e.requestDelegate && e.requestDelegate.onRedirect && e.requestDelegate.onRedirect(i), this.waitingToggle(!1);
      },
      onReject: (i) => {
        this.logger.error(`Unregister rejected with status code ${i.message.statusCode}`), this.unregistered(), e.requestDelegate && e.requestDelegate.onReject && e.requestDelegate.onReject(i), this.waitingToggle(!1);
      },
      onTrying: (i) => {
        e.requestDelegate && e.requestDelegate.onTrying && e.requestDelegate.onTrying(i);
      }
    });
    return Promise.resolve(s);
  }
  /**
   * Clear registration timers.
   */
  clearTimers() {
    this.registrationTimer !== void 0 && (clearTimeout(this.registrationTimer), this.registrationTimer = void 0), this.registrationExpiredTimer !== void 0 && (clearTimeout(this.registrationExpiredTimer), this.registrationExpiredTimer = void 0);
  }
  /**
   * Generate Contact Header
   */
  generateContactHeader(e) {
    let r = this.userAgent.contact.toString({ register: !0 });
    return this.options.regId && this.options.instanceId && (r += ";reg-id=" + this.options.regId, r += ';+sip.instance="<urn:uuid:' + this.options.instanceId + '>"'), this.options.extraContactHeaderParams && this.options.extraContactHeaderParams.forEach((s) => {
      r += ";" + s;
    }), r += ";expires=" + e, r;
  }
  /**
   * Helper function, called when registered.
   */
  registered(e) {
    this.clearTimers(), this.registrationTimer = setTimeout(() => {
      this.registrationTimer = void 0, this.register();
    }, this.refreshFrequency / 100 * e * 1e3), this.registrationExpiredTimer = setTimeout(() => {
      this.logger.warn("Registration expired"), this.unregistered();
    }, e * 1e3), this._state !== oe.Registered && this.stateTransition(oe.Registered);
  }
  /**
   * Helper function, called when unregistered.
   */
  unregistered() {
    this.clearTimers(), this._state !== oe.Unregistered && this.stateTransition(oe.Unregistered);
  }
  /**
   * Helper function, called when terminated.
   */
  terminated() {
    this.clearTimers(), this._state !== oe.Terminated && this.stateTransition(oe.Terminated);
  }
  /**
   * Transition registration state.
   */
  stateTransition(e) {
    const r = () => {
      throw new Error(`Invalid state transition from ${this._state} to ${e}`);
    };
    switch (this._state) {
      case oe.Initial:
        e !== oe.Registered && e !== oe.Unregistered && e !== oe.Terminated && r();
        break;
      case oe.Registered:
        e !== oe.Unregistered && e !== oe.Terminated && r();
        break;
      case oe.Unregistered:
        e !== oe.Registered && e !== oe.Terminated && r();
        break;
      case oe.Terminated:
        r();
        break;
      default:
        throw new Error("Unrecognized state.");
    }
    this._state = e, this.logger.log(`Registration transitioned to state ${this._state}`), this._stateEventEmitter.emit(this._state), e === oe.Terminated && this.dispose();
  }
  /** True if the registerer is currently waiting for final response to a REGISTER request. */
  get waiting() {
    return this._waiting;
  }
  /** Emits when the registerer waiting state changes. */
  get waitingChange() {
    return this._waitingEventEmitter;
  }
  /**
   * Toggle waiting.
   */
  waitingToggle(e) {
    if (this._waiting === e)
      throw new Error(`Invalid waiting transition from ${this._waiting} to ${e}`);
    this._waiting = e, this.logger.log(`Waiting toggled to ${this._waiting}`), this._waitingEventEmitter.emit(this._waiting);
  }
  /** Hopefully helpful as the standard behavior has been found to be unexpected. */
  waitingWarning() {
    let e = "An attempt was made to send a REGISTER request while a prior one was still in progress.";
    e += " RFC 3261 requires UAs MUST NOT send a new registration until they have received a final response", e += " from the registrar for the previous one or the previous REGISTER request has timed out.", e += " Note that if the transport disconnects, you still must wait for the prior request to time out before", e += " sending a new REGISTER request or alternatively dispose of the current Registerer and create a new Registerer.", this.logger.warn(e);
  }
  /** Hopefully helpful as the standard behavior has been found to be unexpected. */
  stateError() {
    let r = `An attempt was made to send a REGISTER request when the Registerer ${this.state === oe.Terminated ? "is in 'Terminated' state" : "has been disposed"}.`;
    r += " The Registerer transitions to 'Terminated' when Registerer.dispose() is called.", r += " Perhaps you called UserAgent.stop() which dipsoses of all Registerers?", this.logger.error(r);
  }
}
mt.defaultExpires = 600;
mt.defaultRefreshFrequency = 99;
var ee;
(function(t) {
  t.Initial = "Initial", t.NotifyWait = "NotifyWait", t.Pending = "Pending", t.Active = "Active", t.Terminated = "Terminated";
})(ee = ee || (ee = {}));
var j;
(function(t) {
  t.Connecting = "Connecting", t.Connected = "Connected", t.Disconnecting = "Disconnecting", t.Disconnected = "Disconnected";
})(j = j || (j = {}));
var De;
(function(t) {
  t.Started = "Started", t.Stopped = "Stopped";
})(De = De || (De = {}));
class be {
  static hashStr(e, r = !1) {
    return this.onePassHasher.start().appendStr(e).end(r);
  }
  static hashAsciiStr(e, r = !1) {
    return this.onePassHasher.start().appendAsciiStr(e).end(r);
  }
  static _hex(e) {
    const r = be.hexChars, s = be.hexOut;
    let i, n, a, o;
    for (o = 0; o < 4; o += 1)
      for (n = o * 8, i = e[o], a = 0; a < 8; a += 2)
        s[n + 1 + a] = r.charAt(i & 15), i >>>= 4, s[n + 0 + a] = r.charAt(i & 15), i >>>= 4;
    return s.join("");
  }
  static _md5cycle(e, r) {
    let s = e[0], i = e[1], n = e[2], a = e[3];
    s += (i & n | ~i & a) + r[0] - 680876936 | 0, s = (s << 7 | s >>> 25) + i | 0, a += (s & i | ~s & n) + r[1] - 389564586 | 0, a = (a << 12 | a >>> 20) + s | 0, n += (a & s | ~a & i) + r[2] + 606105819 | 0, n = (n << 17 | n >>> 15) + a | 0, i += (n & a | ~n & s) + r[3] - 1044525330 | 0, i = (i << 22 | i >>> 10) + n | 0, s += (i & n | ~i & a) + r[4] - 176418897 | 0, s = (s << 7 | s >>> 25) + i | 0, a += (s & i | ~s & n) + r[5] + 1200080426 | 0, a = (a << 12 | a >>> 20) + s | 0, n += (a & s | ~a & i) + r[6] - 1473231341 | 0, n = (n << 17 | n >>> 15) + a | 0, i += (n & a | ~n & s) + r[7] - 45705983 | 0, i = (i << 22 | i >>> 10) + n | 0, s += (i & n | ~i & a) + r[8] + 1770035416 | 0, s = (s << 7 | s >>> 25) + i | 0, a += (s & i | ~s & n) + r[9] - 1958414417 | 0, a = (a << 12 | a >>> 20) + s | 0, n += (a & s | ~a & i) + r[10] - 42063 | 0, n = (n << 17 | n >>> 15) + a | 0, i += (n & a | ~n & s) + r[11] - 1990404162 | 0, i = (i << 22 | i >>> 10) + n | 0, s += (i & n | ~i & a) + r[12] + 1804603682 | 0, s = (s << 7 | s >>> 25) + i | 0, a += (s & i | ~s & n) + r[13] - 40341101 | 0, a = (a << 12 | a >>> 20) + s | 0, n += (a & s | ~a & i) + r[14] - 1502002290 | 0, n = (n << 17 | n >>> 15) + a | 0, i += (n & a | ~n & s) + r[15] + 1236535329 | 0, i = (i << 22 | i >>> 10) + n | 0, s += (i & a | n & ~a) + r[1] - 165796510 | 0, s = (s << 5 | s >>> 27) + i | 0, a += (s & n | i & ~n) + r[6] - 1069501632 | 0, a = (a << 9 | a >>> 23) + s | 0, n += (a & i | s & ~i) + r[11] + 643717713 | 0, n = (n << 14 | n >>> 18) + a | 0, i += (n & s | a & ~s) + r[0] - 373897302 | 0, i = (i << 20 | i >>> 12) + n | 0, s += (i & a | n & ~a) + r[5] - 701558691 | 0, s = (s << 5 | s >>> 27) + i | 0, a += (s & n | i & ~n) + r[10] + 38016083 | 0, a = (a << 9 | a >>> 23) + s | 0, n += (a & i | s & ~i) + r[15] - 660478335 | 0, n = (n << 14 | n >>> 18) + a | 0, i += (n & s | a & ~s) + r[4] - 405537848 | 0, i = (i << 20 | i >>> 12) + n | 0, s += (i & a | n & ~a) + r[9] + 568446438 | 0, s = (s << 5 | s >>> 27) + i | 0, a += (s & n | i & ~n) + r[14] - 1019803690 | 0, a = (a << 9 | a >>> 23) + s | 0, n += (a & i | s & ~i) + r[3] - 187363961 | 0, n = (n << 14 | n >>> 18) + a | 0, i += (n & s | a & ~s) + r[8] + 1163531501 | 0, i = (i << 20 | i >>> 12) + n | 0, s += (i & a | n & ~a) + r[13] - 1444681467 | 0, s = (s << 5 | s >>> 27) + i | 0, a += (s & n | i & ~n) + r[2] - 51403784 | 0, a = (a << 9 | a >>> 23) + s | 0, n += (a & i | s & ~i) + r[7] + 1735328473 | 0, n = (n << 14 | n >>> 18) + a | 0, i += (n & s | a & ~s) + r[12] - 1926607734 | 0, i = (i << 20 | i >>> 12) + n | 0, s += (i ^ n ^ a) + r[5] - 378558 | 0, s = (s << 4 | s >>> 28) + i | 0, a += (s ^ i ^ n) + r[8] - 2022574463 | 0, a = (a << 11 | a >>> 21) + s | 0, n += (a ^ s ^ i) + r[11] + 1839030562 | 0, n = (n << 16 | n >>> 16) + a | 0, i += (n ^ a ^ s) + r[14] - 35309556 | 0, i = (i << 23 | i >>> 9) + n | 0, s += (i ^ n ^ a) + r[1] - 1530992060 | 0, s = (s << 4 | s >>> 28) + i | 0, a += (s ^ i ^ n) + r[4] + 1272893353 | 0, a = (a << 11 | a >>> 21) + s | 0, n += (a ^ s ^ i) + r[7] - 155497632 | 0, n = (n << 16 | n >>> 16) + a | 0, i += (n ^ a ^ s) + r[10] - 1094730640 | 0, i = (i << 23 | i >>> 9) + n | 0, s += (i ^ n ^ a) + r[13] + 681279174 | 0, s = (s << 4 | s >>> 28) + i | 0, a += (s ^ i ^ n) + r[0] - 358537222 | 0, a = (a << 11 | a >>> 21) + s | 0, n += (a ^ s ^ i) + r[3] - 722521979 | 0, n = (n << 16 | n >>> 16) + a | 0, i += (n ^ a ^ s) + r[6] + 76029189 | 0, i = (i << 23 | i >>> 9) + n | 0, s += (i ^ n ^ a) + r[9] - 640364487 | 0, s = (s << 4 | s >>> 28) + i | 0, a += (s ^ i ^ n) + r[12] - 421815835 | 0, a = (a << 11 | a >>> 21) + s | 0, n += (a ^ s ^ i) + r[15] + 530742520 | 0, n = (n << 16 | n >>> 16) + a | 0, i += (n ^ a ^ s) + r[2] - 995338651 | 0, i = (i << 23 | i >>> 9) + n | 0, s += (n ^ (i | ~a)) + r[0] - 198630844 | 0, s = (s << 6 | s >>> 26) + i | 0, a += (i ^ (s | ~n)) + r[7] + 1126891415 | 0, a = (a << 10 | a >>> 22) + s | 0, n += (s ^ (a | ~i)) + r[14] - 1416354905 | 0, n = (n << 15 | n >>> 17) + a | 0, i += (a ^ (n | ~s)) + r[5] - 57434055 | 0, i = (i << 21 | i >>> 11) + n | 0, s += (n ^ (i | ~a)) + r[12] + 1700485571 | 0, s = (s << 6 | s >>> 26) + i | 0, a += (i ^ (s | ~n)) + r[3] - 1894986606 | 0, a = (a << 10 | a >>> 22) + s | 0, n += (s ^ (a | ~i)) + r[10] - 1051523 | 0, n = (n << 15 | n >>> 17) + a | 0, i += (a ^ (n | ~s)) + r[1] - 2054922799 | 0, i = (i << 21 | i >>> 11) + n | 0, s += (n ^ (i | ~a)) + r[8] + 1873313359 | 0, s = (s << 6 | s >>> 26) + i | 0, a += (i ^ (s | ~n)) + r[15] - 30611744 | 0, a = (a << 10 | a >>> 22) + s | 0, n += (s ^ (a | ~i)) + r[6] - 1560198380 | 0, n = (n << 15 | n >>> 17) + a | 0, i += (a ^ (n | ~s)) + r[13] + 1309151649 | 0, i = (i << 21 | i >>> 11) + n | 0, s += (n ^ (i | ~a)) + r[4] - 145523070 | 0, s = (s << 6 | s >>> 26) + i | 0, a += (i ^ (s | ~n)) + r[11] - 1120210379 | 0, a = (a << 10 | a >>> 22) + s | 0, n += (s ^ (a | ~i)) + r[2] + 718787259 | 0, n = (n << 15 | n >>> 17) + a | 0, i += (a ^ (n | ~s)) + r[9] - 343485551 | 0, i = (i << 21 | i >>> 11) + n | 0, e[0] = s + e[0] | 0, e[1] = i + e[1] | 0, e[2] = n + e[2] | 0, e[3] = a + e[3] | 0;
  }
  constructor() {
    this._dataLength = 0, this._bufferLength = 0, this._state = new Int32Array(4), this._buffer = new ArrayBuffer(68), this._buffer8 = new Uint8Array(this._buffer, 0, 68), this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
  }
  start() {
    return this._dataLength = 0, this._bufferLength = 0, this._state.set(be.stateIdentity), this;
  }
  // Char to code point to to array conversion:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
  // #Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
  appendStr(e) {
    const r = this._buffer8, s = this._buffer32;
    let i = this._bufferLength, n, a;
    for (a = 0; a < e.length; a += 1) {
      if (n = e.charCodeAt(a), n < 128)
        r[i++] = n;
      else if (n < 2048)
        r[i++] = (n >>> 6) + 192, r[i++] = n & 63 | 128;
      else if (n < 55296 || n > 56319)
        r[i++] = (n >>> 12) + 224, r[i++] = n >>> 6 & 63 | 128, r[i++] = n & 63 | 128;
      else {
        if (n = (n - 55296) * 1024 + (e.charCodeAt(++a) - 56320) + 65536, n > 1114111)
          throw new Error("Unicode standard supports code points up to U+10FFFF");
        r[i++] = (n >>> 18) + 240, r[i++] = n >>> 12 & 63 | 128, r[i++] = n >>> 6 & 63 | 128, r[i++] = n & 63 | 128;
      }
      i >= 64 && (this._dataLength += 64, be._md5cycle(this._state, s), i -= 64, s[0] = s[16]);
    }
    return this._bufferLength = i, this;
  }
  appendAsciiStr(e) {
    const r = this._buffer8, s = this._buffer32;
    let i = this._bufferLength, n, a = 0;
    for (; ; ) {
      for (n = Math.min(e.length - a, 64 - i); n--; )
        r[i++] = e.charCodeAt(a++);
      if (i < 64)
        break;
      this._dataLength += 64, be._md5cycle(this._state, s), i = 0;
    }
    return this._bufferLength = i, this;
  }
  appendByteArray(e) {
    const r = this._buffer8, s = this._buffer32;
    let i = this._bufferLength, n, a = 0;
    for (; ; ) {
      for (n = Math.min(e.length - a, 64 - i); n--; )
        r[i++] = e[a++];
      if (i < 64)
        break;
      this._dataLength += 64, be._md5cycle(this._state, s), i = 0;
    }
    return this._bufferLength = i, this;
  }
  getState() {
    const e = this, r = e._state;
    return {
      buffer: String.fromCharCode.apply(null, e._buffer8),
      buflen: e._bufferLength,
      length: e._dataLength,
      state: [r[0], r[1], r[2], r[3]]
    };
  }
  setState(e) {
    const r = e.buffer, s = e.state, i = this._state;
    let n;
    for (this._dataLength = e.length, this._bufferLength = e.buflen, i[0] = s[0], i[1] = s[1], i[2] = s[2], i[3] = s[3], n = 0; n < r.length; n += 1)
      this._buffer8[n] = r.charCodeAt(n);
  }
  end(e = !1) {
    const r = this._bufferLength, s = this._buffer8, i = this._buffer32, n = (r >> 2) + 1;
    let a;
    if (this._dataLength += r, s[r] = 128, s[r + 1] = s[r + 2] = s[r + 3] = 0, i.set(be.buffer32Identity.subarray(n), n), r > 55 && (be._md5cycle(this._state, i), i.set(be.buffer32Identity)), a = this._dataLength * 8, a <= 4294967295)
      i[14] = a;
    else {
      const o = a.toString(16).match(/(.*?)(.{0,8})$/);
      if (o === null)
        return;
      const c = parseInt(o[2], 16), l = parseInt(o[1], 16) || 0;
      i[14] = c, i[15] = l;
    }
    return be._md5cycle(this._state, i), e ? this._state : be._hex(this._state);
  }
}
be.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
be.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
be.hexChars = "0123456789abcdef";
be.hexOut = [];
be.onePassHasher = new be();
be.hashStr("hello") !== "5d41402abc4b2a76b9719d911017c592" && console.error("Md5 self test failed.");
function Bt(t) {
  return be.hashStr(t);
}
class Hh {
  /**
   * Constructor.
   * @param loggerFactory - LoggerFactory.
   * @param username - Username.
   * @param password - Password.
   */
  constructor(e, r, s, i) {
    this.logger = e.getLogger("sipjs.digestauthentication"), this.username = s, this.password = i, this.ha1 = r, this.nc = 0, this.ncHex = "00000000";
  }
  /**
   * Performs Digest authentication given a SIP request and the challenge
   * received in a response to that request.
   * @param request -
   * @param challenge -
   * @returns true if credentials were successfully generated, false otherwise.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authenticate(e, r, s) {
    if (this.algorithm = r.algorithm, this.realm = r.realm, this.nonce = r.nonce, this.opaque = r.opaque, this.stale = r.stale, this.algorithm) {
      if (this.algorithm !== "MD5")
        return this.logger.warn("challenge with Digest algorithm different than 'MD5', authentication aborted"), !1;
    } else
      this.algorithm = "MD5";
    if (!this.realm)
      return this.logger.warn("challenge without Digest realm, authentication aborted"), !1;
    if (!this.nonce)
      return this.logger.warn("challenge without Digest nonce, authentication aborted"), !1;
    if (r.qop)
      if (r.qop.indexOf("auth") > -1)
        this.qop = "auth";
      else if (r.qop.indexOf("auth-int") > -1)
        this.qop = "auth-int";
      else
        return this.logger.warn("challenge without Digest qop different than 'auth' or 'auth-int', authentication aborted"), !1;
    else
      this.qop = void 0;
    return this.method = e.method, this.uri = e.ruri, this.cnonce = cr(12), this.nc += 1, this.updateNcHex(), this.nc === 4294967296 && (this.nc = 1, this.ncHex = "00000001"), this.calculateResponse(s), !0;
  }
  /**
   * Return the Proxy-Authorization or WWW-Authorization header value.
   */
  toString() {
    const e = [];
    if (!this.response)
      throw new Error("response field does not exist, cannot generate Authorization header");
    return e.push("algorithm=" + this.algorithm), e.push('username="' + this.username + '"'), e.push('realm="' + this.realm + '"'), e.push('nonce="' + this.nonce + '"'), e.push('uri="' + this.uri + '"'), e.push('response="' + this.response + '"'), this.opaque && e.push('opaque="' + this.opaque + '"'), this.qop && (e.push("qop=" + this.qop), e.push('cnonce="' + this.cnonce + '"'), e.push("nc=" + this.ncHex)), "Digest " + e.join(", ");
  }
  /**
   * Generate the 'nc' value as required by Digest in this.ncHex by reading this.nc.
   */
  updateNcHex() {
    const e = Number(this.nc).toString(16);
    this.ncHex = "00000000".substr(0, 8 - e.length) + e;
  }
  /**
   * Generate Digest 'response' value.
   */
  calculateResponse(e) {
    let r, s;
    r = this.ha1, (r === "" || r === void 0) && (r = Bt(this.username + ":" + this.realm + ":" + this.password)), this.qop === "auth" ? (s = Bt(this.method + ":" + this.uri), this.response = Bt(r + ":" + this.nonce + ":" + this.ncHex + ":" + this.cnonce + ":auth:" + s)) : this.qop === "auth-int" ? (s = Bt(this.method + ":" + this.uri + ":" + Bt(e || "")), this.response = Bt(r + ":" + this.nonce + ":" + this.ncHex + ":" + this.cnonce + ":auth-int:" + s)) : this.qop === void 0 && (s = Bt(this.method + ":" + this.uri), this.response = Bt(r + ":" + this.nonce + ":" + s));
  }
}
var Ee;
(function(t) {
  t[t.error = 0] = "error", t[t.warn = 1] = "warn", t[t.log = 2] = "log", t[t.debug = 3] = "debug";
})(Ee = Ee || (Ee = {}));
class Na {
  constructor(e, r, s) {
    this.logger = e, this.category = r, this.label = s;
  }
  error(e) {
    this.genericLog(Ee.error, e);
  }
  warn(e) {
    this.genericLog(Ee.warn, e);
  }
  log(e) {
    this.genericLog(Ee.log, e);
  }
  debug(e) {
    this.genericLog(Ee.debug, e);
  }
  genericLog(e, r) {
    this.logger.genericLog(e, this.category, this.label, r);
  }
  get level() {
    return this.logger.level;
  }
  set level(e) {
    this.logger.level = e;
  }
}
class Oh {
  constructor() {
    this.builtinEnabled = !0, this._level = Ee.log, this.loggers = {}, this.logger = this.getLogger("sip:loggerfactory");
  }
  get level() {
    return this._level;
  }
  set level(e) {
    e >= 0 && e <= 3 ? this._level = e : e > 3 ? this._level = 3 : Ee.hasOwnProperty(e) ? this._level = e : this.logger.error("invalid 'level' parameter value: " + JSON.stringify(e));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get connector() {
    return this._connector;
  }
  set connector(e) {
    e ? typeof e == "function" ? this._connector = e : this.logger.error("invalid 'connector' parameter value: " + JSON.stringify(e)) : this._connector = void 0;
  }
  getLogger(e, r) {
    if (r && this.level === 3)
      return new Na(this, e, r);
    if (this.loggers[e])
      return this.loggers[e];
    {
      const s = new Na(this, e);
      return this.loggers[e] = s, s;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  genericLog(e, r, s, i) {
    this.level >= e && this.builtinEnabled && this.print(e, r, s, i), this.connector && this.connector(Ee[e], r, s, i);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  print(e, r, s, i) {
    if (typeof i == "string") {
      const n = [/* @__PURE__ */ new Date(), r];
      s && n.push(s), i = n.concat(i).join(" | ");
    }
    switch (e) {
      case Ee.error:
        console.error(i);
        break;
      case Ee.warn:
        console.warn(i);
        break;
      case Ee.log:
        console.log(i);
        break;
      case Ee.debug:
        console.debug(i);
        break;
    }
  }
}
var Ps;
(function(t) {
  function e(i, n) {
    let a = n, o = 0, c = 0;
    if (i.substring(a, a + 2).match(/(^\r\n)/))
      return -2;
    for (; o === 0; ) {
      if (c = i.indexOf(`\r
`, a), c === -1)
        return c;
      !i.substring(c + 2, c + 4).match(/(^\r\n)/) && i.charAt(c + 2).match(/(^\s+)/) ? a = c + 2 : o = c;
    }
    return o;
  }
  t.getHeader = e;
  function r(i, n, a, o) {
    const c = n.indexOf(":", a), l = n.substring(a, c).trim(), h = n.substring(c + 1, o).trim();
    let f;
    switch (l.toLowerCase()) {
      case "via":
      case "v":
        i.addHeader("via", h), i.getHeaders("via").length === 1 ? (f = i.parseHeader("Via"), f && (i.via = f, i.viaBranch = f.branch)) : f = 0;
        break;
      case "from":
      case "f":
        i.setHeader("from", h), f = i.parseHeader("from"), f && (i.from = f, i.fromTag = f.getParam("tag"));
        break;
      case "to":
      case "t":
        i.setHeader("to", h), f = i.parseHeader("to"), f && (i.to = f, i.toTag = f.getParam("tag"));
        break;
      case "record-route":
        if (f = _e.parse(h, "Record_Route"), f === -1) {
          f = void 0;
          break;
        }
        if (!(f instanceof Array)) {
          f = void 0;
          break;
        }
        f.forEach((x) => {
          i.addHeader("record-route", h.substring(x.position, x.offset)), i.headers["Record-Route"][i.getHeaders("record-route").length - 1].parsed = x.parsed;
        });
        break;
      case "call-id":
      case "i":
        i.setHeader("call-id", h), f = i.parseHeader("call-id"), f && (i.callId = h);
        break;
      case "contact":
      case "m":
        if (f = _e.parse(h, "Contact"), f === -1) {
          f = void 0;
          break;
        }
        if (!(f instanceof Array)) {
          f = void 0;
          break;
        }
        f.forEach((x) => {
          i.addHeader("contact", h.substring(x.position, x.offset)), i.headers.Contact[i.getHeaders("contact").length - 1].parsed = x.parsed;
        });
        break;
      case "content-length":
      case "l":
        i.setHeader("content-length", h), f = i.parseHeader("content-length");
        break;
      case "content-type":
      case "c":
        i.setHeader("content-type", h), f = i.parseHeader("content-type");
        break;
      case "cseq":
        i.setHeader("cseq", h), f = i.parseHeader("cseq"), f && (i.cseq = f.value), i instanceof tr && (i.method = f.method);
        break;
      case "max-forwards":
        i.setHeader("max-forwards", h), f = i.parseHeader("max-forwards");
        break;
      case "www-authenticate":
        i.setHeader("www-authenticate", h), f = i.parseHeader("www-authenticate");
        break;
      case "proxy-authenticate":
        i.setHeader("proxy-authenticate", h), f = i.parseHeader("proxy-authenticate");
        break;
      case "refer-to":
      case "r":
        i.setHeader("refer-to", h), f = i.parseHeader("refer-to"), f && (i.referTo = f);
        break;
      default:
        i.addHeader(l.toLowerCase(), h), f = 0;
    }
    return f === void 0 ? {
      error: "error parsing header '" + l + "'"
    } : !0;
  }
  t.parseHeader = r;
  function s(i, n) {
    let a = 0, o = i.indexOf(`\r
`);
    if (o === -1) {
      n.warn("no CRLF found, not a SIP message, discarded");
      return;
    }
    const c = i.substring(0, o), l = _e.parse(c, "Request_Response");
    let h;
    if (l === -1) {
      n.warn('error parsing first line of SIP message: "' + c + '"');
      return;
    } else
      l.status_code ? (h = new tr(), h.statusCode = l.status_code, h.reasonPhrase = l.reason_phrase) : (h = new $r(), h.method = l.method, h.ruri = l.uri);
    h.data = i, a = o + 2;
    let f;
    for (; ; ) {
      if (o = e(i, a), o === -2) {
        f = a + 2;
        break;
      } else if (o === -1) {
        n.error("malformed message");
        return;
      }
      const x = r(h, i, a, o);
      if (x && x !== !0) {
        n.error(x.error);
        return;
      }
      a = o + 2;
    }
    return h.hasHeader("content-length") ? h.body = i.substr(f, Number(h.getHeader("content-length"))) : h.body = i.substring(f), h;
  }
  t.parseMessage = s;
})(Ps = Ps || (Ps = {}));
function jo(t, e) {
  const r = `\r
`;
  if (e.statusCode < 100 || e.statusCode > 699)
    throw new TypeError("Invalid statusCode: " + e.statusCode);
  const s = e.reasonPhrase ? e.reasonPhrase : oi(e.statusCode);
  let i = "SIP/2.0 " + e.statusCode + " " + s + r;
  e.statusCode >= 100 && e.statusCode < 200, e.statusCode;
  const n = "From: " + t.getHeader("From") + r, a = "Call-ID: " + t.callId + r, o = "CSeq: " + t.cseq + " " + t.method + r, c = t.getHeaders("via").reduce((O, W) => O + "Via: " + W + r, "");
  let l = "To: " + t.getHeader("to");
  if (e.statusCode > 100 && !t.parseHeader("to").hasParam("tag")) {
    let O = e.toTag;
    O || (O = ci()), l += ";tag=" + O;
  }
  l += r;
  let h = "";
  e.supported && (h = "Supported: " + e.supported.join(", ") + r);
  let f = "";
  e.userAgent && (f = "User-Agent: " + e.userAgent + r);
  let x = "";
  return e.extraHeaders && (x = e.extraHeaders.reduce((O, W) => O + W.trim() + r, "")), i += c, i += n, i += l, i += o, i += a, i += h, i += f, i += x, e.body ? (i += "Content-Type: " + e.body.contentType + r, i += "Content-Length: " + ls(e.body.content) + r + r, i += e.body.content) : i += "Content-Length: 0" + r + r, { message: i };
}
class Mi extends gr {
  constructor(e) {
    super(e || "Unspecified transport error.");
  }
}
class Yo {
  constructor(e, r, s, i, n) {
    this._transport = e, this._user = r, this._id = s, this._state = i, this.listeners = new Array(), this.logger = r.loggerFactory.getLogger(n, s), this.logger.debug(`Constructing ${this.typeToString()} with id ${this.id}.`);
  }
  /**
   * Destructor.
   * Once the transaction is in the "terminated" state, it is destroyed
   * immediately and there is no need to call `dispose`. However, if a
   * transaction needs to be ended prematurely, the transaction user may
   * do so by calling this method (for example, perhaps the UA is shutting down).
   * No state transition will occur upon calling this method, all outstanding
   * transmission timers will be cancelled, and use of the transaction after
   * calling `dispose` is undefined.
   */
  dispose() {
    this.logger.debug(`Destroyed ${this.typeToString()} with id ${this.id}.`);
  }
  /** Transaction id. */
  get id() {
    return this._id;
  }
  /** Transaction kind. Deprecated. */
  get kind() {
    throw new Error("Invalid kind.");
  }
  /** Transaction state. */
  get state() {
    return this._state;
  }
  /** Transaction transport. */
  get transport() {
    return this._transport;
  }
  /**
   * Sets up a function that will be called whenever the transaction state changes.
   * @param listener - Callback function.
   * @param options - An options object that specifies characteristics about the listener.
   *                  If once true, indicates that the listener should be invoked at most once after being added.
   *                  If once true, the listener would be automatically removed when invoked.
   */
  addStateChangeListener(e, r) {
    const s = () => {
      this.removeStateChangeListener(s), e();
    };
    (r == null ? void 0 : r.once) === !0 ? this.listeners.push(s) : this.listeners.push(e);
  }
  /**
   * This is currently public so tests may spy on it.
   * @internal
   */
  notifyStateChangeListeners() {
    this.listeners.slice().forEach((e) => e());
  }
  /**
   * Removes a listener previously registered with addStateListener.
   * @param listener - Callback function.
   */
  removeStateChangeListener(e) {
    this.listeners = this.listeners.filter((r) => r !== e);
  }
  logTransportError(e, r) {
    this.logger.error(e.message), this.logger.error(`Transport error occurred in ${this.typeToString()} with id ${this.id}.`), this.logger.error(r);
  }
  /**
   * Pass message to transport for transmission. If transport fails,
   * the transaction user is notified by callback to onTransportError().
   * @returns
   * Rejects with `TransportError` if transport fails.
   */
  send(e) {
    return this.transport.send(e).catch((r) => {
      if (r instanceof Mi)
        throw this.onTransportError(r), r;
      let s;
      throw r && typeof r.message == "string" ? s = new Mi(r.message) : s = new Mi(), this.onTransportError(s), s;
    });
  }
  setState(e) {
    this.logger.debug(`State change to "${e}" on ${this.typeToString()} with id ${this.id}.`), this._state = e, this._user.onStateChange && this._user.onStateChange(e), this.notifyStateChangeListeners();
  }
  typeToString() {
    return "UnknownType";
  }
}
class Bo extends Yo {
  constructor(e, r, s, i, n) {
    super(r, s, e.viaBranch, i, n), this._request = e, this.user = s;
  }
  /** The incoming request the transaction handling. */
  get request() {
    return this._request;
  }
}
var y;
(function(t) {
  t.Accepted = "Accepted", t.Calling = "Calling", t.Completed = "Completed", t.Confirmed = "Confirmed", t.Proceeding = "Proceeding", t.Terminated = "Terminated", t.Trying = "Trying";
})(y = y || (y = {}));
class Ue extends Bo {
  /**
   * Constructor.
   * Upon construction, a "100 Trying" reply will be immediately sent.
   * After construction the transaction will be in the "proceeding" state and the transaction
   * `id` will equal the branch parameter set in the Via header of the incoming request.
   * https://tools.ietf.org/html/rfc3261#section-17.2.1
   * @param request - Incoming INVITE request from the transport.
   * @param transport - The transport.
   * @param user - The transaction user.
   */
  constructor(e, r, s) {
    super(e, r, s, y.Proceeding, "sip.transaction.ist");
  }
  /**
   * Destructor.
   */
  dispose() {
    this.stopProgressExtensionTimer(), this.H && (clearTimeout(this.H), this.H = void 0), this.I && (clearTimeout(this.I), this.I = void 0), this.L && (clearTimeout(this.L), this.L = void 0), super.dispose();
  }
  /** Transaction kind. Deprecated. */
  get kind() {
    return "ist";
  }
  /**
   * Receive requests from transport matching this transaction.
   * @param request - Request matching this transaction.
   */
  receiveRequest(e) {
    switch (this.state) {
      case y.Proceeding:
        if (e.method === P.INVITE) {
          this.lastProvisionalResponse && this.send(this.lastProvisionalResponse).catch((s) => {
            this.logTransportError(s, "Failed to send retransmission of provisional response.");
          });
          return;
        }
        break;
      case y.Accepted:
        if (e.method === P.INVITE)
          return;
        break;
      case y.Completed:
        if (e.method === P.INVITE) {
          if (!this.lastFinalResponse)
            throw new Error("Last final response undefined.");
          this.send(this.lastFinalResponse).catch((s) => {
            this.logTransportError(s, "Failed to send retransmission of final response.");
          });
          return;
        }
        if (e.method === P.ACK) {
          this.stateTransition(y.Confirmed);
          return;
        }
        break;
      case y.Confirmed:
        if (e.method === P.INVITE || e.method === P.ACK)
          return;
        break;
      case y.Terminated:
        if (e.method === P.INVITE || e.method === P.ACK)
          return;
        break;
      default:
        throw new Error(`Invalid state ${this.state}`);
    }
    const r = `INVITE server transaction received unexpected ${e.method} request while in state ${this.state}.`;
    this.logger.warn(r);
  }
  /**
   * Receive responses from TU for this transaction.
   * @param statusCode - Status code of response.
   * @param response - Response.
   */
  receiveResponse(e, r) {
    if (e < 100 || e > 699)
      throw new Error(`Invalid status code ${e}`);
    switch (this.state) {
      case y.Proceeding:
        if (e >= 100 && e <= 199) {
          this.lastProvisionalResponse = r, e > 100 && this.startProgressExtensionTimer(), this.send(r).catch((i) => {
            this.logTransportError(i, "Failed to send 1xx response.");
          });
          return;
        }
        if (e >= 200 && e <= 299) {
          this.lastFinalResponse = r, this.stateTransition(y.Accepted), this.send(r).catch((i) => {
            this.logTransportError(i, "Failed to send 2xx response.");
          });
          return;
        }
        if (e >= 300 && e <= 699) {
          this.lastFinalResponse = r, this.stateTransition(y.Completed), this.send(r).catch((i) => {
            this.logTransportError(i, "Failed to send non-2xx final response.");
          });
          return;
        }
        break;
      case y.Accepted:
        if (e >= 200 && e <= 299) {
          this.send(r).catch((i) => {
            this.logTransportError(i, "Failed to send 2xx response.");
          });
          return;
        }
        break;
      case y.Completed:
        break;
      case y.Confirmed:
        break;
      case y.Terminated:
        break;
      default:
        throw new Error(`Invalid state ${this.state}`);
    }
    const s = `INVITE server transaction received unexpected ${e} response from TU while in state ${this.state}.`;
    throw this.logger.error(s), new Error(s);
  }
  /**
   * Retransmit the last 2xx response. This is a noop if not in the "accepted" state.
   */
  retransmitAcceptedResponse() {
    this.state === y.Accepted && this.lastFinalResponse && this.send(this.lastFinalResponse).catch((e) => {
      this.logTransportError(e, "Failed to send 2xx response.");
    });
  }
  /**
   * First, the procedures in [4] are followed, which attempt to deliver the response to a backup.
   * If those should all fail, based on the definition of failure in [4], the server transaction SHOULD
   * inform the TU that a failure has occurred, and MUST remain in the current state.
   * https://tools.ietf.org/html/rfc6026#section-8.8
   */
  onTransportError(e) {
    this.user.onTransportError && this.user.onTransportError(e);
  }
  /** For logging. */
  typeToString() {
    return "INVITE server transaction";
  }
  /**
   * Execute a state transition.
   * @param newState - New state.
   */
  stateTransition(e) {
    const r = () => {
      throw new Error(`Invalid state transition from ${this.state} to ${e}`);
    };
    switch (e) {
      case y.Proceeding:
        r();
        break;
      case y.Accepted:
      case y.Completed:
        this.state !== y.Proceeding && r();
        break;
      case y.Confirmed:
        this.state !== y.Completed && r();
        break;
      case y.Terminated:
        this.state !== y.Accepted && this.state !== y.Completed && this.state !== y.Confirmed && r();
        break;
      default:
        r();
    }
    this.stopProgressExtensionTimer(), e === y.Accepted && (this.L = setTimeout(() => this.timerL(), Se.TIMER_L)), e === y.Completed && (this.H = setTimeout(() => this.timerH(), Se.TIMER_H)), e === y.Confirmed && (this.I = setTimeout(() => this.timerI(), Se.TIMER_I)), e === y.Terminated && this.dispose(), this.setState(e);
  }
  /**
   * FIXME: UAS Provisional Retransmission Timer. See RFC 3261 Section 13.3.1.1
   * This is in the wrong place. This is not a transaction level thing. It's a UAS level thing.
   */
  startProgressExtensionTimer() {
    this.progressExtensionTimer === void 0 && (this.progressExtensionTimer = setInterval(() => {
      if (this.logger.debug(`Progress extension timer expired for INVITE server transaction ${this.id}.`), !this.lastProvisionalResponse)
        throw new Error("Last provisional response undefined.");
      this.send(this.lastProvisionalResponse).catch((e) => {
        this.logTransportError(e, "Failed to send retransmission of provisional response.");
      });
    }, Se.PROVISIONAL_RESPONSE_INTERVAL));
  }
  /**
   * FIXME: UAS Provisional Retransmission Timer id. See RFC 3261 Section 13.3.1.1
   * This is in the wrong place. This is not a transaction level thing. It's a UAS level thing.
   */
  stopProgressExtensionTimer() {
    this.progressExtensionTimer !== void 0 && (clearInterval(this.progressExtensionTimer), this.progressExtensionTimer = void 0);
  }
  /**
   * While in the "Proceeding" state, if the TU passes a response with status code
   * from 300 to 699 to the server transaction, the response MUST be passed to the
   * transport layer for transmission, and the state machine MUST enter the "Completed" state.
   * For unreliable transports, timer G is set to fire in T1 seconds, and is not set to fire for
   * reliable transports. If timer G fires, the response is passed to the transport layer once
   * more for retransmission, and timer G is set to fire in MIN(2*T1, T2) seconds. From then on,
   * when timer G fires, the response is passed to the transport again for transmission, and
   * timer G is reset with a value that doubles, unless that value exceeds T2, in which case
   * it is reset with the value of T2.
   * https://tools.ietf.org/html/rfc3261#section-17.2.1
   */
  timerG() {
  }
  /**
   * If timer H fires while in the "Completed" state, it implies that the ACK was never received.
   * In this case, the server transaction MUST transition to the "Terminated" state, and MUST
   * indicate to the TU that a transaction failure has occurred.
   * https://tools.ietf.org/html/rfc3261#section-17.2.1
   */
  timerH() {
    this.logger.debug(`Timer H expired for INVITE server transaction ${this.id}.`), this.state === y.Completed && (this.logger.warn("ACK to negative final response was never received, terminating transaction."), this.stateTransition(y.Terminated));
  }
  /**
   * Once timer I fires, the server MUST transition to the "Terminated" state.
   * https://tools.ietf.org/html/rfc3261#section-17.2.1
   */
  timerI() {
    this.logger.debug(`Timer I expired for INVITE server transaction ${this.id}.`), this.stateTransition(y.Terminated);
  }
  /**
   * When Timer L fires and the state machine is in the "Accepted" state, the machine MUST
   * transition to the "Terminated" state. Once the transaction is in the "Terminated" state,
   * it MUST be destroyed immediately. Timer L reflects the amount of time the server
   * transaction could receive 2xx responses for retransmission from the
   * TU while it is waiting to receive an ACK.
   * https://tools.ietf.org/html/rfc6026#section-7.1
   * https://tools.ietf.org/html/rfc6026#section-8.7
   */
  timerL() {
    this.logger.debug(`Timer L expired for INVITE server transaction ${this.id}.`), this.state === y.Accepted && this.stateTransition(y.Terminated);
  }
}
class li extends Yo {
  constructor(e, r, s, i, n) {
    super(r, s, li.makeId(e), i, n), this._request = e, this.user = s, e.setViaHeader(this.id, r.protocol);
  }
  static makeId(e) {
    if (e.method === "CANCEL") {
      if (!e.branch)
        throw new Error("Outgoing CANCEL request without a branch.");
      return e.branch;
    } else
      return "z9hG4bK" + Math.floor(Math.random() * 1e7);
  }
  /** The outgoing request the transaction handling. */
  get request() {
    return this._request;
  }
  /**
   * A 408 to non-INVITE will always arrive too late to be useful ([3]),
   * The client already has full knowledge of the timeout. The only
   * information this message would convey is whether or not the server
   * believed the transaction timed out. However, with the current design
   * of the NIT, a client cannot do anything with this knowledge. Thus,
   * the 408 is simply wasting network resources and contributes to the
   * response bombardment illustrated in [3].
   * https://tools.ietf.org/html/rfc4320#section-4.1
   */
  onRequestTimeout() {
    this.user.onRequestTimeout && this.user.onRequestTimeout();
  }
}
class We extends li {
  /**
   * Constructor
   * Upon construction, the outgoing request's Via header is updated by calling `setViaHeader`.
   * Then `toString` is called on the outgoing request and the message is sent via the transport.
   * After construction the transaction will be in the "calling" state and the transaction id
   * will equal the branch parameter set in the Via header of the outgoing request.
   * https://tools.ietf.org/html/rfc3261#section-17.1.2
   * @param request - The outgoing Non-INVITE request.
   * @param transport - The transport.
   * @param user - The transaction user.
   */
  constructor(e, r, s) {
    super(e, r, s, y.Trying, "sip.transaction.nict"), this.F = setTimeout(() => this.timerF(), Se.TIMER_F), this.send(e.toString()).catch((i) => {
      this.logTransportError(i, "Failed to send initial outgoing request.");
    });
  }
  /**
   * Destructor.
   */
  dispose() {
    this.F && (clearTimeout(this.F), this.F = void 0), this.K && (clearTimeout(this.K), this.K = void 0), super.dispose();
  }
  /** Transaction kind. Deprecated. */
  get kind() {
    return "nict";
  }
  /**
   * Handler for incoming responses from the transport which match this transaction.
   * @param response - The incoming response.
   */
  receiveResponse(e) {
    const r = e.statusCode;
    if (!r || r < 100 || r > 699)
      throw new Error(`Invalid status code ${r}`);
    switch (this.state) {
      case y.Trying:
        if (r >= 100 && r <= 199) {
          this.stateTransition(y.Proceeding), this.user.receiveResponse && this.user.receiveResponse(e);
          return;
        }
        if (r >= 200 && r <= 699) {
          if (this.stateTransition(y.Completed), r === 408) {
            this.onRequestTimeout();
            return;
          }
          this.user.receiveResponse && this.user.receiveResponse(e);
          return;
        }
        break;
      case y.Proceeding:
        if (r >= 100 && r <= 199 && this.user.receiveResponse)
          return this.user.receiveResponse(e);
        if (r >= 200 && r <= 699) {
          if (this.stateTransition(y.Completed), r === 408) {
            this.onRequestTimeout();
            return;
          }
          this.user.receiveResponse && this.user.receiveResponse(e);
          return;
        }
        break;
      case y.Completed:
        return;
      case y.Terminated:
        return;
      default:
        throw new Error(`Invalid state ${this.state}`);
    }
    const s = `Non-INVITE client transaction received unexpected ${r} response while in state ${this.state}.`;
    this.logger.warn(s);
  }
  /**
   * The client transaction SHOULD inform the TU that a transport failure has occurred,
   * and the client transaction SHOULD transition directly to the "Terminated" state.
   * The TU will handle the fail over mechanisms described in [4].
   * https://tools.ietf.org/html/rfc3261#section-17.1.4
   * @param error - Transport error
   */
  onTransportError(e) {
    this.user.onTransportError && this.user.onTransportError(e), this.stateTransition(y.Terminated, !0);
  }
  /** For logging. */
  typeToString() {
    return "non-INVITE client transaction";
  }
  /**
   * Execute a state transition.
   * @param newState - New state.
   */
  stateTransition(e, r = !1) {
    const s = () => {
      throw new Error(`Invalid state transition from ${this.state} to ${e}`);
    };
    switch (e) {
      case y.Trying:
        s();
        break;
      case y.Proceeding:
        this.state !== y.Trying && s();
        break;
      case y.Completed:
        this.state !== y.Trying && this.state !== y.Proceeding && s();
        break;
      case y.Terminated:
        this.state !== y.Trying && this.state !== y.Proceeding && this.state !== y.Completed && (r || s());
        break;
      default:
        s();
    }
    e === y.Completed && (this.F && (clearTimeout(this.F), this.F = void 0), this.K = setTimeout(() => this.timerK(), Se.TIMER_K)), e === y.Terminated && this.dispose(), this.setState(e);
  }
  /**
   * If Timer F fires while the client transaction is still in the
   * "Trying" state, the client transaction SHOULD inform the TU about the
   * timeout, and then it SHOULD enter the "Terminated" state.
   * If timer F fires while in the "Proceeding" state, the TU MUST be informed of
   * a timeout, and the client transaction MUST transition to the terminated state.
   * https://tools.ietf.org/html/rfc3261#section-17.1.2.2
   */
  timerF() {
    this.logger.debug(`Timer F expired for non-INVITE client transaction ${this.id}.`), (this.state === y.Trying || this.state === y.Proceeding) && (this.onRequestTimeout(), this.stateTransition(y.Terminated));
  }
  /**
   * If Timer K fires while in this (COMPLETED) state, the client transaction
   * MUST transition to the "Terminated" state.
   * https://tools.ietf.org/html/rfc3261#section-17.1.2.2
   */
  timerK() {
    this.state === y.Completed && this.stateTransition(y.Terminated);
  }
}
class Fr {
  /**
   * Dialog constructor.
   * @param core - User agent core.
   * @param dialogState - Initial dialog state.
   */
  constructor(e, r) {
    this.core = e, this.dialogState = r, this.core.dialogs.set(this.id, this);
  }
  /**
   * When a UAC receives a response that establishes a dialog, it
   * constructs the state of the dialog.  This state MUST be maintained
   * for the duration of the dialog.
   * https://tools.ietf.org/html/rfc3261#section-12.1.2
   * @param outgoingRequestMessage - Outgoing request message for dialog.
   * @param incomingResponseMessage - Incoming response message creating dialog.
   */
  static initialDialogStateForUserAgentClient(e, r) {
    const i = r.getHeaders("record-route").reverse(), n = r.parseHeader("contact");
    if (!n)
      throw new Error("Contact undefined.");
    if (!(n instanceof qe))
      throw new Error("Contact not instance of NameAddrHeader.");
    const a = n.uri, o = e.cseq, c = void 0, l = e.callId, h = e.fromTag, f = r.toTag;
    if (!l)
      throw new Error("Call id undefined.");
    if (!h)
      throw new Error("From tag undefined.");
    if (!f)
      throw new Error("To tag undefined.");
    if (!e.from)
      throw new Error("From undefined.");
    if (!e.to)
      throw new Error("To undefined.");
    const x = e.from.uri, O = e.to.uri;
    if (!r.statusCode)
      throw new Error("Incoming response status code undefined.");
    const W = r.statusCode < 200;
    return {
      id: l + h + f,
      early: W,
      callId: l,
      localTag: h,
      remoteTag: f,
      localSequenceNumber: o,
      remoteSequenceNumber: c,
      localURI: x,
      remoteURI: O,
      remoteTarget: a,
      routeSet: i,
      secure: !1
    };
  }
  /**
   * The UAS then constructs the state of the dialog.  This state MUST be
   * maintained for the duration of the dialog.
   * https://tools.ietf.org/html/rfc3261#section-12.1.1
   * @param incomingRequestMessage - Incoming request message creating dialog.
   * @param toTag - Tag in the To field in the response to the incoming request.
   */
  static initialDialogStateForUserAgentServer(e, r, s = !1) {
    const n = e.getHeaders("record-route"), a = e.parseHeader("contact");
    if (!a)
      throw new Error("Contact undefined.");
    if (!(a instanceof qe))
      throw new Error("Contact not instance of NameAddrHeader.");
    const o = a.uri, c = e.cseq, l = void 0, h = e.callId, f = r, x = e.fromTag, O = e.from.uri, W = e.to.uri;
    return {
      id: h + f + x,
      early: s,
      callId: h,
      localTag: f,
      remoteTag: x,
      localSequenceNumber: l,
      remoteSequenceNumber: c,
      localURI: W,
      remoteURI: O,
      remoteTarget: o,
      routeSet: n,
      secure: !1
    };
  }
  /** Destructor. */
  dispose() {
    this.core.dialogs.delete(this.id);
  }
  /**
   * A dialog is identified at each UA with a dialog ID, which consists of
   * a Call-ID value, a local tag and a remote tag.  The dialog ID at each
   * UA involved in the dialog is not the same.  Specifically, the local
   * tag at one UA is identical to the remote tag at the peer UA.  The
   * tags are opaque tokens that facilitate the generation of unique
   * dialog IDs.
   * https://tools.ietf.org/html/rfc3261#section-12
   */
  get id() {
    return this.dialogState.id;
  }
  /**
   * A dialog can also be in the "early" state, which occurs when it is
   * created with a provisional response, and then it transition to the
   * "confirmed" state when a 2xx final response received or is sent.
   *
   * Note: RFC 3261 is concise on when a dialog is "confirmed", but it
   * can be a point of confusion if an INVITE dialog is "confirmed" after
   * a 2xx is sent or after receiving the ACK for the 2xx response.
   * With careful reading it can be inferred a dialog is always is
   * "confirmed" when the 2xx is sent (regardless of type of dialog).
   * However a INVITE dialog does have additional considerations
   * when it is confirmed but an ACK has not yet been received (in
   * particular with regard to a callee sending BYE requests).
   */
  get early() {
    return this.dialogState.early;
  }
  /** Call identifier component of the dialog id. */
  get callId() {
    return this.dialogState.callId;
  }
  /** Local tag component of the dialog id. */
  get localTag() {
    return this.dialogState.localTag;
  }
  /** Remote tag component of the dialog id. */
  get remoteTag() {
    return this.dialogState.remoteTag;
  }
  /** Local sequence number (used to order requests from the UA to its peer). */
  get localSequenceNumber() {
    return this.dialogState.localSequenceNumber;
  }
  /** Remote sequence number (used to order requests from its peer to the UA). */
  get remoteSequenceNumber() {
    return this.dialogState.remoteSequenceNumber;
  }
  /** Local URI. */
  get localURI() {
    return this.dialogState.localURI;
  }
  /** Remote URI. */
  get remoteURI() {
    return this.dialogState.remoteURI;
  }
  /** Remote target. */
  get remoteTarget() {
    return this.dialogState.remoteTarget;
  }
  /**
   * Route set, which is an ordered list of URIs. The route set is the
   * list of servers that need to be traversed to send a request to the peer.
   */
  get routeSet() {
    return this.dialogState.routeSet;
  }
  /**
   * If the request was sent over TLS, and the Request-URI contained
   * a SIPS URI, the "secure" flag is set to true. *NOT IMPLEMENTED*
   */
  get secure() {
    return this.dialogState.secure;
  }
  /** The user agent core servicing this dialog. */
  get userAgentCore() {
    return this.core;
  }
  /** Confirm the dialog. Only matters if dialog is currently early. */
  confirm() {
    this.dialogState.early = !1;
  }
  /**
   * Requests sent within a dialog, as any other requests, are atomic.  If
   * a particular request is accepted by the UAS, all the state changes
   * associated with it are performed.  If the request is rejected, none
   * of the state changes are performed.
   *
   *    Note that some requests, such as INVITEs, affect several pieces of
   *    state.
   *
   * https://tools.ietf.org/html/rfc3261#section-12.2.2
   * @param message - Incoming request message within this dialog.
   */
  receiveRequest(e) {
    if (e.method !== P.ACK) {
      if (this.remoteSequenceNumber) {
        if (e.cseq <= this.remoteSequenceNumber)
          throw new Error("Out of sequence in dialog request. Did you forget to call sequenceGuard()?");
        this.dialogState.remoteSequenceNumber = e.cseq;
      }
      this.remoteSequenceNumber || (this.dialogState.remoteSequenceNumber = e.cseq);
    }
  }
  /**
   * If the dialog identifier in the 2xx response matches the dialog
   * identifier of an existing dialog, the dialog MUST be transitioned to
   * the "confirmed" state, and the route set for the dialog MUST be
   * recomputed based on the 2xx response using the procedures of Section
   * 12.2.1.2.  Otherwise, a new dialog in the "confirmed" state MUST be
   * constructed using the procedures of Section 12.1.2.
   *
   * Note that the only piece of state that is recomputed is the route
   * set.  Other pieces of state such as the highest sequence numbers
   * (remote and local) sent within the dialog are not recomputed.  The
   * route set only is recomputed for backwards compatibility.  RFC
   * 2543 did not mandate mirroring of the Record-Route header field in
   * a 1xx, only 2xx.  However, we cannot update the entire state of
   * the dialog, since mid-dialog requests may have been sent within
   * the early dialog, modifying the sequence numbers, for example.
   *
   *  https://tools.ietf.org/html/rfc3261#section-13.2.2.4
   */
  recomputeRouteSet(e) {
    this.dialogState.routeSet = e.getHeaders("record-route").reverse();
  }
  /**
   * A request within a dialog is constructed by using many of the
   * components of the state stored as part of the dialog.
   * https://tools.ietf.org/html/rfc3261#section-12.2.1.1
   * @param method - Outgoing request method.
   */
  createOutgoingRequestMessage(e, r) {
    const s = this.remoteURI, i = this.remoteTag, n = this.localURI, a = this.localTag, o = this.callId;
    let c;
    r && r.cseq ? c = r.cseq : this.dialogState.localSequenceNumber ? c = this.dialogState.localSequenceNumber += 1 : c = this.dialogState.localSequenceNumber = 1;
    const l = this.remoteTarget, h = this.routeSet, f = r && r.extraHeaders, x = r && r.body;
    return this.userAgentCore.makeOutgoingRequestMessage(e, l, n, s, {
      callId: o,
      cseq: c,
      fromTag: a,
      toTag: i,
      routeSet: h
    }, f, x);
  }
  /**
   * Increment the local sequence number by one.
   * It feels like this should be protected, but the current authentication handling currently
   * needs this to keep the dialog in sync when "auto re-sends" request messages.
   * @internal
   */
  incrementLocalSequenceNumber() {
    if (!this.dialogState.localSequenceNumber)
      throw new Error("Local sequence number undefined.");
    this.dialogState.localSequenceNumber += 1;
  }
  /**
   * If the remote sequence number was not empty, but the sequence number
   * of the request is lower than the remote sequence number, the request
   * is out of order and MUST be rejected with a 500 (Server Internal
   * Error) response.
   * https://tools.ietf.org/html/rfc3261#section-12.2.2
   * @param request - Incoming request to guard.
   * @returns True if the program execution is to continue in the branch in question.
   *          Otherwise a 500 Server Internal Error was stateless sent and request processing must stop.
   */
  sequenceGuard(e) {
    return e.method === P.ACK ? !0 : this.remoteSequenceNumber && e.cseq <= this.remoteSequenceNumber ? (this.core.replyStateless(e, { statusCode: 500 }), !1) : !0;
  }
}
class Kt extends li {
  /**
   * Constructor.
   * Upon construction, the outgoing request's Via header is updated by calling `setViaHeader`.
   * Then `toString` is called on the outgoing request and the message is sent via the transport.
   * After construction the transaction will be in the "calling" state and the transaction id
   * will equal the branch parameter set in the Via header of the outgoing request.
   * https://tools.ietf.org/html/rfc3261#section-17.1.1
   * @param request - The outgoing INVITE request.
   * @param transport - The transport.
   * @param user - The transaction user.
   */
  constructor(e, r, s) {
    super(e, r, s, y.Calling, "sip.transaction.ict"), this.ackRetransmissionCache = /* @__PURE__ */ new Map(), this.B = setTimeout(() => this.timerB(), Se.TIMER_B), this.send(e.toString()).catch((i) => {
      this.logTransportError(i, "Failed to send initial outgoing request.");
    });
  }
  /**
   * Destructor.
   */
  dispose() {
    this.B && (clearTimeout(this.B), this.B = void 0), this.D && (clearTimeout(this.D), this.D = void 0), this.M && (clearTimeout(this.M), this.M = void 0), super.dispose();
  }
  /** Transaction kind. Deprecated. */
  get kind() {
    return "ict";
  }
  /**
   * ACK a 2xx final response.
   *
   * The transaction includes the ACK only if the final response was not a 2xx response (the
   * transaction will generate and send the ACK to the transport automagically). If the
   * final response was a 2xx, the ACK is not considered part of the transaction (the
   * transaction user needs to generate and send the ACK).
   *
   * This library is not strictly RFC compliant with regard to ACK handling for 2xx final
   * responses. Specifically, retransmissions of ACKs to a 2xx final responses is handled
   * by the transaction layer (instead of the UAC core). The "standard" approach is for
   * the UAC core to receive all 2xx responses and manage sending ACK retransmissions to
   * the transport directly. Herein the transaction layer manages sending ACKs to 2xx responses
   * and any retransmissions of those ACKs as needed.
   *
   * @param ack - The outgoing ACK request.
   */
  ackResponse(e) {
    const r = e.toTag;
    if (!r)
      throw new Error("To tag undefined.");
    const s = "z9hG4bK" + Math.floor(Math.random() * 1e7);
    e.setViaHeader(s, this.transport.protocol), this.ackRetransmissionCache.set(r, e), this.send(e.toString()).catch((i) => {
      this.logTransportError(i, "Failed to send ACK to 2xx response.");
    });
  }
  /**
   * Handler for incoming responses from the transport which match this transaction.
   * @param response - The incoming response.
   */
  receiveResponse(e) {
    const r = e.statusCode;
    if (!r || r < 100 || r > 699)
      throw new Error(`Invalid status code ${r}`);
    switch (this.state) {
      case y.Calling:
        if (r >= 100 && r <= 199) {
          this.stateTransition(y.Proceeding), this.user.receiveResponse && this.user.receiveResponse(e);
          return;
        }
        if (r >= 200 && r <= 299) {
          this.ackRetransmissionCache.set(e.toTag, void 0), this.stateTransition(y.Accepted), this.user.receiveResponse && this.user.receiveResponse(e);
          return;
        }
        if (r >= 300 && r <= 699) {
          this.stateTransition(y.Completed), this.ack(e), this.user.receiveResponse && this.user.receiveResponse(e);
          return;
        }
        break;
      case y.Proceeding:
        if (r >= 100 && r <= 199) {
          this.user.receiveResponse && this.user.receiveResponse(e);
          return;
        }
        if (r >= 200 && r <= 299) {
          this.ackRetransmissionCache.set(e.toTag, void 0), this.stateTransition(y.Accepted), this.user.receiveResponse && this.user.receiveResponse(e);
          return;
        }
        if (r >= 300 && r <= 699) {
          this.stateTransition(y.Completed), this.ack(e), this.user.receiveResponse && this.user.receiveResponse(e);
          return;
        }
        break;
      case y.Accepted:
        if (r >= 200 && r <= 299) {
          if (!this.ackRetransmissionCache.has(e.toTag)) {
            this.ackRetransmissionCache.set(e.toTag, void 0), this.user.receiveResponse && this.user.receiveResponse(e);
            return;
          }
          const i = this.ackRetransmissionCache.get(e.toTag);
          if (i) {
            this.send(i.toString()).catch((n) => {
              this.logTransportError(n, "Failed to send retransmission of ACK to 2xx response.");
            });
            return;
          }
          return;
        }
        break;
      case y.Completed:
        if (r >= 300 && r <= 699) {
          this.ack(e);
          return;
        }
        break;
      case y.Terminated:
        break;
      default:
        throw new Error(`Invalid state ${this.state}`);
    }
    const s = `Received unexpected ${r} response while in state ${this.state}.`;
    this.logger.warn(s);
  }
  /**
   * The client transaction SHOULD inform the TU that a transport failure
   * has occurred, and the client transaction SHOULD transition directly
   * to the "Terminated" state.  The TU will handle the failover
   * mechanisms described in [4].
   * https://tools.ietf.org/html/rfc3261#section-17.1.4
   * @param error - The error.
   */
  onTransportError(e) {
    this.user.onTransportError && this.user.onTransportError(e), this.stateTransition(y.Terminated, !0);
  }
  /** For logging. */
  typeToString() {
    return "INVITE client transaction";
  }
  ack(e) {
    const r = this.request.ruri, s = this.request.callId, i = this.request.cseq, n = this.request.getHeader("from"), a = e.getHeader("to"), o = this.request.getHeader("via"), c = this.request.getHeader("route");
    if (!n)
      throw new Error("From undefined.");
    if (!a)
      throw new Error("To undefined.");
    if (!o)
      throw new Error("Via undefined.");
    let l = `ACK ${r} SIP/2.0\r
`;
    c && (l += `Route: ${c}\r
`), l += `Via: ${o}\r
`, l += `To: ${a}\r
`, l += `From: ${n}\r
`, l += `Call-ID: ${s}\r
`, l += `CSeq: ${i} ACK\r
`, l += `Max-Forwards: 70\r
`, l += `Content-Length: 0\r
\r
`, this.send(l).catch((h) => {
      this.logTransportError(h, "Failed to send ACK to non-2xx response.");
    });
  }
  /**
   * Execute a state transition.
   * @param newState - New state.
   */
  stateTransition(e, r = !1) {
    const s = () => {
      throw new Error(`Invalid state transition from ${this.state} to ${e}`);
    };
    switch (e) {
      case y.Calling:
        s();
        break;
      case y.Proceeding:
        this.state !== y.Calling && s();
        break;
      case y.Accepted:
      case y.Completed:
        this.state !== y.Calling && this.state !== y.Proceeding && s();
        break;
      case y.Terminated:
        this.state !== y.Calling && this.state !== y.Accepted && this.state !== y.Completed && (r || s());
        break;
      default:
        s();
    }
    this.B && (clearTimeout(this.B), this.B = void 0), y.Proceeding, e === y.Completed && (this.D = setTimeout(() => this.timerD(), Se.TIMER_D)), e === y.Accepted && (this.M = setTimeout(() => this.timerM(), Se.TIMER_M)), e === y.Terminated && this.dispose(), this.setState(e);
  }
  /**
   * When timer A fires, the client transaction MUST retransmit the
   * request by passing it to the transport layer, and MUST reset the
   * timer with a value of 2*T1.
   * When timer A fires 2*T1 seconds later, the request MUST be
   * retransmitted again (assuming the client transaction is still in this
   * state). This process MUST continue so that the request is
   * retransmitted with intervals that double after each transmission.
   * These retransmissions SHOULD only be done while the client
   * transaction is in the "Calling" state.
   * https://tools.ietf.org/html/rfc3261#section-17.1.1.2
   */
  timerA() {
  }
  /**
   * If the client transaction is still in the "Calling" state when timer
   * B fires, the client transaction SHOULD inform the TU that a timeout
   * has occurred.  The client transaction MUST NOT generate an ACK.
   * https://tools.ietf.org/html/rfc3261#section-17.1.1.2
   */
  timerB() {
    this.logger.debug(`Timer B expired for INVITE client transaction ${this.id}.`), this.state === y.Calling && (this.onRequestTimeout(), this.stateTransition(y.Terminated));
  }
  /**
   * If Timer D fires while the client transaction is in the "Completed" state,
   * the client transaction MUST move to the "Terminated" state.
   * https://tools.ietf.org/html/rfc6026#section-8.4
   */
  timerD() {
    this.logger.debug(`Timer D expired for INVITE client transaction ${this.id}.`), this.state === y.Completed && this.stateTransition(y.Terminated);
  }
  /**
   * If Timer M fires while the client transaction is in the "Accepted"
   * state, the client transaction MUST move to the "Terminated" state.
   * https://tools.ietf.org/html/rfc6026#section-8.4
   */
  timerM() {
    this.logger.debug(`Timer M expired for INVITE client transaction ${this.id}.`), this.state === y.Accepted && this.stateTransition(y.Terminated);
  }
}
class ke {
  constructor(e, r, s, i) {
    this.transactionConstructor = e, this.core = r, this.message = s, this.delegate = i, this.challenged = !1, this.stale = !1, this.logger = this.loggerFactory.getLogger("sip.user-agent-client"), this.init();
  }
  dispose() {
    this.transaction.dispose();
  }
  get loggerFactory() {
    return this.core.loggerFactory;
  }
  /** The transaction associated with this request. */
  get transaction() {
    if (!this._transaction)
      throw new Error("Transaction undefined.");
    return this._transaction;
  }
  /**
   * Since requests other than INVITE are responded to immediately, sending a
   * CANCEL for a non-INVITE request would always create a race condition.
   * A CANCEL request SHOULD NOT be sent to cancel a request other than INVITE.
   * https://tools.ietf.org/html/rfc3261#section-9.1
   * @param options - Cancel options bucket.
   */
  cancel(e, r = {}) {
    if (!this.transaction)
      throw new Error("Transaction undefined.");
    if (!this.message.to)
      throw new Error("To undefined.");
    if (!this.message.from)
      throw new Error("From undefined.");
    const s = this.core.makeOutgoingRequestMessage(P.CANCEL, this.message.ruri, this.message.from.uri, this.message.to.uri, {
      toTag: this.message.toTag,
      fromTag: this.message.fromTag,
      callId: this.message.callId,
      cseq: this.message.cseq
    }, r.extraHeaders);
    return s.branch = this.message.branch, this.message.headers.Route && (s.headers.Route = this.message.headers.Route), e && s.setHeader("Reason", e), this.transaction.state === y.Proceeding ? new ke(We, this.core, s) : this.transaction.addStateChangeListener(() => {
      this.transaction && this.transaction.state === y.Proceeding && new ke(We, this.core, s);
    }, { once: !0 }), s;
  }
  /**
   * If a 401 (Unauthorized) or 407 (Proxy Authentication Required)
   * response is received, the UAC SHOULD follow the authorization
   * procedures of Section 22.2 and Section 22.3 to retry the request with
   * credentials.
   * https://tools.ietf.org/html/rfc3261#section-8.1.3.5
   * 22 Usage of HTTP Authentication
   * https://tools.ietf.org/html/rfc3261#section-22
   * 22.1 Framework
   * https://tools.ietf.org/html/rfc3261#section-22.1
   * 22.2 User-to-User Authentication
   * https://tools.ietf.org/html/rfc3261#section-22.2
   * 22.3 Proxy-to-User Authentication
   * https://tools.ietf.org/html/rfc3261#section-22.3
   *
   * FIXME: This "guard for and retry the request with credentials"
   * implementation is not complete and at best minimally passable.
   * @param response - The incoming response to guard.
   * @param dialog - If defined, the dialog within which the response was received.
   * @returns True if the program execution is to continue in the branch in question.
   *          Otherwise the request is retried with credentials and current request processing must stop.
   */
  authenticationGuard(e, r) {
    const s = e.statusCode;
    if (!s)
      throw new Error("Response status code undefined.");
    if (s !== 401 && s !== 407)
      return !0;
    let i, n;
    if (s === 401 ? (i = e.parseHeader("www-authenticate"), n = "authorization") : (i = e.parseHeader("proxy-authenticate"), n = "proxy-authorization"), !i)
      return this.logger.warn(s + " with wrong or missing challenge, cannot authenticate"), !0;
    if (this.challenged && (this.stale || i.stale !== !0))
      return this.logger.warn(s + " apparently in authentication loop, cannot authenticate"), !0;
    if (!this.credentials && (this.credentials = this.core.configuration.authenticationFactory(), !this.credentials))
      return this.logger.warn("Unable to obtain credentials, cannot authenticate"), !0;
    if (!this.credentials.authenticate(this.message, i))
      return !0;
    this.challenged = !0, i.stale && (this.stale = !0);
    let a = this.message.cseq += 1;
    return r && r.localSequenceNumber && (r.incrementLocalSequenceNumber(), a = this.message.cseq = r.localSequenceNumber), this.message.setHeader("cseq", a + " " + this.message.method), this.message.setHeader(n, this.credentials.toString()), this.init(), !1;
  }
  /**
   * 8.1.3.1 Transaction Layer Errors
   * In some cases, the response returned by the transaction layer will
   * not be a SIP message, but rather a transaction layer error.  When a
   * timeout error is received from the transaction layer, it MUST be
   * treated as if a 408 (Request Timeout) status code has been received.
   * If a fatal transport error is reported by the transport layer
   * (generally, due to fatal ICMP errors in UDP or connection failures in
   * TCP), the condition MUST be treated as a 503 (Service Unavailable)
   * status code.
   * https://tools.ietf.org/html/rfc3261#section-8.1.3.1
   */
  onRequestTimeout() {
    this.logger.warn("User agent client request timed out. Generating internal 408 Request Timeout.");
    const e = new tr();
    e.statusCode = 408, e.reasonPhrase = "Request Timeout", this.receiveResponse(e);
  }
  /**
   * 8.1.3.1 Transaction Layer Errors
   * In some cases, the response returned by the transaction layer will
   * not be a SIP message, but rather a transaction layer error.  When a
   * timeout error is received from the transaction layer, it MUST be
   * treated as if a 408 (Request Timeout) status code has been received.
   * If a fatal transport error is reported by the transport layer
   * (generally, due to fatal ICMP errors in UDP or connection failures in
   * TCP), the condition MUST be treated as a 503 (Service Unavailable)
   * status code.
   * https://tools.ietf.org/html/rfc3261#section-8.1.3.1
   * @param error - Transport error
   */
  onTransportError(e) {
    this.logger.error(e.message), this.logger.error("User agent client request transport error. Generating internal 503 Service Unavailable.");
    const r = new tr();
    r.statusCode = 503, r.reasonPhrase = "Service Unavailable", this.receiveResponse(r);
  }
  /**
   * Receive a response from the transaction layer.
   * @param message - Incoming response message.
   */
  receiveResponse(e) {
    if (!this.authenticationGuard(e))
      return;
    const r = e.statusCode ? e.statusCode.toString() : "";
    if (!r)
      throw new Error("Response status code undefined.");
    switch (!0) {
      case /^100$/.test(r):
        this.delegate && this.delegate.onTrying && this.delegate.onTrying({ message: e });
        break;
      case /^1[0-9]{2}$/.test(r):
        this.delegate && this.delegate.onProgress && this.delegate.onProgress({ message: e });
        break;
      case /^2[0-9]{2}$/.test(r):
        this.delegate && this.delegate.onAccept && this.delegate.onAccept({ message: e });
        break;
      case /^3[0-9]{2}$/.test(r):
        this.delegate && this.delegate.onRedirect && this.delegate.onRedirect({ message: e });
        break;
      case /^[4-6][0-9]{2}$/.test(r):
        this.delegate && this.delegate.onReject && this.delegate.onReject({ message: e });
        break;
      default:
        throw new Error(`Invalid status code ${r}`);
    }
  }
  init() {
    const e = {
      loggerFactory: this.loggerFactory,
      onRequestTimeout: () => this.onRequestTimeout(),
      onStateChange: (i) => {
        i === y.Terminated && (this.core.userAgentClients.delete(s), r === this._transaction && this.dispose());
      },
      onTransportError: (i) => this.onTransportError(i),
      receiveResponse: (i) => this.receiveResponse(i)
    }, r = new this.transactionConstructor(this.message, this.core.transport, e);
    this._transaction = r;
    const s = r.id + r.request.method;
    this.core.userAgentClients.set(s, this);
  }
}
class Mh extends ke {
  constructor(e, r, s) {
    const i = e.createOutgoingRequestMessage(P.BYE, s);
    super(We, e.userAgentCore, i, r), e.dispose();
  }
}
class Be extends Bo {
  /**
   * Constructor.
   * After construction the transaction will be in the "trying": state and the transaction
   * `id` will equal the branch parameter set in the Via header of the incoming request.
   * https://tools.ietf.org/html/rfc3261#section-17.2.2
   * @param request - Incoming Non-INVITE request from the transport.
   * @param transport - The transport.
   * @param user - The transaction user.
   */
  constructor(e, r, s) {
    super(e, r, s, y.Trying, "sip.transaction.nist");
  }
  /**
   * Destructor.
   */
  dispose() {
    this.J && (clearTimeout(this.J), this.J = void 0), super.dispose();
  }
  /** Transaction kind. Deprecated. */
  get kind() {
    return "nist";
  }
  /**
   * Receive requests from transport matching this transaction.
   * @param request - Request matching this transaction.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  receiveRequest(e) {
    switch (this.state) {
      case y.Trying:
        break;
      case y.Proceeding:
        if (!this.lastResponse)
          throw new Error("Last response undefined.");
        this.send(this.lastResponse).catch((r) => {
          this.logTransportError(r, "Failed to send retransmission of provisional response.");
        });
        break;
      case y.Completed:
        if (!this.lastResponse)
          throw new Error("Last response undefined.");
        this.send(this.lastResponse).catch((r) => {
          this.logTransportError(r, "Failed to send retransmission of final response.");
        });
        break;
      case y.Terminated:
        break;
      default:
        throw new Error(`Invalid state ${this.state}`);
    }
  }
  /**
   * Receive responses from TU for this transaction.
   * @param statusCode - Status code of response. 101-199 not allowed per RFC 4320.
   * @param response - Response to send.
   */
  receiveResponse(e, r) {
    if (e < 100 || e > 699)
      throw new Error(`Invalid status code ${e}`);
    if (e > 100 && e <= 199)
      throw new Error("Provisional response other than 100 not allowed.");
    switch (this.state) {
      case y.Trying:
        if (this.lastResponse = r, e >= 100 && e < 200) {
          this.stateTransition(y.Proceeding), this.send(r).catch((i) => {
            this.logTransportError(i, "Failed to send provisional response.");
          });
          return;
        }
        if (e >= 200 && e <= 699) {
          this.stateTransition(y.Completed), this.send(r).catch((i) => {
            this.logTransportError(i, "Failed to send final response.");
          });
          return;
        }
        break;
      case y.Proceeding:
        if (this.lastResponse = r, e >= 200 && e <= 699) {
          this.stateTransition(y.Completed), this.send(r).catch((i) => {
            this.logTransportError(i, "Failed to send final response.");
          });
          return;
        }
        break;
      case y.Completed:
        return;
      case y.Terminated:
        break;
      default:
        throw new Error(`Invalid state ${this.state}`);
    }
    const s = `Non-INVITE server transaction received unexpected ${e} response from TU while in state ${this.state}.`;
    throw this.logger.error(s), new Error(s);
  }
  /**
   * First, the procedures in [4] are followed, which attempt to deliver the response to a backup.
   * If those should all fail, based on the definition of failure in [4], the server transaction SHOULD
   * inform the TU that a failure has occurred, and SHOULD transition to the terminated state.
   * https://tools.ietf.org/html/rfc3261#section-17.2.4
   */
  onTransportError(e) {
    this.user.onTransportError && this.user.onTransportError(e), this.stateTransition(y.Terminated, !0);
  }
  /** For logging. */
  typeToString() {
    return "non-INVITE server transaction";
  }
  stateTransition(e, r = !1) {
    const s = () => {
      throw new Error(`Invalid state transition from ${this.state} to ${e}`);
    };
    switch (e) {
      case y.Trying:
        s();
        break;
      case y.Proceeding:
        this.state !== y.Trying && s();
        break;
      case y.Completed:
        this.state !== y.Trying && this.state !== y.Proceeding && s();
        break;
      case y.Terminated:
        this.state !== y.Proceeding && this.state !== y.Completed && (r || s());
        break;
      default:
        s();
    }
    e === y.Completed && (this.J = setTimeout(() => this.timerJ(), Se.TIMER_J)), e === y.Terminated && this.dispose(), this.setState(e);
  }
  /**
   * The server transaction remains in this state until Timer J fires,
   * at which point it MUST transition to the "Terminated" state.
   * https://tools.ietf.org/html/rfc3261#section-17.2.2
   */
  timerJ() {
    this.logger.debug(`Timer J expired for NON-INVITE server transaction ${this.id}.`), this.state === y.Completed && this.stateTransition(y.Terminated);
  }
}
class xt {
  constructor(e, r, s, i) {
    this.transactionConstructor = e, this.core = r, this.message = s, this.delegate = i, this.logger = this.loggerFactory.getLogger("sip.user-agent-server"), this.toTag = s.toTag ? s.toTag : ci(), this.init();
  }
  dispose() {
    this.transaction.dispose();
  }
  get loggerFactory() {
    return this.core.loggerFactory;
  }
  /** The transaction associated with this request. */
  get transaction() {
    if (!this._transaction)
      throw new Error("Transaction undefined.");
    return this._transaction;
  }
  accept(e = { statusCode: 200 }) {
    if (!this.acceptable)
      throw new Vt(`${this.message.method} not acceptable in state ${this.transaction.state}.`);
    const r = e.statusCode;
    if (r < 200 || r > 299)
      throw new TypeError(`Invalid statusCode: ${r}`);
    return this.reply(e);
  }
  progress(e = { statusCode: 180 }) {
    if (!this.progressable)
      throw new Vt(`${this.message.method} not progressable in state ${this.transaction.state}.`);
    const r = e.statusCode;
    if (r < 101 || r > 199)
      throw new TypeError(`Invalid statusCode: ${r}`);
    return this.reply(e);
  }
  redirect(e, r = { statusCode: 302 }) {
    if (!this.redirectable)
      throw new Vt(`${this.message.method} not redirectable in state ${this.transaction.state}.`);
    const s = r.statusCode;
    if (s < 300 || s > 399)
      throw new TypeError(`Invalid statusCode: ${s}`);
    const i = new Array();
    return e.forEach((a) => i.push(`Contact: ${a.toString()}`)), r.extraHeaders = (r.extraHeaders || []).concat(i), this.reply(r);
  }
  reject(e = { statusCode: 480 }) {
    if (!this.rejectable)
      throw new Vt(`${this.message.method} not rejectable in state ${this.transaction.state}.`);
    const r = e.statusCode;
    if (r < 400 || r > 699)
      throw new TypeError(`Invalid statusCode: ${r}`);
    return this.reply(e);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trying(e) {
    if (!this.tryingable)
      throw new Vt(`${this.message.method} not tryingable in state ${this.transaction.state}.`);
    return this.reply({ statusCode: 100 });
  }
  /**
   * If the UAS did not find a matching transaction for the CANCEL
   * according to the procedure above, it SHOULD respond to the CANCEL
   * with a 481 (Call Leg/Transaction Does Not Exist).  If the transaction
   * for the original request still exists, the behavior of the UAS on
   * receiving a CANCEL request depends on whether it has already sent a
   * final response for the original request.  If it has, the CANCEL
   * request has no effect on the processing of the original request, no
   * effect on any session state, and no effect on the responses generated
   * for the original request.  If the UAS has not issued a final response
   * for the original request, its behavior depends on the method of the
   * original request.  If the original request was an INVITE, the UAS
   * SHOULD immediately respond to the INVITE with a 487 (Request
   * Terminated).  A CANCEL request has no impact on the processing of
   * transactions with any other method defined in this specification.
   * https://tools.ietf.org/html/rfc3261#section-9.2
   * @param request - Incoming CANCEL request.
   */
  receiveCancel(e) {
    this.delegate && this.delegate.onCancel && this.delegate.onCancel(e);
  }
  get acceptable() {
    if (this.transaction instanceof Ue)
      return this.transaction.state === y.Proceeding || this.transaction.state === y.Accepted;
    if (this.transaction instanceof Be)
      return this.transaction.state === y.Trying || this.transaction.state === y.Proceeding;
    throw new Error("Unknown transaction type.");
  }
  get progressable() {
    if (this.transaction instanceof Ue)
      return this.transaction.state === y.Proceeding;
    if (this.transaction instanceof Be)
      return !1;
    throw new Error("Unknown transaction type.");
  }
  get redirectable() {
    if (this.transaction instanceof Ue)
      return this.transaction.state === y.Proceeding;
    if (this.transaction instanceof Be)
      return this.transaction.state === y.Trying || this.transaction.state === y.Proceeding;
    throw new Error("Unknown transaction type.");
  }
  get rejectable() {
    if (this.transaction instanceof Ue)
      return this.transaction.state === y.Proceeding;
    if (this.transaction instanceof Be)
      return this.transaction.state === y.Trying || this.transaction.state === y.Proceeding;
    throw new Error("Unknown transaction type.");
  }
  get tryingable() {
    if (this.transaction instanceof Ue)
      return this.transaction.state === y.Proceeding;
    if (this.transaction instanceof Be)
      return this.transaction.state === y.Trying;
    throw new Error("Unknown transaction type.");
  }
  /**
   * When a UAS wishes to construct a response to a request, it follows
   * the general procedures detailed in the following subsections.
   * Additional behaviors specific to the response code in question, which
   * are not detailed in this section, may also be required.
   *
   * Once all procedures associated with the creation of a response have
   * been completed, the UAS hands the response back to the server
   * transaction from which it received the request.
   * https://tools.ietf.org/html/rfc3261#section-8.2.6
   * @param statusCode - Status code to reply with.
   * @param options - Reply options bucket.
   */
  reply(e) {
    !e.toTag && e.statusCode !== 100 && (e.toTag = this.toTag), e.userAgent = e.userAgent || this.core.configuration.userAgentHeaderFieldValue, e.supported = e.supported || this.core.configuration.supportedOptionTagsResponse;
    const r = jo(this.message, e);
    return this.transaction.receiveResponse(e.statusCode, r.message), r;
  }
  init() {
    const e = {
      loggerFactory: this.loggerFactory,
      onStateChange: (i) => {
        i === y.Terminated && (this.core.userAgentServers.delete(s), this.dispose());
      },
      onTransportError: (i) => {
        this.logger.error(i.message), this.delegate && this.delegate.onTransportError ? this.delegate.onTransportError(i) : this.logger.error("User agent server response transport error.");
      }
    }, r = new this.transactionConstructor(this.message, this.core.transport, e);
    this._transaction = r;
    const s = r.id;
    this.core.userAgentServers.set(r.id, this);
  }
}
class Fh extends xt {
  constructor(e, r, s) {
    super(Be, e.userAgentCore, r, s);
  }
}
class Nh extends ke {
  constructor(e, r, s) {
    const i = e.createOutgoingRequestMessage(P.INFO, s);
    super(We, e.userAgentCore, i, r);
  }
}
class qh extends xt {
  constructor(e, r, s) {
    super(Be, e.userAgentCore, r, s);
  }
}
class Wo extends ke {
  constructor(e, r, s) {
    super(We, e, r, s);
  }
}
class Vo extends xt {
  constructor(e, r, s) {
    super(Be, e, r, s);
  }
}
class Uh extends ke {
  constructor(e, r, s) {
    const i = e.createOutgoingRequestMessage(P.NOTIFY, s);
    super(We, e.userAgentCore, i, r);
  }
}
function Lh(t) {
  return t.userAgentCore !== void 0;
}
class Ys extends xt {
  /**
   * NOTIFY UAS constructor.
   * @param dialogOrCore - Dialog for in dialog NOTIFY, UserAgentCore for out of dialog NOTIFY (deprecated).
   * @param message - Incoming NOTIFY request message.
   */
  constructor(e, r, s) {
    const i = Lh(e) ? e.userAgentCore : e;
    super(Be, i, r, s);
  }
}
class jh extends ke {
  constructor(e, r, s) {
    const i = e.createOutgoingRequestMessage(P.PRACK, s);
    super(We, e.userAgentCore, i, r), e.signalingStateTransition(i);
  }
}
class Yh extends xt {
  constructor(e, r, s) {
    super(Be, e.userAgentCore, r, s), e.signalingStateTransition(r), this.dialog = e;
  }
  /**
   * Update the dialog signaling state on a 2xx response.
   * @param options - Options bucket.
   */
  accept(e = { statusCode: 200 }) {
    return e.body && this.dialog.signalingStateTransition(e.body), super.accept(e);
  }
}
class Bh extends ke {
  constructor(e, r, s) {
    const i = e.createOutgoingRequestMessage(P.INVITE, s);
    super(Kt, e.userAgentCore, i, r), this.delegate = r, e.signalingStateTransition(i), e.reinviteUserAgentClient = this, this.dialog = e;
  }
  receiveResponse(e) {
    if (!this.authenticationGuard(e, this.dialog))
      return;
    const r = e.statusCode ? e.statusCode.toString() : "";
    if (!r)
      throw new Error("Response status code undefined.");
    switch (!0) {
      case /^100$/.test(r):
        this.delegate && this.delegate.onTrying && this.delegate.onTrying({ message: e });
        break;
      case /^1[0-9]{2}$/.test(r):
        this.delegate && this.delegate.onProgress && this.delegate.onProgress({
          message: e,
          session: this.dialog,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          prack: (s) => {
            throw new Error("Unimplemented.");
          }
        });
        break;
      case /^2[0-9]{2}$/.test(r):
        this.dialog.signalingStateTransition(e), this.delegate && this.delegate.onAccept && this.delegate.onAccept({
          message: e,
          session: this.dialog,
          ack: (s) => this.dialog.ack(s)
        });
        break;
      case /^3[0-9]{2}$/.test(r):
        this.dialog.signalingStateRollback(), this.dialog.reinviteUserAgentClient = void 0, this.delegate && this.delegate.onRedirect && this.delegate.onRedirect({ message: e });
        break;
      case /^[4-6][0-9]{2}$/.test(r):
        this.dialog.signalingStateRollback(), this.dialog.reinviteUserAgentClient = void 0, this.delegate && this.delegate.onReject && this.delegate.onReject({ message: e });
        break;
      default:
        throw new Error(`Invalid status code ${r}`);
    }
  }
}
class Wh extends xt {
  constructor(e, r, s) {
    super(Ue, e.userAgentCore, r, s), e.reinviteUserAgentServer = this, this.dialog = e;
  }
  /**
   * Update the dialog signaling state on a 2xx response.
   * @param options - Options bucket.
   */
  accept(e = { statusCode: 200 }) {
    e.extraHeaders = e.extraHeaders || [], e.extraHeaders = e.extraHeaders.concat(this.dialog.routeSet.map((n) => `Record-Route: ${n}`));
    const r = super.accept(e), s = this.dialog, i = Object.assign(Object.assign({}, r), { session: s });
    return e.body && this.dialog.signalingStateTransition(e.body), this.dialog.reConfirm(), i;
  }
  /**
   * Update the dialog signaling state on a 1xx response.
   * @param options - Progress options bucket.
   */
  progress(e = { statusCode: 180 }) {
    const r = super.progress(e), s = this.dialog, i = Object.assign(Object.assign({}, r), { session: s });
    return e.body && this.dialog.signalingStateTransition(e.body), i;
  }
  /**
   * TODO: Not Yet Supported
   * @param contacts - Contacts to redirect to.
   * @param options - Redirect options bucket.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  redirect(e, r = { statusCode: 302 }) {
    throw this.dialog.signalingStateRollback(), this.dialog.reinviteUserAgentServer = void 0, new Error("Unimplemented.");
  }
  /**
   * 3.1 Background on Re-INVITE Handling by UASs
   * An error response to a re-INVITE has the following semantics.  As
   * specified in Section 12.2.2 of RFC 3261 [RFC3261], if a re-INVITE is
   * rejected, no state changes are performed.
   * https://tools.ietf.org/html/rfc6141#section-3.1
   * @param options - Reject options bucket.
   */
  reject(e = { statusCode: 488 }) {
    return this.dialog.signalingStateRollback(), this.dialog.reinviteUserAgentServer = void 0, super.reject(e);
  }
}
class Vh extends ke {
  constructor(e, r, s) {
    const i = e.createOutgoingRequestMessage(P.REFER, s);
    super(We, e.userAgentCore, i, r);
  }
}
function Gh(t) {
  return t.userAgentCore !== void 0;
}
class Go extends xt {
  /**
   * REFER UAS constructor.
   * @param dialogOrCore - Dialog for in dialog REFER, UserAgentCore for out of dialog REFER.
   * @param message - Incoming REFER request message.
   */
  constructor(e, r, s) {
    const i = Gh(e) ? e.userAgentCore : e;
    super(Be, i, r, s);
  }
}
class Bs extends Fr {
  constructor(e, r, s, i) {
    super(r, s), this.initialTransaction = e, this._signalingState = $.Initial, this.ackWait = !1, this.ackProcessing = !1, this.delegate = i, e instanceof Ue && (this.ackWait = !0), this.early || this.start2xxRetransmissionTimer(), this.signalingStateTransition(e.request), this.logger = r.loggerFactory.getLogger("sip.invite-dialog"), this.logger.log(`INVITE dialog ${this.id} constructed`);
  }
  dispose() {
    super.dispose(), this._signalingState = $.Closed, this._offer = void 0, this._answer = void 0, this.invite2xxTimer && (clearTimeout(this.invite2xxTimer), this.invite2xxTimer = void 0), this.logger.log(`INVITE dialog ${this.id} destroyed`);
  }
  // FIXME: Need real state machine
  get sessionState() {
    return this.early ? Ze.Early : this.ackWait ? Ze.AckWait : this._signalingState === $.Closed ? Ze.Terminated : Ze.Confirmed;
  }
  /** The state of the offer/answer exchange. */
  get signalingState() {
    return this._signalingState;
  }
  /** The current offer. Undefined unless signaling state HaveLocalOffer, HaveRemoteOffer, of Stable. */
  get offer() {
    return this._offer;
  }
  /** The current answer. Undefined unless signaling state Stable. */
  get answer() {
    return this._answer;
  }
  /** Confirm the dialog. Only matters if dialog is currently early. */
  confirm() {
    this.early && this.start2xxRetransmissionTimer(), super.confirm();
  }
  /** Re-confirm the dialog. Only matters if handling re-INVITE request. */
  reConfirm() {
    this.reinviteUserAgentServer && this.startReInvite2xxRetransmissionTimer();
  }
  /**
   * The UAC core MUST generate an ACK request for each 2xx received from
   * the transaction layer.  The header fields of the ACK are constructed
   * in the same way as for any request sent within a dialog (see Section
   * 12) with the exception of the CSeq and the header fields related to
   * authentication.  The sequence number of the CSeq header field MUST be
   * the same as the INVITE being acknowledged, but the CSeq method MUST
   * be ACK.  The ACK MUST contain the same credentials as the INVITE.  If
   * the 2xx contains an offer (based on the rules above), the ACK MUST
   * carry an answer in its body.  If the offer in the 2xx response is not
   * acceptable, the UAC core MUST generate a valid answer in the ACK and
   * then send a BYE immediately.
   * https://tools.ietf.org/html/rfc3261#section-13.2.2.4
   * @param options - ACK options bucket.
   */
  ack(e = {}) {
    this.logger.log(`INVITE dialog ${this.id} sending ACK request`);
    let r;
    if (this.reinviteUserAgentClient) {
      if (!(this.reinviteUserAgentClient.transaction instanceof Kt))
        throw new Error("Transaction not instance of InviteClientTransaction.");
      r = this.reinviteUserAgentClient.transaction, this.reinviteUserAgentClient = void 0;
    } else {
      if (!(this.initialTransaction instanceof Kt))
        throw new Error("Initial transaction not instance of InviteClientTransaction.");
      r = this.initialTransaction;
    }
    const s = this.createOutgoingRequestMessage(P.ACK, {
      cseq: r.request.cseq,
      extraHeaders: e.extraHeaders,
      body: e.body
    });
    return r.ackResponse(s), this.signalingStateTransition(s), { message: s };
  }
  /**
   * Terminating a Session
   *
   * This section describes the procedures for terminating a session
   * established by SIP.  The state of the session and the state of the
   * dialog are very closely related.  When a session is initiated with an
   * INVITE, each 1xx or 2xx response from a distinct UAS creates a
   * dialog, and if that response completes the offer/answer exchange, it
   * also creates a session.  As a result, each session is "associated"
   * with a single dialog - the one which resulted in its creation.  If an
   * initial INVITE generates a non-2xx final response, that terminates
   * all sessions (if any) and all dialogs (if any) that were created
   * through responses to the request.  By virtue of completing the
   * transaction, a non-2xx final response also prevents further sessions
   * from being created as a result of the INVITE.  The BYE request is
   * used to terminate a specific session or attempted session.  In this
   * case, the specific session is the one with the peer UA on the other
   * side of the dialog.  When a BYE is received on a dialog, any session
   * associated with that dialog SHOULD terminate.  A UA MUST NOT send a
   * BYE outside of a dialog.  The caller's UA MAY send a BYE for either
   * confirmed or early dialogs, and the callee's UA MAY send a BYE on
   * confirmed dialogs, but MUST NOT send a BYE on early dialogs.
   *
   * However, the callee's UA MUST NOT send a BYE on a confirmed dialog
   * until it has received an ACK for its 2xx response or until the server
   * transaction times out.  If no SIP extensions have defined other
   * application layer states associated with the dialog, the BYE also
   * terminates the dialog.
   *
   * https://tools.ietf.org/html/rfc3261#section-15
   * FIXME: Make these proper Exceptions...
   * @param options - BYE options bucket.
   * @returns
   * Throws `Error` if callee's UA attempts a BYE on an early dialog.
   * Throws `Error` if callee's UA attempts a BYE on a confirmed dialog
   *                while it's waiting on the ACK for its 2xx response.
   */
  bye(e, r) {
    if (this.logger.log(`INVITE dialog ${this.id} sending BYE request`), this.initialTransaction instanceof Ue) {
      if (this.early)
        throw new Error("UAS MUST NOT send a BYE on early dialogs.");
      if (this.ackWait && this.initialTransaction.state !== y.Terminated)
        throw new Error("UAS MUST NOT send a BYE on a confirmed dialog until it has received an ACK for its 2xx response or until the server transaction times out.");
    }
    return new Mh(this, e, r);
  }
  /**
   * An INFO request can be associated with an Info Package (see
   * Section 5), or associated with a legacy INFO usage (see Section 2).
   *
   * The construction of the INFO request is the same as any other
   * non-target refresh request within an existing invite dialog usage as
   * described in Section 12.2 of RFC 3261.
   * https://tools.ietf.org/html/rfc6086#section-4.2.1
   * @param options - Options bucket.
   */
  info(e, r) {
    if (this.logger.log(`INVITE dialog ${this.id} sending INFO request`), this.early)
      throw new Error("Dialog not confirmed.");
    return new Nh(this, e, r);
  }
  /**
   * Modifying an Existing Session
   *
   * A successful INVITE request (see Section 13) establishes both a
   * dialog between two user agents and a session using the offer-answer
   * model.  Section 12 explains how to modify an existing dialog using a
   * target refresh request (for example, changing the remote target URI
   * of the dialog).  This section describes how to modify the actual
   * session.  This modification can involve changing addresses or ports,
   * adding a media stream, deleting a media stream, and so on.  This is
   * accomplished by sending a new INVITE request within the same dialog
   * that established the session.  An INVITE request sent within an
   * existing dialog is known as a re-INVITE.
   *
   *    Note that a single re-INVITE can modify the dialog and the
   *    parameters of the session at the same time.
   *
   * Either the caller or callee can modify an existing session.
   * https://tools.ietf.org/html/rfc3261#section-14
   * @param options - Options bucket
   */
  invite(e, r) {
    if (this.logger.log(`INVITE dialog ${this.id} sending INVITE request`), this.early)
      throw new Error("Dialog not confirmed.");
    if (this.reinviteUserAgentClient)
      throw new Error("There is an ongoing re-INVITE client transaction.");
    if (this.reinviteUserAgentServer)
      throw new Error("There is an ongoing re-INVITE server transaction.");
    return new Bh(this, e, r);
  }
  /**
   * A UAC MAY associate a MESSAGE request with an existing dialog.  If a
   * MESSAGE request is sent within a dialog, it is "associated" with any
   * media session or sessions associated with that dialog.
   * https://tools.ietf.org/html/rfc3428#section-4
   * @param options - Options bucket.
   */
  message(e, r) {
    if (this.logger.log(`INVITE dialog ${this.id} sending MESSAGE request`), this.early)
      throw new Error("Dialog not confirmed.");
    const s = this.createOutgoingRequestMessage(P.MESSAGE, r);
    return new Wo(this.core, s, e);
  }
  /**
   * The NOTIFY mechanism defined in [2] MUST be used to inform the agent
   * sending the REFER of the status of the reference.
   * https://tools.ietf.org/html/rfc3515#section-2.4.4
   * @param options - Options bucket.
   */
  notify(e, r) {
    if (this.logger.log(`INVITE dialog ${this.id} sending NOTIFY request`), this.early)
      throw new Error("Dialog not confirmed.");
    return new Uh(this, e, r);
  }
  /**
   * Assuming the response is to be transmitted reliably, the UAC MUST
   * create a new request with method PRACK.  This request is sent within
   * the dialog associated with the provisional response (indeed, the
   * provisional response may have created the dialog).  PRACK requests
   * MAY contain bodies, which are interpreted according to their type and
   * disposition.
   * https://tools.ietf.org/html/rfc3262#section-4
   * @param options - Options bucket.
   */
  prack(e, r) {
    return this.logger.log(`INVITE dialog ${this.id} sending PRACK request`), new jh(this, e, r);
  }
  /**
   * REFER is a SIP request and is constructed as defined in [1].  A REFER
   * request MUST contain exactly one Refer-To header field value.
   * https://tools.ietf.org/html/rfc3515#section-2.4.1
   * @param options - Options bucket.
   */
  refer(e, r) {
    if (this.logger.log(`INVITE dialog ${this.id} sending REFER request`), this.early)
      throw new Error("Dialog not confirmed.");
    return new Vh(this, e, r);
  }
  /**
   * Requests sent within a dialog, as any other requests, are atomic.  If
   * a particular request is accepted by the UAS, all the state changes
   * associated with it are performed.  If the request is rejected, none
   * of the state changes are performed.
   * https://tools.ietf.org/html/rfc3261#section-12.2.2
   * @param message - Incoming request message within this dialog.
   */
  receiveRequest(e) {
    if (this.logger.log(`INVITE dialog ${this.id} received ${e.method} request`), e.method === P.ACK) {
      if (this.ackWait) {
        if (this.initialTransaction instanceof Kt) {
          this.logger.warn(`INVITE dialog ${this.id} received unexpected ${e.method} request, dropping.`);
          return;
        }
        if (this.initialTransaction.request.cseq !== e.cseq) {
          this.logger.warn(`INVITE dialog ${this.id} received unexpected ${e.method} request, dropping.`);
          return;
        }
        this.ackWait = !1;
      } else {
        if (!this.reinviteUserAgentServer) {
          this.logger.warn(`INVITE dialog ${this.id} received unexpected ${e.method} request, dropping.`);
          return;
        }
        if (this.reinviteUserAgentServer.transaction.request.cseq !== e.cseq) {
          this.logger.warn(`INVITE dialog ${this.id} received unexpected ${e.method} request, dropping.`);
          return;
        }
        this.reinviteUserAgentServer = void 0;
      }
      if (this.signalingStateTransition(e), this.delegate && this.delegate.onAck) {
        const r = this.delegate.onAck({ message: e });
        r instanceof Promise && (this.ackProcessing = !0, r.then(() => this.ackProcessing = !1).catch(() => this.ackProcessing = !1));
      }
      return;
    }
    if (!this.sequenceGuard(e)) {
      this.logger.log(`INVITE dialog ${this.id} rejected out of order ${e.method} request.`);
      return;
    }
    if (super.receiveRequest(e), e.method === P.INVITE) {
      const r = () => {
        const n = this.ackWait ? "waiting for initial ACK" : "processing initial ACK";
        this.logger.warn(`INVITE dialog ${this.id} received re-INVITE while ${n}`);
        let a = "RFC 5407 suggests the following to avoid this race condition... ";
        a += " Note: Implementation issues are outside the scope of this document,", a += " but the following tip is provided for avoiding race conditions of", a += " this type.  The caller can delay sending re-INVITE F6 for some period", a += " of time (2 seconds, perhaps), after which the caller can reasonably", a += " assume that its ACK has been received.  Implementors can decouple the", a += " actions of the user (e.g., pressing the hold button) from the actions", a += " of the protocol (the sending of re-INVITE F6), so that the UA can", a += " behave like this.  In this case, it is the implementor's choice as to", a += " how long to wait.  In most cases, such an implementation may be", a += " useful to prevent the type of race condition shown in this section.", a += " This document expresses no preference about whether or not they", a += " should wait for an ACK to be delivered.  After considering the impact", a += " on user experience, implementors should decide whether or not to wait", a += " for a while, because the user experience depends on the", a += " implementation and has no direct bearing on protocol behavior.", this.logger.warn(a);
      }, i = [`Retry-After: ${Math.floor(Math.random() * 10) + 1}`];
      if (this.ackProcessing) {
        this.core.replyStateless(e, { statusCode: 500, extraHeaders: i }), r();
        return;
      }
      if (this.ackWait && this.signalingState !== $.Stable) {
        this.core.replyStateless(e, { statusCode: 500, extraHeaders: i }), r();
        return;
      }
      if (this.reinviteUserAgentServer) {
        this.core.replyStateless(e, { statusCode: 500, extraHeaders: i });
        return;
      }
      if (this.reinviteUserAgentClient) {
        this.core.replyStateless(e, { statusCode: 491 });
        return;
      }
    }
    if (e.method === P.INVITE) {
      const r = e.parseHeader("contact");
      if (!r)
        throw new Error("Contact undefined.");
      if (!(r instanceof qe))
        throw new Error("Contact not instance of NameAddrHeader.");
      this.dialogState.remoteTarget = r.uri;
    }
    switch (e.method) {
      case P.BYE:
        {
          const r = new Fh(this, e);
          this.delegate && this.delegate.onBye ? this.delegate.onBye(r) : r.accept(), this.dispose();
        }
        break;
      case P.INFO:
        {
          const r = new qh(this, e);
          this.delegate && this.delegate.onInfo ? this.delegate.onInfo(r) : r.reject({
            statusCode: 469,
            extraHeaders: ["Recv-Info:"]
          });
        }
        break;
      case P.INVITE:
        {
          const r = new Wh(this, e);
          this.signalingStateTransition(e), this.delegate && this.delegate.onInvite ? this.delegate.onInvite(r) : r.reject({ statusCode: 488 });
        }
        break;
      case P.MESSAGE:
        {
          const r = new Vo(this.core, e);
          this.delegate && this.delegate.onMessage ? this.delegate.onMessage(r) : r.accept();
        }
        break;
      case P.NOTIFY:
        {
          const r = new Ys(this, e);
          this.delegate && this.delegate.onNotify ? this.delegate.onNotify(r) : r.accept();
        }
        break;
      case P.PRACK:
        {
          const r = new Yh(this, e);
          this.delegate && this.delegate.onPrack ? this.delegate.onPrack(r) : r.accept();
        }
        break;
      case P.REFER:
        {
          const r = new Go(this, e);
          this.delegate && this.delegate.onRefer ? this.delegate.onRefer(r) : r.reject();
        }
        break;
      default:
        this.logger.log(`INVITE dialog ${this.id} received unimplemented ${e.method} request`), this.core.replyStateless(e, { statusCode: 501 });
        break;
    }
  }
  /**
   * Guard against out of order reliable provisional responses and retransmissions.
   * Returns false if the response should be discarded, otherwise true.
   * @param message - Incoming response message within this dialog.
   */
  reliableSequenceGuard(e) {
    const r = e.statusCode;
    if (!r)
      throw new Error("Status code undefined");
    if (r > 100 && r < 200) {
      const s = e.getHeader("require"), i = e.getHeader("rseq"), n = s && s.includes("100rel") && i ? Number(i) : void 0;
      if (n) {
        if (this.rseq && this.rseq + 1 !== n)
          return !1;
        this.rseq = this.rseq ? this.rseq + 1 : n;
      }
    }
    return !0;
  }
  /**
   * If not in a stable signaling state, rollback to prior stable signaling state.
   */
  signalingStateRollback() {
    (this._signalingState === $.HaveLocalOffer || this.signalingState === $.HaveRemoteOffer) && this._rollbackOffer && this._rollbackAnswer && (this._signalingState = $.Stable, this._offer = this._rollbackOffer, this._answer = this._rollbackAnswer);
  }
  /**
   * Update the signaling state of the dialog.
   * @param message - The message to base the update off of.
   */
  signalingStateTransition(e) {
    const r = Qr(e);
    if (!(!r || r.contentDisposition !== "session")) {
      if (this._signalingState === $.Stable && (this._rollbackOffer = this._offer, this._rollbackAnswer = this._answer), e instanceof $r)
        switch (this._signalingState) {
          case $.Initial:
          case $.Stable:
            this._signalingState = $.HaveRemoteOffer, this._offer = r, this._answer = void 0;
            break;
          case $.HaveLocalOffer:
            this._signalingState = $.Stable, this._answer = r;
            break;
          case $.HaveRemoteOffer:
            break;
          case $.Closed:
            break;
          default:
            throw new Error("Unexpected signaling state.");
        }
      if (e instanceof tr)
        switch (this._signalingState) {
          case $.Initial:
          case $.Stable:
            this._signalingState = $.HaveRemoteOffer, this._offer = r, this._answer = void 0;
            break;
          case $.HaveLocalOffer:
            this._signalingState = $.Stable, this._answer = r;
            break;
          case $.HaveRemoteOffer:
            break;
          case $.Closed:
            break;
          default:
            throw new Error("Unexpected signaling state.");
        }
      if (e instanceof ur)
        switch (this._signalingState) {
          case $.Initial:
          case $.Stable:
            this._signalingState = $.HaveLocalOffer, this._offer = r, this._answer = void 0;
            break;
          case $.HaveLocalOffer:
            break;
          case $.HaveRemoteOffer:
            this._signalingState = $.Stable, this._answer = r;
            break;
          case $.Closed:
            break;
          default:
            throw new Error("Unexpected signaling state.");
        }
      if (Uo(e))
        switch (this._signalingState) {
          case $.Initial:
          case $.Stable:
            this._signalingState = $.HaveLocalOffer, this._offer = r, this._answer = void 0;
            break;
          case $.HaveLocalOffer:
            break;
          case $.HaveRemoteOffer:
            this._signalingState = $.Stable, this._answer = r;
            break;
          case $.Closed:
            break;
          default:
            throw new Error("Unexpected signaling state.");
        }
    }
  }
  start2xxRetransmissionTimer() {
    if (this.initialTransaction instanceof Ue) {
      const e = this.initialTransaction;
      let r = Se.T1;
      const s = () => {
        if (!this.ackWait) {
          this.invite2xxTimer = void 0;
          return;
        }
        this.logger.log("No ACK for 2xx response received, attempting retransmission"), e.retransmitAcceptedResponse(), r = Math.min(r * 2, Se.T2), this.invite2xxTimer = setTimeout(s, r);
      };
      this.invite2xxTimer = setTimeout(s, r);
      const i = () => {
        e.state === y.Terminated && (e.removeStateChangeListener(i), this.invite2xxTimer && (clearTimeout(this.invite2xxTimer), this.invite2xxTimer = void 0), this.ackWait && (this.delegate && this.delegate.onAckTimeout ? this.delegate.onAckTimeout() : this.bye()));
      };
      e.addStateChangeListener(i);
    }
  }
  // FIXME: Refactor
  startReInvite2xxRetransmissionTimer() {
    if (this.reinviteUserAgentServer && this.reinviteUserAgentServer.transaction instanceof Ue) {
      const e = this.reinviteUserAgentServer.transaction;
      let r = Se.T1;
      const s = () => {
        if (!this.reinviteUserAgentServer) {
          this.invite2xxTimer = void 0;
          return;
        }
        this.logger.log("No ACK for 2xx response received, attempting retransmission"), e.retransmitAcceptedResponse(), r = Math.min(r * 2, Se.T2), this.invite2xxTimer = setTimeout(s, r);
      };
      this.invite2xxTimer = setTimeout(s, r);
      const i = () => {
        e.state === y.Terminated && (e.removeStateChangeListener(i), this.invite2xxTimer && (clearTimeout(this.invite2xxTimer), this.invite2xxTimer = void 0), this.reinviteUserAgentServer);
      };
      e.addStateChangeListener(i);
    }
  }
}
class Kh extends ke {
  constructor(e, r, s) {
    super(Kt, e, r, s), this.confirmedDialogAcks = /* @__PURE__ */ new Map(), this.confirmedDialogs = /* @__PURE__ */ new Map(), this.earlyDialogs = /* @__PURE__ */ new Map(), this.delegate = s;
  }
  dispose() {
    this.earlyDialogs.forEach((e) => e.dispose()), this.earlyDialogs.clear(), super.dispose();
  }
  /**
   * Special case for transport error while sending ACK.
   * @param error - Transport error
   */
  onTransportError(e) {
    if (this.transaction.state === y.Calling)
      return super.onTransportError(e);
    this.logger.error(e.message), this.logger.error("User agent client request transport error while sending ACK.");
  }
  /**
   * Once the INVITE has been passed to the INVITE client transaction, the
   * UAC waits for responses for the INVITE.
   * https://tools.ietf.org/html/rfc3261#section-13.2.2
   * @param incomingResponse - Incoming response to INVITE request.
   */
  receiveResponse(e) {
    if (!this.authenticationGuard(e))
      return;
    const r = e.statusCode ? e.statusCode.toString() : "";
    if (!r)
      throw new Error("Response status code undefined.");
    switch (!0) {
      case /^100$/.test(r):
        this.delegate && this.delegate.onTrying && this.delegate.onTrying({ message: e });
        return;
      case /^1[0-9]{2}$/.test(r):
        {
          if (!e.toTag) {
            this.logger.warn("Non-100 1xx INVITE response received without a to tag, dropping.");
            return;
          }
          if (!e.parseHeader("contact")) {
            this.logger.error("Non-100 1xx INVITE response received without a Contact header field, dropping.");
            return;
          }
          const i = Fr.initialDialogStateForUserAgentClient(this.message, e);
          let n = this.earlyDialogs.get(i.id);
          if (!n) {
            const o = this.transaction;
            if (!(o instanceof Kt))
              throw new Error("Transaction not instance of InviteClientTransaction.");
            n = new Bs(o, this.core, i), this.earlyDialogs.set(n.id, n);
          }
          if (!n.reliableSequenceGuard(e)) {
            this.logger.warn("1xx INVITE reliable response received out of order or is a retransmission, dropping.");
            return;
          }
          (n.signalingState === $.Initial || n.signalingState === $.HaveLocalOffer) && n.signalingStateTransition(e);
          const a = n;
          this.delegate && this.delegate.onProgress && this.delegate.onProgress({
            message: e,
            session: a,
            prack: (o) => a.prack(void 0, o)
          });
        }
        return;
      case /^2[0-9]{2}$/.test(r):
        {
          if (!e.toTag) {
            this.logger.error("2xx INVITE response received without a to tag, dropping.");
            return;
          }
          if (!e.parseHeader("contact")) {
            this.logger.error("2xx INVITE response received without a Contact header field, dropping.");
            return;
          }
          const i = Fr.initialDialogStateForUserAgentClient(this.message, e);
          let n = this.confirmedDialogs.get(i.id);
          if (n) {
            const o = this.confirmedDialogAcks.get(i.id);
            if (o) {
              const c = this.transaction;
              if (!(c instanceof Kt))
                throw new Error("Client transaction not instance of InviteClientTransaction.");
              c.ackResponse(o.message);
            }
            return;
          }
          if (n = this.earlyDialogs.get(i.id), n)
            n.confirm(), n.recomputeRouteSet(e), this.earlyDialogs.delete(n.id), this.confirmedDialogs.set(n.id, n);
          else {
            const o = this.transaction;
            if (!(o instanceof Kt))
              throw new Error("Transaction not instance of InviteClientTransaction.");
            n = new Bs(o, this.core, i), this.confirmedDialogs.set(n.id, n);
          }
          (n.signalingState === $.Initial || n.signalingState === $.HaveLocalOffer) && n.signalingStateTransition(e);
          const a = n;
          if (this.delegate && this.delegate.onAccept)
            this.delegate.onAccept({
              message: e,
              session: a,
              ack: (o) => {
                const c = a.ack(o);
                return this.confirmedDialogAcks.set(a.id, c), c;
              }
            });
          else {
            const o = a.ack();
            this.confirmedDialogAcks.set(a.id, o);
          }
        }
        return;
      case /^3[0-9]{2}$/.test(r):
        this.earlyDialogs.forEach((s) => s.dispose()), this.earlyDialogs.clear(), this.delegate && this.delegate.onRedirect && this.delegate.onRedirect({ message: e });
        return;
      case /^[4-6][0-9]{2}$/.test(r):
        this.earlyDialogs.forEach((s) => s.dispose()), this.earlyDialogs.clear(), this.delegate && this.delegate.onReject && this.delegate.onReject({ message: e });
        return;
      default:
        throw new Error(`Invalid status code ${r}`);
    }
  }
}
class Fi extends xt {
  constructor(e, r, s) {
    super(Ue, e, r, s), this.core = e;
  }
  dispose() {
    this.earlyDialog && this.earlyDialog.dispose(), super.dispose();
  }
  /**
   * 13.3.1.4 The INVITE is Accepted
   * The UAS core generates a 2xx response.  This response establishes a
   * dialog, and therefore follows the procedures of Section 12.1.1 in
   * addition to those of Section 8.2.6.
   * https://tools.ietf.org/html/rfc3261#section-13.3.1.4
   * @param options - Accept options bucket.
   */
  accept(e = { statusCode: 200 }) {
    if (!this.acceptable)
      throw new Vt(`${this.message.method} not acceptable in state ${this.transaction.state}.`);
    if (!this.confirmedDialog)
      if (this.earlyDialog)
        this.earlyDialog.confirm(), this.confirmedDialog = this.earlyDialog, this.earlyDialog = void 0;
      else {
        const c = this.transaction;
        if (!(c instanceof Ue))
          throw new Error("Transaction not instance of InviteClientTransaction.");
        const l = Fr.initialDialogStateForUserAgentServer(this.message, this.toTag);
        this.confirmedDialog = new Bs(c, this.core, l);
      }
    const r = this.message.getHeaders("record-route").map((c) => `Record-Route: ${c}`), s = `Contact: ${this.core.configuration.contact.toString()}`, i = "Allow: " + Gt.toString();
    if (!e.body) {
      if (this.confirmedDialog.signalingState === $.Stable)
        e.body = this.confirmedDialog.answer;
      else if (this.confirmedDialog.signalingState === $.Initial || this.confirmedDialog.signalingState === $.HaveRemoteOffer)
        throw new Error("Response must have a body.");
    }
    e.statusCode = e.statusCode || 200, e.extraHeaders = e.extraHeaders || [], e.extraHeaders = e.extraHeaders.concat(r), e.extraHeaders.push(i), e.extraHeaders.push(s);
    const n = super.accept(e), a = this.confirmedDialog, o = Object.assign(Object.assign({}, n), { session: a });
    return e.body && this.confirmedDialog.signalingState !== $.Stable && this.confirmedDialog.signalingStateTransition(e.body), o;
  }
  /**
   * 13.3.1.1 Progress
   * If the UAS is not able to answer the invitation immediately, it can
   * choose to indicate some kind of progress to the UAC (for example, an
   * indication that a phone is ringing).  This is accomplished with a
   * provisional response between 101 and 199.  These provisional
   * responses establish early dialogs and therefore follow the procedures
   * of Section 12.1.1 in addition to those of Section 8.2.6.  A UAS MAY
   * send as many provisional responses as it likes.  Each of these MUST
   * indicate the same dialog ID.  However, these will not be delivered
   * reliably.
   *
   * If the UAS desires an extended period of time to answer the INVITE,
   * it will need to ask for an "extension" in order to prevent proxies
   * from canceling the transaction.  A proxy has the option of canceling
   * a transaction when there is a gap of 3 minutes between responses in a
   * transaction.  To prevent cancellation, the UAS MUST send a non-100
   * provisional response at every minute, to handle the possibility of
   * lost provisional responses.
   * https://tools.ietf.org/html/rfc3261#section-13.3.1.1
   * @param options - Progress options bucket.
   */
  progress(e = { statusCode: 180 }) {
    if (!this.progressable)
      throw new Vt(`${this.message.method} not progressable in state ${this.transaction.state}.`);
    if (!this.earlyDialog) {
      const o = this.transaction;
      if (!(o instanceof Ue))
        throw new Error("Transaction not instance of InviteClientTransaction.");
      const c = Fr.initialDialogStateForUserAgentServer(this.message, this.toTag, !0);
      this.earlyDialog = new Bs(o, this.core, c);
    }
    const r = this.message.getHeaders("record-route").map((o) => `Record-Route: ${o}`), s = `Contact: ${this.core.configuration.contact}`;
    e.extraHeaders = e.extraHeaders || [], e.extraHeaders = e.extraHeaders.concat(r), e.extraHeaders.push(s);
    const i = super.progress(e), n = this.earlyDialog, a = Object.assign(Object.assign({}, i), { session: n });
    return e.body && this.earlyDialog.signalingState !== $.Stable && this.earlyDialog.signalingStateTransition(e.body), a;
  }
  /**
   * 13.3.1.2 The INVITE is Redirected
   * If the UAS decides to redirect the call, a 3xx response is sent.  A
   * 300 (Multiple Choices), 301 (Moved Permanently) or 302 (Moved
   * Temporarily) response SHOULD contain a Contact header field
   * containing one or more URIs of new addresses to be tried.  The
   * response is passed to the INVITE server transaction, which will deal
   * with its retransmissions.
   * https://tools.ietf.org/html/rfc3261#section-13.3.1.2
   * @param contacts - Contacts to redirect to.
   * @param options - Redirect options bucket.
   */
  redirect(e, r = { statusCode: 302 }) {
    return super.redirect(e, r);
  }
  /**
   * 13.3.1.3 The INVITE is Rejected
   * A common scenario occurs when the callee is currently not willing or
   * able to take additional calls at this end system.  A 486 (Busy Here)
   * SHOULD be returned in such a scenario.
   * https://tools.ietf.org/html/rfc3261#section-13.3.1.3
   * @param options - Reject options bucket.
   */
  reject(e = { statusCode: 486 }) {
    return super.reject(e);
  }
}
class Zh extends ke {
  constructor(e, r, s) {
    super(We, e, r, s);
  }
}
class zh extends ke {
  constructor(e, r, s) {
    super(We, e, r, s);
  }
}
class Jh extends xt {
  constructor(e, r, s) {
    super(Be, e, r, s), this.core = e;
  }
}
class Xh extends ke {
  constructor(e, r, s) {
    const i = e.createOutgoingRequestMessage(P.SUBSCRIBE, s);
    super(We, e.userAgentCore, i, r), this.dialog = e;
  }
  waitNotifyStop() {
  }
  /**
   * Receive a response from the transaction layer.
   * @param message - Incoming response message.
   */
  receiveResponse(e) {
    if (e.statusCode && e.statusCode >= 200 && e.statusCode < 300) {
      const r = e.getHeader("Expires");
      if (!r)
        this.logger.warn("Expires header missing in a 200-class response to SUBSCRIBE");
      else {
        const s = Number(r);
        this.dialog.subscriptionExpires > s && (this.dialog.subscriptionExpires = s);
      }
    }
    e.statusCode && e.statusCode >= 400 && e.statusCode < 700 && [404, 405, 410, 416, 480, 481, 482, 483, 484, 485, 489, 501, 604].includes(e.statusCode) && this.dialog.terminate(), super.receiveResponse(e);
  }
}
class qa extends Fr {
  constructor(e, r, s, i, n, a) {
    super(i, n), this.delegate = a, this._autoRefresh = !1, this._subscriptionEvent = e, this._subscriptionExpires = r, this._subscriptionExpiresInitial = r, this._subscriptionExpiresLastSet = Math.floor(Date.now() / 1e3), this._subscriptionRefresh = void 0, this._subscriptionRefreshLastSet = void 0, this._subscriptionState = s, this.logger = i.loggerFactory.getLogger("sip.subscribe-dialog"), this.logger.log(`SUBSCRIBE dialog ${this.id} constructed`);
  }
  /**
   * When a UAC receives a response that establishes a dialog, it
   * constructs the state of the dialog.  This state MUST be maintained
   * for the duration of the dialog.
   * https://tools.ietf.org/html/rfc3261#section-12.1.2
   * @param outgoingRequestMessage - Outgoing request message for dialog.
   * @param incomingResponseMessage - Incoming response message creating dialog.
   */
  static initialDialogStateForSubscription(e, r) {
    const i = r.getHeaders("record-route"), n = r.parseHeader("contact");
    if (!n)
      throw new Error("Contact undefined.");
    if (!(n instanceof qe))
      throw new Error("Contact not instance of NameAddrHeader.");
    const a = n.uri, o = e.cseq, c = void 0, l = e.callId, h = e.fromTag, f = r.fromTag;
    if (!l)
      throw new Error("Call id undefined.");
    if (!h)
      throw new Error("From tag undefined.");
    if (!f)
      throw new Error("To tag undefined.");
    if (!e.from)
      throw new Error("From undefined.");
    if (!e.to)
      throw new Error("To undefined.");
    const x = e.from.uri, O = e.to.uri, W = !1;
    return {
      id: l + h + f,
      early: W,
      callId: l,
      localTag: h,
      remoteTag: f,
      localSequenceNumber: o,
      remoteSequenceNumber: c,
      localURI: x,
      remoteURI: O,
      remoteTarget: a,
      routeSet: i,
      secure: !1
    };
  }
  dispose() {
    super.dispose(), this.N && (clearTimeout(this.N), this.N = void 0), this.refreshTimerClear(), this.logger.log(`SUBSCRIBE dialog ${this.id} destroyed`);
  }
  get autoRefresh() {
    return this._autoRefresh;
  }
  set autoRefresh(e) {
    this._autoRefresh = !0, this.refreshTimerSet();
  }
  get subscriptionEvent() {
    return this._subscriptionEvent;
  }
  /** Number of seconds until subscription expires. */
  get subscriptionExpires() {
    const e = Math.floor(Date.now() / 1e3) - this._subscriptionExpiresLastSet, r = this._subscriptionExpires - e;
    return Math.max(r, 0);
  }
  set subscriptionExpires(e) {
    if (e < 0)
      throw new Error("Expires must be greater than or equal to zero.");
    if (this._subscriptionExpires = e, this._subscriptionExpiresLastSet = Math.floor(Date.now() / 1e3), this.autoRefresh) {
      const r = this.subscriptionRefresh;
      (r === void 0 || r >= e) && this.refreshTimerSet();
    }
  }
  get subscriptionExpiresInitial() {
    return this._subscriptionExpiresInitial;
  }
  /** Number of seconds until subscription auto refresh. */
  get subscriptionRefresh() {
    if (this._subscriptionRefresh === void 0 || this._subscriptionRefreshLastSet === void 0)
      return;
    const e = Math.floor(Date.now() / 1e3) - this._subscriptionRefreshLastSet, r = this._subscriptionRefresh - e;
    return Math.max(r, 0);
  }
  get subscriptionState() {
    return this._subscriptionState;
  }
  /**
   * Receive in dialog request message from transport.
   * @param message -  The incoming request message.
   */
  receiveRequest(e) {
    if (this.logger.log(`SUBSCRIBE dialog ${this.id} received ${e.method} request`), !this.sequenceGuard(e)) {
      this.logger.log(`SUBSCRIBE dialog ${this.id} rejected out of order ${e.method} request.`);
      return;
    }
    switch (super.receiveRequest(e), e.method) {
      case P.NOTIFY:
        this.onNotify(e);
        break;
      default:
        this.logger.log(`SUBSCRIBE dialog ${this.id} received unimplemented ${e.method} request`), this.core.replyStateless(e, { statusCode: 501 });
        break;
    }
  }
  /**
   * 4.1.2.2.  Refreshing of Subscriptions
   * https://tools.ietf.org/html/rfc6665#section-4.1.2.2
   */
  refresh() {
    const e = "Allow: " + Gt.toString(), r = {};
    return r.extraHeaders = (r.extraHeaders || []).slice(), r.extraHeaders.push(e), r.extraHeaders.push("Event: " + this.subscriptionEvent), r.extraHeaders.push("Expires: " + this.subscriptionExpiresInitial), r.extraHeaders.push("Contact: " + this.core.configuration.contact.toString()), this.subscribe(void 0, r);
  }
  /**
   * 4.1.2.2.  Refreshing of Subscriptions
   * https://tools.ietf.org/html/rfc6665#section-4.1.2.2
   * @param delegate - Delegate to handle responses.
   * @param options - Options bucket.
   */
  subscribe(e, r = {}) {
    var s;
    if (this.subscriptionState !== ee.Pending && this.subscriptionState !== ee.Active)
      throw new Error(`Invalid state ${this.subscriptionState}. May only re-subscribe while in state "pending" or "active".`);
    this.logger.log(`SUBSCRIBE dialog ${this.id} sending SUBSCRIBE request`);
    const i = new Xh(this, e, r);
    return this.N && (clearTimeout(this.N), this.N = void 0), !((s = r.extraHeaders) === null || s === void 0) && s.includes("Expires: 0") || (this.N = setTimeout(() => this.timerN(), Se.TIMER_N)), i;
  }
  /**
   * 4.4.1.  Dialog Creation and Termination
   * A subscription is destroyed after a notifier sends a NOTIFY request
   * with a "Subscription-State" of "terminated", or in certain error
   * situations described elsewhere in this document.
   * https://tools.ietf.org/html/rfc6665#section-4.4.1
   */
  terminate() {
    this.stateTransition(ee.Terminated), this.onTerminated();
  }
  /**
   * 4.1.2.3.  Unsubscribing
   * https://tools.ietf.org/html/rfc6665#section-4.1.2.3
   */
  unsubscribe() {
    const e = "Allow: " + Gt.toString(), r = {};
    return r.extraHeaders = (r.extraHeaders || []).slice(), r.extraHeaders.push(e), r.extraHeaders.push("Event: " + this.subscriptionEvent), r.extraHeaders.push("Expires: 0"), r.extraHeaders.push("Contact: " + this.core.configuration.contact.toString()), this.subscribe(void 0, r);
  }
  /**
   * Handle in dialog NOTIFY requests.
   * This does not include the first NOTIFY which created the dialog.
   * @param message - The incoming NOTIFY request message.
   */
  onNotify(e) {
    const r = e.parseHeader("Event").event;
    if (!r || r !== this.subscriptionEvent) {
      this.core.replyStateless(e, { statusCode: 489 });
      return;
    }
    this.N && (clearTimeout(this.N), this.N = void 0);
    const s = e.parseHeader("Subscription-State");
    if (!s || !s.state) {
      this.core.replyStateless(e, { statusCode: 489 });
      return;
    }
    const i = s.state, n = s.expires ? Math.max(s.expires, 0) : void 0;
    switch (i) {
      case "pending":
        this.stateTransition(ee.Pending, n);
        break;
      case "active":
        this.stateTransition(ee.Active, n);
        break;
      case "terminated":
        this.stateTransition(ee.Terminated, n);
        break;
      default:
        this.logger.warn("Unrecognized subscription state.");
        break;
    }
    const a = new Ys(this, e);
    this.delegate && this.delegate.onNotify ? this.delegate.onNotify(a) : a.accept();
  }
  onRefresh(e) {
    this.delegate && this.delegate.onRefresh && this.delegate.onRefresh(e);
  }
  onTerminated() {
    this.delegate && this.delegate.onTerminated && this.delegate.onTerminated();
  }
  refreshTimerClear() {
    this.refreshTimer && (clearTimeout(this.refreshTimer), this.refreshTimer = void 0);
  }
  refreshTimerSet() {
    if (this.refreshTimerClear(), this.autoRefresh && this.subscriptionExpires > 0) {
      const e = this.subscriptionExpires * 900;
      this._subscriptionRefresh = Math.floor(e / 1e3), this._subscriptionRefreshLastSet = Math.floor(Date.now() / 1e3), this.refreshTimer = setTimeout(() => {
        this.refreshTimer = void 0, this._subscriptionRefresh = void 0, this._subscriptionRefreshLastSet = void 0, this.onRefresh(this.refresh());
      }, e);
    }
  }
  stateTransition(e, r) {
    const s = () => {
      this.logger.warn(`Invalid subscription state transition from ${this.subscriptionState} to ${e}`);
    };
    switch (e) {
      case ee.Initial:
        s();
        return;
      case ee.NotifyWait:
        s();
        return;
      case ee.Pending:
        if (this.subscriptionState !== ee.NotifyWait && this.subscriptionState !== ee.Pending) {
          s();
          return;
        }
        break;
      case ee.Active:
        if (this.subscriptionState !== ee.NotifyWait && this.subscriptionState !== ee.Pending && this.subscriptionState !== ee.Active) {
          s();
          return;
        }
        break;
      case ee.Terminated:
        if (this.subscriptionState !== ee.NotifyWait && this.subscriptionState !== ee.Pending && this.subscriptionState !== ee.Active) {
          s();
          return;
        }
        break;
      default:
        s();
        return;
    }
    e === ee.Pending && r && (this.subscriptionExpires = r), e === ee.Active && r && (this.subscriptionExpires = r), e === ee.Terminated && this.dispose(), this._subscriptionState = e;
  }
  /**
   * When refreshing a subscription, a subscriber starts Timer N, set to
   * 64*T1, when it sends the SUBSCRIBE request.  If this Timer N expires
   * prior to the receipt of a NOTIFY request, the subscriber considers
   * the subscription terminated.  If the subscriber receives a success
   * response to the SUBSCRIBE request that indicates that no NOTIFY
   * request will be generated -- such as the 204 response defined for use
   * with the optional extension described in [RFC5839] -- then it MUST
   * cancel Timer N.
   * https://tools.ietf.org/html/rfc6665#section-4.1.2.2
   */
  timerN() {
    this.logger.warn("Timer N expired for SUBSCRIBE dialog. Timed out waiting for NOTIFY."), this.subscriptionState !== ee.Terminated && (this.stateTransition(ee.Terminated), this.onTerminated());
  }
}
class Qh extends ke {
  constructor(e, r, s) {
    const i = r.getHeader("Event");
    if (!i)
      throw new Error("Event undefined");
    const n = r.getHeader("Expires");
    if (!n)
      throw new Error("Expires undefined");
    super(We, e, r, s), this.delegate = s, this.subscriberId = r.callId + r.fromTag + i, this.subscriptionExpiresRequested = this.subscriptionExpires = Number(n), this.subscriptionEvent = i, this.subscriptionState = ee.NotifyWait, this.waitNotifyStart();
  }
  /**
   * Destructor.
   * Note that Timer N may live on waiting for an initial NOTIFY and
   * the delegate may still receive that NOTIFY. If you don't want
   * that behavior then either clear the delegate so the delegate
   * doesn't get called (a 200 will be sent in response to the NOTIFY)
   * or call `waitNotifyStop` which will clear Timer N and remove this
   * UAC from the core (a 481 will be sent in response to the NOTIFY).
   */
  dispose() {
    super.dispose();
  }
  /**
   * Handle out of dialog NOTIFY associated with SUBSCRIBE request.
   * This is the first NOTIFY received after the SUBSCRIBE request.
   * @param uas - User agent server handling the subscription creating NOTIFY.
   */
  onNotify(e) {
    const r = e.message.parseHeader("Event").event;
    if (!r || r !== this.subscriptionEvent) {
      this.logger.warn("Failed to parse event."), e.reject({ statusCode: 489 });
      return;
    }
    const s = e.message.parseHeader("Subscription-State");
    if (!s || !s.state) {
      this.logger.warn("Failed to parse subscription state."), e.reject({ statusCode: 489 });
      return;
    }
    const i = s.state;
    switch (i) {
      case "pending":
        break;
      case "active":
        break;
      case "terminated":
        break;
      default:
        this.logger.warn(`Invalid subscription state ${i}`), e.reject({ statusCode: 489 });
        return;
    }
    if (i !== "terminated" && !e.message.parseHeader("contact")) {
      this.logger.warn("Failed to parse contact."), e.reject({ statusCode: 489 });
      return;
    }
    if (this.dialog)
      throw new Error("Dialog already created. This implementation only supports install of single subscriptions.");
    switch (this.waitNotifyStop(), this.subscriptionExpires = s.expires ? Math.min(this.subscriptionExpires, Math.max(s.expires, 0)) : this.subscriptionExpires, i) {
      case "pending":
        this.subscriptionState = ee.Pending;
        break;
      case "active":
        this.subscriptionState = ee.Active;
        break;
      case "terminated":
        this.subscriptionState = ee.Terminated;
        break;
      default:
        throw new Error(`Unrecognized state ${i}.`);
    }
    if (this.subscriptionState !== ee.Terminated) {
      const n = qa.initialDialogStateForSubscription(this.message, e.message);
      this.dialog = new qa(this.subscriptionEvent, this.subscriptionExpires, this.subscriptionState, this.core, n);
    }
    if (this.delegate && this.delegate.onNotify) {
      const n = e, a = this.dialog;
      this.delegate.onNotify({ request: n, subscription: a });
    } else
      e.accept();
  }
  waitNotifyStart() {
    this.N || (this.core.subscribers.set(this.subscriberId, this), this.N = setTimeout(() => this.timerN(), Se.TIMER_N));
  }
  waitNotifyStop() {
    this.N && (this.core.subscribers.delete(this.subscriberId), clearTimeout(this.N), this.N = void 0);
  }
  /**
   * Receive a response from the transaction layer.
   * @param message - Incoming response message.
   */
  receiveResponse(e) {
    if (this.authenticationGuard(e)) {
      if (e.statusCode && e.statusCode >= 200 && e.statusCode < 300) {
        const r = e.getHeader("Expires");
        if (!r)
          this.logger.warn("Expires header missing in a 200-class response to SUBSCRIBE");
        else {
          const s = Number(r);
          s > this.subscriptionExpiresRequested && this.logger.warn("Expires header in a 200-class response to SUBSCRIBE with a higher value than the one in the request"), s < this.subscriptionExpires && (this.subscriptionExpires = s);
        }
        this.dialog && this.dialog.subscriptionExpires > this.subscriptionExpires && (this.dialog.subscriptionExpires = this.subscriptionExpires);
      }
      e.statusCode && e.statusCode >= 300 && e.statusCode < 700 && this.waitNotifyStop(), super.receiveResponse(e);
    }
  }
  /**
   * To ensure that subscribers do not wait indefinitely for a
   * subscription to be established, a subscriber starts a Timer N, set to
   * 64*T1, when it sends a SUBSCRIBE request.  If this Timer N expires
   * prior to the receipt of a NOTIFY request, the subscriber considers
   * the subscription failed, and cleans up any state associated with the
   * subscription attempt.
   * https://tools.ietf.org/html/rfc6665#section-4.1.2.4
   */
  timerN() {
    this.logger.warn("Timer N expired for SUBSCRIBE user agent client. Timed out waiting for NOTIFY."), this.waitNotifyStop(), this.delegate && this.delegate.onNotifyTimeout && this.delegate.onNotifyTimeout();
  }
}
class eu extends xt {
  constructor(e, r, s) {
    super(Be, e, r, s), this.core = e;
  }
}
const Ua = ["application/sdp", "application/dtmf-relay"];
class tu {
  /**
   * Constructor.
   * @param configuration - Configuration.
   * @param delegate - Delegate.
   */
  constructor(e, r = {}) {
    this.userAgentClients = /* @__PURE__ */ new Map(), this.userAgentServers = /* @__PURE__ */ new Map(), this.configuration = e, this.delegate = r, this.dialogs = /* @__PURE__ */ new Map(), this.subscribers = /* @__PURE__ */ new Map(), this.logger = e.loggerFactory.getLogger("sip.user-agent-core");
  }
  /** Destructor. */
  dispose() {
    this.reset();
  }
  /** Reset. */
  reset() {
    this.dialogs.forEach((e) => e.dispose()), this.dialogs.clear(), this.subscribers.forEach((e) => e.dispose()), this.subscribers.clear(), this.userAgentClients.forEach((e) => e.dispose()), this.userAgentClients.clear(), this.userAgentServers.forEach((e) => e.dispose()), this.userAgentServers.clear();
  }
  /** Logger factory. */
  get loggerFactory() {
    return this.configuration.loggerFactory;
  }
  /** Transport. */
  get transport() {
    const e = this.configuration.transportAccessor();
    if (!e)
      throw new Error("Transport undefined.");
    return e;
  }
  /**
   * Send INVITE.
   * @param request - Outgoing request.
   * @param delegate - Request delegate.
   */
  invite(e, r) {
    return new Kh(this, e, r);
  }
  /**
   * Send MESSAGE.
   * @param request - Outgoing request.
   * @param delegate - Request delegate.
   */
  message(e, r) {
    return new Wo(this, e, r);
  }
  /**
   * Send PUBLISH.
   * @param request - Outgoing request.
   * @param delegate - Request delegate.
   */
  publish(e, r) {
    return new Zh(this, e, r);
  }
  /**
   * Send REGISTER.
   * @param request - Outgoing request.
   * @param delegate - Request delegate.
   */
  register(e, r) {
    return new zh(this, e, r);
  }
  /**
   * Send SUBSCRIBE.
   * @param request - Outgoing request.
   * @param delegate - Request delegate.
   */
  subscribe(e, r) {
    return new Qh(this, e, r);
  }
  /**
   * Send a request.
   * @param request - Outgoing request.
   * @param delegate - Request delegate.
   */
  request(e, r) {
    return new ke(We, this, e, r);
  }
  /**
   * Outgoing request message factory function.
   * @param method - Method.
   * @param requestURI - Request-URI.
   * @param fromURI - From URI.
   * @param toURI - To URI.
   * @param options - Request options.
   * @param extraHeaders - Extra headers to add.
   * @param body - Message body.
   */
  makeOutgoingRequestMessage(e, r, s, i, n, a, o) {
    const c = this.configuration.sipjsId, l = this.configuration.displayName, h = this.configuration.viaForceRport, f = this.configuration.hackViaTcp, x = this.configuration.supportedOptionTags.slice();
    e === P.REGISTER && x.push("path", "gruu"), e === P.INVITE && (this.configuration.contact.pubGruu || this.configuration.contact.tempGruu) && x.push("gruu");
    const O = this.configuration.routeSet, W = this.configuration.userAgentHeaderFieldValue, M = this.configuration.viaHost, m = Object.assign(Object.assign({}, {
      callIdPrefix: c,
      forceRport: h,
      fromDisplayName: l,
      hackViaTcp: f,
      optionTags: x,
      routeSet: O,
      userAgentString: W,
      viaHost: M
    }), n);
    return new ur(e, r, s, i, m, a, o);
  }
  /**
   * Handle an incoming request message from the transport.
   * @param message - Incoming request message from transport layer.
   */
  receiveIncomingRequestFromTransport(e) {
    this.receiveRequestFromTransport(e);
  }
  /**
   * Handle an incoming response message from the transport.
   * @param message - Incoming response message from transport layer.
   */
  receiveIncomingResponseFromTransport(e) {
    this.receiveResponseFromTransport(e);
  }
  /**
   * A stateless UAS is a UAS that does not maintain transaction state.
   * It replies to requests normally, but discards any state that would
   * ordinarily be retained by a UAS after a response has been sent.  If a
   * stateless UAS receives a retransmission of a request, it regenerates
   * the response and re-sends it, just as if it were replying to the first
   * instance of the request. A UAS cannot be stateless unless the request
   * processing for that method would always result in the same response
   * if the requests are identical. This rules out stateless registrars,
   * for example.  Stateless UASs do not use a transaction layer; they
   * receive requests directly from the transport layer and send responses
   * directly to the transport layer.
   * https://tools.ietf.org/html/rfc3261#section-8.2.7
   * @param message - Incoming request message to reply to.
   * @param statusCode - Status code to reply with.
   */
  replyStateless(e, r) {
    const s = this.configuration.userAgentHeaderFieldValue, i = this.configuration.supportedOptionTagsResponse;
    r = Object.assign(Object.assign({}, r), { userAgent: s, supported: i });
    const n = jo(e, r);
    return this.transport.send(n.message).catch((a) => {
      a instanceof Error && this.logger.error(a.message), this.logger.error(`Transport error occurred sending stateless reply to ${e.method} request.`);
    }), n;
  }
  /**
   * In Section 18.2.1, replace the last paragraph with:
   *
   * Next, the server transport attempts to match the request to a
   * server transaction.  It does so using the matching rules described
   * in Section 17.2.3.  If a matching server transaction is found, the
   * request is passed to that transaction for processing.  If no match
   * is found, the request is passed to the core, which may decide to
   * construct a new server transaction for that request.
   * https://tools.ietf.org/html/rfc6026#section-8.10
   * @param message - Incoming request message from transport layer.
   */
  receiveRequestFromTransport(e) {
    const r = e.viaBranch, s = this.userAgentServers.get(r);
    if (e.method === P.ACK && s && s.transaction.state === y.Accepted && s instanceof Fi) {
      this.logger.warn(`Discarding out of dialog ACK after 2xx response sent on transaction ${r}.`);
      return;
    }
    if (e.method === P.CANCEL) {
      s ? (this.replyStateless(e, { statusCode: 200 }), s.transaction instanceof Ue && s.transaction.state === y.Proceeding && s instanceof Fi && s.receiveCancel(e)) : this.replyStateless(e, { statusCode: 481 });
      return;
    }
    if (s) {
      s.transaction.receiveRequest(e);
      return;
    }
    this.receiveRequest(e);
  }
  /**
   * UAC and UAS procedures depend strongly on two factors.  First, based
   * on whether the request or response is inside or outside of a dialog,
   * and second, based on the method of a request.  Dialogs are discussed
   * thoroughly in Section 12; they represent a peer-to-peer relationship
   * between user agents and are established by specific SIP methods, such
   * as INVITE.
   * @param message - Incoming request message.
   */
  receiveRequest(e) {
    if (!Gt.includes(e.method)) {
      const i = "Allow: " + Gt.toString();
      this.replyStateless(e, {
        statusCode: 405,
        extraHeaders: [i]
      });
      return;
    }
    if (!e.ruri)
      throw new Error("Request-URI undefined.");
    if (e.ruri.scheme !== "sip") {
      this.replyStateless(e, { statusCode: 416 });
      return;
    }
    const r = e.ruri, s = (i) => !!i && i.user === r.user;
    if (!s(this.configuration.aor) && !(s(this.configuration.contact.uri) || s(this.configuration.contact.pubGruu) || s(this.configuration.contact.tempGruu))) {
      this.logger.warn("Request-URI does not point to us."), e.method !== P.ACK && this.replyStateless(e, { statusCode: 404 });
      return;
    }
    if (e.method === P.INVITE && !e.hasHeader("Contact")) {
      this.replyStateless(e, {
        statusCode: 400,
        reasonPhrase: "Missing Contact Header"
      });
      return;
    }
    if (!e.toTag) {
      const i = e.viaBranch;
      if (!this.userAgentServers.has(i) && Array.from(this.userAgentServers.values()).some((a) => a.transaction.request.fromTag === e.fromTag && a.transaction.request.callId === e.callId && a.transaction.request.cseq === e.cseq)) {
        this.replyStateless(e, { statusCode: 482 });
        return;
      }
    }
    e.toTag ? this.receiveInsideDialogRequest(e) : this.receiveOutsideDialogRequest(e);
  }
  /**
   * Once a dialog has been established between two UAs, either of them
   * MAY initiate new transactions as needed within the dialog.  The UA
   * sending the request will take the UAC role for the transaction.  The
   * UA receiving the request will take the UAS role.  Note that these may
   * be different roles than the UAs held during the transaction that
   * established the dialog.
   * https://tools.ietf.org/html/rfc3261#section-12.2
   * @param message - Incoming request message.
   */
  receiveInsideDialogRequest(e) {
    if (e.method === P.NOTIFY) {
      const i = e.parseHeader("Event");
      if (!i || !i.event) {
        this.replyStateless(e, { statusCode: 489 });
        return;
      }
      const n = e.callId + e.toTag + i.event, a = this.subscribers.get(n);
      if (a) {
        const o = new Ys(this, e);
        a.onNotify(o);
        return;
      }
    }
    const r = e.callId + e.toTag + e.fromTag, s = this.dialogs.get(r);
    if (s) {
      if (e.method === P.OPTIONS) {
        const i = "Allow: " + Gt.toString(), n = "Accept: " + Ua.toString();
        this.replyStateless(e, {
          statusCode: 200,
          extraHeaders: [i, n]
        });
        return;
      }
      s.receiveRequest(e);
      return;
    }
    e.method !== P.ACK && this.replyStateless(e, { statusCode: 481 });
  }
  /**
   * Assuming all of the checks in the previous subsections are passed,
   * the UAS processing becomes method-specific.
   *  https://tools.ietf.org/html/rfc3261#section-8.2.5
   * @param message - Incoming request message.
   */
  receiveOutsideDialogRequest(e) {
    switch (e.method) {
      case P.ACK:
        break;
      case P.BYE:
        this.replyStateless(e, { statusCode: 481 });
        break;
      case P.CANCEL:
        throw new Error(`Unexpected out of dialog request method ${e.method}.`);
      case P.INFO:
        this.replyStateless(e, { statusCode: 405 });
        break;
      case P.INVITE:
        {
          const r = new Fi(this, e);
          this.delegate.onInvite ? this.delegate.onInvite(r) : r.reject();
        }
        break;
      case P.MESSAGE:
        {
          const r = new Vo(this, e);
          this.delegate.onMessage ? this.delegate.onMessage(r) : r.accept();
        }
        break;
      case P.NOTIFY:
        {
          const r = new Ys(this, e);
          this.delegate.onNotify ? this.delegate.onNotify(r) : r.reject({ statusCode: 405 });
        }
        break;
      case P.OPTIONS:
        {
          const r = "Allow: " + Gt.toString(), s = "Accept: " + Ua.toString();
          this.replyStateless(e, {
            statusCode: 200,
            extraHeaders: [r, s]
          });
        }
        break;
      case P.REFER:
        {
          const r = new Go(this, e);
          this.delegate.onRefer ? this.delegate.onRefer(r) : r.reject({ statusCode: 405 });
        }
        break;
      case P.REGISTER:
        {
          const r = new Jh(this, e);
          this.delegate.onRegister ? this.delegate.onRegister(r) : r.reject({ statusCode: 405 });
        }
        break;
      case P.SUBSCRIBE:
        {
          const r = new eu(this, e);
          this.delegate.onSubscribe ? this.delegate.onSubscribe(r) : r.reject({ statusCode: 480 });
        }
        break;
      default:
        throw new Error(`Unexpected out of dialog request method ${e.method}.`);
    }
  }
  /**
   * Responses are first processed by the transport layer and then passed
   * up to the transaction layer.  The transaction layer performs its
   * processing and then passes the response up to the TU.  The majority
   * of response processing in the TU is method specific.  However, there
   * are some general behaviors independent of the method.
   * https://tools.ietf.org/html/rfc3261#section-8.1.3
   * @param message - Incoming response message from transport layer.
   */
  receiveResponseFromTransport(e) {
    if (e.getHeaders("via").length > 1) {
      this.logger.warn("More than one Via header field present in the response, dropping");
      return;
    }
    const r = e.viaBranch + e.method, s = this.userAgentClients.get(r);
    s ? s.transaction.receiveResponse(e) : this.logger.warn(`Discarding unmatched ${e.statusCode} response to ${e.method} ${r}.`);
  }
}
function ru() {
  return (t) => !t.audio && !t.video ? Promise.resolve(new MediaStream()) : navigator.mediaDevices === void 0 ? Promise.reject(new Error("Media devices not available in insecure contexts.")) : navigator.mediaDevices.getUserMedia.call(navigator.mediaDevices, t);
}
function su() {
  return {
    bundlePolicy: "balanced",
    certificates: void 0,
    iceCandidatePoolSize: 0,
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    iceTransportPolicy: "all",
    rtcpMuxPolicy: "require"
  };
}
class At {
  /**
   * Constructor
   * @param logger - A logger
   * @param mediaStreamFactory - A factory to provide a MediaStream
   * @param options - Options passed from the SessionDescriptionHandleFactory
   */
  constructor(e, r, s) {
    e.debug("SessionDescriptionHandler.constructor"), this.logger = e, this.mediaStreamFactory = r, this.sessionDescriptionHandlerConfiguration = s, this._localMediaStream = new MediaStream(), this._remoteMediaStream = new MediaStream(), this._peerConnection = new RTCPeerConnection(s == null ? void 0 : s.peerConnectionConfiguration), this.initPeerConnectionEventHandlers();
  }
  /**
   * The local media stream currently being sent.
   *
   * @remarks
   * The local media stream initially has no tracks, so the presence of tracks
   * should not be assumed. Furthermore, tracks may be added or removed if the
   * local media changes - for example, on upgrade from audio only to a video session.
   * At any given time there will be at most one audio track and one video track
   * (it's possible that this restriction may not apply to sub-classes).
   * Use `MediaStream.onaddtrack` or add a listener for the `addtrack` event
   * to detect when a new track becomes available:
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack
   */
  get localMediaStream() {
    return this._localMediaStream;
  }
  /**
   * The remote media stream currently being received.
   *
   * @remarks
   * The remote media stream initially has no tracks, so the presence of tracks
   * should not be assumed. Furthermore, tracks may be added or removed if the
   * remote media changes - for example, on upgrade from audio only to a video session.
   * At any given time there will be at most one audio track and one video track
   * (it's possible that this restriction may not apply to sub-classes).
   * Use `MediaStream.onaddtrack` or add a listener for the `addtrack` event
   * to detect when a new track becomes available:
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack
   */
  get remoteMediaStream() {
    return this._remoteMediaStream;
  }
  /**
   * The data channel. Undefined before it is created.
   */
  get dataChannel() {
    return this._dataChannel;
  }
  /**
   * The peer connection. Undefined if peer connection has closed.
   *
   * @remarks
   * Use the peerConnectionDelegate to get access to the events associated
   * with the RTCPeerConnection. For example...
   *
   * Do NOT do this...
   * ```ts
   * peerConnection.onicecandidate = (event) => {
   *   // do something
   * };
   * ```
   * Instead, do this...
   * ```ts
   * peerConnection.peerConnectionDelegate = {
   *   onicecandidate: (event) => {
   *     // do something
   *   }
   * };
   * ```
   * While access to the underlying `RTCPeerConnection` is provided, note that
   * using methods which modify it may break the operation of this class.
   * In particular, this class depends on exclusive access to the
   * event handler properties. If you need access to the peer connection
   * events, either register for events using `addEventListener()` on
   * the `RTCPeerConnection` or set the `peerConnectionDelegate` on
   * this `SessionDescriptionHandler`.
   */
  get peerConnection() {
    return this._peerConnection;
  }
  /**
   * A delegate which provides access to the peer connection event handlers.
   *
   * @remarks
   * Use the peerConnectionDelegate to get access to the events associated
   * with the RTCPeerConnection. For example...
   *
   * Do NOT do this...
   * ```ts
   * peerConnection.onicecandidate = (event) => {
   *   // do something
   * };
   * ```
   * Instead, do this...
   * ```
   * peerConnection.peerConnectionDelegate = {
   *   onicecandidate: (event) => {
   *     // do something
   *   }
   * };
   * ```
   * Setting the peer connection event handlers directly is not supported
   * and may break this class. As this class depends on exclusive access
   * to them. This delegate is intended to provide access to the
   * RTCPeerConnection events in a fashion which is supported.
   */
  get peerConnectionDelegate() {
    return this._peerConnectionDelegate;
  }
  set peerConnectionDelegate(e) {
    this._peerConnectionDelegate = e;
  }
  // The addtrack event does not get fired when JavaScript code explicitly adds tracks to the stream (by calling addTrack()).
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack
  static dispatchAddTrackEvent(e, r) {
    e.dispatchEvent(new MediaStreamTrackEvent("addtrack", { track: r }));
  }
  // The removetrack event does not get fired when JavaScript code explicitly removes tracks from the stream (by calling removeTrack()).
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onremovetrack
  static dispatchRemoveTrackEvent(e, r) {
    e.dispatchEvent(new MediaStreamTrackEvent("removetrack", { track: r }));
  }
  /**
   * Stop tracks and close peer connection.
   */
  close() {
    this.logger.debug("SessionDescriptionHandler.close"), this._peerConnection !== void 0 && (this._peerConnection.getReceivers().forEach((e) => {
      e.track && e.track.stop();
    }), this._peerConnection.getSenders().forEach((e) => {
      e.track && e.track.stop();
    }), this._dataChannel && this._dataChannel.close(), this._peerConnection.close(), this._peerConnection = void 0);
  }
  /**
   * Helper function to enable/disable media tracks.
   * @param enable - If true enable tracks, otherwise disable tracks.
   */
  enableReceiverTracks(e) {
    const r = this.peerConnection;
    if (!r)
      throw new Error("Peer connection closed.");
    r.getReceivers().forEach((s) => {
      s.track && (s.track.enabled = e);
    });
  }
  /**
   * Helper function to enable/disable media tracks.
   * @param enable - If true enable tracks, otherwise disable tracks.
   */
  enableSenderTracks(e) {
    const r = this.peerConnection;
    if (!r)
      throw new Error("Peer connection closed.");
    r.getSenders().forEach((s) => {
      s.track && (s.track.enabled = e);
    });
  }
  /**
   * Creates an offer or answer.
   * @param options - Options bucket.
   * @param modifiers - Modifiers.
   */
  getDescription(e, r) {
    var s, i;
    if (this.logger.debug("SessionDescriptionHandler.getDescription"), this._peerConnection === void 0)
      return Promise.reject(new Error("Peer connection closed."));
    this.onDataChannel = e == null ? void 0 : e.onDataChannel;
    const n = (s = e == null ? void 0 : e.offerOptions) === null || s === void 0 ? void 0 : s.iceRestart, a = (e == null ? void 0 : e.iceGatheringTimeout) === void 0 ? (i = this.sessionDescriptionHandlerConfiguration) === null || i === void 0 ? void 0 : i.iceGatheringTimeout : e == null ? void 0 : e.iceGatheringTimeout;
    return this.getLocalMediaStream(e).then(() => this.updateDirection(e)).then(() => this.createDataChannel(e)).then(() => this.createLocalOfferOrAnswer(e)).then((o) => this.applyModifiers(o, r)).then((o) => this.setLocalSessionDescription(o)).then(() => this.waitForIceGatheringComplete(n, a)).then(() => this.getLocalSessionDescription()).then((o) => ({
      body: o.sdp,
      contentType: "application/sdp"
    })).catch((o) => {
      throw this.logger.error("SessionDescriptionHandler.getDescription failed - " + o), o;
    });
  }
  /**
   * Returns true if the SessionDescriptionHandler can handle the Content-Type described by a SIP message.
   * @param contentType - The content type that is in the SIP Message.
   */
  hasDescription(e) {
    return this.logger.debug("SessionDescriptionHandler.hasDescription"), e === "application/sdp";
  }
  /**
   * Called when ICE gathering completes and resolves any waiting promise.
   * @remarks
   * May be called prior to ICE gathering actually completing to allow the
   * session descirption handler proceed with whatever candidates have been
   * gathered up to this point in time. Use this to stop waiting on ICE to
   * complete if you are implementing your own ICE gathering completion strategy.
   */
  iceGatheringComplete() {
    this.logger.debug("SessionDescriptionHandler.iceGatheringComplete"), this.iceGatheringCompleteTimeoutId !== void 0 && (this.logger.debug("SessionDescriptionHandler.iceGatheringComplete - clearing timeout"), clearTimeout(this.iceGatheringCompleteTimeoutId), this.iceGatheringCompleteTimeoutId = void 0), this.iceGatheringCompletePromise !== void 0 && (this.logger.debug("SessionDescriptionHandler.iceGatheringComplete - resolving promise"), this.iceGatheringCompleteResolve && this.iceGatheringCompleteResolve(), this.iceGatheringCompletePromise = void 0, this.iceGatheringCompleteResolve = void 0, this.iceGatheringCompleteReject = void 0);
  }
  /**
   * Send DTMF via RTP (RFC 4733).
   * Returns true if DTMF send is successful, false otherwise.
   * @param tones - A string containing DTMF digits.
   * @param options - Options object to be used by sendDtmf.
   */
  sendDtmf(e, r) {
    if (this.logger.debug("SessionDescriptionHandler.sendDtmf"), this._peerConnection === void 0)
      return this.logger.error("SessionDescriptionHandler.sendDtmf failed - peer connection closed"), !1;
    const s = this._peerConnection.getSenders();
    if (s.length === 0)
      return this.logger.error("SessionDescriptionHandler.sendDtmf failed - no senders"), !1;
    const i = s[0].dtmf;
    if (!i)
      return this.logger.error("SessionDescriptionHandler.sendDtmf failed - no DTMF sender"), !1;
    const n = r == null ? void 0 : r.duration, a = r == null ? void 0 : r.interToneGap;
    try {
      i.insertDTMF(e, n, a);
    } catch (o) {
      return this.logger.error(o.toString()), !1;
    }
    return this.logger.log("SessionDescriptionHandler.sendDtmf sent via RTP: " + e.toString()), !0;
  }
  /**
   * Sets an offer or answer.
   * @param sdp - The session description.
   * @param options - Options bucket.
   * @param modifiers - Modifiers.
   */
  setDescription(e, r, s) {
    if (this.logger.debug("SessionDescriptionHandler.setDescription"), this._peerConnection === void 0)
      return Promise.reject(new Error("Peer connection closed."));
    this.onDataChannel = r == null ? void 0 : r.onDataChannel;
    const i = this._peerConnection.signalingState === "have-local-offer" ? "answer" : "offer";
    return this.getLocalMediaStream(r).then(() => this.applyModifiers({ sdp: e, type: i }, s)).then((n) => this.setRemoteSessionDescription(n)).catch((n) => {
      throw this.logger.error("SessionDescriptionHandler.setDescription failed - " + n), n;
    });
  }
  /**
   * Applies modifiers to SDP prior to setting the local or remote description.
   * @param sdp - SDP to modify.
   * @param modifiers - Modifiers to apply.
   */
  applyModifiers(e, r) {
    return this.logger.debug("SessionDescriptionHandler.applyModifiers"), !r || r.length === 0 ? Promise.resolve(e) : r.reduce((s, i) => s.then(i), Promise.resolve(e)).then((s) => {
      if (this.logger.debug("SessionDescriptionHandler.applyModifiers - modified sdp"), !s.sdp || !s.type)
        throw new Error("Invalid SDP.");
      return { sdp: s.sdp, type: s.type };
    });
  }
  /**
   * Create a data channel.
   * @remarks
   * Only creates a data channel if SessionDescriptionHandlerOptions.dataChannel is true.
   * Only creates a data channel if creating a local offer.
   * Only if one does not already exist.
   * @param options - Session description handler options.
   */
  createDataChannel(e) {
    if (this._peerConnection === void 0)
      return Promise.reject(new Error("Peer connection closed."));
    if ((e == null ? void 0 : e.dataChannel) !== !0 || this._dataChannel)
      return Promise.resolve();
    switch (this._peerConnection.signalingState) {
      case "stable":
        this.logger.debug("SessionDescriptionHandler.createDataChannel - creating data channel");
        try {
          return this._dataChannel = this._peerConnection.createDataChannel((e == null ? void 0 : e.dataChannelLabel) || "", e == null ? void 0 : e.dataChannelOptions), this.onDataChannel && this.onDataChannel(this._dataChannel), Promise.resolve();
        } catch (r) {
          return Promise.reject(r);
        }
      case "have-remote-offer":
        return Promise.resolve();
      case "have-local-offer":
      case "have-local-pranswer":
      case "have-remote-pranswer":
      case "closed":
      default:
        return Promise.reject(new Error("Invalid signaling state " + this._peerConnection.signalingState));
    }
  }
  /**
   * Depending on current signaling state, create a local offer or answer.
   * @param options - Session description handler options.
   */
  createLocalOfferOrAnswer(e) {
    if (this._peerConnection === void 0)
      return Promise.reject(new Error("Peer connection closed."));
    switch (this._peerConnection.signalingState) {
      case "stable":
        return this.logger.debug("SessionDescriptionHandler.createLocalOfferOrAnswer - creating SDP offer"), this._peerConnection.createOffer(e == null ? void 0 : e.offerOptions);
      case "have-remote-offer":
        return this.logger.debug("SessionDescriptionHandler.createLocalOfferOrAnswer - creating SDP answer"), this._peerConnection.createAnswer(e == null ? void 0 : e.answerOptions);
      case "have-local-offer":
      case "have-local-pranswer":
      case "have-remote-pranswer":
      case "closed":
      default:
        return Promise.reject(new Error("Invalid signaling state " + this._peerConnection.signalingState));
    }
  }
  /**
   * Get a media stream from the media stream factory and set the local media stream.
   * @param options - Session description handler options.
   */
  getLocalMediaStream(e) {
    if (this.logger.debug("SessionDescriptionHandler.getLocalMediaStream"), this._peerConnection === void 0)
      return Promise.reject(new Error("Peer connection closed."));
    let r = Object.assign({}, e == null ? void 0 : e.constraints);
    if (this.localMediaStreamConstraints) {
      if (r.audio = r.audio || this.localMediaStreamConstraints.audio, r.video = r.video || this.localMediaStreamConstraints.video, JSON.stringify(this.localMediaStreamConstraints.audio) === JSON.stringify(r.audio) && JSON.stringify(this.localMediaStreamConstraints.video) === JSON.stringify(r.video))
        return Promise.resolve();
    } else
      r.audio === void 0 && r.video === void 0 && (r = { audio: !0 });
    return this.localMediaStreamConstraints = r, this.mediaStreamFactory(r, this, e).then((s) => this.setLocalMediaStream(s));
  }
  /**
   * Sets the peer connection's sender tracks and local media stream tracks.
   *
   * @remarks
   * Only the first audio and video tracks of the provided MediaStream are utilized.
   * Adds tracks if audio and/or video tracks are not already present, otherwise replaces tracks.
   *
   * @param stream - Media stream containing tracks to be utilized.
   */
  setLocalMediaStream(e) {
    if (this.logger.debug("SessionDescriptionHandler.setLocalMediaStream"), !this._peerConnection)
      throw new Error("Peer connection undefined.");
    const r = this._peerConnection, s = this._localMediaStream, i = [], n = (c) => {
      const l = c.kind;
      if (l !== "audio" && l !== "video")
        throw new Error(`Unknown new track kind ${l}.`);
      const h = r.getSenders().find((f) => f.track && f.track.kind === l);
      h ? i.push(new Promise((f) => {
        this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - replacing sender ${l} track`), f();
      }).then(() => h.replaceTrack(c).then(() => {
        const f = s.getTracks().find((x) => x.kind === l);
        f && (f.stop(), s.removeTrack(f), At.dispatchRemoveTrackEvent(s, f)), s.addTrack(c), At.dispatchAddTrackEvent(s, c);
      }).catch((f) => {
        throw this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to replace sender ${l} track`), f;
      }))) : i.push(new Promise((f) => {
        this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - adding sender ${l} track`), f();
      }).then(() => {
        try {
          r.addTrack(c, s);
        } catch (f) {
          throw this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to add sender ${l} track`), f;
        }
        s.addTrack(c), At.dispatchAddTrackEvent(s, c);
      }));
    }, a = e.getAudioTracks();
    a.length && n(a[0]);
    const o = e.getVideoTracks();
    return o.length && n(o[0]), i.reduce((c, l) => c.then(() => l), Promise.resolve());
  }
  /**
   * Gets the peer connection's local session description.
   */
  getLocalSessionDescription() {
    if (this.logger.debug("SessionDescriptionHandler.getLocalSessionDescription"), this._peerConnection === void 0)
      return Promise.reject(new Error("Peer connection closed."));
    const e = this._peerConnection.localDescription;
    return e ? Promise.resolve(e) : Promise.reject(new Error("Failed to get local session description"));
  }
  /**
   * Sets the peer connection's local session description.
   * @param sessionDescription - sessionDescription The session description.
   */
  setLocalSessionDescription(e) {
    return this.logger.debug("SessionDescriptionHandler.setLocalSessionDescription"), this._peerConnection === void 0 ? Promise.reject(new Error("Peer connection closed.")) : this._peerConnection.setLocalDescription(e);
  }
  /**
   * Sets the peer connection's remote session description.
   * @param sessionDescription - The session description.
   */
  setRemoteSessionDescription(e) {
    if (this.logger.debug("SessionDescriptionHandler.setRemoteSessionDescription"), this._peerConnection === void 0)
      return Promise.reject(new Error("Peer connection closed."));
    const r = e.sdp;
    let s;
    switch (this._peerConnection.signalingState) {
      case "stable":
        s = "offer";
        break;
      case "have-local-offer":
        s = "answer";
        break;
      case "have-local-pranswer":
      case "have-remote-offer":
      case "have-remote-pranswer":
      case "closed":
      default:
        return Promise.reject(new Error("Invalid signaling state " + this._peerConnection.signalingState));
    }
    return r ? this._peerConnection.setRemoteDescription({ sdp: r, type: s }) : (this.logger.error("SessionDescriptionHandler.setRemoteSessionDescription failed - cannot set null sdp"), Promise.reject(new Error("SDP is undefined")));
  }
  /**
   * Sets a remote media stream track.
   *
   * @remarks
   * Adds tracks if audio and/or video tracks are not already present, otherwise replaces tracks.
   *
   * @param track - Media stream track to be utilized.
   */
  setRemoteTrack(e) {
    this.logger.debug("SessionDescriptionHandler.setRemoteTrack");
    const r = this._remoteMediaStream;
    r.getTrackById(e.id) ? this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - have remote ${e.kind} track`) : e.kind === "audio" ? (this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - adding remote ${e.kind} track`), r.getAudioTracks().forEach((s) => {
      s.stop(), r.removeTrack(s), At.dispatchRemoveTrackEvent(r, s);
    }), r.addTrack(e), At.dispatchAddTrackEvent(r, e)) : e.kind === "video" && (this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - adding remote ${e.kind} track`), r.getVideoTracks().forEach((s) => {
      s.stop(), r.removeTrack(s), At.dispatchRemoveTrackEvent(r, s);
    }), r.addTrack(e), At.dispatchAddTrackEvent(r, e));
  }
  /**
   * Depending on the current signaling state and the session hold state, update transceiver direction.
   * @param options - Session description handler options.
   */
  updateDirection(e) {
    if (this._peerConnection === void 0)
      return Promise.reject(new Error("Peer connection closed."));
    switch (this._peerConnection.signalingState) {
      case "stable":
        this.logger.debug("SessionDescriptionHandler.updateDirection - setting offer direction");
        {
          const r = (s) => {
            switch (s) {
              case "inactive":
                return e != null && e.hold ? "inactive" : "recvonly";
              case "recvonly":
                return e != null && e.hold ? "inactive" : "recvonly";
              case "sendonly":
                return e != null && e.hold ? "sendonly" : "sendrecv";
              case "sendrecv":
                return e != null && e.hold ? "sendonly" : "sendrecv";
              case "stopped":
                return "stopped";
              default:
                throw new Error("Should never happen");
            }
          };
          this._peerConnection.getTransceivers().forEach((s) => {
            if (s.direction) {
              const i = r(s.direction);
              s.direction !== i && (s.direction = i);
            }
          });
        }
        break;
      case "have-remote-offer":
        this.logger.debug("SessionDescriptionHandler.updateDirection - setting answer direction");
        {
          const r = (() => {
            const i = this._peerConnection.remoteDescription;
            if (!i)
              throw new Error("Failed to read remote offer");
            const n = /a=sendrecv\r\n|a=sendonly\r\n|a=recvonly\r\n|a=inactive\r\n/.exec(i.sdp);
            if (n)
              switch (n[0]) {
                case `a=inactive\r
`:
                  return "inactive";
                case `a=recvonly\r
`:
                  return "recvonly";
                case `a=sendonly\r
`:
                  return "sendonly";
                case `a=sendrecv\r
`:
                  return "sendrecv";
                default:
                  throw new Error("Should never happen");
              }
            return "sendrecv";
          })(), s = (() => {
            switch (r) {
              case "inactive":
                return "inactive";
              case "recvonly":
                return "sendonly";
              case "sendonly":
                return e != null && e.hold ? "inactive" : "recvonly";
              case "sendrecv":
                return e != null && e.hold ? "sendonly" : "sendrecv";
              default:
                throw new Error("Should never happen");
            }
          })();
          this._peerConnection.getTransceivers().forEach((i) => {
            i.direction && i.direction !== "stopped" && i.direction !== s && (i.direction = s);
          });
        }
        break;
      case "have-local-offer":
      case "have-local-pranswer":
      case "have-remote-pranswer":
      case "closed":
      default:
        return Promise.reject(new Error("Invalid signaling state " + this._peerConnection.signalingState));
    }
    return Promise.resolve();
  }
  /**
   * Wait for ICE gathering to complete.
   * @param restart - If true, waits if current state is "complete" (waits for transition to "complete").
   * @param timeout - Milliseconds after which waiting times out. No timeout if 0.
   */
  waitForIceGatheringComplete(e = !1, r = 0) {
    return this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete"), this._peerConnection === void 0 ? Promise.reject("Peer connection closed.") : !e && this._peerConnection.iceGatheringState === "complete" ? (this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - already complete"), Promise.resolve()) : (this.iceGatheringCompletePromise !== void 0 && (this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - rejecting prior waiting promise"), this.iceGatheringCompleteReject && this.iceGatheringCompleteReject(new Error("Promise superseded.")), this.iceGatheringCompletePromise = void 0, this.iceGatheringCompleteResolve = void 0, this.iceGatheringCompleteReject = void 0), this.iceGatheringCompletePromise = new Promise((s, i) => {
      this.iceGatheringCompleteResolve = s, this.iceGatheringCompleteReject = i, r > 0 && (this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - timeout in " + r), this.iceGatheringCompleteTimeoutId = setTimeout(() => {
        this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - timeout"), this.iceGatheringComplete();
      }, r));
    }), this.iceGatheringCompletePromise);
  }
  /**
   * Initializes the peer connection event handlers
   */
  initPeerConnectionEventHandlers() {
    if (this.logger.debug("SessionDescriptionHandler.initPeerConnectionEventHandlers"), !this._peerConnection)
      throw new Error("Peer connection undefined.");
    const e = this._peerConnection;
    e.onconnectionstatechange = (r) => {
      var s;
      const i = e.connectionState;
      this.logger.debug(`SessionDescriptionHandler.onconnectionstatechange ${i}`), !((s = this._peerConnectionDelegate) === null || s === void 0) && s.onconnectionstatechange && this._peerConnectionDelegate.onconnectionstatechange(r);
    }, e.ondatachannel = (r) => {
      var s;
      this.logger.debug("SessionDescriptionHandler.ondatachannel"), this._dataChannel = r.channel, this.onDataChannel && this.onDataChannel(this._dataChannel), !((s = this._peerConnectionDelegate) === null || s === void 0) && s.ondatachannel && this._peerConnectionDelegate.ondatachannel(r);
    }, e.onicecandidate = (r) => {
      var s;
      this.logger.debug("SessionDescriptionHandler.onicecandidate"), !((s = this._peerConnectionDelegate) === null || s === void 0) && s.onicecandidate && this._peerConnectionDelegate.onicecandidate(r);
    }, e.onicecandidateerror = (r) => {
      var s;
      this.logger.debug("SessionDescriptionHandler.onicecandidateerror"), !((s = this._peerConnectionDelegate) === null || s === void 0) && s.onicecandidateerror && this._peerConnectionDelegate.onicecandidateerror(r);
    }, e.oniceconnectionstatechange = (r) => {
      var s;
      const i = e.iceConnectionState;
      this.logger.debug(`SessionDescriptionHandler.oniceconnectionstatechange ${i}`), !((s = this._peerConnectionDelegate) === null || s === void 0) && s.oniceconnectionstatechange && this._peerConnectionDelegate.oniceconnectionstatechange(r);
    }, e.onicegatheringstatechange = (r) => {
      var s;
      const i = e.iceGatheringState;
      this.logger.debug(`SessionDescriptionHandler.onicegatheringstatechange ${i}`), i === "complete" && this.iceGatheringComplete(), !((s = this._peerConnectionDelegate) === null || s === void 0) && s.onicegatheringstatechange && this._peerConnectionDelegate.onicegatheringstatechange(r);
    }, e.onnegotiationneeded = (r) => {
      var s;
      this.logger.debug("SessionDescriptionHandler.onnegotiationneeded"), !((s = this._peerConnectionDelegate) === null || s === void 0) && s.onnegotiationneeded && this._peerConnectionDelegate.onnegotiationneeded(r);
    }, e.onsignalingstatechange = (r) => {
      var s;
      const i = e.signalingState;
      this.logger.debug(`SessionDescriptionHandler.onsignalingstatechange ${i}`), !((s = this._peerConnectionDelegate) === null || s === void 0) && s.onsignalingstatechange && this._peerConnectionDelegate.onsignalingstatechange(r);
    }, e.ontrack = (r) => {
      var s;
      const i = r.track.kind, n = r.track.enabled ? "enabled" : "disabled";
      this.logger.debug(`SessionDescriptionHandler.ontrack ${i} ${n}`), this.setRemoteTrack(r.track), !((s = this._peerConnectionDelegate) === null || s === void 0) && s.ontrack && this._peerConnectionDelegate.ontrack(r);
    };
  }
}
function iu(t) {
  return (e, r) => {
    t === void 0 && (t = ru());
    const i = {
      iceGatheringTimeout: (r == null ? void 0 : r.iceGatheringTimeout) !== void 0 ? r == null ? void 0 : r.iceGatheringTimeout : 5e3,
      peerConnectionConfiguration: Object.assign(Object.assign({}, su()), r == null ? void 0 : r.peerConnectionConfiguration)
    }, n = e.userAgent.getLogger("sip.SessionDescriptionHandler");
    return new At(n, t, i);
  };
}
class di {
  constructor(e, r) {
    if (this._state = j.Disconnected, this.transitioningState = !1, this._stateEventEmitter = new cs(), this.logger = e, r) {
      const n = r, a = n == null ? void 0 : n.wsServers, o = n == null ? void 0 : n.maxReconnectionAttempts;
      if (a !== void 0) {
        const c = 'The transport option "wsServers" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.';
        this.logger.warn(c);
      }
      if (o !== void 0) {
        const c = 'The transport option "maxReconnectionAttempts" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.';
        this.logger.warn(c);
      }
      a && !r.server && (typeof a == "string" && (r.server = a), a instanceof Array && (r.server = a[0]));
    }
    this.configuration = Object.assign(Object.assign({}, di.defaultOptions), r);
    const s = this.configuration.server, i = _e.parse(s, "absoluteURI");
    if (i === -1)
      throw this.logger.error(`Invalid WebSocket Server URL "${s}"`), new Error("Invalid WebSocket Server URL");
    if (!["wss", "ws", "udp"].includes(i.scheme))
      throw this.logger.error(`Invalid scheme in WebSocket Server URL "${s}"`), new Error("Invalid scheme in WebSocket Server URL");
    typeof this.configuration.headerProtocol == "string" && this.configuration.headerProtocol !== "" ? this._protocol = this.configuration.headerProtocol.toUpperCase() : this._protocol = i.scheme.toUpperCase();
  }
  dispose() {
    return this.disconnect();
  }
  /**
   * The protocol.
   *
   * @remarks
   * Formatted as defined for the Via header sent-protocol transport.
   * https://tools.ietf.org/html/rfc3261#section-20.42
   */
  get protocol() {
    return this._protocol;
  }
  /**
   * The URL of the WebSocket Server.
   */
  get server() {
    return this.configuration.server;
  }
  /**
   * Transport state.
   */
  get state() {
    return this._state;
  }
  /**
   * Transport state change emitter.
   */
  get stateChange() {
    return this._stateEventEmitter;
  }
  /**
   * The WebSocket.
   */
  get ws() {
    return this._ws;
  }
  /**
   * Connect to network.
   * Resolves once connected. Otherwise rejects with an Error.
   */
  connect() {
    return this._connect();
  }
  /**
   * Disconnect from network.
   * Resolves once disconnected. Otherwise rejects with an Error.
   */
  disconnect() {
    return this._disconnect();
  }
  /**
   * Returns true if the `state` equals "Connected".
   * @remarks
   * This is equivalent to `state === TransportState.Connected`.
   */
  isConnected() {
    return this.state === j.Connected;
  }
  /**
   * Sends a message.
   * Resolves once message is sent. Otherwise rejects with an Error.
   * @param message - Message to send.
   */
  send(e) {
    return this._send(e);
  }
  _connect() {
    switch (this.logger.log(`Connecting ${this.server}`), this.state) {
      case j.Connecting:
        if (this.transitioningState)
          return Promise.reject(this.transitionLoopDetectedError(j.Connecting));
        if (!this.connectPromise)
          throw new Error("Connect promise must be defined.");
        return this.connectPromise;
      case j.Connected:
        if (this.transitioningState)
          return Promise.reject(this.transitionLoopDetectedError(j.Connecting));
        if (this.connectPromise)
          throw new Error("Connect promise must not be defined.");
        return Promise.resolve();
      case j.Disconnecting:
        if (this.connectPromise)
          throw new Error("Connect promise must not be defined.");
        try {
          this.transitionState(j.Connecting);
        } catch (r) {
          if (r instanceof Wr)
            return Promise.reject(r);
          throw r;
        }
        break;
      case j.Disconnected:
        if (this.connectPromise)
          throw new Error("Connect promise must not be defined.");
        try {
          this.transitionState(j.Connecting);
        } catch (r) {
          if (r instanceof Wr)
            return Promise.reject(r);
          throw r;
        }
        break;
      default:
        throw new Error("Unknown state");
    }
    let e;
    try {
      e = new WebSocket(this.server, "sip"), e.binaryType = "arraybuffer", e.addEventListener("close", (r) => this.onWebSocketClose(r, e)), e.addEventListener("error", (r) => this.onWebSocketError(r, e)), e.addEventListener("open", (r) => this.onWebSocketOpen(r, e)), e.addEventListener("message", (r) => this.onWebSocketMessage(r, e)), this._ws = e;
    } catch (r) {
      return this._ws = void 0, this.logger.error("WebSocket construction failed."), this.logger.error(r.toString()), new Promise((s, i) => {
        this.connectResolve = s, this.connectReject = i, this.transitionState(j.Disconnected, r);
      });
    }
    return this.connectPromise = new Promise((r, s) => {
      this.connectResolve = r, this.connectReject = s, this.connectTimeout = setTimeout(() => {
        this.logger.warn("Connect timed out. Exceeded time set in configuration.connectionTimeout: " + this.configuration.connectionTimeout + "s."), e.close(1e3);
      }, this.configuration.connectionTimeout * 1e3);
    }), this.connectPromise;
  }
  _disconnect() {
    switch (this.logger.log(`Disconnecting ${this.server}`), this.state) {
      case j.Connecting:
        if (this.disconnectPromise)
          throw new Error("Disconnect promise must not be defined.");
        try {
          this.transitionState(j.Disconnecting);
        } catch (r) {
          if (r instanceof Wr)
            return Promise.reject(r);
          throw r;
        }
        break;
      case j.Connected:
        if (this.disconnectPromise)
          throw new Error("Disconnect promise must not be defined.");
        try {
          this.transitionState(j.Disconnecting);
        } catch (r) {
          if (r instanceof Wr)
            return Promise.reject(r);
          throw r;
        }
        break;
      case j.Disconnecting:
        if (this.transitioningState)
          return Promise.reject(this.transitionLoopDetectedError(j.Disconnecting));
        if (!this.disconnectPromise)
          throw new Error("Disconnect promise must be defined.");
        return this.disconnectPromise;
      case j.Disconnected:
        if (this.transitioningState)
          return Promise.reject(this.transitionLoopDetectedError(j.Disconnecting));
        if (this.disconnectPromise)
          throw new Error("Disconnect promise must not be defined.");
        return Promise.resolve();
      default:
        throw new Error("Unknown state");
    }
    if (!this._ws)
      throw new Error("WebSocket must be defined.");
    const e = this._ws;
    return this.disconnectPromise = new Promise((r, s) => {
      this.disconnectResolve = r, this.disconnectReject = s;
      try {
        e.close(1e3);
      } catch (i) {
        throw this.logger.error("WebSocket close failed."), this.logger.error(i.toString()), i;
      }
    }), this.disconnectPromise;
  }
  _send(e) {
    if (this.configuration.traceSip === !0 && this.logger.log(`Sending WebSocket message:

` + e + `
`), this._state !== j.Connected)
      return Promise.reject(new Error("Not connected."));
    if (!this._ws)
      throw new Error("WebSocket undefined.");
    try {
      this._ws.send(e);
    } catch (r) {
      return r instanceof Error ? Promise.reject(r) : Promise.reject(new Error("WebSocket send failed."));
    }
    return Promise.resolve();
  }
  /**
   * WebSocket "onclose" event handler.
   * @param ev - Event.
   */
  onWebSocketClose(e, r) {
    if (r !== this._ws)
      return;
    const s = `WebSocket closed ${this.server} (code: ${e.code})`, i = this.disconnectPromise ? void 0 : new Error(s);
    i && this.logger.warn("WebSocket closed unexpectedly"), this.logger.log(s), this._ws = void 0, this.transitionState(j.Disconnected, i);
  }
  /**
   * WebSocket "onerror" event handler.
   * @param ev - Event.
   */
  onWebSocketError(e, r) {
    r === this._ws && this.logger.error("WebSocket error occurred.");
  }
  /**
   * WebSocket "onmessage" event handler.
   * @param ev - Event.
   */
  onWebSocketMessage(e, r) {
    if (r !== this._ws)
      return;
    const s = e.data;
    let i;
    if (/^(\r\n)+$/.test(s)) {
      this.clearKeepAliveTimeout(), this.configuration.traceSip === !0 && this.logger.log("Received WebSocket message with CRLF Keep Alive response");
      return;
    }
    if (!s) {
      this.logger.warn("Received empty message, discarding...");
      return;
    }
    if (typeof s != "string") {
      try {
        i = new TextDecoder().decode(new Uint8Array(s));
      } catch (n) {
        this.logger.error(n.toString()), this.logger.error("Received WebSocket binary message failed to be converted into string, message discarded");
        return;
      }
      this.configuration.traceSip === !0 && this.logger.log(`Received WebSocket binary message:

` + i + `
`);
    } else
      i = s, this.configuration.traceSip === !0 && this.logger.log(`Received WebSocket text message:

` + i + `
`);
    if (this.state !== j.Connected) {
      this.logger.warn("Received message while not connected, discarding...");
      return;
    }
    if (this.onMessage)
      try {
        this.onMessage(i);
      } catch (n) {
        throw this.logger.error(n.toString()), this.logger.error("Exception thrown by onMessage callback"), n;
      }
  }
  /**
   * WebSocket "onopen" event handler.
   * @param ev - Event.
   */
  onWebSocketOpen(e, r) {
    r === this._ws && this._state === j.Connecting && (this.logger.log(`WebSocket opened ${this.server}`), this.transitionState(j.Connected));
  }
  /**
   * Helper function to generate an Error.
   * @param state - State transitioning to.
   */
  transitionLoopDetectedError(e) {
    let r = "A state transition loop has been detected.";
    return r += ` An attempt to transition from ${this._state} to ${e} before the prior transition completed.`, r += " Perhaps you are synchronously calling connect() or disconnect() from a callback or state change handler?", this.logger.error(r), new Wr("Loop detected.");
  }
  /**
   * Transition transport state.
   * @internal
   */
  transitionState(e, r) {
    const s = () => {
      throw new Error(`Invalid state transition from ${this._state} to ${e}`);
    };
    if (this.transitioningState)
      throw this.transitionLoopDetectedError(e);
    switch (this.transitioningState = !0, this._state) {
      case j.Connecting:
        e !== j.Connected && e !== j.Disconnecting && e !== j.Disconnected && s();
        break;
      case j.Connected:
        e !== j.Disconnecting && e !== j.Disconnected && s();
        break;
      case j.Disconnecting:
        e !== j.Connecting && e !== j.Disconnected && s();
        break;
      case j.Disconnected:
        e !== j.Connecting && s();
        break;
      default:
        throw new Error("Unknown state.");
    }
    const i = this._state;
    this._state = e;
    const n = this.connectResolve, a = this.connectReject;
    i === j.Connecting && (this.connectPromise = void 0, this.connectResolve = void 0, this.connectReject = void 0);
    const o = this.disconnectResolve, c = this.disconnectReject;
    if (i === j.Disconnecting && (this.disconnectPromise = void 0, this.disconnectResolve = void 0, this.disconnectReject = void 0), this.connectTimeout && (clearTimeout(this.connectTimeout), this.connectTimeout = void 0), this.logger.log(`Transitioned from ${i} to ${this._state}`), this._stateEventEmitter.emit(this._state), e === j.Connected && (this.startSendingKeepAlives(), this.onConnect))
      try {
        this.onConnect();
      } catch (l) {
        throw this.logger.error(l.toString()), this.logger.error("Exception thrown by onConnect callback"), l;
      }
    if (i === j.Connected && (this.stopSendingKeepAlives(), this.onDisconnect))
      try {
        r ? this.onDisconnect(r) : this.onDisconnect();
      } catch (l) {
        throw this.logger.error(l.toString()), this.logger.error("Exception thrown by onDisconnect callback"), l;
      }
    if (i === j.Connecting) {
      if (!n)
        throw new Error("Connect resolve undefined.");
      if (!a)
        throw new Error("Connect reject undefined.");
      e === j.Connected ? n() : a(r || new Error("Connect aborted."));
    }
    if (i === j.Disconnecting) {
      if (!o)
        throw new Error("Disconnect resolve undefined.");
      if (!c)
        throw new Error("Disconnect reject undefined.");
      e === j.Disconnected ? o() : c(r || new Error("Disconnect aborted."));
    }
    this.transitioningState = !1;
  }
  // TODO: Review "KeepAlive Stuff".
  // It is not clear if it works and there are no tests for it.
  // It was blindly lifted the keep alive code unchanged from earlier transport code.
  //
  // From the RFC...
  //
  // SIP WebSocket Clients and Servers may keep their WebSocket
  // connections open by sending periodic WebSocket "Ping" frames as
  // described in [RFC6455], Section 5.5.2.
  // ...
  // The indication and use of the CRLF NAT keep-alive mechanism defined
  // for SIP connection-oriented transports in [RFC5626], Section 3.5.1 or
  // [RFC6223] are, of course, usable over the transport defined in this
  // specification.
  // https://tools.ietf.org/html/rfc7118#section-6
  //
  // and...
  //
  // The Ping frame contains an opcode of 0x9.
  // https://tools.ietf.org/html/rfc6455#section-5.5.2
  //
  // ==============================
  // KeepAlive Stuff
  // ==============================
  clearKeepAliveTimeout() {
    this.keepAliveDebounceTimeout && clearTimeout(this.keepAliveDebounceTimeout), this.keepAliveDebounceTimeout = void 0;
  }
  /**
   * Send a keep-alive (a double-CRLF sequence).
   */
  sendKeepAlive() {
    return this.keepAliveDebounceTimeout ? Promise.resolve() : (this.keepAliveDebounceTimeout = setTimeout(() => {
      this.clearKeepAliveTimeout();
    }, this.configuration.keepAliveDebounce * 1e3), this.send(`\r
\r
`));
  }
  /**
   * Start sending keep-alives.
   */
  startSendingKeepAlives() {
    const e = (r) => {
      const s = r * 0.8;
      return 1e3 * (Math.random() * (r - s) + s);
    };
    this.configuration.keepAliveInterval && !this.keepAliveInterval && (this.keepAliveInterval = setInterval(() => {
      this.sendKeepAlive(), this.startSendingKeepAlives();
    }, e(this.configuration.keepAliveInterval)));
  }
  /**
   * Stop sending keep-alives.
   */
  stopSendingKeepAlives() {
    this.keepAliveInterval && clearInterval(this.keepAliveInterval), this.keepAliveDebounceTimeout && clearTimeout(this.keepAliveDebounceTimeout), this.keepAliveInterval = void 0, this.keepAliveDebounceTimeout = void 0;
  }
}
di.defaultOptions = {
  server: "",
  connectionTimeout: 5,
  keepAliveInterval: 0,
  keepAliveDebounce: 10,
  traceSip: !0,
  headerProtocol: ""
};
class Ar {
  /**
   * Constructs a new instance of the `UserAgent` class.
   * @param options - Options bucket. See {@link UserAgentOptions} for details.
   */
  constructor(e = {}) {
    if (this._publishers = {}, this._registerers = {}, this._sessions = {}, this._subscriptions = {}, this._state = De.Stopped, this._stateEventEmitter = new cs(), this.delegate = e.delegate, this.options = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, Ar.defaultOptions()), { sipjsId: cr(5) }), { uri: new vt("sip", "anonymous." + cr(6), "anonymous.invalid") }), { viaHost: cr(12) + ".invalid" }), Ar.stripUndefinedProperties(e)), this.options.hackIpInContact)
      if (typeof this.options.hackIpInContact == "boolean" && this.options.hackIpInContact) {
        const i = Math.floor(Math.random() * 254 + 1);
        this.options.viaHost = "192.0.2." + i;
      } else
        this.options.hackIpInContact && (this.options.viaHost = this.options.hackIpInContact);
    switch (this.loggerFactory = new Oh(), this.logger = this.loggerFactory.getLogger("sip.UserAgent"), this.loggerFactory.builtinEnabled = this.options.logBuiltinEnabled, this.loggerFactory.connector = this.options.logConnector, this.options.logLevel) {
      case "error":
        this.loggerFactory.level = Ee.error;
        break;
      case "warn":
        this.loggerFactory.level = Ee.warn;
        break;
      case "log":
        this.loggerFactory.level = Ee.log;
        break;
      case "debug":
        this.loggerFactory.level = Ee.debug;
        break;
    }
    if (this.options.logConfiguration && (this.logger.log("Configuration:"), Object.keys(this.options).forEach((r) => {
      const s = this.options[r];
      switch (r) {
        case "uri":
        case "sessionDescriptionHandlerFactory":
          this.logger.log("· " + r + ": " + s);
          break;
        case "authorizationPassword":
          this.logger.log("· " + r + ": NOT SHOWN");
          break;
        case "transportConstructor":
          this.logger.log("· " + r + ": " + s.name);
          break;
        default:
          this.logger.log("· " + r + ": " + JSON.stringify(s));
      }
    })), this.options.transportOptions) {
      const r = this.options.transportOptions, s = r.maxReconnectionAttempts, i = r.reconnectionTimeout;
      if (s !== void 0) {
        const n = 'The transport option "maxReconnectionAttempts" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.';
        this.logger.warn(n);
      }
      if (i !== void 0) {
        const n = 'The transport option "reconnectionTimeout" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.';
        this.logger.warn(n);
      }
      e.reconnectionDelay === void 0 && i !== void 0 && (this.options.reconnectionDelay = i), e.reconnectionAttempts === void 0 && s !== void 0 && (this.options.reconnectionAttempts = s);
    }
    if (e.reconnectionDelay !== void 0) {
      const r = 'The user agent option "reconnectionDelay" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.';
      this.logger.warn(r);
    }
    if (e.reconnectionAttempts !== void 0) {
      const r = 'The user agent option "reconnectionAttempts" as has apparently been specified and has been deprecated. It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.';
      this.logger.warn(r);
    }
    if (this._transport = new this.options.transportConstructor(this.getLogger("sip.Transport"), this.options.transportOptions), this.initTransportCallbacks(), this._contact = this.initContact(), this._instanceId = this.options.instanceId ? this.options.instanceId : Ar.newUUID(), _e.parse(this._instanceId, "uuid") === -1)
      throw new Error("Invalid instanceId.");
    this._userAgentCore = this.initCore();
  }
  /**
   * Create a URI instance from a string.
   * @param uri - The string to parse.
   *
   * @remarks
   * Returns undefined if the syntax of the URI is invalid.
   * The syntax must conform to a SIP URI as defined in the RFC.
   * 25 Augmented BNF for the SIP Protocol
   * https://tools.ietf.org/html/rfc3261#section-25
   *
   * @example
   * ```ts
   * const uri = UserAgent.makeURI("sip:edgar@example.com");
   * ```
   */
  static makeURI(e) {
    return _e.URIParse(e);
  }
  /** Default user agent options. */
  static defaultOptions() {
    return {
      allowLegacyNotifications: !1,
      authorizationHa1: "",
      authorizationPassword: "",
      authorizationUsername: "",
      delegate: {},
      contactName: "",
      contactParams: { transport: "ws" },
      displayName: "",
      forceRport: !1,
      gracefulShutdown: !0,
      hackAllowUnregisteredOptionTags: !1,
      hackIpInContact: !1,
      hackViaTcp: !1,
      instanceId: "",
      instanceIdAlwaysAdded: !1,
      logBuiltinEnabled: !0,
      logConfiguration: !0,
      logConnector: () => {
      },
      logLevel: "log",
      noAnswerTimeout: 60,
      preloadedRouteSet: [],
      reconnectionAttempts: 0,
      reconnectionDelay: 4,
      sendInitialProvisionalResponse: !0,
      sessionDescriptionHandlerFactory: iu(),
      sessionDescriptionHandlerFactoryOptions: {},
      sipExtension100rel: rt.Unsupported,
      sipExtensionReplaces: rt.Unsupported,
      sipExtensionExtraSupported: [],
      sipjsId: "",
      transportConstructor: di,
      transportOptions: {},
      uri: new vt("sip", "anonymous", "anonymous.invalid"),
      userAgentString: "SIP.js/" + bh,
      viaHost: ""
    };
  }
  // http://stackoverflow.com/users/109538/broofa
  static newUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (r) => {
      const s = Math.floor(Math.random() * 16);
      return (r === "x" ? s : s % 4 + 8).toString(16);
    });
  }
  /**
   * Strip properties with undefined values from options.
   * This is a work around while waiting for missing vs undefined to be addressed (or not)...
   * https://github.com/Microsoft/TypeScript/issues/13195
   * @param options - Options to reduce
   */
  static stripUndefinedProperties(e) {
    return Object.keys(e).reduce((r, s) => (e[s] !== void 0 && (r[s] = e[s]), r), {});
  }
  /**
   * User agent configuration.
   */
  get configuration() {
    return this.options;
  }
  /**
   * User agent contact.
   */
  get contact() {
    return this._contact;
  }
  /**
   * User agent instance id.
   */
  get instanceId() {
    return this._instanceId;
  }
  /**
   * User agent state.
   */
  get state() {
    return this._state;
  }
  /**
   * User agent state change emitter.
   */
  get stateChange() {
    return this._stateEventEmitter;
  }
  /**
   * User agent transport.
   */
  get transport() {
    return this._transport;
  }
  /**
   * User agent core.
   */
  get userAgentCore() {
    return this._userAgentCore;
  }
  /**
   * The logger.
   */
  getLogger(e, r) {
    return this.loggerFactory.getLogger(e, r);
  }
  /**
   * The logger factory.
   */
  getLoggerFactory() {
    return this.loggerFactory;
  }
  /**
   * True if transport is connected.
   */
  isConnected() {
    return this.transport.isConnected();
  }
  /**
   * Reconnect the transport.
   */
  reconnect() {
    return this.state === De.Stopped ? Promise.reject(new Error("User agent stopped.")) : Promise.resolve().then(() => this.transport.connect());
  }
  /**
   * Start the user agent.
   *
   * @remarks
   * Resolves if transport connects, otherwise rejects.
   * Calling `start()` after calling `stop()` will fail if `stop()` has yet to resolve.
   *
   * @example
   * ```ts
   * userAgent.start()
   *   .then(() => {
   *     // userAgent.isConnected() === true
   *   })
   *   .catch((error: Error) => {
   *     // userAgent.isConnected() === false
   *   });
   * ```
   */
  start() {
    return this.state === De.Started ? (this.logger.warn("User agent already started"), Promise.resolve()) : (this.logger.log(`Starting ${this.configuration.uri}`), this.transitionState(De.Started), this.transport.connect());
  }
  /**
   * Stop the user agent.
   *
   * @remarks
   * Resolves when the user agent has completed a graceful shutdown.
   * ```txt
   * 1) Sessions terminate.
   * 2) Registerers unregister.
   * 3) Subscribers unsubscribe.
   * 4) Publishers unpublish.
   * 5) Transport disconnects.
   * 6) User Agent Core resets.
   * ```
   * The user agent state transistions to stopped once these steps have been completed.
   * Calling `start()` after calling `stop()` will fail if `stop()` has yet to resolve.
   *
   * NOTE: While this is a "graceful shutdown", it can also be very slow one if you
   * are waiting for the returned Promise to resolve. The disposal of the clients and
   * dialogs is done serially - waiting on one to finish before moving on to the next.
   * This can be slow if there are lot of subscriptions to unsubscribe for example.
   *
   * THE SLOW PACE IS INTENTIONAL!
   * While one could spin them all down in parallel, this could slam the remote server.
   * It is bad practice to denial of service attack (DoS attack) servers!!!
   * Moreover, production servers will automatically blacklist clients which send too
   * many requests in too short a period of time - dropping any additional requests.
   *
   * If a different approach to disposing is needed, one can implement whatever is
   * needed and execute that prior to calling `stop()`. Alternatively one may simply
   * not wait for the Promise returned by `stop()` to complete.
   */
  async stop() {
    if (this.state === De.Stopped)
      return this.logger.warn("User agent already stopped"), Promise.resolve();
    if (this.logger.log(`Stopping ${this.configuration.uri}`), !this.options.gracefulShutdown)
      return this.logger.log("Dispose of transport"), this.transport.dispose().catch((o) => {
        throw this.logger.error(o.message), o;
      }), this.logger.log("Dispose of core"), this.userAgentCore.dispose(), this._publishers = {}, this._registerers = {}, this._sessions = {}, this._subscriptions = {}, this.transitionState(De.Stopped), Promise.resolve();
    const e = Object.assign({}, this._publishers), r = Object.assign({}, this._registerers), s = Object.assign({}, this._sessions), i = Object.assign({}, this._subscriptions), n = this.transport, a = this.userAgentCore;
    this.logger.log("Dispose of registerers");
    for (const o in r)
      r[o] && await r[o].dispose().catch((c) => {
        throw this.logger.error(c.message), delete this._registerers[o], c;
      });
    this.logger.log("Dispose of sessions");
    for (const o in s)
      s[o] && await s[o].dispose().catch((c) => {
        throw this.logger.error(c.message), delete this._sessions[o], c;
      });
    this.logger.log("Dispose of subscriptions");
    for (const o in i)
      i[o] && await i[o].dispose().catch((c) => {
        throw this.logger.error(c.message), delete this._subscriptions[o], c;
      });
    this.logger.log("Dispose of publishers");
    for (const o in e)
      e[o] && await e[o].dispose().catch((c) => {
        throw this.logger.error(c.message), delete this._publishers[o], c;
      });
    this.logger.log("Dispose of transport"), await n.dispose().catch((o) => {
      throw this.logger.error(o.message), o;
    }), this.logger.log("Dispose of core"), a.dispose(), this.transitionState(De.Stopped);
  }
  /**
   * Used to avoid circular references.
   * @internal
   */
  _makeInviter(e, r) {
    return new Ph(this, e, r);
  }
  /**
   * Attempt reconnection up to `maxReconnectionAttempts` times.
   * @param reconnectionAttempt - Current attempt number.
   */
  attemptReconnection(e = 1) {
    const r = this.options.reconnectionAttempts, s = this.options.reconnectionDelay;
    if (e > r) {
      this.logger.log("Maximum reconnection attempts reached");
      return;
    }
    this.logger.log(`Reconnection attempt ${e} of ${r} - trying`), setTimeout(() => {
      this.reconnect().then(() => {
        this.logger.log(`Reconnection attempt ${e} of ${r} - succeeded`);
      }).catch((i) => {
        this.logger.error(i.message), this.logger.log(`Reconnection attempt ${e} of ${r} - failed`), this.attemptReconnection(++e);
      });
    }, e === 1 ? 0 : s * 1e3);
  }
  /**
   * Initialize contact.
   */
  initContact() {
    const e = this.options.contactName !== "" ? this.options.contactName : cr(8), r = this.options.contactParams;
    return {
      pubGruu: void 0,
      tempGruu: void 0,
      uri: new vt("sip", e, this.options.viaHost, void 0, r),
      toString: (i = {}) => {
        const n = i.anonymous || !1, a = i.outbound || !1, o = i.register || !1;
        let c = "<";
        return n ? c += this.contact.tempGruu || `sip:anonymous@anonymous.invalid;transport=${r.transport ? r.transport : "ws"}` : o ? c += this.contact.uri : c += this.contact.pubGruu || this.contact.uri, a && (c += ";ob"), c += ">", this.options.instanceIdAlwaysAdded && (c += ';+sip.instance="<urn:uuid:' + this._instanceId + '>"'), c;
      }
    };
  }
  /**
   * Initialize user agent core.
   */
  initCore() {
    let e = [];
    e.push("outbound"), this.options.sipExtension100rel === rt.Supported && e.push("100rel"), this.options.sipExtensionReplaces === rt.Supported && e.push("replaces"), this.options.sipExtensionExtraSupported && e.push(...this.options.sipExtensionExtraSupported), this.options.hackAllowUnregisteredOptionTags || (e = e.filter((n) => Ah[n])), e = Array.from(new Set(e));
    const r = e.slice();
    (this.contact.pubGruu || this.contact.tempGruu) && r.push("gruu");
    const s = {
      aor: this.options.uri,
      contact: this.contact,
      displayName: this.options.displayName,
      loggerFactory: this.loggerFactory,
      hackViaTcp: this.options.hackViaTcp,
      routeSet: this.options.preloadedRouteSet,
      supportedOptionTags: e,
      supportedOptionTagsResponse: r,
      sipjsId: this.options.sipjsId,
      userAgentHeaderFieldValue: this.options.userAgentString,
      viaForceRport: this.options.forceRport,
      viaHost: this.options.viaHost,
      authenticationFactory: () => {
        const n = this.options.authorizationUsername ? this.options.authorizationUsername : this.options.uri.user, a = this.options.authorizationPassword ? this.options.authorizationPassword : void 0, o = this.options.authorizationHa1 ? this.options.authorizationHa1 : void 0;
        return new Hh(this.getLoggerFactory(), o, n, a);
      },
      transportAccessor: () => this.transport
    }, i = {
      onInvite: (n) => {
        var a;
        const o = new kh(this, n);
        if (n.delegate = {
          onCancel: (c) => {
            o._onCancel(c);
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onTransportError: (c) => {
            this.logger.error("A transport error has occurred while handling an incoming INVITE request.");
          }
        }, n.trying(), this.options.sipExtensionReplaces !== rt.Unsupported) {
          const l = n.message.parseHeader("replaces");
          if (l) {
            const h = l.call_id;
            if (typeof h != "string")
              throw new Error("Type of call id is not string");
            const f = l.replaces_to_tag;
            if (typeof f != "string")
              throw new Error("Type of to tag is not string");
            const x = l.replaces_from_tag;
            if (typeof x != "string")
              throw new Error("type of from tag is not string");
            const O = h + f + x, W = this.userAgentCore.dialogs.get(O);
            if (!W) {
              o.reject({ statusCode: 481 });
              return;
            }
            if (!W.early && l.early_only === !0) {
              o.reject({ statusCode: 486 });
              return;
            }
            const M = this._sessions[h + x] || this._sessions[h + f] || void 0;
            if (!M)
              throw new Error("Session does not exist.");
            o._replacee = M;
          }
        }
        if (!((a = this.delegate) === null || a === void 0) && a.onInvite) {
          if (o.autoSendAnInitialProvisionalResponse) {
            o.progress().then(() => {
              var c;
              if (((c = this.delegate) === null || c === void 0 ? void 0 : c.onInvite) === void 0)
                throw new Error("onInvite undefined.");
              this.delegate.onInvite(o);
            });
            return;
          }
          this.delegate.onInvite(o);
          return;
        }
        o.reject({ statusCode: 486 });
      },
      onMessage: (n) => {
        if (this.delegate && this.delegate.onMessage) {
          const a = new Lo(n);
          this.delegate.onMessage(a);
        } else
          n.accept();
      },
      onNotify: (n) => {
        if (this.delegate && this.delegate.onNotify) {
          const a = new sn(n);
          this.delegate.onNotify(a);
        } else
          this.options.allowLegacyNotifications ? n.accept() : n.reject({ statusCode: 481 });
      },
      onRefer: (n) => {
        this.logger.warn("Received an out of dialog REFER request"), this.delegate && this.delegate.onReferRequest ? this.delegate.onReferRequest(n) : n.reject({ statusCode: 405 });
      },
      onRegister: (n) => {
        this.logger.warn("Received an out of dialog REGISTER request"), this.delegate && this.delegate.onRegisterRequest ? this.delegate.onRegisterRequest(n) : n.reject({ statusCode: 405 });
      },
      onSubscribe: (n) => {
        this.logger.warn("Received an out of dialog SUBSCRIBE request"), this.delegate && this.delegate.onSubscribeRequest ? this.delegate.onSubscribeRequest(n) : n.reject({ statusCode: 405 });
      }
    };
    return new tu(s, i);
  }
  initTransportCallbacks() {
    this.transport.onConnect = () => this.onTransportConnect(), this.transport.onDisconnect = (e) => this.onTransportDisconnect(e), this.transport.onMessage = (e) => this.onTransportMessage(e);
  }
  onTransportConnect() {
    this.state !== De.Stopped && this.delegate && this.delegate.onConnect && this.delegate.onConnect();
  }
  onTransportDisconnect(e) {
    this.state !== De.Stopped && (this.delegate && this.delegate.onDisconnect && this.delegate.onDisconnect(e), e && this.options.reconnectionAttempts > 0 && this.attemptReconnection());
  }
  onTransportMessage(e) {
    const r = Ps.parseMessage(e, this.getLogger("sip.Parser"));
    if (!r) {
      this.logger.warn("Failed to parse incoming message. Dropping.");
      return;
    }
    if (this.state === De.Stopped && r instanceof $r) {
      this.logger.warn(`Received ${r.method} request while stopped. Dropping.`);
      return;
    }
    const s = () => {
      const i = ["from", "to", "call_id", "cseq", "via"];
      for (const n of i)
        if (!r.hasHeader(n))
          return this.logger.warn(`Missing mandatory header field : ${n}.`), !1;
      return !0;
    };
    if (r instanceof $r) {
      if (!s()) {
        this.logger.warn("Request missing mandatory header field. Dropping.");
        return;
      }
      if (!r.toTag && r.callId.substr(0, 5) === this.options.sipjsId) {
        this.userAgentCore.replyStateless(r, { statusCode: 482 });
        return;
      }
      const i = ls(r.body), n = r.getHeader("content-length");
      if (n && i < Number(n)) {
        this.userAgentCore.replyStateless(r, { statusCode: 400 });
        return;
      }
    }
    if (r instanceof tr) {
      if (!s()) {
        this.logger.warn("Response missing mandatory header field. Dropping.");
        return;
      }
      if (r.getHeaders("via").length > 1) {
        this.logger.warn("More than one Via header field present in the response. Dropping.");
        return;
      }
      if (r.via.host !== this.options.viaHost || r.via.port !== void 0) {
        this.logger.warn("Via sent-by in the response does not match UA Via host value. Dropping.");
        return;
      }
      const i = ls(r.body), n = r.getHeader("content-length");
      if (n && i < Number(n)) {
        this.logger.warn("Message body length is lower than the value in Content-Length header field. Dropping.");
        return;
      }
    }
    if (r instanceof $r) {
      this.userAgentCore.receiveIncomingRequestFromTransport(r);
      return;
    }
    if (r instanceof tr) {
      this.userAgentCore.receiveIncomingResponseFromTransport(r);
      return;
    }
    throw new Error("Invalid message type.");
  }
  /**
   * Transition state.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transitionState(e, r) {
    const s = () => {
      throw new Error(`Invalid state transition from ${this._state} to ${e}`);
    };
    switch (this._state) {
      case De.Started:
        e !== De.Stopped && s();
        break;
      case De.Stopped:
        e !== De.Started && s();
        break;
      default:
        throw new Error("Unknown state.");
    }
    this.logger.log(`Transitioned from ${this._state} to ${e}`), this._state = e, this._stateEventEmitter.emit(this._state);
  }
}
//! moment.js
//! version : 2.29.4
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
var Ko;
function A() {
  return Ko.apply(null, arguments);
}
function nu(t) {
  Ko = t;
}
function ct(t) {
  return t instanceof Array || Object.prototype.toString.call(t) === "[object Array]";
}
function fr(t) {
  return t != null && Object.prototype.toString.call(t) === "[object Object]";
}
function te(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
function On(t) {
  if (Object.getOwnPropertyNames)
    return Object.getOwnPropertyNames(t).length === 0;
  var e;
  for (e in t)
    if (te(t, e))
      return !1;
  return !0;
}
function Ne(t) {
  return t === void 0;
}
function Nt(t) {
  return typeof t == "number" || Object.prototype.toString.call(t) === "[object Number]";
}
function gs(t) {
  return t instanceof Date || Object.prototype.toString.call(t) === "[object Date]";
}
function Zo(t, e) {
  var r = [], s, i = t.length;
  for (s = 0; s < i; ++s)
    r.push(e(t[s], s));
  return r;
}
function Zt(t, e) {
  for (var r in e)
    te(e, r) && (t[r] = e[r]);
  return te(e, "toString") && (t.toString = e.toString), te(e, "valueOf") && (t.valueOf = e.valueOf), t;
}
function Tt(t, e, r, s) {
  return vc(t, e, r, s, !0).utc();
}
function au() {
  return {
    empty: !1,
    unusedTokens: [],
    unusedInput: [],
    overflow: -2,
    charsLeftOver: 0,
    nullInput: !1,
    invalidEra: null,
    invalidMonth: null,
    invalidFormat: !1,
    userInvalidated: !1,
    iso: !1,
    parsedDateParts: [],
    era: null,
    meridiem: null,
    rfc2822: !1,
    weekdayMismatch: !1
  };
}
function G(t) {
  return t._pf == null && (t._pf = au()), t._pf;
}
var nn;
Array.prototype.some ? nn = Array.prototype.some : nn = function(t) {
  var e = Object(this), r = e.length >>> 0, s;
  for (s = 0; s < r; s++)
    if (s in e && t.call(this, e[s], s, e))
      return !0;
  return !1;
};
function Mn(t) {
  if (t._isValid == null) {
    var e = G(t), r = nn.call(e.parsedDateParts, function(i) {
      return i != null;
    }), s = !isNaN(t._d.getTime()) && e.overflow < 0 && !e.empty && !e.invalidEra && !e.invalidMonth && !e.invalidWeekday && !e.weekdayMismatch && !e.nullInput && !e.invalidFormat && !e.userInvalidated && (!e.meridiem || e.meridiem && r);
    if (t._strict && (s = s && e.charsLeftOver === 0 && e.unusedTokens.length === 0 && e.bigHour === void 0), Object.isFrozen == null || !Object.isFrozen(t))
      t._isValid = s;
    else
      return s;
  }
  return t._isValid;
}
function hi(t) {
  var e = Tt(NaN);
  return t != null ? Zt(G(e), t) : G(e).userInvalidated = !0, e;
}
var La = A.momentProperties = [], Ni = !1;
function Fn(t, e) {
  var r, s, i, n = La.length;
  if (Ne(e._isAMomentObject) || (t._isAMomentObject = e._isAMomentObject), Ne(e._i) || (t._i = e._i), Ne(e._f) || (t._f = e._f), Ne(e._l) || (t._l = e._l), Ne(e._strict) || (t._strict = e._strict), Ne(e._tzm) || (t._tzm = e._tzm), Ne(e._isUTC) || (t._isUTC = e._isUTC), Ne(e._offset) || (t._offset = e._offset), Ne(e._pf) || (t._pf = G(e)), Ne(e._locale) || (t._locale = e._locale), n > 0)
    for (r = 0; r < n; r++)
      s = La[r], i = e[s], Ne(i) || (t[s] = i);
  return t;
}
function ps(t) {
  Fn(this, t), this._d = new Date(t._d != null ? t._d.getTime() : NaN), this.isValid() || (this._d = /* @__PURE__ */ new Date(NaN)), Ni === !1 && (Ni = !0, A.updateOffset(this), Ni = !1);
}
function lt(t) {
  return t instanceof ps || t != null && t._isAMomentObject != null;
}
function zo(t) {
  A.suppressDeprecationWarnings === !1 && typeof console < "u" && console.warn && console.warn("Deprecation warning: " + t);
}
function ze(t, e) {
  var r = !0;
  return Zt(function() {
    if (A.deprecationHandler != null && A.deprecationHandler(null, t), r) {
      var s = [], i, n, a, o = arguments.length;
      for (n = 0; n < o; n++) {
        if (i = "", typeof arguments[n] == "object") {
          i += `
[` + n + "] ";
          for (a in arguments[0])
            te(arguments[0], a) && (i += a + ": " + arguments[0][a] + ", ");
          i = i.slice(0, -2);
        } else
          i = arguments[n];
        s.push(i);
      }
      zo(
        t + `
Arguments: ` + Array.prototype.slice.call(s).join("") + `
` + new Error().stack
      ), r = !1;
    }
    return e.apply(this, arguments);
  }, e);
}
var ja = {};
function Jo(t, e) {
  A.deprecationHandler != null && A.deprecationHandler(t, e), ja[t] || (zo(e), ja[t] = !0);
}
A.suppressDeprecationWarnings = !1;
A.deprecationHandler = null;
function Et(t) {
  return typeof Function < "u" && t instanceof Function || Object.prototype.toString.call(t) === "[object Function]";
}
function ou(t) {
  var e, r;
  for (r in t)
    te(t, r) && (e = t[r], Et(e) ? this[r] = e : this["_" + r] = e);
  this._config = t, this._dayOfMonthOrdinalParseLenient = new RegExp(
    (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source
  );
}
function an(t, e) {
  var r = Zt({}, t), s;
  for (s in e)
    te(e, s) && (fr(t[s]) && fr(e[s]) ? (r[s] = {}, Zt(r[s], t[s]), Zt(r[s], e[s])) : e[s] != null ? r[s] = e[s] : delete r[s]);
  for (s in t)
    te(t, s) && !te(e, s) && fr(t[s]) && (r[s] = Zt({}, r[s]));
  return r;
}
function Nn(t) {
  t != null && this.set(t);
}
var on;
Object.keys ? on = Object.keys : on = function(t) {
  var e, r = [];
  for (e in t)
    te(t, e) && r.push(e);
  return r;
};
var cu = {
  sameDay: "[Today at] LT",
  nextDay: "[Tomorrow at] LT",
  nextWeek: "dddd [at] LT",
  lastDay: "[Yesterday at] LT",
  lastWeek: "[Last] dddd [at] LT",
  sameElse: "L"
};
function lu(t, e, r) {
  var s = this._calendar[t] || this._calendar.sameElse;
  return Et(s) ? s.call(e, r) : s;
}
function _t(t, e, r) {
  var s = "" + Math.abs(t), i = e - s.length, n = t >= 0;
  return (n ? r ? "+" : "" : "-") + Math.pow(10, Math.max(0, i)).toString().substr(1) + s;
}
var qn = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, Ds = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, qi = {}, kr = {};
function q(t, e, r, s) {
  var i = s;
  typeof s == "string" && (i = function() {
    return this[s]();
  }), t && (kr[t] = i), e && (kr[e[0]] = function() {
    return _t(i.apply(this, arguments), e[1], e[2]);
  }), r && (kr[r] = function() {
    return this.localeData().ordinal(
      i.apply(this, arguments),
      t
    );
  });
}
function du(t) {
  return t.match(/\[[\s\S]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "");
}
function hu(t) {
  var e = t.match(qn), r, s;
  for (r = 0, s = e.length; r < s; r++)
    kr[e[r]] ? e[r] = kr[e[r]] : e[r] = du(e[r]);
  return function(i) {
    var n = "", a;
    for (a = 0; a < s; a++)
      n += Et(e[a]) ? e[a].call(i, t) : e[a];
    return n;
  };
}
function Hs(t, e) {
  return t.isValid() ? (e = Xo(e, t.localeData()), qi[e] = qi[e] || hu(e), qi[e](t)) : t.localeData().invalidDate();
}
function Xo(t, e) {
  var r = 5;
  function s(i) {
    return e.longDateFormat(i) || i;
  }
  for (Ds.lastIndex = 0; r >= 0 && Ds.test(t); )
    t = t.replace(
      Ds,
      s
    ), Ds.lastIndex = 0, r -= 1;
  return t;
}
var uu = {
  LTS: "h:mm:ss A",
  LT: "h:mm A",
  L: "MM/DD/YYYY",
  LL: "MMMM D, YYYY",
  LLL: "MMMM D, YYYY h:mm A",
  LLLL: "dddd, MMMM D, YYYY h:mm A"
};
function fu(t) {
  var e = this._longDateFormat[t], r = this._longDateFormat[t.toUpperCase()];
  return e || !r ? e : (this._longDateFormat[t] = r.match(qn).map(function(s) {
    return s === "MMMM" || s === "MM" || s === "DD" || s === "dddd" ? s.slice(1) : s;
  }).join(""), this._longDateFormat[t]);
}
var gu = "Invalid date";
function pu() {
  return this._invalidDate;
}
var mu = "%d", wu = /\d{1,2}/;
function yu(t) {
  return this._ordinal.replace("%d", t);
}
var vu = {
  future: "in %s",
  past: "%s ago",
  s: "a few seconds",
  ss: "%d seconds",
  m: "a minute",
  mm: "%d minutes",
  h: "an hour",
  hh: "%d hours",
  d: "a day",
  dd: "%d days",
  w: "a week",
  ww: "%d weeks",
  M: "a month",
  MM: "%d months",
  y: "a year",
  yy: "%d years"
};
function bu(t, e, r, s) {
  var i = this._relativeTime[r];
  return Et(i) ? i(t, e, r, s) : i.replace(/%d/i, t);
}
function _u(t, e) {
  var r = this._relativeTime[t > 0 ? "future" : "past"];
  return Et(r) ? r(e) : r.replace(/%s/i, e);
}
var es = {};
function Pe(t, e) {
  var r = t.toLowerCase();
  es[r] = es[r + "s"] = es[e] = t;
}
function Je(t) {
  return typeof t == "string" ? es[t] || es[t.toLowerCase()] : void 0;
}
function Un(t) {
  var e = {}, r, s;
  for (s in t)
    te(t, s) && (r = Je(s), r && (e[r] = t[s]));
  return e;
}
var Qo = {};
function He(t, e) {
  Qo[t] = e;
}
function xu(t) {
  var e = [], r;
  for (r in t)
    te(t, r) && e.push({ unit: r, priority: Qo[r] });
  return e.sort(function(s, i) {
    return s.priority - i.priority;
  }), e;
}
function ui(t) {
  return t % 4 === 0 && t % 100 !== 0 || t % 400 === 0;
}
function Ke(t) {
  return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
}
function z(t) {
  var e = +t, r = 0;
  return e !== 0 && isFinite(e) && (r = Ke(e)), r;
}
function Lr(t, e) {
  return function(r) {
    return r != null ? (ec(this, t, r), A.updateOffset(this, e), this) : Ws(this, t);
  };
}
function Ws(t, e) {
  return t.isValid() ? t._d["get" + (t._isUTC ? "UTC" : "") + e]() : NaN;
}
function ec(t, e, r) {
  t.isValid() && !isNaN(r) && (e === "FullYear" && ui(t.year()) && t.month() === 1 && t.date() === 29 ? (r = z(r), t._d["set" + (t._isUTC ? "UTC" : "") + e](
    r,
    t.month(),
    yi(r, t.month())
  )) : t._d["set" + (t._isUTC ? "UTC" : "") + e](r));
}
function Tu(t) {
  return t = Je(t), Et(this[t]) ? this[t]() : this;
}
function Eu(t, e) {
  if (typeof t == "object") {
    t = Un(t);
    var r = xu(t), s, i = r.length;
    for (s = 0; s < i; s++)
      this[r[s].unit](t[r[s].unit]);
  } else if (t = Je(t), Et(this[t]))
    return this[t](e);
  return this;
}
var tc = /\d/, Ve = /\d\d/, rc = /\d{3}/, Ln = /\d{4}/, fi = /[+-]?\d{6}/, fe = /\d\d?/, sc = /\d\d\d\d?/, ic = /\d\d\d\d\d\d?/, gi = /\d{1,3}/, jn = /\d{1,4}/, pi = /[+-]?\d{1,6}/, jr = /\d+/, mi = /[+-]?\d+/, Su = /Z|[+-]\d\d:?\d\d/gi, wi = /Z|[+-]\d\d(?::?\d\d)?/gi, Du = /[+-]?\d+(\.\d{1,3})?/, ms = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, Vs;
Vs = {};
function H(t, e, r) {
  Vs[t] = Et(e) ? e : function(s, i) {
    return s && r ? r : e;
  };
}
function Cu(t, e) {
  return te(Vs, t) ? Vs[t](e._strict, e._locale) : new RegExp(Iu(t));
}
function Iu(t) {
  return Ye(
    t.replace("\\", "").replace(
      /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
      function(e, r, s, i, n) {
        return r || s || i || n;
      }
    )
  );
}
function Ye(t) {
  return t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
var cn = {};
function ce(t, e) {
  var r, s = e, i;
  for (typeof t == "string" && (t = [t]), Nt(e) && (s = function(n, a) {
    a[e] = z(n);
  }), i = t.length, r = 0; r < i; r++)
    cn[t[r]] = s;
}
function ws(t, e) {
  ce(t, function(r, s, i, n) {
    i._w = i._w || {}, e(r, i._w, i, n);
  });
}
function Ru(t, e, r) {
  e != null && te(cn, t) && cn[t](e, r._a, r, t);
}
var Ae = 0, Pt = 1, yt = 2, xe = 3, nt = 4, Ht = 5, lr = 6, $u = 7, Au = 8;
function ku(t, e) {
  return (t % e + e) % e;
}
var we;
Array.prototype.indexOf ? we = Array.prototype.indexOf : we = function(t) {
  var e;
  for (e = 0; e < this.length; ++e)
    if (this[e] === t)
      return e;
  return -1;
};
function yi(t, e) {
  if (isNaN(t) || isNaN(e))
    return NaN;
  var r = ku(e, 12);
  return t += (e - r) / 12, r === 1 ? ui(t) ? 29 : 28 : 31 - r % 7 % 2;
}
q("M", ["MM", 2], "Mo", function() {
  return this.month() + 1;
});
q("MMM", 0, 0, function(t) {
  return this.localeData().monthsShort(this, t);
});
q("MMMM", 0, 0, function(t) {
  return this.localeData().months(this, t);
});
Pe("month", "M");
He("month", 8);
H("M", fe);
H("MM", fe, Ve);
H("MMM", function(t, e) {
  return e.monthsShortRegex(t);
});
H("MMMM", function(t, e) {
  return e.monthsRegex(t);
});
ce(["M", "MM"], function(t, e) {
  e[Pt] = z(t) - 1;
});
ce(["MMM", "MMMM"], function(t, e, r, s) {
  var i = r._locale.monthsParse(t, s, r._strict);
  i != null ? e[Pt] = i : G(r).invalidMonth = t;
});
var Pu = "January_February_March_April_May_June_July_August_September_October_November_December".split(
  "_"
), nc = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), ac = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, Hu = ms, Ou = ms;
function Mu(t, e) {
  return t ? ct(this._months) ? this._months[t.month()] : this._months[(this._months.isFormat || ac).test(e) ? "format" : "standalone"][t.month()] : ct(this._months) ? this._months : this._months.standalone;
}
function Fu(t, e) {
  return t ? ct(this._monthsShort) ? this._monthsShort[t.month()] : this._monthsShort[ac.test(e) ? "format" : "standalone"][t.month()] : ct(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
}
function Nu(t, e, r) {
  var s, i, n, a = t.toLocaleLowerCase();
  if (!this._monthsParse)
    for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], s = 0; s < 12; ++s)
      n = Tt([2e3, s]), this._shortMonthsParse[s] = this.monthsShort(
        n,
        ""
      ).toLocaleLowerCase(), this._longMonthsParse[s] = this.months(n, "").toLocaleLowerCase();
  return r ? e === "MMM" ? (i = we.call(this._shortMonthsParse, a), i !== -1 ? i : null) : (i = we.call(this._longMonthsParse, a), i !== -1 ? i : null) : e === "MMM" ? (i = we.call(this._shortMonthsParse, a), i !== -1 ? i : (i = we.call(this._longMonthsParse, a), i !== -1 ? i : null)) : (i = we.call(this._longMonthsParse, a), i !== -1 ? i : (i = we.call(this._shortMonthsParse, a), i !== -1 ? i : null));
}
function qu(t, e, r) {
  var s, i, n;
  if (this._monthsParseExact)
    return Nu.call(this, t, e, r);
  for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), s = 0; s < 12; s++) {
    if (i = Tt([2e3, s]), r && !this._longMonthsParse[s] && (this._longMonthsParse[s] = new RegExp(
      "^" + this.months(i, "").replace(".", "") + "$",
      "i"
    ), this._shortMonthsParse[s] = new RegExp(
      "^" + this.monthsShort(i, "").replace(".", "") + "$",
      "i"
    )), !r && !this._monthsParse[s] && (n = "^" + this.months(i, "") + "|^" + this.monthsShort(i, ""), this._monthsParse[s] = new RegExp(n.replace(".", ""), "i")), r && e === "MMMM" && this._longMonthsParse[s].test(t))
      return s;
    if (r && e === "MMM" && this._shortMonthsParse[s].test(t))
      return s;
    if (!r && this._monthsParse[s].test(t))
      return s;
  }
}
function oc(t, e) {
  var r;
  if (!t.isValid())
    return t;
  if (typeof e == "string") {
    if (/^\d+$/.test(e))
      e = z(e);
    else if (e = t.localeData().monthsParse(e), !Nt(e))
      return t;
  }
  return r = Math.min(t.date(), yi(t.year(), e)), t._d["set" + (t._isUTC ? "UTC" : "") + "Month"](e, r), t;
}
function cc(t) {
  return t != null ? (oc(this, t), A.updateOffset(this, !0), this) : Ws(this, "Month");
}
function Uu() {
  return yi(this.year(), this.month());
}
function Lu(t) {
  return this._monthsParseExact ? (te(this, "_monthsRegex") || lc.call(this), t ? this._monthsShortStrictRegex : this._monthsShortRegex) : (te(this, "_monthsShortRegex") || (this._monthsShortRegex = Hu), this._monthsShortStrictRegex && t ? this._monthsShortStrictRegex : this._monthsShortRegex);
}
function ju(t) {
  return this._monthsParseExact ? (te(this, "_monthsRegex") || lc.call(this), t ? this._monthsStrictRegex : this._monthsRegex) : (te(this, "_monthsRegex") || (this._monthsRegex = Ou), this._monthsStrictRegex && t ? this._monthsStrictRegex : this._monthsRegex);
}
function lc() {
  function t(a, o) {
    return o.length - a.length;
  }
  var e = [], r = [], s = [], i, n;
  for (i = 0; i < 12; i++)
    n = Tt([2e3, i]), e.push(this.monthsShort(n, "")), r.push(this.months(n, "")), s.push(this.months(n, "")), s.push(this.monthsShort(n, ""));
  for (e.sort(t), r.sort(t), s.sort(t), i = 0; i < 12; i++)
    e[i] = Ye(e[i]), r[i] = Ye(r[i]);
  for (i = 0; i < 24; i++)
    s[i] = Ye(s[i]);
  this._monthsRegex = new RegExp("^(" + s.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp(
    "^(" + r.join("|") + ")",
    "i"
  ), this._monthsShortStrictRegex = new RegExp(
    "^(" + e.join("|") + ")",
    "i"
  );
}
q("Y", 0, 0, function() {
  var t = this.year();
  return t <= 9999 ? _t(t, 4) : "+" + t;
});
q(0, ["YY", 2], 0, function() {
  return this.year() % 100;
});
q(0, ["YYYY", 4], 0, "year");
q(0, ["YYYYY", 5], 0, "year");
q(0, ["YYYYYY", 6, !0], 0, "year");
Pe("year", "y");
He("year", 1);
H("Y", mi);
H("YY", fe, Ve);
H("YYYY", jn, Ln);
H("YYYYY", pi, fi);
H("YYYYYY", pi, fi);
ce(["YYYYY", "YYYYYY"], Ae);
ce("YYYY", function(t, e) {
  e[Ae] = t.length === 2 ? A.parseTwoDigitYear(t) : z(t);
});
ce("YY", function(t, e) {
  e[Ae] = A.parseTwoDigitYear(t);
});
ce("Y", function(t, e) {
  e[Ae] = parseInt(t, 10);
});
function ts(t) {
  return ui(t) ? 366 : 365;
}
A.parseTwoDigitYear = function(t) {
  return z(t) + (z(t) > 68 ? 1900 : 2e3);
};
var dc = Lr("FullYear", !0);
function Yu() {
  return ui(this.year());
}
function Bu(t, e, r, s, i, n, a) {
  var o;
  return t < 100 && t >= 0 ? (o = new Date(t + 400, e, r, s, i, n, a), isFinite(o.getFullYear()) && o.setFullYear(t)) : o = new Date(t, e, r, s, i, n, a), o;
}
function hs(t) {
  var e, r;
  return t < 100 && t >= 0 ? (r = Array.prototype.slice.call(arguments), r[0] = t + 400, e = new Date(Date.UTC.apply(null, r)), isFinite(e.getUTCFullYear()) && e.setUTCFullYear(t)) : e = new Date(Date.UTC.apply(null, arguments)), e;
}
function Gs(t, e, r) {
  var s = 7 + e - r, i = (7 + hs(t, 0, s).getUTCDay() - e) % 7;
  return -i + s - 1;
}
function hc(t, e, r, s, i) {
  var n = (7 + r - s) % 7, a = Gs(t, s, i), o = 1 + 7 * (e - 1) + n + a, c, l;
  return o <= 0 ? (c = t - 1, l = ts(c) + o) : o > ts(t) ? (c = t + 1, l = o - ts(t)) : (c = t, l = o), {
    year: c,
    dayOfYear: l
  };
}
function us(t, e, r) {
  var s = Gs(t.year(), e, r), i = Math.floor((t.dayOfYear() - s - 1) / 7) + 1, n, a;
  return i < 1 ? (a = t.year() - 1, n = i + Mt(a, e, r)) : i > Mt(t.year(), e, r) ? (n = i - Mt(t.year(), e, r), a = t.year() + 1) : (a = t.year(), n = i), {
    week: n,
    year: a
  };
}
function Mt(t, e, r) {
  var s = Gs(t, e, r), i = Gs(t + 1, e, r);
  return (ts(t) - s + i) / 7;
}
q("w", ["ww", 2], "wo", "week");
q("W", ["WW", 2], "Wo", "isoWeek");
Pe("week", "w");
Pe("isoWeek", "W");
He("week", 5);
He("isoWeek", 5);
H("w", fe);
H("ww", fe, Ve);
H("W", fe);
H("WW", fe, Ve);
ws(
  ["w", "ww", "W", "WW"],
  function(t, e, r, s) {
    e[s.substr(0, 1)] = z(t);
  }
);
function Wu(t) {
  return us(t, this._week.dow, this._week.doy).week;
}
var Vu = {
  dow: 0,
  // Sunday is the first day of the week.
  doy: 6
  // The week that contains Jan 6th is the first week of the year.
};
function Gu() {
  return this._week.dow;
}
function Ku() {
  return this._week.doy;
}
function Zu(t) {
  var e = this.localeData().week(this);
  return t == null ? e : this.add((t - e) * 7, "d");
}
function zu(t) {
  var e = us(this, 1, 4).week;
  return t == null ? e : this.add((t - e) * 7, "d");
}
q("d", 0, "do", "day");
q("dd", 0, 0, function(t) {
  return this.localeData().weekdaysMin(this, t);
});
q("ddd", 0, 0, function(t) {
  return this.localeData().weekdaysShort(this, t);
});
q("dddd", 0, 0, function(t) {
  return this.localeData().weekdays(this, t);
});
q("e", 0, 0, "weekday");
q("E", 0, 0, "isoWeekday");
Pe("day", "d");
Pe("weekday", "e");
Pe("isoWeekday", "E");
He("day", 11);
He("weekday", 11);
He("isoWeekday", 11);
H("d", fe);
H("e", fe);
H("E", fe);
H("dd", function(t, e) {
  return e.weekdaysMinRegex(t);
});
H("ddd", function(t, e) {
  return e.weekdaysShortRegex(t);
});
H("dddd", function(t, e) {
  return e.weekdaysRegex(t);
});
ws(["dd", "ddd", "dddd"], function(t, e, r, s) {
  var i = r._locale.weekdaysParse(t, s, r._strict);
  i != null ? e.d = i : G(r).invalidWeekday = t;
});
ws(["d", "e", "E"], function(t, e, r, s) {
  e[s] = z(t);
});
function Ju(t, e) {
  return typeof t != "string" ? t : isNaN(t) ? (t = e.weekdaysParse(t), typeof t == "number" ? t : null) : parseInt(t, 10);
}
function Xu(t, e) {
  return typeof t == "string" ? e.weekdaysParse(t) % 7 || 7 : isNaN(t) ? null : t;
}
function Yn(t, e) {
  return t.slice(e, 7).concat(t.slice(0, e));
}
var Qu = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), uc = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), ef = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), tf = ms, rf = ms, sf = ms;
function nf(t, e) {
  var r = ct(this._weekdays) ? this._weekdays : this._weekdays[t && t !== !0 && this._weekdays.isFormat.test(e) ? "format" : "standalone"];
  return t === !0 ? Yn(r, this._week.dow) : t ? r[t.day()] : r;
}
function af(t) {
  return t === !0 ? Yn(this._weekdaysShort, this._week.dow) : t ? this._weekdaysShort[t.day()] : this._weekdaysShort;
}
function of(t) {
  return t === !0 ? Yn(this._weekdaysMin, this._week.dow) : t ? this._weekdaysMin[t.day()] : this._weekdaysMin;
}
function cf(t, e, r) {
  var s, i, n, a = t.toLocaleLowerCase();
  if (!this._weekdaysParse)
    for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], s = 0; s < 7; ++s)
      n = Tt([2e3, 1]).day(s), this._minWeekdaysParse[s] = this.weekdaysMin(
        n,
        ""
      ).toLocaleLowerCase(), this._shortWeekdaysParse[s] = this.weekdaysShort(
        n,
        ""
      ).toLocaleLowerCase(), this._weekdaysParse[s] = this.weekdays(n, "").toLocaleLowerCase();
  return r ? e === "dddd" ? (i = we.call(this._weekdaysParse, a), i !== -1 ? i : null) : e === "ddd" ? (i = we.call(this._shortWeekdaysParse, a), i !== -1 ? i : null) : (i = we.call(this._minWeekdaysParse, a), i !== -1 ? i : null) : e === "dddd" ? (i = we.call(this._weekdaysParse, a), i !== -1 || (i = we.call(this._shortWeekdaysParse, a), i !== -1) ? i : (i = we.call(this._minWeekdaysParse, a), i !== -1 ? i : null)) : e === "ddd" ? (i = we.call(this._shortWeekdaysParse, a), i !== -1 || (i = we.call(this._weekdaysParse, a), i !== -1) ? i : (i = we.call(this._minWeekdaysParse, a), i !== -1 ? i : null)) : (i = we.call(this._minWeekdaysParse, a), i !== -1 || (i = we.call(this._weekdaysParse, a), i !== -1) ? i : (i = we.call(this._shortWeekdaysParse, a), i !== -1 ? i : null));
}
function lf(t, e, r) {
  var s, i, n;
  if (this._weekdaysParseExact)
    return cf.call(this, t, e, r);
  for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), s = 0; s < 7; s++) {
    if (i = Tt([2e3, 1]).day(s), r && !this._fullWeekdaysParse[s] && (this._fullWeekdaysParse[s] = new RegExp(
      "^" + this.weekdays(i, "").replace(".", "\\.?") + "$",
      "i"
    ), this._shortWeekdaysParse[s] = new RegExp(
      "^" + this.weekdaysShort(i, "").replace(".", "\\.?") + "$",
      "i"
    ), this._minWeekdaysParse[s] = new RegExp(
      "^" + this.weekdaysMin(i, "").replace(".", "\\.?") + "$",
      "i"
    )), this._weekdaysParse[s] || (n = "^" + this.weekdays(i, "") + "|^" + this.weekdaysShort(i, "") + "|^" + this.weekdaysMin(i, ""), this._weekdaysParse[s] = new RegExp(n.replace(".", ""), "i")), r && e === "dddd" && this._fullWeekdaysParse[s].test(t))
      return s;
    if (r && e === "ddd" && this._shortWeekdaysParse[s].test(t))
      return s;
    if (r && e === "dd" && this._minWeekdaysParse[s].test(t))
      return s;
    if (!r && this._weekdaysParse[s].test(t))
      return s;
  }
}
function df(t) {
  if (!this.isValid())
    return t != null ? this : NaN;
  var e = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
  return t != null ? (t = Ju(t, this.localeData()), this.add(t - e, "d")) : e;
}
function hf(t) {
  if (!this.isValid())
    return t != null ? this : NaN;
  var e = (this.day() + 7 - this.localeData()._week.dow) % 7;
  return t == null ? e : this.add(t - e, "d");
}
function uf(t) {
  if (!this.isValid())
    return t != null ? this : NaN;
  if (t != null) {
    var e = Xu(t, this.localeData());
    return this.day(this.day() % 7 ? e : e - 7);
  } else
    return this.day() || 7;
}
function ff(t) {
  return this._weekdaysParseExact ? (te(this, "_weekdaysRegex") || Bn.call(this), t ? this._weekdaysStrictRegex : this._weekdaysRegex) : (te(this, "_weekdaysRegex") || (this._weekdaysRegex = tf), this._weekdaysStrictRegex && t ? this._weekdaysStrictRegex : this._weekdaysRegex);
}
function gf(t) {
  return this._weekdaysParseExact ? (te(this, "_weekdaysRegex") || Bn.call(this), t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (te(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = rf), this._weekdaysShortStrictRegex && t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
}
function pf(t) {
  return this._weekdaysParseExact ? (te(this, "_weekdaysRegex") || Bn.call(this), t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (te(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = sf), this._weekdaysMinStrictRegex && t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
}
function Bn() {
  function t(h, f) {
    return f.length - h.length;
  }
  var e = [], r = [], s = [], i = [], n, a, o, c, l;
  for (n = 0; n < 7; n++)
    a = Tt([2e3, 1]).day(n), o = Ye(this.weekdaysMin(a, "")), c = Ye(this.weekdaysShort(a, "")), l = Ye(this.weekdays(a, "")), e.push(o), r.push(c), s.push(l), i.push(o), i.push(c), i.push(l);
  e.sort(t), r.sort(t), s.sort(t), i.sort(t), this._weekdaysRegex = new RegExp("^(" + i.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp(
    "^(" + s.join("|") + ")",
    "i"
  ), this._weekdaysShortStrictRegex = new RegExp(
    "^(" + r.join("|") + ")",
    "i"
  ), this._weekdaysMinStrictRegex = new RegExp(
    "^(" + e.join("|") + ")",
    "i"
  );
}
function Wn() {
  return this.hours() % 12 || 12;
}
function mf() {
  return this.hours() || 24;
}
q("H", ["HH", 2], 0, "hour");
q("h", ["hh", 2], 0, Wn);
q("k", ["kk", 2], 0, mf);
q("hmm", 0, 0, function() {
  return "" + Wn.apply(this) + _t(this.minutes(), 2);
});
q("hmmss", 0, 0, function() {
  return "" + Wn.apply(this) + _t(this.minutes(), 2) + _t(this.seconds(), 2);
});
q("Hmm", 0, 0, function() {
  return "" + this.hours() + _t(this.minutes(), 2);
});
q("Hmmss", 0, 0, function() {
  return "" + this.hours() + _t(this.minutes(), 2) + _t(this.seconds(), 2);
});
function fc(t, e) {
  q(t, 0, 0, function() {
    return this.localeData().meridiem(
      this.hours(),
      this.minutes(),
      e
    );
  });
}
fc("a", !0);
fc("A", !1);
Pe("hour", "h");
He("hour", 13);
function gc(t, e) {
  return e._meridiemParse;
}
H("a", gc);
H("A", gc);
H("H", fe);
H("h", fe);
H("k", fe);
H("HH", fe, Ve);
H("hh", fe, Ve);
H("kk", fe, Ve);
H("hmm", sc);
H("hmmss", ic);
H("Hmm", sc);
H("Hmmss", ic);
ce(["H", "HH"], xe);
ce(["k", "kk"], function(t, e, r) {
  var s = z(t);
  e[xe] = s === 24 ? 0 : s;
});
ce(["a", "A"], function(t, e, r) {
  r._isPm = r._locale.isPM(t), r._meridiem = t;
});
ce(["h", "hh"], function(t, e, r) {
  e[xe] = z(t), G(r).bigHour = !0;
});
ce("hmm", function(t, e, r) {
  var s = t.length - 2;
  e[xe] = z(t.substr(0, s)), e[nt] = z(t.substr(s)), G(r).bigHour = !0;
});
ce("hmmss", function(t, e, r) {
  var s = t.length - 4, i = t.length - 2;
  e[xe] = z(t.substr(0, s)), e[nt] = z(t.substr(s, 2)), e[Ht] = z(t.substr(i)), G(r).bigHour = !0;
});
ce("Hmm", function(t, e, r) {
  var s = t.length - 2;
  e[xe] = z(t.substr(0, s)), e[nt] = z(t.substr(s));
});
ce("Hmmss", function(t, e, r) {
  var s = t.length - 4, i = t.length - 2;
  e[xe] = z(t.substr(0, s)), e[nt] = z(t.substr(s, 2)), e[Ht] = z(t.substr(i));
});
function wf(t) {
  return (t + "").toLowerCase().charAt(0) === "p";
}
var yf = /[ap]\.?m?\.?/i, vf = Lr("Hours", !0);
function bf(t, e, r) {
  return t > 11 ? r ? "pm" : "PM" : r ? "am" : "AM";
}
var pc = {
  calendar: cu,
  longDateFormat: uu,
  invalidDate: gu,
  ordinal: mu,
  dayOfMonthOrdinalParse: wu,
  relativeTime: vu,
  months: Pu,
  monthsShort: nc,
  week: Vu,
  weekdays: Qu,
  weekdaysMin: ef,
  weekdaysShort: uc,
  meridiemParse: yf
}, ge = {}, Vr = {}, fs;
function _f(t, e) {
  var r, s = Math.min(t.length, e.length);
  for (r = 0; r < s; r += 1)
    if (t[r] !== e[r])
      return r;
  return s;
}
function Ya(t) {
  return t && t.toLowerCase().replace("_", "-");
}
function xf(t) {
  for (var e = 0, r, s, i, n; e < t.length; ) {
    for (n = Ya(t[e]).split("-"), r = n.length, s = Ya(t[e + 1]), s = s ? s.split("-") : null; r > 0; ) {
      if (i = vi(n.slice(0, r).join("-")), i)
        return i;
      if (s && s.length >= r && _f(n, s) >= r - 1)
        break;
      r--;
    }
    e++;
  }
  return fs;
}
function Tf(t) {
  return t.match("^[^/\\\\]*$") != null;
}
function vi(t) {
  var e = null, r;
  if (ge[t] === void 0 && typeof module < "u" && module && module.exports && Tf(t))
    try {
      e = fs._abbr, r = require, r("./locale/" + t), Qt(e);
    } catch {
      ge[t] = null;
    }
  return ge[t];
}
function Qt(t, e) {
  var r;
  return t && (Ne(e) ? r = Ut(t) : r = Vn(t, e), r ? fs = r : typeof console < "u" && console.warn && console.warn(
    "Locale " + t + " not found. Did you forget to load it?"
  )), fs._abbr;
}
function Vn(t, e) {
  if (e !== null) {
    var r, s = pc;
    if (e.abbr = t, ge[t] != null)
      Jo(
        "defineLocaleOverride",
        "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."
      ), s = ge[t]._config;
    else if (e.parentLocale != null)
      if (ge[e.parentLocale] != null)
        s = ge[e.parentLocale]._config;
      else if (r = vi(e.parentLocale), r != null)
        s = r._config;
      else
        return Vr[e.parentLocale] || (Vr[e.parentLocale] = []), Vr[e.parentLocale].push({
          name: t,
          config: e
        }), null;
    return ge[t] = new Nn(an(s, e)), Vr[t] && Vr[t].forEach(function(i) {
      Vn(i.name, i.config);
    }), Qt(t), ge[t];
  } else
    return delete ge[t], null;
}
function Ef(t, e) {
  if (e != null) {
    var r, s, i = pc;
    ge[t] != null && ge[t].parentLocale != null ? ge[t].set(an(ge[t]._config, e)) : (s = vi(t), s != null && (i = s._config), e = an(i, e), s == null && (e.abbr = t), r = new Nn(e), r.parentLocale = ge[t], ge[t] = r), Qt(t);
  } else
    ge[t] != null && (ge[t].parentLocale != null ? (ge[t] = ge[t].parentLocale, t === Qt() && Qt(t)) : ge[t] != null && delete ge[t]);
  return ge[t];
}
function Ut(t) {
  var e;
  if (t && t._locale && t._locale._abbr && (t = t._locale._abbr), !t)
    return fs;
  if (!ct(t)) {
    if (e = vi(t), e)
      return e;
    t = [t];
  }
  return xf(t);
}
function Sf() {
  return on(ge);
}
function Gn(t) {
  var e, r = t._a;
  return r && G(t).overflow === -2 && (e = r[Pt] < 0 || r[Pt] > 11 ? Pt : r[yt] < 1 || r[yt] > yi(r[Ae], r[Pt]) ? yt : r[xe] < 0 || r[xe] > 24 || r[xe] === 24 && (r[nt] !== 0 || r[Ht] !== 0 || r[lr] !== 0) ? xe : r[nt] < 0 || r[nt] > 59 ? nt : r[Ht] < 0 || r[Ht] > 59 ? Ht : r[lr] < 0 || r[lr] > 999 ? lr : -1, G(t)._overflowDayOfYear && (e < Ae || e > yt) && (e = yt), G(t)._overflowWeeks && e === -1 && (e = $u), G(t)._overflowWeekday && e === -1 && (e = Au), G(t).overflow = e), t;
}
var Df = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, Cf = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, If = /Z|[+-]\d\d(?::?\d\d)?/, Cs = [
  ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
  ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
  ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
  ["GGGG-[W]WW", /\d{4}-W\d\d/, !1],
  ["YYYY-DDD", /\d{4}-\d{3}/],
  ["YYYY-MM", /\d{4}-\d\d/, !1],
  ["YYYYYYMMDD", /[+-]\d{10}/],
  ["YYYYMMDD", /\d{8}/],
  ["GGGG[W]WWE", /\d{4}W\d{3}/],
  ["GGGG[W]WW", /\d{4}W\d{2}/, !1],
  ["YYYYDDD", /\d{7}/],
  ["YYYYMM", /\d{6}/, !1],
  ["YYYY", /\d{4}/, !1]
], Ui = [
  ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
  ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
  ["HH:mm:ss", /\d\d:\d\d:\d\d/],
  ["HH:mm", /\d\d:\d\d/],
  ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
  ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
  ["HHmmss", /\d\d\d\d\d\d/],
  ["HHmm", /\d\d\d\d/],
  ["HH", /\d\d/]
], Rf = /^\/?Date\((-?\d+)/i, $f = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, Af = {
  UT: 0,
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60
};
function mc(t) {
  var e, r, s = t._i, i = Df.exec(s) || Cf.exec(s), n, a, o, c, l = Cs.length, h = Ui.length;
  if (i) {
    for (G(t).iso = !0, e = 0, r = l; e < r; e++)
      if (Cs[e][1].exec(i[1])) {
        a = Cs[e][0], n = Cs[e][2] !== !1;
        break;
      }
    if (a == null) {
      t._isValid = !1;
      return;
    }
    if (i[3]) {
      for (e = 0, r = h; e < r; e++)
        if (Ui[e][1].exec(i[3])) {
          o = (i[2] || " ") + Ui[e][0];
          break;
        }
      if (o == null) {
        t._isValid = !1;
        return;
      }
    }
    if (!n && o != null) {
      t._isValid = !1;
      return;
    }
    if (i[4])
      if (If.exec(i[4]))
        c = "Z";
      else {
        t._isValid = !1;
        return;
      }
    t._f = a + (o || "") + (c || ""), Zn(t);
  } else
    t._isValid = !1;
}
function kf(t, e, r, s, i, n) {
  var a = [
    Pf(t),
    nc.indexOf(e),
    parseInt(r, 10),
    parseInt(s, 10),
    parseInt(i, 10)
  ];
  return n && a.push(parseInt(n, 10)), a;
}
function Pf(t) {
  var e = parseInt(t, 10);
  return e <= 49 ? 2e3 + e : e <= 999 ? 1900 + e : e;
}
function Hf(t) {
  return t.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
}
function Of(t, e, r) {
  if (t) {
    var s = uc.indexOf(t), i = new Date(
      e[0],
      e[1],
      e[2]
    ).getDay();
    if (s !== i)
      return G(r).weekdayMismatch = !0, r._isValid = !1, !1;
  }
  return !0;
}
function Mf(t, e, r) {
  if (t)
    return Af[t];
  if (e)
    return 0;
  var s = parseInt(r, 10), i = s % 100, n = (s - i) / 100;
  return n * 60 + i;
}
function wc(t) {
  var e = $f.exec(Hf(t._i)), r;
  if (e) {
    if (r = kf(
      e[4],
      e[3],
      e[2],
      e[5],
      e[6],
      e[7]
    ), !Of(e[1], r, t))
      return;
    t._a = r, t._tzm = Mf(e[8], e[9], e[10]), t._d = hs.apply(null, t._a), t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), G(t).rfc2822 = !0;
  } else
    t._isValid = !1;
}
function Ff(t) {
  var e = Rf.exec(t._i);
  if (e !== null) {
    t._d = /* @__PURE__ */ new Date(+e[1]);
    return;
  }
  if (mc(t), t._isValid === !1)
    delete t._isValid;
  else
    return;
  if (wc(t), t._isValid === !1)
    delete t._isValid;
  else
    return;
  t._strict ? t._isValid = !1 : A.createFromInputFallback(t);
}
A.createFromInputFallback = ze(
  "value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",
  function(t) {
    t._d = /* @__PURE__ */ new Date(t._i + (t._useUTC ? " UTC" : ""));
  }
);
function xr(t, e, r) {
  return t ?? e ?? r;
}
function Nf(t) {
  var e = new Date(A.now());
  return t._useUTC ? [
    e.getUTCFullYear(),
    e.getUTCMonth(),
    e.getUTCDate()
  ] : [e.getFullYear(), e.getMonth(), e.getDate()];
}
function Kn(t) {
  var e, r, s = [], i, n, a;
  if (!t._d) {
    for (i = Nf(t), t._w && t._a[yt] == null && t._a[Pt] == null && qf(t), t._dayOfYear != null && (a = xr(t._a[Ae], i[Ae]), (t._dayOfYear > ts(a) || t._dayOfYear === 0) && (G(t)._overflowDayOfYear = !0), r = hs(a, 0, t._dayOfYear), t._a[Pt] = r.getUTCMonth(), t._a[yt] = r.getUTCDate()), e = 0; e < 3 && t._a[e] == null; ++e)
      t._a[e] = s[e] = i[e];
    for (; e < 7; e++)
      t._a[e] = s[e] = t._a[e] == null ? e === 2 ? 1 : 0 : t._a[e];
    t._a[xe] === 24 && t._a[nt] === 0 && t._a[Ht] === 0 && t._a[lr] === 0 && (t._nextDay = !0, t._a[xe] = 0), t._d = (t._useUTC ? hs : Bu).apply(
      null,
      s
    ), n = t._useUTC ? t._d.getUTCDay() : t._d.getDay(), t._tzm != null && t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), t._nextDay && (t._a[xe] = 24), t._w && typeof t._w.d < "u" && t._w.d !== n && (G(t).weekdayMismatch = !0);
  }
}
function qf(t) {
  var e, r, s, i, n, a, o, c, l;
  e = t._w, e.GG != null || e.W != null || e.E != null ? (n = 1, a = 4, r = xr(
    e.GG,
    t._a[Ae],
    us(ue(), 1, 4).year
  ), s = xr(e.W, 1), i = xr(e.E, 1), (i < 1 || i > 7) && (c = !0)) : (n = t._locale._week.dow, a = t._locale._week.doy, l = us(ue(), n, a), r = xr(e.gg, t._a[Ae], l.year), s = xr(e.w, l.week), e.d != null ? (i = e.d, (i < 0 || i > 6) && (c = !0)) : e.e != null ? (i = e.e + n, (e.e < 0 || e.e > 6) && (c = !0)) : i = n), s < 1 || s > Mt(r, n, a) ? G(t)._overflowWeeks = !0 : c != null ? G(t)._overflowWeekday = !0 : (o = hc(r, s, i, n, a), t._a[Ae] = o.year, t._dayOfYear = o.dayOfYear);
}
A.ISO_8601 = function() {
};
A.RFC_2822 = function() {
};
function Zn(t) {
  if (t._f === A.ISO_8601) {
    mc(t);
    return;
  }
  if (t._f === A.RFC_2822) {
    wc(t);
    return;
  }
  t._a = [], G(t).empty = !0;
  var e = "" + t._i, r, s, i, n, a, o = e.length, c = 0, l, h;
  for (i = Xo(t._f, t._locale).match(qn) || [], h = i.length, r = 0; r < h; r++)
    n = i[r], s = (e.match(Cu(n, t)) || [])[0], s && (a = e.substr(0, e.indexOf(s)), a.length > 0 && G(t).unusedInput.push(a), e = e.slice(
      e.indexOf(s) + s.length
    ), c += s.length), kr[n] ? (s ? G(t).empty = !1 : G(t).unusedTokens.push(n), Ru(n, s, t)) : t._strict && !s && G(t).unusedTokens.push(n);
  G(t).charsLeftOver = o - c, e.length > 0 && G(t).unusedInput.push(e), t._a[xe] <= 12 && G(t).bigHour === !0 && t._a[xe] > 0 && (G(t).bigHour = void 0), G(t).parsedDateParts = t._a.slice(0), G(t).meridiem = t._meridiem, t._a[xe] = Uf(
    t._locale,
    t._a[xe],
    t._meridiem
  ), l = G(t).era, l !== null && (t._a[Ae] = t._locale.erasConvertYear(l, t._a[Ae])), Kn(t), Gn(t);
}
function Uf(t, e, r) {
  var s;
  return r == null ? e : t.meridiemHour != null ? t.meridiemHour(e, r) : (t.isPM != null && (s = t.isPM(r), s && e < 12 && (e += 12), !s && e === 12 && (e = 0)), e);
}
function Lf(t) {
  var e, r, s, i, n, a, o = !1, c = t._f.length;
  if (c === 0) {
    G(t).invalidFormat = !0, t._d = /* @__PURE__ */ new Date(NaN);
    return;
  }
  for (i = 0; i < c; i++)
    n = 0, a = !1, e = Fn({}, t), t._useUTC != null && (e._useUTC = t._useUTC), e._f = t._f[i], Zn(e), Mn(e) && (a = !0), n += G(e).charsLeftOver, n += G(e).unusedTokens.length * 10, G(e).score = n, o ? n < s && (s = n, r = e) : (s == null || n < s || a) && (s = n, r = e, a && (o = !0));
  Zt(t, r || e);
}
function jf(t) {
  if (!t._d) {
    var e = Un(t._i), r = e.day === void 0 ? e.date : e.day;
    t._a = Zo(
      [e.year, e.month, r, e.hour, e.minute, e.second, e.millisecond],
      function(s) {
        return s && parseInt(s, 10);
      }
    ), Kn(t);
  }
}
function Yf(t) {
  var e = new ps(Gn(yc(t)));
  return e._nextDay && (e.add(1, "d"), e._nextDay = void 0), e;
}
function yc(t) {
  var e = t._i, r = t._f;
  return t._locale = t._locale || Ut(t._l), e === null || r === void 0 && e === "" ? hi({ nullInput: !0 }) : (typeof e == "string" && (t._i = e = t._locale.preparse(e)), lt(e) ? new ps(Gn(e)) : (gs(e) ? t._d = e : ct(r) ? Lf(t) : r ? Zn(t) : Bf(t), Mn(t) || (t._d = null), t));
}
function Bf(t) {
  var e = t._i;
  Ne(e) ? t._d = new Date(A.now()) : gs(e) ? t._d = new Date(e.valueOf()) : typeof e == "string" ? Ff(t) : ct(e) ? (t._a = Zo(e.slice(0), function(r) {
    return parseInt(r, 10);
  }), Kn(t)) : fr(e) ? jf(t) : Nt(e) ? t._d = new Date(e) : A.createFromInputFallback(t);
}
function vc(t, e, r, s, i) {
  var n = {};
  return (e === !0 || e === !1) && (s = e, e = void 0), (r === !0 || r === !1) && (s = r, r = void 0), (fr(t) && On(t) || ct(t) && t.length === 0) && (t = void 0), n._isAMomentObject = !0, n._useUTC = n._isUTC = i, n._l = r, n._i = t, n._f = e, n._strict = s, Yf(n);
}
function ue(t, e, r, s) {
  return vc(t, e, r, s, !1);
}
var Wf = ze(
  "moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",
  function() {
    var t = ue.apply(null, arguments);
    return this.isValid() && t.isValid() ? t < this ? this : t : hi();
  }
), Vf = ze(
  "moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",
  function() {
    var t = ue.apply(null, arguments);
    return this.isValid() && t.isValid() ? t > this ? this : t : hi();
  }
);
function bc(t, e) {
  var r, s;
  if (e.length === 1 && ct(e[0]) && (e = e[0]), !e.length)
    return ue();
  for (r = e[0], s = 1; s < e.length; ++s)
    (!e[s].isValid() || e[s][t](r)) && (r = e[s]);
  return r;
}
function Gf() {
  var t = [].slice.call(arguments, 0);
  return bc("isBefore", t);
}
function Kf() {
  var t = [].slice.call(arguments, 0);
  return bc("isAfter", t);
}
var Zf = function() {
  return Date.now ? Date.now() : +/* @__PURE__ */ new Date();
}, Gr = [
  "year",
  "quarter",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
  "millisecond"
];
function zf(t) {
  var e, r = !1, s, i = Gr.length;
  for (e in t)
    if (te(t, e) && !(we.call(Gr, e) !== -1 && (t[e] == null || !isNaN(t[e]))))
      return !1;
  for (s = 0; s < i; ++s)
    if (t[Gr[s]]) {
      if (r)
        return !1;
      parseFloat(t[Gr[s]]) !== z(t[Gr[s]]) && (r = !0);
    }
  return !0;
}
function Jf() {
  return this._isValid;
}
function Xf() {
  return dt(NaN);
}
function bi(t) {
  var e = Un(t), r = e.year || 0, s = e.quarter || 0, i = e.month || 0, n = e.week || e.isoWeek || 0, a = e.day || 0, o = e.hour || 0, c = e.minute || 0, l = e.second || 0, h = e.millisecond || 0;
  this._isValid = zf(e), this._milliseconds = +h + l * 1e3 + // 1000
  c * 6e4 + // 1000 * 60
  o * 1e3 * 60 * 60, this._days = +a + n * 7, this._months = +i + s * 3 + r * 12, this._data = {}, this._locale = Ut(), this._bubble();
}
function Os(t) {
  return t instanceof bi;
}
function ln(t) {
  return t < 0 ? Math.round(-1 * t) * -1 : Math.round(t);
}
function Qf(t, e, r) {
  var s = Math.min(t.length, e.length), i = Math.abs(t.length - e.length), n = 0, a;
  for (a = 0; a < s; a++)
    (r && t[a] !== e[a] || !r && z(t[a]) !== z(e[a])) && n++;
  return n + i;
}
function _c(t, e) {
  q(t, 0, 0, function() {
    var r = this.utcOffset(), s = "+";
    return r < 0 && (r = -r, s = "-"), s + _t(~~(r / 60), 2) + e + _t(~~r % 60, 2);
  });
}
_c("Z", ":");
_c("ZZ", "");
H("Z", wi);
H("ZZ", wi);
ce(["Z", "ZZ"], function(t, e, r) {
  r._useUTC = !0, r._tzm = zn(wi, t);
});
var eg = /([\+\-]|\d\d)/gi;
function zn(t, e) {
  var r = (e || "").match(t), s, i, n;
  return r === null ? null : (s = r[r.length - 1] || [], i = (s + "").match(eg) || ["-", 0, 0], n = +(i[1] * 60) + z(i[2]), n === 0 ? 0 : i[0] === "+" ? n : -n);
}
function Jn(t, e) {
  var r, s;
  return e._isUTC ? (r = e.clone(), s = (lt(t) || gs(t) ? t.valueOf() : ue(t).valueOf()) - r.valueOf(), r._d.setTime(r._d.valueOf() + s), A.updateOffset(r, !1), r) : ue(t).local();
}
function dn(t) {
  return -Math.round(t._d.getTimezoneOffset());
}
A.updateOffset = function() {
};
function tg(t, e, r) {
  var s = this._offset || 0, i;
  if (!this.isValid())
    return t != null ? this : NaN;
  if (t != null) {
    if (typeof t == "string") {
      if (t = zn(wi, t), t === null)
        return this;
    } else
      Math.abs(t) < 16 && !r && (t = t * 60);
    return !this._isUTC && e && (i = dn(this)), this._offset = t, this._isUTC = !0, i != null && this.add(i, "m"), s !== t && (!e || this._changeInProgress ? Ec(
      this,
      dt(t - s, "m"),
      1,
      !1
    ) : this._changeInProgress || (this._changeInProgress = !0, A.updateOffset(this, !0), this._changeInProgress = null)), this;
  } else
    return this._isUTC ? s : dn(this);
}
function rg(t, e) {
  return t != null ? (typeof t != "string" && (t = -t), this.utcOffset(t, e), this) : -this.utcOffset();
}
function sg(t) {
  return this.utcOffset(0, t);
}
function ig(t) {
  return this._isUTC && (this.utcOffset(0, t), this._isUTC = !1, t && this.subtract(dn(this), "m")), this;
}
function ng() {
  if (this._tzm != null)
    this.utcOffset(this._tzm, !1, !0);
  else if (typeof this._i == "string") {
    var t = zn(Su, this._i);
    t != null ? this.utcOffset(t) : this.utcOffset(0, !0);
  }
  return this;
}
function ag(t) {
  return this.isValid() ? (t = t ? ue(t).utcOffset() : 0, (this.utcOffset() - t) % 60 === 0) : !1;
}
function og() {
  return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
}
function cg() {
  if (!Ne(this._isDSTShifted))
    return this._isDSTShifted;
  var t = {}, e;
  return Fn(t, this), t = yc(t), t._a ? (e = t._isUTC ? Tt(t._a) : ue(t._a), this._isDSTShifted = this.isValid() && Qf(t._a, e.toArray()) > 0) : this._isDSTShifted = !1, this._isDSTShifted;
}
function lg() {
  return this.isValid() ? !this._isUTC : !1;
}
function dg() {
  return this.isValid() ? this._isUTC : !1;
}
function xc() {
  return this.isValid() ? this._isUTC && this._offset === 0 : !1;
}
var hg = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, ug = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
function dt(t, e) {
  var r = t, s = null, i, n, a;
  return Os(t) ? r = {
    ms: t._milliseconds,
    d: t._days,
    M: t._months
  } : Nt(t) || !isNaN(+t) ? (r = {}, e ? r[e] = +t : r.milliseconds = +t) : (s = hg.exec(t)) ? (i = s[1] === "-" ? -1 : 1, r = {
    y: 0,
    d: z(s[yt]) * i,
    h: z(s[xe]) * i,
    m: z(s[nt]) * i,
    s: z(s[Ht]) * i,
    ms: z(ln(s[lr] * 1e3)) * i
    // the millisecond decimal point is included in the match
  }) : (s = ug.exec(t)) ? (i = s[1] === "-" ? -1 : 1, r = {
    y: nr(s[2], i),
    M: nr(s[3], i),
    w: nr(s[4], i),
    d: nr(s[5], i),
    h: nr(s[6], i),
    m: nr(s[7], i),
    s: nr(s[8], i)
  }) : r == null ? r = {} : typeof r == "object" && ("from" in r || "to" in r) && (a = fg(
    ue(r.from),
    ue(r.to)
  ), r = {}, r.ms = a.milliseconds, r.M = a.months), n = new bi(r), Os(t) && te(t, "_locale") && (n._locale = t._locale), Os(t) && te(t, "_isValid") && (n._isValid = t._isValid), n;
}
dt.fn = bi.prototype;
dt.invalid = Xf;
function nr(t, e) {
  var r = t && parseFloat(t.replace(",", "."));
  return (isNaN(r) ? 0 : r) * e;
}
function Ba(t, e) {
  var r = {};
  return r.months = e.month() - t.month() + (e.year() - t.year()) * 12, t.clone().add(r.months, "M").isAfter(e) && --r.months, r.milliseconds = +e - +t.clone().add(r.months, "M"), r;
}
function fg(t, e) {
  var r;
  return t.isValid() && e.isValid() ? (e = Jn(e, t), t.isBefore(e) ? r = Ba(t, e) : (r = Ba(e, t), r.milliseconds = -r.milliseconds, r.months = -r.months), r) : { milliseconds: 0, months: 0 };
}
function Tc(t, e) {
  return function(r, s) {
    var i, n;
    return s !== null && !isNaN(+s) && (Jo(
      e,
      "moment()." + e + "(period, number) is deprecated. Please use moment()." + e + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."
    ), n = r, r = s, s = n), i = dt(r, s), Ec(this, i, t), this;
  };
}
function Ec(t, e, r, s) {
  var i = e._milliseconds, n = ln(e._days), a = ln(e._months);
  t.isValid() && (s = s ?? !0, a && oc(t, Ws(t, "Month") + a * r), n && ec(t, "Date", Ws(t, "Date") + n * r), i && t._d.setTime(t._d.valueOf() + i * r), s && A.updateOffset(t, n || a));
}
var gg = Tc(1, "add"), pg = Tc(-1, "subtract");
function Sc(t) {
  return typeof t == "string" || t instanceof String;
}
function mg(t) {
  return lt(t) || gs(t) || Sc(t) || Nt(t) || yg(t) || wg(t) || t === null || t === void 0;
}
function wg(t) {
  var e = fr(t) && !On(t), r = !1, s = [
    "years",
    "year",
    "y",
    "months",
    "month",
    "M",
    "days",
    "day",
    "d",
    "dates",
    "date",
    "D",
    "hours",
    "hour",
    "h",
    "minutes",
    "minute",
    "m",
    "seconds",
    "second",
    "s",
    "milliseconds",
    "millisecond",
    "ms"
  ], i, n, a = s.length;
  for (i = 0; i < a; i += 1)
    n = s[i], r = r || te(t, n);
  return e && r;
}
function yg(t) {
  var e = ct(t), r = !1;
  return e && (r = t.filter(function(s) {
    return !Nt(s) && Sc(t);
  }).length === 0), e && r;
}
function vg(t) {
  var e = fr(t) && !On(t), r = !1, s = [
    "sameDay",
    "nextDay",
    "lastDay",
    "nextWeek",
    "lastWeek",
    "sameElse"
  ], i, n;
  for (i = 0; i < s.length; i += 1)
    n = s[i], r = r || te(t, n);
  return e && r;
}
function bg(t, e) {
  var r = t.diff(e, "days", !0);
  return r < -6 ? "sameElse" : r < -1 ? "lastWeek" : r < 0 ? "lastDay" : r < 1 ? "sameDay" : r < 2 ? "nextDay" : r < 7 ? "nextWeek" : "sameElse";
}
function _g(t, e) {
  arguments.length === 1 && (arguments[0] ? mg(arguments[0]) ? (t = arguments[0], e = void 0) : vg(arguments[0]) && (e = arguments[0], t = void 0) : (t = void 0, e = void 0));
  var r = t || ue(), s = Jn(r, this).startOf("day"), i = A.calendarFormat(this, s) || "sameElse", n = e && (Et(e[i]) ? e[i].call(this, r) : e[i]);
  return this.format(
    n || this.localeData().calendar(i, this, ue(r))
  );
}
function xg() {
  return new ps(this);
}
function Tg(t, e) {
  var r = lt(t) ? t : ue(t);
  return this.isValid() && r.isValid() ? (e = Je(e) || "millisecond", e === "millisecond" ? this.valueOf() > r.valueOf() : r.valueOf() < this.clone().startOf(e).valueOf()) : !1;
}
function Eg(t, e) {
  var r = lt(t) ? t : ue(t);
  return this.isValid() && r.isValid() ? (e = Je(e) || "millisecond", e === "millisecond" ? this.valueOf() < r.valueOf() : this.clone().endOf(e).valueOf() < r.valueOf()) : !1;
}
function Sg(t, e, r, s) {
  var i = lt(t) ? t : ue(t), n = lt(e) ? e : ue(e);
  return this.isValid() && i.isValid() && n.isValid() ? (s = s || "()", (s[0] === "(" ? this.isAfter(i, r) : !this.isBefore(i, r)) && (s[1] === ")" ? this.isBefore(n, r) : !this.isAfter(n, r))) : !1;
}
function Dg(t, e) {
  var r = lt(t) ? t : ue(t), s;
  return this.isValid() && r.isValid() ? (e = Je(e) || "millisecond", e === "millisecond" ? this.valueOf() === r.valueOf() : (s = r.valueOf(), this.clone().startOf(e).valueOf() <= s && s <= this.clone().endOf(e).valueOf())) : !1;
}
function Cg(t, e) {
  return this.isSame(t, e) || this.isAfter(t, e);
}
function Ig(t, e) {
  return this.isSame(t, e) || this.isBefore(t, e);
}
function Rg(t, e, r) {
  var s, i, n;
  if (!this.isValid())
    return NaN;
  if (s = Jn(t, this), !s.isValid())
    return NaN;
  switch (i = (s.utcOffset() - this.utcOffset()) * 6e4, e = Je(e), e) {
    case "year":
      n = Ms(this, s) / 12;
      break;
    case "month":
      n = Ms(this, s);
      break;
    case "quarter":
      n = Ms(this, s) / 3;
      break;
    case "second":
      n = (this - s) / 1e3;
      break;
    case "minute":
      n = (this - s) / 6e4;
      break;
    case "hour":
      n = (this - s) / 36e5;
      break;
    case "day":
      n = (this - s - i) / 864e5;
      break;
    case "week":
      n = (this - s - i) / 6048e5;
      break;
    default:
      n = this - s;
  }
  return r ? n : Ke(n);
}
function Ms(t, e) {
  if (t.date() < e.date())
    return -Ms(e, t);
  var r = (e.year() - t.year()) * 12 + (e.month() - t.month()), s = t.clone().add(r, "months"), i, n;
  return e - s < 0 ? (i = t.clone().add(r - 1, "months"), n = (e - s) / (s - i)) : (i = t.clone().add(r + 1, "months"), n = (e - s) / (i - s)), -(r + n) || 0;
}
A.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
A.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
function $g() {
  return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
}
function Ag(t) {
  if (!this.isValid())
    return null;
  var e = t !== !0, r = e ? this.clone().utc() : this;
  return r.year() < 0 || r.year() > 9999 ? Hs(
    r,
    e ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"
  ) : Et(Date.prototype.toISOString) ? e ? this.toDate().toISOString() : new Date(this.valueOf() + this.utcOffset() * 60 * 1e3).toISOString().replace("Z", Hs(r, "Z")) : Hs(
    r,
    e ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
  );
}
function kg() {
  if (!this.isValid())
    return "moment.invalid(/* " + this._i + " */)";
  var t = "moment", e = "", r, s, i, n;
  return this.isLocal() || (t = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone", e = "Z"), r = "[" + t + '("]', s = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY", i = "-MM-DD[T]HH:mm:ss.SSS", n = e + '[")]', this.format(r + s + i + n);
}
function Pg(t) {
  t || (t = this.isUtc() ? A.defaultFormatUtc : A.defaultFormat);
  var e = Hs(this, t);
  return this.localeData().postformat(e);
}
function Hg(t, e) {
  return this.isValid() && (lt(t) && t.isValid() || ue(t).isValid()) ? dt({ to: this, from: t }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
}
function Og(t) {
  return this.from(ue(), t);
}
function Mg(t, e) {
  return this.isValid() && (lt(t) && t.isValid() || ue(t).isValid()) ? dt({ from: this, to: t }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
}
function Fg(t) {
  return this.to(ue(), t);
}
function Dc(t) {
  var e;
  return t === void 0 ? this._locale._abbr : (e = Ut(t), e != null && (this._locale = e), this);
}
var Cc = ze(
  "moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",
  function(t) {
    return t === void 0 ? this.localeData() : this.locale(t);
  }
);
function Ic() {
  return this._locale;
}
var Ks = 1e3, Pr = 60 * Ks, Zs = 60 * Pr, Rc = (365 * 400 + 97) * 24 * Zs;
function Hr(t, e) {
  return (t % e + e) % e;
}
function $c(t, e, r) {
  return t < 100 && t >= 0 ? new Date(t + 400, e, r) - Rc : new Date(t, e, r).valueOf();
}
function Ac(t, e, r) {
  return t < 100 && t >= 0 ? Date.UTC(t + 400, e, r) - Rc : Date.UTC(t, e, r);
}
function Ng(t) {
  var e, r;
  if (t = Je(t), t === void 0 || t === "millisecond" || !this.isValid())
    return this;
  switch (r = this._isUTC ? Ac : $c, t) {
    case "year":
      e = r(this.year(), 0, 1);
      break;
    case "quarter":
      e = r(
        this.year(),
        this.month() - this.month() % 3,
        1
      );
      break;
    case "month":
      e = r(this.year(), this.month(), 1);
      break;
    case "week":
      e = r(
        this.year(),
        this.month(),
        this.date() - this.weekday()
      );
      break;
    case "isoWeek":
      e = r(
        this.year(),
        this.month(),
        this.date() - (this.isoWeekday() - 1)
      );
      break;
    case "day":
    case "date":
      e = r(this.year(), this.month(), this.date());
      break;
    case "hour":
      e = this._d.valueOf(), e -= Hr(
        e + (this._isUTC ? 0 : this.utcOffset() * Pr),
        Zs
      );
      break;
    case "minute":
      e = this._d.valueOf(), e -= Hr(e, Pr);
      break;
    case "second":
      e = this._d.valueOf(), e -= Hr(e, Ks);
      break;
  }
  return this._d.setTime(e), A.updateOffset(this, !0), this;
}
function qg(t) {
  var e, r;
  if (t = Je(t), t === void 0 || t === "millisecond" || !this.isValid())
    return this;
  switch (r = this._isUTC ? Ac : $c, t) {
    case "year":
      e = r(this.year() + 1, 0, 1) - 1;
      break;
    case "quarter":
      e = r(
        this.year(),
        this.month() - this.month() % 3 + 3,
        1
      ) - 1;
      break;
    case "month":
      e = r(this.year(), this.month() + 1, 1) - 1;
      break;
    case "week":
      e = r(
        this.year(),
        this.month(),
        this.date() - this.weekday() + 7
      ) - 1;
      break;
    case "isoWeek":
      e = r(
        this.year(),
        this.month(),
        this.date() - (this.isoWeekday() - 1) + 7
      ) - 1;
      break;
    case "day":
    case "date":
      e = r(this.year(), this.month(), this.date() + 1) - 1;
      break;
    case "hour":
      e = this._d.valueOf(), e += Zs - Hr(
        e + (this._isUTC ? 0 : this.utcOffset() * Pr),
        Zs
      ) - 1;
      break;
    case "minute":
      e = this._d.valueOf(), e += Pr - Hr(e, Pr) - 1;
      break;
    case "second":
      e = this._d.valueOf(), e += Ks - Hr(e, Ks) - 1;
      break;
  }
  return this._d.setTime(e), A.updateOffset(this, !0), this;
}
function Ug() {
  return this._d.valueOf() - (this._offset || 0) * 6e4;
}
function Lg() {
  return Math.floor(this.valueOf() / 1e3);
}
function jg() {
  return new Date(this.valueOf());
}
function Yg() {
  var t = this;
  return [
    t.year(),
    t.month(),
    t.date(),
    t.hour(),
    t.minute(),
    t.second(),
    t.millisecond()
  ];
}
function Bg() {
  var t = this;
  return {
    years: t.year(),
    months: t.month(),
    date: t.date(),
    hours: t.hours(),
    minutes: t.minutes(),
    seconds: t.seconds(),
    milliseconds: t.milliseconds()
  };
}
function Wg() {
  return this.isValid() ? this.toISOString() : null;
}
function Vg() {
  return Mn(this);
}
function Gg() {
  return Zt({}, G(this));
}
function Kg() {
  return G(this).overflow;
}
function Zg() {
  return {
    input: this._i,
    format: this._f,
    locale: this._locale,
    isUTC: this._isUTC,
    strict: this._strict
  };
}
q("N", 0, 0, "eraAbbr");
q("NN", 0, 0, "eraAbbr");
q("NNN", 0, 0, "eraAbbr");
q("NNNN", 0, 0, "eraName");
q("NNNNN", 0, 0, "eraNarrow");
q("y", ["y", 1], "yo", "eraYear");
q("y", ["yy", 2], 0, "eraYear");
q("y", ["yyy", 3], 0, "eraYear");
q("y", ["yyyy", 4], 0, "eraYear");
H("N", Xn);
H("NN", Xn);
H("NNN", Xn);
H("NNNN", ap);
H("NNNNN", op);
ce(
  ["N", "NN", "NNN", "NNNN", "NNNNN"],
  function(t, e, r, s) {
    var i = r._locale.erasParse(t, s, r._strict);
    i ? G(r).era = i : G(r).invalidEra = t;
  }
);
H("y", jr);
H("yy", jr);
H("yyy", jr);
H("yyyy", jr);
H("yo", cp);
ce(["y", "yy", "yyy", "yyyy"], Ae);
ce(["yo"], function(t, e, r, s) {
  var i;
  r._locale._eraYearOrdinalRegex && (i = t.match(r._locale._eraYearOrdinalRegex)), r._locale.eraYearOrdinalParse ? e[Ae] = r._locale.eraYearOrdinalParse(t, i) : e[Ae] = parseInt(t, 10);
});
function zg(t, e) {
  var r, s, i, n = this._eras || Ut("en")._eras;
  for (r = 0, s = n.length; r < s; ++r) {
    switch (typeof n[r].since) {
      case "string":
        i = A(n[r].since).startOf("day"), n[r].since = i.valueOf();
        break;
    }
    switch (typeof n[r].until) {
      case "undefined":
        n[r].until = 1 / 0;
        break;
      case "string":
        i = A(n[r].until).startOf("day").valueOf(), n[r].until = i.valueOf();
        break;
    }
  }
  return n;
}
function Jg(t, e, r) {
  var s, i, n = this.eras(), a, o, c;
  for (t = t.toUpperCase(), s = 0, i = n.length; s < i; ++s)
    if (a = n[s].name.toUpperCase(), o = n[s].abbr.toUpperCase(), c = n[s].narrow.toUpperCase(), r)
      switch (e) {
        case "N":
        case "NN":
        case "NNN":
          if (o === t)
            return n[s];
          break;
        case "NNNN":
          if (a === t)
            return n[s];
          break;
        case "NNNNN":
          if (c === t)
            return n[s];
          break;
      }
    else if ([a, o, c].indexOf(t) >= 0)
      return n[s];
}
function Xg(t, e) {
  var r = t.since <= t.until ? 1 : -1;
  return e === void 0 ? A(t.since).year() : A(t.since).year() + (e - t.offset) * r;
}
function Qg() {
  var t, e, r, s = this.localeData().eras();
  for (t = 0, e = s.length; t < e; ++t)
    if (r = this.clone().startOf("day").valueOf(), s[t].since <= r && r <= s[t].until || s[t].until <= r && r <= s[t].since)
      return s[t].name;
  return "";
}
function ep() {
  var t, e, r, s = this.localeData().eras();
  for (t = 0, e = s.length; t < e; ++t)
    if (r = this.clone().startOf("day").valueOf(), s[t].since <= r && r <= s[t].until || s[t].until <= r && r <= s[t].since)
      return s[t].narrow;
  return "";
}
function tp() {
  var t, e, r, s = this.localeData().eras();
  for (t = 0, e = s.length; t < e; ++t)
    if (r = this.clone().startOf("day").valueOf(), s[t].since <= r && r <= s[t].until || s[t].until <= r && r <= s[t].since)
      return s[t].abbr;
  return "";
}
function rp() {
  var t, e, r, s, i = this.localeData().eras();
  for (t = 0, e = i.length; t < e; ++t)
    if (r = i[t].since <= i[t].until ? 1 : -1, s = this.clone().startOf("day").valueOf(), i[t].since <= s && s <= i[t].until || i[t].until <= s && s <= i[t].since)
      return (this.year() - A(i[t].since).year()) * r + i[t].offset;
  return this.year();
}
function sp(t) {
  return te(this, "_erasNameRegex") || Qn.call(this), t ? this._erasNameRegex : this._erasRegex;
}
function ip(t) {
  return te(this, "_erasAbbrRegex") || Qn.call(this), t ? this._erasAbbrRegex : this._erasRegex;
}
function np(t) {
  return te(this, "_erasNarrowRegex") || Qn.call(this), t ? this._erasNarrowRegex : this._erasRegex;
}
function Xn(t, e) {
  return e.erasAbbrRegex(t);
}
function ap(t, e) {
  return e.erasNameRegex(t);
}
function op(t, e) {
  return e.erasNarrowRegex(t);
}
function cp(t, e) {
  return e._eraYearOrdinalRegex || jr;
}
function Qn() {
  var t = [], e = [], r = [], s = [], i, n, a = this.eras();
  for (i = 0, n = a.length; i < n; ++i)
    e.push(Ye(a[i].name)), t.push(Ye(a[i].abbr)), r.push(Ye(a[i].narrow)), s.push(Ye(a[i].name)), s.push(Ye(a[i].abbr)), s.push(Ye(a[i].narrow));
  this._erasRegex = new RegExp("^(" + s.join("|") + ")", "i"), this._erasNameRegex = new RegExp("^(" + e.join("|") + ")", "i"), this._erasAbbrRegex = new RegExp("^(" + t.join("|") + ")", "i"), this._erasNarrowRegex = new RegExp(
    "^(" + r.join("|") + ")",
    "i"
  );
}
q(0, ["gg", 2], 0, function() {
  return this.weekYear() % 100;
});
q(0, ["GG", 2], 0, function() {
  return this.isoWeekYear() % 100;
});
function _i(t, e) {
  q(0, [t, t.length], 0, e);
}
_i("gggg", "weekYear");
_i("ggggg", "weekYear");
_i("GGGG", "isoWeekYear");
_i("GGGGG", "isoWeekYear");
Pe("weekYear", "gg");
Pe("isoWeekYear", "GG");
He("weekYear", 1);
He("isoWeekYear", 1);
H("G", mi);
H("g", mi);
H("GG", fe, Ve);
H("gg", fe, Ve);
H("GGGG", jn, Ln);
H("gggg", jn, Ln);
H("GGGGG", pi, fi);
H("ggggg", pi, fi);
ws(
  ["gggg", "ggggg", "GGGG", "GGGGG"],
  function(t, e, r, s) {
    e[s.substr(0, 2)] = z(t);
  }
);
ws(["gg", "GG"], function(t, e, r, s) {
  e[s] = A.parseTwoDigitYear(t);
});
function lp(t) {
  return kc.call(
    this,
    t,
    this.week(),
    this.weekday(),
    this.localeData()._week.dow,
    this.localeData()._week.doy
  );
}
function dp(t) {
  return kc.call(
    this,
    t,
    this.isoWeek(),
    this.isoWeekday(),
    1,
    4
  );
}
function hp() {
  return Mt(this.year(), 1, 4);
}
function up() {
  return Mt(this.isoWeekYear(), 1, 4);
}
function fp() {
  var t = this.localeData()._week;
  return Mt(this.year(), t.dow, t.doy);
}
function gp() {
  var t = this.localeData()._week;
  return Mt(this.weekYear(), t.dow, t.doy);
}
function kc(t, e, r, s, i) {
  var n;
  return t == null ? us(this, s, i).year : (n = Mt(t, s, i), e > n && (e = n), pp.call(this, t, e, r, s, i));
}
function pp(t, e, r, s, i) {
  var n = hc(t, e, r, s, i), a = hs(n.year, 0, n.dayOfYear);
  return this.year(a.getUTCFullYear()), this.month(a.getUTCMonth()), this.date(a.getUTCDate()), this;
}
q("Q", 0, "Qo", "quarter");
Pe("quarter", "Q");
He("quarter", 7);
H("Q", tc);
ce("Q", function(t, e) {
  e[Pt] = (z(t) - 1) * 3;
});
function mp(t) {
  return t == null ? Math.ceil((this.month() + 1) / 3) : this.month((t - 1) * 3 + this.month() % 3);
}
q("D", ["DD", 2], "Do", "date");
Pe("date", "D");
He("date", 9);
H("D", fe);
H("DD", fe, Ve);
H("Do", function(t, e) {
  return t ? e._dayOfMonthOrdinalParse || e._ordinalParse : e._dayOfMonthOrdinalParseLenient;
});
ce(["D", "DD"], yt);
ce("Do", function(t, e) {
  e[yt] = z(t.match(fe)[0]);
});
var Pc = Lr("Date", !0);
q("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
Pe("dayOfYear", "DDD");
He("dayOfYear", 4);
H("DDD", gi);
H("DDDD", rc);
ce(["DDD", "DDDD"], function(t, e, r) {
  r._dayOfYear = z(t);
});
function wp(t) {
  var e = Math.round(
    (this.clone().startOf("day") - this.clone().startOf("year")) / 864e5
  ) + 1;
  return t == null ? e : this.add(t - e, "d");
}
q("m", ["mm", 2], 0, "minute");
Pe("minute", "m");
He("minute", 14);
H("m", fe);
H("mm", fe, Ve);
ce(["m", "mm"], nt);
var yp = Lr("Minutes", !1);
q("s", ["ss", 2], 0, "second");
Pe("second", "s");
He("second", 15);
H("s", fe);
H("ss", fe, Ve);
ce(["s", "ss"], Ht);
var vp = Lr("Seconds", !1);
q("S", 0, 0, function() {
  return ~~(this.millisecond() / 100);
});
q(0, ["SS", 2], 0, function() {
  return ~~(this.millisecond() / 10);
});
q(0, ["SSS", 3], 0, "millisecond");
q(0, ["SSSS", 4], 0, function() {
  return this.millisecond() * 10;
});
q(0, ["SSSSS", 5], 0, function() {
  return this.millisecond() * 100;
});
q(0, ["SSSSSS", 6], 0, function() {
  return this.millisecond() * 1e3;
});
q(0, ["SSSSSSS", 7], 0, function() {
  return this.millisecond() * 1e4;
});
q(0, ["SSSSSSSS", 8], 0, function() {
  return this.millisecond() * 1e5;
});
q(0, ["SSSSSSSSS", 9], 0, function() {
  return this.millisecond() * 1e6;
});
Pe("millisecond", "ms");
He("millisecond", 16);
H("S", gi, tc);
H("SS", gi, Ve);
H("SSS", gi, rc);
var zt, Hc;
for (zt = "SSSS"; zt.length <= 9; zt += "S")
  H(zt, jr);
function bp(t, e) {
  e[lr] = z(("0." + t) * 1e3);
}
for (zt = "S"; zt.length <= 9; zt += "S")
  ce(zt, bp);
Hc = Lr("Milliseconds", !1);
q("z", 0, 0, "zoneAbbr");
q("zz", 0, 0, "zoneName");
function _p() {
  return this._isUTC ? "UTC" : "";
}
function xp() {
  return this._isUTC ? "Coordinated Universal Time" : "";
}
var D = ps.prototype;
D.add = gg;
D.calendar = _g;
D.clone = xg;
D.diff = Rg;
D.endOf = qg;
D.format = Pg;
D.from = Hg;
D.fromNow = Og;
D.to = Mg;
D.toNow = Fg;
D.get = Tu;
D.invalidAt = Kg;
D.isAfter = Tg;
D.isBefore = Eg;
D.isBetween = Sg;
D.isSame = Dg;
D.isSameOrAfter = Cg;
D.isSameOrBefore = Ig;
D.isValid = Vg;
D.lang = Cc;
D.locale = Dc;
D.localeData = Ic;
D.max = Vf;
D.min = Wf;
D.parsingFlags = Gg;
D.set = Eu;
D.startOf = Ng;
D.subtract = pg;
D.toArray = Yg;
D.toObject = Bg;
D.toDate = jg;
D.toISOString = Ag;
D.inspect = kg;
typeof Symbol < "u" && Symbol.for != null && (D[Symbol.for("nodejs.util.inspect.custom")] = function() {
  return "Moment<" + this.format() + ">";
});
D.toJSON = Wg;
D.toString = $g;
D.unix = Lg;
D.valueOf = Ug;
D.creationData = Zg;
D.eraName = Qg;
D.eraNarrow = ep;
D.eraAbbr = tp;
D.eraYear = rp;
D.year = dc;
D.isLeapYear = Yu;
D.weekYear = lp;
D.isoWeekYear = dp;
D.quarter = D.quarters = mp;
D.month = cc;
D.daysInMonth = Uu;
D.week = D.weeks = Zu;
D.isoWeek = D.isoWeeks = zu;
D.weeksInYear = fp;
D.weeksInWeekYear = gp;
D.isoWeeksInYear = hp;
D.isoWeeksInISOWeekYear = up;
D.date = Pc;
D.day = D.days = df;
D.weekday = hf;
D.isoWeekday = uf;
D.dayOfYear = wp;
D.hour = D.hours = vf;
D.minute = D.minutes = yp;
D.second = D.seconds = vp;
D.millisecond = D.milliseconds = Hc;
D.utcOffset = tg;
D.utc = sg;
D.local = ig;
D.parseZone = ng;
D.hasAlignedHourOffset = ag;
D.isDST = og;
D.isLocal = lg;
D.isUtcOffset = dg;
D.isUtc = xc;
D.isUTC = xc;
D.zoneAbbr = _p;
D.zoneName = xp;
D.dates = ze(
  "dates accessor is deprecated. Use date instead.",
  Pc
);
D.months = ze(
  "months accessor is deprecated. Use month instead",
  cc
);
D.years = ze(
  "years accessor is deprecated. Use year instead",
  dc
);
D.zone = ze(
  "moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",
  rg
);
D.isDSTShifted = ze(
  "isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",
  cg
);
function Tp(t) {
  return ue(t * 1e3);
}
function Ep() {
  return ue.apply(null, arguments).parseZone();
}
function Oc(t) {
  return t;
}
var re = Nn.prototype;
re.calendar = lu;
re.longDateFormat = fu;
re.invalidDate = pu;
re.ordinal = yu;
re.preparse = Oc;
re.postformat = Oc;
re.relativeTime = bu;
re.pastFuture = _u;
re.set = ou;
re.eras = zg;
re.erasParse = Jg;
re.erasConvertYear = Xg;
re.erasAbbrRegex = ip;
re.erasNameRegex = sp;
re.erasNarrowRegex = np;
re.months = Mu;
re.monthsShort = Fu;
re.monthsParse = qu;
re.monthsRegex = ju;
re.monthsShortRegex = Lu;
re.week = Wu;
re.firstDayOfYear = Ku;
re.firstDayOfWeek = Gu;
re.weekdays = nf;
re.weekdaysMin = of;
re.weekdaysShort = af;
re.weekdaysParse = lf;
re.weekdaysRegex = ff;
re.weekdaysShortRegex = gf;
re.weekdaysMinRegex = pf;
re.isPM = wf;
re.meridiem = bf;
function zs(t, e, r, s) {
  var i = Ut(), n = Tt().set(s, e);
  return i[r](n, t);
}
function Mc(t, e, r) {
  if (Nt(t) && (e = t, t = void 0), t = t || "", e != null)
    return zs(t, e, r, "month");
  var s, i = [];
  for (s = 0; s < 12; s++)
    i[s] = zs(t, s, r, "month");
  return i;
}
function ea(t, e, r, s) {
  typeof t == "boolean" ? (Nt(e) && (r = e, e = void 0), e = e || "") : (e = t, r = e, t = !1, Nt(e) && (r = e, e = void 0), e = e || "");
  var i = Ut(), n = t ? i._week.dow : 0, a, o = [];
  if (r != null)
    return zs(e, (r + n) % 7, s, "day");
  for (a = 0; a < 7; a++)
    o[a] = zs(e, (a + n) % 7, s, "day");
  return o;
}
function Sp(t, e) {
  return Mc(t, e, "months");
}
function Dp(t, e) {
  return Mc(t, e, "monthsShort");
}
function Cp(t, e, r) {
  return ea(t, e, r, "weekdays");
}
function Ip(t, e, r) {
  return ea(t, e, r, "weekdaysShort");
}
function Rp(t, e, r) {
  return ea(t, e, r, "weekdaysMin");
}
Qt("en", {
  eras: [
    {
      since: "0001-01-01",
      until: 1 / 0,
      offset: 1,
      name: "Anno Domini",
      narrow: "AD",
      abbr: "AD"
    },
    {
      since: "0000-12-31",
      until: -1 / 0,
      offset: 1,
      name: "Before Christ",
      narrow: "BC",
      abbr: "BC"
    }
  ],
  dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
  ordinal: function(t) {
    var e = t % 10, r = z(t % 100 / 10) === 1 ? "th" : e === 1 ? "st" : e === 2 ? "nd" : e === 3 ? "rd" : "th";
    return t + r;
  }
});
A.lang = ze(
  "moment.lang is deprecated. Use moment.locale instead.",
  Qt
);
A.langData = ze(
  "moment.langData is deprecated. Use moment.localeData instead.",
  Ut
);
var Rt = Math.abs;
function $p() {
  var t = this._data;
  return this._milliseconds = Rt(this._milliseconds), this._days = Rt(this._days), this._months = Rt(this._months), t.milliseconds = Rt(t.milliseconds), t.seconds = Rt(t.seconds), t.minutes = Rt(t.minutes), t.hours = Rt(t.hours), t.months = Rt(t.months), t.years = Rt(t.years), this;
}
function Fc(t, e, r, s) {
  var i = dt(e, r);
  return t._milliseconds += s * i._milliseconds, t._days += s * i._days, t._months += s * i._months, t._bubble();
}
function Ap(t, e) {
  return Fc(this, t, e, 1);
}
function kp(t, e) {
  return Fc(this, t, e, -1);
}
function Wa(t) {
  return t < 0 ? Math.floor(t) : Math.ceil(t);
}
function Pp() {
  var t = this._milliseconds, e = this._days, r = this._months, s = this._data, i, n, a, o, c;
  return t >= 0 && e >= 0 && r >= 0 || t <= 0 && e <= 0 && r <= 0 || (t += Wa(hn(r) + e) * 864e5, e = 0, r = 0), s.milliseconds = t % 1e3, i = Ke(t / 1e3), s.seconds = i % 60, n = Ke(i / 60), s.minutes = n % 60, a = Ke(n / 60), s.hours = a % 24, e += Ke(a / 24), c = Ke(Nc(e)), r += c, e -= Wa(hn(c)), o = Ke(r / 12), r %= 12, s.days = e, s.months = r, s.years = o, this;
}
function Nc(t) {
  return t * 4800 / 146097;
}
function hn(t) {
  return t * 146097 / 4800;
}
function Hp(t) {
  if (!this.isValid())
    return NaN;
  var e, r, s = this._milliseconds;
  if (t = Je(t), t === "month" || t === "quarter" || t === "year")
    switch (e = this._days + s / 864e5, r = this._months + Nc(e), t) {
      case "month":
        return r;
      case "quarter":
        return r / 3;
      case "year":
        return r / 12;
    }
  else
    switch (e = this._days + Math.round(hn(this._months)), t) {
      case "week":
        return e / 7 + s / 6048e5;
      case "day":
        return e + s / 864e5;
      case "hour":
        return e * 24 + s / 36e5;
      case "minute":
        return e * 1440 + s / 6e4;
      case "second":
        return e * 86400 + s / 1e3;
      case "millisecond":
        return Math.floor(e * 864e5) + s;
      default:
        throw new Error("Unknown unit " + t);
    }
}
function Op() {
  return this.isValid() ? this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + z(this._months / 12) * 31536e6 : NaN;
}
function Lt(t) {
  return function() {
    return this.as(t);
  };
}
var Mp = Lt("ms"), Fp = Lt("s"), Np = Lt("m"), qp = Lt("h"), Up = Lt("d"), Lp = Lt("w"), jp = Lt("M"), Yp = Lt("Q"), Bp = Lt("y");
function Wp() {
  return dt(this);
}
function Vp(t) {
  return t = Je(t), this.isValid() ? this[t + "s"]() : NaN;
}
function pr(t) {
  return function() {
    return this.isValid() ? this._data[t] : NaN;
  };
}
var Gp = pr("milliseconds"), Kp = pr("seconds"), Zp = pr("minutes"), zp = pr("hours"), Jp = pr("days"), Xp = pr("months"), Qp = pr("years");
function em() {
  return Ke(this.days() / 7);
}
var kt = Math.round, Er = {
  ss: 44,
  // a few seconds to seconds
  s: 45,
  // seconds to minute
  m: 45,
  // minutes to hour
  h: 22,
  // hours to day
  d: 26,
  // days to month/week
  w: null,
  // weeks to month
  M: 11
  // months to year
};
function tm(t, e, r, s, i) {
  return i.relativeTime(e || 1, !!r, t, s);
}
function rm(t, e, r, s) {
  var i = dt(t).abs(), n = kt(i.as("s")), a = kt(i.as("m")), o = kt(i.as("h")), c = kt(i.as("d")), l = kt(i.as("M")), h = kt(i.as("w")), f = kt(i.as("y")), x = n <= r.ss && ["s", n] || n < r.s && ["ss", n] || a <= 1 && ["m"] || a < r.m && ["mm", a] || o <= 1 && ["h"] || o < r.h && ["hh", o] || c <= 1 && ["d"] || c < r.d && ["dd", c];
  return r.w != null && (x = x || h <= 1 && ["w"] || h < r.w && ["ww", h]), x = x || l <= 1 && ["M"] || l < r.M && ["MM", l] || f <= 1 && ["y"] || ["yy", f], x[2] = e, x[3] = +t > 0, x[4] = s, tm.apply(null, x);
}
function sm(t) {
  return t === void 0 ? kt : typeof t == "function" ? (kt = t, !0) : !1;
}
function im(t, e) {
  return Er[t] === void 0 ? !1 : e === void 0 ? Er[t] : (Er[t] = e, t === "s" && (Er.ss = e - 1), !0);
}
function nm(t, e) {
  if (!this.isValid())
    return this.localeData().invalidDate();
  var r = !1, s = Er, i, n;
  return typeof t == "object" && (e = t, t = !1), typeof t == "boolean" && (r = t), typeof e == "object" && (s = Object.assign({}, Er, e), e.s != null && e.ss == null && (s.ss = e.s - 1)), i = this.localeData(), n = rm(this, !r, s, i), r && (n = i.pastFuture(+this, n)), i.postformat(n);
}
var Li = Math.abs;
function _r(t) {
  return (t > 0) - (t < 0) || +t;
}
function xi() {
  if (!this.isValid())
    return this.localeData().invalidDate();
  var t = Li(this._milliseconds) / 1e3, e = Li(this._days), r = Li(this._months), s, i, n, a, o = this.asSeconds(), c, l, h, f;
  return o ? (s = Ke(t / 60), i = Ke(s / 60), t %= 60, s %= 60, n = Ke(r / 12), r %= 12, a = t ? t.toFixed(3).replace(/\.?0+$/, "") : "", c = o < 0 ? "-" : "", l = _r(this._months) !== _r(o) ? "-" : "", h = _r(this._days) !== _r(o) ? "-" : "", f = _r(this._milliseconds) !== _r(o) ? "-" : "", c + "P" + (n ? l + n + "Y" : "") + (r ? l + r + "M" : "") + (e ? h + e + "D" : "") + (i || s || t ? "T" : "") + (i ? f + i + "H" : "") + (s ? f + s + "M" : "") + (t ? f + a + "S" : "")) : "P0D";
}
var X = bi.prototype;
X.isValid = Jf;
X.abs = $p;
X.add = Ap;
X.subtract = kp;
X.as = Hp;
X.asMilliseconds = Mp;
X.asSeconds = Fp;
X.asMinutes = Np;
X.asHours = qp;
X.asDays = Up;
X.asWeeks = Lp;
X.asMonths = jp;
X.asQuarters = Yp;
X.asYears = Bp;
X.valueOf = Op;
X._bubble = Pp;
X.clone = Wp;
X.get = Vp;
X.milliseconds = Gp;
X.seconds = Kp;
X.minutes = Zp;
X.hours = zp;
X.days = Jp;
X.weeks = em;
X.months = Xp;
X.years = Qp;
X.humanize = nm;
X.toISOString = xi;
X.toString = xi;
X.toJSON = xi;
X.locale = Dc;
X.localeData = Ic;
X.toIsoString = ze(
  "toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",
  xi
);
X.lang = Cc;
q("X", 0, 0, "unix");
q("x", 0, 0, "valueOf");
H("x", mi);
H("X", Du);
ce("X", function(t, e, r) {
  r._d = new Date(parseFloat(t) * 1e3);
});
ce("x", function(t, e, r) {
  r._d = new Date(z(t));
});
//! moment.js
A.version = "2.29.4";
nu(ue);
A.fn = D;
A.min = Gf;
A.max = Kf;
A.now = Zf;
A.utc = Tt;
A.unix = Tp;
A.months = Sp;
A.isDate = gs;
A.locale = Qt;
A.invalid = hi;
A.duration = dt;
A.isMoment = lt;
A.weekdays = Cp;
A.parseZone = Ep;
A.localeData = Ut;
A.isDuration = Os;
A.monthsShort = Dp;
A.weekdaysMin = Rp;
A.defineLocale = Vn;
A.updateLocale = Ef;
A.locales = Sf;
A.weekdaysShort = Ip;
A.normalizeUnits = Je;
A.relativeTimeRounding = sm;
A.relativeTimeThreshold = im;
A.calendarFormat = bg;
A.prototype = D;
A.HTML5_FMT = {
  DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
  // <input type="datetime-local" />
  DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
  // <input type="datetime-local" step="1" />
  DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
  // <input type="datetime-local" step="0.001" />
  DATE: "YYYY-MM-DD",
  // <input type="date" />
  TIME: "HH:mm",
  // <input type="time" />
  TIME_SECONDS: "HH:mm:ss",
  // <input type="time" step="1" />
  TIME_MS: "HH:mm:ss.SSS",
  // <input type="time" step="0.001" />
  WEEK: "GGGG-[W]WW",
  // <input type="week" />
  MONTH: "YYYY-MM"
  // <input type="month" />
};
function am(t, e, r) {
  const s = {
    uri: Ar.makeURI("sip:" + t + "@" + r),
    authorizationUsername: t,
    authorizationPassword: e,
    transportOptions: {
      server: "wss://" + r + "/ws",
      headerProtocol: "WS"
    },
    delegate: {
      onInvite: (a) => {
        console.log("[INVITE]", a);
      },
      onNotify: (a) => {
        console.log("[NOTIFY]", a);
      },
      onMessage: (a) => {
        console.log("[MESSAGE]", a);
      }
    }
  };
  console.log("initializing user agent with options:", s);
  const i = new Ar(s);
  i.stateChange.addListener((a) => console.log("ua state change: ", a));
  const n = new mt(i, { expires: 30 });
  i.start().then(() => {
    n.register();
  }).catch((a) => {
    console.error("error starting: ", a), A();
  });
}
const om = {
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
  },
  methods: {
    pushMessage(t) {
      this.messages.push(t);
    }
  },
  mounted() {
    console.log("conversation mounted", this);
  }
}, cm = (t, e) => {
  const r = t.__vccOpts || t;
  for (const [s, i] of e)
    r[s] = i;
  return r;
}, lm = { class: "thread-header" }, dm = { class: "thread" }, hm = { class: "message-container" }, um = /* @__PURE__ */ Nd('<div class="attachment-preview"></div><div class="sendbox"><textarea class="textentry" autofocus="true"></textarea><label for="attachment-upload" class="btn btn-attach"><span class="fas fa-paperclip fa-fw"></span></label><input type="file" multiple id="attachment-upload" style="display:none;"><button class="btn btn-send" disabled><span class="fas fa-paper-plane fa-fw"></span></button></div><div class="statusbox">loading</div>', 3);
function fm(t, e, r, s, i, n) {
  const a = dd("Message");
  return $i(), Da(et, null, [
    Xr("div", lm, el(r.displayName), 1),
    Xr("div", dm, [
      Xr("div", hm, [
        ($i(!0), Da(et, null, fd(i.messages, (o) => ($i(), Pd(a, { message: o }, null, 8, ["message"]))), 256))
      ]),
      um
    ])
  ], 64);
}
const gm = /* @__PURE__ */ cm(om, [["render", fm]]);
function pm(t) {
  am(t.username, t.password, t.server);
  const e = yh(gm);
  e.config.errorHandler = (r, s, i) => {
    console.log("error from within vue:", i, r, s), console.error(r);
  }, e.mount("#conversation");
}
export {
  pm as initializeThreadJS
};
