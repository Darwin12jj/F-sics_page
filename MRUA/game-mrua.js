
window.onload = function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const messageDiv = document.getElementById("message");
    const scoreSpan = document.getElementById("scoreValue");

    const carWidth = 40;
    const carHeight = 60;

    //Automovil principal
    let car = {
      x: canvas.width / 2 - carWidth / 2,
      y: canvas.height - carHeight - 20,
      width: carWidth,
      height: carHeight,
      color: "#ff0000"
    };

    let obstacles = [];
    const obstacleWidth = 40;
    const obstacleHeight = 60;
    const obstacleSpeed = 5;
    let score = 0;
    let lives = 3;
    let speedBoost = false;
    let gameEnded = false;
    let roadOffset = 0;
    let roadSpeed = 1;

    function drawCar() {
      ctx.fillStyle = car.color;
      ctx.fillRect(car.x, car.y, car.width, car.height);
    }

    function drawObstacles() {
      for (let obstacle of obstacles) {
        ctx.fillStyle = "#000000"; // Color fijo para los obstáculos
        ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
      }
    }

    function moveObstacles() {
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;

        if (obstacles[i].y > canvas.height) {
          obstacles.splice(i, 1);
          i--;
          score++;
        }
      }

      if (Math.random() < 0.02) {
        const obstacleX = Math.random() * (canvas.width - obstacleWidth);
        obstacles.push({ x: obstacleX, y: -obstacleHeight });
      }
    }

    //Carretera
    function drawRoad() {
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#fff";
      const lineHeight = 40;
      const numLines = canvas.height / lineHeight;
      for (let i = 0; i < numLines; i++) {
        const y = (roadOffset + i * lineHeight) % (canvas.height + lineHeight);
        ctx.fillRect(canvas.width / 2 - 5, y - lineHeight / 2, 10, lineHeight / 2);
        ctx.fillRect(canvas.width / 4 - 5, y - lineHeight / 2, 10, lineHeight / 2);
        ctx.fillRect((canvas.width * 3) / 4 - 5, y - lineHeight / 2, 10, lineHeight / 2);
      }

      roadOffset += roadSpeed;
    }

    //Colisiones
    function checkCollision() {
      for (let obstacle of obstacles) {
        if (
          car.x < obstacle.x + obstacleWidth &&
          car.x + carWidth > obstacle.x &&
          car.y < obstacle.y + obstacleHeight &&
          car.y + carHeight > obstacle.y
        ) {
          endGame();
          break;
        }
      }
    }

    //Fin del juego
    function endGame() {
      gameEnded = true;
      document.removeEventListener("keydown", moveCar);
      document.addEventListener("keydown", restartGame);
      showMessage(`¡Perdiste! Puntuación: ${score}. Presiona ESPACIO para jugar de nuevo.`);
    }

    //Reiniciar juego
    function restartGame(event) {
      if (event.keyCode === 32) {
        document.removeEventListener("keydown", restartGame);
        document.addEventListener("keydown", moveCar);
        obstacles = [];
        score = 0;
        lives = 3;
        gameEnded = false;
        car.x = canvas.width / 2 - carWidth / 2;
        car.y = canvas.height - carHeight - 20;
        hideMessage();
        update();
      }
    }

    function showMessage(msg) {
      messageDiv.innerHTML = msg;
      messageDiv.style.display = "block";
    }

    function hideMessage() {
      messageDiv.style.display = "none";
    }

    function updateScore() {
      scoreSpan.textContent = score;
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRoad();
      drawCar();
      moveObstacles();
      updateScore(); // Actualizar puntuación
      if (!gameEnded) {
        checkCollision();
        drawObstacles();
        requestAnimationFrame(update);
      }
    }

    //Mover carro
    function moveCar(event) {
      const key = event.keyCode;
      if (key === 37) {
        car.x -= speedBoost ? 20 : 10;
        if (car.x < 0) {
          car.x = 0;
        }
      } else if (key === 39) {
        car.x += speedBoost ? 20 : 10;
        if (car.x + carWidth > canvas.width) {
          car.x = canvas.width - carWidth;
        }
      } else if (key === 38) {
        car.y -= 10;
        if (car.y < 0) {
          car.y = 0;
        }
        roadSpeed += 0.3; // Aumentar la velocidad de las líneas al presionar flecha hacia arriba
      } else if (key === 40) {
        car.y += 10;
        if (car.y + carHeight > canvas.height) {
          car.y = canvas.height - carHeight;
        }
      }
    }

    document.addEventListener("keydown", moveCar);
    update();
  };