// 吹雪エフェクト
let fubukiFlakes = [];

class FubukiFlake {
    constructor() {
        this.x = random(-50, width);
        this.y = random(-50, -10);
        this.baseVx = random(3, 8);
        this.vx = this.baseVx;
        this.vy = random(2, 5);
        this.size = random(1, 6);
        this.alpha = random(100, 255);
    }

    update() {
        // 風の強弱 (sin波で変動)
        let windFactor = sin(frameCount * 0.01) * 0.5 + 1;
        this.vx = this.baseVx * windFactor;
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
        return this.y > height + 10 || this.x > width + 50;
    }
}

function drawFubuki() {
    // 灰色がかった暗い空
    setGradient(0, 0, width, height, color(60, 60, 70), color(30, 30, 40), Y_AXIS);

    // 大量の雪を生成
    if (frameCount % 3 === 0 && fubukiFlakes.length < 300) {
        fubukiFlakes.push(new FubukiFlake());
    }

    // 雪を更新・描画
    for (let i = fubukiFlakes.length - 1; i >= 0; i--) {
        fubukiFlakes[i].update();
        fubukiFlakes[i].display();

        // 画面外に出たら削除
        if (fubukiFlakes[i].isOffScreen()) {
            fubukiFlakes.splice(i, 1);
        }
    }
}
