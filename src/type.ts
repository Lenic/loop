export interface Ref<T> {
  value: T;
}

export interface ListItem<T> {
  value?: T;
  done: boolean;
  index: number;
}

export interface ItemGetter<T> {
  (): ListItem<T>;
}

export interface ItemExecutor<R, T> {
  (arg: T, currentIndex: number, config: Record<string, any>): Promise<R>;
}

export interface WorkExecutor<R, T> {
  (previousValue: Ref<R>, currentValue: T, currentIndex: number, config: Record<string, any>): Promise<R>;
}
