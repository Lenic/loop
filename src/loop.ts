import { EachAction, Func, MapAction, WorkerExecutor } from './types';
import { MapContainer } from './map-container';
import { EachContainer } from './each-container';
import { ReduceContainer } from './reduce-container';

export class Loop {
  private $concurrent: number;

  constructor(concurrent: number) {
    this.$concurrent = concurrent;
  }

  static defaultInstance = new Loop(3);

  reduce<R, T>(getExecutor: Func<WorkerExecutor<R, T>>) {
    return new ReduceContainer<R, T>(this.$concurrent, getExecutor);
  }

  each<T>(action: EachAction<T>) {
    return new EachContainer<T>(this.$concurrent, action);
  }

  map<R, T>(mapper: MapAction<R, T>) {
    return new MapContainer(this.$concurrent, mapper);
  }
}
