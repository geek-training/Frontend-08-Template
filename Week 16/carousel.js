import { Timeline } from '../Week 15/animation.js';
import { ease } from '../Week 15/ease.js';
import { Component } from './framework.js';
import {enableGesture} from "./gesture/gesture";

export  class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    render() {
        console.log(this.attributes.src);
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
        let position = 0;

        let t = 0;
        let ax;

        this.root.addEventListener('start', event => {
            timeline.pause();
            clearInterval(handler);
            let progress = (Data.now() - t)/1500;
            ax = ease(progress) * 500 - 500;

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

        this.root.addEventListener('panend', event => {
            let x = event.clientX - event.startX - ax;
                position = position - Math.round(x / 500);
                for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = "";
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`;
                }
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
             - position * 500, -500 - position * 500, 1500, 0, ease, v => `translateX(${v}px)`))
            timeline.add(new Animation(next.style, "transform",
            500 - nextIndex * 500, - nextIndex * 500, 1500, 0, ease, v => `translateX(${v}px)`));

            position = nextIndex;
        }

         handler = setInterval(nextPicture, 3000);


        /**  鼠标时间轮播  */

        /**
        this.root.addEventListener('mousedown', event => {
            let children = this.root.children;

            let startX = event.clientX; // 不需要Y轴上的信息： startY = event.clientY;

            let move = event => {
                let x = event.clientX - startX;

                let current = position - ((x - x % 500) / 500);

                for (let offset of [-1, 0, 1]) {
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = "none";
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
                }

            }

            let up = event => {
                let x = event.clientX - startX;
                position = position - Math.round(x / 500);
                for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = "";
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`;
                }
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

        */
        /*******  自动轮播  *******/
        /**

         let currentIndex = 0;
         setInterval(() => {
            let children = this.root.children;

            let nextIndex = (currentIndex+1) % children.length;

            let current = children[currentIndex];
            let next = children[nextIndex];

            next.style.transition = "none";
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`

            setTimeout(() => {
                next.style.transition = "";
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${- nextIndex * 100}%)`;

                currentIndex = nextIndex;
            }, 16);
        }, 3000);

         */


        return this.root;
    }

    mountTo(parent) {
        parent.appendChild(this.render());
    }
}

