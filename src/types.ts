export interface Ref<T> {
  value: T;
}

export interface ListItem<T> {
  value?: T;
  done: boolean;
  index: number;
}

export interface Action<T> {
  (arg: T): void;
}

export interface Func<T> {
  (): T;
}

export interface WorkConfig<T> extends Record<string, any> {
  error?: {
    result: T;
    exception: any;
    workerName: string;
  };
}

export enum WorkerStatus {
  idle = 1,
  running = 2,
}

export interface WorkExecutorConfig<R, T> extends Record<string, any> {
  name: string;
}

export interface WorkerExecutor<R, T> {
  (
    previousValue: Ref<R>,
    currentValue: T,
    currentIndex: number,
    workerConfig: WorkExecutorConfig<R, T>,
    globalConfig: WorkConfig<R>
  ): Promise<R>;
}

export interface ReduceConfig<R, T> {
  globalConfig?: WorkConfig<R>;
  getExecutor?: Func<WorkerExecutor<R, T>>;
  executors?: Record<string, WorkerExecutor<R, T>>;
}

export interface IWorker<R, T> {
  name: string;
  order: number;
  exec(getItem: Func<ListItem<T>>, previous: Ref<R>, config: ReduceConfig<R, T>): Promise<void>;
}

export interface WorkerInfo<R, T> {
  status: WorkerStatus;
  instance: IWorker<R, T>;
}

export interface EachAction<T> {
  (
    currentValue: T,
    currentIndex: number,
    localConfig: Record<string, any>,
    globalConfig: WorkConfig<string>
  ): Promise<void>;
}

export interface MapAction<R, T> {
  (currentValue: T, currentIndex: number, localConfig: Record<string, any>, globalConfig: WorkConfig<R[]>): Promise<R>;
}
