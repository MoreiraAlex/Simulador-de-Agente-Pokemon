import { gerenciaTreinador } from "./treinador.js";
import { gerenciaControles } from "./controles.js";
import { gerenciaModo } from "./modo.js";
import Sequence from "../classes/sequence.js";
import Sujeito from "../classes/Observer/Sujeito.js";

document.addEventListener("DOMContentLoaded", () => {
  window.lucide.createIcons();

  window.canvas = document.querySelector("#game-canvas");
  window.sequence = new Sequence();
  window.sujeito = new Sujeito();
  // window.simulacao = new Simulacao();
  window.agentes = [];
  window.multiplicador = 1;

  window.cronometro = {
    intervalo: null,
    texto: document.querySelector("#relogio"),
    segundos: 0,
  };

  window.modo = {
    modo: "total",
    valor: 151,
  };

  gerenciaTreinador(4);
  gerenciaControles();
  gerenciaModo();
});
