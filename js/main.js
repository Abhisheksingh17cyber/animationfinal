/* ============================================================
   main.js  --  Animation Portfolio  (ES Module)
   ============================================================
   External globals expected:
     - gsap, ScrollTrigger   (GSAP 3.12.5 + plugin, loaded via CDN)
     - Lenis                 (Lenis 1.0.42, loaded via CDN)
     - THREE                 (Three.js 0.160.0, loaded via dynamic import)
   ============================================================ */

// THREE is loaded dynamically inside initBirdFlock() to prevent
// the entire module from crashing if the CDN is unreachable.

// ============================================================
// 1.  LENIS SMOOTH SCROLLING
// ============================================================

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Keep Lenis stopped while the loader is visible
lenis.stop();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis to GSAP ScrollTrigger so scrub-based animations stay in sync
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================================
// 2.  LOADER LOGIC
// ============================================================

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => {
        loader.style.display = 'none';
      }, { once: true });
    }
    // Start smooth scrolling now that content is visible
    lenis.start();
    // Fire hero entrance animations
    animateHeroEntry();
    // Fire text scramble on hero title
    initTextScramble();
  }, 4000);
});

// Safety: if something goes wrong with the loader, ensure Lenis starts anyway
setTimeout(() => {
  try { lenis.start(); } catch (e) {}
}, 6000);

// ============================================================
// 3.  HERO ENTRY ANIMATIONS  (GSAP)
// ============================================================

function animateHeroEntry() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-header', {
    y: -50,
    opacity: 0,
    duration: 1,
  })
    .from('.ellipses-container', {
      scale: 0.5,
      opacity: 0,
      duration: 1.5,
    }, '-=0.5')
    .from('.ellipses-greeting', {
      opacity: 0,
      letterSpacing: '6rem',
      duration: 1.2,
    }, '-=1')
    .from('.coords-text', {
      opacity: 0,
      x: -20,
      duration: 0.8,
    }, '-=0.8')
    .from('.hero-scroller', {
      opacity: 0,
      y: 20,
      duration: 0.8,
    }, '-=0.6');
}

// ============================================================
// 4.  DAY / NIGHT TOGGLE
// ============================================================

const torchToggle = document.getElementById('torch-toggle');
if (torchToggle) {
  torchToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-mode');
  });
}

// ============================================================
// 5.  SCROLL REVEAL ANIMATIONS  (ScrollTrigger)
// ============================================================

function initScrollRevealAnimations() {
  // Generic .reveal elements
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Section labels slide in from left
  gsap.utils.toArray('.section-label').forEach((el) => {
    gsap.from(el, {
      x: -30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });

  // Section titles rise up
  gsap.utils.toArray('.section-title').forEach((el) => {
    gsap.from(el, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });

  // Portfolio cards with stagger
  gsap.utils.toArray('.portfolio-card').forEach((card, i) => {
    gsap.from(card, {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
    });
  });

  // Stats counter animation
  gsap.utils.toArray('.stat-number').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    gsap.fromTo(
      el,
      { textContent: 0 },
      {
        textContent: target,
        duration: 2,
        ease: 'power1.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        onUpdate: function () {
          el.textContent = Math.ceil(this.targets()[0].textContent) + '+';
        },
      },
    );
  });
}

// ============================================================
// 6.  SVG PARALLAX SCROLL ANIMATION  (ScrollTrigger)
// ============================================================

