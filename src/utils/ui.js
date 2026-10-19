import { FONT, COLORS } from '../config.js';
import { RENDER_SCALE } from './display.js';
import { TEXTURE_SCALE } from './placeholderTextures.js';

// 글자 스타일을 간단하게 만들어 주는 도우미
export function textStyle(size, color = COLORS.text, extra = {}) {
  return {
    fontFamily: FONT,
    fontSize: `${size}px`,
    color,
    resolution: Math.max(2, Math.ceil(RENDER_SCALE)), // 글자를 선명하게
    ...extra,
  };
}

// 이미지의 원래 크기와 상관없이 원하는 높이로 맞춰요 (PNG 교체 대비)
export function fitToHeight(gameObject, height) {
  gameObject.setScale(height / gameObject.height);
  return gameObject;
}

// 둥근 네이비 버튼 (금색 테두리)
export function createButton(scene, x, y, label, onClick, options = {}) {
  const { width = 260, height = 64, fontSize = 28, paws = false } = options;
  const r = height / 2;

  const bg = scene.add.graphics();
  bg.fillStyle(0x0f1a3d, 0.5);
  bg.fillRoundedRect(-width / 2, -height / 2 + 6, width, height, r);
  bg.fillStyle(0x1f2d5a, 1);
  bg.fillRoundedRect(-width / 2, -height / 2, width, height, r);
  bg.lineStyle(3, 0xe9c77b, 1);
  bg.strokeRoundedRect(-width / 2, -height / 2, width, height, r);

  const parts = [bg, scene.add.text(0, -1, label, textStyle(fontSize, '#ffffff')).setOrigin(0.5)];
  if (paws) {
    parts.push(scene.add.image(-width / 2 + 36, 0, 'paw').setTint(0x5d73b8).setScale(0.7 / TEXTURE_SCALE));
    parts.push(scene.add.image(width / 2 - 36, 0, 'paw').setTint(0x5d73b8).setScale(0.7 / TEXTURE_SCALE));
  }

  const button = scene.add.container(x, y, parts);
  button.setSize(width, height);
  button.setInteractive({ useHandCursor: true });

  let clicked = false;
  button.on('pointerover', () => scene.tweens.add({ targets: button, scale: 1.05, duration: 100 }));
  button.on('pointerout', () => scene.tweens.add({ targets: button, scale: 1, duration: 100 }));
  button.on('pointerdown', () => button.setScale(0.95));
  button.on('pointerup', () => {
    if (clicked) return; // 두 번 눌림 방지
    clicked = true;
    onClick();
  });

  return button;
}

// 크림색 카드 배경
export function drawCard(scene, x, y, width, height, radius = 22) {
  const g = scene.add.graphics();
  g.fillStyle(0x6b5a45, 0.25);
  g.fillRoundedRect(x, y + 5, width, height, radius);
  g.fillStyle(0xfff8ec, 0.96);
  g.fillRoundedRect(x, y, width, height, radius);
  g.lineStyle(2, 0xead9bb, 1);
  g.strokeRoundedRect(x, y, width, height, radius);
  return g;
}

// 네이비 알약 모양 최고 점수 표시
export function createBestScoreBadge(scene, x, y, best) {
  const width = 280;
  const height = 36;
  const g = scene.add.graphics();
  g.fillStyle(0x1f2d5a, 1);
  g.fillRoundedRect(x - width / 2, y - height / 2, width, height, height / 2);
  g.lineStyle(2, 0xe9c77b, 1);
  g.strokeRoundedRect(x - width / 2, y - height / 2, width, height, height / 2);
  // best: { score, level }
  const label = best.score > 0 ? `🏆 최고 점수: ${best.score}  ·  Lv.${best.level}` : '🏆 최고 점수: 0';
  return scene.add.text(x, y, label, textStyle(19, COLORS.gold)).setOrigin(0.5);
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
