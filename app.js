// Utilities
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Year in footer
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Mobile nav toggle
const navToggle = $(".nav-toggle");
const siteNav = $("#site-nav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu on link click (mobile)
  $$("a", siteNav).forEach((a) => a.addEventListener("click", () => {
    if (siteNav.classList.contains("is-open")) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }));
}

// Contact form validation
const form = $("#contact-form");
if (form) {
  const nameInput = $("#name", form);
  const emailInput = $("#email", form);
  const messageInput = $("#message", form);
  const consentInput = $("#consent", form);
  const statusEl = $(".form-status", form);

  const setError = (id, message) => {
    const el = $(`#${id}-error`, form);
    if (el) el.textContent = message || "";
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let firstInvalid = null;

    // Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError("name", "Please enter your name (2+ characters).");
      firstInvalid = firstInvalid || nameInput;
    } else {
      setError("name", "");
    }

    // Email
    if (!validateEmail(emailInput.value.trim())) {
      setError("email", "Please enter a valid email address.");
      firstInvalid = firstInvalid || emailInput;
    } else {
      setError("email", "");
    }

    // Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError("message", "Please enter a message (10+ characters).");
      firstInvalid = firstInvalid || messageInput;
    } else {
      setError("message", "");
    }

    // Consent
    if (!consentInput.checked) {
      setError("consent", "Please agree to be contacted.");
      firstInvalid = firstInvalid || consentInput;
    } else {
      setError("consent", "");
    }

    if (firstInvalid) {
      firstInvalid.focus();
      if (statusEl) statusEl.textContent = "";
      return;
    }

    // Simulate success
    if (statusEl) statusEl.textContent = "Thanks! We'll be in touch shortly.";
    form.reset();
  });
}
