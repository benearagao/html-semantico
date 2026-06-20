# Validação de Acessibilidade — A11y Toolkit

> Relatório do teste **real** (não apenas revisão estática) das páginas `index.html`
> e `glossario.html`.
> Data: **20/06/2026** · Padrão alvo: **WCAG 2.2 Nível AA**

Este documento registra o que foi efetivamente testado, com que ferramentas e quais
resultados — para consulta futura e para deixar claro o que ainda depende de
verificação humana (leitor de tela).

---

## Resumo

| Camada de teste | Ferramenta | `index.html` | `glossario.html` |
|---|---|---|---|
| Automatizado (WCAG A/AA + best-practice) | axe-core em Chromium real (Playwright) | ✅ **0 violações**, 52 regras OK, 1 incompleto* | ✅ **0 violações**, 34 regras OK, 0 incompletos |
| Contraste de cor | Cálculo de luminância relativa (WCAG 2.x) | ✅ Todos os pares passam AA | ✅ Todos os pares passam AA |
| Teclado (ordem de Tab, foco visível, skip link) | Playwright (navegação real) | ✅ 22 elementos, foco visível em todos, sem armadilha | ✅ 17 elementos, foco visível em todos, sem armadilha |
| Reflow / zoom 400% | Viewport 320px | ✅ Sem scroll horizontal | ✅ Sem scroll horizontal |
| Validação de formulário | Playwright (submit + ARIA) | ✅ Erros acessíveis, foco no 1º inválido, status anunciado | — (sem formulário) |
| **Leitor de tela (VoiceOver/NVDA)** | — | ⚠️ **Pendente** — exige verificação humana | ⚠️ **Pendente** — exige verificação humana |

> \* O único "incompleto" do `index.html` é o `<span aria-hidden="true">→</span>`
> decorativo do link "Ver glossário completo": o axe não computa contraste de um
> elemento cujo conteúdo é só um caractere não-textual e o marca para revisão. Como
> a seta é decorativa (`aria-hidden`) e o link tem texto completo ao lado, **não é
> uma violação** — é um falso-positivo esperado.

---

## 1. Automatizado — axe-core em navegador renderizado

Rodado com `@axe-core/playwright` num **Chromium real** (não jsdom), com as tags
`wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`.

```
index.html      → Violações: 0 · Incompletos: 1 (color-contrast, ver nota) · Regras OK: 52
glossario.html  → Violações: 0 · Incompletos: 0                            · Regras OK: 34
```

O único incompleto no `index.html` é o seletor
`a[href$="glossario.html"] > span[aria-hidden="true"]` (a seta `→` decorativa do
link para o glossário completo). O motivo reportado pelo axe é *"Element content
contains only non-text characters"* — ele não roda contraste num elemento que só tem
símbolo. Sendo decorativa e marcada com `aria-hidden`, é um falso-positivo esperado,
não violação.

> Observação: numa passada em **jsdom** (sem renderização) aparecem "incompletos"
> extras — `color-contrast`, `landmark-one-main`, `page-has-heading-one` — por
> limitação do jsdom, que não computa layout/visibilidade. No Chromium real eles se
> resolvem (cada página tem um `<main>` e um `<h1>` únicos e o contraste é calculado).

### Revisão do uso de `<abbr title>` (20/06/2026)

Não é um achado de ferramenta (o axe não acusa isso), mas uma decisão editorial de
acessibilidade, registrada aqui para rastreabilidade:

- **Duplicação eliminada.** Sete verbetes do glossário tinham a expansão tanto no
  `title` do `<abbr>` quanto entre parênteses no texto visível (ex.: `<abbr
  title="Web Content Accessibility Guidelines">WCAG</abbr> (Web Content
  Accessibility Guidelines)`). Adotou-se o modelo de dicionário (**Caminho C**): o
  `<dt>` fica só com a sigla em `<abbr>` e a `<dd>` abre com "Sigla de …", de modo que
  a expansão é lida **uma vez**, visível a todos (inclusive teclado/baixa visão, que
  não recebem o tooltip do `title`).
- **Repetição reduzida no `index.html` (Caminho A).** O `<abbr title>` passou a marcar
  apenas a **primeira** ocorrência de cada sigla na ordem do documento — que cai no
  trecho que ensina o próprio elemento `<abbr>`. Demais menções usam a sigla pura.
- **Nuance técnica:** na configuração padrão, NVDA/JAWS/VoiceOver **não** anunciam o
  `title` do `<abbr>`; logo a duplicação audível real estava nos parênteses, não no
  `title`. A mudança é mais sobre limpeza de DOM/árvore de acessibilidade e clareza
  visual do que sobre eliminar fala repetida.

## 2. Contraste — calculado de verdade

Antes o contraste fora estimado "no papel"; aqui foi recalculado por luminância
relativa para cada par cor/fundo usado no CSS. **Todos os pares de texto passam
no mínimo AA (4.5:1)**, a maioria com folga:

