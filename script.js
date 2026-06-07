// script.js - متجر ليون الكامل مع التحقق من الرقم والمناطق

let products = [];
let categories = [];
let sliders = [];
let cart = [];
let appliedCoupon = null;
let userOrders = [];
let currentProductDetail = null;
let pendingOrderData = null; // لتخزين بيانات الطلب قبل التحقق
let generatedVerificationCode = null;

// بيانات المناطق حسب المحافظة
const districtsData = {
    "بغداد": ["الكرادة", "المنصور", "الزعفرانية", "الشعب", "الصدرية", "الاعظمية", "الكاظمية", "بغداد الجديدة"],
    "النجف": ["النجف القديمة", "الكوفة", "الحيرة", "الرميلة", "الغدير", "العدالة", "الجامعة", "الاسكان"],
    "البصرة": ["البراضعية", "العشار", "المعقل", "الجمهورية", "الزبير", "الفاو", "ابو الخصيب"],
    "اربيل": ["المركز", "اسكي كلك", "عين كاوة", "بينسلو", "قرة تبة", "بحركة"],
    "دهوك": ["المركز", "سيميل", "زاخو", "عمادية", "باطوفا"],
    "السليمانية": ["المركز", "تشورما", "باكه", "كاروان", "سرجينة"],
    "كركوك": ["المركز", "القادسية", "الوحدة", "علي باشا", "الدبس"],
    "نينوى": ["الموصل القديمة", "السكر", "الزنجلي", "البريد", "الحميدية", "التوب", "الشفاء"],
    "بابل": ["الحلة", "المسيب", "الهاشمية", "الكفل", "سدة الهندية"],
    "كربلاء": ["المركز", "الحسينية", "الحر", "المعبدة", "الهندية"],
    "واسط": ["الكوت", "النعمانية", "الصويرة", "العزيزية", "الزبادية"],
    "ذي قار": ["الناصرية", "الرفاعي", "سوق الشيوخ", "الجيبش", "البتيرة"],
    "ميسان": ["العمارة", "الميمونة", "علي الغربي", "قلعة صالح", "الكميت"],
    "المثنى": ["السماوة", "الرميثة", "الخضر", "السلمان", "البصية"],
    "القادسية": ["الديوانية", "عفك", "الشامية", "الغدير", "الصدوق"],
    "ديالى": ["بعقوبة", "المقدادية", "خانقين", "بلدروز", "الخالص"],
    "صلاح الدين": ["تكريت", "سامراء", "الدجيل", "بيجي", "بلد", "الضلوعية"],
    "الانبار": ["الرمادي", "فلوجة", "حديثة", "هيت", "الخالدية", "الرطبة", "عنه"]
};

// =============== تحميل البيانات ===============
function loadAllData() {
    const storedProducts = localStorage.getItem("lion_products");
    if(storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        products = [
            { id: 1, name: "ماوس ذكي لاسلكي", price: 15000, stock: 9, image: "https://placehold.co/400x300?text=Mouse", categoryId: 1 },
            { id: 2, name: "لوحة مفاتيح ميكانيكية", price: 35000, stock: 3, image: "https://placehold.co/400x300?text=Keyboard", categoryId: 1 },
            { id: 3, name: "سماعات لاسلكية", price: 25000, stock: 5, image: "https://placehold.co/400x300?text=Headphones", categoryId: 1 },
            { id: 4, name: "تي شيرت قطني", price: 15000, stock: 10, image: "https://placehold.co/400x300?text=TShirt", categoryId: 2 },
            { id: 5, name: "حذاء رياضي", price: 55000, stock: 4, image: "https://placehold.co/400x300?text=Shoes", categoryId: 2 },
            { id: 6, name: "نظارة شمسية", price: 22000, stock: 7, image: "https://placehold.co/400x300?text=Glasses", categoryId: 3 }
        ];
        saveProducts();
    }
    
    const storedCategories = localStorage.getItem("lion_categories");
    if(storedCategories) {
        categories = JSON.parse(storedCategories);
    } else {
        categories = [
            { id: 1, name: "إلكترونيات", icon: "fa-microchip", order: 1 },
            { id: 2, name: "ملابس", icon: "fa-tshirt", order: 2 },
            { id: 3, name: "إكسسوارات", icon: "fa-gem", order: 3 }
        ];
        saveCategories();
    }
    
    const storedSliders = localStorage.getItem("lion_sliders");
    if(storedSliders) {
        sliders = JSON.parse(storedSliders);
    } else {
        sliders = [
            { id: 1, image: "https://placehold.co/800x300?text=عرض+خاص+1", link: "#" },
            { id: 2, image: "https://placehold.co/800x300?text=تخفيضات+الصيف", link: "#" },
            { id: 3, image: "https://placehold.co/800x300?text=شحن+مجاني", link: "#" }
        ];
        saveSliders();
    }
    
    const storedCart = localStorage.getItem("lion_cart");
    if(storedCart) cart = JSON.parse(storedCart);
    
    const storedCoupon = localStorage.getItem("lion_coupon_applied");
    if(storedCoupon) appliedCoupon = JSON.parse(storedCoupon);
    
    const storedOrders = localStorage.getItem("lion_user_orders");
    if(storedOrders) userOrders = JSON.parse(storedOrders);
    
    renderSliders();
    renderSections();
    updateCartUI();
    setupEventListeners();
    setupDistrictSelector();
}

