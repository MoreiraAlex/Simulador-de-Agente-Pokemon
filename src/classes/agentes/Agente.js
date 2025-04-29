import Observador from "../Observer/Observador.js";
class Agente extends Observador {
  #id;
  #especie;
  #velocidade;
  #visao;
  // constructor(tamanho) {}
  constructor(id, especie, velocidade = 1, visao = 10) {
    super();
    this.#id = id;
    this.#especie = especie;
    this.#velocidade = velocidade;
    this.#visao = visao;
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

  setVelocidade(velocidade) {
    this.#velocidade = velocidade;
  }

  setVisao(visao) {
    this.#visao = visao;
  }
}

export default Agente;
