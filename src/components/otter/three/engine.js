import * as THREE from "three";
import gsap from "gsap";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildUpright, buildFloat } from "./otterModel.js";

// One WebGL renderer draws every 3D Ottie on the page. Each Ottie has its own 2D canvas;
// the shared renderer draws a frame and copies it across. This keeps us to a single
// WebGL context no matter how many otters are on screen.

let renderer = null;
let failed = false;
const instances = new Set();
const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = gsap.utils.clamp;
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));

function getRenderer() {
  if (renderer || failed) return renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.localClippingEnabled = true;
    renderer.setPixelRatio(1);
  } catch {
    failed = true;
  }
  return renderer;
}

export function webglAvailable() {
  return !!getRenderer();
}

// Soft studio reflections, generated once and shared by every scene
let envMap = null;
function getEnvMap() {
  if (!envMap) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  }
  return envMap;
}

function addLights(scene) {
  scene.environment = getEnvMap();
  scene.environmentIntensity = 0.35;
  scene.add(new THREE.HemisphereLight("#fff3e8", "#8e3d1c", 0.55));
  const key = new THREE.DirectionalLight("#fff4ea", 1.8);
  key.position.set(3, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight("#ffc9a0", 2.2);
  rim.position.set(-5, 4, -5);
  scene.add(rim);
  const fill = new THREE.DirectionalLight("#ffe3d2", 0.5);
  fill.position.set(-5, 0, 5);
  scene.add(fill);
}

// ---------- render loop ----------
let last = 0;
let ticking = false;
const size = new THREE.Vector2();

function draw(inst) {
  const { canvas, ctx } = inst;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.round(canvas.clientWidth * dpr);
  const h = Math.round(canvas.clientHeight * dpr);
  if (!w || !h) return;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    inst.camera.aspect = w / h;
    inst.camera.updateProjectionMatrix();
  }
  renderer.getSize(size);
  if (size.x < w || size.y < h) renderer.setSize(Math.max(size.x, w), Math.max(size.y, h), false);
  const H = renderer.domElement.height;
  renderer.setViewport(0, 0, w, h);
  renderer.setScissor(0, 0, w, h);
  renderer.setScissorTest(true);
  renderer.clear();
  renderer.render(inst.scene, inst.camera);
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(renderer.domElement, 0, H - h, w, h, 0, 0, w, h);
}

function tick() {
  const now = performance.now() / 1000;
  const dt = Math.min(0.05, now - (last || now));
  last = now;
  const still = reduce();
  for (const inst of instances) {
    if (!inst.visible) continue;
    if (still && !inst.dirty) continue;
    inst.t += still ? 0 : dt;
    inst.update(still ? 0 : dt, inst.t);
    draw(inst);
    inst.dirty = false;
  }
}

function start() {
  if (ticking) return;
  ticking = true;
  gsap.ticker.add(tick);
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }, { passive: true });
}

// Pointer position relative to a canvas, roughly -1..1 across the viewport
function aim(canvas, yBias = 0.4) {
  const r = canvas.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height * yBias;
  return {
    x: clamp(-1, 1, ((pointer.x - cx) / window.innerWidth) * 2.2),
    y: clamp(-1, 1, ((pointer.y - cy) / window.innerHeight) * 2.2),
  };
}

function blinker() {
  let next = 1 + Math.random() * 2;
  let phase = -1;
  let double = false;
  return (dt) => {
    next -= dt;
    if (phase < 0 && next <= 0) { phase = 0; double = Math.random() < 0.25; }
    if (phase >= 0) {
      phase += dt;
      const d = 0.16;
      const p = phase / d;
      const s = p < 1 ? 1 - Math.sin(p * Math.PI) * 0.9 : 1;
      if (p >= 1) {
        if (double) { double = false; phase = 0; return 1; }
        phase = -1;
        next = 2 + Math.random() * 3;
      }
      return s;
    }
    return 1;
  };
}

function register(canvas, inst) {
  if (!getRenderer()) return null;
  start();
  inst.canvas = canvas;
  inst.ctx = canvas.getContext("2d");
  inst.t = 0;
  inst.visible = false;
  inst.dirty = true;
  const io = new IntersectionObserver(([e]) => {
    inst.visible = e.isIntersecting;
    inst.dirty = true;
  }, { rootMargin: "100px" });
  io.observe(canvas);
  const ro = new ResizeObserver(() => { inst.dirty = true; });
  ro.observe(canvas);
  instances.add(inst);
  inst.ready = true;
  inst.destroy = () => {
    io.disconnect();
    ro.disconnect();
    instances.delete(inst);
    inst.scene.traverse((o) => {
      if (o.isMesh) {
        o.geometry?.dispose();
        o.material.map?.dispose();
        o.material.dispose();
      }
    });
  };
  return inst;
}

