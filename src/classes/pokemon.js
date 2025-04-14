import Agente from "./agente.js";

class Pokemon extends Agente {
  constructor(
    id,
    cor,
    especie,
    vida,
    tipos,
    ataque,
    defesa,
    experiencia,
    level,
    tamanho,
  ) {
    super(id, cor, tamanho, especie);
    this.vida = vida;
    this.tipos = tipos;
    this.ataque = ataque;
    this.defesa = defesa;
    this.experiencia = experiencia;
    this.level = level;
  }
}

export default Pokemon;
