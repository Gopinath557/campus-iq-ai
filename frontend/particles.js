/* ══════════════════════════════════════════════════════════════
   CampusIQ AI — Compound Atom Rotation Particle System
   Full-page canvas background with compound-rotating atoms,
   multiple electron orbits at different planes, and
   dynamic molecular bonds between nearby particles.
   ══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  let W, H;
  let mouse = { x: -9999, y: -9999 };
  let particles = [];
  let animId;
  let time = 0;

  /* ── Config ── */
  const CFG = {
    count:          50,
    countMobile:    22,
    connectionDist: 140,
    mouseRepel:     100,
    mouseForce:     0.35,
    nucleusColors: [
      [99, 102, 241],   /* indigo */
      [59, 130, 246],   /* blue */
      [139, 92, 246],   /* violet */
      [79, 70, 229],    /* deep indigo */
    ],
    electronColors: [
      [129, 140, 248],  /* light indigo */
      [99, 102, 241],   /* indigo */
      [139, 92, 246],   /* violet */
      [168, 85, 247],   /* purple */
      [59, 130, 246],   /* blue */
    ],
  };

  /* ── Resize ── */
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  /* ── Particle (Compound Atom) ── */
  class Particle {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;

      /* Nucleus */
      this.radius = Math.random() * 3 + 2;
      this.nucleusColor = CFG.nucleusColors[Math.floor(Math.random() * CFG.nucleusColors.length)];
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.008 + Math.random() * 0.012;

      /* Compound orbiting electrons: always 2-3 orbits at different planes */
      this.orbits = [];
      const orbitCount = 2 + Math.floor(Math.random() * 2); /* 2 or 3 */
      for (let i = 0; i < orbitCount; i++) {
        this.orbits.push({
          rx:       this.radius + 10 + i * 8 + Math.random() * 6,
          ry:       this.radius + 4 + i * 3 + Math.random() * 4,
          angle:    Math.random() * Math.PI * 2,
          speed:    (0.012 + Math.random() * 0.02) * (i % 2 === 0 ? 1 : -1),
          /* Compound rotation: each orbit tilts on a different axis */
          tiltX:    Math.random() * Math.PI * 2,
          tiltXSpd: (Math.random() - 0.5) * 0.006,
          tiltZ:    Math.random() * Math.PI * 2,
          tiltZSpd: (Math.random() - 0.5) * 0.004,
          /* Precession: orbit plane slowly wobbles */
          precAngle:    Math.random() * Math.PI * 2,
          precSpeed:    (Math.random() - 0.5) * 0.003,
          colorIdx: Math.floor(Math.random() * CFG.electronColors.length),
          electronR: 1.8 + Math.random() * 1.2,
          trail:    [],
        });
      }

      this.chain = null;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      /* Mouse repel */
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CFG.mouseRepel && dist > 0) {
        const force = (1 - dist / CFG.mouseRepel) * CFG.mouseForce;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }

      this.vx *= 0.997;
      this.vy *= 0.997;

      /* Wrap edges */
      if (this.x < -40) this.x = W + 40;
      if (this.x > W + 40) this.x = -40;
      if (this.y < -40) this.y = H + 40;
      if (this.y > H + 40) this.y = -40;

      /* Compound orbit update */
      for (const o of this.orbits) {
        o.angle += o.speed;
        o.tiltX += o.tiltXSpd;
        o.tiltZ += o.tiltZSpd;
        o.precAngle += o.precSpeed;

        /* Store electron trail for glow streak */
        const cosP = Math.cos(o.precAngle);
        const sinP = Math.sin(o.precAngle);
        const cosT = Math.cos(o.tiltX);
        const sinT = Math.sin(o.tiltX);

        /* 3D compound rotation -> 2D projection */
        const rawEx = Math.cos(o.angle) * o.rx;
        const rawEy = Math.sin(o.angle) * o.ry;

        /* Apply tilt around X axis */
        const y1 = rawEy * cosT;
        const z1 = rawEy * sinT;

        /* Apply precession rotation around Z axis */
        const x2 = rawEx * cosP - y1 * sinP;
        const y2 = rawEx * sinP + y1 * cosP;
        const z2 = z1;

        /* Tilt around the orbit's own Z axis */
        const cosTz = Math.cos(o.tiltZ * 0.3);
        const sinTz = Math.sin(o.tiltZ * 0.3);
        const x3 = x2 * cosTz - y2 * sinTz;
        const y3 = x2 * sinTz + y2 * cosTz;

        /* Store 2D projected position + depth for size scaling */
        o._ex = x3;
        o._ey = y3;
        o._depth = 0.7 + (z2 + o.ry) / (o.ry * 2) * 0.6;

        /* Trail */
        o.trail.push({ x: this.x + x3, y: this.y + y3, alpha: 1 });
        if (o.trail.length > 12) o.trail.shift();
        for (const t of o.trail) t.alpha *= 0.82;
      }

      this.pulsePhase += this.pulseSpeed;
    }

    draw() {
      const pulse = 0.7 + Math.sin(this.pulsePhase) * 0.3;
      const c = this.nucleusColor;

      /* Draw orbit trails first (behind everything) */
      for (const o of this.orbits) {
        if (o.trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(o.trail[0].x, o.trail[0].y);
          for (let i = 1; i < o.trail.length; i++) {
            ctx.lineTo(o.trail[i].x, o.trail[i].y);
          }
          const ec = CFG.electronColors[o.colorIdx];
          ctx.strokeStyle = `rgba(${ec[0]},${ec[1]},${ec[2]},${0.06 * pulse})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      /* Draw compound orbit rings (3D projected as ellipses) */
      for (const o of this.orbits) {
        const ec = CFG.electronColors[o.colorIdx];

        /* Compute apparent ellipse from 3D tilt+precession */
        ctx.save();
        ctx.translate(this.x, this.y);

        /* Rotate to match compound tilt */
        const tiltAngle = Math.atan2(
          Math.sin(o.tiltX) * Math.cos(o.precAngle),
          Math.cos(o.tiltX)
        );
        const scaleY = 0.25 + 0.25 * Math.abs(Math.cos(o.tiltX)) * Math.abs(Math.cos(o.precAngle));

        ctx.rotate(tiltAngle * 0.4);
        ctx.scale(1, Math.max(0.15, scaleY));

        /* Orbit ellipse */
        ctx.beginPath();
        ctx.ellipse(0, 0, o.rx, o.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ec[0]},${ec[1]},${ec[2]},${0.1 * pulse})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        ctx.restore();

        /* Electron dot with depth-based size */
        if (o._ex !== undefined) {
          const depthScale = o._depth || 1;
          const ex = this.x + o._ex;
          const ey = this.y + o._ey;
          const eR = o.electronR * depthScale;

          /* Electron glow */
          const glowGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, eR + 6);
          glowGrad.addColorStop(0, `rgba(${ec[0]},${ec[1]},${ec[2]},${0.4 * pulse})`);
          glowGrad.addColorStop(1, `rgba(${ec[0]},${ec[1]},${ec[2]},0)`);
          ctx.beginPath();
          ctx.arc(ex, ey, eR + 6, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          /* Electron dot */
          ctx.beginPath();
          ctx.arc(ex, ey, eR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ec[0]},${ec[1]},${ec[2]},${0.85 * pulse})`;
          ctx.fill();
        }
      }

      /* Nucleus glow */
      const glowGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 5);
      glowGrad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${0.12 * pulse})`);
      glowGrad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      /* Nucleus core */
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.35 * pulse})`;
      ctx.fill();

      /* Nucleus bright center */
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.7 * pulse})`;
      ctx.fill();
    }
  }

  /* ── Initialize ── */
  function init() {
    const count = window.innerWidth < 768 ? CFG.countMobile : CFG.count;
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  /* ── Draw Molecular Bonds ── */
  function drawBonds() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CFG.connectionDist) {
          const alpha = (1 - dist / CFG.connectionDist) * 0.1;

          /* Bond line */
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();

          /* Bond midpoint node (molecular feel) */
          if (dist < CFG.connectionDist * 0.55) {
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            ctx.beginPath();
            ctx.arc(mx, my, 1.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99,102,241,${alpha * 2})`;
            ctx.fill();
          }
        }
      }
    }
  }

  /* ── Animation Loop ── */
  function loop() {
    time += 0.016;
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.update();
    }

    drawBonds();

    for (const p of particles) {
      p.draw();
    }

    animId = requestAnimationFrame(loop);
  }

  /* ── Mouse Tracking ── */
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  /* ── Pause when tab hidden ── */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      loop();
    }
  });

  /* ── Start ── */
  init();
  loop();
})();