// ---------- Upright Ottie ----------
export function mountUpright(canvas) {
  const scene = new THREE.Scene();
  addLights(scene);
  const o = buildUpright();
  scene.add(o.root);

  const camera = new THREE.PerspectiveCamera(30, 200 / 230, 0.1, 50);
  camera.position.set(0, -0.5, 7.2);
  camera.lookAt(0, -0.5, 0);

  const blink = blinker();
  const fx = { shake: 0, hop: 0 };
  let yaw = 0, pitch = 0;

  const inst = {
    scene,
    camera,
    update(dt, t) {
      const a = aim(canvas);
      yaw = damp(yaw, a.x * 0.55, 6, dt || 1);
      pitch = damp(pitch, a.y * 0.35, 6, dt || 1);
      o.head.rotation.y = yaw;
      o.head.rotation.x = pitch;
      o.head.rotation.z = Math.sin(t * 1.2) * 0.035 - yaw * 0.12 + fx.shake;
      o.look.position.x = yaw * 0.06;
      o.look.position.y = -pitch * 0.05;
      o.body.rotation.y = yaw * 0.25;
      o.body.scale.y = 1 + Math.sin(t * 3.2) * 0.018;
      o.root.position.y = fx.hop;
      const s = blink(dt);
      for (const e of o.eyes) e.scale.y = s;
    },
    setMood(mood) {
      const happy = mood === "happy";
      o.happy.visible = happy;
      o.look.visible = !happy;
      inst.dirty = true;
    },
    wave(side = "r", times = 3) {
      const pivot = o.arms[side];
      const s = side === "r" ? 1 : -1;
      const rest = -s * 0.55;
      const up = s * 2.5;
      return gsap.timeline()
        .to(pivot.rotation, { z: up, x: -0.1, duration: 0.35, ease: "back.out(2)" })
        .to(pivot.rotation, { z: up - s * 0.4, duration: 0.16, yoyo: true, repeat: times * 2 - 1, ease: "sine.inOut" })
        .to(pivot.rotation, { z: rest, x: -0.35, duration: 0.5, ease: "power3.inOut" });
    },
    shake() {
      return gsap.fromTo(fx, { shake: 0 }, { shake: 0.18, duration: 0.09, yoyo: true, repeat: 5, ease: "sine.inOut", onComplete: () => { fx.shake = 0; } });
    },
    hop() {
      return gsap.to(fx, { hop: 0.35, duration: 0.22, ease: "power2.out", yoyo: true, repeat: 1 });
    },
  };
  return register(canvas, inst);
}

// ---------- Floating Ottie (hero) ----------
export function mountFloat(canvas) {
  const scene = new THREE.Scene();
  addLights(scene);
  const o = buildFloat();
  scene.add(o.root);

  const camera = new THREE.PerspectiveCamera(30, 520 / 330, 0.1, 60);
  camera.position.set(0.15, 2.6, 9.0);
  camera.lookAt(0.15, 0.85, 0);

  const blink = blinker();
  const fx = { jump: 0, spin: 0 };
  let yaw = 0, pitch = 0, rootYaw = 0;

  const inst = {
    scene,
    camera,
    update(dt, t) {
      const a = aim(canvas, 0.35);
      yaw = damp(yaw, a.x * 0.5, 5, dt || 1);
      pitch = damp(pitch, a.y * 0.3, 5, dt || 1);
      rootYaw = damp(rootYaw, a.x * 0.18, 2.5, dt || 1);

      o.bob.rotation.y = rootYaw + fx.spin;
      o.bob.position.y = Math.sin(t * 1.6) * 0.07 + fx.jump;
      o.bob.rotation.z = Math.sin(t * 1.3) * 0.025;
      o.bob.rotation.x = Math.sin(t * 1.1 + 1) * 0.02;

      o.head.rotation.y = 0.28 + yaw;
      o.head.rotation.x = pitch;
      o.head.rotation.z = 0.12 + Math.sin(t * 1.4) * 0.04;
      o.look.position.x = yaw * 0.06;
      const s = blink(dt);
      for (const e of o.eyes) e.scale.y = s;

      o.tail.rotation.y = Math.sin(t * 1.8) * 0.18;
      o.tail.rotation.z = Math.sin(t * 1.5) * 0.08;
      o.feet[0].rotation.x = Math.sin(t * 3.0) * 0.18;
      o.feet[1].rotation.x = Math.sin(t * 3.0 + 1.4) * 0.18;

      // Typing
      const typing = t % 7 < 3;
      o.paws[0].rotation.z = typing ? Math.max(0, Math.sin(t * 22)) * 0.06 : 0;
      o.paws[1].rotation.z = typing ? Math.max(0, Math.sin(t * 22 + 1.6)) * 0.06 : 0;
      o.screen.draw(t);

      // Ripples spreading out from the otter
      o.ripples.forEach((ring, i) => {
        const p = ((t * 0.35 + i / o.ripples.length) % 1);
        const sc = 2.2 + p * 2.8;
        ring.scale.set(sc * 1.25, sc * 0.75, 1);
        ring.material.opacity = (1 - p) * 0.22 * Math.min(1, p * 6);
      });
    },
    jump() {
      return gsap.timeline()
        .to(fx, { jump: 0.9, duration: 0.32, ease: "power2.out" })
        .to(fx, { spin: "+=" + Math.PI * 2, duration: 0.7, ease: "power2.inOut" }, 0)
        .to(fx, { jump: 0, duration: 0.45, ease: "bounce.out" }, 0.32)
        .add(() => { fx.spin = 0; });
    },
  };
  return register(canvas, inst);
}
