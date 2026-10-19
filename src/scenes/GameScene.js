import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER, SIZES, SCORE, START_HEALTH, LEVEL_UP_MS, FALL, CAT, COLORS } from '../config.js';
import Alex from '../objects/Alex.js';
import Cat from '../objects/Cat.js';
import { drawBackground } from '../utils/background.js';
import { textStyle, fitToHeight, floatingText } from '../utils/ui.js';
import { saveBestScore } from '../utils/storage.js';

// 🎮 실제 게임 플레이 장면
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // 게임 상태 (다시 시작할 때마다 초기화)
    this.score = 0;
    this.health = START_HEALTH;
    this.level = 1;
    this.elapsed = 0;
    this.itemTimer = 0;
    this.catTimer = 0;
    this.nextCatDelay = CAT.firstDelay;
    this.isGameOver = false;

    // 조작 상태
    this.touchLeft = false;
    this.touchRight = false;
    this.dragPointerId = null;
    this.dragTargetX = null;

    drawBackground(this);

    this.alex = new Alex(this, GAME_WIDTH / 2, PLAYER.y);
    this.items = this.physics.add.group(); // 떨어지는 간식/폭탄
    this.cats = this.physics.add.group({ runChildUpdate: true }); // 고양이들

    this.physics.add.overlap(this.alex, this.items, this.handleItem, null, this);
    this.physics.add.overlap(this.alex, this.cats, this.handleCat, null, this);

    // 간식 먹을 때 반짝이 효과
    this.sparkles = this.add
      .particles(0, 0, 'sparkle', {
        speed: { min: 80, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        lifespan: 500,
        tint: [0xffe066, 0xff9ecb, 0xffffff, 0x9ed8ff],
        emitting: false,
      })
      .setDepth(20);

    this.createHud();
    this.createControls();
  }

  // ---------------- 화면 상단 정보 (점수/레벨/체력) ----------------
  createHud() {
    const bar = this.add.graphics().setDepth(30);
    bar.fillStyle(0xffffff, 0.75);
    bar.fillRoundedRect(10, 10, GAME_WIDTH - 20, 48, 18);

    this.scoreText = this.add.text(28, 34, '점수 0', textStyle(22)).setOrigin(0, 0.5).setDepth(31);
    this.levelText = this.add.text(GAME_WIDTH / 2, 34, 'Lv.1', textStyle(22, COLORS.accent)).setOrigin(0.5).setDepth(31);

    this.hearts = [];
    for (let i = 0; i < START_HEALTH; i++) {
      this.hearts.push(this.add.image(GAME_WIDTH - 36 - i * 32, 34, 'heart').setDepth(31));
    }
  }

  updateHud() {
    this.scoreText.setText(`점수 ${this.score}`);
    this.levelText.setText(`Lv.${this.level}`);
    this.hearts.forEach((heart, i) => heart.setTexture(i < this.health ? 'heart' : 'heartEmpty'));
  }

  // ---------------- 조작 (키보드 / 터치 버튼 / 드래그) ----------------
  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey('A');
    this.keyD = this.input.keyboard.addKey('D');

    // 터치 화면에서만 ◀ ▶ 버튼 표시
    if (this.sys.game.device.input.touch) {
      this.createTouchButton(52, 'left');
      this.createTouchButton(GAME_WIDTH - 52, 'right');
    }

    // 버튼이 아닌 곳을 누르고 끌면, 손가락 위치로 알렉스가 따라와요
    this.input.on('pointerdown', (pointer, over) => {
      if (over.length > 0) return;
      this.dragPointerId = pointer.id;
      this.dragTargetX = pointer.worldX;
    });
    this.input.on('pointermove', (pointer) => {
      if (pointer.id === this.dragPointerId && pointer.isDown) this.dragTargetX = pointer.worldX;
    });
    this.input.on('pointerup', (pointer) => {
      if (pointer.id === this.dragPointerId) {
        this.dragPointerId = null;
        this.dragTargetX = null;
      }
    });
  }

  createTouchButton(x, side) {
    const y = GAME_HEIGHT - 28;
    const button = this.add.circle(x, y, 26, 0xffffff, 0.7).setStrokeStyle(3, 0xf3a6c4).setDepth(30).setInteractive();
    this.add.text(x, y, side === 'left' ? '◀' : '▶', textStyle(22, '#e67aa5')).setOrigin(0.5).setDepth(31);

    const setPressed = (pressed) => {
      if (side === 'left') this.touchLeft = pressed;
      else this.touchRight = pressed;
      button.setFillStyle(0xffffff, pressed ? 1 : 0.7);
    };
    button.on('pointerdown', () => setPressed(true));
    button.on('pointerup', () => setPressed(false));
    button.on('pointerout', () => setPressed(false));
  }

  // ---------------- 난이도 계산 (레벨에 따라 조금씩 어려워져요) ----------------
  getDifficulty() {
    const n = this.level - 1;
    return {
      fallSpeed: Math.min(FALL.maxSpeed, FALL.baseSpeed + n * FALL.speedPerLevel),
      spawnInterval: Math.max(FALL.minInterval, FALL.baseInterval - n * FALL.intervalPerLevel),
      bombChance: Math.min(FALL.maxBombChance, FALL.baseBombChance + n * FALL.bombChancePerLevel),
      catInterval: Math.max(CAT.minInterval, CAT.baseInterval - n * CAT.intervalPerLevel),
      catSpeed: Math.min(CAT.maxSpeed, CAT.baseSpeed + n * CAT.speedPerLevel),
      catJumpWidth: Math.max(CAT.minJumpWidth, CAT.jumpWidth - n * CAT.jumpWidthPerLevel),
    };
  }

  // ---------------- 매 프레임 실행 ----------------
  update(time, delta) {
    if (this.isGameOver) return;
    const ms = Math.min(delta, 50); // 탭을 다녀오면 delta가 커지는 것 방지
    const difficulty = this.getDifficulty();

    this.updateMovement(ms / 1000);
    this.alex.update();

    // 레벨업 (20초마다)
    this.elapsed += ms;
    const newLevel = 1 + Math.floor(this.elapsed / LEVEL_UP_MS);
    if (newLevel > this.level) this.levelUp(newLevel);

    // 간식/폭탄 떨어뜨리기
    this.itemTimer += ms;
    if (this.itemTimer >= difficulty.spawnInterval) {
      this.itemTimer = 0;
      this.spawnItem(difficulty);
    }

    // 고양이 등장
    this.catTimer += ms;
    if (this.catTimer >= this.nextCatDelay) {
      this.catTimer = 0;
      this.spawnCat(difficulty);
      this.nextCatDelay = difficulty.catInterval * Phaser.Math.FloatBetween(0.8, 1.2);
    }

    // 바닥 아래로 떨어진 물건 정리
    this.items.getChildren().slice().forEach((item) => {
      if (item.y > GAME_HEIGHT + 40) item.destroy();
    });
  }

  updateMovement(dt) {
    let direction = 0;
    if (this.cursors.left.isDown || this.keyA.isDown || this.touchLeft) direction -= 1;
    if (this.cursors.right.isDown || this.keyD.isDown || this.touchRight) direction += 1;

    if (direction !== 0) {
      this.alex.move(direction, dt);
    } else if (this.dragTargetX !== null) {
      this.alex.moveToward(this.dragTargetX, dt);
    }
  }

  // ---------------- 떨어지는 물건 ----------------
  spawnItem(difficulty) {
    const roll = Math.random();
    let type = 'snack';
    if (roll < difficulty.bombChance) type = 'bomb';
    else if (roll < difficulty.bombChance + FALL.goldenChance) type = 'goldenSnack';

    const x = Phaser.Math.Between(30, GAME_WIDTH - 30);
    const item = this.items.create(x, -30, type);
    item.itemType = type;
    fitToHeight(item, SIZES[type]);
    item.body.setSize(item.width * 0.8, item.height * 0.8);
    item.setVelocityY(difficulty.fallSpeed);
    item.setDepth(5);
    if (type !== 'bomb') item.setAngularVelocity(Phaser.Math.Between(-90, 90));
  }

  handleItem(alex, item) {
    if (!item.active || this.isGameOver) return;
    const { x, itemType } = item;
    item.destroy();

    if (itemType === 'bomb') {
      this.hitBomb(x);
      return;
    }

    const points = SCORE[itemType];
    this.score += points;
    this.updateHud();
    this.alex.eat();
    this.sparkles.explode(itemType === 'goldenSnack' ? 18 : 8, this.alex.x, this.alex.y - 35);
    floatingText(this, this.alex.x, this.alex.y - 60, `+${points}`, itemType === 'goldenSnack' ? '#f0a500' : COLORS.pink);
  }

  hitBomb(x) {
    this.health -= 1;
    this.updateHud();
    this.alex.flashHurt();
    this.cameras.main.shake(200, 0.01);
    floatingText(this, x, this.alex.y - 60, '아야! 💥', '#ff5c7a');

    if (this.health <= 0) this.gameOver();
  }

  // ---------------- 고양이 ----------------
  spawnCat(difficulty) {
    const cat = new Cat(this, {
      fromLeft: Math.random() < 0.5,
      speed: difficulty.catSpeed,
      jumpWidth: difficulty.catJumpWidth,
    });
    this.cats.add(cat);
  }

  handleCat(alex, cat) {
    if (cat.hasHit || this.isGameOver) return;
    cat.hasHit = true; // 이 고양이와는 다시 부딪히지 않아요

    if (this.alex.slowDown()) {
      floatingText(this, this.alex.x, this.alex.y - 75, '어지러워~', '#8a7aff', 20);
    }
    floatingText(this, cat.x, cat.y - 40, '냥!', '#ff9a3c', 22);
  }

  // ---------------- 레벨업 ----------------
  levelUp(newLevel) {
    this.level = newLevel;
    this.updateHud();

    const text = this.add
      .text(GAME_WIDTH / 2, 260, `레벨 ${this.level}! 🐾`, textStyle(44, COLORS.accent, { stroke: '#ffffff', strokeThickness: 8 }))
      .setOrigin(0.5)
      .setDepth(40)
      .setScale(0.5);
    this.tweens.add({
      targets: text,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
      hold: 700,
      yoyo: true,
      onComplete: () => text.destroy(),
    });
  }

  // ---------------- 게임 종료 ----------------
  gameOver() {
    this.isGameOver = true;
    this.physics.pause();
    this.alex.setTint(0xb0a8b9);
    const isNewBest = saveBestScore(this.score);

    this.time.delayedCall(800, () => {
      this.scene.start('GameOverScene', { score: this.score, isNewBest });
    });
  }
}
