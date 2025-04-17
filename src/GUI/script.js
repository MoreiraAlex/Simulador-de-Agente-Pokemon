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

  window.setAtributo = setAtributo;
  window.alternarBotao = alternarBotao;
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
          <input type="text" id="displayVel${treinador.id}" value="1" readonly class="w-8 text-center border rounded-md bg-gray-200">
        </span>
        <input type="range" name="velocidade" min="1" max="5" value="1" oninput="displayVel${treinador.id}.value=value" 
          class="atributo w-full h-1 accent-gray-900 cursor-pointer"
          onchange="displayVel${treinador.id}.value=value; setAtributo(${treinador.id}, 'velocidade', value)"
        >
        <span class="flex justify-between items-center">
          <label for="resistencia" class="block">Resistência</label>
          <input type="text" id="displayRe${treinador.id}" value="5" readonly class="w-8 text-center border rounded-md bg-gray-200">
        </span>
        <input type="range" name="resistencia" min="5" max="10" value="1" oninput="displayRe${treinador.id}.value=value"
          class="atributo w-full h-1 accent-gray-900 cursor-pointer"
          onchange="setAtributo(${treinador.id}, 'resistencia', value); displayRe${treinador.id}.value=value"
        >
        <span class="flex justify-between items-center">
          <label for="visao" class="block">Visão</label>
          <input type="text" id="displayVi${treinador.id}" value="10" readonly class="w-8 text-center border rounded-md bg-gray-200">
        </span>
        <input type="range" name="visao" min="10" max="30" value="1" oninput="displayVi${treinador.id}.value=value"  
          class="atributo w-full h-1 accent-gray-900 cursor-pointer"
          onchange="setAtributo(${treinador.id}, 'visao', value); displayVi${treinador.id}.value=value"
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
          <button class="config atributo pokemon-btn bg-gray-900 text-white px-2 py-1 rounded" aria-selected="true" value="1">Bulbasaur</button>
          <button class="config atributo pokemon-btn bg-gray-500 text-white px-2 py-1 rounded" aria-selected="false" value="4">Charmander</button>
          <button class="config atributo pokemon-btn bg-gray-500 text-white px-2 py-1 rounded" aria-selected="false" value="7">Squirtle</button>
        </div>
      </div>

      <div class="space-y-1 text-xs hidden">
        <p class="font-semibold">Equipe Atual:</p>
        <div class="flex gap-1 flex-wrap">
            <span class="bg-gray-900 text-white px-2 py-1 rounded">Pikachu</span>
          <span class="bg-gray-900 text-white px-2 py-1 rounded">Squirtle</span>
          <span class="bg-gray-900 text-white px-2 py-1 rounded">Charmander</span>
          <span class="bg-gray-900 text-white px-2 py-1 rounded">Bulbasaur</span>
        </div>
      </div>        
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

    treinador.querySelectorAll(".pokemon-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;

        const parent = btn.parentElement;
        parent.querySelectorAll(".pokemon-btn").forEach((b) => {
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
        const pokemon = pokedex.find(
          (poke) => poke.numeroPokedex === Number(btn.value),
        );
        const card = document.querySelector(".hover-card");

        const info = document.createElement("div");
        info.innerHTML = `
          <p><span class="font-semibold">Espécie:</span> ${pokemon.especie}</p>
          <p><span class="font-semibold">Vida:</span> ${pokemon.hp}</p>
          <p><span class="font-semibold">Ataque:</span> ${pokemon.ataque}</p>
          <p><span class="font-semibold">Defesa:</span> ${pokemon.defesa}</p>
          <p><span class="font-semibold">Velocidade:</span> ${pokemon.atkSpeed}</p>
          <p><span class="font-semibold">Experiência:</span> 0</p>
          <p><span class="font-semibold">Level:</span> 1</p>
        `;

        card.innerHTML = "";
        card.appendChild(info);
        card.style.display = "block";
        card.style.left = `${e.clientX + 10}px`;
        card.style.top = `${e.clientY + 10}px`;
      });
      btn.addEventListener("mouseout", () => {
        document.querySelector(".hover-card").style.display = "none";
      });
    });
  });
}

function setAtributo(id, atributo, valor) {
  if (globalThis.simu) {
    let index = 0;
    globalThis.simu.treinadores.find((t, idx) => {
      index = idx;
      return t.id === id;
    });
    globalThis.simu.treinadores[index][atributo] = valor;
  }
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

      const vencedores = globalThis.simu.treinadores.filter(
        (treinador) => treinador.pokemons.length === maximo,
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
      const vencedores = globalThis.simu.treinadores.sort(
        (a, b) => b.pokemons.length - a.pokemons.length,
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
      globalThis.simu.treinadores.forEach((t) => {
        const treinador = document.getElementById(`${t.id}`);
        treinador.children[0].children[1].children[0].textContent =
          t.pokemons.length;
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

  if (globalThis.multiplicador) {
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
    parar(btnIniciar, btnParar, listaTreinadores, config);
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

    globalThis.simu.pokemons.forEach((pokemon) => {
      const dentro =
        mouseX >= pokemon.posicao.x &&
        mouseX <= pokemon.posicao.x + pokemon.tamanho &&
        mouseY >= pokemon.posicao.y &&
        mouseY <= pokemon.posicao.y + pokemon.tamanho;

      if (!dentro) {
        document.querySelector(".hover-card").style.display = "none";
        return;
      }

      const card = document.querySelector(".hover-card");
      const info = document.createElement("div");
      info.innerHTML = `
          <p><span class="font-semibold">Espécie:</span> ${pokemon.especie}</p>
          <p><span class="font-semibold">Vida:</span> ${pokemon.vida}</p>
          <p><span class="font-semibold">Ataque:</span> ${pokemon.ataque}</p>
          <p><span class="font-semibold">Defesa:</span> ${pokemon.defesa}</p>
          <p><span class="font-semibold">Velocidade:</span> ${pokemon.velocidadeAtaque}</p>
          <p><span class="font-semibold">Experiência:</span> 0</p>
          <p><span class="font-semibold">Level:</span> 1</p>
        `;
      card.innerHTML = "";
      card.appendChild(info);
      card.style.display = "block";
      card.style.left = `${e.clientX + 10}px`;
      card.style.top = `${e.clientY + 10}px`;
    });
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

function parar(btnIniciar, btnParar, listaTreinadores, config) {
  if (globalThis.simu) {
    globalThis.simu.parar();
    globalThis.simu = null;
  }
  clearInterval(config.cronometro.interval);
  config.cronometro.conteudo.textContent = "00:00";
  config.cronometro.segundos = 0;

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
        pokemons: [],
        equipe: [],
      };

      t.querySelectorAll(".atributo").forEach((elemento) => {
        if (elemento.name) {
          treinador[elemento.name] = elemento.value;
        }

        if (elemento.ariaSelected === "true") {
          if (elemento.classList.contains("estrategia-btn")) {
            treinador.estrategia = elemento.value;
          } else {
            treinador.equipe.push(pokedex[Number(elemento.value) - 1]);
            treinador.pokemons.push(pokedex[Number(elemento.value) - 1]);
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
