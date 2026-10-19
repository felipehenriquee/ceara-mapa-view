# Mapa do Ceará

Mapa SVG interativo dos municípios do Ceará, extraído do site **Jornal Ceará Hoje** para reuso em outros projetos. Sem dependência de backend — só HTML/CSS/JS puro.

## O que tem aqui

- **Mapa completo** dos 184 municípios, com hover individual em cada um.
- **Filtro por mesorregião** (Norte, Noroeste, Região Metropolitana de Fortaleza, Jaguaribe, Centro-Sul, Sul, Sertões), via os botões no topo.
- **Busca por município**, construída automaticamente a partir dos nomes já presentes no próprio SVG (não depende de banco de dados).

## Estrutura

```
index.html      → página com o mapa, o filtro de região e a busca
css/mapa.css    → estilos (cores das mesorregiões, layout, busca)
js/mapa.js      → lógica do filtro de região + montagem da busca
```

## Como usar

Abra `index.html` direto no navegador, ou sirva a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
# ou
php -S localhost:8000
```

## Reaproveitando em outro projeto

- Os links de cada município (`href="municipios/<slug>"`) apontam para rotas que não existem aqui — troque pelo padrão de rota do seu projeto, ou remova o `href` se não precisar de navegação.
- As cores de cada mesorregião ficam no objeto `REGIOES` em `js/mapa.js` — ajuste as cores (`st1`, `st11`, etc.) nas classes `.stXX` em `css/mapa.css`.
- Para usar sem o filtro/busca, basta copiar só o `<svg id="mapaTotal">...</svg>` de dentro do `index.html`.
