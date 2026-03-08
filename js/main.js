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
// 1.  LENIS SMOOTH SCROLLING  (wrapped in try-catch for CDN resilience)
// ============================================================

let lenis = null;

try {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
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
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  } else {
    console.warn('[main.js] Lenis not available – smooth scrolling disabled.');
  }
} catch (e) {
  console.error('[main.js] Failed to initialize Lenis:', e);
  lenis = null;
}

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
    if (lenis) lenis.start();
    // Fire hero entrance animations
    if (typeof gsap !== 'undefined') animateHeroEntry();
    // Fire text scramble on hero title
    initTextScramble();
  }, 4000);
});

// Safety: if something goes wrong with the loader, ensure Lenis starts anyway
setTimeout(() => {
  try { if (lenis) lenis.start(); } catch (e) {}
}, 6000);

// ============================================================
// 3.  HERO ENTRY ANIMATIONS  (GSAP)
// ============================================================

function animateHeroEntry() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.site-header', {
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
    const html = document.documentElement;
    if (torchToggle.checked) {
      html.setAttribute('data-theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
    }
  });
}

// ============================================================
// 5.  SCROLL REVEAL ANIMATIONS  (ScrollTrigger)
// ============================================================

function initScrollRevealAnimations() {
  // Generic .reveal elements
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Section labels slide in from left
  gsap.utils.toArray('.section-label').forEach((el) => {
    gsap.fromTo(el,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
      }
    );
  });

  // Section titles rise up
  gsap.utils.toArray('.section-title').forEach((el) => {
    gsap.fromTo(el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
      }
    );
  });

  // Portfolio cards with stagger
  gsap.utils.toArray('.portfolio-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
        },
      }
    );
  });

  // Service cards with stagger
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
        },
      }
    );
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

  const speed = 60;

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
    end: '40% 100%',
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

  sunColour.to('#sun-grad-stop1', { attr: { 'stop-color': '#D4A574' }, ease: 'power1.in' }, 0);
  sunColour.to('#sun-grad-stop2', { attr: { 'stop-color': '#C48B5C' }, ease: 'power1.in' }, 0);
  sunColour.to('#bg-grad-stop1', { attr: { 'stop-color': '#2B1055' }, ease: 'power1.in' }, 0);
  sunColour.to('#bg-grad-stop2', { attr: { 'stop-color': '#1a082e' }, ease: 'power1.in' }, 0);

  // ----------------------------------------------------------
  // SCENE 2 -- Night hills
  // ----------------------------------------------------------
  const scene2 = gsap.timeline();
  ScrollTrigger.create({
    animation: scene2,
    trigger: '#parallax-section',
    start: '15% top',
    end: '45% 100%',
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
  gsap.set('#scene3', { y: 350, visibility: 'visible' });

  const scene3Tl = gsap.timeline();
  ScrollTrigger.create({
    animation: scene3Tl,
    trigger: '#parallax-section',
    start: '65% top',
    end: '100% 100%',
    scrub: 3,
  });

  scene3Tl.to('#scene3', { y: 0, ease: 'power1.in' }, 0);
  scene3Tl.to('#bg-grad-stop1', { attr: { 'stop-color': '#0a0015' }, ease: 'power1.in' }, 0);
  scene3Tl.to('#bg-grad-stop2', { attr: { 'stop-color': '#1a082e' }, ease: 'power1.in' }, 0);

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
// 7.  THREE.JS BIRD FLOCK CURSOR EFFECT  (InstancedMesh)
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
  const BIRD_COUNT = 200;
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

  // Lighting (required for MeshStandardMaterial)
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(1, 1, 1);
  scene.add(dirLight);

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
  const mouseNDC = new THREE.Vector2(9999, 9999);
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

  // ----- Bird geometry (single triangle template) -----
  const wingSpan = 14;
  const bodyLen = 18;

  const birdGeo = new THREE.BufferGeometry();
  const verts = new Float32Array([
    0, 0, -bodyLen / 2,      // tip
    -wingSpan, 0, bodyLen / 2, // left wing
    wingSpan, 0, bodyLen / 2,  // right wing
  ]);
  birdGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));

  // ----- Material -----
  const birdMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    emissive: 0xffdba6,
    emissiveIntensity: 0.15,
    roughness: 0.5,
    metalness: 0.3,
  });

  // ----- InstancedMesh -----
  const birdMesh = new THREE.InstancedMesh(birdGeo, birdMat, BIRD_COUNT);
  birdMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  birdMesh.frustumCulled = false;
  scene.add(birdMesh);

  // ----- Instance data -----
  const positions = [];
  const velocities = [];
  const wingPhases = [];
  const dummy = new THREE.Object3D();

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
    wingPhases.push(Math.random() * Math.PI * 2);
  }

  // ----- Boid physics -----
  const _v = new THREE.Vector3();
  const _center = new THREE.Vector3();
  const _avgVel = new THREE.Vector3();
  const _separation = new THREE.Vector3();
  const _wanderTarget = new THREE.Vector3(
    (Math.random() - 0.5) * BOUNDS.x,
    (Math.random() - 0.5) * BOUNDS.y * 0.5,
    (Math.random() - 0.5) * BOUNDS.z,
  );
  let wanderTimer = 0;

  function updateBoids() {
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
          _center.add(positions[j]);
          _avgVel.add(velocities[j]);
          neighbours++;
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

      vel.add(_separation.multiplyScalar(SEPARATION_FACTOR));

      if (mouseActive) {
        _v.subVectors(mouseWorld, pos).multiplyScalar(MOUSE_ATTRACT_FACTOR);
        vel.add(_v);
      } else {
        _v.subVectors(_wanderTarget, pos).multiplyScalar(MOUSE_ATTRACT_FACTOR * 0.3);
        vel.add(_v);
      }

      const margin = 0.9;
      if (pos.x > BOUNDS.x * margin) vel.x -= 0.5;
      if (pos.x < -BOUNDS.x * margin) vel.x += 0.5;
      if (pos.y > BOUNDS.y * margin) vel.y -= 0.5;
      if (pos.y < -BOUNDS.y * margin) vel.y += 0.5;
      if (pos.z > BOUNDS.z * margin) vel.z -= 0.5;
      if (pos.z < -BOUNDS.z * margin) vel.z += 0.5;

      const spd = vel.length();
      if (spd > SPEED_LIMIT) vel.multiplyScalar(SPEED_LIMIT / spd);
      if (spd < MIN_SPEED) vel.multiplyScalar(MIN_SPEED / spd);

      pos.add(vel);
    }
  }

  // ----- Update instance matrices -----
  function updateInstanceMatrices(elapsed) {
    for (let i = 0; i < BIRD_COUNT; i++) {
      dummy.position.copy(positions[i]);

      // Orient along velocity
      const vel = velocities[i];
      const angleY = Math.atan2(vel.x, vel.z);
      const pitch = Math.asin(Math.max(-1, Math.min(1, vel.y / Math.max(vel.length(), 0.001))));
      dummy.rotation.set(pitch, angleY, 0);

      // Wing flap via subtle scale oscillation on Y
      const flap = Math.sin(elapsed * 8.0 + wingPhases[i]) * 0.3 + 1.0;
      dummy.scale.set(1, flap, 1);

      dummy.updateMatrix();
      birdMesh.setMatrixAt(i, dummy.matrix);
    }
    birdMesh.instanceMatrix.needsUpdate = true;
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

    // Update instance transforms
    updateInstanceMatrices(elapsed);

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

  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';
  document.body.appendChild(follower);

  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;
  let isHovering = false;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    // Cursor dot follows immediately
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  });

  // Smooth follower animation loop
  function updateFollower() {
    followerX += (cursorX - followerX) * 0.12;
    followerY += (cursorY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(updateFollower);
  }
  requestAnimationFrame(updateFollower);

  // Scale up cursor on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .premium-btn, .social-icon, .portfolio-card, .service-card, .tech-item, .torch-container, .site-header a, .nav-links a',
  );

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      isHovering = true;
      cursor.classList.add('cursor-hover');
      follower.classList.add('follower-hover');
    });
    el.addEventListener('mouseleave', () => {
      isHovering = false;
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('follower-hover');
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
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (!heroSubtitle) return;

  const phrases = [
    'Creative Developer',
    'Motion Designer',
    'Digital Artist',
    'UI Engineer',
  ];

  const scramble = new TextScramble(heroSubtitle);
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

    gsap.to('.site-header', {
      x: x * 5,
      y: y * 5,
      duration: 1.4,
      ease: 'power2.out',
    });
  });
}

