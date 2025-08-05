const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 16;
const PLAYER_MARGIN = 18;
const AI_MARGIN = 18;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
let playerScore = 0, aiScore = 0;

// Mouse control
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp to canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // Background
    ctx.fillStyle = "#222c3c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Net
    ctx.strokeStyle = '#46c2e0';
    ctx.lineWidth = 4;
    for (let y = 0; y < canvas.height; y += 36) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y + 20);
        ctx.stroke();
    }

    // Left paddle (Player)
    ctx.fillStyle = "#46c2e0";
    ctx.fillRect(PLAYER_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Right paddle (AI)
    ctx.fillStyle = "#e0469a";
    ctx.fillRect(canvas.width - AI_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Score
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(`${playerScore}`, canvas.width / 2 - 60, 42);
    ctx.fillText(`${aiScore}`, canvas.width / 2 + 40, 42);
}

// Update game state
function update() {
    // Move ball
    ballX += ballVelX;
    ballY += ballVelY;

    // Wall collision
    if (ballY < 0) {
        ballY = 0;
        ballVelY *= -1;
    }
    if (ballY + BALL_SIZE > canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballVelY *= -1;
    }

    // Left paddle collision (Player)
    if (
        ballX < PLAYER_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_MARGIN + PADDLE_WIDTH;
        ballVelX *= -1;
        // Add some spin based on where it hit the paddle
        let hitPoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballVelY = hitPoint * 0.18;
    }

    // Right paddle collision (AI)
    if (
        ballX + BALL_SIZE > canvas.width - AI_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = canvas.width - AI_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballVelX *= -1;
        // Add some spin
        let hitPoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballVelY = hitPoint * 0.18;
    }

    // Score (left or right wall)
    if (ballX < 0) {
        aiScore++;
        resetBall(-1);
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall(1);
    }

    // AI Paddle movement (simple follow with a little lag)
    let aiTarget = ballY - (PADDLE_HEIGHT - BALL_SIZE) / 2;
    if (aiY + PADDLE_HEIGHT / 2 < ballY + BALL_SIZE / 2 - 10) {
        aiY += PADDLE_SPEED * 0.90;
    } else if (aiY + PADDLE_HEIGHT / 2 > ballY + BALL_SIZE / 2 + 10) {
        aiY -= PADDLE_SPEED * 0.90;
    }
    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

function resetBall(direction) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = Math.random() * (canvas.height - BALL_SIZE);
    ballVelX = BALL_SPEED * direction;
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start game
loop();