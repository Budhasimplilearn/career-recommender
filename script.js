let currentStep = 0;
let answers = [];
let programs = {};

const steps = document.querySelectorAll(".step");

// LOAD JSON
fetch("./programs.json")
  .then(res => res.json())
  .then(data => {
    programs = data;
  })
  .catch(err => {
    console.error("Error loading JSON:", err);
  });

// SHOW STEP
function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });

  const progress = document.getElementById("progress");
  if (progress) {
    progress.style.width = (index / (steps.length - 1)) * 100 + "%";
  }
}

// SELECT (single)
function select(el, val) {
  const cards = el.parentElement.querySelectorAll(".card");

  cards.forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");

  answers[currentStep] = val;
}

// NEXT
function nextStep() {

  if (!answers[currentStep]) {
    alert("Please select an option before continuing.");
    return;
  }

  if (currentStep === steps.length - 2) {
    generateResults();
  }

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

// PREVIOUS
function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// AI-STYLE SCORING
function calculateScore(program, answers) {
  let score = 0;

  program.tags.forEach(tag => {
    if (answers.includes(tag)) {
      score += 2; // weight
    }
  });

  return score;
}

// GENERATE RESULTS
function generateResults() {

  let scores = {};

  // dynamic scoring
  Object.keys(programs).forEach(key => {
    scores[key] = calculateScore(programs[key], answers);
  });

  const maxScore = Math.max(...Object.values(scores));

  let top = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  let output = "";

  top.forEach((item, index) => {

    let d = programs[item[0]];
    if (!d) return;

    let confidence = maxScore > 0 
      ? Math.round((item[1] / maxScore) * 100)
      : 0;

    output += `
      <div class="result-card">

        ${index === 0 ? `<div class="badge">⭐ Best Match</div>` : ""}

        <h3>#${index + 1} ${d.name}</h3>

        <p><b>🎓 Program:</b> ${d.program}</p>

        <div class="progress-container">
          <p><b>Match Score: ${confidence}%</b></p>
          <div class="progress-bar-inner">
            <div class="progress-fill" style="width:${confidence}%"></div>
          </div>
        </div>

        <h4>💡 Why this fits you</h4>
        <ul>${d.why.map(w => `<li>${w}</li>`).join("")}</ul>

        <h4>📈 What you gain</h4>
        <ul>${d.gain.map(g => `<li>${g}</li>`).join("")}</ul>

        <h4>📚 Program Highlights</h4>
        <ul>${d.programDetails.map(p => `<li>${p}</li>`).join("")}</ul>

      </div>
    `;
  });

  document.getElementById("results").innerHTML = output;
}

// INIT
showStep(0);
