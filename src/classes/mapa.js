import { biomas, obstaculos } from "../models/mapa.js";
import { pokedex } from "../models/pokedex.js";
import {
  atualizaPosicaoNaMatriz,
  posicaoAleatoriaBioma,
} from "../utils/utils.js";
import Pokemon from "./pokemon.js";

class Mapa {
  constructor(canvas, contexto, celula, pf, algoritimo) {
    this.canvas = canvas;
    this.contexto = contexto;
    this.celula = celula;
    this.matriz = [];
    this.pf = pf;
    this.algoritimo = algoritimo;

    this.biomas = biomas;
    this.obstaculos = obstaculos;

    this.base = [
      {
        posX: 100,
        posY: 100,
        largura: 200,
        altura: 200,
      },
      {
        posX: this.canvas.width - 300,
        posY: 100,
        largura: 200,
        altura: 200,
      },
      {
        posX: 100,
        posY: this.canvas.height - 300,
        largura: 200,
        altura: 200,
      },
      {
        posX: this.canvas.width - 300,
        posY: this.canvas.height - 300,
        largura: 200,
        altura: 200,
      },
    ];
  }

  desenha() {
    const { contexto } = this;

    if (!this.matriz.nodes) {
      this.matriz = new this.pf.Grid(this.gerarMatriz(this.celula));
    }

    this.biomas.forEach((bioma) => {
      contexto.fillStyle = bioma.cor;
      contexto.fillRect(bioma.posX, bioma.posY, bioma.largura, bioma.altura);
    });

    this.matriz.nodes.forEach((linha, i) => {
      linha.forEach((celula, j) => {
        if (!celula.walkable) {
          contexto.fillStyle = "black";
          contexto.fillRect(
            j * this.celula,
            i * this.celula,
            this.celula,
            this.celula,
          );
        }
      });
    });

    this.base.forEach((base) => {
      contexto.fillStyle = "yellow";
      contexto.fillRect(base.posX, base.posY, base.largura, base.altura);
    });

    this.grade(this.celula);
  }

  grade(tamanhoCelula) {
    const { contexto, canvas } = this;

    const width = canvas.width;
    const height = canvas.height;

    contexto.strokeStyle = "#ccc"; // cor das linhas

    // desenha as linhas verticais
    for (let x = 0; x <= width; x += tamanhoCelula) {
      contexto.beginPath();
      contexto.moveTo(x, 0);
      contexto.lineTo(x, height);
      contexto.stroke();
    }

    // desenha as linhas horizontais
    for (let y = 0; y <= height; y += tamanhoCelula) {
      contexto.beginPath();
      contexto.moveTo(0, y);
      contexto.lineTo(width, y);
      contexto.stroke();
    }
  }

  gerarMatriz(tamanhoCelula) {
    const cols = Math.floor(this.canvas.width / tamanhoCelula);
    const rows = Math.floor(this.canvas.height / tamanhoCelula);
    const matriz = Array.from({ length: rows }, () => Array(cols).fill(0));

    this.obstaculos.forEach((obs) => {
      const startCol = Math.floor(obs.posX / tamanhoCelula);
      const endCol = Math.ceil((obs.posX + obs.largura) / tamanhoCelula);
      const startRow = Math.floor(obs.posY / tamanhoCelula);
      const endRow = Math.ceil((obs.posY + obs.altura) / tamanhoCelula);

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          if (row >= 0 && row < rows && col >= 0 && col < cols) {
            matriz[row][col] = 1;
          }
        }
      }
    });

    return matriz;
  }

  pokeBioma(celula, agentes) {
    biomas.forEach((bioma) => {
      const pokemons = pokedex.filter(
        (pokemon) =>
          bioma.tipos.includes(pokemon.tipos[0]) && pokemon.estaAtivo,
      );

      const pokerdm = [];
      while (pokerdm.length < 4) {
        const poke = pokemons[Math.floor(Math.random() * pokemons.length)];
        const pokemon = new Pokemon(
          (Math.random() + poke.pokedex * 1000).toFixed(0),
          "red",
          celula,
          poke.especie,
          this.algoritimo,
          poke.pokedex,
          poke.tipos,
          poke.vida,
          poke.ataque,
          poke.defesa,
          poke.ataques,
          poke.evolucao,
          poke.incremento,
          0,
          1,
          poke.estaAtivo,
        );
        if (!pokerdm.find((p) => p.especie === pokemon.especie)) {
          pokerdm.push(pokemon);
        }
      }

      pokerdm.forEach((pokemon) => {
        const { x, y } = posicaoAleatoriaBioma(
          bioma,
          this.matriz,
          this.tamanho,
        );

        pokemon.posicao = { x, y };
        atualizaPosicaoNaMatriz(
          this.matriz,
          pokemon.posicao,
          this.celula,
          pokemon.id,
        );
      });

      agentes.push(...pokerdm);
    });
  }
}

export default Mapa;
