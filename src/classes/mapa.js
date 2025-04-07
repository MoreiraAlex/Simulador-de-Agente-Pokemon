class Mapa {
  constructor(canvas, contexto, celula) {
    this.canvas = canvas;
    this.contexto = contexto;
    this.celula = celula;
    this.matriz = [];

    this.biomas = [
      (this.agua = {
        cor: "blue",
        posX: 0,
        posY: 0,
        largura: 500,
        altura: 500,
      }),
      (this.fogo = {
        cor: "red",
        posX: 500,
        posY: 0,
        largura: 500,
        altura: 500,
      }),
      (this.terra = {
        cor: "brown",
        posX: 1000,
        posY: 0,
        largura: 500,
        altura: 500,
      }),
      (this.vento = {
        cor: "lightgray",
        posX: 1500,
        posY: 0,
        largura: 500,
        altura: 500,
      }),
      (this.gelo = {
        cor: "lightblue",
        posX: 0,
        posY: 500,
        largura: 1000,
        altura: 500,
      }),
      (this.veneno = {
        cor: "green",
        posX: 1000,
        posY: 500,
        largura: 1000,
        altura: 500,
      }),
      (this.metal = {
        cor: "gray",
        posX: 0,
        posY: 1000,
        largura: 1000,
        altura: 500,
      }),
      (this.luz = {
        cor: "yellow",
        posX: 1000,
        posY: 1000,
        largura: 1000,
        altura: 500,
      }),
      (this.sombra = {
        cor: "lightgreen",
        posX: 0,
        posY: 1500,
        largura: 2000,
        altura: 500,
      }),
    ];

    this.obstaculos = [
      {
        cor: "black",
        posX: 200,
        posY: 500,
        largura: 100,
        altura: 100,
      },
      {
        cor: "black",
        posX: 300,
        posY: 200,
        largura: 150,
        altura: 150,
      },
      {
        cor: "black",
        posX: 700,
        posY: 100,
        largura: 150,
        altura: 150,
      },
      {
        cor: "black",
        posX: 900,
        posY: 500,
        largura: 100,
        altura: 100,
      },
      {
        cor: "black",
        posX: 1500,
        posY: 250,
        largura: 200,
        altura: 100,
      },
      {
        cor: "black",
        posX: 1700,
        posY: 900,
        largura: 150,
        altura: 150,
      },
      {
        cor: "black",
        posX: 1200,
        posY: 1200,
        largura: 100,
        altura: 100,
      },
      {
        cor: "black",
        posX: 400,
        posY: 1500,
        largura: 200,
        altura: 200,
      },
      {
        cor: "black",
        posX: 100,
        posY: 1800,
        largura: 100,
        altura: 100,
      },
      {
        cor: "black",
        posX: 1800,
        posY: 1800,
        largura: 100,
        altura: 100,
      },
    ];

    this.base = [
      {
        posX: 0,
        posY: 0,
        largura: 200,
        altura: 200,
      },
      {
        posX: this.canvas.width - 200,
        posY: 0,
        largura: 200,
        altura: 200,
      },
      {
        posX: 0,
        posY: this.canvas.height - 200,
        largura: 200,
        altura: 200,
      },
      {
        posX: this.canvas.width - 200,
        posY: this.canvas.height - 200,
        largura: 200,
        altura: 200,
      },
    ];
  }

  desenha() {
    const { contexto } = this;

    this.biomas.forEach((bioma) => {
      contexto.fillStyle = bioma.cor;
      contexto.fillRect(bioma.posX, bioma.posY, bioma.largura, bioma.altura);
    });

    this.matriz = this.gerarMatriz(this.celula);

    this.matriz.forEach((linha, i) => {
      linha.forEach((celula, j) => {
        if (celula === 1) {
          contexto.fillStyle = "black";
          contexto.fillRect(
            i * this.celula,
            j * this.celula,
            this.celula,
            this.celula,
          );
        }
      });
    });

    this.base.forEach((base) => {
      contexto.fillStyle = "purple";
      contexto.fillRect(base.posX, base.posY, base.largura, base.altura);
    });

    this.grade(this.celula);
  }

  grade(tamanhoCelula) {
    const { contexto, canvas } = this;

    const width = canvas.width;
    const height = canvas.height;

    contexto.strokeStyle = "#ccc"; // cor das linhas

    // desenha as linhas verticais
    for (let x = 0; x <= width; x += tamanhoCelula) {
      contexto.beginPath();
      contexto.moveTo(x, 0);
      contexto.lineTo(x, height);
      contexto.stroke();
    }

    // desenha as linhas horizontais
    for (let y = 0; y <= height; y += tamanhoCelula) {
      contexto.beginPath();
      contexto.moveTo(0, y);
      contexto.lineTo(width, y);
      contexto.stroke();
    }
  }

  gerarMatriz(tamanhoCelula) {
    const cols = Math.floor(this.canvas.width / tamanhoCelula);
    const rows = Math.floor(this.canvas.height / tamanhoCelula);
    const matriz = Array.from({ length: rows }, () => Array(cols).fill(0));

    this.obstaculos.forEach((obs) => {
      const startCol = Math.floor(obs.posX / tamanhoCelula);
      const endCol = Math.ceil((obs.posX + obs.largura) / tamanhoCelula);
      const startRow = Math.floor(obs.posY / tamanhoCelula);
      const endRow = Math.ceil((obs.posY + obs.altura) / tamanhoCelula);

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          if (row >= 0 && row < rows && col >= 0 && col < cols) {
            matriz[col][row] = 1;
          }
        }
      }
    });

    return matriz;
  }
}

export default Mapa;
