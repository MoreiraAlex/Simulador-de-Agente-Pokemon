import AgenteFactory from "../classes/agentes/AgenteFactory.js";
import { pokedex } from "../models/pokedex.js";
import { adcionaEvento, displayInput, selecionaBotao } from "../utils/GUI.js";
import { pokemonTreinador } from "./detalhesPokemon.js";

export function gerenciaTreinador(maxTreinadores) {
  const listaTreinadores = document.querySelectorAll(".treinadores-lista");

  document.querySelector(".adicionar").addEventListener("click", () => {
    const treinadores =
      listaTreinadores[0].childElementCount +
      listaTreinadores[1].childElementCount;

    if (treinadores >= maxTreinadores) {
      // eslint-disable-next-line no-undef
      alert(`Limite máximo de ${maxTreinadores} treinadores atingido!`);
      return;
    }

    const id = window.sequence.next();
    const treinador = criarTreinador(id);

    const listaEsquerda = listaTreinadores[0].childElementCount;
    const listaDireita = listaTreinadores[1].childElementCount;

    if (listaEsquerda <= listaDireita) {
      listaTreinadores[0].appendChild(treinador);
    } else {
      listaTreinadores[1].appendChild(treinador);
    }

    treinador.querySelector(".remover").addEventListener("click", () => {
      treinador.remove();
    });

    pokemonTreinador(treinador);
  });
}

function criarTreinador(id) {
  const treinadorHTML = document.createElement("div");

  treinadorHTML.id = id;
  treinadorHTML.classList.add(
    "flex-1",
    "rounded-md",
    "p-2",
    "shadow-md",
    "bg-white",
  );
  treinadorHTML.innerHTML = `
        <div>
          <div class="flex justify-between items-center rounded-md">
            <p class="font-bold text">Treinador <span>${treinadorHTML.id}</span></p>
            <button class="config btn text-white remover bg-red-500 text-xs px-2 py-1 rounded-md">X</button>
          </div>
          <p class="font-bold text-sm">Pokedex: <span>1</span></p>
        </div>         
        
        <div class="space-y-1 text-xs">
          <span class="flex justify-between items-center">
            <label for="velocidade" class="block">Velocidade</label>
            <input type="text" id="velocidadeDisplay${treinadorHTML.id}" value="3" readonly class="w-8 text-center border rounded-md bg-gray-200">
          </span>
          <input id="velocidadeRange${treinadorHTML.id}" type="range" name="velocidade" min="1" max="5" value="3" 
            class="atributo w-full h-1 accent-gray-900 cursor-pointer"
          >

          <span class="flex justify-between items-center">
            <label for="resistencia" class="block">Resistência</label>
            <input type="text" id="resistenciaDisplay${treinadorHTML.id}" value="8" readonly class="w-8 text-center border rounded-md bg-gray-200">
          </span>
          <input id="resistenciaRange${treinadorHTML.id}" type="range" name="resistencia" min="6" max="10" value="8" class="atributo w-full h-1 accent-gray-900 cursor-pointer">

          <span class="flex justify-between items-center">
            <label for="visao" class="block">Visão</label>
            <input type="text" id="visaoDisplay${treinadorHTML.id}" value="14" readonly class="w-8 text-center border rounded-md bg-gray-200">
          </span>
          <input id="visaoRange${treinadorHTML.id}" type="range" name="visao" min="10" max="18" value="14" step="2" class="atributo w-full h-1 accent-gray-900 cursor-pointer">      
        </div>
        
        <div class="space-y-1 text-xs">
          <p class="font-semibold">Estratégia:</p>
          <div class="flex gap-2">
          <button class="estrategia-btn bg-gray-900 text-white p-2 py-1 rounded hover:bg-gray-700" value="agressivo">Agressivo</button>
          <button class="estrategia-btn bg-gray-500 text-white p-2 py-1 rounded hover:bg-gray-700" value="cauteloso">Cauteloso</button>
          </div>
        </div>
        
        <div class="space-y-1 text-xs">
          <p class="font-semibold">Pokémon Inicial:</p>
          <div class="flex gap-1 flex-wrap">
            <button class="config pokemon-btn bg-gray-900 text-white px-2 py-1 rounded hover:bg-gray-700" value="Bulbasaur">Bulbasaur</button>
            <button class="config pokemon-btn bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-700" value="Charmander">Charmander</button>
            <button class="config pokemon-btn bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-700" value="Squirtle">Squirtle</button>
          </div>
        </div>
  
        <div class="equipe space-y-1 text-xs hidden">
          <p class="font-semibold">Equipe Atual:</p>
          <div class="flex gap-1 flex-wrap"></div>
        </div>        
  
        <details class="listaPokemons space-y-1 text-xs hidden">
          <summary class="font-semibold">Pokemons</summary>
          <ul class="flex gap-1 flex-wrap"></ul>
        </details>
  `;

  const treinadorObjeto = { id };

  Array.from(treinadorHTML.children).forEach((t) => {
    t.querySelectorAll(".atributo").forEach((elemento) => {
      if (elemento.name) {
        treinadorObjeto[elemento.name] = elemento.value;
      }
    });
  });

  const pokemon = pokedex.find((poke) => poke.pokedex === 1);

  const treinador = AgenteFactory.criarAgente("treinador", {
    id: treinadorObjeto.id,
    especie: "treinador",
    velocidade: treinadorObjeto.velocidade,
    visao: treinadorObjeto.visao,
    resistencia: treinadorObjeto.resistencia,
    estrategia: "agressivo",
    equipe: [pokemon],
    pokemons: [pokemon],
  });

  window.sujeito.adicionarObservador(treinador);
  window.agentes.push(treinador);

  adcionaEvento(treinadorHTML, "input", (evento) =>
    displayInput(evento, `#${evento.target.name}Display${treinador.getId()}`),
  );

  adcionaEvento(treinadorHTML, "change", (evento) =>
    atributosInput(evento, treinador),
  );

  adcionaEvento(treinadorHTML, "click", (evento) =>
    atributosButton(evento, treinadorHTML, treinador),
  );

  return treinadorHTML;
}

