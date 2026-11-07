// Carrossel "Bal Harbour Shops" — identidade visual @rafaelsimoncorretor
// Gera 6 slides 1080x1350 (exportados em 2x = 2160x2700) em ./carrossel
// Uso: node render.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const f = (p) => 'file://' + path.join(root, p);
const HANDLE = '@rafaelsimoncorretor';
const TOTAL = 6;
const GOLD = '#d4b46a';

// ---------- elementos gráficos (SVG em linha dourada) ----------
// Palmeira em traço fino, gerada proceduralmente
function palm({ x = 0, y = 0, h = 600, lean = 40, scale = 1, sw = 2 } = {}) {
  const top = [x + lean, y - h];
  const c1 = [x + lean * 0.2, y - h * 0.55];
  const bez = (t, a, b, c) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  let s = `<path d="M${x} ${y} Q ${c1[0]} ${c1[1]} ${top[0]} ${top[1]}" fill="none" stroke="${GOLD}" stroke-width="${sw * 1.6}" stroke-linecap="round"/>`;
  for (let t = 0.08; t < 0.95; t += 0.07) {
    const bx = bez(t, x, c1[0], top[0]);
    const by = bez(t, y, c1[1], top[1]);
    s += `<path d="M${(bx - 9).toFixed(1)} ${(by + 3).toFixed(1)} q 9 -6 18 0" fill="none" stroke="${GOLD}" stroke-width="${sw * 0.8}" opacity=".7"/>`;
  }
  const angles = [-175, -145, -115, -85, -55, -25, 5];
  angles.forEach((a, i) => {
    const len = (230 + (i % 3) * 40) * scale;
    const rad = (a * Math.PI) / 180;
    const ex = top[0] + Math.cos(rad) * len;
    const ey = top[1] + Math.sin(rad) * len * 0.75 + len * 0.35;
    const cx = top[0] + Math.cos(rad) * len * 0.55;
    const cy = top[1] + Math.sin(rad) * len * 0.75 - 30 * scale;
    s += `<path d="M${top[0]} ${top[1]} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${GOLD}" stroke-width="${sw}" stroke-linecap="round"/>`;
    for (let k = 1; k < 16; k++) {
      const t = k / 16;
      const px = bez(t, top[0], cx, ex), py = bez(t, top[1], cy, ey);
      const dx = 2 * (1 - t) * (cx - top[0]) + 2 * t * (ex - cx);
      const dy = 2 * (1 - t) * (cy - top[1]) + 2 * t * (ey - cy);
      const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n;
      const L = (1 - t) * 46 * scale + 8;
      [[-uy, ux], [uy, -ux]].forEach(([nx, ny]) => {
        const qx = px + (nx - ux * 0.55) * L;
        const qy = py + (ny - uy * 0.55) * L + L * 0.35;
        s += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} L ${qx.toFixed(1)} ${qy.toFixed(1)}" stroke="${GOLD}" stroke-width="${sw * 0.7}" stroke-linecap="round" opacity=".85"/>`;
      });
    }
  });
  return s;
}

// Arcada de boutiques (arcos, vitrines e luminárias)
function arcade(x0 = 560) {
  let s = '';
  [x0, x0 + 260].forEach((x) => {
    const w = 230, h = 560, r = w / 2, base = 980;
    s += `<path d="M${x} ${base} V ${base - h + r} A ${r} ${r} 0 0 1 ${x + w} ${base - h + r} V ${base}" fill="none" stroke="${GOLD}" stroke-width="2.4"/>`;
    s += `<path d="M${x + 22} ${base} V ${base - h + r + 6} A ${r - 22} ${r - 22} 0 0 1 ${x + w - 22} ${base - h + r + 6} V ${base}" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity=".55"/>`;
    s += `<line x1="${x + r}" y1="${base - h + r - 60}" x2="${x + r}" y2="${base - h + r + 60}" stroke="${GOLD}" stroke-width="1.2" opacity=".7"/>`;
    s += `<path d="M${x + r - 26} ${base - h + r + 90} L ${x + r} ${base - h + r + 60} L ${x + r + 26} ${base - h + r + 90} Z" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".8"/>`;
  });
  s += `<line x1="${x0 - 90}" y1="980" x2="1080" y2="980" stroke="${GOLD}" stroke-width="2"/>`;
  return s;
}

