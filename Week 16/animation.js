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
const TIMELINE_STATE = {
    INITED: 'Inited',
    PAUSED: 'Paused',
    STARTED: 'Started',
}

const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");
export class Timeline {
    constructor() {
        this.state = TIMELINE_STATE.INITED;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start() {
        if (this.state !== TIMELINE_STATE.INITED) {
            return ;
        }
        this.state = TIMELINE_STATE.STARTED;
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[TICK] = () => {
            // console.log('tick');
            let now = Date.now();
            for (let animation of this[ANIMATIONS]) {
                
                let t;
                if (this[START_TIME].get(animation) < startTime) {
                    t = now - startTime - animation.delay;
                } else {
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
                }
                
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }

                if (t > 0) {
                    animation.receiveTime(t);
                }
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
    /**
    set rate() {}

    get rate() {}
    */
    pause() {
        if (this.state !== TIMELINE_STATE.STARTED) {
            return ;
        }
        this.state = TIMELINE_STATE.PAUSED;
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);

    }

    resume() {
        if (this.state !== TIMELINE_STATE.PAUSED) {
            return ;
        }
        this.state = TIMELINE_STATE.STARTED;
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }

    reset() {
        this.pause();
        this.state = TIMELINE_STATE.INITED;
        let startTime = Date.now();
        this[PAUSE_START] = 0;
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[TICK_HANDLER] = null;

    }

    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, Date.now());
    }
}

/**
 * 属性动画：程序员写的
 * 帧动画
 */
export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction || (v => v);
        this.delay = delay;
        this.template = template || (v => v);
    }

    receiveTime(time) {
        // console.log(time);
        let range = this.endValue - this.startValue;
        let progress = this.timingFunction(time/ this.duration);
        /** 均匀变化 */
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}
