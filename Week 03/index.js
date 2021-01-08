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
const Expression_Type = {
  AddExpr: 'AdditionExpression',
  MultiExpr: 'MultiplicationExpression',
  Expr: 'Expression',
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

function expression(source) {
  const type0 = source[0] && source[0].type;
  const type1 = source[1] && source[1].type;
  if (type0 === Expression_Type.AddExpr && type1 === Dictionary_Type.EOF) {
    let node = {
      type: Expression_Type.Expr,
      children: [source.shift(), source.shift()]
    }
    source.unshift(node);
    return node;
  }
  additionExpression(source);
  return expression(source);
}

function additionExpression(source) {
  const type0 = source[0] && source[0].type;
  if (type0 === Expression_Type.MultiExpr) {
    let node = {
      type: Expression_Type.AddExpr,
      children: [source[0]]
    }
    source[0] = node;
    return additionExpression(source);
  }
  const type1 = source[1] && source[1].type;
  if (
      type0 === Expression_Type.AddExpr &&
      (type1 === Dictionary_Type.Addition || type1 === Dictionary_Type.Subtraction)
  ) {
    let node = {
      type: Expression_Type.AddExpr,
      operator: Dictionary_Type.Addition,
      children: []
    }
    node.children.push(source.shift());
    node.children.push(source.shift());
    multiplicationExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return additionExpression(source);
  }
  if (type0 === Expression_Type.AddExpr) {
    return source[0];
  }
  multiplicationExpression(source);
  return additionExpression(source);
}

function multiplicationExpression(source) {
  const type0 = source[0] && source[0].type;
  if (type0 === Dictionary_Type.Number) {
    let node = {
      type: Expression_Type.MultiExpr,
      children: [source[0]]
    }
    source[0] = node;
    return multiplicationExpression(source);
  }
  const type1 = source[1] && source[1].type;
  if (
      type0 === Expression_Type.MultiExpr &&
      (type1 === Dictionary_Type.Multiplication || type1 === Dictionary_Type.Division)
  ) {
    let node = {
      type: Expression_Type.MultiExpr,
      operator: type1,
      children: [],
    }
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return multiplicationExpression(source);
  }
  if (type0 === Expression_Type.MultiExpr) {
    return source[0];
  }
  return multiplicationExpression(source);
}

const multiplicationSource = combineSource('10 * 25 / 2');
multiplicationExpression(multiplicationSource);
console.log("multiplicationSource result: ", multiplicationSource);

const additionSource = combineSource('2 + 3 + 15');
additionExpression(additionSource);
console.log("additionSource result: ", additionSource);

const source = combineSource('2 * 6 + 7 - 3');
expression(source);
console.log("source result: ", source);
