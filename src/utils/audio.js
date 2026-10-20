import { AUDIO } from '../config.js';

// ==========================================================
// 🎵 소리 관리자 (배경음악 + 효과음)
// - 음악 파일이 없어도 게임은 그대로 실행돼요.
// - 브라우저는 사용자가 화면을 한 번 누르기 전엔 소리를 막아요(자동재생 제한).
//   그래서 첫 터치/클릭 뒤에 음악이 시작돼요.
// - 음악/효과음 ON·OFF 설정은 브라우저(LocalStorage)에 저장돼요.
// ==========================================================

const MUSIC_ON_KEY = 'yumcatch-music-on';
const SFX_ON_KEY = 'yumcatch-sfx-on';

function readFlag(key) {
  try {
    return localStorage.getItem(key) !== 'off';
  } catch {
    return true;
  }
}

function writeFlag(key, on) {
  try {
    localStorage.setItem(key, on ? 'on' : 'off');
  } catch {
    // 저장할 수 없는 환경이면 이번 실행 동안만 기억
  }
}

// 음악 파일이 실제로 있는지 먼저 확인해요 (없는 파일을 불러오다 오류가 나지 않게)
async function audioFileExists(path) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    const type = response.headers.get('content-type') || '';
    return response.ok && !type.includes('text/html');
  } catch {
    return false;
  }
}

// ---------------- 코드로 만드는 효과음 ----------------
function tone(ctx, { freq, to = freq, start = 0, dur = 0.12, type = 'triangle', vol = 0.3 }) {
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to !== freq) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol * AUDIO.sfxVolume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function melody(ctx, freqs, { step, ...options }) {
  freqs.forEach((freq, i) => tone(ctx, { freq, start: i * step, ...options }));
}

const SYNTH = {
  snack: (ctx) => tone(ctx, { freq: 660, to: 990, dur: 0.1, vol: 0.35 }),
  golden: (ctx) => melody(ctx, [880, 1175, 1568], { step: 0.06, dur: 0.12, type: 'sine', vol: 0.3 }),
  kibble: (ctx) => tone(ctx, { freq: 1200, to: 1500, dur: 0.05, type: 'sine', vol: 0.15 }),
  feverStart: (ctx) => melody(ctx, [523, 659, 784, 1047, 1319], { step: 0.07, dur: 0.16, vol: 0.3 }),
  feverEnd: (ctx) => melody(ctx, [784, 659, 523], { step: 0.09, dur: 0.18, type: 'sine', vol: 0.25 }),
  catHit: (ctx) => tone(ctx, { freq: 380, to: 160, dur: 0.22, type: 'square', vol: 0.12 }),
  hurt: (ctx) => tone(ctx, { freq: 300, to: 200, dur: 0.18, type: 'sawtooth', vol: 0.1 }),
  gameOver: (ctx) => melody(ctx, [523, 440, 349, 262], { step: 0.16, dur: 0.24, vol: 0.3 }),
};

class AudioManager {
  constructor() {
    this.game = null;
    this.musicOn = readFlag(MUSIC_ON_KEY);
    this.sfxOn = readFlag(SFX_ON_KEY);
    this.desired = null; // 지금 틀고 싶은 음악 이름 (menu / game / fever)
    this.current = null; // 지금 재생 중인 음악 { key, sound }
    this.fades = [];
    this.missing = new Set(); // 불러오지 못한 음악
    this.held = false; // 일시정지 중이면 true (음악을 멈춰 둬요)
  }

  init(game) {
    if (this.game) return;
    this.game = game;
    game.events.on('step', (time, delta) => this.updateFades(delta));
    game.sound.on('unlocked', () => this.refresh()); // 첫 터치/클릭으로 소리가 허용되면
  }

