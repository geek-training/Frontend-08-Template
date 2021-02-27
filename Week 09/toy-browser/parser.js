const css = require("css");

/**
 * tagName以空白符结束
 * html中有效的4种空白符
 */
const REG_BLANK_CHARACTER = /^[\t\n\f ]$/;
/**
 * 标签名、属性名
 */
const REG_LETTER = /^[a-zA-Z]$/;

const EOF = Symbol("EOF");

let currentToken = null;
let currentAttribute = null;
let stack = [{ type: "document", children: [] }];
let currentTextNode = null;

let rules = [];
function addCssRules(text) {
  let ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

/**
 * 只考虑简单选择器
 * div
 * .name
 * #title
 * 选做：支持 class='img myImg'
 */
function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }

  const startChar = selector.charAt(0);
  if (startChar == "#") {
    const attr = element.attributes.filter((attr) => attr.name === "id");
    if (attr.length !== 0 && attr[0].value === selector.replace("#", "")) {
      return true;
    }
  } else if (startChar == ".") {
    const classAttr = element.attributes.filter(
      (attr) => attr.name === "class"
    );
    if (!classAttr || classAttr.length === 0) {
      return false;
    }

    const classArray = classAttr[0].value.split(" ");
    for (let i = 0; i < classArray.length; i++) {
      if (classArray[i] === selector.replace(".", "")) {
        return true;
      }
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function computeCSS(element) {
  let parentElements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    /**
     * body div #myId
     * ['#myId', 'div', 'body']
     * 如果第一个 #myId 没匹配上就跳过本次循环
     */
    let selectorParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectorParts[0])) {
      continue;
    }

    /**
     * #myId 已经匹配上来，接下来从 selectorParts[1] 开始去逐层匹配当前元素的父元素
     */
    let j = 1;
    for (let i = 0; i < parentElements.length; i++) {
      if (match(parentElements[i], selectorParts[j])) {
        j++;
      }
    }
    /** 【‘#myId', 'div', 'body'】每项都匹配到了，则为true */
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      /** 如果匹配到，我们要加入 */
      const sp = specificity(rule.selectors[0]);
      const computedStyle = element.computedStyle;
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) < 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
      console.log("+++ Matched +++", element.computedStyle);
    }
  }
}

function emit(token) {
  let top = stack[stack.length - 1];

  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };

    element.tagName = token.tagName;

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }

    computeCSS(element);

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error(`Tag start end doesn't match!`);
    } else {
      if (top.tagName === "style") {
        /** 遇到style标签时，执行添加 css 规则的操作  */
        addCssRules(top.children[0].content);
      }
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function specificity(selector) {
  let p = [0, 0, 0, 0];
  const selectorParts = selector.split(" ");
  for (const part of selectorParts) {
    const startChar = part.charAt(0);
    if (startChar == "#") {
      p[1] += 1;
    } else if (startChar == ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

function data(c) {
  if (c == "<") {
    return tagOpen;
  } else if (c == EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    // 文本节点
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

/**
 * 标签开始 eg: <div>
 * 前一状态：data
 */
function tagOpen(c) {
  if (c == "/") {
    return endTagOpen;
  } else if (c.match(REG_LETTER)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    return;
  }
}

/**
 * 结束标签的开始
 * eg: </body>
 * 前一状态：tagOpen
 */
function endTagOpen(c) {
  if (c.match(REG_LETTER)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c == ">") {
    // 报错
  } else if (c == EOF) {
    // 报错
  } else {
  }
}

/**
 * desc: < 和 </ 之后进入该方法
 * eg1: <div title='hello div'>
 * eg2: </div>
 * 前一状态：tagOpen，endTagOpen
 */
function tagName(c) {
  if (c.match(REG_BLANK_CHARACTER)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c.match(REG_LETTER)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c == ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

/**
 * desc: 自关闭标签
 * eg: <br />
 * 前一状态：tagName, unquotedAttributeValue, afterQuotedAttributeValue, afterAttributeName
 */
function selfClosingStartTag(c) {
  if (c == ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
  }
}

/**
 * desc: 属性名的前一个状态
 * tag 后跟了空格进入该方法，eg: <div title='hello div'> t 开始进入该方法
 * 前一状态 tagName, unquotedAttributeValue, afterQuotedAttributeValue
 */
function beforeAttributeName(c) {
  if (c.match(REG_BLANK_CHARACTER)) {
    return beforeAttributeName;
  } else if (c == "/" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    // return beforeAttributeName;
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

/**
 * desc: 属性名
 * eg: <div title='hello div'> t 开始进入该方法
 */
function attributeName(c) {
  if (c.match(REG_BLANK_CHARACTER) || c == "/" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(REG_BLANK_CHARACTER) || c == "/" || c == ">" || c == EOF) {
    return beforeAttributeValue;
  } else if (c == '"') {
    return doubleQuotedAttributeValue;
  } else if (c == "'") {
    return singleQuotedAttributeValue;
  } else if (c == ">") {
  } else {
    return unquotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c == '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c == "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function unquotedAttributeValue(c) {
  if (c.match(REG_BLANK_CHARACTER)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<" || c == "=" || c == "`") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return unquotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(REG_BLANK_CHARACTER)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

/**
 * attributeName 后面跟了空格，进入该方法
 */
function afterAttributeName(c) {
  if (c.match(REG_BLANK_CHARACTER)) {
    return afterAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

module.exports.parseHTML = function parseHTML(html) {
  console.log(html);
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  console.log("parser stack:", stack);
  debugger
  return stack;
};
