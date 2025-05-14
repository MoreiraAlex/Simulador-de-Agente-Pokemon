import { atualizaPosicaoNaMatriz } from "../utils/utils.js";
import Mapa from "./Mapa.js";

class Simulacao {
  #canvas;
  #sequence;
  #agentes;
  #cronometro;
  #contexto;
  #frame;
  #celula;
  #mapa;
  #pf;
  #invocou;

  constructor(canvas, sequence, agentes, cronometro, pf) {
    this.#canvas = canvas;
    this.#sequence = sequence;
    this.#agentes = agentes;
    this.#cronometro = cronometro;
    this.#pf = pf;
  }

  iniciar() {
    this.#contexto = this.#canvas.getContext("2d");
    this.#celula = 50;
    this.#invocou = false;

    this.#mapa = new Mapa(
      this.#canvas,
      this.#contexto,
      this.#celula,
      this.#pf,
      this.#sequence,
    );
    this.#mapa.iniciar();

    this.loop();
  }

  loop() {
    this.#contexto.reset();
    this.#mapa.desenhar();
    // this.#mapa.resetaAgentesMatriz();

    if (this.#cronometro.segundos % 30 === 0 && !this.#invocou) {
      this.#InvocaPokemons();
    }

    this.#agentes.forEach((a) => {
      a.acao(this.#contexto, this.#mapa, this.#agentes);
    });

    // eslint-disable-next-line no-undef
    this.#frame = requestAnimationFrame(() => this.loop());
  }

  #InvocaPokemons() {
    this.#invocou = true;

    // this.#agentes.forEach((a) => {
    //   if (a.getEspecie() === "Treinador" || !a.getDisponibilidade()) return;

    //   atualizaPosicaoNaMatriz(
    //     this.#mapa.getMatriz(),
    //     a.getPosicao(),
    //     this.#celula,
    //     0,
    //   );
    // });

    this.#agentes.splice(
      0,
      this.#agentes.length,
      ...this.#agentes.filter(
        (a) => a.getEspecie() === "Treinador" || !a.getDisponibilidade(),
      ),
    );

    this.#mapa.pokeBioma(this.#agentes);
    setTimeout(
      () => (this.#invocou = false),
      2000 / window.cronometro.multiplicador,
    );
  }

  pausar() {
    if (this.#frame) {
      // eslint-disable-next-line no-undef
      cancelAnimationFrame(this.#frame);
      this.#frame = null;
    }
  }

  parar() {
    this.pausar();
    this.#contexto.reset();
    console.clear();

    this.#agentes = [];
  }
}

export default Simulacao;
