import { IWorker, WorkerInfo, WorkerStatus } from './types';

type WaitingAction<R, T> = (value: IWorker<R, T>) => void;

export class WorkerPool<R, T> {
  private $waitingInstances: WaitingAction<R, T>[];

  names: string[];
  mapper: Record<string, WorkerInfo<R, T>>;

  constructor() {
    this.names = [];
    this.mapper = {};

    this.$waitingInstances = [];
  }

  init(instances: IWorker<R, T>[]) {
    this.names = [];

    instances.forEach((instance) => {
      this.names.push(instance.name);
      this.mapper[instance.name] = {
        instance,
        status: WorkerStatus.idle,
      };
    });
  }

  lock(signal: Promise<void>) {
    return new Promise<IWorker<R, T>>((resolve) => {
      let info: WorkerInfo<R, T>;

      for (let i = 0; i < this.names.length; i++) {
        const name = this.names[i];
        const currentInfo = this.mapper[name];

        if (currentInfo.status === WorkerStatus.idle) {
          info = currentInfo;
          info.status = WorkerStatus.running;
          break;
        }
      }

      if (info) {
        resolve(info.instance);
      } else {
        signal.then(() => {
          const index = this.$waitingInstances.findIndex((x) => x === resolve);
          if (index >= 0) {
            this.$waitingInstances.splice(index, 1);
          }
        });
        this.$waitingInstances.push(resolve);
      }
    });
  }

  release(instanceName: string) {
    const currentInstance = this.mapper[instanceName];
    if (!currentInstance) return;

    if (this.$waitingInstances.length) {
      this.$waitingInstances.shift()(currentInstance.instance);
    } else {
      currentInstance.status = WorkerStatus.idle;
    }
  }
}
