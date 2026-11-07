// Gera os slides do carrossel (1080x1350) para @rafaelsimoncorretor
// Uso: node render.js   -> PNGs em ./carrossel
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const url = (p) => 'file://' + path.join(root, p);

const slides = [
  { img: 'build/crop1.jpg', pos: 'center top', big: true,
    text: 'Bal Harbour Shops abre nova ala de grifes com mais de 30 boutiques' },
  { img: 'build/crop2.jpg', pos: 'center center',
    text: 'Com US$ 740 milhões em financiamento, a expansão acrescenta cerca de 18,5 mil m² de lojas, gastronomia e experiências ao Bal Harbour Shops' },
  { img: 'build/crop3.jpg', pos: 'center top',
    text: 'A ala West Shops receberá marcas como Louis Vuitton, Celine, Tom Ford, Elie Saab e Messika. As inaugurações acontecerão gradualmente até 2028' },
  { img: 'build/crop4.jpg', pos: 'center center',
    text: 'Com a expansão, o número de restaurantes passará de cinco para dez. Entre as novidades estão o retorno do China Grill e a chegada do Slim’s, de Stephen Starr' },
  { img: 'build/crop1.jpg', pos: 'center 30%', cta: true },
];

const css = `
@font-face{font-family:'Playfair';src:url('${url('fonts/PlayfairDisplay-700.ttf')}');font-weight:700}
@font-face{font-family:'Playfair';src:url('${url('fonts/PlayfairDisplay-800.ttf')}');font-weight:800}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;background:#0b0b0c}
.s{position:relative;width:1080px;height:1350px;overflow:hidden;background:#0b0b0c;font-family:'Inter',sans-serif;color:#fff}
.photo{position:absolute;left:0;top:0;width:1080px;height:960px;object-fit:cover}
.fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,12,0) 0%,rgba(11,11,12,0) 34%,rgba(11,11,12,.7) 50%,rgba(11,11,12,.94) 62%,#0b0b0c 72%)}
.count{position:absolute;top:44px;right:48px;background:rgba(20,20,22,.6);backdrop-filter:blur(6px);color:#fff;font-size:30px;font-weight:500;padding:12px 24px;border-radius:40px;letter-spacing:.5px}
.txt{position:absolute;left:80px;right:80px;bottom:250px;font-size:56px;line-height:1.2;font-weight:400;letter-spacing:-.3px}
.txt.big{font-size:80px;line-height:1.08;font-weight:700;letter-spacing:-1.5px}
.foot{position:absolute;left:80px;right:80px;bottom:90px;display:flex;align-items:flex-end;justify-content:space-between}
.tag{display:flex;flex-direction:column;gap:12px}
.tag .t{border-left:4px solid #c9a24b;padding-left:16px;font-size:32px;font-weight:500;letter-spacing:2px;line-height:1}
.tag .src{font-size:22px;color:rgba(255,255,255,.6);letter-spacing:.3px}
.brand{text-align:right}
.brand .n{font-family:'Playfair';font-weight:800;font-size:66px;line-height:1;letter-spacing:-.5px}
.brand .r{font-size:19px;letter-spacing:7px;color:#c9a24b;font-weight:500;margin-top:10px;text-transform:uppercase}
.cta .photo{height:1350px;filter:brightness(.42) saturate(.8)}
.cta .fade{background:linear-gradient(180deg,rgba(11,11,12,.35) 0%,rgba(11,11,12,.75) 45%,#0b0b0c 80%)}
.cta .box{position:absolute;left:80px;right:80px;top:300px}
.cta .k{color:#c9a24b;font-size:28px;letter-spacing:6px;font-weight:600;text-transform:uppercase;margin-bottom:36px}
.cta h1{font-family:'Playfair';font-weight:700;font-size:78px;line-height:1.1;letter-spacing:-.5px;margin-bottom:40px}
.cta p{font-size:40px;line-height:1.35;color:rgba(255,255,255,.85);margin-bottom:56px}
.cta .btn{display:inline-block;border:2px solid #c9a24b;color:#fff;font-size:36px;font-weight:600;padding:22px 40px;border-radius:60px}
`;

function slideHtml(s, i, n) {
  const foot = `<div class="foot"><div class="tag"><div class="t">LIFESTYLE · MIAMI</div><div class="src">Fonte: Forbes Life Brasil</div></div>
    <div class="brand"><div class="n">Rafael Simon</div><div class="r">Corretor de Imóveis</div></div></div>`;
  const count = i === 0 ? '' : `<div class="count">${i + 1}/${n}</div>`;
  if (s.cta) {
    return `<div class="s cta"><img class="photo" src="${url(s.img)}" style="object-position:${s.pos}"><div class="fade"></div>${count}
      <div class="box"><div class="k">Mercado de luxo</div>
      <h1>Miami segue atraindo grandes investimentos.</h1>
      <p>Quer entender como aproveitar as oportunidades do mercado imobiliário de alto padrão?</p>
      <div class="btn">Fale comigo no direct →</div></div>${foot}</div>`;
  }
  return `<div class="s"><img class="photo" src="${url(s.img)}" style="object-position:${s.pos}"><div class="fade"></div>${count}
    <div class="txt${s.big ? ' big' : ''}">${s.text}</div>${foot}</div>`;
}

(async () => {
  fs.mkdirSync(path.join(root, 'carrossel'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (let i = 0; i < slides.length; i++) {
    const htmlFile = path.join(root, 'build', `slide-${i + 1}.html`);
    fs.writeFileSync(htmlFile, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${slideHtml(slides[i], i, slides.length)}</body></html>`);
    await page.goto('file://' + htmlFile, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(root, 'carrossel', `slide-${i + 1}.png`);
    await page.screenshot({ path: out });
    console.log(out);
  }
  await browser.close();
})();
