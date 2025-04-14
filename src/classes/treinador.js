import Agente from "./agente.js";

class Treinador extends Agente {
  constructor(
    id,
    velocidade,
    resistencia,
    visao,
    estrategia,
    equipe,
    pokemons,
    tamanho,
  ) {
    super(id, tamanho, "humana", velocidade, visao);

    this.resistenciaBase = resistencia;
    this.resistencia = resistencia;
    this.estrategia = estrategia;
    this.pokemons = pokemons;
    this.equipe = equipe;
  }

  acao(contexto, mapa, agentes) {
    if (this.resistencia <= 0 && this.paraMovimento) {
      console.log("acabou a resistencia");
      this.voltaBase(this);
      return;
    }

    if (!this.estaDisponivel) {
      const distanciaBase = this.calculaDistancia(this.posicao, this.base);

      if (distanciaBase <= 2) {
        console.log(`Treinador #${this.id} voltou para a base`);
        this.reset();
        return;
      }
    }

    if (this.paraMovimento) {
      return;
    }

    this.verificaColisao(contexto, mapa, agentes);

    switch (this.movimento(mapa)) {
      case 0:
        // console.log(`${this.id} não achou`);
        this.destino = this.buscaBioma(mapa.biomas);
        break;
      case 1:
        // console.log(`${this.id} esta caminhando`);
        break;
      case 2:
        // console.log(`${this.id} chegou`);
        this.destino = this.buscaBioma(mapa.biomas);
        break;
      case 3:
        // console.log(`${this.id} está na base`);
        this.base();
        break;
      default:
        console.log("Não previsto");
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

  verificaColisao(contexto, mapa, agentes) {
    const colisoes = this.detectaColisao(contexto, mapa);
    const alvo = this.colisaoMaisProxima(colisoes, agentes);

    if (alvo) {
      switch (alvo.especie) {
        case "humana":
          if (this.estrategia === "agressivo") {
            this.colideTreinador(alvo, contexto, mapa);
          }
          break;
        default:
          break;
      }
    }
  }

  colisaoMaisProxima(colisoes, agentes) {
    const candidatos = colisoes
      .map((id) => agentes.find((t) => t.id === id))
      .filter((alvo) => alvo && alvo.estaDisponivel && this.estaDisponivel);

    let filtrados = candidatos.filter((alvo) => alvo.especie !== "humana");

    if (filtrados.length === 0) filtrados = candidatos;
    if (filtrados.length === 0) return null;

    return filtrados.reduce((maisProximo, atual) => {
      const distAtual = Math.hypot(
        atual.posicao.x - this.posicao.x,
        atual.posicao.y - this.posicao.y,
      );
      const distMaisProx = Math.hypot(
        maisProximo.posicao.x - this.posicao.x,
        maisProximo.posicao.y - this.posicao.y,
      );
      return distAtual < distMaisProx ? atual : maisProximo;
    });
  }

  colideTreinador(alvo, contexto, mapa) {
    if (this.caminho.length) {
      const ultimo = this.caminho[this.caminho.length - 1];
      const destino = {
        x: Math.floor(alvo.posicao.x / mapa.celula),
        y: Math.floor(alvo.posicao.y / mapa.celula),
      };

      const distancia = this.calculaDistancia(ultimo, destino);

      if (distancia >= 5) {
        this.caminho = [];
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
        this.iniciaBatalha(alvo);
      }
    }
  }

  iniciaBatalha(alvo) {
    this.estaDisponivel = false;
    this.paraMovimento = true;

    alvo.estaDisponivel = false;
    alvo.paraMovimento = true;

    console.log(`Treinador #${this.id} Inicia Batalha`);

    setTimeout(() => {
      const id = Math.random() < 0.5 ? this.id : alvo.id;
      if (id === this.id) {
        console.log(`Treinador #${this.id} venceu a batalha`);
        this.estaDisponivel = true;
        this.paraMovimento = false;
        alvo.resistencia = 0;
      } else {
        console.log(`Treinador #${alvo.id} venceu a batalha`);
        alvo.estaDisponivel = true;
        alvo.paraMovimento = false;
        this.resistencia = 0;
      }
    }, 2000);
  }

  voltaBase(treinador) {
    treinador.destino = treinador.base;
    treinador.paraMovimento = false;
    treinador.caminho = [];
  }

  reset() {
    this.paraMovimento = true;
    this.caminho = [];

    const tempoNaBase = this.resistenciaBase - this.resistencia;
    setTimeout(() => {
      this.estaDisponivel = true;
      this.paraMovimento = false;
      this.resistencia = this.resistenciaBase;
    }, tempoNaBase * 1000);
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

  calculaDistancia(posicao, destino) {
    const dx = destino.x - posicao.x;
    const dy = destino.y - posicao.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export default Treinador;
