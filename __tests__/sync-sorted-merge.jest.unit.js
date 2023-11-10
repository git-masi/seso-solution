// @ts-check

const solution = require("../solution/sync-sorted-merge");

describe("sync solution", () => {
  const now = new Date();
  const fakePrinter = {
    print: jest.fn(),
    done: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should immediately call `done` given an empty array of log sources", () => {
    solution([], fakePrinter);

    expect(fakePrinter.print).not.toHaveBeenCalled();
    expect(fakePrinter.done).toHaveBeenCalledTimes(1);
  });

  it("should call `print` one time", () => {
    const message = "testing 123";
    const fakeLogSource = {
      pop: jest.fn(),
    };
    const fakeLog = {
      date: now,
      msg: message,
    };
    let resultLog = null;

    fakeLogSource.pop
      .mockImplementationOnce(() => fakeLog)
      .mockImplementationOnce(() => false);

    fakePrinter.print.mockImplementation((log) => {
      resultLog = log;
    });

    solution([fakeLogSource], fakePrinter);

    expect(fakePrinter.print).toHaveBeenCalledTimes(1);
    expect(resultLog).toMatchObject(fakeLog);
  });

  it("should print logs in chronological order", () => {
    const fakeLogSource1 = createFakeLogSource();
    const fakeLogSource2 = createFakeLogSource();
    const result = [];

    fakeLogSource1.pop.mockImplementation(createFakePopFn(0, 10, 2));
    fakeLogSource2.pop.mockImplementation(createFakePopFn(1, 10, 2));

    fakePrinter.print.mockImplementation((log) => {
      result.push(log.date.getTime());
    });

    solution([fakeLogSource1, fakeLogSource2], fakePrinter);

    expect(result).toMatchObject(Array.from({ length: 11 }).map((_, i) => i));
  });
});

function createFakeLogSource() {
  return {
    pop: jest.fn(),
  };
}

/**
 * @param {number} start
 * @param {number} max
 * @param {number} increment
 * @returns {() => {date: Date, msg: string} | false}
 */
function createFakePopFn(start, max, increment) {
  let current = start - increment;

  return () => {
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
