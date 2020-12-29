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
  console.log(start)
  console.log(end)
  let queue = [start];
  let table = Object.create(map);

  async function insert(x, y, pre) {
    if (x < 0 || x >= 100 || y < 0 || y >= 100) {
      return ;
    }
    if (table[100*x + y]) return ;
    // await sleep(30);
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
  return false;
}
