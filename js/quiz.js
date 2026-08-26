/**
 * js/quiz.js — lógica exclusiva de preguntas.html
 * Depende de: QUIZ_QUESTIONS (data/quiz-questions.js), State (core/state.js).
 *
 * Reglas:
 *  - Respuesta correcta → suma card.coins monedas Y la pregunta queda
 *    marcada como resuelta para SIEMPRE (no vuelve a aparecer).
 *  - Respuesta incorrecta → no da monedas y la pregunta se reinserta en
 *    la baraja para volver a preguntarse más adelante.
 *  - Cada 10 ACIERTOS (no intentos) → bono de gemas.
 */
const QUIZ_GEMS_PER_10_CORRECT = 25;

let quizPool = [];       // preguntas pendientes de esta sesión (excluye resueltas)
let currentQuestion = null;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getSolvedSet() {
  State.quizSolvedIds = State.quizSolvedIds || [];
  return new Set(State.quizSolvedIds);
}

function refillPoolIfNeeded() {
  if (quizPool.length === 0) {
    const solved = getSolvedSet();
    let available = QUIZ_QUESTIONS.filter((q) => !solved.has(q.id));

    if (available.length === 0) {
      // Ya respondió correctamente TODAS las preguntas del banco.
      // Reiniciamos para que pueda seguir jugando desde cero.
      State.quizSolvedIds = [];
      available = [...QUIZ_QUESTIONS];
      quizPool = shuffle(available);
      showCompletionBanner();
      return;
    }

    quizPool = shuffle(available);
  }
}

function showCompletionBanner() {
  const feedback = document.getElementById("quiz-feedback");
  if (feedback) {
    feedback.innerHTML = `<div class="quiz-bonus-banner">🏆 ¡Respondiste todas las preguntas correctamente! Empezamos otra vuelta.</div>`;
  }
}

function nextQuestion() {
  refillPoolIfNeeded();
  currentQuestion = quizPool.pop();
  renderQuestion();
}

function renderQuestion() {
  const card = document.getElementById("quiz-card");
  card.innerHTML = `
    <div class="quiz-verse-badge">Pregunta bíblica</div>
    <div class="quiz-question">${currentQuestion.question}</div>
    <div class="quiz-options" id="quiz-options"></div>`;

  const optsEl = document.getElementById("quiz-options");
  currentQuestion.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;
    btn.onclick = () => answer(idx);
    optsEl.appendChild(btn);
  });
}

function answer(selectedIndex) {
  const buttons = document.querySelectorAll(".quiz-option");
  buttons.forEach((b) => (b.disabled = true));

  const correct = selectedIndex === currentQuestion.correctIndex;
  buttons[currentQuestion.correctIndex].classList.add("correct");
  if (!correct) buttons[selectedIndex].classList.add("wrong");

  let coinsWon = 0;

  State.quizAnswered = (State.quizAnswered || 0) + 1;
  State.quizSolvedIds = State.quizSolvedIds || [];

  if (correct) {
    coinsWon = currentQuestion.coins;
    State.addGold(coinsWon);
    State.quizCorrect = (State.quizCorrect || 0) + 1;

    // La marcamos como resuelta: no vuelve a aparecer nunca más.
    if (!State.quizSolvedIds.includes(currentQuestion.id)) {
      State.quizSolvedIds.push(currentQuestion.id);
    }
  } else {
    // Vuelve a la baraja para reaparecer más adelante (no de inmediato).
    quizPool.unshift(currentQuestion);
  }

  State.save();

  const feedback = document.getElementById("quiz-feedback");
  feedback.innerHTML = `
    <div class="fb-verse">📖 ${currentQuestion.verse}</div>
    <div style="font-family:var(--font-display);font-size:13px;color:${correct ? "#4CAF50" : "var(--blood)"};margin-bottom:14px;">
      ${correct ? `¡Correcto! +${coinsWon} 🪙` : "No era esa — la volverás a ver más adelante"}
    </div>
    <button class="quiz-next-btn" onclick="handleNext()">Siguiente pregunta</button>`;

  updateProgressBar();
  maybeGiveBonus();
}

function updateProgressBar() {
  const correctInRound = (State.quizCorrect || 0) % 10;
  document.getElementById("quiz-progress-count").textContent = correctInRound;
  document.getElementById("quiz-progress-fill").style.width = (correctInRound / 10) * 100 + "%";
}

function maybeGiveBonus() {
  const correct = State.quizCorrect || 0;
  if (correct > 0 && correct % 10 === 0) {
    State.addGems(QUIZ_GEMS_PER_10_CORRECT);
    State.save();
    const feedback = document.getElementById("quiz-feedback");
    feedback.innerHTML += `
      <div class="quiz-bonus-banner">✨ ¡10 respuestas correctas! +${QUIZ_GEMS_PER_10_CORRECT} 💎 gemas de bono</div>`;
  }
}

function handleNext() {
  nextQuestion();
}

document.addEventListener("state:ready", () => {
  updateProgressBar();
  nextQuestion();
});