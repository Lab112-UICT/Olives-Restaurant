/* ═══════════════════════════════════════════════
   OLIVES — cart.js
   Reads from localStorage (set by menu.js),
   renders item cards, handles qty + removal
   with GSAP animations, calculates totals.
   ═══════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   1. CONSTANTS & CONFIG
   ────────────────────────────────────────────── */
const CART_KEY       = 'olives_cart';
const DELIVERY_FEE   = 5000;          // UGX
const FREE_THRESHOLD = 100000;        // free delivery above this subtotal
const fmt = function (n) {
  return 'UGX ' + Math.round(n).toLocaleString();
};


/* ──────────────────────────────────────────────
   2. CART DATA (localStorage backed)
   ────────────────────────────────────────────── */
function cartLoad() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}

function cartSave(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function cartClear() {
  localStorage.removeItem(CART_KEY);
}


/* ──────────────────────────────────────────────
   3. NAV badge
   ────────────────────────────────────────────── */
function updateNavBadge() {
  var total = cartLoad().reduce(function (s, i) { return s + i.qty; }, 0);
  var el = document.getElementById('cartCount');
  if (!el) return;
  el.textContent = total;
  total > 0 ? el.removeAttribute('hidden') : el.setAttribute('hidden', '');
}


/* ──────────────────────────────────────────────
   4. BUILD A SINGLE ITEM CARD
   Returns a DOM element (not HTML string)
   so GSAP can animate it directly.
   ────────────────────────────────────────────── */
function buildCard(item) {
  var card = document.createElement('article');
  card.className = 'cart-item';
  card.dataset.id = item.id;

  card.innerHTML = [
    '<div class="cart-item__img-wrap">',
      '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item__img" loading="lazy">',
    '</div>',
    '<div class="cart-item__body">',
      '<span class="cart-item__cat">' + item.cat + '</span>',
      '<div class="cart-item__name">' + item.name + '</div>',
      '<div class="cart-item__unit-price">' + fmt(item.price) + ' each</div>',
      '<div class="cart-item__controls">',
        '<div class="cart-item__qty">',
          '<button class="cart-item__qty-btn" data-action="minus" aria-label="Decrease quantity">',
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
          '</button>',
          '<span class="cart-item__qty-num">' + item.qty + '</span>',
          '<button class="cart-item__qty-btn" data-action="plus" aria-label="Increase quantity">',
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
          '</button>',
        '</div>',
        '<span class="cart-item__line-price">' + fmt(item.price * item.qty) + '</span>',
      '</div>',
    '</div>',
    /* Remove icon — positioned absolute top-right */
    '<button class="cart-item__remove" data-action="remove" aria-label="Remove ' + item.name + '">',
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
      '</svg>',
    '</button>'
  ].join('');

  /* Wire quantity buttons */
  card.querySelectorAll('.cart-item__qty-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      handleQtyChange(item.id, btn.dataset.action);
    });
  });

  /* Wire remove button */
  card.querySelector('.cart-item__remove').addEventListener('click', function (e) {
    e.stopPropagation();
    removeItem(item.id, card);
  });

  return card;
}


/* ──────────────────────────────────────────────
   5. RENDER ALL CARDS
   ────────────────────────────────────────────── */
function render() {
  var items      = cartLoad();
  var itemsEl    = document.getElementById('cartItems');
  var mainEl     = document.getElementById('cartMain');
  var emptyEl    = document.getElementById('cartEmpty');
  var mobileBar  = document.getElementById('cartMobileBar');
  var heroCount  = document.getElementById('heroCount');

  /* Hero count */
  var total = items.reduce(function (s, i) { return s + i.qty; }, 0);
  heroCount.textContent = total + (total === 1 ? ' item in your basket' : ' items in your basket');

  if (items.length === 0) {
    /* Show empty state */
    mainEl.hidden  = true;
    emptyEl.hidden = false;
    mobileBar.style.display = 'none';
    updateTotals(items);
    updateNavBadge();
    return;
  }

  /* Show main */
  mainEl.hidden  = false;
  emptyEl.hidden = true;

  /* Re-build cards */
  itemsEl.innerHTML = '';
  items.forEach(function (item) {
    itemsEl.appendChild(buildCard(item));
  });

  updateTotals(items);
  updateNavBadge();

  /* Show mobile bar on small screens */
  if (window.innerWidth < 768) {
    mobileBar.style.display = 'flex';
  }
}


