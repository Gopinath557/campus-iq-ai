/* ══════════════════════════════════════════════════════════════
   CampusIQ AI — Shared UI Utilities
   Toast notifications, loading states, atom avatar SVG,
   XSS-safe escaping, mobile menu.
   ══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── XSS-safe HTML escaping (including quotes & backticks) ── */
  window.escHtml = function (s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/`/g, "&#96;");
  };

  /* ── Toast Notifications ── */
  let toastContainer = null;

  function ensureToastContainer() {
    if (toastContainer) return toastContainer;
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
    return toastContainer;
  }

  window.showToast = function (message, type = "info") {
    const container = ensureToastContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${escHtml(type)}`;

    const icons = {
      success: "&#10003;",
      error: "&#10007;",
      info: "&#9432;",
      warning: "&#9888;",
    };

    toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${escHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) container.remove();
    }, 4000);
  };

  /* ── Button Loading State ── */
  window.showLoading = function (btn) {
    if (!btn) return;
    btn._originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';
  };

  window.hideLoading = function (btn) {
    if (!btn) return;
    btn.disabled = false;
    btn.innerHTML = btn._originalHTML || btn.innerHTML;
  };

  /* ── Atom Avatar SVG ── */
  window.createAtomAvatar = function (initial, size = "md") {
    const sizes = { sm: 32, md: 56, lg: 96 };
    const px = sizes[size] || 56;
    const fontSize = size === "sm" ? 12 : size === "lg" ? 32 : 22;
    const orbitScale = px / 56;

    return `
      <div class="atom-avatar" style="width:${px}px;height:${px}px">
        <svg width="${px}" height="${px}" viewBox="0 0 56 56">
          <defs>
            <linearGradient id="av-grad-${px}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#6366f1"/>
              <stop offset="100%" stop-color="#3b82f6"/>
            </linearGradient>
          </defs>
          <circle cx="28" cy="28" r="28" fill="url(#av-grad-${px})"/>
          <text x="28" y="28" text-anchor="middle" dominant-baseline="central"
                fill="#fff" font-family="Inter,system-ui,sans-serif"
                font-size="${fontSize}" font-weight="700">${escHtml(initial)}</text>
        </svg>
        <svg style="position:absolute;inset:${-6 * orbitScale}px;width:${px + 12 * orbitScale}px;height:${px + 12 * orbitScale}px;animation:orbit-spin 4s linear infinite;opacity:.4" viewBox="0 0 80 80">
          <ellipse cx="40" cy="40" rx="38" ry="14" fill="none" stroke="#6366f1" stroke-width="1.2" transform="rotate(-20 40 40)"/>
          <circle cx="78" cy="40" r="3" fill="#6366f1"/>
        </svg>
        <svg style="position:absolute;inset:${-6 * orbitScale}px;width:${px + 12 * orbitScale}px;height:${px + 12 * orbitScale}px;animation:orbit-spin 5s linear infinite reverse;opacity:.35" viewBox="0 0 80 80">
          <ellipse cx="40" cy="40" rx="36" ry="18" fill="none" stroke="#3b82f6" stroke-width="1.2" transform="rotate(40 40 40)"/>
          <circle cx="4" cy="40" r="2.5" fill="#3b82f6"/>
        </svg>
      </div>`;
  };

  /* ── Mobile Menu ── */
  window.initMobileMenu = function () {
    const topbar = document.querySelector(".topbar");
    if (!topbar) return;

    const existingBtn = topbar.querySelector(".mobile-menu-btn");
    if (existingBtn) return; /* already initialized */

    /* Create hamburger button */
    const btn = document.createElement("button");
    btn.className = "mobile-menu-btn";
    btn.setAttribute("aria-label", "Open menu");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    topbar.appendChild(btn);

    /* Create drawer */
    const drawer = document.createElement("div");
    drawer.className = "mobile-drawer";

    /* Collect nav links */
    const navLinks = topbar.querySelectorAll("nav a");
    let linksHTML = "";
    navLinks.forEach((a) => {
      linksHTML += `<a href="${a.getAttribute("href")}">${escHtml(a.textContent)}</a>`;
    });

    /* Add auth links */
    const authNav = topbar.querySelector(".auth-nav");
    if (authNav) {
      const authLinks = authNav.querySelectorAll("a");
      authLinks.forEach((a) => {
        linksHTML += `<a href="${a.getAttribute("href")}">${escHtml(a.textContent)}</a>`;
      });
    }

    drawer.innerHTML = `
      <div class="mobile-drawer-content">
        <button class="mobile-drawer-close" aria-label="Close menu">&times;</button>
        ${linksHTML}
      </div>`;

    document.body.appendChild(drawer);

    btn.addEventListener("click", () => drawer.classList.add("open"));
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer || e.target.classList.contains("mobile-drawer-close")) {
        drawer.classList.remove("open");
      }
    });
  };

  /* ── Topbar scroll effect ── */
  window.addEventListener("scroll", () => {
    const topbar = document.querySelector(".topbar");
    if (topbar) {
      topbar.classList.toggle("scrolled", window.scrollY > 10);
    }
  });

  /* ── Auto-init on DOM ready ── */
  function initUI() {
    initMobileMenu();

    /* Replace .avatar elements with atom avatars if they have data-initial */
    document.querySelectorAll(".avatar[data-initial]").forEach((el) => {
      const initial = el.getAttribute("data-initial") || "?";
      const size = el.getAttribute("data-size") || "md";
      el.outerHTML = createAtomAvatar(initial, size);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI);
  } else {
    initUI();
  }
})();
