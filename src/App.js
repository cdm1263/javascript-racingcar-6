import { MissionUtils } from "@woowacourse/mission-utils";
import { GameManager } from "./gameManager";

const read = async (input) => {
  return await MissionUtils.Console.readLineAsync(input);
};
const print = (input) => {
  return MissionUtils.Console.print(input);
};
const random = (max, min) => {
  return MissionUtils.Random.pickNumberInRange(max, min);
};

class App {
  constructor() {
    this.io = {
      read,
      print,
    };
    this.random = random;
    this.gameManager = new GameManager(this.io, this.random);
  }

  async play() {
    try {
      await this.gameManager.play();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default App;
