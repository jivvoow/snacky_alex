import Phaser from 'phaser';
import { IMAGES, AUTO_REMOVE_BACKGROUND, GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { createPlaceholderTextures } from '../utils/placeholderTextures.js';
import { removeBackground } from '../utils/removeBackground.js';

// 🔧 준비 장면: 이미지를 불러오고, 없는 이미지는 임시 그림으로 채워요
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '불러오는 중... 🐾', {
        fontFamily: 'sans-serif',
        fontSize: '22px',
        color: '#6b4f7a',
      })
      .setOrigin(0.5);

    // config.js 에 경로가 적힌 이미지만 불러와요
    Object.entries(IMAGES).forEach(([key, path]) => {
      if (path) this.load.image(key, path);
    });
  }

  create() {
    Object.entries(IMAGES).forEach(([key, path]) => {
      if (!path) return;
      if (!this.textures.exists(key)) {
        console.warn(`[냠냠캐치] '${path}' 이미지를 찾지 못해서 임시 그림을 사용해요.`);
      } else if (AUTO_REMOVE_BACKGROUND) {
        removeBackground(this, key);
      }
    });

    createPlaceholderTextures(this);
    this.scene.start('StartScene');
  }
}
