// 최고 점수를 브라우저(LocalStorage)에 저장하고 불러와요.
const BEST_SCORE_KEY = 'yumcatch-best-score';

export function getBestScore() {
  try {
    return parseInt(localStorage.getItem(BEST_SCORE_KEY), 10) || 0;
  } catch {
    return 0; // 저장소를 쓸 수 없는 환경(시크릿 모드 등)
  }
}

// 새 기록이면 저장하고 true를 돌려줘요.
export function saveBestScore(score) {
  if (score <= getBestScore()) return false;
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // 저장에 실패해도 게임은 계속돼요.
  }
  return true;
}
