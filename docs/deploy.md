# Guia de deploy (para quem forka)

Este projeto publica sozinho via **GitHub Actions**: a cada push na `main`, uma
auditoria de acessibilidade roda e o site só vai ao ar **se ela passar**. O
workflow está em [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

> Você pode hospedar a sua versão em qualquer lugar. Abaixo estão as duas rotas
> mais simples. Ajuste o workflow ao seu provedor — nada aqui depende de uma
> hospedagem específica.

## O pipeline em duas etapas

1. **`audit`** — instala o Chromium e roda a suíte de `tests/` (validação de
   HTML + navegação por teclado + axe-core, WCAG 2.2 AA).
2. **`deploy`** — só executa se o `audit` passar e se não for um pull request.
   É aqui que os arquivos sobem para a sua hospedagem.

Pull requests rodam apenas o `audit` (sem publicar), funcionando como um
*quality gate* antes do merge.

## Opção 1 — GitHub Pages (mais simples, sem custo)

Não precisa de FTP nem secrets. Substitua o job `deploy` por uma publicação no
Pages (`actions/upload-pages-artifact` + `actions/deploy-pages`) e ative o Pages
em **Settings → Pages**. O site fica em `https://<usuario>.github.io/<repo>/`.

## Opção 2 — Hospedagem própria via FTP

Usada na versão de referência (Apache + `.htaccess`). Para replicar:

1. **Crie os secrets** em *Settings → Secrets and variables → Actions*:
   - `FTP_USERNAME` — usuário FTP da sua hospedagem
   - `FTP_PASSWORD` — senha FTP
2. **Ajuste o job `deploy`** no workflow com os seus dados:
   - `server` — host FTP da sua hospedagem
   - `server-dir` — pasta de destino no servidor (o *document root* do seu
     domínio ou subdomínio)
3. **Aponte o domínio** para essa pasta no painel da sua hospedagem.

O `server` e o `server-dir` ficam no próprio `deploy.yml` (não são secrets —
não há nada sensível neles). Apenas usuário e senha são secrets.

## Headers, cache e SSL

O [`.htaccess`](../.htaccess) (Apache) já configura redirect HTTPS, gzip, cache
de longa duração e headers de segurança (HSTS, `X-Content-Type-Options`, etc.).
Em outros servidores, replique essas regras na configuração equivalente.

O CSS usa *cache busting* via querystring (`style.css?v=AAAAMMDD`): atualize o
valor a cada mudança de estilo para forçar os navegadores a baixarem a versão
nova.

Se usar SSL gratuito (Let's Encrypt), lembre-se de habilitá-lo para o domínio no
painel da hospedagem — um domínio recém-criado pode levar alguns minutos até o
certificado ser emitido.
