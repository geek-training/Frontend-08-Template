function offLight () {
    let lights = document.getElementsByClassName('light');
    for (let i = 0; i < lights.length; i++) {
        lights[i].classList.remove('light');
    }
}
function green() {
    offLight();
    document.getElementsByClassName('green')[0].classList.add('light');
}
function red() {
    offLight();
    document.getElementsByClassName('red')[0].classList.add('light');
}
function yellow() {
    offLight();
    document.getElementsByClassName('yellow')[0].classList.add('light');
}

/**
 * 10 s 绿灯
 * 2 s 黄灯
 * 5 s 红灯
 */
function goByCallback() {
    green();
    setTimeout(() => {
        yellow();
        setTimeout( () => {
            red();
            setTimeout( () => {
                goByCallback();
            }, 5000)
        }, 2000)
    }, 10000)
}
function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    })
}
function goByPromise() {
    green();
    sleep(1000).then(() => {
        yellow();
        return sleep(2000);
    }).then(() => {
        red();
        return sleep(5000);
    }).then(goByPromise);
}

async function goByAsync() {
    while (true) {
        green();
        await sleep(10000);
        yellow();
        await sleep(2000);
        red();
        await sleep(5000);
    }
}

function happen(element, eventName) {
    return new Promise((resolve, reject) => {
        element.addEventListener(eventName, resolve, {once: true});
    })
}

async function goByAsyncAndEvent() {
    while (true) {
        green();
        await happen(document.getElementById('next'), 'click');
        yellow();
        await happen(document.getElementById('next'), 'click');
        red();
        await happen(document.getElementById('next'), 'click');
    }
}
