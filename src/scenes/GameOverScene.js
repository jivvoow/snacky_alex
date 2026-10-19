import Phaser from 'phaser';
import { GAME_WIDTH, COLORS } from '../config.js';
import { drawBackground } from '../utils/background.js';
import { textStyle, fitToHeight, createButton } from '../utils/ui.js';
import { getBestScore } from '../utils/storage.js';

// 🏁 게임오버 화면
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.isNewBest = data.isNewBest || false;
    this.leaving = false;
  }

  create() {
    const cx = GAME_WIDTH / 2;
    drawBackground(this);

    // 하얀 카드
    const panel = this.add.graphics();
    panel.fillStyle(0xffffff, 0.85);
    panel.fillRoundedRect(50, 110, GAME_WIDTH - 100, 470, 30);

    this.add.text(cx, 160, '게임 오버', textStyle(44, COLORS.pink)).setOrigin(0.5);
    fitToHeight(this.add.image(cx, 260, this.textures.exists('alexEat') ? 'alexEat' : 'alex'), 110);

    this.add.text(cx, 345, '최종 점수', textStyle(22)).setOrigin(0.5);
    const scoreText = this.add.text(cx, 390, `${this.finalScore}`, textStyle(52, COLORS.pink)).setOrigin(0.5);
    this.add.text(cx, 450, `🏆 최고 점수: ${getBestScore()}`, textStyle(22, COLORS.accent)).setOrigin(0.5);

    if (this.isNewBest && this.finalScore > 0) {
      const badge = this.add
        .text(cx + 95, 370, 'NEW!', textStyle(22, '#ffffff', { backgroundColor: '#ffb84d', padding: { x: 8, y: 3 } }))
        .setOrigin(0.5)
        .setAngle(12);
      this.tweens.add({ targets: [badge, scoreText], scale: 1.12, duration: 400, yoyo: true, repeat: -1 });
    }

    createButton(this, cx, 525, '다시 시작', () => this.goTo('GameScene'));

    const home = this.add.text(cx, 620, '처음으로', textStyle(22, COLORS.text)).setOrigin(0.5).setInteractive({ useHandCursor: true });
    home.on('pointerup', () => this.goTo('StartScene'));

    this.input.keyboard.once('keydown-SPACE', () => this.goTo('GameScene'));
    this.input.keyboard.once('keydown-ENTER', () => this.goTo('GameScene'));
  }

  goTo(sceneKey) {
    if (this.leaving) return;
    this.leaving = true;
    this.scene.start(sceneKey);
  }
}
