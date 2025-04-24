import Simulacao from "../classes/simulacao.js";
import { pokedex } from "../models/pokedex.js";

document.addEventListener("DOMContentLoaded", () => {
  window.lucide.createIcons();

  const canvas = document.querySelector("#game-canvas");
  const ctx = canvas.getContext("2d");

  const config = {
    canvas,
    contexto: ctx,
    multiplicador: 1,
    treinadores: 0,
    pathFinder: window.PF,
  };

  GUI(config);
  adicionaRemoveTreinador(config);

  window.alternarBotao = alternarBotao;
  window.atualizaSliders = atualizaSliders;
  window.setAtributo = setAtributo;
});

function adicionaRemoveTreinador(config) {
  const btnAdicionar = document.querySelector(".adicionar");
  const listaTreinadores = document.querySelectorAll(".treinadores-lista");
  const maxTreinadores = 4;

  btnAdicionar.addEventListener("click", () => {
    if (config.treinadores >= maxTreinadores) {
      // eslint-disable-next-line no-undef
      alert(`Limite máximo de ${maxTreinadores} treinadores atingido!`);
      return;
    }

    config.treinadores++;

    const treinador = document.createElement("div");
    treinador.classList.add(
      "flex-1",
      "rounded-md",
      "p-2",
      "shadow-md",
      "bg-white",
    );
    treinador.id = Math.floor((Math.random() * 1000) / config.treinadores);

    treinador.innerHTML = `
      <div>
        <div class="flex justify-between items-center rounded-md">
          <p class="font-bold text">Treinador <span class="contador-treinadores">${treinador.id}</span></p>
          <button class="config btn text-white remover bg-red-500 text-xs px-2 py-1 rounded-md">X</button>
        </div>
        <p class="font-bold text-sm">Pokedex: <span>1</span></p>
      </div>         
      
      <div class="space-y-1 text-xs">
        <span class="flex justify-between items-center">
          <label for="velocidade" class="block">Velocidade</label>
          <input type="text" id="displayVel${treinador.id}" value="3" readonly class="w-8 text-center border rounded-md bg-gray-200">
        </span>
        <input id="slVel${treinador.id}" type="range" name="velocidade" min="1" max="5" value="3" oninput="displayVel${treinador.id}.value=value" 
          class="atributo w-full h-1 accent-gray-900 cursor-pointer"
          onchange="
            displayVel${treinador.id}.value=value; 
            atualizaSliders(${treinador.id}, 'velocidade', value);"
        >
        <span class="flex justify-between items-center">
          <label for="resistencia" class="block">Resistência</label>
          <input type="text" id="displayRe${treinador.id}" value="8" readonly class="w-8 text-center border rounded-md bg-gray-200">
        </span>
        <input id="slRe${treinador.id}" type="range" name="resistencia" min="6" max="10" value="8" oninput="displayRe${treinador.id}.value=value"
          class="atributo w-full h-1 accent-gray-900 cursor-pointer"
          onchange="
            displayRe${treinador.id}.value=value
            atualizaSliders(${treinador.id}, 'resistencia', value);"
        >
        <span class="flex justify-between items-center">
          <label for="visao" class="block">Visão</label>
          <input type="text" id="displayVi${treinador.id}" value="14" readonly class="w-8 text-center border rounded-md bg-gray-200">
        </span>
        <input id="slVi${treinador.id}" type="range" name="visao" min="10" max="18" value="14" step="2" oninput="displayVi${treinador.id}.value=value"  
          class="atributo w-full h-1 accent-gray-900 cursor-pointer"
          onchange="
            displayVi${treinador.id}.value=value
            atualizaSliders(${treinador.id}, 'visao', value);"
        >      
      </div>
      
      <div class="space-y-1 text-xs">
        <p class="font-semibold">Estratégia:</p>
        <div class="flex gap-2">
        <button onclick="setAtributo(${treinador.id}, 'estrategia', value)" class="atributo estrategia-btn bg-gray-900 text-white p-2 py-1 rounded" aria-selected="true" value="agressivo">Agressivo</button>
        <button onclick="setAtributo(${treinador.id}, 'estrategia', value)" class="atributo estrategia-btn bg-gray-500 text-white p-2 py-1 rounded" aria-selected="false" value="cauteloso">Cauteloso</button>
        </div>
      </div>
      
      <div class="space-y-1 text-xs">
        <p class="font-semibold">Pokémon Inicial:</p>
        <div class="flex gap-1 flex-wrap">
          <button class="config atributo pokemon-btn${treinador.id} bg-gray-900 text-white px-2 py-1 rounded" aria-selected="true" value="Bulbasaur">Bulbasaur</button>
          <button class="config atributo pokemon-btn${treinador.id} bg-gray-500 text-white px-2 py-1 rounded" aria-selected="false" value="Charmander">Charmander</button>
          <button class="config atributo pokemon-btn${treinador.id} bg-gray-500 text-white px-2 py-1 rounded" aria-selected="false" value="Squirtle">Squirtle</button>
        </div>
      </div>

      <div class="equipe space-y-1 text-xs hidden">
        <p class="font-semibold">Equipe Atual:</p>
        <div class="flex gap-1 flex-wrap"></div>
      </div>        

      <details class="space-y-1 text-xs listaPokemons">
        <summary class="font-semibold">Pokemons</summary>
        <ul class="flex gap-1 flex-wrap"></ul>
      </details>
    `;

    const total0 = listaTreinadores[0].childElementCount;
    const total1 = listaTreinadores[1].childElementCount;

    if (total0 <= total1) {
      listaTreinadores[0].appendChild(treinador);
    } else {
      listaTreinadores[1].appendChild(treinador);
    }

    treinador.querySelector(".remover").addEventListener("click", () => {
      treinador.remove();
      config.treinadores--;
    });

    treinador.querySelectorAll(".estrategia-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const parent = btn.parentElement;
        parent.querySelectorAll(".estrategia-btn").forEach((b) => {
          b.ariaSelected = "false";
          b.classList.remove("bg-gray-900");
          b.classList.add("bg-gray-500");
        });
        btn.ariaSelected = "true";
        btn.classList.remove("bg-gray-500");
        btn.classList.add("bg-gray-900");
      });
    });

    treinador.querySelectorAll(`.pokemon-btn${treinador.id}`).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;

        const parent = btn.parentElement;
        parent.querySelectorAll(`.pokemon-btn${treinador.id}`).forEach((b) => {
          b.ariaSelected = "false";
          b.classList.remove("bg-gray-900");
          b.classList.add("bg-gray-500");
        });
        btn.ariaSelected = "true";
        btn.classList.remove("bg-gray-500");
        btn.classList.add("bg-gray-900");
      });

      btn.addEventListener("mouseover", (e) => {
        if (globalThis.simu) return;
        const pokemon = pokedex.find((poke) => poke.especie === btn.value);
        const card = document.querySelector(".hover-card");

        const info = document.createElement("div");
        info.innerHTML = `
          <p><span class="font-semibold">Espécie:</span> ${pokemon?.especie}</p>
          <p><span class="font-semibold">Vida:</span> ${pokemon?.vida}</p>
          <p><span class="font-semibold">Ataque:</span> ${pokemon?.ataque}</p>
          <p><span class="font-semibold">Defesa:</span> ${pokemon?.defesa}</p>
          <p><span class="font-semibold">Experiência:</span> 0</p>
          <p><span class="font-semibold">nivel:</span> 1</p>
        `;

        card.innerHTML = "";
        card.appendChild(info);
        card.style.display = "block";
        // eslint-disable-next-line no-undef
        requestAnimationFrame(() => {
          const padding = 10;
          const cardRect = card.getBoundingClientRect();

          let left = e.clientX + padding;
          let top = e.clientY + padding;

          // Inverte horizontalmente se ultrapassar largura da tela
          if (left + cardRect.width > window.innerWidth) {
            left = e.clientX - cardRect.width - padding;
          }

          // Inverte verticalmente se ultrapassar altura da tela
          if (top + cardRect.height > window.innerHeight) {
            top = e.clientY - cardRect.height - padding;
          }

          card.style.left = `${left}px`;
          card.style.top = `${top}px`;
        });
      });
      btn.addEventListener("mouseout", () => {
        document.querySelector(".hover-card").style.display = "none";
      });
    });
  });
}

