import { atualizaPosicaoNaMatriz } from "../../utils/utils.js";
import Observador from "../Observer/Observador.js";

class Agente extends Observador {
  #id;
  #especie;
  #velocidade;
  #visao;
  #algoritmo;
  #destino;
  #caminho;
  #posicao;
  #tamanho;
  #frame;
  #estaDisponivel;
  #estaParado;
  #imagens;
  #direcao;
  #imagem;

  constructor(id, especie, tamanho, algoritmo, velocidade = 1, visao = 10) {
    super();
    this.#id = id;
    this.#tamanho = tamanho;
    this.#especie = especie;
    this.#velocidade = velocidade;
    this.#visao = visao;
    this.#algoritmo = algoritmo;
  }

  iniciar() {
    this.#posicao = { x: 0, y: 0 };
    this.#destino = null;
    this.#caminho = [];
    this.#frame = 0;
    this.#estaDisponivel = true;
    this.#estaParado = false;
    this.#direcao = "baixo";
    this.#imagem = 0;
    this.#imagens = [];

    const direcoes = {
      baixo: 3,
      cima: 3,
      esquerda: 3,
      direita: 3,
    };

    for (const [direcao, quantidade] of Object.entries(direcoes)) {
      this.#imagens[direcao] = [];
      for (let i = 1; i <= quantidade; i++) {
        // eslint-disable-next-line no-undef
        const img = new Image();
        img.src = `./src/recursos/${this.#especie}/${direcao}${String(i).padStart(2, "0")}.png`;

        this.#imagens[direcao].push(img);
      }
    }
  }

  atualizar(atributo, valor) {
    switch (atributo) {
      case "velocidade":
        this.#velocidade = valor;
        break;
      case "visao":
        this.#visao = valor;
        break;
    }
  }

  desenha(contexto) {
    if (this.#especie === "Treinador" && window.debug) {
      contexto.fillStyle = this.getCor();
      contexto.fillRect(
        this.#posicao.x,
        this.#posicao.y,
        this.#tamanho,
        this.#tamanho,
      );

      contexto.font = "56px Arial";
      contexto.fillStyle = "white";
      contexto.fillText(
        `${this.#especie}#${this.#id}`,
        this.#posicao.x - 10,
        this.#posicao.y - 10,
      );
    }

    const imagemAtual =
      this.#imagens[this.#direcao][this.#estaParado ? 0 : this.#imagem];

    contexto.drawImage(
      imagemAtual,
      this.#posicao.x,
      this.#posicao.y,
      this.#tamanho,
      this.#tamanho,
    );
  }

  movimento(mapa) {
    if (this.#destino) {
      if (!this.#caminho.length) {
        this.#caminho = this.#calculaMovimento(mapa, this.#destino);
        this.#caminho.shift();

        if (this.#caminho.length < 1) {
          return 0;
        }
      }

      this.#move(mapa);
      return 1;
    }

    return 2;
  }

