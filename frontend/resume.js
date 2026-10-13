/* ── CampusIQ ATS Resume Builder ── */
const STORAGE_KEY = "campusiq_resume_data";
const API = "http://127.0.0.1:8000/api/v1";
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ── Default State ── */
const defaults = {
  personal: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "", summary: "" },
  education: [],
  skills: { technical: [], tools: [], soft: [], languages: [] },
  projects: [],
  experience: [],
  extras: { certs: [], awards: [], activities: [], volunteer: "" }
};

let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || JSON.parse(JSON.stringify(defaults));

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderPreview(); runATS(); }

/* ── Tabs ── */
$$(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".tab-btn").forEach(b => b.classList.remove("active"));
    $$(".form-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    $(`.form-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });
});

/* ── Personal Info ── */
["name", "email", "phone", "location", "linkedin", "github", "portfolio", "summary"].forEach(key => {
  const el = $(`#f-${key}`);
  if (!el) return;
  el.value = state.personal[key] || "";
  el.addEventListener("input", () => { state.personal[key] = el.value; save(); });
});

/* ── Tag Input Helper ── */
function setupTagInput(wrapId, inputId, stateKey, subKey) {
  const wrap = $(`#${wrapId}`);
  const input = $(`#${inputId}`);
  if (!wrap || !input) return;

  function render() {
    const tags = subKey ? (state[stateKey] || {})[subKey] || [] : state[stateKey] || [];
    wrap.querySelectorAll(".tag, .skill-tag").forEach(t => t.remove());
    tags.forEach((tag, i) => {
      const el = document.createElement("span");
      el.className = "tag";
      if (typeof SkillCatalog !== "undefined" && stateKey === "skills") {
        el.innerHTML = SkillCatalog.renderTag(tag, i);
      } else {
        el.innerHTML = `${esc(tag)} <button type="button" data-idx="${i}">&times;</button>`;
      }
      wrap.insertBefore(el, input);
    });
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = input.value.trim().replace(",", "");
      if (!val) return;
      const arr = subKey ? (state[stateKey] || (state[stateKey] = {}))[subKey] : state[stateKey];
      if (!arr.includes(val)) { arr.push(val); save(); render(); }
      input.value = "";
    }
    if (e.key === "Backspace" && !input.value) {
      const arr = subKey ? (state[stateKey] || {})[subKey] : state[stateKey];
      if (arr.length) { arr.pop(); save(); render(); }
    }
  });

  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-idx]") || e.target.closest("button[data-skill]");
    if (!btn) return;
    const idx = btn.dataset.idx !== undefined ? btn.dataset.idx : btn.dataset.skill;
    const arr = subKey ? (state[stateKey] || {})[subKey] : state[stateKey];
    arr.splice(Number(idx), 1);
    save(); render();
  });

  wrap.addEventListener("click", () => input.focus());
  render();
}

setupTagInput("tech-skills-wrap", "tech-skill-input", "skills", "technical");
setupTagInput("tools-skills-wrap", "tools-skill-input", "skills", "tools");
setupTagInput("soft-skills-wrap", "soft-skill-input", "skills", "soft");
setupTagInput("lang-skills-wrap", "lang-skill-input", "skills", "languages");
setupTagInput("certs-wrap", "cert-input", "extras", "certs");
setupTagInput("awards-wrap", "award-input", "extras", "awards");
setupTagInput("activities-wrap", "activity-input", "extras", "activities");

/* ── Skill Suggestions ── */
const suggestedTech = ["Python", "Java", "JavaScript", "TypeScript", "C++", "C", "SQL", "HTML", "CSS", "React", "Node.js", "Django", "FastAPI", "Flask", "Spring Boot", "MongoDB", "PostgreSQL", "MySQL", "Git", "Docker", "Kubernetes", "AWS", "Linux", "REST API", "GraphQL", "Machine Learning", "Data Structures", "Algorithms"];
function renderSuggestions() {
  const box = $("#tech-suggest");
  if (!box) return;
  box.innerHTML = "";
  const existing = state.skills.technical || [];
  suggestedTech.filter(s => !existing.includes(s)).slice(0, 8).forEach(s => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "+ " + s;
    btn.addEventListener("click", () => {
      state.skills.technical.push(s);
      save();
      renderSuggestions();
      setupTagInput("tech-skills-wrap", "tech-skill-input", "skills", "technical");
    });
    box.appendChild(btn);
  });
}
renderSuggestions();

