class Agente {
  constructor(id, tamanho) {
    this.id = id;
    this.posicao = {
      x: 0,
      y: 0,
    };
    this.tamanho = tamanho;
  }

  desenha(contexto, posX, posY) {
    contexto.fillStyle = "white";
    contexto.fillRect(posX, posY, this.tamanho, this.tamanho);
  }
}

export default Agente;
