/* ═══════════════════════════════════════════════
   OLIVES — reservations.js
   ═══════════════════════════════════════════════ */


/* ──────────────────────────────────────────────
   1. NAV
   ────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 55);
});

hamburger.addEventListener('click', function () {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});

navLinks.querySelectorAll('.nav__link').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});


/* ──────────────────────────────────────────────
   2. SCROLL REVEAL
   ────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObs.observe(el);
});


/* ──────────────────────────────────────────────
   3. TOAST
   ────────────────────────────────────────────── */
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2400);
}


/* ──────────────────────────────────────────────
   4. BOOKING WIZARD STATE
   ────────────────────────────────────────────── */
const state = {
  occasion : 'Casual Dining',
  date     : '',
  time     : '7:00 PM',
  guests   : 2,
  firstName: '',
  lastName : '',
  email    : '',
  phone    : '',
  dietary  : [],
  requests : ''
};


/* ── STEP NAVIGATION ── */

/* Move to a specific step number */
function goToStep(n) {
  const steps = document.querySelectorAll('.wizard-step');
  steps.forEach(function (s) { s.classList.add('wizard-step--hidden'); });

  const target = document.getElementById('step' + n) || document.getElementById('step' + n.replace ? n : n);
  if (target) {
    target.classList.remove('wizard-step--hidden');
    // Scroll the right panel to top
    document.querySelector('.booking__right').scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateProgress(typeof n === 'number' ? n : 4);
}

/* Show success step */
function goToSuccess() {
  const steps = document.querySelectorAll('.wizard-step');
  steps.forEach(function (s) { s.classList.add('wizard-step--hidden'); });
  document.getElementById('stepSuccess').classList.remove('wizard-step--hidden');
  updateProgress(4);

  // Update success message
  document.getElementById('successMsg').textContent =
    'A confirmation has been sent to ' + (state.email || 'your email') + '. We can\'t wait to see you!';
}

/* Update the progress indicator dots */
function updateProgress(activeStep) {
  const steps = document.querySelectorAll('.wizard-progress__step');
  const lines  = document.querySelectorAll('.wizard-progress__line');

  steps.forEach(function (el, i) {
    const stepNum = i + 1;
    el.classList.remove('active', 'done');
    if (stepNum < activeStep) el.classList.add('done');
    if (stepNum === activeStep) el.classList.add('active');
  });

  lines.forEach(function (el, i) {
    el.classList.toggle('done', i + 1 < activeStep);
  });
}


/* ── OCCASION BUTTONS ── */
document.querySelectorAll('.occasion-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.occasion-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    state.occasion = btn.dataset.occ;
  });
});


/* ── TIME SLOTS ── */
document.querySelectorAll('.time-slot:not(.unavailable)').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.time-slot').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    state.time = btn.dataset.time;
  });
});


/* ── GUEST STEPPER ── */
let guestCount = 2;

function updateGuestDisplay() {
  document.getElementById('guestNum').textContent  = guestCount;
  document.querySelector('.guest-stepper__word').textContent = guestCount === 1 ? 'guest' : 'guests';
  state.guests = guestCount;
}

document.getElementById('guestMinus').addEventListener('click', function () {
  if (guestCount > 1) { guestCount--; updateGuestDisplay(); }
});
document.getElementById('guestPlus').addEventListener('click', function () {
  if (guestCount < 30) { guestCount++; updateGuestDisplay(); }
});


/* ── STEP 1 → STEP 2 ── */
document.getElementById('toStep2').addEventListener('click', function () {
  state.date = document.getElementById('resDate').value;

  if (!state.date) {
    showToast('⚠  Please select a date');
    document.getElementById('resDate').focus();
    return;
  }
  // Check date is not in the past
  if (new Date(state.date) < new Date(new Date().toDateString())) {
    showToast('⚠  Please choose a future date');
    return;
  }

  goToStep(2);
});

document.getElementById('backTo1').addEventListener('click', function () { goToStep(1); });


/* ── STEP 2 → STEP 3 ── */
document.getElementById('toStep3').addEventListener('click', function () {
  state.firstName = document.getElementById('firstName').value.trim();
  state.lastName  = document.getElementById('lastName').value.trim();
  state.email     = document.getElementById('resEmail').value.trim();
  state.phone     = document.getElementById('resPhone').value.trim();
  state.requests  = document.getElementById('specialReq').value.trim();

  // Gather dietary checkboxes
  state.dietary = [];
  document.querySelectorAll('.diet-chip input:checked').forEach(function (cb) {
    state.dietary.push(cb.value);
  });

  if (!state.firstName) { showToast('⚠  Please enter your first name'); return; }
  if (!state.email || !state.email.includes('@')) { showToast('⚠  Please enter a valid email'); return; }
  if (!state.phone) { showToast('⚠  Please enter your phone number'); return; }

  buildSummary();
  goToStep(3);
});

document.getElementById('backTo2').addEventListener('click', function () { goToStep(2); });


/* ── BUILD SUMMARY CARD ── */
function buildSummary() {
  const rows = document.getElementById('summaryRows');
  const dateFormatted = new Date(state.date + 'T00:00:00').toLocaleDateString('en-UG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  rows.innerHTML = [
    ['Occasion',  state.occasion],
    ['Date',      dateFormatted],
    ['Time',      state.time],
    ['Guests',    state.guests + (state.guests === 1 ? ' guest' : ' guests')],
    ['Name',      state.firstName + ' ' + state.lastName],
    ['Contact',   state.email],
    state.dietary.length ? ['Dietary', state.dietary.join(', ')] : null,
    state.requests ? ['Request', state.requests] : null
  ].filter(Boolean).map(function (row) {
    return '<div class="summary-row">'
      + '<span class="summary-row__label">' + row[0] + '</span>'
      + '<span class="summary-row__value">' + row[1] + '</span>'
      + '</div>';
  }).join('');

  document.getElementById('summaryNote').textContent =
    state.requests ? '"' + state.requests + '"' : 'No special requests added.';
}


