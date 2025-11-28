/* --- MATRIX EFFECT --- */
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

// Fonction pour définir la taille du canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas(); // Appel initial
window.addEventListener('resize', resizeCanvas); // Met à jour si on change la taille

const letters = "01".split("");
const fontSize = 16;
let columns = canvas.width / fontSize; // Calcul dynamique

// Initialisation des drops
let drops = [];
function initDrops() {
    columns = canvas.width / fontSize;
    drops = Array(Math.floor(columns)).fill(0).map(() => Math.floor(Math.random() * canvas.height / fontSize));
}
initDrops();
window.addEventListener('resize', initDrops); // Recalcule les colonnes si resize

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Trainée
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f0"; // Vert Hacker
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

/* --- CONTRÔLE DE LA RÉPONSE --- */
const inputAnswer = document.getElementById("answer");
const menu = document.getElementById("menu");

inputAnswer.addEventListener("input", function() {
    // On nettoie l'entrée (enlève les espaces)
    const value = this.value.trim();

    if (value === "1") {
        menu.style.display = "flex"; // Important: FLEX pour garder le responsive
        // Scroll automatique vers le menu sur mobile
        setTimeout(() => {
            menu.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        menu.style.display = "none";
    }
});