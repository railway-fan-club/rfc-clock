let kyoufuuraiDrops = [];
const MAX_KYOUFUURAI = 300;
let lightningTimer = 0;
let lightningFlash = false;
let flashAlpha = 0;

class KyoufuuraiDrop {
    constructor() {
        this.x = random(-100, width);
        this.y = random(-200, -10);
        this.vx = random(15, 25);  // 強い横風
        this.vy = random(20, 28);
        this.w = random(2, 4);
        this.h = random(20, 30);
        this.alpha = random(0.7, 1.0);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    display() {
        if (lightningFlash) {
            fill(255, 255, 255, this.alpha * 255);  // 雷時は白
        } else {
            fill(135, 206, 235, this.alpha * 255);  // #87CEEB
        }
        noStroke();
        ellipse(this.x, this.y, this.w, this.h);
    }

    isOffScreen() {
        return this.y > height + 10 || this.x > width + 100;
    }
}

function drawKyoufuurai() {
    // 非常に暗い背景
    setGradient(0, 0, width, height,
        color(15, 15, 15), color(35, 35, 35));

    // 雷フラッシュロジック
    lightningTimer++;
    let flashInterval = random(180, 480);  // 3〜8秒（60fps想定）
    if (lightningTimer > flashInterval) {
        lightningFlash = true;
        flashAlpha = 200;
        lightningTimer = 0;
    }

    // フラッシュフェードアウト
    if (lightningFlash) {
        fill(255, 255, 255, flashAlpha);
        rect(0, 0, width, height);
        flashAlpha -= 20;
        if (flashAlpha <= 0) {
            lightningFlash = false;
        }
    }

    // パーティクル生成
    if (kyoufuuraiDrops.length < MAX_KYOUFUURAI) {
        kyoufuuraiDrops.push(new KyoufuuraiDrop());
    }

    for (let i = kyoufuuraiDrops.length - 1; i >= 0; i--) {
        kyoufuuraiDrops[i].update();
        kyoufuuraiDrops[i].display();
        if (kyoufuuraiDrops[i].isOffScreen()) {
            kyoufuuraiDrops.splice(i, 1);
        }
    }
}
