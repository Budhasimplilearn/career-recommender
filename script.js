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

  //
  // ✅ ELIGIBLE
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
      <ul>${d.why.map(x => `<li>${x}</li>`).join("")}</ul>

      <h4>📈 What you gain</h4>
      <ul>${d.gain.map(x => `<li>${x}</li>`).join("")}</ul>

      <h4>📚 Program Highlights</h4>
      <ul>${d.programDetails.map(x => `<li>${x}</li>`).join("")}</ul>

    </div>
    `;
  });

  //
  // ⚠️ STRETCH
  //
  if (topStretch.length > 0) {

    output += `
    <h2 style="margin-top:30px;">⚠️ Stretch Options (Future Fit)</h2>
    <p style="color:#facc15;">
    These programs are strong fits but require more experience.
    </p>`;

    topStretch.forEach(item => {

      let d = programs[item[0]];

      output += `
      <div class="result-card">

        <h3>${d.name}</h3>
        <p><b>🎓 Program:</b> ${d.program}</p>

        <p style="color:#f87171;">
        Not eligible yet based on experience
        </p>

        <h4>💡 Why this is a future fit</h4>
        <ul>${d.why.map(x => `<li>${x}</li>`).join("")}</ul>

      </div>
      `;
    });
  }

  //
  // 📋 FINAL FORM (UPDATED)
  //
  output += `
  <div class="result-card" style="margin-top:30px;">
    <h3>📋 Capture Customer Details</h3>

    <input id="email" placeholder="Email" style="width:100%;margin:10px 0;padding:10px;">
    <input id="phone" placeholder="Phone Number" style="width:100%;margin:10px 0;padding:10px;">
    <input id="counsellor" placeholder="Counsellor Name" style="width:100%;margin:10px 0;padding:10px;">

    <select id="course" style="width:100%;margin:10px 0;padding:10px;">
      <option value="">Select Course Pitched</option>
      <option>SP Jain Product Management by SP Jain</option>
      <option>AI for Finance by SP Jain</option>
      <option>AI Augmented Leadership By SP Jain</option>
      <option>e Post Graduate Diploma in IC Design in Practice by IIT-B</option>
      <option>Certificate Course in Strategic Project Mgt by IIT-B</option>
      <option>AI for Business Strategy by IIM-K</option>
      <option>AI Product Development and innovation by IIM-K</option>
      <option>Business Analytics and AI for Managers by IIM-Indore</option>
      <option>Executive program in General Management by IIM Indore</option>
      <option>Exec Diploma for CXO by XLRI</option>
    </select>

    <select id="interest" style="width:100%;margin:10px 0;padding:10px;">
      <option value="">Select Interest Outcome</option>
      <option>Pitched Cross Program</option>
      <option>Re pitched same program</option>
      <option>Not interested for any program</option>
    </select>

    <button onclick="submitData()">Submit</button>

    <p id="status"></p>
  </div>
  `;

  document.getElementById("results").innerHTML = output;
}

//
// 🔹 SUBMIT FUNCTION (FINAL)
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

  fetch("https://script.google.com/macros/s/AKfycbypvJnY98gHeLGl-HE2iFrFIOmPRgbNURTWPfStfDuaWX82piG2UOQFsvO3ViIoU9kM/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      phone,
      course,
      counsellor,
      interest
    })
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
