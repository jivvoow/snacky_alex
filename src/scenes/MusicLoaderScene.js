import Phaser from 'phaser';
import { audio } from '../utils/audio.js';

// 🎵 음악 파일을 뒤에서 불러오는 보이지 않는 장면
// 음악 파일은 커서, 시작 화면을 먼저 보여주고 그동안 조용히 받아요.
// 화면이 바뀌어도 이 장면은 계속 켜져 있어서 다운로드가 끊기지 않아요.
export default class MusicLoaderScene extends Phaser.Scene {
  constructor() {
    super('MusicLoaderScene');
  }

  create() {
    audio.loadMusic(this);
  }
}