function saveProducts() { localStorage.setItem("lion_products", JSON.stringify(products)); }
function saveCategories() { localStorage.setItem("lion_categories", JSON.stringify(categories)); }
function saveSliders() { localStorage.setItem("lion_sliders", JSON.stringify(sliders)); }
function saveUserOrders() { localStorage.setItem("lion_user_orders", JSON.stringify(userOrders)); }

// =============== إعداد اختيار المنطقة ===============
function setupDistrictSelector() {
    const govSelect = document.getElementById("custGovernorate");
    const districtSelect = document.getElementById("custDistrict");
    
    if(!govSelect || !districtSelect) return;
    
    govSelect.addEventListener("change", function() {
        const selectedGov = this.value;
        if(selectedGov && districtsData[selectedGov]) {
            districtSelect.disabled = false;
            districtSelect.innerHTML = '<option value="">-- اختر المنطقة --</option>' +
                districtsData[selectedGov].map(d => `<option value="${d}">${d}</option>`).join('');
        } else {
            districtSelect.disabled = true;
            districtSelect.innerHTML = '<option value="">-- اختر المنطقة أولاً --</option>';
        }
    });
}

// =============== عرض السلايدر ===============
function renderSliders() {
    const wrapper = document.getElementById("sliderWrapper");
    if(!wrapper) return;
    wrapper.innerHTML = sliders.map(s => `<div class="swiper-slide"><img src="${s.image}" alt="slider"></div>`).join('');
    new Swiper('.mySwiper', {
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
    });
}

// =============== عرض الأقسام والمنتجات ===============
function renderSections() {
    const container = document.getElementById("sectionsContainer");
    if(!container) return;
    
    const sortedCategories = [...categories].sort((a,b) => a.order - b.order);
    
    container.innerHTML = sortedCategories.map(cat => {
        const catProducts = products.filter(p => p.categoryId === cat.id);
        if(catProducts.length === 0) return '';
        return `
            <div class="section-wrapper">
                <div class="section-title"><i class="fas ${cat.icon}"></i><span>${cat.name}</span></div>
                <div class="products-scroll">
                    ${catProducts.map(p => `
                        <div class="product-card-horizontal" data-product-id="${p.id}">
                            <img src="${p.image}" class="product-img-horizontal" alt="${p.name}">
                            <div class="product-name">${p.name}</div>
                            <div class="product-price-horizontal">${p.price.toLocaleString()} د.ع</div>
                            <div style="font-size:11px; color:#888">📦 ${p.stock} قطعة</div>
                            <button class="add-to-cart-horizontal" data-id="${p.id}">➕ أضف للسلة</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll(".product-card-horizontal").forEach(card => {
        card.addEventListener("click", (e) => {
            if(e.target.classList.contains("add-to-cart-horizontal")) return;
            showProductDetail(parseInt(card.dataset.productId));
        });
    });
    
    document.querySelectorAll(".add-to-cart-horizontal").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.id));
        });
    });
}

// =============== عرض تفاصيل المنتج ===============
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if(!product) return;
    currentProductDetail = product;
    
    const modal = document.getElementById("productModal");
    const content = document.getElementById("productDetailContent");
    const isOut = product.stock <= 0;
    
    content.innerHTML = `
        <img src="${product.image}" style="width:100%; border-radius:24px; margin-bottom:15px">
        <h2>${product.name}</h2>
        <p style="color:#ff6a00; font-size:1.5rem; font-weight:bold">${product.price.toLocaleString()} د.ع</p>
        <p>📦 المخزن: ${product.stock} قطعة</p>
        <p style="color:#666">منتج عالي الجودة من متجر ليون</p>
    `;
    
    const modalBtn = document.getElementById("modalAddToCart");
    if(isOut) {
        modalBtn.textContent = "❌ نفذت الكمية";
        modalBtn.disabled = true;
        modalBtn.style.background = "#aaa";
    } else {
        modalBtn.textContent = "➕ أضف للسلة";
        modalBtn.disabled = false;
        modalBtn.style.background = "#ff6a00";
    }
    
    modal.style.display = "flex";
    document.getElementById("modalAddToCart").onclick = () => {
        if(!isOut) { addToCart(productId); modal.style.display = "none"; }
    };
}

