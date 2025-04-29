import { verificarFimJogo } from "./vitoria.js";

export function iniciarCronometro() {
  window.cronometro.intervalo = setInterval(() => {
    verificarFimJogo();
    window.cronometro.segundos++;

    const minutos = Math.floor(window.cronometro.segundos / 60);
    const seg = window.cronometro.segundos % 60;

    window.cronometro.texto.textContent = `${String(minutos).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  }, 1000 / window.multiplicador);
}

export function pausarCronometro() {
  clearInterval(window.cronometro.intervalo);
  window.cronometro.intervalo = null;
}

export function pararCronometro() {
  pausarCronometro();
  window.cronometro.texto.textContent = "00:00";
  window.cronometro.segundos = 0;
}
