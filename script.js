let currentStep = 0;
let answers = [];
let programs = {};

const steps = document.querySelectorAll(".step");

// LOAD JSON
fetch("./programs.json")
  .then(res => res.json())
  .then(data => programs = data);

// STEP CONTROL
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

// EXPERIENCE
function getExperienceValue(exp) {
  return {
    "0": 0, "1-2": 2, "3-5": 5, "5-7": 7,
    "8-10": 10, "10-12": 12, "13-15": 15, "15+": 20
  }[exp] || 0;
}

// ELIGIBILITY
function checkEligibility(program) {
  let exp = getExperienceValue(answers[2]);
  let r = program.eligibility;
  if (!r) return true;
  return exp >= r.minExperience && exp <= r.maxExperience;
}

// SCORING
function calculateScore(program) {
  let score = 0;
  program.tags.forEach(tag => {
    if (answers.includes(tag)) score += 2;
  });
  return score;
}

// RESULTS
function generateResults() {

  let eligible = [];
  let stretch = [];

  Object.keys(programs).forEach(key => {
    let score = calculateScore(programs[key]);
    checkEligibility(programs[key])
      ? eligible.push([key, score])
      : stretch.push([key, score]);
  });

  eligible.sort((a, b) => b[1] - a[1]);
  stretch.sort((a, b) => b[1] - a[1]);

  let maxScore = Math.max(...eligible.map(x => x[1]), 1);

  let output = `<h2>🎯 Top Matches</h2>`;

  // SHOW PROGRAMS ONLY
  eligible.slice(0, 3).forEach((item, index) => {
    let d = programs[item[0]];
    let confidence = Math.round((item[1] / maxScore) * 100);

    output += `
    <div class="result-card">
      ${index === 0 ? `<div class="badge">⭐ Best Match</div>` : ""}
      <h3>${d.name}</h3>
      <p>${d.program}</p>
      <p><b>${confidence}% Match</b></p>

      <h4>Why this fits</h4>
      <ul>${d.why.map(x => `<li>${x}</li>`).join("")}</ul>

      <h4>What you gain</h4>
      <ul>${d.gain.map(x => `<li>${x}</li>`).join("")}</ul>
    </div>
    `;
  });

  // ✅ ONLY ONE FORM
  output += `
  <div class="result-card form-card">
    <h3>📋 Capture Customer Details</h3>

    <input id="email" placeholder="Email">
    <input id="phone" placeholder="Phone">
    <input id="counsellor" placeholder="Counsellor">

    <select id="course">
      <option value="">Select Course</option>
      <option>SP Jain Product Management</option>
      <option>AI for Finance</option>
      <option>AI Leadership</option>
      <option>IIT-B IC Design</option>
      <option>IIT-B Project Management</option>
      <option>IIM-K AI Strategy</option>
      <option>IIM-K AI Product</option>
      <option>IIM-Indore Analytics</option>
      <option>IIM-Indore GM</option>
      <option>XLRI CXO</option>
    </select>

    <select id="interest">
      <option value="">Select Interest</option>
      <option>Pitched Cross Program</option>
      <option>Re pitched same program</option>
      <option>Not interested</option>
    </select>

    <button onclick="submitData()">Submit</button>
    <p id="status"></p>
  </div>
  `;

  document.getElementById("results").innerHTML = output;
}

// SUBMIT
function submitData() {

  const email = emailEl().value;
  const phone = phoneEl().value;
  const counsellor = counsellorEl().value;
  const course = courseEl().value;
  const interest = interestEl().value;

  if (!email || !phone || !counsellor || !course || !interest) {
    alert("Fill all fields");
    return;
  }

  const data = new URLSearchParams();
  data.append("email", email);
  data.append("phone", phone);
  data.append("course", course);
  data.append("counsellor", counsellor);
  data.append("interest", interest);

  fetch("https://script.google.com/macros/s/AKfycbypvJnY98gHeLGl-HE2iFrFIOmPRgbNURTWPfStfDuaWX82piG2UOQFsvO3ViIoU9kM/exec", {
    method: "POST",
    mode: "no-cors",
    body: data
  });

  document.getElementById("status").innerText = "✅ Submitted";
}

// helpers
const emailEl = () => document.getElementById("email");
const phoneEl = () => document.getElementById("phone");
const counsellorEl = () => document.getElementById("counsellor");
const courseEl = () => document.getElementById("course");
const interestEl = () => document.getElementById("interest");

showStep(0);
