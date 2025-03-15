document.addEventListener('DOMContentLoaded', function() {
    var startButton = document.getElementById('start-btn');
    var lowButton = document.getElementById('low-btn');
    var normalButton = document.getElementById('normal-btn');
    var highButton = document.getElementById('high-btn');
    var feedbackElement = document.getElementById('feedback');
    var scoreDisplay = document.getElementById('score');
    var livesDisplay = document.getElementById('lives');
    var gameArea = document.getElementById('game-area');

    // Game state
    var gameState = {
        score: 0,
        lives: 3,
        isGameStarted: false,
        currentLab: null,
        labValues: [
            { name: 'Sodium', normalRange: { low: 135, high: 145 }, units: 'mEq/L' },
            { name: 'Potassium', normalRange: { low: 3.5, high: 5.0 }, units: 'mEq/L' },
            { name: 'Chloride', normalRange: { low: 95, high: 105 }, units: 'mEq/L' }
            // Add more lab values as needed
        ]
    };

    // Start game
    function startGame() {
        gameState.isGameStarted = true;
        gameState.score = 0;
        gameState.lives = 3;
        updateDisplay();
        feedbackElement.textContent = 'Game started! Identify the lab values.';
        feedbackElement.style.opacity = 1;
        nextLabValue();
    }

    // Pick a lab value to show
    function nextLabValue() {
        if (gameState.lives > 0) {
            var randomIndex = Math.floor(Math.random() * gameState.labValues.length);
            gameState.currentLab = gameState.labValues[randomIndex];
            gameArea.textContent = `What is the status of ${gameState.currentLab.name}?`;
        } else {
            gameOver();
        }
    }

    // Handle answer
    function handleAnswer(selectedRange) {
        if (!gameState.isGameStarted) {
            return;
        }
        var correctRange = getRange(gameState.currentLab.normalRange);
        if (selectedRange === correctRange) {
            gameState.score += 10;
            feedbackElement.textContent = 'Correct!';
        } else {
            gameState.lives -= 1;
            feedbackElement.textContent = 'Incorrect! Correct was ' + correctRange;
        }
        feedbackElement.style.opacity = 1;
        setTimeout(function() {
            feedbackElement.style.opacity = 0;
            nextLabValue();
        }, 2000);
        updateDisplay();
    }

    // Determine the range for comparison
    function getRange(normalRange) {
        // Dummy values, implement actual logic for random value
        var randomValue = Math.random() * (normalRange.high + 20 - normalRange.low) + normalRange.low - 10;
        if (randomValue < normalRange.low) return 'low';
        else if (randomValue > normalRange.high) return 'high';
        else return 'normal';
    }

    // Update UI
    function updateDisplay() {
        scoreDisplay.textContent = 'Score: ' + gameState.score;
        livesDisplay.textContent = 'Lives: ' + '❤️'.repeat(gameState.lives);
    }

    // Game over
    function gameOver() {
        gameState.isGameStarted = false;
        gameArea.textContent = 'Game Over. Your final score: ' + gameState.score;
        feedbackElement.textContent = 'Press Start to play again!';
    }

    startButton.addEventListener('click', startGame);
    lowButton.addEventListener('click', function() { handleAnswer('low'); });
    normalButton.addEventListener('click', function() { handleAnswer('normal'); });
    highButton.addEventListener('click', function() { handleAnswer('high'); });
});
