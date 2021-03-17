/**
 * 匹配选择器
 */
function matchSelectors(selector, element) {
    // 先匹配当前元素是否匹配
    let tagSelector = selector.match(/^[\w]+/gm);
    let idSelectors = selector.match(/(?<=#)([\w\d\-\_]+)/gm);
    let classSelectors = selector.match(/(?<=\.)([\w\d\-\_]+)/gm);

    /**
     * 实现复合选择器，实现支持空格的 Class 选择器
     * --------------------------------
     */
    // 检查 tag name 是否匹配
    if (tagSelector !== null) {
        if (element.tagName.toLowerCase() !== tagSelector[0]) return false;
    }
    // 检测 id 是否匹配
    if (idSelectors !== null) {
        let attr = element.attributes['id'].value;
        if (attr) {
            for (let selector of idSelectors) {
                if (attr.split(' ').indexOf(selector) === -1) return false;
            }
        }
    }
    // 检测 class 是否匹配
    if (classSelectors !== null) {
        let attr = element.attributes['class'].value;
        if (attr) {
            for (let selector of classSelectors) {
                if (attr.split(' ').indexOf(selector) === -1) return false;
            }
        }
    }

    return true;
}

/**
 * 匹配元素
 */
function match(selector, element) {
    if (!selector || !element.attributes) return false;

    let selectors = selector.split(' ').reverse();

    if (!matchSelectors(selectors[0], element)) return false;

    let curElement = element;
    let matched = 1;

    // 递归寻找父级元素匹配
    while (curElement.parentElement !== null && matched < selectors.length) {
        curElement = curElement.parentElement;
        if (matchSelectors(selectors[matched], curElement)) matched++;
    }

    // 所有选择器匹配上为 匹配成功，否则是失败
    if (matched !== selectors.length) return false;

    return true;
}

console.log(match('div #second.item', document.getElementById('second')));
console.log(match('div #second.item', document.getElementById('third')));
