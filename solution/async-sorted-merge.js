// @ts-check

"use strict";

const PriorityQueue = require("../lib/priority-queue");
const batchPopAsync = require("../lib/batch-pop-async");

// Print all entries, across all of the *async* sources, in chronological order.

/**
 * @template {Pick<LogSource, "popAsync">} U
 * @template {Printer} V
 *
 * @param {Array<U>} logSources
 * @param {V} printer
 */
module.exports = async (logSources, printer) => {
  const batchSize = 20;
  const init = /** @type {Array<Log & {id: number}>} */ ([]);
  const pq = new PriorityQueue(init);

  const batchedLogSources = logSources.map((logSource) =>
    batchPopAsync(logSource.popAsync.bind(logSource), batchSize)
  );

  const initialLogs = await Promise.all(
    batchedLogSources.map((popAsync) => popAsync())
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

    const log = await batchedLogSources[next.id]();

    if (log) {
      pq.enqueue({ ...log, id: next.id });
    }

    next = pq.dequeue();
  }

  printer.done();
};
