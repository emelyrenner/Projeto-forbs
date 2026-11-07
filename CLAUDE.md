# Projeto: carrosséis de Instagram — Rafael F. Simon

Corretor de imóveis (Brasil e EUA, foco em Miami). Perfil: **@rafaelsimoncorretor**
(confirmado pelo usuário; usar sempre este @, não @rafa.broker1).
Frase de apresentação: "Investimentos seguros e planejados nos mercados imobiliários
mais sólidos do Brasil e dos EUA."

## Estilo aprovado (usar como padrão em todo carrossel novo)

Modelo pronto: `render.js` (versão aprovada no commit "véu de transparência em preto").
Para um carrossel novo, copie esse arquivo e troque só o conteúdo dos slides e as fotos.

**Formato**
- Slides 1080×1350 (4:5), exportados em 2× = 2160×2700 PNG, um arquivo por slide (`carrossel/slide-NN.png`).
- Gerados com Playwright: HTML → screenshot (`node render.js`).

**Fundo**
- Foto própria do usuário ocupando o slide inteiro (`object-fit: cover`), opacidade .92, `saturate(.85)`.
- Por cima, um **véu PRETO** (não azul, não cinza-azulado) em degradê, com opacidade .8, mais forte onde há texto:
  - `bottom` (texto na parte de baixo), `full` (texto em cima e embaixo), `left` (texto à esquerda, foto à direita).
- Faixas pretas suaves fixas no topo (260px) e no rodapé (240px) para o rótulo, a numeração e a assinatura.
- As fotos devem ficar bem aparentes. Não escurecer demais.

**Tipografia** (arquivos em `fonts/`)
- Títulos: **Cormorant Garamond** peso 500, grandes (88–132px), com **números alinhados** (`font-feature-settings: 'lnum'`).
- Destaque: a mesma serifa em *itálico dourado* (ex.: "*chega*", "*até 2028*", "*Miami?*").
- Textos e rótulos: **Montserrat**. Texto corrido 32px/500. Rótulos em CAIXA ALTA espaçada (19–22px, 600, letter-spacing 5–7px).
- Texto branco quase sólido (.9–.97) e sombra preta suave em todo o texto, para ficar legível sobre a foto.

**Cores**
- Dourado `#e6cb85`. Branco. Véus pretos. Nada de azul.

**Composição**
- Margens laterais de 100px. Visual limpo e elegante: sem ilustrações, quadros cheios ou botões pesados.
- Elementos gráficos só em filete dourado fino (1px): traço curto antes do rótulo, divisórias entre dados, linhas entre itens de lista.
- Topo de cada slide: traço dourado + rótulo da seção (ex.: "O PROJETO") à esquerda e numeração "02 — 06" à direita.
- Capa: título forte em serifa + subtítulo itálico dourado + uma linha de destaque em caixa alta.
- Dados em pares lado a lado, separados por um filete vertical dourado.
- Variar a composição entre os slides (texto embaixo, à esquerda, centralizado) mantendo a unidade visual.

**Assinatura**
- Slides comuns: no rodapé à esquerda, foto de perfil 50px em círculo com aro dourado fino + @. À direita, "FONTE: …" quando o conteúdo vier de terceiros.
- Último slide: foto de perfil em destaque (230px, aro dourado fino), nome "Rafael F. Simon", @, frase de apresentação e "FALE COMIGO NO DIRECT" entre filetes.
- Foto de perfil: `assets/perfil.jpg`. Recorte de cabeça e ombros, nunca alterar o rosto.

**Conteúdo**
- Manter a essência, os dados e a ordem da matéria original, sem inventar informação. Redação natural e direta.
- Citar a fonte discretamente (rodapé e legenda), por exemplo "Fonte: Forbes Life Brasil".
- Opinião do Rafael só em bloco marcado como "Minha leitura".
- Não reproduzir o layout nem as fotos do veículo original.
