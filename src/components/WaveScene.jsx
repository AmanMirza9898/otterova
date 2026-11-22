import { useEffect, useRef } from "react";
import * as THREE from "three";

// A field of points shaped into a moving water surface.
// The cursor sends ripples through it; scrolling raises the waves.

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uScroll;
  uniform float uPR;
  varying float vH;
  varying float vDepth;

  void main() {
    vec3 p = position;
    float t = uTime * 0.55;

    float h = sin(p.x * 0.22 + t) * 0.85
            + cos(p.z * 0.32 + t * 0.8) * 0.65
            + sin((p.x + p.z) * 0.14 + t * 1.25) * 0.45;

    float d = distance(p.xz, uMouse);
    h += exp(-d * d * 0.035) * 1.8 * sin(d * 1.1 - uTime * 3.2) * uMouseStrength;

    h *= 1.0 + uScroll * 1.4;
    p.y = h;
    vH = h;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 2.4 * uPR * (26.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vH;
  varying float vDepth;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;

    float m = smoothstep(-0.4, 2.2, vH);
    vec3 col = mix(uColorA, uColorB, m);
    float fade = smoothstep(58.0, 16.0, vDepth);
    gl_FragColor = vec4(col, fade * (0.3 + m * 0.7));
  }
`;

export default function WaveScene() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // WebGL not available: the hero still works without the scene
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    camera.position.set(0, 8.5, 26);
    camera.lookAt(0, 0, 0);

    // Grid of points on the XZ plane
    const cols = mobile ? 90 : 170;
    const rows = mobile ? 50 : 70;
    const spacing = mobile ? 0.5 : 0.4;
    const positions = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < cols; x++) {
        positions[i++] = (x - cols / 2) * spacing;
        positions[i++] = 0;
        positions[i++] = (z - rows / 2) * spacing;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseStrength: { value: 0 },
      uScroll: { value: 0 },
      uPR: { value: renderer.getPixelRatio() },
      uColorA: { value: new THREE.Color("#dcb89a") },
      uColorB: { value: new THREE.Color("#bf4b1c") },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Cursor -> point on the water plane
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const mouseTarget = new THREE.Vector2(999, 999);
    let strengthTarget = 0;

    const onPointerMove = (e) => {
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top - 200 || e.clientY > r.bottom) {
        strengthTarget = 0;
        return;
      }
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        mouseTarget.set(hit.x, hit.z);
        strengthTarget = 1;
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const clock = new THREE.Clock();
    const render = () => {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;

      if (uniforms.uMouse.value.x > 900) uniforms.uMouse.value.copy(mouseTarget);
      uniforms.uMouse.value.lerp(mouseTarget, 0.06);
      uniforms.uMouseStrength.value += (strengthTarget - uniforms.uMouseStrength.value) * 0.04;

      const scroll = Math.min(window.scrollY / window.innerHeight, 1);
      uniforms.uScroll.value += (scroll - uniforms.uScroll.value) * 0.08;

      points.rotation.y = Math.sin(t * 0.05) * 0.08;
      camera.position.y = 8.5 + uniforms.uScroll.value * 4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    // Only animate while the hero is on screen
    let running = false;
    const io = new IntersectionObserver(([entry]) => {
      if (reduce) return;
      if (entry.isIntersecting && !running) {
        renderer.setAnimationLoop(render);
        running = true;
      } else if (!entry.isIntersecting && running) {
        renderer.setAnimationLoop(null);
        running = false;
      }
    });
    io.observe(el);
    render();

    // Fade in once the first frame is ready
    requestAnimationFrame(() => el.classList.add("is-ready"));

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      renderer.setAnimationLoop(null);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className="wave-scene" aria-hidden="true" />;
}
