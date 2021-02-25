/**
 * tagName以空白符结束
 * html中有效的4种空白符
 */
const REG_BLANK_CHARACTER = /^[\t\n\f ]$/;
/**
 * 标签名、属性名
 */
const REG_LETTER = /^[a-zA-Z]$/;

const EOF = Symbol('EOF');

let currentToken = null;
let currentAttribute = null;
let stack = [{type: 'document', children: []}];
let currentTextNode = null;

function emit(token) {
    let top = stack[stack.length - 1];

    if (token.type == 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        };

        element.tagName = token.tagName;

        for (let p in token) {
            if (p != 'type' && p != 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }

        currentTextNode = null;
    } else if (token.type == 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error(`Tag start end doesn't match!`);
        } else {
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type == 'text') {
        if (currentTextNode == null) {
            currentTextNode = {
                type: 'text',
                content: ''
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    } 
    
}

function data(c) {
    if (c == '<') {
        return tagOpen;
    } else if (c == EOF) {
        emit({
            type: 'EOF'
        });
        return ;
    } else {
        // 文本节点
        emit({
           type: 'text',
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
    if (c == '/') {
        return endTagOpen;
    } else if (c.match(REG_LETTER)) {
        currentToken = {
            type: 'startTag',
            tagName: '',
        }
        return tagName(c);
    } else {
        return ;
    }

}

/**
 * 结束标签的开始
 * eg: </body>
 * 前一状态：tagOpen
 */
function endTagOpen(c) {
    if(c.match(REG_LETTER)) {
        currentToken = {
            type: 'endTag',
            tagName: '',
        }
        return tagName(c);
    } else if (c == '>') {
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
    if(c.match(REG_BLANK_CHARACTER)) {
        return beforeAttributeName;
    } else if(c == '/') {
        return selfClosingStartTag;
    } else if(c.match(REG_LETTER)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c == '>') {
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
    if(c == '>') {
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
    if(c.match(REG_BLANK_CHARACTER)) {
        return beforeAttributeName;
    } else if (c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c);
    } else if (c == '=') {
        // return beforeAttributeName;
    } else {
        currentAttribute = {
            name: '',
            value: '',
        };
        return attributeName(c);
    }
}

/**
 * desc: 属性名
 * eg: <div title='hello div'> t 开始进入该方法
 */
function attributeName(c) {
    if (c.match(REG_BLANK_CHARACTER) || c == '/' || c == EOF) {
        return afterAttributeName(c);
    } else if (c == '=') {
        return beforeAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == '"' || c == '\'' || c == '<') {
    } else {
        currentAttribute.name += c;
        return attributeName;
    }

}

function beforeAttributeValue (c) {
    if (c.match(REG_BLANK_CHARACTER) || c == '/' || c == '>' || c == EOF) {
        return beforeAttributeValue;
    } else if (c == '"') {
        return doubleQuotedAttributeValue;
    } else if (c == '\'') {
        return singleQuotedAttributeValue;
    } else if (c == '>') {

    } else {
        return unquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if (c == '"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c == '\'') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {

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
    } else if (c == '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == '\u0000') {

    } else if (c == '"' || c == '\'' || c == '<' || c == '=' || c == '`') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return unquotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(REG_BLANK_CHARACTER)) {
        return beforeAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c == '>') {
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
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c == '=') {
        return beforeAttributeValue;
    } else if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: '',
            value: '',
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
    return stack;
}
