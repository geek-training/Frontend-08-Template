/**
 * 查找字符串中是否存在 abcabx
 */

function match(source) {
    let state = start;
    for (let c of source) {
        state = state(c);
    }
    return state === end;
}
console.log(match('abcabcabx'));

function start(c) {
    if (c === 'a') return foundA;
    return start;
}

function end() {
    return end;
}

function foundA(c) {
    if (c === 'b') return foundB;
    return start;
}

function foundB(c) {
    if (c === 'c') return foundC;
    return start(c);
}

function foundC(c) {
    if (c === 'a') return foundA2;
    return start(c);
}

function foundA2(c) {
    if (c === 'b') return foundB2;
    return start(c);
}

function foundB2(c) {
    if (c === 'x') return end;
    return foundB(c);
}
