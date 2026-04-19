/* ═══════════════════════════════════════════════
   OLIVES — dashboard-admin.js
   Loaded after menu.js so DISHES[] is available.
   ═══════════════════════════════════════════════ */
'use strict';

/* ──────────────────────────────────────────────
   1. ADMIN STATE  (MySQL will replace this)
   ────────────────────────────────────────────── */

/* Clones the DISHES array and adds admin fields */
var adminMenu = (typeof DISHES !== 'undefined' ? DISHES : []).map(function (d) {
    return Object.assign({}, d, { available: true, discount: 0 });
});

/* Out-of-stock overrides (persisted per session) */
try {
    var saved = JSON.parse(sessionStorage.getItem('olives_admin_stock') || '{}');
    adminMenu.forEach(function (d) {
        if (saved[d.id] !== undefined) d.available = saved[d.id];
        if (saved['disc_' + d.id] !== undefined) d.discount = saved['disc_' + d.id];
    });
} catch (e) { }

function saveStock() {
    var map = {};
    adminMenu.forEach(function (d) {
        map[d.id] = d.available;
        map['disc_' + d.id] = d.discount;
    });
    try { sessionStorage.setItem('olives_admin_stock', JSON.stringify(map)); } catch (e) { }
    /* Update overview out-of-stock count */
    var oos = adminMenu.filter(function (d) { return !d.available; }).length;
    var el = document.getElementById('outOfStockCount');
    var note = document.getElementById('outOfStockNote');
    if (el) el.textContent = oos;
    if (note) note.textContent = oos > 0
        ? oos + ' item' + (oos > 1 ? 's' : '') + ' hidden from customers'
        : 'All items available';
}

var BOOKINGS = [
    { id: 'BK-112', guest: 'Amara Nakato', time: '7:00 PM', covers: 4, occasion: 'Date Night', table: 'T4', status: 'confirmed' },
    { id: 'BK-113', guest: 'David Ochieng', time: '7:30 PM', covers: 2, occasion: 'Casual Dining', table: 'T7', status: 'confirmed' },
    { id: 'BK-114', guest: 'Grace Auma', time: '8:00 PM', covers: 6, occasion: 'Celebration', table: 'T2', status: 'seated' },
    { id: 'BK-115', guest: 'Moses Byamugisha', time: '8:30 PM', covers: 3, occasion: 'Business', table: 'T5', status: 'confirmed' },
    { id: 'BK-116', guest: 'Fatuma Hassan', time: '9:00 PM', covers: 2, occasion: 'Date Night', table: 'T9', status: 'cancelled' },
];

var LIVE_ORDERS = [
    { id: '#0058', customer: 'Delivery · Plot 14 Naguru', dishes: ['Butter Chicken Tikka', 'Wild Hibiscus Lemonade'], total: 42000, placed: '2 min ago', status: 'new' },
    { id: '#0057', customer: 'Table T4 · Amara Nakato', dishes: ['Grilled Sea Bass', 'Ugandan Lamb Biryani'], total: 83000, placed: '8 min ago', status: 'preparing' },
    { id: '#0056', customer: 'Delivery · Kololo', dishes: ['Truffle Arancini', 'Tiramisu Classico'], total: 46000, placed: '14 min ago', status: 'ready' },
    { id: '#0055', customer: 'Table T2 · Grace Auma', dishes: ['Wild Mushroom Risotto x2', 'Kampala Sunset x4'], total: 104000, placed: '22 min ago', status: 'delivered' },
    { id: '#0054', customer: 'Delivery · Bukoto', dishes: ['Avocado Power Bowl', 'Banana Pancakes'], total: 46000, placed: '31 min ago', status: 'delivered' },
];

var PROMOS = [
    { id: 'P1', name: 'Easter Weekend Special', discount: 20, scope: 'Italian', start: '2025-04-18', end: '2025-04-21', banner: '🎉 Easter — 20% off Italian!' },
    { id: 'P2', name: 'Kampala Day Offer', discount: 15, scope: 'all', start: '2025-10-09', end: '2025-10-09', banner: '🇺🇬 Kampala Day — 15% off all!' },
];

