/* ═══════════════════════════════════════════════
   OLIVES — dashboard-customer.js
   ═══════════════════════════════════════════════ */
'use strict';

/* ──────────────────────────────────────────────
   1. MOCK DATA  (MySQL will replace this)
   ────────────────────────────────────────────── */
var FAVOURITES = [
    { id: 5, name: "Butter Chicken Tikka", cat: "Indian", tag: "Bestseller", price: 32000, shortDesc: "Slow-cooked in tomato-cream masala, garlic naan", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop&q=80" },
    { id: 8, name: "Grilled Sea Bass", cat: "Healthy", tag: "Seasonal", price: 45000, shortDesc: "Pan-seared, lemon caper butter & seasonal greens", image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&q=80" },
    { id: 6, name: "Ugandan Lamb Biryani", cat: "Indian", tag: "Signature", price: 38000, shortDesc: "Fragrant basmati, slow-braised highland lamb", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop&q=80" },
    { id: 14, name: "Tiramisu Classico", cat: "Desserts", tag: "Made Fresh Daily", price: 18000, shortDesc: "Savoiardi, espresso, mascarpone, dark cocoa", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&q=80" },
];

var ORDER_HISTORY = [
    { id: "#0045", date: "Apr 15, 2025", status: "delivered", dishes: ["Butter Chicken Tikka", "Tiramisu Classico", "Wild Hibiscus Lemonade"], total: 68000 },
    { id: "#0041", date: "Apr 3, 2025", status: "delivered", dishes: ["Grilled Sea Bass", "Truffle Arancini"], total: 73000 },
    { id: "#0038", date: "Mar 25, 2025", status: "delivered", dishes: ["Ugandan Lamb Biryani", "Warm Chocolate Fondant"], total: 58000 },
    { id: "#0031", date: "Mar 10, 2025", status: "cancelled", dishes: ["Tagliatelle al Ragù"], total: 34000 },
    { id: "#0028", date: "Feb 28, 2025", status: "delivered", dishes: ["Butter Chicken Tikka", "Avocado Power Bowl", "Cold Brew"], total: 64000 },
];

var BOOKINGS = [
    { id: "BK-112", date: "26 April 2025", day: "26", month: "April 2025", time: "7:00 PM", guests: 4, occasion: "Date Night", status: "confirmed", notes: "Window table preferred" },
    { id: "BK-098", date: "12 April 2025", day: "12", month: "April 2025", time: "1:00 PM", guests: 2, occasion: "Business Lunch", status: "past", notes: "" },
    { id: "BK-082", date: "28 March 2025", day: "28", month: "March 2025", time: "8:00 PM", guests: 6, occasion: "Celebration", status: "past", notes: "Birthday setup requested" },
    { id: "BK-064", date: "10 Feb 2025", day: "10", month: "Feb 2025", time: "7:30 PM", guests: 2, occasion: "Casual Dining", status: "cancelled", notes: "" },
];

var fmt = function (n) { return "UGX " + Math.round(n).toLocaleString(); };


/* ──────────────────────────────────────────────
   2. PANEL NAVIGATION
   ────────────────────────────────────────────── */
var activeFavIds = FAVOURITES.map(function (f) { return f.id; });

function showPanel(name) {
    document.querySelectorAll('.dash-panel').forEach(function (p) {
        p.classList.add('dash-panel--hidden');
    });

    var panel = document.getElementById('panel' + name.charAt(0).toUpperCase() + name.slice(1));
    if (panel) {
        panel.classList.remove('dash-panel--hidden');
        /* Re-trigger animation */
        panel.style.animation = 'none';
        void panel.offsetWidth;
        panel.style.animation = '';
    }

    /* Update sidebar active state */
    document.querySelectorAll('.sidebar__nav-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.panel === name);
    });

    /* Update page title */
    var titles = {
        overview: 'Overview', favourites: 'My Favourites',
        orders: 'Order History', bookings: 'My Bookings',
        rewards: 'Loyalty & Rewards', menu: 'Full Menu'
    };
    var el = document.getElementById('pageTitle');
    if (el) el.textContent = titles[name] || 'Dashboard';

    /* Lazy-render panels */
    if (name === 'favourites') renderFavourites();
    if (name === 'orders') renderOrders();
    if (name === 'bookings') renderBookings();

    /* Close mobile sidebar */
    closeSidebar();
}

/* Wire all nav buttons (sidebar + overview quick-links) */
document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-panel]');
    if (btn) showPanel(btn.dataset.panel);
});


