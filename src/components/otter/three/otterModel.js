import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Ottie in 3D, built in code (no model file to download).
// Colours blend across each surface with vertex colours, and the fur uses a soft "sheen"
// so it reads as plush rather than plastic. Same palette as the SVG Ottie.
export const C = {
  fur: "#b4532a",
  furDark: "#8e3d1c",
  furDeep: "#6e2c12",
  face: "#e3a47c",
  light: "#f8dcc6",
  cream: "#fcebdc",
  ink: "#1f1410",
  blush: "#ef8a70",
};

const col = (hex) => new THREE.Color(hex);
const smooth = THREE.MathUtils.smoothstep;
const v = new THREE.Vector3();
const c = new THREE.Color();

// Sphere → ellipsoid with optional shape tweak and per-vertex colour.
// `paint(p, out)` sets the colour from the unit-sphere point; `shape(p)` may move the point.
function blob([sx, sy, sz], paint, shape, detail = [48, 36]) {
  const g = new THREE.SphereGeometry(1, detail[0], detail[1]);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    paint(v.clone(), c);
    colors.set([c.r, c.g, c.b], i * 3);
    if (shape) shape(v);
    pos.setXYZ(i, v.x * sx, v.y * sy, v.z * sz);
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

export function makeMaterials(clippingPlanes = []) {
  return {
    plush: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      vertexColors: true,
      roughness: 0.8,
      sheen: 0.6,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color("#e89a72"),
      clippingPlanes,
    }),
    plushDark: new THREE.MeshPhysicalMaterial({
      color: C.furDark, roughness: 0.8, sheen: 0.5, sheenRoughness: 0.5,
      sheenColor: new THREE.Color("#d9825a"), clippingPlanes,
    }),
    ink: new THREE.MeshPhysicalMaterial({
      color: C.ink, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, clippingPlanes,
    }),
    nose: new THREE.MeshPhysicalMaterial({
      color: "#2a1a14", roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2, clippingPlanes,
    }),
    shine: new THREE.MeshBasicMaterial({ color: "#ffffff", clippingPlanes }),
    blush: new THREE.MeshBasicMaterial({
      color: C.blush, transparent: true, opacity: 0.38, depthWrite: false, clippingPlanes,
    }),
    whisker: new THREE.MeshBasicMaterial({ color: "#3b2a22", transparent: true, opacity: 0.5, clippingPlanes }),
    bean: new THREE.MeshPhysicalMaterial({ color: "#5a2a1a", roughness: 0.5, clippingPlanes }),
  };
}

function mesh(geo, mat, [x, y, z] = [0, 0, 0], parent) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  parent?.add(m);
  return m;
}

function tube(points, radius, mat, parent) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return mesh(new THREE.TubeGeometry(curve, 20, radius, 6, false), mat, undefined, parent);
}

// Capsule between two points, for arms and legs
function limb(a, b, r, mat, parent) {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const dir = B.clone().sub(A);
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, dir.length(), 10, 20), mat);
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  parent?.add(m);
  return m;
}

// Little mitten paw with toe beans
function paw(mat, beanMat, parent) {
  const g = new THREE.Group();
  const pad = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), mat);
  pad.scale.set(0.2, 0.13, 0.19);
  g.add(pad);
  for (let i = -1; i <= 1; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), beanMat);
    b.scale.set(0.045, 0.03, 0.04);
    b.position.set(i * 0.08, -0.1, 0.1);
    g.add(b);
  }
  parent?.add(g);
  return g;
}

