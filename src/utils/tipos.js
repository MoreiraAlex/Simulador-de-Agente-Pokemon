import { tipos } from "../models/tipos.js";

export function tiposEficazesContra(tipoDefensor) {
  const tiposEficazes = Object.keys(tipos);
  const eficazes = [];

  for (const tipoAtacante of tiposEficazes) {
    const efeito = tipos[tipoAtacante][tipoDefensor];
    if (efeito > 1) {
      eficazes.push(tipoAtacante);
    }
  }

  return eficazes;
}
