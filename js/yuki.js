// 雪エフェクト
let snowFlakes = [];

class SnowFlake {
    constructor() {
        this.x = random(width);
        this.y = random(-50, -10);
        this.vx = 0;
        this.vy = random(0.3, 1.0);
        this.size = random(2, 8);
        this.swingAmplitude = random(0.2, 0.8);
        this.swingSpeed = random(0.01, 0.03);
        this.swingOffset = random(TWO_PI);
        this.alpha = random(150, 255);
    }

    update() {
        // 微かに左右に揺れる
        this.vx = sin(frameCount * this.swingSpeed + this.swingOffset) * this.swingAmplitude;
        this.x += this.vx;
        this.y += this.vy;
    }

    display() {
        noStroke();
        let c = color(255, 255, 255);
        c.setAlpha(this.alpha);
        fill(c);
        ellipse(this.x, this.y, this.size, this.size);
    }

    isOffScreen() {
        return this.y > height + 10;
    }
}

function drawYuki() {
    // 暗い夜空グラデーション (藍色系)
    setGradient(0, 0, width, height, color(25, 25, 112), color(0, 0, 50), Y_AXIS);

    // 新しい雪を生成
    if (frameCount % 8 === 0 && snowFlakes.length < 300) {
        snowFlakes.push(new SnowFlake());
    }

    // 雪を更新・描画
    for (let i = snowFlakes.length - 1; i >= 0; i--) {
        snowFlakes[i].update();
        snowFlakes[i].display();

        // 画面外に出たら削除
        if (snowFlakes[i].isOffScreen()) {
            snowFlakes.splice(i, 1);
        }
    }
}
