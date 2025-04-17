import Mapa from "./mapa.js";
import Treinador from "./treinador.js";
import Pokemon from "./pokemon.js";
import { pokedex } from "../models/pokedex.js";

class Simulacao {
  constructor(config) {
    this.canvas = config.canvas;
    this.contexto = config.contexto;
    this.cronometro = config.cronometro;
    this.treinadores = [];
    this.agentes = [];
    this.batalhas = [];

    this.celula = 50;
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
        t.equipe,
        t.pokemons,
        this.celula,
        algoritimo,
      );
      this.treinadores.push(treinador);
    });

    this.tecla = null;

    this.pokemons = [];
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
      const poke = pokedex.find((p) => p.especie === "Bulbasaur");
      const pokemon = new Pokemon(
        (Math.random() * (i + 1) * 1000).toFixed(0),
        "red",
        poke.especie,
        poke.hp,
        poke.tipos,
        poke.ataque,
        poke.defesa,
        1,
        0,
        1,
        this.celula,
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
