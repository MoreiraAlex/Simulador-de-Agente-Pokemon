import Agente from "./agente.js";
import { pokedex } from "../models/pokedex.js";

class Treinador extends Agente {
  constructor(
    id,
    cor,
    velocidade,
    resistencia,
    visao,
    estrategia,
    equipe,
    pokemons,
    tamanho,
  ) {
    super(id, cor, tamanho, "humana", velocidade, visao);

    this.resistenciaBase = resistencia;
    this.resistencia = resistencia;
    this.estrategia = estrategia;
    this.pokemons = pokemons;
    this.equipe = equipe;
  }

  acao(contexto, mapa, agentes) {
    if (this.resistencia <= 0 && this.paraMovimento) {
      console.log(`Treinador #${this.id} zerou a resistencia`);
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
    const index = this.tiposEscasso(biomas);
    const { posX, posY, largura, altura } = biomas[index];

    const destinoX = Math.floor(posX + largura / 2);
    const destinoY = Math.floor(posY + altura / 2);

    // console.log(biomas[index].tipo, biomas[index].posX, biomas[index].posY);
    return { x: destinoX, y: destinoY };
  }

  tiposEscasso(biomas) {
    const biomaAtual = biomas.forEach((bioma) => {
      const posicao = this.calculaDistancia(this.posicao, {
        x: bioma.posX,
        y: bioma.posY,
      });
      if (posicao <= 3) {
        return bioma.tipo;
      }
    });

    const tipos = Object.values(
      pokedex.reduce((acc, item) => {
        item.tipos.forEach((tipo) => {
          if (!acc[tipo]) {
            acc[tipo] = { tipo, quantidade: 0 };
          }
          acc[tipo].quantidade++;
        });
        return acc;
      }, {}),
    );

    const tiposTreinador = Object.values(
      this.pokemons.reduce((acc, item) => {
        item.tipos.forEach((tipo) => {
          if (!acc[tipo]) {
            acc[tipo] = { tipo, quantidade: 0 };
          }
          acc[tipo].quantidade++;
        });
        return acc;
      }, {}),
    );

    tipos.forEach((tipoGeral) => {
      if (!tiposTreinador.find((t) => t.tipo === tipoGeral.tipo)) {
        tiposTreinador.push({ tipo: tipoGeral.tipo, quantidade: 0 });
      }
    });

    tiposTreinador.sort((a, b) => a.quantidade - b.quantidade);

    const menorQuantidade = tiposTreinador[0].quantidade;
    const maisEscassos = tiposTreinador.filter(
      (t) => t.quantidade === menorQuantidade && t.tipo !== biomaAtual,
    );

    const aleatorio =
      maisEscassos[Math.floor(Math.random() * maisEscassos.length)];

    const bioma = biomas.findIndex((bioma) =>
      bioma.tipos.some((tipo) => tipo === aleatorio.tipo),
    );

    return bioma;
  }

  verificaColisao(contexto, mapa, agentes) {
    const colisoes = this.detectaColisao(contexto, mapa);
    const alvo = this.colisaoMaisProxima(colisoes, agentes);

    if (alvo) {
      this.colide(alvo, contexto, mapa, agentes);
    }

    // if (alvo) {
    //   switch (alvo.especie) {
    //     case "humana":
    //       if (this.estrategia === "agressivo") {
    //         this.colide(alvo, contexto, mapa);
    //       }
    //       break;
    //     default:
    //       this.colide(alvo, contexto, mapa);
    //       break;
    //   }
    // }
  }

  colisaoMaisProxima(colisoes, agentes) {
    const candidatos = colisoes
      .map((id) => agentes.find((t) => t.id === id))
      .filter((alvo) => alvo && alvo.estaDisponivel && this.estaDisponivel);

    let filtrados = candidatos.filter((alvo) => alvo.especie !== "humana");

    if (filtrados.length === 0) filtrados = candidatos;
    if (filtrados.length === 0) return null;

    return filtrados.reduce((proximo, atual) => {
      const distAtual = this.calculaDistancia(atual.posicao, this.posicao);
      const distMaisProx = this.calculaDistancia(proximo.posicao, this.posicao);

      return distAtual < distMaisProx ? atual : proximo;
    });
  }

  colide(alvo, contexto, mapa, agentes) {
    if (alvo.especie === "humana" && this.estrategia === "cauteloso") {
      return;
    }

    if (this.pokemons.some((p) => p.especie === alvo.especie)) {
      return;
    }

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
        this.calculaDistancia(this.posicao, alvo.posicao) <=
        this.tamanho * 3
      ) {
        this.iniciaBatalha(alvo, agentes, mapa);
      }
    }
  }

  iniciaBatalha(alvo, agentes, mapa) {
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

        if (alvo.especie === "humana") {
          alvo.resistencia = 0;
        } else {
          this.vencePokemon(alvo, agentes, mapa);
        }
      } else {
        console.log(`Agente #${alvo.id} venceu a batalha`);
        alvo.estaDisponivel = true;
        alvo.paraMovimento = false;
        this.resistencia = 0;
      }
    }, 2000 / globalThis.multiplicador);
  }

  vencePokemon(pokemon, agentes, mapa) {
    agentes.splice(
      agentes.findIndex((a) => a.id === pokemon.id),
      1,
    );
    mapa.matriz[Math.floor(pokemon.posicao.y / mapa.celula)][
      Math.floor(pokemon.posicao.x / mapa.celula)
    ] = 0;

    this.pokemons.push(pokemon);
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
    setTimeout(
      () => {
        this.estaDisponivel = true;
        this.paraMovimento = false;
        this.resistencia = this.resistenciaBase;
      },
      (tempoNaBase * 1000) / globalThis.multiplicador,
    );
  }

  calculaDistancia(posicao, destino) {
    const dx = destino.x - posicao.x;
    const dy = destino.y - posicao.y;

    return Math.hypot(dx, dy);
  }
}

export default Treinador;