const icon = {
  bag: `<svg viewBox="0 0 48 48" fill="none" stroke="${GOLD}" stroke-width="2" stroke-linejoin="round"><path d="M10 16h28l-2 26H12z"/><path d="M17 20v-6a7 7 0 0 1 14 0v6"/></svg>`,
  dining: `<svg viewBox="0 0 48 48" fill="none" stroke="${GOLD}" stroke-width="2" stroke-linecap="round"><circle cx="24" cy="25" r="11"/><circle cx="24" cy="25" r="6.5" opacity=".6"/><path d="M6 8v10a3 3 0 0 0 3 3v19M9 8v8M12 8v10a3 3 0 0 1-3 3"/><path d="M40 8c-3 3-3 10 0 13v19"/></svg>`,
  gem: `<svg viewBox="0 0 48 48" fill="none" stroke="${GOLD}" stroke-width="2" stroke-linejoin="round"><path d="M8 18l8-9h16l8 9-16 22z"/><path d="M8 18h32M16 9l8 31 8-31M20 18l4-9 4 9"/></svg>`,
  arrow: `<svg viewBox="0 0 48 24" fill="none" stroke="${GOLD}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h42M34 3l10 9-10 9"/></svg>`,
  chevron: `<svg viewBox="0 0 24 48" fill="none" stroke="${GOLD}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8l12 16L6 40"/></svg>`,
};

// ---------- estilos ----------
const css = `
@font-face{font-family:'Montserrat';src:url('${f('fonts/Montserrat-500.ttf')}');font-weight:500}
@font-face{font-family:'Montserrat';src:url('${f('fonts/Montserrat-600.ttf')}');font-weight:600}
@font-face{font-family:'Montserrat';src:url('${f('fonts/Montserrat-700.ttf')}');font-weight:700}
@font-face{font-family:'Montserrat';src:url('${f('fonts/Montserrat-800.ttf')}');font-weight:800}
@font-face{font-family:'Cormorant';src:url('${f('fonts/Cormorant-500.ttf')}');font-weight:500}
@font-face{font-family:'Cormorant';src:url('${f('fonts/Cormorant-600.ttf')}');font-weight:600}
@font-face{font-family:'Cormorant';src:url('${f('fonts/Cormorant-500i.ttf')}');font-weight:500;font-style:italic}
@font-face{font-family:'Cormorant';src:url('${f('fonts/Cormorant-600i.ttf')}');font-weight:600;font-style:italic}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;background:#2f3741}
.s{position:relative;width:1080px;height:1350px;overflow:hidden;color:#fff;font-family:'Montserrat',sans-serif;
  background:
    radial-gradient(ellipse 85% 60% at 32% 30%, rgba(132,148,166,.38) 0%, rgba(132,148,166,0) 70%),
    linear-gradient(165deg,#4a5562 0%,#3a4450 42%,#2c343e 100%);}
.grain{position:absolute;inset:0;opacity:.13;mix-blend-mode:overlay;pointer-events:none}
.deco{position:absolute;inset:0;pointer-events:none}
.gold{background:linear-gradient(180deg,#f3e2ab 0%,#d8b766 48%,#b08b3e 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.serif{font-family:'Cormorant',serif}
.it{font-family:'Cormorant',serif;font-style:italic;font-weight:600}
.pad{position:absolute;left:96px;right:96px}
.kicker{display:flex;align-items:center;gap:20px;font-size:22px;font-weight:600;letter-spacing:6px;color:${GOLD};text-transform:uppercase}
.kicker:before{content:'';width:56px;height:2px;background:${GOLD}}
.count{position:absolute;top:84px;right:96px;font-size:20px;font-weight:600;letter-spacing:4px;color:rgba(255,255,255,.5)}
.foot{position:absolute;left:96px;right:96px;bottom:64px;display:flex;align-items:center;justify-content:space-between}
.sig{display:flex;align-items:center;gap:16px;opacity:.85}
.sig img{width:60px;height:60px;border-radius:50%;object-fit:cover;border:2px solid ${GOLD}}
.sig span{font-size:21px;font-weight:600;letter-spacing:.5px;color:rgba(255,255,255,.85)}
.src{font-size:17px;font-weight:500;letter-spacing:.6px;color:rgba(255,255,255,.5)}
.rule{height:2px;background:linear-gradient(90deg,${GOLD},rgba(212,180,106,0))}
.body{font-size:34px;line-height:1.45;font-weight:500;color:rgba(255,255,255,.86)}
.body b{color:#fff;font-weight:700}
.card{background:rgba(20,26,33,.32);border:1.5px solid rgba(212,180,106,.45);border-radius:22px}
.next{position:absolute;right:40px;top:50%;width:22px;height:44px;transform:translateY(-50%);opacity:.8}
`;

