import Phaser from 'phaser';
import { GAME_WIDTH, PLAYER, SIZES, CAT } from '../config.js';
import { fitToHeight, textStyle } from '../utils/ui.js';

// 🐶 플레이어 캐릭터 알렉스
export default class Alex extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'alex');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 먹는 표정 그림이 없으면 기본 그림을 그대로 사용
    this.eatTexture = scene.textures.exists('alexEat') ? 'alexEat' : 'alex';

    this.setDepth(10);
    this.setFace(false);
    // 충돌 영역은 그림보다 조금 작게 (억울하지 않게)
    this.body.setSize(this.width * 0.62, this.height * 0.62);

    this.isSlowed = false;
    this.targetAngle = 0;
    this.eatTimer = null;
    this.slowTimer = null;
    this.flashTimer = null;
    this.hopTween = null;

    // 둔화 중 머리 위에 뜨는 🌀
    this.dizzy = scene.add.text(x, y, '🌀', textStyle(30)).setOrigin(0.5).setDepth(11).setVisible(false);
    this.dizzyTween = scene.tweens.add({ targets: this.dizzy, angle: 360, duration: 900, repeat: -1, paused: true });
  }

  getSpeed() {
    return this.isSlowed ? PLAYER.speed * CAT.slowFactor : PLAYER.speed;
  }

  // direction: -1(왼쪽) 또는 1(오른쪽)
  move(direction, dt) {
    const half = this.displayWidth / 2;
    this.x = Phaser.Math.Clamp(this.x + direction * this.getSpeed() * dt, half, GAME_WIDTH - half);
    this.targetAngle = direction * 6; // 움직일 때 살짝 기울어져요
  }

  // 드래그한 위치를 향해 이동
  moveToward(targetX, dt) {
    const diff = targetX - this.x;
    const step = this.getSpeed() * dt;
    if (Math.abs(diff) <= step) {
      this.move(Math.sign(diff), Math.abs(diff) / this.getSpeed());
    } else {
      this.move(Math.sign(diff), dt);
    }
  }

  setFace(eating) {
    this.setTexture(eating ? this.eatTexture : 'alex');
    fitToHeight(this, SIZES.alex);
  }

  // 간식 먹기: 먹는 표정 + 콩 뛰기
  eat() {
    this.setFace(true);
    if (this.eatTimer) this.eatTimer.remove();
    this.eatTimer = this.scene.time.delayedCall(PLAYER.eatFaceMs, () => this.setFace(false));

    if (this.hopTween) this.hopTween.stop();
    this.y = PLAYER.y;
    this.hopTween = this.scene.tweens.add({
      targets: this,
      y: PLAYER.y - 10,
      duration: 90,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
  }

  // 고양이와 부딪힘: 2초간 50% 둔화. 이미 둔화 중이면 아무 일도 없어요 (중첩 X, 시간 연장 X)
  slowDown() {
    if (this.isSlowed) return false;
    this.isSlowed = true;
    this.dizzy.setVisible(true);
    this.dizzyTween.resume();
    this.refreshTint();

    this.slowTimer = this.scene.time.delayedCall(CAT.slowMs, () => {
      this.isSlowed = false;
      this.dizzy.setVisible(false);
      this.dizzyTween.pause();
      this.refreshTint();
    });
    return true;
  }

  // 폭탄에 맞았을 때 빨갛게 깜빡
  flashHurt() {
    this.setTint(0xff8a8a);
    if (this.flashTimer) this.flashTimer.remove();
    this.flashTimer = this.scene.time.delayedCall(250, () => this.refreshTint());
  }

  refreshTint() {
    if (this.isSlowed) this.setTint(0xc9c3ff);
    else this.clearTint();
  }

  update() {
    this.angle += (this.targetAngle - this.angle) * 0.3;
    this.targetAngle = 0;
    this.dizzy.setPosition(this.x, this.y - this.displayHeight * 0.62);
  }
}
