
function getStyle(element) {
    if (!element.style) {
        element.style = {}
    }

    for (let prop in element.computedStyle) {
        const p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;
        
        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }

        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    
    }

    return element.style;
 }

function layout(element) {

    if (!element.computedStyle) {
        return ;
    }

    const elementStyle = getStyle(element);
    if (element.display !== 'flex') {
        return ;
    }

    const items = element.children.filter(e => e.type === 'element');

    items.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
    })

    const style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    })


    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.alignContent = 'row';
    }
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        const tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    let isAutoMainSize = false;
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            if (itemStyle[mainSize] !== null || itemStyle[mainSize]) {
                elementStyle[mainSize] = elementStyle[mainSize]
            }
        }
        isAutoMainSize = true;
    }

    let flexLine = [];
    let flexLines = [flexLine];

    // 剩余空间
    let mainSpace = elementStyle[mainSize];
    let crossSpace = 0;
    for(let i = 0; i < items.length; i++) {
        const item = items[i];
        let itemStyle = getStyle(item);

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                // 行最高：交叉轴尺寸
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            } 
            flexLine.push(item);
        } else {
            // 当前元素长度大于主轴
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }

            // 剩下空间不足以容纳当前元素
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                // 创建新行
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }

            if (itemStyle[crossSpace] !== null && itemStyle[crossSize] !== (void 0)) {
                // 行最高：交叉轴尺寸
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }

            mainSpace -= itemStyle[mainSize];
        }
        flexLine.mainSpace = mainSpace;

        console.log(items);
    }

}

module.exprots = layout;