let scene, camera, renderer, star1, star2, galaxy, shockwave;
let clock = new THREE.Clock();
let exploded = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Étoiles blanches
    const starGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    star1 = new THREE.Mesh(starGeo, starMat);
    star2 = new THREE.Mesh(starGeo, starMat);

    scene.add(star1, star2);
    animate();
}

function triggerExplosion() {
    exploded = true;
    scene.remove(star1, star2);

    // 1. Flash
    const flash = document.getElementById('flash-overlay');
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.opacity = '0'; }, 150);

    // 2. Onde de choc (Shockwave)
    const ringGeo = new THREE.TorusGeometry(0.1, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
    shockwave = new THREE.Mesh(ringGeo, ringMat);
    scene.add(shockwave);

    // 3. Galaxie Bleue (Structure Spirale)
    const count = 25000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const r = Math.random() * 25;
        const theta = Math.random() * Math.PI * 2;
        const armAngle = theta + (r / 3); // Effet spirale
        
        positions[i * 3] = Math.cos(armAngle) * r;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5; // Epaisseur
        positions[i * 3 + 2] = Math.sin(armAngle) * r;

        colors[i * 3] = 0;           // R
        colors[i * 3 + 1] = 0.8;     // G
        colors[i * 3 + 2] = 1;       // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    galaxy = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.8 }));
    scene.add(galaxy);

    // Afficher les infos
    setTimeout(() => {
        const info = document.getElementById('info-container');
        info.style.display = 'flex';
        info.style.animation = "fadeInUp 1s forwards";
    }, 500);
}

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!exploded) {
        const radius = Math.max(0, 5 - t * 2);
        const speed = t * 6;
        star1.position.set(Math.cos(speed) * radius, 0, Math.sin(speed) * radius);
        star2.position.set(Math.cos(speed + Math.PI) * radius, 0, Math.sin(speed + Math.PI) * radius);
        if (radius <= 0.1) triggerExplosion();
    } else {
        galaxy.rotation.y += 0.001;
        if (shockwave.scale.x < 200) {
            shockwave.scale.x += 2;
            shockwave.scale.y += 2;
            shockwave.material.opacity -= 0.01;
        }
    }
    renderer.render(scene, camera);
}

// Bouton de retour direct aux 6 onglets
document.getElementById('close-terminal').onclick = () => {
    window.location.href = "../index.html?skipIntro=true";
};

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

init();