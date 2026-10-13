/* ══════════════════════════════════════════════════════════════
   CampusIQ AI — Virtual HR Interview (Role-Based Questions)
   ══════════════════════════════════════════════════════════════ */

const freeResources = {
  general: [
    { icon: "\uD83C\uDF93", color: "#6366f1", title: "CS50: Introduction to Computer Science", url: "https://cs50.harvard.edu", desc: "Free - Harvard" },
    { icon: "\uD83D\uDCDA", color: "#3b82f6", title: "MIT OpenCourseWare", url: "https://ocw.mit.edu", desc: "Free - MIT" },
    { icon: "\uD83C\uDFA8", color: "#8b5cf6", title: "freeCodeCamp", url: "https://www.freecodecamp.org", desc: "Free coding bootcamp" },
    { icon: "\uD83D\uDCCB", color: "#10b981", title: "LinkedIn Learning Free Courses", url: "https://www.linkedin.com/learning", desc: "Free with library card" },
  ],
  software: [
    { icon: "\uD83D\uDCBB", color: "#6366f1", title: "freeCodeCamp - JavaScript Algorithms", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", desc: "Free - Complete JS course" },
    { icon: "\uD83D\uDEE0\uFE0F", color: "#3b82f6", title: "The Odin Project", url: "https://www.theodinproject.com", desc: "Free full-stack curriculum" },
    { icon: "\uD83D\uDCD6", color: "#10b981", title: "Eloquent JavaScript (book)", url: "https://eloquentjavascript.net", desc: "Free online book" },
    { icon: "\u2699\uFE0F", color: "#8b5cf6", title: "GitHub Learning Lab", url: "https://lab.github.com", desc: "Free interactive courses" },
  ],
  data: [
    { icon: "\uD83D\uDCCA", color: "#6366f1", title: "Kaggle Micro Courses", url: "https://www.kaggle.com/learn", desc: "Free data science courses" },
    { icon: "\uD83C\uDFA8", color: "#3b82f6", title: "fast.ai - Practical Deep Learning", url: "https://course.fast.ai", desc: "Free ML course" },
    { icon: "\uD83D\uDCDA", color: "#10b981", title: "Google Data Analytics Certificate", url: "https://www.coursera.org/professional-certificates/google-data-analytics", desc: "Free to audit" },
    { icon: "\uD83D\uDCCB", color: "#8b5cf6", title: "Khan Academy - Statistics", url: "https://www.khanacademy.org/math/statistics-probability", desc: "Free - Full course" },
  ],
  web: [
    { icon: "\uD83C\uDF10", color: "#6366f1", title: "MDN Web Docs", url: "https://developer.mozilla.org", desc: "Free - The web developer reference" },
    { icon: "\uD83C\uDFA8", color: "#3b82f6", title: "freeCodeCamp - Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", desc: "Free certification" },
    { icon: "\uD83D\uDD27", color: "#10b981", title: "JavaScript.info", url: "https://javascript.info", desc: "Free modern JS tutorial" },
    { icon: "\u26A1", color: "#8b5cf6", title: "React Official Tutorial", url: "https://react.dev/learn", desc: "Free from Meta" },
  ],
  cyber: [
    { icon: "\uD83D\uDD10", color: "#6366f1", title: "TryHackMe", url: "https://tryhackme.com", desc: "Free cyber security paths" },
    { icon: "\uD83C\uDFAE", color: "#3b82f6", title: "Hack The Box Academy", url: "https://academy.hackthebox.com", desc: "Free intro modules" },
    { icon: "\uD83D\uDCDA", color: "#10b981", title: "Cybrary Free Courses", url: "https://www.cybrary.it", desc: "Free cybersecurity training" },
    { icon: "\uD83D\uDCCB", color: "#8b5cf6", title: "OWASP WebGoat", url: "https://owasp.org/www-project-webgoat/", desc: "Free hands-on lab" },
  ],
  cloud: [
    { icon: "\u2601\uFE0F", color: "#6366f1", title: "AWS Free Tier Training", url: "https://aws.amazon.com/free/", desc: "Free AWS hands-on labs" },
    { icon: "\uD83D\uDD35", color: "#3b82f6", title: "Kubernetes Official Tutorials", url: "https://kubernetes.io/docs/tutorials/", desc: "Free K8s learning" },
    { icon: "\uD83D\uDEE0\uFE0F", color: "#10b981", title: "Docker Getting Started", url: "https://docs.docker.com/get-started/", desc: "Free official guide" },
    { icon: "\u26A1", color: "#8b5cf6", title: "Terraform Getting Started", url: "https://developer.hashicorp.com/terraform/tutorials", desc: "Free HashiCorp learn" },
  ],
  ai: [
    { icon: "\uD83E\uDD16", color: "#6366f1", title: "CS229: Machine Learning (Stanford)", url: "https://cs229.stanford.edu", desc: "Free lecture notes & materials" },
    { icon: "\uD83C\uDFA8", color: "#3b82f6", title: "fast.ai - Practical Deep Learning", url: "https://course.fast.ai", desc: "Free top-down ML course" },
    { icon: "\uD83D\uDCDA", color: "#10b981", title: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course", desc: "Free NLP curriculum" },
    { icon: "\uD83D\uDCCB", color: "#8b5cf6", title: "Google AI Essentials", url: "https://www.coursera.org/learn/google-ai-essentials", desc: "Free to audit" },
  ],
  mobile: [
    { icon: "\uD83D\uDCF1", color: "#6366f1", title: "Android Basics (Google)", url: "https://developer.android.com/courses", desc: "Free official Android courses" },
    { icon: "\uD83D\uDCBB", color: "#3b82f6", title: "Swift Playgrounds (Apple)", url: "https://www.apple.com/swift/playgrounds/", desc: "Free for iPad/Mac" },
    { icon: "\uD83D\uDD27", color: "#10b981", title: "Flutter Official Codelabs", url: "https://docs.flutter.dev/codelabs", desc: "Free hands-on Flutter" },
    { icon: "\u26A1", color: "#8b5cf6", title: "React Native Tutorial", url: "https://reactnative.dev/docs/getting-started", desc: "Free from Meta" },
  ],
  uiux: [
    { icon: "\uD83C\uDFA8", color: "#6366f1", title: "Google UX Design Certificate", url: "https://www.coursera.org/professional-certificates/google-ux-design", desc: "Free to audit" },
    { icon: "\uD83D\uDCD6", color: "#3b82f6", title: "Nielsen Norman Group Articles", url: "https://www.nngroup.com/articles/", desc: "Free UX research library" },
    { icon: "\u270F\uFE0F", color: "#10b981", title: "Figma 101 Course", url: "https://help.figma.com/hc/en-us/articles/360039957914", desc: "Free official Figma learning" },
    { icon: "\uD83C\uDF1F", color: "#8b5cf6", title: "Laws of UX", url: "https://lawsofux.com", desc: "Free UX principles reference" },
  ],
  business: [
    { icon: "\uD83D\uDCCA", color: "#6366f1", title: "Excel Skills for Business (Coursera)", url: "https://www.coursera.org/skills/excel", desc: "Free to audit - Macquarie Uni" },
    { icon: "\uD83D\uDCDA", color: "#3b82f6", title: "SQL Tutorial (W3Schools)", url: "https://www.w3schools.com/sql/", desc: "Free SQL reference & practice" },
    { icon: "\uD83D\uDCCB", color: "#10b981", title: "Tableau Public Training", url: "https://public.tableau.com/en-us/s/resources", desc: "Free data visualization" },
    { icon: "\uD83C\uDF93", color: "#8b5cf6", title: "IIBA Free Resources", url: "https://www.iiba.org", desc: "Free BA body of knowledge" },
  ],
  marketing: [
    { icon: "\uD83D\uDCE3", color: "#6366f1", title: "Google Digital Garage", url: "https://learndigital.withgoogle.com", desc: "Free digital marketing course" },
    { icon: "\uD83D\uDCCA", color: "#3b82f6", title: "HubSpot Academy", url: "https://academy.hubspot.com", desc: "Free marketing certifications" },
    { icon: "\uD83D\uDCDA", color: "#10b981", title: "SEMrush Academy", url: "https://www.semrush.com/academy/", desc: "Free SEO & content courses" },
    { icon: "\uD83C\uDFA8", color: "#8b5cf6", title: "Meta Blueprint", url: "https://www.facebook.com/business/learn", desc: "Free social media training" },
  ],
  hr: [
    { icon: "\uD83D\uDC65", color: "#6366f1", title: "SHRM Free Resources", url: "https://www.shrm.org/resources-and-tools", desc: "Free HR tools & articles" },
    { icon: "\uD83D\uDCDA", color: "#3b82f6", title: "Coursera: People Management", url: "https://www.coursera.org/learn/people-management", desc: "Free to audit - IIMB" },
    { icon: "\uD83D\uDCCB", color: "#10b981", title: "LinkedIn HR Courses", url: "https://www.linkedin.com/learning/topics/human-resources-hr", desc: "Free with library card" },
    { icon: "\u2699\uFE0F", color: "#8b5cf6", title: "Gartner HR Practice", url: "https://www.gartner.com/en/human-resources", desc: "Free HR research insights" },
  ],
  finance: [
    { icon: "\uD83D\uDCB0", color: "#6366f1", title: "Khan Academy - Finance", url: "https://www.khanacademy.org/economics-finance-domain", desc: "Free finance courses" },
    { icon: "\uD83D\uDCDA", color: "#3b82f6", title: "CFI Free Courses", url: "https://corporatefinanceinstitute.com/courses/", desc: "Free financial modeling" },
    { icon: "\uD83D\uDCCA", color: "#10b981", title: "AccountingCoach", url: "https://www.accountingcoach.com", desc: "Free accounting basics" },
    { icon: "\uD83D\uDCD6", color: "#8b5cf6", title: "Investopedia Academy", url: "https://www.investopedia.com", desc: "Free financial dictionary & guides" },
  ],
  mechanical: [
    { icon: "\u2699\uFE0F", color: "#6366f1", title: "MIT OCW Mechanical Engineering", url: "https://ocw.mit.edu/courses/mechanical-engineering/", desc: "Free MIT courses" },
    { icon: "\uD83D\uDCBB", color: "#3b82f6", title: "SolidWorks Tutorials", url: "https://www.solidworks.com/sw/learning-tutorials.htm", desc: "Free official tutorials" },
    { icon: "\uD83C\uDFA8", color: "#10b981", title: "Autodesk Learning", url: "https://www.autodesk.com/education/free-software/all", desc: "Free software + training" },
    { icon: "\uD83D\uDCCB", color: "#8b5cf6", title: "Coursera: CAD & 3D Modeling", url: "https://www.coursera.org/learn/cad-for-a-mechanical-engineer", desc: "Free to audit" },
  ],
  electrical: [
    { icon: "\u26A1", color: "#6366f1", title: "Khan Academy - Electrical Engineering", url: "https://www.khanacademy.org/science/electrical-engineering", desc: "Free EE fundamentals" },
    { icon: "\uD83D\uDCBB", color: "#3b82f6", title: "KiCad Tutorials", url: "https://www.kicad.org", desc: "Free open-source PCB design" },
    { icon: "\uD83D\uDCDA", color: "#10b981", title: "MATLAB Onramp (MathWorks)", url: "https://matlabacademy.mathworks.com", desc: "Free MATLAB intro" },
    { icon: "\uD83D\uDD27", color: "#8b5cf6", title: "Arduino Project Hub", url: "https://projecthub.arduino.cc", desc: "Free embedded project ideas" },
  ],
  civil: [
    { icon: "\uD83C\uDFD7\uFE0F", color: "#6366f1", title: "MIT OCW Civil Engineering", url: "https://ocw.mit.edu/courses/civil-and-environmental-engineering/", desc: "Free MIT courses" },
    { icon: "\uD83D\uDCBB", color: "#3b82f6", title: "AutoCAD Free Training", url: "https://www.autodesk.com/education/free-software/all", desc: "Free AutoCAD + tutorials" },
    { icon: "\uD83D\uDCDA", color: "#10b981", title: "Coursera: Construction Management", url: "https://www.coursera.org/learn/construction-project-management", desc: "Free to audit - Columbia" },
    { icon: "\uD83D\uDCCB", color: "#8b5cf6", title: "NPTEL Structural Analysis", url: "https://nptel.ac.in/courses/105107103", desc: "Free NPTEL lectures" },
  ],
};

function analyzeAnswer(answer, role) {
  const words = answer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;

  const scores = {};

  /* 1. Length / Detail (0-100) */
  if (wordCount >= 120) scores.length = 100;
  else if (wordCount >= 80) scores.length = 85;
  else if (wordCount >= 50) scores.length = 65;
  else if (wordCount >= 30) scores.length = 40;
  else scores.length = 15;

  /* 2. Structure (STAR method, flow) */
  const structureKeywords = ["first", "then", "finally", "because", "therefore", "however", "result", "outcome", "learned", "example", "situation", "task", "action", "result"];
  const structureHits = structureKeywords.filter(kw => answer.toLowerCase().includes(kw)).length;
  scores.structure = Math.min(100, structureHits * 18 + (sentenceCount >= 3 ? 20 : 0) + (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 25 ? 15 : 0));

  /* 3. Confidence / Clarity (quantifiers, assertive language) */
  const confidenceWords = ["i built", "i led", "i achieved", "i improved", "i delivered", "i managed", "i designed", "i developed", "i implemented", "i created", "i solved", "i increased", "reduced", "improved", "successfully", "consistently", "significantly"];
  const confidentHits = confidenceWords.filter(kw => answer.toLowerCase().includes(kw)).length;
  scores.confidence = Math.min(100, confidentHits * 20 + (wordCount >= 50 ? 15 : 0));

  /* 4. Relevance (role-specific keywords) */
  const roleKeywords = {
    general: ["team", "learn", "goal", "challenge", "growth", "communication"],
    software: ["code", "api", "database", "testing", "deploy", "git", "bug", "performance", "algorithm", "refactor"],
    data: ["data", "analysis", "model", "insight", "visualization", "dataset", "prediction", "python", "sql"],
    web: ["html", "css", "javascript", "responsive", "frontend", "backend", "api", "framework", "performance"],
    cyber: ["security", "vulnerability", "firewall", "incident", "encryption", "monitoring", "compliance", "threat"],
    cloud: ["aws", "azure", "docker", "kubernetes", "ci/cd", "terraform", "deploy", "scalable", "monitoring"],
    ai: ["model", "training", "dataset", "neural", "deep learning", "feature", "prediction", "accuracy", "tensorflow"],
    mobile: ["android", "ios", "flutter", "react native", "responsive", "notification", "offline", "app store"],
    uiux: ["user", "design", "prototype", "wireframe", "usability", "research", "figma", "accessibility", "testing"],
    business: ["requirements", "stakeholder", "process", "data", "report", "analysis", "budget", "strategy"],
    marketing: ["campaign", "seo", "conversion", "audience", "content", "analytics", "roi", "engagement", "brand"],
    hr: ["recruitment", "employee", "engagement", "training", "policy", "culture", "retention", "performance"],
    finance: ["budget", "forecast", "audit", "compliance", "revenue", "analysis", "report", "variance", "cost"],
    mechanical: ["design", "cad", "prototype", "manufacturing", "tolerance", "material", "analysis", "testing"],
    electrical: ["circuit", "signal", "microcontroller", "pcb", "simulation", "power", "embedded", "oscilloscope"],
    civil: ["structural", "load", "concrete", "soil", "construction", "safety", "inspection", "blueprint"],
  };
  const keywords = roleKeywords[role] || roleKeywords.general;
  const keywordHits = keywords.filter(kw => answer.toLowerCase().includes(kw)).length;
  scores.relevance = Math.min(100, Math.round((keywordHits / keywords.length) * 100) + 20);

  /* Overall score */
  scores.overall = Math.round(scores.length * 0.2 + scores.structure * 0.3 + scores.confidence * 0.25 + scores.relevance * 0.25);

  return scores;
}

function generateFeedback(answer, scores, role) {
  const card = $("#feedback-card");
  const scoreEl = $("#feedback-score");
  const labelEl = $("#feedback-label");
  const summaryEl = $("#feedback-summary");
  const breakdownEl = $("#feedback-breakdown");
  const resourcesEl = $("#feedback-resources");

  const overall = scores.overall;
  scoreEl.textContent = overall;

  /* Score color + label */
  scoreEl.className = "feedback-score";
  if (overall >= 80) { scoreEl.classList.add("great"); labelEl.textContent = "Excellent answer!"; summaryEl.textContent = "Strong, well-structured response. Keep this quality up!"; }
  else if (overall >= 60) { scoreEl.classList.add("good"); labelEl.textContent = "Good answer"; summaryEl.textContent = "Solid response with room to strengthen a few areas."; }
  else if (overall >= 40) { scoreEl.classList.add("ok"); labelEl.textContent = "Needs improvement"; summaryEl.textContent = "Decent start, but a few key areas could use more work."; }
  else { scoreEl.classList.add("poor"); labelEl.textContent = "Needs work"; summaryEl.textContent = "Consider expanding your answer with more detail and structure."; }

  /* Breakdown bars */
  const rows = [
    { label: "Detail", val: scores.length, color: "#6366f1" },
    { label: "Structure", val: scores.structure, color: "#3b82f6" },
    { label: "Confidence", val: scores.confidence, color: "#10b981" },
    { label: "Relevance", val: scores.relevance, color: "#8b5cf6" },
  ];
  breakdownEl.innerHTML = rows.map(r =>
    `<div class="fb-row"><span class="fb-label">${r.label}</span><div class="fb-bar"><div class="fb-fill" style="width:${r.val}%;background:${r.color}"></div></div><span class="fb-val">${r.val}</span></div>`
  ).join("");

  /* Improvement tips */
  const tips = [];
  if (scores.length < 60) tips.push("Add more detail. Aim for 80-120 words with specific examples.");
  if (scores.structure < 50) tips.push("Use the STAR method: describe the Situation, Task, Action, and Result.");
  if (scores.confidence < 50) tips.push("Use confident action words: 'I built', 'I led', 'I improved'. Show ownership.");
  if (scores.relevance < 50) tips.push(`Include more ${roleQuestions[role].label}-specific keywords and technical terms.`);

  /* Free resources */
  const resources = (freeResources[role] || freeResources.general).slice(0, 3);

  let html = "";
  if (tips.length > 0) {
    html += `<div style="padding:10px 20px;border-bottom:1px solid var(--border);background:var(--bg)"><strong style="font-size:.82rem;color:var(--amber)">Areas to improve:</strong><ul style="margin:6px 0 0 18px;padding:0;font-size:.82rem;color:var(--text-body)">${tips.map(t => `<li>${t}</li>`).join("")}</ul></div>`;
  }

  html += `<h4>Free learning resources for ${roleQuestions[role].label}</h4><ul class="fb-resource-list">${resources.map(r =>
    `<li class="fb-resource-item"><div class="fb-icon" style="background:${r.color}">${r.icon}</div><div><a href="${r.url}" target="_blank" rel="noopener">${r.title}</a><span>${r.desc}</span></div></li>`
  ).join("")}</ul>`;
  resourcesEl.innerHTML = html;

  card.style.display = "block";
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

const roleQuestions = {
  general: {
    label: "General",
    tips: [
      "Keep answers structured: introduction, strengths, example.",
      "Use the STAR method: Situation, Task, Action, Result.",
      "Show enthusiasm for learning and growth.",
    ],
    questions: [
      "Tell me about yourself and your career goals.",
      "Why should we hire you for this role?",
      "Describe a time you faced a challenge. How did you handle it?",
      "What are your greatest strengths and weaknesses?",
      "Where do you see yourself in five years?",
      "Tell me about a time you worked effectively in a team.",
      "Why are you interested in joining our company?",
      "How do you handle pressure and tight deadlines?",
    ],
  },
  software: {
    label: "Software Engineer",
    tips: [
      "Mention specific languages, frameworks, and tools you know.",
      "Describe your problem-solving approach with concrete examples.",
      "Talk about code quality, testing, and collaboration.",
    ],
    questions: [
      "Tell me about yourself and your software engineering background.",
      "Which programming languages and frameworks are you most comfortable with?",
      "Describe a complex project you built. What was the architecture?",
      "How do you approach debugging a difficult issue in production?",
      "Explain the difference between REST and GraphQL. When would you use each?",
      "Tell me about a time you improved code performance or reduced technical debt.",
      "How do you ensure code quality in your team?",
      "What is your experience with version control, CI/CD, and agile workflows?",
      "Describe a time you disagreed with a technical decision. How did you resolve it?",
      "How do you stay updated with new technologies and best practices?",
    ],
  },
  data: {
    label: "Data Scientist / Analyst",
    tips: [
      "Explain models in business terms, not just technical jargon.",
      "Highlight impact: how your analysis drove a decision.",
      "Mention tools: Python, R, SQL, Tableau, etc.",
    ],
    questions: [
      "Tell me about your experience with data analysis and modeling.",
      "Describe a data project that had a measurable business impact.",
      "How do you handle missing or dirty data in a dataset?",
      "Explain a time you used machine learning to solve a real-world problem.",
      "What metrics do you use to evaluate model performance?",
      "How do you communicate complex data findings to non-technical stakeholders?",
      "Describe your experience with SQL and data pipeline tools.",
      "How do you decide between different modeling approaches for a problem?",
      "Tell me about a time your analysis contradicted initial assumptions.",
      "How do you ensure data privacy and ethical use of data?",
    ],
  },
  web: {
    label: "Web / Full-Stack Developer",
    tips: [
      "Demonstrate knowledge across the full stack: frontend, backend, database.",
      "Talk about responsive design, accessibility, and performance.",
      "Mention real projects with live demos if possible.",
    ],
    questions: [
      "Tell me about your full-stack development experience.",
      "Describe the most complex web application you have built end-to-end.",
      "How do you approach building a responsive and accessible UI?",
      "Explain the difference between server-side rendering and client-side rendering.",
      "How do you design and optimize a RESTful API?",
      "Describe your experience with databases — SQL and NoSQL.",
      "How do you handle authentication and authorization in web apps?",
      "Tell me about a performance bottleneck you resolved in a web application.",
      "How do you approach state management in a complex frontend application?",
      "What is your experience with testing frontend and backend code?",
    ],
  },
  cyber: {
    label: "Cybersecurity Analyst",
    tips: [
      "Reference frameworks like NIST, ISO 27001, or OWASP.",
      "Emphasize incident response process and documentation.",
      "Mention certifications if you have any.",
    ],
    questions: [
      "Tell me about your cybersecurity background and certifications.",
      "How do you approach vulnerability assessment and penetration testing?",
      "Describe a security incident you handled. What was the outcome?",
      "What are the most common attack vectors you see in modern organizations?",
      "How would you respond to a ransomware attack on company servers?",
      "Explain the principle of least privilege and how you implement it.",
      "How do you stay current with emerging cyber threats?",
      "Describe your experience with SIEM tools and log analysis.",
      "How do you balance security requirements with business needs?",
      "What steps would you take to secure a newly deployed web application?",
    ],
  },
  cloud: {
    label: "Cloud / DevOps Engineer",
    tips: [
      "Mention specific cloud platforms: AWS, Azure, GCP.",
      "Talk about infrastructure as code, containers, and orchestration.",
      "Emphasize reliability, scalability, and cost optimization.",
    ],
    questions: [
      "Tell me about your cloud infrastructure and DevOps experience.",
      "Describe a cloud architecture you designed or maintained.",
      "How do you approach containerization and orchestration with Docker and Kubernetes?",
      "Explain your experience with infrastructure as code tools like Terraform.",
      "How do you monitor system health and set up alerts?",
      "Describe a time you improved deployment speed or system reliability.",
      "How do you handle disaster recovery and backup strategies?",
      "What is your approach to cost optimization in cloud environments?",
      "How do you ensure security in a CI/CD pipeline?",
      "Describe your experience with microservices architecture.",
    ],
  },
  ai: {
    label: "AI / ML Engineer",
    tips: [
      "Discuss end-to-end ML pipelines: data collection to deployment.",
      "Mention frameworks: TensorFlow, PyTorch, scikit-learn.",
      "Talk about model deployment, monitoring, and iteration.",
    ],
    questions: [
      "Tell me about your AI and machine learning engineering background.",
      "Describe an end-to-end ML project you built and deployed.",
      "How do you handle overfitting and underfitting in your models?",
      "Explain the trade-offs between model accuracy and inference speed.",
      "How do you approach feature engineering for a new problem?",
      "Describe your experience with deep learning frameworks.",
      "How do you monitor ML models in production for drift or degradation?",
      "Tell me about a time you had to work with limited training data.",
      "How do you approach ethical considerations in AI development?",
      "What is your experience with MLOps and model versioning?",
    ],
  },
  mobile: {
    label: "Mobile App Developer",
    tips: [
      "Mention platforms: Android (Kotlin), iOS (Swift), cross-platform (Flutter/React Native).",
      "Talk about UX, performance, and app store guidelines.",
      "Describe real apps you have shipped.",
    ],
    questions: [
      "Tell me about your mobile app development experience.",
      "Describe a mobile app you built from concept to deployment.",
      "How do you handle offline functionality and data synchronization?",
      "Explain how you optimize mobile app performance and battery usage.",
      "What is your experience with cross-platform development frameworks?",
      "How do you approach push notifications and user engagement?",
      "Describe your experience with app store submission and review processes.",
      "How do you handle different screen sizes and device fragmentation?",
      "Tell me about a crash or performance issue you resolved in production.",
      "How do you implement secure data storage on mobile devices?",
    ],
  },
  uiux: {
    label: "UI/UX Designer",
    tips: [
      "Walk through your design process from research to final handoff.",
      "Reference usability testing and iteration cycles.",
      "Mention design tools: Figma, Sketch, Adobe XD, Framer.",
    ],
    questions: [
      "Walk me through your design process for a new product feature.",
      "How do you conduct user research and incorporate findings?",
      "Describe a time user feedback changed your design direction significantly.",
      "How do you balance aesthetic design with usability and accessibility?",
      "Tell me about a design system you contributed to or created.",
      "How do you collaborate with developers during implementation?",
      "Describe your experience with prototyping and usability testing.",
      "How do you approach designing for a diverse user base?",
      "What metrics do you use to measure the success of a design?",
      "Tell me about a time you had to advocate for a design decision.",
    ],
  },
  business: {
    label: "Business Analyst",
    tips: [
      "Emphasize requirements gathering, documentation, and stakeholder communication.",
      "Show analytical thinking with tools like Excel, SQL, Tableau.",
      "Talk about translating business needs into technical solutions.",
    ],
    questions: [
      "Tell me about your business analysis experience.",
      "How do you gather and document requirements from stakeholders?",
      "Describe a time you identified a process improvement that saved time or money.",
      "How do you handle conflicting requirements from different stakeholders?",
      "Explain your experience with data analysis and reporting tools.",
      "Describe a time you facilitated a successful project delivery.",
      "How do you prioritize requirements when resources are limited?",
      "What is your approach to user acceptance testing?",
      "How do you communicate complex business processes to technical teams?",
      "Tell me about a time you used data to drive a business decision.",
    ],
  },
  marketing: {
    label: "Marketing / Digital Marketing",
    tips: [
      "Mention channels: SEO, SEM, social media, email, content.",
      "Show data-driven thinking with metrics like CAC, ROI, CTR.",
      "Talk about campaign planning and execution.",
    ],
    questions: [
      "Tell me about your marketing experience and key achievements.",
      "How do you develop a marketing strategy for a new product or campaign?",
      "Describe a marketing campaign you led that exceeded expectations.",
      "How do you measure and optimize the ROI of marketing campaigns?",
      "What is your experience with SEO and content marketing?",
      "How do you approach audience segmentation and targeting?",
      "Describe your experience with social media marketing and analytics.",
      "How do you stay current with digital marketing trends?",
      "Tell me about a time a campaign did not perform as expected. What did you learn?",
      "How do you collaborate with sales and product teams?",
    ],
  },
  hr: {
    label: "HR / People Operations",
    tips: [
      "Highlight employee engagement, recruitment, and culture building.",
      "Discuss HRIS tools and compliance knowledge.",
      "Show empathy and conflict resolution skills.",
    ],
    questions: [
      "Tell me about your HR experience and areas of specialization.",
      "How do you approach talent acquisition and building a strong pipeline?",
      "Describe a time you resolved a complex employee conflict.",
      "How do you ensure compliance with labor laws and regulations?",
      "What strategies have you used to improve employee engagement?",
      "How do you approach performance management and feedback?",
      "Describe your experience with HRIS and people analytics tools.",
      "How do you build and maintain an inclusive workplace culture?",
      "Tell me about a time you handled a sensitive employee issue.",
      "How do you support employee development and retention?",
    ],
  },
  finance: {
    label: "Finance / Accounting",
    tips: [
      "Reference financial analysis tools and ERP systems.",
      "Highlight accuracy, compliance, and attention to detail.",
      "Mention certifications: CA, CFA, CPA if applicable.",
    ],
    questions: [
      "Tell me about your finance and accounting background.",
      "How do you ensure accuracy and compliance in financial reporting?",
      "Describe your experience with financial modeling and forecasting.",
      "How do you handle tight month-end or quarter-end deadlines?",
      "Explain a time you identified a financial discrepancy or risk.",
      "What is your experience with ERP systems like SAP or Oracle?",
      "How do you approach budgeting and cost control?",
      "Describe your experience with audit processes.",
      "How do you stay updated on regulatory changes in finance?",
      "Tell me about a time you provided insights that influenced business strategy.",
    ],
  },
  mechanical: {
    label: "Mechanical Engineer",
    tips: [
      "Mention CAD tools: SolidWorks, AutoCAD, CATIA.",
      "Discuss design for manufacturing and prototyping.",
      "Reference specific projects or internships.",
    ],
    questions: [
      "Tell me about your mechanical engineering background and interests.",
      "Describe a mechanical design project you are proud of.",
      "What CAD and simulation tools are you proficient in?",
      "How do you approach design for manufacturability and cost optimization?",
      "Describe your experience with prototyping and testing.",
      "How do you handle tolerance analysis in your designs?",
      "Tell me about a time you solved a challenging engineering problem.",
      "What is your experience with materials selection for specific applications?",
      "How do you collaborate with cross-functional teams on product development?",
      "Describe your experience with GD&T and engineering drawings.",
    ],
  },
  electrical: {
    label: "Electrical / Electronics Engineer",
    tips: [
      "Mention tools: MATLAB, Simulink, LTSpice, KiCad.",
      "Talk about circuit design, PCB layout, and embedded systems.",
      "Reference specific projects or lab work.",
    ],
    questions: [
      "Tell me about your electrical and electronics engineering background.",
      "Describe a circuit design or embedded systems project you worked on.",
      "What tools do you use for circuit simulation and PCB design?",
      "How do you approach debugging hardware issues?",
      "Explain your experience with microcontrollers and embedded programming.",
      "Describe your experience with signal processing or communication systems.",
      "How do you handle power management in electronic designs?",
      "Tell me about a time you optimized a design for performance or cost.",
      "What is your experience with IoT or wireless communication protocols?",
      "How do you ensure electromagnetic compatibility in your designs?",
    ],
  },
  civil: {
    label: "Civil Engineer",
    tips: [
      "Mention tools: AutoCAD, Revit, STAAD Pro, ETABS.",
      "Discuss structural analysis and design principles.",
      "Reference site experience and project management.",
    ],
    questions: [
      "Tell me about your civil engineering background and specialization.",
      "Describe a construction or structural design project you contributed to.",
      "What design and analysis software are you proficient in?",
      "How do you approach structural analysis and load calculations?",
      "Describe your experience with site supervision and quality control.",
      "How do you handle project timelines and resource constraints?",
      "Tell me about a time you identified a structural safety concern.",
      "What is your experience with building codes and regulatory compliance?",
      "How do you collaborate with architects and contractors?",
      "Describe your approach to sustainable and resilient design.",
    ],
  },
};

/* ── State ── */
const KEY = "campusiq_hr_answers";
const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
let current = 0;
let micStream;
let recognition;
let currentRole = "general";
let currentQuestions = roleQuestions.general.questions;

const $ = (id) => document.querySelector(id);
const escapeHtml = window.escHtml || function (s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, "&#96;");
};

/* ── CAPTCHA ── */
let captchaAnswer = 0;
function makeCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  captchaAnswer = a + b;
  $("#captcha-question").textContent = `${a} + ${b} = ?`;
  $("#captcha-answer").value = "";
}

/* ── Integrity ── */
let warnings = 0;
const MAX_WARNINGS = 5;
let locked = false;
let focusLostMs = 0;
let focusLostStart = 0;
let typingTimestamps = [];
let answerSnapshot = "";
let lastDevtoolsWarning = 0;
const SESSION_KEY = "campusiq_interview_session";

function addWarning(reason) {
  if (locked) return;
  warnings += 1;
  $("#warning-count").textContent = warnings;
  $(".integrity").classList.add("alert");
  $("#integrity-message").textContent = `${reason} detected. Please remain on the interview page.`;

  if (warnings >= MAX_WARNINGS) {
    lockSession();
  }
}

function lockSession() {
  locked = true;
  $(".integrity").classList.add("locked");
  $("#integrity-message").textContent = "Session locked — too many integrity violations. Refresh to restart.";
  $("#answer").disabled = true;
  $("#save").disabled = true;
  $("#mic").disabled = true;
  $("#stop").disabled = true;
  $("#next").disabled = true;
  $("#ask").disabled = true;
  if (typeof showToast === "function") showToast("Session locked due to repeated integrity violations.", "error");
}

/* ── Metrics ── */
function metrics() {
  const wordTotal = saved.reduce((n, x) => n + x.answer.split(/\s+/).filter(Boolean).length, 0);
  $("#answers").textContent = saved.length;
  $("#words").textContent = wordTotal;
  const s = Math.min(100, Math.round(saved.length * 20 + wordTotal / 2));
  $("#score").textContent = s;
}

/* ── Character State Machine ── */
const characterEl = $("#hr-character");
const statusBar = $("#hr-status-bar");
const liveBadge = $("#live-badge");
const hrStateText = $("#hr-state");
const hrStatusText = $("#hr-status-text");
let charState = "idle";
let reactionTimeout = null;

function setCharacterState(state) {
  if (charState === state && state !== "approving" && state !== "concerned") return;
  charState = state;
  characterEl.className = "hr-character " + state;
  statusBar.className = "hr-status-bar " + state;
  liveBadge.className = "live" + (state === "speaking" ? " speaking" : "");
  /* Clear any lingering inline transforms from old JS animations */
  const head = characterEl.querySelector(".char-head");
  if (head) { head.style.transform = ""; head.style.transition = ""; }
  const labels = { idle: "AI HR ready", speaking: "AI HR speaking", listening: "AI HR listening", thinking: "AI HR thinking\u2026", surprised: "AI HR surprised", approving: "AI HR nodding", concerned: "AI HR considering" };
  const statusLabels = { idle: "\u00b7 HR Manager \u00b7 Ready", speaking: "\u00b7 Speaking \u00b7", listening: "\u00b7 Listening \u00b7", thinking: "\u00b7 Thinking\u2026", surprised: "\u00b7 Reacting\u2026", approving: "\u00b7 Noting your answer \u00b7", concerned: "\u00b7 Evaluating \u00b7" };
  hrStateText.textContent = labels[state] || labels.idle;
  hrStatusText.textContent = statusLabels[state] || statusLabels.idle;
}

/* ── Reaction Helper (auto-resolves after duration) ── */
function showReaction(state, durationMs) {
  setCharacterState(state);
  clearTimeout(reactionTimeout);
  reactionTimeout = setTimeout(() => setCharacterState("listening"), durationMs || 1500);
}

/* ── Lip Sync ── */
/* Lip sync is handled entirely by CSS animations on .char-mouth.
   JS no longer manipulates mouth transform to avoid conflicts. */

/* ── Gaze Tracking ── */
const pupilBasePositions = [];
document.addEventListener("DOMContentLoaded", () => {
  characterEl.querySelectorAll(".pupil").forEach(p => {
    pupilBasePositions.push({ cx: parseFloat(p.getAttribute("cx")), cy: parseFloat(p.getAttribute("cy")) });
  });
});
document.addEventListener("mousemove", (e) => {
  if (charState === "idle" || charState === "listening") {
    const rect = characterEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.35;
    const dx = (e.clientX - cx) / window.innerWidth;
    const dy = (e.clientY - cy) / window.innerHeight;
    const eyeX = Math.max(-3, Math.min(3, dx * 12));
    const eyeY = Math.max(-2, Math.min(2, dy * 8));
    characterEl.querySelectorAll(".pupil").forEach((pupil, i) => {
      const base = pupilBasePositions[i];
      if (!base) return;
      pupil.setAttribute("cx", base.cx + eyeX);
      pupil.setAttribute("cy", base.cy + eyeY);
    });
  }
});

/* ── Camera ── */
let userCameraStream = null;
const userCamera = $("#user-camera");
const userCameraOff = $("#user-camera-off");

$("#start-cam").onclick = async () => {
  try {
    userCameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    userCamera.srcObject = userCameraStream;
    userCamera.style.display = "block";
    userCameraOff.style.display = "none";
    $("#start-cam").disabled = true;
    $("#stop-cam").disabled = false;
    setCharacterState("listening");
  } catch {
    $("#feedback").textContent = "Camera access was not available.";
  }
};

$("#stop-cam").onclick = () => {
  userCameraStream?.getTracks().forEach(t => t.stop());
  userCameraStream = null;
  userCamera.srcObject = null;
  userCamera.style.display = "none";
  userCameraOff.style.display = "grid";
  $("#start-cam").disabled = false;
  $("#stop-cam").disabled = true;
  setCharacterState("idle");
};

/* ── Role Picker ── */
const roleSelect = $("#role-select");
const roleHint = $("#role-hint");
const tipEl = $("#tip");

function updateRole() {
  currentRole = roleSelect.value;
  const roleData = roleQuestions[currentRole];
  currentQuestions = roleData.questions;
  current = 0;
  localStorage.setItem("campusiq_hr_role", currentRole);
  roleHint.textContent = `Answering as: ${roleData.label}`;
  tipEl.textContent = roleData.tips[Math.floor(Math.random() * roleData.tips.length)];
  typeQuestion(currentQuestions[current]);
  if (typeof showToast === "function") showToast(`Switched to ${roleData.label} interview`, "info");
}

roleSelect.addEventListener("change", updateRole);

/* ── Speech Synthesis ── */
function speak() {
  speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(currentQuestions[current]);
  speech.rate = 0.9;
  speech.pitch = 1.0;
  /* Try to select a natural female voice */
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) ||
                    voices.find(v => v.lang.startsWith("en-IN")) ||
                    voices.find(v => v.lang.startsWith("en"));
  if (preferred) speech.voice = preferred;

  speech.onstart = () => { setCharacterState("speaking"); };
  speech.onend = () => { setCharacterState("listening"); };
  speech.onerror = () => { setCharacterState("idle"); };

  /* CSS handles head micro-movements via .char-head animations */

  setCharacterState("thinking");
  setTimeout(() => speechSynthesis.speak(speech), 800);
}

