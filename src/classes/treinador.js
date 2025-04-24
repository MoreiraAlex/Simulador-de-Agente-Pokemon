import Agente from "./agente.js";
import Batalha from "./batalha.js";
import { pokedex } from "../models/pokedex.js";
import { tiposEficazesContra } from "../utils/utils.js";

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

  iniciaBatalha(alvo, agentes, mapa, contexto) {
    this.estaDisponivel = false;
    this.paraMovimento = true;
    this.resistencia--;

    alvo.estaDisponivel = false;
    alvo.paraMovimento = true;
    alvo.resistencia--;

    try {
      const batalha = new Batalha(mapa, agentes, contexto);
      batalha.batalha(this, alvo).then();
    } catch (error) {
      console.log(error);
    }
  }

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
        this.estaDisponivel = true;
        this.paraMovimento = false;
        this.resistencia = this.resistenciaBase;
        this.pokemons.forEach((pokemon) => (pokemon.vida = pokemon.vidaBase));
        this.montaEquipe(biomas);
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