var PROMO_CODES = [
    { code: 'OLIVES10', type: 'Percent', value: '10%', uses: '24/100', expires: '2025-12-31', active: true },
    { code: 'WELCOME', type: 'Percent', value: '5%', uses: '88/∞', expires: 'Never', active: true },
    { code: 'EAST25', type: 'Percent', value: '25%', uses: '12/50', expires: '2025-04-21', active: false },
];

var CUSTOMERS = [
    { name: 'Amara Nakato', email: 'amara@gmail.com', tier: 'Gold', orders: 12, spent: 'UGX 684K', last: 'Apr 15, 2025' },
    { name: 'David Ochieng', email: 'david@gmail.com', tier: 'Silver', orders: 7, spent: 'UGX 392K', last: 'Apr 10, 2025' },
    { name: 'Grace Auma', email: 'grace@gmail.com', tier: 'Platinum', orders: 24, spent: 'UGX 1.6M', last: 'Apr 18, 2025' },
    { name: 'Moses Byamugisha', email: 'moses@gmail.com', tier: 'Bronze', orders: 3, spent: 'UGX 128K', last: 'Mar 28, 2025' },
    { name: 'Fatuma Hassan', email: 'fatuma@gmail.com', tier: 'Silver', orders: 9, spent: 'UGX 510K', last: 'Apr 3, 2025' },
];

var fmt = function (n) { return 'UGX ' + Math.round(n).toLocaleString(); };

/* ──────────────────────────────────────────────
   2. PANEL NAVIGATION
   ────────────────────────────────────────────── */
function showPanel(name) {
    document.querySelectorAll('.admin-panel').forEach(function (p) {
        p.classList.add('admin-panel--hidden');
    });
    var panel = document.getElementById('panel' + name.charAt(0).toUpperCase() + name.slice(1));
    if (!panel) return;
    panel.classList.remove('admin-panel--hidden');
    panel.style.animation = 'none';
    void panel.offsetWidth;
    panel.style.animation = '';

    document.querySelectorAll('.sidebar__btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.panel === name);
    });

    var titles = {
        overview: 'Overview', bookings: 'Table Gatekeeper', orders: 'Live Orders',
        'menu-manager': 'Menu Manager', discounts: 'Promos & Discounts',
        analytics: 'Analytics', customers: 'Customers'
    };
    var el = document.getElementById('pageTitle');
    if (el) el.textContent = titles[name] || 'Dashboard';

    closeSidebar();

    /* Lazy renders */
    if (name === 'bookings') renderBookingsTable();
    if (name === 'orders') renderKanban();
    if (name === 'menu-manager') renderMenuTable('All');
    if (name === 'discounts') renderDiscounts();
    if (name === 'customers') renderCustomers();
}

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

function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.classList.remove('open');
}
hamburger.addEventListener('click', function () {
    if (sidebar.classList.contains('open')) { closeSidebar(); }
    else {
        sidebar.classList.add('open');
        backdrop.classList.add('open');
        hamburger.classList.add('open');
    }
});
backdrop.addEventListener('click', closeSidebar);
var closeBtn = document.getElementById('sidebarClose');
if (closeBtn) closeBtn.addEventListener('click', closeSidebar);


/* ──────────────────────────────────────────────
   4. TOAST
   ────────────────────────────────────────────── */
var toastEl = document.getElementById('adminToast');
var toastTimer = null;
function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.remove('show');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
}


/* ──────────────────────────────────────────────
   5. OVERVIEW — render sub-widgets
   ────────────────────────────────────────────── */
