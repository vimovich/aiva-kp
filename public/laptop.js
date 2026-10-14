/* AIVA · interactive 3D laptop (Three.js r149).  Click → laptop "types" code, keys press, sparks fly. */
(function () {
  'use strict';
  var stage = document.getElementById('lt');
  if (!stage || typeof THREE === 'undefined') { if (stage) stage.classList.add('lt-nogl'); return; }
  var view = stage.querySelector('.lt-view');
  var canvas = stage.querySelector('canvas');
  var hint = stage.querySelector('.lt-hint');
  var hintTxt = hint && hint.querySelector('span');
  var chips = {};
  [].forEach.call(stage.querySelectorAll('[data-svc]'), function (c) { chips[c.getAttribute('data-svc')] = c; });
  var LANG = (stage.getAttribute('data-lang') || 'ru') === 'uz' ? 'uz' : 'ru';
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- i18n + code scripts ---------- */
  var I18N = {
    ru: { hint1: 'Нажмите на ноутбук', again: 'Запустить ещё раз',
      c: { launch: '// AIVA GROUP — запуск проекта', end: '// заявки пошли', seo: '// SEO: TOP-10 в Google и Яндекс', crm: '// CRM: от клика до сделки' },
      term: ['сайт онлайн', 'seo → TOP-10', 'заявки идут'] },
    uz: { hint1: 'Noutbukni bosing', again: 'Yana ishga tushirish',
      c: { launch: '// AIVA GROUP — loyihani ishga tushirish', end: '// arizalar kela boshladi', seo: '// SEO: Google va Yandexda TOP-10', crm: '// CRM: klikdan bitimgacha' },
      term: ['sayt onlayn', 'seo → TOP-10', 'arizalar kelmoqda'] }
  }[LANG];

  var SCRIPTS = [
    { file: 'launch.ts', lines: [
      { t: I18N.c.launch },
      { t: 'import { aiva } from "@aiva/growth";' },
      { t: '' },
      { t: 'const project = await aiva.launch({' },
      { t: '  site: "landing + corporate",', svc: 'web' },
      { t: '  seo:  { goal: "TOP-10" },', svc: 'seo' },
      { t: '  geo:  "ChatGPT · Gemini",', svc: 'geo' },
      { t: '  ads:  ["Google", "Yandex"],', svc: 'ads' },
      { t: '  smm:  "content + targeting",', svc: 'smm' },
      { t: '  crm:  "emyCRM",', svc: 'crm' },
      { t: '});' },
      { t: I18N.c.end } ] },
    { file: 'seo.ts', lines: [
      { t: I18N.c.seo },
      { t: 'const seo = new SEO("client.uz");' },
      { t: '' },
      { t: 'await seo.audit({ free: true });', svc: 'seo' },
      { t: 'await seo.semantics();' },
      { t: 'await seo.optimize(["title", "h1"]);', svc: 'web' },
      { t: 'await geo.optimize("AI search");', svc: 'geo' },
      { t: '' },
      { t: 'seo.report("weekly");' },
      { t: 'seo.report("monthly");' } ] },
    { file: 'crm.ts', lines: [
      { t: I18N.c.crm },
      { t: 'lead.on("new", async (c) => {', svc: 'ads' },
      { t: '  await crm.createDeal(c);', svc: 'crm' },
      { t: '  await bot.notify(manager);' },
      { t: '  await mail.followUp(c, "1h");' },
      { t: '  await smm.retarget(c);', svc: 'smm' },
      { t: '});' },
      { t: '' },
      { t: 'crm.pipeline.start();', svc: 'crm' } ] }
  ];

  /* ---------- renderer ---------- */
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { stage.classList.add('lt-nogl'); return; }
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

  /* environment (procedural studio so aluminium reads as metal) */
  (function () {
    var c = document.createElement('canvas'); c.width = 512; c.height = 256;
    var g = c.getContext('2d');
    var bg = g.createLinearGradient(0, 0, 0, 256);
    bg.addColorStop(0, '#2a3566'); bg.addColorStop(.45, '#0d1330'); bg.addColorStop(1, '#05070f');
    g.fillStyle = bg; g.fillRect(0, 0, 512, 256);
    function soft(x, y, w, h, col, a) { var gr = g.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, Math.max(w, h) / 2); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = a; g.fillStyle = gr; g.fillRect(x - 40, y - 40, w + 80, h + 80); g.globalAlpha = 1; }
    soft(150, 20, 220, 60, '#ffffff', .95);
    soft(30, 70, 90, 120, '#38bdf8', .8);
    soft(390, 70, 100, 120, '#a855f7', .85);
    soft(210, 150, 120, 50, '#6366f1', .5);
    var tex = new THREE.CanvasTexture(c); tex.mapping = THREE.EquirectangularReflectionMapping; tex.encoding = THREE.sRGBEncoding;
    var pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromEquirectangular(tex).texture;
    pm.dispose(); tex.dispose();
  })();

  scene.add(new THREE.HemisphereLight(0x9fb4ff, 0x0b1020, .55));
  var key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(3, 6, 5); scene.add(key);
  var rimL = new THREE.PointLight(0x38bdf8, 1.6, 14); rimL.position.set(-4.5, 2, 1.5); scene.add(rimL);
  var rimR = new THREE.PointLight(0xa855f7, 1.8, 14); rimR.position.set(4.5, 2.4, 1.5); scene.add(rimR);
  var screenLight = new THREE.PointLight(0x6aa8ff, 0.0, 6); screenLight.position.set(0, 1.0, 1.6); scene.add(screenLight);

  /* ---------- geometry helpers ---------- */
  function rrShape(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false); return s;
  }
  function rrBox(w, h, d, r, b) {
    var depth = d - 2 * b;
    var g = new THREE.ExtrudeGeometry(rrShape(w - 2 * b, h - 2 * b, Math.max(r - b, .001)), { depth: depth, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 8 });
    g.translate(0, 0, -depth / 2); return g;
  }

  /* ---------- laptop ---------- */
  var BW = 3.3, BD = 2.2, BH = 0.11, LW = 3.3, LH = 2.1, LT = 0.075;
  var laptop = new THREE.Group(); scene.add(laptop);
  var shell = new THREE.Group(); laptop.add(shell);

  var alu = new THREE.MeshStandardMaterial({ color: 0x4a5378, metalness: .92, roughness: .3, envMapIntensity: 1.25 });
  var aluDark = new THREE.MeshStandardMaterial({ color: 0x1b2036, metalness: .85, roughness: .45, envMapIntensity: 1 });

  var baseG = rrBox(BW, BD, BH, .13, .028); baseG.rotateX(-Math.PI / 2);
  var base = new THREE.Mesh(baseG, alu); base.position.y = BH / 2; shell.add(base);

  /* keyboard deck + RGB under-glow */
  var deck = new THREE.Mesh(new THREE.PlaneGeometry(3.06, 1.2), new THREE.MeshStandardMaterial({ color: 0x07090f, metalness: .3, roughness: .8 }));
  deck.rotation.x = -Math.PI / 2; deck.position.set(0, BH + 0.002, -0.43); shell.add(deck);
  var glowTex = (function () {
    var c = document.createElement('canvas'); c.width = 256; c.height = 64; var g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, '#38bdf8'); gr.addColorStop(.55, '#6366f1'); gr.addColorStop(1, '#a855f7');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 64); var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
  })();
  var glowMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: .55, toneMapped: false });
  var glow = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.14), glowMat);
  glow.rotation.x = -Math.PI / 2; glow.position.set(0, BH + 0.006, -0.43); shell.add(glow);

  /* keys */
  var KEY_U = 0.2125, KEY_H = 0.045, KEY_GAP = 0.024;
  var ROWS = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1.5,1,1,1,1,1,1,1,1,1,1,1,1.5],
    [1.75,1,1,1,1,1,1,1,1,1,1,2.25],
    [2.25,1,1,1,1,1,1,1,1,1,2.75],
    [1.25,1.25,1.25,5.25,1.25,1.25,1.25,1.25]
  ];
  var geoCache = {};
  function keyGeo(w) { var k = w.toFixed(2); return geoCache[k] || (geoCache[k] = rrBox(w * KEY_U - KEY_GAP, KEY_U - KEY_GAP, KEY_H, .03, .01)); }
  var keys = [], keyBy = {};
  var keyBaseMat = new THREE.MeshStandardMaterial({ color: 0x1a1e2e, metalness: .25, roughness: .55, emissive: 0x000000 });
  var startX = -(14 * KEY_U) / 2, z0 = -0.43 - 0.5 * (KEY_U * 5) + KEY_U / 2 + 0.0;
  ROWS.forEach(function (row, ri) {
    var x = startX;
    row.forEach(function (w, ci) {
      var m = keyBaseMat.clone();
      var mesh = new THREE.Mesh(keyGeo(w), m);
      mesh.rotation.x = -Math.PI / 2;               // extrude depth(z) → vertical
      var px = x + w * KEY_U / 2, pz = z0 + ri * KEY_U;
      mesh.position.set(px, BH + KEY_H / 2 + 0.006, pz);
      shell.add(mesh);
      var k = { mesh: mesh, mat: m, by: mesh.position.y, press: 0, r: ri, c: ci, x: px, z: pz, w: w };
      keys.push(k); (keyBy[ri] = keyBy[ri] || []).push(k);
      x += w * KEY_U;
    });
  });
  // letter → key mapping
  var LETTER_ROWS = { 1: 'qwertyuiop', 2: 'asdfghjkl', 3: 'zxcvbnm' };
  var letterKey = {};
  Object.keys(LETTER_ROWS).forEach(function (r) { LETTER_ROWS[r].split('').forEach(function (ch, i) { letterKey[ch] = keyBy[r][i + 1]; }); });
  var spaceKey = keyBy[4][3], enterKey = keyBy[2][keyBy[2].length - 1];
  function keyFor(ch) {
    var l = ch.toLowerCase();
    if (ch === ' ') return spaceKey; if (ch === '\n') return enterKey;
    if (letterKey[l]) return letterKey[l];
    var r = keyBy[Math.floor(Math.random() * 4)]; return r[Math.floor(Math.random() * r.length)];
  }

  /* trackpad */
  var tpG = rrBox(1.2, .62, .014, .07, .005); tpG.rotateX(-Math.PI / 2);
  var tp = new THREE.Mesh(tpG, new THREE.MeshStandardMaterial({ color: 0x3a4266, metalness: .9, roughness: .22, envMapIntensity: 1.3 }));
  tp.position.set(0, BH + 0.004, 0.7); shell.add(tp);

  /* lid (hinged at back edge) */
  var lid = new THREE.Group(); lid.position.set(0, BH, -BD / 2 + 0.06); shell.add(lid);
  var LID_OPEN = -0.2;                      // radians (≈ 101° opening)
  lid.rotation.x = LID_OPEN;
  var lidShell = new THREE.Mesh(rrBox(LW, LH, LT, .1, .026), alu); lidShell.position.y = LH / 2; lid.add(lidShell);
  var bezel = new THREE.Mesh(new THREE.PlaneGeometry(LW - .15, LH - .13), new THREE.MeshBasicMaterial({ color: 0x03040a, toneMapped: false }));
  bezel.position.set(0, LH / 2, LT / 2 + 0.003); lid.add(bezel);

  /* screen texture */
  var SW = 1024, SH = 640;
  var sc = document.createElement('canvas'); sc.width = SW; sc.height = SH; var g = sc.getContext('2d');
  var screenTex = new THREE.CanvasTexture(sc);
  screenTex.encoding = THREE.sRGBEncoding; screenTex.anisotropy = renderer.capabilities.getMaxAnisotropy(); screenTex.minFilter = THREE.LinearMipmapLinearFilter;
  var screenMat = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });
  var screen = new THREE.Mesh(new THREE.PlaneGeometry(LW - .3, (LW - .3) * SH / SW), screenMat);
  screen.position.set(0, LH / 2, LT / 2 + 0.005); lid.add(screen);
  var cam = new THREE.Mesh(new THREE.CircleGeometry(.018, 16), new THREE.MeshBasicMaterial({ color: 0x1b2340 }));
  cam.position.set(0, LH - 0.055, LT / 2 + 0.006); lid.add(cam);
  // hinge barrel
  var hinge = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 2.7, 16), aluDark); hinge.rotation.z = Math.PI / 2; hinge.position.set(0, 0.02, 0); lid.add(hinge);

  /* soft ground shadow + glow */
  var shTex = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d');
    var gr = x.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, 'rgba(0,0,0,.62)'); gr.addColorStop(.55, 'rgba(0,0,0,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
  })();
  var shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.1), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, -0.35, -0.1); scene.add(shadow);
  var haloTex = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d');
    var gr = x.createRadialGradient(128, 128, 4, 128, 128, 128); gr.addColorStop(0, 'rgba(120,150,255,.55)'); gr.addColorStop(.5, 'rgba(99,102,241,.16)'); gr.addColorStop(1, 'rgba(99,102,241,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
  })();
  var halo = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), new THREE.MeshBasicMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .55 }));
  halo.visible = false;


  /* ---------- sparks (GPU points) ---------- */
  var NP = 260;
  var pPos = new Float32Array(NP * 3), pCol = new Float32Array(NP * 3), pSize = new Float32Array(NP), pLife = new Float32Array(NP);
  var pVel = new Float32Array(NP * 3), pMax = new Float32Array(NP), pHead = 0;
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
  pGeo.setAttribute('aLife', new THREE.BufferAttribute(pLife, 1));
  var pMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uScale: { value: DPR * 330 } },
    vertexShader: 'attribute float aSize;attribute float aLife;varying vec3 vC;varying float vA;uniform float uScale;void main(){vC=color;vA=aLife;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*uScale/-mv.z*(.4+.6*aLife);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);a*=a;gl_FragColor=vec4(vC*(1.+a),a*vA);}',
    vertexColors: true
  });
  var points = new THREE.Points(pGeo, pMat); points.frustumCulled = false; scene.add(points);
  var PALETTE = [[.22, .74, .97], [.39, .4, .95], [.66, .33, .97], [1, 1, 1], [.5, .9, 1]];
  function emit(n, ox, oy, oz, spread, up, sizeBase) {
    for (var i = 0; i < n; i++) {
      var k = pHead; pHead = (pHead + 1) % NP;
      var a = Math.random() * Math.PI * 2, s = (0.4 + Math.random()) * spread;
      pPos[k * 3] = ox + (Math.random() - .5) * .3; pPos[k * 3 + 1] = oy; pPos[k * 3 + 2] = oz + (Math.random() - .5) * .2;
      pVel[k * 3] = Math.cos(a) * s; pVel[k * 3 + 1] = up * (.5 + Math.random()); pVel[k * 3 + 2] = Math.sin(a) * s * .6 + .3;
      var c = PALETTE[(Math.random() * PALETTE.length) | 0];
      pCol[k * 3] = c[0]; pCol[k * 3 + 1] = c[1]; pCol[k * 3 + 2] = c[2];
      pSize[k] = sizeBase * (.5 + Math.random()); pMax[k] = .7 + Math.random() * .9; pLife[k] = 1;
    }
  }
  function stepParticles(dt) {
    for (var i = 0; i < NP; i++) {
      if (pLife[i] <= 0) continue;
      pLife[i] -= dt / pMax[i];
      if (pLife[i] <= 0) { pLife[i] = 0; pSize[i] = 0; continue; }
      pVel[i * 3 + 1] -= 3.2 * dt;
      pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
    }
    pGeo.attributes.position.needsUpdate = true; pGeo.attributes.aLife.needsUpdate = true; pGeo.attributes.aSize.needsUpdate = true; pGeo.attributes.color.needsUpdate = true;
  }

  /* floating code glyphs (sprites) */
  var GLYPHS = ['</>', '{ }', 'SEO', 'GEO', '01', '=>', 'AI', 'CRM', '#', '( )'];
  var glyphTex = {};
  function gTex(t) {
    if (glyphTex[t]) return glyphTex[t];
    var c = document.createElement('canvas'); c.width = 192; c.height = 96; var x = c.getContext('2d');
    x.font = '700 54px ui-monospace,Menlo,Consolas,monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    var gr = x.createLinearGradient(0, 0, 192, 0); gr.addColorStop(0, '#7dd3fc'); gr.addColorStop(.6, '#a5b4fc'); gr.addColorStop(1, '#d8b4fe');
    x.shadowColor = '#6366f1'; x.shadowBlur = 18; x.fillStyle = gr; x.fillText(t, 96, 50);
    var tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; return glyphTex[t] = tx;
  }
  var sprites = [];
  for (var si = 0; si < 14; si++) {
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTex(GLYPHS[0]), transparent: true, depthWrite: false, opacity: 0 }));
    sp.scale.set(.6, .3, 1); sp.visible = false; sp.userData = { life: 0, vx: 0, vy: 0, max: 1 }; scene.add(sp); sprites.push(sp);
  }
  var spHead = 0;
  function spawnGlyph() {
    var sp = sprites[spHead]; spHead = (spHead + 1) % sprites.length;
    sp.material.map = gTex(GLYPHS[(Math.random() * GLYPHS.length) | 0]); sp.material.needsUpdate = true;
    var side = Math.random() < .5 ? -1 : 1;
    sp.position.set(side * (1.35 + Math.random() * .5), .9 + Math.random() * .9, 0.2 + Math.random() * .5);
    sp.userData.vx = side * (.1 + Math.random() * .22); sp.userData.vy = .4 + Math.random() * .4; sp.userData.max = 1.3 + Math.random() * .6; sp.userData.life = 1;
    var s = .2 + Math.random() * .16; sp.scale.set(s * 2, s, 1); sp.visible = true;
  }
  function stepSprites(dt) {
    sprites.forEach(function (sp) {
      var u = sp.userData; if (u.life <= 0) return;
      u.life -= dt / u.max; if (u.life <= 0) { sp.visible = false; sp.material.opacity = 0; return; }
      sp.position.x += u.vx * dt; sp.position.y += u.vy * dt;
      var a = u.life > .8 ? (1 - u.life) / .2 : u.life / .8; sp.material.opacity = Math.max(0, a) * .95;
    });
  }

  /* key ripples */
  var ripples = [];
  for (var ri = 0; ri < 8; ri++) {
    var rm = new THREE.Mesh(new THREE.RingGeometry(.09, .115, 28), new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    rm.rotation.x = -Math.PI / 2; rm.visible = false; rm.userData = { life: 0 }; shell.add(rm); ripples.push(rm);
  }
  var rpHead = 0;
  var KEY_COLORS = [0x38bdf8, 0x6366f1, 0xa855f7, 0x7dd3fc];
  function pressKey(k) {
    k.press = 1;
    var col = KEY_COLORS[(Math.random() * KEY_COLORS.length) | 0];
    k.mat.emissive.setHex(col);
    var r = ripples[rpHead]; rpHead = (rpHead + 1) % ripples.length;
    r.position.set(k.x, BH + KEY_H + 0.012, k.z); r.material.color.setHex(col); r.userData.life = 1; r.visible = true; r.scale.setScalar(1);
  }
  function stepRipples(dt) {
    ripples.forEach(function (r) {
      if (r.userData.life <= 0) return; r.userData.life -= dt / .5;
      if (r.userData.life <= 0) { r.visible = false; return; }
      var t = 1 - r.userData.life; r.scale.setScalar(1 + t * 2.6); r.material.opacity = (1 - t) * .8;
    });
  }

  /* ---------- screen drawing ---------- */
  var MONO = 'ui-monospace,SFMono-Regular,Menlo,Consolas,"DejaVu Sans Mono",monospace';
  var FS = 25, LH_PX = 32, CW = 0;
  g.font = '500 ' + FS + 'px ' + MONO; CW = g.measureText('M').width;
  var COL = { kw: '#c084fc', str: '#86efac', fn: '#7dd3fc', num: '#fbbf24', pun: '#8fa3d9', def: '#e8edff', prop: '#93c5fd', com: '#5d6d9c' };
  var KW = /^(import|from|const|await|new|async|return|true|false)$/;
  var TOK = /(\/\/.*$)|("(?:[^"\\]|\\.)*"?)|(\b[A-Za-z_]\w*)(?=\s*:)|(\b[A-Za-z_]\w*)(?=\()|(\b\d+\b)|([A-Za-z_@$][\w$@\/\.]*)|(\s+)|([^\sA-Za-z0-9_])/g;
  function drawCodeLine(txt, x, y) {
    var m, last = 0; TOK.lastIndex = 0;
    while ((m = TOK.exec(txt)) !== null) {
      var s = m[0], c = COL.def;
      if (m[1]) c = COL.com; else if (m[2]) c = COL.str; else if (m[3]) c = COL.prop; else if (m[4]) c = COL.fn;
      else if (m[5]) c = COL.num; else if (m[6]) c = KW.test(s) ? COL.kw : COL.def; else if (m[8]) c = '{}()[];:,.=>'.indexOf(s) > -1 ? COL.pun : COL.def;
      if (!m[7]) { g.fillStyle = c; g.fillText(s, x, y); }
      x += s.length * CW; if (m[0].length === 0) TOK.lastIndex++;
    }
    return x;
  }
  function roundRect(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function check(cx, cy, col) { g.strokeStyle = col; g.lineWidth = 3.2; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.arc(cx, cy, 11, 0, 7); g.globalAlpha = .35; g.stroke(); g.globalAlpha = 1; g.beginPath(); g.moveTo(cx - 5, cy); g.lineTo(cx - 1, cy + 4); g.lineTo(cx + 6, cy - 4); g.stroke(); }

  var S = { mode: 'idle', si: 0, full: '', pos: 0, need: 0, acc: 0, termT: 0, flash: 0, runs: 0, t: 0, lineDone: 0 };
  function setScript(i, instant) {
    S.si = i % SCRIPTS.length; var sc0 = SCRIPTS[S.si];
    S.full = sc0.lines.map(function (l) { return l.t; }).join('\n'); S.pos = instant ? S.full.length : 0; S.lineDone = instant ? sc0.lines.length : 0; S.termT = instant ? 99 : 0;
    S.mode = instant ? 'done' : 'typing';
  }
  function termLines() { return I18N.term; }

  function drawScreen() {
    var sc0 = SCRIPTS[S.si], t = S.t;
    var bg = g.createLinearGradient(0, 0, SW, SH); bg.addColorStop(0, '#0a0f21'); bg.addColorStop(1, '#101842');
    g.fillStyle = bg; g.fillRect(0, 0, SW, SH);
    // soft aurora
    var a1 = g.createRadialGradient(SW * .85, 40, 10, SW * .85, 40, 420); a1.addColorStop(0, 'rgba(168,85,247,.22)'); a1.addColorStop(1, 'rgba(168,85,247,0)'); g.fillStyle = a1; g.fillRect(0, 0, SW, SH);
    var a2 = g.createRadialGradient(80, SH, 10, 80, SH, 420); a2.addColorStop(0, 'rgba(56,189,248,.2)'); a2.addColorStop(1, 'rgba(56,189,248,0)'); g.fillStyle = a2; g.fillRect(0, 0, SW, SH);
    // title bar
    g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, 0, SW, 50);
    ['#ff5f57', '#febc2e', '#28c840'].forEach(function (c, i) { g.fillStyle = c; g.beginPath(); g.arc(28 + i * 26, 25, 7.5, 0, 7); g.fill(); });
    g.font = '600 20px ' + MONO; g.fillStyle = '#e8edff'; g.textBaseline = 'middle';
    roundRect(150, 9, 190, 34, 9); g.fillStyle = 'rgba(255,255,255,.09)'; g.fill();
    g.fillStyle = '#e8edff'; g.fillText(sc0.file, 172, 26);
    g.fillStyle = '#7dd3fc'; g.beginPath(); g.arc(160, 26, 4, 0, 7); g.fill();
    g.fillStyle = '#6f7fb3'; g.fillText('aiva.config', 360, 26);
    var gr = g.createLinearGradient(SW - 190, 0, SW - 24, 0); gr.addColorStop(0, '#38bdf8'); gr.addColorStop(1, '#a855f7');
    g.font = '800 20px ' + MONO; g.fillStyle = gr; g.textAlign = 'right'; g.fillText('AIVA', SW - 28, 26); g.textAlign = 'left';

    // editor
    g.font = '500 ' + FS + 'px ' + MONO; g.textBaseline = 'alphabetic';
    var typed = S.full.slice(0, S.pos).split('\n');
    var y0 = 98, x0 = 78;
    for (var i = 0; i < sc0.lines.length; i++) {
      var y = y0 + i * LH_PX;
      if (i > typed.length - 1) break;
      g.fillStyle = i === typed.length - 1 && S.mode === 'typing' ? '#8fa3d9' : '#3d4c7d';
      g.textAlign = 'right'; g.fillText(String(i + 1), 54, y); g.textAlign = 'left';
      var endx = drawCodeLine(typed[i], x0, y);
      if (i === typed.length - 1) {                                    // caret
        var blink = S.mode === 'typing' ? 1 : (Math.floor(t * 2) % 2);
        if (blink) { var cg = g.createLinearGradient(0, y - 24, 0, y + 6); cg.addColorStop(0, '#7dd3fc'); cg.addColorStop(1, '#a78bfa'); g.fillStyle = cg; g.fillRect(endx + 1, y - 23, 3.5, 30); }
      }
    }
    g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(64, 56, 1, 350);

    // terminal
    var ty = 420;
    g.fillStyle = 'rgba(4,7,18,.65)'; g.fillRect(0, ty, SW, 186);
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, ty, SW, 1);
    g.font = '700 17px ' + MONO; g.fillStyle = '#6f7fb3'; g.fillText('TERMINAL', 28, ty + 28);
    g.font = '500 24px ' + MONO;
    var showT = S.mode === 'term' || S.mode === 'done';
    var tt = S.mode === 'done' ? 99 : S.termT;
    g.fillStyle = '#e8edff'; g.fillText('$', 28, ty + 66);
    g.fillStyle = '#7dd3fc'; g.fillText(' aiva deploy', 28 + CW, ty + 66);
    if (S.mode === 'typing') { g.fillStyle = '#3d4c7d'; g.fillText('…', 28 + CW * 13, ty + 66); }
    var tl = termLines();
    for (var k = 0; k < tl.length; k++) {
      var appear = .2 + k * .3; if (!showT || tt < appear) break;
      var al = Math.min(1, (tt - appear) / .15); g.globalAlpha = al;
      check(42, ty + 97 + k * 31 - 6, '#4ade80');
      g.fillStyle = '#d7e0ff'; g.fillText(tl[k], 68, ty + 98 + k * 31);
      g.globalAlpha = 1;
    }
    // chart
    var cx0 = 640, cy0 = ty + 44, cw = 350, ch = 120;
    g.strokeStyle = 'rgba(255,255,255,.1)'; g.lineWidth = 1; g.beginPath(); for (var q = 0; q < 4; q++) { g.moveTo(cx0, cy0 + q * ch / 3); g.lineTo(cx0 + cw, cy0 + q * ch / 3); } g.stroke();
    var prog = showT ? Math.min(1, Math.max(0, (tt - .15) / 1.2)) : 0; var ease = 1 - Math.pow(1 - prog, 3);
    var pts = [0, .08, .06, .2, .17, .34, .3, .5, .46, .7, .66, .92], n = pts.length;
    if (ease > 0) {
      var vis = ease * (n - 1);
      g.beginPath();
      for (var p = 0; p <= Math.floor(vis); p++) { var px = cx0 + cw * p / (n - 1), py = cy0 + ch - pts[p] * ch; p ? g.lineTo(px, py) : g.moveTo(px, py); }
      var fr = vis - Math.floor(vis); var lx, ly;
      if (Math.floor(vis) < n - 1) { var a = Math.floor(vis); lx = cx0 + cw * (a + fr) / (n - 1); ly = cy0 + ch - (pts[a] + (pts[a + 1] - pts[a]) * fr) * ch; g.lineTo(lx, ly); } else { lx = cx0 + cw; ly = cy0 + ch - pts[n - 1] * ch; }
      var lg = g.createLinearGradient(cx0, 0, cx0 + cw, 0); lg.addColorStop(0, '#38bdf8'); lg.addColorStop(.6, '#6366f1'); lg.addColorStop(1, '#c084fc');
      g.strokeStyle = lg; g.lineWidth = 4; g.lineJoin = 'round'; g.lineCap = 'round'; g.shadowColor = '#6366f1'; g.shadowBlur = 14; g.stroke(); g.shadowBlur = 0;
      g.lineTo(lx, cy0 + ch); g.lineTo(cx0, cy0 + ch); g.closePath(); var fg = g.createLinearGradient(0, cy0, 0, cy0 + ch); fg.addColorStop(0, 'rgba(99,102,241,.35)'); fg.addColorStop(1, 'rgba(99,102,241,0)'); g.fillStyle = fg; g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(lx, ly, 6 + Math.sin(t * 6) * 1.2, 0, 7); g.fill();
      g.strokeStyle = 'rgba(168,139,250,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(lx, ly, 12 + (t * 14 % 8), 0, 7); g.stroke();
    }
    // status bar
    var sg = g.createLinearGradient(0, 0, SW, 0); sg.addColorStop(0, '#2b78d6'); sg.addColorStop(.55, '#5057e0'); sg.addColorStop(1, '#8a3fd8');
    g.fillStyle = sg; g.fillRect(0, SH - 34, SW, 34);
    g.font = '600 16px ' + MONO; g.fillStyle = '#fff'; g.textBaseline = 'middle';
    g.fillText('AIVA GROUP  ·  TypeScript  ·  UTF-8', 24, SH - 17);
    g.textAlign = 'right'; g.fillText((S.mode === 'typing' ? '● typing…' : S.mode === 'term' ? '● building' : '● ready'), SW - 24, SH - 17); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    // glare + flash + scanlines
    var gl = g.createLinearGradient(0, 0, SW, SH); gl.addColorStop(0, 'rgba(255,255,255,.07)'); gl.addColorStop(.35, 'rgba(255,255,255,0)'); g.fillStyle = gl; g.fillRect(0, 0, SW, SH);
    if (S.flash > 0) { g.fillStyle = 'rgba(140,170,255,' + (S.flash * .2) + ')'; g.fillRect(0, 0, SW, SH); }
    screenTex.needsUpdate = true;
  }

  /* ---------- chips pulse ---------- */
  var chipTimers = {};
  function pulseChip(name) {
    var c = chips[name]; if (!c) return;
    c.classList.add('on'); clearTimeout(chipTimers[name]);
    chipTimers[name] = setTimeout(function () { c.classList.remove('on'); }, 1100);
  }

  /* ---------- state & loop ---------- */
  var lidV = 0, lidX = 0, tilt = 0, tiltV = 0, zoom = 1, zoomT = 1, shake = 0;
  var yawDrag = 0, yawIdle = 0, pnx = 0, pny = 0, lastInteract = 0, hover = false, running = false, visible = true, raf = 0, clock = new THREE.Clock();
  var screenWorld = new THREE.Vector3();

  function lineStartIndex(n) { var idx = 0, ls = SCRIPTS[S.si].lines; for (var i = 0; i < n; i++) idx += ls[i].t.length + 1; return idx; }
  function typeStep(dt) {
    if (S.mode === 'typing') {
      var cps = 90; S.acc += dt * cps;
      var guard = 0;
      while (S.acc >= S.need && S.pos < S.full.length && guard++ < 6) {
        S.acc -= S.need; S.need = .75 + Math.random() * .6;
        var ch = S.full[S.pos]; S.pos++;
        var k = keyFor(ch); pressKey(k);
        if (!REDUCED) {
          emit(ch === '\n' ? 16 : 2, k.x, BH + .1, k.z, ch === '\n' ? 1.6 : .6, ch === '\n' ? 2.4 : 1.3, ch === '\n' ? .16 : .09);
          lidV += (ch === '\n' ? .5 : .08) * (Math.random() < .5 ? 1 : -1) * .6; tiltV += ch === '\n' ? -.35 : -.05; shake = Math.max(shake, ch === '\n' ? .5 : .12);
          if (Math.random() < .09) spawnGlyph();
        }
      }
      if (S.pos >= S.full.length) { S.mode = 'term'; S.termT = 0; if (!REDUCED) { emit(46, 0, .22, -.2, 1.6, 4.4, .2); } }
    } else if (S.mode === 'term') {
      S.termT += dt; if (S.termT > 2.1) S.mode = 'done';
    }
    if (S.flash > 0) S.flash = Math.max(0, S.flash - dt * 2.2);
  }

  function activate() {
    lastInteract = performance.now();
    if (hint && !hint.classList.contains('used')) { hint.classList.add('used'); hint.setAttribute('aria-label', I18N.again); hint.setAttribute('title', I18N.again); }
    S.runs++; S.flash = 1;
    var names = Object.keys(chips);
    for (var q = names.length - 1; q > 0; q--) { var z = (Math.random() * (q + 1)) | 0, tmp = names[q]; names[q] = names[z]; names[z] = tmp; }
    names.forEach(function (nm, idx) { setTimeout(function () { pulseChip(nm); }, idx * 120 + Math.random() * 60); });
    if (REDUCED) { setScript(S.runs - 1, true); drawScreen(); render(); return; }
    setScript(S.runs - 1, false); S.acc = 0; S.need = .3;
    zoomT = .93; lidV += 1.2; tiltV -= .5; shake = 1;
    emit(80, 0, .22, -.2, 1.7, 4.2, .2);
    for (var i = 0; i < 4; i++) setTimeout(spawnGlyph, i * 90);
    Object.keys(chips).forEach(function (k) { chips[k].classList.remove('on'); });
    start();
  }

  var yawBase = 0;
  function update(dt) {
    S.t += dt; var t = S.t;
    typeStep(dt);
    // keys
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]; if (k.press > .002) { k.press *= Math.exp(-dt * 11); k.mesh.position.y = k.by - .034 * k.press; k.mat.emissiveIntensity = k.press * 1.6; } else if (k.press) { k.press = 0; k.mesh.position.y = k.by; k.mat.emissiveIntensity = 0; }
    }
    // lid spring
    lidV += (-lidX * 120 - lidV * 9) * dt; lidX += lidV * dt; lid.rotation.x = LID_OPEN + lidX;
    tiltV += (-tilt * 90 - tiltV * 8) * dt; tilt += tiltV * dt;
    shake *= Math.exp(-dt * 7);
    // pointer parallax / drag
    var idleFor = (performance.now() - lastInteract) / 1000;
    if (!dragging && idleFor > 1.4) yawDrag += (0 - yawDrag) * Math.min(1, dt * 1.4);
    var ty = pnx * .22 + yawDrag + (REDUCED ? 0 : Math.sin(t * .6) * .06);
    var tx = pny * .05 + tilt;
    laptop.rotation.y += (ty - laptop.rotation.y) * Math.min(1, dt * 5);
    laptop.rotation.x += (tx - laptop.rotation.x) * Math.min(1, dt * 5);
    laptop.position.y = (REDUCED ? 0 : Math.sin(t * 1.1) * .05) + shake * .02 * Math.sin(t * 60);
    laptop.position.x = shake * .015 * Math.sin(t * 47);
    shadow.material.opacity = 1 - (laptop.position.y) * 2;
    // camera
    zoomT = (S.mode === 'typing' || S.mode === 'term') ? .93 : 1;
    zoom += (zoomT - zoom) * Math.min(1, dt * 3.2);
    var asp = viewAsp, dist = Math.max(7.69 / asp, 5.8) * zoom;
    camera.position.set(0, 1.25 + (1 - zoom) * 1.2, dist); camera.lookAt(0, .72 + (1 - zoom) * .9, 0);
    // glow follow typing
    var act = S.mode === 'typing' ? 1 : (S.mode === 'term' ? .6 : .25);
    screenLight.intensity += (act * 1.4 - screenLight.intensity) * Math.min(1, dt * 4);
    glowMat.opacity += ((S.mode === 'typing' ? .95 : .55) - glowMat.opacity) * Math.min(1, dt * 4);
    halo.material.opacity += ((S.mode === 'typing' ? .95 : .55) - halo.material.opacity) * Math.min(1, dt * 4);
    if (S.mode === 'typing' && Math.random() < dt * 5 && !REDUCED) { var sx = (Math.random() - .5) * 2.8; emit(3, sx, 2.1 + (Math.random() * .1), .08, .5, 1.6, .12); }
    stepParticles(dt); stepSprites(dt); stepRipples(dt);
    if (S.mode === 'typing' || S.mode === 'term' || S.flash > 0 || t - lastDraw > .1) { lastDraw = t; drawScreen(); }
  }
  var lastDraw = -1;
  function render() { renderer.render(scene, camera); }
  function loop() {
    if (!running) return; raf = requestAnimationFrame(loop);
    var dt = Math.min(.05, clock.getDelta()); update(dt); render();
  }
  function start() { if (running || !visible || document.hidden) return; running = true; clock.getDelta(); raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  // idle mode: slower tick so caret blinks / laptop floats at low cost, full speed whenever visible
  new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }, { threshold: .05 }).observe(stage);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

  /* ---------- sizing ---------- */
  var viewAsp = 1;
  function resize() {
    var r = view.getBoundingClientRect(), w = Math.max(200, r.width), h = Math.max(200, r.height);
    var W = Math.max(200, canvas.clientWidth), H = Math.max(200, canvas.clientHeight);
    viewAsp = w / h;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.fov = 2 * Math.atan(Math.tan(15 * Math.PI / 180) * H / h) * 180 / Math.PI;   // keep the laptop framed as in the layout box
    camera.updateProjectionMatrix();
    pMat.uniforms.uScale.value = DPR * h * .42;
    if (!running) { update(0.001); render(); }
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(view); else window.addEventListener('resize', resize);

  /* ---------- pointer: parallax, drag, click ---------- */
  var dragging = false, sx0 = 0, sy0 = 0, st0 = 0, moved = 0, yaw0 = 0, ray = new THREE.Raycaster(), mv = new THREE.Vector2();
  function ndc(e) { var r = canvas.getBoundingClientRect(); mv.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); }
  function overLaptop(e) { ndc(e); ray.setFromCamera(mv, camera); return ray.intersectObject(laptop, true).length > 0; }
  window.addEventListener('pointermove', function (e) {
    var r = stage.getBoundingClientRect(); pnx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2)); pny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2));
    if (dragging) { var dx = e.clientX - sx0; moved = Math.max(moved, Math.abs(dx) + Math.abs(e.clientY - sy0)); yawDrag = Math.max(-.75, Math.min(.75, yaw0 + dx * .009)); lastInteract = performance.now(); }
  }, { passive: true });
  view.addEventListener('pointermove', function (e) { if (!dragging) { var o = overLaptop(e); if (o !== hover) { hover = o; view.style.cursor = o ? 'pointer' : 'grab'; stage.classList.toggle('hov', o); } } });
  view.addEventListener('pointerdown', function (e) { if (e.target.closest && e.target.closest('.lt-hint')) return; dragging = true; sx0 = e.clientX; sy0 = e.clientY; st0 = performance.now(); moved = 0; yaw0 = yawDrag; try { view.setPointerCapture(e.pointerId); } catch (x) { } view.style.cursor = 'grabbing'; });
  function up(e) {
    if (!dragging) return; dragging = false; view.style.cursor = hover ? 'pointer' : 'grab';
    if (moved < 7 && performance.now() - st0 < 450 && overLaptop(e)) activate();
    lastInteract = performance.now();
  }
  view.addEventListener('pointerup', up); view.addEventListener('pointercancel', function () { dragging = false; });
  if (hint) hint.addEventListener('click', function (e) { e.preventDefault(); activate(); });
  canvas.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });

  /* ---------- boot ---------- */
  setScript(0, true);           // idle state: first script already "written"
  resize(); update(0.001); render();
  stage.classList.add('lt-ready');
  start();
  window.AivaLaptop = { tick: function (dt) { update(dt || .016); render(); }, stop: stop, activate: activate, set: function (i, inst) { setScript(i, inst !== false); drawScreen(); }, pulse: pulseChip, draw: drawScreen, state: S, scene: scene, camera: camera };
})();
