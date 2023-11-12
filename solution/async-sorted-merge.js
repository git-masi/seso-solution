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

  const initialLogs = await Promise.all(
    logSources.map((logSource) => logSource.popAsync())
  );

  initialLogs.forEach((log, id) => {
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

    const log = await logSources[next.id].popAsync();

    if (log) {
      pq.enqueue({ ...log, id: next.id });
    }

    next = pq.dequeue();
  }

  printer.done();
};
