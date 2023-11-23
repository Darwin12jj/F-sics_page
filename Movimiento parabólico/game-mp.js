window.onload = function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const messageDiv = document.getElementById("message");

    const basket = {
      x: canvas.width - 100, 
      y: canvas.height / 2 - 25,
      width: 80, // Ajusta el tamaño de la cesta
      height: 15, // Ajusta el tamaño de la cesta
       color: "#e67e22"
    };

    let ball = {
      x: 50,
      y: canvas.height - 50,
      radius: 10,
      speedX: 0,
      speedY: 0,
      gravity: 0.2,
      isShot: false
    };

    let basketSpeed = 8; // Velocidad de movimiento de la cesta (ajustada para ser más rápida)
    let basketDirection = 1; // Dirección inicial hacia abajo

    function moveBasket() {
      basket.y += basketSpeed * basketDirection;

      if (basket.y + basket.height > canvas.height || basket.y < 0) {
        // Cambia la dirección cuando alcanza el borde superior o inferior
        basketDirection *= -1;
      }
    }

    canvas.addEventListener("mousedown", function(event) {
      if (!ball.isShot) {
        resetGame();
        ball.x = event.clientX - canvas.offsetLeft;
        ball.y = event.clientY - canvas.offsetTop;
        ball.speedX = 8;
        ball.speedY = -8;
        ball.isShot = true;
        messageDiv.style.display = "none";
        draw();
      }
    });

    function resetGame() {
      ball = {
        x: 50,
        y: canvas.height - 50,
        radius: 10,
        speedX: 0,
        speedY: 0,
        gravity: 0.2,
        isShot: false
      };
      messageDiv.style.display = "none";
      basket.y = canvas.height / 2 - 25; // Reinicia la posición de la cesta
      basketDirection = 1; // Reinicia la dirección de la cesta
    }

    function drawBasket() {
      // Dibuja la cesta
      ctx.beginPath();
      ctx.rect(basket.x, basket.y, basket.width, basket.height);
      ctx.fillStyle = basket.color;
      ctx.fill();
      ctx.closePath();
    }

    function drawBall() {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#8e44ad"; /* Morado para el balón */
      ctx.fill();
      ctx.closePath();
    }

    function updateBall() {
      if (ball.isShot) {
        ball.x += ball.speedX;
        ball.y += ball.speedY;
        ball.speedY += ball.gravity;

        if (
          ball.x + ball.radius > basket.x &&
          ball.x - ball.radius < basket.x + basket.width &&
          ball.y + ball.radius > basket.y &&
          ball.y - ball.radius < basket.y + basket.height
        ) {
          // La bola ha pasado por el aro
          ball.isShot = false;
          showMessage("¡Ganáste!");
        } else if (ball.y + ball.radius > canvas.height || ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
          // La bola ha salido del área de juego
          ball.isShot = false;
          showMessage("Perdiste. Haz clic para jugar de nuevo.");
        }

        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
          // Rebote en el eje Y
          ball.speedY = -ball.speedY * 0.9;
        }

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
          // Rebote en el eje X
          ball.speedX = -ball.speedX * 0.7;
        }
      }
    }

    function showMessage(msg) {
      messageDiv.innerHTML = msg;
      messageDiv.style.display = "block";
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveBasket(); // Mueve la cesta
      drawBasket();
      drawBall();
      updateBall();

      if (ball.isShot) {
        requestAnimationFrame(draw);
      }
    }

    // Iniciar el movimiento de la cesta incluso después de que el juego haya terminado
    setInterval(moveBasket, 1000 / 60);

    draw();
  };