/* ──────────────────────────────────────────────
   3. MOBILE SIDEBAR
   ────────────────────────────────────────────── */
var sidebar = document.getElementById('sidebar');
var backdrop = document.getElementById('sidebarBackdrop');
var hamburger = document.getElementById('sidebarToggle');
var closeBtn = document.getElementById('sidebarClose');

function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
    hamburger.classList.add('open');
}
function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.classList.remove('open');
}

hamburger.addEventListener('click', function () {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
backdrop.addEventListener('click', closeSidebar);


/* ──────────────────────────────────────────────
   4. TOAST
   ────────────────────────────────────────────── */
var toastEl = document.getElementById('dashToast');
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
   5. CART BADGE (reads localStorage)
   ────────────────────────────────────────────── */
function updateCartBadge() {
    try {
        var items = JSON.parse(localStorage.getItem('olives_cart')) || [];
        var total = items.reduce(function (s, i) { return s + i.qty; }, 0);
        var badges = [
            document.getElementById('cartBadgeTop'),
            document.getElementById('mobCartBadge')
        ];
        badges.forEach(function (b) {
            if (!b) return;
            b.textContent = total;
            total > 0 ? b.removeAttribute('hidden') : b.setAttribute('hidden', '');
        });
    } catch (e) { }
}

function addToCart(dish) {
    try {
        var items = JSON.parse(localStorage.getItem('olives_cart')) || [];
        var ex = items.find(function (i) { return i.id === dish.id; });
        if (ex) { ex.qty++; }
        else {
            items.push({ id: dish.id, name: dish.name, price: dish.price, image: dish.image, cat: dish.cat, tag: dish.tag, qty: 1 });
        }
        localStorage.setItem('olives_cart', JSON.stringify(items));
        updateCartBadge();
        showToast('✓  ' + dish.name + ' added to cart');
    } catch (e) { }
}


/* ──────────────────────────────────────────────
   6. OVERVIEW — render usual items + fav scroll
   ────────────────────────────────────────────── */
function renderOverview() {
    /* "Order the usual" — last 3 distinct dishes from history */
    var usualDishes = [];
    var seen = {};
    ORDER_HISTORY.forEach(function (order) {
        if (order.status === 'cancelled') return;
        order.dishes.forEach(function (name) {
            if (!seen[name] && usualDishes.length < 3) {
                seen[name] = true;
                var match = FAVOURITES.find(function (f) { return f.name === name; });
                usualDishes.push({
                    name: name,
                    price: match ? match.price : 28000,
                    image: match ? match.image : "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop&q=70",
                    data: match
                });
            }
        });
    });

    var ul = document.getElementById('usualList');
    ul.innerHTML = usualDishes.map(function (d) {
        return '<div class="usual-item">'
            + '<img src="' + d.image + '" alt="' + d.name + '" class="usual-item__img">'
            + '<div><div class="usual-item__name">' + d.name + '</div><div class="usual-item__price">' + fmt(d.price) + '</div></div>'
            + '<button class="usual-item__reorder" data-dish-name="' + d.name + '">Reorder</button>'
            + '</div>';
    }).join('');

    /* Wire reorder buttons */
    ul.querySelectorAll('.usual-item__reorder').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var name = btn.dataset.dishName;
            var dish = FAVOURITES.find(function (f) { return f.name === name; });
            if (dish) addToCart(dish);
            else showToast('✓  ' + name + ' added to cart');
        });
    });

    /* Favourite scroll */
    var scroll = document.getElementById('overviewFavScroll');
    scroll.innerHTML = FAVOURITES.map(function (f) {
        return '<div class="fav-mini">'
            + '<img src="' + f.image + '" alt="' + f.name + '" class="fav-mini__img">'
            + '<div class="fav-mini__name">' + f.name + '</div>'
            + '<div class="fav-mini__price">' + fmt(f.price) + '</div>'
            + '<div class="fav-mini__heart">♥</div>'
            + '</div>';
    }).join('');
}


