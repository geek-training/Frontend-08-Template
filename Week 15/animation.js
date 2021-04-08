/**

setInterval(() => {

}, 16);

let tick = () => {
    setTimeout(tick, 16);
}

let tick = () => {
    requestAnimationFrame(tick);
}
 */

const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");

export class Timeline {
    constructor() {
        this[ANIMATIONS] = new Set();
    }

    start() {
        let startTime = Date.now();
        this[TICK] = () => {
            // console.log('tick');
            let t = Date.now() - startTime;
            for (let animation of this[ANIMATIONS]) {
                let t0 = t;
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t0 = animation.duration;
                }
                animation.receiveTime(t0);
            }
            requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
    /**
    set rate() {}

    get rate() {}
    */
    pause() {

    }

    resume() {

    }

    reset() {

    }

    add(animation) {
        this[ANIMATIONS].add(animation);
    }
}

/**
 * 属性动画：程序员写的
 * 帧动画
 */
export class Animation {
    constructor(object, property, startValue, endValue, duration, timingFunction) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
    }

    receiveTime(time) {
        // console.log(time);
        let range = this.endValue - this.startValue;
        /** 均匀变化 */
        this.object[this.property] = this.startValue + range * time / this.duration;
    }
}
