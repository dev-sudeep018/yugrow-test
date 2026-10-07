import * as THREE from './assets/three.module.js';
import { animate, createDrawable } from './assets/anime.esm.min.js';
import { animate as motionAnimate } from './assets/motion.bundle.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const faceCanvas = document.querySelector('#liquid-face');

startFaceScene();
setupBrandMark();
setupMenu();
setupNavigation();
setupRouteTabs();
setupMethodTabs();
setupCreativeTabs();
setupBriefBuilder();
setupSectionMotion();

function setupBrandMark() {
  const path = document.querySelector('.brand-symbol-path');
  if (!path || reduceMotion) return;
  const [markStroke] = createDrawable(path);
  animate(markStroke, {
    draw: '0 1',
    duration: 1350,
    delay: 180,
    ease: 'inOutCubic'
  });
}

function startFaceScene() {
  if (!faceCanvas) return;
  const host = faceCanvas.parentElement;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: faceCanvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (error) {
    console.info('WebGL unavailable; showing the still chrome portrait.', error);
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 10.5);
  const portraitRig = new THREE.Group();
  const routeRig = new THREE.Group();
  scene.add(routeRig, portraitRig);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const resize = () => {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1.15 : 1.5));
    renderer.setSize(w, h, false);
    const mobile = window.innerWidth < 720;
    camera.position.z = mobile ? 11.3 : 10.5;
    portraitRig.position.set(mobile ? 0 : -0.08, mobile ? -0.12 : -0.06, 0);
    portraitRig.scale.setScalar(mobile ? 0.98 : 1);
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  window.addEventListener('resize', resize, { passive: true });

  const pointer = new THREE.Vector2(0, 0);
  let pointerX = 0;
  let pointerY = 0;
  window.addEventListener('pointermove', (event) => {
    const box = host.getBoundingClientRect();
    if (event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom) {
      pointerX = ((event.clientX - box.left) / box.width - 0.5) * 2;
      pointerY = ((event.clientY - box.top) / box.height - 0.5) * 2;
    }
  }, { passive: true });

  const addPath = (points, color, radius, offsetZ) => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2] + offsetZ)));
    const geometry = new THREE.TubeGeometry(curve, 120, radius, 7, false);
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 });
    const path = new THREE.Mesh(geometry, material);
    routeRig.add(path);
  };
  addPath([[-3.3,-2.3,0],[-2.5,-1.8,0],[-2.5,.2,0],[-1.5,1.8,0],[-.75,2.7,0]], 0xdfff32, 0.024, -0.8);
  addPath([[3.15,-2.4,0],[2.55,-1.35,0],[2.35,.45,0],[1.65,1.8,0],[.9,2.55,0]], 0xff543d, 0.028, -0.82);
  addPath([[-3.0,-2.55,0],[-1.75,-2.95,0],[0,-2.8,0],[1.85,-2.7,0],[3.05,-2.25,0]], 0x9ef0de, 0.018, -0.84);

  const loader = new THREE.TextureLoader();
  loader.load('./assets/liquid-chrome-face-cutout.png', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    const uniforms = {
      uMap: { value: texture },
      uTime: { value: 0 },
      uPointer: { value: pointer }
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: [
        'uniform float uTime;',
        'uniform vec2 uPointer;',
        'varying vec2 vUv;',
        'varying float vWave;',
        'void main(){',
        'vUv=uv;',
        'vec3 p=position;',
        'float a=sin(p.x*1.35+uTime*.72+sin(p.y*1.2))*.032;',
        'float b=cos(p.y*1.55-uTime*.56+p.x*.42)*.042;',
        'float c=sin((p.x+p.y)*1.4-uTime*.4)*.023;',
        'p.z+=a+b+c+uPointer.x*p.x*.04;',
        'p.x+=sin(p.y*.75+uTime*.2)*.028+uPointer.x*.075;',
        'p.y+=cos(p.x*.72-uTime*.18)*.022-uPointer.y*.04;',
        'vWave=a+b+c;',
        'gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D uMap;',
        'uniform float uTime;',
        'varying vec2 vUv;',
        'varying float vWave;',
        'vec3 linearize(vec3 c){',
        'vec3 lo=c/12.92;',
        'vec3 hi=pow((c+0.055)/1.055,vec3(2.4));',
        'return mix(hi,lo,step(c,vec3(0.04045)));',
        '}',
        'vec3 encodeColor(vec3 c){',
        'c=max(c,vec3(0.0));',
        'vec3 lo=c*12.92;',
        'vec3 hi=1.055*pow(c,vec3(1.0/2.4))-0.055;',
        'return mix(hi,lo,step(c,vec3(0.0031308)));',
        '}',
        'void main(){',
        'float flow=sin(vUv.y*13.0+vUv.x*6.0-uTime*.48+sin(vUv.x*9.0+uTime*.19))*.5+cos(vUv.x*15.0-vUv.y*4.0+uTime*.32)*.5;',
        'vec2 uv=vUv+vec2(flow*.006,cos(vUv.x*11.0+uTime*.38)*.004);',
        'vec4 texel=texture2D(uMap,uv);',
        'float alpha=texel.a;',
        'if(alpha<.025) discard;',
        'float split=.003+abs(vWave)*.04;',
        'float r=texture2D(uMap,uv+vec2(split,0.0)).r;',
        'float b=texture2D(uMap,uv-vec2(split,0.0)).b;',
        'vec3 color=linearize(vec3(r,texel.g,b));',
        'float spec=sin(vUv.x*5.2+vUv.y*2.4-uTime*.42+flow)*.5+.5;',
        'float flash=smoothstep(.78,.99,spec)*.42;',
        'vec3 lime=vec3(0.88,1.16,0.24);',
        'vec3 coral=vec3(1.24,0.23,0.12);',
        'vec3 cyan=vec3(0.18,1.18,1.05);',
        'vec3 tint=mix(lime,coral,smoothstep(.25,.74,vUv.x+sin(uTime*.2)*.12));',
        'tint=mix(tint,cyan,smoothstep(.69,.95,vUv.y)*.32);',
        'color=mix(color,color*tint+tint*.13,flash);',
        'gl_FragColor=vec4(encodeColor(color),alpha);',
        '}'
      ].join('\n')
    });

    const portrait = new THREE.Mesh(new THREE.PlaneGeometry(5.45, 6.82, 96, 120), material);
    portraitRig.add(portrait);
    portrait.position.set(0, 0.02, 0.05);
    portrait.rotation.set(-0.015, -0.045, -0.01);
    document.body.classList.add('scene-ready');

    let inView = true;
    const draw = (ms) => {
      const time = reduceMotion ? 0 : ms * 0.001;
      uniforms.uTime.value = time;
      pointer.set(pointerX, pointerY);
      portrait.rotation.y += ((pointerX * 0.045 - 0.045) - portrait.rotation.y) * 0.02;
      portrait.rotation.x += ((-pointerY * 0.025) - portrait.rotation.x) * 0.02;
      portraitRig.rotation.z = reduceMotion ? 0 : Math.sin(time * 0.18) * 0.012;
      routeRig.rotation.z = reduceMotion ? 0 : Math.sin(time * 0.12) * 0.018;
      renderer.render(scene, camera);
    };
    const observer = new IntersectionObserver((entries) => {
      inView = entries[0] ? entries[0].isIntersecting : true;
      renderer.setAnimationLoop(inView && !document.hidden ? draw : null);
    }, { threshold: 0.01 });
    observer.observe(host);
    document.addEventListener('visibilitychange', () => renderer.setAnimationLoop(inView && !document.hidden ? draw : null));
    renderer.setAnimationLoop(draw);
  }, undefined, (error) => {
    console.info('The local chrome portrait could not load; showing the still image.', error);
  });
}

function setupMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const header = document.querySelector('.site-header');
  if (!toggle || !menu || !header) return;
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    if (open) menu.style.setProperty('--menu-top', `${header.getBoundingClientRect().bottom + 7}px`);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('is-open', open);
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
}

function setupNavigation() {
  const nav = document.querySelector('.desktop-nav');
  const desktopLinks = Array.from(document.querySelectorAll('.desktop-nav [data-nav]'));
  const mobileLinks = Array.from(document.querySelectorAll('.mobile-menu a'));
  const sections = Array.from(document.querySelectorAll('main section'));
  if (!nav || !desktopLinks.length || !sections.length || !('IntersectionObserver' in window)) return;

  const ratios = new Map(sections.map((section) => [section, 0]));
  const paint = (index, currentSection = null) => {
    const selected = Math.max(0, Math.min(2, index));
    nav.style.setProperty('--nav-signal', ['16.67%', '50%', '83.33%'][selected]);
    desktopLinks.forEach((link, i) => {
      const current = i === selected;
      link.classList.toggle('is-current', current);
      if (current && link.hash === `#${currentSection?.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    mobileLinks.forEach((link, i) => link.classList.toggle('is-current', i === selected));
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
    const [section, ratio] = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0] || [];
    if (section && ratio > 0.025) {
      const sectionIndex = sections.indexOf(section);
      paint(sectionIndex < 4 ? 0 : sectionIndex < 5 ? 1 : 2, section);
    }
  }, { threshold: [0, 0.12, 0.3, 0.55, 0.8] });
  sections.forEach((section) => observer.observe(section));
  paint(0);
}

function setupRouteTabs() {
  const tabs = Array.from(document.querySelectorAll('[data-route]'));
  const list = document.querySelector('#route-services');
  const data = {
    brand: {
      title: 'Make each<br>touchpoint work<br>as one.',
      description: 'Connect social, creative, paid media and the on-site experience around a clear reason to buy and come back.',
      mapTitle: 'A customer journey',
      mapFoot: 'From first view to the next order',
      steps: ['DISCOVER','UNDERSTAND','CHOOSE','RETURN'],
      services: ['Social strategy + content','Creative production + motion','Meta + Google advertising','Landing pages + conversion','Influencer, retention + analytics']
    },
    creator: {
      title: 'Turn a point<br>of view into<br>a platform.',
      description: 'Build a recognizable content engine, carry it across the right channels and make room for partnerships and monetization.',
      mapTitle: 'A creator journey',
      mapFoot: 'From first idea to a stronger platform',
      steps: ['POSITION','CREATE','DISTRIBUTE','MONETIZE'],
      services: ['Audience + content strategy','Scripts, editing + motion','Thumbnails + packaging','Social repurposing + distribution','Brand deals + monetization']
    }
  };
  const select = (tab, focus) => {
    const item = data[tab.dataset.route];
    tabs.forEach((button) => {
      const active = button === tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    document.querySelector('#route-panel').setAttribute('aria-labelledby', tab.id);
    document.querySelector('#route-title').innerHTML = item.title;
    document.querySelector('#route-description').textContent = item.description;
    document.querySelector('#route-map-title').textContent = item.mapTitle;
    document.querySelector('#route-map-foot').textContent = item.mapFoot;
    document.querySelector('#route-map-steps').replaceChildren();
    item.steps.forEach((label, index) => {
      const li = document.createElement('li');
      const text = document.createElement('span');
      text.textContent = label;
      li.append(text);
      document.querySelector('#route-map-steps').append(li);
    });
    list.replaceChildren();
    item.services.forEach((service) => {
      const li = document.createElement('li');
      li.textContent = service;
      list.append(li);
    });
    if (!reduceMotion) {
      motionAnimate(document.querySelector('#route-panel'), { opacity: [0.72, 1], transform: ['translateY(10px)', 'translateY(0px)'] }, { duration: 0.34, ease: 'easeOut' });
    }
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        select(next, true);
      }
    });
  });
}

function setupMethodTabs() {
  const tabs = Array.from(document.querySelectorAll('[data-stage]'));
  const data = [
    ['Start with<br>the real picture.','Understand the business, product, audience, goals and competitors before choosing what to change.','A shared view of the opportunity.'],
    ['See what is<br>already happening.','Review social, the website, ads, content, competitors and available analytics.','A clear baseline and useful questions.'],
    ['Choose what<br>to move first.','Build a 30/60/90-day plan with priorities and measurable goals.','A focused direction for the work.'],
    ['Make the idea<br>easy to feel.','Create ideas, scripts, designs, videos, ads and publishing plans for the chosen strategy.','Creative ready for the right channels.'],
    ['Carry it to<br>the right people.','Publish content and manage the relevant advertising and influencer channels.','A connected distribution plan.'],
    ['Improve what<br>the response shows.','Review performance, identify what is working and adjust what is not.','A better next test.'],
    ['Turn results<br>into next moves.','Share results, learnings and practical actions for the next month.','A shared view of progress.']
  ];
  const panel = document.querySelector('#method-panel');
  const select = (tab, focus) => {
    const index = Number(tab.dataset.stage);
    tabs.forEach((button) => {
      const active = button === tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    document.querySelector('#method-current-title').innerHTML = data[index][0];
    document.querySelector('#method-current-copy').textContent = data[index][1];
    document.querySelector('#method-current-output').textContent = data[index][2];
    document.querySelector('#method-progress-fill').style.width = ((index + 1) / data.length * 100) + '%';
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const next = tabs[(index + (event.key === 'ArrowDown' ? 1 : tabs.length - 1)) % tabs.length];
        select(next, true);
      }
    });
  });
}

function setupCreativeTabs() {
  const tabs = Array.from(document.querySelectorAll('[data-creative]'));
  const data = [
    ['STOP<br>THE<br>SCROLL.','Earn the pause.','Lead with one clear visual idea. The first frame gives the audience a reason to stay long enough for the story.'],
    ['SHOW<br>THE<br>WHY.','Make the value clear.','Show the reason behind the claim with a useful detail, a demonstration or a human point of view.'],
    ['MAKE<br>NEXT<br>STEP.','Invite the next move.','Close with one relevant action that follows naturally from the story and the audience’s intent.']
  ];
  const select = (tab, focus) => {
    const index = Number(tab.dataset.creative);
    tabs.forEach((button) => {
      const active = button === tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    document.querySelector('#creative-detail').setAttribute('aria-labelledby', tab.id);
    document.querySelector('#creative-word').innerHTML = data[index][0];
    document.querySelector('#creative-detail-title').textContent = data[index][1];
    document.querySelector('#creative-detail-copy').textContent = data[index][2];
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        select(next, true);
      }
    });
  });
}

function setupBriefBuilder() {
  const form = document.querySelector('#brief-form');
  const status = document.querySelector('#brief-status');
  if (!form || !status) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const route = document.querySelector('#brief-route').value;
    const focus = document.querySelector('#brief-focus').value;
    const brief = 'Yugrow starting brief\n\nI’m growing ' + route + '.\nThe challenge I want to work on is ' + focus + '.\n\nI’d like to explore the right strategy, creative, distribution and next step.';
    try {
      await navigator.clipboard.writeText(brief);
      status.textContent = 'Copied. Your brief is on your clipboard and was not sent anywhere.';
    } catch (error) {
      status.textContent = 'Clipboard access is unavailable here. You can select your choices and share them manually.';
    }
  });
}

function setupSectionMotion() {
  const sections = Array.from(document.querySelectorAll('main section[data-scroll-motion]'));
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const chapterTransitions = new Set(['hero', 'gather', 'branch', 'orbit', 'sequence', 'reel']);
  const transitionTimers = new WeakMap();

  const playChapterTransition = (section) => {
    const layer = section.querySelector('.chapter-transition');
    if (!layer || !chapterTransitions.has(section.dataset.scrollMotion)) return;
    clearTimeout(transitionTimers.get(layer));
    layer.classList.remove('is-transitioning');
    void layer.offsetWidth;
    layer.classList.add('is-transitioning');
    transitionTimers.set(layer, setTimeout(() => layer.classList.remove('is-transitioning'), 1480));
  };

  const play = (section) => {
    const motion = section.dataset.scrollMotion;
    const run = (selector, keyframes, options = {}) => {
      section.querySelectorAll(selector).forEach((element, index) => {
        motionAnimate(element, keyframes, {
          duration: options.duration ?? 0.92,
          delay: (options.delay ?? 0) + index * (options.stagger ?? 0),
          ease: options.ease ?? 'easeOut',
        });
      });
    };

    switch (motion) {
      case 'hero':
        run('.hero-copy', { x: [-92, 0], y: [24, 0], rotate: [-3, 0], scale: [0.95, 1] }, { duration: 1.05 });
        run('.hero-art', { x: [118, 0], y: [30, 0], rotate: [4, 0.4], scale: [0.86, 1] }, { duration: 1.18, delay: 0.12 });
        break;
      case 'gather':
        run('.thesis-main h2', { y: [74, 0], rotate: [-3, 0], scale: [0.96, 1] }, { duration: 1.05 });
        run('.thesis-flow', { x: [84, 0], rotate: [7, -1.2], scale: [0.82, 1] }, { delay: 0.12, duration: 1.05 });
        run('.thesis-steps > div', { y: [62, 0], rotate: [8, 0], scale: [0.72, 1] }, { delay: 0.22, stagger: 0.09, duration: 0.84 });
        break;
      case 'branch':
        run('.routes-heading h2', { x: [-104, 0], y: [18, 0], rotate: [-5, 0], scale: [0.94, 1] }, { duration: 1.0 });
        run('.route-tabs .route-tab', { y: [34, 0], rotate: [-5, 0], scaleX: [0.82, 1] }, { delay: 0.08, stagger: 0.09 });
        run('.route-map', { x: [116, 0], rotateY: [30, 0], rotateZ: [3, 0], scale: [0.92, 1] }, { delay: 0.14, duration: 1.05 });
        run('.route-details', { x: [-88, 0], rotate: [-5, -0.6], scale: [0.95, 1] }, { delay: 0.2, duration: 0.96 });
        run('.service-list li', { x: [42, 0], y: [14, 0], scale: [0.96, 1] }, { delay: 0.36, stagger: 0.065, duration: 0.68 });
        break;
      case 'orbit':
        run('.network-copy', { x: [-98, 0], y: [26, 0], rotate: [-4, -0.8], scale: [0.94, 1] }, { duration: 1.0 });
        run('.network-figure img', { rotate: [-14, 0], scale: [0.72, 1], y: [35, 0] }, { delay: 0.12, duration: 1.18 });
        break;
      case 'sequence':
        run('.method-heading', { x: [86, 0], y: [34, 0], rotate: [3, 0], scale: [0.95, 1] }, { duration: 0.96 });
        section.querySelectorAll('.method-step').forEach((element, index) => {
          const finalY = (index % 2 ? 10 : 0) + (index % 3 === 2 ? -4 : 0);
          const finalRotate = index % 3 === 1 ? 1 : index % 3 === 2 ? -1.3 : -1;
          motionAnimate(element, { y: [64, finalY], rotate: [finalRotate - 13, finalRotate], scale: [0.68, 1] }, { delay: 0.14 + index * 0.075, duration: 0.82, ease: 'easeOut' });
        });
        run('.method-panel', { x: [92, 0], rotateY: [-16, 0], scale: [0.95, 1] }, { delay: 0.38, duration: 1.0 });
        break;
      case 'reel':
        run('.creative-heading h2', { x: [-82, 0], y: [44, 0], rotate: [-3, 0], scale: [0.96, 1] }, { duration: 0.94 });
        run('.creative-poster', { rotateY: [-68, 0], rotateZ: [5, -0.7], scale: [0.84, 1] }, { delay: 0.13, duration: 1.08 });
        run('.creative-controls', { x: [104, 0], rotate: [4, 0.7], scale: [0.96, 1] }, { delay: 0.24, duration: 0.94 });
        run('.creative-tab', { y: [28, 0], scale: [0.82, 1] }, { delay: 0.46, stagger: 0.08, duration: 0.68 });
        break;
    }
  };

  const played = new WeakSet();
  let hasScrolled = window.scrollY > 0;
  window.addEventListener('scroll', () => { hasScrolled = true; }, { once: true, passive: true });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        played.delete(entry.target);
        entry.target.classList.remove('is-inview');
        const layer = entry.target.querySelector('.chapter-transition');
        if (layer) {
          clearTimeout(transitionTimers.get(layer));
          layer.classList.remove('is-transitioning');
        }
      } else if (entry.isIntersecting && !played.has(entry.target)) {
        played.add(entry.target);
        entry.target.classList.add('is-inview');
        if (entry.target !== sections[0] || hasScrolled) playChapterTransition(entry.target);
        play(entry.target);
      }
    });
  }, { threshold: [0, 0.01] });
  sections.forEach((section) => observer.observe(section));
}
