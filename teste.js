const PokeA = {
  Vida: 100,
  Ataque: 10,
  Defesa: 5,
  Velocidade: 1,
  incremento: [2, 4, 6],
  Buff: [20, 40],
};

const PokeB = {
  Vida: 100,
  Ataque: 15,
  Defesa: 10,
  Velocidade: 1,
  incremento: [3, 5],
  Buff: [30],
};

const PokeC = {
  Vida: 100,
  Ataque: 20,
  Defesa: 15,
  Velocidade: 1,
  incremento: [4],
};

function run() {
  for (let i = 1; i <= 30; i++) {
    if (i !== 1) {
      PokeC.Vida += PokeC.incremento[0];
      PokeC.Ataque += PokeC.incremento[0];
      PokeC.Defesa += PokeC.incremento[0];
      PokeC.Velocidade = Number(
        (PokeC.Velocidade + PokeC.incremento[0] / 250).toFixed(2),
      );

      if (i <= 10) {
        const buff = i === 10 ? PokeA.Buff[0] : 0;
        PokeA.Vida += PokeA.incremento[0] + buff;
        PokeA.Ataque += PokeA.incremento[0] + buff;
        PokeA.Defesa += PokeA.incremento[0] + buff;
        PokeA.Velocidade = Number(
          (PokeA.Velocidade + (PokeA.incremento[0] + buff) / 250).toFixed(2),
        );

        PokeB.Vida += PokeB.incremento[0];
        PokeB.Ataque += PokeB.incremento[0];
        PokeB.Defesa += PokeB.incremento[0];
        PokeB.Velocidade = Number(
          (PokeB.Velocidade + PokeB.incremento[0] / 250).toFixed(2),
        );
      } else if (i <= 15) {
        PokeA.Vida += PokeA.incremento[1];
        PokeA.Ataque += PokeA.incremento[1];
        PokeA.Defesa += PokeA.incremento[1];
        PokeA.Velocidade = Number(
          (PokeA.Velocidade + PokeA.incremento[1] / 250).toFixed(2),
        );

        const buff = i === 15 ? PokeB.Buff[0] : 0;
        PokeB.Vida += PokeB.incremento[0] + buff;
        PokeB.Ataque += PokeB.incremento[0] + buff;
        PokeB.Defesa += PokeB.incremento[0] + buff;
        PokeB.Velocidade = Number(
          (PokeB.Velocidade + (PokeB.incremento[0] + buff) / 250).toFixed(2),
        );
      } else if (i <= 25) {
        const buff = i === 25 ? PokeA.Buff[1] : 0;
        PokeA.Vida += PokeA.incremento[1] + buff;
        PokeA.Ataque += PokeA.incremento[1] + buff;
        PokeA.Defesa += PokeA.incremento[1] + buff;
        PokeA.Velocidade = Number(
          (PokeA.Velocidade + (PokeA.incremento[1] + buff) / 250).toFixed(2),
        );

        PokeB.Vida += PokeB.incremento[1];
        PokeB.Ataque += PokeB.incremento[1];
        PokeB.Defesa += PokeB.incremento[1];
        PokeB.Velocidade = Number(
          (PokeB.Velocidade + PokeB.incremento[1] / 250).toFixed(2),
        );
      } else if (i <= 30) {
        PokeA.Vida += PokeA.incremento[2];
        PokeA.Ataque += PokeA.incremento[2];
        PokeA.Defesa += PokeA.incremento[2];
        PokeA.Velocidade = Number(
          (PokeA.Velocidade + PokeA.incremento[2] / 250).toFixed(2),
        );

        PokeB.Vida += PokeB.incremento[1];
        PokeB.Ataque += PokeB.incremento[1];
        PokeB.Defesa += PokeB.incremento[1];
        PokeB.Velocidade = Number(
          (PokeB.Velocidade + PokeB.incremento[1] / 250).toFixed(2),
        );
      }
    }

    if ([1, 9, 10, 14, 15, 24, 25, 30].includes(i)) {
      console.log("");
      console.log(`Nivel ${i}: `);
      console.log("PokeA:", {
        Vida: PokeA.Vida,
        Ataque: PokeA.Ataque,
        Defesa: PokeA.Defesa,
        Velocidade: PokeA.Velocidade,
      });

      console.log("PokeB:", {
        Vida: PokeB.Vida,
        Ataque: PokeB.Ataque,
        Defesa: PokeB.Defesa,
        Velocidade: PokeB.Velocidade,
      });

      console.log("PokeC:", {
        Vida: PokeC.Vida,
        Ataque: PokeC.Ataque,
        Defesa: PokeC.Defesa,
        Velocidade: PokeC.Velocidade,
      });
    }
  }
}

run();
