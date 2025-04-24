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

    // this.grade(this.celula);
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
          bioma.tipos.includes(pokemon.tipos[0]) &&
          pokemon.estaAtivo &&
          // pokemon.especie !== "Bulbasaur" &&
          // pokemon.especie !== "Ivysaur" &&
          // pokemon.especie !== "Venusaur" &&
          // pokemon.especie !== "Charmander" &&
          // pokemon.especie !== "Charmeleon" &&
          // pokemon.especie !== "Charizard" &&
          // pokemon.especie !== "Squirtle" &&
          // pokemon.especie !== "Wartortle" &&
          // pokemon.especie !== "Blastoise" &&
          // pokemon.especie !== "Caterpie" &&
          // pokemon.especie !== "Metapod" &&
          // pokemon.especie !== "Butterfree" &&
          // pokemon.especie !== "Weedle" &&
          // pokemon.especie !== "Kakuna" &&
          // pokemon.especie !== "Beedrill" &&
          // pokemon.especie !== "Pidgey" &&
          // pokemon.especie !== "Pidgeotto" &&
          // pokemon.especie !== "Pidgeot" &&
          // pokemon.especie !== "Rattata" &&
          // pokemon.especie !== "Raticate" &&
          // pokemon.especie !== "Spearow" &&
          // pokemon.especie !== "Fearow" &&
          // pokemon.especie !== "Ekans" &&
          // pokemon.especie !== "Arbok" &&
          // pokemon.especie !== "Pikachu" &&
          pokemon.especie !== "Raichu" &&
          pokemon.especie !== "Sandshrew" &&
          pokemon.especie !== "Sandslash" &&
          pokemon.especie !== "Nidoran♀" &&
          pokemon.especie !== "Nidorina" &&
          pokemon.especie !== "Nidoqueen" &&
          pokemon.especie !== "Nidoran♂" &&
          pokemon.especie !== "Nidorino" &&
          pokemon.especie !== "Nidoking" &&
          pokemon.especie !== "Clefairy" &&
          pokemon.especie !== "Clefable" &&
          pokemon.especie !== "Vulpix" &&
          pokemon.especie !== "Ninetales" &&
          pokemon.especie !== "Jigglypuff" &&
          pokemon.especie !== "Wigglytuff" &&
          pokemon.especie !== "Zubat" &&
          pokemon.especie !== "Golbat" &&
          pokemon.especie !== "Oddish" &&
          pokemon.especie !== "Gloom" &&
          pokemon.especie !== "Vileplume" &&
          pokemon.especie !== "Paras" &&
          pokemon.especie !== "Parasect" &&
          pokemon.especie !== "Venonat" &&
          pokemon.especie !== "Venomoth" &&
          pokemon.especie !== "Diglett" &&
          pokemon.especie !== "Dugtrio" &&
          pokemon.especie !== "Meowth" &&
          pokemon.especie !== "Persian" &&
          pokemon.especie !== "Psyduck" &&
          pokemon.especie !== "Golduck" &&
          pokemon.especie !== "Mankey" &&
          pokemon.especie !== "Primeape" &&
          pokemon.especie !== "Growlithe" &&
          pokemon.especie !== "Arcanine" &&
          pokemon.especie !== "Poliwag" &&
          pokemon.especie !== "Poliwhirl" &&
          pokemon.especie !== "Poliwrath" &&
          pokemon.especie !== "Abra" &&
          pokemon.especie !== "Kadabra" &&
          pokemon.especie !== "Alakazam" &&
          pokemon.especie !== "Machop" &&
          pokemon.especie !== "Machoke" &&
          pokemon.especie !== "Machamp" &&
          pokemon.especie !== "Bellsprout" &&
          pokemon.especie !== "Weepinbell" &&
          pokemon.especie !== "Victreebel" &&
          pokemon.especie !== "Tentacool" &&
          pokemon.especie !== "Tentacruel" &&
          pokemon.especie !== "Geodude" &&
          pokemon.especie !== "Graveler" &&
          pokemon.especie !== "Golem" &&
          pokemon.especie !== "Ponyta" &&
          pokemon.especie !== "Rapidash" &&
          pokemon.especie !== "Slowpoke" &&
          pokemon.especie !== "Slowbro" &&
          pokemon.especie !== "Magnemite" &&
          pokemon.especie !== "Magneton" &&
          pokemon.especie !== "Farfetchd" &&
          pokemon.especie !== "Doduo" &&
          pokemon.especie !== "Dodrio" &&
          pokemon.especie !== "Seel" &&
          pokemon.especie !== "Dewgong" &&
          pokemon.especie !== "Grimer" &&
          pokemon.especie !== "Muk" &&
          pokemon.especie !== "Shellder" &&
          pokemon.especie !== "Cloyster" &&
          pokemon.especie !== "Gastly" &&
          pokemon.especie !== "Haunter" &&
          pokemon.especie !== "Gengar" &&
          pokemon.especie !== "Onix" &&
          pokemon.especie !== "Drowzee" &&
          pokemon.especie !== "Hypno" &&
          pokemon.especie !== "Krabby" &&
          pokemon.especie !== "Kingler" &&
          pokemon.especie !== "Voltorb" &&
          // pokemon.especie !== "Electrode" &&
          // pokemon.especie !== "Exeggcute" &&
          // pokemon.especie !== "Exeggutor" &&
          // pokemon.especie !== "Cubone" &&
          // pokemon.especie !== "Marowak" &&
          // pokemon.especie !== "Hitmonlee" &&
          // pokemon.especie !== "Hitmonchan" &&
          // pokemon.especie !== "Lickitung" &&
          // pokemon.especie !== "Koffing" &&
          // pokemon.especie !== "Weezing" &&
          // pokemon.especie !== "Rhyhorn" &&
          // pokemon.especie !== "Rhydon" &&
          // pokemon.especie !== "Chansey" &&
          // pokemon.especie !== "Tangela" &&
          // pokemon.especie !== "Kangaskhan" &&
          // pokemon.especie !== "Horsea" &&
          // pokemon.especie !== "Seadra" &&
          // pokemon.especie !== "Goldeen" &&
          // pokemon.especie !== "Seaking" &&
          // pokemon.especie !== "Staryu" &&
          // pokemon.especie !== "Starmie" &&
          // pokemon.especie !== "Mr. Mime" &&
          // pokemon.especie !== "Scyther" &&
          // pokemon.especie !== "Jynx" &&
          // pokemon.especie !== "Electabuzz" &&
          pokemon.especie !== "Magmar" &&
          pokemon.especie !== "Pinsir" &&
          pokemon.especie !== "Tauros" &&
          pokemon.especie !== "Magikarp" &&
          pokemon.especie !== "Gyarados" &&
          pokemon.especie !== "Lapras" &&
          pokemon.especie !== "Ditto" &&
          pokemon.especie !== "Eevee" &&
          pokemon.especie !== "Vaporeon" &&
          pokemon.especie !== "Jolteon" &&
          pokemon.especie !== "Flareon" &&
          pokemon.especie !== "Porygon" &&
          pokemon.especie !== "Omanyte" &&
          pokemon.especie !== "Omastar" &&
          pokemon.especie !== "Kabuto" &&
          pokemon.especie !== "Kabutops" &&
          pokemon.especie !== "Aerodactyl" &&
          pokemon.especie !== "Snorlax" &&
          pokemon.especie !== "Articuno" &&
          pokemon.especie !== "Zapdos" &&
          pokemon.especie !== "Moltres" &&
          pokemon.especie !== "Dratini" &&
          pokemon.especie !== "Dragonair" &&
          pokemon.especie !== "Dragonite" &&
          pokemon.especie !== "Mewtwo" &&
          pokemon.especie !== "Mew",
      );

      if (!pokemons.length) return;

      const pokerdm = [];
      while (pokerdm.length < 2) {
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
        const { x, y } = posicaoAleatoriaBioma(bioma, this.matriz, celula);

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
