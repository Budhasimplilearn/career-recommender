body {
  background: linear-gradient(135deg,#1e1e2f,#2a2a40);
  font-family: sans-serif;
  color: white;
}

.container {
  max-width: 1100px;
  margin: auto;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.card {
  flex: 1 1 200px;
  padding: 15px;
  border-radius: 15px;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: 0.3s;
  text-align: center;
}

.card:hover {
  transform: translateY(-5px);
}

.card.selected {
  background: linear-gradient(135deg,#4f46e5,#7c3aed);
}

.step { display:none; }
.step.active { display:block; }

button {
  padding: 10px;
  background:#4f46e5;
  border:none;
}

.result-card {
  margin-top:20px;
  padding:20px;
  background:rgba(255,255,255,0.1);
  border-radius:15px;
}
