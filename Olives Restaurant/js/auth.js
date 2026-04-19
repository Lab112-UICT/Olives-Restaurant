/* ═══════════════════════════════════════════════
   OLIVES — auth.js
   ═══════════════════════════════════════════════ */
'use strict';


/* ──────────────────────────────────────────────
   1. MODE STATE  ('login' | 'register')
   ────────────────────────────────────────────── */
var currentMode = 'login';

var MODES = {
  login: {
    imgId     : 'authImgLogin',
    formId    : 'formLogin',
    imgTitle  : 'Welcome<br><em>Back.</em>',
    imgSub    : 'Sign in to manage your orders, bookings, and preferences.',
    imgTag    : 'Grilled Sea Bass — UGX 45,000',
    topHint   : 'New here?',
    topSwitch : 'Create Account'
  },
  register: {
    imgId     : 'authImgRegister',
    formId    : 'formRegister',
    imgTitle  : 'Join the<br><em>Experience.</em>',
    imgSub    : 'Create your free account and enjoy exclusive member perks and early reservations.',
    imgTag    : 'Ugandan Lamb Biryani — UGX 38,000',
    topHint   : 'Have an account?',
    topSwitch : 'Sign In'
  }
};


/* ──────────────────────────────────────────────
   2. SWITCH BETWEEN MODES
   ────────────────────────────────────────────── */
function switchMode(target) {
  if (target === currentMode) return;

  var prev    = MODES[currentMode];
  var next    = MODES[target];
  currentMode = target;

  /* Swap forms */
  document.getElementById(prev.formId).classList.add('auth-form--hidden');
  var nextForm = document.getElementById(next.formId);
  nextForm.classList.remove('auth-form--hidden');
  /* Re-trigger animation */
  nextForm.style.animation = 'none';
  void nextForm.offsetWidth;
  nextForm.style.animation = '';

  /* Swap images */
  document.querySelectorAll('.auth-img-panel__img').forEach(function (img) {
    img.classList.remove('auth-img-panel__img--active');
  });
  var nextImg = document.getElementById(next.imgId);
  nextImg.classList.add('auth-img-panel__img--active');

  /* Update caption (innerHTML for em tags) */
  document.getElementById('imgTitle').innerHTML = next.imgTitle;
  document.getElementById('imgSub').textContent = next.imgSub;
  document.getElementById('imgDishTag').innerHTML =
    '<span class="auth-img-panel__dish-tag-dot"></span>' + next.imgTag;

  /* Update topbar */
  document.getElementById('topHint').textContent   = next.topHint;
  document.getElementById('topSwitch').textContent = next.topSwitch;

  /* Scroll form panel to top */
  document.querySelector('.auth-form-panel').scrollTo({ top: 0, behavior: 'smooth' });
}

/* Topbar switch button */
document.getElementById('topSwitch').addEventListener('click', function () {
  switchMode(currentMode === 'login' ? 'register' : 'login');
});

/* In-form switch links */
document.querySelectorAll('.auth-form__switch-link').forEach(function (btn) {
  btn.addEventListener('click', function () {
    switchMode(btn.dataset.target);
  });
});


/* ──────────────────────────────────────────────
   3. PASSWORD VISIBILITY TOGGLE
   ────────────────────────────────────────────── */
document.querySelectorAll('.auth-field__toggle-pw').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var targetId = btn.dataset.target;
    var input    = document.getElementById(targetId);
    if (!input) return;

    var isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';

    /* Swap icon */
    btn.innerHTML = isText
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  });
});


/* ──────────────────────────────────────────────
   4. PASSWORD STRENGTH METER
   ────────────────────────────────────────────── */
var regPwInput = document.getElementById('regPassword');

regPwInput.addEventListener('input', function () {
  var val     = regPwInput.value;
  var meter   = document.getElementById('pwStrength');
  var label   = document.getElementById('pwLabel');
  var bars    = [
    document.getElementById('pwBar1'),
    document.getElementById('pwBar2'),
    document.getElementById('pwBar3'),
    document.getElementById('pwBar4')
  ];

  if (val.length === 0) { meter.hidden = true; return; }
  meter.hidden = false;

  /* Score */
  var score = 0;
  if (val.length >= 8)              score++;
  if (/[A-Z]/.test(val))           score++;
  if (/[0-9]/.test(val))           score++;
  if (/[^A-Za-z0-9]/.test(val))   score++;

  var levels = ['', 'fill-weak', 'fill-fair', 'fill-good', 'fill-strong'];
  var labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  /* Reset */
  bars.forEach(function (b) { b.className = 'pw-strength__bar'; });

  /* Fill up to score */
  for (var i = 0; i < score; i++) {
    bars[i].classList.add(levels[score]);
  }
  label.textContent = labels[score];
  label.style.color = score <= 1 ? '#e05252'
                    : score === 2 ? '#e09a2c'
                    : score === 3 ? 'var(--gold)'
                    : '#2d7a3a';
});


/* ──────────────────────────────────────────────
   5. TOAST
   ────────────────────────────────────────────── */
var toastEl    = document.getElementById('authToast');
var toastTimer = null;

function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.remove('show');
  void toastEl.offsetWidth;
  toastEl.classList.add('show');
  toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2300);
}


/* ──────────────────────────────────────────────
   6. VALIDATION HELPERS
   ────────────────────────────────────────────── */
