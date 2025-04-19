import Agente from "./agente.js";

class Pokemon extends Agente {
  constructor(
    id,
    cor,
    tamanho,
    especie,
    tipos,
    vida,
    ataque,
    defesa,
    ataques,
    evolucao,
    incremento,
    experiencia,
    nivel,
  ) {
    super(id, cor, tamanho, especie);
    this.tipos = tipos;
    this.vida = vida;
    this.ataque = ataque;
    this.defesa = defesa;
    this.ataques = ataques;
    this.evolucao = evolucao;
    this.incremento = incremento;
    this.experiencia = experiencia;
    this.nivel = nivel;
  }
}

export default Pokemon;
