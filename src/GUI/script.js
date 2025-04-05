document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#game-canvas");
  const ctx = canvas.getContext("2d");

  const config = {
    treinadores: 0,
  };

  referencia(canvas, ctx);
  controlaMapa(canvas);
  adicionaRemoveTreinador(config);
  GUI(config);
});

function referencia(canvas, ctx) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Quadrado vermelho
  ctx.fillStyle = "red";
  ctx.fillRect(centerX - 10, centerY - 10, 20, 20);

  // Círculo azul
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Linhas cruzadas (Eixo X e Y)
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 100, centerY);
  ctx.lineTo(centerX + 100, centerY);
  ctx.moveTo(centerX, centerY - 100);
  ctx.lineTo(centerX, centerY + 100);
  ctx.stroke();
}

function controlaMapa(canvas) {
  const container = canvas.parentElement;
  let isDragging = false;
  let startX, startY, scrollLeft, scrollTop;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - canvas.offsetLeft;
    startY = e.pageY - canvas.offsetTop;
    scrollLeft = container.scrollLeft;
    scrollTop = container.scrollTop;
    canvas.style.cursor = "grabbing";
  });

  canvas.addEventListener("mouseleave", () => {
    isDragging = false;
    canvas.style.cursor = "grab";
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
    canvas.style.cursor = "grab";
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;
    const walkX = (x - startX) * -1;
    const walkY = (y - startY) * -1;
    container.scrollLeft = scrollLeft + walkX;
    container.scrollTop = scrollTop + walkY;
  });
}

