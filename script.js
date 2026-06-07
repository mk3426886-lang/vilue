// script.js - ماركت ليون (بدون رمز تحقق + سعر توصيل + منطقة كتابة)

let products = [];
let cart = [];
let activeCoupon = null;
let userOrders = [];
let currentProduct = null;
let activeFilter = "all";
let deliveryFee = 3000;
let sliders = [];

function loadAll() {
    let stored = localStorage.getItem("lion_products");
    if(stored) products = JSON.parse(stored);
    else {
        products = [
            { id: 1, name: "ماوس لاسلكي احترافي", price: 15000, stock: 9, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ff6a20'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40'%3E🐭%3C/text%3E%3C/svg%3E", category: "electronics" },
            { id: 2, name: "كيبورد ميكانيكي", price: 35000, stock: 3, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23333'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40'%3E⌨️%3C/text%3E%3C/svg%3E", category: "electronics" },
            { id: 3, name: "سماعات لاسلكية", price: 25000, stock: 5, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23444'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40'%3E🎧%3C/text%3E%3C/svg%3E", category: "electronics" },
            { id: 4, name: "تي شيرت قطني", price: 15000, stock: 10, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23229999'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40'%3E👕%3C/text%3E%3C/svg%3E", category: "clothing" },
            { id: 5, name: "حذاء رياضي", price: 55000, stock: 4, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cc6600'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40'%3E👟%3C/text%3E%3C/svg%3E", category: "clothing" },
            { id: 6, name: "نظارة شمسية", price: 22000, stock: 7, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23884400'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40'%3E🕶️%3C/text%3E%3C/svg%3E", category: "accessories" },
            { id: 7, name: "ساعة ذكية", price: 45000, stock: 2, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23333'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40'%3E⌚%3C/text%3E%3C/svg%3E", category: "electronics" }
        ];
        saveProducts();
    }
    
    let storedFee = localStorage.getItem("lion_delivery_fee");
    if(storedFee !== null) deliveryFee = parseInt(storedFee);
    
    let storedSliders = localStorage.getItem("lion_sliders");
    if(storedSliders) sliders = JSON.parse(storedSliders);
    else {
        sliders = [
            { id: 1, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300'%3E%3Crect width='800' height='300' fill='%23ff6a00'/%3E%3Ctext x='400' y='160' text-anchor='middle' fill='white' font-size='45' font-weight='bold'%3E🦁 ماركت ليون %3C/text%3E%3Ctext x='400' y='210' text-anchor='middle' fill='white' font-size='20'%3Eأفضل العروض هنا%3C/text%3E%3C/svg%3E" },
            { id: 2, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300'%3E%3Crect width='800' height='300' fill='%2322aa44'/%3E%3Ctext x='400' y='160' text-anchor='middle' fill='white' font-size='45' font-weight='bold'%3E🔥 تخفيضات الصيف %3C/text%3E%3Ctext x='400' y='210' text-anchor='middle' fill='white' font-size='20'%3Eخصم يصل إلى 50%25%3C/text%3E%3C/svg%3E" },
            { id: 3, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300'%3E%3Crect width='800' height='300' fill='%232266cc'/%3E%3Ctext x='400' y='160' text-anchor='middle' fill='white' font-size='45' font-weight='bold'%3E🚚 شحن سريع %3C/text%3E%3Ctext x='400' y='210' text-anchor='middle' fill='white' font-size='20'%3Eتوصيل لكافة المحافظات%3C/text%3E%3C/svg%3E" }
        ];
        saveSliders();
    }
    
    let storedCart = localStorage.getItem("lion_cart");
    if(storedCart) cart = JSON.parse(storedCart);
    
    let storedCoupon = localStorage.getItem("lion_active_coupon");
    if(storedCoupon) activeCoupon = JSON.parse(storedCoupon);
    
    let storedOrders = localStorage.getItem("lion_orders");
    if(storedOrders) userOrders = JSON.parse(storedOrders);
    
    renderSliders();
    renderCategories();
    renderProducts();
    updateCart();
    bindEvents();
}

function saveProducts() { localStorage.setItem("lion_products", JSON.stringify(products)); }
function saveSliders() { localStorage.setItem("lion_sliders", JSON.stringify(sliders)); }
function saveDeliveryFee() { localStorage.setItem("lion_delivery_fee", deliveryFee); }
function saveOrders() { localStorage.setItem("lion_orders", JSON.stringify(userOrders)); }

function renderSliders() {
    let wrap = document.getElementById("sliderWrapper");
    if(!wrap) return;
    wrap.innerHTML = sliders.map(s => `<div class="swiper-slide"><img src="${s.image}" alt="banner"></div>`).join('');
    new Swiper('.mySwiper', { loop: true, autoplay: { delay: 4000 }, pagination: { el: '.swiper-pagination', clickable: true } });
}

function renderCategories() {
    let cats = [...new Set(products.map(p => p.category))];
    let container = document.getElementById("quickCats");
    container.innerHTML = `<div class="cat-pill ${activeFilter === 'all' ? 'active' : ''}" data-cat="all">الكل</div>` +
        cats.map(c => `<div class="cat-pill ${activeFilter === c ? 'active' : ''}" data-cat="${c}">${getCatName(c)}</div>`).join('');
    document.querySelectorAll(".cat-pill").forEach(el => {
        el.addEventListener("click", () => {
            activeFilter = el.dataset.cat;
            renderCategories();
            renderProducts();
        });
    });
}

function getCatName(c) {
    let map = { electronics: "إلكترونيات", clothing: "ملابس", accessories: "إكسسوارات" };
    return map[c] || c;
}

function renderProducts() {
    let grid = document.getElementById("productsGrid");
    let filtered = activeFilter === "all" ? products : products.filter(p => p.category === activeFilter);
    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}">
            <img src="${p.image}" class="product-img" alt="${p.name}">
            <div class="product-name">${p.name}</div>
            <div class="product-price">${p.price.toLocaleString()} د.ع</div>
            <div class="product-stock">📦 ${p.stock} متبقي</div>
            <button class="product-add ${p.stock <= 0 ? 'out' : ''}" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>${p.stock <= 0 ? '❌ نفذت' : '➕ أضف للسلة'}</button>
        </div>
    `).join('');
    
    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if(e.target.classList.contains("product-add")) return;
            showDetail(parseInt(card.dataset.id));
        });
    });
    document.querySelectorAll(".product-add").forEach(btn => {
        if(btn.disabled) return;
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.id));
        });
    });
}

function showDetail(id) {
    let p = products.find(pr => pr.id === id);
    if(!p) return;
    currentProduct = p;
    let modal = document.getElementById("productModal");
    document.getElementById("productDetail").innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h2 style="margin:12px 0">${p.name}</h2>
        <p style="color:#ff6a00; font-size:1.7rem; font-weight:800">${p.price.toLocaleString()} د.ع</p>
        <p>📦 المخزن: ${p.stock} قطعة</p>
        <p>✨ منتج أصلي بضمان ماركت ليون</p>
    `;
    let addBtn = document.getElementById("modalAddBtn");
    if(p.stock <= 0) {
        addBtn.textContent = "❌ نفذت الكمية";
        addBtn.disabled = true;
        addBtn.style.background = "#aaa";
    } else {
        addBtn.textContent = "➕ أضف للسلة";
        addBtn.disabled = false;
        addBtn.style.background = "#ff6a00";
        addBtn.onclick = () => { addToCart(p.id); modal.style.display = "none"; };
    }
    modal.style.display = "flex";
}

function addToCart(id) {
    let p = products.find(pr => pr.id === id);
    if(!p || p.stock <= 0) { toastMsg("المنتج غير متوفر", "error"); return; }
    let exist = cart.find(i => i.id === id);
    if(exist) {
        if(exist.qty < p.stock) { exist.qty++; toastMsg(`✅ تم إضافة ${p.name}`, "success"); }
        else { toastMsg("الكمية غير كافية", "warning"); return; }
    } else {
        cart.push({ id, qty: 1 });
        toastMsg(`✅ تم إضافة ${p.name}`, "success");
    }
    updateCart();
}

function updateCart() {
    let total = 0, count = 0;
    let container = document.getElementById("cartItemsList");
    container.innerHTML = "";
    cart.forEach(item => {
        let p = products.find(pr => pr.id === item.id);
        if(!p) return;
        let itemTotal = p.price * item.qty;
        total += itemTotal;
        count += item.qty;
        container.innerHTML += `
            <div class="cart-item">
                <div><strong>${p.name}</strong><br>${p.price.toLocaleString()} × ${item.qty}</div>
                <div class="cart-item-actions">
                    <button class="qty-plus" data-id="${item.id}">+</button>
                    <button class="qty-minus" data-id="${item.id}">-</button>
                    <button class="cart-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    document.querySelectorAll(".qty-plus").forEach(btn => btn.onclick = () => changeQty(parseInt(btn.dataset.id), 1));
    document.querySelectorAll(".qty-minus").forEach(btn => btn.onclick = () => changeQty(parseInt(btn.dataset.id), -1));
    document.querySelectorAll(".cart-remove").forEach(btn => btn.onclick = () => { cart = cart.filter(i => i.id !== parseInt(btn.dataset.id)); updateCart(); });
    
    let discount = 0;
    if(activeCoupon) {
        let coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
        let valid = coupons.find(c => c.code === activeCoupon.code && (c.maxUses === null || c.usedCount < c.maxUses));
        if(valid) discount = (total * activeCoupon.percent) / 100;
        else activeCoupon = null;
    }
    let finalTotal = total - discount + deliveryFee;
    document.getElementById("cartTotal").innerText = total.toLocaleString();
    document.getElementById("cartDiscount").innerText = discount.toLocaleString();
    document.getElementById("deliveryFee").innerText = deliveryFee.toLocaleString();
    document.getElementById("cartGrandTotal").innerText = finalTotal.toLocaleString();
    document.getElementById("cartCount").innerText = count;
    localStorage.setItem("lion_cart", JSON.stringify(cart));
    if(activeCoupon) localStorage.setItem("lion_active_coupon", JSON.stringify(activeCoupon));
    else localStorage.removeItem("lion_active_coupon");
}

function changeQty(id, delta) {
    let idx = cart.findIndex(i => i.id === id);
    if(idx !== -1) {
        let p = products.find(pr => pr.id === id);
        let newQ = cart[idx].qty + delta;
        if(newQ <= 0) cart.splice(idx, 1);
        else if(newQ <= p.stock) cart[idx].qty = newQ;
        else toastMsg("الكمية غير متوفرة", "warning");
        updateCart();
    }
}

function toastMsg(text, type) {
    let cont = document.getElementById("toastMsg");
    let t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerText = text;
    cont.appendChild(t);
    setTimeout(() => t.remove(), 2800);
}

function bindEvents() {
    document.getElementById("cartToggleBtn")?.addEventListener("click", () => document.getElementById("cartSidebar").classList.toggle("hidden"));
    document.getElementById("closeCartBtn")?.addEventListener("click", () => document.getElementById("cartSidebar").classList.add("hidden"));
    
    document.getElementById("applyCouponBtn")?.addEventListener("click", () => {
        let code = document.getElementById("couponCodeInput").value.trim().toUpperCase();
        let coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
        let coup = coupons.find(c => c.code === code);
        if(!coup) { toastMsg("كود غير صالح", "error"); return; }
        if(coup.maxUses !== null && coup.usedCount >= coup.maxUses) { toastMsg("الكود منتهي", "error"); return; }
        activeCoupon = { code: coup.code, percent: coup.discountPercent };
        toastMsg(`تم تطبيق خصم ${coup.discountPercent}%`, "success");
        updateCart();
    });
    
    document.getElementById("checkoutBtn")?.addEventListener("click", () => {
        if(cart.length === 0) { toastMsg("السلة فارغة", "warning"); return; }
        document.getElementById("orderModal").style.display = "flex";
    });
    
    document.querySelectorAll(".modal-close, .close-invoice, .close-orders").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("orderModal").style.display = "none";
            document.getElementById("invoiceModal").style.display = "none";
            document.getElementById("ordersModal").style.display = "none";
            document.getElementById("productModal").style.display = "none";
        });
    });
    
    document.getElementById("orderForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        let name = document.getElementById("orderName").value;
        let phone = document.getElementById("orderPhone").value;
        let gov = document.getElementById("orderGov").value;
        let district = document.getElementById("orderDistrict").value;
        let near = document.getElementById("orderNear").value;
        if(!name || !phone || !gov || !district || !near) { toastMsg("املأ جميع البيانات", "error"); return; }
        if(!/^07[0-9]{8,9}$/.test(phone)) { toastMsg("رقم هاتف غير صحيح", "error"); return; }
        
        let total = 0;
        cart.forEach(i => { let p = products.find(pr => pr.id === i.id); total += p.price * i.qty; });
        let discount = 0;
        if(activeCoupon) {
            let coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
            let idx = coupons.findIndex(c => c.code === activeCoupon.code);
            if(idx !== -1 && (coupons[idx].maxUses === null || coupons[idx].usedCount < coupons[idx].maxUses)) {
                discount = (total * activeCoupon.percent) / 100;
                coupons[idx].usedCount++;
                localStorage.setItem("lion_coupons", JSON.stringify(coupons));
            }
        }
        let grand = total - discount + deliveryFee;
        let itemsText = "";
        cart.forEach(i => { let p = products.find(pr => pr.id === i.id); itemsText += `• ${p.name} × ${i.qty} = ${(p.price * i.qty).toLocaleString()} د.ع\n`; });
        let orderCode = "#LION-" + Math.floor(Math.random() * 90000 + 10000);
        let order = { code: orderCode, name, phone, gov, district, near, items: itemsText, total: total.toLocaleString(), discount: discount.toLocaleString(), delivery: deliveryFee.toLocaleString(), grand: grand.toLocaleString(), date: new Date().toISOString() };
        userOrders.unshift(order);
        saveOrders();
        
        window.lastOrder = order;
        document.getElementById("invoiceContent").innerHTML = `
            <p><strong>🧾 كود الطلب:</strong> ${orderCode}</p>
            <p><strong>👤 الاسم:</strong> ${name}</p>
            <p><strong>📞 الهاتف:</strong> ${phone}</p>
            <p><strong>🏠 المحافظة:</strong> ${gov}</p>
            <p><strong>📍 المنطقة:</strong> ${district}</p>
            <p><strong>📍 أقرب نقطة:</strong> ${near}</p>
            <hr>
            <pre style="white-space:pre-wrap">${itemsText}</pre>
            <hr>
            <p>💰 المجموع: ${total.toLocaleString()} د.ع</p>
            <p>🎟️ الخصم: -${discount.toLocaleString()} د.ع</p>
            <p>🚚 التوصيل: +${deliveryFee.toLocaleString()} د.ع</p>
            <p><strong>💵 الإجمالي: ${grand.toLocaleString()} د.ع</strong></p>
            <p><strong>💳 الدفع: عند الاستلام</strong></p>
        `;
        document.getElementById("orderModal").style.display = "none";
        document.getElementById("invoiceModal").style.display = "flex";
    });
    
    document.getElementById("sendWhatsappBtn")?.addEventListener("click", () => {
        let o = window.lastOrder;
        if(!o) return;
        let msg = `🦁 *طلب جديد من ماركت ليون* 🦁\n\n📌 *كود الطلب:* ${o.code}\n👤 *الاسم:* ${o.name}\n📞 *الهاتف:* ${o.phone}\n🏠 *المحافظة:* ${o.gov}\n📍 *المنطقة:* ${o.district}\n📍 *أقرب نقطة:* ${o.near}\n💳 *الدفع:* عند الاستلام\n\n🛍️ *المنتجات:*\n${o.items}\n\n💰 *المجموع:* ${o.total} د.ع\n🎟️ *الخصم:* -${o.discount} د.ع\n🚚 *التوصيل:* +${o.delivery} د.ع\n💎 *الإجمالي:* ${o.grand} د.ع\n\n✅ شكراً لتسوقكم مع ماركت ليون`;
        window.open(`https://wa.me/9647708574713?text=${encodeURIComponent(msg)}`, '_blank');
        cart.forEach(i => { let p = products.find(pr => pr.id === i.id); if(p) p.stock -= i.qty; });
        saveProducts();
        cart = [];
        activeCoupon = null;
        updateCart();
        renderProducts();
        document.getElementById("invoiceModal").style.display = "none";
        toastMsg("تم إرسال الطلب بنجاح", "success");
    });
    
    document.getElementById("ordersHistoryBtn")?.addEventListener("click", () => {
        let container = document.getElementById("ordersList");
        if(userOrders.length === 0) container.innerHTML = "<p style='text-align:center'>لا توجد طلبات</p>";
        else {
            container.innerHTML = userOrders.map(o => `
                <div style="background:#f5f7fb; border-radius:24px; padding:14px; margin-bottom:12px">
                    <p><strong>${o.code}</strong> | ${new Date(o.date).toLocaleDateString('ar-EG')}</p>
                    <p>${o.name} | ${o.phone}</p>
                    <p>💵 ${o.grand} د.ع</p>
                </div>
            `).join('');
        }
        document.getElementById("ordersModal").style.display = "flex";
    });
    
    document.getElementById("shareBtn")?.addEventListener("click", () => {
        if(navigator.share) navigator.share({ title: "ماركت ليون", url: window.location.href });
        else toastMsg("انسخ الرابط من المتصفح", "warning");
    });
}

document.addEventListener("DOMContentLoaded", loadAll);
