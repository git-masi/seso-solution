// @ts-check

"use strict";

/** @typedef {{date: Date, msg: string}} Log */

const PriorityQueue = require("../lib/priority-queue");

// Print all entries, across all of the *async* sources, in chronological order.

/**
 * @template {Log} T
 * @template {{popAsync: () => Promise<T | false> }} LogSource
 * @template {{print: (log: T) => void, done: () => void}} Printer
 *
 * @param {Array<LogSource>} logSources
 * @param {Printer} printer
 */
module.exports = async (logSources, printer) => {
  const init = /** @type {Array<T & {id: number}>} */ ([]);
  const pq = new PriorityQueue(init);

  await Promise.all(
    // Arguably this is an abuse of `map` because we don't do anything with the new array
    // that is created. But this is a terse way of achieving the goal of waiting for all
    // of the initial values to populate.
    logSources.map(async (ls, idx) => {
      const log = await ls.popAsync();

      if (log) {
        pq.enqueue({
          ...log,
          id: idx,
        });
      }
    })
  );

  let next = pq.dequeue();

  while (next) {
    printer.print(next);

    const log = await logSources[next.id].popAsync();

    if (log) {
      pq.enqueue({ ...log, id: next.id });
    }

    next = pq.dequeue();
  }

  printer.done();
};
