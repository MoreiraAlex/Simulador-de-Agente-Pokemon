class Sujeito {
  #observadores;

  constructor() {
    this.#observadores = [];
  }

  adicionarObservador(observador) {
    this.#observadores.push(observador);
  }

  removerObservador(observador) {
    this.#observadores = this.#observadores.filter((obs) => obs !== observador);
  }

  notificarObservador(id, atributo, valor) {
    const observador = this.#observadores.find((obs) => (obs.id = id));
    observador.atualizar(atributo, valor);
  }

  notificarObservadores(atributo, valor) {
    this.#observadores.forEach((obs) => obs.atualizar(atributo, valor));
  }
}

export default Sujeito;