function renderOverview() {
    /* Tonight's list */
    var tl = document.getElementById('tonightList');
    if (tl) {
        tl.innerHTML = BOOKINGS.map(function (bk) {
            return '<div class="tonight-row">'
                + '<span class="tonight-row__time">' + bk.time + '</span>'
                + '<div><div class="tonight-row__name">' + bk.guest + '</div></div>'
                + '<span class="tonight-row__covers">' + bk.covers + ' covers</span>'
                + '<span class="status-pill sp--' + bk.status + '">' + bk.status + '</span>'
                + '</div>';
        }).join('');
    }

    /* Live orders feed */
    var lo = document.getElementById('liveOrders');
    if (lo) {
        lo.innerHTML = LIVE_ORDERS.slice(0, 5).map(function (o) {
            return '<div class="live-order">'
                + '<span class="live-order__id">' + o.id + '</span>'
                + '<span class="live-order__name">' + o.customer.split('·')[0].trim() + '</span>'
                + '<span class="live-order__total">' + fmt(o.total) + '</span>'
                + '<span class="live-order__time">' + o.placed + '</span>'
                + '</div>';
        }).join('');
    }

    /* Quick stock toggle — first 6 dishes */
    var qs = document.getElementById('quickStock');
    if (qs) {
        qs.innerHTML = adminMenu.slice(0, 6).map(function (d) {
            return '<div class="qs-item' + (d.available ? '' : ' unavailable') + '" id="qs-' + d.id + '">'
                + '<img src="' + d.image + '" alt="" class="qs-item__img">'
                + '<div style="flex:1;min-width:0;">'
                + '<div class="qs-item__name">' + d.name + '</div>'
                + '<div class="qs-item__cat">' + d.cat + '</div>'
                + '</div>'
                + '<span class="qs-item__unavail">OUT</span>'
                + '<label class="toggle-switch">'
                + '<input type="checkbox" ' + (d.available ? 'checked' : '') + ' data-qs-id="' + d.id + '">'
                + '<span class="toggle-switch__track"><span class="toggle-switch__thumb"></span></span>'
                + '</label>'
                + '</div>';
        }).join('');

        qs.querySelectorAll('[data-qs-id]').forEach(function (cb) {
            cb.addEventListener('change', function () {
                var id = parseInt(cb.dataset.qsId);
                var dish = adminMenu.find(function (d) { return d.id === id; });
                if (!dish) return;
                dish.available = cb.checked;
                var row = document.getElementById('qs-' + id);
                if (row) row.classList.toggle('unavailable', !dish.available);
                saveStock();
                showToast((dish.available ? '✓ ' : '⊘ ') + dish.name + (dish.available ? ' now visible' : ' hidden from menu'));
            });
        });
    }

    /* Top sellers */
    var ts = document.getElementById('topSellers');
    if (ts) {
        var top = [
            { rank: 1, name: 'Butter Chicken Tikka', count: '142 orders', pct: 100 },
            { rank: 2, name: 'Ugandan Lamb Biryani', count: '118 orders', pct: 83 },
            { rank: 3, name: 'Grilled Sea Bass', count: '97 orders', pct: 68 },
            { rank: 4, name: 'Warm Chocolate Fondant', count: '91 orders', pct: 64 },
            { rank: 5, name: 'Kampala Sunset Spritz', count: '88 orders', pct: 62 },
        ];
        ts.innerHTML = top.map(function (t) {
            var cls = t.rank <= 3 ? ' ts-item__rank--' + t.rank : '';
            return '<div class="ts-item">'
                + '<span class="ts-item__rank' + cls + '">' + t.rank + '</span>'
                + '<span class="ts-item__name">' + t.name + '</span>'
                + '<span class="ts-item__count">' + t.count + '</span>'
                + '<div class="ts-item__bar-track"><div class="ts-item__bar-fill" style="width:' + t.pct + '%"></div></div>'
                + '</div>';
        }).join('');
    }

    saveStock(); /* init KPI count */
}


/* ──────────────────────────────────────────────
   6. BOOKINGS TABLE
   ────────────────────────────────────────────── */
var bookingData = BOOKINGS.map(function (b) { return Object.assign({}, b); });

