import { tipos } from "../models/tipos.js";
import {
  atualizaPosicaoNaMatriz,
  tiposEficazesContra,
} from "../utils/utils.js";

class Batalha {
  constructor(mapa, agentes) {
    this.mapa = mapa;
    this.agentes = agentes;
    this.intervalos = [];
  }

  async batalha(atacante, defensor) {
    const pokemonSelvagem = defensor.especie !== "humana";
    if (pokemonSelvagem) defensor.equipe = [defensor];

    const nocautes = [];
    let contadorLuta = 0;

    while (true) {
      if (
        atacante.equipe.every((poke) => poke.vida <= 0) ||
        defensor.equipe.every((poke) => poke.vida <= 0)
      ) {
        break;
      }
      contadorLuta++;

      const { pokemonAtacante, pokemonDefensor } = this.escolhePokemon(
        atacante.equipe,
        defensor.equipe,
        pokemonSelvagem,
        contadorLuta,
      );
      this.invocaPokemon(atacante, pokemonAtacante, pokemonDefensor);

      if (!pokemonSelvagem) this.direcionaTreinador(defensor, pokemonDefensor);

      const pokemonVencedor = await this.luta(pokemonAtacante, pokemonDefensor);
      if (!pokemonSelvagem) pokemonDefensor.pokeball = true;
      pokemonAtacante.pokeball = true;

      [pokemonAtacante, pokemonDefensor].forEach((pokemon) => {
        const pokemonExistente = nocautes.find((p) => p.id === pokemon.id);

        if (pokemonExistente) {
          pokemonExistente.nocaute += pokemon.id === pokemonVencedor ? 1 : 0;
        } else {
          nocautes.push({
            id: pokemon.id,
            nocaute: pokemon.id === pokemonVencedor ? 1 : 0,
          });
        }
      });
    }

    const vencedor = atacante.equipe.every((poke) => poke.vida <= 0)
      ? defensor.id
      : atacante.id;

    if (vencedor === atacante.id) {
      this.verificaEstado(atacante, false);
      this.ganhoExperiencia(atacante, nocautes, 2);

      if (pokemonSelvagem) {
        this.vencePokemon(atacante, defensor, this.agentes, this.mapa);
      } else {
        this.verificaEstado(defensor, true);
        this.ganhoExperiencia(defensor, nocautes);
      }
    } else {
      this.verificaEstado(atacante, true);
      this.ganhoExperiencia(atacante, nocautes);

      if (pokemonSelvagem) {
        delete defensor.equipe;
        defensor.paraMovimento = false;
        defensor.estaDisponivel = true;
      } else {
        this.verificaEstado(defensor, false);
        this.ganhoExperiencia(defensor, nocautes, 2);
      }
    }
  }

  async luta(pokemonAtacante, pokemonDefensor) {
    const promessas = [
      this.ataque(pokemonAtacante, pokemonDefensor),
      this.ataque(pokemonDefensor, pokemonAtacante),
    ];

    const vencedor = await Promise.race(promessas);
    return vencedor.id;
  }

  ataque(atacante, defensor) {
    return new Promise((resolve) => {
      const intervalo = setInterval(
        () => {
          const multiplicador = this.multiplicadorTipo(atacante, defensor);
          const hit = this.atacar(
            atacante,
            defensor,
            Math.max(0.5, multiplicador),
          );
          defensor.vida -= hit;

          if (defensor.vida <= 0) {
            this.intervalos.forEach(clearInterval);
            this.intervalos = [];
            resolve(atacante);
          }
        },
        1000 / (atacante.ataques.basico.recarga * globalThis.multiplicador),
      );

      this.intervalos.push(intervalo);
    });
  }

  multiplicadorTipo(pokemonAtacante, pokemonDefensor) {
    const tipoAtacante = tipos[pokemonAtacante.tipos[0]];

    if (tipoAtacante) {
      const tiposDefensor = pokemonDefensor.tipos.map(
        (tipo) => tipoAtacante[tipo],
      );

      const multiplicador = tiposDefensor.reduce((acc, item) => {
        return acc * item;
      });

      return multiplicador;
    }
  }

  atacar(atacante, defensor, multiplicador) {
    return (
      atacante.ataques.basico.dano *
      (atacante.ataque - defensor.defesa) *
      multiplicador
    );
  }

  ganhoExperiencia(treinador, nocautes, multiplicadorVitoria = 1) {
    treinador.equipe.forEach((pokemon) => {
      const nocauteador = nocautes.find((poke) => poke.id === pokemon.id);
      if (nocauteador) {
        pokemon.experiencia +=
          20 * multiplicadorVitoria +
          40 * multiplicadorVitoria * nocauteador.nocaute;

        pokemon.sobeNivel(treinador);
      }
    });
  }

  vencePokemon(treinador, pokemon, agentes, mapa) {
    delete pokemon.equipe;
    pokemon.pokeball = true;

    agentes.splice(
      agentes.findIndex((a) => a.id === pokemon.id),
      1,
    );
    atualizaPosicaoNaMatriz(mapa.matriz, pokemon.posicao, pokemon.tamanho, 0);

    if (treinador.capturouTodos) return;

    treinador.pokemons.push(pokemon);
    if (treinador.equipe.length < 4) {
      treinador.equipe.push(pokemon);
    }
  }

