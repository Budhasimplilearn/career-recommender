let currentStep = 0;
let answers = [];
let programs = {};

const steps = document.querySelectorAll(".step");

//
// 🔹 LOAD JSON
//
fetch("./programs.json")
  .then(res => res.json())
  .then(data => {
    programs = data;
  })
  .catch(err => console.error("JSON load error:", err));

//
// 🔹 SHOW STEP
//
function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });

  const progress = document.getElementById("progress");
  if (progress) {
    progress.style.width = (index / (steps.length - 1)) * 100 + "%";
  }
}

//
// 🔹 SELECT OPTION
//
function select(el, val) {
  const cards = el.parentElement.querySelectorAll(".card");
  cards.forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");

  answers[currentStep] = val;
}

//
// 🔹 NEXT STEP
//
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

//
// 🔹 PREVIOUS STEP
//
function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

//
// 🔹 EXPERIENCE CONVERSION
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
function checkEligibility(program) {
  let exp = getExperienceValue(answers[2]);
  let rules = program.eligibility;

  if (!rules) return true;

  return exp >= rules.minExperience && exp <= rules.maxExperience;
}

//
// 🔹 SCORING ENGINE
//
function calculateScore(program) {
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

  let eligible = [];
  let stretch = [];

  Object.keys(programs).forEach(key => {

    let program = programs[key];
    let score = calculateScore(program);

    if (checkEligibility(program)) {
      eligible.push([key, score]);
    } else {
      stretch.push([key, score]);
    }

  });

  eligible.sort((a, b) => b[1] - a[1]);
  stretch.sort((a, b) => b[1] - a[1]);

  let topEligible = eligible.slice(0, 3);
  let topStretch = stretch.slice(0, 2);

  let maxScore = Math.max(...eligible.map(x => x[1]), 1);

  let output = "";

  output += `<h2>🎯 Top Matches (Eligible)</h2>`;

  topEligible.forEach((item, index) => {

    let d = programs[item[0]];
    let confidence = Math.round((item[1] / maxScore) * 100);

    output += `
    <div class="result-card">
      ${index === 0 ? `<div class="badge">⭐ Best Match</div>` : ""}
      <h3>#${index + 1} ${d.name}</h3>
      <p><b>🎓 Program:</b> ${d.program}</p>

      <p><b>Match Score: ${confidence}%</b></p>

      <h4>💡 Why this fits you</h4>
      <ul>${d.why.map(x => `<li>${x}</li>`).join("")}</ul>

      <h4>📈 What you gain</h4>
      <ul>${d.gain.map(x => `<li>${x}</li>`).join("")}</ul>

      <h4>📚 Program Highlights</h4>
      <ul>${d.programDetails.map(x => `<li>${x}</li>`).join("")}</ul>
    </div>
    `;
  });

  if (topStretch.length > 0) {

    output += `<h2>⚠️ Stretch Options</h2>`;

    topStretch.forEach(item => {
      let d = programs[item[0]];

      output += `
      <div class="result-card">
        <h3>${d.name}</h3>
        <p>Not eligible yet</p>
      </div>
      `;
    });
  }

  // ✅ FINAL FORM (UPDATED)
  output += `
  <div class="result-card">
    <h3>📋 Capture Customer Details</h3>

    <input id="email" placeholder="Email"><br><br>
    <input id="phone" placeholder="Phone"><br><br>
    <input id="counsellor" placeholder="Counsellor"><br><br>

    <select id="course">
      <option value="">Select Course</option>
      <option>SP Jain Product Management by SP Jain</option>
      <option>AI for Finance by SP Jain</option>
      <option>AI Augmented Leadership By SP Jain</option>
      <option>IIT-B IC Design</option>
      <option>IIT-B Strategic Project Management</option>
      <option>IIM-K AI for Business Strategy</option>
      <option>IIM-K AI for Product Development & Innovation</option>
      <option>IIM-Indore Business Analytics</option>
      <option>IIM-Indore GM</option>
      <option>XLRI CXO</option>
    </select><br><br>

    <select id="interest">
      <option value="">Select Interest</option>
      <option>Pitched Cross Program</option>
      <option>Re pitched same program</option>
      <option>Not interested for any program</option>
    </select><br><br>

    <button onclick="submitData()">Submit</button>
    <p id="status"></p>
  </div>
  `;

  document.getElementById("results").innerHTML = output;
}

//
// 🔹 FINAL FIXED SUBMIT FUNCTION
//
function submitData() {

  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const counsellor = document.getElementById("counsellor").value;
  const course = document.getElementById("course").value;
  const interest = document.getElementById("interest").value;

  if (!email || !phone || !counsellor || !course || !interest) {
    alert("Please fill all fields");
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
    body: data
  })
  .then(() => {
    document.getElementById("status").innerText = "✅ Submitted successfully!";
  })
  .catch(() => {
    document.getElementById("status").innerText = "❌ Submission failed";
  });
}

//
// 🔹 INIT
//
showStep(0);
