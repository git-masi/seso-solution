//@ts-check

const { createFakePopAsyncFn } = require("../test-lib/fakes");
const { filterValidLogs } = require("../lib/logs");
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
});
