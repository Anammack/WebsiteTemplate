/* ================================================================
   main.js — Main JavaScript File
   Structure:
     1.  DOM Ready helper
     2.  Sticky header shadow on scroll
     3.  Mobile navigation toggle
     4.  Active nav-link highlight on scroll (Intersection Observer)
     5.  Fade-in animation on scroll (Intersection Observer)
     6.  Scroll-to-top button
     7.  Contact form validation & submission
     8.  Footer copyright year (auto-update)
     9.  Utility functions
================================================================ */


/* ----------------------------------------------------------------
   1. DOM READY HELPER
   — Wraps all init calls so the DOM is guaranteed to exist.
---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initActiveNavLinks();
  initFadeInObserver();
  initScrollToTop();
  initContactForm();
  initFooterYear();
});


/* ----------------------------------------------------------------
   2. STICKY HEADER SHADOW ON SCROLL
   — Adds / removes the .scrolled class on <header> so CSS can
     apply a box-shadow when the user scrolls down.
---------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const THRESHOLD = 10; // px scrolled before shadow appears

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > THRESHOLD);
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // run once on load in case page is pre-scrolled
}


/* ----------------------------------------------------------------
   3. MOBILE NAVIGATION TOGGLE
   — Toggles .open on .nav-menu and updates aria-expanded on the
     hamburger button. Closes the menu when a link is tapped.
---------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  // Open / close on hamburger click
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when any nav link is clicked
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Keep a reference to the header for the outside-click handler
  const header = document.getElementById('site-header');
}


/* ----------------------------------------------------------------
   4. ACTIVE NAV-LINK HIGHLIGHT ON SCROLL
   — Uses IntersectionObserver to track which section is in view
     and adds the .active class to the matching nav link.
---------------------------------------------------------------- */
function initActiveNavLinks() {
  // Collect all sections that have an id matching a nav href
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove .active from all links
          navLinks.forEach(l => l.classList.remove('active'));
          // Add .active to the link pointing at the visible section
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px', // trigger when section is ~40% from top
    }
  );

  sections.forEach(section => observer.observe(section));
}


/* ----------------------------------------------------------------
   5. FADE-IN ANIMATION ON SCROLL
   — Adds .fade-in to targeted elements in HTML (or here via JS)
     then uses IntersectionObserver to add .visible when they
     enter the viewport.
   — You can add the class directly in HTML or let this function
     auto-apply it to chosen selectors.
---------------------------------------------------------------- */
function initFadeInObserver() {
  // Selectors that should animate in — add or remove as needed
  const targets = document.querySelectorAll(
    '.card, .testimonial, .two-col-text, .two-col-image, .hero-text, .hero-image'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(el => observer.observe(el));
}


/* ----------------------------------------------------------------
   6. SCROLL-TO-TOP BUTTON
   — Shows the button after scrolling down 400px, hides it at top.
     Clicking it smoothly scrolls back to the top of the page.
---------------------------------------------------------------- */
function initScrollToTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const SHOW_AFTER = 400; // px

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > SHOW_AFTER);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ----------------------------------------------------------------
   7. CONTACT FORM VALIDATION & SUBMISSION
   — Client-side validation with inline error messages.
   — Replace the fake submit handler with a real fetch() call or
     a form service (Formspree, EmailJS, etc.).
---------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // ---- Validation rules map: fieldId → { errorId, validate fn, message }
  const fields = [
    {
      id:      'firstName',
      errorId: 'firstNameError',
      validate: val => val.trim().length >= 2,
      message:  'Please enter your first name (min 2 characters).',
    },
    {
      id:      'lastName',
      errorId: 'lastNameError',
      validate: val => val.trim().length >= 2,
      message:  'Please enter your last name (min 2 characters).',
    },
    {
      id:      'email',
      errorId: 'emailError',
      validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      message:  'Please enter a valid email address.',
    },
    {
      id:      'message',
      errorId: 'messageError',
      validate: val => val.trim().length >= 10,
      message:  'Please enter a message (min 10 characters).',
    },
  ];

  // ---- Real-time validation on blur (when user leaves a field)
  fields.forEach(({ id, errorId, validate, message }) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!input || !error) return;

    input.addEventListener('blur', () => {
      const valid = validate(input.value);
      showFieldError(input, error, valid ? '' : message);
    });

    // Clear error as user types after initial blur
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        const valid = validate(input.value);
        showFieldError(input, error, valid ? '' : message);
      }
    });
  });

  // ---- Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;
    fields.forEach(({ id, errorId, validate, message }) => {
      const input = document.getElementById(id);
      const error = document.getElementById(errorId);
      if (!input || !error) return;
      const valid = validate(input.value);
      showFieldError(input, error, valid ? '' : message);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) return;

    // ---- TODO: Replace this block with your real submission logic.
    //      Example using Formspree:
    //
    //   const data = new FormData(form);
    //   const res  = await fetch('https://formspree.io/f/YOUR_ID', {
    //     method:  'POST',
    //     body:    data,
    //     headers: { 'Accept': 'application/json' },
    //   });
    //   if (res.ok) { showFormStatus('success', '...'); form.reset(); }
    //   else        { showFormStatus('error',   '...'); }

    // Fake success for template demo:
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    await delay(1200); // simulate network request

    showFormStatus('success', '✅ Message sent! We\'ll be in touch soon.');
    form.reset();
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  });
}

/* Helper: show or clear inline field error */
function showFieldError(input, errorEl, message) {
  errorEl.textContent = message;
  if (message) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.classList.remove('is-invalid');
    input.setAttribute('aria-invalid', 'false');
  }
}

/* Helper: show form-level status banner */
function showFormStatus(type, message) {
  const status = document.getElementById('formStatus');
  if (!status) return;
  status.textContent = message;
  status.className = `form-status ${type}`;
  // Auto-hide after 6 seconds
  setTimeout(() => {
    status.className = 'form-status';
    status.textContent = '';
  }, 6000);
}


/* ----------------------------------------------------------------
   8. FOOTER COPYRIGHT YEAR
   — Automatically keeps the year current so you never need to
     update it manually.
---------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (!el) return;
  // Replace just the year digits in whatever text is already there
  el.innerHTML = el.innerHTML.replace(/\d{4}/, new Date().getFullYear());
}


/* ----------------------------------------------------------------
   9. UTILITY FUNCTIONS
---------------------------------------------------------------- */

/**
 * Promise-based delay (used for fake async in demo).
 * @param {number} ms — milliseconds to wait
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce — limits how often a function fires.
 * Useful for resize / scroll handlers.
 *
 * Usage:
 *   window.addEventListener('resize', debounce(myFn, 250));
 *
 * @param {Function} fn
 * @param {number}   wait — ms
 * @returns {Function}
 */
function debounce(fn, wait = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Throttle — ensures a function fires at most once per interval.
 * Better than debounce for continuous events like scroll.
 *
 * @param {Function} fn
 * @param {number}   limit — ms
 * @returns {Function}
 */
function throttle(fn, limit = 100) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
