class Teste {
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
    this.intervalo1 = null;
    this.intervalo2 = null;
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
      if (resultados[0].getNivel >= resultados[1].getNivel) {
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

    const analise = this.analisarTimeContraSelvagem(
      pokemonSelvagemTipos,
      timeDisponivel,
    );

    return analise[0];
  }

  // função para captura de pokemon selvagem
  tentarCaptura(nomePokemon, capturados) {
    const jaCapturado = capturados.includes(nomePokemon);

    if (jaCapturado) {
      return false;
    }

    // Sorteio de 50% de chance
    const chance = Math.random();

    if (chance < 0.5) {
      return false;
    } else {
      capturados.push(nomePokemon);
      return true;
    }
  }

  batalha(p1, p2) {
    if (!this.intervalo1) {
      this.intervalo1 = setInterval(() => {
        if (!this.batalhaAtiva) {
          clearInterval(this.intervalo1);
          return;
        }
        const dano = this.atacar(p1, p2);
        // this.calcularMultiplicador(p1.tipos[0], p2.tipos);

        p2.hp -= dano;
        console.log(`${p2.nome} perdeu ${dano}, hp restante: ${p2.hp}`);

        if (p2.hp <= 0) {
          console.log(`${p1.nome} derrotou ${p2.nome}`);

          this.batalhaAtiva = false;
          clearInterval(this.intervalo1);
          if (this.intervalo2) {
            clearInterval(this.intervalo2);
          }
        }
      }, 1000 / p1.ataques.atkBasico[1]); // Aqui é o tempo de ataque do Pokémon 1
    }

    if (!this.intervalo2) {
      this.intervalo2 = setInterval(() => {
        if (!this.batalhaAtiva) {
          clearInterval(this.intervalo2);
          return;
        }
        const dano = this.atacar(p2, p1);

        p1.hp -= dano;
        console.log(`${p1.nome} perdeu ${dano}, hp restante: ${p1.hp}`);

        if (p1.hp <= 0) {
          console.log(`${p2.nome} derrotou ${p1.nome}`);
          this.batalhaAtiva = false;
          clearInterval(this.intervalo2);
          if (this.intervalo1) {
            clearInterval(this.intervalo1);
          }
        }
      }, 1000 / p2.ataques.atkBasico[1]); // Aqui é o tempo de ataque do Pokémon 2
    }
  }

  atacar(atacante, defensor) {
    if (!this.batalhaAtiva) return 0;

    const dano =
      atacante.ataques.atkBasico[0] * (atacante.ataque - defensor.defesa);

    return dano;
  }

  getTreinador() {
    return this.treinador;
  }
}
export default Teste;
const pokemons = [
  {
    nome: "Charmander",
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
    hp: 100,
    ataque: 10,
    defesa: 123,
    tipos: ["grama", "veneno"],
    ataques: {
      atkBasico: [10, 1],
      skill: [20, 5],
    },
  },
];

const batalha = new Teste("Ash");

const intervalo = setInterval(() => {
  batalha.batalha(pokemons[0], pokemons[1]);
  if (batalha.batalhaAtiva === false) {
    clearInterval(intervalo);
  }
});
