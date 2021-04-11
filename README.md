# Loop

用于在 JavaScript 中异步、并行执行某些操作。

## Usage

```html
<div>
  <div>
    <input id="btnWhite" type="button" value="clear" />
    <input id="btnForEach" type="button" value="forEach" />
    <input id="btnMap" type="button" value="map" />
    <input id="btnReduce" type="button" value="reduce" />
    <input id="btnReduceRight" type="button" value="reduceRight" />
  </div>
  <div>
    <ol id="olList"></ol>
  </div>
</div>
```

```js
import { Loop } from '@lenic/loop';

const sourceList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const loop = Loop.create(sourceList);
const ol = document.getElementById('olList');

document.getElementById('btnWhite').addEventListener('click', () => {
  ol.innerHTML = null;
});

document.getElementById('btnForEach').addEventListener('click', () => {
  loop.forEach((v, index, { name }) => {
    return new Promise((r) => {
      setTimeout(() => {
        const li = document.createElement('li');
        li.innerText = `${v}--${index}--${name}`;

        ol.appendChild(li);
        r();
      }, ~~(Math.random() * 1000));
    });
  });
});

document.getElementById('btnMap').addEventListener('click', () => {
  loop
    .map((v, index, { name }) => {
      return new Promise((r) => {
        setTimeout(() => {
          const li = document.createElement('li');
          li.innerText = `${v}--${index}--${name}`;

          ol.appendChild(li);
          r(v);
        }, ~~(Math.random() * 1000));
      });
    })
    .then((v) => {
      const li = document.createElement('li');
      li.innerText = JSON.stringify(v);

      ol.appendChild(li);
    });
});

document.getElementById('btnReduce').addEventListener('click', () => {
  loop
    .reduce(10, () => (acc, v, index, { name }) => {
      return new Promise((r) => {
        setTimeout(() => {
          const li = document.createElement('li');
          li.innerText = `${v}--${index}--${name}`;

          ol.appendChild(li);
          r(acc.value + v);
        }, ~~(Math.random() * 1000));
      });
    })
    .then((v) => {
      const li = document.createElement('li');
      li.innerText = JSON.stringify(v);

      ol.appendChild(li);
    });
});

document.getElementById('btnReduceRight').addEventListener('click', () => {
  loop
    .reduceRight(100, () => (acc, v, index, { name }) => {
      return new Promise((r) => {
        setTimeout(() => {
          const li = document.createElement('li');
          li.innerText = `${v}--${index}--${name}`;

          ol.appendChild(li);
          r(acc.value + v);
        }, ~~(Math.random() * 1000));
      });
    })
    .then((v) => {
      const li = document.createElement('li');
      li.innerText = JSON.stringify(v);

      ol.appendChild(li);
    });
});
```
