import AgenteFactory from "../classes/agentes/AgenteFactory.js";
import { base } from "../models/mapa.js";
import { pokedex } from "../models/pokedex.js";
import { adcionaEvento, displayInput, selecionaBotao } from "../utils/GUI.js";
import { pokemonPokedexTreinador } from "./detalhesPokemon.js";

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

      const t = window.agentes.find((a) => a.getId() === Number(treinador.id));
      const baseTreinador = base.find((value) => value.treinador === t);
      baseTreinador.treinador = null;

      window.agentes.splice(
        window.agentes.findIndex((a) => a.getId() === Number(treinador.id)),
        1,
      );
    });

    pokemonPokedexTreinador(treinador);
  });
}

function criarTreinador(id) {
  const treinadorHTML = document.createElement("div");

  treinadorHTML.id = id;
  treinadorHTML.classList.add(
    "flex-1",
    "rounded-md",
    "p-2",
    "shadow-inner",
    "bg-retro-background",
    "border-4",
    "border-retro-foreground",
    "space-y-3",
    "text-xs",
    "text-retro-secondaryForeground",
  );

  treinadorHTML.innerHTML = `
  <div class="space-y-2">
    <div class="flex justify-between items-center bg-retro-foreground p-2 border-2 border-retro-foreground">
      <p class="text-retro-primaryForeground">Treinador <span>${treinadorHTML.id}</span></p>
      <button class="config btn remover bg-retro-destructive text-retro-primaryForeground px-2 py-1 border border-retro-destructive">X</button>
    </div>
    <p>Pokedex:<span>1</span></p>
  </div>

  <div class="space-y-2">
    <div class="flex justify-between items-center">
      <label for="velocidade">Velocidade</label>
      <input type="text" id="velocidadeDisplay${treinadorHTML.id}" value="3" readonly class="w-8 text-center border-2 border-retro-foreground bg-retro-muted text-retro-mutedForeground">
    </div>
    <input id="velocidadeRange${treinadorHTML.id}" type="range" name="velocidade" min="1" max="5" value="3" class="atributo w-full h-2 accent-retro-primary cursor-pointer">

    <div class="flex justify-between items-center">
      <label for="resistencia">Resistência</label>
      <input type="text" id="resistenciaDisplay${treinadorHTML.id}" value="8" readonly class="w-8 text-center border-2 border-retro-foreground bg-retro-muted text-retro-mutedForeground">
    </div>
    <input id="resistenciaRange${treinadorHTML.id}" type="range" name="resistencia" min="6" max="10" value="8" class="atributo w-full h-2 accent-retro-primary cursor-pointer">

    <div class="flex justify-between items-center">
      <label for="visao">Visão</label>
      <input type="text" id="visaoDisplay${treinadorHTML.id}" value="14" readonly class="w-8 text-center border-2 border-retro-foreground bg-retro-muted text-retro-mutedForeground">
    </div>
    <input id="visaoRange${treinadorHTML.id}" type="range" name="visao" min="10" max="18" value="14" step="2" class="atributo w-full h-2 accent-retro-primary cursor-pointer">
  </div>

  <div class="space-y-2">
    <p>Estratégia:</p>
    <div class="flex gap-1 flex-wrap">
      <button class="estrategia-btn px-3 py-1 border-2 border-retro-foreground bg-retro-primary text-retro-primaryForeground" value="agressivo">Agressivo</button>
      <button class="estrategia-btn px-3 py-1 border-2 border-retro-foreground bg-retro-foreground text-retro-primaryForeground" value="cauteloso">Cauteloso</button>
    </div>
  </div>

  <div class="space-y-2">
    <p>Pokémon Inicial:</p>
    <div class="flex gap-1 flex-wrap">
      <button class="config pokemon-btn px-3 py-1 border-2 border-retro-foreground bg-retro-primary text-retro-primaryForeground" value="Bulbasaur">Bulbasaur</button>
      <button class="config pokemon-btn px-3 py-1 border-2 border-retro-foreground bg-retro-foreground text-retro-primaryForeground" value="Charmander">Charmander</button>
      <button class="config pokemon-btn px-3 py-1 border-2 border-retro-foreground bg-retro-foreground text-retro-primaryForeground" value="Squirtle">Squirtle</button>
    </div>
  </div>

  <div class="equipe space-y-2 hidden">
    <p>Equipe Atual:</p>
    <div class="flex gap-1 flex-wrap"></div>
  </div>

  <details class="listaPokemons space-y-2 hidden">
    <summary>Pokémons</summary>
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

  const tamanho = 50;
  const pokemon = pokedex.find((poke) => poke.pokedex === 1);

  const treinador = AgenteFactory.criarAgente("treinador", {
    id: treinadorObjeto.id,
    especie: "Treinador",
    tamanho,
    velocidade: treinadorObjeto.velocidade,
    visao: treinadorObjeto.visao,
    resistencia: treinadorObjeto.resistencia,
    estrategia: "agressivo",
    equipe: [pokemon],
    pokemons: [pokemon],
  });

  base.forEach((b) => {
    if (b.treinador || treinador.getBase()) return;

    b.treinador = treinador;
    treinador.setBase({ x: b.x, y: b.y });
    treinador.setPosicao({ x: b.x, y: b.y });
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
    treinador.setEquipe([pokemon]);
    treinador.setPokemons([pokemon]);
  }
}

export function atualizaPokemonsTreinadores() {
  window.agentes.forEach((agente) => {
    if (agente.getEspecie() !== "Treinador") return;
    const treinador = document.getElementById(`${agente.getId()}`);

    atualizaPokedex(treinador, agente);
    atualizaEquipe(treinador, agente);
    atualizaListaPokemons(treinador, agente);
  });
}

function atualizaPokedex(treinador, t) {
  treinador.children[0].children[1].children[0].textContent =
    t.getPokemons().length;
}

function atualizaEquipe(treinador, t) {
  const equipe = treinador.querySelector(".equipe");
  equipe.classList.remove("hidden");
  equipe.classList.add("block");

  const equipePokemons = equipe.children[1];

  equipePokemons.innerHTML = t
    .getEquipe()
    .map((pokemon) => {
      return `<span 
              class="pokemon-detalhe px-3 py-1 border-2 border-retro-foreground bg-retro-foreground text-retro-primaryForeground cursor-help" 
              data-treinador-id="${t.getId()}" 
              data-pokemon-id="${pokemon.getId()}">
              ${pokemon.getEspecie()}
            </span>`;
    })
    .join("");
}

function atualizaListaPokemons(treinador, t) {
  const lista = treinador.querySelector(".listaPokemons");
  lista.classList.remove("hidden");
  lista.classList.add("block");

  const listaPokemons = lista.children[1];
  const pokemons = t
    .getPokemons()
    .filter((pokemon) => pokemon.getEstado())
    .sort((a, b) => a.getPokedex() - b.getPokedex());

  listaPokemons.innerHTML = pokemons
    .map((pokemon) => {
      return `<li 
              class="pokemon-detalhe px-3 py-1 border-2 border-retro-foreground bg-retro-foreground text-retro-primaryForeground cursor-help" 
              data-treinador-id="${t.getId()}" 
              data-pokemon-id="${pokemon.getId()}">
              ${pokemon.getEspecie()}
            </li>`;
    })
    .join("");
}
