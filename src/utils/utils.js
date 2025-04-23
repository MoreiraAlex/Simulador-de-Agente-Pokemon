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

export function posicaoAleatoriaBioma(
  bioma,
  matriz,
  celula,
  maxTentativas = 100,
) {
  const xMin = bioma.posX;
  const xMax = bioma.posX + bioma.largura;
  const yMin = bioma.posY;
  const yMax = bioma.posY + bioma.altura;

  let tentativas = 0;

  while (tentativas < maxTentativas) {
    const x =
      Math.floor(Math.random() * ((xMax - xMin) / celula)) * celula + xMin;
    const y =
      Math.floor(Math.random() * ((yMax - yMin) / celula)) * celula + yMin;

    if (x && y) {
      const nodo = matriz.nodes[Math.floor(y / celula)][Math.floor(x / celula)];

      if (nodo.walkable) {
        return { x, y };
      }
    }

    tentativas++;
  }

  console.warn("Não foi possível encontrar uma posição válida no bioma.");
  return null;
}

export function atualizaPosicaoNaMatriz(matriz, posicao, celula, valor) {
  const alvo =
    matriz.nodes[Math.floor(posicao.y / celula)]?.[
      Math.floor(posicao.x / celula)
    ];
  if (alvo) {
    alvo.agente = valor;
  }
}
