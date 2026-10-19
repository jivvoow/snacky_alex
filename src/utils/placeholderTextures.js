// ==========================================================
// 🎨 임시 그림 만들기
// PNG 이미지가 없을 때, 코드로 직접 그린 그림을 대신 사용해요.
// 실제 이미지를 넣으면 여기서 그린 그림은 자동으로 쓰이지 않아요.
// ==========================================================

const OUTLINE = 0xd6cfe0;
const DARK = 0x3a3340;
const BLUSH = 0xffb3c6;

// 선명하게 보이도록 임시 그림은 2배 크기로 만들어요.
// (하트, 발바닥처럼 직접 크기를 정하는 그림은 setScale(… / TEXTURE_SCALE) 로 줄여서 써요)
export const TEXTURE_SCALE = 2;

// 이미 같은 이름의 그림(실제 PNG)이 있으면 그리지 않아요.
function makeTexture(scene, key, width, height, draw) {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.setScale(TEXTURE_SCALE);
  draw(g);
  g.generateTexture(key, width * TEXTURE_SCALE, height * TEXTURE_SCALE);
  g.destroy();
}

// 아래쪽이 둥근 미소 / 위쪽이 둥근 감은 눈
function smileArc(g, x, y, r) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI, false);
  g.strokePath();
}
function happyEye(g, x, y, r) {
  g.beginPath();
  g.arc(x, y, r, Math.PI, 0, false);
  g.strokePath();
}

