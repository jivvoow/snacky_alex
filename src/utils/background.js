import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y } from '../config.js';

// 밝은 파스텔톤 배경 (하늘 + 구름 + 잔디)
export function drawBackground(scene) {
  const g = scene.add.graphics().setDepth(-10);

  // 하늘: 위는 연분홍, 아래는 연하늘
  g.fillGradientStyle(0xffeef5, 0xffeef5, 0xe2f3ff, 0xe2f3ff, 1);
  g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // 잔디
  g.fillStyle(0xc9eccb, 1);
  g.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
  g.fillStyle(0xb2e0b6, 1);
  g.fillRect(0, GROUND_Y, GAME_WIDTH, 5);

  // 잔디 위 작은 꽃
  const flowerColors = [0xffb3c9, 0xfff1a8, 0xd9c8ff];
  for (let i = 0; i < 9; i++) {
    const x = 25 + i * 54 + (i % 2) * 12;
    const y = GROUND_Y + 18 + (i % 3) * 10;
    g.fillStyle(flowerColors[i % 3], 1);
    g.fillCircle(x - 3, y, 3);
    g.fillCircle(x + 3, y, 3);
    g.fillCircle(x, y - 3, 3);
    g.fillCircle(x, y + 3, 3);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(x, y, 2);
  }

  // 천천히 흘러가는 구름
  const clouds = [
    [80, 110, 1],
    [360, 190, 0.8],
    [200, 320, 0.6],
  ];
  clouds.forEach(([x, y, scale], i) => {
    const cloud = scene.add.image(x, y, 'cloud').setScale(scale).setAlpha(0.85).setDepth(-9);
    scene.tweens.add({
      targets: cloud,
      x: x + (i % 2 === 0 ? 30 : -30),
      duration: 4000 + i * 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  });
}
