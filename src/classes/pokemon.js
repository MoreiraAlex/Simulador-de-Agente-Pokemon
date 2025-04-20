import { posicaoAleatoriaBioma } from "../utils/utils.js";
import Agente from "./agente.js";

class Pokemon extends Agente {
  constructor(
    id,
    cor,
    tamanho,
    especie,
    algoritimo,
    pokedex,
    tipos,
    vida,
    ataque,
    defesa,
    ataques,
    evolucao,
    incremento,
    experiencia,
    nivel,
    estaAtivo,
  ) {
    super(id, cor, tamanho, especie, algoritimo);
    this.pokedex = pokedex;
    this.tipos = tipos;
    this.vida = vida;
    this.ataque = ataque;
    this.defesa = defesa;
    this.ataques = ataques;
    this.evolucao = evolucao;
    this.incremento = incremento;
    this.experiencia = experiencia;
    this.nivel = nivel;
    this.estaAtivo = estaAtivo;
  }

  acao(mapa) {
    if (this.paraMovimento) {
      return;
    }

    switch (this.movimento(mapa)) {
      case 0:
        this.destino = this.moveBioma(mapa.biomas);
        break;
      case 1:
        break;
      case 2:
        this.destino = this.moveBioma(mapa.biomas);
        break;
    }
  }

  moveBioma(biomas) {
    const bioma = biomas.find(
      (bioma) =>
        this.posicao.x >= bioma.posX &&
        this.posicao.x <= bioma.posX + bioma.largura &&
        this.posicao.y >= bioma.posY &&
        this.posicao.y <= bioma.posY + bioma.altura &&
        this.tipos.some((tipo) => bioma.tipos.includes(tipo)),
    );

    return posicaoAleatoriaBioma(bioma);
  }
}

export default Pokemon;
