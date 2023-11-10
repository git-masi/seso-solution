// @ts-check

/**
 * A priority queue where each object in the queue has a `date` to use as the priority field.
 * @template {{date: Date}} T - A generic object with a `date` of type `Date`.
 *
 * @param {T} heap
 */
module.exports = class PriorityQueue {
  constructor() {
    /**
     * @type {Array<T>}
     */
    this.heap = [];
  }

  /**
   * Adds an item to the priority queue.
   * @param {T} item - The item to add to the queue.
   */
  enqueue(item) {
    this.heap.push(item);
    this.bubbleUp();
  }

  /**
   * Removes and returns the item with the highest priority.
   * @returns {T | null} - The item with the highest priority.
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const item = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.sinkDown();

    return item;
  }

  /**
   * Checks if the priority queue is empty.
   * @returns {boolean} - True if the queue is empty, false otherwise.
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Reorders the heap upwards after adding a new item.
   * @private
   */
  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (this.heap[index].date >= this.heap[parentIndex].date) {
        break;
      }

      this.swap(parentIndex, index);

      index = parentIndex;
    }
  }

  /**
   * Reorders the heap downwards after removing the top item.
   * @private
   */
  sinkDown() {
    let index = 0;
    const length = this.heap.length;

    while (true) {
      let highestPriority = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (
        left < length &&
        this.heap[left].date < this.heap[highestPriority].date
      ) {
        highestPriority = left;
      }

      if (
        right < length &&
        this.heap[right].date < this.heap[highestPriority].date
      ) {
        highestPriority = right;
      }

      if (highestPriority === index) {
        break;
      }

      this.swap(highestPriority, index);

      index = highestPriority;
    }
  }

  /**
   * Swap the elements at two indexes.
   * @private
   *
   * @param {number} x
   * @param {number} y
   */
  swap(x, y) {
    [this.heap[x], this.heap[y]] = [this.heap[y], this.heap[x]];
  }
};