/* ── Education Entries ── */
const eduContainer = $("#education-entries");
function renderEducation() {
  eduContainer.innerHTML = "";
  state.education.forEach((edu, i) => {
    const card = document.createElement("div");
    card.className = "entry-card";
    card.innerHTML = `
      <div class="entry-header"><h4>Education #${i + 1}</h4><button class="entry-remove" data-edu="${i}">Remove</button></div>
      <div class="form-row">
        <div class="form-group"><label>Institution *</label><input data-edu="${i}" data-field="institution" value="${esc(edu.institution || "")}" placeholder="e.g. Anna University" /></div>
        <div class="form-group"><label>Degree *</label><input data-edu="${i}" data-field="degree" value="${esc(edu.degree || "")}" placeholder="e.g. B.Tech Computer Science" /></div>
      </div>
      <div class="form-row-3">
        <div class="form-group"><label>CGPA / Percentage</label><input data-edu="${i}" data-field="cgpa" value="${esc(edu.cgpa || "")}" placeholder="e.g. 8.5 / 10" /></div>
        <div class="form-group"><label>Start Year</label><input data-edu="${i}" data-field="startYear" value="${esc(edu.startYear || "")}" placeholder="2022" /></div>
        <div class="form-group"><label>End Year</label><input data-edu="${i}" data-field="endYear" value="${esc(edu.endYear || "")}" placeholder="2026" /></div>
      </div>
      <div class="form-group"><label>Key Coursework</label><input data-edu="${i}" data-field="coursework" value="${esc(edu.coursework || "")}" placeholder="e.g. Data Structures, OS, DBMS, Computer Networks" /><div class="hint">Separate with commas</div></div>
    `;
    eduContainer.appendChild(card);
  });
}
eduContainer.addEventListener("input", (e) => {
  const { edu, field } = e.target.dataset;
  if (edu !== undefined && field) { state.education[Number(edu)][field] = e.target.value; save(); }
});
eduContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-edu]");
  if (btn && btn.classList.contains("entry-remove")) {
    state.education.splice(Number(btn.dataset.edu), 1);
    save(); renderEducation();
  }
});
$("#add-education").addEventListener("click", () => {
  state.education.push({ institution: "", degree: "", cgpa: "", startYear: "", endYear: "", coursework: "" });
  save(); renderEducation();
});

/* ── Project Entries ── */
const projContainer = $("#project-entries");
function renderProjects() {
  projContainer.innerHTML = "";
  state.projects.forEach((proj, i) => {
    const card = document.createElement("div");
    card.className = "entry-card";
    card.innerHTML = `
      <div class="entry-header"><h4>Project #${i + 1}</h4><button class="entry-remove" data-proj="${i}">Remove</button></div>
      <div class="form-row">
        <div class="form-group"><label>Project Title *</label><input data-proj="${i}" data-field="title" value="${esc(proj.title || "")}" placeholder="e.g. CampusIQ AI Platform" /></div>
        <div class="form-group"><label>Technologies Used</label><input data-proj="${i}" data-field="technologies" value="${esc(proj.technologies || "")}" placeholder="e.g. React, FastAPI, MySQL" /></div>
      </div>
      <div class="form-group"><label>Description *</label><textarea data-proj="${i}" data-field="description" placeholder="Describe what you built, the problem it solves, and your role. Use action verbs: Built, Designed, Implemented, Led.">${esc(proj.description || "")}</textarea><div class="hint">Start with action verbs. Quantify impact where possible.</div></div>
      <div class="form-row">
        <div class="form-group"><label>GitHub URL</label><input data-proj="${i}" data-field="github_url" value="${esc(proj.github_url || "")}" placeholder="https://github.com/..." /></div>
        <div class="form-group"><label>Live Demo URL</label><input data-proj="${i}" data-field="live_demo_url" value="${esc(proj.live_demo_url || "")}" placeholder="https://..." /></div>
      </div>
    `;
    projContainer.appendChild(card);
  });
}
projContainer.addEventListener("input", (e) => {
  const { proj, field } = e.target.dataset;
  if (proj !== undefined && field) { state.projects[Number(proj)][field] = e.target.value; save(); }
});
projContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-proj]");
  if (btn && btn.classList.contains("entry-remove")) {
    state.projects.splice(Number(btn.dataset.proj), 1);
    save(); renderProjects();
  }
});
$("#add-project").addEventListener("click", () => {
  state.projects.push({ title: "", technologies: "", description: "", github_url: "", live_demo_url: "" });
  save(); renderProjects();
});

