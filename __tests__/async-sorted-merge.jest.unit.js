// @ts-check

const {
  createFakePrinter,
  createFakeLogSource,
  createFakePopAsyncFn,
} = require("../test-lib/fakes");
const { delay } = require("../lib/time");
const solution = require("../solution/async-sorted-merge");

describe("async solution", () => {
  const now = new Date();
  const fakePrinter = createFakePrinter();
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

    fakeLogSource1.popAsync.mockImplementation(createFakePopAsyncFn(0, 10, 2));
    fakeLogSource2.popAsync.mockImplementation(createFakePopAsyncFn(1, 10, 2));

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
      .mockImplementationOnce(() => delay(1000, fakeLog1))
      .mockImplementationOnce(async () => false);

    fakeLogSource2.popAsync
      .mockImplementationOnce(() => delay(1, fakeLog2))
      .mockImplementationOnce(async () => false);

    fakePrinter.print.mockImplementation((log) => {
      result.push(log);
    });

    await solution([fakeLogSource1, fakeLogSource2], fakePrinter);

    expect(result).toMatchObject([fakeLog1, fakeLog2]);
  });
});
