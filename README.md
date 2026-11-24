# Website-Management — Gestor próprio da APSAN, LDA

Este repositório será a aplicação administrativa própria da APSAN, LDA. Não utiliza Pages CMS nem outro CMS externo.

## Objetivo
Gerir, num único painel próprio:
- Publicações e notícias;
- Vídeos públicos do YouTube;
- Imagens e conteúdos multimédia;
- Conteúdos publicados no site oficial https://apsanlda.com.

## Integração com o site oficial
O ficheiro `apsan-sync.js` é o leitor público de conteúdos. O site oficial APSAN carrega os conteúdos publicados nas pastas:
- `content/posts/`
- `content/videos/`
- `public/uploads/`

O painel próprio deverá gravar os conteúdos nestas pastas no repositório, com o campo `published: true` para os conteúdos que devem aparecer no site. Para ocultar um conteúdo, usar `published: false` ou removê-lo.

## Segurança e publicação
Não colocar tokens pessoais do GitHub no JavaScript do navegador. A autenticação e a escrita no repositório deverão ser feitas por um mecanismo seguro no servidor ou por OAuth com backend apropriado.

## Repositórios
- Gestor próprio: https://github.com/mateus-max/Website-Management
- Site oficial: https://github.com/apsanlda1-ctrl/APSAN-LDA
- Site publicado: https://apsanlda.com