const grain = `<svg class="grain" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const foot = () => `<div class="foot"><div class="sig"><img src="${f('assets/perfil.jpg')}"><span>${HANDLE}</span></div><div class="src">Fonte: Forbes Life Brasil</div></div>`;
const count = (n) => `<div class="count">${String(n).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}</div>`;
const next = `<div class="next">${icon.chevron}</div>`;

const slides = [];

// 1 — CAPA
slides.push(`
<svg class="deco" viewBox="0 0 1080 1350" style="opacity:.42">${arcade(560)}${palm({ x: 960, y: 980, h: 640, lean: -60, scale: 1.05, sw: 2.2 })}</svg>
<div class="deco" style="background:linear-gradient(90deg,rgba(44,52,62,.92) 0%,rgba(44,52,62,.55) 55%,rgba(44,52,62,0) 80%)"></div>
${count(1)}
<div class="pad" style="top:84px"><div class="kicker">Miami · Mercado de luxo</div></div>
<div class="pad" style="top:380px">
  <div style="font-size:124px;font-weight:800;line-height:.98;letter-spacing:-2px">BAL<br>HARBOUR<br><span class="gold">SHOPS</span></div>
  <div class="it" style="font-size:66px;line-height:1.05;margin-top:34px">ganha uma nova ala<br>de grifes com</div>
  <div style="display:flex;align-items:center;gap:28px;margin-top:22px">
    <div class="gold" style="font-size:170px;font-weight:800;line-height:.9;letter-spacing:-4px">+30</div>
    <div style="font-size:40px;font-weight:700;line-height:1.15;letter-spacing:3px">BOUTIQUES<br><span style="font-size:24px;font-weight:500;letter-spacing:2px;color:rgba(255,255,255,.7)">novas e ampliadas</span></div>
  </div>
</div>
${next}${foot()}`);

// 2 — O PROJETO / NÚMEROS
slides.push(`
<svg class="deco" viewBox="0 0 1080 1350" style="opacity:.10">${palm({ x: 1040, y: 1350, h: 760, lean: -120, scale: 1.25, sw: 2.4 })}</svg>
${count(2)}
<div class="pad" style="top:84px"><div class="kicker">O projeto</div></div>
<div class="pad" style="top:200px">
  <div style="font-size:64px;font-weight:800;line-height:1.05;letter-spacing:-1px">A NOVA ALA</div>
  <div class="it gold" style="font-size:104px;line-height:1">West Shops</div>
  <div class="body" style="margin-top:30px;max-width:820px">Um dos endereços mais conhecidos do luxo em Miami está ampliando sua estrutura.</div>
</div>
<div class="pad" style="top:580px">
  <div class="rule"></div>
  <div style="display:flex;align-items:baseline;gap:22px;margin-top:34px">
    <div class="gold" style="font-size:118px;font-weight:800;letter-spacing:-3px;line-height:1">US$ 740</div>
    <div style="font-size:42px;font-weight:700">milhões</div>
  </div>
  <div class="body" style="margin-top:6px">em financiamento viabilizam a expansão</div>
  <div class="rule" style="margin-top:44px"></div>
  <div style="display:flex;align-items:baseline;gap:22px;margin-top:34px">
    <div class="gold" style="font-size:118px;font-weight:800;letter-spacing:-3px;line-height:1">18,5 mil</div>
    <div style="font-size:42px;font-weight:700">m²</div>
  </div>
  <div class="body" style="margin-top:6px">de novos espaços dedicados a:</div>
  <div style="display:flex;gap:56px;margin-top:30px">
    ${[['bag', 'Moda'], ['dining', 'Gastronomia'], ['gem', 'Experiências']].map(([i, t]) => `
      <div style="display:flex;align-items:center;gap:16px"><div style="width:62px;height:62px;border:1.5px solid rgba(212,180,106,.7);border-radius:50%;display:grid;place-items:center"><div style="width:32px;height:32px">${icon[i]}</div></div><span style="font-size:24px;font-weight:600;letter-spacing:2px;text-transform:uppercase">${t}</span></div>`).join('')}
  </div>