function adicionaRemoveTreinador(config) {
  const btnAdicionar = document.querySelector(".adicionar");
  const listaTreinadores = document.querySelector(".treinadores-lista");
  const maxTreinadores = 4;

  btnAdicionar.addEventListener("click", () => {
    if (config.treinadores >= maxTreinadores) {
      // eslint-disable-next-line no-undef
      alert(`Limite máximo de ${maxTreinadores} treinadores atingido!`);
      return;
    }

    config.treinadores++;

    const treinador = document.createElement("div");
    treinador.id = Math.floor((Math.random() * 1000) / config.treinadores);

    treinador.innerHTML = `
        <div class="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600">
            <div class="flex justify-between items-center bg-gray-900 p-2 rounded-md mb-2">
                <p class="font-bold">Treinador <span class="contador-treinadores"></span></p>
                <button class="config btn remover bg-red-500 px-2 py-1 text-white rounded-md">Remover</button>
            </div>
            <div class="space-y-2">
                <label class="block">Velocidade: <input type="number" name="velocidade" value="1" min="1" max="5" class="config atributo w-full p-1 bg-gray-700 border border-gray-600 rounded-md"></label>
                <label class="block">Resistência: <input type="number" name="resistencia" value="5" min="5" max="15" class="config atributo w-full p-1 bg-gray-700 border border-gray-600 rounded-md"></label>
                <label class="block">Campo de visão: <input type="number" name="visao" value="10" min="10" max="50" class="config atributo w-full p-1 bg-gray-700 border border-gray-600 rounded-md"></label>
                
                <div class="checkbox-group">
                    <p class="font-bold">Estratégia:</p>
                    <label class="block">
                        <input type="radio" name="estrategia-${config.treinadores}" value="agressivo" checked class="config atributo form-radio text-blue-500"> Agressivo
                    </label>
                    <label class="block">
                        <input type="radio" name="estrategia-${config.treinadores}" value="cauteloso" class="config atributo form-radio text-blue-500"> Cauteloso
                    </label>
                </div>

                <div class="checkbox-group">
                    <p class="font-bold">Pokémon:</p>
                    <label class="block">
                        <input type="radio" name="pokemonInicial-${config.treinadores}" value="bulbasaur" checked class="config atributo form-radio text-blue-500"> Bulbasaur
                    </label>
                    <label class="block">
                        <input type="radio" name="pokemonInicial-${config.treinadores}" value="charmander" class="config atributo form-radio text-blue-500"> Charmander
                    </label>
                    <label class="block">
                        <input type="radio" name="pokemonInicial-${config.treinadores}" value="squirtle" class="config atributo form-radio text-blue-500"> Squirtle
                    </label>
                </div>
            </div>
        </div>
      `;

    listaTreinadores.appendChild(treinador);

    treinador.querySelector(".remover").addEventListener("click", () => {
      treinador.remove();
      config.treinadores--;
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function GUI(config) {
  const btnIniciar = document.querySelector(".iniciar");
  const btnParar = document.querySelector(".parar");

  const relogio = document.getElementById("relogio");
  const listaTreinadores = document.querySelector(".treinadores-lista");

  const cronometro = {
    interval: null,
    conteudo: relogio,
    segundos: 0,
  };

  btnIniciar.addEventListener("click", () => {
    if (btnIniciar.textContent === "Pausar") {
      btnIniciar.textContent = "Continuar";
      clearInterval(cronometro.interval);
      return;
    }

    if (listaTreinadores.children.length === 0) {
      // eslint-disable-next-line no-undef
      alert("Adicione pelo menos um treinador antes de iniciar a simulação!");
      return;
    }

    btnIniciar.textContent = "Pausar";

    btnParar.disabled = false;
    btnParar.style.opacity = "1";

    document.querySelectorAll(".config").forEach((elemento) => {
      if (!elemento.checked) {
        elemento.disabled = true;
        elemento.style.opacity = "0.5";
      }
    });

    simulação(cronometro, listaTreinadores, config);
  });

  btnParar.addEventListener("click", () => {
    clearInterval(cronometro.interval);
    cronometro.conteudo.textContent = "00:00";
    cronometro.segundos = 0;

    config.contadorTreinadores = 0;

    btnIniciar.textContent = "Iniciar";

    btnParar.disabled = true;
    btnParar.style.opacity = "0.5";

    document.querySelectorAll(".config").forEach((elemento) => {
      elemento.disabled = false;
      elemento.style.opacity = "1";
    });

    config.treinadores = 0;
    while (listaTreinadores.firstChild) {
      listaTreinadores.removeChild(listaTreinadores.firstChild);
    }

    const footer = document.querySelector("footer");
    while (footer.firstChild) {
      footer.removeChild(footer.firstChild);
    }
  });
}

function DetalhesTreinador(treinadores) {
  const footer = document.querySelector("footer");

  if (footer.firstChild !== null) {
    return;
  }

  treinadores.forEach((treinador) => {
    const container = document.createElement("div");
    container.className =
      "flex justify-between items-center bg-gray-900 p-2 rounded-md border border-gray-600";

    // Lado esquerdo: atributos
    const atributosDiv = document.createElement("div");
    atributosDiv.className = "text-sm";
    atributosDiv.innerHTML = `
      <p><strong>Treinador ${treinador.id}</strong></p>
      <p>Velocidade: ${treinador.velocidade}</p>
      <p>Resistência: ${treinador.resistencia}</p>
      <p>Campo de Visão: ${treinador.visao}</p>
      <p>Estratégia: ${treinador.estrategia}</p>
      <p>Pokemons Capturados: ${treinador.pokemons.length}</p>
  `;

    // Lado direito: pokemons
    const equipeDiv = document.createElement("div");
    equipeDiv.className = "flex space-x-2";

    for (let i = 0; i < 4; i++) {
      const slot = document.createElement("div");
      slot.className =
        "w-10 h-10 bg-gray-700 border border-gray-500 rounded flex items-center justify-center text-xs text-center";
      slot.textContent = treinador.equipe[i] || "—";
      equipeDiv.appendChild(slot);
    }
    container.appendChild(atributosDiv);
    container.appendChild(equipeDiv);
    footer.appendChild(container);
  });
}

function simulação(cronometro, listaTreinadores, config) {
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

  Array.from(listaTreinadores.children).forEach((t) => {
    const treinador = {
      id: t.id,
      pokemons: [],
      equipe: [],
    };

    t.querySelectorAll(".atributo").forEach((elemento) => {
      if (elemento.type === "radio") {
        if (elemento.checked)
          treinador[elemento.name.split("-")[0]] = elemento.value;
      } else {
        treinador[elemento.name] = elemento.value;
      }
    });

    treinador.pokemons.push(treinador.pokemonInicial);
    treinador.equipe.push(treinador.pokemonInicial);

    config.treinadores.push(treinador);
  });

  cronometro.interval = setInterval(() => {
    cronometro.segundos++;
    const minutos = Math.floor(cronometro.segundos / 60);
    const seg = cronometro.segundos % 60;
    cronometro.conteudo.textContent = `${String(minutos).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  }, 1000);

  DetalhesTreinador(config.treinadores);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toggleInput() {
  const div = document.querySelector(".limite");
  const label = div.querySelector("label");
  const input = div.querySelector("input");
  const selectedValue = document.querySelector(
    'input[name="modo"]:checked',
  ).value;

  div.style.display = "block";

  if (selectedValue === "tempo") {
    label.textContent = "Definir tempo (minutos):";
    input.value = 1;
    input.setAttribute("min", 1);
    input.setAttribute("max", 10);
  } else if (selectedValue === "captura") {
    label.textContent = "Definir limite de captura:";
    input.value = 10;
    input.setAttribute("min", 10);
    input.setAttribute("max", 150);
  } else {
    div.style.display = "none";
  }
}