// ---------- Head: centred on the origin, facing +z ----------
export function buildHead(M) {
  const head = new THREE.Group();
  const fur = col(C.fur), deep = col(C.furDark), face = col(C.face), light = col(C.light);

  // Skull: wide and a little flat, darker on top, warm face blending in at the front
  const skull = blob(
    [1.3, 1.0, 1.04],
    (p, out) => {
      out.copy(fur);
      out.lerp(deep, smooth(p.y, 0.45, 1.0) * 0.55);
      out.lerp(face, smooth(p.z, 0.15, 0.7) * smooth(-p.y, -0.45, 0.25));
      out.lerp(light, smooth(p.z, 0.55, 0.95) * smooth(-p.y, 0.05, 0.6) * 0.8);
    },
    (p) => {
      // fuller cheeks
      const cheek = smooth(Math.abs(p.x), 0.4, 0.9) * smooth(-p.y, -0.2, 0.5);
      p.x *= 1 + cheek * 0.08;
      p.y *= 1 - cheek * 0.04;
    }
  );
  mesh(skull, M.plush, [0, 0, 0], head);

  // Muzzle: two puffy pads + chin, cream at the front fading to face colour behind
  const muzzlePaint = (p, out) => out.copy(face).lerp(col(C.cream), smooth(p.z, -0.3, 0.6));
  for (const s of [-1, 1]) {
    mesh(blob([0.38, 0.29, 0.32], muzzlePaint, null, [28, 20]), M.plush, [s * 0.23, -0.38, 0.96], head);
  }
  mesh(blob([0.25, 0.16, 0.22], muzzlePaint, null, [24, 16]), M.plush, [0, -0.6, 0.93], head);

  // Nose: soft rounded triangle with a catch-light
  const noseGeo = blob([0.21, 0.13, 0.14], (p, out) => out.set(1, 1, 1), (p) => {
    p.x *= 1 - smooth(-p.y, -0.2, 1) * 0.35;
  }, [24, 16]);
  const nose = mesh(noseGeo, M.nose, [0, -0.22, 1.22], head);
  nose.rotation.x = -0.25;
  const noseShine = mesh(new THREE.SphereGeometry(1, 12, 8), M.shine, [-0.05, -0.17, 1.33], head);
  noseShine.scale.set(0.05, 0.022, 0.02);

  // Ears
  for (const s of [-1, 1]) {
    const ear = mesh(
      blob([0.24, 0.23, 0.15], (p, out) => out.copy(fur).lerp(col(C.furDeep), smooth(p.z, 0.1, 0.8))),
      M.plush, [s * 1.14, 0.46, 0.02], head
    );
    ear.rotation.y = s * 0.5;
  }

  // Blush
  for (const s of [-1, 1]) {
    const b = mesh(new THREE.CircleGeometry(1, 24), M.blush, [s * 0.8, -0.2, 0.84], head);
    b.scale.set(0.16, 0.09, 1);
    b.rotation.y = s * 0.75;
  }

  // Eyes: big glossy domes with two catch-lights
  const look = new THREE.Group();
  head.add(look);
  const eyes = [];
  for (const s of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(s * 0.45, 0.08, 0.9);
    eye.rotation.y = s * 0.28;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), M.ink);
    ball.scale.set(0.15, 0.17, 0.11);
    eye.add(ball);
    const big = mesh(new THREE.SphereGeometry(1, 12, 10), M.shine, [0.045, 0.06, 0.1], eye);
    big.scale.set(0.045, 0.05, 0.02);
    const small = mesh(new THREE.SphereGeometry(1, 10, 8), M.shine, [-0.04, -0.05, 0.1], eye);
    small.scale.set(0.02, 0.02, 0.01);
    look.add(eye);
    eyes.push(eye);
  }

  // Happy eyes: little arches
  const happy = new THREE.Group();
  for (const s of [-1, 1]) {
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 10, 24, Math.PI), M.ink);
    arc.position.set(s * 0.45, 0.04, 0.99);
    arc.rotation.y = s * 0.28;
    happy.add(arc);
  }
  happy.visible = false;
  head.add(happy);

  // Mouth
  tube([[0, -0.33, 1.27], [0, -0.44, 1.27]], 0.02, M.nose, head);
  tube([[0, -0.44, 1.27], [-0.09, -0.51, 1.28], [-0.19, -0.45, 1.24]], 0.02, M.nose, head);
  tube([[0, -0.44, 1.27], [0.09, -0.51, 1.28], [0.19, -0.45, 1.24]], 0.02, M.nose, head);

  // Whiskers
  for (const s of [-1, 1]) {
    tube([[s * 0.45, -0.35, 1.1], [s * 0.9, -0.29, 1.02], [s * 1.38, -0.25, 0.86]], 0.009, M.whisker, head);
    tube([[s * 0.45, -0.43, 1.1], [s * 0.9, -0.43, 1.02], [s * 1.4, -0.49, 0.86]], 0.009, M.whisker, head);
    tube([[s * 0.44, -0.5, 1.08], [s * 0.85, -0.56, 1.0], [s * 1.28, -0.7, 0.84]], 0.008, M.whisker, head);
  }

  return { head, look, eyes, happy };
}

