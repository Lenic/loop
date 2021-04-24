import { Func, IWorker, ListItem, Ref, ReduceConfig, WorkerExecutor, WorkExecutorConfig } from './types';

export class Worker<R, T> implements IWorker<R, T> {
  private $action: WorkerExecutor<R, T>;
  private $workerConfig: WorkExecutorConfig<R, T>;

  name: string;

  constructor(public order: number, action: WorkerExecutor<R, T>) {
    this.$action = action;
    this.name = `worker-${order}`;
    this.$workerConfig = { name: this.name };
  }

  exec(getItem: Func<ListItem<T>>, previous: Ref<R>, config: ReduceConfig<R, T>): Promise<void> {
    const item = getItem();
    if (item.done) return Promise.resolve();

    const { getExecutor, globalConfig } = config;

    if (globalConfig.error) return Promise.reject(globalConfig);

    if (getExecutor) {
      if (!config.executors) {
        config.executors = {
          [this.name]: getExecutor(),
        };
      }

      if (!config.executors[this.name]) {
        config.executors[this.name] = getExecutor();
      }
    }

    return new Promise((resolve, reject) => {
      try {
        const currentAction = getExecutor ? config.executors[this.name] : this.$action;
        currentAction(previous, item.value, item.index, this.$workerConfig, globalConfig).then(
          (v) => {
            previous.value = v;

            if (globalConfig.error) {
              reject(globalConfig);
            } else {
              resolve();
            }
          },
          (e) => {
            globalConfig.error = {
              exception: e,
              workerName: this.name,
              result: previous.value,
            };
            reject(globalConfig);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}
