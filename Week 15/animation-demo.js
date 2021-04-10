import { Timeline, Animation } from './animation.js';

let tl = new Timeline();
tl.start();

const animation = new Animation(
    document.querySelector('#el').style,
    "transform",
    0,
    500,
    2000,
    0,
    null,
    v => `translateX(${v}px)`
);

tl.add(animation);

document.querySelector("#pause-btn").addEventListener('click', () => tl.pause());
document.querySelector("#resume-btn").addEventListener('click', () => tl.resume());