// 🐶 알렉스: 하얀 복슬복슬 강아지 + 네이비 줄무늬 티셔츠
function drawAlex(g, eating) {
  // 티셔츠
  g.fillStyle(0x2b3a67, 1);
  g.fillRoundedRect(27, 66, 46, 34, 12);
  g.fillStyle(0xffffff, 1);
  g.fillRect(30, 75, 40, 5);
  g.fillRect(29, 86, 42, 5);

  // 앞발 & 뒷발
  const paws = [
    [26, 82, 8],
    [74, 82, 8],
    [40, 101, 8],
    [60, 101, 8],
  ];
  g.fillStyle(OUTLINE, 1);
  paws.forEach(([x, y, r]) => g.fillCircle(x, y, r + 2));
  g.fillStyle(0xffffff, 1);
  paws.forEach(([x, y, r]) => g.fillCircle(x, y, r));

  // 복슬복슬한 머리 (작은 원 여러 개)
  const fluff = [
    [50, 40, 30],
    [30, 22, 12],
    [50, 13, 13],
    [70, 22, 12],
    [24, 40, 11],
    [76, 40, 11],
    [33, 58, 11],
    [67, 58, 11],
    [50, 63, 12],
  ];
  g.fillStyle(OUTLINE, 1);
  fluff.forEach(([x, y, r]) => g.fillCircle(x, y, r + 2));
  g.fillStyle(0xffffff, 1);
  fluff.forEach(([x, y, r]) => g.fillCircle(x, y, r));

  // 축 늘어진 귀
  g.fillStyle(OUTLINE, 1);
  g.fillEllipse(18, 46, 22, 38);
  g.fillEllipse(82, 46, 22, 38);
  g.fillStyle(0xf6f2f9, 1);
  g.fillEllipse(18, 46, 18, 34);
  g.fillEllipse(82, 46, 18, 34);

  // 볼터치
  g.fillStyle(BLUSH, 0.75);
  g.fillEllipse(32, 51, 11, 7);
  g.fillEllipse(68, 51, 11, 7);

  // 눈
  if (eating) {
    g.lineStyle(3, DARK, 1);
    happyEye(g, 39, 42, 5);
    happyEye(g, 61, 42, 5);
  } else {
    g.fillStyle(DARK, 1);
    g.fillCircle(39, 40, 4.5);
    g.fillCircle(61, 40, 4.5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(40.5, 38.5, 1.6);
    g.fillCircle(62.5, 38.5, 1.6);
  }

  // 코
  g.fillStyle(DARK, 1);
  g.fillEllipse(50, 48, 9, 6);

  // 입
  if (eating) {
    g.fillStyle(0xd9475f, 1);
    g.fillEllipse(50, 57, 13, 12);
    g.fillStyle(0xff8fa3, 1);
    g.fillEllipse(50, 60, 8, 5);
  } else {
    g.lineStyle(2, DARK, 1);
    smileArc(g, 46, 51, 4);
    smileArc(g, 54, 51, 4);
  }
}

// 🐱 고양이: 주황 줄무늬, 장난기 있는 표정
function drawCat(g, jumping) {
  const hit = jumping; // 점프할 때는 > < 신난 표정
  const ORANGE = 0xffa94d;
  const STRIPE = 0xe8833a;
  const CAT_OUTLINE = 0xe07b2a;

  // 꼬리
  g.lineStyle(8, CAT_OUTLINE, 1);
  g.beginPath();
  g.arc(70, 48, 12, Math.PI * 0.5, Math.PI * 1.6, true);
  g.strokePath();
  g.lineStyle(5, ORANGE, 1);
  g.beginPath();
  g.arc(70, 48, 12, Math.PI * 0.5, Math.PI * 1.6, true);
  g.strokePath();

  // 몸통
  g.fillStyle(CAT_OUTLINE, 1);
  g.fillEllipse(42, 58, 48, 32);
  g.fillStyle(ORANGE, 1);
  g.fillEllipse(42, 58, 44, 28);
  g.fillStyle(STRIPE, 1);
  g.fillRoundedRect(30, 46, 4, 12, 2);
  g.fillRoundedRect(40, 45, 4, 13, 2);
  g.fillRoundedRect(50, 46, 4, 12, 2);

  // 발
  g.fillStyle(0xffe3c4, 1);
  g.fillCircle(30, 72, 6);
  g.fillCircle(54, 72, 6);

  // 귀
  g.fillStyle(CAT_OUTLINE, 1);
  g.fillTriangle(19, 26, 25, 1, 40, 14);
  g.fillTriangle(65, 26, 59, 1, 44, 14);
  g.fillStyle(ORANGE, 1);
  g.fillTriangle(22, 24, 26, 5, 38, 15);
  g.fillTriangle(62, 24, 58, 5, 46, 15);
  g.fillStyle(0xffb8c8, 1);
  g.fillTriangle(25, 21, 27, 10, 35, 16);
  g.fillTriangle(59, 21, 57, 10, 49, 16);

  // 머리
  g.fillStyle(CAT_OUTLINE, 1);
  g.fillCircle(42, 32, 24);
  g.fillStyle(ORANGE, 1);
  g.fillCircle(42, 32, 22);
  g.fillStyle(STRIPE, 1);
  g.fillRoundedRect(40, 11, 4, 10, 2);
  g.fillRoundedRect(32, 13, 3, 8, 1.5);
  g.fillRoundedRect(49, 13, 3, 8, 1.5);

  // 주둥이
  g.fillStyle(0xfff3e0, 1);
  g.fillEllipse(42, 41, 22, 13);

  // 볼터치
  g.fillStyle(BLUSH, 0.8);
  g.fillEllipse(27, 38, 8, 5);
  g.fillEllipse(57, 38, 8, 5);

  g.lineStyle(2.5, DARK, 1);
  if (hit) {
    // 부딪혔을 때: > < 눈
    g.lineBetween(30, 26, 36, 29);
    g.lineBetween(30, 32, 36, 29);
    g.lineBetween(54, 26, 48, 29);
    g.lineBetween(54, 32, 48, 29);
  } else {
    // 기본: 한쪽 눈 윙크 (장난기)
    happyEye(g, 34, 31, 4);
    g.fillStyle(DARK, 1);
    g.fillCircle(50, 29, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(51.3, 27.7, 1.4);
  }

  // 코와 :3 입
  g.fillStyle(0xff8fa3, 1);
  g.fillTriangle(39, 37, 45, 37, 42, 40);
  g.lineStyle(2, DARK, 1);
  smileArc(g, 39, 41, 3);
  smileArc(g, 45, 41, 3);

  // 혀 (메롱~)
  g.fillStyle(0xff7a90, 1);
  g.fillEllipse(44, 46, 5, hit ? 7 : 5);

  // 수염
  g.lineStyle(1.5, CAT_OUTLINE, 1);
  g.lineBetween(30, 40, 16, 37);
  g.lineBetween(30, 43, 16, 45);
  g.lineBetween(54, 40, 68, 37);
  g.lineBetween(54, 43, 68, 45);
}

// 🦴 뼈다귀 간식
function drawBone(g, fill, outline) {
  const shape = (pad) => {
    g.fillCircle(10, 10, 8 + pad);
    g.fillCircle(10, 22, 8 + pad);
    g.fillCircle(42, 10, 8 + pad);
    g.fillCircle(42, 22, 8 + pad);
    g.fillRect(10, 9 - pad, 32, 14 + pad * 2);
  };
  g.fillStyle(outline, 1);
  shape(2);
  g.fillStyle(fill, 1);
  shape(0);
  g.fillStyle(0xffffff, 0.5);
  g.fillEllipse(24, 12, 16, 4);
}

// 🍫 초콜릿 (반쯤 벗겨진 포장지)
function drawChocolate(g) {
  // 초콜릿 판
  g.fillStyle(0x4a2614, 1);
  g.fillRoundedRect(4, 2, 36, 50, 6);
  g.fillStyle(0x6b3b22, 1);
  g.fillRoundedRect(6, 4, 32, 46, 5);
  // 조각 칸
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const x = 9 + col * 14;
      const y = 7 + row * 13;
      g.fillStyle(0x8a4e2d, 1);
      g.fillRoundedRect(x, y, 12, 11, 2);
      g.fillStyle(0xb06a3f, 0.7);
      g.fillRect(x + 2, y + 2, 7, 2);
    }
  }
  // 분홍 포장지
  g.fillStyle(0xe0577f, 1);
  g.fillRoundedRect(2, 32, 40, 24, 5);
  g.fillStyle(0xff8fb1, 1);
  g.fillRoundedRect(3, 33, 38, 21, 4);
  g.fillStyle(0xffffff, 0.9);
  g.fillRect(3, 40, 38, 4);
  // 포장지 위 하트
  g.fillStyle(0xffffff, 1);
  g.fillCircle(19, 48, 2.6);
  g.fillCircle(25, 48, 2.6);
  g.fillTriangle(16.6, 49, 27.4, 49, 22, 54);
}

