import { Parar } from "./gerenciadorSimulacao.js";

export function verificarFimJogo() {
  const modo = window.modo;

  const treinadores = window.agentes
    .filter((a) => a.getEspecie() === "Treinador")
    .sort((a, b) => b.getPokemons().length - a.getPokemons().length);

  switch (modo.modo) {
    case "total":
      modoCaptura(treinadores, modo.valor);
      break;

    case "captura":
      modoCaptura(treinadores, modo.valor);
      break;

    case "tempo":
      modoTempo(treinadores, modo.valor);
      break;
  }
}

function modoCaptura(treinadores, valor) {
  const condicao = treinadores.some((treinador) => {
    const pokemons = treinador.getPokemons();
    return pokemons.length === valor;
  });

  if (!condicao) return;

  Finalizar(treinadores);
}

function modoTempo(treinadores, valor) {
  const segundos = window.cronometro.segundos;
  if (segundos < valor * 60) return;

  Finalizar(treinadores);
}

function Finalizar(treinadores) {
  let saida = "\n";
  treinadores.forEach((treinador, indice) => {
    saida += `${indice + 1}º Lugar: Treinador#${treinador.getId()} com ${treinador.getPokemons().length} Pokemon(s)\n`;
  });

  mostrarModal(saida);
  Parar();
}

function mostrarModal(mensagem) {
  const som = document.querySelector("#som-vitoria");
  const modal = document.querySelector("#modal-vencedores");
  const resultado = document.querySelector("#resultado-texto");
  const tempo = document.querySelector("#tempo-texto");

  som.play();

  resultado.textContent = mensagem;
  tempo.textContent = window.cronometro.texto.textContent;
  modal.classList.add("flex");
  modal.classList.remove("hidden");

  document.querySelector("#btn-reiniciar").onclick = () => {
    window.location.reload();
  };
}
