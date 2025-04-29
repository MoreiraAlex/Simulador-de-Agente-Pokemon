import Treinador from "./Treinador.js";

class AgenteFactory {
  static #agentes = new Map();

  static criarAgente(tipo, atributos) {
    let agente;
    switch (tipo) {
      case "treinador":
        agente = this.#criaTreinador(atributos);
        break;
      default:
        throw new Error(`Tipo de agente desconhecido: ${tipo}`);
    }

    this.#agentes.set(atributos.id, agente);
    return agente;
  }

  static #criaTreinador(atributos) {
    return new Treinador(
      atributos.id,
      atributos.especie,
      atributos.velocidade,
      atributos.visao,
      atributos.resistencia,
      atributos.estrategia,
      atributos.equipe,
      atributos.pokemons,
    );
  }

  static deletarAgente(id) {
    this.#agentes.delete(id);
  }
}

export default AgenteFactory;
