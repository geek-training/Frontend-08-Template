function createElement(type, attributes, ...children) {
    let element;
    if (typeof type === "string") {
        element = document.createElement(type);
    } else {
        element = new type;
    }
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

class Div {

    constructor() {
        this.root = document.createElement("div");
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.root.appendChild(child);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
    }
}


let a = <Div id="a">
        <span>a</span>
        <span>b</span>
        <span>c</span>
</Div>

// document.body.appendChild(a);
a.mountTo(document.body);


