const STORAGE_KEY = "campusiq_local_profile";
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"profile":{},"skills":[],"projects":[],"resume":{},"answers":[]}');
state.resume ||= {}; state.answers ||= [];
const questions = [
  "Tell me about yourself.",
  "Why do you want to work with our company?",
  "What is one challenge you overcame, and what did you learn?",
  "What are your greatest strengths?",
  "Where do you see yourself in five years?",
];
let questionIndex = 0;
let cameraStream = null;
let microphoneStream = null;
let recognition = null;

function speakQuestion() {
  const character = document.querySelector("#ai-character");
  const status = document.querySelector("#ai-status");
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(questions[questionIndex]);
  utterance.rate = 0.95;
  utterance.onstart = () => { character.classList.add("speaking"); status.textContent = "AI interviewer · Speaking"; };
  utterance.onend = () => { character.classList.remove("speaking"); status.textContent = "AI interviewer · Listening"; };
  speechSynthesis.speak(utterance);
}

const profileForm = document.querySelector("#profile-form");
const profileMessage = document.querySelector("#profile-message");
const skillForm = document.querySelector("#skill-form");
const projectForm = document.querySelector("#project-form");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}

function render() {
  const { profile, skills, projects, resume, answers } = state;
  document.querySelector("#full-name").value = profile.fullName || "";
  document.querySelector("#email").value = profile.email || "";
  document.querySelector("#register-number").value = profile.registerNumber || "";
  document.querySelector("#department").value = profile.department || "";
  document.querySelector("#summary-name").textContent = profile.fullName || "Add your details";
  document.querySelector("#summary-info").textContent = profile.department || "Your profile summary will appear here.";
  document.querySelector("#avatar").textContent = profile.fullName ? profile.fullName.trim().charAt(0).toUpperCase() : "?";
  document.querySelector("#skill-count").textContent = skills.length;
  document.querySelector("#project-count").textContent = projects.length;
  document.querySelector("#objective").value = resume.objective || "";
  document.querySelector("#achievement").value = resume.achievement || "";
  document.querySelector("#resume-name").textContent = profile.fullName || "Your name";
  document.querySelector("#resume-contact").textContent = [profile.email, profile.department].filter(Boolean).join(" · ") || "Email · Department";
  document.querySelector("#resume-objective").textContent = resume.objective || "Add an objective to begin.";
  document.querySelector("#resume-skills").textContent = skills.join(" · ") || "Add skills to your profile.";
  document.querySelector("#resume-achievement").textContent = resume.achievement || "Add one achievement that shows your impact.";
  const score = Math.min(100, (profile.fullName ? 25 : 0) + (profile.email ? 15 : 0) + (profile.department ? 10 : 0) + Math.min(skills.length * 8, 24) + Math.min(projects.length * 13, 26));
  document.querySelector("#readiness-score").textContent = score;
  document.querySelector(".progress-ring").style.setProperty("--score", `${score * 3.6}deg`);
  document.querySelector("#readiness-label").textContent = score >= 75 ? "Interview ready" : score >= 40 ? "Profile in progress" : "Start your profile";
  document.querySelector("#readiness-copy").textContent = score >= 75 ? "Great progress—practice your HR answers next." : "Add skills and projects to improve your profile.";
  document.querySelector("#metric-skills").textContent = skills.length;
  document.querySelector("#metric-projects").textContent = projects.length;
  document.querySelector("#metric-answers").textContent = answers.length;
  const totalWords = answers.reduce((count, item) => count + item.answer.trim().split(/\s+/).filter(Boolean).length, 0);
  const interviewScore = Math.min(100, answers.length * 20 + Math.min(totalWords, 120) / 2);
  document.querySelector("#hr-score").textContent = Math.round(interviewScore);
  document.querySelector("#answer-count").textContent = answers.length;
  document.querySelector("#word-count").textContent = totalWords;
  document.querySelector("#hr-tip").textContent = answers.length === 0 ? "Start with a confident introduction." : interviewScore >= 70 ? "Strong practice—keep answers concise and specific." : "Add examples with clear results to improve your score.";
  document.querySelector("#skill-list").innerHTML = skills.map((skill, index) => `<li>${escapeHtml(skill)} <button class="remove" data-skill="${index}" aria-label="Remove ${escapeHtml(skill)}">×</button></li>`).join("");
  document.querySelector("#project-list").innerHTML = projects.map((project, index) => `<li><div><strong>${escapeHtml(project.title)}</strong><p>${escapeHtml(project.description)}</p></div><button class="remove" data-project="${index}" aria-label="Remove ${escapeHtml(project.title)}">×</button></li>`).join("");
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!profileForm.reportValidity()) return;
  state.profile = {
    fullName: document.querySelector("#full-name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    registerNumber: document.querySelector("#register-number").value.trim(),
    department: document.querySelector("#department").value.trim(),
  };
  save(); render();
  profileMessage.textContent = "Profile saved in this browser.";
});

skillForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#skill-input");
  const skill = input.value.trim();
  if (!skill || state.skills.some((item) => item.toLowerCase() === skill.toLowerCase())) return;
  state.skills.push(skill); input.value = ""; save(); render();
});

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#project-title").value.trim();
  const description = document.querySelector("#project-description").value.trim();
  if (!title) return;
  state.projects.push({ title, description }); projectForm.reset(); save(); render();
});

document.querySelector("#resume-form").addEventListener("submit", (event) => {
  event.preventDefault();
  state.resume = { objective: document.querySelector("#objective").value.trim(), achievement: document.querySelector("#achievement").value.trim() };
  save(); render();
});

document.querySelector("#next-question").addEventListener("click", () => {
  questionIndex = (questionIndex + 1) % questions.length;
  document.querySelector("#interview-question").textContent = questions[questionIndex];
  document.querySelector("#interview-answer").value = "";
  document.querySelector("#interview-feedback").textContent = "";
  speakQuestion();
});

document.querySelector("#ask-question").addEventListener("click", speakQuestion);

document.querySelector("#save-answer").addEventListener("click", () => {
  const answer = document.querySelector("#interview-answer").value.trim();
  const feedback = document.querySelector("#interview-feedback");
  if (answer.length < 30) { feedback.textContent = "Add a little more detail—aim for at least 30 characters."; return; }
  state.answers.push({ question: questions[questionIndex], answer, savedAt: new Date().toISOString() });
  save(); render();
  feedback.textContent = "Answer saved. Good work—try the next question.";
});

document.querySelector("#start-camera").addEventListener("click", async () => {
  const feedback = document.querySelector("#interview-feedback");
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    document.querySelector("#camera-preview").srcObject = cameraStream;
    document.querySelector("#video-placeholder").hidden = true;
    document.querySelector("#start-camera").disabled = true;
    document.querySelector("#stop-camera").disabled = false;
    feedback.textContent = "Camera is on. Look at the camera and answer naturally.";
  } catch {
    feedback.textContent = "Camera access was not available. Allow camera permission and try again.";
  }
});

document.querySelector("#stop-camera").addEventListener("click", () => {
  cameraStream?.getTracks().forEach((track) => track.stop());
  cameraStream = null;
  document.querySelector("#camera-preview").srcObject = null;
  document.querySelector("#video-placeholder").hidden = false;
  document.querySelector("#start-camera").disabled = false;
  document.querySelector("#stop-camera").disabled = true;
  document.querySelector("#interview-feedback").textContent = "Camera stopped.";
});

document.querySelector("#start-mic").addEventListener("click", async () => {
  const feedback = document.querySelector("#interview-feedback");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  try {
    microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    document.querySelector("#start-mic").disabled = true;
    document.querySelector("#stop-mic").disabled = false;
    if (!SpeechRecognition) { feedback.textContent = "Microphone is on. Type your answer; speech-to-text is not supported in this browser."; return; }
    recognition = new SpeechRecognition(); recognition.continuous = true; recognition.interimResults = true; recognition.lang = "en-IN";
    recognition.onresult = (event) => { let text = ""; for (let i = event.resultIndex; i < event.results.length; i += 1) text += event.results[i][0].transcript; document.querySelector("#interview-answer").value = text; };
    recognition.onerror = () => { feedback.textContent = "Microphone is on. You can type your answer if transcription is unavailable."; };
    recognition.start(); feedback.textContent = "Listening… speak your answer clearly.";
  } catch { feedback.textContent = "Microphone access was not available. Allow microphone permission and try again."; }
});

document.querySelector("#stop-mic").addEventListener("click", () => {
  recognition?.stop(); recognition = null;
  microphoneStream?.getTracks().forEach((track) => track.stop()); microphoneStream = null;
  document.querySelector("#start-mic").disabled = false; document.querySelector("#stop-mic").disabled = true;
  document.querySelector("#interview-feedback").textContent = "Microphone stopped. Review your answer, then save it.";
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("button.remove");
  if (!button) return;
  if (button.dataset.skill !== undefined) state.skills.splice(Number(button.dataset.skill), 1);
  if (button.dataset.project !== undefined) state.projects.splice(Number(button.dataset.project), 1);
  save(); render();
});

render();
