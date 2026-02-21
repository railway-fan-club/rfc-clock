// 小雨エフェクト

let koameDrops = [];
const MAX_KOAME = 200;

class KoameDrop {
    constructor() {
        this.x = random(width);
        this.y = random(-200, -10);
        this.vx = random(-1, 1);
        this.vy = random(15, 22);
        this.w = random(2, 4);     // 太く
        this.h = random(30, 50);   // 長く
        this.alpha = random(0.25, 0.45);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    display() {
        stroke(176, 196, 222, this.alpha * 255);
        strokeWeight(this.w);
        line(this.x, this.y, this.x, this.y + this.h);
    }

    isOffScreen() {
        return this.y >= height || this.x < -10 || this.x > width + 10;
    }
}

function drawKoame() {
    background(0);

    if (frameCount % 2 === 0 && koameDrops.length < MAX_KOAME) {
        koameDrops.push(new KoameDrop());
    }

    for (let i = koameDrops.length - 1; i >= 0; i--) {
        koameDrops[i].update();
        koameDrops[i].display();
        if (koameDrops[i].isOffScreen()) {
            koameDrops.splice(i, 1);
        }
    }
}
