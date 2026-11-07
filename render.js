// Carrossel "Bal Harbour Shops" — identidade visual @rafaelsimoncorretor
// 6 slides 1080x1350 (exportados em 2x = 2160x2700) em ./carrossel
// Fotos: arquivo pessoal (fotos/*-45.jpg, recortes 4:5)
// Uso: node render.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const f = (p) => 'file://' + path.join(root, p);
const HANDLE = '@rafaelsimoncorretor';
const TOTAL = 6;
const GOLD = '#d6b872';

const font = (fam, file, w, st = 'normal') => `@font-face{font-family:'${fam}';src:url('${f('fonts/' + file)}');font-weight:${w};font-style:${st}}`;
const css = `
${font('Sans', 'Montserrat-400.ttf', 400)}${font('Sans', 'Montserrat-500.ttf', 500)}${font('Sans', 'Montserrat-600.ttf', 600)}
${font('Serif', 'Cormorant-300.ttf', 300)}${font('Serif', 'Cormorant-400.ttf', 400)}${font('Serif', 'Cormorant-500.ttf', 500)}
${font('Serif', 'Cormorant-400i.ttf', 400, 'italic')}${font('Serif', 'Cormorant-500i.ttf', 500, 'italic')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;background:#3a4452}
.s{position:relative;width:1080px;height:1350px;overflow:hidden;color:#fff;font-family:'Sans',sans-serif;background:#3a4452}
.photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.74;filter:saturate(.78) contrast(1.03)}
.tint{position:absolute;inset:0}
.serif{font-family:'Serif',serif;font-weight:400;font-feature-settings:'lnum' 1}
.it{font-family:'Serif',serif;font-style:italic;font-weight:400;color:${GOLD};font-feature-settings:'lnum' 1}
.pad{position:absolute;left:100px;right:100px}
.kicker{font-size:19px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:${GOLD}}
.hair{width:72px;height:1px;background:${GOLD}}
.count{position:absolute;top:92px;right:100px;font-size:17px;font-weight:500;letter-spacing:5px;color:rgba(255,255,255,.6)}
.foot{position:absolute;left:100px;right:100px;bottom:70px;display:flex;align-items:center;justify-content:space-between}
.sig{display:flex;align-items:center;gap:14px}
.sig img{width:50px;height:50px;border-radius:50%;object-fit:cover;border:1px solid ${GOLD};opacity:.92}
.sig span{font-size:18px;font-weight:500;letter-spacing:1px;color:rgba(255,255,255,.8)}
.src{font-size:15px;font-weight:400;letter-spacing:1.5px;color:rgba(255,255,255,.55);text-transform:uppercase}
.lead{font-size:30px;line-height:1.55;font-weight:400;color:rgba(255,255,255,.9)}
.label{font-size:17px;font-weight:500;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.7)}
`;

const bg = (img, tint) => `<img class="photo" src="${f('fotos/' + img)}"><div class="tint" style="background:${tint}"></div><div class="tint" style="background:linear-gradient(180deg,rgba(40,48,59,.7) 0,rgba(40,48,59,0) 260px),linear-gradient(0deg,rgba(38,46,56,.75) 0,rgba(38,46,56,0) 240px)"></div>`;
// tons cinza-azulados (base #3a4452)
const T = {
  bottom: 'linear-gradient(180deg,rgba(52,62,75,.18) 0%,rgba(52,62,75,.32) 38%,rgba(46,55,67,.86) 66%,rgba(42,50,61,.96) 100%)',
  full: 'linear-gradient(180deg,rgba(52,62,75,.5) 0%,rgba(48,57,69,.66) 50%,rgba(42,50,61,.9) 100%)',
  left: 'linear-gradient(90deg,rgba(44,52,63,.9) 0%,rgba(48,57,69,.7) 55%,rgba(52,62,75,.2) 100%)',
};
const head = (n, k) => `<div class="pad" style="top:92px;display:flex;align-items:center;gap:22px"><div class="hair"></div><div class="kicker">${k}</div></div><div class="count">${String(n).padStart(2, '0')} — ${String(TOTAL).padStart(2, '0')}</div>`;
const foot = () => `<div class="foot"><div class="sig"><img src="${f('assets/perfil.jpg')}"><span>${HANDLE}</span></div><div class="src">Fonte: Forbes Life Brasil</div></div>`;

