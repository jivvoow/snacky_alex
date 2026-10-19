import { FONT, COLORS } from '../config.js';

// 글자 스타일을 간단하게 만들어 주는 도우미
export function textStyle(size, color = COLORS.text, extra = {}) {
  return {
    fontFamily: FONT,
    fontSize: `${size}px`,
    color,
    resolution: 2, // 글자를 선명하게
    ...extra,
  };
}

// 이미지의 원래 크기와 상관없이 원하는 높이로 맞춰요 (PNG 교체 대비)
export function fitToHeight(gameObject, height) {
  gameObject.setScale(height / gameObject.height);
  return gameObject;
}

// 둥글고 귀여운 버튼
export function createButton(scene, x, y, label, onClick, options = {}) {
  const { width = 220, height = 64, color = 0xff8fb8, shadowColor = 0xe2709c, fontSize = 28 } = options;

  const bg = scene.add.graphics();
  bg.fillStyle(shadowColor, 1);
  bg.fillRoundedRect(-width / 2, -height / 2 + 5, width, height, height / 2);
  bg.fillStyle(color, 1);
  bg.fillRoundedRect(-width / 2, -height / 2, width, height, height / 2);

  const text = scene.add.text(0, -1, label, textStyle(fontSize, '#ffffff')).setOrigin(0.5);

  const button = scene.add.container(x, y, [bg, text]);
  button.setSize(width, height);
  button.setInteractive({ useHandCursor: true });

  let clicked = false;
  button.on('pointerover', () => scene.tweens.add({ targets: button, scale: 1.06, duration: 100 }));
  button.on('pointerout', () => scene.tweens.add({ targets: button, scale: 1, duration: 100 }));
  button.on('pointerdown', () => button.setScale(0.95));
  button.on('pointerup', () => {
    if (clicked) return; // 두 번 눌림 방지
    clicked = true;
    onClick();
  });

  return button;
}

// 점수 등이 둥실 떠오르며 사라지는 글자
export function floatingText(scene, x, y, message, color = COLORS.pink, size = 24) {
  const text = scene.add
    .text(x, y, message, textStyle(size, color, { stroke: '#ffffff', strokeThickness: 5 }))
    .setOrigin(0.5)
    .setDepth(40);
  scene.tweens.add({
    targets: text,
    y: y - 45,
    alpha: 0,
    duration: 700,
    ease: 'Quad.easeOut',
    onComplete: () => text.destroy(),
  });
}