function setAtributo(id, atributo, valor) {
  if (globalThis.simu) {
    const index = globalThis.simu.agentes.findIndex((t) => t.id === id);
    globalThis.simu.agentes[index][atributo] = valor;
  }
}

function atualizaSliders(id, atributo, valor) {
  const velocidade = document.querySelector(`#slVel${id}`);
  const velocidadeDisplay = document.querySelector(`#displayVel${id}`);
  const resistencia = document.querySelector(`#slRe${id}`);
  const resistenciaDisplay = document.querySelector(`#displayRe${id}`);
  const visao = document.querySelector(`#slVi${id}`);
  const visaoDisplay = document.querySelector(`#displayVi${id}`);

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

  setAtributo(id, "velocidade", velocidade.value);
  setAtributo(id, "resistencia", resistencia.value);
  setAtributo(id, "visao", visao.value);
}

function verificaFimJogo(cronometro) {
  if (globalThis.simu) {
    const btnModo = Array.from(document.querySelectorAll(".modo-btn"));
    const modo = btnModo.find((b) => b.ariaSelected === "true");

    const mostrarModal = (mensagem) => {
      const modal = document.getElementById("modal-vencedores");
      const resultado = document.getElementById("resultado-texto");
      resultado.textContent = mensagem;
      modal.classList.remove("hidden");

      document.getElementById("btn-reiniciar").onclick = () => {
        window.location.reload();
      };
    };

    const limite = document
      .querySelector(".limite")
      .querySelector("input[type='range']");

    if (modo.value === "total" || modo.value === "captura") {
      const maximo = Number(limite.value) === 0 ? 151 : Number(limite.value);

      const vencedores = globalThis.simu.agentes.filter(
        (treinador) => treinador.pokemons?.length === maximo,
      );

      if (vencedores.length) {
        let saida = "Vencedores:\n";
        vencedores.forEach((vencedor) => {
          saida += `Treinador#${vencedor.id} com ${vencedor.pokemons.length} Pokemon(s)\n`;
        });

        mostrarModal(saida);
        globalThis.simu.pausar();
        clearInterval(cronometro.interval);
        return true;
      }
    } else if (limite.value && cronometro.segundos >= limite.value * 60) {
      const vencedores = globalThis.simu.agentes.sort(
        (a, b) => b.pokemons?.length - a.pokemons?.length,
      );

      if (vencedores.length) {
        let saida = "\n";
        vencedores.forEach((vencedor, indice) => {
          saida += `${indice + 1}º Lugar: Treinador#${vencedor.id} com ${vencedor.pokemons.length} Pokemon(s)\n`;
        });

        mostrarModal(saida);
        globalThis.simu.pausar();
        clearInterval(cronometro.interval);
        return true;
      }
    }
  }

  return false;
}

