const EOF = Symbol('EOF');

let currentToken = null;
function emit(token) {
    console.log(token);
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
 * 标签开始
 * @param c
 * @returns {endTagOpen|*}
 */
function tagOpen(c) {
    if (c == '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
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
 * @param c
 */
function endTagOpen(c) {
    if(c.match(/^[a-zA-Z]$/)) {
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

function tagName(c) {
    /**
     * tagName以空白符结束
     * html中有效的4种空白符
     */
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == '/') {
        return selfClosingStartTag;
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c == '>') {
        emit(currentToken);
        /**
         * 结束标签回到data状态解析下一个标签
         */
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '>') {
        return data;
    } else if (c == '=') {
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}

function selfClosingStartTag(c) {
    if(c == '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {

    }
}

module.exports.parseHTML = function parseHTML(html) {
    console.log(html);
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
}
