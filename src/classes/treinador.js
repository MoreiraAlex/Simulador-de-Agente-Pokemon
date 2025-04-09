import Agente from "./agente.js";

class Treinador extends Agente {
  constructor(id, velocidade, resistencia, visao, equipe, pokemons, tamanho) {
    super(id, tamanho, "humana", velocidade, visao);

    this.resistencia = resistencia;
    this.pokemons = pokemons;
    this.equipe = equipe;

    this.frame = 0;
    this.caminho = [];

    this.estaDisponivel = true;
    this.destino = null;
  }

  acao(contexto, mapa, treinadores) {
    // console.log(`Treinador #${this.id}`);
    if (!this.estaDisponivel) {
      return;
    }
    const colisoes = this.detectaColisao(contexto, mapa);

    if (colisoes.length) {
      const colisao = colisoes[0];
      const alvo = treinadores.find((t) => t.id === colisao);
      if (alvo && alvo.estaDisponivel && this.estaDisponivel) {
        if (this.caminho.length) {
          const ultimo = this.caminho[this.caminho.length - 1];
          const destinoX = Math.floor(alvo.posicao.x / mapa.celula);
          const destinoY = Math.floor(alvo.posicao.y / mapa.celula);

          const distancia =
            Math.abs(ultimo.x - destinoX) + Math.abs(ultimo.y - destinoY);

          if (distancia >= 5) {
            this.caminho = [];
            console.log(`Treinador #${this.id} Reinicia caminho`);
          }
        }
        this.destino = alvo.posicao;

        const alvoColisoes = alvo.detectaColisao(contexto, mapa);
        if (alvoColisoes.length && alvoColisoes.some((a) => a === this.id)) {
          if (
            Math.abs(alvo.posicao.x - this.posicao.x) +
              Math.abs(alvo.posicao.y - this.posicao.y) <=
            this.tamanho * 3
          ) {
            this.estaDisponivel = false;
            alvo.estaDisponivel = false;

            console.log(`Treinador #${this.id} Inicia Batalha`);

            setTimeout(() => {
              this.estaDisponivel = true;
            }, 2000);
          }
        }
      }
    }

    switch (this.movimento(mapa)) {
      case 0:
        // console.log("Não achou");
        this.destino = this.buscaBioma(mapa.biomas);
        break;
      case 1:
        // console.log("Caminhando");
        break;
      case 2:
        // console.log("Chegou");
        this.destino = this.buscaBioma(mapa.biomas);
        break;
      default:
        // console.log("Não previsto");
        break;
    }
  }

  buscaBioma(biomas) {
    const index = Math.floor(Math.random() * biomas.length);
    const { posX, posY, largura, altura } = biomas[index];

    const destinoX = Math.floor(posX + largura / 2);
    const destinoY = Math.floor(posY + altura / 2);

    // console.log(biomas[index].tipo, biomas[index].posX, biomas[index].posY);
    return { x: destinoX, y: destinoY };
  }

  TreinadorManualmente(tecla, celula, matriz) {
    if (!tecla) {
      return;
    }

    switch (tecla.key) {
      case "w":
        if (matriz[(this.posicao.y - celula) / celula][this.posicao.x / celula])
          break;
        this.posicao.y -= celula;
        break;
      case "s":
        if (matriz[(this.posicao.y + celula) / celula][this.posicao.x / celula])
          break;
        this.posicao.y += celula;
        break;
      case "a":
        if (matriz[this.posicao.y / celula][(this.posicao.x - celula) / celula])
          break;
        this.posicao.x -= celula;
        break;
      case "d":
        if (matriz[this.posicao.y / celula][(this.posicao.x + celula) / celula])
          break;
        this.posicao.x += celula;
        break;
    }

    tecla.key = null;
  }
}

export default Treinador;
