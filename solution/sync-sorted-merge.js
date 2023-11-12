// @ts-check

"use strict";

const PriorityQueue = require("../lib/priority-queue");

// Print all entries, across all of the sources, in chronological order.

/**
 * @template {Pick<LogSource, "pop">} U
 * @template {Printer} V
 *
 * @param {Array<U>} logSources
 * @param {V} printer
 */
module.exports = (logSources, printer) => {
  const init = /** @type {Array<Log & {id: number}>} */ ([]);
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
