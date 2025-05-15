import { adcionaEvento, selecionaBotao } from "../utils/GUI.js";
import {
  Iniciar,
  Multiplicador,
  Parar,
  Pausar,
} from "./gerenciadorSimulacao.js";

export function gerenciaControles() {
  const toggleDebug = document.querySelector("#toggle");
  const controles = document.querySelector(".controles");

  adcionaEvento(controles, "click", (evento) => {
    const toggle = evento.target.closest('input[type="checkbox"]');
    if (toggle) {
      window.debug = toggleDebug.checked;
    }

    const btn = evento.target.closest("button");
    if (!btn) return;

    let valor = 1;
    switch (btn.id) {
      case "iniciar":
        if (!IniciarControle(btn)) return;
        if (window.cronometro.intervalo === null) Iniciar();
        else Pausar();
        break;

      case "retroceder":
        valor = multiplicadorControle(btn);
        Multiplicador(valor);
        break;

      case "avancar":
        valor = multiplicadorControle(btn);
        Multiplicador(valor);
        break;

      case "parar":
        PararControle(btn);
        Parar();
        break;
    }
  });
}

function IniciarControle(botao) {
  const listaTreinadores = Array.from(
    document.querySelectorAll(".treinadores-lista"),
  );
  if (listaTreinadores.some((lista) => lista.childElementCount < 1)) {
    // eslint-disable-next-line no-undef
    alert("Adicione pelo menos dois treinadores antes de iniciar a simulação!");
    return false;
  }

  alternaBotao(botao);

  const btnParar = document.querySelector("#parar");
  habilitaElemento(btnParar);

  document.querySelectorAll(".config").forEach((elemento) => {
    desabilitaElemento(elemento);
  });

  return true;
}

function alternaBotao(botao) {
  const wrapper = botao;
  const svg = wrapper.querySelector("svg");

  if (svg) svg.remove();

  const novoIcone = document.createElement("i");
  const estaTocando = wrapper.dataset.estado === "rodando";

  novoIcone.setAttribute(
    "data-lucide",
    estaTocando ? "circle-play" : "pause-circle",
  );
  novoIcone.className = "w-5 h-5 rotate-180";

  wrapper.dataset.estado = estaTocando ? "pausado" : "rodando";
  wrapper.appendChild(novoIcone);

  window.lucide.createIcons();
}

function multiplicadorControle(btn) {
  const btnRetroceder = document.querySelector("#retroceder");
  const btnAvancar = document.querySelector("#avancar");
  const multiplicador = document.querySelector("#multiplicador");

  const direcao = btn.id;
  let valor = Number(multiplicador.textContent);

  if (direcao === "retroceder" && valor > 1) valor /= 2;
  else if (direcao === "avancar" && valor < 32) valor *= 2;

  multiplicador.textContent = valor;

  if (valor <= 1) {
    habilitaElemento(btnAvancar);
    desabilitaElemento(btnRetroceder);
  } else if (valor >= 32) {
    habilitaElemento(btnRetroceder);
    desabilitaElemento(btnAvancar);
  } else {
    habilitaElemento(btnAvancar);
    habilitaElemento(btnRetroceder);
  }

  return valor;
}

function PararControle(botao) {
  desabilitaElemento(botao);

  const btnIniciar = document.querySelector("#iniciar");
  btnIniciar.dataset.estado = "rodando";
  alternaBotao(btnIniciar);

  document.querySelectorAll(".config").forEach((elemento) => {
    habilitaElemento(elemento);
  });

  const btnRetroceder = document.querySelector("#retroceder");
  const btnAvancar = document.querySelector("#avancar");
  const multiplicador = document.querySelector("#multiplicador");

  habilitaElemento(btnAvancar);
  desabilitaElemento(btnRetroceder);

  multiplicador.textContent = "1";

  const div = document.querySelector(".limite");
  div.classList.add("hidden");
  div.classList.remove("flex");

  const modo = document.querySelector("#modo-vitoria");
  const modoTotal = document.querySelectorAll(".modo-btn")[0];
  selecionaBotao(modo, ".modo-btn", modoTotal);

  const listaTreinadores = document.querySelectorAll(".treinadores-lista");
  listaTreinadores.forEach((lista) => {
    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }
  });
}

function habilitaElemento(elemento) {
  elemento.disabled = false;
  elemento.classList.remove("opacity-50");
  elemento.classList.remove("cursor-not-allowed");
  elemento.classList.add("cursor-pointer");
}

function desabilitaElemento(elemento) {
  elemento.disabled = true;
  elemento.classList.remove("cursor-pointer");
  elemento.classList.add("cursor-not-allowed");
  elemento.classList.add("opacity-50");
}
