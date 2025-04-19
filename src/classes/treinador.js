import Agente from "./agente.js";
import { pokedex } from "../models/pokedex.js";
import { tiposEficazesContra } from "../utils/tipos.js";

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
    pf,
  ) {
    super(id, cor, tamanho, "humana", velocidade, visao, pf);

    this.resistenciaBase = resistencia;
    this.resistencia = resistencia;
    this.estrategia = estrategia;
    this.pokemons = pokemons;
    this.equipe = equipe;
  }

  acao(contexto, mapa, agentes) {
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
    const biomaAtual = biomas.forEach((bioma) => {
      const posicao = this.calculaDistancia(this.posicao, {
        x: bioma.posX,
        y: bioma.posY,
      });
      if (posicao <= 3) {
        return bioma.tipo;
      }
    });

    const tipos = Object.values(
      pokedex.reduce((acc, item) => {
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
        item.tipos.forEach((tipo) => {
          if (!acc[tipo]) {
            acc[tipo] = { tipo, quantidade: 0 };
          }
          acc[tipo].quantidade++;
        });
        return acc;
      }, {}),
    );

    tipos.forEach((tipoGeral) => {
      if (!tiposTreinador.find((t) => t.tipo === tipoGeral.tipo)) {
        tiposTreinador.push({ tipo: tipoGeral.tipo, quantidade: 0 });
      }
    });

    tiposTreinador.sort((a, b) => a.quantidade - b.quantidade);

    const menorQuantidade = tiposTreinador[0].quantidade;
    const maisEscassos = tiposTreinador.filter(
      (t) => t.quantidade === menorQuantidade && t.tipo !== biomaAtual,
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
          !this.pokemons.some((poke) => poke.especie === alvo.especie),
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
    if (alvoColisoes.length && alvoColisoes.some((a) => a === this.id)) {
      if (
        this.calculaDistancia(this.posicao, alvo.posicao) <=
        this.tamanho * 3
      ) {
        this.iniciaBatalha(alvo, agentes, mapa);
      }
    }
  }

  iniciaBatalha(alvo, agentes, mapa) {
    this.estaDisponivel = false;
    this.paraMovimento = true;
    this.resistencia--;

    alvo.estaDisponivel = false;
    alvo.paraMovimento = true;
    alvo.resistencia--;

    console.log(`Treinador #${this.id} Inicia Batalha`);

    setTimeout(() => {
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
    mapa.matriz.nodes[Math.floor(pokemon.posicao.y / mapa.celula)][
      Math.floor(pokemon.posicao.x / mapa.celula)
    ].agente = 0;

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
          !this.equipe.some((poke) => poke.especie === pokemon.especie),
      );

      const pokemonsEficazes = pokemonsDisponiveis.filter((pokemon) =>
        pokemon.tipos.some((tipo) => tiposEficazesFiltrados.includes(tipo)),
      );

      return pokemonsEficazes;
    };

    const nivel = (pokemons) => {
      const pokemonsDisponiveis = pokemons.filter(
        (pokemon) =>
          !this.equipe.some((poke) => poke.especie === pokemon.especie),
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
          !this.equipe.some((poke) => poke.especie === pokemon.especie),
      );
      const nivelFaltando = pokemonsDisponiveis.map((pokemon) => {
        return Number(pokemon.nivel) - Number(pokemon.evolucao);
      });
      const menor = Math.min(...nivelFaltando.map((p) => p));

      return pokemonsDisponiveis.filter(
        (pokemon) => Number(pokemon.nivel) - Number(pokemon.evolucao) === menor,
      );
    };

    const forte = (pokemons) => {
      const pokemonsDisponiveis = pokemons.filter(
        (pokemon) =>
          !this.equipe.some((poke) => poke.especie === pokemon.especie),
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
