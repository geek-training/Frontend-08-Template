let pattern = [
    [0, 0, 2],
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
            cell.addEventListener('click', () => { move(i, j); })
            board.appendChild(cell);
        }
        board.append(document.createElement('br'));
    }
    console.log(bestChoice(pattern,color))
}

show(pattern);

function move (x, y) {
    // 如果该位置已落子，不做处理
    if (pattern[x][y]) {
        return false;
    }
    pattern[x][y] =  color;

    if (check(pattern, color, x, y)) {
        alert((color === 1 ? 'O' : 'X') + ' won!');
    }
    color = 3 - color;
    show(pattern);
    if (willWin(pattern, color)) {
        console.log((color === 1 ? 'O' : 'X') + ' will win!')
    }
}

function bestChoice(pattern, color) {
    let p = willWin(pattern, color);
    if (p) {
        return {
            point: p,
            result: 1
        }
    }

    let result = -2;
    let point = null;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j]) continue;
            let tmp = clone(pattern);
            tmp[i][j] = color;
            let opp = bestChoice(tmp, 3 - color);
            if (-opp.result > result) {
                result = -opp.result;
                point = [i, j];
            }
        }
    }
    return {
        point: point,
        result: point ? result: 0
    }
}

function willWin(pattern, color) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j]) {
                continue;
            }
            let tmp = clone(pattern);
            tmp[i][j] = color;
            if (check(tmp, color, i, j)) {
                return [i, j];
            }
        }
    }
    return null;
}

function clone(pattern) {
    return JSON.parse(JSON.stringify(pattern));
}

/**
 * 判断当前落子位置是否会赢
 * @param pattern 落子后pattern
 * @param color 当前color
 * @param x 最后一次落子x
 * @param y 最后一次落子y
 * @returns {boolean}
 */
function check(pattern, color, x, y) {
    // 如果在对角线上
    if (x === y) {
        let win = true;
        for (let i = 0; i < 3; i++) {
            if (pattern[i][i] !== color) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }
    // 如果在反对角线上
    if (x + y === 2) {
        let win = true;
        for (let i = 0; i < 3; i++) {
            if (pattern[i][2-i] !== color) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }
    // 判断当前落子的行
    {
        let win = true;
        for (let i = 0; i < 3; i++) {
            if (pattern[x][i] !== color) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }

    // 判断当前落子的列
    {
        let win = true;
        for (let i = 0; i < 3; i++) {
            if (pattern[i][y] !== color) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }
}


