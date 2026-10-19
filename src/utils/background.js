import { GAME_WIDTH as W, GAME_HEIGHT as H, WALL_Y } from '../config.js';

// 🌇 배경: 노을 하늘 + 서울 풍경 + 돌담 + 잔디
// config.js 의 IMAGES.background 에 그림을 넣으면 그 그림을 대신 사용해요.
export function drawBackground(scene) {
  if (scene.textures.exists('background')) {
    const bg = scene.add.image(W / 2, H / 2, 'background').setDepth(-10);
    bg.setScale(Math.max(W / bg.width, H / bg.height)); // 화면을 꽉 채우게
    return;
  }

  const g = scene.add.graphics().setDepth(-10);
  const horizon = WALL_Y - 28;

  // 하늘: 위는 푸른 저녁, 아래는 복숭아빛 노을
  const mid = Math.round(horizon * 0.55);
  g.fillGradientStyle(0x5d78b0, 0x5d78b0, 0xc9b4d8, 0xc9b4d8, 1);
  g.fillRect(0, 0, W, mid);
  g.fillGradientStyle(0xc9b4d8, 0xc9b4d8, 0xffd6a3, 0xffd6a3, 1);
  g.fillRect(0, mid, W, horizon - mid);

  // 해 (부드럽게 빛나는)
  [
    [95, 0.1],
    [62, 0.16],
    [36, 0.3],
    [18, 0.9],
  ].forEach(([r, a]) => {
    g.fillStyle(0xfff1c4, a);
    g.fillCircle(W * 0.7, horizon - 26, r);
  });

  // 구름
  const cloud = (x, y, s, color, alpha) => {
    g.fillStyle(color, alpha);
    g.fillEllipse(x, y, 96 * s, 24 * s);
    g.fillEllipse(x - 24 * s, y - 8 * s, 50 * s, 28 * s);
    g.fillEllipse(x + 16 * s, y - 12 * s, 58 * s, 34 * s);
  };
  cloud(70, 120, 1.2, 0xffffff, 0.3);
  cloud(410, 80, 1, 0xffffff, 0.25);
  cloud(250, 230, 0.8, 0xffffff, 0.22);
  cloud(100, horizon - 85, 1.4, 0xffe4c8, 0.6);
  cloud(390, horizon - 125, 1.1, 0xffebd6, 0.5);

  // 먼 산
  g.fillStyle(0x9d98c2, 0.85);
  g.fillPoints(
    [
      { x: 0, y: horizon },
      { x: 0, y: horizon - 36 },
      { x: 60, y: horizon - 58 },
      { x: 130, y: horizon - 28 },
      { x: 200, y: horizon - 52 },
      { x: 270, y: horizon - 24 },
      { x: W, y: horizon - 34 },
      { x: W, y: horizon },
    ],
    true
  );

  // 도시 건물 + 남산타워
  const buildings = [
    [246, 16, 18],
    [264, 10, 26],
    [276, 14, 14],
    [292, 12, 30],
    [306, 18, 20],
    [326, 10, 36],
    [338, 16, 22],
    [356, 12, 16],
    [440, 14, 22],
    [456, 12, 30],
    [470, 10, 18],
  ];
  g.fillStyle(0x7c7ca4, 1);
  buildings.forEach(([x, w, h]) => g.fillRect(x, horizon - h, w, h));
  g.fillEllipse(408, horizon, 80, 34); // 남산
  g.fillRect(406, horizon - 78, 4, 66); // 타워 기둥
  g.fillRoundedRect(400, horizon - 72, 16, 9, 3); // 전망대
  g.fillRect(407, horizon - 98, 2, 22); // 안테나
  g.fillStyle(0xffe08a, 0.9);
  buildings.forEach(([x, w, h], i) => {
    for (let y = horizon - h + 4; y < horizon - 3; y += 6) {
      if ((i + y) % 3 !== 0) g.fillRect(x + 3, y, 2, 2);
      if (w > 12 && (i + y) % 2 === 0) g.fillRect(x + w - 5, y, 2, 2);
    }
  });
  g.fillCircle(408, horizon - 68, 1.6);

  // 강
  g.fillStyle(0xf3c7a6, 1);
  g.fillRect(0, horizon, W, WALL_Y - horizon);
  g.fillStyle(0xfff0d8, 0.7);
  [
    [320, 6, 40],
    [350, 14, 24],
    [300, 20, 30],
    [80, 10, 50],
  ].forEach(([x, dy, w]) => g.fillRect(x, horizon + dy, w, 2));

  // 담장 뒤 덤불
  g.fillStyle(0x5c8656, 1);
  [
    [0, WALL_Y - 16, 34],
    [36, WALL_Y - 8, 26],
    [70, WALL_Y - 2, 18],
    [W, WALL_Y - 14, 32],
    [W - 38, WALL_Y - 6, 22],
  ].forEach(([x, y, r]) => g.fillCircle(x, y, r));
  g.fillStyle(0x76a36a, 1);
  [
    [14, WALL_Y - 22, 18],
    [W - 14, WALL_Y - 20, 16],
  ].forEach(([x, y, r]) => g.fillCircle(x, y, r));

  // 돌담
  g.fillStyle(0xb8ad9d, 1);
  g.fillRect(0, WALL_Y, W, 46);
  g.fillStyle(0xd4c9b7, 1);
  g.fillRect(0, WALL_Y - 6, W, 10);
  g.lineStyle(2, 0x9a8e7c, 0.8);
  for (let row = 0; row < 2; row++) {
    const y = WALL_Y + 5 + row * 20;
    for (let x = row % 2 === 0 ? -20 : 0; x < W; x += 52) {
      g.strokeRoundedRect(x + 2, y, 48, 17, 4);
    }
  }

  // 잔디
  const grassTop = WALL_Y + 46;
  g.fillGradientStyle(0xa3d17f, 0xa3d17f, 0x6b9c53, 0x6b9c53, 1);
  g.fillRect(0, grassTop, W, H - grassTop);
  g.fillStyle(0x8cbf6a, 1);
  for (let x = 4; x < W; x += 11) {
    const h = 6 + ((x * 7) % 9);
    g.fillTriangle(x, grassTop + 2, x + 6, grassTop + 2, x + 3, grassTop - h + 6);
  }

  // 작은 꽃
  for (let i = 0; i < 14; i++) {
    const x = 18 + ((i * 73) % (W - 30));
    const y = grassTop + 20 + ((i * 47) % (H - grassTop - 30));
    g.fillStyle(i % 3 === 0 ? 0xfff3b0 : 0xffffff, 0.95);
    g.fillCircle(x - 3, y, 3);
    g.fillCircle(x + 3, y, 3);
    g.fillCircle(x, y - 3, 3);
    g.fillCircle(x, y + 3, 3);
    g.fillStyle(0xffc94d, 1);
    g.fillCircle(x, y, 1.8);
  }

  // 위쪽 모서리 나뭇잎
  g.fillStyle(0x4f7a4a, 0.95);
  [
    [0, 0, 46],
    [40, -10, 30],
    [-6, 50, 28],
    [W + 4, 10, 34],
    [W - 26, -8, 22],
  ].forEach(([x, y, r]) => g.fillCircle(x, y, r));
  g.fillStyle(0x6f9c5f, 0.95);
  [
    [22, 18, 18],
    [W - 14, 26, 14],
  ].forEach(([x, y, r]) => g.fillCircle(x, y, r));
}
