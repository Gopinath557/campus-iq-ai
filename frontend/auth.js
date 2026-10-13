/* ══════════════════════════════════════════════════════════════
   CampusIQ AI — Auth Logic
   Login, signup, Google OAuth demo, password strength.
   Uses ui.js for toasts and escaping.
   ══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const API = "http://127.0.0.1:8000/api/v1";
  const TOKEN_KEY = "campusiq_token";
  const USER_KEY = "campusiq_user";
  const TOKEN_EXPIRY_KEY = "campusiq_token_expiry";

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function setToken(t, expiresInSeconds) {
    localStorage.setItem(TOKEN_KEY, t);
    if (expiresInSeconds) localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresInSeconds * 1000));
  }
  function setUser(u) { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
  function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }
  function isLoggedIn() { return !!getToken(); }

  /* ── DOM Helpers ── */
  const $ = (sel) => document.querySelector(sel);
  function showError(el, msg) { el.className = "auth-message error"; el.textContent = msg; }
  function showSuccess(el, msg) { el.className = "auth-message success"; el.textContent = msg; }
  function clearMessages() {
    document.querySelectorAll(".auth-message").forEach((m) => { m.className = "auth-message"; m.textContent = ""; });
  }

  /* ── Tab Switching ── */
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".auth-form").forEach((f) => f.classList.remove("active"));
      tab.classList.add("active");
      const mode = tab.getAttribute("data-mode");
      const form = document.querySelector(`.auth-form[data-mode="${mode}"]`);
      if (form) form.classList.add("active");
      clearMessages();
    });
  });

  /* ── Password Strength ── */
  const pwInput = $("#signup-password");
  const pwFill = $("#pw-fill");
  const pwHint = $("#pw-hint");
  if (pwInput) {
    pwInput.addEventListener("input", () => {
      const v = pwInput.value;
      let score = 0;
      if (v.length >= 12) score++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;

      pwFill.className = "pw-strength-fill";
      if (score <= 1) { pwFill.classList.add("strength-weak"); pwHint.textContent = "Weak — add uppercase, numbers, and symbols"; }
      else if (score <= 2) { pwFill.classList.add("strength-fair"); pwHint.textContent = "Fair — needs uppercase, digits, and special chars"; }
      else if (score <= 3) { pwFill.classList.add("strength-strong"); pwHint.textContent = "Good password"; }
      else { pwFill.classList.add("strength-strong"); pwHint.textContent = "Strong password"; }
    });
  }

  /* ── Login ── */
  const loginForm = $("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = $("#login-email").value.trim();
      const password = $("#login-password").value;
      const msg = $("#login-msg");
      const btn = $("#login-btn");

      clearMessages();
      showLoading(btn);

      try {
        const res = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        hideLoading(btn);

        if (!res.ok) {
          showError(msg, data.detail || "Invalid email or password.");
          return;
        }

        setToken(data.access_token, data.expires_in);

        /* Fetch user profile */
        try {
          const meRes = await fetch(`${API}/auth/me`, {
            headers: { "Authorization": `Bearer ${data.access_token}` },
          });
          if (meRes.ok) setUser(await meRes.json());
        } catch { /* proceed */ }

        showToast("Signed in successfully!", "success");
        setTimeout(() => { window.location.href = "index.html"; }, 600);
      } catch {
        hideLoading(btn);
        showError(msg, "Cannot reach the server. Make sure the API is running on port 8000.");
      }
    });
  }

  /* ── Signup ── */
  const signupForm = $("#signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const full_name = $("#signup-name").value.trim();
      const email = $("#signup-email").value.trim();
      const password = $("#signup-password").value;
      const confirm = $("#signup-confirm").value;
      const msg = $("#signup-msg");
      const btn = $("#signup-btn");

      clearMessages();

      if (password !== confirm) { showError(msg, "Passwords do not match."); return; }

      showLoading(btn);

      try {
        const res = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name, email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          hideLoading(btn);
          if (res.status === 409) showError(msg, "An account with this email already exists.");
          else if (res.status === 422) showError(msg, data.detail?.[0]?.msg || "Invalid input. Check your details.");
          else showError(msg, data.detail || "Registration failed.");
          return;
        }

        /* Auto-login after signup */
        const loginRes = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          setToken(loginData.access_token, loginData.expires_in);
          setUser(data);
        }

        hideLoading(btn);
        showToast("Account created! Redirecting...", "success");
        setTimeout(() => { window.location.href = "index.html"; }, 800);
      } catch {
        hideLoading(btn);
        showError(msg, "Cannot reach the server. Make sure the API is running on port 8000.");
      }
    });
  }

  /* ── Google OAuth Demo Modal ── */
  const googleBtn = $("#google-btn");
  const googleModal = $("#google-modal");
  const googleModalClose = $("#google-modal-close");
  const googleSubmit = $("#google-submit");
  const googleOneClick = $("#google-oneclick");
  const googleName = $("#google-name");
  const googleEmail = $("#google-email");

  function doDemoGoogle(email, name, btn) {
    const msg = $("#login-msg");
    if (btn) showLoading(btn);
    fetch(`${API}/auth/google/demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, full_name: name }),
    })
      .then(async (res) => {
        if (btn) hideLoading(btn);
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 403) showToast("Demo sign-in is disabled. Register an account.", "error");
          else showToast(data.detail || "Google sign-in failed.", "error");
          return;
        }
        setToken(data.access_token, data.expires_in);
        try {
          const meRes = await fetch(`${API}/auth/me`, {
            headers: { "Authorization": `Bearer ${data.access_token}` },
          });
          if (meRes.ok) setUser(await meRes.json());
        } catch { /* proceed */ }
        if (googleModal) googleModal.style.display = "none";
        showToast("Signed in with Google!", "success");
        setTimeout(() => { window.location.href = "index.html"; }, 600);
      })
      .catch(() => {
        if (btn) hideLoading(btn);
        showToast("Cannot reach the server.", "error");
      });
  }

  if (googleBtn && googleModal) {
    /* One-click demo Google sign-in — no typing needed */
    document.addEventListener("click", (e) => {
      const oc = e.target.closest("#google-oneclick");
      if (!oc || !googleBtn) return;
      const ts = Date.now();
      const nick = "student" + ts.toString().slice(-6);
      doDemoGoogle(`${nick}@gmail.com`, "Demo Google User", googleOneClick);
    });

    googleBtn.addEventListener("click", () => { googleModal.style.display = "grid"; });
    googleModalClose.addEventListener("click", () => { googleModal.style.display = "none"; });
    googleModal.addEventListener("click", (e) => { if (e.target === googleModal) googleModal.style.display = "none"; });

    googleSubmit.addEventListener("click", async () => {
      const name = (googleName ? googleName.value : "").trim();
      const email = (googleEmail ? googleEmail.value : "").trim();
      const msg = $("#login-msg");

      if (!name || name.length < 2) { showToast("Please enter your full name.", "error"); return; }
      if (!email || !email.includes("@")) { showToast("Please enter a valid email.", "error"); return; }

      showLoading(googleSubmit);
      await doDemoGoogle(email, name, googleSubmit);
    });
  }

  /* ── Redirect if already logged in ── */
  if (isLoggedIn()) { window.location.href = "index.html"; }

  /* ── Show session expired message ── */
  if (new URLSearchParams(window.location.search).get("expired") === "1") {
    showToast("Your session has expired. Please sign in again.", "warning");
  }
})();