| Par | Razão | Mín. |
|---|---|---|
| Texto do corpo (`#1a1a1a` / `#ffffff`) | 17,40:1 | 4,5 |
| Primary — links/h1 (`#005a9c` / `#ffffff`) | 7,14:1 | 4,5 |
| Código inline (`#8a1538` / `#f0f0f0`) | 8,21:1 | 4,5 |
| `<mark>` (`#1a1a1a` / `#fff3cd`) | 15,71:1 | 4,5 |
| Status de erro (`#b3261e` / `#fdeaea`) | 5,64:1 | 4,5 |
| Status de sucesso (`#1b5e20` / `#e6f4ea`) | 6,93:1 | 4,5 |
| Rodapé (`#ffffff` / `#333333`) | 12,63:1 | 4,5 |
| Descrição dos links de recursos (`#444444` / `#ffffff`) | 9,74:1 | 4,5 |

Pares **não-texto** novos da seção "Recursos" e do índice do glossário (mín. 3:1 —
critério 1.4.11):

| Par | Razão | Mín. (não-texto) |
|---|---|---|
| Borda dos cards / botões de letra (`#767676` / `#ffffff`) | 4,54:1 | 3,0 |

### Indicador de foco em duas camadas (2.4.7 / 2.4.11 / 2.4.13)

O cálculo **confirmou a necessidade** do design de duas camadas. O contorno laranja
sozinho **não** atinge 3:1 sobre branco, mas o halo escuro cobre esse caso — e o
laranja cobre o caso do botão azul. Sempre há uma camada ≥ 3:1 em qualquer fundo:

| Camada | Sobre | Razão | Mín. (não-texto) |
|---|---|---|---|
| Contorno laranja (`#ff8c00`) | branco | 2,33:1 ❌ | 3,0 |
| Halo preto 50% (`~#808080`) | branco | 3,95:1 ✅ | 3,0 |
| Contorno laranja (`#ff8c00`) | botão azul (`#005a9c`) | 3,06:1 ✅ | 3,0 |

## 3. Teclado

Navegação só por teclado (Tab/Shift+Tab/Enter), ordem real capturada pelo navegador.

**`index.html` — 22 elementos:**

1. Skip link
2–6. Nav: Texto · Mídia · Tabelas · Formulários · **Glossário**
7. Começar a Aprender (CTA)
8. Ver glossário completo (link inline)
9. Nome · 10. E-mail · 11. Newsletter · 12. Enviar Mensagem
13–17. Recursos — coluna "Normas": WCAG · WCAG pt-BR · LBI · NBR 17225 · eMAG
18–22. Recursos — coluna "Ferramentas": Axe · WAVE · Lighthouse · NVDA · Contrast Checker

A seção "Recursos" foi reposicionada ao fim do `<main>` (depois do formulário),
como "próximos passos". A ordem de Tab segue a leitura: termina a coluna esquerda
dos recursos antes de entrar na direita, como o critério 2.4.3 (Focus Order) espera.

**`glossario.html` — 17 elementos:**

1. Skip link · 2. ← Voltar para a página inicial · 3–17. Índice por letra (A…W)

Em ambas as páginas:

- **Foco visível em todos** os elementos interativos.
- Ordem de Tab **igual à ordem visual**.
- **Sem armadilha de teclado.**
- **Skip link funciona**: 1º Tab o revela (`href="#main-content"`) e `Enter` move o
  foco para `#main-content`.

## 4. Reflow / Zoom (1.4.10)

A 320px de largura (equivalente a zoom de ~400% numa tela de 1280px):

- **Sem scroll horizontal** em nenhuma das duas páginas.
- A tabela de dados usa `div.table-container` com **scroll próprio** — exceção
  explicitamente permitida pela 1.4.10 para conteúdo que requer layout 2D.
- A seção "Recursos" usa `grid-template-columns: repeat(auto-fit, minmax(min(300px,
  100%), 1fr))`: o `min(300px, 100%)` garante que o trilho não estoure viewports
  abaixo de 300px e empilha as colunas sem media query.

## 5. Formulário (3.3.1 / 3.3.3 / 4.1.3 / 2.4.3)

Submit com campos vazios:

```
invalidos: 2   (aria-invalid="true" aplicado)
status: [
  "Informe seu nome completo para continuar.",
  "Informe seu e-mail para continuar.",
  "2 campos precisam de atenção. Veja as mensagens destacadas."
]
foco: nome   (move para o 1º campo inválido)
```

E-mail malformado → sugestão de correção (3.3.3):
`"Verifique o formato do e-mail. Exemplo: nome@empresa.com.br"`

---

## ⚠️ O que ainda NÃO foi testado

**Leitor de tela real.** As estruturas que alimentam o leitor (roles, `aria-live`,
`aria-describedby`, `<label>`, `alt`, landmarks) foram verificadas, mas a **escuta**
— se os anúncios soam corretos e na ordem certa — exige uma pessoa. Faça a passada
manual antes de considerar 100% pronto:

- **macOS:** VoiceOver com `Cmd+F5`. Navegue por cabeçalhos (`VO+Cmd+H`), use o Rotor
  (`VO+U`) para landmarks, e teste o envio do formulário ouvindo os anúncios de erro.
- **Windows:** NVDA (`Ctrl+Alt+N`), `H` para cabeçalhos, `D` para landmarks,
  `NVDA+F7` para listar cabeçalhos.

---

## Como reproduzir

A bateria automatizada está empacotada na skill **`auditoria-a11y`**
(`~/.claude/skills/auditoria-a11y`):

```bash
# instala deps efêmeras + Chromium, depois:
node audit.mjs ./index.html
node audit.mjs ./glossario.html

# contraste avulso de um par de cores:
node contrast.mjs "#005a9c" "#ffffff"
```
