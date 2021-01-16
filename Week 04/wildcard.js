function find (source, pattern) {
  // 计算 * 的个数
  let startCount = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '*') {
      startCount++;
    }
  }

  // 没有 * 的情况
  if (startCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      // 匹配失败
      if (pattern[i] !== source[i] && pattern[i] !== '?') {
        return false;
      }
    }
    return;
  }

  // 有 * 的情况
  // 匹配第一个 * 之前的串
  let i = 0;
  let lastIndex = 0; // source位置
  for (; pattern[i] !== '*'; i++) {
    if (pattern[i] !== source[i] && pattern[i] !== '?') {
      return false;
    }
  }
  lastIndex = i;

  // 第一个 * 与最后一个 * 中间的部分
  for (let p = 0; p < startCount - 1; p++) {
    i++;
    let subPattern = '';
    while (pattern[i] !== '*') {
      subPattern += pattern[i];
      i++;
    }

    // 把 ？替换成正则表达式
    let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
    // 设置开始匹配的位置
    reg.lastIndex = lastIndex;
    
    let array = reg.exec(source);
    // 没匹配到
    if (!array) {
      return false;
    }
    console.log(`中间部分。Found ${array[0]}. Next starts at ${reg.lastIndex}.`);

    lastIndex = reg.lastIndex;
  }

  // 处理最后一个 * 号之后的部分
  for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== '*'; j++) {
    // 从source和pattrn的最后一个字符逐次向前对比
    if (pattern[pattern.length - j] != source[source.length - j] && pattern[pattern.length - j] !== '?') {
      return false;
    }
  }
  return true;
}
