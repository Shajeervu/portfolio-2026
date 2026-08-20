// ============================================
// Footer year
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// Mobile nav toggle
// ============================================
const navToggle = document.getElementById('navToggle');
const siteHeader = document.getElementById('siteHeader');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = siteHeader.getAttribute('data-open') === 'true';
  siteHeader.setAttribute('data-open', String(!isOpen));
  navToggle.setAttribute('aria-expanded', String(!isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteHeader.setAttribute('data-open', 'false');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// Scroll-reveal animations
// ============================================
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// ============================================
// Active nav link highlighting
// ============================================
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

if ('IntersectionObserver' in window && sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => navObserver.observe(section));
}

// ============================================
// Contact form — sends straight to Gmail using EmailJS.
// No server, no database — EmailJS delivers the email for you.
//
// SETUP (see the chat for the full walkthrough):
//   1. Create a free account at https://www.emailjs.com
//   2. Add Gmail as an "Email Service" -> copy its Service ID below
//   3. Create an "Email Template" -> copy its Template ID below
//   4. Copy your Public Key from Account -> API Keys
// Paste all three into the constants right below.
// ============================================
const EMAILJS_PUBLIC_KEY = '8XXOC2OLoi26TGurx';
const EMAILJS_SERVICE_ID = 'service_aaodvjh';
const EMAILJS_TEMPLATE_ID = 'template_ez4tdzm';

if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const submitBtn = contactForm.querySelector('button[type="submit"]');

function openMailtoFallback(name, email, message) {
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:shajeervu111@gmail.com?subject=${subject}&body=${body}`;
  formNote.textContent = 'Opening your email app instead.';
}

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    formNote.textContent = 'Please fill in every field before sending.';
    return;
  }

  // EmailJS not configured yet — fall back to opening an email
  if (!window.emailjs || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    openMailtoFallback(name, email, message);
    contactForm.reset();
    return;
  }

  submitBtn.disabled = true;
  formNote.textContent = 'Sending…';

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: name,
      reply_to: email,
      message: message
    });
    formNote.textContent = 'Message sent — thanks, I\'ll get back to you soon.';
    contactForm.reset();
  } catch (err) {
    console.error('EmailJS failed:', err);
    openMailtoFallback(name, email, message);
    contactForm.reset();
  } finally {
    submitBtn.disabled = false;
  }
});