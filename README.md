# HTML Semântico & Acessível

> Guia prático e auto-explicativo de HTML Semântico e Acessibilidade Web seguindo WCAG 2.2 AA.

🔗 **Página ao vivo:** https://semantica.benearagao.com.br/  
📚 **Glossário completo:** https://semantica.benearagao.com.br/glossario.html

## O que é

Este projeto é um modelo de referência aberto, voltado para devs front-end que querem aprofundar em acessibilidade — desde o básico de HTML semântico até a aplicação prática de critérios WCAG 2.2 nível AA. O próprio site é exemplo de si mesmo: implementa os critérios que documenta.

## O que cobre

- ✅ Hierarquia semântica de texto (headings, listas, citações, código, tempo)
- ✅ Mídia acessível (imagens descritivas, figcaption)
- ✅ Tabelas de dados com `<caption>`, `<thead>`, `scope`
- ✅ Formulários acessíveis (`<fieldset>`, `<legend>`, `<label>`, `autocomplete`, `aria-describedby`)
- ✅ Landmarks, skip link, indicador de foco de duas camadas
- ✅ Glossário completo de termos de HTML semântico e a11y
- ✅ Links curados para normas (WCAG, LBI, NBR 17225, eMAG) e ferramentas (Axe, WAVE, Lighthouse, NVDA)

## Como usar

Clone, forke, adapte ao seu projeto. As decisões estão documentadas em comentários inline no código — leia o `index.html` como se fosse um livro.

Se encontrar algo a melhorar, abra uma issue ou um PR. É assim que a gente cresce.

## Testes locais

A suíte fica em `tests/` (não vai para produção). Requer Node ≥ 22.

```bash
# 1. Servir o site na raiz do repositório
python3 -m http.server 4321 &

# 2. Rodar a suíte (validação HTML + teclado + axe-core)
cd tests && npm install
BASE_URL=http://localhost:4321/ npm test
```

Cobertura: `html-validate` (markup), navegação por teclado (WCAG 2.1.x / 2.4.x) e axe-core (WCAG 2.2 AA) nas duas páginas.

## Deploy

Hospedado na **Locaweb** via FTP, com publicação automática pelo GitHub Actions (`.github/workflows/deploy.yml`):

1. A cada push na `main`, roda o job **`audit`** (a suíte de testes acima).
2. Só se a auditoria passar, o job **`deploy`** sobe os arquivos por FTP para o subdomínio.

**Secrets necessários** (Settings → Secrets and variables → Actions):

- `FTP_USERNAME` — usuário FTP da Locaweb
- `FTP_PASSWORD` — senha FTP da Locaweb

O subdomínio `semantica.benearagao.com.br` precisa estar criado no painel da Locaweb apontando para a pasta `server-dir` configurada no workflow (`/public_html/semantica/`). Cache, gzip e HSTS são configurados via `.htaccess`. Cache busting do CSS via `style.css?v=YYYYMMDD`.

## Autor

Bené Aragão — Designer Sênior de Produto, certificado pelo W3Cx em Web Accessibility (WAI0.1x). [LinkedIn](https://linkedin.com/in/benearagao) · [Currículo](https://benearagao.com.br)

---

## Detalhes técnicos

Este projeto é um **guia prático e auto-explicativo** desenvolvido para ajudar UX/UI Designers e Desenvolvedores a implementarem acessibilidade real em seus projetos web.

Em vez de apenas listar regras, o conteúdo desta página explica sua própria estrutura técnica e a importância de cada escolha semântica.

## 🚀 Objetivos
- **Educação:** Ensinar acessibilidade através do exemplo.
- **Autoridade:** Demonstrar domínio das normas **WCAG 2.2 Nível AA**.
- **Praticidade:** Servir como um "Boilerplate" ou referência rápida para componentes comuns (tabelas, formulários, listas).

## 🛠️ Critérios WCAG 2.2 AA Implementados
Este template cobre diversos critérios fundamentais, incluindo os novos da versão 2.2:

- **[Novo] 2.5.8 Target Size (Minimum):** O mínimo AA é **24×24px**; o template aplica 44×44px em botões/links e 24×24px no checkbox.
- **[Novo] 2.4.11 Focus Not Obscured:** Indicador de foco de duas camadas (`outline` + `box-shadow`) com contraste ≥ 3:1 em qualquer fundo.
- **2.4.1 Bypass Blocks (Skip Links):** Link direto para o conteúdo principal para usuários de teclado.
- **1.3.1 Info and Relationships:** Uso rigoroso de tags semânticas (`<main>`, `<nav>`, `<header>`, `<table>`, etc).
- **1.4.10 Reflow:** Design responsivo que suporta zoom de até 400% sem perda de informação.
- **3.3.2 Labels or Instructions:** Campos com `<label>` associado, marcação de obrigatórios e atributo `required`.
- **3.3.1 Error Identification / 3.3.3 Error Suggestion:** Erros de formulário identificados em texto, com sugestão de correção (`aria-invalid` + `aria-describedby`).
- **4.1.3 Status Messages:** Confirmação de envio e resumo de erros anunciados por leitor de tela (`role="alert"` / `role="status"`).
- **2.3.3 Animation from Interactions:** Animações respeitam `prefers-reduced-motion`.

## 📂 Estrutura do Projeto
- `index.html`: Estrutura semântica documentada com comentários educativos.
- `glossario.html`: Glossário expandido de HTML semântico e acessibilidade, navegável por letra.
- `style.css`: Estilização focada em legibilidade, contraste e estados de foco.
- `script.js`: Validação de formulário acessível como *progressive enhancement* (a página funciona sem JS).

## 📖 Como Usar
1. **Clone o repositório.**
2. **Abra o `index.html` no seu navegador.**
3. **Leia o conteúdo da página:** O próprio texto explica as decisões técnicas.
4. **Inspecione o código:** Veja os comentários que citam os critérios da WCAG.

## 🤝 Contribuições
Sinta-se à vontade para sugerir melhorias ou novos componentes acessíveis. O objetivo é fortalecer a comunidade de design inclusivo!

---
Desenvolvido por um UX/UI Designer focado em criar uma web para todos. ♿🌐
