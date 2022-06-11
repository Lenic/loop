import type { ListItem } from './types';

export class ListContainer<T> {
  private $index: number;
  private $list: T[];

  constructor(list: T[]) {
    this.$index = -2;
    this.$list = list;

    this.done = this.done.bind(this);
    this.getNext = this.getNext.bind(this);
    this.getPrevious = this.getPrevious.bind(this);
  }

  private getValue(value?: T): ListItem<T> {
    if (typeof value !== 'undefined') {
      return { done: false, value, index: this.$index };
    } else {
      return { done: true, index: this.$index };
    }
  }

  done() {
    const total = this.$list.length;

    if (!total || this.$index === -1 || this.$index >= total) {
      return true;
    }

    return false;
  }

  getNext(): ListItem<T> {
    if (!this.$list.length) return this.getValue();

    if (this.$index < 0) {
      this.$index = 0;
    }

    if (this.$index >= this.$list.length) return this.getValue();

    try {
      return this.getValue(this.$list[this.$index]);
    } finally {
      this.$index += 1;
    }
  }

  getPrevious(): ListItem<T> {
    if (!this.$list.length) return this.getValue();

    if (this.$index === -2) {
      this.$index = this.$list.length - 1;
    }

    if (this.$index < 0) return this.getValue();

    try {
      return this.getValue(this.$list[this.$index]);
    } finally {
      this.$index -= 1;
    }
  }
}
