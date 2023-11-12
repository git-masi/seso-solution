// @ts-check

"use strict";

const PriorityQueue = require("../lib/priority-queue");

// Print all entries, across all of the *async* sources, in chronological order.

/**
 * @template {Pick<LogSource, "popAsync">} U
 * @template {Printer} V
 *
 * @param {Array<U>} logSources
 * @param {V} printer
 */
module.exports = async (logSources, printer) => {
  const init = /** @type {Array<Log & {id: number}>} */ ([]);
  const pq = new PriorityQueue(init);

  await Promise.all(
    // Arguably this is an abuse of `map` because we don't do anything with the new array
    // that is created. But this is a terse way of achieving the goal of waiting for all
    // of the initial values to populate.
    logSources.map(async (source, id) => {
      const log = await source.popAsync();

      if (log) {
        pq.enqueue({
          ...log,
          id,
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
