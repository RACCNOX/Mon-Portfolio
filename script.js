/* ==========================================================================
   1. VARIABLES & CORE 3D (STRICTEMENT ORIGINAL)
   ========================================================================== */
let scene, camera, renderer, earth, stars, iss;

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    createStars(); createEarth(); loadISS(); setupLights(); animate();
}

function createStars() {
    const starGeo = new THREE.BufferGeometry();
    const starPos = [];
    for(let i=0; i<30000; i++) starPos.push((Math.random()-0.5)*1500, (Math.random()-0.5)*1500, (Math.random()-0.5)*1500);
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    stars = new THREE.Points(starGeo, new THREE.PointsMaterial({color: 0xffffff, size: 0.7}));
    scene.add(stars);
}

function createEarth() {
    const loader = new THREE.TextureLoader();
    const earthGeo = new THREE.SphereGeometry(1.5, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
        map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
        bumpMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'),
        bumpScale: 0.05
    });
    earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);
}

function loadISS() {
    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load('ISS_stationary.glb', (gltf) => { 
        iss = gltf.scene; 
        iss.scale.set(0.010, 0.010, 0.010); 
        scene.add(iss); 
    });
}

function setupLights() {
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5); sunLight.position.set(5, 3, 5); scene.add(sunLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); scene.add(ambientLight);
}

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.0005;
    if(earth) earth.rotation.y += 0.001;
    if(stars) stars.rotation.y += 0.00005;
    if(iss) {
        const orbitRadius = 3.0; const inclination = 51.6 * (Math.PI / 180);
        iss.position.x = Math.cos(time) * orbitRadius;
        iss.position.y = Math.sin(time) * Math.sin(inclination) * orbitRadius;
        iss.position.z = Math.sin(time) * Math.cos(inclination) * orbitRadius;
        iss.lookAt(0,0,0); iss.rotation.y += Math.PI / 2;
    }
    renderer.render(scene, camera);
}

/* ==========================================================================
   2. SYSTÈME DE SCAN & TRANSITION AUTO (DÉVERROUILLAGE AUDIO SILENCIEUX)
   ========================================================================== */
function initScanner() {
    const target = document.getElementById('fingerprint-target');
    const scanBar = target.querySelector('.scan-bar');
    const lockOverlay = document.getElementById('lock-overlay');
    const lockBox = lockOverlay.querySelector('.lock-box');
    const lockIcon = lockBox.querySelector('.lock-icon');
    const jarvisAudio = document.getElementById('jarvis-audio');
    let isScanning = false; 

    const startScan = (e) => {
        if (isScanning) return;
        isScanning = true;
        if (e && e.cancelable) e.preventDefault();

        // --- DÉVERROUILLAGE SILENCIEUX POUR MOBILE ---
        if (jarvisAudio) {
            jarvisAudio.volume = 0; // On force le volume à 0 pour éviter un son parasite
            jarvisAudio.play().then(() => {
                jarvisAudio.pause();
                jarvisAudio.currentTime = 0;
            }).catch(err => console.log("Audio unlock ready"));
        }

        target.classList.add('active');
        scanBar.style.display = 'block';
        scanBar.style.animation = 'scanning 2s ease-in-out infinite alternate';

        setTimeout(() => {
            scanBar.style.display = 'none';
            lockOverlay.style.display = 'flex';
            setTimeout(() => {
                lockOverlay.style.transform = 'translateY(-50%) scaleX(1)';
                setTimeout(() => {
                    lockIcon.innerText = '🔓';
                    lockBox.classList.add('unlocked');
                    setTimeout(() => {
                        const overlay = document.getElementById('scanner-step');
                        overlay.style.opacity = '0';
                        setTimeout(() => { overlay.style.display = 'none'; runTerminal(); }, 500);
                    }, 1000);
                }, 800);
            }, 50);
        }, 2500);
    };

    target.addEventListener('mousedown', startScan, { once: true });
    target.addEventListener('touchstart', startScan, { once: true, passive: false });
}

/* ==========================================================================
   3. TERMINAL AVEC LANCEMENT RÉEL DE JARVIS
   ========================================================================== */
