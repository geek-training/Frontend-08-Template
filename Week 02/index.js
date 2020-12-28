let map = localStorage["map"]
  ? JSON.parse(localStorage["map"])
  : Array(10000).fill(0);

function saveMap() {
  localStorage["map"] = JSON.stringify(map);
}

function initMap() {
  let container = document.getElementById("container");
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add(100 * y + x);
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
            map[100 * y + 100] = 1;
          }
        }
      });
      container.appendChild(cell);
    }
    document.createElement("br");
  }
}

let mousedown = false;
let clear = false;
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
