import Agente from "./agente.js";
import { pokedex } from "../models/pokedex.js";
import {
  atualizaPosicaoNaMatriz,
  tiposEficazesContra,
} from "../utils/utils.js";

class Treinador extends Agente {
  constructor(
    id,
    cor,
    velocidade,
    resistencia,
    visao,
    estrategia,
    equipe,
    pokemons,
    tamanho,
    algoritimo,
  ) {
    super(id, cor, tamanho, "humana", algoritimo, velocidade, visao);

    this.resistenciaBase = resistencia;
    this.resistencia = resistencia;
    this.estrategia = estrategia;
    this.pokemons = pokemons;
    this.equipe = equipe;
    this.capturouTodos = false;
  }

  acao(contexto, mapa, agentes) {
    this.pokemons.forEach((pokemon) => {
      const evolucao = pokemon.verificaEvolucao();
      if (evolucao) this.pokemons.push(evolucao);

      if (!pokemon.pokeball) {
        pokemon.desenha(contexto);
      }
    });

    if (this.paraMovimento) {
      return;
    }

    if (!this.estaDisponivel) {
      const distanciaBase = this.calculaDistancia(this.posicao, this.base);

      if (distanciaBase <= 2) {
        console.log(`Treinador #${this.id} voltou para a base`);
        this.reset(mapa.biomas);
        return;
      }
    }

    this.verificaColisao(contexto, mapa, agentes);

    switch (this.movimento(mapa)) {
      case 0:
        // console.log(`${this.id} não achou`);
        this.destino = this.buscaBioma(mapa.biomas);
        break;
      case 1:
        // console.log(`${this.id} esta caminhando`);
        break;
      case 2:
        // console.log(`${this.id} chegou`);
        this.destino = this.buscaBioma(mapa.biomas);
        break;
    }
  }

  buscaBioma(biomas) {
    const tipos = this.tiposEscasso(biomas);
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const indice = this.indiceAleatorioPorTipo(biomas, tipo);

    const { posX, posY, largura, altura } = biomas[indice];

    const destinoX = Math.floor(posX + largura / 2);
    const destinoY = Math.floor(posY + altura / 2);

    return { x: destinoX, y: destinoY };
  }

  tiposEscasso(biomas) {
    const biomaAtual = biomas
      .map((bioma) => {
        const posicao = this.calculaDistancia(this.posicao, {
          x: bioma.posX + bioma.largura / 2,
          y: bioma.posY + bioma.altura / 2,
        });
        if (posicao <= 3) {
          return bioma.tipo;
        }
        return null;
      })
      .filter((tipo) => tipo);

    const tipos = Object.values(
      pokedex.reduce((acc, item) => {
        if (!item.estaAtivo) return acc;
        item.tipos.forEach((tipo) => {
          if (!acc[tipo]) {
            acc[tipo] = { tipo, quantidade: 0 };
          }
          acc[tipo].quantidade++;
        });
        return acc;
      }, {}),
    );

    const tiposTreinador = Object.values(
      this.pokemons.reduce((acc, item) => {
        if (!item.estaAtivo) return acc;
        item.tipos.forEach((tipo) => {
          if (!acc[tipo]) {
            acc[tipo] = { tipo, quantidade: 0 };
          }
          acc[tipo].quantidade++;
        });
        return acc;
      }, {}),
    );

    const tiposFaltantesTreinador = [];
    tipos.forEach((tipoGeral) => {
      const tipoTreinador = tiposTreinador.find(
        (t) => t.tipo === tipoGeral.tipo,
      );

      if (!tipoTreinador) {
        tiposFaltantesTreinador.push({
          tipo: tipoGeral.tipo,
          quantidade: tipoGeral.quantidade,
        });
      } else {
        const quantidadeFaltante =
          Number(tipoGeral.quantidade) - Number(tipoTreinador.quantidade);

        tiposFaltantesTreinador.push({
          tipo: tipoGeral.tipo,
          quantidade: quantidadeFaltante,
        });
      }
    });

    tiposFaltantesTreinador.sort((a, b) => b.quantidade - a.quantidade);

    const maiorQuantidadeFaltante = tiposFaltantesTreinador[0].quantidade;
    if (maiorQuantidadeFaltante === 0) {
      this.capturouTodos = true;
      return tipos.map((tipo) => tipo.tipo);
    }

    const maisEscassos = tiposFaltantesTreinador.filter(
      (t) => t.quantidade === maiorQuantidadeFaltante && t.tipo !== biomaAtual,
    );

    return maisEscassos.map((escasso) => escasso.tipo);
  }