/* ── CONFIRM ── */
document.getElementById('confirmBtn').addEventListener('click', function () {
  const btn = this;
  btn.disabled = true;
  btn.innerHTML = '<span style="opacity:.6">Confirming…</span>';

  // Simulate a 1.2s API call
  setTimeout(function () {
    btn.disabled = false;
    goToSuccess();
    showToast('✓  Reservation confirmed! Check your email.');
  }, 1200);
});


/* ── NEW BOOKING ── */
document.getElementById('newBookingBtn').addEventListener('click', function () {
  // Reset form fields
  document.getElementById('resDate').value = '';
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value  = '';
  document.getElementById('resEmail').value  = '';
  document.getElementById('resPhone').value  = '';
  document.getElementById('specialReq').value = '';
  document.querySelectorAll('.diet-chip input').forEach(function (cb) { cb.checked = false; });
  document.querySelectorAll('.diet-chip').forEach(function (chip) { chip.style.background = ''; chip.style.color = ''; });
  guestCount = 2;
  updateGuestDisplay();

  // Reset occasion
  document.querySelectorAll('.occasion-btn').forEach(function (b) { b.classList.remove('active'); });
  document.querySelector('[data-occ="Casual Dining"]').classList.add('active');
  state.occasion = 'Casual Dining';

  goToStep(1);
  document.querySelector('.booking__right').scrollTo({ top: 0, behavior: 'smooth' });
});


/* ──────────────────────────────────────────────
   5. OPENING HOURS — highlight today
   ────────────────────────────────────────────── */
(function () {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = days[new Date().getDay()];

  const rows = document.querySelectorAll('.hours-row');
  rows.forEach(function (row) {
    const dayEl = row.querySelector('.hours-day');
    if (dayEl && dayEl.textContent.trim() === today) {
      row.style.background = 'rgba(48,79,39,0.06)';
      row.style.borderRadius = '6px';
      row.style.padding = '6px 8px';
      dayEl.style.color = 'var(--deep)';
      dayEl.style.fontWeight = '600';
    }
  });

  const hoursToday = document.getElementById('hoursToday');
  const isWeekend  = today === 'Saturday' || today === 'Sunday';
  const hours      = isWeekend
    ? (today === 'Saturday' ? '9:00 AM – 11:00 PM' : '9:00 AM – 10:00 PM')
    : '11:00 AM – 10:30 PM';
  hoursToday.textContent = '📍 We are open today — ' + today + ' ' + hours;
})();


/* ──────────────────────────────────────────────
   6. CONTACT FORM SEND
   ────────────────────────────────────────────── */
document.getElementById('contactSendBtn').addEventListener('click', function () {
  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const subject = document.getElementById('cSubject').value;
  const message = document.getElementById('cMessage').value.trim();

  if (!name)    { showToast('⚠  Please enter your name'); return; }
  if (!email || !email.includes('@')) { showToast('⚠  Please enter a valid email'); return; }
  if (!subject) { showToast('⚠  Please select a subject'); return; }
  if (!message) { showToast('⚠  Please write a message'); return; }

  const btn = this;
  btn.disabled = true;
  btn.innerHTML = '<span style="opacity:.6">Sending…</span>';

  setTimeout(function () {
    btn.disabled = false;
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      Send Message`;

    document.getElementById('cName').value    = '';
    document.getElementById('cEmail').value   = '';
    document.getElementById('cSubject').value = '';
    document.getElementById('cMessage').value = '';

    showToast('✓  Message sent! We\'ll reply within 24 hours.');
  }, 1000);
});


/* ──────────────────────────────────────────────
   7. FAQ ACCORDION
   ────────────────────────────────────────────── */
document.querySelectorAll('.faq__q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const item    = btn.closest('.faq__item');
    const isOpen  = item.classList.contains('open');

    // Close all first
    document.querySelectorAll('.faq__item').forEach(function (i) {
      i.classList.remove('open');
    });

    // Open clicked one unless it was already open
    if (!isOpen) { item.classList.add('open'); }
  });
});


/* ──────────────────────────────────────────────
   8. INIT
   ────────────────────────────────────────────── */
updateProgress(1);


/* ──────────────────────────────────────────────
   9. SCROLLSPY FOR CONTACT SECTION
   ────────────────────────────────────────────── */
const contactSection = document.getElementById('contact');
const contactLink = document.querySelector('a[href="#contact"]');
const resLink = document.querySelector('a[href="reservations.html"]');

if (contactSection && contactLink && resLink) {
  let isFirst = true;
  const contactObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        contactLink.classList.add('nav__link--active');
        resLink.classList.remove('nav__link--active');
      } else {
        if (isFirst && window.location.hash === '#contact') {
          // Skip initial flip back to reservations if we loaded the contact section
        } else {
          contactLink.classList.remove('nav__link--active');
          resLink.classList.add('nav__link--active');
        }
      }
    });
    isFirst = false;
  }, { threshold: 0.3 });

  contactObs.observe(contactSection);
}