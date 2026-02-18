// 小雨エフェクト

let koameDrops = [];
const MAX_KOAME = 200;

class KoameDrop {
    constructor() {
        this.x = random(width);
        this.y = random(-100, -10);
        this.vx = 0;
        this.vy = random(8, 12);
        this.w = random(1, 2);
        this.h = random(8, 12);
        this.alpha = random(0.4, 0.7);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    display() {
        let fadeAlpha = this.alpha;

        // 画面下端の100px手前からフェードアウト開始
        if (this.y > height - 100) {
            let fadeProgress = (this.y - (height - 100)) / 100;
            fadeAlpha = this.alpha * (1 - fadeProgress);
        }

        fill(173, 216, 230, fadeAlpha * 255);
        noStroke();
        ellipse(this.x, this.y, this.w, this.h);
    }

    isOffScreen() {
        return this.y > height + 50;
    }
}

function drawKoame() {
    setGradient(0, 0, width, height,
        color(60, 60, 60), color(80, 80, 80));

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