/* ──────────────────────────────────────────────
   6. TOTALS CALCULATION
   ────────────────────────────────────────────── */
function updateTotals(items) {
  var subtotal = items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  var free     = subtotal >= FREE_THRESHOLD;
  var delivery = free ? 0 : (items.length > 0 ? DELIVERY_FEE : 0);
  var total    = subtotal + delivery;

  /* Update sidebar values */
  var subtotalEl  = document.getElementById('subtotalVal');
  var deliveryEl  = document.getElementById('deliveryVal');
  var deliveryBdg = document.getElementById('deliveryBadge');
  var totalEl     = document.getElementById('totalVal');
  var mobileTotal = document.getElementById('mobileTotalVal');

  if (subtotalEl)  subtotalEl.textContent  = fmt(subtotal);
  if (totalEl)     totalEl.textContent     = fmt(total);
  if (mobileTotal) mobileTotal.textContent = fmt(total);

  if (deliveryEl) {
    if (items.length === 0) {
      deliveryEl.textContent = '—';
    } else if (free) {
      deliveryEl.textContent  = 'Free';
      deliveryEl.classList.add('cart-summary__value--free');
      if (deliveryBdg) deliveryBdg.textContent = 'Free delivery!';
    } else {
      deliveryEl.textContent  = fmt(DELIVERY_FEE);
      deliveryEl.classList.remove('cart-summary__value--free');
      var remaining = FREE_THRESHOLD - subtotal;
      if (deliveryBdg && remaining > 0) {
        deliveryBdg.textContent = 'Add ' + fmt(remaining) + ' for free delivery';
      }
    }
  }
}


/* ──────────────────────────────────────────────
   7. QUANTITY CHANGE
   Updates storage + re-renders just the
   affected card's qty & price in place.
   ────────────────────────────────────────────── */
function handleQtyChange(id, action) {
  var items = cartLoad();
  var item  = items.find(function (i) { return i.id === id; });
  if (!item) return;

  if (action === 'plus') {
    item.qty = Math.min(item.qty + 1, 20);
  } else if (action === 'minus') {
    if (item.qty <= 1) {
      /* Remove item when qty reaches 0 */
      var card = document.querySelector('.cart-item[data-id="' + id + '"]');
      removeItem(id, card);
      return;
    }
    item.qty--;
  }

  cartSave(items);

  /* Update just the qty number and line price in the DOM — no full re-render */
  var card     = document.querySelector('.cart-item[data-id="' + id + '"]');
  if (card) {
    card.querySelector('.cart-item__qty-num').textContent   = item.qty;
    card.querySelector('.cart-item__line-price').textContent = fmt(item.price * item.qty);
  }

  /* Recalc totals */
  updateTotals(cartLoad());
  updateNavBadge();

  /* Update hero count */
  var total = cartLoad().reduce(function (s, i) { return s + i.qty; }, 0);
  document.getElementById('heroCount').textContent =
    total + (total === 1 ? ' item in your basket' : ' items in your basket');
}


/* ──────────────────────────────────────────────
   8. REMOVE ITEM — GSAP animated collapse
   ────────────────────────────────────────────── */