/* ── Typing Effect ── */
function typeQuestion(text) {
  const el = $("#question");
  el.textContent = "";
  let i = 0;
  const type = () => {
    if (i < text.length) { el.textContent += text[i]; i++; setTimeout(type, 30); }
  };
  type();
}

/* ── UI Handlers ── */
$("#ask").onclick = speak;

$("#next").onclick = () => {
  current = (current + 1) % currentQuestions.length;
  typeQuestion(currentQuestions[current]);
  $("#answer").value = "";
  tipEl.textContent = roleQuestions[currentRole].tips[Math.floor(Math.random() * roleQuestions[currentRole].tips.length)];
  speak();
};

$("#save").onclick = () => {
  const answer = $("#answer").value.trim();
  if (answer.length < 30) { $("#feedback").textContent = "Please add more detail before saving."; return; }
  if (Number($("#captcha-answer").value) !== captchaAnswer) { $("#feedback").textContent = "CAPTCHA answer is incorrect. Try again."; makeCaptcha(); return; }

  /* Analyze and generate feedback */
  const scores = analyzeAnswer(answer, currentRole);
  generateFeedback(answer, scores, currentRole);

  saved.push({ question: currentQuestions[current], answer, role: currentRole, scores, savedAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(saved));
  metrics();
  makeCaptcha();

  /* Answer-quality character reaction */
  if (scores.overall >= 75) {
    showReaction("approving", 2000);
  } else if (scores.overall < 40) {
    showReaction("concerned", 2000);
  } else {
    showReaction("surprised", 1500);
  }

  if (typeof showToast === "function") showToast("Answer saved! Check your feedback below.", "success");
  else $("#feedback").textContent = "Answer saved. Check your feedback below.";
};

$("#refresh-captcha").onclick = makeCaptcha;

/* ── Microphone ── */
$("#mic").onclick = async () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    $("#mic").disabled = true;
    $("#stop").disabled = false;
    if (!SR) { $("#feedback").textContent = "Mic is on. Speech-to-text is unavailable; type your answer."; return; }
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onresult = e => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
      $("#answer").value = t;
    };
    recognition.start();
    $("#feedback").textContent = "Listening\u2026";
  } catch {
    $("#feedback").textContent = "Allow microphone permission and try again.";
  }
};

