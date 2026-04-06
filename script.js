let currentStep = 0;
let answers = [];

const steps = document.querySelectorAll(".step");

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

// SINGLE SELECT
function select(el, val) {

  const cards = el.parentElement.querySelectorAll(".card");

  cards.forEach(c => c.classList.remove("selected"));

  el.classList.add("selected");

  answers[currentStep] = val;
}

// NEXT STEP (FIXED)
function nextStep() {

  if (!answers[currentStep]) {
    alert("Please select an option");
    return;
  }

  // generate results BEFORE going to result step
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

// RESULTS
function generateResults() {

  let scores = {
    ai_product: 0,
    analytics: 0,
    cxo: 0,
    project: 0,
    finance: 0,
    ic: 0
  };

  if (answers.includes("ai")) scores.ai_product += 3;
  if (answers.includes("product_mgmt")) scores.ai_product += 3;
  if (answers.includes("strategy")) scores.cxo += 3;
  if (answers.includes("project")) scores.project += 3;
  if (answers.includes("finance_int") || answers.includes("finance")) scores.finance += 3;
  if (answers.includes("ic")) scores.ic += 5;
  if (answers.includes("lead") || answers.includes("cxo_int")) scores.cxo += 2;

  let top = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  let details = {

    ai_product: {
      name: "AI Product Development",
      why: [
        "Strong interest in AI and product thinking",
        "Alignment with building AI-driven solutions"
      ],
      gain: [
        "End-to-end AI product lifecycle expertise",
        "High-demand AI roles",
        "Leadership in innovation"
      ]
    },

    cxo: {
      name: "AI Business Strategy / CXO",
      why: [
        "Strong leadership and strategic mindset",
        "Focus on business transformation"
      ],
      gain: [
        "Enterprise leadership roles",
        "Strategic decision-making",
        "AI-driven transformation capability"
      ]
    },

    project: {
      name: "Strategic Project Management",
      why: [
        "Preference for structured execution",
        "Interest in managing complex initiatives"
      ],
      gain: [
        "Program leadership skills",
        "Execution excellence",
        "Cross-functional ownership"
      ]
    },

    finance: {
      name: "Finance Leadership with AI",
      why: [
        "Strong finance alignment",
        "Interest in business value creation"
      ],
      gain: [
        "Financial strategy leadership",
        "AI-driven financial insights",
        "Enterprise impact roles"
      ]
    },

    ic: {
      name: "IC Design / Semiconductor",
      why: [
        "Strong technical inclination",
        "Interest in hardware and chip design"
      ],
      gain: [
        "Semiconductor expertise",
        "Core engineering roles",
        "Global opportunities"
      ]
    },

    analytics: {
      name: "Business Analytics & AI",
      why: [
        "Data-driven mindset",
        "Analytical thinking"
      ],
      gain: [
        "Analytics roles",
        "AI strategy exposure",
        "High-growth domain"
      ]
    }
  };

  let output = "";

  top.forEach((item, i) => {

    let d = details[item[0]];
    if (!d) return;

    output += `
      <div class="result-card">
        <h3>#${i + 1} ${d.name}</h3>

        <h4>💡 Why this fits you</h4>
        <ul>${d.why.map(w => `<li>${w}</li>`).join("")}</ul>

        <h4>📈 What you gain</h4>
        <ul>${d.gain.map(g => `<li>${g}</li>`).join("")}</ul>
      </div>
    `;
  });

  document.getElementById("results").innerHTML = output;
}

// INIT
showStep(0);
