// @ts-check

"use strict";

const PriorityQueue = require("../lib/priority-queue");

describe("PriorityQueue behavior", () => {
  it("should return elements in chronological order", () => {
    const now = new Date();
    const pq = new PriorityQueue();
    const obj1 = { id: 1, date: now };
    const obj2 = { id: 2, date: new Date(now.getTime() + 1000) };
    const obj3 = { id: 3, date: new Date(now.getTime() - 1000) };

    pq.enqueue(obj1);
    pq.enqueue(obj2);
    pq.enqueue(obj3);

    expect(pq.dequeue()).toBe(obj3);
    expect(pq.dequeue()).toBe(obj1);
    expect(pq.dequeue()).toBe(obj2);
    expect(pq.dequeue()).toBeNull();
  });
});
