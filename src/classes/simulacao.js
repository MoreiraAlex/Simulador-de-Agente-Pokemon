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

    this.celula = 20;
    this.frame = null;
    this.multiplicador = config.multiplicador;

    this.mapa = new Mapa(this.canvas, this.contexto, this.celula, config.PF);
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

    Array.from(Array(2)).forEach((_, i) => {
      const poke = pokedex.find((p) => p.especie === "Bulbasaur");
      const pokemon = new Pokemon(
        (Math.random() * (i + 1) * 1000).toFixed(0),
        "red",
        poke.especie,
        poke.vida,
        poke.tipos,
        poke.ataque,
        poke.defesa,
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

      this.mapa.matriz[Math.floor(pokemon.posicao.y / this.celula)][
        Math.floor(pokemon.posicao.x / this.celula)
      ] = pokemon.id;

      this.pokemons.push(pokemon);
    });
    this.agentes = [...this.treinadores, ...this.pokemons];

    this.treinadores.forEach((treinador, idx) => {
      if (treinador.id === 1000) {
        return;
      }
      const x = this.mapa.base[idx].posX + this.mapa.base[idx].largura / 2;
      const y = this.mapa.base[idx].posY + this.mapa.base[idx].altura / 2;

      treinador.base = { x, y };
      treinador.posicao = { x, y };
      this.mapa.matriz[y / this.celula][x / this.celula] = treinador.id;

      treinador.desenha(this.contexto);
    });

    // this.treinadorManual = new Treinador(1000, 1, 1, 2, [], [], this.celula);
    // this.treinadorManual.posicao = { x: 1000, y: 1000 };

    // this.mapa.matriz[this.treinadorManual.posicao.y / this.celula][
    //   this.treinadorManual.posicao.x / this.celula
    // ] = this.treinadorManual.id;
    // this.treinadorManual.desenha(this.contexto);

    // this.treinadores.push(this.treinadorManual);

    // let saida = "";
    // for (let i = 0; i < this.mapa.matriz.length; i++) {
    //   saida += `${this.mapa.matriz[i]} \n`;
    // }

    // console.log(saida);
  }

  loop() {
    this.contexto.reset();
    this.mapa.desenha();

    this.agentes.forEach((agente) => {
      if (agente.especie === "humana") {
        return;
      }
      agente.desenha(this.contexto);
      this.mapa.matriz[Math.floor(agente.posicao.y / this.celula)][
        Math.floor(agente.posicao.x / this.celula)
      ] = agente.id;
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

  Manual() {
    this.mapa.matriz[this.treinadorManual.posicao.y / this.celula][
      this.treinadorManual.posicao.x / this.celula
    ] = 0;
    this.treinadorManual.TreinadorManualmente(
      this.tecla,
      this.celula,
      this.mapa.matriz,
    );
    this.mapa.matriz[this.treinadorManual.posicao.y / this.celula][
      this.treinadorManual.posicao.x / this.celula
    ] = this.treinadorManual.id;
    this.treinadorManual.desenha(this.contexto);
    this.estaDisponivel = true;
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
