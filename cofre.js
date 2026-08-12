const MENSAJE = `
La verdad, no sabía muy bien qué regalarte, no soy muy bueno escogiendo regalos, así que hice esta pequeña página.
Me alegra haberte conocido a ti y a los chicos. Como te dije, fue algo inesperado para mí. Hicimos varias cosas juntos, como perdernos en Pura Pura, o cuando fuimos a comer a la Laguna de Cota Cota y el pato Hasam me robó mi milanesa. Aún odio a ese pato calajo, por su culpa ese día no comí carne calajo x2. También están esas veces en las que nos apoyamos para poder aprobar las materias.
Bueno, espero que la pases muy bien con tu familia y con las personas que quieres, y que de aquí en adelante te pasen cosas muy buenas. El semestre pasado no fue precisamente una etapa fácil para ti ya que tuviste que pasar por algunas cosas complicadas, pero me alegra que hayas podido seguir adelante. Ojalá esta nueva etapa venga con momentos mucho mejores y con muchas cosas buenas para ti.
FELIZ CUMPLE ERIKA
Como bonus agregue 2 dragones al server te deje a uno en la plaza corre antes que te lo robe alguien xd. `;


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const VELOCIDAD = 38;
const CARACTERES_POR_PAGINA = 240;


/* =========================================================
   ELEMENTOS
========================================================= */

const scene = document.getElementById("scene");
const chest = document.getElementById("chest");
const openingMessage = document.getElementById("openingMessage");
const openBookButton = document.getElementById("openBookButton");
const bookContainer = document.getElementById("bookContainer");
const book = document.getElementById("book");
const leftText = document.getElementById("leftText");
const rightText = document.getElementById("rightText");
const pageControls = document.getElementById("pageControls");
const previousPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");
const pageIndicator = document.getElementById("pageIndicator");
const bookHint = document.getElementById("bookHint");
const soundButton = document.getElementById("soundButton");
const particles = document.getElementById("particles");


/* =========================================================
   VARIABLES
========================================================= */

let paginas = [];
let paginaActual = 0;
let paginasVistas = new Set();
let audioContext = null;
let sonidoActivado = true;
let escribiendo = false;
let generacion = 0;


/* =========================================================
   AUDIO
========================================================= */

function iniciarAudio() {
    if (!sonidoActivado) return;

    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}


/* =========================================================
   📦 SONIDO DEL COFRE
   Usa directamente Efectos/Cofre.mp3
========================================================= */

const audioCofre = new Audio("Efectos/Cofre.mp3");
audioCofre.preload = "auto";
audioCofre.volume = 0.7;

function sonidoCofre() {
    if (!sonidoActivado) return;

    try {
        audioCofre.currentTime = 0;
        audioCofre.play().catch(() => {});
    } catch (error) {
        console.log("No se pudo reproducir el sonido del cofre.");
    }
}


/* =========================================================
   SONIDO PÁGINA
========================================================= */

function sonidoPagina() {
    if (!sonidoActivado) return;

    iniciarAudio();

    const ahora = audioContext.currentTime;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "sine";
    osc.frequency.value = 500;

    gain.gain.setValueAtTime(0.001, ahora);
    gain.gain.exponentialRampToValueAtTime(
        0.06,
        ahora + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ahora + 0.4
    );

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(ahora);
    osc.stop(ahora + 0.45);
}


/* =========================================================
   ⌨️ MÁQUINA DE ESCRIBIR SUAVE
========================================================= */

