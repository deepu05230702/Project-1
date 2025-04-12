// ✅ Variable Declarations
const words = [
  "keyboard", "performance", "imagination", "extraordinary", "quick brown fox", "coding is fun",
  "always aim high", "hello world", "artificial intelligence", "neural networks", "machine learning",
  "good typing habits", "I love JavaScript", "practice makes perfect", "typing speed test game",
  "focus on accuracy", "web development", "responsive layout", "cloud computing", "backend database",
  "data structure", "user interface", "beautiful design", "never give up", "consistency is key"
];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 60;
let startTime;
let chart;

// ✅ Element References
const display = document.getElementById("display");
const input = document.getElementById("input");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timeModeSelect = document.getElementById("time-mode");
const startBtn = document.getElementById("startBtn");

// ✅ Start Game
function startGame() {
  score = 0;
  currentIndex = 0;
  timeLeft = parseInt(timeModeSelect.value);
  timerEl.textContent = timeLeft + "s";
  scoreEl.textContent = score;
  input.disabled = false;
  input.value = "";
  input.focus();
  display.textContent = words[currentIndex];
  display.style.color = "black";
  startTime = new Date();

  if (chart) chart.destroy(); // Reset chart if already exists
  chart = new Chart(document.getElementById("wpmChart"), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'WPM',
        data: [],
        borderColor: 'rgba(0, 200, 255, 0.7)',
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Time (s)' } },
        y: { title: { display: true, text: 'WPM' }, beginAtZero: true }
      }
    }
  });

  let elapsedSeconds = 0;
  timer = setInterval(() => {
    timeLeft--;
    elapsedSeconds++;
    timerEl.textContent = timeLeft + "s";

    if (elapsedSeconds % 5 === 0) {
      const minutesPassed = (new Date() - startTime) / 60000;
      const wpm = Math.round(score / minutesPassed);
      chart.data.labels.push(elapsedSeconds);
      chart.data.datasets[0].data.push(wpm);
      chart.update();
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// ✅ End Game
function endGame() {
  input.disabled = true;
  display.textContent = "⏰ Time's up! Your score is: " + score;
  display.style.color = "black";

  const minutes = parseInt(timeModeSelect.value) / 60;
  const wpm = Math.round(score / minutes);
  const best = localStorage.getItem("highWPM");

  if (!best || wpm > best) {
    localStorage.setItem("highWPM", wpm);
    highScoreEl.textContent = `🏅 New High Score: ${wpm} WPM`;
  } else {
    highScoreEl.textContent = `High Score: ${best} WPM`;
  }
}

// ✅ Typing Logic
input.addEventListener("input", () => {
  const typed = input.value.trim();
  const target = words[currentIndex];

  if (typed === target) {
    score++;
    scoreEl.textContent = score;
    currentIndex++; // ✅ FIX: Move to next word

    if (currentIndex >= words.length) {
      currentIndex = 0; // ✅ Cycle back to start
    }

    display.textContent = words[currentIndex];
    input.value = "";
    display.style.color = "green";
  } else {
    display.style.color = "red";
  }
});

// ✅ Start Button Listener
startBtn.addEventListener("click", startGame);
