// 최고 기록(점수 + 그때의 레벨)을 브라우저(LocalStorage)에 저장하고 불러와요.
const BEST_SCORE_KEY = 'yumcatch-best-score';
const BEST_LEVEL_KEY = 'yumcatch-best-level';

// 저장소를 쓸 수 없는 환경(VS Code 내장 브라우저, 시크릿 모드 등)을 대비해
// 게임이 켜져 있는 동안은 메모리에도 기억해 둬요.
let memoryBest = { score: 0, level: 1 };

function readNumber(key, fallback) {
  try {
    return parseInt(localStorage.getItem(key), 10) || fallback;
  } catch {
    return fallback; // 저장소를 읽을 수 없으면 기본값
  }
}

// { score, level } 을 돌려줘요.
export function getBestRecord() {
  const stored = { score: readNumber(BEST_SCORE_KEY, 0), level: readNumber(BEST_LEVEL_KEY, 1) };
  return stored.score >= memoryBest.score ? stored : memoryBest;
}

export function getBestScore() {
  return getBestRecord().score;
}

// 새 기록이면 저장하고 true를 돌려줘요.
export function saveBestRecord(score, level) {
  if (score <= getBestScore()) return false;
  memoryBest = { score, level };
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
    localStorage.setItem(BEST_LEVEL_KEY, String(level));
  } catch {
    console.warn('[냠냠캐치] 이 브라우저에서는 최고 기록을 영구 저장할 수 없어요. (게임을 켜 둔 동안만 기억)');
  }
  return true;
}
