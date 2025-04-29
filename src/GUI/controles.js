import { adcionaEvento, selecionaBotao } from "../utils/GUI.js";
import {
  Iniciar,
  Multiplicador,
  Parar,
  Pausar,
} from "./gerenciadorSimulacao.js";

export function gerenciaControles() {
  const controles = document.querySelector(".controles");

  adcionaEvento(controles, "click", (evento) => {
    const btn = evento.target.closest("button");
    if (!btn) return;

    let valor = 1;
    switch (btn.id) {
      case "iniciar":
        IniciarControle(btn);
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
  if (listaTreinadores.every((lista) => lista.childElementCount < 0)) {
    // eslint-disable-next-line no-undef
    alert("Adicione pelo menos dois treinadores antes de iniciar a simulação!");
    return;
  }

  alternaBotao(botao);

  const btnParar = document.querySelector("#parar");
  btnParar.disabled = false;
  btnParar.style.opacity = "1";

  document.querySelectorAll(".config").forEach((elemento) => {
    elemento.disabled = true;
    elemento.style.opacity = "0.5";
  });
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
    btnAvancar.disabled = false;
    btnAvancar.style.opacity = "1";

    btnRetroceder.disabled = true;
    btnRetroceder.style.opacity = "0.5";
  } else if (valor >= 32) {
    btnAvancar.disabled = true;
    btnAvancar.style.opacity = "0.5";

    btnRetroceder.disabled = false;
    btnRetroceder.style.opacity = "1";
  } else {
    btnAvancar.disabled = false;
    btnAvancar.style.opacity = "1";

    btnRetroceder.disabled = false;
    btnRetroceder.style.opacity = "1";
  }

  return valor;
}

function PararControle(botao) {
  botao.disabled = true;
  botao.style.opacity = "0.5";

  const btnIniciar = document.querySelector("#iniciar");
  btnIniciar.dataset.estado = "rodando";
  alternaBotao(btnIniciar);

  document.querySelectorAll(".config").forEach((elemento) => {
    elemento.disabled = false;
    elemento.style.opacity = "1";
  });

  const btnRetroceder = document.querySelector("#retroceder");
  const btnAvancar = document.querySelector("#avancar");
  const multiplicador = document.querySelector("#multiplicador");

  btnAvancar.disabled = false;
  btnAvancar.style.opacity = "1";

  btnRetroceder.disabled = true;
  btnRetroceder.style.opacity = "0.5";

  multiplicador.textContent = "1";

  const div = document.querySelector(".limite");
  div.style.display = "none";

  const modo = document.querySelector("#modo-vitoria");
  const modoTotal = document.querySelectorAll(".modo-btn")[0];
  selecionaBotao(modo, ".modo-btn", modoTotal);

  window.modo.modo = modoTotal.value;
  window.modo.valor = 151;

  window.multiplicador = 1;

  const listaTreinadores = document.querySelectorAll(".treinadores-lista");
  listaTreinadores.forEach((lista) => {
    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }
  });

  window.agentes = [];
  window.sequence.reset();
}
