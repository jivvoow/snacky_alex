// ==========================================================
// 🎮 게임 설정 파일
// 숫자만 바꿔도 게임의 느낌(속도, 점수, 난이도)이 바뀌어요!
// ==========================================================

// 화면 크기 (세로형)
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 720;

// 땅(잔디)이 시작되는 높이
export const GROUND_Y = 665;

// 돌담이 시작되는 높이 (배경)
export const WALL_Y = 440;

// 글꼴과 색상
export const FONT = '"Jua", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
export const COLORS = {
  text: '#5a4a3f', // 기본 글자색 (따뜻한 갈색)
  navy: '#1f2d5a', // 제목, 버튼 (네이비)
  gold: '#ffd66b', // 강조 금색
  pink: '#ff6f91', // 점수 분홍
  accent: '#3f5fb0', // 강조 파랑
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
  alexFever: 'assets/images/alex_fevertime.png', // 알렉스 피버타임 표정
  cat: 'assets/images/tora_idle.png', // 고양이 토라 걷는 모습 (오른쪽을 바라보는 그림)
  catJump: 'assets/images/tora_jump.png', // 고양이 토라 점프하는 모습
  snack: '', // 일반 간식
  goldenSnack: '', // 황금 간식
  chocolate: '', // 초콜릿 (강아지에게 위험!)
  background: '', // 배경 그림 (세로 480x720 비율 추천). 비우면 코드로 그린 노을 풍경
};

// 배경이 투명하지 않은 이미지(흰색/베이지 배경)를 게임 안에서 자동으로 투명하게 만들어요.
// 투명 배경 PNG로 바꾼 뒤에는 false로 바꿔도 돼요. (이미 투명하면 알아서 건너뛰어요)
export const AUTO_REMOVE_BACKGROUND = true;
// 배경을 얼마나 넓게 지울지 (숫자가 클수록 많이 지워요)
// 털이 하얀 알렉스는 작게(배경색과 비슷해서), 고양이는 크게(바닥 그림자까지 지우게)
export const BACKGROUND_TOLERANCE = {
  alex: 8,
  alexEat: 8,
  alexFever: 8,
  cat: 45,
  catJump: 45,
  default: 20,
};

// 화면에 보이는 크기(높이, 픽셀). 어떤 크기의 PNG를 넣어도 이 높이로 맞춰져요.
export const SIZES = {
  alex: 120,
  snack: 30,
  goldenSnack: 32,
  chocolate: 44,
  cat: 78,
  goldenPaw: 38,
  kibble: 18,
};

// 알렉스
export const PLAYER = {
  y: GROUND_Y - SIZES.alex / 2 + 10, // 알렉스가 서 있는 높이 (크기에 맞춰 자동 계산)
  speed: 370, // 1초에 움직이는 거리
  eatFaceMs: 280, // 먹는 표정이 유지되는 시간 (밀리초)
};

// 점수와 체력
export const SCORE = {
  snack: 10,
  goldenSnack: 30,
  kibble: 5, // 피버타임 사료 한 알
};
export const START_HEALTH = 3;

// 레벨: 20초마다 1씩 올라가요
export const LEVEL_UP_MS = 20000;

// 떨어지는 물건 (레벨이 오를수록 조금씩 어려워져요)
export const FALL = {
  baseSpeed: 240, // 레벨 1 낙하 속도
  speedPerLevel: 22, // 레벨당 빨라지는 정도
  maxSpeed: 540, // 최대 낙하 속도
  baseInterval: 720, // 레벨 1에서 물건이 나오는 간격 (밀리초)
  intervalPerLevel: 45, // 레벨당 줄어드는 간격
  minInterval: 360, // 가장 짧은 간격
  goldenChance: 0.1, // 황금 간식 확률 (10%)
  baseChocolateChance: 0.15, // 레벨 1 초콜릿 확률 (15%)
  chocolateChancePerLevel: 0.02, // 레벨당 늘어나는 초콜릿 확률
  maxChocolateChance: 0.33, // 최대 초콜릿 확률
};

// 고양이 장애물
export const CAT = {
  firstDelay: 5000, // 게임 시작 후 첫 고양이가 나오기까지 (밀리초)
  baseInterval: 8000, // 레벨 1 등장 간격 (밀리초)
  intervalPerLevel: 600, // 레벨당 줄어드는 간격
  minInterval: 3500, // 가장 짧은 등장 간격
  baseSpeed: 100, // 레벨 1 이동 속도
  speedPerLevel: 10, // 레벨당 빨라지는 정도
  maxSpeed: 200, // 최대 이동 속도
  jumpWidth: 300, // 레벨 1 점프 폭 (이 아래에 있으면 안전!)
  jumpWidthPerLevel: 6, // 레벨당 줄어드는 점프 폭
  minJumpWidth: 210, // 가장 좁은 점프 폭
  jumpHeight: 155, // 점프 높이
  damage: 1, // 부딪히면 줄어드는 하트 수
  slowFactor: 0.5, // 부딪히면 속도 50%로
  slowMs: 2000, // 둔화 지속 시간 (정확히 2초)
};

// 🔥 피버타임: 황금 발바닥을 받으면 시작
export const FEVER = {
  pawChance: 0.03, // 떨어지는 물건 중 황금 발바닥 확률 (3%, 평균 약 25초에 한 번)
  durationMs: 8000, // 피버타임 지속 시간 (8초)
  spawnMultiplier: 3, // 평소보다 몇 배 자주 떨어지는지
  kibbleRatio: 0.7, // 피버 중 떨어지는 물건 중 사료 비율 (나머지는 일반/황금 간식)
  catBreakMs: 3000, // 피버가 끝난 뒤 고양이가 다시 나오기까지 최소 시간
};

// 🎵 소리
// 음악: public/assets/audio 폴더의 파일. 없으면 아래 '대신 재생' 순서대로 다른 곡을 틀어요.
// 효과음: 파일 경로를 적으면 그 파일을, 비워두면 코드로 만든 귀여운 소리를 사용해요.
export const AUDIO = {
  music: {
    menu: 'assets/audio/menu.mp3', // 시작 화면
    game: 'assets/audio/game.mp3', // 기본 플레이
    fever: 'assets/audio/fever.mp3', // 피버타임
  },
  musicFallback: {
    menu: ['menu', 'game'], // menu.mp3 가 없으면 game.mp3
    game: ['game', 'menu'],
    fever: ['fever', 'game'],
  },
  sfx: {
    snack: '', // 간식 획득          예) 'assets/audio/sfx/snack.mp3'
    golden: '', // 황금 간식 획득
    kibble: '', // 사료 획득
    feverStart: '', // 피버타임 시작
    feverEnd: '', // 피버타임 종료
    catHit: '', // 토라와 충돌
    hurt: '', // 초콜릿
    gameOver: 'assets/audio/jingles_NES00.ogg', // 게임오버 (Kenney Music Jingles, CC0)
  },
  // 음악 재생 속도 (1 = 원래 속도, 1.25 = 1.25배 빠르게). 빨라지면 음도 조금 높아져요.
  musicRate: {
    menu: 1,
    game: 1,
    fever: 1.25,
  },
  musicVolume: 0.45,
  sfxVolume: 0.6,
  fadeMs: 700, // 음악이 바뀔 때 서서히 줄고 커지는 시간
};
