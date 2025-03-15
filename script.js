<script>
    // Game configuration
    const config = {
      initialLives: 3,
      cardSpeed: 8000, // milliseconds to reach bottom
      speedIncrease: 200, // milliseconds faster per correct answer
      minSpeed: 2000, // minimum speed in milliseconds
    };
    
    // Lab database
    const labDatabase = {
      BMP: {
        title: "Basic Metabolic Panel",
        labs: [
          { name: "Sodium", units: "mEq/L", min: 135, max: 145 },
          { name: "Potassium", units: "mEq/L", min: 3.5, max: 5.0 },
          { name: "Chloride", units: "mEq/L", min: 95, max: 105 },
          { name: "Bicarbonate", units: "mEq/L", min: 22, max: 26 },
          { name: "BUN", units: "mg/dL", min: 8, max: 20 },
          { name: "Creatinine", units: "mg/dL", min: 0.6, max: 1.2 },
          { name: "Glucose", units: "mg/dL", min: 60, max: 100 }
        ]
      },
      CBC: {
        title: "Complete Blood Count",
        labs: [
          { name: "WBC", units: "K/μL", min: 4.5, max: 11.0 },
          { name: "Hemoglobin (Male)", units: "g/dL", min: 13.5, max: 17.5 },
          { name: "Hemoglobin (Female)", units: "g/dL", min: 12.0, max: 15.5 },
          { name: "Hematocrit (Male)", units: "%", min: 41, max: 50 },
          { name: "Hematocrit (Female)", units: "%", min: 36, max: 48 },
          { name: "Platelets", units: "K/μL", min: 150, max: 450 }
        ]
      },
      MIXED: {
        title: "Mixed Labs (BMP & CBC)",
        labs: [] // Will be populated at initialization
      }
    };
    
    // Game state
    let gameState = {
      level: "BMP",
      score: 0,
      lives: config.initialLives,
      currentSpeed: config.cardSpeed,
      isPlaying: false,
      activeCard: null,
      cardTimer: null
    };
    
    // DOM elements
    const gameArea = document.getElementById('game-area');
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const startScreen = document.getElementById('start-screen');
    const levelCompleteScreen = document.getElementById('level-complete-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const levelScoreDisplay = document.getElementById('level-score');
    const finalScoreDisplay = document.getElementById('final-score');
    const startBtn = document.getElementById('start-btn');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const restartBtn = document.getElementById('restart-btn');
    const lowBtn = document.getElementById('low-btn');
    const normalBtn = document.getElementById('normal-btn');
    const highBtn = document.getElementById('high-btn');
    const referenceBtn = document.getElementById('reference-btn');
    const referenceBox = document.getElementById('reference-box');
    const feedback = document.getElementById('feedback');
    
    // Initialize game
    function init() {
      // Add event listeners
      startBtn.addEventListener('click', startGame);
      nextLevelBtn.addEventListener('click', nextLevel);
      restartBtn.addEventListener('click', startGame);
      lowBtn.addEventListener('click', () => checkAnswer('low'));
      normalBtn.addEventListener('click', () => checkAnswer('normal'));
      highBtn.addEventListener('click', () => checkAnswer('high'));
      referenceBtn.addEventListener('click', toggleReference);
      
      // Initialize reference box
      updateReferenceBox();
    }
    
    // Handle level progression
    function nextLevel() {
      // Move to next level in the order
      currentLevelIndex = (currentLevelIndex + 1) % levelOrder.length;
      gameState.level = levelOrder[currentLevelIndex];
      
      // Reset for new level
      gameState.score = 0;
      gameState.currentSpeed = config.cardSpeed;
      gameState.isPlaying = true;
      
      // Update reference box for new level
      updateReferenceBox();
      
      // Hide level complete screen
      levelCompleteScreen.style.display = 'none';
      
      // Update UI
      updateUI();
      
      // Start spawning lab values
      spawnLabValue();
    }
    
    // Start game
    function startGame() {
      // Set initial level to MIXED to include all lab values
      currentLevelIndex = 2; // Index for MIXED in levelOrder array
      
      // Combine lab values for MIXED level
      labDatabase.MIXED.labs = [
        ...labDatabase.BMP.labs,
        ...labDatabase.CBC.labs
      ];
      
      // Reset game state
      gameState = {
        level: levelOrder[currentLevelIndex], // Start with MIXED
        score: 0,
        lives: config.initialLives,
        currentSpeed: config.cardSpeed,
        isPlaying: true,
        activeCard: null,
        cardTimer: null
      };
      
      // Update UI
      updateUI();
      
      // Update reference box
      updateReferenceBox();
      
      // Hide screens
      startScreen.style.display = 'none';
      levelCompleteScreen.style.display = 'none';
      gameOverScreen.style.display = 'none';
      
      // Start spawning lab values
      spawnLabValue();
    }
    
    // Update UI
    function updateUI() {
      levelDisplay.textContent = `Level: ${gameState.level}`;
      scoreDisplay.textContent = `Score: ${gameState.score}`;
      livesDisplay.textContent = `Lives: ${'❤️'.repeat(gameState.lives)}`;
    }
    
    // Update reference box
    function updateReferenceBox() {
      const labs = labDatabase[gameState.level].labs;
      const title = labDatabase[gameState.level].title;
      
      let content = `<div class="ref-title">${title} Normal Ranges:</div>`;
      
      labs.forEach(lab => {
        content += `<div>${lab.name}: ${lab.min}-${lab.max} ${lab.units}</div>`;
      });
      
      referenceBox.innerHTML = content;
    }
    
    // Toggle reference box
    function toggleReference() {
      referenceBox.style.display = referenceBox.style.display === 'block' ? 'none' : 'block';
    }
    
    // Spawn a lab value
    function spawnLabValue() {
      if (!gameState.isPlaying) return;
      
      // Get random lab from current level
      const labs = labDatabase[gameState.level].labs;
      const lab = labs[Math.floor(Math.random() * labs.length)];
      
      // Generate value and category
      let value, category;
      const rand = Math.random();
      
      if (rand < 0.4) {
        // Normal value (40% chance)
        value = lab.min + Math.random() * (lab.max - lab.min);
        category = 'normal';
      } else if (rand < 0.7) {
        // Low value (30% chance)
        value = lab.min * (0.5 + Math.random() * 0.4);
        category = 'low';
      } else {
        // High value (30% chance)
        value = lab.max * (1.1 + Math.random() * 0.4);
        category = 'high';
      }
      
      // Format value
      let formattedValue;
      if (lab.name === "pH") {
        formattedValue = value.toFixed(2);
      } else if (lab.name === "Potassium" || lab.name === "Creatinine") {
        formattedValue = value.toFixed(1);
      } else {
        formattedValue = Math.round(value);
      }
      
      // Create card element
      const card = document.createElement('div');
      card.className = 'lab-card';
      card.innerHTML = `
        <div class="lab-name">${lab.name}</div>
        <div class="lab-value">${formattedValue} ${lab.units}</div>
      `;
      
      // Add to game area
      gameArea.appendChild(card);
      
      // Start animation
      card.style.animation = `slideDown ${gameState.currentSpeed / 1000}s linear forwards`;
      
      // Store active card data
      gameState.activeCard = {
        element: card,
        lab: lab,
        value: parseFloat(formattedValue),
        category: category
      };
      
      // Set timer for missed card
      gameState.cardTimer = setTimeout(() => {
        if (gameState.activeCard && gameState.activeCard.element === card) {
          missedCard();
        }
      }, gameState.currentSpeed);
    }
    
    // Check answer
    function checkAnswer(answer) {
      if (!gameState.activeCard) return;
      
      clearTimeout(gameState.cardTimer);
      
      const card = gameState.activeCard.element;
      const correctCategory = gameState.activeCard.category;
      
      if (answer === correctCategory) {
        // Correct answer
        gameState.score += 10;
        card.classList.add('correct-feedback');
        showFeedback('Correct!', 'correct');
        
        // Increase speed
        gameState.currentSpeed = Math.max(config.minSpeed, gameState.currentSpeed - config.speedIncrease);
      } else {
        // Incorrect answer
        gameState.lives--;
        card.classList.add('incorrect-feedback');
        showFeedback('Incorrect!', 'incorrect');
      }
      
      // Update UI
      updateUI();
      
      // Remove card
      setTimeout(() => {
        if (card.parentNode) {
          card.parentNode.removeChild(card);
        }
        gameState.activeCard = null;
        
        // Check if game over
        if (gameState.lives <= 0) {
          gameOver();
        } else if (gameState.score >= config.levelScoreThreshold) {
          // Level complete
          levelComplete();
        } else {
          spawnLabValue();
        }
      }, 500);
    }
    
          // Missed card
    function missedCard() {
      if (!gameState.activeCard) return;
      
      const card = gameState.activeCard.element;
      
      // Lost a life
      gameState.lives--;
      card.classList.add('incorrect-feedback');
      showFeedback('Too slow!', 'incorrect');
      
      // Update UI
      updateUI();
      
      // Remove card
      setTimeout(() => {
        if (card.parentNode) {
          card.parentNode.removeChild(card);
        }
        gameState.activeCard = null;
        
        // Check if game over
        if (gameState.lives <= 0) {
          gameOver();
        } else if (gameState.score >= config.levelScoreThreshold) {
          // Level complete
          levelComplete();
        } else {
          spawnLabValue();
        }
      }, 500);
    }
    
    // Show feedback
    function showFeedback(message, type) {
      feedback.textContent = message;
      feedback.className = `feedback ${type}`;
      feedback.style.opacity = 1;
      
      setTimeout(() => {
        feedback.style.opacity = 0;
      }, 1000);
    }
    
    // Level complete
    function levelComplete() {
      gameState.isPlaying = false;
      
      // Update level badge
      const levelBadge = document.getElementById('level-badge');
      levelBadge.textContent = labDatabase[gameState.level].title;
      
      // Update score
      levelScoreDisplay.textContent = `Level score: ${gameState.score}`;
      
      // Show level complete screen
      levelCompleteScreen.style.display = 'flex';
    }
    
    // Game over
    function gameOver() {
      gameState.isPlaying = false;
      finalScoreDisplay.textContent = `Your score: ${gameState.score}`;
      gameOverScreen.style.display = 'flex';
    }
    
    // Start with BMP level
    let currentLevelIndex = 0;
    const levelOrder = ["BMP", "CBC", "MIXED"];
    
    // Initialize game
    init();
  </script>
</body>
</html>
