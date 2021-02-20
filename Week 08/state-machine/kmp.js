/**
 * 状态机处理完全未知的pattern
 */
function createKMPMatcher(pattern) {
    let states = initState(pattern);

    let table = Array(pattern.length).fill(0);
    let biggerIndex = 1, index = 0
    while (biggerIndex < pattern.length) {
        // 匹配上了，有自重复
        if (pattern[biggerIndex] == pattern[index]) { 

            ++biggerIndex, ++index;

            table[biggerIndex] = index
            states[biggerIndex] = function (ch) {
                console.log('Char      ：', ch)
                console.log('State     ：', biggerIndex, 'Expect：', pattern[biggerIndex])
                console.log('Next State：', biggerIndex + 1, ' or ', index)
                return ch == pattern[biggerIndex] ? states[biggerIndex + 1] : states[index](ch)
            }
        } else {
            // 没匹配上且 index > 0，从头开始匹配
            if (index > 0) {
                index = table[index]
            } else {
                ++biggerIndex
            }
        }
    }
    console.log('table:', table);
    console.log('states:', states);

    return states;
}

function initState(pattern) {
    let end = () => end
    let states = [
        ch => {
            console.log('Char      ：', ch)
            console.log('State     ：', 0, 'Expect：', pattern[0])
            console.log('Next State：', 1, ' or ', 0)
            return ch == pattern[0] ? states[1] : states[0]
        }
    ]

    for (let i = 1; i < pattern.length; ++i) {
        states.push(
            ch => {
                console.log('Char      ：', ch)
                console.log('State     ：', i, 'Expect：', pattern[i])
                console.log('Next State：', i + 1, ' or ', 0)
                return ch == pattern[i] ? states[i + 1] : states[0](ch)
            }
        )
    }

    states.push(end)
    return states;
}

function match(source, states, end) {
    let state = init
    for (const ch of source) {
        state = state(ch)
    }
    return state === end
}

function KMP(pattern, source) {
    let matcher = createKMPMatcher(pattern)

    return match(source, matcher, matcher[matcher.length - 1])
}

// expect table [0, 0, 0, 1, 2, 3, 4]
console.log(KMP('abababx', 'xxxabababxxx'));
