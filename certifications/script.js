// ==========================================
// 1. GESTION DU ZOOM (LIGHTBOX)
// ==========================================
const modal = document.getElementById("imageModal");
const img = document.getElementById("myImg");
const modalImg = document.getElementById("imgFull");
const closeBtn = document.querySelector(".close-modal");

// Vérifie si l'image existe sur la page avant d'ajouter l'événement
if(img) {
    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
    }
}

// Fermer avec la croix
if(closeBtn) {
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
}

// Fermer en cliquant n'importe où sur le fond noir (en dehors de l'image)
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// ==========================================
// 2. EFFET MATRIX (TON CODE ACTUEL)
// ==========================================
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

// Fonction de redimensionnement
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const letters = "01".split("");
const fontSize = 16;
let columns = canvas.width / fontSize;
let drops = [];

function initDrops() {
    columns = canvas.width / fontSize;
    drops = Array(Math.floor(columns)).fill(0).map(() => Math.floor(Math.random() * canvas.height / fontSize));
}
initDrops();
window.addEventListener('resize', initDrops);

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f0";
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(draw, 50);