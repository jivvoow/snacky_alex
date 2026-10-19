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

// 귀여운 글꼴(Jua)을 불러온 뒤 게임을 시작해요. 인터넷이 없어도 1.5초 뒤엔 시작돼요.
const waitForFont = document.fonts
  ? Promise.race([document.fonts.load('32px Jua'), new Promise((resolve) => setTimeout(resolve, 1500))])
  : Promise.resolve();

waitForFont
  .catch(() => {})
  .finally(() => {
    const game = new Phaser.Game(config);
    // 개발 중(npm run dev)에는 브라우저 콘솔에서 window.game 으로 게임을 살펴볼 수 있어요.
    if (import.meta.env.DEV) window.game = game;
  });
