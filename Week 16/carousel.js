import { Timeline,Animation } from './animation/animation.js';
import { ease } from './animation/ease.js';
import { Component, STATE } from './framework.js';
import {enableGesture} from "./gesture/gesture.js";

export {STATE} from './framework.js';

export  class Carousel extends Component {
    constructor() {
        super();
    }

    render() {
        this.root = document.createElement("div");
        this.root.classList.add('carousel');

        for (let record of this.attributes.src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url(${record})`;
            this.root.appendChild(child);
        }

        enableGesture(this.root);

        let timeline = new Timeline;
        timeline.start();

        let handler = null;

        let children = this.root.children;
        // 组件当前状态
        let position = 0;

        let t = 0;
        let ax;

        this.root.addEventListener('start', event => {
            timeline.pause();
            clearInterval(handler);
            if (Date.now() - t < 1500) {
                let progress = (Data.now() - t)/1500;
                ax = ease(progress) * 500 - 500;
            } else {
                ax = 0;
            }

        });

        this.root.addEventListener('pan', event => {

            let x = event.clientX - event.startX - ax;
            let current = position - ((x - x % 500) / 500);

            for (let offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;
                children[pos].style.transition = "none";
                children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
            }

        });

        this.root.addEventListener('end', event => {

            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000);

            let x = event.clientX - event.startX - ax;
            let current = position - ((x - x % 500)/500);

            let direction = Math.round((x % 500) / 500);

            if (event.isFlick) {
                console.log(event.velocity);
                if (event.velocity < 0) {
                    direction = Math.ceil((x % 500) / 500);
                } else {
                    direction = Math.floor((x % 500) / 500);
                }
            }


            // for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;
                
                children[pos].style.transition = "none";

                timeline.add(new Animation(children[pos].style, "transform",
                - pos * 500 + offset * 500 + x % 500, 
                - pos * 500 + offset * 500 + direction * 500, 
                500, 0, ease, v => `translateX(${v}px)`))
    
            }

            position = position - ((x - x % 500) / 500) - direction;
            position = (position % children.length + children.length) % children.length;
                
        });

        let nextPicture = () => {
            let children = this.root.children;

            let nextIndex = (position + 1) % children.length;

            let current = children[position];
            let next = children[nextIndex];

            t = Date.now();

            // next.style.transition = "none";
            // next.style.transform = `translateX(${500 - nextIndex * 500}px)`

            // 创建animation
            timeline.add(new Animation(current.style, "transform",
            - pos * 500 + offset * 500 + x % 500, 
            - pos * 500 + offset * 500 + direction * 500, 
            500, 0, ease, v => `translateX(${v}px)`))
            timeline.add(new Animation(next.style, "transform",
            500 - nextIndex * 500, - nextIndex * 500, 500, 0, ease, v => `translateX(${v}px)`));

            position = nextIndex;
        }

        return this.root;
    }
}
