// @ts-check

const solution = require("../solution/async-sorted-merge");

describe("sync solution", () => {
  const now = new Date();
  const fakePrinter = {
    print: jest.fn(),
    done: jest.fn(),
  };

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
    const fakeLogSource = createFakeLogSource();
    const fakeLog = {
      date: now,
      msg: message,
    };
    let resultLog = null;

    fakeLogSource.popAsync
      .mockImplementationOnce(async () => fakeLog)
      .mockImplementationOnce(async () => false);

    fakePrinter.print.mockImplementation((log) => {
      resultLog = log;
    });

    await solution([fakeLogSource], fakePrinter);

    expect(fakePrinter.print).toHaveBeenCalledTimes(1);
    expect(resultLog).toMatchObject(fakeLog);
  });

  it("should print logs in chronological order", async () => {
    const fakeLogSource1 = createFakeLogSource();
    const fakeLogSource2 = createFakeLogSource();
    const result = [];

    fakeLogSource1.popAsync.mockImplementation(createFakePopFn(0, 10, 2));
    fakeLogSource2.popAsync.mockImplementation(createFakePopFn(1, 10, 2));

    fakePrinter.print.mockImplementation((log) => {
      result.push(log.date.getTime());
    });

    await solution([fakeLogSource1, fakeLogSource2], fakePrinter);

    expect(result).toMatchObject(Array.from({ length: 11 }).map((_, i) => i));
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
