import Phaser from 'phaser';
import { GAME_WIDTH, WALL_Y, SIZES, COLORS } from '../config.js';
import { drawBackground } from '../utils/background.js';
import { textStyle, fitToHeight, createButton, drawCard, createBestScoreBadge } from '../utils/ui.js';
import { getBestRecord } from '../utils/storage.js';
import { setupCamera } from '../utils/display.js';
import { TEXTURE_SCALE } from '../utils/placeholderTextures.js';

// 🏠 시작 화면
export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  init() {
    this.starting = false;
  }

  create() {
    setupCamera(this);
    const cx = GAME_WIDTH / 2;
    drawBackground(this);

    // 제목 (네이비 글씨 + 흰 테두리)
    const titleStyle = textStyle(68, COLORS.navy, {
      stroke: '#ffffff',
      strokeThickness: 12,
      shadow: { offsetX: 0, offsetY: 5, color: 'rgba(31, 45, 90, 0.35)', blur: 6, stroke: true, fill: false },
    });
    const title1 = this.add.text(cx, 92, '알렉스의', titleStyle).setOrigin(0.5);
    const title2 = this.add.text(cx, 170, '냠냠캐치', titleStyle).setOrigin(0.5);
    const subtitle = this.add
      .text(cx, 234, 'Snacky Alex!', textStyle(28, COLORS.navy, { stroke: '#ffffff', strokeThickness: 6 }))
      .setOrigin(0.5);
    this.tweens.add({ targets: [title1, title2, subtitle], y: '+=6', duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // 제목 주변 장식
    this.add.image(410, 52, 'paw').setTint(0xffffff).setScale(0.8 / TEXTURE_SCALE).setAngle(20);
    this.add.image(436, 74, 'paw').setTint(0xffffff).setScale(0.55 / TEXTURE_SCALE).setAngle(35);
    const bone = fitToHeight(this.add.image(430, 168, 'snack'), 26).setAngle(-35);
    this.tweens.add({ targets: bone, angle: -20, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // 돌담 위로 고개를 내민 알렉스
    const alexHeight = 210;
    const alex = fitToHeight(this.add.image(cx, WALL_Y + 18 - alexHeight / 2, 'alex'), alexHeight);
    this.tweens.add({ targets: alex, scaleY: alex.scaleY * 1.025, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // 시작 버튼
    createButton(this, cx, 502, '게임 시작  ›', () => this.startGame(), { width: 300, height: 70, fontSize: 32, paws: true });

    // 아이템 안내 카드
    this.createGuideCard(44, 566, GAME_WIDTH - 88, 96);

    // 최고 점수
    createBestScoreBadge(this, cx, 698, getBestRecord());

    // 키보드로도 시작할 수 있어요
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    this.input.keyboard.once('keydown-ENTER', () => this.startGame());
  }

  createGuideCard(x, y, width, height) {
    drawCard(this, x, y, width, height, 18);

    const items = [
      { key: 'snack', size: 22, name: '일반 간식', value: '+10', color: COLORS.navy },
      { key: 'goldenSnack', size: 24, name: '황금 간식', value: '+30', color: COLORS.navy },
      { key: 'chocolate', size: 30, name: '초콜릿', value: '♥ -1', color: COLORS.pink },
      { key: 'cat', size: 40, name: '토라', value: '♥-1 느림', color: COLORS.pink },
      { key: 'arrowKeys', size: 22, name: 'PC ← →', value: '폰: 드래그', color: COLORS.accent, small: true },
    ];
    const columnWidth = width / items.length;

    const lines = this.add.graphics();
    lines.lineStyle(1.5, 0xead9bb, 1);
    items.forEach((item, i) => {
      const cx = x + columnWidth * (i + 0.5);
      if (i > 0) lines.lineBetween(x + columnWidth * i, y + 14, x + columnWidth * i, y + height - 14);

      fitToHeight(this.add.image(cx, y + 28, item.key), item.size);
      this.add.text(cx, y + 59, item.name, textStyle(13, COLORS.text)).setOrigin(0.5);
      this.add.text(cx, y + 78, item.value, textStyle(item.small ? 12 : 15, item.color)).setOrigin(0.5);
    });

    // 황금 간식 반짝이
    const sparkle = this.add.image(x + columnWidth * 1.5 + 18, y + 16, 'sparkle').setTint(0xffc93c).setScale(0.8 / TEXTURE_SCALE);
    this.tweens.add({ targets: sparkle, scale: 0.3 / TEXTURE_SCALE, alpha: 0.4, duration: 600, yoyo: true, repeat: -1 });
  }

  startGame() {
    if (this.starting) return;
    this.starting = true;
    this.scene.start('GameScene');
  }
}
