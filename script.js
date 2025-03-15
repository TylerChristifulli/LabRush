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

// Initialize game
init();
