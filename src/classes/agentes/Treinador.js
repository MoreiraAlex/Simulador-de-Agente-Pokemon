import { pokedex } from "../../models/pokedex.js";
import { calculaDistancia, tiposEficazesContra } from "../../utils/utils.js";
import Batalha from "../Batalha.js";
import Agente from "./Agente.js";

class Treinador extends Agente {
  #cor;
  #resistenciaBase;
  #resistencia;
  #estrategia;
  #equipe;
  #pokemons;
  #base;
  #capturouTodos;

  constructor(
    id,
    especie,
    tamanho,
    algoritmo,
    velocidade,
    visao,
    cor,
    resistencia,
    estrategia,
    equipe,
    pokemons,
  ) {
    super(id, especie, tamanho, algoritmo, velocidade, visao);

    this.#cor = cor;
    this.#resistenciaBase = resistencia;
    this.#resistencia = resistencia;
    this.#estrategia = estrategia;
    this.#equipe = equipe;
    this.#pokemons = pokemons;
  }

  iniciar() {
    super.iniciar();
    this.#capturouTodos = false;
  }

  atualizar(atributo, valor) {
    super.atualizar(atributo, valor);
    switch (atributo) {
      case "resistencia":
        this.#resistenciaBase = valor;
        break;
    }
  }