  indiceAleatorioPorTipo(biomas, tipoDesejado) {
    const indices = biomas
      .map((bioma, index) => (bioma.tipos.includes(tipoDesejado) ? index : -1))
      .filter((index) => index !== -1);

    if (indices.length === 0) return -1;

    const aleatorio = Math.floor(Math.random() * indices.length);
    return indices[aleatorio];
  }

  verificaColisao(contexto, mapa, agentes) {
    const colisoes = this.detectaColisao(contexto, mapa);
    const alvo = this.colisaoMaisProxima(colisoes, agentes);

    if (alvo) {
      this.colide(alvo, contexto, mapa, agentes);
    }
  }

  colisaoMaisProxima(colisoes, agentes) {
    const candidatos = colisoes
      .map((id) => agentes.find((t) => t.id === id))
      .filter(
        (alvo) =>
          alvo &&
          alvo.estaDisponivel &&
          // eslint-disable-next-line prettier/prettier
          ( !this.pokemons.some((poke) => poke.especie === alvo.especie) || this.capturouTodos ),
      );

    let filtrados = candidatos.filter((alvo) => alvo.especie !== "humana");

    if (filtrados.length === 0) filtrados = candidatos;
    if (filtrados.length === 0) return null;

    return filtrados.reduce((proximo, atual) => {
      const distAtual = this.calculaDistancia(atual.posicao, this.posicao);
      const distMaisProx = this.calculaDistancia(proximo.posicao, this.posicao);

      return distAtual < distMaisProx ? atual : proximo;
    });
  }

  colide(alvo, contexto, mapa, agentes) {
    if (alvo.especie === "humana" && this.estrategia === "cauteloso") {
      return;
    }

    this.destino = alvo.posicao;

    if (this.caminho.length) {
      const ultimo = this.caminho[this.caminho.length - 1];
      const fim = { x: ultimo[0], y: ultimo[1] };
      const destino = {
        x: Math.floor(alvo.posicao.x / mapa.celula),
        y: Math.floor(alvo.posicao.y / mapa.celula),
      };
      const distancia = this.calculaDistancia(fim, destino);
      if (distancia > 3) {
        this.caminho = [];
      }
    }

    const alvoColisoes = alvo.detectaColisao(contexto, mapa);
    if (
      alvoColisoes.length &&
      alvoColisoes.some((a) => a === this.id) &&
      this.calculaDistancia(this.posicao, alvo.posicao) <= this.tamanho * 3
    ) {
      this.iniciaBatalha(alvo, agentes, mapa);
    }
  }

  iniciaBatalha(alvo, agentes, mapa) {
    this.estaDisponivel = false;
    this.paraMovimento = true;
    this.resistencia--;

    alvo.estaDisponivel = false;
    alvo.paraMovimento = true;
    alvo.resistencia--;

    /// /////////////////////////////// Para batalha
    const pokemons = this.invocaPokemon(alvo);
    this.verificaDirecao();

    setTimeout(() => {
      pokemons.forEach((p) => (p.pokeball = true));

      if (alvo.especie !== "humana") {
        this.vencePokemon(alvo, agentes, mapa);
        this.verificaEstado(this);
        return;
      }

      const id = Math.random() < 0.5 ? this.id : alvo.id;
      if (id === this.id) {
        console.log(`Treinador #${this.id} venceu a batalha`);
        alvo.equipe.forEach((pokemon) => (pokemon.vida = 0));
      } else {
        console.log(`Agente #${alvo.id} venceu a batalha`);
        this.equipe.forEach((pokemon) => (pokemon.vida = 0));
      }

      this.verificaEstado(this);
      this.verificaEstado(alvo);
    }, 2000 / globalThis.multiplicador);
  }