const slides = [];

// 1 — CAPA
slides.push(`${bg('bh3-45.jpg', T.bottom)}
${head(1, 'Bal Harbour · Miami')}
<div class="pad" style="bottom:200px">
  <div class="serif" style="font-size:132px;line-height:.95;letter-spacing:-1px;font-weight:300">Bal Harbour<br>Shops</div>
  <div class="it" style="font-size:66px;line-height:1.1;margin-top:22px">ganha nova ala de grifes</div>
  <div style="display:flex;align-items:center;gap:22px;margin-top:44px"><div class="hair"></div>
    <div style="font-size:22px;font-weight:500;letter-spacing:6px;text-transform:uppercase">Mais de 30 boutiques</div></div>
</div>
${foot()}`);

// 2 — O PROJETO
slides.push(`${bg('bh5-45.jpg', 'linear-gradient(180deg,rgba(52,62,75,.15) 0%,rgba(50,60,72,.45) 30%,rgba(46,55,67,.86) 48%,rgba(42,50,61,.95) 100%)')}
${head(2, 'O projeto')}
<div class="pad" style="bottom:210px">
  <div class="label">A nova ala</div>
  <div class="it" style="font-size:118px;line-height:1;margin-top:8px">West Shops</div>
  <div class="lead" style="margin-top:22px;max-width:800px">Um dos endereços mais conhecidos do luxo em Miami está ampliando sua estrutura.</div>
  <div style="display:flex;margin-top:56px;border-top:1px solid rgba(214,184,114,.55);padding-top:40px">
    <div style="flex:1;padding-right:36px">
      <div class="serif" style="font-size:86px;line-height:1;font-weight:400">US$ 740 <span style="font-size:44px">mi</span></div>
      <div class="lead" style="font-size:24px;margin-top:12px;color:rgba(255,255,255,.75)">em financiamento</div>
    </div>
    <div style="width:1px;background:rgba(214,184,114,.55)"></div>
    <div style="flex:1;padding-left:40px">
      <div class="serif" style="font-size:86px;line-height:1;font-weight:400">18,5 mil <span style="font-size:44px">m²</span></div>
      <div class="lead" style="font-size:24px;margin-top:12px;color:rgba(255,255,255,.75)">de moda, gastronomia e experiências</div>
    </div>
  </div>
</div>
${foot()}`);

// 3 — AS GRIFES
const novas = ['Louis Vuitton', 'Celine', 'Tom Ford', 'Elie Saab', 'Messika'];
slides.push(`${bg('bh6-45.jpg', T.left)}
${head(3, 'As grifes')}
<div class="pad" style="top:250px">
  <div class="serif" style="font-size:96px;line-height:1;font-weight:300">Quem <span class="it">chega</span></div>
  <div class="lead" style="margin-top:14px;font-size:26px;color:rgba(255,255,255,.75)">à nova ala West Shops</div>
  <div style="margin-top:50px;width:600px">
    ${novas.map((n) => `<div class="serif" style="font-size:58px;line-height:1;padding:20px 0;border-bottom:1px solid rgba(214,184,114,.4)">${n}</div>`).join('')}
  </div>
  <div class="lead" style="margin-top:44px;font-size:26px;max-width:640px;color:rgba(255,255,255,.82)"><span style="color:#fff;font-weight:500">Saint Laurent, Bottega Veneta e Loro Piana</span>, que já estão no shopping, também ganham novos espaços.</div>
</div>
${foot()}`);

