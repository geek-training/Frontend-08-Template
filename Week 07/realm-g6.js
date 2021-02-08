function getRealm() {
    let map = new Map(); // 实例表：存实例的表
    let set = new Set(); // 目的是防止重复
    let objectNames = [
        // 函数属性
        'eval',
        'isFinite',
        'isNaN',
        'parseFloat',
        'parseInt',
        'decodeURI',
        'decodeURIComponent',
        'encodeURI',
        'encodeURIComponent',
        // 基本对象
        'Array',
        'Date',
        'RegExp',
        'Promise',
        'Proxy',
        'Map',
        'WeakMap',
        'Set',
        'WeakSet',
        'Function',
        'Boolean',
        'String',
        'Number',
        'Symbol',
        'Object',
        // 错误对象
        'Error',
        'EvalError',
        'RangeError',
        'ReferenceError',
        'SyntaxError',
        'TypeError',
        'URIError',
        // 可索引的集合对象
        'ArrayBuffer',
        'SharedArrayBuffer',
        'DataView',
        'Float32Array',
        'Float64Array',
        'Int8Array',
        'Int16Array',
        'Int32Array',
        'Uint8Array',
        'Uint16Array',
        'Uint32Array',
        'Uint8ClampedArray',
        'Atomics',
        'JSON',
        'Math',
        'Reflect',
    ];

    objectNames.forEach(name => map.set(name, window[name]));

    let realm = {// 存结构，具体要获取获取实例，是通过查询实例表
        id: 'global',
        children: objectNames.map(name => ({
            id: name,
            children: [], // 等待push
        })),
    };

    let realmChildrenQueue = [...realm.children];

    while (realmChildrenQueue.length) {
        let child = realmChildrenQueue.shift();
        let id = child.id;
        let object = map.get(id);

        if (set.has(object)) continue;
        set.add(object);

        for (const prop of Object.getOwnPropertyNames(object)) {
            let d = Object.getOwnPropertyDescriptor(object, prop);


            const pushChild = (type = 'value') => {
                let childId = type === 'value' ? `${id}.${prop}` : `${id}.${prop}.[${type}]`;

                let o = {
                    id: childId,
                    children: [],
                };
                map.set(childId, d[type]); // 存实例
                child.children.push(o); // push，存结构

                realmChildrenQueue.push(o);
            };

            if (
                (d.value !== null && typeof d.value === 'object') ||
                typeof d.value === 'function'
            ) {
                pushChild()
            }
            if (d.get) pushChild('get')
            if (d.set) pushChild('set')


        }
    }
    return realm
}

function render(data) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        modes: {
            default: [
                {
                    type: 'collapse-expand',
                    onChange: function onChange(item, collapsed) {
                        const data = item.get('model').data
                        data.collapsed = collapsed
                        return true
                    },
                },
                'drag-canvas',
                'zoom-canvas',
            ],
        },
        defaultNode: {
            size: 26,
            anchorPoints: [
                [0, 0.5],
                [1, 0.5],
            ],
            style: {
                fill: '#C6E5FF',
                stroke: '#5B8FF9',
            },
        },
        defaultEdge: {
            type: 'cubic-horizontal',
            style: {
                stroke: '#A3B1BF',
            },
        },
        layout: {
            type: 'mindmap',
            direction: 'H',
        },
    })

    let centerX = 0
    graph.node(function (node) {
        if (node.id === 'Modeling Methods') {
            centerX = node.x
        }

        return {
            label: node.id,
            labelCfg: {
                position:
                    node.children && node.children.length > 0
                        ? 'right'
                        : node.x > centerX
                        ? 'right'
                        : 'left',
                offset: 5,
            },
        }
    })

    graph.data(data)
    graph.render()
    graph.fitView()
}

render(getRealm());
