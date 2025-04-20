import Mapa from "./mapa.js";
import Treinador from "./treinador.js";
import Pokemon from "./pokemon.js";

class Simulacao {
  constructor(config) {
    this.canvas = config.canvas;
    this.contexto = config.contexto;
    this.cronometro = config.cronometro;
    this.agentes = [];
    this.treinadores = [];
    this.pokemons = [];

    this.celula = 50;
    this.frame = null;
    this.multiplicador = config.multiplicador;

    const algoritimo = new config.pathFinder.AStarFinder({});

    this.mapa = new Mapa(
      this.canvas,
      this.contexto,
      this.celula,
      config.pathFinder,
      algoritimo,
    );

    config.treinadores.forEach((t) => {
      const pokemon = new Pokemon(
        (Math.random() * 1000).toFixed(0),
        "red",
        this.celula,
        t.pokemon.especie,
        algoritimo,
        t.pokemon.pokedex,
        t.pokemon.tipos,
        t.pokemon.vida,
        t.pokemon.ataque,
        t.pokemon.defesa,
        t.pokemon.ataques,
        t.pokemon.evolucao,
        t.pokemon.incremento,
        0,
        1,
        t.pokemon.estaAtivo,
      );

      const treinador = new Treinador(
        t.id,
        "white",
        t.velocidade,
        t.resistencia,
        t.visao,
        t.estrategia,
        [pokemon],
        [pokemon],
        this.celula,
        algoritimo,
      );

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
    this.mapa.pokeBioma(this.celula, this.pokemons);

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

      agente.acao(this.mapa);
    });

    this.treinadores.forEach((t) => {
      t.acao(this.contexto, this.mapa, this.agentes);
    });

    this.treinadores.forEach((t) => {
      t.desenha(this.contexto);
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
