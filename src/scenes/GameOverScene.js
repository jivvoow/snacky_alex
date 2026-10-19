import Phaser from 'phaser';
import { GAME_WIDTH, COLORS } from '../config.js';
import { drawBackground } from '../utils/background.js';
import { textStyle, fitToHeight, createButton, drawCard, createBestScoreBadge } from '../utils/ui.js';
import { getBestRecord } from '../utils/storage.js';
import { setupCamera } from '../utils/display.js';

// 🏁 게임오버 화면
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalLevel = data.level || 1;
    this.isNewBest = data.isNewBest || false;
    this.leaving = false;
  }

  create() {
    setupCamera(this);
    const cx = GAME_WIDTH / 2;
    drawBackground(this);

    this.add
      .text(cx, 80, '게임 오버', textStyle(56, COLORS.navy, { stroke: '#ffffff', strokeThickness: 10 }))
      .setOrigin(0.5);

    drawCard(this, 50, 130, GAME_WIDTH - 100, 360, 28);
    fitToHeight(this.add.image(cx, 220, this.textures.exists('alexEat') ? 'alexEat' : 'alex'), 140);

    this.add.text(cx, 320, '최종 점수', textStyle(22, COLORS.text)).setOrigin(0.5);
    const scoreText = this.add.text(cx, 368, `${this.finalScore}`, textStyle(60, COLORS.pink)).setOrigin(0.5);
    this.add.text(cx, 415, `Lv.${this.finalLevel} 까지 도달!`, textStyle(20, COLORS.navy)).setOrigin(0.5);

    if (this.isNewBest && this.finalScore > 0) {
      const badge = this.add
        .text(cx + 100, 345, 'NEW!', textStyle(22, '#ffffff', { backgroundColor: '#f0a500', padding: { x: 8, y: 3 } }))
        .setOrigin(0.5)
        .setAngle(12);
      this.tweens.add({ targets: [badge, scoreText], scale: 1.1, duration: 400, yoyo: true, repeat: -1 });
      this.add.text(cx, 452, '🎉 최고 기록 달성!', textStyle(22, COLORS.accent)).setOrigin(0.5);
    } else {
      this.add.text(cx, 452, '조금만 더 힘내요! 🐾', textStyle(22, COLORS.accent)).setOrigin(0.5);
    }

    createButton(this, cx, 548, '다시 시작', () => this.goTo('GameScene'), { width: 280, height: 68, fontSize: 30, paws: true });

    const home = this.add
      .text(cx, 625, '처음으로', textStyle(22, '#ffffff', { stroke: COLORS.navy, strokeThickness: 5 }))
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    home.on('pointerup', () => this.goTo('StartScene'));

    createBestScoreBadge(this, cx, 690, getBestRecord());

    this.input.keyboard.once('keydown-SPACE', () => this.goTo('GameScene'));
    this.input.keyboard.once('keydown-ENTER', () => this.goTo('GameScene'));
  }

  goTo(sceneKey) {
    if (this.leaving) return;
    this.leaving = true;
    this.scene.start(sceneKey);
  }
}
