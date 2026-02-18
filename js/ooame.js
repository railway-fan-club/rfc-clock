// 大雨エフェクト

let ooameDrops = [];
const MAX_OOAME = 400;

class OoameDrop {
    constructor() {
        this.x = random(width);
        this.y = random(-200, -10);
        this.vx = random(-1, 1);  // わずかに横揺れ
        this.vy = random(18, 25);  // 小雨の2倍速
        this.w = random(2, 3);
        this.h = random(15, 25);
        this.alpha = random(0.6, 0.9);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    display() {
        fill(176, 196, 222, this.alpha * 255);  // #B0C4DE
        noStroke();
        ellipse(this.x, this.y, this.w, this.h);
    }

    isOffScreen() {
        return this.y > height + 10 || this.x < -10 || this.x > width + 10;
    }
}

function drawOoame() {
    // 暗い背景
    setGradient(0, 0, width, height,
        color(30, 30, 30), color(50, 50, 50));

    // パーティクル生成（毎フレーム）
    if (ooameDrops.length < MAX_OOAME) {
        ooameDrops.push(new OoameDrop());
    }

    for (let i = ooameDrops.length - 1; i >= 0; i--) {
        ooameDrops[i].update();
        ooameDrops[i].display();
        if (ooameDrops[i].isOffScreen()) {
            ooameDrops.splice(i, 1);
        }
    }
}