/* ── Experience Entries ── */
const expContainer = $("#experience-entries");
function renderExperience() {
  expContainer.innerHTML = "";
  state.experience.forEach((exp, i) => {
    const card = document.createElement("div");
    card.className = "entry-card";
    card.innerHTML = `
      <div class="entry-header"><h4>Experience #${i + 1}</h4><button class="entry-remove" data-exp="${i}">Remove</button></div>
      <div class="form-row">
        <div class="form-group"><label>Company / Organization *</label><input data-exp="${i}" data-field="company" value="${esc(exp.company || "")}" placeholder="e.g. TCS" /></div>
        <div class="form-group"><label>Job Title *</label><input data-exp="${i}" data-field="jobTitle" value="${esc(exp.jobTitle || "")}" placeholder="e.g. Software Engineering Intern" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Start Date</label><input data-exp="${i}" data-field="startDate" type="month" value="${esc(exp.startDate || "")}" /></div>
        <div class="form-group"><label>End Date</label><input data-exp="${i}" data-field="endDate" type="month" value="${esc(exp.endDate || "")}" /><div class="hint">Leave blank if current</div></div>
      </div>
      <div class="form-group"><label>Description</label><textarea data-exp="${i}" data-field="description" placeholder="Describe your role, responsibilities, and impact. Use action verbs: Developed, Collaborated, Automated, Optimized.">${esc(exp.description || "")}</textarea><div class="hint">Quantify results: "Reduced load time by 40%", "Served 500+ users"</div></div>
    `;
    expContainer.appendChild(card);
  });
}
expContainer.addEventListener("input", (e) => {
  const { exp, field } = e.target.dataset;
  if (exp !== undefined && field) { state.experience[Number(exp)][field] = e.target.value; save(); }
});
expContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-exp]");
  if (btn && btn.classList.contains("entry-remove")) {
    state.experience.splice(Number(btn.dataset.exp), 1);
    save(); renderExperience();
  }
});
$("#add-experience").addEventListener("click", () => {
  state.experience.push({ company: "", jobTitle: "", startDate: "", endDate: "", description: "" });
  save(); renderExperience();
});

/* ── Volunteer ── */
const volEl = $("#f-volunteer");
if (volEl) {
  volEl.value = state.extras.volunteer || "";
  volEl.addEventListener("input", () => { state.extras.volunteer = volEl.value; save(); });
}

/* ── ATS Scoring Engine ── */
const ATS_KEYWORDS = [
  "Python", "Java", "JavaScript", "React", "Node.js", "SQL", "Git", "Docker", "AWS",
  "API", "REST", "Database", "HTML", "CSS", "TypeScript", "MongoDB", "Linux",
  "Agile", "Scrum", "CI/CD", "Machine Learning", "Data Structures", "Algorithms",
  "Problem Solving", "Communication", "Team", "Leadership", "Project"
];

const ACTION_VERBS = [
  "Built", "Designed", "Implemented", "Developed", "Created", "Led", "Managed",
  "Optimized", "Automated", "Deployed", "Architected", "Integrated", "Collaborated",
  "Analyzed", "Improved", "Reduced", "Increased", "Delivered", "Launched", "Scaled"
];

