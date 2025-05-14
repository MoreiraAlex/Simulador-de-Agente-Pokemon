// import { pokedex } from "../models/pokedex.js";
import { tipos } from "../models/tipos.js";
import {
  atualizaPosicaoNaMatriz,
  tiposEficazesContra,
  Vizinhos,
} from "../utils/utils.js";

class Batalha {
  #mapa;
  #agentes;
  #intervalos;

  constructor(mapa, agentes) {
    this.#mapa = mapa;
    this.#agentes = agentes;
    this.#intervalos = [];
  }

  async batalha(atacante, defensor) {
    const pokemonSelvagem = defensor.getEspecie() !== "Treinador";
    if (pokemonSelvagem) {
      defensor.equipe = [defensor];
      defensor.getEquipe = () => {
        return defensor.equipe;
      };
    }

    const nocautes = [];
    let contadorLuta = 0;

    while (true) {
      const equipeAtacante = atacante.getEquipe();
      const equipeDefensora =
        typeof defensor?.getEquipe === "function"
          ? defensor.getEquipe()
          : defensor.equipe;

      if (
        atacante.getEquipe().every((poke) => poke.getVida() <= 0) ||
        defensor.getEquipe().every((poke) => poke.getVida() <= 0)
      ) {
        break;
      }
      contadorLuta++;

      const { pokemonAtacante, pokemonDefensor } = this.#escolhePokemon(
        atacante.getEquipe(),
        defensor.getEquipe(),
        pokemonSelvagem,
        contadorLuta,
      );

      equipeAtacante.forEach((pokemon) => {
        pokemon.setPokeball(true);
        pokemon.setParado(true);
      });
      equipeDefensora.forEach((pokemon) => {
        pokemon.setPokeball(true);
        pokemon.setParado(true);
      });

      this.#invocaPokemon(
        atacante,
        defensor,
        pokemonAtacante,
        pokemonDefensor,
        pokemonSelvagem,
      );

