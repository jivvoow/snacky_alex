import { defineConfig } from 'vite';

export default defineConfig({
  // './' 로 두면 나중에 GitHub Pages 같은 하위 경로에 올려도 파일 경로가 깨지지 않아요.
  base: './',
  server: {
    // 같은 와이파이에 연결된 휴대폰에서도 접속해 볼 수 있게 해 줘요.
    host: true,
    port: 5173,
  },
  build: {
    // Phaser 라이브러리가 커서 생기는 경고를 꺼요 (게임 실행에는 문제 없어요)
    chunkSizeWarningLimit: 2000,
  },
});
