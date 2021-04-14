import { Loop } from '../../';

const ol = document.getElementById('olList');
const pool = Loop.defaultInstance.$pool;
window.pool = pool;

const print = (...args) => {
  const li = document.createElement('li');
  li.innerText = args.join(' - ');

  ol.appendChild(li);
};

document.getElementById('btnWhite').addEventListener('click', () => {
  ol.innerHTML = null;
});

const list = [];

let locker;
let p = new Promise((r) => {
  locker = r;
});
document.getElementById('btnReduce').value = '取消所有等待';
document.getElementById('btnReduce').addEventListener('click', () => {
  print('cancel');
  locker();
});
document.getElementById('btnForEach').value = '重新设置等待';
document.getElementById('btnForEach').addEventListener('click', () => {
  print('new lock');
  p = new Promise((r) => {
    locker = r;
  });
});

document.getElementById('btnReduceRight').addEventListener('click', () => {
  const worker = list.shift();
  if (!worker) {
    print('已经没有锁定的');
    return;
  }

  print('release', worker.name);
  pool.release(worker.name);
});
document.getElementById('btnReduceRight').value = '释放第一个锁定的';

document.getElementById('btnMap').value = 'lock 一个';
document.getElementById('btnMap').addEventListener('click', () => {
  print('lock one: prelock');
  pool.lock(p).then((v) => {
    list.push(v);

    print('lock one', v.name);
  });
});
