export function createElement(type, attributes, ...children) {
    let element;
    if (typeof type === "string") {
        element = new ElementWrapper(type);
    } else {
        element = new type;
    }
    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }
    for (let child of children) {
        if (typeof child === "string") {
            child = new TextWrapper(child);
        }
        element.appendChild(child);
    }

    return element;
}

export let STATE = Symbol('state');
export class Component {
    constructor(type) {
        this.attributes = Object.create(null);
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    appendChild(child) {
        child.mountTo(this.root);
    }

    mountTo(parent) {
        if (!this.root) {
            this.render();
        }
        parent.appendChild(this.root);
    }
}

class TextWrapper extends Component {
    constructor(content) {
        this.root = document.createTextNode(content);
    }

}

class ElementWrapper extends Component {
    constructor(type) {
        this.root = document.createElement(type);
    }

}
