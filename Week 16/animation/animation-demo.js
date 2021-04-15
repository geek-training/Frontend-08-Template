import { Timeline, Animation } from './animation.js';
import { ease, easeIn, easeOut, easeInOut } from './ease.js';

let tl = new Timeline();
tl.start();

/**  test ease */
// document.querySelector('#el2').style.transition = 'transform ease 2s';
// document.querySelector('#el2').style.transform = 'translateX(500px)';
// const timeFun = ease;

/**  test easeIn */
document.querySelector('#el2').style.transition = 'transform ease-in 2s';
document.querySelector('#el2').style.transform = 'translateX(500px)';
const timeFun = easeIn;

/**  test easeOut */
// document.querySelector('#el2').style.transition = 'transform ease-out 2s';
// document.querySelector('#el2').style.transform = 'translateX(500px)';
// const timeFun = easeOut;

/**  test easeInOut */
// document.querySelector('#el2').style.transition = 'transform ease-in-out 2s';
// document.querySelector('#el2').style.transform = 'translateX(500px)';
// const timeFun = easeInOut;

const animation = new Animation(
    document.querySelector('#el').style,
    "transform",
    0,
    500,
    2000,
    0,
    timeFun,
    v => `translateX(${v}px)`
);

tl.add(animation);

document.querySelector("#pause-btn").addEventListener('click', () => tl.pause());
document.querySelector("#resume-btn").addEventListener('click', () => tl.resume());