function removeItem(id, cardEl) {
  if (!cardEl) return;

  /* Remove from storage immediately */
  var items = cartLoad().filter(function (i) { return i.id !== id; });
  cartSave(items);
  updateNavBadge();

  /* Measure natural height for smooth collapse */
  var fullHeight = cardEl.offsetHeight;

  gsap.timeline()
    .to(cardEl, {
      opacity: 0,
      x: 40,
      duration: 0.25,
      ease: 'power2.in'
    })
    .to(cardEl, {
      height: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: function () {
        cardEl.remove();

        /* After removal — check empty state */
        var remaining = cartLoad();
        if (remaining.length === 0) {
          document.getElementById('cartMain').hidden  = true;
          document.getElementById('cartEmpty').hidden = false;
          document.getElementById('cartMobileBar').style.display = 'none';
        }
        updateTotals(remaining);

        var total = remaining.reduce(function (s, i) { return s + i.qty; }, 0);
        document.getElementById('heroCount').textContent =
          total + (total === 1 ? ' item in your basket' : ' items in your basket');
      }
    });
}


/* ──────────────────────────────────────────────
   9. CLEAR ALL
   ────────────────────────────────────────────── */
document.getElementById('clearAllBtn').addEventListener('click', function () {
  var cards = document.querySelectorAll('.cart-item');
  if (cards.length === 0) return;

  /* Stagger-remove all cards with GSAP */
  gsap.to(cards, {
    opacity: 0, x: 40, stagger: 0.06,
    duration: 0.22, ease: 'power2.in',
    onComplete: function () {
      cartClear();
      render();
      showToast('Basket cleared');
    }
  });
});


/* ──────────────────────────────────────────────
   10. CHECKOUT
   ────────────────────────────────────────────── */
function handleCheckout() {
  var items = cartLoad();
  if (items.length === 0) {
    showToast('⚠  Your basket is empty');
    return;
  }

  var total    = items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  var free     = total >= FREE_THRESHOLD;
  var delivery = free ? 0 : DELIVERY_FEE;
  var grand    = total + delivery;

  /* Show modal */
  var backdrop = document.getElementById('orderModalBackdrop');
  var modal    = document.getElementById('orderModal');
  var sub      = document.getElementById('orderModalSub');

  sub.textContent = items.length + ' dish' + (items.length > 1 ? 'es' : '') +
    ' · Total: ' + fmt(grand) + ' · Estimated delivery: 30–45 min.';

  backdrop.hidden = false;
  modal.hidden    = false;

  /* Clear cart after confirming */
  cartClear();
  render();
}

document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
document.getElementById('mobileCheckoutBtn').addEventListener('click', handleCheckout);

/* Close modal on backdrop click */
document.getElementById('orderModalBackdrop').addEventListener('click', function () {
  document.getElementById('orderModalBackdrop').hidden = true;
  document.getElementById('orderModal').hidden = true;
});


/* ──────────────────────────────────────────────
   11. PROMO CODE
   ────────────────────────────────────────────── */
document.getElementById('promoBtn').addEventListener('click', function () {
  var code = document.getElementById('promoInput').value.trim().toUpperCase();
  if (code === 'OLIVES10') {
    showToast('✓  10% discount applied!');
    document.getElementById('promoInput').value = '';
  } else if (code === '') {
    showToast('⚠  Please enter a promo code');
  } else {
    showToast('⚠  Code "' + code + '" is not valid');
  }
});


/* ──────────────────────────────────────────────
   12. NAV (shared scroll + hamburger)
   ────────────────────────────────────────────── */
var navbar    = document.getElementById('navbar');
var hamburger = document.getElementById('hamburger');
var navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 55);
});

hamburger.addEventListener('click', function () {
  var open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});

navLinks.querySelectorAll('.nav__link').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* Nav cart icon stays on cart page */
document.getElementById('cartBtn').addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ──────────────────────────────────────────────
   13. MOBILE BAR — show/hide on resize
   ────────────────────────────────────────────── */
window.addEventListener('resize', function () {
  var bar   = document.getElementById('cartMobileBar');
  var items = cartLoad();
  if (window.innerWidth < 768 && items.length > 0) {
    bar.style.display = 'flex';
  } else {
    bar.style.display = 'none';
  }
});


/* ──────────────────────────────────────────────
   14. TOAST
   ────────────────────────────────────────────── */
var toast     = document.getElementById('toast');
var toastTimer = null;

function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
}


/* ──────────────────────────────────────────────
   15. INIT
   ────────────────────────────────────────────── */
render();