function atributosInput(evento, treinador) {
  const input = evento.target.closest("input");
  if (!input) return;

  atualizaSliders(treinador.getId(), input.name, input.value);
}

function atualizaSliders(id, atributo, valor) {
  const velocidade = document.querySelector(`#velocidadeRange${id}`);
  const velocidadeDisplay = document.querySelector(`#velocidadeDisplay${id}`);
  const resistencia = document.querySelector(`#resistenciaRange${id}`);
  const resistenciaDisplay = document.querySelector(`#resistenciaDisplay${id}`);
  const visao = document.querySelector(`#visaoRange${id}`);
  const visaoDisplay = document.querySelector(`#visaoDisplay${id}`);

  valor = parseInt(valor);

  if (atributo === "velocidade") {
    resistencia.value = Math.max(5, 10 - (valor - 1));
    resistenciaDisplay.value = resistencia.value;

    visao.value = Math.min(18, 18 - (valor - 1) * 2);
    visaoDisplay.value = visao.value;
  } else if (atributo === "resistencia") {
    velocidade.value = Math.max(1, 5 - (valor - 6));
    velocidadeDisplay.value = velocidade.value;

    visao.value = Math.min(18, 10 + (valor - 6) * 2);
    visaoDisplay.value = visao.value;
  } else if (atributo === "visao") {
    velocidade.value = Math.max(1, 5 - Math.floor((valor - 10) / 2));
    velocidadeDisplay.value = velocidade.value;

    resistencia.value = Math.min(10, 6 + Math.floor((valor - 10) / 2));
    resistenciaDisplay.value = resistencia.value;
  }

  window.sujeito.notificarObservador(id, "velocidade", velocidade.value);
  window.sujeito.notificarObservador(id, "resistencia", resistencia.value);
  window.sujeito.notificarObservador(id, "visao", visao.value);
}

function atributosButton(evento, html, treinador) {
  const btn = evento.target.closest("button");
  if (!btn) return;

  if (evento.target.closest(".estrategia-btn")) {
    selecionaBotao(html, ".estrategia-btn", btn);
  } else {
    selecionaBotao(html, ".pokemon-btn", btn);
  }

  setAtributosButton(btn, treinador);
}

function setAtributosButton(botao, treinador) {
  if (botao.classList.contains("estrategia-btn")) {
    treinador.setEstrategia(botao.value);
  } else {
    const pokemon = pokedex.find((poke) => poke.especie === botao.value);
    treinador.setEquipe(pokemon);
    treinador.setPokemons(pokemon);
  }
}
