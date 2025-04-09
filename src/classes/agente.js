import AEstrela from "./aEstrela.js";

class Agente {
  constructor(id, tamanho, especie, velocidade = 1, visao = 10) {
    this.id = id;
    this.tamanho = tamanho;
    this.especie = especie;
    this.velocidade = velocidade;
    this.visao = visao;
    this.posicao = {
      x: 0,
      y: 0,
    };
    this.destino = null;
    this.caminho = [];
    // this.colisoes = [];
  }

  desenha(contexto) {
    contexto.fillStyle = "white";
    contexto.fillRect(
      this.posicao.x,
      this.posicao.y,
      this.tamanho,
      this.tamanho,
    );

    contexto.font = "20px Arial";
    contexto.fillText(`#${this.id}`, this.posicao.x, this.posicao.y);
  }

  movimento(mapa) {
    if (this.destino) {
      if (!this.caminho.length) {
        this.caminho = this.calculaMovimento(mapa, this.destino);

        if (this.caminho.length < 1) {
          return 0;
        }
      }

      this.move(mapa);
      return 1;
    }
    return 2;
  }

  calculaMovimento(mapa) {
    const inicio = {
      x: Math.floor(this.posicao.x / mapa.celula),
      y: Math.floor(this.posicao.y / mapa.celula),
    };
    const fim = {
      x: Math.floor(this.destino.x / mapa.celula),
      y: Math.floor(this.destino.y / mapa.celula),
    };

    const aEstrela = new AEstrela(mapa.matriz);
    return aEstrela.encontrarCaminho(inicio, fim);
  }

  move(mapa) {
    this.frame++;

    if (this.frame >= globalThis.frameRate / this.velocidade / 4) {
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

    if (this.caminho.length === 0) {
      this.destino = null;
    }
  }

  detectaColisao(contexto, mapa) {
    const visaoMetade = Math.floor(this.visao / 2) * this.tamanho;

    const inicioX = this.posicao.x - visaoMetade;
    const inicioY = this.posicao.y - visaoMetade;
    const tamanho = visaoMetade * 2 + this.tamanho;
    const celulasPorLado = Math.floor(tamanho / this.tamanho);

    contexto.strokeStyle = "white";
    contexto.lineWidth = 2;
    contexto.strokeRect(inicioX, inicioY, tamanho, tamanho);

    const colisoes = [];

    for (let i = 0; i < celulasPorLado; i++) {
      const posX = Math.floor(inicioX / this.tamanho) + i;
      for (let j = 0; j < celulasPorLado; j++) {
        const posY = Math.floor(inicioY / this.tamanho) + j;

        if (
          posY >= 0 &&
          posY < mapa.matriz.length &&
          posX >= 0 &&
          posX < mapa.matriz[0].length
        ) {
          this.obj = mapa.matriz[posY][posX];
          if (this.obj > 0 && this.obj !== this.id) {
            if (this.obj > 1) {
              colisoes.push(this.obj);
              // console.log(
              // `Treinador #${this.id} encontrou o treinador #${this.obj} em (${posX}, ${posY})`,
              // );
            }

            contexto.fillStyle = "rgba(0, 255, 0, 0.3)"; // verde com transparência
            contexto.fillRect(
              posX * this.tamanho,
              posY * this.tamanho,
              this.tamanho,
              this.tamanho,
            );
            // return obj;
          }
        }
      }
    }

    return colisoes;
  }
}

export default Agente;