function renderBookingsTable(filter) {
    var search = (document.getElementById('bookingSearch') || {}).value || '';
    var status = (document.getElementById('bookingStatusFilter') || {}).value || 'all';
    var tbody = document.getElementById('bookingTableBody');
    if (!tbody) return;

    var rows = bookingData.filter(function (bk) {
        var matchSearch = !search || bk.guest.toLowerCase().includes(search.toLowerCase());
        var matchStatus = status === 'all' || bk.status === status;
        return matchSearch && matchStatus;
    });

    tbody.innerHTML = rows.map(function (bk) {
        var actions = '';
        if (bk.status === 'confirmed') {
            actions = '<button class="tbl-btn tbl-btn--seat" data-bk="' + bk.id + '" data-action="seat">Seat</button> '
                + '<button class="tbl-btn tbl-btn--cancel" data-bk="' + bk.id + '" data-action="cancel">Cancel</button>';
        } else if (bk.status === 'seated') {
            actions = '<button class="tbl-btn tbl-btn--close" data-bk="' + bk.id + '" data-action="close">Close</button>';
        } else {
            actions = '<span style="font-size:11px;color:var(--muted);">' + bk.status + '</span>';
        }
        return '<tr>'
            + '<td>' + bk.guest + '</td>'
            + '<td style="font-family:var(--mono)">' + bk.time + '</td>'
            + '<td>' + bk.covers + '</td>'
            + '<td>' + bk.occasion + '</td>'
            + '<td>' + bk.table + '</td>'
            + '<td><span class="status-pill sp--' + bk.status + '">' + bk.status + '</span></td>'
            + '<td style="display:flex;gap:6px;flex-wrap:wrap;">' + actions + '</td>'
            + '</tr>';
    }).join('');

    /* Wire booking action buttons */
    tbody.querySelectorAll('[data-action]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = btn.dataset.bk;
            var action = btn.dataset.action;
            var bk = bookingData.find(function (b) { return b.id === id; });
            if (!bk) return;
            if (action === 'seat') { bk.status = 'seated'; showToast('✓ Table seated for ' + bk.guest); }
            if (action === 'close') { bk.status = 'closed'; showToast('Table ' + bk.table + ' closed'); }
            if (action === 'cancel') {
                if (!confirm('Cancel booking for ' + bk.guest + '?')) return;
                bk.status = 'cancelled';
                showToast('Booking cancelled for ' + bk.guest);
            }
            renderBookingsTable();
            /* Update overview tonight list */
            document.querySelectorAll('.tonight-row').forEach(function (r) { r.remove(); });
            renderOverview();
        });
    });

    /* Update badge */
    var confirmedCount = bookingData.filter(function (b) { return b.status === 'confirmed'; }).length;
    var badge = document.getElementById('bookingBadge');
    if (badge) badge.textContent = confirmedCount;
}

/* Live filters */
['bookingSearch', 'bookingStatusFilter', 'bookingDateFilter'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', renderBookingsTable);
});

/* Add walk-in */
document.getElementById('addBookingBtn').addEventListener('click', function () {
    var guest = prompt('Guest name for walk-in:');
    if (!guest) return;
    var covers = parseInt(prompt('Number of covers:', '2')) || 2;
    bookingData.unshift({
        id: 'WI-' + Date.now(), guest: guest, time: 'Walk-in',
        covers: covers, occasion: 'Walk-in', table: 'TBA', status: 'confirmed'
    });
    renderBookingsTable();
    showToast('✓ Walk-in added for ' + guest);
});

document.getElementById('closeAllBtn').addEventListener('click', function () {
    if (!confirm('Mark all confirmed bookings as closed?')) return;
    bookingData.forEach(function (bk) {
        if (bk.status === 'confirmed') bk.status = 'closed';
    });
    renderBookingsTable();
    showToast('All confirmed bookings closed');
});


/* ──────────────────────────────────────────────
   7. KANBAN / LIVE ORDERS
   ────────────────────────────────────────────── */
var liveOrders = LIVE_ORDERS.map(function (o) { return Object.assign({}, o); });
var statusFlow = { new: 'preparing', preparing: 'ready', ready: 'delivered' };

