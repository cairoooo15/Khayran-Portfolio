/* =========================================================
   script.js - Khayran Yaj Tenorio portfolio
   Interactive features:
   1. Light/dark theme toggle (remembered between visits)
   2. Mobile menu
   3. Typing effect in the hero
   4. Project filter buttons
   5. Contact form validation
   6. Active nav link highlighting while scrolling
   ========================================================= */

/* ---------- Settings you can edit ---------- */

// Your email address: the contact form opens an email to this address.
const CONTACT_EMAIL = "yourname@email.com";

// Lines shown by the typing effect in the hero.
const ROLES = [
  "BSIT student at BulSU",
  "Web and mobile developer",
  "UI/UX learner",
  "Event emcee and coordinator"
];

/* =========================================================
   1. THEME TOGGLE
   ========================================================= */

const root = document.documentElement;
const themeButton = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

/**
 * Applies a theme to the page and updates the toggle button.
 * @param {string} theme - either "light" or "dark"
 */
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  themeIcon.textContent = isDark ? "\u2600" : "\u263E"; // sun or moon
  themeButton.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

/**
 * Switches between light and dark and saves the choice in the browser.
 */
function toggleTheme() {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (error) {
    // Storage can be blocked in private mode; the theme still changes.
  }
}

/**
 * Picks the starting theme: saved choice first, then the device setting.
 */
function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (error) {
    saved = null;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
  themeButton.addEventListener("click", toggleTheme);
}

/* =========================================================
   2. MOBILE MENU
   ========================================================= */

const menuButton = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

/**
 * Opens or closes the dropdown menu on small screens.
 * @param {boolean} open - true to open, false to close
 */
function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

/**
 * Wires up the menu button and closes the menu after a link is tapped.
 */
function initMenu() {
  menuButton.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("is-open"));
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });
}

/* =========================================================
   3. TYPING EFFECT
   ========================================================= */

/**
 * Types each line in ROLES one letter at a time, pauses, deletes it,
 * then moves to the next line. Skipped if the visitor prefers reduced motion.
 */
function initTyping() {
  const target = document.getElementById("typing-text");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!target || reduceMotion) {
    return; // keep the static text from the HTML
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  /**
   * Draws one frame of the animation, then schedules the next one.
   */
  function tick() {
    const current = ROLES[roleIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = current.slice(0, charIndex);

    let delay = deleting ? 40 : 80;

    if (!deleting && charIndex === current.length) {
      deleting = true; // finished typing: pause, then start deleting
      delay = 1600;
    } else if (deleting && charIndex === 0) {
      deleting = false; // finished deleting: move to the next role
      roleIndex = (roleIndex + 1) % ROLES.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  target.textContent = "";
  tick();
}

/* =========================================================
   4. PROJECT FILTER
   ========================================================= */

/**
 * Shows only the project cards that match the chosen category.
 * Cards list their categories in data-category (for example "capstone web").
 * @param {string} category - "all", "web", "mobile", or "capstone"
 */
function filterProjects(category) {
  const cards = document.querySelectorAll(".project");
  let visibleCount = 0;

  cards.forEach(function (card) {
    const categories = card.dataset.category.split(" ");
    const show = category === "all" || categories.includes(category);
    card.hidden = !show;
    if (show) {
      visibleCount += 1;
    }
  });

  // Show a message if nothing matches
  document.getElementById("empty-message").hidden = visibleCount > 0;
}

/**
 * Connects the filter buttons and marks the active one.
 */
function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      buttons.forEach(function (other) {
        const isActive = other === button;
        other.classList.toggle("is-active", isActive);
        other.setAttribute("aria-pressed", String(isActive));
      });
      filterProjects(button.dataset.filter);
    });
  });
}

/* =========================================================
   5. CONTACT FORM VALIDATION
   ========================================================= */

/**
 * Checks whether a string looks like an email address.
 * @param {string} value - the text to test
 * @returns {boolean} true if it looks valid
 */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Shows or clears an error message under a form field.
 * @param {HTMLElement} input - the input or textarea
 * @param {string} message - the error text, or "" to clear it
 */
function setFieldError(input, message) {
  const wrapper = input.closest(".field");
  const errorBox = document.getElementById(input.id + "-error");
  wrapper.classList.toggle("has-error", message !== "");
  errorBox.textContent = message;
}

/**
 * Validates the whole form and shows a message next to each problem.
 * @param {HTMLFormElement} form - the contact form
 * @returns {boolean} true if every field is valid
 */
function validateForm(form) {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  let valid = true;

  if (name.value.trim().length < 2) {
    setFieldError(name, "Enter your name (at least 2 characters).");
    valid = false;
  } else {
    setFieldError(name, "");
  }

  if (!isValidEmail(email.value.trim())) {
    setFieldError(email, "Enter a valid email, like name@example.com.");
    valid = false;
  } else {
    setFieldError(email, "");
  }

  if (message.value.trim().length < 10) {
    setFieldError(message, "Write a message of at least 10 characters.");
    valid = false;
  } else {
    setFieldError(message, "");
  }

  return valid;
}

/**
 * Handles the form: validates, then opens the visitor's email app
 * with the message filled in (this site has no server).
 */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";

    if (!validateForm(form)) {
      form.querySelector(".has-error input, .has-error textarea").focus();
      return;
    }

    const subject = encodeURIComponent("Portfolio message from " + document.getElementById("name").value.trim());
    const body = encodeURIComponent(
      document.getElementById("message").value.trim() +
        "\n\n" +
        document.getElementById("name").value.trim() +
        "\n" +
        document.getElementById("email").value.trim()
    );

    status.textContent = "Opening your email app to send the message.";
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
    form.reset();
  });

  // Clear a field's error as soon as the visitor starts fixing it
  form.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("input", function () {
      setFieldError(field, "");
    });
  });
}

/* =========================================================
   6. ACTIVE NAV LINK WHILE SCROLLING
   ========================================================= */

/**
 * Highlights the nav link of the section currently in view.
 */
function initActiveNav() {
  const links = document.querySelectorAll(".nav__links a");
  const sections = document.querySelectorAll("main section");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            const isCurrent = link.getAttribute("href") === "#" + entry.target.id;
            if (isCurrent) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" } // a section counts when it crosses the middle of the screen
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

/* =========================================================
   START EVERYTHING
   ========================================================= */

/**
 * Runs once the page has loaded.
 */
function init() {
  document.getElementById("year").textContent = new Date().getFullYear();
  initTheme();
  initMenu();
  initTyping();
  initProjectFilter();
  initContactForm();
  initActiveNav();
}

document.addEventListener("DOMContentLoaded", init);
