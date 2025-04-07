import Mapa from "./mapa.js";
import Treinador from "./treinador.js";

class Simulacao {
  constructor(config) {
    this.canvas = config.canvas;
    this.contexto = config.contexto;
    this.cronometro = config.cronometro;
    this.frame = null;
    this.treinadores = [];

    this.celula = 20;

    this.mapa = new Mapa(this.canvas, this.contexto, this.celula);
    config.treinadores.forEach((t) => {
      const treinador = new Treinador(
        t.id,
        t.velocidade,
        t.resistencia,
        t.visao,
        t.equipe,
        t.pokemons,
        this.celula,
      );
      this.treinadores.push(treinador);
    });
  }

  inciar() {
    this.mapa.desenha();

    const base = [
      { x: 0, y: 0 },
      { x: this.canvas.width - this.celula, y: 0 },
      { x: 0, y: this.canvas.height - this.celula },
      {
        x: this.canvas.width - this.celula,
        y: this.canvas.height - this.celula,
      },
    ];

    this.treinadores.forEach((treinador, idx) => {
      treinador.posicao = {
        x: base[idx].x,
        y: base[idx].y,
      };

      treinador.desenha(this.contexto, 0, 0);
    });
  }

  loop() {
    // console.log(this.cronometro.segundos);
    // if (this.cronometro.segundos >= 10) {
    //   this.parar();
    // }
    this.contexto.reset();

    this.mapa.desenha();

    this.treinadores.forEach((treinador) => {
      const obj = treinador.movimenta(this.contexto, this.mapa);

      if (obj) {
        // treinador.posicao = { x: 0, y: 0 };
        const teste = this.treinadores.filter((t) => t.id === obj);
      }
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
  }
}

export default Simulacao;