// ---------- Upright Ottie (peeking over things). Origin = head centre. ----------
export function buildUpright() {
  const M = makeMaterials();
  const root = new THREE.Group();
  const fur = col(C.fur), light = col(C.light), deep = col(C.furDark);

  const body = new THREE.Group();
  body.position.y = -1.55;
  const torso = blob(
    [1.0, 1.18, 0.82],
    (p, out) => {
      out.copy(fur).lerp(deep, smooth(-p.z, 0.2, 0.9) * 0.4);
      out.lerp(light, smooth(p.z, 0.35, 0.8) * smooth(Math.abs(p.x), 0.75, 0.2));
    },
    (p) => {
      const neck = smooth(p.y, 0.25, 1);
      p.x *= 1 - neck * 0.22;
      p.z *= 1 - neck * 0.15;
    }
  );
  mesh(torso, M.plush, [0, 0, 0], body);
  root.add(body);

  const { head, look, eyes, happy } = buildHead(M);
  root.add(head);

  const arms = {};
  for (const [side, s] of [["l", -1], ["r", 1]]) {
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.6, -1.0, 0.5);
    limb([0, 0, 0], [0, -0.52, 0.05], 0.16, M.plushDark, pivot);
    const p = paw(M.plushDark, M.bean, pivot);
    p.position.set(0, -0.62, 0.08);
    pivot.rotation.set(-0.35, 0, -s * 0.55);
    root.add(pivot);
    arms[side] = pivot;
  }

  return { root, head, look, eyes, happy, body, arms, M };
}

// ---------- Laptop screen (drawn on a 2D canvas) ----------
export function makeScreen() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const code = [
    [0, 190, "#ff8a5c"], [44, 290, "#8fa3ff"], [44, 220, "#5fd394"],
    [88, 250, "#e6c9ad"], [44, 160, "#8fa3ff"], [0, 120, "#ff8a5c"],
  ];
  const rr = (x, y, w, h, r, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  };
  const chrome = (bg) => {
    rr(0, 0, 640, 44, 0, bg);
    ["#ff6b5b", "#ffc34d", "#4fd17a"].forEach((cl, i) => rr(22 + i * 26, 15, 14, 14, 7, cl));
  };

  let lastKey = "";
  function draw(t) {
    const cycle = t % 7;
    const phase = cycle < 3 ? "code" : cycle < 4.6 ? "site" : "done";
    const typed = phase === "code" ? Math.min(code.length, Math.floor(cycle / 0.45) + 1) : code.length;
    const caretOn = Math.floor(t * 2.2) % 2 === 0;
    const key = `${phase}-${typed}-${phase === "code" ? caretOn : ""}`;
    if (key === lastKey) return;
    lastKey = key;

    if (phase === "code") {
      ctx.fillStyle = "#1e1714";
      ctx.fillRect(0, 0, 640, 420);
      chrome("#2a201c");
      ctx.font = "500 18px ui-monospace, monospace";
      code.slice(0, typed).forEach(([x, w, cl], i) => {
        ctx.fillStyle = "rgba(255,255,255,.2)";
        ctx.fillText(String(i + 1), 24, 92 + i * 50);
        rr(70 + x, 76 + i * 50, w, 20, 10, cl);
      });
      if (caretOn) {
        const i = typed - 1;
        const [x, w] = code[i];
        ctx.fillStyle = "#fff";
        ctx.fillRect(78 + x + w, 72 + i * 50, 4, 28);
      }
    } else {
      ctx.fillStyle = "#fffaf4";
      ctx.fillRect(0, 0, 640, 420);
      chrome("#f3ebe3");
      rr(130, 12, 380, 20, 10, "#fff");
      rr(40, 76, 300, 40, 10, "#2b211c");
      rr(40, 128, 230, 18, 9, "#c9a98d");
      rr(40, 156, 190, 18, 9, "#e3cdb8");
      rr(40, 194, 130, 40, 20, "#bf4b1c");
      const grad = ctx.createLinearGradient(380, 76, 600, 240);
      grad.addColorStop(0, "#f7b98f");
      grad.addColorStop(1, "#bf4b1c");
      rr(380, 76, 220, 158, 16, grad);
      for (let i = 0; i < 3; i++) rr(40 + i * 190, 266, 170, 120, 14, "#f6e4d4");
      if (phase === "done") {
        ctx.fillStyle = "rgba(43,33,28,.25)";
        ctx.fillRect(0, 0, 640, 420);
        rr(170, 168, 300, 84, 42, "#2f9e5b");
        ctx.fillStyle = "#fff";
        ctx.font = "700 38px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Deployed ✓", 320, 211);
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";
      }
    }
    tex.needsUpdate = true;
  }
  draw(0);
  return { tex, draw };
}