$("#stop").onclick = () => {
  recognition?.stop();
  micStream?.getTracks().forEach(t => t.stop());
  $("#mic").disabled = false;
  $("#stop").disabled = true;
  $("#feedback").textContent = "Microphone stopped.";
};

/* ── Call Timer ── */
let callSeconds = 0;
let callTimerInterval = null;
const callTimerEl = $("#call-timer");

function startCallTimer() {
  if (callTimerInterval) return;
  callTimerInterval = setInterval(() => {
    callSeconds++;
    const m = String(Math.floor(callSeconds / 60)).padStart(2, "0");
    const s = String(callSeconds % 60).padStart(2, "0");
    callTimerEl.textContent = `${m}:${s}`;
  }, 1000);
}
function stopCallTimer() {
  clearInterval(callTimerInterval);
  callTimerInterval = null;
}

/* ── Init ── */
(function init() {
  const savedRole = localStorage.getItem("campusiq_hr_role");
  if (savedRole && roleQuestions[savedRole]) {
    currentRole = savedRole;
    roleSelect.value = savedRole;
  }
  const roleData = roleQuestions[currentRole];
  currentQuestions = roleData.questions;
  roleHint.textContent = `Answering as: ${roleData.label}`;
  tipEl.textContent = roleData.tips[0];
  typeQuestion(currentQuestions[current]);
  metrics();
  makeCaptcha();
  setCharacterState("idle");
  startCallTimer();

  /* Preload voices for speech synthesis */
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
})();

