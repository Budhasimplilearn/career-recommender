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

// SINGLE SELECT PER STEP
function select(el, val) {
  const cards = el.parentElement.querySelectorAll(".card");

  cards.forEach(c => c.classList.remove("selected"));

  el.classList.add("selected");

  answers[currentStep] = val;
}

// NEXT STEP (FIXED FLOW)
function nextStep() {

  if (!answers[currentStep]) {
    alert("Please select an option before continuing.");
    return;
  }

  // Generate results BEFORE entering last step
  if (currentStep === steps.length - 2) {
    generateResults();
  }

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

// PREVIOUS STEP
function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// GENERATE RESULTS (UPGRADED)
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
  if (answers.includes("ai")) scores.ai_product += 3;
  if (answers.includes("product_mgmt")) scores.ai_product += 3;
  if (answers.includes("strategy")) scores.cxo += 3;
  if (answers.includes("project")) scores.project += 3;
  if (answers.includes("finance_int") || answers.includes("finance")) scores.finance += 3;
  if (answers.includes("ic")) scores.ic += 5;
  if (answers.includes("data")) scores.analytics += 3;
  if (answers.includes("lead") || answers.includes("cxo_int")) scores.cxo += 2;

  // FIND MAX SCORE (for confidence %)
  const maxScore = Math.max(...Object.values(scores));

  // TOP 3
  let top = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // DEEP PROGRAM INTELLIGENCE
  const details = {

  ai_product: {
    name: "AI-Powered Product Development & Innovation",
    program: "IIM Kozhikode",
    why: [
      "You demonstrated strong alignment with AI, product thinking, and innovation-driven roles",
      "Your responses indicate interest in building solutions rather than only analyzing or managing",
      "You are suited for roles that sit at the intersection of technology, business, and user experience"
    ],
    gain: [
      "End-to-end capability to design, build, and scale AI-powered products",
      "Hands-on exposure to Generative AI, prompt engineering, and workflow automation",
      "Ability to translate business problems into AI product roadmaps",
      "Career pathways into AI Product Manager, Innovation Lead, or Startup roles"
    ],
    programDetails: [
      "Covers full AI product lifecycle: ideation → development → deployment → scaling :contentReference[oaicite:0]{index=0}",
      "Includes real-world case studies and a capstone project to apply concepts in business scenarios :contentReference[oaicite:1]{index=1}",
      "Focus on ethical AI, data management, and product strategy",
      "Designed for professionals moving into AI-driven product leadership roles"
    ]
  },

  cxo: {
    name: "AI for Business Strategy / CXO Leadership",
    program: "IIM Kozhikode / XLRI",
    why: [
      "Your responses show a strong inclination toward leadership, decision-making, and enterprise-level thinking",
      "You are not just looking for execution roles, but positions where you can influence business direction",
      "You align with transformation-focused roles where AI is used as a strategic lever"
    ],
    gain: [
      "Capability to design and lead AI-driven business transformation initiatives",
      "Skills to align AI strategy with organizational goals and long-term vision",
      "Transition pathway into CXO, Director, or Strategic Leadership roles",
      "Ability to lead cross-functional teams and high-impact initiatives"
    ],
    programDetails: [
      "Designed for senior professionals and leaders driving organizational change :contentReference[oaicite:2]{index=2}",
      "Focus on AI strategy, governance, and enterprise decision-making",
      "Includes case-based learning and real-world transformation scenarios",
      "Emphasis on building AI-led business models and leadership capability"
    ]
  },

  finance: {
    name: "Advanced Finance Leadership with AI",
    program: "SP Jain",
    why: [
      "Your inputs show strong alignment with finance, value creation, and strategic thinking",
      "You are suited for roles that combine financial expertise with data-driven decision-making",
      "You prefer high-impact roles that influence business outcomes"
    ],
    gain: [
      "Ability to drive enterprise financial strategy using AI and analytics",
      "Enhanced capability in financial planning, forecasting, and risk management",
      "Transition into senior finance leadership roles (FP&A, Strategy, CFO track)",
      "Stronger decision-making through integration of data and finance"
    ],
    programDetails: [
      "Focus on financial strategy combined with AI-driven insights :contentReference[oaicite:3]{index=3}",
      "Covers enterprise value creation, capital allocation, and financial transformation",
      "Exposure to real-world financial scenarios and strategic decision frameworks",
      "Designed for professionals moving into leadership finance roles"
    ]
  },

  project: {
    name: "Strategic Project Management",
    program: "IIT Bombay",
    why: [
      "You show a strong preference for structured execution, ownership, and delivering outcomes",
      "You are aligned with roles that require coordination across teams and functions",
      "You are suited for managing complex, high-stakes initiatives"
    ],
    gain: [
      "Ability to lead large-scale, cross-functional projects",
      "Expertise in risk management, governance, and execution frameworks",
      "Capability to align project execution with business strategy",
      "Career growth into Program Manager, Delivery Head, or Transformation Lead roles"
    ],
    programDetails: [
      "Focus on aligning projects with enterprise strategy and business impact :contentReference[oaicite:4]{index=4}",
      "Covers AI/ML-driven decision-making for risk, cost, and scheduling :contentReference[oaicite:5]{index=5}",
      "Includes real-world case studies and capstone project",
      "Designed for professionals moving from execution to strategic leadership"
    ]
  },

  ic: {
    name: "IC Design / Semiconductor Engineering",
    program: "IIT Bombay",
    why: [
      "You have a strong technical inclination toward core engineering and hardware systems",
      "Your interest aligns with deep specialization rather than generalist roles",
      "You are suited for high-complexity, high-skill engineering domains"
    ],
    gain: [
      "Deep expertise in semiconductor devices and integrated circuit design",
      "Career opportunities in VLSI, chip design, and hardware engineering",
      "Access to one of the fastest-growing global tech domains",
      "Strong technical differentiation in the job market"
    ],
    programDetails: [
      "Covers semiconductor fundamentals, CMOS devices, and IC architecture :contentReference[oaicite:6]{index=6}",
      "Includes digital and analog IC design, simulation, and fabrication concepts :contentReference[oaicite:7]{index=7}",
      "Graduate-level depth with strong engineering rigor",
      "Designed for learners aiming for core electronics and semiconductor careers"
    ]
  },

  analytics: {
    name: "Business Analytics & AI",
    program: "IIM Indore",
    why: [
      "You demonstrate strong analytical thinking and interest in data-driven decision-making",
      "You are suited for roles that combine business understanding with quantitative analysis",
      "You prefer solving problems using data and insights"
    ],
    gain: [
      "Ability to apply analytics and AI in real business scenarios",
      "Career transition into analytics, consulting, or data-driven roles",
      "Stronger problem-solving using data and machine learning techniques",
      "High-demand skillset across industries"
    ],
    programDetails: [
      "Covers data analysis, machine learning, and AI applications in business :contentReference[oaicite:8]{index=8}",
      "Includes case-based learning and hands-on projects",
      "Focus on applying analytics across marketing, finance, and operations",
      "Designed for managers integrating AI into decision-making"
    ]
  }

};
  
  let output = "";

  top.forEach((item, index) => {

    let d = details[item[0]];
    if (!d) return;

    let confidence = maxScore > 0 
      ? Math.round((item[1] / maxScore) * 100) 
      : 0;

    output += `
      <div class="result-card">

        <h3>#${index + 1} ${d.name}</h3>

        <p><b>🎓 Program:</b> ${d.program}</p>
        <p><b>📊 Match Score:</b> ${confidence}%</p>

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
