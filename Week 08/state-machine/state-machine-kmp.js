/**
 * kmp 处理完全未知的pattern
 */

function match(source) {
    let state = start;
    for (let c of source) {
        state = state(c);
    }
    return state === end;
}
console.log(match('abababababx'));

function start(c) {
    if (c === 'a') return foundA;
    return start;
}

function end() {
    return end;
}
