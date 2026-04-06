let currentStep=0;
let answers=[];

const steps=document.querySelectorAll(".step");

function showStep(i){
steps.forEach((s,index)=>s.classList.toggle("active",index===i));
}

function select(el,val){
el.classList.toggle("selected");
if(answers.includes(val)){
answers=answers.filter(a=>a!==val);
}else{
answers.push(val);
}
}

function nextStep(){
currentStep++;
if(currentStep===steps.length-1) generateResults();
showStep(currentStep);
}

function prevStep(){
currentStep--;
showStep(currentStep);
}

function generateResults(){

let scores={
ai_product:0,
analytics:0,
cxo:0,
project:0,
finance:0,
ic:0
};

// logic
if(answers.includes("ai")) scores.ai_product+=3;
if(answers.includes("product_mgmt")) scores.ai_product+=3;
if(answers.includes("strategy")) scores.cxo+=3;
if(answers.includes("project")) scores.project+=3;
if(answers.includes("finance_int")) scores.finance+=3;
if(answers.includes("ic")) scores.ic+=5;

// ranking
let top=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,3);

let details={
ai_product:{
name:"AI Product Development",
why:"You have strong alignment with AI + product thinking and innovation mindset.",
gain:"You will learn end-to-end AI product lifecycle, roadmap building and scaling AI solutions."
},
cxo:{
name:"CXO Leadership",
why:"Your leadership + strategy orientation fits senior business roles.",
gain:"You will transition into enterprise-level strategic leadership roles."
},
project:{
name:"Strategic Project Management",
why:"You show inclination towards structured execution and leadership.",
gain:"You gain skills in risk governance, AI-driven decision making and execution."
},
finance:{
name:"Finance Leadership",
why:"Strong alignment with finance + strategic thinking.",
gain:"You will drive financial strategy and enterprise value creation."
},
ic:{
name:"IC Design",
why:"Strong technical inclination toward hardware and electronics.",
gain:"You will build deep semiconductor and chip design expertise."
}
};

let output="";

top.forEach((t,i)=>{
let d=details[t[0]];
output+=`
<div class="result-card">
<h3>#${i+1} ${d.name}</h3>
<p><b>Why this fits you:</b> ${d.why}</p>
<p><b>What you gain:</b> ${d.gain}</p>
</div>`;
});

document.getElementById("results").innerHTML=output;

}

showStep(0);
