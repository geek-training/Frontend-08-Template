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
