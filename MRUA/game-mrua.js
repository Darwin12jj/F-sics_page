const canvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const ctx = canvas.getContext('2d');

function startGame() {
    carX = 225;
    carY = 320;
    enemies = [];
    gameOver = false;
    startButton.style.display = 'none'; // Ocultar el botón de inicio
    update(); // Iniciar el juego
}

startButton.addEventListener('click', startGame);


// Car variables
let carX = 225;
let carY = 320;
const carWidth = 50;
const carHeight = 80;

// Enemy variables
let enemies = [];
const enemyWidth = 50;
const enemyHeight = 80;
const enemySpeed = 2;

let gameOver = false;

function spawnEnemy() {
    const enemy = {
        x: Math.floor(Math.random() * (canvas.width - enemyWidth)),
        y: 0 - enemyHeight
    };

    const overlapping = enemies.some(existingEnemy =>
        enemy.x < existingEnemy.x + enemyWidth &&
        enemy.x + enemyWidth > existingEnemy.x &&
        enemy.y < existingEnemy.y + enemyHeight &&
        enemy.y + enemyHeight > existingEnemy.y
    );

    if (!overlapping) {
        enemies.push(enemy);
    }
}

function drawCar() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(carX, carY, carWidth, carHeight);
}

function drawEnemies() {
    ctx.fillStyle = 'red';
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillRect(enemies[i].x, enemies[i].y, enemyWidth, enemyHeight);
    }
}

function checkCollision() {
    for (let i = 0; i < enemies.length; i++) {
        if (
            carX < enemies[i].x + enemyWidth &&
            carX + carWidth > enemies[i].x &&
            carY < enemies[i].y + enemyHeight &&
            carY + carHeight > enemies[i].y
        ) {
            gameOver = true;
        }
    }
}

// Fondo
const roadWidth = 400; // Ancho de la carretera principal
const laneCount = 5; // Cantidad de carriles
const laneWidth = roadWidth / laneCount;
const grassWidth = (canvas.width - roadWidth) / 3; // Ancho de las franjas de pasto

let backgroundX = 0; // Posición horizontal del fondo
let backgroundY = 0; // Posición vertical del fondo
let backgroundSpeed = 5; // Velocidad de desplazamiento del fondo
let lineSpeed = 0.2; // Reducción de la velocidad de las líneas

function drawBackground() {
    // Carretera
    ctx.fillStyle = '#808080'; // Color gris de la carretera
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar franjas de pasto a los lados de la carretera
    ctx.fillStyle = '#3CB043'; // Color verde para el pasto
    ctx.fillRect(0, 0, grassWidth, canvas.height); // Franja de pasto izquierda
    ctx.fillRect(canvas.width - grassWidth, 0, grassWidth, canvas.height); // Franja de pasto derecha

    // Dibujar carriles y líneas en cada carril
    for (let i = 1; i < laneCount; i++) {
        // Carriles
        ctx.fillStyle = '#FFF'; // Color de los carriles
        ctx.fillRect((canvas.width - roadWidth) / 2 + i * laneWidth, 0, 3, canvas.height);

        // Líneas en cada carril
        for (let j = 0; j < canvas.height; j += 15) {
            ctx.fillStyle = '#FFF'; // Color de las líneas
            ctx.fillRect((canvas.width - roadWidth) / 2 + i * laneWidth - 2, j - backgroundY % 15, 5, 10);
        }
    }

    // Mover el fondo en relación con la velocidad del automóvil (vertical)
    backgroundY -= backgroundSpeed; // Movimiento vertical

    if (backgroundY >= canvas.height) {
        backgroundY = 0;
    }

        // Reducción de la velocidad de las líneas
        lineSpeed -= 0.0001;
        if (lineSpeed < 0.05) {
            lineSpeed = 0.05;
        }
    
        setTimeout(() => requestAnimationFrame(drawBackground), lineSpeed);

    requestAnimationFrame(drawBackground);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawCar();
        drawEnemies();
        checkCollision();        

        for (let i = 0; i < enemies.length; i++) {
            enemies[i].y += enemySpeed;

            if (enemies[i].y > canvas.height) {
                enemies.splice(i, 1);
            }
        }

        if (Math.random() < 0.01) {
            spawnEnemy();
        }

        requestAnimationFrame(update);
    } else {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
        // Mostrar el botón de reinicio
        restartButton.style.display = 'block';
    }
} 


update();

document.addEventListener('keydown', function(event) {
    if (!gameOver) {
        if (event.key === 'ArrowLeft' && carX > 0) {
            carX -= 10;
        } else if (event.key === 'ArrowRight' && carX < canvas.width - carWidth) {
            carX += 10;
        } else if (event.key === 'ArrowUp' && carY > 0) {
            carY -= 10; // Ajusta la posición hacia arriba
        } else if (event.key === 'ArrowDown' && carY < canvas.height - carHeight) {
            carY += 10; // Ajusta la posición hacia abajo
        }
    }
});


// Agregar la lógica para reiniciar el juego al presionar el botón de reinicio
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', function() {
    // Reestablecer el estado del juego
    carX = 225;
    carY = 320;
    enemies = [];
    gameOver = false;

    restartButton.style.display = 'none'; // Ocultar el botón de reinicio nuevamente

    update(); // Reiniciar el juego
});