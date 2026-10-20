# 🐶 알렉스의 냠냠캐치 (Snacky Alex! 🐾)

하얀 복슬강아지 **알렉스**가 하늘에서 떨어지는 간식을 받아먹는 귀여운 2D 캐주얼 웹게임이에요.
PC와 모바일 브라우저에서 모두 플레이할 수 있어요.

▶ **바로 플레이하기: https://jivvoow.github.io/snacky_alex/**

- 기술 스택: JavaScript, [Phaser 3](https://phaser.io/), [Vite](https://vitejs.dev/)
- 화면: 세로형 480×720 (화면 크기에 맞춰 자동 확대/축소)

## 🎮 게임 방법

| 대상 | 효과 |
| --- | --- |
| 🦴 일반 간식 | +10점 |
| ✨ 황금 간식 | +30점 |
| 🍫 초콜릿 | 하트 -1 (강아지에게 초콜릿은 위험!) |
| 🐱 토라 | 하트 -1 + 2초 동안 이동 속도 50% 감소 |
| 🌈 무지개 발바닥 | **피버타임** 시작! (가끔 떨어져요) |
| 🟤 사료 (피버타임) | +5점 |

- 하트는 3개, 0이 되면 게임 오버예요.
- 토라는 화면 아래를 가로지르며 중간에 한 번 크게 점프해요. **점선(점프 구간) 아래에 있으면 안전!**
- 20초마다 레벨이 올라가고, 물건이 더 빨리·자주 떨어져요.
- 최고 점수와 그때의 레벨은 브라우저에 저장돼요.

**🔥 피버타임 (8초)**
- 무지개 발바닥을 받으면 시작돼요. 화면 위에 FEVER TIME! 과 남은 시간 게이지가 나와요.
- 사료와 간식이 평소보다 3배 자주 떨어지고, 초콜릿과 토라는 나오지 않아요.
- 알렉스가 신난 표정으로 바뀌고, 신나는 피버 음악이 나와요.
- 끝나면 원래 난이도와 음악으로 돌아가요.

**조작법**
- PC: `←` `→` 방향키 (또는 `A` `D`)
- 모바일: 화면 아래 ◀ ▶ 버튼 (화면을 누른 채 드래그해도 움직여요)
- 일시정지: 오른쪽 위 Ⅱ 버튼 또는 `Esc` 키 → 계속하기 / 그만하기
- 음악 켜기/끄기: 게임 중 오른쪽 위 ♪ 버튼, 시작·게임오버 화면 왼쪽 위 버튼 (효과음도 따로 켜고 끌 수 있어요)

## 🚀 실행 방법

[Node.js](https://nodejs.org/) (LTS 버전)가 필요해요.

```bash
npm install     # 처음 한 번만: 필요한 라이브러리 설치
npm run dev     # 개발 서버 실행 → 브라우저에서 http://localhost:5173 접속
```

- 같은 와이파이에 연결된 휴대폰에서는 터미널에 나오는 `Network:` 주소로 접속하면 돼요.
- `npm run build` 를 실행하면 배포용 파일이 `dist/` 폴더에 만들어져요.

## 🌐 배포 (GitHub Pages)

`main` 브랜치에 코드가 합쳐지면 GitHub Actions가 자동으로 빌드해서 위 링크에 배포해요.
설정 파일: `.github/workflows/deploy.yml`
(처음 한 번은 저장소 Settings → Pages → Source 를 **GitHub Actions** 로 바꿔야 해요.)

## 📁 폴더 구조

```
yumcatch/
├─ index.html                 # 웹페이지 뼈대
├─ package.json               # 프로젝트 정보와 실행 명령어
├─ vite.config.js             # Vite 설정
├─ public/
│  └─ assets/
│     ├─ images/              # 🖼️ 캐릭터 이미지 넣는 곳
│     └─ audio/               # 🎵 음악 (menu.mp3, game.mp3, fever.mp3)
└─ src/
   ├─ main.js                 # 게임 시작점 (Phaser 설정)
   ├─ config.js               # ⭐ 게임 설정 (속도, 점수, 난이도, 이미지 경로)
   ├─ scenes/                 # 화면(장면)들
   │  ├─ BootScene.js         #   이미지 불러오기
   │  ├─ StartScene.js        #   시작 화면
   │  ├─ GameScene.js         #   게임 플레이 화면 (피버타임 포함)
   │  ├─ PauseScene.js        #   일시정지 창
   │  ├─ GameOverScene.js     #   게임오버 화면
   │  └─ MusicLoaderScene.js  #   음악을 뒤에서 불러오는 보이지 않는 장면
   ├─ objects/                # 캐릭터
   │  ├─ Alex.js              #   알렉스 (이동, 먹는 표정, 둔화 효과)
   │  ├─ Cat.js               #   토라 (가로지르기, 점프)
   │  └─ FeverUI.js           #   피버타임 글자, 게이지, 금빛 테두리
   └─ utils/                  # 도우미 기능
      ├─ audio.js                # 🎵 배경음악·효과음 관리
      ├─ placeholderTextures.js  # 이미지가 없을 때 쓰는 임시 그림
      ├─ removeBackground.js     # 이미지 배경 자동 제거
      ├─ background.js           # 노을 풍경 배경 (돌담, 남산타워)
      ├─ display.js              # 선명한 화면 (고해상도 렌더링)
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
  alexFever: 'assets/images/alex_fevertime.png',
  cat: 'assets/images/tora_idle.png',
  catJump: 'assets/images/tora_jump.png',
  snack: '', // 비워두면 임시 그림 사용
  chocolate: '',
  background: '', // 배경 그림 (비우면 코드로 그린 노을 풍경)
};
```

- 이미지 파일이 없으면 코드로 그린 임시 캐릭터가 나와서 게임은 항상 실행돼요.
- 배경이 투명하지 않은 이미지는 게임 안에서 자동으로 배경을 지워요 (`AUTO_REMOVE_BACKGROUND`).
  얼마나 지울지는 이미지마다 `BACKGROUND_TOLERANCE` 로 조절해요.
- 화면에 보이는 크기는 `SIZES` 에서 조절해요.

## 🎵 음악과 효과음

**배경음악** — `public/assets/audio/` 폴더

| 파일 | 언제 나오나 |
| --- | --- |
| `menu.mp3` | 시작·게임오버 화면 (없으면 game.mp3 로 대신) |
| `game.mp3` | 기본 플레이 |
| `fever.mp3` | 피버타임 (없으면 game.mp3 로 대신) |

- 같은 이름으로 파일을 바꿔 넣으면 바로 적용돼요. 음악 파일이 하나도 없어도 게임은 정상 실행돼요.
- 브라우저 정책상 화면을 한 번 누르거나 클릭한 뒤부터 소리가 나요.
- 음악/효과음 ON·OFF 설정은 브라우저에 저장돼요.

**효과음** — 간식, 황금 간식, 사료, 피버 시작/종료, 토라 충돌, 초콜릿, 게임오버
- 기본은 코드로 만든 귀여운 소리예요.
- 파일로 바꾸려면 `src/config.js` 의 `AUDIO.sfx` 에 경로를 적어요. 예) `snack: 'assets/audio/sfx/snack.mp3'`
- 음량은 `AUDIO.musicVolume`, `AUDIO.sfxVolume` 으로 조절해요.
- 음악 재생 속도는 `AUDIO.musicRate` 로 조절해요. (지금 피버 음악은 1.25배)

## 📜 음악 출처

[Pixabay](https://pixabay.com/) 의 음악을 Pixabay Content License 에 따라 사용했어요.

| 파일 | 곡 | 작곡가 |
| --- | --- | --- |
| `game.mp3` | Kids (Pixabay #617587) | atlasaudio |
| `fever.mp3` | Energetic Action Sport (Pixabay #500409) | alexgrohl |

게임오버 효과음 `jingles_NES00.ogg` 는 [Kenney](https://kenney.nl/assets/music-jingles) 의 Music Jingles (CC0) 를 사용했어요.
