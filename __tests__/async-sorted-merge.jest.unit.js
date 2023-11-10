// @ts-check

const solution = require("../solution/async-sorted-merge");

describe("sync solution", () => {
  const now = new Date();
  const fakePrinter = {
    print: jest.fn(),
    done: jest.fn(),
  };
  const fakeLogSource1 = createFakeLogSource();
  const fakeLogSource2 = createFakeLogSource();

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should immediately call `done` given an empty array of log sources", async () => {
    await solution([], fakePrinter);

    expect(fakePrinter.print).not.toHaveBeenCalled();
    expect(fakePrinter.done).toHaveBeenCalledTimes(1);
  });

  it("should call `print` one time", async () => {
    const message = "testing 123";
    const fakeLog = {
      date: now,
      msg: message,
    };
    let resultLog = null;

    fakeLogSource1.popAsync
      .mockImplementationOnce(async () => fakeLog)
      .mockImplementationOnce(async () => false);

    fakePrinter.print.mockImplementation((log) => {
      resultLog = log;
    });

    await solution([fakeLogSource1], fakePrinter);

    expect(fakePrinter.print).toHaveBeenCalledTimes(1);
    expect(resultLog).toMatchObject(fakeLog);
  });

  it("should print logs in chronological order", async () => {
    const result = [];

    fakeLogSource1.popAsync.mockImplementation(createFakePopFn(0, 10, 2));
    fakeLogSource2.popAsync.mockImplementation(createFakePopFn(1, 10, 2));

    fakePrinter.print.mockImplementation((log) => {
      result.push(log.date.getTime());
    });

    await solution([fakeLogSource1, fakeLogSource2], fakePrinter);

    expect(result).toMatchObject(Array.from({ length: 11 }).map((_, i) => i));
  });

  it("should handle slow log sources", async () => {
    const fakeLog1 = { date: new Date(now.getTime() - 1000), msg: "" };
    const fakeLog2 = { date: new Date(now.getTime() - 1), msg: "" };
    const result = [];

    fakeLogSource1.popAsync
      .mockImplementationOnce(() => sleep(1000, fakeLog1))
      .mockImplementationOnce(async () => false);

    fakeLogSource2.popAsync
      .mockImplementationOnce(() => sleep(1, fakeLog2))
      .mockImplementationOnce(async () => false);

    fakePrinter.print.mockImplementation((log) => {
      result.push(log);
    });

    await solution([fakeLogSource1, fakeLogSource2], fakePrinter);

    expect(result).toMatchObject([fakeLog1, fakeLog2]);
  });
});

function createFakeLogSource() {
  return {
    popAsync: jest.fn(),
  };
}

/**
 * @param {number} start
 * @param {number} max
 * @param {number} increment
 * @returns {() => Promise<{date: Date, msg: string} | false>}
 */
function createFakePopFn(start, max, increment) {
  let current = start - increment;

  return async () => {
    current += increment;

    if (current > max) {
      return false;
    }

    return {
      date: new Date(current),
      msg: "",
    };
  };
}

/**
 * @template {{}} T
 *
 * @param {number} time
 * @param {T} value
 * @returns {Promise<T>}
 */
function sleep(time, value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });
}
