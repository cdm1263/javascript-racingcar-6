export class Car {
  constructor(name) {
    this.name = name;
    this.distance = 0;
  }

  move(shouldMove) {
    if (shouldMove) this.distance++;
  }

  getStatus() {
    return `${this.name} : ${"-".repeat(this.distance)}`;
  }
}
