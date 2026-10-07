# BelartGesso V3

Versão consolidada do site da BelartGesso para GitHub Pages.

## Estrutura
- `index.html` — página principal
- `portfolio.html` — portfólio completo
- `admin.html` — painel local para editar/exportar `data/site.json`
- `css/style.css` — design responsivo
- `js/app.js` — renderização, filtros, WhatsApp e SEO estruturado
- `data/site.json` — conteúdo editável
- `imagens/` — mantenha/copiar a pasta de imagens atual do repositório
- `robots.txt`, `sitemap.xml`, `manifest.webmanifest` — SEO/PWA

## Como publicar
1. Faça backup do repositório atual.
2. Substitua os arquivos do site pelos arquivos desta pasta.
3. **Mantenha a pasta `imagens/` atual**, incluindo as fotos e os favicons existentes.
4. Se a URL final do GitHub Pages for diferente de `https://belartgesso.github.io/BelartGesso/`, ajuste `sitemap.xml` e `robots.txt`.
5. Em Settings → Pages, publique a branch `main` e a pasta `/ (root)`.

## Como atualizar conteúdo
Abra `admin.html` no site publicado ou localmente. Edite o JSON, valide e baixe `site.json`. Substitua `data/site.json` no repositório.

## Observação
O painel é deliberadamente local: ele não contém token nem senha do GitHub. Para uma edição online com gravação automática no GitHub, será necessária uma integração autenticada.
