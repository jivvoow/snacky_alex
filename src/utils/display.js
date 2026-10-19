import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

// ==========================================================
// 🔍 선명한 화면 만들기
// 게임 좌표는 항상 480x720 이지만, 실제로는 화면 해상도에 맞춰
// 2~3배 크게 그린 뒤 카메라로 확대해서 보여줘요. (흐릿함 방지)
// ==========================================================

function computeRenderScale() {
  const dpr = window.devicePixelRatio || 1;
  const fit = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
  const needed = Math.ceil(fit * dpr * 2) / 2; // 0.5 단위로 반올림
  return Math.min(3, Math.max(1, needed)); // 1 ~ 3배 (너무 크면 느려져요)
}

export const RENDER_SCALE = computeRenderScale();

// 모든 장면(Scene)의 create() 맨 앞에서 불러 주세요.
export function setupCamera(scene) {
  scene.cameras.main.setZoom(RENDER_SCALE).centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2);
}
