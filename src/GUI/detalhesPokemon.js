import Pokemon from "../classes/agentes/Pokemon.js";
import { pokedex } from "../models/pokedex.js";

export function pokemonPokedexTreinador(treinador) {
  const card = document.querySelector(".hover-card");

  treinador.addEventListener("mouseover", (e) => {
    const pokemonBtn = e.target.closest(".pokemon-btn");
    if (!pokemonBtn || pokemonBtn?.disabled) return;

    const pokemon = pokedex.find((p) => p.especie === pokemonBtn.value);
    detalhesContainer(card, pokemon, e);
  });

  treinador.addEventListener("mouseout", () => {
    card.classList.add("hidden");
  });
}

export function PokemonDetalhes() {
  document.addEventListener("mouseover", (e) => {
    const pokemonDetalhe = e.target.closest(".pokemon-detalhe");
    if (!pokemonDetalhe) return;

    const treinadorId = pokemonDetalhe.getAttribute("data-treinador-id");
    const pokemonId = parseInt(pokemonDetalhe.getAttribute("data-pokemon-id"));

    const treinador = window.agentes.find(
      (a) => a.getId() === Number(treinadorId),
    );
    const pokemon = treinador
      ?.getPokemons?.()
      .find((p) => p.getId() === pokemonId);

    if (pokemon) {
      const card = document.querySelector(".hover-card");
      detalhesContainer(card, pokemon, e);
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(".pokemon-detalhe")) {
      const card = document.querySelector(".hover-card");
      card.classList.add("hidden");
    }
  });
}

export function pokemonCanvas() {
  const canvas = window.canvas;

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const proporcaoX = canvas.clientWidth / canvas.width;
    const proporcaoY = canvas.clientHeight / canvas.height;

    const mouseX = (e.clientX - rect.x) / proporcaoX;
    const mouseY = (e.clientY - rect.y) / proporcaoY;

    let encontrou = false;
    let pokemonSelecionado = null;

    // Verifica selvagens
    window.agentes
      .filter((a) => a.getEspecie() !== "treinador")
      .forEach((pokemon) => {
        const dentro =
          mouseX >= pokemon.getPosicao().x &&
          mouseX <= pokemon.getPosicao().x + pokemon.getTamanho() &&
          mouseY >= pokemon.getPosicao().y &&
          mouseY <= pokemon.getPosicao().y + pokemon.getTamanho();

        if (dentro) {
          encontrou = true;
          pokemonSelecionado = pokemon;
        }
      });

    // Verifica Pokémon de treinadores
    window.agentes
      .filter((a) => a.getEspecie() === "Treinador")
      .forEach((treinador) => {
        treinador.getEquipe().forEach((pokemon) => {
          if (pokemon instanceof Pokemon) {
            const dentro =
              mouseX >= pokemon.getPosicao().x &&
              mouseX <= pokemon.getPosicao().x + pokemon.getTamanho() &&
              mouseY >= pokemon.getPosicao().y &&
              mouseY <= pokemon.getPosicao().y + pokemon.getTamanho();

            if (dentro) {
              encontrou = true;
              pokemonSelecionado = pokemon;
            }
          }
        });
      });

    const card = document.querySelector(".hover-card");
    if (encontrou && pokemonSelecionado) {
      detalhesContainer(card, pokemonSelecionado, e);
    } else {
      card.classList.add("hidden");
    }
  });
}

export function detalhesContainer(card, pokemon, evento) {
  card.classList.remove("hidden");

  const poke = {
    id: typeof pokemon?.getId === "function" ? pokemon.getId() : pokemon.id,
    especie:
      typeof pokemon?.getEspecie === "function"
        ? pokemon.getEspecie()
        : pokemon.especie,
    vida:
      typeof pokemon?.getVida === "function" ? pokemon.getVida() : pokemon.vida,
    ataque:
      typeof pokemon?.getAtaque === "function"
        ? pokemon.getAtaque()
        : pokemon.ataque,
    defesa:
      typeof pokemon?.getDefesa === "function"
        ? pokemon.getDefesa()
        : pokemon.defesa,
    nivel:
      typeof pokemon?.getNivel === "function"
        ? pokemon.getNivel()
        : pokemon.nivel,
    experiencia:
      typeof pokemon?.getExperiencia === "function"
        ? pokemon.getExperiencia()
        : pokemon.experiencia,
  };

  card.innerHTML = `
        <p>
           <span class="font-semibold">ID:</span>
           <span class="text-retro-primary">${poke.id || 0}</span>  
        <p>
           <span class="font-semibold">Espécie:</span>
           <span class="text-retro-primary">${poke.especie}</span>
        </p>
        <p>
           <span class="font-semibold">Vida:</span>
           <span class="text-retro-primary">${poke.vida}</span>
        </p>
        <p>
           <span class="font-semibold">Ataque:</span>
           <span class="text-retro-primary">${poke.ataque}</span>
        </p>
        <p>
           <span class="font-semibold">Defesa:</span>
           <span class="text-retro-primary">${poke.defesa}</span>
        </p>
        <p>
           <span class="font-semibold">Nivel:</span>
           <span class="text-retro-primary">${poke.nivel || 0}</span>
        </p>
        <p>
           <span class="font-semibold">Experiência:</span>
           <span class="text-retro-primary">${poke.experiencia || 1}</span>
        </p>
       
    `;

  // eslint-disable-next-line no-undef
  requestAnimationFrame(() => {
    const padding = 10;
    const cardRect = card.getBoundingClientRect();

    let left = evento.clientX + padding;
    let top = evento.clientY + padding;

    // Inverte horizontalmente se ultrapassar largura da tela
    if (left + cardRect.width > window.innerWidth) {
      left = evento.clientX - cardRect.width - padding;
    }

    // Inverte verticalmente se ultrapassar altura da tela
    if (top + cardRect.height > window.innerHeight) {
      top = evento.clientY - cardRect.height - padding;
    }

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  });
}
