// Changement de l'ID pour correspondre à ton HTML (three-canvas)
const canvas = document.getElementById("three-canvas"); 
const ctx = canvas.getContext("2d");

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

// ==========================================
// SYSTÈME AUDIO JARVIS PRO (PC & MOBILE)
// ==========================================
const jarvisAudio = document.getElementById('jarvis-audio');
let audioInitiated = false;

function launchJarvis() {
    if (audioInitiated) return; 
    
    // On force le volume à 0 pour le début du fondu
    jarvisAudio.volume = 0; 
    
    jarvisAudio.play().then(() => {
        audioInitiated = true;
        
        // Fondu (Fade-in)
        let vol = 0;
        const fade = setInterval(() => {
            if (vol < 0.9) {
                vol += 0.05;
                jarvisAudio.volume = vol;
            } else {
                jarvisAudio.volume = 1;
                clearInterval(fade);
            }
        }, 150); 
        
    }).catch(err => {
        // En cas de blocage navigateur, on retente au prochain clic
        console.log("Interaction requise");
    });
}

// Écouteurs d'événements pour PC et Mobile
document.addEventListener('click', launchJarvis);
document.addEventListener('touchstart', launchJarvis);
document.addEventListener('keydown', launchJarvis);