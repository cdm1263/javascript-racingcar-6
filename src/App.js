import { MissionUtils } from "@woowacourse/mission-utils";

const read = async (input) => {
  return await MissionUtils.Console.readLineAsync(input);
};
const print = (input) => {
  return MissionUtils.Console.print(input);
};
const random = (max, min, count) => {
  const randomNumbers = [];

  for (let i = 0; i < count; i++) {
    const number = MissionUtils.Random.pickNumberInRange(max, min);
    randomNumbers.push(number);
  }

  return randomNumbers;
};

class App {
  constructor() {
    this.rounds = 0;
    this.cars = [];
  }

  MIN = 0;
  MAX = 9;

  async play() {
    await this.getCarNames();
    await this.getRounds();

    do {
      this.round();
      this.rounds--;
    } while (this.rounds >= 1);

    this.getResult();
  }

  validateCarName(input) {
    const names = input.split(",");

    if (names.some((v) => v.trim() === "")) {
      throw new Error("[ERROR] 이름은 공백일 수 없습니다.");
    }

    if (names.some((v) => v.trim().length > 5)) {
      throw new Error("[ERROR] 5자 이하로 작성해야 합니다.");
    }

    if (new Set(names).size !== names.length) {
      throw new Error("[ERROR] 중복된 이름은 허용되지 않습니다.");
    }

    if (names.length < 2) {
      throw new Error("[ERROR] 2개 이상의 이름을 적어주세요.");
    }

    return names;
  }

  validateRounds(input) {
    const inputNumber = Number(input);

    if (!Number.isInteger(inputNumber)) {
      throw new Error("[ERROR] 숫자만 입력해 주세요.");
    }

    if (inputNumber < 1) {
      throw new Error("[ERROR] 1 이상의 숫자를 입력해 주세요.");
    }

    if (inputNumber > 10) {
      throw new Error("[ERROR] 10 이하의 숫자를 입력해 주세요.");
    }

    this.rounds = inputNumber;

    return inputNumber;
  }

  async getCarNames() {
    const input = await read(
      "경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)"
    );

    const validatedNames = this.validateCarName(input);

    validatedNames.forEach((name) => {
      this.cars.push({ name, distances: 0 });
    });

    print(validatedNames.join(","));
  }

  async getRounds() {
    const input = await read("시도할 횟수는 몇 회인가요?");

    const validatedRounds = this.validateRounds(input);
    print(validatedRounds);
  }

  round() {
    const randomNumbers = random(this.MIN, this.MAX, this.cars.length);

    for (let i = 0; i < randomNumbers.length; i++) {
      if (randomNumbers[i] >= 4) {
        this.cars[i].distances++;
      }

      print(`${this.cars[i].name} : ${"-".repeat(this.cars[i].distances)}`);
    }
  }

  getResult() {
    const biggest = Math.max(...this.cars.map((car) => car.distances));
    const winners = this.cars
      .filter((car) => car.distances === biggest)
      .map((car) => car.name);

    print(`최종 우승자 : ${winners.join(", ")}`);
  }
}

export default App;