function cronometro(config) {
  config.cronometro.interval = setInterval(() => {
    if (globalThis.simu) {
      globalThis.simu.agentes.forEach((t) => {
        if (t.especie !== "humana") return;
        const treinador = document.getElementById(`${t.id}`);
        treinador.children[0].children[1].children[0].textContent =
          t.pokemons.length;

        const equipe = treinador.querySelector(".equipe");
        equipe.style.display = "block";
        const equipePokemons = equipe.children[1];

        equipePokemons.innerHTML = t.equipe
          .map(
            (pokemon) =>
              `<span class="pokemonDetalhe bg-gray-900 text-white px-2 py-1 rounded">${pokemon.especie}</span>`,
          )
          .join("");

        const lista = treinador.querySelector(".listaPokemons");
        const listaPokemons = lista.children[1];
        const pokemons = t.pokemons
          .filter((pokemon) => pokemon.estaAtivo)
          .sort((a, b) => a.pokedex - b.pokedex);

        listaPokemons.innerHTML = pokemons
          .map(
            (pokemon) =>
              `<li class="pokemonDetalhe bg-gray-900 text-white px-2 py-1 rounded">${pokemon.especie}</li>`,
          )
          .join("");

        document.querySelectorAll(".pokemonDetalhe").forEach((poke) => {
          poke.addEventListener("mouseover", (e) => {
            const pokemon = t.pokemons.find(
              (p) => p.especie === poke.innerHTML,
            );
            const card = document.querySelector(".hover-card");

            const info = document.createElement("div");
            info.innerHTML = `
                <p><span class="font-semibold">ID:</span> ${pokemon?.id}</p>
                <p><span class="font-semibold">Espécie:</span> ${pokemon?.especie}</p>
                <p><span class="font-semibold">Vida:</span> ${pokemon?.vida}</p>
                <p><span class="font-semibold">Ataque:</span> ${pokemon?.ataque}</p>
                <p><span class="font-semibold">Defesa:</span> ${pokemon?.defesa}</p>
                <p><span class="font-semibold">Nivel:</span> ${pokemon?.nivel}</p>
                <p><span class="font-semibold">Experiência:</span> ${pokemon?.experiencia}</p>
              `;

            card.innerHTML = "";
            card.appendChild(info);
            card.style.display = "block";

            // eslint-disable-next-line no-undef
            requestAnimationFrame(() => {
              const padding = 10;
              const cardRect = card.getBoundingClientRect();

              let left = e.clientX + padding;
              let top = e.clientY + padding;

              // Inverte horizontalmente se ultrapassar largura da tela
              if (left + cardRect.width > window.innerWidth) {
                left = e.clientX - cardRect.width - padding;
              }

              // Inverte verticalmente se ultrapassar altura da tela
              if (top + cardRect.height > window.innerHeight) {
                top = e.clientY - cardRect.height - padding;
              }

              card.style.left = `${left}px`;
              card.style.top = `${top}px`;
            });
          });
        });
        document.querySelectorAll(".pokemonDetalhe").forEach((poke) => {
          poke.addEventListener("mouseout", () => {
            document.querySelector(".hover-card").style.display = "none";
          });
        });
      });
    }
    if (verificaFimJogo(config.cronometro)) {
      return;
    }

    config.cronometro.segundos++;

    const minutos = Math.floor(config.cronometro.segundos / 60);
    const seg = config.cronometro.segundos % 60;

    config.cronometro.conteudo.textContent = `${String(minutos).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  }, 1000 / globalThis.multiplicador);
}

function multiplicadorControle(config, multiplicador, direcao) {
  let valor = Number(multiplicador.textContent);

  if (direcao === "atras" && valor > 1) valor /= 2;
  else if (direcao === "frente" && valor < 8) valor *= 2;

  multiplicador.textContent = valor;

  const pause =
    document
      .querySelector(".iniciar")
      .querySelector("svg")
      .getAttribute("data-lucide") !== "pause-circle";

  if (globalThis.multiplicador && !pause) {
    globalThis.multiplicador = valor;
    clearInterval(config.cronometro.interval);
    cronometro(config);
  } else {
    config.multiplicador = valor;
  }
}

function GUI(config) {
  const btnIniciar = document.querySelector(".iniciar");
  const btnRetroceder = document.querySelector(".retroceder");
  const btnAvancar = document.querySelector(".avancar");
  const btnParar = document.querySelector(".parar");
  const multiplicador = document.querySelector(".multiplicador");
  const relogio = document.querySelector(".relogio");
  const listaTreinadores = document.querySelectorAll(".treinadores-lista");

  config.cronometro = {
    interval: null,
    conteudo: relogio,
    segundos: 0,
  };

  globalThis.simu = null;

  btnIniciar.addEventListener("click", () => {
    // if (listaTreinadores.children.length <= 1) {
    //   // eslint-disable-next-line no-undef
    //   alert(
    //     "Adicione pelo menos dois treinadores antes de iniciar a simulação!",
    //   );
    //   return;
    // }

    rodar(btnIniciar, btnParar, listaTreinadores, config);
  });

  btnParar.addEventListener("click", () => {
    parar(btnIniciar, btnParar, listaTreinadores, multiplicador, config);
  });

  btnRetroceder.addEventListener("click", () => {
    multiplicadorControle(config, multiplicador, "atras");
  });

  btnAvancar.addEventListener("click", () => {
    multiplicadorControle(config, multiplicador, "frente");
  });

  document.querySelectorAll(".modo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove o estilo ativo de todos os botões
      document.querySelectorAll(".modo-btn").forEach((b) => {
        b.ariaSelected = "false";
        b.classList.remove("bg-gray-900");
        b.classList.add("bg-gray-500");
      });

      // Ativa o botão clicado
      btn.ariaSelected = "true";
      btn.classList.remove("bg-gray-500");
      btn.classList.add("bg-gray-900");

      // Aqui você pode armazenar o valor selecionado, se quiser
      const valorSelecionado = btn.value;

      const div = document.querySelector(".limite");
      const label = div.querySelector("label");
      const input = div.querySelector("input[type='range']");
      const display = div.querySelector("input[type='text']");

      div.style.display = "block";

      if (valorSelecionado === "tempo") {
        label.textContent = "Limite de tempo(minutos):";
        input.setAttribute("min", 1);
        input.setAttribute("max", 10);
        input.value = 1;
        display.value = 1;
      } else if (valorSelecionado === "captura") {
        label.textContent = "Limite de captura:";
        input.setAttribute("min", 2);
        input.setAttribute("max", 150);
        input.value = 10;
        display.value = 10;
      } else {
        div.style.display = "none";
      }
    });
  });

  config.canvas.addEventListener("mousemove", (e) => {
    if (!globalThis.simu) return;

    const rect = config.canvas.getBoundingClientRect();
    const proporcaoX = config.canvas.clientWidth / config.canvas.width;
    const proporcaoY = config.canvas.clientHeight / config.canvas.height;

    const mouseX = (e.clientX - rect.x) / proporcaoX;
    const mouseY = (e.clientY - rect.y) / proporcaoY;

    let encontrou = false;

    globalThis.simu.agentes.forEach((pokemon) => {
      const dentro =
        mouseX >= pokemon.posicao.x &&
        mouseX <= pokemon.posicao.x + pokemon.tamanho &&
        mouseY >= pokemon.posicao.y &&
        mouseY <= pokemon.posicao.y + pokemon.tamanho;

      if (dentro) {
        encontrou = true;

        const card = document.querySelector(".hover-card");
        card.style.display = "block";
        card.innerHTML = `
          <p><span class="font-semibold">ID:</span> ${pokemon?.id}</p>
          <p><span class="font-semibold">Espécie:</span> ${pokemon?.especie}</p>
          <p><span class="font-semibold">Vida:</span> ${pokemon?.vida}</p>
          <p><span class="font-semibold">Ataque:</span> ${pokemon?.ataque}</p>
          <p><span class="font-semibold">Defesa:</span> ${pokemon?.defesa}</p>
          <p><span class="font-semibold">Nivel:</span> ${pokemon?.nivel}</p>
          <p><span class="font-semibold">Experiência:</span> ${pokemon?.experiencia}</p>
        `;

        // eslint-disable-next-line no-undef
        requestAnimationFrame(() => {
          const padding = 10;
          const cardRect = card.getBoundingClientRect();

          let left = e.clientX + padding;
          let top = e.clientY + padding;

          // Inverte horizontalmente se ultrapassar largura da tela
          if (left + cardRect.width > window.innerWidth) {
            left = e.clientX - cardRect.width - padding;
          }

          // Inverte verticalmente se ultrapassar altura da tela
          if (top + cardRect.height > window.innerHeight) {
            top = e.clientY - cardRect.height - padding;
          }

          card.style.left = `${left}px`;
          card.style.top = `${top}px`;
        });
      }
    });

    if (!encontrou) {
      document.querySelector(".hover-card").style.display = "none";
    }
  });
}

function alternarBotao(botao) {
  const wrapper = botao;
  const svg = wrapper.querySelector("svg");

  if (svg) svg.remove();

  const novoIcone = document.createElement("i");
  const estaTocando = wrapper.dataset.estado === "rodando";

  novoIcone.setAttribute(
    "data-lucide",
    estaTocando ? "circle-play" : "pause-circle",
  );
  novoIcone.className = "w-5 h-5 rotate-180";

  wrapper.dataset.estado = estaTocando ? "pausado" : "rodando";
  wrapper.appendChild(novoIcone);

  window.lucide.createIcons();
}

function rodar(btnIniciar, btnParar, listaTreinadores, config) {
  alternarBotao(btnIniciar);

  if (btnIniciar.children[0].getAttribute("data-lucide") !== "pause-circle") {
    clearInterval(config.cronometro.interval);
    if (globalThis.simu) {
      globalThis.simu.pausar();
    }
    return;
  }

  btnParar.disabled = false;
  btnParar.style.opacity = "1";
  document.querySelectorAll(".config").forEach((elemento) => {
    if (!elemento.checked) {
      elemento.disabled = true;
      elemento.style.opacity = "0.5";
    }
  });
  if (globalThis.simu) {
    globalThis.simu.loop();
  } else {
    simulação(listaTreinadores, config);
  }
  cronometro(config);
}

function parar(btnIniciar, btnParar, listaTreinadores, multiplicador, config) {
  if (globalThis.simu) {
    globalThis.simu.parar();
    globalThis.simu = null;
    globalThis.multiplicador = null;
  }
  clearInterval(config.cronometro.interval);
  config.cronometro.conteudo.textContent = "00:00";
  config.cronometro.segundos = 0;
  multiplicador.textContent = 1;

  config.contadorTreinadores = 0;

  alternarBotao(btnIniciar);

  btnParar.disabled = true;
  btnParar.style.opacity = "0.5";

  document.querySelectorAll(".config").forEach((elemento) => {
    elemento.disabled = false;
    elemento.style.opacity = "1";
  });

  config.treinadores = 0;
  listaTreinadores.forEach((lista) => {
    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }
  });
}

function simulação(listaTreinadores, config) {
  const modo = document.querySelectorAll('input[name="modo"]');

  config.treinadores = [];

  modo.forEach((elemento) => {
    if (elemento.checked)
      config.modo = {
        nome: elemento.value === "0" ? "Captura" : elemento.value,
        limite:
          elemento.value === "0"
            ? 151
            : document.querySelector(".limite").querySelector("input").value,
      };
  });

  listaTreinadores.forEach((lista) => {
    Array.from(lista.children).forEach((t) => {
      const treinador = {
        id: Number(t.id),
      };

      t.querySelectorAll(".atributo").forEach((elemento) => {
        if (elemento.name) {
          treinador[elemento.name] = elemento.value;
        }

        if (elemento.ariaSelected === "true") {
          if (elemento.classList.contains("estrategia-btn")) {
            treinador.estrategia = elemento.value;
          } else {
            treinador.pokemon = pokedex.find(
              (poke) => poke.especie === elemento.value,
            );
          }
        }
      });

      config.treinadores.push(treinador);
    });
  });

  if (!globalThis.simu) {
    globalThis.simu = new Simulacao(config);
    globalThis.simu.inciar();
    globalThis.simu.loop();
  }
}