// 🐾 발바닥
function drawPaw(g) {
  g.fillStyle(0xffffff, 1);
  g.fillEllipse(16, 21, 16, 13);
  g.fillCircle(6, 11, 4);
  g.fillCircle(12.5, 6, 4);
  g.fillCircle(19.5, 6, 4);
  g.fillCircle(26, 11, 4);
}

// ⬅️➡️ 방향키
function drawArrowKeys(g) {
  [
    [2, false],
    [36, true],
  ].forEach(([x, right]) => {
    g.fillStyle(0xb9b2a6, 1);
    g.fillRoundedRect(x, 4, 30, 30, 6);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(x, 2, 30, 28, 6);
    g.fillStyle(0x1f2d5a, 1);
    if (right) g.fillTriangle(x + 11, 8, x + 11, 24, x + 21, 16);
    else g.fillTriangle(x + 19, 8, x + 19, 24, x + 9, 16);
  });
}

// ❤️ 하트
function drawHeart(g, color) {
  g.fillStyle(color, 1);
  g.fillCircle(8, 9, 7);
  g.fillCircle(20, 9, 7);
  g.fillTriangle(1.3, 11, 26.7, 11, 14, 24);
}

export function createPlaceholderTextures(scene) {
  // 기본 그림이 PNG라면, 표정 그림이 없을 때 기본 그림을 그대로 써요 (그림체가 섞이지 않게)
  const alexIsPlaceholder = !scene.textures.exists('alex');
  const catIsPlaceholder = !scene.textures.exists('cat');

  makeTexture(scene, 'alex', 100, 112, (g) => drawAlex(g, false));
  if (alexIsPlaceholder) makeTexture(scene, 'alexEat', 100, 112, (g) => drawAlex(g, true));

  makeTexture(scene, 'cat', 84, 80, (g) => drawCat(g, false));
  if (catIsPlaceholder) makeTexture(scene, 'catJump', 84, 80, (g) => drawCat(g, true));

  makeTexture(scene, 'snack', 52, 32, (g) => drawBone(g, 0xf3d1a0, 0xd9a86c));
  makeTexture(scene, 'goldenSnack', 52, 32, (g) => drawBone(g, 0xffd54a, 0xe6a700));
  makeTexture(scene, 'chocolate', 44, 58, drawChocolate);
  makeTexture(scene, 'paw', 32, 30, drawPaw);
  makeTexture(scene, 'arrowKeys', 68, 36, drawArrowKeys);
  makeTexture(scene, 'heart', 28, 26, (g) => drawHeart(g, 0xff6f91));
  makeTexture(scene, 'heartEmpty', 28, 26, (g) => drawHeart(g, 0xe3dbe8));

  // 반짝이 (간식 먹을 때 효과)
  makeTexture(scene, 'sparkle', 16, 16, (g) => {
    g.fillStyle(0xffffff, 1);
    g.fillPoints(
      [
        { x: 8, y: 0 },
        { x: 10, y: 6 },
        { x: 16, y: 8 },
        { x: 10, y: 10 },
        { x: 8, y: 16 },
        { x: 6, y: 10 },
        { x: 0, y: 8 },
        { x: 6, y: 6 },
      ],
      true
    );
  });

  // 구름
  makeTexture(scene, 'cloud', 100, 48, (g) => {
    g.fillStyle(0xffffff, 1);
    g.fillCircle(28, 30, 18);
    g.fillCircle(50, 22, 22);
    g.fillCircle(74, 30, 18);
    g.fillRoundedRect(12, 28, 78, 20, 10);
  });
}
