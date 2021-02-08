function getKey(object) {
    return object.name ? object.name : '' + object;
}

function initData(temp = {}) {
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
    return {id: 'window', label: 'window', children: formatData(temp)};
}



function formatData(obj) {
    const result = {};
    if (typeof obj === 'object') {
        if (Object.keys(obj).length === 1 ) {
            for (let key of Object.keys(obj)) {
                result.id = key;
                result.label = key;
                result.children = [];
                const currentObj = obj[key];
                result.children = formatData(currentObj);
            }
            return result;
        } else {
            const result = [];
            for (let key of Object.keys(obj)) {
                result.push({
                    id: key,
                    label: key,
                    children: formatData(obj[key]),
                })
            }
            return result;
        }
    }
}
