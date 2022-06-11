import type { MapAction, WorkerExecutor } from './types';

import { ReduceContainer } from './reduce-container';

export class MapContainer<R, T> {
  private $reducer: ReduceContainer<R[], T>;

  constructor(concurrent: number, executor: MapAction<R, T>) {
    const action: WorkerExecutor<R[], T> = (previousValue, currentValue, currentIndex, localConfig, globalConfig) => {
      return executor(currentValue, currentIndex, localConfig, globalConfig).then((v) => {
        previousValue.value.push(v);

        return previousValue.value;
      });
    };
    this.$reducer = new ReduceContainer<R[], T>(concurrent, () => action);
  }

  exec(list: T[]) {
    return this.$reducer.exec(list, []);
  }
}