function renderKanban() {
    var cols = { new: [], preparing: [], ready: [], delivered: [] };
    liveOrders.forEach(function (o) { (cols[o.status] || cols.delivered).push(o); });

    Object.keys(cols).forEach(function (st) {
        var col = document.getElementById('kanban' + st.charAt(0).toUpperCase() + st.slice(1));
        var count = document.getElementById('colCount' + st.charAt(0).toUpperCase() + st.slice(1));
        if (!col) return;
        if (count) count.textContent = cols[st].length;

        col.innerHTML = cols[st].map(function (o) {
            var nextLabel = { new: '→ Preparing', preparing: '→ Ready', ready: '→ Delivered' }[o.status] || '';
            return '<div class="kanban-card" id="kc-' + o.id.replace('#', '') + '">'
                + '<div class="kanban-card__id">' + o.id + '</div>'
                + '<div class="kanban-card__name">' + o.customer + '</div>'
                + '<div class="kanban-card__dishes">' + o.dishes.join(', ') + '</div>'
                + '<div class="kanban-card__foot">'
                + '<span class="kanban-card__total">' + fmt(o.total) + '</span>'
                + '<span class="kanban-card__time">' + o.placed + '</span>'
                + (nextLabel ? '<button class="kanban-card__advance" data-order-id="' + o.id + '">' + nextLabel + '</button>' : '')
                + '</div>'
                + '</div>';
        }).join('');
    });

    /* Wire advance buttons */
    document.querySelectorAll('.kanban-card__advance').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = btn.dataset.orderId;
            var order = liveOrders.find(function (o) { return o.id === id; });
            if (!order || !statusFlow[order.status]) return;
            order.status = statusFlow[order.status];
            renderKanban();
            showToast('Order ' + id + ' moved to ' + order.status);
            /* Update badge */
            var badge = document.getElementById('orderBadge');
            if (badge) badge.textContent = liveOrders.filter(function (o) { return o.status === 'new'; }).length || '';
        });
    });
}


/* ──────────────────────────────────────────────
   8. MENU MANAGER TABLE
   ────────────────────────────────────────────── */
var menuCatFilter = 'All';
var menuSearchTerm = '';

function renderMenuTable(cat) {
    if (cat !== undefined) menuCatFilter = cat;

    var search = (document.getElementById('menuManagerSearch') || {}).value || '';
    menuSearchTerm = search.toLowerCase();

    var rows = adminMenu.filter(function (d) {
        var catOk = menuCatFilter === 'All' || d.cat === menuCatFilter;
        var searchOk = !menuSearchTerm || d.name.toLowerCase().includes(menuSearchTerm);
        return catOk && searchOk;
    });

    var tbody = document.getElementById('menuTableBody');
    if (!tbody) return;

    tbody.innerHTML = rows.map(function (d) {
        var discBadge = d.discount > 0
            ? '<span class="discount-badge">-' + d.discount + '%</span>'
            : '<span class="discount-badge discount-badge--none">—</span>';
        return '<tr id="mr-' + d.id + '">'
            + '<td style="display:flex;align-items:center;gap:10px;min-width:200px;">'
            + '<img src="' + d.image + '" class="dish-thumb" alt="">'
            + '<div><div class="dish-name-cell">' + d.name + '</div><div class="dish-desc-cell">' + d.shortDesc + '</div></div>'
            + '</td>'
            + '<td>' + d.cat + '</td>'
            + '<td class="price-cell">' + fmt(d.price) + '</td>'
            + '<td>' + d.tag + '</td>'
            + '<td>★ ' + d.rating.toFixed(1) + '</td>'
            + '<td><label class="toggle-switch"><input type="checkbox" ' + (d.available ? 'checked' : '') + ' data-menu-id="' + d.id + '"><span class="toggle-switch__track"><span class="toggle-switch__thumb"></span></span></label></td>'
            + '<td>' + discBadge + '</td>'
            + '<td style="display:flex;gap:6px;">'
            + '<button class="tbl-btn tbl-btn--edit" data-edit-id="' + d.id + '">Edit</button>'
            + '<button class="tbl-btn tbl-btn--del"  data-del-id="' + d.id + '">Remove</button>'
            + '</td>'
            + '</tr>';
    }).join('');

    /* Stock toggles */
    tbody.querySelectorAll('[data-menu-id]').forEach(function (cb) {
        cb.addEventListener('change', function () {
            var id = parseInt(cb.dataset.menuId);
            var dish = adminMenu.find(function (d) { return d.id === id; });
            if (!dish) return;
            dish.available = cb.checked;
            saveStock();
            showToast((dish.available ? '✓ ' : '⊘ ') + dish.name + (dish.available ? ' visible' : ' hidden'));
        });
    });

    /* Edit button */
    tbody.querySelectorAll('[data-edit-id]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = parseInt(btn.dataset.editId);
            var dish = adminMenu.find(function (d) { return d.id === id; });
            if (!dish) return;
            openDishModal(dish);
        });
    });

    /* Delete (demo — won't really delete DISHES constant) */
    tbody.querySelectorAll('[data-del-id]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = parseInt(btn.dataset.delId);
            var dish = adminMenu.find(function (d) { return d.id === id; });
            if (!dish) return;
            if (!confirm('Remove "' + dish.name + '" from the menu?')) return;
            adminMenu = adminMenu.filter(function (d) { return d.id !== id; });
            renderMenuTable();
            showToast('⊘ ' + dish.name + ' removed');
        });
    });
}

