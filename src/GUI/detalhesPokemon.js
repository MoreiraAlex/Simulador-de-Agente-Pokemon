import { pokedex } from "../models/pokedex.js";

export function pokemonTreinador(treinador) {
  const card = document.querySelector(".hover-card");

  treinador.addEventListener("mouseover", (e) => {
    const pokemonBtn = e.target.closest(".pokemon-btn");
    if (!pokemonBtn || pokemonBtn?.disabled) return;

    const pokemon = pokedex.find((p) => p.especie === pokemonBtn.value);
    detalhesContainer(card, pokemon, e);
  });

  treinador.addEventListener("mouseout", () => {
    card.style.display = "none";
  });
}

export function pokemonSelvagem() {
  const canvas = window.canvas;

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const proporcaoX = canvas.clientWidth / canvas.width;
    const proporcaoY = canvas.clientHeight / canvas.height;

    const mouseX = (e.clientX - rect.x) / proporcaoX;
    const mouseY = (e.clientY - rect.y) / proporcaoY;

    let encontrou = false;

    window.agentes
      .filter((a) => a.getEspecie() !== "treinador")
      .forEach((pokemon) => {
        const dentro =
          mouseX >= pokemon.posicao.x &&
          mouseX <= pokemon.posicao.x + pokemon.tamanho &&
          mouseY >= pokemon.posicao.y &&
          mouseY <= pokemon.posicao.y + pokemon.tamanho;

        if (dentro) {
          encontrou = true;

          const card = document.querySelector(".hover-card");
          detalhesContainer(card, pokemon);
        }
      });

    if (!encontrou) {
      document.querySelector(".hover-card").style.display = "none";
    }
  });
}

function detalhesContainer(card, pokemon, evento) {
  card.style.display = "block";
  card.innerHTML = `
        <p><span class="font-semibold">ID:</span> ${pokemon?.id || 0}</p>
        <p><span class="font-semibold">Espécie:</span> ${pokemon?.especie}</p>
        <p><span class="font-semibold">Vida:</span> ${pokemon?.vida}</p>
        <p><span class="font-semibold">Ataque:</span> ${pokemon?.ataque}</p>
        <p><span class="font-semibold">Defesa:</span> ${pokemon?.defesa}</p>
        <p><span class="font-semibold">Nivel:</span> ${pokemon?.nivel || 0}</p>
        <p><span class="font-semibold">Experiência:</span> ${pokemon?.experiencia || 1}</p>
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
