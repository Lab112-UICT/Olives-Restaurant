/* ═══════════════════════════════════════════════
   OLIVES RESTAURANT & BAR — main.js
   ═══════════════════════════════════════════════ */


/* ──────────────────────────────────────────────
   1. NAV — adds .scrolled class when user scrolls
   ────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (window.scrollY > 55) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ──────────────────────────────────────────────
   2. MOBILE MENU — hamburger open/close
   ────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', function () {
  // Toggle the open class on both elements
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
});

// Close mobile menu when any nav link is clicked
navLinks.querySelectorAll('.nav__link').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});


/* ──────────────────────────────────────────────
   3. INFINITE AUTO-SCROLL (SIGNATURE DISHES)
   ────────────────────────────────────────────── */
const carouselWrapper = document.querySelector('.dishes__carousel-wrapper');
const dishesScroll    = document.getElementById('dishesScroll');
const btnLeft         = document.getElementById('slideLeft');
const btnRight        = document.getElementById('slideRight');

if (dishesScroll && carouselWrapper) {
  // Clone cards for infinite effect
  const originalCards = [...dishesScroll.children];
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    dishesScroll.appendChild(clone);
  });

  let scrollSpeed  = 0.6; 
  let isPaused     = false;
  let autoScrollId = null;

  const animate = () => {
    if (!isPaused && window.innerWidth > 768) {
      dishesScroll.scrollLeft += scrollSpeed;
      
      // Seamless loop for auto-scroll
      if (dishesScroll.scrollLeft >= dishesScroll.scrollWidth / 2) {
        dishesScroll.style.scrollBehavior = 'auto';
        dishesScroll.scrollLeft = 0;
        dishesScroll.style.scrollBehavior = 'smooth';
      }
    }
    autoScrollId = requestAnimationFrame(animate);
  };
  animate();

  // Seamless jump function for manual navigation
  const jumpIfNeeded = () => {
    const half = dishesScroll.scrollWidth / 2;
    if (dishesScroll.scrollLeft >= half) {
      dishesScroll.style.scrollBehavior = 'auto';
      dishesScroll.scrollLeft -= half;
      dishesScroll.style.scrollBehavior = 'smooth';
    } else if (dishesScroll.scrollLeft <= 0) {
      dishesScroll.style.scrollBehavior = 'auto';
      dishesScroll.scrollLeft += half;
      dishesScroll.style.scrollBehavior = 'smooth';
    }
  };

  carouselWrapper.addEventListener('mouseenter', () => isPaused = true);
  carouselWrapper.addEventListener('mouseleave', () => isPaused = false);

  if (btnLeft && btnRight) {
    const scrollAmount = 350;
    
    btnLeft.addEventListener('click', () => {
      // If at the very start, jump to the end of the first half first
      if (dishesScroll.scrollLeft <= 5) {
        dishesScroll.style.scrollBehavior = 'auto';
        dishesScroll.scrollLeft = dishesScroll.scrollWidth / 2;
        dishesScroll.style.scrollBehavior = 'smooth';
      }
      dishesScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    btnRight.addEventListener('click', () => {
      dishesScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Wait for smooth scroll to finish, then jump seamlessly if we're in the second half
      setTimeout(jumpIfNeeded, 600);
    });
  }
}


/* ──────────────────────────────────────────────
   4. DISH CATEGORY FILTER
   ────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter__btn');

filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // 1. Remove .active from all buttons, add to clicked one
    filterBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    // 2. Get the chosen category from data-cat attribute
    const chosen = btn.dataset.cat;

    // 3. Select ALL cards, including clones, and hide/show them
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(function (card) {
      if (chosen === 'All' || card.dataset.cat === chosen) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


const CART_KEY = 'olives_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

const cartCountEl  = document.getElementById('cartCount');   // nav badge
const mobileBadge  = document.getElementById('mobileBadge'); // mobile CTA badge

// Updates both badges with the current cart total quantity
function updateCartBadges() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cartCountEl) {
    cartCountEl.textContent = totalQty;
    totalQty > 0 ? cartCountEl.removeAttribute('hidden') : cartCountEl.setAttribute('hidden', '');
  }
  if (mobileBadge) {
    mobileBadge.textContent = totalQty;
    totalQty > 0 ? mobileBadge.removeAttribute('hidden') : mobileBadge.setAttribute('hidden', '');
  }
}

updateCartBadges();

// Wire up Quick Add buttons using event delegation (works for original and cloned cards)
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.btn--add');
  if (!btn) return;

  const dishId   = btn.dataset.id;
  const dishName = btn.dataset.dish;
  const price    = parseInt(btn.dataset.price);
  const img      = btn.dataset.img;

  let cart = getCart();
  const existingItem = cart.find(item => item.id === dishId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id: dishId, name: dishName, price: price, img: img, qty: 1 });
  }

  saveCart(cart);
  updateCartBadges();
  
  btn.classList.add('added');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    Added!
  `;

  setTimeout(function () {
    btn.classList.remove('added');
    btn.innerHTML = originalHTML;
  }, 1600);

  showToast('✓  ' + dishName + ' added to cart');
});

// Logic for "Order Now" button on home page:
// 1. If cart is empty -> scroll to #dishes (default behavior)
// 2. If cart has items -> redirect to cart.html
const mobileOrderBtn = document.getElementById('mobileOrderBtn');
if (mobileOrderBtn) {
  mobileOrderBtn.addEventListener('click', function (e) {
    const cart = getCart();
    if (cart.length > 0) {
      e.preventDefault();
      window.location.href = 'cart.html';
    }
  });
}


/* ──────────────────────────────────────────────
   6. TOAST NOTIFICATION
   ────────────────────────────────────────────── */
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message) {
  // Clear any existing timer so toasts don't stack
  if (toastTimer) { clearTimeout(toastTimer); }

  toast.textContent = message;
  toast.classList.remove('show'); // reset animation

  // Force reflow so animation replays every time
  void toast.offsetWidth;

  toast.classList.add('show');

  // Hide after 2 seconds total (0.3s in + 1.7s visible + 0.3s out ≈ 2.3s)
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 2100);
}


