// 小雨エフェクト

let koameDrops = [];
const MAX_KOAME = 200;

class KoameDrop {
    constructor() {
        this.x = random(width);
        this.y = random(-200, -10);
        this.vx = random(-1, 1);
        this.vy = random(15, 22);  // 高速化（小雨）
        this.w = random(1, 2);     // 細く
        this.h = random(25, 40);   // より長く
        this.alpha = random(0.5, 0.8);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    display() {
        // フェードアウトロジックは削除（即座に消えるため）
        stroke(176, 196, 222, this.alpha * 255);
        strokeWeight(this.w);
        line(this.x, this.y, this.x, this.y + this.h);  // 線状描画
    }

    isOffScreen() {
        return this.y > height + 5 || this.x < -10 || this.x > width + 10;
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
