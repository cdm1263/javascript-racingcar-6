import { GAME_NUMBERS, MESSAGES } from "./constants";
import { Car } from "./Car";

export class GameManager {
  constructor(io, random) {
    this.io = io;
    this.random = random;
    this.cars = [];
    this.rounds = 0;
  }

  async play() {
    await this.initializeGame();
    this.runRounds();
    this.getWinner();
  }

  async initializeGame() {
    const names = await this.getValidCarNames();
    this.cars = names.map((name) => new Car(name));
    this.rounds = await this.getValidRounds();
  }

  async getValidCarNames() {
    const input = await this.io.read(MESSAGES.INPUT_CAR_NAMES);
    const names = input.split(",").map((name) => name.trim());
    this.validateCarName(names);
    this.io.print(names.join(","));
    return names;
  }

  validateCarName(names) {
    if (names.some((name) => name === "")) {
      throw new Error("[ERROR] 이름은 공백일 수 없습니다.");
    }

    if (names.some((name) => name.length > GAME_NUMBERS.MAX_NAME_LENGTH)) {
      throw new Error(
        `[ERROR] ${GAME_NUMBERS.MAX_NAME_LENGTH}자 이하로 작성해야 합니다.`
      );
    }

    if (new Set(names).size !== names.length) {
      throw new Error("[ERROR] 중복된 이름은 허용되지 않습니다.");
    }

    if (names.length < GAME_NUMBERS.MIN_CARS) {
      throw new Error(
        `[ERROR] ${GAME_NUMBERS.MIN_CARS}개 이상의 이름을 적어주세요.`
      );
    }
  }

  async getValidRounds() {
    const input = await this.io.read(MESSAGES.INPUT_ROUNDS);
    const rounds = Number(input);
    this.validateRounds(rounds);
    this.io.print(rounds);
    return rounds;
  }

  validateRounds(rounds) {
    if (!Number.isInteger(rounds)) {
      throw new Error("[ERROR] 숫자만 입력해 주세요.");
    }

    if (rounds < GAME_NUMBERS.MIN_ROUNDS) {
      throw new Error(
        `[ERROR] ${GAME_NUMBERS.MIN_ROUNDS} 이상의 숫자를 입력해 주세요.`
      );
    }

    if (rounds > GAME_NUMBERS.MAX_ROUNDS) {
      throw new Error(
        `[ERROR] ${GAME_NUMBERS.MAX_ROUNDS} 이하의 숫자를 입력해 주세요.`
      );
    }
  }

  runRounds() {
    for (let i = 0; i < this.rounds; i++) {
      this.runSingleRound();
      this.cars.forEach((car) => {
        this.io.print(car.getStatus());
      });
    }
  }

  runSingleRound() {
    this.cars.forEach((car) => {
      const shouldMove =
        this.random(GAME_NUMBERS.MIN_RANDOM, GAME_NUMBERS.MAX_RANDOM) >=
        GAME_NUMBERS.MOVE_THRESHOLD;

      car.move(shouldMove);
    });
  }

  getWinner() {
    const maxDistance = Math.max(...this.cars.map((car) => car.distance));
    const winners = this.cars
      .filter((car) => car.distance === maxDistance)
      .map((car) => car.name);

    this.io.print(MESSAGES.WINNER + winners.join(", "));
  }
}
