/* ============================================================
   AARAV SHARMA — PORTFOLIO
   script.js — all interactivity, vanilla JS, ES6+, no deps
   ============================================================ */

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. PRELOADER
     --------------------------------------------------------- */
  function initPreloader() {
    const preloader = document.getElementById("preloader");
    const textEl = document.getElementById("preloaderText");
    const progressEl = document.getElementById("preloaderProgress");
    if (!preloader) return;

    const message = "booting portfolio...";
    let i = 0;
    let pct = 0;

    const typeInterval = setInterval(() => {
      if (i < message.length) {
        textEl.textContent += message[i];
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 35);

    const progressInterval = setInterval(() => {
      pct = Math.min(100, pct + Math.random() * 18);
      progressEl.style.width = pct + "%";
      if (pct >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          preloader.classList.add("is-hidden");
          document.body.style.overflow = "";
        }, 250);
      }
    }, 180);

    document.body.style.overflow = "hidden";

    // safety net: never trap the user behind the preloader
    setTimeout(() => {
      preloader.classList.add("is-hidden");
      document.body.style.overflow = "";
    }, 3200);
  }

  /* ---------------------------------------------------------
     2. CUSTOM CURSOR
     --------------------------------------------------------- */
  function initCursor() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactive = "a, button, input, textarea, .skill-card, .project-card, .filter-btn";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(interactive)) ring.classList.add("is-active");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(interactive)) ring.classList.remove("is-active");
    });
  }

  /* ---------------------------------------------------------
     3. PARTICLE BACKGROUND (hero canvas)
     --------------------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      const count = reducedMotion ? 0 : Math.min(70, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        hue: Math.random() > 0.5 ? "0,230,246" : "168,85,247",
        alpha: Math.random() * 0.5 + 0.2,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }

    resize();
    createParticles();
    if (!reducedMotion) tick();
    window.addEventListener("resize", () => { resize(); createParticles(); });
  }

  /* ---------------------------------------------------------
     4. NAVBAR — scroll state, active link, mobile menu
     --------------------------------------------------------- */
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    const burger = document.getElementById("navBurger");
    const links = document.getElementById("navLinks");
    const navlinks = document.querySelectorAll(".navlink");
    const sections = document.querySelectorAll("main section[id]");

    function onScroll() {
      navbar.classList.toggle("is-scrolled", window.scrollY > 40);

      // scroll progress bar
      const progress = document.getElementById("scrollProgress");
      if (progress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        progress.style.width = pct + "%";
      }

      // back to top visibility
      const backToTop = document.getElementById("backToTop");
      if (backToTop) backToTop.style.opacity = window.scrollY > 600 ? "1" : "0";

      // active section highlight
      let current = "";
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 120) current = sec.id;
      });
      navlinks.forEach((a) => a.classList.toggle("is-active", a.dataset.section === current));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    burger?.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navlinks.forEach((a) => a.addEventListener("click", () => {
      links.classList.remove("is-open");
      burger?.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------------------------------------------------------
     5. THEME TOGGLE (dark / light) — in-memory only
     --------------------------------------------------------- */
  function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      document.documentElement.setAttribute("data-theme", isLight ? "dark" : "light");
      toggle.setAttribute("aria-pressed", String(!isLight));
    });
  }

  /* ---------------------------------------------------------
     6. TYPING ANIMATION (hero role line)
     --------------------------------------------------------- */
  function initTypingAnimation() {
    const el = document.getElementById("typedRole");
    if (!el) return;
    const roles = [
      "Python Developer",
      "Backend Engineer",
      "AI / ML Enthusiast",
      "Automation Specialist",
      "Open Source Contributor",
    ];
    if (reducedMotion) { el.textContent = roles[0]; return; }

    let roleIndex = 0, charIndex = 0, deleting = false;

    function step() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(step, 1400);
          return;
        }
        setTimeout(step, 65);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(step, 300);
          return;
        }
        setTimeout(step, 35);
      }
    }
    step();
  }

  /* ---------------------------------------------------------
     7. SCROLL REVEAL (IntersectionObserver)
     --------------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      ".section__eyebrow, .section__title, .reveal"
    );
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach((t) => observer.observe(t));
  }

  /* ---------------------------------------------------------
     8. DATA
     --------------------------------------------------------- */
  const SKILLS = [
    { name: "Python", level: 92, abbr: "Py" },
    { name: "HTML", level: 90, abbr: "H5" },
    { name: "CSS", level: 85, abbr: "C3" },
    { name: "JavaScript", level: 78, abbr: "Js" },
    { name: "SQL", level: 80, abbr: "SQ" },
    { name: "MySQL", level: 78, abbr: "My" },
    { name: "Git", level: 88, abbr: "Gi" },
    { name: "GitHub", level: 88, abbr: "Gh" },
    { name: "Flask", level: 82, abbr: "Fl" },
    { name: "Django", level: 75, abbr: "Dj" },
    { name: "React", level: 0, abbr: "Re", soon: true },
    { name: "AI & ML", level: 70, abbr: "AI" },
    { name: "Data Structures", level: 84, abbr: "DS" },
    { name: "OOP", level: 87, abbr: "OO" },
  ];

  const PROJECTS = [
    { title: "Employee Salary Prediction", cat: "ai", desc: "Developed a machine learning application using Python, Pandas, and Scikit-learn to predict employee salaries based on age, experience, education, department, city, and previous salary. Built a Random Forest Regression model and integrated it with FastAPI to provide salary predictions through a web interface.", stack: ["Python, Pandas, Scikit-learn, Random Forest, FastAPI, HTML, CSS, JavaScript"], features: ["Salary prediction","Employee data analysis","ML model evaluation","FastAPI integration","Interactive web UI"] },
    { title: "Movie Ticket Booking System", cat: "web", desc: "Full-stack booking platform with seat selection and payment simulation.", stack: ["Django", "PostgreSQL", "JS"], features: ["Interactive seat map", "Booking history", "Email confirmation"] },
    { title: "Voice Assistant", cat: "desktop", desc: "Desktop voice assistant that handles tasks, reminders, and web queries via speech.", stack: ["Python", "SpeechRecognition", "pyttsx3"], features: ["Voice commands", "Task automation", "Offline fallback mode"] },
    { title: "Hospital Management System", cat: "web", desc: "Patient records, appointment scheduling, and billing in one dashboard.", stack: ["Flask", "MySQL", "Bootstrap"], features: ["Role-based access", "Appointment calendar", "Invoice generation"] },
    { title: "Bus Reservation System", cat: "web", desc: "Seat booking and route management system for a regional bus operator.", stack: ["Django", "SQLite", "JS"], features: ["Live seat availability", "Route search", "Ticket PDF export"] },
    { title: "Face Recognition System", cat: "ai", desc: "Identity verification pipeline built on facial embeddings for access control.", stack: ["Python", "dlib", "OpenCV"], features: ["Embedding-based matching", "Liveness check", "Access logs"] },
    { title: "QR Ticket Generator", cat: "desktop", desc: "Generates and validates encrypted QR tickets for events.", stack: ["Python", "qrcode", "Tkinter"], features: ["Encrypted payloads", "Bulk generation", "Scan validation tool"] },
    { title: "Portfolio Website", cat: "web", desc: "This very site — a dark, terminal-themed personal portfolio.", stack: ["HTML5", "CSS3", "JS"], features: ["Scroll-reveal animations", "Dark/light mode", "Fully responsive"] },
    { title: "Student Management System", cat: "desktop", desc: "Desktop app for managing student records, grades, and attendance.", stack: ["Python", "Tkinter", "SQLite"], features: ["Grade analytics", "Report card export", "Search & filter"] },
    { title: "Weather App", cat: "web", desc: "Live weather lookup with forecasts and location-based search.", stack: ["JavaScript", "REST API", "CSS3"], features: ["5-day forecast", "Geolocation support", "Unit toggle"] },
    { title: "Expense Tracker", cat: "web", desc: "Personal finance tracker with category breakdowns and monthly charts.", stack: ["Flask", "Chart.js", "SQLite"], features: ["Category budgets", "Monthly trend charts", "CSV import/export"] },
    { title: "Password Manager", cat: "desktop", desc: "Locally encrypted password vault with auto-fill helper.", stack: ["Python", "Cryptography", "Tkinter"], features: ["AES-256 encryption", "Password generator", "Local-only storage"] },
  ];

  const TIMELINE = [
    { year: "2024 — Present", title: "B.Tech in Computer Science", desc: "Focused coursework in algorithms, databases, and software engineering, alongside independent ML projects." },
    { year: "2023", title: "Self-taught Python & Web Foundations", desc: "Built first full-stack apps with Flask and Django; started contributing small fixes to open-source repos." },
    { year: "2022", title: "Discovered Programming", desc: "Started with Python basics and automation scripts; got hooked on solving small daily problems with code." },
  ];

  const CERTIFICATIONS = [
    { title: "Python for Everybody", issuer: "Coursera — University of Michigan" },
    { title: "Machine Learning Specialization", issuer: "Coursera — DeepLearning.AI" },
    { title: "Django for Beginners", issuer: "Udemy" },
    { title: "SQL for Data Science", issuer: "Coursera — UC Davis" },
    { title: "Git & GitHub Mastery", issuer: "Udemy" },
    { title: "Complete Web Development", issuer: "freeCodeCamp" },
  ];

  const ACHIEVEMENTS = [
    { num: "12+", label: "Projects Shipped" },
    { num: "6", label: "Hackathons Entered" },
    { num: "3", label: "Open Source Merges" },
    { num: "1st", label: "College Coding Sprint" },
  ];

  const SERVICES = [
    { title: "Python Development", desc: "Backend systems, scripts, and tools built for reliability and clean structure." },
    { title: "Web Development", desc: "Full-stack web apps with Flask or Django, from prototype to deployment." },
    { title: "Automation Scripts", desc: "Replacing repetitive manual work with dependable, scheduled automation." },
    { title: "API Development", desc: "RESTful APIs designed with clear contracts, validation, and documentation." },
    { title: "AI Projects", desc: "Practical ML integrations — from classification models to computer vision." },
    { title: "Desktop Applications", desc: "Cross-platform desktop tools built with Python GUI frameworks." },
  ];

  const TESTIMONIALS = [
    { quote: "Aarav picked up our messy requirements and turned them into a working system faster than I expected. Clear communicator, clean code.", name: "Priya Nair", role: "Engineering Lead, freelance client" },
    { quote: "Genuinely one of the more careful junior developers I've worked with — tests his own edge cases before anyone asks.", name: "Rohan Mehta", role: "Senior Developer, open-source collaborator" },
    { quote: "He shipped our internal automation tool a week early and it just hasn't broken since. That's rare.", name: "Sara Iyer", role: "Operations Manager" },
  ];

  const GITHUB_STATS = [
    { num: "480+", label: "Contributions (past year)" },
    { num: "34", label: "Public Repositories" },
    { num: "1,200+", label: "Total Commits" },
    { num: "7", label: "Languages Used" },
  ];

  const SKILL_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>`;
  const PROJECT_ICON_SVG = `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 4v5"/></svg>`;
  const CERT_ICON_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></svg>`;
  const ACHIEVEMENT_ICON_SVG = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M5 4H3v2a4 4 0 004 4M19 4h2v2a4 4 0 01-4 4"/></svg>`;
  const GH_ICON_SVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18M7 15l4-4 3 3 5-5"/></svg>`;
  const SERVICE_ICON_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z"/></svg>`;

  /* ---------------------------------------------------------
     9. RENDER: Skills
     --------------------------------------------------------- */
  function renderSkills() {
    const grid = document.getElementById("skillsGrid");
    if (!grid) return;
    grid.innerHTML = SKILLS.map((s) => `
      <div class="skill-card reveal">
        <div class="skill-card__top">
          <span class="skill-card__icon">${s.abbr}</span>
          <span class="skill-card__name">${s.name}</span>
          ${s.soon ? '<span class="skill-card__soon">soon</span>' : ""}
        </div>
        <div class="skill-card__bar"><span data-level="${s.level}"></span></div>
        <span class="skill-card__pct">${s.soon ? "in progress" : s.level + "%"}</span>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------------
     10. RENDER: Projects + filtering + tilt
     --------------------------------------------------------- */
  function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    const catLabel = { ai: "AI / ML", web: "Web", desktop: "Desktop" };
    grid.innerHTML = PROJECTS.map((p) => `
      <article class="project-card is-visible-filter reveal" data-cat="${p.cat}">
        <div class="project-card__shot">
          <span class="project-card__tag">${catLabel[p.cat]}</span>
          <span class="project-card__shot-icon">${PROJECT_ICON_SVG}</span>
        </div>
        <div class="project-card__body">
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__desc">${p.desc}</p>
          <div class="project-card__stack">
            ${p.stack.map((s) => `<span class="stack-chip">${s}</span>`).join("")}
          </div>
          <ul class="project-card__features">
            ${p.features.map((f) => `<li>${f}</li>`).join("")}
          </ul>
          <div class="project-card__links">
            <a href="https://github.com/Rajendrark9" target="_blank" rel="noopener">GitHub</a>
            <a href="#" class="is-primary" onclick="return false;">Live Demo</a>
          </div>
        </div>
      </article>
    `).join("");

    initProjectTilt();
  }

  function initProjectFilter() {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = () => document.querySelectorAll(".project-card");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        const filter = btn.dataset.filter;
        cards().forEach((card) => {
          const show = filter === "all" || card.dataset.cat === filter;
          card.classList.toggle("is-visible-filter", show);
        });
      });
    });
  }

  function initProjectTilt() {
    if (reducedMotion || window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateY(0) rotateX(0) translateY(0)";
      });
    });
  }

  /* ---------------------------------------------------------
     11. RENDER: Timeline
     --------------------------------------------------------- */
  function renderTimeline() {
    const list = document.getElementById("timelineList");
    if (!list) return;
    list.innerHTML = TIMELINE.map((t) => `
      <div class="timeline-item reveal">
        <p class="timeline-item__year">${t.year}</p>
        <h3 class="timeline-item__title">${t.title}</h3>
        <p class="timeline-item__desc">${t.desc}</p>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------------
     12. RENDER: Certifications
     --------------------------------------------------------- */
  function renderCertifications() {
    const grid = document.getElementById("certsGrid");
    if (!grid) return;
    grid.innerHTML = CERTIFICATIONS.map((c) => `
      <div class="cert-card reveal">
        <div class="cert-card__icon">${CERT_ICON_SVG}</div>
        <h3 class="cert-card__title">${c.title}</h3>
        <p class="cert-card__issuer">${c.issuer}</p>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------------
     13. RENDER: Achievements
     --------------------------------------------------------- */
  function renderAchievements() {
    const grid = document.getElementById("achievementsGrid");
    if (!grid) return;
    grid.innerHTML = ACHIEVEMENTS.map((a) => `
      <div class="achievement-card reveal">
        <div class="achievement-card__icon">${ACHIEVEMENT_ICON_SVG}</div>
        <span class="achievement-card__num">${a.num}</span>
        <span class="achievement-card__label">${a.label}</span>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------------
     14. RENDER: Services
     --------------------------------------------------------- */
  function renderServices() {
    const grid = document.getElementById("servicesGrid");
    if (!grid) return;
    grid.innerHTML = SERVICES.map((s) => `
      <div class="service-card reveal">
        <div class="service-card__icon">${SERVICE_ICON_SVG}</div>
        <h3 class="service-card__title">${s.title}</h3>
        <p class="service-card__desc">${s.desc}</p>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------------
     15. RENDER: GitHub Stats
     --------------------------------------------------------- */
  function renderGithubStats() {
    const grid = document.getElementById("ghStatsGrid");
    if (!grid) return;
    grid.innerHTML = GITHUB_STATS.map((g) => `
      <div class="ghstat-card reveal">
        <div class="ghstat-card__icon">${GH_ICON_SVG}</div>
        <span class="ghstat-card__num" data-target="${parseInt(g.num.replace(/\D/g, "")) || 0}" data-suffix="${g.num.replace(/[\d,]/g, "")}">0</span>
        <span class="ghstat-card__label">${g.label}</span>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------------
     16. RENDER: Testimonials carousel
     --------------------------------------------------------- */
  function initTestimonials() {
    const track = document.getElementById("testimonialsTrack");
    const dotsWrap = document.getElementById("testimonialDots");
    const prevBtn = document.getElementById("testimonialPrev");
    const nextBtn = document.getElementById("testimonialNext");
    if (!track) return;

    track.innerHTML = TESTIMONIALS.map((t, i) => `
      <div class="testimonial ${i === 0 ? "is-active" : ""}" data-index="${i}">
        <p class="testimonial__quote">&ldquo;${t.quote}&rdquo;</p>
        <div class="testimonial__person">
          <span class="testimonial__avatar">${t.name.split(" ").map((n) => n[0]).join("")}</span>
          <span>
            <span class="testimonial__name">${t.name}</span><br>
            <span class="testimonial__role">${t.role}</span>
          </span>
        </div>
      </div>
    `).join("");

    dotsWrap.innerHTML = TESTIMONIALS.map((_, i) =>
      `<button class="testimonials__dot ${i === 0 ? "is-active" : ""}" data-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>`
    ).join("");

    let current = 0;
    const items = () => track.querySelectorAll(".testimonial");
    const dots = () => dotsWrap.querySelectorAll(".testimonials__dot");

    function goTo(index) {
      const total = TESTIMONIALS.length;
      current = (index + total) % total;
      items().forEach((el, i) => el.classList.toggle("is-active", i === current));
      dots().forEach((el, i) => el.classList.toggle("is-active", i === current));
    }

    prevBtn?.addEventListener("click", () => goTo(current - 1));
    nextBtn?.addEventListener("click", () => goTo(current + 1));
    dotsWrap.addEventListener("click", (e) => {
      const dot = e.target.closest(".testimonials__dot");
      if (dot) goTo(parseInt(dot.dataset.index, 10));
    });

    if (!reducedMotion) {
      setInterval(() => goTo(current + 1), 6000);
    }
  }

  /* ---------------------------------------------------------
     17. ANIMATED COUNTERS (about + github stats)
     --------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll(
      ".counter-card__num, .ghstat-card__num"
    );
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || "";
      if (reducedMotion) { el.textContent = target.toLocaleString() + suffix; return; }
      const duration = 1400;
      const start = performance.now();
      function frame(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((c) => observer.observe(c));
  }

  /* ---------------------------------------------------------
     18. SKILL BARS (animate fill on scroll into view)
     --------------------------------------------------------- */
  function initSkillBars() {
    const bars = document.querySelectorAll(".skill-card__bar span");
    if (!bars.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const level = entry.target.dataset.level || "0";
          requestAnimationFrame(() => { entry.target.style.width = level + "%"; });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach((b) => observer.observe(b));
  }

  /* ---------------------------------------------------------
     19. CONTACT FORM — client-side validation + fake submit
     --------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const sendBtn = document.getElementById("sendBtn");
    const successMsg = document.getElementById("contactSuccess");

    const rules = {
      name: (v) => v.trim().length >= 2 || "Please enter your name.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
      subject: (v) => v.trim().length >= 3 || "Subject is a little short.",
      message: (v) => v.trim().length >= 10 || "Message should be at least 10 characters.",
    };

    function validateField(field) {
      const value = field.value;
      const rule = rules[field.name];
      const errorEl = form.querySelector(`.form-error[data-for="${field.id}"]`);
      const wrapper = field.closest(".form-field");
      if (!rule) return true;
      const result = rule(value);
      if (result === true) {
        wrapper.classList.remove("has-error");
        if (errorEl) errorEl.textContent = "";
        return true;
      } else {
        wrapper.classList.add("has-error");
        if (errorEl) errorEl.textContent = result;
        return false;
      }
    }

    form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".form-field").classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = [...form.querySelectorAll("input, textarea")];
      const allValid = fields.map(validateField).every(Boolean);
      if (!allValid) return;

      sendBtn.classList.add("is-loading");
      sendBtn.disabled = true;

      // Simulated send — no backend wired up in this static template
      setTimeout(() => {
        sendBtn.classList.remove("is-loading");
        sendBtn.disabled = false;
        successMsg.classList.add("is-visible");
        form.reset();
        setTimeout(() => successMsg.classList.remove("is-visible"), 5000);
      }, 1200);
    });
  }

  /* ---------------------------------------------------------
     20. BACK TO TOP + RIPPLE + MISC
     --------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    btn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
  }

  function initRipple() {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = (e.clientX - rect.left) + "px";
        ripple.style.top = (e.clientY - rect.top) + "px";
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + "px";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  function setYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     21. INIT
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initCursor();
    initParticles();
    initNavbar();
    initThemeToggle();
    initTypingAnimation();

    renderSkills();
    renderProjects();
    renderTimeline();
    renderCertifications();
    renderAchievements();
    renderServices();
    renderGithubStats();

    initProjectFilter();
    initTestimonials();
    initCounters();
    initSkillBars();
    initContactForm();
    initBackToTop();
    initRipple();
    initScrollReveal();
    setYear();
  });
})();
