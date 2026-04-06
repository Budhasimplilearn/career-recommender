let currentStep = 0;
let answers = [];

const steps = document.querySelectorAll(".step");

function showStep(index) {
  steps.forEach((s, i) => {
    s.classList.toggle("active", i === index);
  });

  document.getElementById("progress").style.width =
    ((index) / (steps.length - 1)) * 100 + "%";
}

function select(el, value) {
  el.classList.toggle("selected");
  if (answers.includes(value)) {
    answers = answers.filter(a => a !== value);
  } else {
    answers.push(value);
  }
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    if (currentStep === steps.length - 1) generateResults();
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function generateResults() {

  let scores = {
    project: 0,
    ic: 0,
    analytics: 0,
    cxo: 0,
    ai_leader: 0,
    ai_strategy: 0,
    gm: 0,
    ai_product: 0,
    product: 0,
    finance: 0
  };

  // Scoring logic
  if (answers.includes("ai")) {
    scores.ai_product += 3;
    scores.ai_strategy += 2;
  }

  if (answers.includes("data")) {
    scores.analytics += 3;
  }

  if (answers.includes("product")) {
    scores.product += 3;
    scores.ai_product += 2;
  }

  if (answers.includes("strategy")) {
    scores.cxo += 3;
    scores.project += 2;
  }

  if (answers.includes("leadership")) {
    scores.cxo += 3;
    scores.ai_leader += 2;
  }

  if (answers.includes("finance")) {
    scores.finance += 3;
  }

  // Sort top 3
  let top = Object.entries(scores)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3);

  const mapping = {
    project: "Strategic Project Management",
    ic: "IC Design",
    analytics: "Business Analytics & AI",
    cxo: "CXO Leadership",
    ai_leader: "AI-Augmented Leadership",
    ai_strategy: "AI Business Strategy",
    gm: "General Management",
    ai_product: "AI Product Development",
    product: "Product Management",
    finance: "Finance Leadership with AI"
  };

  let output = "";

  top.forEach(item => {
    output += `
      <div class="card">
        <h3>${mapping[item[0]]}</h3>
        <p><b>Why this fits you:</b> Based on your interest in ${answers.join(", ")}</p>
        <p><b>What you gain:</b> Strong career growth and future-ready skills</p>
      </div>
    `;
  });

  document.getElementById("results").innerHTML = output;
}

// init
showStep(0);