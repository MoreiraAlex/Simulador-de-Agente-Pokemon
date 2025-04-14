import Mapa from "./mapa.js";
import Treinador from "./treinador.js";

class Simulacao {
  constructor(config) {
    this.canvas = config.canvas;
    this.contexto = config.contexto;
    this.cronometro = config.cronometro;
    this.treinadores = [];
    this.agentes = [];
    this.batalhas = [];

    this.celula = 50;
    this.frameRate = 30;
    this.frame = null;

    this.mapa = new Mapa(this.canvas, this.contexto, this.celula);
    config.treinadores.forEach((t) => {
      const treinador = new Treinador(
        t.id,
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
  }

  inciar() {
    this.agentes = [...this.treinadores, 1000];

    this.mapa.desenha();

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
    if (!globalThis.frameRate) {
      globalThis.frameRate = this.frameRate;
    }
    const now = performance.now();
    const delta = now - (this.lastTime || 0);
    const intervaloMinimo = 1000 / globalThis.frameRate;

    if (delta >= intervaloMinimo) {
      this.lastTime = now;

      this.contexto.reset();
      this.mapa.desenha();

      this.treinadores.forEach((t) => {
        if (t.id === 1000) {
          return;
        }
        t.desenha(this.contexto);
      });
      this.treinadores.forEach((t) => {
        if (t.id === 1000) {
          return;
        }
        t.acao(this.contexto, this.mapa, this.agentes);
      });

      // this.Manual();
    }

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