function runATS() {
  const checks = [];
  let total = 0, passed = 0;

  function addCheck(label, detail, pass) {
    checks.push({ label, detail, pass });
    total += 10;
    if (pass) passed += 10;
  }

  /* 1. Contact Info */
  const hasContact = state.personal.name && state.personal.email && state.personal.phone;
  addCheck("Contact Information", hasContact ? "Name, email, phone provided" : "Add name, email, and phone", hasContact);

  /* 2. Professional Summary */
  const summaryLen = (state.personal.summary || "").trim().length;
  const hasSummary = summaryLen >= 50;
  addCheck("Professional Summary", hasSummary ? `${summaryLen} characters` : `${summaryLen}/50 minimum characters`, hasSummary);

  /* 3. Education */
  const hasEdu = state.education.length > 0 && state.education.some(e => e.institution && e.degree);
  addCheck("Education", hasEdu ? `${state.education.length} entry(ies)` : "Add at least one education entry", hasEdu);

  /* 4. Skills */
  const totalSkills = Object.values(state.skills).flat().length;
  const hasSkills = totalSkills >= 5;
  addCheck("Skills Section", hasSkills ? `${totalSkills} skills listed` : `${totalSkills}/5 minimum skills`, hasSkills);

  /* 5. Projects */
  const hasProjects = state.projects.length >= 1 && state.projects.some(p => p.title && p.description);
  addCheck("Projects", hasProjects ? `${state.projects.length} project(s)` : "Add at least one project with description", hasProjects);

  /* 6. Action Verbs */
  const allText = [state.personal.summary, ...state.projects.map(p => p.description), ...state.experience.map(e => e.description)].join(" ");
  const foundVerbs = ACTION_VERBS.filter(v => allText.includes(v));
  const hasVerbs = foundVerbs.length >= 3;
  addCheck("Action Verbs", hasVerbs ? `${foundVerbs.length} found: ${foundVerbs.slice(0, 3).join(", ")}` : `Only ${foundVerbs.length} found. Use more action verbs.`, hasVerbs);

  /* 7. Quantifiable Results */
  const hasNumbers = /\d+%|\d+\+|\d+ (users|students|members|projects|days|hours|pages)/i.test(allText);
  addCheck("Quantifiable Results", hasNumbers ? "Numbers found in descriptions" : "Add numbers/metrics to your descriptions", hasNumbers);

  /* 8. Links */
  const hasLinks = state.personal.linkedin || state.personal.github || state.projects.some(p => p.github_url || p.live_demo_url);
  addCheck("Professional Links", hasLinks ? "LinkedIn/GitHub/project links found" : "Add LinkedIn, GitHub, or project links", hasLinks);

  /* 9. Experience */
  const hasExp = state.experience.length > 0;
  addCheck("Work Experience", hasExp ? `${state.experience.length} entries` : "Add internships or work experience", hasExp);

  /* 10. Extras */
  const hasExtras = state.extras.certs.length > 0 || state.extras.awards.length > 0 || state.extras.activities.length > 0;
  addCheck("Certifications & Activities", hasExtras ? "Extras section populated" : "Add certifications, awards, or activities", hasExtras);

  /* Render ATS Sections */
  const atsSections = $("#ats-sections");
  atsSections.innerHTML = checks.map(c => `
    <div class="ats-section">
      <div class="ats-icon ${c.pass ? "pass" : c.detail.includes("minimum") || c.detail.includes("Only") ? "warn" : "fail"}">${c.pass ? "✓" : c.detail.includes("minimum") || c.detail.includes("Only") ? "!" : "✗"}</div>
      <div class="ats-info"><div class="ats-label">${c.label}</div><div class="ats-detail">${c.detail}</div></div>
      <span class="ats-badge ${c.pass ? "pass" : c.detail.includes("minimum") || c.detail.includes("Only") ? "warn" : "fail"}">${c.pass ? "Pass" : "Fix"}</span>
    </div>
  `).join("");

  /* Score */
  const score = Math.min(100, Math.round((passed / total) * 100));
  $("#ats-score").textContent = score;
  const ring = $("#ats-ring");
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (score / 100) * circumference;
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = offset;
  ring.style.stroke = score >= 80 ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171";

  /* Keywords */
  const allWords = allText.toLowerCase();
  const kwList = $("#kw-list");
  kwList.innerHTML = ATS_KEYWORDS.map(kw => {
    const found = allWords.includes(kw.toLowerCase());
    return `<span class="kw-tag ${found ? "found" : "missing"}">${found ? "✓" : "○"} ${kw}</span>`;
  }).join("");
}

