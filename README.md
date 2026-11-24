# APSAN Website Management

Este repositório é a base de conteúdos do painel administrativo próprio da **APSAN, LDA**.

## Objetivo
O painel administrativo será desenvolvido neste projeto. Não será utilizado Pages CMS nem outro serviço externo de gestão de conteúdos.

O painel próprio deverá permitir gerir:
- Serviços;
- Publicações, notícias e artigos;
- Vídeos públicos do YouTube;
- Imagens e conteúdos multimédia.

## Integração com o site oficial
O site https://apsanlda.com lê os conteúdos públicos deste repositório através do ficheiro `apsan-sync.js`.

Estrutura:
- `content/services`: serviços publicados;
- `content/posts`: notícias e artigos;
- `content/videos`: vídeos YouTube;
- `public/uploads`: imagens carregadas.

## Segurança
Não colocar tokens, passwords, chaves privadas ou credenciais de acesso no JavaScript público do site. A futura publicação pelo painel próprio deverá utilizar uma camada segura de autenticação no servidor ou uma aplicação GitHub autorizada.
