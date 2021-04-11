import { ItemGetter, WorkExecutor, Ref } from './type';

export class Worker<T> {
  constructor(private getItem: ItemGetter<T>, private name: string) {}

  exec<R>(previousValue: Ref<R>, executor: WorkExecutor<R, T>): Promise<void> {
    const item = this.getItem();
    if (item.done) return Promise.resolve();

    return executor(previousValue, item.value, item.index, { name: this.name }).then((v) => {
      previousValue.value = v;

      return this.exec(previousValue, executor);
    });
  }
}
