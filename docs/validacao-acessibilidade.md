# Validação de Acessibilidade — A11y Toolkit

> Relatório do teste **real** (não apenas revisão estática) da página `index.html`.
> Data: **16/06/2026** · Padrão alvo: **WCAG 2.2 Nível AA**

Este documento registra o que foi efetivamente testado, com que ferramentas e quais
resultados — para consulta futura e para deixar claro o que ainda depende de
verificação humana (leitor de tela).

---

## Resumo

| Camada de teste | Ferramenta | Resultado |
|---|---|---|
| Automatizado (WCAG A/AA + best-practice) | axe-core em Chromium real (Playwright) | ✅ **0 violações**, 52 regras OK, 0 incompletos |
| Contraste de cor | Cálculo de luminância relativa (WCAG 2.x) | ✅ **22/22 pares de texto passam** |
| Teclado (ordem de Tab, foco visível, skip link) | Playwright (navegação real) | ✅ 10 elementos, foco visível em todos, sem armadilha |
| Reflow / zoom 400% | Viewport 320px | ✅ Sem scroll horizontal na página |
| Validação de formulário | Playwright (submit + ARIA) | ✅ Erros acessíveis, foco no 1º inválido, status anunciado |
| **Leitor de tela (VoiceOver/NVDA)** | — | ⚠️ **Pendente** — exige verificação humana |

---

## 1. Automatizado — axe-core em navegador renderizado

Rodado com `@axe-core/playwright` num **Chromium real** (não jsdom), com as tags
`wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`.

```
Violações: 0
Incompletos: nenhum
Regras OK: 52
```

> Observação: numa primeira passada em **jsdom** (sem renderização) apareciam 3
> "incompletos" — `color-contrast`, `landmark-one-main` e `page-has-heading-one`.
> Isso era limitação do jsdom, que não computa layout/visibilidade. No Chromium real
> os três se resolvem (a página tem um `<main>` e um `<h1>` únicos, e o contraste é
> calculado corretamente).

## 2. Contraste — calculado de verdade

Antes o contraste fora estimado "no papel"; aqui foi recalculado por luminância
relativa para cada par cor/fundo usado no CSS. **Todos os 22 pares de texto passam
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

Navegação só por teclado (Tab/Shift+Tab/Enter), ordem real capturada pelo navegador:

1. Pular para o conteúdo principal (skip link)
2. Texto · 3. Mídia · 4. Tabelas · 5. Formulários (nav)
6. Começar a Aprender (CTA)
7. Nome · 8. E-mail · 9. Newsletter · 10. Enviar Mensagem

- **Foco visível em todos os 10** elementos interativos.
- Ordem de Tab **igual à ordem visual**.
- **Sem armadilha de teclado.**
- **Skip link funciona**: 1º Tab o revela (`href="#main-content"`) e `Enter` move o
  foco para `#main-content`.

## 4. Reflow / Zoom (1.4.10)

A 320px de largura (equivalente a zoom de ~400% numa tela de 1280px):

- **Sem scroll horizontal** no documento.
- A tabela de dados usa `div.table-container` com **scroll próprio** — exceção
  explicitamente permitida pela 1.4.10 para conteúdo que requer layout 2D.

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

# contraste avulso de um par de cores:
node contrast.mjs "#005a9c" "#ffffff"
```
