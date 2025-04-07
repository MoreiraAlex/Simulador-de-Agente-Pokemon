import Agente from "./agente.js";
import AEstrela from "./aEstrela.js";

class Treinador extends Agente {
  constructor(id, velocidade, resistencia, visao, equipe, pokemons, tamanho) {
    super(id, tamanho);
    this.velocidade = velocidade;
    this.resistencia = resistencia;
    this.visao = visao;
    this.pokemons = pokemons;
    this.equipe = equipe;

    this.frame = 0;
    this.caminho = [];

    this.estaDisponivel = true;
  }

  movimenta(contexto, mapa) {
    this.desenha(contexto, this.posicao.x, this.posicao.y);
    const obj = this.colisao(contexto, mapa);

    if (!this.estaDisponivel) {
      return 0;
    }

    if (obj !== 0) {
      this.estaDisponivel = false;

      return obj;
    }

    this.calculoMovimento(mapa);
  }

  calculoMovimento(mapa) {
    if (this.caminho.length === 0) {
      const { destinoX, destinoY } = this.buscaBioma(mapa.biomas);

      const inicio = {
        x: Math.floor(this.posicao.x / mapa.celula),
        y: Math.floor(this.posicao.y / mapa.celula),
      };
      const fim = {
        x: Math.floor(destinoX / mapa.celula),
        y: Math.floor(destinoY / mapa.celula),
        // x: 2,
        // y: 0,
      };

      const aEstrela = new AEstrela(mapa.matriz);
      this.caminho = aEstrela.encontrarCaminho(inicio, fim);
    }

    this.frame++;

    if (this.frame >= this.velocidade) {
      const proximo = this.caminho.shift();
      if (proximo) {
        mapa.matriz[this.posicao.y / this.tamanho][
          this.posicao.x / this.tamanho
        ] = 0;

        this.posicao = {
          x: proximo.x * mapa.celula,
          y: proximo.y * mapa.celula,
        };

        mapa.matriz[this.posicao.y / this.tamanho][
          this.posicao.x / this.tamanho
        ] = this.id;
        this.frame = 0;
      }
    }
  }

  colisao(contexto, mapa) {
    const visaoMetade = Math.floor(this.visao / 2) * this.tamanho;

    const inicioX = this.posicao.x - visaoMetade;
    const inicioY = this.posicao.y - visaoMetade;
    const tamanho = visaoMetade * 2 + this.tamanho;
    const celulasPorLado = Math.floor(tamanho / this.tamanho);

    contexto.strokeStyle = "white";
    contexto.lineWidth = 2;
    contexto.strokeRect(inicioX, inicioY, tamanho, tamanho);

    for (let i = 0; i < celulasPorLado; i++) {
      const posX = inicioX / this.tamanho + i;
      for (let j = 0; j < celulasPorLado; j++) {
        const posY = inicioY / this.tamanho + j;

        if (
          posY >= 0 &&
          posY < mapa.matriz.length &&
          posX >= 0 &&
          posX < mapa.matriz[0].length
        ) {
          const obj = mapa.matriz[posY][posX];
          if (obj > 1 && obj !== this.id) {
            console.log(
              `Treinador #${this.id} encontrou obj o treinador #${obj} em (${posX}, ${posY})`,
            );
            return obj;
          }
        }
      }
    }

    return 0;
  }

  buscaBioma(biomas) {
    const { posX, posY, largura, altura } =
      biomas[Math.floor(Math.random() * biomas.length)];
    // biomas[0];

    const destinoX = Math.floor(posX + largura / 2);
    const destinoY = Math.floor(posY + altura / 2);

    return { destinoX, destinoY, largura, altura };
  }
}

export default Treinador;