/* ── Resume Preview Renderer ── */
function renderPreview() {
  const p = state.personal;
  const paper = $("#resume-paper");

  /* Contact line */
  const contactParts = [p.email, p.phone, p.location, p.linkedin, p.github, p.portfolio].filter(Boolean);

  /* Education */
  const eduHtml = state.education.filter(e => e.institution).map(e => `
    <div class="entry-row"><h3>${esc(e.institution)}${e.degree ? ` — ${esc(e.degree)}` : ""}</h3><span class="sub">${[e.startYear, e.endYear].filter(Boolean).join(" – ")}</span></div>
    ${e.cgpa ? `<p><strong>CGPA:</strong> ${esc(e.cgpa)}</p>` : ""}
    ${e.coursework ? `<p><strong>Coursework:</strong> ${esc(e.coursework)}</p>` : ""}
  `).join("");

  /* Skills */
  const allSkills = [];
  if (state.skills.technical.length) allSkills.push(`<strong>Technical:</strong> ${typeof SkillCatalog !== "undefined" ? state.skills.technical.map(SkillCatalog.renderResumeTag).join(" ") : esc(state.skills.technical.join(", "))}`);
  if (state.skills.tools.length) allSkills.push(`<strong>Tools & Platforms:</strong> ${typeof SkillCatalog !== "undefined" ? state.skills.tools.map(SkillCatalog.renderResumeTag).join(" ") : esc(state.skills.tools.join(", "))}`);
  if (state.skills.soft.length) allSkills.push(`<strong>Soft Skills:</strong> ${typeof SkillCatalog !== "undefined" ? state.skills.soft.map(SkillCatalog.renderResumeTag).join(" ") : esc(state.skills.soft.join(", "))}`);
  if (state.skills.languages.length) allSkills.push(`<strong>Languages:</strong> ${typeof SkillCatalog !== "undefined" ? state.skills.languages.map(SkillCatalog.renderResumeTag).join(" ") : esc(state.skills.languages.join(", "))}`);

  /* Projects */
  const projHtml = state.projects.filter(pr => pr.title).map(pr => `
    <div class="entry-row"><h3>${esc(pr.title)}</h3>${pr.technologies ? `<span class="sub">${esc(pr.technologies)}</span>` : ""}</div>
    ${pr.description ? `<p>${esc(pr.description)}</p>` : ""}
    ${pr.github_url || pr.live_demo_url ? `<p class="sub">${[pr.github_url ? `GitHub: ${esc(pr.github_url)}` : "", pr.live_demo_url ? `Live: ${esc(pr.live_demo_url)}` : ""].filter(Boolean).join(" | ")}</p>` : ""}
  `).join("");

  /* Experience */
  const expHtml = state.experience.filter(ex => ex.company).map(ex => `
    <div class="entry-row"><h3>${esc(ex.company)} — ${esc(ex.jobTitle)}</h3><span class="sub">${formatDate(ex.startDate)}${ex.endDate ? ` – ${formatDate(ex.endDate)}` : " – Present"}</span></div>
    ${ex.description ? `<p>${esc(ex.description)}</p>` : ""}
  `).join("");

  /* Extras */
  const extrasParts = [];
  if (state.extras.certs.length) extrasParts.push(`<p><strong>Certifications:</strong> ${state.extras.certs.map(esc).join("; ")}</p>`);
  if (state.extras.awards.length) extrasParts.push(`<p><strong>Achievements:</strong> ${state.extras.awards.map(esc).join("; ")}</p>`);
  if (state.extras.activities.length) extrasParts.push(`<p><strong>Activities:</strong> ${state.extras.activities.map(esc).join("; ")}</p>`);
  if (state.extras.volunteer) extrasParts.push(`<p><strong>Volunteer:</strong> ${esc(state.extras.volunteer)}</p>`);

  paper.innerHTML = `
    <h1>${esc(p.name) || '<span class="empty">Your Name</span>'}</h1>
    <p class="contact-line">${contactParts.length ? contactParts.map(esc).join(" | ") : '<span class="empty">Email | Phone | Location</span>'}</p>

    ${p.summary ? `<h2>Professional Summary</h2><p>${esc(p.summary)}</p>` : '<h2>Professional Summary</h2><p class="empty">Add a professional summary</p>'}

    <h2>Education</h2>
    ${eduHtml || '<p class="empty">Add your education history</p>'}

    <h2>Skills</h2>
    ${allSkills.length ? allSkills.map(s => `<p>${s}</p>`).join("") : '<p class="empty">Add your skills</p>'}

    ${projHtml ? `<h2>Projects</h2>${projHtml}` : ""}

    ${expHtml ? `<h2>Experience</h2>${expHtml}` : ""}

    ${extrasParts.length ? `<h2>Certifications & Activities</h2>${extrasParts.join("")}` : ""}
  `;
}

/* ── Export ── */
$("#btn-txt").addEventListener("click", () => {
  const text = $("#resume-paper").innerText;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(state.personal.name || "CampusIQ-Resume").replace(/\s+/g, "-")}-ATS-Resume.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

$("#btn-print").addEventListener("click", () => window.print());

/* ── Helpers ── */
/* Use shared escHtml from ui.js, fallback for safety */
const esc = window.escHtml || function(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, "&#96;");
};
function formatDate(d) { if (!d) return ""; const [y, m] = d.split("-"); const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; return `${months[Number(m) - 1]} ${y}`; }

/* ── Init ── */
renderEducation();
renderProjects();
renderExperience();
renderPreview();
runATS();
