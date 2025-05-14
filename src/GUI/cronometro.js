import { atualizaPokemonsTreinadores } from "./treinador.js";
import { verificarFimJogo } from "./vitoria.js";

export function iniciarCronometro() {
  window.cronometro.intervalo = setInterval(() => {
    atualizaPokemonsTreinadores();
    verificarFimJogo();

    window.cronometro.segundos++;
    const horas = Math.floor(window.cronometro.segundos / 60 / 60);
    const minutos = Math.floor((window.cronometro.segundos / 60) % 60);
    const seg = window.cronometro.segundos % 60;

    window.cronometro.texto.textContent = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  }, 1000 / window.cronometro.multiplicador);
}

export function pausarCronometro() {
  clearInterval(window.cronometro.intervalo);
  window.cronometro.intervalo = null;
}

export function pararCronometro() {
  pausarCronometro();
  window.cronometro.texto.textContent = "00:00:00";
  window.cronometro.segundos = 0;
}
