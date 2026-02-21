// 大雨エフェクト（電車が止まるレベルの豪雨）

let ooameDrops = [];
let ooameSplashes = [];
const MAX_OOAME = 1200;
const MAX_OOAME_SPLASH = 60;

class OoameDrop {
    constructor() {
        this.x = random(-200, width);
        this.y = random(-400, -10);
        this.baseVx = random(5, 12);
        this.vx = this.baseVx;
        this.vy = random(35, 55);
        this.w = random(1, 2.5);
        this.h = random(40, 90);
        this.alpha = random(0.3, 0.7);
        this.trail = [];
        this.trailLength = floor(random(3, 6));
    }

    update() {
        // 風の強弱変動
        let windFactor = sin(frameCount * 0.03) * 0.3 + 1;
        this.vx = this.baseVx * windFactor;

        // 残像トレイル
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    display() {
        // 残像描画
        for (let i = 0; i < this.trail.length; i++) {
            let t = this.trail[i];
            let trailAlpha = this.alpha * (i / this.trail.length) * 0.3;
            stroke(176, 196, 222, trailAlpha * 255);
            strokeWeight(this.w * 0.6);
            line(t.x, t.y, t.x + this.vx * 0.3, t.y + this.h * 0.5);
        }

        // 本体（斜めの雨筋）
        stroke(176, 196, 222, this.alpha * 255);
        strokeWeight(this.w);
        line(this.x, this.y, this.x + this.vx * 0.5, this.y + this.h);
    }

    isOffScreen() {
        return this.y >= height || this.x > width + 50;
    }
}

class OoameSplash {
    constructor(x) {
        this.x = x;
        this.y = height - random(0, 5);
        this.size = random(2, 6);
        this.alpha = random(0.4, 0.8);
        this.life = floor(random(4, 10));
    }

    update() {
        this.life--;
        this.alpha *= 0.8;
        this.size += 0.5;
    }

    display() {
        noFill();
        stroke(176, 196, 222, this.alpha * 255);
        strokeWeight(1);
        ellipse(this.x, this.y, this.size, this.size * 0.4);
    }

    isDead() {
        return this.life <= 0;
    }
}

function drawOoame() {
    // 画面微振動
    let shakeX = random(-2, 2);
    let shakeY = random(-1, 1);
    translate(shakeX, shakeY);

    // 暗い背景
    background(0);

    // 霧オーバーレイ（視界不良の壁のような雨）
    let fogAlpha = map(sin(frameCount * 0.025), -1, 1, 0.08, 0.2);
    noStroke();
    fill(100, 110, 130, fogAlpha * 255);
    rect(0, 0, width, height);

    // パーティクル大量生成
    for (let n = 0; n < 8 && ooameDrops.length < MAX_OOAME; n++) {
        ooameDrops.push(new OoameDrop());
    }

    // 雨粒の更新・描画
    for (let i = ooameDrops.length - 1; i >= 0; i--) {
        ooameDrops[i].update();
        ooameDrops[i].display();
        if (ooameDrops[i].isOffScreen()) {
            // 画面下端に到達した雨粒は水しぶきを生成
            if (ooameDrops[i].y >= height && ooameSplashes.length < MAX_OOAME_SPLASH) {
                if (random() < 0.3) {
                    ooameSplashes.push(new OoameSplash(ooameDrops[i].x));
                }
            }
            ooameDrops.splice(i, 1);
        }
    }

    // 水しぶきの更新・描画
    for (let i = ooameSplashes.length - 1; i >= 0; i--) {
        ooameSplashes[i].update();
        ooameSplashes[i].display();
        if (ooameSplashes[i].isDead()) {
            ooameSplashes.splice(i, 1);
        }
    }

    // 振動リセット
    translate(-shakeX, -shakeY);
}
