/** @global @typedef {{date: Date, msg: string}} Log */
/** @global @typedef {{pop:() => Log | false, popAsync: () => Promise<Log | false>}} LogSource */
/** @global @typedef {{print: (log: T) => void, done: () => void}} Printer */
