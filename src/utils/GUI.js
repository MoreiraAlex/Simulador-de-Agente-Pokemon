export function adcionaEvento(elemento, evento, callback) {
  elemento.addEventListener(evento, callback);
}

export function displayInput(evento, displayId) {
  const input = evento.target;
  const display = document.querySelector(displayId);

  display.value = input.value;
}

export function selecionaBotao(documento, botoes, botao) {
  const corAtiva = "bg-retro-primary";
  const corDesativa = "bg-retro-foreground";

  documento.querySelectorAll(botoes).forEach((b) => {
    b.ariaSelected = "false";
    b.classList.remove(corAtiva);
    b.classList.add(corDesativa);
  });

  botao.ariaSelected = "true";
  botao.classList.remove(corDesativa);
  botao.classList.add(corAtiva);
}
