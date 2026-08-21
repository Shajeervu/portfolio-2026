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

// Loads only if the SDK script tag is present on the page.
if (window.emailjs) {
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

  // SDK script tag missing entirely — nothing to send through, fall back
  if (!window.emailjs) {
    console.warn('EmailJS SDK not loaded — check the script tag in index.html.');
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
    // Log the real reason to the console so it's easy to diagnose
    console.error('EmailJS failed:', err);
    openMailtoFallback(name, email, message);
    contactForm.reset();
  } finally {
    submitBtn.disabled = false;
  }
});

// ============================================
// Patch panel — click a port to show what it covers
// ============================================
const portsGrid = document.getElementById('portsGrid');
const readoutText = document.getElementById('readoutText');

if (portsGrid && readoutText) {
  portsGrid.querySelectorAll('.port').forEach((port) => {
    port.addEventListener('click', () => {
      const alreadyActive = port.classList.contains('is-active');
      portsGrid.querySelectorAll('.port').forEach((p) => p.classList.remove('is-active'));

      if (alreadyActive) {
        readoutText.textContent = 'select a port to view details';
        return;
      }
      port.classList.add('is-active');
      const num = port.querySelector('.port-num').textContent;
      const name = port.querySelector('.port-name').textContent;
      readoutText.textContent = `port ${num} — ${name}: ${port.dataset.detail}`;
    });
  });
}

// ============================================
// Vendor cards — click to expand, with cert counts
// pulled live from the Certifications section (no duplicated data)
// ============================================
const vendorGrid = document.getElementById('vendorGrid');

if (vendorGrid) {
  // Count certifications per vendor by matching each vendor name
  // against the Certifications section's group headings
  const certGroups = document.querySelectorAll('.cert-group');
  vendorGrid.querySelectorAll('.vendor-count[data-count-for]').forEach((countEl) => {
    const vendorKey = countEl.dataset.countFor.toLowerCase();
    let count = 0;
    certGroups.forEach((group) => {
      const heading = group.querySelector('h3');
      if (heading && heading.textContent.toLowerCase().includes(vendorKey)) {
        count += group.querySelectorAll('.cert-card').length;
      }
    });
    countEl.textContent = count > 0 ? `${count} certification${count > 1 ? 's' : ''}` : '';
  });

  vendorGrid.querySelectorAll('.vendor-card').forEach((card) => {
    const detailEl = card.querySelector('.vendor-detail');
    detailEl.textContent = card.dataset.detail;
    card.setAttribute('aria-expanded', 'false');

    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');
      vendorGrid.querySelectorAll('.vendor-card').forEach((c) => {
        c.classList.remove('is-open');
        c.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        card.classList.add('is-open');
        card.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ============================================
// Theme toggle (light / dark) — persists via localStorage,
// falls back to the OS-level preference on first visit.
// ============================================
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

(function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) {
    applyTheme(stored);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

// ============================================
// Currency converter — live rates via open.er-api.com (free, no key)
// ============================================
const CURRENCIES = ['AED', 'USD', 'EUR', 'GBP', 'INR', 'SAR', 'CAD', 'AUD', 'JPY', 'CNY'];

const currencyToggle = document.getElementById('currencyToggle');
const currencyPanel = document.getElementById('currencyPanel');
const currencyClose = document.getElementById('currencyClose');
const curAmount = document.getElementById('curAmount');
const curFrom = document.getElementById('curFrom');
const curTo = document.getElementById('curTo');
const curResult = document.getElementById('curResult');
const currencySwap = document.getElementById('currencySwap');
const currencyNote = document.getElementById('currencyNote');

if (currencyToggle && currencyPanel) {
  CURRENCIES.forEach((code) => {
    curFrom.add(new Option(code, code));
    curTo.add(new Option(code, code));
  });
  curFrom.value = 'AED';
  curTo.value = 'USD';

  let convertTimer = null;

  async function runConversion() {
    const amount = parseFloat(curAmount.value);
    const from = curFrom.value;
    const to = curTo.value;

    if (!amount || amount <= 0) {
      curResult.textContent = '—';
      return;
    }
    if (from === to) {
      curResult.textContent = amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return;
    }

    curResult.textContent = '…';
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const data = await res.json();
      if (data.result !== 'success' || !data.rates || !data.rates[to]) {
        throw new Error('Rate unavailable');
      }
      const converted = amount * data.rates[to];
      curResult.textContent = converted.toLocaleString(undefined, { maximumFractionDigits: 2 });
      currencyNote.textContent = 'Live rates via open.er-api.com';
    } catch (err) {
      console.error('Currency conversion failed:', err);
      curResult.textContent = '—';
      currencyNote.textContent = 'Rate lookup failed — try again shortly.';
    }
  }

  function scheduleConversion() {
    clearTimeout(convertTimer);
    convertTimer = setTimeout(runConversion, 350);
  }

  currencyToggle.addEventListener('click', () => {
    const isOpen = !currencyPanel.hidden;
    currencyPanel.hidden = isOpen;
    currencyToggle.setAttribute('aria-expanded', String(!isOpen));
    if (!isOpen) {
      runConversion();
      curAmount.focus();
    }
  });

  if (currencyClose) {
    currencyClose.addEventListener('click', () => {
      currencyPanel.hidden = true;
      currencyToggle.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', (event) => {
    if (!currencyPanel.hidden && !event.target.closest('.currency-wrap')) {
      currencyPanel.hidden = true;
      currencyToggle.setAttribute('aria-expanded', 'false');
    }
  });

  curAmount.addEventListener('input', scheduleConversion);
  curFrom.addEventListener('change', runConversion);
  curTo.addEventListener('change', runConversion);

  currencySwap.addEventListener('click', () => {
    const temp = curFrom.value;
    curFrom.value = curTo.value;
    curTo.value = temp;
    runConversion();
  });
}

// ============================================
// Projects carousel — arrows, dots, keyboard, swipe, gentle autoplay
// ============================================
const carousel = document.getElementById('projectsCarousel');
const carouselTrack = document.getElementById('carouselTrack');

if (carousel && carouselTrack) {
  const slides = Array.from(carouselTrack.querySelectorAll('.carousel-slide'));
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let autoplayId = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to deployment ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
  }

  prevBtn.addEventListener('click', () => { goTo(index - 1); restartAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(index + 1); restartAutoplay(); });

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { goTo(index - 1); restartAutoplay(); }
    if (event.key === 'ArrowRight') { goTo(index + 1); restartAutoplay(); }
  });

  // Touch swipe
  let touchStartX = null;
  carouselTrack.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carouselTrack.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      goTo(deltaX < 0 ? index + 1 : index - 1);
      restartAutoplay();
    }
    touchStartX = null;
  });

  function startAutoplay() {
    if (prefersReducedMotion) return;
    autoplayId = setInterval(() => goTo(index + 1), 6000);
  }
  function stopAutoplay() { clearInterval(autoplayId); }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  goTo(0);
  startAutoplay();
}