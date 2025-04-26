import { pokedex } from "../models/pokedex.js";
import { posicaoAleatoriaBioma } from "../utils/utils.js";
import Agente from "./agente.js";

class Pokemon extends Agente {
  constructor(
    id,
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
    treinador = null,
    pokeball = true,
  ) {
    super(id, tamanho, especie, algoritimo);
    this.pokedex = pokedex;
    this.tipos = tipos;
    this.vidaBase = vida;
    this.vida = vida;
    this.ataque = ataque;
    this.defesa = defesa;
    this.ataques = ataques;
    this.evolucao = evolucao;
    this.incremento = incremento;
    this.experiencia = experiencia;
    this.nivel = nivel;
    this.estaAtivo = estaAtivo;
    this.treinador = treinador;
    this.pokeball = pokeball;
  }

  acao(_, mapa) {
    if (this.paraMovimento) {
      return;
    }

    switch (this.movimento(mapa)) {
      case 0:
        this.destino = this.moveBioma(mapa);
        break;
      case 1:
        break;
      case 2:
        this.destino = this.moveBioma(mapa);
        break;
    }
  }

  segueTreinador() {
    // const posicaoAlvo = calulaPosicaoVizinha(
    //   mapa,
    //   this.treinador,
    //   this.tamanho,
    //   this.algoritimo,
    // );
    // this.destino = posicaoAlvo;
    // this.movimento(mapa);
  }

  moveBioma(mapa) {
    const bioma = mapa.biomas.find(
      (bioma) =>
        this.posicao.x >= bioma.posX &&
        this.posicao.x <= bioma.posX + bioma.largura &&
        this.posicao.y >= bioma.posY &&
        this.posicao.y <= bioma.posY + bioma.altura &&
        this.tipos.some((tipo) => bioma.tipos.includes(tipo)),
    );

    return posicaoAleatoriaBioma(bioma, mapa.matriz, this.tamanho);
  }

  sobeNivel(treinador) {
    const experienciaTotal = Number(this.nivel) * 10 + 90;

    if (this.experiencia >= experienciaTotal) {
      this.nivel++;

      const atributos = [
        { vidaBase: this.vidaBase },
        { ataque: this.ataque },
        { defesa: this.defesa },
      ];

      const atributoMelhorado =
        atributos[Math.floor(Math.random() * atributos.length)];

      this[Object.keys(atributoMelhorado)] += this.incremento;

      this.ataques.basico.recarga += this.incremento / 250;

      this.experiencia = this.experiencia - experienciaTotal;

      const pokemon = this.verificaEvolucao();
      if (pokemon) {
        treinador.equipe.splice(
          treinador.equipe.findIndex((a) => a.id === pokemon.id),
          1,
        );

        treinador.equipe.push(pokemon);
        treinador.pokemons.push(pokemon);
      }
    }
  }

  verificaEvolucao() {
    if (!this.evolucao || this.nivel < this.evolucao.nivel) return;

    this.estaAtivo = false;
    const evolucao = pokedex.find(
      (poke) => poke.pokedex === this.evolucao.pokedex,
    );

    return new Pokemon(
      this.id,
      this.tamanho,
      evolucao.especie,
      this.algoritimo,
      evolucao.pokedex,
      evolucao.tipos,
      (this.vida += this.evolucao.buff),
      (this.ataque += this.evolucao.buff),
      (this.defesa += this.evolucao.buff),
      evolucao.ataques,
      evolucao.evolucao,
      evolucao.incremento,
      this.experiencia,
      this.nivel,
      true,
      this.treinador,
    );
  }
}

export default Pokemon;
