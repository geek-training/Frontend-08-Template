function stringToNumber(str) {
    if (typeof str !== 'string') {
        return '非字符串'
    }

    if(str.length === 0) return 0;

    if (str.length >= 16 && (BigInt(str) > BigInt(Number.MAX_SAFE_INTEGER) || BigInt(str) < BigInt(Number.MIN_SAFE_INTEGER))) {
        return `${str}超出限制`
    }

    if (str.startsWith('0x') || str.startsWith('0X')) {
        return parseInt(str.substring(2), 16);
    }
    if (str.startsWith('0o')) {
        return parseInt(str.substring(2), 8);
    }
    if (str.startsWith('0b')) {
        return parseInt(str.substring(2), 2);
    }
    return parseFloat(str);
}

function numberToString(number) {
    if (Number.isInteger(number) && !Number.isSafeInteger(number)) {
        return `${number}超出限制`
    }
    return number.toString();
}

function numberToString2(number ) {
    if (Number.isInteger(number) && !Number.isSafeInteger(number)) {
        return `${number}超出限制`
    }
    return '' + number;
}

function testStringToNumber() {
    console.log('-------------- Start stringToNumber ------------------')
    const testArray = [
        '123', '12ab', 'ab12',
        '', '0', '+0', '-0',
        '123.2', '2.', '.1', '12.2b', '12.ab',
        '0x400', '0o200', '0b0011',
        '2.048e3', '2.048e-3',
        '9007199254740993',
        '-9007199254740993'
    ];
    for (let i = 0; i < testArray.length; i++) {
        console.log(`${testArray[i]} ----> `, stringToNumber(testArray[i]));
    }
    console.log('-------------- End stringToNumber ------------------')
}

function testNumberToString() {
    console.log('-------------- Start numberToString ------------------')
    const testArray = [
        123, 123.2, 2., .12,
        0, +0, -0,
        0x400, 0o200, 0b0011,
        2.048e3, 2.048e-3,
        9007199254740993,
        -9007199254740993,
    ];

    for (let i = 0; i < testArray.length; i++) {
        console.log(`方案1---${testArray[i]} ----> `, numberToString(testArray[i]));
        console.log(`方案2---${testArray[i]} ----> `, numberToString2(testArray[i]));
    }
    console.log('-------------- End numberToString ------------------')
}


testStringToNumber();
testNumberToString();
