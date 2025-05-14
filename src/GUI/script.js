import { gerenciaTreinador } from "./treinador.js";
import { gerenciaControles } from "./controles.js";
import { gerenciaModo } from "./modo.js";
import Sequence from "../classes/Sequence.js";
import Sujeito from "../classes/Observer/Sujeito.js";
import { PokemonDetalhes } from "./detalhesPokemon.js";

document.addEventListener("DOMContentLoaded", () => {
  window.lucide.createIcons();

  window.canvas = document.querySelector("#game-canvas");
  window.sequence = new Sequence();
  window.sujeito = new Sujeito();

  window.agentes = [];

  window.cronometro = {
    intervalo: null,
    texto: document.querySelector("#relogio"),
    segundos: 0,
    multiplicador: 1,
  };

  window.modo = {
    modo: "total",
    valor: 151,
  };

  gerenciaTreinador(4);
  PokemonDetalhes();
  gerenciaModo();
  gerenciaControles();
});
