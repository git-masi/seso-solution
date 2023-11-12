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

module.exports = { sleep };
