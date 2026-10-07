import { useEffect, useRef } from "react";
import * as THREE from "../../assets/three.module.js";

const vertexShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    vUv = uv;
    vec3 p = position;
    float a = sin(p.x * 1.35 + uTime * .72 + sin(p.y * 1.2)) * .032;
    float b = cos(p.y * 1.55 - uTime * .56 + p.x * .42) * .042;
    float c = sin((p.x + p.y) * 1.4 - uTime * .4) * .023;
    p.z += a + b + c + uPointer.x * p.x * .04;
    p.x += sin(p.y * .75 + uTime * .2) * .028 + uPointer.x * .075;
    p.y += cos(p.x * .72 - uTime * .18) * .022 - uPointer.y * .04;
    vWave = a + b + c;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  vec3 linearize(vec3 c) {
    vec3 lo = c / 12.92;
    vec3 hi = pow((c + .055) / 1.055, vec3(2.4));
    return mix(hi, lo, step(c, vec3(.04045)));
  }
  vec3 encodeColor(vec3 c) {
    c = max(c, vec3(0.0));
    vec3 lo = c * 12.92;
    vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - .055;
    return mix(hi, lo, step(c, vec3(.0031308)));
  }
  void main() {
    float flow = sin(vUv.y * 13.0 + vUv.x * 6.0 - uTime * .48 + sin(vUv.x * 9.0 + uTime * .19)) * .5
      + cos(vUv.x * 15.0 - vUv.y * 4.0 + uTime * .32) * .5;
    vec2 uv = vUv + vec2(flow * .006, cos(vUv.x * 11.0 + uTime * .38) * .004);
    vec4 texel = texture2D(uMap, uv);
    if (texel.a < .025) discard;
    float split = .003 + abs(vWave) * .04;
    float r = texture2D(uMap, uv + vec2(split, 0.0)).r;
    float b = texture2D(uMap, uv - vec2(split, 0.0)).b;
    vec3 color = linearize(vec3(r, texel.g, b));
    float spec = sin(vUv.x * 5.2 + vUv.y * 2.4 - uTime * .42 + flow) * .5 + .5;
    float flash = smoothstep(.78, .99, spec) * .4;
    vec3 citrus = vec3(.92, 1.04, .22);
    vec3 coral = vec3(1.14, .25, .11);
    vec3 aqua = vec3(.12, .76, .82);
    vec3 tint = mix(citrus, coral, smoothstep(.2, .75, vUv.x + sin(uTime * .2) * .12));
    tint = mix(tint, aqua, smoothstep(.69, .95, vUv.y) * .32);
    color = mix(color, color * tint + tint * .13, flash);
    gl_FragColor = vec4(encodeColor(color), texel.a);
  }
`;

export default function HeroPortrait() {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    let renderer;
    let observer;
    let texture;
    let portrait;
    let portraitGroup;
    let disposed = false;
    let visible = true;
    const pointer = new THREE.Vector2();
    let px = 0;
    let py = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      host.classList.add("portrait-failed");
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1.1 : 1.45));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
    camera.position.set(0, 0, 10.7);
    portraitGroup = new THREE.Group();
    scene.add(portraitGroup);

    const resize = () => {
      if (!renderer) return;
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      camera.position.z = window.innerWidth < 720 ? 11.5 : 10.7;
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const onPointer = (event) => {
      const rect = host.getBoundingClientRect();
      if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
        px = ((event.clientX - rect.left) / rect.width - .5) * 2;
        py = ((event.clientY - rect.top) / rect.height - .5) * 2;
      }
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const draw = (ms = 0) => {
      if (disposed || !visible || document.hidden) return;
      const time = reduceMotion ? 0 : ms * .001;
      pointer.set(px, py);
      if (portrait) {
        portrait.material.uniforms.uTime.value = time;
        portrait.material.uniforms.uPointer.value.copy(pointer);
        portrait.rotation.y += ((px * .045 - .045) - portrait.rotation.y) * .025;
        portrait.rotation.x += ((-py * .025) - portrait.rotation.x) * .025;
      }
      if (portraitGroup) portraitGroup.rotation.z = reduceMotion ? 0 : Math.sin(time * .18) * .012;
      renderer.render(scene, camera);
    };
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      renderer.setAnimationLoop(visible && !document.hidden ? draw : null);
    }, { threshold: 0.01 });
    observer.observe(host);
    const onVisibility = () => renderer.setAnimationLoop(visible && !document.hidden ? draw : null);
    document.addEventListener("visibilitychange", onVisibility);

    const loader = new THREE.TextureLoader();
    loader.load("/assets/liquid-chrome-face-cutout.png", (loaded) => {
      if (disposed) { loaded.dispose(); return; }
      texture = loaded;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      const material = new THREE.ShaderMaterial({
        uniforms: { uMap: { value: texture }, uTime: { value: 0 }, uPointer: { value: pointer } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        vertexShader,
        fragmentShader,
      });
      portrait = new THREE.Mesh(new THREE.PlaneGeometry(5.45, 6.83, 96, 112), material);
      portraitGroup.add(portrait);
      portrait.position.set(0, -.02, .04);
      portrait.rotation.set(-.015, -.045, -.01);
      host.classList.add("portrait-ready");
      renderer.setAnimationLoop(visible && !document.hidden ? draw : null);
    }, undefined, () => host.classList.add("portrait-failed"));

    renderer.setAnimationLoop(draw);
    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      portrait?.geometry?.dispose();
      portrait?.material?.dispose();
      texture?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return <div className="portrait-webgl" ref={hostRef} aria-hidden="true"><canvas ref={canvasRef} /><img src="/assets/liquid-chrome-face-cutout.png" alt="" /></div>;
}
