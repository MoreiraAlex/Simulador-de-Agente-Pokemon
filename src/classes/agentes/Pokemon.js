import { pokedex } from "../../models/pokedex.js";
import { calculaDistancia, posicaoAleatoriaBioma } from "../../utils/utils.js";
import Agente from "../agentes/Agente.js";
import AgenteFactory from "./AgenteFactory.js";

class Pokemon extends Agente {
  #pokedex;
  #tipos;
  #vidaBase;
  #vida;
  #ataque;
  #defesa;
  #ataques;
  #evolucao;
  #incremento;
  #experiencia;
  #nivel;
  #estaAtivo;
  #treinador;
  #pokeball;

  constructor(
    id,
    especie,
    tamanho,
    algoritmo,
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
    pokeball = false,
  ) {
    super(id, especie, tamanho, algoritmo);
    this.#pokedex = pokedex;
    this.#tipos = tipos;
    this.#vidaBase = vida;
    this.#vida = vida;
    this.#ataque = ataque;
    this.#defesa = defesa;
    this.#ataques = ataques;
    this.#evolucao = evolucao;
    this.#incremento = incremento;
    this.#experiencia = experiencia;
    this.#nivel = nivel;
    this.#estaAtivo = estaAtivo;
    this.#treinador = treinador;
    this.#pokeball = pokeball;
  }

  iniciar() {
    super.iniciar();
  }

  acao(contexto, mapa) {
    // this.verificaExperiencia(this.#treinador);

    if (this.#pokeball || !this.#estaAtivo) return;
    this.desenha(contexto);
    if (this.getParado()) return;

    let destino = null;
    if (this.#treinador) {
      destino = this.#posicaoTreinador();
    } else {
      destino = this.#moveBioma(mapa);
    }

    switch (this.movimento(mapa)) {
      case 0:
        this.setDestino(destino);
        break;
      case 1:
        break;
      case 2:
        this.setDestino(destino);
        break;
    }
  }

  #posicaoTreinador() {
    const treinadorPos = this.#treinador.getPosicao();
    const distancia = calculaDistancia(this.getPosicao(), treinadorPos);
    if (distancia >= 200) {
      this.setPosicao(treinadorPos);
      this.setCaminho([]);
    }

    this.setVelocidade(6);
    return treinadorPos;
  }

  #moveBioma(mapa) {
    const mapaBiomas = mapa.getBiomas();
    const matriz = mapa.getMatriz();
    const posicao = this.getPosicao();
    const tamanho = this.getTamanho();

    const bioma = mapaBiomas.find(
      (bioma) =>
        posicao.x >= bioma.x &&
        posicao.x <= bioma.x + bioma.largura &&
        posicao.y >= bioma.y &&
        posicao.y <= bioma.y + bioma.altura &&
        this.#tipos.some((tipo) => bioma.tipos.includes(tipo)),
    );

    if (!bioma) return null;
    return posicaoAleatoriaBioma(bioma, matriz, tamanho);
  }

  verificaExperiencia(treinador) {
    if (!treinador || this.#nivel >= 15 || !this.#estaAtivo) return;

    const experienciaTotal = Number(this.#nivel) * 10 + 90;

    if (this.#experiencia >= experienciaTotal) {
      this.#nivel++;

      const atributos = [
        { vidaBase: this.#vidaBase },
        { ataque: this.#ataque },
        { defesa: this.#defesa },
      ];

      const atributoMelhorado =
        atributos[Math.floor(Math.random() * atributos.length)];

      this.#melhorarAtributo(atributoMelhorado);
      this.#ataques.basico.recarga += this.#incremento / 250;
      this.#experiencia = this.#experiencia - experienciaTotal;

      const pokemon = this.#verificaEvolucao();

      if (pokemon) {
        const equipe = treinador.getEquipe();
        equipe.splice(
          equipe.findIndex((a) => a.getId() === this.getId()),
          1,
        );

        const pokemons = treinador.getPokemons();
        treinador.setEquipe([...equipe, pokemon]);
        treinador.setPokemons([...pokemons, pokemon]);
      }
    }
  }

  #melhorarAtributo(atributoMelhorado) {
    const chave = Object.keys(atributoMelhorado)[0];

    switch (chave) {
      case "vidaBase":
        this.#vidaBase += this.#incremento;
        break;
      case "ataque":
        this.#ataque += this.#incremento;
        break;
      case "defesa":
        this.#defesa += this.#incremento;
        break;
      default:
        throw new Error("Atributo inválido");
    }
  }

  #verificaEvolucao() {
    if (!this.#evolucao || this.#nivel < this.#evolucao.nivel) return;

    this.#estaAtivo = false;
    const evolucao = pokedex.find(
      (poke) => poke.pokedex === this.#evolucao.pokedex,
    );

    const pokemon = AgenteFactory.criarAgente("pokemon", {
      id: window.sequence.next(),
      especie: evolucao.especie,
      tamanho: this.getTamanho(),
      pokedex: evolucao.pokedex,
      tipos: evolucao.tipos,
      vida: this.getVidaBase() + this.#evolucao.buff,
      ataque: this.getAtaque() + this.#evolucao.buff,
      defesa: this.getDefesa() + this.#evolucao.buff,
      ataques: this.getAtaques(),
      evolucao: evolucao.evolucao,
      incremento: evolucao.incremento,
      experiencia: this.#experiencia,
      nivel: this.#nivel,
      estaAtivo: true,
      treinador: this.#treinador,
      pokeball: this.#pokeball,
    });

    return pokemon;
  }

  getPokedex() {
    return this.#pokedex;
  }

  getTipos() {
    return this.#tipos;
  }

  getVidaBase() {
    return this.#vidaBase;
  }

  getVida() {
    return this.#vida;
  }

  getAtaque() {
    return this.#ataque;
  }

  getDefesa() {
    return this.#defesa;
  }

  getAtaques() {
    return this.#ataques;
  }

  getEvolucao() {
    return this.#evolucao;
  }

  getIncremento() {
    return this.#incremento;
  }

  getExperiencia() {
    return this.#experiencia;
  }

  getNivel() {
    return this.#nivel;
  }

  getEstado() {
    return this.#estaAtivo;
  }

  getTreinador() {
    return this.#treinador;
  }

  getPokeball() {
    return this.#pokeball;
  }

  setPokeball(pokeball) {
    this.#pokeball = pokeball;
  }

  setVida(vida) {
    this.#vida = vida;
  }

  setExperiencia(expericencia) {
    this.#experiencia = expericencia;
  }

  setTreinador(treinador) {
    this.#treinador = treinador;
  }
}

export default Pokemon;
