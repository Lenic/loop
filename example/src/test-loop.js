import { Loop } from '../../';

const ol = document.getElementById('olList');

const print = (...args) => {
  const msg = args.join(' -- ');

  const li = document.createElement('li');
  li.innerText = msg;
  ol.appendChild(li);

  console.log(msg);
};

const getPromise = (wait, action) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      action(resolve, reject);
    }, wait);
  });
};

document.getElementById('btnWhite').addEventListener('click', () => {
  ol.innerHTML = null;
});

const eacher = Loop.defaultInstance.each((x, index, config) => {
  print(`be = x: ${x}, index: ${index}, worker: ${config.name}`);
  return getPromise(~~(Math.random() * 1000), (r) => {
    print(`do = worker: ${config.name}, x: ${x}`);
    r();
  });
});

document.getElementById('btnForEach').addEventListener('click', () => {
  eacher.exec([1, 2, 3, 4]).then((v) => print('reduce1', v));
  eacher.exec([10, 20, 30, 40]).then((v) => print('reduce2', v));
});

const eacher2 = Loop.defaultInstance.each((x, index, config) => {
  print(`be = x: ${x}, index: ${index}, worker: ${config.name}`);
  return getPromise(~~(Math.random() * 1000), (r, e) => {
    print(`do = worker: ${config.name}, x: ${x}`);
    (Date.now() % 3 === 0 ? e : r)();
  });
});

document.getElementById('btnForEach2').addEventListener('click', () => {
  eacher2.exec([1, 2, 3, 4]).then(
    () => print('reduce1'),
    () => print('reduce1.failure')
  );
  eacher2.exec([10, 20, 30, 40]).then(
    () => print('reduce2'),
    () => print('reduce2.failure')
  );
});

const mapper = Loop.defaultInstance.map((x, index, config) => {
  print(`be = x: ${x}, index: ${index}, worker: ${config.name}`);
  return getPromise(~~(Math.random() * 1000), (r) => {
    print(`do = worker: ${config.name}, x: ${x}`);
    r(x + 1);
  });
});

document.getElementById('btnMap').addEventListener('click', () => {
  mapper.exec([1, 2, 3, 4]).then((v) => print('reduce1', v));
  mapper.exec([10, 20, 30, 40]).then((v) => print('reduce2', v));
});

const mapper2 = Loop.defaultInstance.map((x, index, config) => {
  print(`be = x: ${x}, index: ${index}, worker: ${config.name}`);
  return getPromise(~~(Math.random() * 1000), (r, e) => {
    print(`do = worker: ${config.name}, x: ${x}`);
    (Date.now() % 3 === 0 ? e : r)(x + 1);
  });
});

document.getElementById('btnMap2').addEventListener('click', () => {
  mapper2.exec([1, 2, 3, 4]).then(
    (v) => print('reduce1', v),
    (v) => print('reduce1.failure', JSON.stringify(v))
  );
  mapper2.exec([10, 20, 30, 40]).then(
    (v) => print('reduce1', v),
    (v) => print('reduce2.failure', JSON.stringify(v))
  );
});

const reducer = Loop.defaultInstance.reduce(() => (acc, x, index, config) => {
  print(`be = acc: ${acc.value}, x: ${x}, index: ${index}, worker: ${config.name}`);
  return getPromise(~~(Math.random() * 1000), (r) => {
    const value = acc.value + x;
    print(`do = worker: ${config.name}, value: ${value}, acc: ${acc.value}, x: ${x}`);
    r(value);
  });
});

document.getElementById('btnReduce').addEventListener('click', () => {
  reducer.exec([1, 2, 3, 4], 10).then((v) => print('reduce1', v));
  reducer.exec([10, 20, 30, 40], 100).then((v) => print('reduce2', v));
});

document.getElementById('btnReduceRight').addEventListener('click', () => {
  reducer.execRight([1, 2, 3, 4], 10).then((v) => print('reduce1', v));
  reducer.execRight([10, 20, 30, 40], 100).then((v) => print('reduce2', v));
});

const exceptionReducer = Loop.defaultInstance.reduce(() => (acc, x, index, config) => {
  print(`be = acc: ${acc.value}, x: ${x}, index: ${index}, worker: ${config.name}`);
  return getPromise(~~(Math.random() * 1000), (r, e) => {
    const value = acc.value + x;
    print(`do = worker: ${config.name}, value: ${value}, acc: ${acc.value}, x: ${x}`);
    (Date.now() % 3 === 0 ? e : r)(value);
  });
});

document.getElementById('btnReduce2').addEventListener('click', () => {
  exceptionReducer.exec([1, 2, 3, 4], 10).then(
    (v) => print('success.reduce1', v),
    (e) => print('failure.reduce1', JSON.stringify(e))
  );
  exceptionReducer.exec([10, 20, 30, 40], 100).then(
    (v) => print('success.reduce2', v),
    (e) => print('failure.reduce2', JSON.stringify(e))
  );
});

document.getElementById('btnReduceRight2').addEventListener('click', () => {
  exceptionReducer.execRight([1, 2, 3, 4], 10).then(
    (v) => print('success.reduce1', v),
    (e) => print('failure.reduce1', JSON.stringify(e))
  );
  exceptionReducer.execRight([10, 20, 30, 40], 100).then(
    (v) => print('success.reduce2', v),
    (e) => print('failure.reduce2', JSON.stringify(e))
  );
});
