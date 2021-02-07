const width = window.innerWidth;
const height = window.innerHeight;
const graphData = {
    nodes: [{
        id: 'window',
        label: 'window',
        x: width/2,
        y: height/2,
    }],
     edges: []
};

function initG6() {
    return new G6.Graph({
        container: 'container',
        width: width - 40,
        height: height - 40,
        fitView: true,
        fitViewPadding: [20, 20, 20, 20],
        fitCenter: true,
    });
}

function getKey(object) {
    return object.name ? object.name : '' + object;
}

function addNodesAndEdges(start, end) {
    try {
        graphData.nodes.push({
            id: end,
            label: end,
        });
        graphData.edges.push({
            source: start,
            target: end,
        })
    } catch (e) {
        console.log('---', e);
    }
}

function initData() {
    const objects = [
        eval,
        isFinite,
        isNaN,
        parseFloat,
        parseInt,
        decodeURI,
        decodeURIComponent,
        encodeURI,
        encodeURIComponent,
        Array,
        Date,
        RegExp,
        Promise,
        Proxy,
        Map,
        WeakMap,
        Set,
        WeakSet,
        Function,
        Boolean,
        String,
        Number,
        Symbol,
        Object,
        Error,
        EvalError,
        RangeError,
        ReferenceError,
        SyntaxError,
        TypeError,
        URIError,
        ArrayBuffer,
        SharedArrayBuffer,
        DataView,
        Float32Array,
        Float64Array,
        Int8Array,
        Int16Array,
        Int32Array,
        Uint8Array,
        Uint16Array,
        Uint32Array,
        Uint8ClampedArray,
        Atomics,
        JSON,
        Math,
        Reflect
    ];

    const set = new Set();

    objects.forEach(o => {
        set.add(o)
        addNodesAndEdges('window', getKey(o))
    });

    for(let i = 0; i < objects.length; i++) {
        let o = objects[i]
        for(let p of Object.getOwnPropertyNames(o)) {
            let d = Object.getOwnPropertyDescriptor(o, p)
            if (d.value !== null && typeof d.value === "function") {
                if (!set.has(d.value)) {
                    set.add(d.value);
                    objects.push(d.value);
                    addNodesAndEdges(getKey(o), `${getKey(o)} - ${getKey(d.value)}`);
                }
            }
        }
    }
}

const graph = initG6();
initData();
graph.data(graphData);
graph.render();