      const pokemonVencedor = await this.#luta(
        pokemonAtacante,
        pokemonDefensor,
      );

      [pokemonAtacante, pokemonDefensor].forEach((pokemon) => {
        if (!pokemonDefensor.getTreinador()) return;
        const pokemonExistente = nocautes.find((p) => p.id === pokemon.getId());

        if (pokemonExistente) {
          pokemonExistente.nocaute +=
            pokemon.getId() === pokemonVencedor ? 1 : 0;
        } else {
          nocautes.push({
            id: pokemon.getId(),
            nocaute: pokemon.getId() === pokemonVencedor ? 1 : 0,
          });
        }
      });
    }

    const vencedor = atacante.getEquipe().every((poke) => poke.getVida() <= 0)
      ? defensor.getId()
      : atacante.getId();

    if (vencedor === atacante.getId()) {
      this.#verificaEstado(atacante, false);
      this.#ganhoExperiencia(atacante, nocautes, 2);

      if (pokemonSelvagem) {
        this.#vencePokemon(atacante, defensor, this.#agentes, this.#mapa);
      } else {
        this.#verificaEstado(defensor, true);
        this.#ganhoExperiencia(defensor, nocautes);
      }
    } else {
      this.#verificaEstado(atacante, true);
      this.#ganhoExperiencia(atacante, nocautes);

      if (pokemonSelvagem) {
        delete defensor.equipe;
        delete defensor.getEquipe;
        defensor.setParado(false);
        defensor.setDisponibilidade(true);
      } else {
        this.#verificaEstado(defensor, false);
        this.#ganhoExperiencia(defensor, nocautes, 2);
      }
    }
  }

  #escolhePokemon(equipeAtacante, equipeDefensor, selvagem, contador) {
    const vantagem = (pokemonsAtacante, pokemonDefensor) => {
      const tiposEficazes = pokemonDefensor
        .getTipos()
        .map((tipo) => tiposEficazesContra(tipo));

      const tiposEficazesFiltrados = tiposEficazes.reduce(
        (anterior, proximo) => {
          return [
            ...anterior,
            ...proximo.filter((prox) => !anterior.includes(prox)),
          ];
        },
      );

      const pokemonsEficazes = pokemonsAtacante.filter(
        (pokemon) =>
          pokemon
            .getTipos()
            .some((tipo) => tiposEficazesFiltrados.includes(tipo)) &&
          pokemon.getVida() > 0,
      );
      return pokemonsEficazes;
    };

    const nivel = (pokemons) =>
      pokemons
        .filter((pokemon) => pokemon.getVida() > 0)
        .sort((a, b) => b.getNivel() - a.getNivel());

    if (contador === 1 && !selvagem) {
      nivel(equipeAtacante);
      nivel(equipeDefensor);

      return {
        pokemonAtacante: equipeAtacante[0],
        pokemonDefensor: equipeDefensor[0],
      };
    }

    const eficazesAtacante = vantagem(equipeAtacante, equipeDefensor[0]);
    const nivelAtacante = nivel(
      eficazesAtacante.length ? eficazesAtacante : equipeAtacante,
    );
    this.#moveParaInicio(equipeAtacante, nivelAtacante[0]);

    const eficazesDefensora = vantagem(equipeDefensor, equipeAtacante[0]);
    const nivelDefensor = nivel(
      eficazesDefensora.length ? eficazesDefensora : equipeDefensor,
    );
    this.#moveParaInicio(equipeDefensor, nivelDefensor[0]);

    return {
      pokemonAtacante: equipeAtacante[0],
      pokemonDefensor: equipeDefensor[0],
    };
  }

  #moveParaInicio(equipe, pokemon) {
    const index = equipe.indexOf(pokemon);

    if (index > -1) {
      const [item] = equipe.splice(index, 1);
      equipe.unshift(item);
    }
  }

  #invocaPokemon(
    atacante,
    defensor,
    pokemonAtacante,
    pokemonDefensor,
    pokemonSelvagem,
  ) {
    this.#posicionaAgente(atacante, pokemonAtacante);
    this.#posicionaAgente(pokemonAtacante, pokemonDefensor);
    if (!pokemonSelvagem) this.#posicionaAgente(pokemonDefensor, defensor);

    this.#direcionaAgente(pokemonDefensor, pokemonAtacante);
    this.#direcionaAgente(pokemonAtacante, pokemonDefensor);
    this.#direcionaAgente(pokemonAtacante, atacante);
    if (!pokemonSelvagem) this.#direcionaAgente(pokemonDefensor, defensor);

    pokemonAtacante.setPokeball(false);
    pokemonDefensor.setPokeball(false);
  }

  #posicionaAgente(alvo, agente) {
    const t = alvo.getTamanho();

    const vizinhos = Vizinhos(this.#mapa, alvo, t, alvo.getAlgoritmo());

    if (vizinhos.length) {
      const novaPosicao = { x: vizinhos[0].x * t, y: vizinhos[0].y * t };
      agente.setPosicao(this.#clampPosicao(novaPosicao.x, novaPosicao.y, t));
    }
  }

  #direcionaAgente(alvo, agente) {
    const alvoPos = alvo.getPosicao();
    const agentePos = agente.getPosicao();

    if (alvoPos.x === agentePos.x) {
      if (alvoPos.y < agentePos.y) {
        agente.setDirecao("cima");
      } else {
        agente.setDirecao("baixo");
      }
    } else if (alvoPos.y === agentePos.y) {
      if (alvoPos.x < agentePos.x) {
        agente.setDirecao("esquerda");
      } else {
        agente.setDirecao("direita");
      }
    } else {
      const deltaX = agentePos.x - alvoPos.x;
      const deltaY = agentePos.y - alvoPos.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        agente.setDirecao(deltaX > 0 ? "esquerda" : "direita");
      } else {
        agente.setDirecao(deltaY > 0 ? "cima" : "baixo");
      }
    }
  }

  #clampPosicao(x, y, tamanho) {
    return {
      x: Math.max(0, Math.min(x, 2000 - tamanho)),
      y: Math.max(0, Math.min(y, 2000 - tamanho)),
    };
  }

  async #luta(pokemonAtacante, pokemonDefensor) {
    const promessas = [
      this.#ataque(pokemonAtacante, pokemonDefensor),
      this.#ataque(pokemonDefensor, pokemonAtacante),
    ];

    const vencedor = await Promise.race(promessas);
    return vencedor.getId();
  }

  #ataque(atacante, defensor) {
    return new Promise((resolve) => {
      const intervalo = setInterval(
        () => {
          const multiplicador = this.#multiplicadorTipo(atacante, defensor);
          const hit = this.#atacar(
            atacante,
            defensor,
            Math.max(0.5, multiplicador),
          );
          defensor.setVida(defensor.getVida() - hit);

          if (defensor.getVida() <= 0) {
            defensor.setPokeball(true);
            this.#intervalos.forEach(clearInterval);
            this.#intervalos = [];
            resolve(atacante);
          }
        },
        1000 /
          (atacante.getAtaques().basico.recarga *
            window.cronometro.multiplicador),
      );

      this.#intervalos.push(intervalo);
    });
  }

  #multiplicadorTipo(pokemonAtacante, pokemonDefensor) {
    const tipoAtacante = tipos[pokemonAtacante.getTipos()[0]];

    if (tipoAtacante) {
      const tiposDefensor = pokemonDefensor
        .getTipos()
        .map((tipo) => tipoAtacante[tipo]);

      const multiplicador = tiposDefensor.reduce((acc, item) => {
        return acc * item;
      });

      return multiplicador;
    }
  }

  #atacar(atacante, defensor, multiplicador) {
    const hit =
      atacante.getAtaques().basico.dano *
      (atacante.getAtaque() - defensor.getDefesa()) *
      multiplicador;

    return Math.max(1, hit);
  }

  #verificaEstado(treinador, perdeu) {
    const pokemon = treinador.getEquipe()[0];

    treinador.setParado(false);
    treinador.setDisponibilidade(true);

    pokemon.setDisponibilidade(true);
    pokemon.setParado(false);
    pokemon.setPokeball(false);
    pokemon.setDestino(null);
    pokemon.setCaminho([]);

    if (treinador.getResistencia() <= 0 || perdeu) {
      treinador.setDisponibilidade(false);
      pokemon.setPokeball(true);
      this.#voltaBase(treinador);
    }
  }

  #voltaBase(treinador) {
    treinador.setDestino(treinador.getBase());
    treinador.setCaminho([]);
  }

  #ganhoExperiencia(treinador, nocautes, multiplicadorVitoria = 1) {
    treinador.getEquipe().forEach((pokemon) => {
      const nocauteador = nocautes.find((poke) => poke.id === pokemon.getId());
      const nocaute = nocauteador?.nocaute || 0;

      const expericenciaLuta = 20 * multiplicadorVitoria;
      const expericenciaNocaute = 40 * multiplicadorVitoria * nocaute;

      const expericencia = expericenciaLuta + expericenciaNocaute;

      pokemon.setExperiencia(pokemon.getExperiencia() + expericencia);
    });
  }

  #vencePokemon(treinador, pokemon, agentes, mapa) {
    delete pokemon.equipe;
    delete pokemon.getEquipe;
    pokemon.setPokeball(true);
    pokemon.setTreinador(treinador);

    agentes.splice(
      agentes.findIndex((a) => a.getId() === pokemon.getId()),
      1,
    );
    atualizaPosicaoNaMatriz(
      mapa.getMatriz(),
      pokemon.getPosicao(),
      pokemon.getTamanho(),
      0,
    );

    if (treinador.getCapturouTodos()) return;

    treinador.setPokemons([...treinador.getPokemons(), pokemon]);
    if (treinador.getEquipe().length < 4) {
      treinador.setEquipe([...treinador.getEquipe(), pokemon]);
    }

    // // teste
    // const pokemonsFaltante = pokedex.filter(
    //   (poke) =>
    //     poke.estaAtivo &&
    //     !treinador.getPokemons().some((p) => p.getEspecie() === poke.especie),
    // );

    // console.log(pokemonsFaltante.map((p) => p.especie));
    // // teste
  }
}

export default Batalha;
