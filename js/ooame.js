// 大雨エフェクト

let ooameDrops = [];
const MAX_OOAME = 400;

class OoameDrop {
    constructor() {
        this.x = random(width);
        this.y = random(-200, -10);
        this.vx = random(-1, 1);  // わずかに横揺れ
        this.vy = random(28, 38);  // 高速化（大雨）
        this.w = random(1, 2);     // 細く
        this.h = random(25, 40);   // より長く
        this.alpha = random(0.6, 0.9);
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
