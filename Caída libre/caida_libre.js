document.addEventListener("DOMContentLoaded", function () {
    const pelota = document.getElementById("pelota");
    const plataforma = document.getElementById("plataforma");
    const objeto = document.getElementById("objeto");
    const contenedorJuego = document.getElementById("contenedor-juego");
    let juegoTerminado = false;
    let posicionPelotaX = Math.random() * (contenedorJuego.clientWidth - 20);
    let posicionPelotaY = Math.random() * (contenedorJuego.clientHeight - 20);
    let velocidadX = 0;
    let velocidadY = 0;
    let teclaPresionada = false;
    const gravedad = -0.2;
    const velocidadInicial = -5;

    document.addEventListener("keydown", function (evento) {
        if (evento.code === "Space" && !teclaPresionada && !juegoTerminado) {
            soltarPelota();
            teclaPresionada = true;
            evento.preventDefault();
        }
    });

    document.addEventListener("keyup", function (evento) {
        if (evento.code === "Space") {
            teclaPresionada = false;
        }
    });

    contenedorJuego.addEventListener("click", function (evento) {
        if (juegoTerminado) {
            reiniciarJuego();
        } else {
            const rect = contenedorJuego.getBoundingClientRect();
            posicionPelotaX = evento.clientX - rect.left - 10;
            posicionPelotaY = rect.bottom - evento.clientY - 10;
            velocidadX = Math.random() * 4 - 2;
            velocidadY = velocidadInicial;
            actualizarPosicionPelota();
        }
    });

    reiniciarJuego();

    function reiniciarJuego() {
        // Ocultar la pelota al reiniciar
        pelota.style.display = "none";

        // Establecer la posición inicial
        posicionPelotaX = Math.random() * (contenedorJuego.clientWidth - 20);
        posicionPelotaY = Math.random() * (contenedorJuego.clientHeight - 20);

        // Mostrar la pelota después de un breve retraso (puedes ajustar el tiempo según tus necesidades)
        setTimeout(() => {
            pelota.style.display = "block";
        }, 1000);

        pelota.style.left = posicionPelotaX + "px";
        pelota.style.bottom = posicionPelotaY + "px";
        velocidadX = 0;
        velocidadY = velocidadInicial;
        juegoTerminado = false;
        actualizar();
        ocultarMensajeGanador(); // Oculta el mensaje ganador al reiniciar
    }

    function soltarPelota() {
        if (juegoTerminado) {
            reiniciarJuego();
        } else {
            velocidadX = Math.random() * 4 - 2;
            velocidadY = velocidadInicial;
            actualizarPosicionPelota();
        }
    }

    function actualizar() {
        velocidadY += gravedad;
        posicionPelotaX += velocidadX;
        posicionPelotaY += velocidadY;

        // Verificar colisión con la plataforma
        if (
            posicionPelotaY <= 50 &&
            posicionPelotaY >= 30 &&
            plataforma.getBoundingClientRect().bottom >= pelota.getBoundingClientRect().top + 100
        ) {
            velocidadY = -Math.abs(velocidadY);
        }

        // Verificar colisión con el suelo
        const suelo = 20;
        if (posicionPelotaY <= suelo) {
            posicionPelotaY = suelo;
            velocidadY = Math.abs(velocidadY);
        }

        // Verificar colisión con los bordes del contenedor en el eje X
        if (posicionPelotaX <= 0 || posicionPelotaX >= contenedorJuego.clientWidth - 20) {
            velocidadX = -velocidadX;
        }

        // Verificar colisión con los bordes del contenedor en el eje Y
        if (posicionPelotaY >= contenedorJuego.clientHeight - 20) {
            velocidadY = -Math.abs(velocidadY);
        }

        // Verificar colisión con el objeto
        if (colisionConObjeto()) {
            mostrarMensajeGanador();
            return;
        }

        actualizarPosicionPelota();

        if (!juegoTerminado) {
            window.requestAnimationFrame(actualizar);
        }
    }

    function actualizarPosicionPelota() {
        pelota.style.left = posicionPelotaX + "px";
        pelota.style.bottom = posicionPelotaY + "px";
    }

    function colisionConObjeto() {
        const rectPelota = pelota.getBoundingClientRect();
        const rectObjeto = objeto.getBoundingClientRect();

        return (
            rectPelota.bottom >= rectObjeto.top &&
            rectPelota.top <= rectObjeto.bottom &&
            rectPelota.right >= rectObjeto.left &&
            rectPelota.left <= rectObjeto.right
        );
    }

    function mostrarMensajeGanador() {
        juegoTerminado = true;
        const mensajeGanador = document.getElementById("mensaje-ganador");
        mensajeGanador.classList.remove("oculto");
    }

    function ocultarMensajeGanador() {
        const mensajeGanador = document.getElementById("mensaje-ganador");
        mensajeGanador.classList.add("oculto");
    }
});



