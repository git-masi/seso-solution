/**
 * Wait the specified amount of time.
 *
 * @param {number} time
 * @returns {Promise<void>}
 */
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * Wait the specified amount of time then return the given value.
 *
 * @template {Object} T
 *
 * @param {number} time
 * @param {T} value
 * @returns {Promise<T>}
 */
async function delay(time, value) {
  await sleep(time);
  return value;
}

module.exports = { sleep, delay };
