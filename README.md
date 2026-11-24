# APSAN Website Management

Painel administrativo próprio da APSAN, LDA, com acesso direto e sem ecrã de login.

## Acesso
O painel é servido pelo GitHub Pages deste repositório. Abra o endereço do Website-Management publicado pelo GitHub Pages.

## Funcionalidades
- Criar, editar e eliminar serviços;
- Criar, editar e eliminar notícias e artigos;
- Publicar vídeos públicos do YouTube;
- Marcar conteúdos como publicados ou rascunhos;
- Consultar os conteúdos existentes no repositório.

## Publicação
O painel não exige autenticação para ser aberto ou consultado. Para gravar alterações no repositório, é necessária uma autorização de escrita GitHub fornecida nas definições de publicação. O token fica apenas em `sessionStorage` nesta sessão do navegador e não é incluído no código nem no site oficial.

Para o token, utilizar um Fine-grained Personal Access Token limitado ao repositório `mateus-max/Website-Management`, com permissões de Contents: Read and write. Não partilhar o token. Como o painel é público e não tem login, qualquer pessoa pode abrir a interface; só deve ser fornecida autorização de publicação a pessoas de confiança.

## Integração com APSAN
O site https://apsanlda.com consulta os conteúdos publicados através do ficheiro `apsan-sync.js`.

Pastas:
- `content/services`: serviços;
- `content/posts`: notícias e artigos;
- `content/videos`: vídeos YouTube;
- `public/uploads`: imagens.

## Nota
O carregamento de imagens diretamente pelo painel será acrescentado numa próxima atualização. Por enquanto, os campos de imagem aceitam um URL público ou caminho de imagem já existente.
