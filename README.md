
# 🐾 Snacky Alex!

**알렉스의 냠냠캐치**는 강아지 알렉스가 떨어지는 간식을 받아먹고, 장난꾸러기 고양이 토라를 피하며 점수를 모으는 2D 캐주얼 웹게임입니다.

PC와 모바일에서 모두 플레이할 수 있어요!

## 🎮 [지금 플레이하기](https://jivvoow.github.io/snacky_alex/)

## 게임 방법

| 아이템 | 효과 |
|---|---|
| 🦴 일반 간식 | +10점 |
| ✨ 황금 간식 | +30점 |
| 🍫 초콜릿 | 하트 -1 |
| 🐱 토라 | 하트 -1, 2초간 이동 속도 감소 |
| 🌈 무지개 발바닥 | 8초 피버타임 발동! |

- **조작:** PC `←` `→` / 모바일 ◀ ▶ 버튼
- **레벨업:** 20초마다 난이도 상승
- **피버타임:** 사료가 쏟아져 점수를 빠르게 획득 가능
- **게임오버:** 하트 3개를 모두 잃으면 종료

## 로컬 실행

```bash
npm install
npm run dev
```

게임 설정은 `src/config.js`, 이미지와 음악은 `public/assets/`에서 관리합니다.

## 기술 스택

JavaScript · Phaser 3 · Vite

## 사운드 출처

- **BGM:** [Pixabay](https://pixabay.com/) — Kids (atlasaudio), Energetic Action Sport (alexgrohl)
- **효과음:** [Kenney Music Jingles](https://kenney.nl/assets/music-jingles) — CC0
