
/**
 * 对style进行预处理
 */
function getStyle(element) {
    if (!element.style) {
        element.style = {}
    }

    /**
     * 把 computedStyle 转换格式，存入 style 属性。
     * 因为 toy-browser 里 style 属性并没有被占用，所以这里可以用 style，但最好换个属性名
     */
    for(let prop in element.computedStyle) {
        const p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        /**
         * 带 px 的值只保留数字部分
         */
        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
        /**
         * string 数字转为 number
         */
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style;
}

function layout(element) {
    /**
     *     没有 computedStyle 的元素就跳过去
     */
    if (!element.computedStyle) {
        return ;
    }
    let elementStyle = getStyle(element);

    /**
     * 非 flex 布局，不做处理
     */
    if (elementStyle.display !== 'flex') {
        return ;
    }

    /**
     * 过滤出文本节点
     */
    let items = element.children.filter(e => e.type === 'element');

    /**
     * 支持 order 属性
     */
    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    /**
     * 取出 style
     */

    let style = elementStyle;

    /**
     * 没有规定的 width 和 height 都先定义为 null, 方便代码统一判断
     */
    ['width', 'height'].forEach((size) => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    })

    /**
     * 设置 flex布局 必要属性的默认值
     * flexDirection: row
     * alignItems: stretch
     * justifyContent: flex-start
     * flexWrap: nowrap
     * alignContent: stretch
     */


    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
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

    /**
     * 为计算方便，用一组变量代替属性值
     */
    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;

    /**
     * 根据 flexDirection 属性的值: row, row-reverse, column, column-reverse
     * 初始化 mainSize,mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd
     * mainSize: 主轴尺寸
     * mainStart: 主轴开始边缘
     * mainEnd: 主轴结束边缘
     * mainSign: 从左开始加，从右开始减
     * mainBase: 从最左边还是最右边
     * crossSize: 交叉轴尺寸
     * crossStart: 交叉轴开始边缘
     * crossEnd: 交叉轴结束边缘
     * crossSign:
     * crossBase:
     */
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

    /**
     * 反向换行，交叉轴的开始和结束互换
     */
    if (style.flexWrap === 'wrap-reverse') {
        const tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    /**
     * 如果父元素没有设置主轴尺寸，如width，父未设该属性，则由子元素把父元素撑开，尺寸无论如何也不会超
     */
    let isAutoMainSize = false;
    if (!style[mainSize]) {
        // auto sizing
        elementStyle[mainSize] = 0;
        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            let itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
        // style.flexWrap = 'noWrap';
    }

    /**
     * 第二步：把元素收进行
     * flexLine 是 flex 的一行
     */
    let flexLine = [];
    /**
     * 所有的行保存进一个数组
     * 至少要有一行
     */
    let flexLines = [flexLine];

    /**
     * 初始状态：mainSpace = 父元素的主轴尺寸 mainSize; crossSpace = 0
     * mainSpace: 主轴剩余空间
     * crossSpace: 交叉轴剩余空间
     */
    let mainSpace = elementStyle[mainSize];
    let crossSpace = 0;

    /**
     * 插入元素进 flexLines
     */
    for(let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);

        /**
         * 没设主轴尺寸，默认值为 0
         */
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            /**
             * 如果有 flex 属性，说明这个元素是可伸缩的
             * 一定可以加入到 flexLine 里面
             */
            flexLine.push(item);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                /**
                 * 一行有多高，即交叉轴尺寸最大高度：行最高
                 */
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {
            /**
             * 换行的逻辑
             * 如果元素主轴尺寸大过父元素主轴尺寸，就把它压缩的和主轴尺寸一样大
             */
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            /**
             * 剩下空间不足以容纳当前元素，换行
             */
            if (mainSpace < itemStyle[mainSize]) {
                /**
                 * 把实际主轴剩余尺寸和交叉剩余尺寸的信息存到当前行上
                 */
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                /**
                 * 创建新的行,把当前元素放进去
                 */
                flexLine = [item];
                /**
                 * 把新行插入行集
                 */
                flexLines.push(flexLine);
                /**
                 * 重置 mainSpace 和 crossSpace
                 */
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                /**
                 * 如果能放下，把当前元素加到当前行里
                 */
                flexLine.push(item);
            }

            /**
             * 计算主轴和交叉轴的尺寸
             */
            if (itemStyle[crossSpace] !== null && itemStyle[crossSize] !== (void 0)) {
                /**
                 * 行最高：交叉轴尺寸
                 */
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            /**
             * 从剩余空间中剪掉当前元素的大小
             */
            mainSpace -= itemStyle[mainSize];
        }
    }

    /**
     * 最后一行的情况:没有元素了
     */
    flexLine.mainSpace = mainSpace;


    /**
     * 第三步：计算主轴
     * 怎么分配 mainSpace
     */
    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }
    /**
     * 剩余空间小于 0，对所有元素进行等比压缩
     */

    if (mainSpace < 0) {
        /**
         * 只发生在单行的情况
         * overflow (happens only if container is single line), scale every item
         * style[mainSize] 容器的主轴尺寸, (style[mainSize] - mainSpace) 为期望的尺寸
         * mainSpace < 0, 所以 scale 一定小于 1
         */
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;

        for (let i = 0; i < items.length; i += 1) {
            let item = items[i];
            let itemStyle = getStyle(item);

            /**
             * flex 元素没有权利参加等比压缩，尺寸为 0
             */
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            /**
             * 元素主轴尺寸被压缩
             */
            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            /**
             * 根据当前主轴的位置 currentMain，算出元素被压缩后的位置
             * currentMain 所排到的当前位置
             */
            itemStyle[mainStart] = currentMain;
            /**
             * 完成主轴计算，如果主轴是 row， left，right，width 被计算出来了
             */
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            /**
             * 下一个元素的 currentMain 是当前元素的 mainEnd
             */
            currentMain = itemStyle[mainEnd];

        }
    } else {
        /**
         * mainSpace 大于0 的情况
         */
        flexLines.forEach(function (items) {

            let mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);

                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    /**
                     * 如果有 flex 属性，就给它加到 flex 的总值上去
                     */
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }


            if (flexTotal > 0) {
                /**
                 * 有 flex 元素，元素可以占满整个行，就不需要 justifyContent 来分配元素间的空隙
                 * There is flexible flex items
                 */

                let currentMain = mainBase;
                for (let i = 0; i < items.length; i += 1) {
                    let item = items[i];
                    let itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        // 把主轴方向剩余空间 mainSpace 按 flex 值的比例分配给元素
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                /**
                 * 没有 flex 的情况
                 * There is no flexible flex items, which means, justifyContent should work
                 */

                let currentMain;
                let step;

                /**
                 * 根据 justifyContent 来初始化 currentMain 和 step
                 * currentMain: 上一个元素结束位置，即当前元素的开始位置
                 * step: 元素间的间隔
                 * 以row为例
                 * flex-start: 从左往右
                 * flex-end: 从右往左
                 * center: 局中
                 * space-between: 前后无间隔，元素间空格
                 * space-around: 前后右空格，元素间有空格
                 */

                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign;
                    currentMain = mainBase;
                }
                if (style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                /**
                 * 计算元素位置，如果是 row，就是左和右，宽是 mainSize
                 */
                for (let i = 0; i < items.length; i += 1) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        })
    }
    /**
     * 第四步：计算交叉轴
     * align-items, alignself
     */

    // let crossSpace;

    /**
     * 如果没有定义容器的高，空隙为0，元素的高为 元素高 + 行空隙
     */
    if (!style[crossSize]) { // auto sizing
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
        }
    } else {
        /**
         * 如果定义了行高，用总的高度依次减去行的空隙，得到剩余的行高
         */
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    /**
     * 判断是否从尾向头排布
     */
    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;
    let step;
    /**
     * 根据 alignContent 来矫正 crossBase 和 step
     * flex-start: 与交叉轴的起点对齐
     * flex-end: 与交叉轴的终点对齐
     * center: 与交叉轴的中点对齐
     * space-between: 与交叉轴两端对齐，轴线之间的间隔平均分布
     * space-around: 每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍
     * stretch: 伸展，轴线占满整个交叉轴
     */
    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }
    if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(function (items) {
        let lineCrossSize =
            style.alignContent === 'stretch' ? items.crossSpace + crossSpace / flexLines.length : items.crossSpace;
        /**
         * 交叉轴的位置和尺寸需要计算每个元素的尺寸
         */
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            /**
             * alignSelf优先于父元素的alignItems
             * @type {string|string}
             */
            let align = itemStyle.alignSelf || style.alignItems;

            /**
             * 未指定交叉轴尺寸
             */
            if (item === null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
            }

            /**
             * 根据 align 计算 crossStart 和 crossEnd
             * flex-start: 对齐行顶
             * flex-end: 对齐行底
             * center: 对齐行中线
             * stretch: 如果项目未设置高度或设为auto，将占满整个容器的高度
             */

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }
            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2 ;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
                    itemStyle[crossSize] : lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });
}

module.exports = layout;
