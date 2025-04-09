const todosOsPokemon = [];

class Pokemon {
  constructor(nome, nivel, hp, defesa, atkSpeed, tipos) {
    this._nome = nome;
    this._nivel = nivel;
    this._hp = hp;
    this._defesa = defesa;
    this._atkSpeed = atkSpeed;
    this._tipos = tipos;
    this._derrotado = false; // padrão inicial
    todosOsPokemon.push(this);
  }

  // Getters
  getnome() {
    return this._nome;
  }

  getnivel() {
    return this._nivel;
  }

  gethp() {
    return this._hp;
  }

  get defesa() {
    return this._defesa;
  }

  getatkSpeed() {
    return this._atkSpeed;
  }

  gettipos() {
    return this._tipos;
  }

  get derrotado() {
    return this._derrotado;
  }

  // Setters
  set nome(valor) {
    this._nome = valor;
  }

  set nivel(valor) {
    this._nivel = valor;
  }

  set hp(valor) {
    this._hp = valor;
  }

  set defesa(valor) {
    this._defesa = valor;
  }

  set atkSpeed(valor) {
    this._atkSpeed = valor;
  }

  set tipos(valor) {
    this._tipos = Array.isArray(valor) ? valor : [valor];
  }

  set derrotado(valor) {
    this._derrotado = valor;
  }
}

const Squirtle = new Pokemon("Squirtle", 5, 39, 43, 1500, ["agua"]);
const Charmander = new Pokemon("Charmander", 5, 39, 43, 1500, ["fogo"]);
const Gyarados = new Pokemon("gYARADOS", 5, 39, 43, 1500, ["agua", "voador"]);
console.log(todosOsPokemon);
