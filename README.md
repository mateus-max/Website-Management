# APSAN Website Management

Painel administrativo próprio da APSAN, LDA, com acesso direto e sem ecrã de login.

## Funcionalidades
- Dashboard com contagem de serviços, publicações e vídeos;
- Criar, editar, pesquisar e eliminar serviços;
- Criar, editar, pesquisar e eliminar notícias e artigos;
- Editor de texto simples com negrito, itálico, títulos e listas;
- Pré-visualização antes de publicar;
- Carregamento de imagens diretamente do telemóvel/computador (PNG, JPG, WEBP e GIF, até 8 MB);
- Adicionar vídeos públicos do YouTube com validação do link e pré-visualização;
- Marcar conteúdos como publicados ou rascunhos;
- Atualizar a lista de conteúdos a partir do repositório.

## Acesso e gravação
O painel não exige login para ser aberto ou consultado. Para gravar, editar, carregar imagens ou eliminar ficheiros no GitHub, é necessária uma autorização de escrita.

A autorização é fornecida em **Definições de publicação** e fica apenas no `sessionStorage` da sessão atual do navegador. Não é colocada no código nem enviada ao site oficial. Use um Fine-grained Personal Access Token limitado ao repositório `mateus-max/Website-Management`, com permissões de Contents: Read and write.

**Atenção:** como o painel é de acesso direto, qualquer pessoa pode abrir a interface. Não introduza nem deixe ativa a autorização de publicação num dispositivo partilhado ou não confiável.

## Integração com o site oficial
O site https://apsanlda.com consulta os conteúdos publicados através de `apsan-sync.js`.

Pastas:
- `content/services`: serviços;
- `content/posts`: notícias e artigos;
- `content/videos`: vídeos YouTube;
- `public/uploads`: imagens carregadas.

Depois de guardar no GitHub, o site apresenta os conteúdos marcados como publicados na próxima leitura da fonte, sujeito à atualização da cache do GitHub/CDN.

## Publicação do painel
O ficheiro `index.html` é a interface do painel. Para o abrir publicamente, o GitHub Pages deve estar ativado neste repositório e configurado para publicar a branch `main` a partir da raiz.
