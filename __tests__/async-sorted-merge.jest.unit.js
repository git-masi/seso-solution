// @ts-check

const {
  createFakePrinter,
  createFakeLogSource,
  createFakePopAsyncFn,
} = require("../test-lib/fakes");
const { sleep } = require("../lib/time");
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
    let resultLog = null;

    fakeLogSource1.popAsync.mockImplementation(createFakePopAsyncFn(1, 1, 1));

    fakePrinter.print.mockImplementation((log) => {
      resultLog = log;
    });

    await solution([fakeLogSource1], fakePrinter);

    expect(fakePrinter.print).toHaveBeenCalledTimes(1);
    expect(resultLog).toMatchObject({ date: new Date(1), msg: "1" });
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
    const fakeFn1 = createFakePopAsyncFn(1, 1, 1);
    const fakeFn2 = createFakePopAsyncFn(2, 2, 1);
    const result = [];

    fakeLogSource1.popAsync.mockImplementation(async () => {
      await sleep(1000);
      return fakeFn1();
    });

    fakeLogSource2.popAsync.mockImplementation(async () => {
      await sleep(1);
      return fakeFn2();
    });

    fakePrinter.print.mockImplementation((log) => {
      result.push(log);
    });

    await solution([fakeLogSource1, fakeLogSource2], fakePrinter);

    expect(result).toMatchObject([
      { date: new Date(1), msg: "1" },
      { date: new Date(2), msg: "2" },
    ]);
  });
});