function sonidoTecla() {
    if (!sonidoActivado) return;

    iniciarAudio();

    const ahora = audioContext.currentTime;

    /* Golpe suave */
    const golpe = audioContext.createOscillator();
    const ganancia = audioContext.createGain();

    golpe.type = "triangle";

    const frecuencia =
        115 + Math.random() * 35;

    golpe.frequency.setValueAtTime(
        frecuencia,
        ahora
    );

    golpe.frequency.exponentialRampToValueAtTime(
        75,
        ahora + 0.035
    );

    ganancia.gain.setValueAtTime(
        0.001,
        ahora
    );

    ganancia.gain.exponentialRampToValueAtTime(
        0.045,
        ahora + 0.004
    );

    ganancia.gain.exponentialRampToValueAtTime(
        0.001,
        ahora + 0.055
    );

    golpe.connect(ganancia);
    ganancia.connect(audioContext.destination);

    golpe.start(ahora);
    golpe.stop(ahora + 0.06);


    /* Clic pequeño de tecla */

    const clic = audioContext.createOscillator();
    const gananciaClic = audioContext.createGain();

    clic.type = "square";

    clic.frequency.setValueAtTime(
        900 + Math.random() * 180,
        ahora
    );

    gananciaClic.gain.setValueAtTime(
        0.001,
        ahora
    );

    gananciaClic.gain.exponentialRampToValueAtTime(
        0.012,
        ahora + 0.003
    );

    gananciaClic.gain.exponentialRampToValueAtTime(
        0.001,
        ahora + 0.025
    );

    clic.connect(gananciaClic);
    gananciaClic.connect(
        audioContext.destination
    );

    clic.start(ahora);
    clic.stop(ahora + 0.03);
}


/* =========================================================
   PARTÍCULAS
========================================================= */

setInterval(() => {

    const p = document.createElement("div");

    p.className = "particle";

    p.style.left =
        Math.random() * 100 + "%";

    p.style.top =
        60 + Math.random() * 35 + "%";

    p.style.animationDuration =
        2 + Math.random() * 4 + "s";

    particles.appendChild(p);

    setTimeout(() => {
        p.remove();
    }, 6000);

}, 250);


/* =========================================================
   🔥 ABRIR COFRE
   ESTA PARTE QUEDA COMO LA ORIGINAL
========================================================= */

function abrirCofre() {

    if (chest.classList.contains("opened")) return;

    iniciarAudio();

    sonidoCofre();

    chest.classList.add("opened");

    scene.classList.add("chest-opened");

    openingMessage.style.opacity = "0";

    openingMessage.style.pointerEvents = "none";

    setTimeout(() => {

        openBookButton.classList.add("visible");

    }, 1300);
}


openingMessage.addEventListener(
    "click",
    abrirCofre
);

chest.addEventListener(
    "click",
    abrirCofre
);


/* =========================================================
   📖 ABRIR LIBRO
========================================================= */

openBookButton.addEventListener(
    "click",
    () => {

        iniciarAudio();

        sonidoPagina();

        openBookButton.classList.remove(
            "visible"
        );

        bookContainer.style.opacity = "0";

        setTimeout(() => {

            book.classList.add("open");

        }, 300);

        setTimeout(
            prepararPaginas,
            1100
        );
    }
);


/* =========================================================
   PREPARAR PÁGINAS
========================================================= */

function prepararPaginas() {

    paginas = [];

    let textoRestante =
        MENSAJE.trim();

    while (textoRestante.length > 0) {

        if (
            textoRestante.length <=
            CARACTERES_POR_PAGINA
        ) {

            paginas.push(textoRestante);

            break;
        }

        let corte =
            textoRestante.lastIndexOf(
                " ",
                CARACTERES_POR_PAGINA
            );

        if (corte === -1) {
            corte = CARACTERES_POR_PAGINA;
        }

        paginas.push(
            textoRestante
                .substring(0, corte)
                .trim()
        );

        textoRestante =
            textoRestante
                .substring(corte)
                .trim();
    }

    if (paginas.length % 2 !== 0) {
        paginas.push("");
    }

    paginaActual = 0;

    paginasVistas.clear();

    reproducirSecuenciaCompleta();

    pageControls.classList.add("visible");
}


/* =========================================================
   MOSTRAR PÁGINA
========================================================= */