function buildLaptop() {
  const laptop = new THREE.Group();
  const alu = new THREE.MeshPhysicalMaterial({ color: "#d9d4cf", metalness: 0.85, roughness: 0.32, clearcoat: 0.3 });
  const bezel = new THREE.MeshPhysicalMaterial({ color: "#121010", roughness: 0.25, clearcoat: 1 });
  const keyMat = new THREE.MeshStandardMaterial({ color: "#2a2624", roughness: 0.7 });

  laptop.add(new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.07, 1.2, 4, 0.03), alu));

  // One shared key shape, instanced
  const keyGeo = new RoundedBoxGeometry(0.11, 0.02, 0.1, 2, 0.01);
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, 44);
  const m = new THREE.Matrix4();
  let n = 0;
  for (let r = 0; r < 4; r++) {
    for (let k = 0; k < 11; k++) {
      m.makeTranslation(-0.66 + k * 0.132, 0.04, -0.4 + r * 0.13);
      keys.setMatrixAt(n++, m);
    }
  }
  laptop.add(keys);
  const pad = new THREE.Mesh(
    new RoundedBoxGeometry(0.5, 0.01, 0.28, 2, 0.005),
    new THREE.MeshPhysicalMaterial({ color: "#cfc9c3", metalness: 0.7, roughness: 0.25 })
  );
  pad.position.set(0, 0.037, 0.38);
  laptop.add(pad);

  const hinge = new THREE.Group();
  hinge.position.set(0, 0.035, -0.58);
  hinge.rotation.x = -0.14;
  const lid = new THREE.Mesh(new RoundedBoxGeometry(1.8, 1.2, 0.05, 4, 0.025), alu);
  lid.position.set(0, 0.6, -0.01);
  hinge.add(lid);
  const glass = new THREE.Mesh(new RoundedBoxGeometry(1.74, 1.14, 0.01, 3, 0.004), bezel);
  glass.position.set(0, 0.6, 0.018);
  hinge.add(glass);
  const screen = makeScreen();
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.05),
    new THREE.MeshBasicMaterial({ map: screen.tex, toneMapped: false })
  );
  display.position.set(0, 0.61, 0.025);
  hinge.add(display);
  laptop.add(hinge);
  return { laptop, screen };
}

