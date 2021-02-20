/**
 * 状态机处理完全未知的pattern
 */
function createKMPMatcher(pattern) {
  let end = () => end;
  let start = (ch) => {
      console.log('Current char:', ch, 'Current Index: 0');
      return ch == pattern[0] ? states[1] : states[0]
  }

  let states = [start];
  for (let i = 1; i < pattern.length; ++i) {
        let state = (ch) => {
            console.log('Current char:', ch, 'Current Index:', i);
            return ch == pattern[i] ? states[i+1] : states[0](ch)
        }
        states.push(state);
  }
  states.push(end);

  let table = Array(pattern.length).fill(0);
  let biggerIndex = 1;
  let index = 0;
  while (biggerIndex < pattern.length) {
    // 匹配上了，有自重复
    if (pattern[biggerIndex] == pattern[index]) {
      const currentBiggerIndex = ++biggerIndex;
      const currentIndex = ++index;
      if (table[biggerIndex] != index) {
        // 更新table
        table[biggerIndex] = index;
        // 更新states
        let currentState = (ch) => {
          console.log('- Current char:', ch, 'Current Index', currentBiggerIndex);
          return ch == pattern[currentBiggerIndex] ? states[currentBiggerIndex + 1] : states[currentIndex](ch);
        }
        states[biggerIndex] = currentState;
      }
    } else {
      // 没匹配上且 index > 0，从头开始匹配
      if (index > 0) {
        index = table[index];
      } else {
        ++biggerIndex;
      }
    }
  }
  table = null;
  return [start, end];
}

function match(source, init, end) {
  let state = init;
  for (const ch of source) {
    state = state(ch);
  }
  return state === end;
}

function KMP(pattern, source) {
  let [start, end] = createKMPMatcher(pattern);
  return match(source, start, end);
}

// expect table [0, 0, 0, 1, 2, 3, 4]
console.log(KMP("abababx", "abababxxx"));
