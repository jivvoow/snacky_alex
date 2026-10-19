// ==========================================================
// ✂️ 이미지 배경 자동 제거
// 투명하지 않은 PNG(흰색/베이지 배경)를 게임 안에서만 투명하게 바꿔요.
// 원본 파일은 바뀌지 않아요. 이미 투명한 PNG는 그대로 둬요.
// 방법: 그림 가장자리에서 시작해, 배경색과 비슷한 픽셀을 이어서 지워요.
// ==========================================================

export function removeBackground(scene, key, { maxSize = 768, tolerance = 8 } = {}) {
  const source = scene.textures.get(key).getSourceImage();

  // 큰 이미지는 작게 줄여서 게임을 가볍게 해요
  const scale = Math.min(1, maxSize / Math.max(source.width, source.height));
  const w = Math.round(source.width * scale);
  const h = Math.round(source.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(source, 0, 0, w, h);

  const image = ctx.getImageData(0, 0, w, h);
  const data = image.data;
  const alreadyTransparent = data[3] < 250;

  if (!alreadyTransparent) {
    // 네 모서리 색의 평균을 배경색으로 봐요
    const corners = [0, w - 1, (h - 1) * w, h * w - 1];
    const bg = [0, 1, 2].map((c) => corners.reduce((sum, p) => sum + data[p * 4 + c], 0) / 4);
    const distance = (p) => {
      const i = p * 4;
      return Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);
    };

    // 가장자리에서부터 배경 픽셀을 찾아 지워요 (flood fill)
    const removed = new Uint8Array(w * h);
    const visited = new Uint8Array(w * h);
    const stack = [];
    const visit = (p) => {
      if (!visited[p]) {
        visited[p] = 1;
        stack.push(p);
      }
    };
    for (let x = 0; x < w; x++) {
      visit(x);
      visit((h - 1) * w + x);
    }
    for (let y = 0; y < h; y++) {
      visit(y * w);
      visit(y * w + w - 1);
    }
    while (stack.length > 0) {
      const p = stack.pop();
      if (distance(p) > tolerance) continue;
      removed[p] = 1;
      data[p * 4 + 3] = 0;
      const x = p % w;
      if (x > 0) visit(p - 1);
      if (x < w - 1) visit(p + 1);
      if (p >= w) visit(p - w);
      if (p < w * (h - 1)) visit(p + w);
    }

    // 경계를 살짝 부드럽게
    for (let p = 0; p < w * h; p++) {
      if (removed[p]) continue;
      const x = p % w;
      const touchesBg = (x > 0 && removed[p - 1]) || (x < w - 1 && removed[p + 1]) || removed[p - w] || removed[p + w];
      if (touchesBg && distance(p) < tolerance + 12) data[p * 4 + 3] = 140;
    }
    ctx.putImageData(image, 0, 0);
  }

  scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
}