</div>
${next}${foot()}`);

// 3 — AS GRIFES
const novas = ['Louis Vuitton', 'Celine', 'Tom Ford', 'Elie Saab', 'Messika'];
const ampliam = ['Saint Laurent', 'Bottega Veneta', 'Loro Piana'];
slides.push(`
<svg class="deco" viewBox="0 0 1080 1350" style="opacity:.09">${arcade(620)}</svg>
${count(3)}
<div class="pad" style="top:84px"><div class="kicker">As grifes</div></div>
<div class="pad" style="top:200px">
  <div style="font-size:72px;font-weight:800;line-height:1.02;letter-spacing:-1px">QUEM <span class="gold">CHEGA</span></div>
  <div class="it" style="font-size:46px;color:rgba(255,255,255,.8);margin-top:8px">à nova ala West Shops</div>
</div>
<div class="pad" style="top:440px">
  ${novas.map((n, i) => `<div style="display:flex;align-items:center;justify-content:space-between;padding:22px 0;border-bottom:1.5px solid rgba(212,180,106,${i === novas.length - 1 ? '0' : '.35'})">
    <span class="serif" style="font-size:62px;font-weight:600;line-height:1">${n}</span>
    <span style="font-size:20px;font-weight:600;letter-spacing:4px;color:${GOLD}">${String(i + 1).padStart(2, '0')}</span></div>`).join('')}
</div>
<div class="pad card" style="top:1010px;padding:30px 36px">
  <div style="font-size:21px;font-weight:700;letter-spacing:5px;color:${GOLD}">E QUEM AMPLIA</div>
  <div style="font-size:30px;line-height:1.4;font-weight:500;margin-top:12px;color:rgba(255,255,255,.88)"><b style="color:#fff">${ampliam.join(' · ')}</b> ganharão novos espaços</div>
</div>
${next}${foot()}`);

// 4 — GASTRONOMIA
slides.push(`
${count(4)}
<div class="pad" style="top:84px"><div class="kicker">Gastronomia</div></div>
<div class="pad" style="top:200px">
  <div style="font-size:60px;font-weight:800;line-height:1.08;letter-spacing:-1px">O NÚMERO DE<br>RESTAURANTES</div>
  <div class="it gold" style="font-size:100px;line-height:1.05">vai dobrar</div>
</div>
<div class="pad" style="top:540px;display:flex;align-items:center;justify-content:center;gap:56px">
  <div style="text-align:center"><div style="font-size:200px;font-weight:800;line-height:1;color:rgba(255,255,255,.38);letter-spacing:-6px">5</div><div style="font-size:22px;font-weight:600;letter-spacing:4px;color:rgba(255,255,255,.6);margin-top:8px">HOJE</div></div>
  <div style="width:130px;height:65px">${icon.arrow}</div>
  <div style="text-align:center"><div class="gold" style="font-size:200px;font-weight:800;line-height:1;letter-spacing:-6px">10</div><div style="font-size:22px;font-weight:600;letter-spacing:4px;color:${GOLD};margin-top:8px">COM A EXPANSÃO</div></div>
</div>
<div class="pad" style="top:900px;display:flex;gap:28px">
  ${[['O retorno', 'China Grill', ''], ['A chegada', 'Slim’s', 'de Stephen Starr']].map(([k, n, d]) => `
  <div class="card" style="flex:1;padding:30px 32px;min-height:200px">
    <div style="display:flex;align-items:center;gap:14px"><div style="width:34px;height:34px">${icon.dining}</div><span style="font-size:20px;font-weight:700;letter-spacing:4px;color:${GOLD};text-transform:uppercase">${k}</span></div>
    <div class="serif" style="font-size:58px;font-weight:600;line-height:1.05;margin-top:18px">${n}</div>
    ${d ? `<div class="it" style="font-size:32px;color:rgba(255,255,255,.75);margin-top:4px">${d}</div>` : ''}
  </div>`).join('')}
</div>
${next}${foot()}`);

// 5 — CRONOGRAMA + LEITURA
slides.push(`
${count(5)}
<div class="pad" style="top:84px"><div class="kicker">Cronograma</div></div>
<div class="pad" style="top:200px">
  <div style="font-size:66px;font-weight:800;line-height:1.05;letter-spacing:-1px">INAUGURAÇÕES<br>GRADUAIS</div>
  <div class="it gold" style="font-size:110px;line-height:1">até 2028</div>