  // 음악 파일을 뒤에서 조용히 불러와요 (항상 켜져 있는 MusicLoaderScene 에서 호출)
  async loadMusic(scene) {
    const load = scene.load;
    let added = false;
    for (const [name, path] of Object.entries(AUDIO.music)) {
      if (!path || scene.cache.audio.exists(`music-${name}`)) continue;
      if (!(await audioFileExists(path))) {
        console.info(`[냠냠캐치] '${path}' 음악 파일이 없어서 다른 곡으로 대신해요.`);
        continue;
      }
      load.audio(`music-${name}`, path);
      added = true;
    }
    if (!added) return;

    const onError = (file) => {
      if (!file.key.startsWith('music-')) return;
      this.missing.add(file.key);
      console.warn(`[냠냠캐치] 음악 '${file.src}' 을(를) 찾지 못했어요. 다른 곡으로 대신하거나 음악 없이 진행해요.`);
    };
    load.on('loaderror', onError);
    load.on('filecomplete', () => this.refresh()); // 한 곡이 준비될 때마다 바로 재생 시도
    load.once('complete', () => load.off('loaderror', onError));
    load.start();
  }

  // 'menu' → 'music-menu' 처럼 실제로 준비된 곡을 찾아요 (없으면 대신 재생할 곡)
  resolveTrack(name) {
    const candidates = AUDIO.musicFallback[name] || [name];
    const found = candidates.find((candidate) => this.game.cache.audio.exists(`music-${candidate}`));
    return found ? `music-${found}` : null;
  }

  playMusic(name) {
    this.desired = name;
    this.refresh();
  }

  refresh() {
    if (!this.game || this.game.sound.locked) return; // 소리가 아직 허용되지 않았어요
    const key = this.musicOn && this.desired ? this.resolveTrack(this.desired) : null;

    if (this.current && this.current.key === key) {
      if (this.current.sound.isPaused && !this.held) this.current.sound.resume();
      return;
    }
    if (this.current) {
      const old = this.current.sound;
      this.fadeTo(old, 0, () => old.destroy()); // 이전 곡은 서서히 작아지며 꺼져요
    }
    this.current = null;
    if (!key || this.held) return; // 일시정지 중이면 다시 이어할 때 시작해요

    const music = this.game.sound.add(key, { loop: true });
    music.play({ volume: 0 });
    this.current = { key, sound: music };
    this.fadeTo(music, AUDIO.musicVolume, null, 0); // 새 곡은 0에서부터 서서히 커져요
  }

  pauseMusic() {
    this.held = true;
    if (this.current && this.current.sound.isPlaying) this.current.sound.pause();
  }

  resumeMusic() {
    this.held = false;
    this.refresh();
  }

  setMusicOn(on) {
    this.musicOn = on;
    writeFlag(MUSIC_ON_KEY, on);
    this.refresh();
  }

  setSfxOn(on) {
    this.sfxOn = on;
    writeFlag(SFX_ON_KEY, on);
  }

  // 효과음 재생: 파일이 있으면 파일, 없으면 코드로 만든 소리
  play(name) {
    if (!this.game || !this.sfxOn || this.game.sound.locked) return;
    const key = `sfx-${name}`;
    if (this.game.cache.audio.exists(key)) {
      this.game.sound.play(key, { volume: AUDIO.sfxVolume });
      return;
    }
    const ctx = this.game.sound.context; // Web Audio 를 지원하는 브라우저에서만
    if (ctx && SYNTH[name]) SYNTH[name](ctx);
  }

  fadeTo(sound, target, onDone, from = sound.volume) {
    this.fades = this.fades.filter((fade) => fade.sound !== sound);
    sound.setVolume(from);
    this.fades.push({ sound, from, to: target, t: 0, onDone });
  }

  updateFades(delta) {
    if (this.fades.length === 0) return;
    this.fades = this.fades.filter((fade) => {
      fade.t = Math.min(1, fade.t + delta / AUDIO.fadeMs);
      fade.sound.setVolume(fade.from + (fade.to - fade.from) * fade.t);
      if (fade.t < 1) return true;
      if (fade.onDone) fade.onDone();
      return false;
    });
  }
}

export const audio = new AudioManager();
