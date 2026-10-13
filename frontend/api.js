/* ══════════════════════════════════════════════════════════════
   CampusIQ AI — API Helper
   Authenticated fetch, token management, topbar rendering.
   Depends on ui.js for escHtml().
   ══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const CAMPUSIQ_API = "http://127.0.0.1:8000/api/v1";
  const _TOKEN_KEY = "campusiq_token";
  const _USER_KEY = "campusiq_user";
  const _TOKEN_EXPIRY_KEY = "campusiq_token_expiry";

  function _getToken() { return localStorage.getItem(_TOKEN_KEY); }
  function _setToken(t, expiresInSeconds) {
    localStorage.setItem(_TOKEN_KEY, t);
    if (expiresInSeconds) {
      localStorage.setItem(_TOKEN_EXPIRY_KEY, String(Date.now() + expiresInSeconds * 1000));
    }
  }
  function _clearAuth() {
    localStorage.removeItem(_TOKEN_KEY);
    localStorage.removeItem(_USER_KEY);
    localStorage.removeItem(_TOKEN_EXPIRY_KEY);
  }
  function _isTokenExpired() {
    const expiry = localStorage.getItem(_TOKEN_EXPIRY_KEY);
    if (!expiry) return false;
    return Date.now() > Number(expiry);
  }

  /* ── Auth State ── */
  window.isLoggedIn = function () { return !!_getToken(); };
  window.getUser = function () { try { return JSON.parse(localStorage.getItem(_USER_KEY)); } catch { return null; } };
  window.logout = function () { _clearAuth(); window.location.href = "login.html"; };

  /* ── Core API Fetch ── */
  window.apiFetch = async function (path, options = {}) {
    if (_isTokenExpired()) { _clearAuth(); window.location.href = "login.html?expired=1"; return null; }
    const token = _getToken();
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${CAMPUSIQ_API}${path}`, { ...options, headers });
    if (res.status === 401) { _clearAuth(); window.location.href = "login.html?expired=1"; return null; }
    return res;
  };

  window.apiGet = function (path) { return apiFetch(path); };
  window.apiPost = function (path, body) { return apiFetch(path, { method: "POST", body: JSON.stringify(body) }); };
  window.apiPut = function (path, body) { return apiFetch(path, { method: "PUT", body: JSON.stringify(body) }); };
  window.apiDelete = function (path) { return apiFetch(path, { method: "DELETE" }); };

  /* ── Topbar Auth Render ── */
  window.renderAuthTopbar = function () {
    const nav = document.querySelector(".topbar nav");
    if (!nav) return;

    const existingAuth = nav.parentElement.querySelector(".auth-nav");
    if (existingAuth) existingAuth.remove();

    const authDiv = document.createElement("span");
    authDiv.className = "auth-nav";

    if (isLoggedIn()) {
      const user = getUser();
      const name = user ? user.full_name.split(" ")[0] : "Account";
      authDiv.innerHTML = `
        <span class="auth-greeting">Hi, ${escHtml(name)}</span>
        <a href="#" id="logout-btn" class="auth-link logout">Sign Out</a>`;
      nav.parentElement.appendChild(authDiv);
      document.querySelector("#logout-btn")?.addEventListener("click", (e) => { e.preventDefault(); logout(); });
    } else {
      authDiv.innerHTML = `<a href="login.html" class="auth-link">Sign In</a>`;
      nav.parentElement.appendChild(authDiv);
    }
  };

  /* ── Auto-init ── */
  function init() {
    renderAuthTopbar();
    if (typeof initMobileMenu === "function") initMobileMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
