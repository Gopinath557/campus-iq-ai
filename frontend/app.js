/* ══════════════════════════════════════════════════════════════
   CampusIQ AI — Dashboard Logic
   Profile, skills, projects, resume preview, inline interview.
   Uses ui.js for escHtml(), showToast(), createAtomAvatar().
   ══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const STORAGE_KEY = "campusiq_local_profile";
  const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"profile":{},"skills":[],"projects":[],"resume":{},"answers":[]}');
  state.resume ||= {};
  state.answers ||= [];

  const questions = [
    "Tell me about yourself.",
    "Why do you want to work with our company?",
    "What is one challenge you overcame, and what did you learn?",
    "What are your greatest strengths?",
    "Where do you see yourself in five years?",
  ];
  let questionIndex = 0;
  let microphoneStream = null;
  let recognition = null;

  /* ── DOM refs ── */
  const $ = (sel) => document.querySelector(sel);
  const profileForm = $("#profile-form");
  const skillForm = $("#skill-form");
  const projectForm = $("#project-form");

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  /* ── Render ── */
  function render() {
    const { profile, skills, projects, resume, answers } = state;

    /* Profile form */
    $("#full-name").value = profile.fullName || "";
    $("#email").value = profile.email || "";
    $("#register-number").value = profile.registerNumber || "";
    $("#department").value = profile.department || "";

    /* Summary */
    const initial = profile.fullName ? profile.fullName.trim().charAt(0).toUpperCase() : "?";
    const avatarEl = $("#avatar");
    avatarEl.textContent = initial;
    avatarEl.style.cssText = "background:var(--accent);color:#fff;display:grid;place-content:center;border-radius:50%;font-size:2rem;font-weight:700;width:96px;height:96px;flex-shrink:0";
    $("#summary-name").textContent = profile.fullName || "Add your details";
    $("#summary-info").textContent = profile.department || "Your profile summary will appear here.";
    $("#skill-count").textContent = skills.length;
    $("#project-count").textContent = projects.length;

    /* Resume preview */
    $("#objective").value = resume.objective || "";
    $("#achievement").value = resume.achievement || "";
    $("#resume-name").textContent = profile.fullName || "Your name";
    $("#resume-contact").textContent = [profile.email, profile.department].filter(Boolean).join(" · ") || "Email · Department";
    $("#resume-objective").textContent = resume.objective || "Add an objective to begin.";
    $("#resume-skills").textContent = skills.join(" · ") || "Add skills to your profile.";
    $("#resume-achievement").textContent = resume.achievement || "Add one achievement that shows your impact.";

    /* Readiness score */
    const score = Math.min(100, (profile.fullName ? 25 : 0) + (profile.email ? 15 : 0) + (profile.department ? 10 : 0) + Math.min(skills.length * 8, 24) + Math.min(projects.length * 13, 26));
    $("#readiness-score").textContent = score;
    $(".progress-ring").style.setProperty("--score", `${score * 3.6}deg`);
    $("#readiness-label").textContent = score >= 75 ? "Interview ready" : score >= 40 ? "Profile in progress" : "Start your profile";
    $("#readiness-copy").textContent = score >= 75 ? "Great progress — practice your HR answers next." : "Add skills and projects to improve your profile.";

    /* Metrics */
    $("#metric-skills").textContent = skills.length;
    $("#metric-projects").textContent = projects.length;
    $("#metric-answers").textContent = answers.length;

    /* Interview analytics */
    const totalWords = answers.reduce((c, a) => c + a.answer.trim().split(/\s+/).filter(Boolean).length, 0);
    const interviewScore = Math.min(100, answers.length * 20 + Math.min(totalWords, 120) / 2);
    $("#hr-score").textContent = Math.round(interviewScore);
    $("#answer-count").textContent = answers.length;
    $("#word-count").textContent = totalWords;
    $("#hr-tip").textContent = answers.length === 0 ? "Start with a confident introduction." : interviewScore >= 70 ? "Strong practice — keep answers concise." : "Add examples with clear results.";

    /* Skills list */
    const skillsEmpty = $("#skills-empty");
    if (skills.length === 0) {
      $("#skill-list").innerHTML = "";
      if (skillsEmpty) skillsEmpty.style.display = "";
    } else {
      if (skillsEmpty) skillsEmpty.style.display = "none";
      if (typeof SkillCatalog !== "undefined") {
        $("#skill-list").innerHTML = skills.map((s, i) =>
          `<li class="tag">${SkillCatalog.renderTag(s, i)}</li>`
        ).join("");
      } else {
        $("#skill-list").innerHTML = skills.map((s, i) =>
          `<li class="tag">${escHtml(s)} <button class="remove" data-skill="${i}" aria-label="Remove ${escHtml(s)}">&times;</button></li>`
        ).join("");
      }
    }

    /* Projects list */
    const projectsEmpty = $("#projects-empty");
    if (projects.length === 0) {
      $("#project-list").innerHTML = "";
      if (projectsEmpty) projectsEmpty.style.display = "";
    } else {
      if (projectsEmpty) projectsEmpty.style.display = "none";
      $("#project-list").innerHTML = projects.map((p, i) =>
        `<li class="project-item">
          <h4>${escHtml(p.title)}</h4>
          <p>${escHtml(p.description)}</p>
          <button class="remove" data-project="${i}" aria-label="Remove ${escHtml(p.title)}">&times;</button>
        </li>`
      ).join("");
    }
  }

  /* ── Profile Save ── */
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!profileForm.reportValidity()) return;
    state.profile = {
      fullName: $("#full-name").value.trim(),
      email: $("#email").value.trim(),
      registerNumber: $("#register-number").value.trim(),
      department: $("#department").value.trim(),
    };
    save();
    render();
    showToast("Profile saved!", "success");
  });

  /* ── Skill Add ── */
  const skillInput = $("#skill-input");
  const skillSuggestRow = $("#skill-suggest-row");
  const skillCategory = $("#skill-category");
  const skillDatalist = $("#skill-datalist");

  function renderSkillSuggestions() {
    if (!skillInput || !skillSuggestRow || typeof SkillCatalog === "undefined") return;
    const matches = SkillCatalog.suggest(skillInput.value, state.skills, 8);
    skillSuggestRow.innerHTML = matches.map(s => {
      const cat = SkillCatalog.getCategory(s.cat);
      return `<button type="button" class="skill-suggest-chip" data-skill="${s.name}" style="--chip-color:${s.color}"><span class="chip-logo" style="background:${s.color}">${escHtml(s.logo)}</span>${escHtml(s.name)}</button>`;
    }).join("");
    skillSuggestRow.querySelectorAll(".skill-suggest-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.skill;
        if (!state.skills.some(s => s.toLowerCase() === name.toLowerCase())) {
          state.skills.push(name);
          save(); render(); renderSkillSuggestions();
        }
        skillInput.value = "";
      });
    });
  }

  function updateDatalist() {
    if (!skillDatalist || typeof SkillCatalog === "undefined") return;
    skillDatalist.innerHTML = "";
    Object.keys(SkillCatalog.skills).forEach(k => {
      const opt = document.createElement("option");
      opt.value = k.replace(/\b\w/g, c => c.toUpperCase());
      skillDatalist.appendChild(opt);
    });
  }

  if (skillInput) {
    skillInput.addEventListener("input", renderSkillSuggestions);
    updateDatalist();
  }

  skillForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#skill-input");
    const skill = input.value.trim();
    if (!skill || state.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) return;
    state.skills.push(skill);
    input.value = "";
    if (skillSuggestRow) skillSuggestRow.innerHTML = "";
    save();
    render();
  });

  /* ── Project Add ── */
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = $("#project-title").value.trim();
    const description = $("#project-description").value.trim();
    if (!title) return;
    state.projects.push({ title, description });
    projectForm.reset();
    save();
    render();
  });

  /* ── Resume Form ── */
  $("#resume-form").addEventListener("submit", (e) => {
    e.preventDefault();
    state.resume = {
      objective: $("#objective").value.trim(),
      achievement: $("#achievement").value.trim(),
    };
    save();
    render();
    showToast("Resume content saved!", "success");
  });

  /* ── Interview: Speak Question ── */
  function speakQuestion() {
    const character = $("#home-hr-character");
    const status = $("#ai-status");
    speechSynthesis.cancel();
    character.className = "home-hr-character thinking";
    status.textContent = "AI interviewer \u00b7 Thinking\u2026";
    const utterance = new SpeechSynthesisUtterance(questions[questionIndex]);
    utterance.rate = 0.95;
    utterance.onstart = () => { character.className = "home-hr-character speaking"; status.textContent = "AI interviewer \u00b7 Speaking"; };
    utterance.onend = () => { character.className = "home-hr-character listening"; status.textContent = "AI interviewer \u00b7 Listening"; };
    setTimeout(() => speechSynthesis.speak(utterance), 600);
  }

  $("#next-question").addEventListener("click", () => {
    questionIndex = (questionIndex + 1) % questions.length;
    $("#interview-question").textContent = questions[questionIndex];
    $("#interview-answer").value = "";
    $("#interview-feedback").textContent = "";
    speakQuestion();
  });

  $("#ask-question").addEventListener("click", speakQuestion);

  /* ── Interview: Save Answer ── */
  $("#save-answer").addEventListener("click", () => {
    const answer = $("#interview-answer").value.trim();
    const feedback = $("#interview-feedback");
    if (answer.length < 30) { feedback.textContent = "Add a little more detail — aim for at least 30 characters."; feedback.className = "message error"; return; }
    state.answers.push({ question: questions[questionIndex], answer, savedAt: new Date().toISOString() });
    save();
    render();
    const character = $("#home-hr-character");
    const status = $("#ai-status");
    character.className = "home-hr-character speaking";
    status.textContent = "AI interviewer \u00b7 Impressed";
    feedback.textContent = "Answer saved! Good work — try the next question.";
    feedback.className = "message";
    showToast("Answer saved!", "success");
    setTimeout(() => { character.className = "home-hr-character listening"; status.textContent = "AI interviewer \u00b7 Listening"; }, 1500);
  });

  /* ── Interview: Microphone ── */
  $("#start-mic").addEventListener("click", async () => {
    const feedback = $("#interview-feedback");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    try {
      microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      $("#start-mic").disabled = true;
      $("#stop-mic").disabled = false;
      if (!SpeechRecognition) { feedback.textContent = "Microphone is on. Type your answer; speech-to-text is not supported in this browser."; feedback.className = "message"; return; }
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";
      recognition.onresult = (e) => { let t = ""; for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript; $("#interview-answer").value = t; };
      recognition.onerror = () => { feedback.textContent = "Microphone is on. You can type your answer."; feedback.className = "message"; };
      recognition.start();
      feedback.textContent = "Listening\u2026 speak your answer clearly.";
      feedback.className = "message";
    } catch { feedback.textContent = "Microphone access was not available."; feedback.className = "message error"; }
  });

  $("#stop-mic").addEventListener("click", () => {
    recognition?.stop();
    recognition = null;
    microphoneStream?.getTracks().forEach((t) => t.stop());
    microphoneStream = null;
    $("#start-mic").disabled = false;
    $("#stop-mic").disabled = true;
    $("#interview-feedback").textContent = "Microphone stopped. Review your answer, then save it.";
    $("#interview-feedback").className = "message";
  });

  /* ── Remove Items ── */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button.remove");
    if (!btn) return;
    if (btn.dataset.skill !== undefined) state.skills.splice(Number(btn.dataset.skill), 1);
    if (btn.dataset.project !== undefined) state.projects.splice(Number(btn.dataset.project), 1);
    save();
    render();
  });

  /* ── Clear All Data ── */
  $("#clear-data-btn")?.addEventListener("click", () => {
    if (!confirm("This will permanently delete all your local data (profile, skills, projects, resume, interview answers). This cannot be undone. Continue?")) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("campusiq_resume_data");
    localStorage.removeItem("campusiq_hr_answers");
    localStorage.removeItem("campusiq_hr_role");
    localStorage.removeItem("campusiq_aptitude_history");
    localStorage.removeItem("campusiq_token");
    localStorage.removeItem("campusiq_user");
    localStorage.removeItem("campusiq_token_expiry");
    if (typeof showToast === "function") showToast("All local data cleared.", "success");
    setTimeout(() => window.location.reload(), 600);
  });

  /* ── Brand Avatar ── */
  const brandAvatar = $("#brand-avatar");
  if (brandAvatar) {
    brandAvatar.innerHTML = createAtomAvatar("C", "sm");
    brandAvatar.style.display = "inline-flex";
    brandAvatar.style.verticalAlign = "middle";
    brandAvatar.style.marginRight = "4px";
  }

  /* ── Init ── */
  render();
})();