// =============== إضافة للسلة ===============
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if(!product || product.stock <= 0) { showToast("❌ المنتج غير متوفر", "error"); return; }
    
    const existing = cart.find(item => item.id === productId);
    if(existing) {
        if(existing.quantity < product.stock) { existing.quantity++; showToast(`✅ تم إضافة ${product.name}`, "success"); }
        else { showToast("⚠️ لا يوجد مخزن كافي!", "warning"); return; }
    } else {
        cart.push({ id: productId, quantity: 1 });
        showToast(`✅ تم إضافة ${product.name}`, "success");
    }
    updateCartUI();
}

// =============== تحديث السلة ===============
function updateCartUI() {
    const cartCountSpan = document.getElementById("cartCount");
    const cartItemsDiv = document.getElementById("cartItemsList");
    let total = 0, itemCount = 0;
    
    if(cartItemsDiv) {
        cartItemsDiv.innerHTML = "";
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if(!product) return;
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;
            cartItemsDiv.innerHTML += `
                <div class="cart-item">
                    <div><h4>${product.name}</h4><small>${product.price.toLocaleString()} × ${item.quantity}</small></div>
                    <div class="cart-item-controls">
                        <button class="cart-qty-plus" data-id="${item.id}">+</button>
                        <button class="cart-qty-minus" data-id="${item.id}">-</button>
                        <button class="cart-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
        
        document.querySelectorAll(".cart-qty-plus").forEach(btn => { btn.onclick = () => changeQuantity(parseInt(btn.dataset.id), 1); });
        document.querySelectorAll(".cart-qty-minus").forEach(btn => { btn.onclick = () => changeQuantity(parseInt(btn.dataset.id), -1); });
        document.querySelectorAll(".cart-remove").forEach(btn => { btn.onclick = () => { cart = cart.filter(i => i.id !== parseInt(btn.dataset.id)); updateCartUI(); showToast("🗑️ تم الإزالة", "warning"); }; });
    }
    
    let discountAmount = 0;
    if(appliedCoupon) {
        const coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
        if(coupons.find(c => c.code === appliedCoupon.code && (c.maxUses === null || c.usedCount < c.maxUses)))
            discountAmount = (total * appliedCoupon.discountPercent) / 100;
        else appliedCoupon = null;
    }
    
    document.getElementById("cartTotal") && (document.getElementById("cartTotal").innerText = total.toLocaleString());
    document.getElementById("cartDiscount") && (document.getElementById("cartDiscount").innerText = discountAmount.toLocaleString());
    document.getElementById("cartGrandTotal") && (document.getElementById("cartGrandTotal").innerText = (total - discountAmount).toLocaleString());
    cartCountSpan && (cartCountSpan.innerText = itemCount);
    localStorage.setItem("lion_cart", JSON.stringify(cart));
}

function changeQuantity(id, delta) {
    const index = cart.findIndex(i => i.id === id);
    if(index !== -1) {
        const product = products.find(p => p.id === id);
        const newQty = cart[index].quantity + delta;
        if(newQty <= 0) cart.splice(index,1);
        else if(newQty <= product.stock) cart[index].quantity = newQty;
        else showToast("⚠️ الكمية غير متوفرة", "warning");
        updateCartUI();
    }
}

// =============== توليد رمز تحقق عشوائي ===============
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// =============== عرض الإشعارات ===============
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// =============== الأحداث الرئيسية ===============
function setupEventListeners() {
    document.getElementById("applyCouponBtn")?.addEventListener("click", () => {
        const code = document.getElementById("couponCode").value.trim().toUpperCase();
        const coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
        const coupon = coupons.find(c => c.code === code);
        if(!coupon) { showToast("❌ كود خصم غير صالح", "error"); return; }
        if(coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) { showToast("❌ الكود منتهي الصلاحية", "error"); return; }
        appliedCoupon = { code: coupon.code, discountPercent: coupon.discountPercent };
        updateCartUI();
        showToast(`✅ خصم ${coupon.discountPercent}%`, "success");
    });
    
    document.getElementById("cartToggleBtn")?.addEventListener("click", () => document.getElementById("cartPanel").classList.toggle("hidden"));
    document.getElementById("closeCartBtn")?.addEventListener("click", () => document.getElementById("cartPanel").classList.add("hidden"));
    
    document.getElementById("checkoutBtn")?.addEventListener("click", () => {
        if(cart.length === 0) { showToast("🛒 السلة فارغة!", "warning"); return; }
        document.getElementById("customerModal").style.display = "flex";
        document.getElementById("verifySection").style.display = "none";
        document.getElementById("customerForm").reset();
        document.getElementById("custDistrict").disabled = true;
    });
    
    document.querySelectorAll(".close-modal, .close-invoice, .close-orders").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("customerModal").style.display = "none";
            document.getElementById("invoiceModal").style.display = "none";
            document.getElementById("ordersModal").style.display = "none";
            document.getElementById("productModal").style.display = "none";
        });
    });
    
    // نموذج العميل - الخطوة الأولى (إرسال رمز التحقق)
    document.getElementById("customerForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = document.getElementById("custName").value;
        const phone = document.getElementById("custPhone").value;
        const governorate = document.getElementById("custGovernorate").value;
        const district = document.getElementById("custDistrict").value;
        const nearestPoint = document.getElementById("custNearestPoint").value;
        const paymentMethod = document.getElementById("custPaymentMethod").value;
        
        if(!name || !phone || !governorate || !district || !nearestPoint || !paymentMethod) {
            showToast("يرجى ملء جميع الحقول", "error");
            return;
        }
        
        // التحقق من رقم الهاتف (رقم عراقي 10-11 رقم يبدأ بـ 07)
        const phoneRegex = /^07[0-9]{8,9}$/;
        if(!phoneRegex.test(phone)) {
            showToast("📱 رقم الهاتف غير صحيح! يجب أن يبدأ بـ 07", "error");
            return;
        }
        
        // حفظ بيانات الطلب مؤقتاً
        pendingOrderData = { name, phone, governorate, district, nearestPoint, paymentMethod };
        
        // توليد رمز تحقق
        generatedVerificationCode = generateVerificationCode();
        
        // عرض قسم التحقق
        document.getElementById("verifySection").style.display = "block";
        document.getElementById("verifyMessage").innerHTML = `📲 تم إرسال رمز التحقق إلى الرقم <strong>${phone}</strong><br>الرمز: <strong style="color:#ff6a00;font-size:18px">${generatedVerificationCode}</strong>`;
        document.getElementById("verifyCode").value = "";
        document.getElementById("verifyCode").focus();
        
        showToast(`📱 تم إرسال رمز التحقق إلى ${phone}`, "success");
    });
    
    // تأكيد رمز التحقق
    document.getElementById("confirmVerifyBtn")?.addEventListener("click", () => {
        const enteredCode = document.getElementById("verifyCode").value;
        if(enteredCode !== generatedVerificationCode) {
            showToast("❌ رمز التحقق غير صحيح! حاول مرة أخرى", "error");
            return;
        }
        
        // رمز صحيح - إتمام الطلب
        completeOrder();
    });
}

// =============== إتمام الطلب بعد التحقق ===============
function completeOrder() {
    if(!pendingOrderData) return;
    
    const { name, phone, governorate, district, nearestPoint, paymentMethod } = pendingOrderData;
    
    const orderCode = "#LION-" + Math.floor(Math.random() * 90000 + 10000);
    let total = 0;
    cart.forEach(item => {
        const p = products.find(pr => pr.id === item.id);
        total += p.price * item.quantity;
    });
    
    let discountAmount = 0;
    if(appliedCoupon) {
        const coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
        const coupIdx = coupons.findIndex(c => c.code === appliedCoupon.code);
        if(coupIdx !== -1 && (coupons[coupIdx].maxUses === null || coupons[coupIdx].usedCount < coupons[coupIdx].maxUses)) {
            discountAmount = (total * appliedCoupon.discountPercent) / 100;
            coupons[coupIdx].usedCount += 1;
            localStorage.setItem("lion_coupons", JSON.stringify(coupons));
        }
    }
    const grandTotal = total - discountAmount;
    
    let itemsText = "";
    cart.forEach(item => {
        const p = products.find(pr => pr.id === item.id);
        itemsText += `• ${p.name} × ${item.quantity} = ${(p.price * item.quantity).toLocaleString()} د.ع\n`;
    });
    
    const fullAddress = `${governorate} - ${district} - بالقرب من ${nearestPoint}`;
    
    const order = { orderCode, name, phone, address: fullAddress, governorate, district, nearestPoint, paymentMethod, itemsText, total, discountAmount, grandTotal, date: new Date().toISOString() };
    userOrders.unshift(order);
    saveUserOrders();
    
    // عرض الفاتورة
    document.getElementById("invoiceDetails").innerHTML = `
        <p><strong>🧾 كود الطلب:</strong> ${orderCode}</p>
        <p><strong>👤 الاسم:</strong> ${name}</p>
        <p><strong>📞 الهاتف:</strong> ${phone}</p>
        <p><strong>🏠 المحافظة:</strong> ${governorate}</p>
        <p><strong>📍 المنطقة:</strong> ${district}</p>
        <p><strong>📍 أقرب نقطة دالة:</strong> ${nearestPoint}</p>
        <p><strong>💳 طريقة الدفع:</strong> ${paymentMethod}</p>
        <hr>
        <pre style="white-space:pre-wrap">${itemsText}</pre>
        <hr>
        <p>💰 المجموع: ${total.toLocaleString()} د.ع</p>
        <p>🎟️ الخصم: -${discountAmount.toLocaleString()} د.ع</p>
        <p><strong>💵 الإجمالي: ${grandTotal.toLocaleString()} د.ع</strong></p>
    `;
    
    window.currentOrderData = { name, phone, address: fullAddress, governorate, district, nearestPoint, paymentMethod, itemsText, total, discountAmount, grandTotal, orderCode };
    
    // إخفاء نموذج العميل وإظهار الفاتورة
    document.getElementById("customerModal").style.display = "none";
    document.getElementById("invoiceModal").style.display = "flex";
    pendingOrderData = null;
    generatedVerificationCode = null;
}

// =============== إرسال الواتساب ===============
document.getElementById("sendWhatsAppBtn")?.addEventListener("click", () => {
    const data = window.currentOrderData;
    if(!data) return;
    
    const message = `🦁 *طلب جديد من متجر ليون* 🦁\n\n📌 *كود الطلب:* ${data.orderCode}\n👤 *الاسم:* ${data.name}\n📞 *الهاتف:* ${data.phone}\n🏠 *المحافظة:* ${data.governorate}\n📍 *المنطقة:* ${data.district}\n📍 *أقرب نقطة:* ${data.nearestPoint}\n💳 *طريقة الدفع:* ${data.paymentMethod}\n\n🛍️ *المنتجات:*\n${data.itemsText}\n\n💰 *المجموع:* ${data.total.toLocaleString()} د.ع\n🎟️ *الخصم:* -${data.discountAmount.toLocaleString()} د.ع\n💎 *الإجمالي:* ${data.grandTotal.toLocaleString()} د.ع\n\n✅ شكراً لتسوقكم مع متجر ليون`;
    
    const whatsappUrl = `https://wa.me/9647708574713?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // خصم المخزون وتفريغ السلة
    cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if(prod) prod.stock -= item.quantity;
    });
    saveProducts();
    cart = [];
    appliedCoupon = null;
    localStorage.removeItem("lion_cart");
    localStorage.removeItem("lion_coupon_applied");
    updateCartUI();
    renderSections();
    
    document.getElementById("invoiceModal").style.display = "none";
    showToast("✅ تم إرسال الطلب بنجاح!", "success");
});

// =============== طلباتي السابقة ===============
document.getElementById("ordersHistoryBtn")?.addEventListener("click", () => {
    const ordersList = document.getElementById("userOrdersList");
    if(userOrders.length === 0) {
        ordersList.innerHTML = "<p style='text-align:center'>📭 لا توجد طلبات سابقة</p>";
    } else {
        ordersList.innerHTML = userOrders.map(order => `
            <div style="background:#f9f9f9; border-radius:16px; padding:15px; margin-bottom:15px">
                <p><strong>🧾 ${order.orderCode}</strong></p>
                <p>📅 ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
                <p>🏠 ${order.address}</p>
                <p>💰 ${order.grandTotal.toLocaleString()} د.ع</p>
                <details><summary style="color:#ff6a00">📋 التفاصيل</summary><pre style="white-space:pre-wrap">${order.itemsText}</pre></details>
            </div>
        `).join('');
    }
    document.getElementById("ordersModal").style.display = "flex";
});

// بدء التشغيل
document.addEventListener("DOMContentLoaded", loadAllData);
