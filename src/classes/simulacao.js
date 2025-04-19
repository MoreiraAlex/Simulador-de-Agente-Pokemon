import Mapa from "./mapa.js";
import Treinador from "./treinador.js";
import Pokemon from "./pokemon.js";
import { pokedex } from "../models/pokedex.js";

class Simulacao {
  constructor(config) {
    this.canvas = config.canvas;
    this.contexto = config.contexto;
    this.cronometro = config.cronometro;
    this.agentes = [];
    this.treinadores = [];
    this.pokemons = [];

    this.celula = 10;
    this.frame = null;
    this.multiplicador = config.multiplicador;

    this.mapa = new Mapa(
      this.canvas,
      this.contexto,
      this.celula,
      config.pathFinder,
    );

    const algoritimo = new config.pathFinder.AStarFinder({
      // allowDiagonal: true,
    });
    config.treinadores.forEach((t) => {
      const treinador = new Treinador(
        t.id,
        "white",
        t.velocidade,
        t.resistencia,
        t.visao,
        t.estrategia,
        [],
        [],
        this.celula,
        algoritimo,
      );

      treinador.equipe.push(
        new Pokemon(
          (Math.random() * 1000).toFixed(0),
          "red",
          this.celula,
          t.pokemon.especie,
          t.pokemon.tipos,
          t.pokemon.vida,
          t.pokemon.ataque,
          t.pokemon.defesa,
          t.pokemon.ataques,
          t.pokemon.evolucao,
          t.pokemon.incremento,
          0,
          1,
        ),
      );

      treinador.pokemons = [...treinador.equipe];
      this.treinadores.push(treinador);
    });
  }

  inciar() {
    if (!globalThis.frameRate) {
      globalThis.frameRate = this.frameRate;
    }

    if (!globalThis.multiplicador) {
      globalThis.multiplicador = this.multiplicador;
    }

    this.mapa.desenha();

    Array.from(Array(18)).forEach((_, i) => {
      const poke = pokedex[Math.floor(Math.random() * pokedex.length)];
      const pokemon = new Pokemon(
        (Math.random() * (i + 1) * 1000).toFixed(0),
        "red",
        this.celula,
        poke.especie,
        poke.tipos,
        poke.vida,
        poke.ataque,
        poke.defesa,
        poke.ataques,
        poke.evolucao,
        poke.incremento,
        0,
        1,
      );

      pokemon.posicao = {
        x:
          Math.floor(Math.random() * (this.canvas.width / this.celula)) *
          this.celula,
        y:
          Math.floor(Math.random() * (this.canvas.height / this.celula)) *
          this.celula,
      };

      this.mapa.matriz.nodes[Math.floor(pokemon.posicao.y / this.celula)][
        Math.floor(pokemon.posicao.x / this.celula)
      ].agente = pokemon.id;

      this.pokemons.push(pokemon);
    });

    this.agentes = [...this.treinadores, ...this.pokemons];

    this.treinadores.forEach((treinador, idx) => {
      const x = this.mapa.base[idx].posX + this.mapa.base[idx].largura / 2;
      const y = this.mapa.base[idx].posY + this.mapa.base[idx].altura / 2;

      treinador.base = { x, y };
      treinador.posicao = { x, y };
      this.mapa.matriz.nodes[y / this.celula][x / this.celula].agente =
        treinador.id;
      treinador.desenha(this.contexto);
    });
  }

  loop() {
    this.contexto.reset();
    this.mapa.desenha();

    this.agentes.forEach((agente) => {
      if (agente.especie === "humana") {
        return;
      }
      agente.desenha(this.contexto);
      this.mapa.matriz.nodes[Math.floor(agente.posicao.y / this.celula)][
        Math.floor(agente.posicao.x / this.celula)
      ].agente = agente.id;
    });

    this.treinadores.forEach((t) => {
      t.desenha(this.contexto);
    });
    this.treinadores.forEach((t) => {
      t.acao(this.contexto, this.mapa, this.agentes);
    });

    // eslint-disable-next-line no-undef
    this.frame = requestAnimationFrame(() => this.loop());
  }

  pausar() {
    if (this.frame) {
      // eslint-disable-next-line no-undef
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }

  parar() {
    this.pausar();
    this.contexto.reset();
    this.treinadores = null;
    console.clear();
  }
}

export default Simulacao;
