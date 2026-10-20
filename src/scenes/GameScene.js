import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER, SIZES, SCORE, START_HEALTH, LEVEL_UP_MS, FALL, CAT, FEVER, COLORS } from '../config.js';
import Alex from '../objects/Alex.js';
import Cat from '../objects/Cat.js';
import FeverUI from '../objects/FeverUI.js';
import { audio } from '../utils/audio.js';
import { drawBackground } from '../utils/background.js';
import { textStyle, fitToHeight, floatingText, createMusicButton } from '../utils/ui.js';
import { getBestRecord, saveBestRecord } from '../utils/storage.js';
import { setupCamera } from '../utils/display.js';
import { TEXTURE_SCALE } from '../utils/placeholderTextures.js';

// 🎮 실제 게임 플레이 장면
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    setupCamera(this);

    // 게임 상태 (다시 시작할 때마다 초기화)
    this.score = 0;
    this.best = getBestRecord(); // { score, level }
    this.health = START_HEALTH;
    this.level = 1;
    this.elapsed = 0;
    this.itemTimer = 0;
    this.catTimer = 0;
    this.nextCatDelay = CAT.firstDelay;
    this.isGameOver = false;
    this.feverActive = false;
    this.feverTimer = null;

    // 조작 상태
    this.touchLeft = false;
    this.touchRight = false;
    this.dragPointerId = null;
    this.dragTargetX = null;

    drawBackground(this);

    this.alex = new Alex(this, GAME_WIDTH / 2, PLAYER.y);
    this.items = this.physics.add.group(); // 떨어지는 간식/초콜릿
    this.cats = this.physics.add.group({ runChildUpdate: true }); // 고양이들

    this.physics.add.overlap(this.alex, this.items, this.handleItem, null, this);
    this.physics.add.overlap(this.alex, this.cats, this.handleCat, null, this);

    // 간식 먹을 때 반짝이 효과
    this.sparkles = this.add
      .particles(0, 0, 'sparkle', {
        speed: { min: 80, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 1 / TEXTURE_SCALE, end: 0 },
        lifespan: 500,
        tint: [0xffe066, 0xff9ecb, 0xffffff, 0x9ed8ff],
        emitting: false,
      })
      .setDepth(20);

    this.createHud();
    this.createControls();
    this.feverUi = new FeverUI(this);
  }

  // ---------------- 화면 상단 정보 (점수/레벨/체력) ----------------
  createHud() {
    const bar = this.add.graphics().setDepth(30);
    bar.fillStyle(0x1f2d5a, 0.88);
    bar.fillRoundedRect(10, 10, GAME_WIDTH - 20, 50, 25);
    bar.lineStyle(2, 0xe9c77b, 1);
    bar.strokeRoundedRect(10, 10, GAME_WIDTH - 20, 50, 25);

    this.scoreText = this.add.text(30, 35, '점수 0', textStyle(23, '#ffffff')).setOrigin(0, 0.5).setDepth(31);
    this.levelText = this.add.text(GAME_WIDTH / 2 + 10, 35, 'Lv.1', textStyle(23, COLORS.gold)).setOrigin(0.5).setDepth(31);
    this.bestText = this.add
      .text(22, 76, '', textStyle(16, '#ffffff', { stroke: COLORS.navy, strokeThickness: 4 }))
      .setOrigin(0, 0.5)
      .setDepth(31);

    this.hearts = [];
    for (let i = 0; i < START_HEALTH; i++) {
      this.hearts.push(this.add.image(GAME_WIDTH - 38 - i * 32, 35, 'heart').setScale(1 / TEXTURE_SCALE).setDepth(31));
    }
    this.updateHud();
  }

  updateHud() {
    // 지금 점수가 최고 점수를 넘으면 최고 점수도 바로 바뀌어요
    if (this.score > this.best.score) this.best = { score: this.score, level: this.level };
    this.scoreText.setText(`점수 ${this.score}`);
    this.levelText.setText(`Lv.${this.level}`);
    this.bestText.setText(this.best.score > 0 ? `🏆 최고 ${this.best.score} · Lv.${this.best.level}` : '🏆 최고 0');
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

    // 일시정지 버튼 (오른쪽 위) + Esc 키
    this.createPauseButton(GAME_WIDTH - 32, 84);
    createMusicButton(this, GAME_WIDTH - 76, 84); // 음악 켜기/끄기
    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.events.on('resume', this.onResume, this);
    this.events.once('shutdown', () => this.events.off('resume', this.onResume, this));

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

  createPauseButton(x, y) {
    const button = this.add.circle(x, y, 18, 0x1f2d5a, 0.85).setStrokeStyle(2, 0xe9c77b).setDepth(30);
    button.setInteractive({ useHandCursor: true });
    const icon = this.add.graphics().setDepth(31);
    icon.fillStyle(0xffffff, 1);
    icon.fillRoundedRect(x - 7, y - 8, 5, 16, 2);
    icon.fillRoundedRect(x + 2, y - 8, 5, 16, 2);
    button.on('pointerup', () => this.pauseGame());
  }

  // 게임을 멈추고 일시정지 창을 띄워요
  pauseGame() {
    if (this.isGameOver || this.scene.isPaused()) return;
    this.scene.launch('PauseScene');
    this.scene.pause();
  }

  // 다시 이어할 때: 멈춰 있던 동안 눌린 버튼/키 상태를 초기화
  onResume() {
    this.touchLeft = false;
    this.touchRight = false;
    this.dragPointerId = null;
    this.dragTargetX = null;
    this.input.keyboard.resetKeys();
  }

  createTouchButton(x, side) {
    const y = GAME_HEIGHT - 28;
    const button = this.add.circle(x, y, 26, 0x1f2d5a, 0.75).setStrokeStyle(3, 0xe9c77b).setDepth(30).setInteractive();
    this.add.text(x, y, side === 'left' ? '◀' : '▶', textStyle(22, '#ffffff')).setOrigin(0.5).setDepth(31);

    const setPressed = (pressed) => {
      if (side === 'left') this.touchLeft = pressed;
      else this.touchRight = pressed;
      button.setFillStyle(0x1f2d5a, pressed ? 1 : 0.75);
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
      chocolateChance: Math.min(FALL.maxChocolateChance, FALL.baseChocolateChance + n * FALL.chocolateChancePerLevel),
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

    // 간식/초콜릿 떨어뜨리기 (피버타임에는 3배 자주)
    const spawnInterval = this.feverActive ? difficulty.spawnInterval / FEVER.spawnMultiplier : difficulty.spawnInterval;
    this.itemTimer += ms;
    if (this.itemTimer >= spawnInterval) {
      this.itemTimer = 0;
      this.spawnItem(difficulty);
    }

    if (this.feverActive) {
      // 피버타임: 고양이는 나오지 않고, 남은 시간 게이지만 줄어들어요
      this.feverUi.update(this.feverTimer.getRemaining() / FEVER.durationMs);
    } else {
      // 고양이 등장
      this.catTimer += ms;
      if (this.catTimer >= this.nextCatDelay) {
        this.catTimer = 0;
        this.spawnCat(difficulty);
        this.nextCatDelay = difficulty.catInterval * Phaser.Math.FloatBetween(0.8, 1.2);
      }
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
  // 무엇을 떨어뜨릴지 정해요
  chooseItemType(difficulty) {
    const roll = Math.random();
    if (this.feverActive) {
      // 피버타임: 사료가 대부분, 나머지는 일반/황금 간식 (초콜릿·황금 발바닥 없음)
      if (roll < FEVER.kibbleRatio) return 'kibble';
      return Math.random() < FALL.goldenChance ? 'goldenSnack' : 'snack';
    }
    if (roll < FEVER.pawChance) return 'goldenPaw';
    if (roll < FEVER.pawChance + difficulty.chocolateChance) return 'chocolate';
    if (roll < FEVER.pawChance + difficulty.chocolateChance + FALL.goldenChance) return 'goldenSnack';
    return 'snack';
  }

  spawnItem(difficulty) {
    const type = this.chooseItemType(difficulty);
    const x = Phaser.Math.Between(30, GAME_WIDTH - 30);
    const item = this.items.create(x, -30, type);
    item.itemType = type;
    fitToHeight(item, SIZES[type]);
    item.body.setSize(item.width * 0.8, item.height * 0.8);
    item.setDepth(5);
    if (type === 'goldenPaw') {
      item.setVelocityY(difficulty.fallSpeed * 0.85); // 황금 발바닥은 조금 천천히
    } else {
      item.setVelocityY(difficulty.fallSpeed);
      item.setAngularVelocity(Phaser.Math.Between(-90, 90));
    }
  }

  handleItem(alex, item) {
    if (!item.active || this.isGameOver) return;
    const { x, itemType } = item;
    item.destroy();

    if (itemType === 'chocolate') {
      audio.play('hurt');
      floatingText(this, x, this.alex.y - 60, '초콜릿은 안 돼! 🍫', '#ff5c7a', 22);
      this.loseHealth(1);
      return;
    }

    if (itemType === 'goldenPaw') {
      this.alex.eat();
      this.sparkles.explode(24, this.alex.x, this.alex.y - 35);
      if (this.feverActive) this.addScore(SCORE.snack, '#f0a500'); // 피버 중엔 중복 발동 없이 점수만
      else this.startFever();
      return;
    }

    this.alex.eat();
    if (itemType === 'kibble') {
      audio.play('kibble');
      this.sparkles.explode(3, this.alex.x, this.alex.y - 35);
      this.addScore(SCORE.kibble, '#c27a3a', 18);
    } else if (itemType === 'goldenSnack') {
      audio.play('golden');
      this.sparkles.explode(18, this.alex.x, this.alex.y - 35);
      this.addScore(SCORE.goldenSnack, '#f0a500');
    } else {
      audio.play('snack');
      this.sparkles.explode(8, this.alex.x, this.alex.y - 35);
      this.addScore(SCORE.snack, COLORS.pink);
    }
  }

  addScore(points, color, size = 24) {
    this.score += points;
    this.updateHud();
    floatingText(this, this.alex.x + Phaser.Math.Between(-12, 12), this.alex.y - 60, `+${points}`, color, size);
  }

  // 부딪히지 않게 하고 살며시 사라지게 (피버 시작 때 초콜릿 정리용)
  fadeAwayItem(item) {
    item.itemType = null;
    item.body.enable = false;
    this.tweens.add({ targets: item, alpha: 0, scale: item.scale * 0.5, duration: 250, onComplete: () => item.destroy() });
  }

  // ---------------- 피버타임 ----------------
  startFever() {
    if (this.feverActive || this.isGameOver) return; // 중복 발동 방지
    this.feverActive = true;
    audio.play('feverStart');
    audio.playMusic('fever');
    this.alex.setFever(true);
    this.feverUi.show();

    // 이미 나온 고양이와 초콜릿, 황금 발바닥은 살며시 사라져요
    this.cats.getChildren().slice().forEach((cat) => cat.fadeAway());
    this.items.getChildren().slice().forEach((item) => {
      if (item.itemType === 'chocolate' || item.itemType === 'goldenPaw') this.fadeAwayItem(item);
    });

    this.itemTimer = 0;
    this.feverTimer = this.time.delayedCall(FEVER.durationMs, () => this.endFever());
  }

  endFever() {
    if (!this.feverActive) return;
    this.feverActive = false;
    this.feverTimer = null;
    if (this.isGameOver) return;

    audio.play('feverEnd');
    audio.playMusic('game');
    this.alex.setFever(false);
    this.feverUi.hide();

    // 피버가 끝나자마자 고양이가 나오지 않도록 잠깐 쉬는 시간
    this.catTimer = 0;
    this.nextCatDelay = Math.max(FEVER.catBreakMs, this.getDifficulty().catInterval * 0.5);
  }

  // 하트 감소 (초콜릿, 고양이 공통)
  loseHealth(amount) {
    this.health = Math.max(0, this.health - amount);
    this.updateHud();
    this.alex.flashHurt();
    this.cameras.main.shake(200, 0.01);

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
    audio.play('catHit');

    if (this.alex.slowDown()) {
      floatingText(this, this.alex.x, this.alex.y - 75, '어지러워~', '#8a7aff', 20);
    }
    floatingText(this, cat.x, cat.y - 40, '냥!', '#ff9a3c', 22);
    this.loseHealth(CAT.damage);
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
    if (this.feverTimer) this.feverTimer.remove();
    this.feverActive = false;
    this.feverTimer = null;
    audio.stopMusic(); // 배경음악을 서서히 끄고
    audio.play('gameOver'); // 게임오버 효과음
    this.physics.pause();
    this.alex.setTint(0xb0a8b9);
    const isNewBest = saveBestRecord(this.score, this.level);

    this.time.delayedCall(800, () => {
      this.scene.start('GameOverScene', { score: this.score, level: this.level, isNewBest });
    });
  }
}
