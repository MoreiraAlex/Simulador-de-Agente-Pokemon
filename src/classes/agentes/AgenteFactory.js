import Pokemon from "./Pokemon.js";
import Treinador from "./Treinador.js";

class AgenteFactory {
  static #agentes = new Map();
  static #algoritmo = new window.PF.AStarFinder({});

  static criarAgente(tipo, atributos) {
    let agente;
    switch (tipo) {
      case "treinador":
        agente = this.#criaTreinador(atributos);
        break;
      case "pokemon":
        agente = this.#criaPokemon(atributos);
        break;
      default:
        throw new Error(`Tipo de agente desconhecido: ${tipo}`);
    }

    this.#agentes.set(atributos.id, agente);
    return agente;
  }

  static #criaTreinador(atributos) {
    const treinador = new Treinador(
      atributos.id,
      atributos.especie,
      atributos.tamanho,
      this.#algoritmo,
      atributos.velocidade,
      atributos.visao,
      atributos.cor,
      atributos.resistencia,
      atributos.estrategia,
      atributos.equipe,
      atributos.pokemons,
    );

    treinador.iniciar();
    return treinador;
  }

  static #criaPokemon(atributos) {
    const pokemon = new Pokemon(
      atributos.id,
      atributos.especie,
      atributos.tamanho,
      this.#algoritmo,
      atributos.pokedex,
      atributos.tipos,
      atributos.vida,
      atributos.ataque,
      atributos.defesa,
      atributos.ataques,
      atributos.evolucao,
      atributos.incremento,
      atributos.experiencia,
      atributos.nivel,
      atributos.estaAtivo,
      atributos?.treinador,
      atributos?.pokeball,
    );

    pokemon.iniciar();
    return pokemon;
  }

  static deletarAgente(id) {
    this.#agentes.delete(id);
  }
}

export default AgenteFactory;
