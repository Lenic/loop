import type { EachAction, WorkerExecutor } from './types';

import { ReduceContainer } from './reduce-container';

export class EachContainer<T> {
  private $reducer: ReduceContainer<string, T>;

  constructor(concurrent: number, executor: EachAction<T>) {
    const action: WorkerExecutor<string, T> = (_, currentValue, currentIndex, localConfig, globalConfig) => {
      return executor(currentValue, currentIndex, localConfig, globalConfig).then(() => '');
    };
    this.$reducer = new ReduceContainer<string, T>(concurrent, () => action);
  }

  exec(list: T[]) {
    return this.$reducer.exec(list, '');
  }
}
