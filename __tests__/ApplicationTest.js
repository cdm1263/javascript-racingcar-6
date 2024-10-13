import App from "../src/App.js";
import { MissionUtils } from "@woowacourse/mission-utils";
import { mockQuestions, mockRandoms, getLogSpy } from "../src/testUtils.js";

const validateCarNames = async (type, message) => {
  const input = await MissionUtils.Console.readLineAsync();
  const names = input.split(",");

  if (type === "pass") {
    expect(input).toEqual(message);
  }
  if (type === "error") {
    if (names.some((name) => name.trim() === "")) {
      throw new Error("[ERROR] 이름은 공백일 수 없습니다.");
    }

    if (names.some((name) => name.trim().length > 5)) {
      throw new Error("[ERROR] 5자 이하로 작성해야 합니다.");
    }

    if (new Set(names).size !== names.length) {
      throw new Error("[ERROR] 중복된 이름은 허용되지 않습니다.");
    }

    if (names.length < 2) {
      throw new Error("[ERROR] 2개 이상의 이름을 적어주세요.");
    }
  }
};

const validateRoundNumber = async (type, message) => {
  const input = await MissionUtils.Console.readLineAsync();
  const inputNumber = Number(input);

  if (type === "pass") {
    expect(input).toEqual(message);
  }

  if (type === "error") {
    if (!Number.isInteger(inputNumber)) {
      throw new Error("[ERROR] 숫자만 입력해 주세요.");
    }

    if (inputNumber < 1) {
      throw new Error("[ERROR] 1 이상의 숫자를 입력해 주세요.");
    }

    if (inputNumber > 10) {
      throw new Error("[ERROR] 10 이하의 숫자를 입력해 주세요.");
    }
  }
};

// note: 입출력 테스트
// todo: 자동차 이름 테스트 (5자 이하인지, 2개 이상인지, 중복인지, 공백인지)
// todo: 시도 횟수 테스트 (숫자인지)
// todo: 각 차수별 실행 결과
// todo: 단독 우승자 안내 문구
// todo: 공동 우승자 안내 문구

// note: 실행 테스트
// todo: 전체 테스트

describe("자동차 경주 게임", () => {
  test("전진-정지", async () => {
    // given
    const MOVING_FORWARD = 4;
    const STOP = 3;
    const inputs = ["pobi,woni", "1"];
    const outputs = ["pobi : -"];
    const randoms = [MOVING_FORWARD, STOP];
    const logSpy = getLogSpy();

    mockQuestions(inputs);
    mockRandoms([...randoms]);

    // when
    const app = new App();
    await app.play();

    // then
    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test.each([[["pobi,javaji"]], [["pobi,eastjun"]]])(
    "이름에 대한 예외 처리",
    async (inputs) => {
      // given
      mockQuestions(inputs);

      // when
      const app = new App();

      // then
      await expect(app.play()).rejects.toThrow("[ERROR]");
    }
  );
});

describe("자동차 이름 테스트", () => {
  const ERROR_CASES = [
    [["carcar,car34,car1"], "[ERROR] 5자 이하로 작성해야 합니다."],
    [["carca,carca,car1"], "[ERROR] 중복된 이름은 허용되지 않습니다."],
    [[" "], "[ERROR] 이름은 공백일 수 없습니다."],
    [["carca"], "[ERROR] 2개 이상의 이름을 적어주세요."],
  ];

  const PASS_CASES = [
    [["car1,car2,lurgi,tisi"], "car1,car2,lurgi,tisi"],
    [["1,2,3eq"], "1,2,3eq"],
  ];

  test.each(ERROR_CASES)("이름 에러 체크 테스트", async (inputs, message) => {
    mockQuestions(inputs);
    await expect(validateCarNames("error")).rejects.toThrow(message);
  });

  test.each(PASS_CASES)("이름 통과 체크 테스트", async (inputs, message) => {
    mockQuestions(inputs);
    await validateCarNames("pass", message);
  });
});

describe("시도 횟수 테스트", () => {
  const ERROR_CASES = [
    [["asdf"], "[ERROR] 숫자만 입력해 주세요."],
    [["0"], "[ERROR] 1 이상의 숫자를 입력해 주세요."],
    [["11"], "[ERROR] 10 이하의 숫자를 입력해 주세요."],
  ];

  const PASS_CASES = [
    [["1"], "1"],
    [["3"], "3"],
  ];

  test.each(ERROR_CASES)("시도 횟수 오류 테스트", async (input, message) => {
    mockQuestions(input);
    await expect(validateRoundNumber("error")).rejects.toThrow(message);
  });

  test.each(PASS_CASES)("시도 횟수 패스 테스트", async (input, message) => {
    mockQuestions(input);
    await validateRoundNumber("pass", message);
  });
});

describe("각 차수별 실행 결과 테스트", () => {
  test("각 차수별 실행 결과", async () => {
    mockQuestions(["pobi,woni", "3"]);
    mockRandoms([4, 3, 4, 4, 4, 3]);

    const logSpy = getLogSpy();

    const app = new App();
    await app.play();

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("pobi : -"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("woni : "));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("pobi : --"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("woni : -"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("pobi : ---"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("woni : -"));
  });
});

describe("우승자 안내 문구", () => {
  test("단독 우승자", async () => {
    mockQuestions(["pobi,woni", "3"]);
    mockRandoms([4, 3, 4, 3, 4, 3]);
    const logSpy = getLogSpy();

    const app = new App();
    await app.play();

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("최종 우승자 : pobi")
    );
  });

  test("공동 우승자", async () => {
    mockQuestions(["pobi,woni,jun", "3"]);
    mockRandoms([4, 4, 3, 4, 4, 3, 4, 4, 3]);
    const logSpy = getLogSpy();

    const app = new App();
    await app.play();

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("최종 우승자 : pobi, woni")
    );
  });
});
