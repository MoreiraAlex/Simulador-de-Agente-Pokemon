import Mapa from "./mapa.js";
import Treinador from "./treinador.js";
import Pokemon from "./pokemon.js";
import { atualizaPosicaoNaMatriz } from "../utils/utils.js";

class Simulacao {
  constructor(config) {
    this.canvas = config.canvas;
    this.contexto = config.contexto;
    this.cronometro = config.cronometro;
    this.sequence = config.sequence;
    this.agentes = [];

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
      this.sequence,
    );

    config.treinadores.forEach((t) => {
      const pokemon = new Pokemon(
        this.sequence.next(),
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
        t.velocidade,
        t.resistencia,
        t.visao,
        t.estrategia,
        [pokemon],
        [pokemon],
        this.celula,
        algoritimo,
      );

      pokemon.treinador = treinador;
      this.agentes.push(treinador);
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

    this.agentes.forEach((treinador, idx) => {
      const x = this.mapa.base[idx].posX + this.mapa.base[idx].largura / 2;
      const y = this.mapa.base[idx].posY + this.mapa.base[idx].altura / 2;

      treinador.base = { x, y };
      treinador.posicao = { x, y };

      atualizaPosicaoNaMatriz(
        this.mapa.matriz,
        treinador.posicao,
        treinador.taamanho,
        treinador.id,
      );

      treinador.desenha(this.contexto);
    });
  }

  loop() {
    this.contexto.reset();
    this.mapa.desenha();

    if (this.cronometro.segundos % 30 === 0 && !this.invocou) {
      this.invocou = true;
      this.agentes.splice(
        0,
        this.agentes.length,
        ...this.agentes.filter(
          (a) => a.especie === "humana" || !a.estaDisponivel,
        ),
      );

      this.mapa.pokeBioma(this.celula, this.agentes);
      setTimeout(() => (this.invocou = false), 2000 / globalThis.multiplicador);
    }

    this.agentes.forEach((a) => {
      a.acao(this.contexto, this.mapa, this.agentes);
    });

    this.agentes.forEach((a) => {
      a.desenha(this.contexto);
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
    this.sequence.reset();
    console.clear();
  }
}

export default Simulacao;
