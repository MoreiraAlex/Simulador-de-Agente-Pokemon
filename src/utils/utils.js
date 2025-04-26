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

    const linha = Math.min(Math.floor(y / celula), matriz.height - 1);
    const coluna = Math.min(Math.floor(x / celula), matriz.width - 1);

    if (linha && coluna) {
      const nodo = matriz.nodes[linha][coluna];

      if (nodo?.walkable) {
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
    matriz.nodes?.[Math.floor(posicao.y / celula)]?.[
      Math.floor(posicao.x / celula)
    ];

  if (alvo) {
    alvo.agente = valor;
  }
}

export function Vizinhos(mapa, alvo, celula, algoritimo) {
  const nodo =
    mapa.matriz.nodes?.[Math.floor(alvo.posicao.y / celula)]?.[
      Math.floor(alvo.posicao.x / celula)
    ];

  if (nodo) {
    const vizinhos = mapa.matriz.getNeighbors(
      nodo,
      algoritimo.diagonalMovement,
    );

    const alvoDestino = alvo.caminho[0] || [vizinhos[0].x, vizinhos[0].y];

    return vizinhos?.filter(
      (vizinho) => vizinho.x === alvoDestino[0] && vizinho.y === alvoDestino[1],
    )[0];
  }
}