function initSVGParallax() {
  gsap.registerPlugin(ScrollTrigger);

  const speed = 100;

  // ----------------------------------------------------------
  // Initial states
  // ----------------------------------------------------------
  gsap.set('#h2-1', { opacity: 0 });
  gsap.set('#bg_grad', { attr: { cy: '-50' } });

  // ----------------------------------------------------------
  // SCENE 1 -- Day hills parallax
  // ----------------------------------------------------------
  const scene1 = gsap.timeline();
  ScrollTrigger.create({
    animation: scene1,
    trigger: '#parallax-section',
    start: 'top top',
    end: '45% 100%',
    scrub: 3,
  });

  // Furthest hills move slowest, nearest move fastest
  scene1.to('#h1-1', { y: -1 * speed, x: 1 * speed, scale: 1.1, ease: 'power1.in' }, 0);
  scene1.to('#h1-2', { y: -1.5 * speed, x: -1.5 * speed, ease: 'power1.in' }, 0);
  scene1.to('#h1-3', { y: -3 * speed, x: 2 * speed, scale: 1.2, ease: 'power1.in' }, 0);
  scene1.to('#h1-4', { y: -4 * speed, x: -2.5 * speed, ease: 'power1.in' }, 0);
  scene1.to('#h1-5', { y: -5.5 * speed, x: 1.5 * speed, ease: 'power1.in' }, 0);
  scene1.to('#h1-6', { y: -6.5 * speed, x: 1 * speed, scale: 1.2, ease: 'power2.in' }, 0);
  scene1.to('#h1-7', { y: -7 * speed, x: -2 * speed, ease: 'power2.in' }, 0);
  scene1.to('#h1-8', { y: -8 * speed, x: 1.5 * speed, ease: 'power2.in' }, 0);
  scene1.to('#h1-9', { y: -9 * speed, x: 2.5 * speed, ease: 'power2.in' }, 0);

  // Clouds drift
  scene1.to('#cloudsBig', { x: -200, ease: 'power1.in' }, 0);
  scene1.to('#cloudsStart', { x: 200, ease: 'power1.in' }, 0);

  // Info text fades out
  scene1.to('#info', { y: -3 * speed, opacity: 0, ease: 'power1.in' }, 0);

  // ----------------------------------------------------------
  // SUN animation
  // ----------------------------------------------------------
  const sunTl = gsap.timeline();
  ScrollTrigger.create({
    animation: sunTl,
    trigger: '#parallax-section',
    start: 'top top',
    end: '30% 100%',
    scrub: 3,
  });

  sunTl.to('#sun', { y: 3.5 * speed, x: -0.5 * speed, ease: 'power1.in' }, 0);
  sunTl.to('#bg_grad', { attr: { cy: '500' }, ease: 'power1.in' }, 0);

  // Sky colour shift (sunset gradient)
  const sunColour = gsap.timeline();
  ScrollTrigger.create({
    animation: sunColour,
    trigger: '#parallax-section',
    start: '10% top',
    end: '40% 100%',
    scrub: 3,
  });

  sunColour.to('#sun-grad-stop1', { attr: { 'stop-color': '#FF6B35' }, ease: 'power1.in' }, 0);
  sunColour.to('#sun-grad-stop2', { attr: { 'stop-color': '#FF3864' }, ease: 'power1.in' }, 0);
  sunColour.to('#bg-grad-stop1', { attr: { 'stop-color': '#2D1B69' }, ease: 'power1.in' }, 0);
  sunColour.to('#bg-grad-stop2', { attr: { 'stop-color': '#0B0B2B' }, ease: 'power1.in' }, 0);

  // ----------------------------------------------------------
  // SCENE 2 -- Night hills
  // ----------------------------------------------------------
  const scene2 = gsap.timeline();
  ScrollTrigger.create({
    animation: scene2,
    trigger: '#parallax-section',
    start: '15% top',
    end: '65% 100%',
    scrub: 3,
  });

  // Fade in scene 2 hills
  scene2.to('#h2-1', { opacity: 1, y: -3 * speed, ease: 'power1.in' }, 0);
  scene2.to('#h2-2', { y: -5 * speed, x: -1.5 * speed, ease: 'power1.in' }, 0);
  scene2.to('#h2-3', { y: -6 * speed, x: 1.5 * speed, ease: 'power1.in' }, 0);
  scene2.to('#h2-4', { y: -7 * speed, x: -0.5 * speed, ease: 'power2.in' }, 0);
  scene2.to('#h2-5', { y: -8.5 * speed, x: 1 * speed, ease: 'power2.in' }, 0);
  scene2.to('#h2-6', { y: -9.5 * speed, x: -1 * speed, ease: 'power2.in' }, 0);

  // ----------------------------------------------------------
  // BATS
  // ----------------------------------------------------------
  const batsTl = gsap.timeline();
  ScrollTrigger.create({
    animation: batsTl,
    trigger: '#parallax-section',
    start: '30% top',
    end: '70% 100%',
    scrub: 3,
  });

  batsTl.fromTo('#bat-1', { opacity: 0, y: 50 }, { opacity: 1, y: -4 * speed, x: -2 * speed, ease: 'power1.in' }, 0);
  batsTl.fromTo('#bat-2', { opacity: 0, y: 40 }, { opacity: 1, y: -3.5 * speed, x: 2.5 * speed, ease: 'power1.in' }, 0.05);
  batsTl.fromTo('#bat-3', { opacity: 0, y: 60 }, { opacity: 1, y: -5 * speed, x: -1 * speed, ease: 'power1.in' }, 0.1);

  // Bat wing flap using scaleX
  gsap.to('.bat-wing-left', {
    scaleX: -1,
    transformOrigin: 'right center',
    duration: 0.3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
  gsap.to('.bat-wing-right', {
    scaleX: -1,
    transformOrigin: 'left center',
    duration: 0.3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // ----------------------------------------------------------
  // SCENE 3 -- Ground / transition scene
  // ----------------------------------------------------------
  gsap.set('#scene3', { y: 500, visibility: 'visible' });

  const scene3Tl = gsap.timeline();
  ScrollTrigger.create({
    animation: scene3Tl,
    trigger: '#parallax-section',
    start: '50% top',
    end: '100% 100%',
    scrub: 3,
  });

  scene3Tl.to('#scene3', { y: 0, ease: 'power1.in' }, 0);
  scene3Tl.to('#bg-grad-stop1', { attr: { 'stop-color': '#070720' }, ease: 'power1.in' }, 0);
  scene3Tl.to('#bg-grad-stop2', { attr: { 'stop-color': '#03030A' }, ease: 'power1.in' }, 0);

  // Falling star
  const fallingStar = gsap.timeline({ repeat: -1, repeatDelay: 4 });
  fallingStar.fromTo('#falling-star',
    { x: -100, y: -50, opacity: 0 },
    { x: 300, y: 200, opacity: 1, duration: 1.2, ease: 'power1.in' },
  );
  fallingStar.to('#falling-star', { opacity: 0, duration: 0.3 });

  // ----------------------------------------------------------
  // CLOUDS
  // ----------------------------------------------------------
  const cloudsTl = gsap.timeline({ repeat: -1, yoyo: true });
  cloudsTl.to('#cloud1', { x: 80, duration: 25, ease: 'sine.inOut' }, 0);
  cloudsTl.to('#cloud2', { x: -60, duration: 30, ease: 'sine.inOut' }, 0);
  cloudsTl.to('#cloud3', { x: 100, duration: 20, ease: 'sine.inOut' }, 0);
  cloudsTl.to('#cloud4', { x: -80, duration: 35, ease: 'sine.inOut' }, 0);

  // ----------------------------------------------------------
  // BIRD (SVG bird, not Three.js)
  // ----------------------------------------------------------
  const birdFlight = gsap.timeline({ repeat: -1, yoyo: true });
  birdFlight.to('#svgBird', {
    x: 350,
    y: -80,
    duration: 12,
    ease: 'sine.inOut',
  });

  // Wing flap for SVG bird
  gsap.to('#svgBird-wing', {
    rotation: 15,
    transformOrigin: 'center center',
    duration: 0.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // ----------------------------------------------------------
  // STARS twinkling
  // ----------------------------------------------------------
  gsap.utils.toArray('.star').forEach((star, i) => {
    gsap.to(star, {
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 2 + 1,
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 3,
      ease: 'sine.inOut',
    });
  });

  // Additional named stars
  const starIds = ['#star1', '#star2', '#star3', '#star4', '#star5', '#star6', '#star7', '#star8'];
  starIds.forEach((id, i) => {
    const el = document.querySelector(id);
    if (el) {
      gsap.to(id, {
        opacity: 0.2,
        duration: 1 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        delay: i * 0.5,
        ease: 'sine.inOut',
      });
    }
  });

  // Moon glow pulse
  gsap.to('#moon-glow', {
    opacity: 0.4,
    scale: 1.1,
    transformOrigin: 'center center',
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

// ============================================================
// 7.  THREE.JS BIRD FLOCK CURSOR EFFECT
// ============================================================

async function initBirdFlock() {
  let THREE;
  try {
    THREE = await import('three');
  } catch (e) {
    console.warn('[main.js] Three.js failed to load, bird flock disabled:', e);
    return;
  }

  // ----- Configuration -----
  const BIRD_COUNT = 150;
  const VISUAL_RANGE = 250;
  const SEPARATION_DIST = 180;
  const SPEED_LIMIT = 6.5;
  const MIN_SPEED = 3.5;

  const COHESION_FACTOR = 0.003;
  const ALIGNMENT_FACTOR = 0.04;
  const SEPARATION_FACTOR = 0.06;
  const MOUSE_ATTRACT_FACTOR = 0.008;
  const BOUNDS = { x: 1200, y: 800, z: 600 };

  // ----- Scene -----
  const scene = new THREE.Scene();
  scene.background = null; // transparent

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    6000,
  );
  camera.position.set(0, 0, 1400);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '5';
  renderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(renderer.domElement);

  // ----- Hit plane for raycasting -----
  const hitPlaneGeo = new THREE.PlaneGeometry(5000, 5000);
  const hitPlaneMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitPlane = new THREE.Mesh(hitPlaneGeo, hitPlaneMat);
  scene.add(hitPlane);

  const raycaster = new THREE.Raycaster();
  const mouseNDC = new THREE.Vector2(9999, 9999); // off-screen initially
  const mouseWorld = new THREE.Vector3(0, 0, 0);
  let mouseActive = false;
  let mouseIdleTimer = null;

  document.addEventListener('mousemove', (e) => {
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseActive = true;
    clearTimeout(mouseIdleTimer);
    mouseIdleTimer = setTimeout(() => {
      mouseActive = false;
    }, 3000);
  });

  document.addEventListener('mouseleave', () => {
    mouseActive = false;
  });

  // ----- Bird geometry (single triangle per bird) -----
  const birdGeo = new THREE.BufferGeometry();

  // 3 vertices per bird, body triangle
  const vertices = new Float32Array(BIRD_COUNT * 3 * 3);
  const wingPhases = new Float32Array(BIRD_COUNT * 3); // per-vertex phase for wing flap
  const birdIndices = new Float32Array(BIRD_COUNT * 3); // which bird index

  const wingSpan = 14;
  const bodyLen = 18;

  for (let i = 0; i < BIRD_COUNT; i++) {
    const base = i * 9; // 3 verts * 3 components
    // Tip
    vertices[base + 0] = 0;
    vertices[base + 1] = 0;
    vertices[base + 2] = -bodyLen / 2;
    // Left wing
    vertices[base + 3] = -wingSpan;
    vertices[base + 4] = 0;
    vertices[base + 5] = bodyLen / 2;
    // Right wing
    vertices[base + 6] = wingSpan;
    vertices[base + 7] = 0;
    vertices[base + 8] = bodyLen / 2;

    // Phase offsets for wing flapping
    const phase = Math.random() * Math.PI * 2;
    wingPhases[i * 3 + 0] = 0; // tip doesn't flap
    wingPhases[i * 3 + 1] = phase; // left wing
    wingPhases[i * 3 + 2] = phase; // right wing (same phase, mirrored)

    // Bird index per vertex
    birdIndices[i * 3 + 0] = i;
    birdIndices[i * 3 + 1] = i;
    birdIndices[i * 3 + 2] = i;
  }

  birdGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  birdGeo.setAttribute('wingPhase', new THREE.BufferAttribute(wingPhases, 1));
  birdGeo.setAttribute('birdIndex', new THREE.BufferAttribute(birdIndices, 1));

  // ----- Instance data -----
  // We store offsets and velocities in plain arrays for the boid sim,
  // then we build a custom shader material that reads per-bird transforms.
  const positions = [];
  const velocities = [];

  for (let i = 0; i < BIRD_COUNT; i++) {
    positions.push(new THREE.Vector3(
      (Math.random() - 0.5) * BOUNDS.x * 2,
      (Math.random() - 0.5) * BOUNDS.y * 2,
      (Math.random() - 0.5) * BOUNDS.z * 2,
    ));
    const angle = Math.random() * Math.PI * 2;
    const spd = MIN_SPEED + Math.random() * (SPEED_LIMIT - MIN_SPEED);
    velocities.push(new THREE.Vector3(
      Math.cos(angle) * spd,
      (Math.random() - 0.5) * spd * 0.5,
      Math.sin(angle) * spd,
    ));
  }

  // Flat array textures for GPU (offset + velocity)
  const offsetArray = new Float32Array(BIRD_COUNT * 3);
  const velocityArray = new Float32Array(BIRD_COUNT * 3);

  function updateDataArrays() {
    for (let i = 0; i < BIRD_COUNT; i++) {
      offsetArray[i * 3 + 0] = positions[i].x;
      offsetArray[i * 3 + 1] = positions[i].y;
      offsetArray[i * 3 + 2] = positions[i].z;
      velocityArray[i * 3 + 0] = velocities[i].x;
      velocityArray[i * 3 + 1] = velocities[i].y;
      velocityArray[i * 3 + 2] = velocities[i].z;
    }
  }
  updateDataArrays();

  const offsetAttr = new THREE.BufferAttribute(offsetArray, 3);
  offsetAttr.setUsage(THREE.DynamicDrawUsage);
  birdGeo.setAttribute('offset', offsetAttr);

  const velAttr = new THREE.BufferAttribute(velocityArray, 3);
  velAttr.setUsage(THREE.DynamicDrawUsage);
  birdGeo.setAttribute('velocity', velAttr);

  // ----- Material with wing flap shader -----
  const birdMat = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });

  birdMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    birdMat.__shader = shader;

    // Vertex shader injection
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      attribute float wingPhase;
      attribute float birdIndex;
      attribute vec3 offset;
      attribute vec3 velocity;
      uniform float uTime;
      `,
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      vec3 transformed = position;

      // Wing flap: displace y of wing vertices based on sine wave
      if (wingPhase > 0.0) {
        float flap = sin(uTime * 8.0 + wingPhase) * 10.0;
        // Left wing goes up, right wing goes up (same phase but mirrored via position.x sign)
        transformed.y += flap * sign(transformed.x);
      }

      // Orient bird along velocity direction
      vec3 vel = normalize(velocity);
      vec3 forward = vec3(0.0, 0.0, -1.0);
      // Simple rotation: rotate around Y to face velocity xz direction
      float angleY = atan(vel.x, vel.z);
      float cosA = cos(angleY);
      float sinA = sin(angleY);
      mat3 rotY = mat3(
        cosA, 0.0, sinA,
        0.0, 1.0, 0.0,
        -sinA, 0.0, cosA
      );
      // Pitch based on vertical velocity
      float pitch = asin(clamp(vel.y, -1.0, 1.0));
      float cosP = cos(pitch);
      float sinP = sin(pitch);
      mat3 rotX = mat3(
        1.0, 0.0, 0.0,
        0.0, cosP, -sinP,
        0.0, sinP, cosP
      );
      transformed = rotY * rotX * transformed;

      // Translate to world position
      transformed += offset;
      `,
    );
  };

  const birdMesh = new THREE.Mesh(birdGeo, birdMat);
  birdMesh.frustumCulled = false;
  scene.add(birdMesh);

  // ----- Boid physics -----
  const _v = new THREE.Vector3();
  const _center = new THREE.Vector3();
  const _avgVel = new THREE.Vector3();
  const _separation = new THREE.Vector3();
  const _mouseTarget = new THREE.Vector3();
  const _wanderTarget = new THREE.Vector3(
    (Math.random() - 0.5) * BOUNDS.x,
    (Math.random() - 0.5) * BOUNDS.y * 0.5,
    (Math.random() - 0.5) * BOUNDS.z,
  );
  let wanderTimer = 0;

  function updateBoids() {
    // Periodically shift the wander target
    wanderTimer++;
    if (wanderTimer > 300) {
      wanderTimer = 0;
      _wanderTarget.set(
        (Math.random() - 0.5) * BOUNDS.x,
        (Math.random() - 0.5) * BOUNDS.y * 0.5,
        (Math.random() - 0.5) * BOUNDS.z,
      );
    }

    for (let i = 0; i < BIRD_COUNT; i++) {
      const pos = positions[i];
      const vel = velocities[i];

      _center.set(0, 0, 0);
      _avgVel.set(0, 0, 0);
      _separation.set(0, 0, 0);
      let neighbours = 0;

      for (let j = 0; j < BIRD_COUNT; j++) {
        if (i === j) continue;
        const dist = pos.distanceTo(positions[j]);
        if (dist < VISUAL_RANGE) {
          // Cohesion
          _center.add(positions[j]);
          // Alignment
          _avgVel.add(velocities[j]);
          neighbours++;

          // Separation
          if (dist < SEPARATION_DIST) {
            _v.subVectors(pos, positions[j]);
            _v.divideScalar(Math.max(dist, 0.001));
            _separation.add(_v);
          }
        }
      }

      if (neighbours > 0) {
        _center.divideScalar(neighbours);
        _v.subVectors(_center, pos).multiplyScalar(COHESION_FACTOR);
        vel.add(_v);

        _avgVel.divideScalar(neighbours);
        _v.subVectors(_avgVel, vel).multiplyScalar(ALIGNMENT_FACTOR);
        vel.add(_v);
      }

      // Separation
      vel.add(_separation.multiplyScalar(SEPARATION_FACTOR));

      // Mouse attraction or idle wandering
      if (mouseActive) {
        _v.subVectors(mouseWorld, pos).multiplyScalar(MOUSE_ATTRACT_FACTOR);
        vel.add(_v);
      } else {
        _v.subVectors(_wanderTarget, pos).multiplyScalar(MOUSE_ATTRACT_FACTOR * 0.3);
        vel.add(_v);
      }

      // Soft boundary steering
      const margin = 0.9;
      if (pos.x > BOUNDS.x * margin) vel.x -= 0.5;
      if (pos.x < -BOUNDS.x * margin) vel.x += 0.5;
      if (pos.y > BOUNDS.y * margin) vel.y -= 0.5;
      if (pos.y < -BOUNDS.y * margin) vel.y += 0.5;
      if (pos.z > BOUNDS.z * margin) vel.z -= 0.5;
      if (pos.z < -BOUNDS.z * margin) vel.z += 0.5;

      // Speed clamping
      const spd = vel.length();
      if (spd > SPEED_LIMIT) vel.multiplyScalar(SPEED_LIMIT / spd);
      if (spd < MIN_SPEED) vel.multiplyScalar(MIN_SPEED / spd);

      // Integrate position
      pos.add(vel);
    }
  }

  // ----- Resize -----
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // ----- Animation loop -----
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Raycast mouse
    raycaster.setFromCamera(mouseNDC, camera);
    const hits = raycaster.intersectObject(hitPlane);
    if (hits.length > 0) {
      mouseWorld.copy(hits[0].point);
    }

    // Update boid physics
    updateBoids();

    // Push data to GPU
    updateDataArrays();
    birdGeo.attributes.offset.needsUpdate = true;
    birdGeo.attributes.velocity.needsUpdate = true;

    // Update time uniform for wing flap
    if (birdMat.__shader) {
      birdMat.__shader.uniforms.uTime.value = elapsed;
    }

    renderer.render(scene, camera);
  }

  animate();
}

// ============================================================
// 8.  CUSTOM CURSOR
// ============================================================

function initCustomCursor() {
  // Only on devices with a fine pointer (desktop)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX - 4,
      y: e.clientY - 4,
      duration: 0.1,
    });
  });

  // Scale up cursor on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .premium-btn, .social-icon, .portfolio-card',
  );

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 3, opacity: 0.5, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
    });
  });
}

