class Batalha {
  constructor(treinador) {
    this.tabelaTipos = {
      normal: {
        normal: 1,
        fogo: 1,
        agua: 1,
        grama: 1,
        eletrico: 1,
        gelo: 1,
        lutador: 0.5,
        veneno: 1,
        terra: 1,
        voador: 1,
        psíquico: 1,
        inseto: 1,
        pedra: 0.5,
        fantasma: 0,
        dragão: 1,
      },
      fogo: {
        normal: 1,
        fogo: 0.5,
        agua: 0.5,
        grama: 2,
        eletrico: 1,
        gelo: 2,
        lutador: 1,
        veneno: 1,
        terra: 1,
        voador: 1,
        psíquico: 1,
        inseto: 2,
        pedra: 0.5,
        fantasma: 1,
        dragão: 0.5,
      },

      agua: {
        normal: 1,
        fogo: 2,
        agua: 0.5,
        grama: 0.5,
        eletrico: 1,
        gelo: 1,
        lutador: 1,
        veneno: 1,
        terra: 2,
        voador: 1,
        psíquico: 1,
        inseto: 1,
        pedra: 2,
        fantasma: 1,
        dragão: 0.5,
      },
      grama: {
        normal: 1,
        fogo: 0.5,
        agua: 2,
        grama: 0.5,
        eletrico: 1,
        gelo: 1,
        lutador: 1,
        veneno: 0.5,
        terra: 2,
        voador: 0.5,
        psíquico: 1,
        inseto: 0.5,
        pedra: 2,
        fantasma: 1,
        dragão: 0.5,
      },
      eletrico: {
        normal: 1,
        fogo: 1,
        agua: 2,
        grama: 0.5,
        eletrico: 0.5,
        gelo: 1,
        lutador: 1,
        veneno: 1,
        terra: 0,
        voador: 2,
        psíquico: 1,
        inseto: 1,
        pedra: 1,
        fantasma: 1,
        dragão: 0.5,
      },
      gelo: {
        normal: 1,
        fogo: 0.5,
        agua: 0.5,
        grama: 2,
        eletrico: 1,
        gelo: 0.5,
        lutador: 1,
        veneno: 1,
        terra: 2,
        voador: 2,
        psíquico: 1,
        inseto: 1,
        pedra: 1,
        fantasma: 1,
        dragão: 2,
      },
      lutador: {
        normal: 2,
        fogo: 1,
        agua: 1,
        grama: 1,
        eletrico: 1,
        gelo: 2,
        lutador: 1,
        veneno: 0.5,
        terra: 1,
        voador: 0.5,
        psíquico: 0.5,
        inseto: 0.5,
        pedra: 1,
        fantasma: 0,
        dragão: 1,
      },
      veneno: {
        normal: 1,
        fogo: 1,
        agua: 1,
        grama: 2,
        eletrico: 1,
        gelo: 1,
        lutador: 1,
        veneno: 0.5,
        terra: 0.5,
        voador: 1,
        psíquico: 1,
        inseto: 1,
        pedra: 0.5,
        fantasma: 0.5,
        dragão: 1,
      },
      terra: {
        normal: 1,
        fogo: 2,
        agua: 1,
        grama: 0.5,
        eletrico: 2,
        gelo: 1,
        lutador: 0.5,
        veneno: 2,
        terra: 1,
        voador: 0,
        psíquico: 1,
        inseto: 0.5,
        pedra: 2,
        fantasma: 1,
        dragão: 1,
      },
      voador: {
        normal: 1,
        fogo: 1,
        agua: 1,
        grama: 2,
        eletrico: 0.5,
        gelo: 1,
        lutador: 2,
        veneno: 1,
        terra: 1,
        voador: 1,
        psíquico: 1,
        inseto: 2,
        pedra: 0.5,
        fantasma: 1,
        dragão: 1,
      },
      psíquico: {
        normal: 1,
        fogo: 1,
        agua: 1,
        grama: 1,
        eletrico: 1,
        gelo: 1,
        lutador: 2,
        veneno: 2,
        terra: 1,
        voador: 1,
        psíquico: 0.5,
        inseto: 2,
        pedra: 1,
        fantasma: 1,
        dragão: 1,
      },
      inseto: {
        normal: 1,
        fogo: 0.5,
        agua: 1,
        grama: 2,
        eletrico: 1,
        gelo: 1,
        lutador: 0.5,
        veneno: 0.5,
        terra: 1,
        voador: 0.5,
        psíquico: 2,
        inseto: 0.5,
        pedra: 1,
        fantasma: 0.5,
        dragão: 1,
      },
      pedra: {
        normal: 1,
        fogo: 2,
        agua: 1,
        grama: 1,
        eletrico: 1,
        gelo: 2,
        lutador: 0.5,
        veneno: 1,
        terra: 0.5,
        voador: 2,
        psíquico: 1,
        inseto: 2,
        pedra: 1,
        fantasma: 1,
        dragão: 1,
      },
      fantasma: {
        normal: 0,
        fogo: 1,
        agua: 1,
        grama: 1,
        eletrico: 1,
        gelo: 1,
        lutador: 0,
        veneno: 1,
        terra: 1,
        voador: 1,
        psíquico: 2,
        inseto: 1,
        pedra: 1,
        fantasma: 2,
        dragão: 1,
      },
      dragão: {
        normal: 1,
        fogo: 1,
        agua: 1,
        grama: 1,
        eletrico: 1,
        gelo: 0.5,
        lutador: 1,
        veneno: 1,
        terra: 1,
        voador: 1,
        psíquico: 1,
        inseto: 1,
        pedra: 1,
        fantasma: 1,
        dragão: 2,
      },
    };
    this.treinador = treinador;
    this.batalhaAtiva = true;
    this.lutaAtiva = false;
    this.pokemonsAtacante = [];
    this.pokemonsDefensor = [];
    this.intervalo1 = null;
    this.intervalo2 = null;
    this.vencedor = null;
  }

