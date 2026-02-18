// 雨雷エフェクト（大雨 + 雷）

let uraiuDrops = [];
const MAX_URAIU = 300;
let uraiuLightningTimer = 0;
let uraiuNextLightning = 0;  // setup時に初期化
let uraiuLightningFlash = false;
let uraiuFlashAlpha = 0;
let uraiuInitialized = false;

class UraiuDrop {
    constructor() {
        this.x = random(width);
        this.y = random(-200, -10);
        this.vx = 0;  // 垂直落下（横風なし）
        this.vy = random(20, 28);
        this.w = random(1, 2);
        this.h = random(25, 40);
        this.alpha = random(0.7, 1.0);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    display() {
        if (uraiuLightningFlash) {
            stroke(255, 255, 255, this.alpha * 255);
        } else {
            stroke(176, 196, 222, this.alpha * 255);
        }
        strokeWeight(this.w);
        line(this.x, this.y, this.x, this.y + this.h);
    }

    isOffScreen() {
        return this.y > height + 5 || this.x < -10 || this.x > width + 10;
    }
}

function drawUraiu() {
    // 初回のみ雷タイマー初期化
    if (!uraiuInitialized) {
        uraiuLightningTimer = 0;
        uraiuNextLightning = random(180, 480);
        uraiuInitialized = true;
    }

    // 非常に暗い背景
    setGradient(0, 0, width, height,
        color(15, 15, 15), color(35, 35, 35));

    // 雷フラッシュロジック（確実に動作）
    uraiuLightningTimer++;
    if (uraiuLightningTimer > uraiuNextLightning) {
        uraiuLightningFlash = true;
        uraiuFlashAlpha = 120;
        uraiuLightningTimer = 0;
        uraiuNextLightning = random(180, 480);  // 3-8秒（60fps想定）
    }

    // フラッシュ描画
    if (uraiuLightningFlash) {
        fill(255, 255, 255, uraiuFlashAlpha);
        rect(0, 0, width, height);
        uraiuFlashAlpha -= 20;
        if (uraiuFlashAlpha <= 0) {
            uraiuLightningFlash = false;
        }
    }

    // 雨粒パーティクル
    if (uraiuDrops.length < MAX_URAIU) {
        uraiuDrops.push(new UraiuDrop());
    }

    for (let i = uraiuDrops.length - 1; i >= 0; i--) {
        uraiuDrops[i].update();
        uraiuDrops[i].display();
        if (uraiuDrops[i].isOffScreen()) {
            uraiuDrops.splice(i, 1);
        }
    }
}
