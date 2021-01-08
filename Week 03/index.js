const regexp = /([0-9\.]+)|([ \t])|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
const Dictionary_Type = {
  Number: 'Number',
  Whitespace: 'Whitespace',
  LineTerminator: 'LineTerminator',
  Multiplication: '*',
  Division: '/',
  Addition: '+',
  Subtraction: '-',
  EOF: 'EOF',
}

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
    type: Dictionary_Type.EOF
  }
}

function combineSource(exp) {
  let source = [];
  for (let token of tokenize(exp)) {
    if (token.type !== Dictionary_Type.Whitespace && token.type !== Dictionary_Type.LineTerminator) {
      source.push(token);
    }
  }
  return source;
}

function Expression(tokens) {

}

function AdditionExpression(source) {
  const type0 = source[0] && source[0].type;
  if (type0 === 'MultiplicationExpression') {
    let node = {
      type: 'AdditionExpression',
      children: [source[0]]
    }
    source[0] = node;
    return AdditionExpression(source);
  }
  const type1 = source[1] && source[1].type;
  if (
      type0 === 'AdditionExpression' &&
      (type1 === Dictionary_Type.Addition || type1 === Dictionary_Type.Subtraction)
  ) {
    let node = {
      type: 'AdditionExpression',
      operator: Dictionary_Type.Addition,
      children: []
    }
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiplicationExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditionExpression(source);
  }
  if (type0 === 'AdditionExpression') {
    return source[0];
  }
  MultiplicationExpression(source);
  return AdditionExpression(source);
}

function MultiplicationExpression(source) {
  const type0 = source[0] && source[0].type;
  if (type0 === Dictionary_Type.Number) {
    let node = {
      type: 'MultiplicationExpression',
      children: [source[0]]
    }
    source[0] = node;
    return MultiplicationExpression(source);
  }
  const type1 = source[1] && source[1].type;
  if (
      type0 === 'MultiplicationExpression' &&
      (type1 === Dictionary_Type.Multiplication || type1 === Dictionary_Type.Division)
  ) {
    let node = {
      type: 'MultiplicationExpression',
      operator: type1,
      children: [],
    }
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplicationExpression(source);
  }
  if (type0 === 'MultiplicationExpression') {
    return source[0];
  }
  return MultiplicationExpression(source);
}

const multiplicationSource = combineSource('10 * 25 / 2');
MultiplicationExpression(multiplicationSource);
console.log("multiplicationSource result: ", multiplicationSource);

const additionSource = combineSource('2 + 3 + 15');
AdditionExpression(additionSource);
console.log("additionSource result: ", additionSource);
