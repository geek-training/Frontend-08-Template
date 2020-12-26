let pattern = [
    [2, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
];
let color = 1;
function show(pattern) {
    let board = document.getElementById('board');
    board.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell')
            cell.innerText =
                pattern[i][j] === 1 ? 'O' :
                pattern[i][j] === 2 ? 'X' : '';
            ;
            cell.addEventListener('click', () => { move(i, j); })
            board.appendChild(cell);
        }
        board.append(document.createElement('br'));
    }
}

show(pattern);

function move (x, y) {
    // 如果该位置已落子，不做处理
    if (pattern[x][y]) {
        return false;
    }
    pattern[x][y] =  color;
    if (check()) {
        alert(color + 'win');
    }
    color = 3 - color;
    show(pattern);
}

function check() {
    for (let i = 0; i < 3; i++) {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j] !== color) {
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }
    for (let i = 0; i < 3; i++) {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if (pattern[j][i] !== color) {
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }
    {
        let win = true;
        for (let i = 0; i < 3; i++) {
            if(pattern[i][i] !== color) {
                win = false;
            }
        }
        if (win) {
            return true;
        }

    }
    {
        let win = true;
        for (let i = 0; i < 3; i++) {
            if(pattern[i][2-i] !== color) {
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }
}


