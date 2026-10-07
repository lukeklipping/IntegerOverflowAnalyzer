const $ = (id) => document.getElementById(id);
let W = 8n,
  ua = 200n,
  ub = 100n;
const mask = () => (1n << W) - 1n;
const toS = (u) => (u >= 1n << (W - 1n) ? u - (1n << W) : u);
const bin = (u) => u.toString(2).padStart(Number(W), "0");

function parse(el) {
  let v;
  try {
    v = BigInt(el.value === "" ? 0 : Math.trunc(Number(el.value)));
  } catch (e) {
    v = 0n;
  }
  const lo = -(1n << (W - 1n)),
    hi = mask();
  if (v < lo) v = lo;
  if (v > hi) v = hi;
  return v & mask(); // treat input as a bit pattern
}
function bitsRow(label, u, lostBits, which) {
  const s = bin(u);
  let h = `<div class="row"><span class="name">${label}</span><div class="bits">`;
  for (let i = 0; i < s.length; i++) {
    const on = s[i] === "1";
    h += `<span class="bit ${on ? "on" : ""} ${i === 0 ? "sign" : ""}" ${which ? `data-w="${which}" data-i="${i}" role="button" tabindex="0" aria-label="bit ${s.length - 1 - i} is ${s[i]}"` : ""}>${s[i]}</span>`;
  }
  return (
    h + `</div><span class="val">${u} unsigned / ${toS(u)} signed</span></div>`
  );
}
function render() {
  const op = $("op").value;
  const rawU = op === "+" ? ua + ub : op === "-" ? ua - ub : ua * ub;
  const sa = toS(ua),
    sb = toS(ub);
  const rawS = op === "+" ? sa + sb : op === "-" ? sa - sb : sa * sb;
  const res = rawU & mask();
  const uOver = rawU < 0n || rawU > mask();
  const lo = -(1n << (W - 1n)),
    hi = (1n << (W - 1n)) - 1n;
  const sOver = rawS < lo || rawS > hi;
  let viz = bitsRow("A", ua, 0, "a") + bitsRow("B", ub, 0, "b");
  const full =
    rawU < 0n ? "(negative: borrow past the top bit)" : rawU.toString(2);
  viz += `<div class="row"><span class="name">True result</span><span class="val">${rawU} unsigned math = ${full}</span></div>`;

  if (rawU > mask()) {
    const full2 = rawU.toString(2),
      keep = full2.slice(-Number(W)),
      dropped = full2.slice(0, full2.length - Number(W));
    viz += `<div class="row"><span class="name">Dropped</span><div class="bits">${[...dropped].map((c) => `<span class="bit lost">${c}</span>`).join("")}</div><span class="val">these high bits do not fit and are discarded</span></div>`;
  }

  viz += bitsRow("Stored", res);
  $("viz").innerHTML = viz;
  $("uv").textContent = res;
  $("sv").textContent = toS(res);
  $("uf").innerHTML = uOver
    ? `<span class="flag bad">Overflow: true answer was ${rawU}</span>`
    : `<span class="flag ok">Fits (${rawU})</span>`;
  $("sf").innerHTML = sOver
    ? `<span class="flag bad">Overflow: true answer was ${rawS}</span>`
    : `<span class="flag ok">Fits (${rawS})</span>`;
  $("expl").textContent =
    `The bits are identical either way; only the interpretation differs. Unsigned range: 0 to ${mask()}. Signed range: ${lo} to ${hi}. The leftmost bit (outlined) is the sign bit when reading as signed. ${uOver !== sOver ? "Notice that one reading overflowed and the other did not." : ""}`;
  // allocation
  const c = BigInt(Math.max(0, Math.trunc(Number($("cnt").value) || 0))),
    z = BigInt(Math.max(0, Math.trunc(Number($("sz").value) || 0)));
  const need = c * z,
    got = need & mask(),
    bad = need > mask();
  const total = Number(need > got ? need : got) || 1;
  const pg = (Number(got) / total) * 100,
    pn = 100 - pg;
  $("alloc").innerHTML =
    `<div class="row"><span class="val">Programmer expects ${c} × ${z} = <b>${need}</b> bytes. Computer computes <b>${got}</b> bytes.</span></div>
  <div class="mem"><div style="width:${pg}%;background:var(--b1);color:var(--b1t)">${pg > 12 ? "allocated " + got : ""}</div>${bad ? `<div style="width:${pn}%;background:var(--bad);color:#fff">${pn > 12 ? "written past the end: " + (need - got) : ""}</div>` : ""}</div>
  <span class="flag ${bad ? "bad" : "ok"}">${bad ? `Heap overflow: the loop writes ${need - got} bytes beyond the buffer` : "Safe: allocation matches what the loop writes"}</span>
  <p class="note">Fix: check <code>count &gt; MAX / size</code> before multiplying, or use a checked-multiply helper.</p>`;
}
function sync() {
  W = BigInt($("w").value);
  ua = parse($("a"));
  ub = parse($("b"));
  render();
}
["w", "a", "b", "op", "cnt", "sz"].forEach((i) =>
  $(i).addEventListener("input", sync),
);
function flip(t) {
  const el = t.dataset.w;
  if (!el) return;
  const i = Number(t.dataset.i),
    pos = Number(W) - 1 - i,
    v = (el === "a" ? ua : ub) ^ (1n << BigInt(pos));
  $(el).value = toS(v) < 0n && false ? v : v; // show unsigned pattern
  sync();
}
$("viz").addEventListener("click", (e) => flip(e.target));
$("viz").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    flip(e.target);
  }
});
const exs = [
  ["8", 200, "+", 100],
  ["8", 127, "+", 1],
  ["8", 0, "-", 1],
  ["16", 300, "*", 300],
  ["32", 65536, "*", 65536],
];
let k = 0;
$("ex").onclick = () => {
  const [w, a, o, b] = exs[k++ % exs.length];
  $("w").value = w;
  $("a").value = a;
  $("op").value = o;
  $("b").value = b;
  if (w === "32") {
    $("cnt").value = 1073741825;
    $("sz").value = 4;
  } else if (w === "16") {
    $("cnt").value = 20000;
    $("sz").value = 4;
  } else {
    $("cnt").value = 100;
    $("sz").value = 4;
  }
  sync();
};
sync();
