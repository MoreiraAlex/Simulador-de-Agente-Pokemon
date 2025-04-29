import { adcionaEvento, displayInput, selecionaBotao } from "../utils/GUI.js";

export function gerenciaModo() {
  const div = document.querySelector("#modo-vitoria");
  const modo = window.modo;

  adcionaEvento(div, "input", (evento) => displayInput(evento, "#display"));
  adcionaEvento(div, "change", (evento) => atualizaValor(evento, modo));
  adcionaEvento(div, "click", (evento) => selecionaModo(evento, div, modo));
}

function atualizaValor(evento, modo) {
  const input = evento.target.closest("input");
  if (!input) return;

  modo.valor = Number(evento.target.value);
}

function selecionaModo(evento, divModo, modo) {
  const btn = evento.target.closest("button");
  if (!btn) return;

  selecionaBotao(divModo, ".modo-btn", btn);

  const div = document.querySelector(".limite");
  const label = div.querySelector("label");
  const input = div.querySelector("input[type='range']");
  const display = div.querySelector("input[type='text']");
  const unidade = div.querySelector("span");

  div.style.display = "block";

  if (btn.value === "tempo") {
    label.textContent = "Limite de tempo:";
    input.setAttribute("min", 1);
    input.setAttribute("max", 10);
    input.value = 1;
    display.value = 1;
    unidade.textContent = "minutos";
  } else if (btn.value === "captura") {
    label.textContent = "Limite de captura:";
    input.setAttribute("min", 10);
    input.setAttribute("max", 151);
    input.value = 10;
    display.value = 10;
    unidade.textContent = "pokemon";
  } else {
    div.style.display = "none";
    input.value = 151;
  }

  modo.modo = btn.value;
  modo.valor = Number(input.value);
}
