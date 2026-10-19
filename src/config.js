// ==========================================================
// 🎮 게임 설정 파일
// 숫자만 바꿔도 게임의 느낌(속도, 점수, 난이도)이 바뀌어요!
// ==========================================================

// 화면 크기 (세로형)
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 720;

// 땅(잔디)이 시작되는 높이
export const GROUND_Y = 665;

// 글꼴과 색상
export const FONT = '"Jua", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
export const COLORS = {
  text: '#6b4f7a', // 기본 글자색 (보라빛 갈색)
  pink: '#ff7aa8', // 강조 분홍
  accent: '#7a9cff', // 강조 파랑
};

// ----------------------------------------------------------
// 🖼️ 이미지 교체하기
// 1) public/assets/images 폴더에 PNG 파일을 넣어요.
// 2) 파일 이름을 아래와 똑같이 맞추거나, 경로를 바꿔 적어요.
// 빈 칸('')으로 두거나 파일이 없으면, 코드로 그린 임시 그림이 나와요.
// (파일이 없을 때 브라우저 콘솔에 경고가 한 줄 뜨는 것은 정상이에요)
// ----------------------------------------------------------
export const IMAGES = {
  alex: 'assets/images/alex_idle.png', // 알렉스 기본 표정
  alexEat: 'assets/images/alex_eat.png', // 알렉스 먹는 표정
  cat: 'assets/images/tora_idle.png', // 고양이 토라 걷는 모습 (오른쪽을 바라보는 그림)
  catJump: 'assets/images/tora_jump.png', // 고양이 토라 점프하는 모습
  snack: '', // 일반 간식
  goldenSnack: '', // 황금 간식
  bomb: '', // 폭탄
};

// 배경이 투명하지 않은 이미지(흰색/베이지 배경)를 게임 안에서 자동으로 투명하게 만들어요.
// 투명 배경 PNG로 바꾼 뒤에는 false로 바꿔도 돼요. (이미 투명하면 알아서 건너뛰어요)
export const AUTO_REMOVE_BACKGROUND = true;

// 화면에 보이는 크기(높이, 픽셀). 어떤 크기의 PNG를 넣어도 이 높이로 맞춰져요.
export const SIZES = {
  alex: 100,
  snack: 30,
  goldenSnack: 32,
  bomb: 46,
  cat: 78,
};

// 알렉스
export const PLAYER = {
  y: GROUND_Y - 42, // 알렉스가 서 있는 높이
  speed: 330, // 1초에 움직이는 거리
  eatFaceMs: 280, // 먹는 표정이 유지되는 시간 (밀리초)
};

// 점수와 체력
export const SCORE = {
  snack: 10,
  goldenSnack: 30,
};
export const START_HEALTH = 3;

// 레벨: 20초마다 1씩 올라가요
export const LEVEL_UP_MS = 20000;

// 떨어지는 물건 (레벨이 오를수록 조금씩 어려워져요)
export const FALL = {
  baseSpeed: 160, // 레벨 1 낙하 속도
  speedPerLevel: 18, // 레벨당 빨라지는 정도
  maxSpeed: 460, // 최대 낙하 속도
  baseInterval: 950, // 레벨 1에서 물건이 나오는 간격 (밀리초)
  intervalPerLevel: 55, // 레벨당 줄어드는 간격
  minInterval: 420, // 가장 짧은 간격
  goldenChance: 0.1, // 황금 간식 확률 (10%)
  baseBombChance: 0.12, // 레벨 1 폭탄 확률 (12%)
  bombChancePerLevel: 0.02, // 레벨당 늘어나는 폭탄 확률
  maxBombChance: 0.32, // 최대 폭탄 확률
};

// 고양이 장애물
export const CAT = {
  firstDelay: 6000, // 게임 시작 후 첫 고양이가 나오기까지 (밀리초)
  baseInterval: 9000, // 레벨 1 등장 간격 (밀리초)
  intervalPerLevel: 600, // 레벨당 줄어드는 간격
  minInterval: 3500, // 가장 짧은 등장 간격
  baseSpeed: 110, // 레벨 1 이동 속도
  speedPerLevel: 12, // 레벨당 빨라지는 정도
  maxSpeed: 240, // 최대 이동 속도
  jumpWidth: 230, // 레벨 1 점프 폭 (이 아래에 있으면 안전!)
  jumpWidthPerLevel: 8, // 레벨당 줄어드는 점프 폭
  minJumpWidth: 150, // 가장 좁은 점프 폭
  jumpHeight: 140, // 점프 높이
  slowFactor: 0.5, // 부딪히면 속도 50%로
  slowMs: 2000, // 둔화 지속 시간 (정확히 2초)
};