  // sinceramente n sei pq ta dando erro aq, mas essa função que determina se existe vantagem ou desvantagem
  // de tipos no pokemon
  calcularMultiplicador(tipoAtaque, tiposDefesa) {
    const linha = this.tabelaTipos[tipoAtaque];

    if (!linha) {
      console.error(`Tipo de pokemon "${tipoAtaque}" não existe na tabela.`);
      return 1;
    }

    // Garante que sempre é um array (mesmo se for só um tipo)
    if (!Array.isArray(tiposDefesa)) {
      tiposDefesa = [tiposDefesa];
    }

    let multiplicadorTotal = 1;

    for (const tipoDefesa of tiposDefesa) {
      multiplicadorTotal *= linha[tipoDefesa];
    }

    return multiplicadorTotal;
  }

  // essa é aquela função que a gente conversou sobre escolher o pokemon mais eficaz contra a tipagem do pokemon
  // inimigo. Qualquer coisa só mudar o nome e usar pra pvp também
  analisarTimeContraSelvagem(pokemonSelvagemTipos, time) {
    const resultados = [];

    for (const pokemon of time) {
      const { nome, tipos } = pokemon;

      let maiorMultiplicador = 0;

      for (const tipoAtaque of tipos) {
        const dano = this.calcularMultiplicador(
          tipoAtaque,
          pokemonSelvagemTipos,
        );
        if (dano > maiorMultiplicador) {
          maiorMultiplicador = dano;
        }
      }

      resultados.push({
        nome,
        tipos,
        multiplicador: maiorMultiplicador,
      });
    }

    // Ordena do maior para o menor multiplicador
    resultados.sort((a, b) => b.multiplicador - a.multiplicador);
    if (resultados[0] === resultados[1]) {
      // n sei como fazer aqui mas seria uma comparação de nivel entre os pokemons dos índices 0 e 1
      // para descobrir qual será lançado em batalha contra o pokemon selvagem
      // não fiz a comparação com outros índices por não haver necessidade(pelo meu ponto de vista)
      if (resultados[0].nivel >= resultados[1].nivel) {
        return resultados[0];
      } else {
        return resultados[1];
      }
    }
  }

