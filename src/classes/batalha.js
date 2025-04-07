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

class Batalha {

  constructor(){
  }

        
    }
    
        //sinceramente n sei pq ta dando erro aq, mas essa função que determina se existe vantagem ou desvantagem
        // de tipos no pokemon
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
      //essa é aquela função que a gente conversou sobre escolher o pokemon mais eficaz contra a tipagem do pokemon
      //inimigo. Qualquer coisa só mudar o nome e usar pra pvp também
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

    //função para troca durante o combate em caso de derrota, por enquanto só serve para o combate contra selvagens,
    //mas em breve servirá também para pvp
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
      // função para captura de pokemon selvagem
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

        function batalha(p1, p2) {
          console.log(`Início da batalha entre ${p1.nome} e ${p2.nome}`);
          

          let batalhaAtiva = true;
          //aqui vou ver dps como pegar o treinador pelo pokemon, p mudar o estado dele (ou deles caso o p2
          //seja de um treinador). N sei se seria um getTreinador e um !time p dizer quem é o treinador e se pertence a um time 

          //preciso q alguém averigue isso aq dps fazendo o favor. Função da batalha em si, mas sem o especial por enquanto

        
          // Cria os loops baseados na velocidade de ataque de cada Pokémon
          const intervaloP1 = setInterval(() => atacar(p1, p2), p1.atkSpeed);
          const intervaloP2 = setInterval(() => atacar(p2, p1), p2.atkSpeed);
        }
      }

      function atacar(atacante, defensor) {
        if (!batalhaAtiva) return;
    
        const dano = pda*(atacante.ataque - defensor.defesa);// OBS: aqui q tem q mudar dps, ataque basico
        defensor.hp -= dano;
    
        console.log(`${atacante.nome} atacou ${defensor.nome} causando ${dano} de dano! (HP restante: ${defensor.hp})`);
    
        if (defensor.hp <= 0) {
          console.log(` ${defensor.nome} foi derrotado`);
          console.log(` ${atacante.nome} venceu a batalha`);
    
          batalhaAtiva = false;
          clearInterval(intervaloP1);
          clearInterval(intervaloP2);
        }
      }

      function iniciarBatalhaTreinador(t1, t2) {
        const agressivo = t1.agressivo || t2.agressivo;
        const visao = estaNoCampoDeVisao(t1, t2);
        const disponivel1 = t1.time.some(pkm => !pkm.derrotado);
        const disponivel2 = t2.time.some(pkm => !pkm.derrotado);
      
        if (agressivo && visao && disponivel1 && disponivel2) {
          console.log(`Batalha entre ${t1.nome} e ${t2.nome} vai começar`);
      
          // Escolher o Pokémon comk maior nível disponível de cada treinador
          const pkm1 = t1.time
            .filter(pkm => !pkm.derrotado)
            .reduce((maisForte, atual) =>
              atual.nivel > maisForte.nivel ? atual : maisForte
            );
      
          const pkm2 = t2.time.filter(pkm => !pkm.derrotado).reduce((maisForte, atual) =>
              atual.nivel > maisForte.nivel ? atual : maisForte
            );
      
          console.log(`${t1.nome} escolheu ${pkm1.nome} (nível ${pkm1.nivel})`);
          console.log(`${t2.nome} escolheu ${pkm2.nome} (nível ${pkm2.nivel})`);
      
          batalhaTempoReal(pkm1, pkm2); // Sua função de combate em tempo real
        } else {
          console.log(`Batalha não pode começar. Requisitos não atendidos`);
        }
      }
    }
    