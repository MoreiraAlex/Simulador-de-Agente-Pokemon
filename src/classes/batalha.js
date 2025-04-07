class Batalha {

    Batalha(){
        const tabelaTipos = {
            "normal": {
                "normal" : 1,
                "fogo": 1,
                "agua": 1,
                "grama": 1,
                "eletrico": 1,
                "gelo" : 1,
                "lutador" : 0.5,
                "veneno" : 1,
                "terra" : 1,
                "voador" : 1,
                "psíquico" : 1,
                "inseto": 1,
                "pedra": 0.5,
                "fantasma" : 0,
                "dragão" : 1,
              },
            "fogo": {
              "normal" : 1,
              "fogo": 0.5,
              "agua": 0.5,
              "grama": 2,
              "eletrico": 1,
              "gelo" : 2,
              "lutador" : 1,
              "veneno" : 1,
              "terra" : 1,
              "voador" : 1,
              "psíquico" : 1,
              "inseto": 2,
              "pedra": 0.5,
              "fantasma" : 1,
              "dragão" : 0.5,
            },

              "agua": {
                "normal" : 1,
                "fogo": 2,
                "agua": 0.5,
                "grama": 0.5,
                "eletrico": 1,
                "gelo" : 1,
                "lutador" : 1,
                "veneno" : 1,
                "terra" : 2,
                "voador" : 1,
                "psíquico" : 1,
                "inseto": 1,
                "pedra": 2,
                "fantasma" : 1,
                "dragão" : 0.5,
              },
              "grama": {
                "normal" : 1,
                "fogo": 0.5,
                "agua": 2,
                "grama": 0.5,
                "eletrico": 1,
                "gelo" : 1,
                "lutador" : 1,
                "veneno" : 0.5,
                "terra" : 2,
                "voador" : 0.5,
                "psíquico" : 1,
                "inseto": 0.5,
                "pedra": 2,
                "fantasma" : 1,
                "dragão" : 0.5,
              },
              "eletrico": {
                "normal" : 1,
                "fogo": 1,
                "agua": 2,
                "grama": 0.5,
                "eletrico": 0.5,
                "gelo" : 1,
                "lutador" : 1,
                "veneno" : 1,
                "terra" : 0,
                "voador" : 2,
                "psíquico" : 1,
                "inseto": 1,
                "pedra": 1,
                "fantasma" : 1,
                "dragão" : 0.5,
              },
              "gelo": {
                "normal" : 1,
                "fogo": 0.5,
                "agua": 0.5,
                "grama": 2,
                "eletrico": 1,
                "gelo" : 0.5,
                "lutador" : 1,
                "veneno" : 1,
                "terra" : 2,
                "voador" : 2,
                "psíquico" : 1,
                "inseto": 1,
                "pedra": 1,
                "fantasma" : 1,
                "dragão" : 2,
              },
              "lutador": {
                "normal" : 2,
                "fogo": 1,
                "agua": 1,
                "grama": 1,
                "eletrico": 1,
                "gelo" : 2,
                "lutador" : 1,
                "veneno" : 0.5,
                "terra" : 1,
                "voador" : 0.5,
                "psíquico" : 0.5,
                "inseto": 0.5,
                "pedra": 1,
                "fantasma" : 0,
                "dragão" : 1,
              },
              "veneno": {
                "normal" : 1,
                "fogo": 1,
                "agua": 1,
                "grama": 2,
                "eletrico": 1,
                "gelo" : 1,
                "lutador" : 1,
                "veneno" : 0.5,
                "terra" : 0.5,
                "voador" : 1,
                "psíquico" : 1,
                "inseto": 1,
                "pedra": 0.5,
                "fantasma" : 0.5,
                "dragão" : 1,
              },
              "terra": {
                "normal" : 1,
                "fogo": 2,
                "agua": 1,
                "grama": 0.5,
                "eletrico": 2,
                "gelo" : 1,
                "lutador" : 0.5,
                "veneno" : 2,
                "terra" : 1,
                "voador" : 0,
                "psíquico" : 1,
                "inseto": 0.5,
                "pedra": 2,
                "fantasma" : 1,
                "dragão" : 1,
              },
              "voador": {
                "normal" : 1,
                "fogo": 1,
                "agua": 1,
                "grama": 2,
                "eletrico": 0.5,
                "gelo" : 1,
                "lutador" : 2,
                "veneno" : 1,
                "terra" : 1,
                "voador" : 1,
                "psíquico" : 1,
                "inseto": 2,
                "pedra": 0.5,
                "fantasma" : 1,
                "dragão" : 1,
              },
              "psíquico": {
                "normal" : 1,
                "fogo": 1,
                "agua": 1,
                "grama": 1,
                "eletrico": 1,
                "gelo" : 1,
                "lutador" : 2,
                "veneno" : 2,
                "terra" : 1,
                "voador" : 1,
                "psíquico" : 0.5,
                "inseto": 2,
                "pedra": 1,
                "fantasma" : 1,
                "dragão" : 1,
              },
              "inseto": {
                "normal" : 1,
                "fogo": 0.5,
                "agua": 1,
                "grama": 2,
                "eletrico": 1,
                "gelo" : 1,
                "lutador" : 0.5,
                "veneno" : 0.5,
                "terra" : 1,
                "voador" : 0.5,
                "psíquico" : 2,
                "inseto": 0.5,
                "pedra": 1,
                "fantasma" : 0.5,
                "dragão" : 1,
              },
              "pedra": {
                "normal" : 1,
                "fogo": 2,
                "agua": 1,
                "grama": 1,
                "eletrico": 1,
                "gelo" : 2,
                "lutador" : 0.5,
                "veneno" : 1,
                "terra" : 0.5,
                "voador" : 2,
                "psíquico" : 1,
                "inseto": 2,
                "pedra": 1,
                "fantasma" : 1,
                "dragão" : 1,
              },
              "fantasma": {
                "normal" : 0,
                "fogo": 1,
                "agua": 1,
                "grama": 1,
                "eletrico": 1,
                "gelo" : 1,
                "lutador" : 0,
                "veneno" : 1,
                "terra" : 1,
                "voador" : 1,
                "psíquico" : 2,
                "inseto": 1,
                "pedra": 1,
                "fantasma" : 2,
                "dragão" : 1,
              },
              "dragão": {
                "normal" : 1,
                "fogo": 1,
                "agua": 1,
                "grama": 1,
                "eletrico": 1,
                "gelo" : 0.5,
                "lutador" : 1,
                "veneno" : 1,
                "terra" : 1,
                "voador" : 1,
                "psíquico" : 1,
                "inseto": 1,
                "pedra": 1,
                "fantasma" : 1,
                "dragão" : 2,
              },
          };
        
    }
    
      
        function calcularMultiplicador(tipoAtaque, tiposDefesa) {
        const linha = tabelaTipos[tipoAtaque];
      
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

      function analisarTimeContraSelvagem(pokemonSelvagemTipos, time) {
        const resultados = [];
      
        for (const pokemon of time) {

          const { nome, tipos } = pokemon;
      
          let maiorMultiplicador = 0;
      
          for (const tipoAtaque of tipos) {
            const dano = calcularMultiplicador(tipoAtaque, pokemonSelvagemTipos);
            if (dano > maiorMultiplicador) {
              maiorMultiplicador = dano;
            }
          }
      
          resultados.push({
            nome,
            tipos,
            multiplicador: maiorMultiplicador
          });
        }
      
        // Ordena do maior para o menor multiplicador
        resultados.sort((a, b) => b.multiplicador - a.multiplicador);
        if (resultados[0]===resultados[1]){
            // n sei como fazer aqui mas seria uma comparação de nivel entre os pokemons dos índices 0 e 1
            //para descobrir qual será lançado em batalha contra o pokemon selvagem
            //não fiz a comparação com outros índices por não haver necessidade(pelo meu ponto de vista)
            if (resultados[0].getNivel>=resultados[1].getNivel){
                return resultados[0];
            } else {
                return resultados[1];
            }
        }
    }


    function trocarPokemon(pokemonSelvagemTipos, time) {
        // Filtra apenas os Pokémons vivos
        const timeDisponivel = time.filter(pokemon => !pokemon.derrotado);
      
        if (timeDisponivel.length === 0) {
            console.log("Todos os Pokémons foram derrotados");
            treinador.setEstado("indisponivel");
            treinador.setMovimentação(base);
            //acima como eu n sei como está o desenvolvimento do treinador, vou deixar de qualquer jeito.
            //a anotação é p eu tbm lembrar q tenho q arrumar futuramente :)

            return null;
        }
      
        const analise = analisarTimeContraSelvagem(pokemonSelvagemTipos, timeDisponivel);
    
        return analise[0];
      }

      function tentarCaptura(nomePokemon, capturados) {

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


    }
    