  // função para troca durante o combate em caso de derrota, por enquanto só serve para o combate contra selvagens,
  // mas em breve servirá também para pvp
  trocarPokemon(pokemonSelvagemTipos, time) {
    // Filtra apenas os Pokémons vivos
    const timeDisponivel = time.filter((pokemon) => !pokemon.derrotado);

    if (timeDisponivel.length === 0) {
      console.log("Todos os Pokémons foram derrotados");
      this.treinador.setEstado("indisponivel");
      // this.treinador.setMovimentação(base);
      // acima como eu n sei como está o desenvolvimento do treinador, vou deixar de qualquer jeito.
      // a anotação é p eu tbm lembrar q tenho q arrumar futuramente :)

      return null;
    }

    return this.analisarTimeContraSelvagem(
      pokemonSelvagemTipos,
      timeDisponivel,
    );
  }

  // tentarCaptura(nomePokemon, capturados) {
  //   const jaCapturado = capturados.includes(nomePokemon);

  //   if (jaCapturado) {
  //     return false;
  //   }

  //   // Sorteio de 50% de chance
  //   const chance = Math.random();

  //   if (chance < 0.5) {
  //     return false;
  //   } else {
  //     capturados.push(nomePokemon);
  //     return true;
  //   }
  // }

  luta(p1, p2) {
    if (!this.intervalo1) {
      console.log(`\n${p1.nome} vs ${p2.nome}\n`);

      this.intervalo1 = setInterval(() => {
        if (!this.lutaAtiva) {
          clearInterval(this.intervalo1);
          this.intervalo1 = null;
          return;
        }

        const dano = this.atacar(p1, p2);

        p2.hp -= dano;

        console.log(`${p2.nome} perdeu ${dano} de vida, hp restante: ${p2.hp}`);

        if (p2.hp <= 0) {
          console.log(`\n${p1.nome} derrotou ${p2.nome}`);

          this.lutaAtiva = false;

          clearInterval(this.intervalo1);
          this.intervalo1 = null;

          if (this.intervalo2) {
            clearInterval(this.intervalo2);
            this.intervalo2 = null;
          }
          this.vencedor = p1;
        }
      }, 1000 / p1.ataques.atkBasico[1]);

      // Aqui é o tempo de ataque do Pokémon 1
    }

    if (!this.intervalo2) {
      this.intervalo2 = setInterval(() => {
        if (!this.lutaAtiva) {
          clearInterval(this.intervalo2);
          this.intervalo2 = null;
          return;
        }
        const dano = this.atacar(p2, p1);

        p1.hp -= dano;
        console.log(`${p1.nome} perdeu ${dano} de vida, hp restante: ${p1.hp}`);

        if (p1.hp <= 0) {
          console.log(`\n${p2.nome} derrotou ${p1.nome}`);
          this.lutaAtiva = false;

          clearInterval(this.intervalo2);
          this.intervalo2 = null;
          if (this.intervalo1) {
            clearInterval(this.intervalo1);
            this.intervalo1 = null;
          }

          this.vencedor = p2;
        }
      }, 1000 / p2.ataques.atkBasico[1]); // Aqui é o tempo de ataque do Pokémon 2
    }
    return this.vencedor;
  }

