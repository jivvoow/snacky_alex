# 🐶 알렉스의 냠냠캐치 (Snacky Alex! 🐾)

하얀 복슬강아지 **알렉스**가 하늘에서 떨어지는 간식을 받아먹는 귀여운 2D 캐주얼 웹게임이에요.
PC와 모바일 브라우저에서 모두 플레이할 수 있어요.

- 기술 스택: JavaScript, [Phaser 3](https://phaser.io/), [Vite](https://vitejs.dev/)
- 화면: 세로형 480×720 (화면 크기에 맞춰 자동 확대/축소)

## 🎮 게임 방법

| 대상 | 효과 |
| --- | --- |
| 🦴 일반 간식 | +10점 |
| ✨ 황금 간식 | +30점 |
| 💣 폭탄 | 체력 -1 (체력 3개, 0이 되면 게임 오버) |
| 🐱 고양이 토라 | 부딪히면 2초 동안 이동 속도 50% 감소 |

- 고양이는 화면 아래를 가로지르며 중간에 한 번 크게 점프해요. **점선(점프 구간) 아래에 있으면 안전!**
- 20초마다 레벨이 올라가고, 물건이 더 빨리·자주 떨어져요.
- 최고 점수는 브라우저에 저장돼요.

**조작법**
- PC: `←` `→` 방향키 (또는 `A` `D`)
- 모바일: 화면을 누른 채 좌우로 드래그, 또는 화면 아래 ◀ ▶ 버튼

## 🚀 실행 방법

[Node.js](https://nodejs.org/) (LTS 버전)가 필요해요.

```bash
npm install     # 처음 한 번만: 필요한 라이브러리 설치
npm run dev     # 개발 서버 실행 → 브라우저에서 http://localhost:5173 접속
```

- 같은 와이파이에 연결된 휴대폰에서는 터미널에 나오는 `Network:` 주소로 접속하면 돼요.
- `npm run build` 를 실행하면 배포용 파일이 `dist/` 폴더에 만들어져요.

## 📁 폴더 구조

```
yumcatch/
├─ index.html                 # 웹페이지 뼈대
├─ package.json               # 프로젝트 정보와 실행 명령어
├─ vite.config.js             # Vite 설정
├─ public/
│  └─ assets/images/          # 🖼️ 캐릭터 이미지 넣는 곳
└─ src/
   ├─ main.js                 # 게임 시작점 (Phaser 설정)
   ├─ config.js               # ⭐ 게임 설정 (속도, 점수, 난이도, 이미지 경로)
   ├─ scenes/                 # 화면(장면)들
   │  ├─ BootScene.js         #   이미지 불러오기
   │  ├─ StartScene.js        #   시작 화면
   │  ├─ GameScene.js         #   게임 플레이 화면
   │  └─ GameOverScene.js     #   게임오버 화면
   ├─ objects/                # 캐릭터
   │  ├─ Alex.js              #   알렉스 (이동, 먹는 표정, 둔화 효과)
   │  └─ Cat.js               #   고양이 토라 (가로지르기, 점프)
   └─ utils/                  # 도우미 기능
      ├─ placeholderTextures.js  # 이미지가 없을 때 쓰는 임시 그림
      ├─ removeBackground.js     # 이미지 배경 자동 제거
      ├─ background.js           # 파스텔 배경
      ├─ storage.js              # 최고 점수 저장
      └─ ui.js                   # 버튼, 글자 스타일
```

## 🖼️ 캐릭터 이미지 바꾸기

1. `public/assets/images/` 폴더에 이미지를 넣어요.
2. `src/config.js` 의 `IMAGES` 에 파일 경로를 적어요.

```js
export const IMAGES = {
  alex: 'assets/images/alex_idle.png',
  alexEat: 'assets/images/alex_eat.png',
  cat: 'assets/images/tora_idle.png',
  catJump: 'assets/images/tora_jump.png',
  snack: '', // 비워두면 임시 그림 사용
  ...
};
```

- 이미지 파일이 없으면 코드로 그린 임시 캐릭터가 나와서 게임은 항상 실행돼요.
- 배경이 투명하지 않은 이미지는 게임 안에서 자동으로 배경을 지워요 (`AUTO_REMOVE_BACKGROUND`).
- 화면에 보이는 크기는 `SIZES` 에서 조절해요.