/* Category tabs */
document.querySelectorAll('.menu-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.menu-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        renderMenuTable(tab.dataset.cat);
    });
});

/* Search in menu manager */
var mms = document.getElementById('menuManagerSearch');
if (mms) mms.addEventListener('input', function () { renderMenuTable(); });


/* ──────────────────────────────────────────────
   9. DISH MODAL (add / edit)
   ────────────────────────────────────────────── */
var editingDishId = null;

function openDishModal(dish) {
    editingDishId = dish ? dish.id : null;
    document.getElementById('dishModalTitle').textContent = dish ? 'Edit Dish' : 'Add New Dish';
    document.getElementById('dmName').value = dish ? dish.name : '';
    document.getElementById('dmCat').value = dish ? dish.cat : 'Italian';
    document.getElementById('dmPrice').value = dish ? dish.price : '';
    document.getElementById('dmTag').value = dish ? dish.tag : '';
    document.getElementById('dmRating').value = dish ? dish.rating : '';
    document.getElementById('dmDiscount').value = dish ? dish.discount : 0;
    document.getElementById('dmShortDesc').value = dish ? dish.shortDesc : '';
    document.getElementById('dmFullDesc').value = dish ? dish.fullDesc : '';
    document.getElementById('dmIngredients').value = dish ? (dish.ingredients || []).join(', ') : '';
    document.getElementById('dmImage').value = dish ? dish.image : '';
    document.getElementById('dmAvailable').checked = dish ? dish.available : true;

    document.getElementById('dishModal').hidden = false;
    document.getElementById('dishModalBackdrop').hidden = false;
}

function closeDishModal() {
    document.getElementById('dishModal').hidden = true;
    document.getElementById('dishModalBackdrop').hidden = true;
    editingDishId = null;
}

document.getElementById('addDishBtn').addEventListener('click', function () { openDishModal(null); });
document.getElementById('dishModalClose').addEventListener('click', closeDishModal);
document.getElementById('dishModalCancel').addEventListener('click', closeDishModal);
document.getElementById('dishModalBackdrop').addEventListener('click', closeDishModal);

document.getElementById('dishModalSave').addEventListener('click', function () {
    var name = document.getElementById('dmName').value.trim();
    if (!name) { showToast('⚠ Dish name required'); return; }

    var updated = {
        id: editingDishId || (Date.now()),
        name: name,
        cat: document.getElementById('dmCat').value,
        price: parseInt(document.getElementById('dmPrice').value) || 0,
        tag: document.getElementById('dmTag').value.trim(),
        rating: parseFloat(document.getElementById('dmRating').value) || 4.5,
        discount: parseInt(document.getElementById('dmDiscount').value) || 0,
        shortDesc: document.getElementById('dmShortDesc').value.trim(),
        fullDesc: document.getElementById('dmFullDesc').value.trim(),
        ingredients: document.getElementById('dmIngredients').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
        image: document.getElementById('dmImage').value.trim() || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1000&fit=crop&q=85',
        available: document.getElementById('dmAvailable').checked,
        nutrition: { cal: '—', protein: '—', carbs: '—', fat: '—' }
    };

    if (editingDishId) {
        var idx = adminMenu.findIndex(function (d) { return d.id === editingDishId; });
        if (idx > -1) adminMenu[idx] = updated;
        showToast('✓ ' + name + ' updated');
    } else {
        adminMenu.push(updated);
        showToast('✓ ' + name + ' added to menu');
    }

    saveStock();
    closeDishModal();
    renderMenuTable();
});


/* ──────────────────────────────────────────────
   10. DISCOUNTS & PROMOS
   ────────────────────────────────────────────── */
