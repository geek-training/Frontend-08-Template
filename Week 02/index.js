let map = localStorage["map"]
  ? JSON.parse(localStorage["map"])
  : Array(10000).fill(0);
let mousedown = false;
let clear = false;
let container = document.getElementById("container");

window.onload = function() {
  document.addEventListener("mousedown", (e) => {
    mousedown = true;
    clear = e.which === 3;
  });
  document.addEventListener("mouseup", () => {
    mousedown = false;
  });
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  initMap();
};

class Sorted {
  constructor(data, compare) {
    this.data = data.slice();
    this.compare = compare || ((a, b) => a-b);
  }

  take() {
    if (!this.data.length) {
      return;
    }
    let min = this.data[0];
    let minIndex = 0;

    for (let i = 1; i < this.data.length; i++) {
      if (this.compare(this.data[i], min) < 0) {
        min = this.data[i];
        minIndex = i;
      }
    }

    // 用最后一个元素覆盖最小值的位置
    this.data[minIndex] = this.data[this.data.length - 1];
    // 与民Index位置重复，pop
    this.data.pop();
    // 返回最小值
    return min;
  }

  give(v) {
    this.data.push(v);
  }

  get length() {
    return this.data.length;
  }

}

function saveMap() {
  localStorage["map"] = JSON.stringify(map);
}

/**
 * 打印map
 */
function printMap() {
  for (let y = 0; y < 100; y++) {
    let line = '';
    for (let x = 0; x < 100; x++) {
      line += ' ' + map[100*y + x];
    }
    console.log(line);
  }
}

function initMap() {
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      if (map[100 * y + x] === 1) {
        cell.style.backgroundColor = "black";
      }

      cell.addEventListener("mousemove", () => {
        if (mousedown) {
          if (clear) {
            cell.style.backgroundColor = "";
            map[100 * y + x] = 0;
          } else {
            cell.style.backgroundColor = "black";
            map[100 * y + x] = 1;
          }
        }
      });
      container.appendChild(cell);
    }
  }
}

function sleep(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  })
}

async function findPath(map, start, end) {
  let queue = [start];
  let table = Object.create(map);

  async function insert(x, y, pre) {
    if (x < 0 || x >= 100 || y < 0 || y >= 100) {
      return ;
    }
    if (table[100*x + y]) return ;
    await sleep(5);
    container.children[100*x + y].style.backgroundColor = 'lightgreen';
    table[100*x + y]= pre;
    queue.push([x, y]);
  }

  while(queue.length) {
    let [x, y] = queue.shift();
    if (x === end[0] && y === end[1]) {
      let path = [];

      while (x !== start[0] || y !== start[1]) {
        path.push(map[100 * x + y]);
        [x, y] = table[100 * x + y];
        await sleep(30);
        container.children[100 * x + y].style.backgroundColor = 'purple';
      }
      return path;
    }
    await insert(x - 1, y, [x, y]);
    await insert(x + 1, y, [x, y]);
    await insert(x, y - 1, [x, y]);
    await insert(x, y + 1, [x, y]);

    await insert(x - 1, y - 1, [x, y]);
    await insert(x + 1, y + 1, [x, y]);
    await insert(x + 1, y - 1, [x, y]);
    await insert(x - 1, y + 1, [x, y]);
  }
  return null;
}

async function findPathBySorted(map, start, end) {
  let queue = new Sorted([start], (a, b) => distance(a) - distance(b));
  let table = Object.create(map);
  debugger

  async function insert(x, y, pre) {
    if (x < 0 || x >= 100 || y < 0 || y >= 100) {
      return ;
    }
    if (table[100*x + y]) return ;
    await sleep(5);
    container.children[100*x + y].style.backgroundColor = 'lightgreen';
    table[100*x + y]= pre;
    queue.give([x, y]);
  }

  function distance(point) {
    return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2;
  }

  while(queue.length) {
    let [x, y] = queue.take();
    console.log([x, y]);
    if (x === end[0] && y === end[1]) {
      let path = [];

      while (x !== start[0] || y !== start[1]) {
        path.push(map[100 * x + y]);
        [x, y] = table[100 * x + y];
        await sleep(30);
        container.children[100 * x + y].style.backgroundColor = 'purple';
      }
      return path;
    }
    await insert(x - 1, y, [x, y]);
    await insert(x + 1, y, [x, y]);
    await insert(x, y - 1, [x, y]);
    await insert(x, y + 1, [x, y]);

    await insert(x - 1, y - 1, [x, y]);
    await insert(x + 1, y + 1, [x, y]);
    await insert(x + 1, y - 1, [x, y]);
    await insert(x - 1, y + 1, [x, y]);
  }
  return null;
}