/* ──────────────────────────────────────────────
   7. FAVOURITES PANEL
   ────────────────────────────────────────────── */
function renderFavourites() {
    var grid = document.getElementById('favGrid');
    var empty = document.getElementById('favEmpty');
    var active = FAVOURITES.filter(function (f) { return activeFavIds.indexOf(f.id) > -1; });

    if (active.length === 0) {
        grid.innerHTML = '';
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    grid.innerHTML = active.map(function (f) {
        return '<div class="fav-card" data-fav-id="' + f.id + '">'
            + '<div class="fav-card__img-wrap">'
            + '<img src="' + f.image + '" alt="' + f.name + '" class="fav-card__img" loading="lazy">'
            + '<span class="fav-card__tag">' + f.tag + '</span>'
            + '<button class="fav-card__remove" data-fav-id="' + f.id + '" aria-label="Remove from favourites">♥</button>'
            + '</div>'
            + '<div class="fav-card__body">'
            + '<div class="fav-card__cat">' + f.cat + '</div>'
            + '<div class="fav-card__name">' + f.name + '</div>'
            + '<div class="fav-card__desc">' + f.shortDesc + '</div>'
            + '<div class="fav-card__footer">'
            + '<span class="fav-card__price">' + fmt(f.price) + '</span>'
            + '<button class="fav-card__add" data-fav-id="' + f.id + '">+ Add to Cart</button>'
            + '</div>'
            + '</div>'
            + '</div>';
    }).join('');

    /* Remove from favourites */
    grid.querySelectorAll('.fav-card__remove').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var id = parseInt(btn.dataset.favId);
            activeFavIds = activeFavIds.filter(function (i) { return i !== id; });
            /* Update sidebar badge */
            var badge = document.getElementById('favBadgeSidebar');
            if (badge) badge.textContent = activeFavIds.length;
            renderFavourites();
            showToast('Removed from favourites');
        });
    });

    /* Add to cart */
    grid.querySelectorAll('.fav-card__add').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var id = parseInt(btn.dataset.favId);
            var dish = FAVOURITES.find(function (f) { return f.id === id; });
            if (dish) addToCart(dish);
        });
    });
}


/* ──────────────────────────────────────────────
   8. ORDER HISTORY PANEL
   ────────────────────────────────────────────── */
function renderOrders() {
    var list = document.getElementById('ordersList');
    list.innerHTML = ORDER_HISTORY.map(function (order) {
        var statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        var canReorder = order.status === 'delivered';
        return '<div class="order-item">'
            + '<div>'
            + '<div class="order-item__num">Order</div>'
            + '<div class="order-item__id">' + order.id + '</div>'
            + '<div class="order-item__date">' + order.date + '</div>'
            + '<div class="order-item__dishes">'
            + order.dishes.map(function (d) { return '<span class="order-item__dish-pill">' + d + '</span>'; }).join('')
            + '</div>'
            + '</div>'
            + '<div class="order-item__right">'
            + '<div class="order-item__total">' + fmt(order.total) + '</div>'
            + '<span class="order-item__status status--' + order.status + '">' + statusLabel + '</span>'
            + (canReorder ? '<button class="order-item__reorder" data-order-id="' + order.id + '">↺ Order Again</button>' : '')
            + '</div>'
            + '</div>';
    }).join('');

    /* Reorder logic */
    list.querySelectorAll('.order-item__reorder').forEach(function (btn) {
        btn.addEventListener('click', function () {
            showToast('✓  Items added — head to cart to confirm');
            /* In full version: loop order dishes, add each to cart */
        });
    });
}


