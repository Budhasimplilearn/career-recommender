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
  .catch(err => console.error("JSON load error:", err));

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

  currentStep++;
  showStep(currentStep);
}

// BACK
function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

//
// 🔹 HELPER: Convert experience
//
function getExperienceValue(exp) {
  if (exp === "0") return 0;
  if (exp === "1-2") return 2;
  if (exp === "3-5") return 5;
  if (exp === "5-7") return 7;
  if (exp === "8-10") return 10;
  if (exp === "10-12") return 12;
  if (exp === "13-15") return 15;
  if (exp === "15+") return 20;
  return 0;
}

//
// 🔹 ELIGIBILITY CHECK
//
function checkEligibility(program, answers) {
  let expAnswer = answers[2]; // step 3 = experience
  let exp = getExperienceValue(expAnswer);

  let rules = program.eligibility;

  if (!rules) return true;

  if (exp < rules.minExperience) return false;
  if (exp > rules.maxExperience) return false;

  return true;
}

//
// 🔹 SCORING ENGINE
//
function calculateScore(program, answers) {
  let score = 0;

  program.tags.forEach(tag => {
    if (answers.includes(tag)) {
      score += 2;
    }
  });

  return score;
}

//
// 🔹 GENERATE RESULTS
//
function generateResults() {

  let eligiblePrograms = [];
  let stretchPrograms = [];

  Object.keys(programs).forEach(key => {

    let program = programs[key];

    let score = calculateScore(program, answers);
    let isEligible = checkEligibility(program, answers);

    if (isEligible) {
      eligiblePrograms.push([key, score]);
    } else {
      stretchPrograms.push([key, score]);
    }

  });

  // sort both
  eligiblePrograms.sort((a, b) => b[1] - a[1]);
  stretchPrograms.sort((a, b) => b[1] - a[1]);

  let topEligible = eligiblePrograms.slice(0, 3);
  let topStretch = stretchPrograms.slice(0, 2);

  let maxScore = Math.max(...eligiblePrograms.map(x => x[1]), 1);

  let output = "";

  //
  // ✅ ELIGIBLE SECTION
  //
  output += `<h2>🎯 Top Matches (Eligible)</h2>`;

  topEligible.forEach((item, index) => {

    let d = programs[item[0]];
    let confidence = Math.round((item[1] / maxScore) * 100);

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

  //
  // ⚠️ STRETCH SECTION
  //
  if (topStretch.length > 0) {

    output += `<h2 style="margin-top:30px;">⚠️ Stretch Options (Future Fit)</h2>
    <p style="color:#facc15;">
    These programs are a strong fit but may require more experience.
    </p>`;

    topStretch.forEach((item) => {

      let d = programs[item[0]];

      output += `
      <div class="result-card">

        <h3>${d.name}</h3>
        <p><b>🎓 Program:</b> ${d.program}</p>

        <p style="color:#f87171;">
        Not currently eligible based on experience criteria
        </p>

        <h4>💡 Why this is a future fit</h4>
        <ul>${d.why.map(w => `<li>${w}</li>`).join("")}</ul>

      </div>
      `;
    });
  }

  document.getElementById("results").innerHTML = output;
}

// INIT
showStep(0);
