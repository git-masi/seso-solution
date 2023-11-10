// @ts-check

/**
 * A generic priority queue class.
 * @template {{}} T - The type of elements in the priority queue.
 */
module.exports = class PriorityQueue {
  /**
   * Creates a priority queue.
   * @param {string} priorityField - The field in the object to use for prioritization.
   */
  constructor(priorityField) {
    this.heap = [];
    this.priorityField = priorityField;
  }

  /**
   * Adds an item to the priority queue.
   * @param {T} item - The item to add to the queue.
   * @throws {Error} If the item is missing the priority field
   */
  enqueue(item) {
    if (!(this.priorityField in item)) {
      throw new Error(
        `Cannot enqueue ${item}. Missing field "${this.priorityField}".`
      );
    }

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

      if (
        this.heap[index][this.priorityField] >=
        this.heap[parentIndex][this.priorityField]
      ) {
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
        this.heap[left][this.priorityField] <
          this.heap[highestPriority][this.priorityField]
      ) {
        highestPriority = left;
      }

      if (
        right < length &&
        this.heap[right][this.priorityField] <
          this.heap[highestPriority][this.priorityField]
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
