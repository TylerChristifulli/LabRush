document.addEventListener('DOMContentLoaded', function () {
    const labValueBox = document.getElementById('lab-value-box');
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-btn');
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const startScreen = document.getElementById('start-screen');
    const gameArea = document.getElementById('game-area');
    const feedback = document.getElementById('feedback');

    const labDatabase = {
        BMP: [
            { name: "Sodium", units: "mEq/L", min: 135, max: 145 },
            { name: "Potassium", units: "mEq/L", min: 3.5, max: 5.0 },
            { name: "Chloride", units: "mEq/L", min: 95, max: 105 },
            { name: "Bicarbonate", units: "mEq/L", min: 22, max: 26 }
        ],
        CBC: [
            { name: "WBC", units: "K/μL", min: 4.5, max: 11.0 },
            { name: "Hemoglobin (Male)", units: "g/dL", min: 13.5, max: 17.5 }
        ]
    };

    let gameState = {
        isPlaying: false,
        score: 0,
        lives: 3,
        currentSpeed: 5000,
        activeCard: null
    };

    let animationFrame;

    startButton.addEventListener('click', function () {
        startGame();
    });

    function startGame() {
        gameState.isPlaying = true;
        gameState.score = 0;
        gameState.lives = 3;
        startScreen.style.display = 'none';
        updateUI();
        spawnLabValue();
    }

    function updateUI() {
        scoreDisplay.textContent = `Score: ${gameState.score}`;
        livesDisplay.textContent = `Lives: ${'❤️'.repeat(gameState.lives)}`;
    }

    function spawnLabValue() {
        if (!gameState.isPlaying) return;

        const labs = [...labDatabase.BMP, ...labDatabase.CBC];
        const lab = labs[Math.floor(Math.random() * labs.length)];

        let value, category;
        const rand = Math.random();

        if (rand < 0.4) {
            value = (lab.min + Math.random() * (lab.max - lab.min)).toFixed(1);
            category = 'normal';
        } else if (rand < 0.7) {
            value = (lab.min * (0.8 + Math.random() * 0.2)).toFixed(1);
            category = 'low';
        } else {
            value = (lab.max * (1.1 + Math.random() * 0.2)).toFixed(1);
            category = 'high';
        }

        const card = document.createElement('div');
        card.className = 'lab-card';
        card.innerHTML = `<div class="lab-name">${lab.name}</div>
                          <div class="lab-value">${value} ${lab.units}</div>`;
        gameArea.appendChild(card);

        card.style.animation = `slideDown ${gameState.currentSpeed / 1000}s linear forwards`;

        gameState.activeCard = {
            element: card,
            category: category
        };

        setTimeout(() => {
            if (gameState.activeCard && gameState.activeCard.element === card) {
                missedCard();
            }
        }, gameState.currentSpeed);
    }

    document.getElementById('low-btn').addEventListener('click', () => checkAnswer('low'));
    document.getElementById('normal-btn').addEventListener('click', () => checkAnswer('normal'));
    document.getElementById('high-btn').addEventListener('click', () => checkAnswer('high'));

    function checkAnswer(answer) {
        if (!gameState.activeCard) return;

        const correctCategory = gameState.activeCard.category;
        const card = gameState.activeCard.element;

        if (answer === correctCategory) {
            gameState.score += 10;
            showFeedback('Correct!', 'correct');
        } else {
            gameState.lives--;
            showFeedback('Incorrect!', 'incorrect');
        }

        updateUI();
        card.remove();
        gameState.activeCard = null;

        if (gameState.lives <= 0) {
            gameOver();
        } else {
            spawnLabValue();
        }
    }

    function missedCard() {
        if (!gameState.activeCard) return;

        gameState.lives--;
        showFeedback('Too slow!', 'incorrect');
        updateUI();

        gameState.activeCard.element.remove();
        gameState.activeCard = null;

        if (gameState.lives <= 0) {
            gameOver();
        } else {
            spawnLabValue();
        }
    }

    function gameOver() {
        gameState.isPlaying = false;
        alert(`Game Over! Your score: ${gameState.score}`);
        startScreen.style.display = 'flex';
    }

    function showFeedback(message, type) {
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        feedback.style.opacity = 1;

        setTimeout(() => {
            feedback.style.opacity = 0;
        }, 1000);
    }
});

