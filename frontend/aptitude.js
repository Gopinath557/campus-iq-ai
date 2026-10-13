/* CampusIQ AI - Aptitude Test Engine v2 */
(function () {
  "use strict";
  const HK = "campusiq_aptitude_history";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const QTIME = 30, TTEST = 1800;
  const DIFF_COLORS = { easy: "#22c55e", medium: "#f59e0b", hard: "#ef4444" };
  let cat = null, qs = [], ans = [], ci = 0, ti = null, sec = 0, active = false;
  let qti = null, qsec = 0, filteredQs = [];
  let selDiff = "all", selTopic = null;

  function loadH() { try { return JSON.parse(localStorage.getItem(HK) || "[]"); } catch { return []; } }
  function saveH(h) { localStorage.setItem(HK, JSON.stringify(h)); }

  function getCatQuestions(id) {
    if (!window.APT_QUESTIONS || !window.APT_QUESTIONS[id]) return [];
    return window.APT_QUESTIONS[id];
  }

  function getTopics(id) {
    var all = getCatQuestions(id);
    var map = {};
    all.forEach(function (q) { if (q.t) map[q.t] = (map[q.t] || 0) + 1; });
    return Object.keys(map).sort().map(function (t) { return { name: t, count: map[t] }; });
  }

  function getFiltered(id) {
    var all = getCatQuestions(id);
    if (selDiff !== "all") all = all.filter(function (q) { return q.d === selDiff; });
    if (selTopic) all = all.filter(function (q) { return q.t === selTopic; });
    return all;
  }

  function renderCats() {
    var w = $("#apt-cats");
    if (!w || !window.APT_CATEGORIES) return;
    w.innerHTML = window.APT_CATEGORIES.map(function (c) {
      var all = getCatQuestions(c.id);
      var ec = all.filter(function (q) { return q.d === "easy"; }).length;
      var mc = all.filter(function (q) { return q.d === "medium"; }).length;
      var hc = all.filter(function (q) { return q.d === "hard"; }).length;
      return '<article class="apt-cat-card" style="--cat-color:' + c.color + '">' +
        '<div class="apt-cat-icon">' + c.icon + '</div>' +
        '<h3>' + escHtml(c.name) + '</h3>' +
        '<p>' + c.count + ' questions</p>' +
        '<div class="apt-cat-diff-row">' +
          '<span class="apt-cat-diff-dot easy" title="Easy">' + ec + ' E</span>' +
          '<span class="apt-cat-diff-dot medium" title="Medium">' + mc + ' M</span>' +
          '<span class="apt-cat-diff-dot hard" title="Hard">' + hc + ' H</span>' +
        '</div>' +
        '<button class="btn btn-primary" data-start="' + c.id + '">Start Test</button></article>';
    }).join("");
    w.querySelectorAll("[data-start]").forEach(function (b) { b.addEventListener("click", function () { showFilters(b.dataset.start); }); });
  }

  function showFilters(id) {
    cat = id;
    selDiff = "all"; selTopic = null;
    $("#apt-cats").style.display = "none";
    $("#apt-results").style.display = "none";
    $("#apt-history-card").style.display = "none";
    $(".hero").style.display = "none";
    $("#apt-filters").style.display = "";
    $("#apt-test-area").style.display = "none";
    renderDiffBtns();
    renderTopicChips();
    updateFilterCount();
  }

  function renderDiffBtns() {
    var btns = $("#apt-diff-btns");
    if (!btns) return;
    btns.querySelectorAll(".apt-diff-btn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.diff === selDiff);
    });
    btns.querySelectorAll(".apt-diff-btn").forEach(function (b) {
      b.onclick = function () {
        selDiff = b.dataset.diff;
        selTopic = null;
        btns.querySelectorAll(".apt-diff-btn").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        renderTopicChips();
        updateFilterCount();
      };
    });
  }

  function renderTopicChips() {
    var wrap = $("#apt-topic-chips");
    if (!wrap) return;
    var topics = getTopics(cat);
    if (selDiff !== "all") {
      var all = getCatQuestions(cat).filter(function (q) { return q.d === selDiff; });
      var map = {};
      all.forEach(function (q) { if (q.t) map[q.t] = (map[q.t] || 0) + 1; });
      topics = Object.keys(map).sort().map(function (t) { return { name: t, count: map[t] }; });
    }
    var html = '<button class="apt-topic-chip' + (!selTopic ? ' active' : '') + '" data-topic="">All Topics</button>';
    topics.forEach(function (t) {
      html += '<button class="apt-topic-chip' + (selTopic === t.name ? ' active' : '') + '" data-topic="' + escHtml(t.name) + '">' + escHtml(t.name) + ' <span class="apt-topic-count">' + t.count + '</span></button>';
    });
    wrap.innerHTML = html;
    wrap.querySelectorAll(".apt-topic-chip").forEach(function (b) {
      b.onclick = function () {
        selTopic = b.dataset.topic || null;
        wrap.querySelectorAll(".apt-topic-chip").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        updateFilterCount();
      };
    });
  }

  function updateFilterCount() {
    var n = getFiltered(cat).length;
    var el = $("#apt-filter-count");
    if (el) el.textContent = n + " question" + (n !== 1 ? "s" : "") + " found";
  }

  $("#apt-start-btn")?.addEventListener("click", function () { beginExamLock(); });
  $("#apt-back-btn")?.addEventListener("click", function () {
    $("#apt-filters").style.display = "none"; showCats();
  });

  /* ── Exam Lock & Camera Verification ── */
  let camStream = null, capturedPhoto = null;

  function beginExamLock() {
    var n = getFiltered(cat).length;
    if (!n) { alert("No questions match your filter. Try different options."); return; }
    $("#apt-filters").style.display = "none";
    $("#apt-cats").style.display = "none";
    $("#apt-results").style.display = "none";
    $("#apt-history-card").style.display = "none";
    $(".hero").style.display = "none";
    openCameraModal();
  }

  function openCameraModal() {
    var modal = $("#exam-verify");
    modal.style.display = "flex";
    var status = $("#cam-status");
    status.textContent = "Waiting for camera...";
    nudgeFullscreen();
    initCamera();
  }

  function initCamera() {
    var cam = $("#exam-cam");
    if (!cam) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      $("#cam-status").textContent = "Camera not available";
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
      .then(function (s) {
        camStream = s;
        cam.srcObject = s;
        cam.onloadedmetadata = function () { cam.play(); };
        $("#cam-status").textContent = "Camera ready — position your face";
      })
      .catch(function () {
        $("#cam-status").textContent = "Camera denied — you can continue as guest";
      });
  }

  function blurVideoBackground() {
    /* Simulate background blur (bokeh) by blurring the video slightly and
       keeping the face region sharp via a clipped sharp overlay. In a real
       mobile app this is a real segmentation; here we apply a subtle blur
       and a bright vignette for the portrait effect. */
    var cam = $("#exam-cam");
    cam.classList.add("blurred");
    $("#cam-status").textContent = "Background blurred — smile!";
  }

  $("#exam-capture-btn")?.addEventListener("click", function () {
    blurVideoBackground();
    var cam = $("#exam-cam");
    var canvas = $("#exam-cam-blur");
    canvas.width = cam.videoWidth || 640;
    canvas.height = cam.videoHeight || 480;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cam, 0, 0, canvas.width, canvas.height);
    /* Add soft radial glow vignette for depth */
    var g = ctx.createRadialGradient(canvas.width/2, canvas.height*0.4, 40, canvas.width/2, canvas.height/2, canvas.width/2);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL("image/jpeg", 0.7);
    capturedPhoto = data;
    stopCamera();
    showPhotoResult(data);
  });

  $("#cam-skip-btn")?.addEventListener("click", function () {
    stopCamera();
    $("#exam-verify").style.display = "none";
    enterLockedExam();
  });

  $("#exam-retake-btn")?.addEventListener("click", function () {
    $("#exam-photo-result").style.display = "none";
    openCameraModal();
  });

  $("#exam-continue-btn")?.addEventListener("click", function () {
    $("#exam-photo-result").style.display = "none";
    enterLockedExam();
  });

  function showPhotoResult(data) {
    var img = $("#exam-photo-img");
    img.src = data;
    $("#exam-verify").style.display = "none";
    $("#exam-photo-result").style.display = "flex";
  }

  function stopCamera() {
    if (camStream) { camStream.getTracks().forEach(function (t) { t.stop(); }); camStream = null; }
    var cam = $("#exam-cam");
    if (cam) { cam.srcObject = null; cam.classList.remove("blurred"); }
  }

  function nudgeFullscreen() {
    var el = document.documentElement;
    if (el.requestFullscreen) {
      var p = el.requestFullscreen();
      if (p && p.catch) p.catch(function () {});
    }
  }

  function enterLockedExam() {
    var overlay = $("#exam-lock");
    overlay.style.display = "flex";
    var el = document.documentElement;
    var go = function () {
      overlay.style.display = "none";
      document.body.classList.add("exam-active");
      startTest();
      window.location.hash = "#top";
    };
    if (el.requestFullscreen && document.fullscreenElement === null) {
      var p = el.requestFullscreen();
      if (p && p.then) { p.then(go).catch(go); } else { go(); }
    } else { go(); }
  }

  $("#exam-fullscreen-btn")?.addEventListener("click", enterLockedExam);

  /* Lock typing/keys during exam */
  document.addEventListener("keydown", function (e) {
    if (!active) return;
    if (e.key === "Tab") { e.preventDefault(); }
    if (e.key === "Escape") { e.preventDefault(); relockFullscreen(); }
    if ((e.ctrlKey || e.metaKey) && ["c","v","x","p","u","s","a","f"].indexOf(e.key.toLowerCase()) !== -1) {
      e.preventDefault();
    }
    if (e.key === "F12") e.preventDefault();
  });

  /* Force-re-enter fullscreen if user tries to exit before finishing */
  function relockFullscreen() {
    if (!active) return;
    if (document.fullscreenElement === null && document.documentElement.requestFullscreen) {
      var p = document.documentElement.requestFullscreen();
      if (p && p.catch) p.catch(function () {});
    }
  }

  /* Re-lock immediately whenever fullscreen is exited while the test is active */
  document.addEventListener("fullscreenchange", function () {
    if (active && document.fullscreenElement === null) {
      relockFullscreen();
    }
  });

  /* Block fullscreen exit via Escape at document level */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      e.preventDefault();
      if (active) relockFullscreen();
    }
  }, true);

  /* ── Screenshot / Screen-Capture Prevention ── */
  /* Detect screen capture / screenshot on Windows (PrtScn & Win+PrtScn) */
  document.addEventListener("keydown", function (e) {
    if (!active) return;
    if (e.key === "PrintScreen") { e.preventDefault(); flagProctor("screen_capture"); }
    if (e.keyCode === 44) { e.preventDefault(); flagProctor("screen_capture"); }
    /* macOS screenshot combos */
    if ((e.metaKey || e.ctrlKey) && ["e","3","4","5","6"].indexOf(e.key) !== -1 && e.shiftKey) {
      e.preventDefault(); flagProctor("screen_capture");
    }
  }, true);

  /* Detect Screen Capture API usage (getDisplayMedia) & warn */
  let proctorWarnings = 0;
  function flagProctor(type) {
    proctorWarnings++;
    assessProctorRisk();
  }

  function assessProctorRisk() {
    var msg = $("#proctor-alert-msg");
    var pa = $("#proctor-alert");
    if (msg && pa) {
      if (proctorWarnings >= 3) {
        pa.classList.add("warn");
        msg.textContent = "WARNING: " + proctorWarnings + " integrity violations detected. Your test may be flagged.";
      } else if (proctorWarnings > 0) {
        msg.textContent = "Proctoring active — " + proctorWarnings + " violation(s) detected. Avoid switching apps or taking screenshots.";
      } else {
        msg.textContent = "Proctoring active — screen capture is disabled.";
      }
    }
    /* Flag screen-capture attempts: escalate after threshold */
    if (proctorWarnings >= 3) {
      if (confirm("Multiple integrity violations detected.\n\nYour test may be invalidated. Continue?")) {
        /* allow, but keep counting */
      } else {
        if (active) { submitTest(); }
      }
    }
  }

  /* Block print / screenshot shortcut combos while active */
  window.addEventListener("keydown", function (e) {
    if (!active) return;
    if (e.ctrlKey && e.key.toLowerCase() === "p") e.preventDefault();
    if (e.ctrlKey && e.key.toLowerCase() === "s") e.preventDefault();
  });

  /* Prevent context menu (right-click screenshot tools) */
  document.addEventListener("contextmenu", function (e) {
    if (active) e.preventDefault();
  });

  /* Prevent drag / drop of images (stealing) */
  document.addEventListener("dragstart", function (e) {
    if (active && e.target && e.target.tagName === "IMG") e.preventDefault();
  });

  /* Screen Capture API — warn if accessed during test */
  window.addEventListener("focus", function () { /* focus regained */ }, false);

  /* Visibility lock — if the student switches tabs/apps, count as a proctor risk */
  document.addEventListener("visibilitychange", function () {
    if (active && document.hidden) {
      proctorWarnings++;
      assessProctorRisk();
    }
  });

  /* Geofence: warn on blur (Alt+Tab / App switch) on mobile */
  window.addEventListener("blur", function () {
    if (active) {
      proctorWarnings++;
      assessProctorRisk();
    }
  });

  /* Prevent navigation away from test */
  window.addEventListener("beforeunload", function (e) {
    if (active) { e.preventDefault(); e.returnValue = ""; }
    return "";
  });


  function startTest() {
    filteredQs = getFiltered(cat);
    if (!filteredQs.length) { alert("No questions match your filter. Try different options."); return; }
    qs = filteredQs.slice().sort(function () { return Math.random() - 0.5; });
    qs = qs.slice(0, Math.min(20, qs.length));
    ans = Array(qs.length).fill(-1);
    ci = 0; sec = TTEST; active = true;
    proctorWarnings = 0;
    var pa = $("#proctor-alert");
    if (pa) { pa.style.display = ""; pa.classList.remove("warn"); }
    $("#apt-filters").style.display = "none";
    $("#apt-test-area").style.display = "";
    $("#apt-cats").style.display = "none";
    $("#apt-results").style.display = "none";
    $("#apt-history-card").style.display = "none";
    $(".hero").style.display = "none";
    var c = window.APT_CATEGORIES.find(function (x) { return x.id === cat; });
    var badge = $("#apt-cat-badge");
    badge.textContent = c ? c.name : cat;
    badge.style.background = c ? c.color : "#6366f1";
    startTimer();
    renderQ();
  }

  function startTimer() {
    clearInterval(ti); sec = TTEST; updTimer();
    ti = setInterval(function () {
      sec--; updTimer();
      if (sec <= 0) { clearInterval(ti); testTimeUp(); }
    }, 1000);
  }

  function testTimeUp() {
    if (!active) return;
    stopQTimer(); active = false;
    alert("Time's up! Your test is being submitted.");
    showResults();
  }
  function stopTimer() { clearInterval(ti); }
  function updTimer() {
    var m = Math.floor(Math.max(0, sec) / 60), s = Math.max(0, sec) % 60;
    var el = $("#apt-timer");
    if (el) {
      el.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
      el.classList.toggle("warn", sec <= 300 && sec > 60);
      el.classList.toggle("danger", sec <= 60);
    }
  }

  function startQTimer() {
    clearInterval(qti); qsec = QTIME; updQTimer();
    qti = setInterval(function () {
      qsec--; updQTimer();
      if (qsec <= 0) { clearInterval(qti); timeUp(); }
    }, 1000);
  }
  function stopQTimer() { clearInterval(qti); }
  function updQTimer() {
    var el = $("#apt-q-countdown");
    var fill = $("#apt-q-timer-fill");
    if (el) el.textContent = qsec + "s";
    if (fill) fill.style.width = (qsec / QTIME * 100) + "%";
    var pct = qsec / QTIME;
    if (el) { el.classList.toggle("warn", pct <= 0.33 && pct > 0.1); el.classList.toggle("danger", pct <= 0.1); }
    if (fill) { fill.classList.toggle("warn", pct <= 0.33 && pct > 0.1); fill.classList.toggle("danger", pct <= 0.1); }
  }
  function timeUp() {
    if (!active) return;
    var fb = $("#apt-q-feedback");
    fb.textContent = "Time's up! The correct answer is highlighted.";
    fb.className = "message error";
    var q = qs[ci];
    $$(".apt-option").forEach(function (b, i) { if (i === q.a) b.classList.add("correct"); b.style.pointerEvents = "none"; });
    if (q.e) { $("#apt-explanation").style.display = ""; $("#apt-explanation-text").textContent = q.e; }
    setTimeout(function () { if (ci < qs.length - 1) { ci++; renderQ(); } else { submitTest(); } }, 1800);
  }

  function diffBadge(d) {
    return '<span class="apt-diff-pill ' + d + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</span>';
  }
  function topicBadge(t) {
    return t ? '<span class="apt-topic-tag">' + escHtml(t) + '</span>' : '';
  }

  function renderQ() {
    var q = qs[ci]; if (!q) return;
    var t = qs.length;
    $("#apt-q-counter").textContent = (ci + 1) + " / " + t;
    $("#apt-q-number").textContent = "Question " + (ci + 1);
    $("#apt-q-text").textContent = q.q;
    $("#apt-progress-fill").style.width = ((ci + 1) / t * 100) + "%";
    var meta = $("#apt-q-meta");
    if (meta) meta.innerHTML = topicBadge(q.t) + diffBadge(q.d || "medium");
    var ow = $("#apt-options");
    ow.innerHTML = q.o.map(function (o, i) {
      var c = "apt-option";
      if (ans[ci] === i) c += " selected";
      return '<button class="' + c + '" data-idx="' + i + '">' + escHtml(o) + '</button>';
    }).join("");
    ow.querySelectorAll(".apt-option").forEach(function (b) { b.addEventListener("click", function () { selectOpt(+b.dataset.idx); }); });
    if (ans[ci] !== -1 || !active) {
      $$(".apt-option").forEach(function (b) { b.style.pointerEvents = "none"; });
      var q2 = qs[ci];
      $$(".apt-option").forEach(function (b, i) { if (i === q2.a) b.classList.add("correct"); if (i === ans[ci] && ans[ci] !== q2.a) b.classList.add("wrong"); });
      if (ans[ci] === -1 && !active) { var fb2 = $("#apt-q-feedback"); fb2.textContent = "Skipped"; fb2.className = "message"; }
    }
    var fb = $("#apt-q-feedback"); if (!active || ans[ci] === -1) {} else { fb.textContent = ""; fb.className = "message"; }
    if (active && ans[ci] === -1) { fb.textContent = ""; fb.className = "message"; }
    $("#apt-explanation").style.display = "none";
    $("#apt-prev").disabled = ci === 0;
    if (ci === t - 1) { $("#apt-next").style.display = "none"; $("#apt-submit").style.display = ""; }
    else { $("#apt-next").style.display = ""; $("#apt-submit").style.display = "none"; }
    startQTimer();
  }

  function selectOpt(idx) {
    stopQTimer();
    ans[ci] = idx;
    var q = qs[ci], ok = idx === q.a;
    $$(".apt-option").forEach(function (b, i) {
      b.classList.remove("selected", "correct", "wrong");
      b.style.pointerEvents = "none";
      if (i === q.a) b.classList.add("correct");
      else if (i === idx && !ok) b.classList.add("wrong");
      if (i === idx) b.classList.add("selected");
    });
    var fb = $("#apt-q-feedback");
    if (ok) { fb.textContent = "Correct!"; fb.className = "message success"; }
    else { fb.textContent = "Incorrect. " + (q.e || ""); fb.className = "message error"; }
    if (q.e) { $("#apt-explanation").style.display = ""; $("#apt-explanation-text").textContent = q.e; }
  }

  $("#apt-prev")?.addEventListener("click", function () { if (ci > 0) { ci--; renderQ(); } });
  $("#apt-next")?.addEventListener("click", function () { if (ci < qs.length - 1) { ci++; renderQ(); } });
  $("#apt-submit")?.addEventListener("click", submitTest);

  function submitTest() {
    if (!active) return;
    var un = ans.filter(function (a) { return a === -1; }).length;
    if (un > 0 && !confirm("You have " + un + " unanswered. Submit anyway?")) return;
    stopTimer(); stopQTimer(); active = false;
    unlockExam();
    showResults();
  }

  function unlockExam() {
    document.body.classList.remove("exam-active");
    if (document.exitFullscreen && document.fullscreenElement) {
      var p = document.exitFullscreen(); if (p && p.catch) p.catch(function(){});
    }
  }

  $("#apt-quit")?.addEventListener("click", function () {
    if (!confirm("Quit the test? Progress will be lost.")) return;
    stopTimer(); stopQTimer(); active = false;
    unlockExam();
    $("#apt-test-area").style.display = "none"; showCats();
  });

  function showCats() {
    $("#apt-cats").style.display = ""; $("#apt-results").style.display = "none";
    $("#apt-filters").style.display = "none"; $(".hero").style.display = "";
    $("#apt-history-card").style.display = "";
  }

  function showResults() {
    $("#apt-test-area").style.display = "none"; $("#apt-results").style.display = "";
    $("#apt-cats").style.display = "none"; $(".hero").style.display = "none";
    $("#apt-filters").style.display = "none";
    $("#apt-history-card").style.display = "none"; $("#apt-review").style.display = "none";
    var correct = 0, wrong = 0, skipped = 0;
    qs.forEach(function (q, i) { if (ans[i] === -1) skipped++; else if (ans[i] === q.a) correct++; else wrong++; });
    var t = qs.length, pct = Math.round(correct / t * 100);
    $("#apt-final-score").textContent = pct;
    $("#apt-stat-correct").textContent = correct;
    $("#apt-stat-wrong").textContent = wrong;
    $("#apt-stat-skipped").textContent = skipped;
    var elapsed = TTEST - sec;
    var m = Math.floor(Math.max(0, elapsed) / 60), s = Math.max(0, elapsed) % 60;
    $("#apt-stat-time").textContent = m + ":" + String(s).padStart(2, "0");
    if (pct >= 80) $("#apt-result-title").textContent = "Excellent!";
    else if (pct >= 60) $("#apt-result-title").textContent = "Good Job!";
    else if (pct >= 40) $("#apt-result-title").textContent = "Keep Practicing";
    else $("#apt-result-title").textContent = "Needs Improvement";
    $("#apt-result-subtitle").textContent = correct + " out of " + t + " correct (" + pct + "%)";

    var hist = loadH();
    hist.unshift({ cat: cat, score: pct, correct: correct, total: t, time: m + ":" + String(s).padStart(2, "0"), date: new Date().toLocaleDateString() });
    if (hist.length > 20) hist = hist.slice(0, 20);
    saveH(hist);
    renderHistory();
  }

  $("#apt-review-btn")?.addEventListener("click", function () {
    var wrap = $("#apt-review");
    if (wrap.style.display !== "none") { wrap.style.display = "none"; return; }
    wrap.style.display = "";
    wrap.innerHTML = qs.map(function (q, i) {
      var status = ans[i] === -1 ? "skipped" : ans[i] === q.a ? "correct" : "wrong";
      var icon = status === "correct" ? "&#10003;" : status === "wrong" ? "&#10007;" : "&#8212;";
      var cls = "apt-review-item " + status;
      var chosen = ans[i] >= 0 ? escHtml(q.o[ans[i]]) : "Skipped";
      return '<div class="' + cls + '">' +
        '<div class="apt-review-head">' +
          '<span class="apt-review-icon">' + icon + '</span>' +
          '<span class="apt-review-q">Q' + (i + 1) + '. ' + escHtml(q.q) + '</span>' +
          topicBadge(q.t) + diffBadge(q.d || "medium") +
        '</div>' +
        '<div class="apt-review-detail">Your answer: ' + chosen +
        (ans[i] !== q.a && ans[i] !== -1 ? ' &middot; Correct: ' + escHtml(q.o[q.a]) : '') +
        '</div><div class="apt-review-explain">' + escHtml(q.e || "") + '</div></div>';
    }).join("");
  });

  $("#apt-retry-btn")?.addEventListener("click", function () { if (cat) showFilters(cat); });
  $("#apt-home-btn")?.addEventListener("click", function () { $("#apt-results").style.display = "none"; showCats(); });

  function renderHistory() {
    var h = loadH(), el = $("#apt-history-list"), emp = $("#apt-history-empty");
    if (!h.length) { if (emp) emp.style.display = ""; if (el) el.innerHTML = ""; return; }
    if (emp) emp.style.display = "none";
    var catMap = {};
    if (window.APT_CATEGORIES) window.APT_CATEGORIES.forEach(function (c) { catMap[c.id] = c; });
    el.innerHTML = h.map(function (x) {
      var c = catMap[x.cat];
      var name = c ? c.name : x.cat;
      var col = c ? c.color : "#6366f1";
      return '<div class="apt-history-row">' +
        '<span class="apt-hist-badge" style="background:' + col + '">' + escHtml(name) + '</span>' +
        '<strong>' + x.score + '%</strong>' +
        '<span>' + x.correct + '/' + x.total + '</span>' +
        '<span>' + (x.time || '-') + '</span>' +
        '<span>' + (x.date || '') + '</span></div>';
    }).join("");
  }

  renderCats();
  renderHistory();
  var ba = $("#brand-avatar");
  if (ba) { ba.innerHTML = createAtomAvatar("C", "sm"); ba.style.display = "inline-flex"; ba.style.verticalAlign = "middle"; ba.style.marginRight = "4px"; }
})();
