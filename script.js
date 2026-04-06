let currentStep = 0;
let answers = [];

const steps = document.querySelectorAll(".step");

// SHOW STEP
function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });

  // progress bar (optional)
  const progress = document.getElementById("progress");
  if (progress) {
    progress.style.width = ((index) / (steps.length - 1)) * 100 + "%";
  }
}

// SELECT (ONLY ONE OPTION PER STEP)
function select(el, val) {

  // get all cards in current step
  const cards = el.parentElement.querySelectorAll(".card");

  // remove selection from all cards
  cards.forEach(c => c.classList.remove("selected"));

  // add selection to clicked card
  el.classList.add("selected");

  // store answer for this step
  answers[currentStep] = val;
}

// NEXT STEP
function nextStep() {

  // validation: must select option
  if (!answers[currentStep]) {
    alert("Please select an option before continuing.");
    return;
  }

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }

  // if last step → generate results
  if (currentStep === steps.length - 1) {
    generateResults();
  }
}

// PREVIOUS STEP
function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// GENERATE RESULTS
function generateResults() {

  let scores = {
    ai_product: 0,
    analytics: 0,
    cxo: 0,
    project: 0,
    finance: 0,
    ic: 0
  };

  // SCORING LOGIC
  if (answers.includes("ai")) {
    scores.ai_product += 3;
  }

  if (answers.includes("product_mgmt")) {
    scores.ai_product += 3;
  }

  if (answers.includes("strategy")) {
    scores.cxo += 3;
  }

  if (answers.includes("project")) {
    scores.project += 3;
  }

  if (answers.includes("finance_int") || answers.includes("finance")) {
    scores.finance += 3;
  }

  if (answers.includes("ic")) {
    scores.ic += 5;
  }

  if (answers.includes("data")) {
    scores.analytics += 3;
  }

  if (answers.includes("lead") || answers.includes("cxo_int")) {
    scores.cxo += 2;
  }

  // SORT TOP 3
  let top = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // PROGRAM DETAILS (ENHANCED)
  let details = {

    ai_product: {
      name: "AI Product Development & Innovation",
      why: [
        "You showed strong interest in AI and product-focused thinking",
        "Your profile aligns with building and scaling AI-driven solutions"
      ],
      gain: [
        "End-to-end AI product lifecycle expertise",
        "Ability to lead AI innovation initiatives",
        "High-demand roles in tech-driven organizations"
      ]
    },

    cxo: {
      name: "AI for Business Strategy / CXO Leadership",
      why: [
        "You show strong alignment with strategy and leadership roles",
        "Your choices indicate decision-making and business impact focus"
      ],
      gain: [
        "Transition into enterprise leadership roles",
        "Drive AI-led transformation in organizations",
        "Strategic decision-making at scale"
      ]
    },

    project: {
      name: "Strategic Project Management",
      why: [
        "You prefer structured execution and delivery ownership",
        "You align with managing complex business initiatives"
      ],
      gain: [
        "Expertise in managing large-scale programs",
        "Leadership in execution and governance",
        "Cross-functional project ownership"
      ]
    },

    finance: {
      name: "Finance Leadership with AI",
      why: [
        "Your interest in finance and strategy stands out",
        "You align with value creation and financial decision-making"
      ],
      gain: [
        "Drive enterprise financial strategy",
        "Leverage AI for financial insights",
        "Move into leadership finance roles"
      ]
    },

    ic: {
      name: "IC Design / Semiconductor Careers",
      why: [
        "Strong technical inclination toward hardware and chip design",
        "Interest aligns with deep engineering specialization"
      ],
      gain: [
        "High-demand semiconductor expertise",
        "Core engineering roles in VLSI/IC design",
        "Global career opportunities"
      ]
    },

    analytics: {
      name: "Business Analytics & AI",
      why: [
        "You show strong alignment with data-driven thinking",
        "Your interests indicate analytical problem-solving ability"
      ],
      gain: [
        "Data-driven decision-making skills",
        "Roles in analytics and AI strategy",
        "Strong growth in data-centric careers"
      ]
    }
  };

  let output = "";

  top.forEach((item, index) => {

    let d = details[item[0]];

    if (!d) return;

    output += `
      <div class="result-card">
        <h3>#${index + 1} ${d.name}</h3>

        <h4>💡 Why this fits you</h4>
        <ul>
          ${d.why.map(w => `<li>${w}</li>`).join("")}
        </ul>

        <h4>📈 What you gain</h4>
        <ul>
          ${d.gain.map(g => `<li>${g}</li>`).join("")}
        </ul>
      </div>
    `;
  });

  document.getElementById("results").innerHTML = output;
}

// INIT
showStep(0);