async function mostrarPagina(indice) {

    generacion++;

    const miGeneracion = generacion;

    escribiendo = true;

    paginaActual =
        Math.max(
            0,
            Math.min(
                indice,
                paginas.length - 1
            )
        );

    leftText.innerHTML = "";
    rightText.innerHTML = "";

    bookHint.classList.remove("visible");

    const numeroIzq =
        document.querySelector(
            ".left-page .page-number"
        );

    const numeroDer =
        document.querySelector(
            ".right-page .page-number"
        );

    numeroIzq.textContent =
        romano(paginaActual + 1);

    numeroDer.textContent =
        romano(paginaActual + 2);

    const textoIzq =
        paginas[paginaActual] || "";

    const textoDer =
        paginas[paginaActual + 1] || "";

    if (
        paginasVistas.has(paginaActual) &&
        paginasVistas.has(paginaActual + 1)
    ) {

        leftText.textContent = textoIzq;
        rightText.textContent = textoDer;

        escribiendo = false;

        actualizarControles();

        if (paginaActual + 2 >= paginas.length) {

            setTimeout(() => {
                bookHint.classList.add("visible");
            }, 500);
        }

        return;
    }

    if (paginasVistas.has(paginaActual)) {

        leftText.textContent = textoIzq;

    } else {

        await escribirTexto(
            leftText,
            textoIzq,
            miGeneracion
        );

        if (miGeneracion !== generacion) return;

        paginasVistas.add(paginaActual);
    }

    await esperar(200);

    if (miGeneracion !== generacion) return;

    if (paginasVistas.has(paginaActual + 1)) {

        rightText.textContent = textoDer;

    } else {

        await escribirTexto(
            rightText,
            textoDer,
            miGeneracion
        );

        if (miGeneracion !== generacion) return;

        paginasVistas.add(paginaActual + 1);
    }

    escribiendo = false;

    actualizarControles();

    if (paginaActual + 2 >= paginas.length) {

        setTimeout(() => {
            bookHint.classList.add("visible");
        }, 500);
    }
}


/* =========================================================
   SECUENCIA COMPLETA
========================================================= */

async function reproducirSecuenciaCompleta() {

    generacion++;

    const miGeneracion = generacion;

    escribiendo = true;

    paginaActual = 0;

    leftText.innerHTML = "";
    rightText.innerHTML = "";

    bookHint.classList.remove("visible");

    const numeroIzq =
        document.querySelector(
            ".left-page .page-number"
        );

    const numeroDer =
        document.querySelector(
            ".right-page .page-number"
        );

    while (paginaActual < paginas.length) {

        if (miGeneracion !== generacion) return;

        numeroIzq.textContent =
            romano(paginaActual + 1);

        numeroDer.textContent =
            romano(paginaActual + 2);

        leftText.innerHTML = "";
        rightText.innerHTML = "";

        const textoIzq =
            paginas[paginaActual] || "";

        const textoDer =
            paginas[paginaActual + 1] || "";

        await escribirTexto(
            leftText,
            textoIzq,
            miGeneracion
        );

        if (miGeneracion !== generacion) return;

        paginasVistas.add(paginaActual);

        await esperar(200);

        if (miGeneracion !== generacion) return;

        if (textoDer) {

            sonidoPagina();

            await escribirTexto(
                rightText,
                textoDer,
                miGeneracion
            );

            if (miGeneracion !== generacion) return;

            paginasVistas.add(
                paginaActual + 1
            );
        }

        if (paginaActual + 2 < paginas.length) {

            await esperar(1000);

            sonidoPagina();

            paginaActual += 2;

        } else {

            break;
        }
    }

    escribiendo = false;

    actualizarControles();

    setTimeout(() => {
        bookHint.classList.add("visible");
    }, 500);
}


/* =========================================================
   ✍️ ESCRIBIR TEXTO
========================================================= */

