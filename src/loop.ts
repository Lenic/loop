import { Worker } from './worker';
import { ItemExecutor, ItemGetter, ListItem, WorkExecutor, Ref } from './type';

export class Loop<T> {
  constructor(private list: T[], private concurrent = 3) {
    this.map = this.map.bind(this);
    this.reduce = this.reduce.bind(this);
    this.forEach = this.forEach.bind(this);
    this.reduceRight = this.reduceRight.bind(this);
  }

  private getNext(): ItemGetter<T> {
    let index = 0;

    return () => {
      let result: ListItem<T>;

      if (index < this.list.length) {
        result = { value: this.list[index], index, done: false };
      } else {
        result = { index, done: true };
      }

      index += 1;

      return result;
    };
  }

  private getPrevious(): ItemGetter<T> {
    let index = this.list.length - 1;

    return () => {
      let result: ListItem<T>;

      if (index >= 0) {
        result = { value: this.list[index], index, done: false };
      } else {
        result = { index, done: true };
      }

      index -= 1;

      return result;
    };
  }

  private reduceCore<R>(getItem: ItemGetter<T>, memo: R, getExecutor: () => WorkExecutor<R, T>) {
    const workers: Worker<T>[] = [];
    const res: Ref<R> = { value: memo };

    for (let i = 0; i < this.concurrent; i++) {
      workers.push(new Worker(getItem, `worker-${i}`));
    }

    return Promise.all(workers.map((v) => v.exec<R>(res, getExecutor()))).then(() => res.value);
  }

  static create<T>(list: T[], concurrent = 3) {
    return new Loop(list, concurrent);
  }

  reduce<R>(memo: R, getExecutor: () => WorkExecutor<R, T>) {
    return this.reduceCore(this.getNext(), memo, getExecutor);
  }

  reduceRight<R>(memo: R, getExecutor: () => WorkExecutor<R, T>) {
    return this.reduceCore(this.getPrevious(), memo, getExecutor);
  }

  forEach(action: ItemExecutor<void, T>) {
    const executor: WorkExecutor<void, T> = (_, x, index, config) => action(x, index, config);

    return this.reduce(undefined, () => executor);
  }

  map<R>(action: ItemExecutor<R, T>) {
    const executor: WorkExecutor<R[], T> = (acc, x, index, config) =>
      action(x, index, config).then((v) => {
        acc.value.push(v);
        return acc.value;
      });

    return this.reduce<R[]>([], () => executor);
  }
}