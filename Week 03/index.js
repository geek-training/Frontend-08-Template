const regexp = /([0-9\.]+)|([ \t])|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
const dictionary = ["Number", "Whitespace", "LineTerminator", "*", "/", "+", "-"];

function* tokenize(source) {
  let result = null;
  let lastIndex = 0;
  while(true) {
    result = regexp.exec(source);
    lastIndex = regexp.lastIndex;

    if (!result) break;

    if (regexp.lastIndex - lastIndex > result[0].length)
      break;

    let token = {
      type: null,
      value: null
    }

    token.value = result[0];

    for (let i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        token.type = dictionary[i-1];
      }
    }
    yield token;
  }
  yield {
    type: "EOF"
  }
}

const SOURCE = "1024 + 10 * 25";
for (let token of tokenize(SOURCE)) {
  console.log(token);
}
