import { biomas, obstaculos } from "../models/mapa.js";
import { pokedex } from "../models/pokedex.js";
import {
  atualizaPosicaoNaMatriz,
  posicaoAleatoriaBioma,
} from "../utils/utils.js";
import AgenteFactory from "./agentes/AgenteFactory.js";

class Mapa {
  #canvas;
  #contexto;
  #celula;
  #biomas;
  #obstaculos;
  #matriz;
  #pf;
  #sequence;
  #imagem;

  constructor(canvas, contexto, celula, pf, sequence) {
    this.#canvas = canvas;
    this.#contexto = contexto;
    this.#celula = celula;
    this.#pf = pf;
    this.#sequence = sequence;
  }

  iniciar() {
    this.#biomas = biomas;
    this.#obstaculos = obstaculos;
    this.#matriz = new this.#pf.Grid(40, 40);
    this.#geraObstaculos(40, 40);
    this.resetaAgentesMatriz();

    // eslint-disable-next-line no-undef
    this.#imagem = new Image();
    this.#imagem.src = `./src/recursos/Mapa/Mapa.png`;
  }

  desenhar() {
    this.#contexto.drawImage(this.#imagem, 0, 0, 2000, 2000);
    // this.#desenhaBioma();
    // this.#desenhaObstaculo();
    // this.#desenhaCentro();
    // this.#grade();
  }

  #desenhaBioma() {
    this.#biomas.forEach((bioma) => {
      // if (bioma.cor !== "green") return;
      this.#contexto.fillStyle = "#C0C0C0";
      // contexto.fillStyle = bioma.cor;
      this.#contexto.fillRect(bioma.x, bioma.y, bioma.largura, bioma.altura);
    });
  }

  #desenhaCentro() {
    biomas.forEach((b) => {
      this.#contexto.fillStyle = "red";
      this.#contexto.fillRect(
        b.centro.x,
        b.centro.y,
        this.#celula,
        this.#celula,
      );
    });
  }

  #desenhaObstaculo() {
    this.#matriz.nodes.forEach((linha, i) => {
      linha.forEach((celula, j) => {
        if (!celula.walkable) {
          this.#contexto.fillStyle = "yellow";
          this.#contexto.fillRect(
            j * this.#celula,
            i * this.#celula,
            this.#celula,
            this.#celula,
          );
        }
      });
    });
  }

  #grade() {
    const width = this.#canvas.width;
    const height = this.#canvas.height;

    this.#contexto.strokeStyle = "black"; // cor das linhas

    // desenha as linhas verticais
    for (let x = 0; x <= width; x += this.#celula) {
      this.#contexto.beginPath();
      this.#contexto.moveTo(x, 0);
      this.#contexto.lineTo(x, height);
      this.#contexto.stroke();
    }

    // desenha as linhas horizontais
    for (let y = 0; y <= height; y += this.#celula) {
      this.#contexto.beginPath();
      this.#contexto.moveTo(0, y);
      this.#contexto.lineTo(width, y);
      this.#contexto.stroke();
    }
  }

  #geraObstaculos(cols, rows) {
    this.#obstaculos.forEach((obs) => {
      const startCol = Math.floor(obs.x / this.#celula);
      const endCol = Math.ceil((obs.x + obs.largura) / this.#celula);
      const startRow = Math.floor(obs.y / this.#celula);
      const endRow = Math.ceil((obs.y + obs.altura) / this.#celula);

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          if (row >= 0 && row < rows && col >= 0 && col < cols) {
            this.#matriz.nodes[row][col].walkable = false;
          }
        }
      }
    });
  }

  resetaAgentesMatriz() {
    this.#matriz.nodes.forEach((linhas) => {
      linhas.forEach((colunas) => {
        colunas.agente = 0;
      });
    });
  }

  pokeBioma(agentes) {
    this.#biomas.forEach((bioma) => {
      // if (!bioma.tipos.some((tipo) => tipo === "agua")) return;

      const pokemons = pokedex.filter(
        (pokemon) =>
          bioma.tipos.includes(pokemon.tipos[0]) && pokemon.estaAtivo,
      );

      if (!pokemons.length) return;

      // const todosPokemons = agentes
      //   .filter((agente) => agente.especie === "humana")
      //   .flatMap((agente) => agente.pokemons);

      // const nivelMaisAlto = todosPokemons?.sort((a, b) => b.nivel - a.nivel)[0]
      //   ?.nivel;

      const pokerdm = [];
      while (pokerdm.length < 5) {
        const poke = pokemons[Math.floor(Math.random() * pokemons.length)];
        // const nivel = Math.max(
        //   1,
        //   Math.floor(Math.random() * nivelMaisAlto - 3),
        // );

        // Array.from(Array(nivel - 1 || 0)).forEach(() => {
        //   const atributos = [
        //     { vida: poke.vida },
        //     { ataque: poke.ataque },
        //     { defesa: poke.defesa },
        //   ];

        //   const atributoMelhorado =
        //     atributos[Math.floor(Math.random() * atributos.length)];

        //   poke[Object.keys(atributoMelhorado)] += poke.incremento;

        //   poke.ataques.basico.recarga += poke.incremento / 250;
        // });

        const pokemon = AgenteFactory.criarAgente("pokemon", {
          id: this.#sequence.next(),
          especie: poke.especie,
          tamanho: this.#celula,
          pokedex: poke.pokedex,
          tipos: poke.tipos,
          vida: poke.vida,
          ataque: poke.ataque,
          defesa: poke.defesa,
          ataques: poke.ataques,
          evolucao: poke.evolucao,
          incremento: poke.incremento,
          experiencia: 0,
          // nivel: nivel || 1,
          nivel: 1,
          estaAtivo: poke.estaAtivo,
        });

        if (!pokerdm.find((p) => p.getEspecie() === pokemon.getEspecie())) {
          pokerdm.push(pokemon);
        }
      }

      pokerdm.forEach((pokemon) => {
        const { x, y } = posicaoAleatoriaBioma(
          bioma,
          this.#matriz,
          this.#celula,
        );

        pokemon.setPosicao({ x, y });

        atualizaPosicaoNaMatriz(
          this.#matriz,
          pokemon.getPosicao(),
          this.#celula,
          pokemon.getId(),
        );
      });

      agentes.push(...pokerdm);
    });
  }

  getBiomas() {
    return this.#biomas;
  }

  getMatriz() {
    return this.#matriz;
  }
}

export default Mapa;