var promoData = PROMOS.map(function (p) { return Object.assign({}, p); });
var promoCodeData = PROMO_CODES.map(function (p) { return Object.assign({}, p); });

function renderDiscounts() {
    /* Promo cards */
    var grid = document.getElementById('promoGrid');
    if (grid) {
        grid.innerHTML = promoData.map(function (p) {
            return '<div class="promo-card">'
                + '<div class="promo-card__banner">'
                + '<div class="promo-card__pct">' + p.discount + '%</div>'
                + '<div class="promo-card__label">discount</div>'
                + '</div>'
                + '<div class="promo-card__body">'
                + '<div class="promo-card__name">' + p.name + '</div>'
                + '<div class="promo-card__dates">' + p.start + ' → ' + p.end + '</div>'
                + '<span class="promo-card__scope">' + p.scope + '</span>'
                + '<div class="promo-card__actions">'
                + '<button class="tbl-btn tbl-btn--edit" data-promo-id="' + p.id + '">Edit</button>'
                + '<button class="tbl-btn tbl-btn--cancel" data-promo-del="' + p.id + '">Delete</button>'
                + '</div>'
                + '</div>'
                + '</div>';
        }).join('');

        /* Delete promo */
        grid.querySelectorAll('[data-promo-del]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.dataset.promoDel;
                promoData = promoData.filter(function (p) { return p.id !== id; });
                renderDiscounts();
                showToast('Promotion deleted');
            });
        });
    }

    /* Promo codes table */
    var tbody = document.getElementById('promoCodesBody');
    if (tbody) {
        tbody.innerHTML = promoCodeData.map(function (pc) {
            return '<tr>'
                + '<td style="font-family:var(--mono);font-weight:600">' + pc.code + '</td>'
                + '<td>' + pc.type + '</td>'
                + '<td>' + pc.value + '</td>'
                + '<td>' + pc.uses + '</td>'
                + '<td>' + pc.expires + '</td>'
                + '<td><span class="status-pill ' + (pc.active ? 'sp--confirmed' : 'sp--closed') + '">' + (pc.active ? 'Active' : 'Expired') + '</span></td>'
                + '<td><button class="tbl-btn tbl-btn--del" data-code="' + pc.code + '">Delete</button></td>'
                + '</tr>';
        }).join('');

        tbody.querySelectorAll('[data-code]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var code = btn.dataset.code;
                if (!confirm('Delete promo code ' + code + '?')) return;
                promoCodeData = promoCodeData.filter(function (p) { return p.code !== code; });
                renderDiscounts();
                showToast('Code ' + code + ' deleted');
            });
        });
    }
}

/* New promo modal */
document.getElementById('addPromoBtn').addEventListener('click', function () {
    document.getElementById('promoModal').hidden = false;
    document.getElementById('promoModalBackdrop').hidden = false;
});
function closePromoModal() {
    document.getElementById('promoModal').hidden = true;
    document.getElementById('promoModalBackdrop').hidden = true;
}
document.getElementById('promoModalClose').addEventListener('click', closePromoModal);
document.getElementById('promoModalCancel').addEventListener('click', closePromoModal);
document.getElementById('promoModalBackdrop').addEventListener('click', closePromoModal);

document.getElementById('promoModalSave').addEventListener('click', function () {
    var name = document.getElementById('pmName').value.trim();
    if (!name) { showToast('⚠ Promo name required'); return; }
    promoData.push({
        id: 'P' + Date.now(),
        name: name,
        discount: parseInt(document.getElementById('pmDiscount').value) || 10,
        scope: document.getElementById('pmScope').value,
        start: document.getElementById('pmStart').value || '—',
        end: document.getElementById('pmEnd').value || '—',
        banner: document.getElementById('pmBanner').value,
    });
    closePromoModal();
    renderDiscounts();
    showToast('✓ Promotion "' + name + '" created');
});

/* New code button */
document.getElementById('addCodeBtn').addEventListener('click', function () {
    var code = prompt('Enter promo code (e.g. SUMMER20):');
    if (!code) return;
    var val = prompt('Discount value (e.g. 20%):');
    promoCodeData.unshift({ code: code.toUpperCase(), type: 'Percent', value: val || '10%', uses: '0/∞', expires: '—', active: true });
    renderDiscounts();
    showToast('✓ Code ' + code.toUpperCase() + ' created');
});