/* ──────────────────────────────────────────────
   9. BOOKINGS PANEL
   ────────────────────────────────────────────── */
function renderBookings() {
    var list = document.getElementById('bookingsList');
    list.innerHTML = BOOKINGS.map(function (bk) {
        var statusClass = 'booking-card--' + (bk.status === 'confirmed' ? '' : bk.status);
        var badgeLabel = bk.status.charAt(0).toUpperCase() + bk.status.slice(1);
        var actions = bk.status === 'confirmed'
            ? '<button class="bk-btn bk-btn--outline" data-bk-id="' + bk.id + '" data-action="modify">Modify</button>'
            + '<button class="bk-btn bk-btn--danger"  data-bk-id="' + bk.id + '" data-action="cancel">Cancel</button>'
            : '<span style="font-size:12px;color:var(--muted);">' + (bk.status === 'past' ? 'Completed visit' : 'Cancelled') + '</span>';

        return '<div class="booking-card ' + statusClass + '" id="bk-' + bk.id + '">'
            + '<div class="booking-card__badge">' + badgeLabel + '</div>'
            + '<div class="booking-card__date"><span class="booking-card__day">' + bk.day + '</span><span class="booking-card__month">' + bk.month + '</span></div>'
            + '<div class="booking-card__meta">'
            + '<div class="booking-card__meta-row"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' + bk.time + ' · ' + bk.occasion + '</div>'
            + '<div class="booking-card__meta-row"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' + bk.guests + ' guests</div>'
            + (bk.notes ? '<div class="booking-card__meta-row" style="font-style:italic;font-size:12px">' + bk.notes + '</div>' : '')
            + '</div>'
            + '<div class="booking-card__actions">' + actions + '</div>'
            + '</div>';
    }).join('');

    /* Booking actions */
    list.querySelectorAll('[data-action]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = btn.dataset.bkId;
            var action = btn.dataset.action;
            if (action === 'cancel') {
                if (!confirm('Cancel booking ' + id + '? This cannot be undone.')) return;
                var card = document.getElementById('bk-' + id);
                if (card) {
                    card.classList.add('booking-card--cancelled');
                    card.querySelector('.booking-card__badge').textContent = 'Cancelled';
                    card.querySelector('.booking-card__actions').innerHTML = '<span style="font-size:12px;color:var(--muted)">Booking cancelled</span>';
                }
                showToast('Booking ' + id + ' cancelled');
            } else {
                window.location.href = 'reservations.html';
            }
        });
    });
}


/* ──────────────────────────────────────────────
   10. REWARDS: REDEEM BUTTONS
   ────────────────────────────────────────────── */
document.querySelectorAll('.redeem-item__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var pts = btn.closest('.redeem-item').querySelector('.redeem-item__pts').textContent;
        var label = btn.closest('.redeem-item').querySelector('.redeem-item__label').textContent;
        showToast('✓  Redeemed ' + pts + ' for ' + label);
    });
});


/* ──────────────────────────────────────────────
   11. SEARCH (filter across overview content)
   ────────────────────────────────────────────── */
var searchInput = document.querySelector('.dash-search__input');
if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            showPanel('menu');
        }
    });
}


/* ──────────────────────────────────────────────
   12. GREETING based on time of day
   ────────────────────────────────────────────── */
(function () {
    var h = new Date().getHours();
    var greeting = h < 12 ? 'Good morning 🌅'
        : h < 17 ? 'Good afternoon ☀️'
            : 'Good evening 🌙';
    var el = document.querySelector('.welcome-strip__eyebrow');
    if (el) el.textContent = greeting;
})();


/* ──────────────────────────────────────────────
   13. INIT
   ────────────────────────────────────────────── */
renderOverview();
updateCartBadge();