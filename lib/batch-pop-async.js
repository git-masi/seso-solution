// @ts-check

"use strict";

const { sleep } = require("../lib/time");

/**
 * @param {() => Promise<Log | false>} popAsync
 * @param {number} batchSize
 * @returns {() => Promise<Log | false>}
 */
module.exports = function batchPopAsync(popAsync, batchSize) {
  let batch = [];
  let isFetching = false;
  let isDrained = false;

  return async () => {
    if (isDrained) {
      return false;
    }

    if (batch.length === 0) {
      if (!isFetching) {
        isFetching = true;

        batch = (
          await Promise.all(Array.from({ length: batchSize }).map(popAsync))
        ).sort((a, b) => {
          if (!a && b) {
            return -1;
          }

          if (a && !b) {
            return 1;
          }

          if (a && b) {
            return b.date.getTime() - a.date.getTime();
          }

          return 0;
        });

        isFetching = false;
      } else {
        while (isFetching) {
          await sleep(5);
        }
      }
    }

    const log = batch.pop();

    if (!log) {
      isDrained = true;
      return false;
    }

    return log;
  };
};
