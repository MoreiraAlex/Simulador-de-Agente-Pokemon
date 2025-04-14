class Mapa {
  constructor(canvas, contexto, celula) {
    this.canvas = canvas;
    this.contexto = contexto;
    this.celula = celula;
    this.matriz = [];

    this.biomas = [
      {
        tipo: "normal",
        cor: "gray",
        posX: 0,
        posY: 0,
        largura: 600,
        altura: 600,
      },
      {
        tipo: "agua",
        cor: "blue",
        posX: 0,
        posY: 600,
        largura: 600,
        altura: 800,
      },
      {
        tipo: "normal",
        cor: "gray",
        posX: 0,
        posY: 1400,
        largura: 600,
        altura: 600,
      },
      {
        tipo: "fogo",
        cor: "orange",
        posX: 600,
        posY: 0,
        largura: 800,
        altura: 600,
      },
      {
        tipo: "especial",
        cor: "purple",
        posX: 600,
        posY: 600,
        largura: 800,
        altura: 800,
      },
      {
        tipo: "terra",
        cor: "brown",
        posX: 600,
        posY: 1400,
        largura: 800,
        altura: 600,
      },
      {
        tipo: "normal",
        cor: "gray",
        posX: 1400,
        posY: 0,
        largura: 600,
        altura: 600,
      },
      {
        tipo: "planta",
        cor: "green",
        posX: 1400,
        posY: 600,
        largura: 600,
        altura: 800,
      },
      {
        tipo: "normal",
        cor: "gray",
        posX: 1400,
        posY: 1400,
        largura: 600,
        altura: 600,
      },
    ];

    this.obstaculos = [
      {
        posX: 200,
        posY: 500,
        largura: 100,
        altura: 100,
      },
      {
        posX: 300,
        posY: 200,
        largura: 150,
        altura: 150,
      },
      {
        posX: 700,
        posY: 100,
        largura: 150,
        altura: 150,
      },
      {
        posX: 900,
        posY: 500,
        largura: 100,
        altura: 100,
      },
      {
        posX: 1500,
        posY: 250,
        largura: 200,
        altura: 100,
      },
      {
        posX: 1700,
        posY: 900,
        largura: 150,
        altura: 150,
      },
      {
        posX: 1200,
        posY: 1200,
        largura: 100,
        altura: 100,
      },
      {
        posX: 400,
        posY: 1500,
        largura: 200,
        altura: 200,
      },
      {
        posX: 100,
        posY: 1800,
        largura: 100,
        altura: 100,
      },
      {
        posX: 1800,
        posY: 1800,
        largura: 100,
        altura: 100,
      },
    ];

    this.base = [
      {
        posX: 100,
        posY: 100,
        largura: 200,
        altura: 200,
      },
      {
        posX: this.canvas.width - 300,
        posY: 100,
        largura: 200,
        altura: 200,
      },
      {
        posX: 100,
        posY: this.canvas.height - 300,
        largura: 200,
        altura: 200,
      },
      {
        posX: this.canvas.width - 300,
        posY: this.canvas.height - 300,
        largura: 200,
        altura: 200,
      },
    ];

    // this.biomas = [
    //   {
    //     tipo: "normal",
    //     cor: "gray",
    //     posX: 0,
    //     posY: 0,
    //     largura: 300,
    //     altura: 300,
    //   },
    //   {
    //     tipo: "fogo",
    //     cor: "red",
    //     posX: 300,
    //     posY: 0,
    //     largura: 300,
    //     altura: 300,
    //   },
    //   {
    //     tipo: "agua",
    //     cor: "blue",
    //     posX: 0,
    //     posY: 300,
    //     largura: 300,
    //     altura: 300,
    //   },
    //   {
    //     tipo: "planta",
    //     cor: "green",
    //     posX: 300,
    //     posY: 300,
    //     largura: 300,
    //     altura: 300,
    //   },
    // ]
  }

  desenha() {
    const { contexto } = this;

    if (!this.matriz.length) {
      this.matriz = this.gerarMatriz(this.celula);
    }

    this.biomas.forEach((bioma) => {
      contexto.fillStyle = bioma.cor;
      contexto.fillRect(bioma.posX, bioma.posY, bioma.largura, bioma.altura);
    });

    this.matriz.forEach((linha, i) => {
      linha.forEach((celula, j) => {
        if (celula === 1) {
          contexto.fillStyle = "black";
          contexto.fillRect(
            j * this.celula,
            i * this.celula,
            this.celula,
            this.celula,
          );
        }
      });
    });

    this.base.forEach((base) => {
      contexto.fillStyle = "yellow";
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
            matriz[row][col] = 1;
          }
        }
      }
    });

    return matriz;
  }
}

export default Mapa;
