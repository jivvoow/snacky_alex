import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.js';
import { setupCamera } from '../utils/display.js';
import { textStyle, createButton, drawCard } from '../utils/ui.js';
import { saveBestRecord } from '../utils/storage.js';

// ⏸ 일시정지 창: 게임 화면 위에 겹쳐서 보여줘요
export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  init() {
    this.leaving = false;
  }

  create() {
    setupCamera(this);
    const cx = GAME_WIDTH / 2;

    // 뒤의 게임 화면을 살짝 어둡게
    this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0f1a3d, 0.55).setInteractive(); // 뒤쪽 클릭 막기

    drawCard(this, 70, 220, GAME_WIDTH - 140, 270, 28);
    this.add.text(cx, 272, '잠깐 쉬어요 🐾', textStyle(32, COLORS.navy)).setOrigin(0.5);

    const game = this.scene.get('GameScene');
    this.add.text(cx, 318, `지금 점수 ${game.score}  ·  Lv.${game.level}`, textStyle(19, COLORS.text)).setOrigin(0.5);

    createButton(this, cx, 378, '계속하기', () => this.resumeGame(), { width: 230, height: 58, fontSize: 26 });

    const quit = this.add
      .text(cx, 445, '그만하기', textStyle(22, COLORS.pink))
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    quit.on('pointerup', () => this.quitGame());

    this.input.keyboard.once('keydown-ESC', () => this.resumeGame());
  }

  resumeGame() {
    if (this.leaving) return;
    this.leaving = true;
    this.scene.resume('GameScene');
    this.scene.stop();
  }

  // 지금 점수로 게임을 끝내고 결과 화면으로
  quitGame() {
    if (this.leaving) return;
    this.leaving = true;
    const game = this.scene.get('GameScene');
    const isNewBest = saveBestRecord(game.score, game.level);
    this.scene.stop('GameScene');
    this.scene.start('GameOverScene', { score: game.score, level: game.level, isNewBest });
  }
}
