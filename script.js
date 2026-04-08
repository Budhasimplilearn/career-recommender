let currentStep = 0;
let answers = [];
let programs = {};

const steps = document.querySelectorAll(".step");

// =====================
// LOAD DATA
// =====================
fetch("./programs.json")
  .then(res => res.json())
  .then(data => programs = data);

// =====================
// STEP CONTROL
// =====================
function showStep(index) {
  steps.forEach((step, i) => step.classList.toggle("active", i === index));

  const progress = document.getElementById("progress");
  if (progress) {
    progress.style.width = (index / (steps.length - 1)) * 100 + "%";
  }
}

function select(el, val) {
  const cards = el.parentElement.querySelectorAll(".card");
  cards.forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  answers[currentStep] = val;
}

function nextStep() {
  if (!answers[currentStep]) {
    alert("Please select an option");
    return;
  }

  if (currentStep === steps.length - 2) {
    generateResults();
  }

  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// =====================
// EXPERIENCE
// =====================
function getExperienceValue(exp) {
  return {
    "0": 0, "1-2": 2, "3-5": 5, "5-7": 7,
    "8-10": 10, "10-12": 12, "13-15": 15, "15+": 20
  }[exp] || 0;
}

function getCareerStage(expVal) {
  if (expVal <= 3) return "early";
  if (expVal <= 10) return "mid";
  return "senior";
}

// =====================
// ELIGIBILITY
// =====================
function checkEligibility(program) {
  const exp = getExperienceValue(answers[2]);
  const background = answers[1];

  const r = program.eligibility;
  if (!r) return true;

  if (exp < r.minExperience || exp > r.maxExperience) return false;

  if (r.education === "technical" && background !== "tech") return false;

  return true;
}

// =====================
// USER PROFILE
// =====================
function getUserProfile() {
  const expVal = getExperienceValue(answers[2]);

  return {
    role: answers[0],
    background: answers[1],
    experience: answers[2],
    expVal,
    stage: getCareerStage(expVal),
    interest: answers[3],
    goal: answers[4]
  };
}

// =====================
// WEIGHTS
// =====================
const WEIGHTS = {
  interest: 5,
  goal: 4,
  careerFit: 5,
  persona: 3,
  transition: 3,
  penalty: -4
};

// =====================
// PERSONA
// =====================
function getUserPersona(profile) {
  const interest = profile.interest;

  if (["product_mgmt", "product_dev", "ic"].includes(interest)) return "builder";
  if (["data", "finance_int"].includes(interest)) return "analyst";
  if (["project"].includes(interest)) return "operator";
  if (["strategy", "cxo_int", "lead"].includes(interest)) return "leader";

  return "generalist";
}

// =====================
// TRANSITION
// =====================
function getUserTransition(profile) {
  if (profile.goal === "switch") return "switch";
  if (profile.goal === "lead") return "accelerate";
  if (profile.goal === "growth") return "upskill";
  return "upskill";
}

// =====================
// SCORING ENGINE
// =====================
function calculateScore(program, profile) {
  let score = 0;

  if (program.tags.includes(profile.interest)) {
    score += WEIGHTS.interest;
  }

  if (program.tags.includes(profile.goal)) {
    score += WEIGHTS.goal;
  }

  if (program.careerFit && program.careerFit[profile.stage]) {
    score += program.careerFit[profile.stage] * WEIGHTS.careerFit;
  }

  if (program.persona === getUserPersona(profile)) {
    score += WEIGHTS.persona;
  }

  if (program.transition && program.transition.includes(getUserTransition(profile))) {
    score += WEIGHTS.transition;
  }

  if (profile.interest === "ai" && !program.tags.includes("ai")) {
    score += WEIGHTS.penalty;
  }

  return score;
}

// =====================
// SMART SELECTION
// =====================
function pickTopPrograms(sorted) {
  const best = sorted[0];

  const safe = sorted.find(p =>
    p !== best && p.score >= best.score * 0.75
  );

  const stretch = sorted.find(p =>
    p.score < best.score * 0.75
  );

  return [best, safe || sorted[1], stretch || sorted[2]];
}

// =====================
// WHY GENERATOR
// =====================
function generateWhy(program, profile) {
  const reasons = [];

  if (program.tags.includes(profile.interest)) {
    reasons.push(`Strong match with your interest in ${profile.interest}`);
  }

  if (program.persona === getUserPersona(profile)) {
    reasons.push(`Fits your career style (${program.persona})`);
  }

  if (program.transition.includes(getUserTransition(profile))) {
    reasons.push(`Aligned with your goal of ${profile.goal}`);
  }

  if (program.tags.includes("ai")) {
    reasons.push("Positions you strongly for AI-driven roles");
  }

  return reasons;
}

// =====================
// RESULTS ENGINE
// =====================
function generateResults() {

  const profile = getUserProfile();

  let evaluated = [];

  Object.keys(programs).forEach(key => {
    const program = programs[key];

    if (!checkEligibility(program)) return;

    const score = calculateScore(program, profile);

    evaluated.push({
      key,
      score,
      data: program
    });
  });

  evaluated.sort((a, b) => b.score - a.score);

  const selected = pickTopPrograms(evaluated);

  // 🔥 STORE FOR GOOGLE SHEET
  window.lastRecommendations = selected.map(x => x.data);

  const maxScore = Math.max(...evaluated.map(x => x.score), 1);

  let output = `<h2>🎯 Your Career Matches</h2>`;

  selected.forEach((item, index) => {
    if (!item) return;

    const d = item.data;
    const confidence = Math.round((item.score / maxScore) * 100);

    const label =
      index === 0 ? "⭐ Best Fit" :
      index === 1 ? "✅ Safe Option" :
      "🚀 Stretch Option";

    const reasons = generateWhy(d, profile);

    output += `
      <div class="result-card">
        <div class="badge">${label}</div>

        <h3>${d.name}</h3>
        <p>${d.program}</p>
        <p><b>${confidence}% Match</b></p>

        <h4>Why this fits you</h4>
        <ul>
          ${reasons.map(r => `<li>${r}</li>`).join("")}
        </ul>

        <h4>What you gain</h4>
        <ul>
          ${d.gain.map(g => `<li>${g}</li>`).join("")}
        </ul>
      </div>
    `;
  });

  // =====================
  // FORM (UNCHANGED UI)
  // =====================
  output += `
  <div class="result-card form-card">
    <h3>📋 Capture Customer Details</h3>

    <input id="email" placeholder="Email">
    <input id="phone" placeholder="Phone">
    <input id="counsellor" placeholder="Counsellor">

    <select id="course">
      <option value="">Select Course</option>
      <option>SP Jain Product Management</option>
      <option>AI for Finance by SP Jain</option>
      <option>AI Leadership by SP Jain</option>
      <option>IIT-B IC Design</option>
      <option>IIT-B Project Management</option>
      <option>IIM-Kz AI Business Strategy</option>
      <option>IIM-Kz AI Product Development</option>
      <option>IIM-Indore Business Analytics</option>
      <option>IIM-Indore GM</option>
      <option>XLRI CXO</option>
    </select>

    <select id="interest">
      <option value="">Select Interest</option>
      <option>Pitched Cross Program</option>
      <option>Re-pitched same program</option>
      <option>Not interested</option>
    </select>

    <button onclick="submitData()">Submit</button>
    <p id="status"></p>
  </div>
  `;

  document.getElementById("results").innerHTML = output;
}

// =====================
// GOOGLE SHEET SUBMIT
// =====================
function submitData() {

  const email = emailEl().value.trim();
  const phone = phoneEl().value.trim();
  const counsellor = counsellorEl().value.trim();
  const course = courseEl().value;
  const interest = interestEl().value;

  const statusEl = document.getElementById("status");

  if (!email || !phone || !counsellor || !course || !interest) {
    alert("Fill all fields");
    return;
  }

  statusEl.innerText = "⏳ Submitting...";

  const profile = getUserProfile();
  const recommendations = window.lastRecommendations || [];

  const params = new URLSearchParams({
    email,
    phone,
    counsellor,
    selected_course: course,
    interest_status: interest,

    role: profile.role,
    background: profile.background,
    experience: profile.experience,
    interest_area: profile.interest,
    goal: profile.goal,

    rec1: recommendations[0]?.name || "",
    rec2: recommendations[1]?.name || "",
    rec3: recommendations[2]?.name || "",
    best_match: recommendations[0]?.name || ""
  });

  const url = "https://script.google.com/macros/s/AKfycbxnrlbzpnwUkBHdeMPApzuyH0lpIhTd_6MHrmjKYHOY77ZbhFDwtlXDly43THguLXxI/exec?" + params.toString();

  fetch(url)
    .then(res => res.text())
    .then(res => {
      if (res.toLowerCase().includes("success")) {
        statusEl.innerText = "✅ Submitted successfully";

        emailEl().value = "";
        phoneEl().value = "";
        counsellorEl().value = "";
        courseEl().value = "";
        interestEl().value = "";
      } else {
        statusEl.innerText = "❌ " + res;
      }
    })
    .catch(err => {
      console.error(err);
      statusEl.innerText = "❌ Network error";
    });
}

// =====================
// HELPERS
// =====================
const emailEl = () => document.getElementById("email");
const phoneEl = () => document.getElementById("phone");
const counsellorEl = () => document.getElementById("counsellor");
const courseEl = () => document.getElementById("course");
const interestEl = () => document.getElementById("interest");

// =====================
// INIT
// =====================
showStep(0);