// 4 — GASTRONOMIA
slides.push(`${bg('bh1-45.jpg', T.full)}
${head(4, 'Gastronomia')}
<div class="pad" style="top:270px">
  <div class="label">Restaurantes</div>
  <div style="display:flex;align-items:baseline;gap:34px;margin-top:20px">
    <div class="serif" style="font-size:230px;line-height:.9;font-weight:300;color:rgba(255,255,255,.55)">5</div>
    <div class="it" style="font-size:60px">para</div>
    <div class="serif" style="font-size:230px;line-height:.9;font-weight:400;color:${GOLD}">10</div>
  </div>
  <div class="lead" style="margin-top:30px;max-width:760px">Com a expansão, o número de restaurantes <span style="color:#fff;font-weight:500">vai dobrar</span>.</div>
</div>
<div class="pad" style="bottom:210px;display:flex;border-top:1px solid rgba(214,184,114,.55);padding-top:40px">
  <div style="flex:1"><div class="label" style="color:${GOLD}">O retorno</div><div class="serif" style="font-size:62px;margin-top:12px">China Grill</div></div>
  <div style="width:1px;background:rgba(214,184,114,.55)"></div>
  <div style="flex:1;padding-left:40px"><div class="label" style="color:${GOLD}">A chegada</div><div class="serif" style="font-size:62px;margin-top:12px">Slim’s</div><div class="it" style="font-size:30px;color:rgba(255,255,255,.8)">de Stephen Starr</div></div>
</div>
${foot()}`);

// 5 — CRONOGRAMA
slides.push(`${bg('bh2-45.jpg', T.full)}
${head(5, 'Cronograma')}
<div class="pad" style="top:270px">
  <div class="serif" style="font-size:96px;line-height:1.02;font-weight:300">Inaugurações<br>graduais <span class="it">até 2028</span></div>
  <div class="lead" style="margin-top:34px;max-width:780px">Uma estratégia pensada para acompanhar as mudanças no consumo de luxo.</div>
</div>
<div class="pad" style="bottom:210px">
  <div class="hair" style="margin-bottom:34px"></div>
  <div class="label" style="color:${GOLD}">Minha leitura</div>
  <div class="it" style="font-size:50px;line-height:1.22;margin-top:18px;color:#fff">“Projetos desse porte reforçam o interesse pela região e mostram por que Miami segue no radar de quem investe em alto padrão.”</div>
</div>
${foot()}`);

// 6 — ASSINATURA
slides.push(`${bg('bh4-45.jpg', 'linear-gradient(180deg,rgba(52,62,75,.45) 0%,rgba(46,55,67,.78) 45%,rgba(42,50,61,.93) 100%)')}
${head(6, 'Vamos conversar')}
<div class="pad" style="top:250px;text-align:center">
  <div class="serif" style="font-size:88px;line-height:1.02;font-weight:300">Quer investir<br>em <span class="it">Miami?</span></div>
</div>
<div class="pad" style="top:560px;text-align:center">
  <div style="width:230px;height:230px;margin:0 auto;border-radius:50%;border:1.5px solid ${GOLD};padding:8px">
    <img src="${f('assets/perfil.jpg')}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block">
  </div>
  <div class="serif" style="font-size:60px;margin-top:28px;line-height:1">Rafael F. Simon</div>
  <div style="font-size:21px;font-weight:500;letter-spacing:2px;color:${GOLD};margin-top:14px">${HANDLE}</div>
  <div class="lead" style="font-size:23px;line-height:1.5;color:rgba(255,255,255,.78);margin:22px auto 0;max-width:700px">Investimentos seguros e planejados nos mercados imobiliários mais sólidos do Brasil e dos EUA.</div>
  <div style="display:flex;align-items:center;justify-content:center;gap:22px;margin-top:44px">
    <div class="hair"></div><div style="font-size:20px;font-weight:600;letter-spacing:6px;text-transform:uppercase">Fale comigo no direct</div><div class="hair"></div>
  </div>
</div>
<div class="src" style="position:absolute;left:0;right:0;bottom:64px;text-align:center">Conteúdo baseado em matéria da Forbes Life Brasil</div>`);

(async () => {
  const out = path.join(root, 'carrossel');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync(path.join(root, 'build'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  for (let i = 0; i < slides.length; i++) {
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${css}</style></head><body><div class="s">${slides[i]}</div></body></html>`;
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
