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

export function posicaoAleatoriaBiomaa(
  bioma,
  matriz,
  celula,
  maxTentativas = 5000,
) {
  const xMin = Math.floor(bioma.x / celula);
  const xMax = Math.floor((bioma.x + bioma.largura) / celula);

  const yMin = Math.floor(bioma.y / celula);
  const yMax = Math.floor((bioma.y + bioma.altura) / celula);

  const colunasBioma = xMax - xMin;
  const linhasBioma = yMax - yMin;

  let tentativas = 0;

  while (tentativas < maxTentativas) {
    const colunaLocal = Math.floor(Math.random() * colunasBioma);
    const linhaLocal = Math.floor(Math.random() * linhasBioma);

    const x = xMin + colunaLocal;
    const y = yMin + linhaLocal;

    console.log(x, y);

    const linha = Math.min(y, matriz.height - 1);
    const coluna = Math.min(x, matriz.width - 1);

    if (linha >= 0 && coluna >= 0) {
      const nodo = matriz.nodes[linha][coluna];
      if (nodo?.walkable) {
        return { x, y };
      }
    }

    tentativas++;
  }

  console.error("Não foi possível encontrar uma posição válida no bioma.");
  return null;
}

export function posicaoAleatoriaBioma(
  bioma,
  matriz,
  celula,
  maxTentativas = 5000,
) {
  const xMin = bioma.x;
  const xMax = bioma.x + bioma.largura;
  const yMin = bioma.y;
  const yMax = bioma.y + bioma.altura;

  const colunasBioma = Math.floor((xMax - xMin) / celula);
  const linhasBioma = Math.floor((yMax - yMin) / celula);

  let tentativas = 0;

  while (tentativas < maxTentativas) {
    const colunaLocal = Math.floor(Math.random() * colunasBioma);
    const linhaLocal = Math.floor(Math.random() * linhasBioma);

    const x = xMin + colunaLocal * celula;
    const y = yMin + linhaLocal * celula;

    // const linha = Math.min(Math.floor(y / celula), matriz.height - 1);
    // const coluna = Math.min(Math.floor(x / celula), matriz.width - 1);

    const linha = Math.floor(y / celula);
    const coluna = Math.floor(x / celula);

    if (linha >= 0 && coluna >= 0) {
      const nodo = matriz.nodes[linha][coluna];
      if (nodo?.walkable) {
        return { x, y };
      }
    }

    tentativas++;
  }

  console.error("Não foi possível encontrar uma posição válida no bioma.");
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
    mapa.getMatriz().nodes?.[Math.floor(alvo.getPosicao().y / celula)]?.[
      Math.floor(alvo.getPosicao().x / celula)
    ];

  if (nodo) {
    const vizinhos = mapa
      .getMatriz()
      .getNeighbors(nodo, algoritimo.diagonalMovement);

    // const alvoDestino = alvo.getCaminho()[0] || [vizinhos[0].x, vizinhos[0].y];

    // return vizinhos?.filter(
    //   (vizinho) => vizinho.x === alvoDestino[0] && vizinho.y === alvoDestino[1],
    // )[0];
    return vizinhos?.filter((v) => !v.agente || v.agente < 1);
  }
}

export function calculaDistancia(posicao, destino) {
  const dx = destino.x - posicao.x;
  const dy = destino.y - posicao.y;

  return Math.hypot(dx, dy);
}