/* ──────────────────────────────────────────────
   11. CUSTOMERS TABLE
   ────────────────────────────────────────────── */
var custData = CUSTOMERS.slice();

function renderCustomers(search) {
    var q = ((search || (document.getElementById('custSearch') || {}).value) || '').toLowerCase();
    var tbody = document.getElementById('custTableBody');
    if (!tbody) return;

    var rows = q ? custData.filter(function (c) { return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q); }) : custData;

    var tierColors = { Bronze: 'rgba(139,90,43,.1)', Silver: 'rgba(90,112,112,.1)', Gold: 'rgba(201,149,26,.12)', Platinum: 'rgba(13,46,46,.12)' };
    var tierText = { Bronze: '#8B5A2B', Silver: 'var(--muted)', Gold: 'var(--amber)', Platinum: 'var(--teal)' };

    tbody.innerHTML = rows.map(function (c) {
        var initials = c.name.split(' ').map(function (n) { return n[0]; }).join('').slice(0, 2);
        return '<tr>'
            + '<td style="display:flex;align-items:center;gap:10px;">'
            + '<div style="width:32px;height:32px;border-radius:50%;background:var(--amber);color:var(--ink);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + initials + '</div>'
            + '<div style="font-weight:600">' + c.name + '</div>'
            + '</td>'
            + '<td style="color:var(--muted);font-size:12px;">' + c.email + '</td>'
            + '<td><span style="background:' + tierColors[c.tier] + ';color:' + tierText[c.tier] + ';padding:3px 9px;border-radius:var(--r-full);font-size:11px;font-weight:700;">' + c.tier + '</span></td>'
            + '<td>' + c.orders + '</td>'
            + '<td style="font-weight:600;color:var(--teal);">' + c.spent + '</td>'
            + '<td style="color:var(--muted);font-size:12px;">' + c.last + '</td>'
            + '<td><button class="tbl-btn tbl-btn--edit">View</button></td>'
            + '</tr>';
    }).join('');
}

var cs = document.getElementById('custSearch');
if (cs) cs.addEventListener('input', function () { renderCustomers(cs.value); });


/* ──────────────────────────────────────────────
   12. ANALYTICS — heatmap
   ────────────────────────────────────────────── */
function renderHeatmap() {
    var hours = ['11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var data = [
        [1, 2, 2, 1, 1, 2, 1],
        [2, 3, 3, 2, 2, 3, 2],
        [2, 4, 4, 3, 3, 5, 4],
        [1, 3, 3, 2, 3, 4, 3],
        [1, 2, 2, 2, 4, 5, 4],
        [1, 1, 1, 1, 3, 4, 3],
        [1, 1, 1, 1, 2, 3, 2]
    ];

    var el = document.getElementById('heatmap');
    if (!el) return;
    var cells = '';
    /* Column headers (days) */
    days.forEach(function (d) {
        cells += '<div style="font-size:9px;text-align:center;color:var(--muted);font-weight:500;">' + d + '</div>';
    });
    /* Data cells */
    data.forEach(function (row, hi) {
        row.forEach(function (v, di) {
            cells += '<div class="hm-cell" data-v="' + v + '" data-label="' + days[di] + ' ' + hours[hi] + ': ' + ['', 'Quiet', 'Moderate', 'Busy', 'Very busy', 'Peak'][v] + '"></div>';
        });
    });

    el.innerHTML = cells;
}


/* ──────────────────────────────────────────────
   13. DATE IN TOPBAR
   ────────────────────────────────────────────── */
(function () {
    var el = document.getElementById('adminDate');
    if (el) {
        el.textContent = new Date().toLocaleDateString('en-UG', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
    /* Set today as default in booking date filter */
    var df = document.getElementById('bookingDateFilter');
    if (df) df.value = new Date().toISOString().split('T')[0];
})();


/* ──────────────────────────────────────────────
   14. INIT
   ────────────────────────────────────────────── */
renderOverview();
renderHeatmap();