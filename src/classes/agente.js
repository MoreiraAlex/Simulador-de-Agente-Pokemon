import { atualizaPosicaoNaMatriz } from "../utils/utils.js";

class Agente {
  constructor(
    id,
    cor,
    tamanho,
    especie,
    algoritimo,
    velocidade = 1,
    visao = 10,
  ) {
    this.id = id;
    this.cor = cor;
    this.tamanho = tamanho;
    this.especie = especie;
    this.velocidade = velocidade;
    this.visao = visao;
    this.algoritimo = algoritimo;
    this.posicao = {
      x: 0,
      y: 0,
    };
    this.base = {
      x: 0,
      y: 0,
    };
    this.destino = null;
    this.caminho = [];
    this.estaDisponivel = true;
    this.paraMovimento = false;
    this.frame = 0;

    this.imagens = [];
    this.direcao = "baixo";
    const direcoes = {
      baixo: 3,
      cima: 3,
      esquerda: 3,
      direita: 3,
    };

    for (const [direcao, quantidade] of Object.entries(direcoes)) {
      this.imagens[direcao] = [];
      for (let i = 1; i <= quantidade; i++) {
        // if (this.especie !== "humana") return;
        // eslint-disable-next-line no-undef
        const img = new Image();
        // img.src = `./recursos/humana/${direcao}${String(i).padStart(2, "0")}.png`;
        img.src = `./recursos/${this.especie}/${direcao}${String(i).padStart(2, "0")}.png`;

        this.imagens[direcao].push(img);
      }
    }

    this.imagem = 0;
  }

  desenha(contexto) {
    contexto.font = "48px Arial";
    contexto.fillStyle = this.cor;
    if (this.especie === "humana") {
      contexto.fillText(
        `#${this.id}`,
        this.posicao.x - 10,
        this.posicao.y - 10,
      );
    } else if (!this.paraMovimento) {
      // contexto.fillText(
      //   `${this.especie}`,
      //   this.posicao.x - 10,
      //   this.posicao.y - 10,
      // );
    }
    // if (this.especie !== "humana") {
    //   contexto.fillStyle = "red";
    //   contexto.fillRect(
    //     this.posicao.x,
    //     this.posicao.y,
    //     this.tamanho,
    //     this.tamanho,
    //   );

    //   return;
    // }

    const imagemAtual =
      this.imagens[this.direcao][this.paraMovimento ? 0 : this.imagem];

    contexto.drawImage(
      imagemAtual,
      this.posicao.x,
      this.posicao.y,
      this.tamanho,
      this.tamanho,
    );
  }

  movimento(mapa) {
    if (this.destino) {
      if (!this.caminho.length) {
        this.caminho = this.calculaMovimento(mapa, this.destino);
        this.caminho.shift();

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

    const matrizClone = mapa.matriz.clone();
    return this.algoritimo.findPath(
      inicio.x,
      inicio.y,
      fim.x,
      fim.y,
      matrizClone,
    );
  }

  move(mapa) {
    this.frame++;
    const intervalo =
      32 / (globalThis.multiplicador * (1 + (this.velocidade - 1) * 0.25));

    if (this.frame === Math.floor(intervalo / 2)) {
      // Troca a imagem no meio do caminho
      this.imagem = this.imagem === 0 ? 2 : this.imagem === 1 ? 2 : 1;
    }

    if (this.frame >= intervalo) {
      const proximo = this.caminho.shift();

      if (proximo) {
        this.defineDirecao(proximo);
        // this.imagem = this.imagem === 0 ? 2 : this.imagem === 1 ? 2 : 1;

        atualizaPosicaoNaMatriz(mapa.matriz, this.posicao, this.tamanho, 0);
        this.posicao = {
          x: proximo[0] * mapa.celula,
          y: proximo[1] * mapa.celula,
        };
        atualizaPosicaoNaMatriz(
          mapa.matriz,
          this.posicao,
          this.tamanho,
          this.id,
        );

        this.frame = 0;
      }
    }

    if (this.caminho.length === 0) {
      this.destino = null;
    }
  }

  defineDirecao(destino) {
    if (
      destino[0] === this.posicao.x / this.tamanho &&
      destino[1] > this.posicao.y / this.tamanho
    )
      this.direcao = "baixo";
    else if (
      destino[0] === this.posicao.x / this.tamanho &&
      destino[1] < this.posicao.y / this.tamanho
    )
      this.direcao = "cima";
    else if (
      destino[1] === this.posicao.y / this.tamanho &&
      destino[0] > this.posicao.x / this.tamanho
    )
      this.direcao = "direita";
    else if (
      destino[1] === this.posicao.y / this.tamanho &&
      destino[0] < this.posicao.x / this.tamanho
    )
      this.direcao = "esquerda";
  }

  detectaColisao(contexto, mapa) {
    if (!this.estaDisponivel) return [];
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
          posY < mapa.matriz.nodes.length &&
          posX >= 0 &&
          posX < mapa.matriz.nodes[0].length
        ) {
          this.obj = mapa.matriz.nodes[posY][posX];
          if (
            this.obj.agente &&
            this.obj.agente !== this.id &&
            this.obj.agente >= 1
          ) {
            colisoes.push(this.obj.agente);

            contexto.fillStyle = "rgba(0, 255, 0, 0.3)";
            contexto.fillRect(
              posX * this.tamanho,
              posY * this.tamanho,
              this.tamanho,
              this.tamanho,
            );
          }
        }
      }
    }

    return colisoes;
  }
}

export default Agente;
