import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.js';
import { textStyle } from '../utils/ui.js';

const GAUGE = { x: GAME_WIDTH / 2 - 100, y: 138, width: 200, height: 14 };

// 🔥 피버타임 화면 연출: FEVER TIME! 글자, 남은 시간 게이지, 가장자리 금빛
// 번쩍임이나 흔들림 없이 은은하게 나타났다 사라져요.
export default class FeverUI {
  constructor(scene) {
    this.scene = scene;
    this.breathTween = null;
    this.pulseTween = null;

    // 화면 가장자리 금빛 (안쪽으로 갈수록 옅어져요)
    this.glow = scene.add.graphics().setDepth(34).setAlpha(0);
    for (let i = 0; i < 6; i++) {
      const inset = i * 5;
      this.glow.lineStyle(10, 0xffd66b, 0.24 - i * 0.038);
      this.glow.strokeRoundedRect(inset, inset, GAME_WIDTH - inset * 2, GAME_HEIGHT - inset * 2, 26);
    }

    this.title = scene.add
      .text(GAME_WIDTH / 2, 114, 'FEVER TIME!', textStyle(30, COLORS.gold, { stroke: COLORS.navy, strokeThickness: 7 }))
      .setOrigin(0.5)
      .setDepth(36)
      .setAlpha(0);

    this.gauge = scene.add.graphics().setDepth(36).setAlpha(0);
  }

  show() {
    const { tweens } = this.scene;
    this.stopLoops();
    this.update(1);

    this.title.setScale(0.6);
    tweens.add({ targets: this.title, alpha: 1, scale: 1, duration: 350, ease: 'Back.easeOut' });
    tweens.add({ targets: this.gauge, alpha: 1, duration: 300 });
    tweens.add({
      targets: this.glow,
      alpha: 1,
      duration: 400,
      onComplete: () => {
        // 금빛이 천천히 숨 쉬듯 밝아졌다 옅어져요
        this.breathTween = tweens.add({ targets: this.glow, alpha: 0.55, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      },
    });
    this.pulseTween = tweens.add({ targets: this.title, scale: 1.06, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 350 });
  }

  // ratio: 남은 시간 비율 (1 → 0)
  update(ratio) {
    const { x, y, width, height } = GAUGE;
    const g = this.gauge;
    g.clear();
    g.fillStyle(0x1f2d5a, 0.9);
    g.fillRoundedRect(x - 3, y - 3, width + 6, height + 6, (height + 6) / 2);
    g.lineStyle(2, 0xe9c77b, 1);
    g.strokeRoundedRect(x - 3, y - 3, width + 6, height + 6, (height + 6) / 2);
    const fillWidth = Math.max(0, width * ratio);
    if (fillWidth > 1) {
      g.fillStyle(0xffd66b, 1);
      g.fillRoundedRect(x, y, fillWidth, height, Math.min(height / 2, fillWidth / 2));
    }
  }

  hide() {
    this.stopLoops();
    this.scene.tweens.add({ targets: [this.glow, this.title, this.gauge], alpha: 0, duration: 450 });
  }

  stopLoops() {
    if (this.breathTween) this.breathTween.stop();
    if (this.pulseTween) this.pulseTween.stop();
    this.breathTween = null;
    this.pulseTween = null;
  }
}
