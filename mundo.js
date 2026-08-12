const caveMusic = document.getElementById("cave-music");
const clickSound = document.getElementById("click-sound");
const chestSound = document.getElementById("chest-sound");
const stepSound = document.getElementById("step-sound"); // <- NUEVO: Sonido de pasos
const playerAvatar = document.getElementById("player-avatar");
const btnOpenChest = document.getElementById("btn-open-chest");
const chestTip = document.getElementById("chest-tip");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const playerNameDisplay = document.getElementById("player-name-display");

const savedPlayerName = localStorage.getItem("playerName") || "aventurero";
playerNameDisplay.textContent = savedPlayerName;

let playerPosition = 20;
let gameFinished = false;

function getMaxPosition() { return document.getElementById("game-board").clientWidth - 125; }

document.body.addEventListener("click", () => {
    caveMusic.volume = 0.4;
    caveMusic.play().catch(e => console.log(e));
}, { once: true });

// NUEVO: Función auxiliar para reproducir el paso sin que se trabe
function playStepSound() {
    if (!stepSound) return;
    stepSound.currentTime = 0; // Reinicia el audio para que suene fluido
    stepSound.volume = 0.5;
    stepSound.play().catch(e => console.log(e));
}

function movePlayer(direction) {
    if (gameFinished) return;
    const maxPosition = getMaxPosition();
    const oldPosition = playerPosition;

    if (direction === "right") playerPosition = Math.min(playerPosition + 25, maxPosition);
    else if (direction === "left") playerPosition = Math.max(playerPosition - 25, 20);
    
    playerAvatar.style.left = playerPosition + "px";

    // Si realmente se movió, reproducimos el sonido de los pasos
    if (playerPosition !== oldPosition) {
        playStepSound();
    }

    checkChestProximity();
}

btnRight.addEventListener("click", () => { movePlayer("right"); });
btnLeft.addEventListener("click", () => { movePlayer("left"); });

// NUEVO: Soporte para teclado (Flechas y A/D) con el sonido integrado
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        movePlayer("right");
    } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        movePlayer("left");
    }
});

function checkChestProximity() {
    const chestDistance = getMaxPosition() - playerPosition;
    if (chestDistance <= 110) {
        chestTip.classList.add("hidden");
        btnOpenChest.classList.remove("hidden");
    } else {
        chestTip.classList.add("hidden");
        btnOpenChest.classList.add("hidden");
    }
}

function openChestAction() {
    if (gameFinished) return;
    gameFinished = true;
    chestSound.play();
    setTimeout(() => { window.location.href = "cofre.html"; }, 700);
}

btnOpenChest.addEventListener("click", openChestAction);
window.addEventListener("resize", () => {
    playerPosition = Math.min(playerPosition, getMaxPosition());
    playerAvatar.style.left = playerPosition + "px";
    checkChestProximity();
});
