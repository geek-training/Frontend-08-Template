/**
 * 查找字符串中是否存在 abcdef
 */

function match(source) {
    let state = start;
    for (let c of source) {
        state = state(c);
    }
    return state === end;
}
console.log(match('hello, abcdef'));
console.log(match('hello world'));

function start(c) {
    if (c === 'a') return foundA;
    return start;
}

function end(c) {
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
    if (c === 'd') return foundD;
    return start(c);
}

function foundD(c) {
    if (c === 'e') return foundE;
    return start(c);
}

function foundE(c) {
    if (c === 'f') return foundB;
    return start(c);
}
