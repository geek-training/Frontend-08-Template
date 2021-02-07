const width = window.innerWidth;
const height = window.innerHeight;
const temp = {}

function initG6Tree() {
    return new G6.TreeGraph({
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
        set.add(o);
        temp[getKey(o)] = {};
    });

    for(let i = 0; i < objects.length; i++) {
        let o = objects[i]
        for(let p of Object.getOwnPropertyNames(o)) {
            let d = Object.getOwnPropertyDescriptor(o, p)
            if (d.value !== null && typeof d.value === "function") {
                if (!set.has(d.value)) {
                    set.add(d.value);
                    objects.push(d.value);
                    if (temp[getKey(o)]) {
                        temp[getKey(o)][getKey(d.value)] = {};
                    }
                }
            }
            // if (d.value !== null && typeof d.value === "object") {
            // }
                // if( d.get ) {
            //     if (!set.has(d.get)) {
            //         set.add(d.get);
            //         objects.push(d.get);
            //         addNodesAndEdges(getKey(o), getKey(d.get));
            //     }
            // }
            // if( d.set ) {
            //     if (!set.has(d.set)) {
            //         set.add(d.set);
            //         objects.push(d.set);
            //         addNodesAndEdges(getKey(o), getKey(d.set));
            //     }
            // }
        }
    }
}



function formatData(temp) {
    for (let key of Object.keys(temp)) {
        const currentObj = temp[key];
        if (Object.keys(currentObj).length === 0) {
            return {
                id: key,
                children: []
            };
        }
        return {
            id: key,
            children: formatData(temp[key]),
        }
    }
}

const graph = initG6Tree();
initData();
const result =  formatData(temp);
console.log(temp);
console.log(result);
// graph.data(graphData);
// graph.render();
