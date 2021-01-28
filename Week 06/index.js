
class Human {
    life;
    constructor() {
        this.life = 100;
    }
    hurt(damage) {
        if (this.life - damage >= 0) {
            this.life -= damage;
        } else {
            alert('over');
        }

    }
}
const human = new Human();

let humanProxy = new Proxy(human, {
    set(obj, prop, val) {
        obj[prop] = val;
        document.getElementById('life').value = humanProxy.life;
        return obj[prop];
    },

    get(obj, prop) {
        return obj[prop];
    }
});

const biteBtn = document.getElementById('bite');
biteBtn.addEventListener('click', () => {
    humanProxy.hurt(10);
});