  acao(contexto, mapa, agentes) {
    this.desenha(contexto);

    this.#pokemons.forEach((pokemon) => {
      pokemon.verificaExperiencia(this);
      if (!pokemon.getPokeball()) {
        pokemon.acao(contexto, mapa);
      }
    });

    if (this.getParado()) {
      return;
    }

    if (!this.getDisponibilidade()) {
      const distanciaBase = calculaDistancia(this.getPosicao(), this.#base);

      if (distanciaBase <= 2) {
        console.log(`Treinador #${this.getId()} voltou para a base`);
        this.#reset(mapa.getBiomas());
        return;
      }
    }

    this.#verificaColisao(contexto, mapa, agentes);

    switch (this.movimento(mapa)) {
      case 0:
        // console.log(`${this.id} não achou`);
        this.setDestino(this.#buscaBioma(mapa.getBiomas()));
        break;
      case 1:
        // console.log(`${this.id} esta caminhando`);
        break;
      case 2:
        // console.log(`${this.id} chegou`);
        this.setDestino(this.#buscaBioma(mapa.getBiomas()));
        break;
    }
  }

  #verificaColisao(contexto, mapa, agentes) {
    const colisoes = this.detectaColisao(contexto, mapa);
    const alvo = this.#colisaoMaisProxima(colisoes, agentes);

    if (alvo) {
      this.colide(alvo, contexto, mapa, agentes);
    }
  }

  #colisaoMaisProxima(colisoes, agentes) {
    const candidatos = colisoes
      .map((id) => agentes.find((t) => t.getId() === id))
      .filter(
        (alvo) =>
          alvo &&
          alvo.getDisponibilidade() &&
          // eslint-disable-next-line prettier/prettier
          ( !this.#pokemons.some((poke) => poke.getEspecie() === alvo.getEspecie()) || this.#capturouTodos ),
      );

    let filtrados = candidatos.filter(
      (alvo) => alvo.getEspecie() !== "Treinador",
    );

    if (filtrados.length === 0) filtrados = candidatos;
    if (filtrados.length === 0) return null;

    return filtrados.reduce((proximo, atual) => {
      const distAtual = calculaDistancia(atual.getPosicao(), this.getPosicao());
      const distMaisProx = calculaDistancia(
        proximo.getPosicao(),
        this.getPosicao(),
      );

      return distAtual < distMaisProx ? atual : proximo;
    });
  }

  colide(alvo, contexto, mapa, agentes) {
    if (alvo.getEspecie() === "Treinador" && this.#estrategia === "cauteloso") {
      return;
    }

    this.setDestino(alvo.getPosicao());

    if (this.getCaminho().length) {
      const caminho = this.getCaminho();
      const ultimo = caminho[caminho.length - 1];
      const fim = { x: ultimo[0], y: ultimo[1] };
      const destino = {
        x: Math.floor(alvo.getPosicao().x / this.getTamanho()),
        y: Math.floor(alvo.getPosicao().y / this.getTamanho()),
      };
      const distancia = calculaDistancia(fim, destino);
      if (distancia > 3) {
        this.setCaminho([]);
      }
    }

    const alvoColisoes = alvo.detectaColisao(contexto, mapa);
    if (
      alvoColisoes.length &&
      alvoColisoes.some((a) => a === this.getId()) &&
      calculaDistancia(this.getPosicao(), alvo.getPosicao()) <=
        this.getTamanho() * 3
    ) {
      this.#iniciaBatalha(alvo, agentes, mapa);
    }
  }

  #iniciaBatalha(alvo, agentes, mapa) {
    this.setDisponibilidade(false);
    this.setParado(true);
    this.#resistencia--;

    alvo.setDisponibilidade(false);
    alvo.setParado(true);

    if (alvo.getEspecie() === "Treinador") {
      alvo.setResistencia(alvo.getResistencia() - 1);
    }

    try {
      const batalha = new Batalha(mapa, agentes);
      batalha.batalha(this, alvo).then();
    } catch (error) {
      console.log(error);
    }
  }

  #buscaBioma(biomas) {
    const tipos = this.#tiposEscasso(biomas);
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const indice = this.#indiceAleatorioPorTipo(biomas, tipo);

    // const { x, y, largura, altura } = biomas[indice];

    // const destinoX = Math.floor(x + largura / 2);
    // const destinoY = Math.floor(y + altura / 2);

    // return { x: destinoX, y: destinoY };

    const { centro } = biomas[indice];
    return { x: centro.x, y: centro.y };
  }

  #tiposEscasso(biomas) {
    const biomaAtual = biomas.find((bioma) => {
      const dentroX =
        this.getPosicao().x >= bioma.x &&
        this.getPosicao().x <= bioma.x + bioma.largura;
      const dentroY =
        this.getPosicao().y >= bioma.y &&
        this.getPosicao().y <= bioma.y + bioma.altura;
      return dentroX && dentroY;
    })?.tipos;

    const tipos = Object.values(
      pokedex.reduce((acc, item) => {
        if (!item.estaAtivo) return acc;
        if (!acc[item.tipos[0]]) {
          acc[item.tipos[0]] = { tipo: item.tipos[0], quantidade: 0 };
        }
        acc[item.tipos[0]].quantidade++;
        return acc;
      }, {}),
    );

    const pokemonsFaltante = pokedex.filter(
      (poke) =>
        poke.estaAtivo &&
        !this.#pokemons.some((p) => p.getEspecie() === poke.especie),
    );

    if (!pokemonsFaltante.length) {
      this.#capturouTodos = true;
      return tipos.map((tipo) => tipo.tipo);
    }

    const tiposTreinador = Object.values(
      this.#pokemons.reduce((acc, item) => {
        if (!item.getEstado()) return acc;
        if (!acc[item.getTipos()[0]]) {
          acc[item.getTipos()[0]] = {
            tipo: item.getTipos()[0],
            quantidade: 0,
          };
        }
        acc[item.getTipos()[0]].quantidade++;
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

    const tiposFaltantesOrdenados = tiposFaltantesTreinador.sort(
      (a, b) => b.quantidade - a.quantidade,
    );

    const maiorQuantidade = tiposFaltantesOrdenados[0].quantidade;
    // if (maiorQuantidade === 0) {
    //   this.#capturouTodos = true;
    //   return tipos.map((tipo) => tipo.tipo);
    // }

    const tiposFaltantesFiltrados = tiposFaltantesTreinador.filter(
      (t) => !biomaAtual.includes(t.tipo) && t.quantidade > 0,
    );

    if (!tiposFaltantesFiltrados.length) {
      const escassos = tiposFaltantesOrdenados.filter(
        (t) => t.quantidade === maiorQuantidade,
      );

      return escassos.map((escasso) => escasso.tipo);
    }

    const maiorQuantidadeFaltante = tiposFaltantesFiltrados[0].quantidade;
    const maisEscassos = tiposFaltantesTreinador.filter(
      (t) =>
        t.quantidade === maiorQuantidadeFaltante &&
        !biomaAtual.includes(t.tipo),
    );

    return maisEscassos.map((escasso) => escasso.tipo);
  }

  #indiceAleatorioPorTipo(biomas, tipoDesejado) {
    const indices = biomas
      .map((bioma, index) => (bioma.tipos.includes(tipoDesejado) ? index : -1))
      .filter((index) => index !== -1);

    if (indices.length === 0) return -1;

    const aleatorio = Math.floor(Math.random() * indices.length);
    return indices[aleatorio];
  }

  #reset(biomas) {
    this.setParado(true);
    this.setCaminho([]);

    const tempoNaBase = this.#resistenciaBase - this.#resistencia;
    setTimeout(
      () => {
        this.setDisponibilidade(true);
        this.setParado(false);

        this.#resistencia = this.#resistenciaBase;
        this.#pokemons.forEach((pokemon) => {
          pokemon.setVida(pokemon.getVidaBase());
          pokemon.setPokeball(true);
        });
        this.#montaEquipe(biomas);
        this.#equipe[0].setPokeball(false);
      },
      (tempoNaBase * 2000) / window.cronometro.multiplicador,
    );
  }

  // #montaEquipe(biomas) {
  //   if (this.#equipe.length < 4) return;

  //   const eficazes = () => {
  //     const tipoEscasso = this.#tiposEscasso(biomas);
  //     const tiposEficazes = tipoEscasso.map((escasso) =>
  //       tiposEficazesContra(escasso),
  //     );

  //     const tiposEficazesFiltrados = tiposEficazes.reduce(
  //       (anterior, proximo) => {
  //         return [
  //           ...anterior,
  //           ...proximo.filter((prox) => !anterior.includes(prox)),
  //         ];
  //       },
  //     );

  //     const pokemonsDisponiveis = this.#pokemons.filter(
  //       (pokemon) =>
  //         !this.#equipe.some(
  //           (poke) => poke.getEspecie() === pokemon.getEspecie(),
  //         ) && pokemon.getEstado(),
  //     );

  //     const pokemonsEficazes = pokemonsDisponiveis.filter((pokemon) =>
  //       pokemon
  //         .getTipos()
  //         .some((tipo) => tiposEficazesFiltrados.includes(tipo)),
  //     );

  //     return pokemonsEficazes;
  //   };

  //   // const nivel = (pokemons) => {
  //   //   const pokemonsDisponiveis = pokemons.filter(
  //   //     (pokemon) =>
  //   //       !this.#equipe.some(
  //   //         (poke) => poke.getEspecie() === pokemon.getEspecie(),
  //   //       ) && pokemon.getEstado(),
  //   //   );
  //   //   const xpFaltando = pokemonsDisponiveis.map((pokemon) => {
  //   //     return (
  //   //       Number(pokemon.getNivel()) * 10 +
  //   //       90 -
  //   //       Number(pokemon.getExperiencia())
  //   //     );
  //   //   });
  //   //   const menorXP = Math.min(...xpFaltando.map((p) => p));

  //   //   return pokemonsDisponiveis.filter(
  //   //     (pokemon) =>
  //   //       Number(pokemon.getNivel()) * 10 +
  //   //         90 -
  //   //         Number(pokemon.getExperiencia()) ===
  //   //       menorXP,
  //   //   );
  //   // };

  //   const evoluir = (pokemons) => {
  //     const pokemonsDisponiveis = pokemons.filter(
  //       (pokemon) =>
  //         !this.#equipe.some(
  //           (poke) => poke.getEspecie() === pokemon.getEspecie(),
  //         ) && pokemon.getEstado(),
  //     );
  //     const nivelFaltando = pokemonsDisponiveis.map((pokemon) => {
  //       if (!pokemon.getEvolucao()) return null;
  //       return Number(pokemon.getNivel()) - Number(pokemon.getEvolucao().nivel);
  //     });
  //     const menor = Math.min(
  //       ...nivelFaltando.filter((p) => typeof p === "number"),
  //     );

  //     return pokemonsDisponiveis.filter(
  //       (pokemon) =>
  //         Number(pokemon.getNivel()) - Number(pokemon.getEvolucao()) === menor,
  //     );
  //   };

  //   const forte = (pokemons) => {
  //     const pokemonsDisponiveis = pokemons.filter(
  //       (pokemon) =>
  //         !this.#equipe.some(
  //           (poke) => poke.getEspecie() === pokemon.getEspecie(),
  //         ) && pokemon.getEstado(),
  //     );
  //     const forca = pokemonsDisponiveis.map((pokemon) => {
  //       return (
  //         Number(pokemon.getVida()) * 0.5 +
  //         Number(pokemon.getAtaque()) * 2 +
  //         Number(pokemon.getDefesa()) * 1
  //       );
  //     });
  //     const maiorForca = Math.max(...forca.map((p) => p));

  //     return pokemonsDisponiveis.filter(
  //       (pokemon) =>
  //         Number(pokemon.getVida()) * 0.5 +
  //           Number(pokemon.getAtaque()) * 2 +
  //           Number(pokemon.getDefesa()) * 1 ===
  //         maiorForca,
  //     );
  //   };

  //   this.#equipe.length = 0;
  //   while (this.#equipe.length < 4) {
  //     let pokemonsEficazes, pokemonsNivel, pokemonsEvoluir, pokemonsForte;
  //     pokemonsNivel = [];

  //     if (this.#capturouTodos) {
  //       pokemonsEvoluir = evoluir(this.#pokemons);
  //       if (pokemonsEvoluir.length === 1) {
  //         this.#equipe.push(pokemonsEvoluir[0]);
  //         continue;
  //       }

  //       pokemonsForte = forte(
  //         pokemonsEvoluir.length ? pokemonsEvoluir : this.#pokemons,
  //       );
  //       this.#equipe.push(
  //         pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
  //       );
  //       continue;
  //     }

  //     switch (this.#equipe.length) {
  //       case 0:
  //         pokemonsEficazes = eficazes();
  //         if (pokemonsEficazes.length === 1) {
  //           this.#equipe.push(pokemonsEficazes[0]);
  //           break;
  //         }

  //         // pokemonsNivel = nivel(
  //         //   pokemonsEficazes.length ? pokemonsEficazes : this.#pokemons,
  //         // );
  //         // if (pokemonsNivel.length === 1) {
  //         //   this.#equipe.push(pokemonsNivel[0]);
  //         //   break;
  //         // }

  //         pokemonsEvoluir = evoluir(
  //           pokemonsNivel.length ? pokemonsNivel : this.#pokemons,
  //         );

  //         if (pokemonsEvoluir.length === 1) {
  //           this.#equipe.push(pokemonsEvoluir[0]);
  //           break;
  //         }

  //         pokemonsForte = forte(
  //           pokemonsEvoluir.length ? pokemonsEvoluir : this.#pokemons,
  //         );
  //         this.#equipe.push(
  //           pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
  //         );
  //         break;

  //       case 1:
  //         pokemonsEficazes = eficazes();
  //         if (pokemonsEficazes.length === 1) {
  //           this.#equipe.push(pokemonsEficazes[0]);
  //           break;
  //         }

  //         // pokemonsNivel = nivel(
  //         //   pokemonsEficazes.length ? pokemonsEficazes : this.#pokemons,
  //         // );
  //         // if (pokemonsNivel.length === 1) {
  //         //   this.#equipe.push(pokemonsNivel[0]);
  //         //   break;
  //         // }

  //         pokemonsEvoluir = evoluir(
  //           pokemonsNivel.length ? pokemonsNivel : this.#pokemons,
  //         );
  //         if (pokemonsEvoluir.length === 1) {
  //           this.#equipe.push(pokemonsEvoluir[0]);
  //           break;
  //         }

  //         pokemonsForte = forte(
  //           pokemonsEvoluir.length ? pokemonsEvoluir : this.#pokemons,
  //         );
  //         this.#equipe.push(
  //           pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
  //         );
  //         break;

  //       case 2:
  //         // pokemonsNivel = nivel(this.#pokemons);
  //         // if (pokemonsNivel.length === 1) {
  //         //   this.#equipe.push(pokemonsNivel[0]);
  //         //   break;
  //         // }

  //         pokemonsEvoluir = evoluir(
  //           pokemonsNivel.length ? pokemonsNivel : this.#pokemons,
  //         );
  //         if (pokemonsEvoluir.length === 1) {
  //           this.#equipe.push(pokemonsEvoluir[0]);
  //           break;
  //         }

  //         pokemonsForte = forte(
  //           pokemonsEvoluir.length ? pokemonsEvoluir : this.#pokemons,
  //         );
  //         this.#equipe.push(
  //           pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
  //         );
  //         break;

  //       case 3:
  //         pokemonsEvoluir = evoluir(this.#pokemons);
  //         if (pokemonsEvoluir.length === 1) {
  //           this.#equipe.push(pokemonsEvoluir[0]);
  //           break;
  //         }

  //         pokemonsForte = forte(
  //           pokemonsEvoluir.length ? pokemonsEvoluir : this.#pokemons,
  //         );
  //         this.#equipe.push(
  //           pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
  //         );
  //         break;
  //     }
  //   }
  // }

  #montaEquipe(biomas) {
    if (this.#equipe.length < 4) return;

    const eficazes = () => {
      const tipoEscasso = this.#tiposEscasso(biomas);
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

      const pokemonsDisponiveis = this.#pokemons.filter(
        (pokemon) =>
          !this.#equipe.some(
            (poke) => poke.getEspecie() === pokemon.getEspecie(),
          ) &&
          pokemon.getEstado() &&
          pokemon.getEvolucao(),
      );

      const pokemonsEficazes = pokemonsDisponiveis.filter((pokemon) =>
        pokemon
          .getTipos()
          .some((tipo) => tiposEficazesFiltrados.includes(tipo)),
      );

      return pokemonsEficazes;
    };

    const evoluir = (pokemons) => {
      const pokemonsDisponiveis = pokemons.filter(
        (pokemon) =>
          !this.#equipe.some(
            (poke) => poke.getEspecie() === pokemon.getEspecie(),
          ) &&
          pokemon.getEstado() &&
          pokemon.getEvolucao(),
      );
      const nivelFaltando = pokemonsDisponiveis.map((pokemon) => {
        if (!pokemon.getEvolucao()) return null;
        return Number(pokemon.getNivel()) - Number(pokemon.getEvolucao().nivel);
      });
      const menor = Math.min(
        ...nivelFaltando.filter((p) => typeof p === "number"),
      );

      return pokemonsDisponiveis.filter(
        (pokemon) =>
          Number(pokemon.getNivel()) - Number(pokemon.getEvolucao()) === menor,
      );
    };

    const forte = (pokemons) => {
      const pokemonsDisponiveis = pokemons.filter(
        (pokemon) =>
          !this.#equipe.some(
            (poke) => poke.getEspecie() === pokemon.getEspecie(),
          ) &&
          pokemon.getEstado() &&
          pokemon.getEvolucao(),
      );
      const forca = pokemonsDisponiveis.map((pokemon) => {
        return (
          Number(pokemon.getVida()) * 0.5 +
          Number(pokemon.getAtaque()) * 2 +
          Number(pokemon.getDefesa()) * 1
        );
      });
      const maiorForca = Math.max(...forca.map((p) => p));

      return pokemonsDisponiveis.filter(
        (pokemon) =>
          Number(pokemon.getVida()) * 0.5 +
            Number(pokemon.getAtaque()) * 2 +
            Number(pokemon.getDefesa()) * 1 ===
          maiorForca,
      );
    };

    const nivel = (pokemons) => {
      const pokemonsDisponiveis = pokemons.filter(
        (pokemon) =>
          !this.#equipe.some(
            (poke) => poke.getEspecie() === pokemon.getEspecie(),
          ) && pokemon.getEstado(),
      );

      const pokemonsOrdenadosNivel = pokemonsDisponiveis.sort(
        (a, b) => b.getNivel() - a.getNivel(),
      );
      const nivelMaisAlto = pokemonsOrdenadosNivel[0].getNivel();
      return pokemonsOrdenadosNivel.filter(
        (p) => p.getNivel() === nivelMaisAlto,
      );
    };

    this.#equipe.length = 0;
    while (this.#equipe.length < 4) {
      let pokemonsEvoluir, pokemonsForte;

      if (this.#capturouTodos) {
        const pokemons = this.#pokemons.filter((pokemon) =>
          pokemon.getEvolucao(),
        );

        pokemonsEvoluir = evoluir(pokemons);
        if (pokemonsEvoluir.length === 1) {
          this.#equipe.push(pokemonsEvoluir[0]);
          continue;
        }

        pokemonsForte = forte(
          pokemonsEvoluir.length ? pokemonsEvoluir : pokemons,
        );
        if (pokemonsForte.length) {
          this.#equipe.push(
            pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
          );
          continue;
        }

        const pokemonsNivel = nivel(this.#pokemons);
        this.#equipe.push(
          pokemonsNivel[Math.floor(Math.random() * pokemonsNivel.length)],
        );
        continue;
      }

      const pokemonsEficazes = eficazes();
      if (pokemonsEficazes.length === 1) {
        this.#equipe.push(pokemonsEficazes[0]);
        continue;
      }

      pokemonsEvoluir = evoluir(
        pokemonsEficazes.length ? pokemonsEficazes : this.#pokemons,
      );

      if (pokemonsEvoluir.length === 1) {
        this.#equipe.push(pokemonsEvoluir[0]);
        continue;
      }

      pokemonsForte = forte(
        pokemonsEvoluir.length ? pokemonsEvoluir : this.#pokemons,
      );

      if (pokemonsForte.length) {
        this.#equipe.push(
          pokemonsForte[Math.floor(Math.random() * pokemonsForte.length)],
        );
        continue;
      }

      const pokemonsNivel = nivel(this.#pokemons);
      this.#equipe.push(
        pokemonsNivel[Math.floor(Math.random() * pokemonsNivel.length)],
      );
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

  getBase() {
    return this.#base;
  }

  getCapturouTodos() {
    return this.#capturouTodos;
  }

  getCor() {
    return this.#cor;
  }

  setResistencia(resistencia) {
    this.#resistencia = resistencia;
  }

  setEquipe(pokemon) {
    this.#equipe = pokemon;
  }

  setPokemons(pokemon) {
    this.#pokemons = pokemon;
  }

  setBase(base) {
    this.#base = base;
  }

  setEstrategia(estrategia) {
    this.#estrategia = estrategia;
  }

  setCor(cor) {
    this.#cor = cor;
  }
}

export default Treinador;
