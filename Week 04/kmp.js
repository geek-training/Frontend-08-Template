function calculateTable(pattern) {
  let table = new Array(pattern.length).fill(0);
  let biggerIndex = 1, index = 0;
  while (biggerIndex < pattern.length) {
    // 匹配上了，有自重复
    if (pattern[biggerIndex] === pattern[index]) {
      ++index, ++biggerIndex;
      table[biggerIndex] = index;
    } else {
      // 没匹配上且index大于0，从头开始匹配
      if (index > 0) {
        index = table[index];
      } else {
        ++biggerIndex;
      }
    }
  }
  return table;
}

function matchPattern(source, pattern, table) {
  let sIndex = 0, pIndex = 0;
  while (sIndex < source.length) {
    // pattern最后一个单词已匹配
    if (pIndex === pattern.length) {
      return true;
    }
    // 匹配上了
    if (pattern[pIndex] === source[sIndex]) {
      ++sIndex, ++pIndex;
    } else {
      if (pIndex > 0) {
        pIndex = table[pIndex];
      } else {
        ++sIndex;
      }
    }
  }
  return false;
}
function kmp(source, pattern) {
  const table = calculateTable(pattern);
  const result = matchPattern(source, pattern, table);
  return {table, result};
}

function consoleTest() {
  const testArray = [
    {
      source: 'ababcdabced',
      pattern: 'abcdabce',
    }, {
      source: 'abaaababababcc',
      pattern: 'abababc',
    }, {
      source: 'abaaababababcc',
      pattern: 'aabaaac',
    }
  ];

  testArray.forEach(item => {
    const {table, result} = kmp(item.source, item.pattern);
    console.log('pattern-table-', item.pattern, table);
    console.log('source-result-', item.source, result);
  });
}

function startMatch() {
  const pattern = document.getElementById('pattern').value;
  const source = document.getElementById('source').value;
  const {table, result} = kmp(source, pattern);
  document.getElementById('result').innerText = `table:${table}。 result:${result}`;
}
