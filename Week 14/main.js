function createElement(type, attributes, ...children) {
    let element = document.createElement(type);
    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }
    for (let child of children) {
        if (typeof child === "string") {
            child = document.createTextNode(child);
        }
        element.appendChild(child);
    }

    return element;
}

let a = <div id="a">
        <span>a</span>
        <span>b</span>
        <span>c</span>
</div>

let b = <div id="a">
    Hello world!
</div>

document.body.appendChild(a);
document.body.appendChild(b);
