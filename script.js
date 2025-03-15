document.addEventListener('DOMContentLoaded', function () {
    const gameArea = document.getElementById('game-area');
    const startButton = document.getElementById('start-btn');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const feedback = document.getElementById('feedback');
    const lowBtn = document.getElementById('low-btn');
    const normalBtn = document.getElementById('normal-btn');
    const highBtn = document.getElementById('high-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Lab Value Data
    const labDatabase = [
        { name: "Sodium", units: "mEq/L", min: 135, max: 145 },
        { name: "Potassium", units: "mEq/L", min: 3.5, max: 5.0 },
        { name: "Chloride", units: "mEq/L", min: 95, max: 105 },
        { name: "Bicarbonate", units: "mEq/L", min: 22, max: 26 }
    ];

    // Game State
    let gameState = {
        isPlaying: false,
        score: 0,
        lives: 3,
        speed: 6000,
        activeCard: null
    };

    // Event Listeners
    startButton.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    lowBtn.addEventListener('click', () => checkAnswer('low'));
    normalBtn.addEventListener('click', () => checkAnswer('normal'));
    highBtn.addEventListener('click', () => checkAnswer('high'));

    function startGame() {
        gameState.isPlaying = true;
        gameState.score = 0;
        gameState.lives = 3;
        updateUI();
        startButton.style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'none';
        spawnLabValue();
    }

    function updateUI() {
        scoreDisplay.textContent = `Score: ${gameState.score}`;
        livesDisplay.textContent = `Lives: ${'❤️'.repeat(gameState.lives)}`;
    }

    function spawnLabValue() {
        if (!gameState.isPlaying) return;

        const lab = labDatabase[Math.floor(Math.random() * labDatabase.length)];
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

        gameState.activeCard = { element: card, category: category };

        // Remove the card if no answer is chosen in time
        setTimeout(() => {
            if (gameState.activeCard && gameState.activeCard.element === card) {
                missedCard();
            }
        }, gameState.speed);
    }

    function checkAnswer(answer) {
        if (!gameState.activeCard) return;

        const card = gameState.activeCard.element;
        const correctCategory = gameState.activeCard.category;

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
        showFeedback('Too Slow!', 'incorrect');
        gameState.lives--;
        updateUI();

        if (gameState.lives <= 0) {
            gameOver();
        } else {
            spawnLabValue();
        }
    }

    function showFeedback(message, type) {
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        feedback.style.opacity = 1;

        setTimeout(() => { feedback.style.opacity = 0; }, 1000);
    }

    function gameOver() {
        gameState.isPlaying = false;
        document.getElementById('game-over-screen').style.display = 'flex';
    }
});
