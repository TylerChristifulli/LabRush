document.addEventListener('DOMContentLoaded', function () {
    const gameArea = document.getElementById('game-area');
    const startButton = document.getElementById('start-btn');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const feedback = document.getElementById('feedback');
    const lowBtn = document.getElementById('low-btn');
    const normalBtn = document.getElementById('normal-btn');
    const highBtn = document.getElementById('high-btn');

    const labDatabase = [
        { name: "Sodium", units: "mEq/L", min: 135, max: 145 },
        { name: "Potassium", units: "mEq/L", min: 3.5, max: 5.0 },
        { name: "Chloride", units: "mEq/L", min: 95, max: 105 },
        { name: "Bicarbonate", units: "mEq/L", min: 22, max: 26 }
    ];

    let gameState = {
        isPlaying: false,
        score: 0,
        lives: 3,
        speed: 6000,
        activeCard: null
    };

    startButton.addEventListener('click', function () {
        startGame();
    });

    lowBtn.addEventListener('click', function () { checkAnswer('low'); });
    normalBtn.addEventListener('click', function () { checkAnswer('normal'); });
    highBtn.addEventListener('click', function () { checkAnswer('high'); });

    function startGame() {
        gameState.isPlaying = true;
        gameState.score = 0;
        gameState.lives = 3;
        updateUI();
        startButton.style.display = 'none';
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

        setTimeout(() => {
            if (gameState.activeCard && gameState.activeCard.element === card) {
                missedCard();
            }
        }, gameState.speed);
    }

    function missedCard() {
        showFeedback('Too Slow!', 'incorrect');
        gameState.lives--;
        updateUI();

        if (gameState.lives <= 0) {
            alert('Game Over!');
            gameState.isPlaying = false;
            startButton.style.display = 'block';
        } else {
            spawnLabValue();
        }
    }

    function showFeedback(message, type) {
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        feedback.style.opacity = 1;

        // Ensure feedback does not overlap the lab card
        setTimeout(() => { feedback.style.opacity = 0; }, 1000);
    }
});
