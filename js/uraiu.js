// 雨雷エフェクト（大雨ベース + 雷）

let uraiuDrops = [];
let uraiuSplashes = [];
const MAX_URAIU = 1200;
const MAX_URAIU_SPLASH = 60;
let uraiuLightningTimer = 0;
let uraiuNextLightning = 0;
let uraiuLightningFlash = false;
let uraiuFlashAlpha = 0;
let uraiuInitialized = false;

class UraiuDrop {
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
        let r = 176, g = 196, b = 222;
        if (uraiuLightningFlash) {
            r = 255; g = 255; b = 255;
        }

        // 残像描画
        for (let i = 0; i < this.trail.length; i++) {
            let t = this.trail[i];
            let trailAlpha = this.alpha * (i / this.trail.length) * 0.3;
            stroke(r, g, b, trailAlpha * 255);
            strokeWeight(this.w * 0.6);
            line(t.x, t.y, t.x + this.vx * 0.3, t.y + this.h * 0.5);
        }

        // 本体（斜めの雨筋）
        stroke(r, g, b, this.alpha * 255);
        strokeWeight(this.w);
        line(this.x, this.y, this.x + this.vx * 0.5, this.y + this.h);
    }

    isOffScreen() {
        return this.y >= height || this.x > width + 50;
    }
}

class UraiuSplash {
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

function drawUraiu() {
    // 初回のみ雷タイマー初期化
    if (!uraiuInitialized) {
        uraiuLightningTimer = 0;
        uraiuNextLightning = random(180, 480);
        uraiuInitialized = true;
    }

    // 画面微振動
    let shakeX = random(-2, 2);
    let shakeY = random(-1, 1);
    translate(shakeX, shakeY);

    // 暗い背景
    background(0);

    // 雷フラッシュロジック
    uraiuLightningTimer++;
    if (uraiuLightningTimer > uraiuNextLightning) {
        uraiuLightningFlash = true;
        uraiuFlashAlpha = 120;
        uraiuLightningTimer = 0;
        uraiuNextLightning = random(180, 480);  // 3-8秒（60fps想定）
    }

    // フラッシュ描画
    if (uraiuLightningFlash) {
        noStroke();
        fill(255, 255, 255, uraiuFlashAlpha);
        rect(0, 0, width, height);
        uraiuFlashAlpha -= 20;
        if (uraiuFlashAlpha <= 0) {
            uraiuLightningFlash = false;
        }
    } else {
        // 霧オーバーレイ（フラッシュ中は表示しない）
        let fogAlpha = map(sin(frameCount * 0.025), -1, 1, 0.08, 0.2);
        noStroke();
        fill(100, 110, 130, fogAlpha * 255);
        rect(0, 0, width, height);
    }

    // パーティクル大量生成
    for (let n = 0; n < 8 && uraiuDrops.length < MAX_URAIU; n++) {
        uraiuDrops.push(new UraiuDrop());
    }

    // 雨粒の更新・描画
    for (let i = uraiuDrops.length - 1; i >= 0; i--) {
        uraiuDrops[i].update();
        uraiuDrops[i].display();
        if (uraiuDrops[i].isOffScreen()) {
            if (uraiuDrops[i].y >= height && uraiuSplashes.length < MAX_URAIU_SPLASH) {
                if (random() < 0.3) {
                    uraiuSplashes.push(new UraiuSplash(uraiuDrops[i].x));
                }
            }
            uraiuDrops.splice(i, 1);
        }
    }

    // 水しぶきの更新・描画
    for (let i = uraiuSplashes.length - 1; i >= 0; i--) {
        uraiuSplashes[i].update();
        uraiuSplashes[i].display();
        if (uraiuSplashes[i].isDead()) {
            uraiuSplashes.splice(i, 1);
        }
    }

    // 振動リセット
    translate(-shakeX, -shakeY);
}
