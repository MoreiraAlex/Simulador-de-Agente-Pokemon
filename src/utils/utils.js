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

export function posicaoAleatoriaBioma(bioma) {
  const xMin = bioma.posX;
  const xMax = bioma.posX + bioma.largura;
  const yMin = bioma.posY;
  const yMax = bioma.posY + bioma.altura;

  const x = Math.floor(Math.random() * ((xMax - xMin) / 50)) * 50 + xMin;
  const y = Math.floor(Math.random() * ((yMax - yMin) / 50)) * 50 + yMin;

  return { x, y };
}