// ============================================================
// 12b. AI VISION PITCH (Gemini API)
// ============================================================

function initAIVisionPitch() {
  const btn = document.getElementById('ai-vision-btn');
  const input = document.getElementById('ai-vision-input');
  const response = document.getElementById('ai-vision-response');
  if (!btn || !input || !response) return;

  btn.addEventListener('click', async () => {
    const idea = input.value.trim();
    if (!idea) {
      input.focus();
      return;
    }

    response.textContent = '';
    response.style.display = 'block';
    btn.disabled = true;
    btn.style.opacity = '0.5';

    try {
      const API_KEY = 'AIzaSyB_JM4VqAN5G9CL_ey_VBxKCjWCBPn6uJE';
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a creative director at a premium animation studio called INTERNITY STUDIO. Generate a compelling elevator pitch for this project idea: ${idea}. Keep it under 100 words, professional, and inspiring. Focus on the visual storytelling and animation possibilities.`
              }]
            }]
          })
        }
      );
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response. Please try again.';
      typewriterEffect(response, text);
    } catch (err) {
      response.textContent = 'Error generating vision. Please check your connection and try again.';
    } finally {
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  });
}

function typewriterEffect(element, text, speed = 25) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// ============================================================
// 13.  ADDITIONAL UTILITIES
// ============================================================

// Debounced resize handler for ScrollTrigger recalculation
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }, 250);
});

// Handle visibility changes -- pause expensive animations when tab hidden
document.addEventListener('visibilitychange', () => {
  if (!lenis) return;
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
      if (lenis) {
        lenis.scrollTo(target, {
          offset: 0,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      initScrollRevealAnimations();
      initSVGParallax();
      initMagneticButtons();
      initHeroMouseParallax();
    }
    initCustomCursor();
    initAIVisionPitch();
  } catch (err) {
    console.error('[main.js] Initialisation error:', err);
  }
  // Bird flock has its own error handling via dynamic import try-catch
  initBirdFlock();
});