</div>
<div class="pad" style="top:540px;height:120px">
  <div style="position:absolute;left:0;right:0;top:40px;height:2px;background:linear-gradient(90deg,rgba(212,180,106,.35),${GOLD})"></div>
  ${[0, 25, 50, 75].map((p) => `<div style="position:absolute;left:${p}%;top:31px;width:20px;height:20px;border-radius:50%;border:2px solid ${GOLD};background:#36404b"></div>`).join('')}
  <div style="position:absolute;right:0;top:20px;width:42px;height:42px;border-radius:50%;background:${GOLD};box-shadow:0 0 0 10px rgba(212,180,106,.18)"></div>
  <div style="position:absolute;left:0;top:84px;font-size:20px;font-weight:600;letter-spacing:4px;color:rgba(255,255,255,.6)">ABERTURAS POR ETAPAS</div>
  <div style="position:absolute;right:0;top:84px;font-size:22px;font-weight:800;letter-spacing:4px;color:${GOLD}">2028</div>
</div>
<div class="pad body" style="top:720px">A estratégia busca <b>acompanhar as mudanças no consumo de luxo</b>.</div>
<div class="pad" style="top:900px;border-left:3px solid ${GOLD};padding:6px 0 6px 34px">
  <div style="font-size:20px;font-weight:700;letter-spacing:5px;color:${GOLD}">MINHA LEITURA</div>
  <div class="it" style="font-size:44px;line-height:1.2;margin-top:12px">Projetos desse porte reforçam o interesse pela região e mostram por que Miami segue no radar de quem investe em alto padrão.</div>
</div>
${next}${foot()}`);

// 6 — CTA / ASSINATURA
slides.push(`
<svg class="deco" viewBox="0 0 1080 1350" style="opacity:.10">${palm({ x: 990, y: 1350, h: 760, lean: -90, scale: 1.2, sw: 2.4 })}${palm({ x: 90, y: 1350, h: 560, lean: 70, scale: 0.9, sw: 2.2 })}</svg>
${count(6)}
<div class="pad" style="top:84px"><div class="kicker">Vamos conversar?</div></div>
<div class="pad" style="top:205px;text-align:center">
  <div style="font-size:54px;font-weight:800;line-height:1.1;letter-spacing:-.5px">QUER INVESTIR EM</div>
  <div class="gold" style="font-size:150px;font-weight:800;line-height:1;letter-spacing:-2px">MIAMI?</div>
  <div class="it" style="font-size:42px;color:rgba(255,255,255,.85);margin-top:14px">Eu te ajudo a encontrar a oportunidade certa.</div>
</div>
<div class="pad" style="top:640px;text-align:center">
  <div style="width:250px;height:250px;margin:0 auto;border-radius:50%;padding:6px;background:linear-gradient(180deg,#f3e2ab,#b08b3e);box-shadow:0 18px 50px rgba(0,0,0,.35)">
    <img src="${f('assets/perfil.jpg')}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block">
  </div>
  <div class="serif" style="font-size:66px;font-weight:600;margin-top:26px;line-height:1">Rafael F. Simon</div>
  <div style="font-size:26px;font-weight:600;letter-spacing:1px;color:${GOLD};margin-top:12px">${HANDLE}</div>
  <div style="font-size:24px;line-height:1.45;font-weight:500;color:rgba(255,255,255,.72);margin:22px auto 0;max-width:760px">Investimentos seguros e planejados nos mercados imobiliários mais sólidos do Brasil e dos EUA.</div>
  <div style="display:inline-flex;align-items:center;gap:16px;margin-top:36px;padding:22px 44px;border-radius:60px;background:linear-gradient(180deg,#e8cf8a,#c39d4f);color:#232a32;font-size:26px;font-weight:800;letter-spacing:3px">FALE COMIGO NO DIRECT</div>
</div>
<div class="src" style="position:absolute;left:0;right:0;bottom:56px;text-align:center">Conteúdo baseado em matéria da Forbes Life Brasil</div>`);

(async () => {
  const out = path.join(root, 'carrossel');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync(path.join(root, 'build'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  for (let i = 0; i < slides.length; i++) {
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${css}</style></head><body><div class="s">${grain}${slides[i]}</div></body></html>`;
    const file = path.join(root, 'build', `slide-${i + 1}.html`);
    fs.writeFileSync(file, html);
    await page.goto('file://' + file, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const png = path.join(out, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: png });
    console.log(png);
  }
  await browser.close();
})();
