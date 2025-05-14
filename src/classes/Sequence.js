class Sequence {
  constructor(start = 2) {
    this.current = start;
  }

  next() {
    return this.current++;
  }

  atual() {
    return this.current;
  }

  reset(value = 1) {
    this.current = value;
  }
}

export default Sequence;
