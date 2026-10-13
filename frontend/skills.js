/* ══════════════════════════════════════════════════════════════
   CampusIQ AI — Skill Catalog
   Categories, logos, and color-coded tags for skill inputs.
   ══════════════════════════════════════════════════════════════ */

window.SkillCatalog = {
  categories: {
    language:     { label: "Programming Languages", color: "#6366f1", icon: "\u25B6" },
    framework:    { label: "Frameworks & Libraries", color: "#3b82f6", icon: "\u2B21" },
    database:     { label: "Databases",             color: "#10b981", icon: "\u26C1" },
    cloud:        { label: "Cloud & DevOps",        color: "#f59e0b", icon: "\u2601" },
    tool:         { label: "Tools & Platforms",     color: "#8b5cf6", icon: "\u2699" },
    design:       { label: "Design & UX",           color: "#ec4899", icon: "\u2740" },
    soft:         { label: "Soft Skills",           color: "#14b8a6", icon: "\u2605" },
    domain:       { label: "Domain Knowledge",      color: "#f97316", icon: "\u2261" },
  },

  /* skill name (lowercase) => { category, logo (initials or emoji), color } */
  skills: {
    /* ── Programming Languages ── */
    "python":           { cat: "language", logo: "Py", color: "#3776AB" },
    "java":             { cat: "language", logo: "Jv", color: "#ED8B00" },
    "javascript":       { cat: "language", logo: "JS", color: "#F7DF1E" },
    "typescript":       { cat: "language", logo: "TS", color: "#3178C6" },
    "c++":              { cat: "language", logo: "C+", color: "#00599C" },
    "c":                { cat: "language", logo: "C",  color: "#A8B9CC" },
    "c#":               { cat: "language", logo: "C#", color: "#239120" },
    "go":               { cat: "language", logo: "Go", color: "#00ADD8" },
    "rust":             { cat: "language", logo: "Rs", color: "#CE422B" },
    "php":              { cat: "language", logo: "PH", color: "#777BB4" },
    "ruby":             { cat: "language", logo: "Rb", color: "#CC342D" },
    "swift":            { cat: "language", logo: "Sw", color: "#FA7343" },
    "kotlin":           { cat: "language", logo: "Kt", color: "#7F52FF" },
    "scala":            { cat: "language", logo: "Sc", color: "#DC322F" },
    "r":                { cat: "language", logo: "R",  color: "#276DC3" },
    "matlab":           { cat: "language", logo: "ML", color: "#FF6C37" },
    "html":             { cat: "language", logo: "H5", color: "#E34F26" },
    "css":              { cat: "language", logo: "CS", color: "#1572B6" },
    "sql":              { cat: "language", logo: "SQ", color: "#336791" },
    "bash":             { cat: "language", logo: "Sh", color: "#4EAA25" },
    "lua":              { cat: "language", logo: "Lu", color: "#000080" },
    "dart":             { cat: "language", logo: "Da", color: "#0175C2" },

    /* ── Frameworks & Libraries ── */
    "react":            { cat: "framework", logo: "Re", color: "#61DAFB" },
    "react native":     { cat: "framework", logo: "RN", color: "#61DAFB" },
    "angular":          { cat: "framework", logo: "Ng", color: "#DD0031" },
    "vue.js":           { cat: "framework", logo: "Vu", color: "#4FC08D" },
    "vue":              { cat: "framework", logo: "Vu", color: "#4FC08D" },
    "next.js":          { cat: "framework", logo: "Nx", color: "#000000" },
    "nextjs":           { cat: "framework", logo: "Nx", color: "#000000" },
    "node.js":          { cat: "framework", logo: "N+", color: "#339933" },
    "nodejs":           { cat: "framework", logo: "N+", color: "#339933" },
    "express":          { cat: "framework", logo: "Ex", color: "#000000" },
    "django":           { cat: "framework", logo: "Dj", color: "#092E20" },
    "flask":            { cat: "framework", logo: "Fl", color: "#000000" },
    "fastapi":          { cat: "framework", logo: "FA", color: "#009688" },
    "spring boot":      { cat: "framework", logo: "Sp", color: "#6DB33F" },
    "spring":           { cat: "framework", logo: "Sp", color: "#6DB33F" },
    "laravel":          { cat: "framework", logo: "Lv", color: "#FF2D20" },
    "rails":            { cat: "framework", logo: "Rl", color: "#CC0000" },
    "flutter":          { cat: "framework", logo: "Fl", color: "#02569B" },
    "tailwind css":     { cat: "framework", logo: "TW", color: "#06B6D4" },
    "tailwind":         { cat: "framework", logo: "TW", color: "#06B6D4" },
    "bootstrap":        { cat: "framework", logo: "Bs", color: "#7952B3" },
    "jquery":           { cat: "framework", logo: "jQ", color: "#0769AD" },
    "tensorflow":       { cat: "framework", logo: "TF", color: "#FF6F00" },
    "pytorch":          { cat: "framework", logo: "PT", color: "#EE4C2C" },
    "scikit-learn":     { cat: "framework", logo: "SK", color: "#F09437" },
    "pandas":           { cat: "framework", logo: "Pd", color: "#150458" },
    "numpy":            { cat: "framework", logo: "Np", color: "#4DABCF" },
    "matplotlib":       { cat: "framework", logo: "Mp", color: "#11557C" },

    /* ── Databases ── */
    "mysql":            { cat: "database", logo: "My", color: "#4479A1" },
    "postgresql":       { cat: "database", logo: "Pg", color: "#4169E1" },
    "postgres":         { cat: "database", logo: "Pg", color: "#4169E1" },
    "mongodb":          { cat: "database", logo: "Mg", color: "#47A248" },
    "redis":            { cat: "database", logo: "Rd", color: "#DC382D" },
    "sqlite":           { cat: "database", logo: "Lt", color: "#003B57" },
    "firebase":         { cat: "database", logo: "FB", color: "#FFCA28" },
    "oracle":           { cat: "database", logo: "Or", color: "#F80000" },
    "dynamodb":         { cat: "database", logo: "Dy", color: "#4053D6" },
    "elasticsearch":    { cat: "database", logo: "ES", color: "#005571" },

    /* ── Cloud & DevOps ── */
    "aws":              { cat: "cloud", logo: "Aw", color: "#FF9900" },
    "azure":            { cat: "cloud", logo: "Az", color: "#0078D4" },
    "gcp":              { cat: "cloud", logo: "GC", color: "#4285F4" },
    "google cloud":     { cat: "cloud", logo: "GC", color: "#4285F4" },
    "docker":           { cat: "cloud", logo: "Dk", color: "#2496ED" },
    "kubernetes":       { cat: "cloud", logo: "K8", color: "#326CE5" },
    "terraform":        { cat: "cloud", logo: "Tf", color: "#7B42BC" },
    "jenkins":          { cat: "cloud", logo: "Jk", color: "#D33833" },
    "git":              { cat: "cloud", logo: "Gt", color: "#F05032" },
    "github":           { cat: "cloud", logo: "GH", color: "#181717" },
    "gitlab":           { cat: "cloud", logo: "GL", color: "#FC6D26" },
    "nginx":            { cat: "cloud", logo: "Nx", color: "#009639" },
    "ci/cd":            { cat: "cloud", logo: "CI", color: "#40C463" },
    "linux":            { cat: "cloud", logo: "Lx", color: "#FCC624" },
    "ansible":          { cat: "cloud", logo: "An", color: "#1A1918" },
    "prometheus":       { cat: "cloud", logo: "Pr", color: "#E6522C" },

    /* ── Tools & Platforms ── */
    "vs code":          { cat: "tool", logo: "VC", color: "#007ACC" },
    "visual studio code":{ cat: "tool", logo: "VC", color: "#007ACC" },
    "jira":             { cat: "tool", logo: "Ji", color: "#0052CC" },
    "figma":            { cat: "tool", logo: "Fi", color: "#F24E1E" },
    "postman":          { cat: "tool", logo: "Pm", color: "#FF6C37" },
    "slack":            { cat: "tool", logo: "Sl", color: "#4A154B" },
    "notion":           { cat: "tool", logo: "Nt", color: "#000000" },
    "jupyter":          { cat: "tool", logo: "Jp", color: "#F37626" },
    "vim":              { cat: "tool", logo: "Vi", color: "#019833" },
    "graphql":          { cat: "tool", logo: "GQ", color: "#E10098" },
    "rest api":         { cat: "tool", logo: "RE", color: "#009688" },
    "rest":             { cat: "tool", logo: "RE", color: "#009688" },
    "grpc":             { cat: "tool", logo: "gR", color: "#244C5A" },
    "webpack":          { cat: "tool", logo: "Wp", color: "#8DD6F9" },
    "npm":              { cat: "tool", logo: "np", color: "#CB3837" },
    "pip":              { cat: "tool", logo: "pi", color: "#3775A9" },
    "maven":            { cat: "tool", logo: "Mv", color: "#C12766" },

    /* ── Design & UX ── */
    "ui/ux":            { cat: "design", logo: "UX", color: "#FF7262" },
    "ui design":        { cat: "design", logo: "UI", color: "#FF7262" },
    "ux design":        { cat: "design", logo: "UX", color: "#FF7262" },
    "wireframing":      { cat: "design", logo: "Wi", color: "#A259FF" },
    "prototyping":      { cat: "design", logo: "Pr", color: "#A259FF" },
    "adobe xd":         { cat: "design", logo: "XD", color: "#FF61F6" },
    "photoshop":        { cat: "design", logo: "Ps", color: "#31A8FF" },
    "illustrator":      { cat: "design", logo: "Ai", color: "#FF9A00" },
    "sketch":           { cat: "design", logo: "Sk", color: "#F7B500" },
    "framer":           { cat: "design", logo: "Fr", color: "#0055FF" },
    "canva":            { cat: "design", logo: "Ca", color: "#00C4CC" },
    "accessibility":    { cat: "design", logo: "A1", color: "#1A73E8" },

    /* ── Soft Skills ── */
    "leadership":       { cat: "soft", logo: "Ld", color: "#0D9488" },
    "communication":    { cat: "soft", logo: "Co", color: "#0D9488" },
    "teamwork":         { cat: "soft", logo: "Tw", color: "#0D9488" },
    "problem solving":  { cat: "soft", logo: "PS", color: "#0D9488" },
    "critical thinking":{ cat: "soft", logo: "CT", color: "#0D9488" },
    "time management":  { cat: "soft", logo: "TM", color: "#0D9488" },
    "adaptability":     { cat: "soft", logo: "Ad", color: "#0D9488" },
    "creativity":       { cat: "soft", logo: "Cr", color: "#0D9488" },
    "presentation":     { cat: "soft", logo: "Pr", color: "#0D9488" },
    "analytical skills":{ cat: "soft", logo: "An", color: "#0D9488" },
    "attention to detail":{ cat: "soft", logo: "Dt", color: "#0D9488" },

    /* ── Domain Knowledge ── */
    "machine learning":  { cat: "domain", logo: "ML", color: "#FF6F00" },
    "deep learning":     { cat: "domain", logo: "DL", color: "#FF6F00" },
    "data analysis":     { cat: "domain", logo: "DA", color: "#FF6F00" },
    "data science":      { cat: "domain", logo: "DS", color: "#FF6F00" },
    "nlp":               { cat: "domain", logo: "NL", color: "#FF6F00" },
    "computer vision":   { cat: "domain", logo: "CV", color: "#FF6F00" },
    "cybersecurity":     { cat: "domain", logo: "CS", color: "#FF6F00" },
    "networking":        { cat: "domain", logo: "Nw", color: "#FF6F00" },
    "agile":             { cat: "domain", logo: "Ag", color: "#FF6F00" },
    "scrum":             { cat: "domain", logo: "Sc", color: "#FF6F00" },
    "data structures":   { cat: "domain", logo: "DS", color: "#FF6F00" },
    "algorithms":        { cat: "domain", logo: "Al", color: "#FF6F00" },
    "object oriented programming": { cat: "domain", logo: "OO", color: "#FF6F00" },
    "oop":               { cat: "domain", logo: "OO", color: "#FF6F00" },
    "web development":   { cat: "domain", logo: "WD", color: "#FF6F00" },
    "mobile development":{ cat: "domain", logo: "MD", color: "#FF6F00" },
    "cloud computing":   { cat: "domain", logo: "CC", color: "#FF6F00" },
    "devops":            { cat: "domain", logo: "DO", color: "#FF6F00" },
    "microservices":     { cat: "domain", logo: "MS", color: "#FF6F00" },
    "api design":        { cat: "domain", logo: "AD", color: "#FF6F00" },
    "testing":           { cat: "domain", logo: "Ts", color: "#FF6F00" },
    "unit testing":      { cat: "domain", logo: "UT", color: "#FF6F00" },
  },

  /**
   * Look up a skill by name (case-insensitive).
   * Returns { cat, logo, color } or a default object.
   */
  lookup(name) {
    const key = (name || "").toLowerCase().trim();
    return this.skills[key] || { cat: "domain", logo: key.slice(0, 2).toUpperCase(), color: "#64748b" };
  },

  /**
   * Get category info by key.
   */
  getCategory(catKey) {
    return this.categories[catKey] || { label: "Other", color: "#64748b", icon: "\u25CB" };
  },

  /**
   * Render a skill tag HTML string with logo + category color.
   */
  renderTag(name, index) {
    const s = this.lookup(name);
    const cat = this.getCategory(s.cat);
    return `<span class="skill-tag" style="--tag-color:${s.color}"><span class="skill-logo" style="background:${s.color}">${escHtml(s.logo)}</span><span class="skill-name">${escHtml(name)}</span><button type="button" class="remove" data-skill="${index}" aria-label="Remove ${escHtml(name)}">&times;</button></span>`;
  },

  /**
   * Render a skill tag for the resume page (simpler, no remove button).
   */
  renderResumeTag(name) {
    const s = this.lookup(name);
    return `<span class="skill-tag-sm" style="--tag-color:${s.color}"><span class="skill-logo-sm" style="background:${s.color}">${escHtml(s.logo)}</span>${escHtml(name)}</span>`;
  },

  /**
   * Suggest skills matching a partial input string.
   */
  suggest(partial, existing, limit) {
    const q = (partial || "").toLowerCase();
    if (!q) return [];
    const existSet = new Set((existing || []).map(s => s.toLowerCase()));
    return Object.keys(this.skills)
      .filter(k => k.includes(q) && !existSet.has(k))
      .slice(0, limit || 6)
      .map(k => ({ name: k, ...this.skills[k] }));
  }
};
