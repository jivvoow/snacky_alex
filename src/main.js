import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config.js';
import BootScene from './scenes/BootScene.js';
import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import PauseScene from './scenes/PauseScene.js';
import { RENDER_SCALE } from './utils/display.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  // 실제 그림은 화면 해상도에 맞춰 크게 그려요 (선명하게). 게임 좌표는 480x720 그대로.
  width: GAME_WIDTH * RENDER_SCALE,
  height: GAME_HEIGHT * RENDER_SCALE,
  backgroundColor: '#ffeef5',
  scale: {
    // 화면 크기에 맞춰 비율을 유지한 채 늘리거나 줄여요 (PC/모바일 공통)
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false, // true로 바꾸면 충돌 영역이 보여요
    },
  },
  input: {
    activePointers: 3, // 멀티터치 지원
  },
  // 장면 순서: 준비 → 시작 화면 → 게임(+일시정지 창) → 게임오버
  scene: [BootScene, StartScene, GameScene, PauseScene, GameOverScene],
};

// 게임 중 실수로 화면이 확대되어 잘리지 않게 막아요.
// - 노트북 터치패드 핀치 / Ctrl + 마우스 휠 확대
window.addEventListener('wheel', (event) => {
  if (event.ctrlKey) event.preventDefault();
}, { passive: false });
// - 아이폰(사파리) 두 손가락 확대
['gesturestart', 'gesturechange'].forEach((type) => document.addEventListener(type, (event) => event.preventDefault()));
// - 휴대폰 두 번 톡톡 확대
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
  const now = Date.now();
  if (now - lastTouchEnd < 300) event.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

// 귀여운 글꼴(Jua)을 불러온 뒤 게임을 시작해요. 인터넷이 없어도 3초 뒤엔 시작돼요.
// 한글 글꼴은 글자들이 여러 조각으로 나뉘어 있어서, 게임에 쓰는 글자가 든 조각을 모두 받아야
// 일부 글자만 다른 글꼴로 보이는 문제가 없어요. 코드 속 따옴표 안의 한글을 자동으로 모아요.
const sources = import.meta.glob(['./**/*.js', '!./main.js'], { query: '?raw', import: 'default', eager: true });
const quotedText = Object.values(sources)
  .join('\n')
  .match(/(['"`])(?:\\.|(?!\1)[^\\\n])*\1/g) || [];
const hangul = [...new Set(quotedText.join('').match(/[가-힣]/g) || [])].join('');
const fontSampleText = `${hangul}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?+-·:.,~()`;

const waitForFont = document.fonts
  ? Promise.race([document.fonts.load('32px Jua', fontSampleText), new Promise((resolve) => setTimeout(resolve, 3000))])
  : Promise.resolve();

waitForFont
  .catch(() => {})
  .finally(() => {
    const game = new Phaser.Game(config);
    // 개발 중(npm run dev)에는 브라우저 콘솔에서 window.game 으로 게임을 살펴볼 수 있어요.
    if (import.meta.env.DEV) window.game = game;
  });
