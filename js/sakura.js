// 桜吹雪エフェクト
let sakuraPetals = [];

// 花火発動判定関数（時間帯ベース: 19:00-21:00）
function isHanabiActive() {
    // seasonMode が 'both' または 'hanabi' の時のみ判定
    if (seasonMode !== 'both' && seasonMode !== 'hanabi') {
        return false;
    }

    // 19:00-21:00 の間は true
    let now = new Date();
    let hour = now.getHours();
    return (hour >= 19 && hour < 21);
}

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
        // ピンク系の色（5種類からランダム選択）
        let colors = [
            {r: 255, g: 183, b: 197}, // #FFB7C5
            {r: 255, g: 182, b: 193}, // #FFB6C1
            {r: 255, g: 105, b: 180}, // #FF69B4
            {r: 255, g: 192, b: 203}, // #FFC0CB
            {r: 255, g: 228, b: 225}  // #FFE4E1
        ];
        let selected = colors[floor(random(colors.length))];
        this.r = selected.r;
        this.g = selected.g;
        this.b = selected.b;
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

        // 5枚花弁（中心から72度ずつ回転して配置）
        for (let i = 0; i < 5; i++) {
            push();
            rotate((TWO_PI / 5) * i);
            ellipse(0, this.size * 0.4, this.size * 0.8, this.size * 1.2);
            pop();
        }

        // 中心の黄色い部分
        fill(255, 255, 200, this.alpha * 0.7);
        ellipse(0, 0, this.size * 0.3, this.size * 0.3);

        pop();
    }

    isOffScreen() {
        return this.y > height + 10;
    }
}

function drawSakura() {
    // 夜桜イメージ（暗い紺紫系）背景
    setGradient(0, 0, width, height, color(20, 10, 40), color(40, 20, 60), Y_AXIS);

    // 桜の木を描画（左下に配置）
    drawSakuraTree(100, height, 150);

    // 新しい花びらを生成（花火発動中は停止）
    if (!isHanabiActive() && frameCount % 10 === 0 && sakuraPetals.length < 300) {
        sakuraPetals.push(new SakuraPetal());
    }

    // 花びらを更新・描画（花火発動中も既存パーティクルは落下し続ける）
    for (let i = sakuraPetals.length - 1; i >= 0; i--) {
        sakuraPetals[i].update();
        sakuraPetals[i].display();

        // 画面外に出たら削除
        if (sakuraPetals[i].isOffScreen()) {
            sakuraPetals.splice(i, 1);
        }
    }
}

function drawSakuraTree(x, y, treeHeight) {
    // 1. 幹（台形 — 上に行くほど細くなる）
    push();
    noStroke();
    fill(80, 60, 40);
    beginShape();
    vertex(x - 20, y);              // 左下（太い）
    vertex(x + 20, y);              // 右下（太い）
    vertex(x + 8, y - treeHeight);  // 右上（細い）
    vertex(x - 8, y - treeHeight);  // 左上（細い）
    endShape(CLOSE);
    pop();

    // 2. 枝（再帰的に分岐）
    let startX = x;
    let startY = y - treeHeight * 0.8;

    // 左枝（-60度から開始）
    drawBranch(startX, startY, -PI * 0.6, 40, 3);
    // 中央枝（-90度から開始）
    drawBranch(startX, startY, -PI / 2, 50, 3);
    // 右枝（-120度から開始）
    drawBranch(startX, startY, -PI * 0.4, 40, 3);
}

function drawBranch(x1, y1, angle, length, depth) {
    if (depth === 0) return;

    let x2 = x1 + cos(angle) * length;
    let y2 = y1 + sin(angle) * length;

    push();
    stroke(80, 60, 40);
    strokeWeight(depth * 1.5);  // 深さに応じて太さ変更
    line(x1, y1, x2, y2);
    pop();

    // 花の配置（枝先は必ず、途中は確率的に）
    if (depth === 1 || (depth === 2 && random() < 0.5)) {
        let size = random(25, 45);
        drawFlowerCluster(x2, y2, size);
    }

    // 再帰的に分岐
    drawBranch(x2, y2, angle - 0.4, length * 0.7, depth - 1);
    drawBranch(x2, y2, angle + 0.4, length * 0.7, depth - 1);
}

function drawFlowerCluster(x, y, size) {
    push();
    noStroke();
    // 外側（薄いピンク）
    fill(255, 200, 210, 150);
    ellipse(x, y, size, size);
    // 中心（濃いピンク）
    fill(255, 150, 180, 200);
    ellipse(x, y, size * 0.6, size * 0.6);
    pop();
}
