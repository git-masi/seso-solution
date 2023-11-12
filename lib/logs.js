/**
 * Get all valid logs from an array of values returns from a log source.
 * This function is useful because the language server cannot infer the
 * type of `logs.filter(Boolean)`
 *
 * @param {Array<Log | false>} logs
 * @returns {Array<Log>}
 */
function filterValidLogs(logs) {
  const validLogs = [];

  for (const log of logs) {
    if (log) {
      validLogs.push(log);
    }
  }

  return validLogs;
}

module.exports = { filterValidLogs };
