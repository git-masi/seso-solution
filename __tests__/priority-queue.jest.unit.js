// @ts-check

const PriorityQueue = require("../lib/priority-queue");

describe("PriorityQueue behavior", () => {
  it("should throw an error when adding an object that doesn't have the specified `priorityField`", () => {
    const pq = new PriorityQueue("date");

    expect(() => pq.enqueue({ test: true })).toThrow();
  });

  it("should return elements in chronological order", () => {
    const now = new Date();
    const pq = new PriorityQueue("date");
    const obj1 = { date: now };
    const obj2 = { date: new Date(now.getTime() + 1000) };
    const obj3 = { date: new Date(now.getTime() - 1000) };

    pq.enqueue(obj1);
    pq.enqueue(obj2);
    pq.enqueue(obj3);

    expect(pq.dequeue()).toBe(obj3);
    expect(pq.dequeue()).toBe(obj1);
    expect(pq.dequeue()).toBe(obj2);
    expect(pq.dequeue()).toBeNull();
  });
});
