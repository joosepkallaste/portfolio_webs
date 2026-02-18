// ========= Helpers =========
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ========= Year =========
(() => {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

// ========= Mobile Nav =========
(() => {
  const toggle = $(".nav-toggle");
  const menu = $("#nav-menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  // Close when clicking a link
  $$("#nav-menu a").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();

// ========= Theme Toggle (persist) =========
(() => {
  const root = document.documentElement;
  const btn = $("#themeBtn");
  if (!btn) return;

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    root.dataset.theme = saved;
  }

  const syncIcon = () => {
    const isLight = root.dataset.theme === "light";
    const icon = $(".theme-icon", btn);
    if (icon) icon.textContent = isLight ? "☀️" : "🌙";
  };

  syncIcon();

  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    syncIcon();
  });
})();

// ========= Project Filtering =========
(() => {
  const buttons = $$(".filter-btn");
  const cards = $$(".project");
  if (buttons.length === 0 || cards.length === 0) return;

  const apply = (tag) => {
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(",").map((s) => s.trim());
      const show = tag === "all" || tags.includes(tag);
      card.style.display = show ? "" : "none";
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      apply(btn.dataset.filter);
    });
  });
})();

// ========= Modals =========
(() => {
  const openers = $$("[data-modal]");
  const closers = $$("[data-close-modal]");
  const modals = $$("dialog.modal");

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "open"); // fallback
  };

  const closeModal = (modal) => {
    if (!modal) return;
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  };

  openers.forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.modal));
  });

  closers.forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.closest("dialog")));
  });

  // Click outside modal-inner closes
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      const inner = $(".modal-inner", modal);
      if (!inner) return;
      const clickedOutside = !inner.contains(e.target);
      if (clickedOutside) closeModal(modal);
    });
  });

  // Esc closes via native dialog behavior (supported browsers)
})();

// ========= Contact Form -> mailto =========
// Replace this email with yours:
const YOUR_EMAIL = "youremail@example.com";

(() => {
  const form = $("#contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );

    window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
  });
})();

// ========= Back to top (smooth) =========
(() => {
  const btn = $("#backToTop");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