/* ── Integrity Monitoring ── */

/* 1. Tab switch / window blur */
document.addEventListener("visibilitychange", () => { if (document.hidden) addWarning("Tab switch"); });
window.addEventListener("blur", () => {
  if (!document.hidden && !locked) { focusLostStart = Date.now(); addWarning("Window focus change"); }
});
window.addEventListener("focus", () => { if (focusLostStart) { focusLostMs += Date.now() - focusLostStart; focusLostStart = 0; } });

/* 2. Paste prevention */
$("#answer").addEventListener("paste", (e) => { e.preventDefault(); addWarning("Paste attempt"); $("#feedback").textContent = "Paste is disabled. Type your answer."; });

/* 3. Copy / Cut prevention on question + answer area */
document.addEventListener("copy", (e) => { if (!e.target.closest(".feedback-card")) { e.preventDefault(); addWarning("Copy attempt"); } });
document.addEventListener("cut", (e) => { e.preventDefault(); addWarning("Cut attempt"); });

/* 4. Right-click prevention */
document.addEventListener("contextmenu", (e) => { e.preventDefault(); addWarning("Right-click attempt"); });

/* 5. Keyboard shortcut blocking */
document.addEventListener("keydown", (e) => {
  if (locked) return;
  const ctrl = e.ctrlKey || e.metaKey;
  const shift = e.shiftKey;
  const key = e.key.toLowerCase();

  /* Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Ctrl+U, Ctrl+S */
  if (ctrl && ["c", "x", "v", "a", "u", "s"].includes(key)) {
    if (key === "v") return;
    e.preventDefault();
    addWarning(`Keyboard shortcut blocked: Ctrl+${key.toUpperCase()}`);
    return;
  }
  /* Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools) */
  if (ctrl && shift && ["i", "j", "c"].includes(key)) {
    e.preventDefault();
    addWarning("Developer tools shortcut blocked");
    return;
  }
  /* F12 (DevTools) */
  if (e.key === "F12") {
    e.preventDefault();
    addWarning("F12 (DevTools) blocked");
    return;
  }
  /* Ctrl+P (Print) */
  if (ctrl && key === "p") {
    e.preventDefault();
    addWarning("Print shortcut blocked");
    return;
  }
  /* Ctrl+Shift+P (DevTools command palette) */
  if (ctrl && shift && key === "p") {
    e.preventDefault();
    addWarning("DevTools command palette blocked");
    return;
  }
  /* Ctrl+G / Ctrl+H (Go to line / Find & replace) */
  if (ctrl && ["g", "h"].includes(key)) {
    e.preventDefault();
    addWarning(`Keyboard shortcut blocked: Ctrl+${key.toUpperCase()}`);
  }
});

