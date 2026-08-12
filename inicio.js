/* =========================================
ELEMENTOS
========================================= */

const sceneMenu =
document.getElementById("scene-menu");

const sceneLoading =
document.getElementById("scene-loading");

const startButton =
document.getElementById("start-button");

const progressBar =
document.getElementById("progress-bar");

const progressText =
document.getElementById("progress-text");

const loadingMessage =
document.getElementById("loading-message");

const enterButton =
document.getElementById("enter-button");

const fadeScreen =
document.getElementById("fade-screen");

const bgMusic =
document.getElementById("bg-music");

const clickSound =
document.getElementById("click-sound");

const playerSearch =
document.getElementById("player-search");

const playerSearchText =
document.getElementById("player-search-text");

const particles =
document.getElementById("particles");

const nameScreen =
document.getElementById("name-screen");

const playerName =
document.getElementById("player-name");

const continueButton =
document.getElementById("continue-button");

const welcomeScreen =
document.getElementById("welcome-screen");

const welcomeText =
document.getElementById("welcome-text");

/* =========================================
PARTÍCULAS
========================================= */

function createParticles() {

const amount = 35;

for (let i = 0; i < amount; i++) {

    const particle =
        document.createElement("div");

    particle.classList.add("particle");

    particle.style.left =
        Math.random() * 100 + "%";

    particle.style.animationDuration =
        (6 + Math.random() * 10) + "s";

    particle.style.animationDelay =
        (Math.random() * 8) + "s";

    const size =
        2 + Math.random() * 3;

    particle.style.width =
        size + "px";

    particle.style.height =
        size + "px";

    particles.appendChild(particle);
}

}

createParticles();

/* =========================================
MENSAJES DE CARGA
========================================= */

const loadingMessages = [

{
    progress: 10,
    text: "Preparando terreno..."
},

{
    progress: 25,
    text: "Generando biomas..."
},

{
    progress: 40,
    text: "Cargando estructuras..."
},

{
    progress: 55,
    text: "Despertando criaturas..."
},

{
    progress: 70,
    text: "Cargando mundo..."
},

{
    progress: 82,
    text: "Preparando spawn..."
},

{
    progress: 90,
    text: "Buscando jugador..."
},

{
    progress: 100,
    text: "Mundo generado."
}

];

/* =========================================
VARIABLES
========================================= */

let currentStep = 0;

/* =========================================
GENERAR MUNDO
========================================= */

function generateWorld() {

if (
    currentStep >=
    loadingMessages.length
) {

    finishLoading();

    return;
}

const data =
    loadingMessages[currentStep];


/* Barra */

progressBar.style.width =
    data.progress + "%";


/* Porcentaje */

progressText.textContent =
    data.progress + "%";


/* Mensaje */

loadingMessage.style.opacity = "0";

setTimeout(() => {

    loadingMessage.textContent =
        data.text;

    loadingMessage.style.opacity = "1";

}, 120);


currentStep++;


setTimeout(
    generateWorld,
    850
);

}

/* =========================================
FINAL DE LA CARGA
========================================= */

function finishLoading() {

progressBar.style.width =
    "100%";

progressText.textContent =
    "100%";

loadingMessage.textContent =
    "Mundo generado.";


/* Mostrar búsqueda */

setTimeout(() => {

    playerSearch.classList.remove(
        "hidden"
    );

    playerSearchText.textContent =
        "Buscando jugador...";

}, 500);


/* Jugador encontrado */

setTimeout(() => {

    playerSearchText.textContent =
        "Jugador encontrado.";

}, 2200);


/* Mostrar botón */

setTimeout(() => {

    enterButton.classList.remove(
        "hidden"
    );

}, 3000);

}

/* =========================================
REPRODUCIR CLICK
========================================= */

function playClick() {

clickSound.currentTime = 0;

clickSound.play().catch(
    error =>
        console.log(
            "Click:",
            error
        )
);

}

/* =========================================
BOTÓN JUGAR MUNDO
========================================= */

startButton.addEventListener(
"click",
() => {

    /* Sonido */

    playClick();


    /* Música */

    bgMusic.volume = 0.5;

    bgMusic.play().catch(
        error =>
            console.log(
                "Music:",
                error
            )
    );


    /* Cambiar pantalla */

    sceneMenu.classList.remove(
        "active"
    );

    sceneMenu.classList.add(
        "hidden"
    );

    sceneLoading.classList.remove(
        "hidden"
    );

    sceneLoading.classList.add(
        "active"
    );


    /* Reiniciar */

    currentStep = 0;

    progressBar.style.width =
        "0%";

    progressText.textContent =
        "0%";


    /* Comenzar carga */

    setTimeout(() => {

        generateWorld();

    }, 700);

}

);

/* =========================================
BOTÓN ENTRAR AL MUNDO
========================================= */

enterButton.addEventListener(
"click",
() => {

    /* Click */

    playClick();


    /* Mostrar pantalla de nombre */

    nameScreen.classList.remove(
        "hidden"
    );


    /* Enfocar automáticamente */

    setTimeout(() => {

        playerName.focus();

    }, 300);

}

);

/* =========================================
CONTINUAR DESPUÉS DEL NOMBRE
========================================= */

continueButton.addEventListener(
"click",
continueToWorld
);

/* También permite pulsar ENTER */

playerName.addEventListener(
"keydown",
(event) => {

    if (event.key === "Enter") {

        continueToWorld();

    }

}

);

/* =========================================
CONTINUAR AL MUNDO
========================================= */

function continueToWorld() {

const name =
    playerName.value.trim();


/* Si no escribió nada */

if (name === "") {

    playerName.focus();

    playerName.style.animation =
        "inputShake 0.35s ease";

    setTimeout(() => {

        playerName.style.animation =
            "";

    }, 350);

    return;
}


/* Click */

playClick();


/* Guardar nombre */

localStorage.setItem(
    "playerName",
    name
);


/* Cerrar pantalla del nombre */

nameScreen.classList.add(
    "hidden"
);


/* Personalizar bienvenida */

welcomeText.textContent =
    `¡Bienvenida a tu mundo, ${name}!`;


/* Mostrar bienvenida */

welcomeScreen.classList.remove(
    "hidden"
);


/* Parar música */

bgMusic.pause();

bgMusic.currentTime = 0;


/* Esperar y pasar a mundo.html */

setTimeout(() => {

    fadeScreen.classList.add(
        "active"
    );

}, 1000);


setTimeout(() => {

    window.location.href =
        "mundo.html";

}, 2200);

}

/* =========================================
ANIMACIÓN INPUT
========================================= */

const inputShakeStyle =
document.createElement("style");

inputShakeStyle.textContent = `

@keyframes inputShake {

0% {
    transform: translateX(0);
}

25% {
    transform: translateX(-7px);
}

50% {
    transform: translateX(7px);
}

75% {
    transform: translateX(-5px);
}

100% {
    transform: translateX(0);
}

}

`;

document.head.appendChild(
inputShakeStyle
);