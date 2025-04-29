import {
  iniciarCronometro,
  pararCronometro,
  pausarCronometro,
} from "./cronometro.js";
import { pokemonSelvagem } from "./detalhesPokemon.js";

export function Iniciar() {
  iniciarCronometro();
  pokemonSelvagem();
  // window.simulacao.iniciar();
}

export function Pausar() {
  pausarCronometro();
  // window.simulacao.pausar();
}

export function Parar() {
  pararCronometro();
  // window.simulacao.parar();
}

export function Multiplicador(valor) {
  window.multiplicador = valor;
  if (!window.cronometro.intervalo) return;

  pausarCronometro();
  iniciarCronometro();
}
