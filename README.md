# A11y Toolkit: Modelo HTML Semântico & Acessível (WCAG 2.2 AA)

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
