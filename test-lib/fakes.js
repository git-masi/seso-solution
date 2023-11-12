// @ts-check

function createFakePrinter() {
  return {
    print: jest.fn(),
    done: jest.fn(),
  };
}

function createFakeLogSource() {
  return {
    pop: jest.fn(),
    popAsync: jest.fn(),
  };
}

/**
 * @param {number} current
 * @param {number} max
 * @param {number} increment
 * @returns {() => Log | false}
 */
function createFakePopFn(current, max, increment) {
  return () => {
    if (current > max) {
      return false;
    }

    const log = {
      date: new Date(current),
      msg: `${current}`,
    };

    current += increment;

    return log;
  };
}

/**
 * @param {number} current
 * @param {number} max
 * @param {number} increment
 * @returns {() => Promise<Log | false>}
 */
function createFakePopAsyncFn(current, max, increment) {
  return () => {
    if (current > max) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    const log = {
      date: new Date(current),
      msg: `${current}`,
    };

    current += increment;

    return new Promise((resolve) => {
      resolve(log);
    });
  };
}

module.exports = {
  createFakePrinter,
  createFakeLogSource,
  createFakePopFn,
  createFakePopAsyncFn,
};
