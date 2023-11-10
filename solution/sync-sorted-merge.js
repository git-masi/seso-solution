// @ts-check

"use strict";

/** @typedef {{date: Date, msg: string}} Log */

const PriorityQueue = require("../lib/priority-queue");

// Print all entries, across all of the sources, in chronological order.

/**
 * @template {Log} T
 * @template {{pop: () => T | false }} LogSource
 * @template {{print: (log: T) => void, done: () => void}} Printer
 *
 * @param {Array<LogSource>} logSources
 * @param {Printer} printer
 */
module.exports = (logSources, printer) => {
  const init = /** @type {Array<T & {id: number}>} */ ([]);
  const pq = new PriorityQueue(init);

  logSources.forEach((source, id) => {
    const log = source.pop();

    if (log) {
      pq.enqueue({
        ...log,
        id,
      });
    }
  });

  let next = pq.dequeue();

  while (next) {
    printer.print(next);

    const log = logSources[next.id].pop();

    if (log) {
      pq.enqueue({ ...log, id: next.id });
    }

    next = pq.dequeue();
  }

  printer.done();
};
