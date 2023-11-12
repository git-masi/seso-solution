//@ts-check

const { createFakePopAsyncFn } = require("../test-lib/fakes");
const { filterValidLogs } = require("../lib/logs");
const { sleep } = require("../lib/time");
const batchPopAsync = require("../lib/batch-pop-async");

describe("batch pop async behavior", () => {
  it("should return false if the log source is drained", async () => {
    const batched = batchPopAsync(async () => false, 10);
    expect(await batched()).toBe(false);
  });

  it("should return logs in chronological order for 1 log source", async () => {
    const batched = batchPopAsync(createFakePopAsyncFn(1, 20, 1), 10);
    const result = /** @type {Array<Log | false>}*/ ([]);

    for (let i = 0; i < 20; i++) {
      result.push(await batched());
    }

    const validLogs = filterValidLogs(result);

    expect(validLogs).toHaveLength(20);

    for (let i = 0; i < 20; i++) {
      const log = validLogs[i];

      expect(log.date.getTime()).toBe(i + 1);
      expect(log.msg).toBe(`${i + 1}`);
    }
  });

  it("should handle multiple parallel requests", async () => {
    const numLogs = 21;
    const fakePopAsync = createFakePopAsyncFn(1, numLogs, 1);
    const delayedFakePopAsync = async () => {
      const rand = Math.floor(Math.random() * 10) + 1;
      await sleep(rand);
      return fakePopAsync();
    };
    const batched = batchPopAsync(delayedFakePopAsync, 10);
    const result = /** @type {Array<Log | false>}*/ ([]);

    for (let i = 0; i < numLogs; i++) {
      result.push(...(await Promise.all([batched(), batched(), batched()])));
    }

    // The first X logs should be valid logs
    const validLogs = filterValidLogs(result.slice(0, numLogs));

    expect(validLogs).toHaveLength(numLogs);

    // The first X logs should be in chronological order
    for (let i = 0; i < numLogs; i++) {
      const log = validLogs[i];

      expect(log.date.getTime()).toBe(i + 1);
      expect(log.msg).toBe(`${i + 1}`);
    }

    // All logs after the first X logs should be false
    expect(result.slice(numLogs).every((log) => !log)).toBe(true);
  });
});
