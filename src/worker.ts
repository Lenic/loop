import type { Func, IWorker, ListItem, Ref, WorkConfig, WorkerExecutor } from './types';

export class Worker<R, T> implements IWorker<R, T> {
  private $action: WorkerExecutor<R, T>;
  private $localConfig: Record<string, any>;

  name: string;

  constructor(public order: number, action: WorkerExecutor<R, T>) {
    this.$action = action;
    this.name = `worker-${order}`;
    this.$localConfig = { name: this.name };
  }

  exec(getItem: Func<ListItem<T>>, previous: Ref<R>, config: WorkConfig<R>): Promise<void> {
    const item = getItem();
    if (item.done === true) return Promise.resolve();
    if (config.error) return Promise.reject(config);

    return new Promise((resolve, reject) => {
      try {
        this.$action(previous, item.value, item.index, this.$localConfig, config).then(
          (v) => {
            previous.value = v;

            if (config.error) {
              reject(config);
            } else {
              resolve();
            }
          },
          (e) => {
            config.error = {
              exception: e,
              workerName: this.name,
              result: previous.value,
            };
            reject(config);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}
