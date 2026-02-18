// 猛吹雪エフェクト
let moufubukiFlakes = [];
const MAX_MOUFUBUKI = 800;  // 500→800に増加

class MoufubukiFlake {
    constructor() {
        this.x = random(-200, width);
        this.y = random(-100, height);
        this.baseVx = random(25, 40);  // 強い横風
        this.vx = this.baseVx;
        this.vy = random(3, 8);
        this.size = random(1, 8);  // サイズばらつき拡大
        this.alpha = random(80, 200);
        // 残像用配列
        this.trail = [];
        this.trailLength = random(5, 12);
    }

    update() {
        // 風の唸り (強弱変動)
        let windFactor = sin(frameCount * 0.02) * 0.4 + 1;
        this.vx = this.baseVx * windFactor;

        // 軌跡保存 (残像表現)
        this.trail.push({x: this.x, y: this.y, alpha: this.alpha});
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    display() {
        // 残像を描画
        noStroke();
        for (let i = 0; i < this.trail.length; i++) {
            let t = this.trail[i];
            let trailAlpha = t.alpha * (i / this.trail.length) * 0.5;
            let c = color(255, 255, 255);
            c.setAlpha(trailAlpha);
            fill(c);
            ellipse(t.x, t.y, this.size * 0.7, this.size * 0.7);
        }

        // 本体を描画
        let c = color(255, 255, 255);
        c.setAlpha(this.alpha);
        fill(c);
        ellipse(this.x, this.y, this.size, this.size);
    }

    isOffScreen() {
        return this.y > height + 20 || this.x > width + 100;
    }
}

function drawMoufubuki() {
    // 画面微振動（shake effect）
    let shakeX = random(-2, 2);
    let shakeY = random(-2, 2);
    translate(shakeX, shakeY);

    // 視界不良の白いレイヤー（波打ち）
    let whiteLayerAlpha = map(sin(frameCount * 0.02), -1, 1, 0.3, 0.7);
    setGradient(0, 0, width, height,
        color(200, 200, 200, whiteLayerAlpha * 255),
        color(240, 240, 240, whiteLayerAlpha * 255), Y_AXIS);

    // 毎フレーム大量生成
    if (frameCount % 1 === 0 && moufubukiFlakes.length < MAX_MOUFUBUKI) {
        moufubukiFlakes.push(new MoufubukiFlake());
    }

    // 雪を更新・描画
    for (let i = moufubukiFlakes.length - 1; i >= 0; i--) {
        moufubukiFlakes[i].update();
        moufubukiFlakes[i].display();

        // 画面外に出たら削除
        if (moufubukiFlakes[i].isOffScreen()) {
            moufubukiFlakes.splice(i, 1);
        }
    }

    // 微振動のリセット
    translate(-shakeX, -shakeY);
}
