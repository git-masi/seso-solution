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
      date: new Date(now.getTime()),
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
});