/* 6. DevTools detection via debugger timing */
setInterval(() => {
  if (locked) return;
  const start = performance.now();
  debugger;
  const elapsed = performance.now() - start;
  if (elapsed > 100) {
    const now = Date.now();
    if (now - lastDevtoolsWarning > 5000) {
      lastDevtoolsWarning = now;
      addWarning("Developer tools detected");
    }
  }
}, 3000);

/* 7. DevTools detection via window size discrepancy */
setInterval(() => {
  if (locked) return;
  const threshold = 160;
  const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
  const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
  if (widthDiff > threshold || heightDiff > threshold) {
    const now = Date.now();
    if (now - lastDevtoolsWarning > 8000) {
      lastDevtoolsWarning = now;
      addWarning("Developer tools panel detected");
    }
  }
}, 4000);

/* 8. Multi-tab detection via BroadcastChannel */
(function initMultiTabDetection() {
  const channel = new BroadcastChannel("campusiq_interview_lock");
  const tabId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  channel.postMessage({ type: "register", tabId });

  channel.onmessage = (e) => {
    if (e.data.type === "register" && e.data.tabId !== tabId) {
      addWarning("Multiple interview tabs detected");
    }
  };

  window.addEventListener("beforeunload", () => {
    channel.postMessage({ type: "close", tabId });
  });
})();

