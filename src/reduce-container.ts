import { Worker } from './worker';
import { WorkerPool } from './worker-pool';
import { ListContainer } from './list-container';

import { Action, Func, IWorker, ListItem, Ref, WorkConfig, WorkerExecutor, ReduceConfig } from './types';

export class ReduceContainer<R, T> {
  private $pool: WorkerPool<R, T>;
  private $concurrent: number;

  constructor(concurrent: number, getExecutor: Func<WorkerExecutor<R, T>>) {
    this.$pool = new WorkerPool();
    this.$concurrent = concurrent;

    const workers: Worker<R, T>[] = [];
    for (let i = 0; i < concurrent; i++) {
      workers.push(new Worker<R, T>(i, getExecutor()));
    }

    this.$pool.init(workers);
  }

  private execIterator(
    worker: IWorker<R, T>,
    getItem: Func<ListItem<T>>,
    done: Func<boolean>,
    previousValue: Ref<R>,
    config: ReduceConfig<R, T>
  ) {
    return worker.exec(getItem, previousValue, config).then(() => {
      if (done()) return Promise.resolve();

      return worker
        .exec(getItem, previousValue, config)
        .then(() => this.execIterator(worker, getItem, done, previousValue, config));
    });
  }

  private execCore(isNextDirection: boolean, list: T[], memo: R, config: ReduceConfig<R, T>) {
    const jobs: Promise<void>[] = [];
    const res: Ref<R> = { value: memo };
    const sourceList = new ListContainer(list);
    const getItem = isNextDirection ? sourceList.getNext : sourceList.getPrevious;

    if (!config.globalConfig) {
      config.globalConfig = {};
    }

    let canceler: Action<void | PromiseLike<void>>;

    for (let i = 0; i < this.$concurrent; i++) {
      jobs.push(
        this.$pool.lock(new Promise((r) => (canceler = r))).then((worker) => {
          const dispose = () => {
            this.$pool.release(worker.name);
            canceler();
          };
          return this.execIterator(worker, getItem, sourceList.done, res, config).then(dispose, (e) => {
            dispose();

            return Promise.reject(e);
          });
        })
      );
    }

    return Promise.all(jobs).then(() => res.value);
  }

  exec(list: T[], memo: R, config: ReduceConfig<R, T> = {}) {
    return this.execCore(true, list, memo, config);
  }

  execRight(list: T[], memo: R, config: ReduceConfig<R, T> = {}) {
    return this.execCore(false, list, memo, config);
  }
}
