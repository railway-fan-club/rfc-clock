// 桜吹雪エフェクト
let sakuraPetals = [];

class SakuraPetal {
    constructor() {
        this.x = random(width);
        this.y = random(-50, -10);
        this.vx = 0;
        this.vy = random(0.5, 1.5);
        this.rotation = random(TWO_PI);
        this.rotationSpeed = random(-0.05, 0.05);
        this.size = random(6, 12);
        this.swingAmplitude = random(0.5, 2);
        this.swingSpeed = random(0.02, 0.05);
        this.swingOffset = random(TWO_PI);
        this.alpha = random(200, 255);
        // ピンク系の色
        this.r = random(255, 255);
        this.g = random(182, 105);
        this.b = random(193, 180);
    }

    update() {
        // 風による横揺れ (sin波)
        this.vx = sin(frameCount * this.swingSpeed + this.swingOffset) * this.swingAmplitude;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        noStroke();
        let c = color(this.r, this.g, this.b);
        c.setAlpha(this.alpha);
        fill(c);
        // 花びら形状 (楕円を回転)
        ellipse(0, 0, this.size, this.size * 1.5);
        ellipse(0, 0, this.size * 1.5, this.size);
        pop();
    }

    isOffScreen() {
        return this.y > height + 10;
    }
}

function drawSakura() {
    // 夜桜イメージ（暗い紺紫系）背景
    setGradient(0, 0, width, height, color(20, 10, 40), color(40, 20, 60), Y_AXIS);

    // 新しい花びらを生成
    if (frameCount % 10 === 0 && sakuraPetals.length < 300) {
        sakuraPetals.push(new SakuraPetal());
    }

    // 花びらを更新・描画
    for (let i = sakuraPetals.length - 1; i >= 0; i--) {
        sakuraPetals[i].update();
        sakuraPetals[i].display();

        // 画面外に出たら削除
        if (sakuraPetals[i].isOffScreen()) {
            sakuraPetals.splice(i, 1);
        }
    }
}
