import Agente from "./Agente.js";

class Treinador extends Agente {
  #resistenciaBase;
  #resistencia;
  #estrategia;
  #equipe;
  #pokemons;

  constructor(
    id,
    especie,
    velocidade,
    visao,
    resistencia,
    estrategia,
    equipe,
    pokemons,
  ) {
    super(id, especie, velocidade, visao);
    this.#resistenciaBase = resistencia;
    this.#resistencia = resistencia;
    this.#estrategia = estrategia;
    this.#equipe = equipe;
    this.#pokemons = pokemons;
  }

  atualizar(atributo, valor) {
    super.atualizar(atributo, valor);
    switch (atributo) {
      case "resistencia":
        this.#resistenciaBase = valor;
        break;
    }
  }

  getResistenciaBase() {
    return this.#resistenciaBase;
  }

  getResistencia() {
    return this.#resistencia;
  }

  getEstrategia() {
    return this.#estrategia;
  }

  getEquipe() {
    return this.#equipe;
  }

  getPokemons() {
    return this.#pokemons;
  }

  setResistencia(resistencia) {
    this.#resistencia = resistencia;
  }

  setEstrategia(estrategia) {
    this.#estrategia = estrategia;
  }

  setEquipe(equipe) {
    this.#equipe = equipe;
  }

  setPokemons(pokemons) {
    this.#pokemons = pokemons;
  }
}

export default Treinador;