  escolhePokemon(equipeAtacante, equipeDefensor, selvagem, contador) {
    const vantagem = (pokemonsAtacante, pokemonDefensor) => {
      const tiposEficazes = pokemonDefensor.tipos.map((tipo) =>
        tiposEficazesContra(tipo),
      );

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
          pokemon.tipos.some((tipo) => tiposEficazesFiltrados.includes(tipo)) &&
          pokemon.vida > 0,
      );
      return pokemonsEficazes;
    };

    const nivel = (pokemons) =>
      pokemons
        .filter((pokemon) => pokemon.vida > 0)
        .sort((a, b) => b.nivel - a.nivel);

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
    this.moveParaInicio(equipeAtacante, nivelAtacante[0]);

    const eficazesDefensora = vantagem(equipeDefensor, equipeAtacante[0]);
    const nivelDefensor = nivel(
      eficazesDefensora.length ? eficazesDefensora : equipeDefensor,
    );
    this.moveParaInicio(equipeDefensor, nivelDefensor[0]);

    return {
      pokemonAtacante: equipeAtacante[0],
      pokemonDefensor: equipeDefensor[0],
    };
  }

  moveParaInicio(equipe, pokemon) {
    const index = equipe.indexOf(pokemon);

    if (index > -1) {
      const [item] = equipe.splice(index, 1);
      equipe.unshift(item);
    }
  }

  invocaPokemon(atacante, pokemonAtacante, pokemonDefensor) {
    this.posicionaPokemons(atacante, pokemonDefensor, pokemonAtacante);
    this.direcionaPokemons(pokemonAtacante, pokemonDefensor);

    pokemonAtacante.pokeball = false;
    pokemonDefensor.pokeball = false;
  }

  posicionaPokemons(alvo, pokemonAtacante, pokemonDefensor) {
    const t = alvo.tamanho;
    let posAtacante, posDefensor;

    switch (alvo.direcao) {
      case "cima":
        posDefensor = { x: alvo.posicao.x, y: alvo.posicao.y - t };
        posAtacante = { x: alvo.posicao.x, y: alvo.posicao.y - t * 2 };
        break;
      case "baixo":
        posDefensor = { x: alvo.posicao.x, y: alvo.posicao.y + t };
        posAtacante = { x: alvo.posicao.x, y: alvo.posicao.y + t * 2 };
        break;
      case "direita":
        posDefensor = { x: alvo.posicao.x + t, y: alvo.posicao.y };
        posAtacante = { x: alvo.posicao.x + t * 2, y: alvo.posicao.y };
        break;
      case "esquerda":
        posDefensor = { x: alvo.posicao.x - t, y: alvo.posicao.y };
        posAtacante = { x: alvo.posicao.x - t * 2, y: alvo.posicao.y };
        break;
    }

    pokemonDefensor.posicao = this.clampPosicao(
      posDefensor.x,
      posDefensor.y,
      t,
    );
    pokemonAtacante.posicao = this.clampPosicao(
      posAtacante.x,
      posAtacante.y,
      t,
    );
  }

  clampPosicao(x, y, tamanho) {
    return {
      x: Math.max(0, Math.min(x, 2000 - tamanho)),
      y: Math.max(0, Math.min(y, 2000 - tamanho)),
    };
  }

  direcionaPokemons(pokemonAtacante, pokemonDefensor) {
    const a = pokemonAtacante.posicao;
    const d = pokemonDefensor.posicao;

    if (a.x === d.x) {
      if (a.y < d.y) {
        pokemonAtacante.direcao = "baixo";
        pokemonDefensor.direcao = "cima";
      } else {
        pokemonAtacante.direcao = "cima";
        pokemonDefensor.direcao = "baixo";
      }
    } else if (a.y === d.y) {
      if (a.x < d.x) {
        pokemonAtacante.direcao = "direita";
        pokemonDefensor.direcao = "esquerda";
      } else {
        pokemonAtacante.direcao = "esquerda";
        pokemonDefensor.direcao = "direita";
      }
    } else {
      const deltaX = d.x - a.x;
      const deltaY = d.y - a.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        pokemonAtacante.direcao = deltaX > 0 ? "direita" : "esquerda";
        pokemonDefensor.direcao = deltaX > 0 ? "esquerda" : "direita";
      } else {
        pokemonAtacante.direcao = deltaY > 0 ? "baixo" : "cima";
        pokemonDefensor.direcao = deltaY > 0 ? "cima" : "baixo";
      }
    }
  }

  direcionaTreinador(treinador, pokemon) {
    const dx = pokemon.posicao.x - treinador.posicao.x;
    const dy = pokemon.posicao.y - treinador.posicao.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      treinador.direcao = dx > 0 ? "direita" : "esquerda";

      if (treinador.posicao === pokemon.posicao) {
        treinador.posicao = {
          x: treinador.posicao.x + treinador.tamanho * Math.sign(dx),
          y: treinador.posicao.y,
        };
      }
    } else {
      treinador.direcao = dy > 0 ? "baixo" : "cima";
      treinador.posicao = {
        x: treinador.posicao.x,
        y: treinador.posicao.y + treinador.tamanho * Math.sign(dx),
      };
    }
  }

  verificaEstado(treinador, perdeu) {
    treinador.paraMovimento = false;
    treinador.estaDisponivel = true;

    if (treinador.resistencia <= 0 || perdeu) {
      treinador.estaDisponivel = false;
      this.voltaBase(treinador);
    }
  }

  voltaBase(treinador) {
    treinador.estaDisponivel = false;
    treinador.paraMovimento = false;
    treinador.destino = treinador.base;
    treinador.caminho = [];
  }
}

export default Batalha;
