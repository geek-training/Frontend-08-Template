function calculateTable(pattern, table) {
  let i = 1, j = 0;
  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) {
      ++j;
      ++i;
      table[i] = j;
    } else {
      if (j > 0) {
        j = table[j];
      } else {
        ++i;
      }
    }
  }
}

function match(source, pattern, table) {
  let i = 0, j = 0;
  while (i < source.length) {
    if (j === pattern.length) {
      return true;
    }
    if (pattern[j] === source[i]) {
      ++i, ++j;
    } else {
      if (j > 0) {
        j = table[i];
      } else {
        ++i;
      }
    }
    return false;
  }
}
function kmp(source, pattern) {
  console.log('----------------------')
  console.log(source, pattern)
  let table = new Array(pattern.length).fill(0);
  calculateTable(pattern, table);
  console.log('',table);
  const result = match(source, pattern, table);
  console.log(result);
  console.log('----------------------')
}


kmp('', 'abcdabce');
console.log(kmp('Hello', 'll'));
console.log(kmp('abcdabcd', 'abcdabce'));
console.log(kmp('aabaabc', 'aabaabaace'));