  #calculaMovimento(mapa) {
    const inicio = {
      x: Math.floor(this.#posicao.x / this.#tamanho),
      y: Math.floor(this.#posicao.y / this.#tamanho),
    };
    const fim = {
      x: Math.floor(this.#destino.x / this.#tamanho),
      y: Math.floor(this.#destino.y / this.#tamanho),
    };

    const matriz = mapa.getMatriz();
    const matrizClone = matriz.clone();
    return this.#algoritmo.findPath(
      inicio.x,
      inicio.y,
      fim.x,
      fim.y,
      matrizClone,
    );
  }

  #move(mapa) {
    this.#frame++;
    const intervalo =
      32 /
      (window.cronometro.multiplicador * (1 + (this.#velocidade - 1) * 0.25));

    if (this.#frame === Math.floor(intervalo / 1)) {
      this.#imagem = this.#imagem === 0 ? 2 : this.#imagem === 1 ? 2 : 1;
    }

    if (this.#frame >= intervalo) {
      const proximo = this.#caminho.shift();

      if (proximo) {
        this.#defineDirecao(proximo);

        atualizaPosicaoNaMatriz(
          mapa.getMatriz(),
          this.#posicao,
          this.#tamanho,
          0,
        );
        this.#posicao = {
          x: proximo[0] * this.#tamanho,
          y: proximo[1] * this.#tamanho,
        };
        atualizaPosicaoNaMatriz(
          mapa.getMatriz(),
          this.#posicao,
          this.#tamanho,
          this.#id,
        );

        this.#frame = 0;
      }
    }

    if (this.#caminho.length === 0) {
      this.#destino = null;
    }
  }

  #defineDirecao(destino) {
    const tamanho = this.#tamanho;
    if (
      destino[0] === this.#posicao.x / tamanho &&
      destino[1] > this.#posicao.y / tamanho
    )
      this.#direcao = "baixo";
    else if (
      destino[0] === this.#posicao.x / tamanho &&
      destino[1] < this.#posicao.y / tamanho
    )
      this.#direcao = "cima";
    else if (
      destino[1] === this.#posicao.y / tamanho &&
      destino[0] > this.#posicao.x / tamanho
    )
      this.#direcao = "direita";
    else if (
      destino[1] === this.#posicao.y / tamanho &&
      destino[0] < this.#posicao.x / tamanho
    )
      this.#direcao = "esquerda";
    else this.#direcao = "baixo";
  }

  detectaColisao(contexto, mapa) {
    if (!this.#estaDisponivel) return [];
    const visaoMetade = Math.floor(this.#visao / 2) * this.#tamanho;

    const inicioX = this.#posicao.x - visaoMetade;
    const inicioY = this.#posicao.y - visaoMetade;
    const tamanho = visaoMetade * 2 + this.#tamanho;
    const celulasPorLado = Math.floor(tamanho / this.#tamanho);

    if (window.debug) {
      contexto.strokeStyle = "white";
      contexto.lineWidth = 2;
      contexto.strokeRect(inicioX, inicioY, tamanho, tamanho);
    }

    const colisoes = [];

    for (let i = 0; i < celulasPorLado; i++) {
      const posX = Math.floor(inicioX / this.#tamanho) + i;
      for (let j = 0; j < celulasPorLado; j++) {
        const posY = Math.floor(inicioY / this.#tamanho) + j;

        if (
          posY >= 0 &&
          posY < mapa.getMatriz().nodes.length &&
          posX >= 0 &&
          posX < mapa.getMatriz().nodes[0].length
        ) {
          const obj = mapa.getMatriz().nodes[posY][posX];
          if (obj.agente && obj.agente !== this.#id && obj.agente >= 1) {
            if (
              typeof this?.getPokemons === "function" &&
              this.getPokemons().some((poke) => poke.getId() === obj.agente)
            ) {
              return colisoes;
            }

            colisoes.push(obj.agente);

            if (window.debug) {
              contexto.fillStyle = "rgba(0, 0, 0, 0.3)";
              contexto.fillRect(
                posX * this.#tamanho,
                posY * this.#tamanho,
                this.#tamanho,
                this.#tamanho,
              );
            }
          }
        }
      }
    }

    return colisoes;
  }

  getId() {
    return this.#id;
  }

  getEspecie() {
    return this.#especie;
  }

  getVelocidade() {
    return this.#velocidade;
  }

  getVisao() {
    return this.#visao;
  }

  getPosicao() {
    return this.#posicao;
  }

  getDisponibilidade() {
    return this.#estaDisponivel;
  }

  getParado() {
    return this.#estaParado;
  }

  getTamanho() {
    return this.#tamanho;
  }

  getCaminho() {
    return this.#caminho;
  }

  getAlgoritmo() {
    return this.#algoritmo;
  }

  setVelocidade(velocidade) {
    this.#velocidade = velocidade;
  }

  setVisao(visao) {
    this.#visao = visao;
  }

  setPosicao(posicao) {
    this.#posicao = posicao;
  }

  setDisponibilidade(estaDisponivel) {
    this.#estaDisponivel = estaDisponivel;
  }

  setParado(estaParado) {
    this.#estaParado = estaParado;
  }

  setDestino(destino) {
    this.#destino = destino;
  }

  setCaminho(caminho) {
    this.#caminho = caminho;
  }

  setDirecao(direcao) {
    this.#direcao = direcao;
  }
}

export default Agente;