async function escribirTexto(
    elemento,
    texto,
    miGeneracion
) {

    elemento.classList.add(
        "typing-cursor"
    );

    for (
        let i = 0;
        i < texto.length;
        i++
    ) {

        if (miGeneracion !== generacion) {

            elemento.classList.remove(
                "typing-cursor"
            );

            return;
        }

        const letra = texto[i];

        if (letra === "\n") {

            elemento.appendChild(
                document.createElement("br")
            );

            await esperar(130);

            continue;
        }

        const span =
            document.createElement("span");

        span.className =
            "typing-letter";

        span.textContent = letra;

        elemento.appendChild(span);

        if (letra !== " ") {
            sonidoTecla();
        }

        let tiempo = VELOCIDAD;

        if (letra === ".") {
            tiempo = 320;
        }

        if (letra === ",") {
            tiempo = 120;
        }

        if (letra === "!") {
            tiempo = 300;
        }

        if (letra === "?") {
            tiempo = 300;
        }

        await esperar(tiempo);
    }

    elemento.classList.remove(
        "typing-cursor"
    );
}


/* =========================================================
   CONTROLES DE PÁGINAS
========================================================= */

nextPage.addEventListener(
    "click",
    () => {

        if (
            paginaActual + 2 >=
            paginas.length
        ) return;

        generacion++;

        sonidoPagina();

        mostrarPagina(
            paginaActual + 2
        );
    }
);


previousPage.addEventListener(
    "click",
    () => {

        if (paginaActual <= 0) return;

        generacion++;

        sonidoPagina();

        mostrarPagina(
            paginaActual - 2
        );
    }
);


/* =========================================================
   ACTUALIZAR CONTROLES
========================================================= */

function actualizarControles() {

    const primera =
        paginaActual + 1;

    const ultima =
        Math.min(
            paginaActual + 2,
            paginas.length
        );

    pageIndicator.textContent =
        `${primera} - ${ultima} / ${paginas.length}`;

    previousPage.disabled =
        paginaActual <= 0;

    nextPage.disabled =
        paginaActual + 2 >= paginas.length;
}


/* =========================================================
   ROMANOS
========================================================= */

function romano(numero) {

    const valores = [
        [1000, "M"],
        [900, "CM"],
        [500, "D"],
        [400, "CD"],
        [100, "C"],
        [90, "XC"],
        [50, "L"],
        [40, "XL"],
        [10, "X"],
        [9, "IX"],
        [5, "V"],
        [4, "IV"],
        [1, "I"]
    ];

    let resultado = "";

    for (const [valor, letra] of valores) {

        while (numero >= valor) {

            resultado += letra;

            numero -= valor;
        }
    }

    return resultado;
}


/* =========================================================
   ESPERAR
========================================================= */

function esperar(ms) {
    return new Promise(
        resolver => setTimeout(
            resolver,
            ms
        )
    );
}


/* =========================================================
   🔊 SONIDO
========================================================= */

soundButton.addEventListener(
    "click",
    () => {

        sonidoActivado =
            !sonidoActivado;

        soundButton.textContent =
            sonidoActivado
                ? "🔊"
                : "🔇";

        if (sonidoActivado) {

            iniciarAudio();

            sonidoPagina();
        }
    }
);


/* =========================================================
   📱 DESLIZAR
========================================================= */

let inicioX = 0;

book.addEventListener(
    "touchstart",
    event => {

        inicioX =
            event.changedTouches[0].screenX;

    },
    {
        passive: true
    }
);


book.addEventListener(
    "touchend",
    event => {

        const finalX =
            event.changedTouches[0].screenX;

        const diferencia =
            finalX - inicioX;

        if (diferencia < -60) {
            nextPage.click();
        }

        if (diferencia > 60) {
            previousPage.click();
        }

    },
    {
        passive: true
    }
);


/* =========================================================
   ⌨️ TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !book.classList.contains("open")
        ) return;

        if (
            event.key === "ArrowRight"
        ) {
            nextPage.click();
        }

        if (
            event.key === "ArrowLeft"
        ) {
            previousPage.click();
        }
    }
);