// ---------- Floating Ottie (hero). Origin = water level. ----------
export function buildFloat() {
  // Clips the otter below the water surface (keeps everything above y = 0.12)
  const waterline = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.12);
  const M = makeMaterials([waterline]);
  const fur = col(C.fur), light = col(C.light), cream = col(C.cream), deep = col(C.furDark);

  const root = new THREE.Group();
  const bob = new THREE.Group();
  root.add(bob);
  const lift = new THREE.Group(); // raises the otter so more of it sits above the water
  lift.position.y = 0.28;
  bob.add(lift);

  // Torpedo body lying on its back: cream belly on top, tapering to the tail
  const torso = blob(
    [2.05, 0.76, 1.0],
    (p, out) => {
      out.copy(fur).lerp(deep, smooth(-p.y, 0.1, 0.8) * 0.5);
      const belly = smooth(p.y, 0.3, 0.8) * smooth(Math.abs(p.z), 0.85, 0.35);
      out.lerp(light, belly);
      out.lerp(cream, belly * smooth(p.y, 0.7, 1) * 0.6);
    },
    (p) => {
      const toTail = smooth(p.x, 0.0, 1.0);
      const toHead = smooth(-p.x, 0.5, 1.0);
      const k = 1 - toTail * 0.42 - toHead * 0.12;
      p.y *= k;
      p.z *= k;
      p.y += toTail * 0.08;
    },
    [64, 40]
  );
  mesh(torso, M.plush, [0.25, 0.05, 0], lift);

  // Neck/shoulders
  mesh(
    blob([0.78, 0.66, 0.8], (p, out) => out.copy(fur).lerp(light, smooth(p.y, 0.4, 0.9) * smooth(p.x, -0.2, 0.6))),
    M.plush, [-1.42, 0.32, 0], lift
  );

  // Tail: long and tapered
  const tail = new THREE.Group();
  tail.position.set(2.0, 0.12, 0);
  const tailGeo = blob(
    [1.05, 0.2, 0.34],
    (p, out) => out.copy(deep).lerp(col(C.furDeep), smooth(p.x, 0, 1) * 0.5),
    (p) => {
      const k = 1 - smooth(p.x, -0.8, 1) * 0.75;
      p.y *= k;
      p.z *= k;
    },
    [40, 20]
  );
  const tailMesh = mesh(tailGeo, M.plush, [0.85, 0.14, 0], tail);
  tailMesh.rotation.z = 0.3;
  lift.add(tail);

  // Feet sticking up, webbed and dark
  const feet = [];
  for (const [z, rz] of [[0.34, -0.28], [-0.3, 0.22]]) {
    const pivot = new THREE.Group();
    pivot.position.set(1.8, 0.45, z);
    limb([0, 0, 0], [0.05, 0.3, 0], 0.12, M.plushDark, pivot);
    const foot = mesh(
      blob([0.22, 0.3, 0.13], (p, out) => out.copy(deep).lerp(col(C.furDeep), smooth(p.z, 0, 1) * 0.6)),
      M.plush, [0.06, 0.55, 0], pivot
    );
    foot.rotation.z = 0.1;
    pivot.rotation.z = rz;
    lift.add(pivot);
    feet.push(pivot);
  }

  // Laptop on the belly
  const { laptop, screen } = buildLaptop();
  laptop.position.set(0.35, 0.87, 0.45);
  laptop.rotation.set(0.12, -0.08, 0);
  laptop.scale.setScalar(1.12);
  lift.add(laptop);

  // Head looking at the viewer
  const { head, look, eyes, happy } = buildHead(M);
  head.scale.setScalar(0.92);
  head.position.set(-2.05, 0.98, 0.35);
  head.rotation.set(0, 0.28, 0.12);
  lift.add(head);

  // Arms reaching to the keyboard
  const paws = [];
  for (const z of [0.46, -0.3]) {
    const pivot = new THREE.Group();
    pivot.position.set(-1.12, 0.66, z);
    const reach = [0.86, 0.34, -z * 0.3];
    limb([0, 0, 0], reach, 0.15, M.plushDark, pivot);
    const p = paw(M.plushDark, M.bean, pivot);
    p.position.set(reach[0] + 0.04, reach[1] + 0.02, reach[2]);
    p.rotation.z = -0.3;
    lift.add(pivot);
    paws.push(pivot);
  }

  // Water: soft glow + contact shadow + ripple rings
  const water = new THREE.Group();
  const radial = (stops) => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 256;
    const g = cv.getContext("2d");
    const grad = g.createRadialGradient(128, 128, 4, 128, 128, 128);
    stops.forEach(([o, cl]) => grad.addColorStop(o, cl));
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const flat = (tex, sx, sz, y, x = 0) => {
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(1, 64),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false })
    );
    disc.rotation.x = -Math.PI / 2;
    disc.scale.set(sx, sz, 1);
    disc.position.set(x, y, 0);
    water.add(disc);
  };
  flat(radial([[0, "rgba(246,196,166,.75)"], [0.5, "rgba(246,196,166,.35)"], [1, "rgba(246,196,166,0)"]]), 5.2, 2.6, 0.11);
  flat(radial([[0, "rgba(120,50,20,.28)"], [0.6, "rgba(120,50,20,.1)"], [1, "rgba(120,50,20,0)"]]), 3.0, 1.15, 0.115, 0.2);

  const ripples = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.985, 1, 128),
      new THREE.MeshBasicMaterial({ color: "#d9774a", transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.12;
    water.add(ring);
    ripples.push(ring);
  }
  root.add(water);

  return { root, bob, head, look, eyes, happy, tail, feet, paws, laptop, screen, ripples, M };
}
