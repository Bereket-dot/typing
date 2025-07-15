const gameArea = document.getElementById('game');
const gameOverScreen = document.getElementById('game-over');
const finalScoreText = document.getElementById('final-score');
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
const hitSound = document.getElementById('hit-sound');

let activeLetters = [];
let gameInterval;
let fallSpeed = 3;
let spawnRate = 50; // lower is faster
let score = 0;
let missed = 0;
let combo = 0;

function startGame() {
  // Reset
  clearInterval(gameInterval);
  gameArea.innerHTML = '';
  activeLetters = [];
  score = 0;
  missed = 0;
  combo = 0;
  fallSpeed = 3;
  spawnRate = 50;

  updateUI();
  gameOverScreen.style.display = 'none';

  // Main loop
  gameInterval = setInterval(() => {
    if (Math.random() * 100 < 2) createFallingLetter();
    updateLetters();
    increaseDifficulty();
  }, 20);
}

function updateUI() {
  scoreDisplay.textContent = score;
  missedDisplay.textContent = missed;
}

function createFallingLetter() {
  const letter = document.createElement('div');
  const char = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  letter.className = 'letter';
  letter.dataset.char = char;
  letter.textContent = char;

  // Random left & slight rotation
  letter.style.left = `${Math.random() * (gameArea.clientWidth - 30)}px`;
  letter.style.fontSize = `${22 + Math.random() * 8}px`;
  letter.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
  letter.style.top = '0px';

  gameArea.appendChild(letter);
  activeLetters.push(letter);
}

function updateLetters() {
  for (let i = activeLetters.length - 1; i >= 0; i--) {
    const el = activeLetters[i];
    el.style.top = `${el.offsetTop + fallSpeed}px`;

    if (el.offsetTop > gameArea.clientHeight) {
      el.remove();
      activeLetters.splice(i, 1);
      missed++;
      combo = 0;
      updateUI();

      if (missed >= 5) endGame();
    }
  }
}

function endGame() {
  clearInterval(gameInterval);
  finalScoreText.textContent = score;
  gameOverScreen.style.display = 'flex';
}

function increaseDifficulty() {
  if (score > 0 && score % 10 === 0 && spawnRate > 20) {
    fallSpeed += 0.01;
    spawnRate -= 0.01;
  }
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase();
  for (let i = 0; i < activeLetters.length; i++) {
    const el = activeLetters[i];
    if (el.dataset.char === key) {
      el.remove();
      activeLetters.splice(i, 1);
      hitSound.currentTime = 0;
      hitSound.play();

      score += 1 + combo;
      combo++;
      updateUI();
      return;
    }
  }
  combo = 0;
});