function generateCircuits() {
    const container = document.getElementById('circuit-board'); if(!container) return;
    const w = 600, h = 600, cx = 300, cy = 300, r = 100;
    let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
    const busPaths = [
        { start: [0, -1], steps: [[0, -40], [-40, -40], [-80, -40], [-80, -80]], count: 3 },
        { start: [-1, 0], steps: [[-60, 0], [-100, 40], [-140, 40]], count: 2 },
        { start: [-0.7, 0.7], steps: [[-30, 30], [-30, 80], [-80, 130]], count: 4 },
        { start: [0.1, 1], steps: [[0, 50], [40, 90], [80, 90]], count: 3 }
    ];
    busPaths.forEach(group => {
        for(let n=0; n<group.count; n++) {
            const offset = n * 6; let x = cx + group.start[0] * r + (group.start[1] !== 0 ? offset : 0);
            let y = cy + group.start[1] * r + (group.start[0] !== 0 ? offset : 0);
            let d = `M ${x} ${y}`; group.steps.forEach(s => { x += s[0]; y += s[1]; d += ` L ${x} ${y}`; });
            svg += `<path d="${d}" class="circuit-path" style="animation-delay: ${1.8 + (n*0.1)}s" />`;
            if(n === 0 || n === group.count -1) svg += `<rect x="${x-3}" y="${y-3}" width="6" height="6" class="circuit-node" style="animation-delay: ${2.8 + (n*0.1)}s" />`;
        }
    });
    container.innerHTML = svg + '</svg>';
}

function runTerminal() {
    // --- DÉMARRAGE AUDIO JARVIS : PILE AU DÉBUT DU TERMINAL ---
    const jarvisAudio = document.getElementById('jarvis-audio');
    if (jarvisAudio) {
        jarvisAudio.currentTime = 0;
        jarvisAudio.volume = 0;
        jarvisAudio.play().then(() => {
            let vol = 0;
            const fade = setInterval(() => {
                if (vol < 0.9) { vol += 0.1; jarvisAudio.volume = vol; }
                else { jarvisAudio.volume = 1; clearInterval(fade); }
            }, 100); 
        }).catch(err => console.log("Audio play failed"));
    }

    const logs = ["> INITIATING PORTFOLIO...", "> CONNECTING TO SATELLITE...", "> UPLOADING RACCNOX CORE...", "> ACCESS GRANTED."];
    let i = 0; const content = document.getElementById('terminal-content');
    if(content) content.innerHTML = ""; 
    const typing = setInterval(() => {
        if(i < logs.length) { if(content) content.innerHTML += logs[i] + "<br>"; i++; }
        else { clearInterval(typing); proceedToLoader(); }
    }, 600);
}

function proceedToLoader() {
    setTimeout(() => {
        document.getElementById('nasa-terminal').style.display = 'none';
        document.getElementById('jarvis-loader').style.display = 'flex'; generateCircuits();
        setTimeout(() => {
            document.getElementById('jarvis-loader').style.display = 'none';
            renderer.domElement.classList.add('reveal-effect');
            camera.position.z = 2.5; let zoomOut = setInterval(() => { if(camera.position.z < 5) camera.position.z += 0.05; else clearInterval(zoomOut); }, 20);
            document.getElementById('hud').style.display = 'flex';
        }, 4200);
    }, 1000);
}

function initLogin() {
    const input = document.getElementById('access-code'); if(!input) return;
    input.addEventListener('input', (e) => {
        if(e.target.value === "1") {
            document.getElementById('login-container').style.opacity = '0';
            setTimeout(() => { document.getElementById('login-container').style.display = 'none'; document.getElementById('main-menu').style.display = 'grid'; }, 500);
        }
    });
}

/* ==========================================================================
   4. BOOTSTRAP
   ========================================================================== */
window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

window.onload = () => {
    init3D();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('skipIntro') === 'true') {
        if(document.getElementById('scanner-step')) document.getElementById('scanner-step').style.display = 'none';
        document.getElementById('nasa-terminal').style.display = 'none'; document.getElementById('jarvis-loader').style.display = 'none';
        document.getElementById('hud').style.display = 'flex'; document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-menu').style.display = 'grid'; camera.position.z = 5;
    } else { initScanner(); initLogin(); }
};

setInterval(() => { const clock = document.getElementById('clock'); if(clock) clock.innerText = new Date().toLocaleTimeString(); }, 1000);