  batalha(atacante, defensor, frame) {
    const intervalo = setInterval(() => {
      if (!this.batalhaAtiva) {
        clearInterval(intervalo);

        this.pokemonsAtacante = Object.values(
          this.pokemonsAtacante.reduce((acc, item) => {
            if (!acc[item.id]) {
              acc[item.id] = { id: item.id, nocautes: 0 };
            }
            acc[item.id].nocautes += item.nocautes;
            return acc;
          }, {}),
        );

        this.pokemonsDefensor = Object.values(
          this.pokemonsDefensor.reduce((acc, item) => {
            if (!acc[item.id]) {
              acc[item.id] = { id: item.id, nocautes: 0 };
            }
            acc[item.id].nocautes += item.nocautes;
            return acc;
          }, {}),
        );

        let resultado = {};
        if (atacante.equipe[0].hp <= 0) {
          resultado = {
            vencedor: {
              id: defensor.id,
              pokemons: this.pokemonsDefensor,
            },
            perdedor: {
              id: atacante.id,
              pokemons: this.pokemonsAtacante,
            },
          };
        } else {
          resultado = {
            vencedor: {
              id: atacante.id,
              pokemons: this.pokemonsAtacante,
            },
            perdedor: {
              id: defensor.id,
              pokemons: this.pokemonsDefensor,
            },
          };
        }
        console.log(`\nTreinador ${resultado.vencedor.id} venceu`);
        return resultado;
      }
      // criar a porra do sort de lv e verificação de vivo ou morto

      if (!this.lutaAtiva) {
        atacante.equipe.sort((a, b) => b.hp - a.hp);
        defensor.equipe.sort((a, b) => b.hp - a.hp);

        // console.log(atacante.equipe);
        // console.log(defensor.equipe);

        if (atacante.equipe[0].hp <= 0 || defensor.equipe[0].hp <= 0) {
          this.batalhaAtiva = false;
          return;
        }
        this.lutaAtiva = true;
        return;
      }

      const pokemonAtacante = atacante.equipe[0];
      const pokemonDefensor = defensor.equipe[0];

      this.luta(pokemonAtacante, pokemonDefensor);

      if (this.vencedor) {
        atacante.equipe[0] = pokemonAtacante;
        defensor.equipe[0] = pokemonDefensor;
        const vencedor =
          this.vencedor.id === pokemonAtacante.id
            ? pokemonAtacante
            : pokemonDefensor;
        const perdedor =
          this.vencedor.id === pokemonAtacante.id
            ? pokemonDefensor
            : pokemonAtacante;

        if (vencedor === pokemonAtacante) {
          this.pokemonsAtacante.push({
            id: vencedor.id,
            nocaute: 1,
          });

          this.pokemonsDefensor.push({
            id: perdedor.id,
            nocaute: 0,
          });
        } else {
          this.pokemonsDefensor.push({
            id: vencedor.id,
            nocaute: 1,
          });
          this.pokemonsAtacante.push({
            id: perdedor.id,
            nocaute: 0,
          });
        }
      }
    }, frame);
  }

  atacar(atacante, defensor) {
    if (!this.lutaAtiva) return 0;

    const dano =
      atacante.ataques.atkBasico[0] * (atacante.ataque - defensor.defesa);

    return dano;
  }

  getTreinador() {
    return this.treinador;
  }
}

export default Batalha;

const treinadores = [
  {
    id: 1,
    equipe: [
      {
        nome: "Pidgey",
        nivel: 5,
        xp: 0,
        hp: 100,
        ataque: 10,
        defesa: 6,
        tipos: ["normal", "voador"],
        ataques: {
          atkBasico: [10, 1],
          skill: [20, 5],
        },
      },
      {
        nome: "Rattata",
        nivel: 5,
        xp: 0,
        hp: 100,
        ataque: 10,
        defesa: 6,
        tipos: ["normal"],
        ataques: {
          atkBasico: [10, 1],
          skill: [20, 5],
        },
      },
    ],
  },
  {
    id: 2,
    equipe: [
      {
        nome: "Charmander",
        nivel: 5,
        xp: 0,
        hp: 100,
        ataque: 10,
        defesa: 6,
        tipos: ["fogo"],
        ataques: {
          atkBasico: [10, 1],
          skill: [20, 5],
        },
      },
      {
        nome: "Squirtle",
        nivel: 5,
        xp: 0,
        hp: 100,
        ataque: 10,
        defesa: 5,
        tipos: ["agua"],
        ataques: {
          atkBasico: [10, 1.2],
          skill: [20, 5],
        },
      },
      {
        nome: "Bulbasaur",
        nivel: 5,
        xp: 0,
        hp: 100,
        ataque: 10,
        defesa: 6,
        tipos: ["grama"],
        ataques: {
          atkBasico: [10, 1],
          skill: [20, 5],
        },
      },
    ],
  },
];

const batalha = new Batalha("Red");

batalha.batalha(treinadores[0], treinadores[1], 1000);
