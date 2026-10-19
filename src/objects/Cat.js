import Phaser from 'phaser';
import { GAME_WIDTH, GROUND_Y, SIZES, CAT } from '../config.js';
import { fitToHeight, textStyle } from '../utils/ui.js';

const CAT_Y = GROUND_Y - SIZES.cat / 2 + 2; // 고양이가 땅 위를 걷는 높이

// 🐱 고양이 장애물
// 화면 한쪽에서 나와 반대편으로 가로지르고, 중간에 한 번 크게 점프해요.
// 점선으로 표시된 점프 구간 아래에 있으면 안전!
export default class Cat extends Phaser.Physics.Arcade.Image {
  constructor(scene, { fromLeft, speed, jumpWidth }) {
    const startX = fromLeft ? -60 : GAME_WIDTH + 60;
    super(scene, startX, CAT_Y, 'cat');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 점프 그림이 없으면 기본 그림을 그대로 사용
    this.jumpTexture = scene.textures.exists('catJump') ? 'catJump' : 'cat';
    this.isJumping = false;
    fitToHeight(this, SIZES.cat);
    this.body.setSize(this.width * 0.55, this.height * 0.55);
    this.setDepth(9);

    this.direction = fromLeft ? 1 : -1;
    this.setFlipX(!fromLeft); // 그림이 오른쪽을 본다고 가정하고, 왼쪽으로 갈 땐 뒤집어요
    this.speed = speed;
    this.hasHit = false; // 같은 고양이와는 한 번만 부딪혀요

    // 점프 구간을 랜덤으로 정해요
    const half = jumpWidth / 2;
    const center = Phaser.Math.Between(Math.ceil(half + 40), Math.floor(GAME_WIDTH - half - 40));
    this.jumpLeft = center - half;
    this.jumpRight = center + half;
    this.jumpDone = false;

    this.shadow = scene.add.ellipse(startX, GROUND_Y + 2, 46, 10, 0x000000, 0.12).setDepth(8);
    this.trail = scene.add.graphics().setDepth(7);
    this.drawTrail();
    this.showWarning(fromLeft);
  }

  // 점프 경로를 점선으로 미리 보여줘요
  drawTrail() {
    this.trail.fillStyle(0xffa94d, 0.45);
    for (let i = 0; i <= 14; i++) {
      const p = i / 14;
      const x = this.jumpLeft + p * (this.jumpRight - this.jumpLeft);
      const y = CAT_Y - Math.sin(Math.PI * p) * CAT.jumpHeight;
      this.trail.fillCircle(x, y, 3);
    }
  }

  // 고양이가 나오는 쪽에 ❗ 표시
  showWarning(fromLeft) {
    const warning = this.scene.add
      .text(fromLeft ? 22 : GAME_WIDTH - 22, CAT_Y - 45, '❗', textStyle(26))
      .setOrigin(0.5)
      .setDepth(30);
    this.scene.tweens.add({
      targets: warning,
      alpha: 0.2,
      duration: 150,
      yoyo: true,
      repeat: 3,
      onComplete: () => warning.destroy(),
    });
  }

  // 걷는 그림 ↔ 점프 그림 바꾸기
  setJumping(jumping) {
    if (this.isJumping === jumping) return;
    this.isJumping = jumping;
    this.setTexture(jumping ? this.jumpTexture : 'cat');
    fitToHeight(this, SIZES.cat);
  }

  update(time, delta) {
    if (this.scene.isGameOver) return;
    const dt = Math.min(delta, 50) / 1000;
    this.x += this.direction * this.speed * dt;

    let lift;
    const inJump = this.x > this.jumpLeft && this.x < this.jumpRight;
    this.setJumping(inJump);
    if (inJump) {
      // 점프 중: 포물선처럼 위로 올라갔다 내려와요
      const p = (this.x - this.jumpLeft) / (this.jumpRight - this.jumpLeft);
      lift = Math.sin(Math.PI * p) * CAT.jumpHeight;
      const rising = this.direction > 0 ? p < 0.5 : p > 0.5;
      this.angle = this.direction * (rising ? -10 : 10);
    } else {
      // 걷는 중: 통통 튀는 걸음
      lift = Math.abs(Math.sin(this.x / 14)) * 4;
      this.angle = 0;
    }
    this.y = CAT_Y - lift;
    this.shadow.setPosition(this.x, GROUND_Y + 2).setScale(1 - (lift / CAT.jumpHeight) * 0.5);

    // 점프를 마치면 점선을 지워요
    const passedJump = this.direction > 0 ? this.x >= this.jumpRight : this.x <= this.jumpLeft;
    if (passedJump && !this.jumpDone) {
      this.jumpDone = true;
      this.scene.tweens.add({ targets: this.trail, alpha: 0, duration: 300 });
    }

    // 화면 반대편으로 나가면 사라져요
    if ((this.direction > 0 && this.x > GAME_WIDTH + 70) || (this.direction < 0 && this.x < -70)) {
      this.destroy();
    }
  }

  destroy(fromScene) {
    if (this.shadow) this.shadow.destroy();
    if (this.trail) this.trail.destroy();
    super.destroy(fromScene);
  }
}
