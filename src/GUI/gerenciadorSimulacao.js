import AgenteFactory from "../classes/agentes/AgenteFactory.js";
import Simulacao from "../classes/Simulacao.js";
import { base } from "../models/mapa.js";
import {
  iniciarCronometro,
  pararCronometro,
  pausarCronometro,
} from "./cronometro.js";
import { pokemonCanvas } from "./detalhesPokemon.js";

export function Iniciar() {
  if (!window.simulacao) {
    window.simulacao = new Simulacao(
      window.canvas,
      window.sequence,
      window.agentes,
      window.cronometro,
      window.PF,
    );

    window.agentes.forEach((agente) => {
      if (agente.getEspecie() !== "Treinador") return;

      const pokemon = agente.getPokemons()[0];

      agente.setEquipe([]);
      agente.setPokemons([]);

      InstanciaPokemon(pokemon, agente);
    });
  }
  iniciarCronometro();
  pokemonCanvas();
  window.simulacao.iniciar();
}

export function Pausar() {
  pausarCronometro();
  window.simulacao.pausar();
}

export function Parar() {
  pararCronometro();
  window.simulacao.parar();
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

  window.multiplicador = 1;

  window.simulacao = null;

  window.agentes = [];
  window.sequence.reset();

  window.sujeito.resetarObservadores();

  base.forEach((b) => {
    b.treinador = null;
  });
}

export function Multiplicador(valor) {
  window.cronometro.multiplicador = valor;
  if (!window.cronometro.intervalo) return;

  pausarCronometro();
  iniciarCronometro();
}

function InstanciaPokemon(poke, treinador) {
  const pokemon = AgenteFactory.criarAgente("pokemon", {
    id: window.sequence.next(),
    especie: poke.especie,
    tamanho: treinador.getTamanho(),
    pokedex: poke.pokedex,
    tipos: poke.tipos,
    vida: poke.vida,
    ataque: poke.ataque,
    defesa: poke.defesa,
    ataques: poke.ataques,
    evolucao: poke.evolucao,
    incremento: poke.incremento,
    experiencia: 0,
    nivel: 1,
    estaAtivo: poke.estaAtivo,
    treinador,
  });

  treinador.setEquipe([pokemon]);
  treinador.setPokemons([pokemon]);
}
