import Phaser from 'phaser';
import { GAME_WIDTH, SIZES, COLORS } from '../config.js';
import { drawBackground } from '../utils/background.js';
import { textStyle, fitToHeight, createButton } from '../utils/ui.js';
import { getBestScore } from '../utils/storage.js';

// 🏠 시작 화면
export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    const cx = GAME_WIDTH / 2;
    drawBackground(this);

    // 제목
    const title = this.add
      .text(cx, 140, '알렉스의\n냠냠캐치', textStyle(56, COLORS.pink, { align: 'center', stroke: '#ffffff', strokeThickness: 10, lineSpacing: -6 }))
      .setOrigin(0.5);
    const subtitle = this.add
      .text(cx, 222, 'Snacky Alex! 🐾', textStyle(26, COLORS.accent, { stroke: '#ffffff', strokeThickness: 6 }))
      .setOrigin(0.5);
    this.tweens.add({ targets: [title, subtitle], y: '+=10', duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // 알렉스
    const alex = fitToHeight(this.add.image(cx, 335, 'alex'), 140);
    this.tweens.add({ targets: alex, y: 323, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // 시작 버튼
    createButton(this, cx, 455, '게임 시작', () => this.startGame());

    // 아이템 설명
    const legend = [
      ['snack', SIZES.snack, '+10'],
      ['goldenSnack', SIZES.goldenSnack, '+30'],
      ['bomb', 36, '체력 -1'],
      ['cat', 56, '느려짐'],
    ];
    legend.forEach(([key, size, label], i) => {
      const x = 75 + i * 110;
      fitToHeight(this.add.image(x, 540, key), size);
      this.add.text(x, 578, label, textStyle(18)).setOrigin(0.5);
    });

    // 조작법
    this.add
      .text(cx, 630, 'PC: ← → 방향키   |   모바일: 드래그 또는 ◀ ▶\n🐱 고양이는 점선(점프) 아래로 피하세요!', textStyle(16, COLORS.text, { align: 'center', lineSpacing: 6 }))
      .setOrigin(0.5);

    this.add.text(cx, 696, `🏆 최고 점수: ${getBestScore()}`, textStyle(18, COLORS.accent)).setOrigin(0.5);

    // 키보드로도 시작할 수 있어요
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    this.input.keyboard.once('keydown-ENTER', () => this.startGame());
  }

  startGame() {
    if (this.starting) return;
    this.starting = true;
    this.scene.start('GameScene');
  }

  init() {
    this.starting = false;
  }
}