/* 9. Typing pattern analysis — detect instant paste-like behavior */
(function initTypingAnalysis() {
  const answerEl = $("#answer");
  let prevLen = 0;
  let burstStart = 0;

  answerEl.addEventListener("input", () => {
    if (locked) return;
    const now = Date.now();
    const curLen = answerEl.value.length;
    const added = curLen - prevLen;

    if (added > 0) {
      if (burstStart === 0) burstStart = now;
      const elapsed = now - burstStart;
      /* If 20+ characters appear in under 80ms, likely a paste or auto-fill */
      if (added >= 20 && elapsed < 80) {
        addWarning("Suspicious input burst detected (possible paste)");
        burstStart = 0;
      }
      /* If 200+ characters appear within 500ms */
      if (added >= 200 && elapsed < 500) {
        addWarning("Large text block inserted instantly");
        burstStart = 0;
      }
    } else {
      burstStart = now;
    }
    prevLen = curLen;
  });

  /* Track WPM — flag if typing speed exceeds human limit */
  answerEl.addEventListener("input", () => {
    if (locked) return;
    const now = Date.now();
    typingTimestamps.push(now);
    /* Keep only last 5 seconds of timestamps */
    typingTimestamps = typingTimestamps.filter(t => now - t < 5000);

    if (typingTimestamps.length > 1) {
      const spanSec = (typingTimestamps[typingTimestamps.length - 1] - typingTimestamps[0]) / 1000;
      const charCount = answerEl.value.length;
      const wpm = spanSec > 0 ? (charCount / 5) / (spanSec / 60) : 0;
      /* ~120 WPM is expert typing speed — anything above sustained is suspicious */
      if (wpm > 120 && charCount > 100) {
        addWarning("Unrealistic typing speed detected");
        typingTimestamps = [];
      }
    }
  });
})();

/* 10. Screen capture detection (PrintScreen key) */
document.addEventListener("keyup", (e) => {
  if (locked) return;
  if (e.key === "PrintScreen") {
    addWarning("Screenshot attempt detected");
  }
});

/* 11. Fullscreen exit detection */
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && !locked) {
    addWarning("Exited fullscreen mode");
  }
});

/* 12. Text selection blocking on the answer area */
$("#answer").addEventListener("selectstart", (e) => { /* allow selection for editing */ });
document.addEventListener("selectstart", (e) => {
  if (locked) return;
  if (e.target.closest(".question-box")) {
    e.preventDefault();
    addWarning("Text selection on question blocked");
  }
});

/* 13. Drag and drop prevention */
document.addEventListener("dragstart", (e) => { e.preventDefault(); addWarning("Drag-and-drop attempt"); });
document.addEventListener("drop", (e) => { e.preventDefault(); addWarning("Drop attempt"); });

/* 14. Anti-autocomplete — prevent browser autofill on the answer field */
$("#answer").setAttribute("autocomplete", "off");
$("#answer").setAttribute("data-lpignore", "true");
$("#answer").setAttribute("data-1p-ignore", "true");