/* ──────────────────────────────────────────────
   7. RESERVATION BUTTON
   ────────────────────────────────────────────── */
document.getElementById('reserveBtn').addEventListener('click', function () {
  const date   = document.getElementById('resDate').value;
  const time   = document.getElementById('resTime').value;
  const guests = document.getElementById('resGuests').value;

  if (!date || !time || !guests) {
    showToast('⚠  Please fill in all fields');
    return;
  }

  const label = guests === '1' ? 'guest' : 'guests';
  showToast('✓  Reserved for ' + guests + ' ' + label + ' on ' + date);
});


/* ──────────────────────────────────────────────
   6. SLICK MOTION INTRO + MOBILE ACTIVE CARD
   ────────────────────────────────────────────── */
const cardObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry, index) => {
    // 1. Handle reveal animation
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('reveal-visible');
        entry.target.classList.remove('reveal-hidden');
      }, index * 100); 
      // Keep observing on mobile to handle active class
      if (window.innerWidth > 768) {
        observer.unobserve(entry.target);
      }
    }

    // 2. Handle active state (for mobile outline)
    if (window.innerWidth <= 768) {
      if (entry.intersectionRatio > 0.7) {
        entry.target.classList.add('is-active');
      } else {
        entry.target.classList.remove('is-active');
      }
    }
  });
}, { 
  threshold: [0.1, 0.7, 0.8], // Multiple thresholds for different logic
  rootMargin: "0px 0px -50px 0px" 
});

// Initialize on existing cards and new clones
function initRevealObserver() {
  // Observe dish cards
  document.querySelectorAll('.dish-card').forEach(card => {
    if (!card.classList.contains('reveal-visible')) {
      card.classList.add('reveal-hidden');
    }
    cardObserver.observe(card);
  });

  // Observe story images
  document.querySelectorAll('.story-reveal').forEach(img => {
    cardObserver.observe(img);
  });

  // Observe info banner items (bubble pop)
  document.querySelectorAll('.info-reveal').forEach(item => {
    cardObserver.observe(item);
  });
}
initRevealObserver();

/* ──────────────────────────────────────────────
   9. HERO REVEAL (REMOVED)
   ────────────────────────────────────────────── */
// (Logic removed per user request)