// ============================================================
// 9.  MAGNETIC BUTTONS
// ============================================================

function initMagneticButtons() {
  document.querySelectorAll('.premium-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

// ============================================================
// 10.  TEXT SCRAMBLE EFFECT ON HERO TITLE
// ============================================================

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="text-accent">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

function initTextScramble() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  const phrases = [
    'Creative Developer',
    'Motion Designer',
    'Digital Artist',
    'UI Engineer',
  ];

  const scramble = new TextScramble(heroTitle);
  let counter = 0;

  const next = () => {
    scramble.setText(phrases[counter]).then(() => {
      setTimeout(next, 3000);
    });
    counter = (counter + 1) % phrases.length;
  };

  // Start the cycle
  next();
}

// ============================================================
// 11.  PARALLAX ON MOUSE FOR HERO ELEMENTS
// ============================================================

function initHeroMouseParallax() {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;

    gsap.to('.ellipses-container', {
      x: x * 20,
      y: y * 20,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.to('.coords-text', {
      x: x * -10,
      y: y * -10,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.to('.hero-header', {
      x: x * 8,
      y: y * 8,
      duration: 1.4,
      ease: 'power2.out',
    });
  });
}

// ============================================================
// 12.  ADDITIONAL UTILITIES
// ============================================================

// Debounced resize handler for ScrollTrigger recalculation
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

// Handle visibility changes -- pause expensive animations when tab hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    lenis.stop();
  } else {
    lenis.start();
  }
});

// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  });
});

// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  try {
    gsap.registerPlugin(ScrollTrigger);
    initScrollRevealAnimations();
    initSVGParallax();
    initCustomCursor();
    initMagneticButtons();
    initHeroMouseParallax();
    initBirdFlock();
  } catch (err) {
    console.error('[main.js] Initialisation error:', err);
  }
});