  verificaDirecao() {
    const pokemon = this.equipe[0];
    const dx = pokemon.posicao.x - this.posicao.x;
    const dy = pokemon.posicao.y - this.posicao.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.direcao = dx > 0 ? "direita" : "esquerda";

      if (this.posicao === pokemon.posicao) {
        this.posicao = {
          x: this.posicao.x + this.tamanho * Math.sign(dx),
          y: this.posicao.y,
        };
      }
    } else {
      this.direcao = dy > 0 ? "baixo" : "cima";
      this.posicao = {
        x: this.posicao.x,
        y: this.posicao.y + this.tamanho * Math.sign(dx),
      };
    }
  }

  invocaPokemon(alvo) {
    const pokemonAtacante = this.equipe[0];
    const pokemonDefensor = alvo.especie !== "humana" ? alvo : alvo.equipe[0];

    this.posicionaPokemons(alvo, pokemonDefensor, pokemonAtacante);
    this.direcionaPokemons(pokemonAtacante, pokemonDefensor);

    pokemonAtacante.pokeball = false;
    pokemonDefensor.pokeball = false;

    return [pokemonAtacante, pokemonDefensor];
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

    // Verifica se os pokemons não estão saindo do mapa
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
      // caso estejam em posição diagonal, pode calcular com base na diferença dos eixos
      const deltaX = d.x - a.x;
      const deltaY = d.y - a.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // prioriza horizontal
        pokemonAtacante.direcao = deltaX > 0 ? "direita" : "esquerda";
        pokemonDefensor.direcao = deltaX > 0 ? "esquerda" : "direita";
      } else {
        // prioriza vertical
        pokemonAtacante.direcao = deltaY > 0 ? "baixo" : "cima";
        pokemonDefensor.direcao = deltaY > 0 ? "cima" : "baixo";
      }
    }
  }

  verificaEstado(treinador) {
    treinador.paraMovimento = false;
    treinador.estaDisponivel = true;

    if (
      treinador.resistencia <= 0 ||
      treinador.equipe.every((pokemon) => pokemon.vida <= 0)
    ) {
      treinador.estaDisponivel = false;
      treinador.voltaBase(treinador);
    }
  }

  vencePokemon(pokemon, agentes, mapa) {
    agentes.splice(
      agentes.findIndex((a) => a.id === pokemon.id),
      1,
    );
    atualizaPosicaoNaMatriz(mapa.matriz, pokemon.posicao, this.tamanho, 0);

    if (this.capturouTodos) return;

    this.pokemons.push(pokemon);
    if (this.equipe.length < 4) {
      this.equipe.push(pokemon);
    }
  }

  voltaBase(treinador) {
    treinador.estaDisponivel = false;
    treinador.paraMovimento = false;
    treinador.destino = treinador.base;
    treinador.caminho = [];
  }

  /// /////////////////////////////// Para batalha

  montaEquipe(biomas) {
    if (this.equipe.length < 4) return;

    const eficazes = () => {
      const tipoEscasso = this.tiposEscasso(biomas);
      const tiposEficazes = tipoEscasso.map((escasso) =>
        tiposEficazesContra(escasso),
      );

      const tiposEficazesFiltrados = tiposEficazes.reduce(
        (anterior, proximo) => {
          return [
            ...anterior,
            ...proximo.filter((prox) => !anterior.includes(prox)),
          ];
        },
      );

      const pokemonsDisponiveis = this.pokemons.filter(
        (pokemon) =>
          !this.equipe.some((poke) => poke.especie === pokemon.especie) &&
          pokemon.estaAtivo,
      );

      const pokemonsEficazes = pokemonsDisponiveis.filter((pokemon) =>
        pokemon.tipos.some((tipo) => tiposEficazesFiltrados.includes(tipo)),
      );

      return pokemonsEficazes;
    };

    const nivel = (pokemons) => {
      const pokemonsDisponiveis = pokemons.filter(
        (pokemon) =>
          !this.equipe.some((poke) => poke.especie === pokemon.especie) &&
          pokemon.estaAtivo,
      );
      const xpFaltando = pokemonsDisponiveis.map((pokemon) => {
        return Number(pokemon.nivel) * 10 + 90 - Number(pokemon.experiencia);
      });
      const menorXP = Math.min(...xpFaltando.map((p) => p));

      return pokemonsDisponiveis.filter(
        (pokemon) =>
          Number(pokemon.nivel) * 10 + 90 - Number(pokemon.experiencia) ===
          menorXP,
      );
    };

    const evoluir = (pokemons) => {
      const pokemonsDisponiveis = pokemons.filter(
        (pokemon) =>
          !this.equipe.some((poke) => poke.especie === pokemon.especie) &&
          pokemon.estaAtivo,
      );
      const nivelFaltando = pokemonsDisponiveis.map((pokemon) => {
        if (!pokemon.evolucao) return null;
        return Number(pokemon.nivel) - Number(pokemon.evolucao.nivel);
      });
      const menor = Math.min(
        ...nivelFaltando.filter((p) => typeof p === "number"),
      );

      return pokemonsDisponiveis.filter(
        (pokemon) => Number(pokemon.nivel) - Number(pokemon.evolucao) === menor,
      );
    };

    const forte = (pokemons) => {
      const pokemonsDisponiveis = pokemons.filter(
        (pokemon) =>
          !this.equipe.some((poke) => poke.especie === pokemon.especie) &&
          pokemon.estaAtivo,
      );
      const forca = pokemonsDisponiveis.map((pokemon) => {
        return (
          Number(pokemon.vida) * 0.5 +
          Number(pokemon.ataque) * 2 +
          Number(pokemon.defesa) * 1
        );
      });
      const maiorForca = Math.max(...forca.map((p) => p));

      return pokemonsDisponiveis.filter(
        (pokemon) =>
          Number(pokemon.vida) * 0.5 +
            Number(pokemon.ataque) * 2 +
            Number(pokemon.defesa) * 1 ===
          maiorForca,
      );
    };

    this.equipe.length = 0;
    while (this.equipe.length < 4) {
      let pokemonsEficazes, pokemonsNivel, pokemonsEvoluir, pokemonsForte;

      if (this.capturouTodos) {
        pokemonsEvoluir = evoluir(this.pokemons);
        if (pokemonsEvoluir.length === 1) {
          this.equipe.push(pokemonsEvoluir[0]);
          continue;
        }

        pokemonsForte = forte(
          pokemonsEvoluir.length ? pokemonsEvoluir : this.pokemons,
        );
        this.equipe.push(
          pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
        );
        continue;
      }

      switch (this.equipe.length) {
        case 0:
          pokemonsEficazes = eficazes();
          if (pokemonsEficazes.length === 1) {
            this.equipe.push(pokemonsEficazes[0]);
            break;
          }

          pokemonsNivel = nivel(
            pokemonsEficazes.length ? pokemonsEficazes : this.pokemons,
          );
          if (pokemonsNivel.length === 1) {
            this.equipe.push(pokemonsNivel[0]);
            break;
          }

          pokemonsEvoluir = evoluir(
            pokemonsNivel.length ? pokemonsNivel : this.pokemons,
          );
          if (pokemonsEvoluir.length === 1) {
            this.equipe.push(pokemonsEvoluir[0]);
            break;
          }

          pokemonsForte = forte(
            pokemonsEvoluir.length ? pokemonsEvoluir : this.pokemons,
          );
          this.equipe.push(
            pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
          );
          break;

        case 1:
          pokemonsEficazes = eficazes();
          if (pokemonsEficazes.length === 1) {
            this.equipe.push(pokemonsEficazes[0]);
            break;
          }

          pokemonsNivel = nivel(
            pokemonsEficazes.length ? pokemonsEficazes : this.pokemons,
          );
          if (pokemonsNivel.length === 1) {
            this.equipe.push(pokemonsNivel[0]);
            break;
          }

          pokemonsEvoluir = evoluir(
            pokemonsNivel.length ? pokemonsNivel : this.pokemons,
          );
          if (pokemonsEvoluir.length === 1) {
            this.equipe.push(pokemonsEvoluir[0]);
            break;
          }

          pokemonsForte = forte(
            pokemonsEvoluir.length ? pokemonsEvoluir : this.pokemons,
          );
          this.equipe.push(
            pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
          );
          break;

        case 2:
          pokemonsNivel = nivel(this.pokemons);
          if (pokemonsNivel.length === 1) {
            this.equipe.push(pokemonsNivel[0]);
            break;
          }

          pokemonsEvoluir = evoluir(
            pokemonsNivel.length ? pokemonsNivel : this.pokemons,
          );
          if (pokemonsEvoluir.length === 1) {
            this.equipe.push(pokemonsEvoluir[0]);
            break;
          }

          pokemonsForte = forte(
            pokemonsEvoluir.length ? pokemonsEvoluir : this.pokemons,
          );
          this.equipe.push(
            pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
          );
          break;

        case 3:
          pokemonsEvoluir = evoluir(this.pokemons);
          if (pokemonsEvoluir.length === 1) {
            this.equipe.push(pokemonsEvoluir[0]);
            break;
          }

          pokemonsForte = forte(
            pokemonsEvoluir.length ? pokemonsEvoluir : this.pokemons,
          );
          this.equipe.push(
            pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
          );
          break;
      }
    }
  }

  reset(biomas) {
    this.paraMovimento = true;
    this.caminho = [];

    const tempoNaBase = this.resistenciaBase - this.resistencia;
    setTimeout(
      () => {
        this.montaEquipe(biomas);
        this.estaDisponivel = true;
        this.paraMovimento = false;
        this.resistencia = Number(this.resistenciaBase);
      },
      (tempoNaBase * 2000) / globalThis.multiplicador,
    );
  }

  calculaDistancia(posicao, destino) {
    const dx = destino.x - posicao.x;
    const dy = destino.y - posicao.y;

    return Math.hypot(dx, dy);
  }
}

export default Treinador;
