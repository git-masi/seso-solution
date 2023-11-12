//@ts-check

const batchPopAsync = require("../lib/batch-pop-async");

describe("batch pop async behavior", () => {
  it("should return false if the log source is drained", async () => {
    const batched = batchPopAsync(async () => false, 10);
    expect(await batched()).toBe(false);
  });
});
