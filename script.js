/* ============================================================================
   VALIDAÇÃO DE FORMULÁRIO ACESSÍVEL
   ----------------------------------------------------------------------------
   Este arquivo demonstra como validar um formulário cobrindo critérios da
   WCAG 2.2:

     • 3.3.1 Error Identification (A)  — o erro é identificado em TEXTO e
       associado ao campo via aria-describedby + aria-invalid.
     • 3.3.3 Error Suggestion (AA)     — além de avisar, sugerimos como corrigir.
     • 4.1.3 Status Messages (AA)      — mensagens anunciadas por leitor de tela
       sem mover o foco, usando role="alert" e role="status"/aria-live.
     • 2.4.3 Focus Order (A)           — o foco vai para o primeiro campo inválido.

   É um "progressive enhancement": se este script não carregar, o atributo
   `novalidate` deixa de fazer efeito (ele só importa quando há JS) e o
   navegador volta a usar sua própria validação nativa baseada em `required`
   e `type="email"`.
   ========================================================================== */

(function () {
  "use strict";

  const form = document.querySelector(".accessible-form");
  if (!form) return;

  const statusRegion = document.getElementById("form-status");

  /*
    Mensagens de erro com SUGESTÃO de correção (WCAG 3.3.3).
    - "valueMissing": campo obrigatório vazio.
    - "typeMismatch": valor não corresponde ao type (ex.: e-mail malformado).
    Usamos a Constraint Validation API (campo.validity) em vez de escrever
    nossas próprias expressões regulares — é mais robusto e padronizado.
  */
  const mensagens = {
    nome: {
      valueMissing: "Informe seu nome completo para continuar.",
    },
    email: {
      valueMissing: "Informe seu e-mail para continuar.",
      typeMismatch: "Verifique o formato do e-mail. Exemplo: nome@empresa.com.br",
    },
  };

  /* Retorna a mensagem adequada para o estado de validade do campo. */
  function mensagemPara(campo) {
    const regras = mensagens[campo.name] || {};
    const validity = campo.validity;

    if (validity.valueMissing && regras.valueMissing) return regras.valueMissing;
    if (validity.typeMismatch && regras.typeMismatch) return regras.typeMismatch;

    // Fallback: usa a mensagem do próprio navegador (já localizada).
    return campo.validationMessage;
  }

  /* Marca um campo como inválido: exibe o erro e atualiza o ARIA. */
  function mostrarErro(campo) {
    const erroEl = document.getElementById(campo.id + "-error");
    if (erroEl) erroEl.textContent = mensagemPara(campo);

    // aria-invalid avisa a tecnologia assistiva que o valor atual é inválido.
    campo.setAttribute("aria-invalid", "true");
  }

  /* Limpa o estado de erro de um campo. */
  function limparErro(campo) {
    const erroEl = document.getElementById(campo.id + "-error");
    if (erroEl) erroEl.textContent = "";

    // Removemos o atributo em vez de definir "false" para não anunciar
    // "inválido: não" em alguns leitores de tela.
    campo.removeAttribute("aria-invalid");
  }

  const campos = Array.from(form.querySelectorAll("input[required]"));

  /*
    Valida ao SAIR do campo (evento "blur"), nunca durante a digitação:
    avisar a cada tecla é hostil e dispara mudanças de contexto indesejadas.
  */
  campos.forEach(function (campo) {
    campo.addEventListener("blur", function () {
      if (campo.checkValidity()) {
        limparErro(campo);
      } else {
        mostrarErro(campo);
      }
    });

    // Assim que o usuário começa a corrigir, removemos o erro para dar feedback
    // imediato e positivo (e evitar "barulho" no leitor de tela).
    campo.addEventListener("input", function () {
      if (campo.getAttribute("aria-invalid") === "true" && campo.checkValidity()) {
        limparErro(campo);
      }
    });
  });

  /*
    No envio: validamos todos os campos. Se houver erro, impedimos o submit,
    movemos o foco para o PRIMEIRO campo inválido (WCAG 2.4.3) e resumimos a
    quantidade de erros na região de status.
  */
  form.addEventListener("submit", function (evento) {
    let primeiroInvalido = null;

    campos.forEach(function (campo) {
      if (campo.checkValidity()) {
        limparErro(campo);
      } else {
        mostrarErro(campo);
        if (!primeiroInvalido) primeiroInvalido = campo;
      }
    });

    if (primeiroInvalido) {
      evento.preventDefault();

      const total = campos.filter(function (c) {
        return c.getAttribute("aria-invalid") === "true";
      }).length;

      if (statusRegion) {
        statusRegion.classList.remove("is-success");
        statusRegion.classList.add("is-error");
        statusRegion.textContent =
          total === 1
            ? "1 campo precisa de atenção. Veja a mensagem destacada."
            : total + " campos precisam de atenção. Veja as mensagens destacadas.";
      }

      primeiroInvalido.focus();
      return;
    }

    /*
      Demonstração: como não há servidor, evitamos o envio real e apenas
      confirmamos o sucesso. Numa aplicação real, aqui o formulário seria
      enviado (fetch/submit) e a mensagem confirmaria o resultado.
    */
    evento.preventDefault();

    if (statusRegion) {
      statusRegion.classList.remove("is-error");
      statusRegion.classList.add("is-success");
      statusRegion.textContent =
        "Formulário enviado com sucesso! Obrigado pelo contato.";
    }

    form.reset();
  });
})();