function setFieldState(inputEl, state) {
  inputEl.classList.remove('error', 'success');
  if (state) inputEl.classList.add(state);
}

function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function validatePhone(val) {
  return /^\+?[\d\s\-]{9,16}$/.test(val.trim());
}


/* ──────────────────────────────────────────────
   7. LOGIN SUBMIT
   ────────────────────────────────────────────── */
document.getElementById('loginSubmit').addEventListener('click', function () {
  var emailEl = document.getElementById('loginEmail');
  var pwEl    = document.getElementById('loginPassword');
  var btn     = this;
  var valid   = true;

  if (!validateEmail(emailEl.value)) {
    setFieldState(emailEl, 'error');
    showToast('⚠  Please enter a valid email');
    valid = false;
  } else {
    setFieldState(emailEl, 'success');
  }

  if (pwEl.value.length < 6) {
    setFieldState(pwEl, 'error');
    if (valid) showToast('⚠  Password must be at least 6 characters');
    valid = false;
  } else {
    setFieldState(pwEl, 'success');
  }

  if (!valid) return;

  /* Simulate sign-in */
  btn.disabled = true;
  btn.querySelector('.auth-submit__text').textContent = 'Signing in…';

  setTimeout(function () {
    btn.disabled = false;
    btn.querySelector('.auth-submit__text').textContent = 'Sign In';
    showToast('✓  Welcome back! Redirecting…');
    setTimeout(function () { window.location.href = 'index.html'; }, 1400);
  }, 1400);
});


/* ──────────────────────────────────────────────
   8. REGISTER SUBMIT
   ────────────────────────────────────────────── */
document.getElementById('registerSubmit').addEventListener('click', function () {
  var firstEl  = document.getElementById('regFirst');
  var lastEl   = document.getElementById('regLast');
  var emailEl  = document.getElementById('regEmail');
  var phoneEl  = document.getElementById('regPhone');
  var pwEl     = document.getElementById('regPassword');
  var termsEl  = document.getElementById('agreeTerms');
  var btn      = this;
  var valid    = true;

  if (firstEl.value.trim().length < 2) {
    setFieldState(firstEl, 'error');
    showToast('⚠  Please enter your first name');
    valid = false;
  } else { setFieldState(firstEl, 'success'); }

  if (lastEl.value.trim().length < 2) {
    setFieldState(lastEl, 'error');
    if (valid) showToast('⚠  Please enter your last name');
    valid = false;
  } else { setFieldState(lastEl, 'success'); }

  if (!validateEmail(emailEl.value)) {
    setFieldState(emailEl, 'error');
    if (valid) showToast('⚠  Please enter a valid email');
    valid = false;
  } else { setFieldState(emailEl, 'success'); }

  if (!validatePhone(phoneEl.value)) {
    setFieldState(phoneEl, 'error');
    if (valid) showToast('⚠  Please enter a valid phone number');
    valid = false;
  } else { setFieldState(phoneEl, 'success'); }

  if (pwEl.value.length < 8) {
    setFieldState(pwEl, 'error');
    if (valid) showToast('⚠  Password must be at least 8 characters');
    valid = false;
  } else { setFieldState(pwEl, 'success'); }

  if (!termsEl.checked) {
    if (valid) showToast('⚠  Please agree to the Terms of Service');
    valid = false;
  }

  if (!valid) return;

  /* Simulate registration */
  btn.disabled = true;
  btn.querySelector('.auth-submit__text').textContent = 'Creating account…';

  setTimeout(function () {
    btn.disabled = false;
    btn.querySelector('.auth-submit__text').textContent = 'Create My Account';
    showToast('✓  Account created! Welcome to Olives 🎉');
    setTimeout(function () { window.location.href = 'index.html'; }, 1600);
  }, 1600);
});


/* ──────────────────────────────────────────────
   9. SOCIAL BUTTON STUBS
   (wire to real OAuth providers when backend ready)
   ────────────────────────────────────────────── */
document.querySelectorAll('.social-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var name = btn.classList.contains('social-btn--google')   ? 'Google'
             : btn.classList.contains('social-btn--apple')    ? 'Apple'
             : 'Facebook';
    showToast('↗  Redirecting to ' + name + ' sign-in…');
    /* TODO: window.location.href = '/auth/' + name.toLowerCase(); */
  });
});


/* ──────────────────────────────────────────────
   10. CLEAR FIELD ERRORS ON INPUT
   ────────────────────────────────────────────── */
document.querySelectorAll('.auth-field__input').forEach(function (input) {
  input.addEventListener('input', function () {
    input.classList.remove('error');
  });
});


/* ──────────────────────────────────────────────
   11. FORGOT PASSWORD
   ────────────────────────────────────────────── */
document.querySelector('.auth-field__forgot').addEventListener('click', function () {
  var emailEl = document.getElementById('loginEmail');
  if (!validateEmail(emailEl.value)) {
    showToast('⚠  Enter your email above first');
    emailEl.focus();
    return;
  }
  showToast('✓  Reset link sent to ' + emailEl.value.trim());
});


/* ──────────────────────────────────────────────
   12. URL PARAM — open register mode directly
   e.g. auth.html?mode=register
   ────────────────────────────────────────────── */
(function () {
  var params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'register') {
    switchMode('register');
  }
})();