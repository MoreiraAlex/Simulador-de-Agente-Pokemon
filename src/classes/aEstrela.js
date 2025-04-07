class AEstrela {
  constructor(mapa) {
    this.mapa = mapa;
  }

  static distancia(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  key(pos) {
    return `${pos.x},${pos.y}`;
  }

  vizinhos(pos, fechados) {
    const direcoes = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ];

    return direcoes
      .map((d) => ({ x: pos.x + d.x, y: pos.y + d.y }))
      .filter(
        (v) =>
          v.x >= 0 &&
          v.x < this.mapa.length &&
          v.y >= 0 &&
          v.y < this.mapa[0].length &&
          this.mapa[v.x][v.y] !== 1 &&
          !fechados.has(this.key(v)),
      );
  }

  encontrarCaminho(inicio, fim) {
    const aberta = [inicio];
    const fechada = new Set();
    const custos = {};
    const keyInicio = this.key(inicio);
    const keyFim = this.key(fim);

    custos[keyInicio] = { g: 0, h: AEstrela.distancia(inicio, fim), pai: null };

    while (aberta.length > 0) {
      aberta.sort(
        (a, b) =>
          custos[this.key(a)].g +
          custos[this.key(a)].h -
          (custos[this.key(b)].g + custos[this.key(b)].h),
      );

      const atual = aberta.shift();
      const keyAtual = this.key(atual);

      if (keyAtual === keyFim) {
        return this.reconstruirCaminho(custos, fim, inicio);
      }

      fechada.add(keyAtual);

      for (const vizinho of this.vizinhos(atual, fechada)) {
        const keyVizinho = this.key(vizinho);
        const g = custos[keyAtual].g + 1;

        if (!custos[keyVizinho] || g < custos[keyVizinho].g) {
          custos[keyVizinho] = {
            g,
            h: AEstrela.distancia(vizinho, fim),
            pai: atual,
          };

          if (!aberta.some((p) => this.key(p) === keyVizinho)) {
            aberta.push(vizinho);
          }
        }
      }
    }

    return []; // Caminho não encontrado
  }

  reconstruirCaminho(custos, fim, inicio) {
    const caminho = [];
    let atual = fim;

    while (atual && this.key(atual) !== this.key(inicio)) {
      caminho.push(atual);
      atual = custos[this.key(atual)].pai;
    }

    if (atual) caminho.push(inicio);

    return caminho.reverse();
  }
}

export default AEstrela;
