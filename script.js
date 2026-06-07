// script.js - المتجر الرئيسي الكامل (نسخة متكاملة 100%)

let products = [];
let cart = [];
let appliedCoupon = null;
let currentFilter = "all";
let currentUser = null;
let userOrders = [];

// تحميل البيانات عند بدء التشغيل
function loadAllData() {
    const stored = localStorage.getItem("lion_products");
    if(stored) {
        products = JSON.parse(stored);
    } else {
        products = [
            { id: 1, name: "سماعات لاسلكية", price: 25000, stock: 5, image: "https://placehold.co/400x300?text=Headphones", category: "electronics" },
            { id: 2, name: "باور بانك 10000mAh", price: 18000, stock: 3, image: "https://placehold.co/400x300?text=PowerBank", category: "electronics" },
            { id: 3, name: "ساعة ذكية", price: 45000, stock: 0, image: "https://placehold.co/400x300?text=SmartWatch", category: "electronics" },
            { id: 4, name: "تي شيرت قطني", price: 15000, stock: 10, image: "https://placehold.co/400x300?text=TShirt", category: "clothing" },
            { id: 5, name: "حذاء رياضي", price: 55000, stock: 4, image: "https://placehold.co/400x300?text=Shoes", category: "clothing" },
            { id: 6, name: "نظارة شمسية", price: 22000, stock: 7, image: "https://placehold.co/400x300?text=Glasses", category: "accessories" }
        ];
        saveProducts();
    }
    
    const storedCart = localStorage.getItem("lion_cart");
    if(storedCart) cart = JSON.parse(storedCart);
    
    const storedCoupon = localStorage.getItem("lion_coupon_applied");
    if(storedCoupon) appliedCoupon = JSON.parse(storedCoupon);
    
    const storedUser = localStorage.getItem("lion_current_user");
    if(storedUser) currentUser = JSON.parse(storedUser);
    
    const storedOrders = localStorage.getItem("lion_user_orders");
    if(storedOrders) userOrders = JSON.parse(storedOrders);
    
    renderProducts();
    updateCartUI();
    setupEventListeners();
}

function saveProducts() {
    localStorage.setItem("lion_products", JSON.stringify(products));
}

function saveUserOrders() {
    localStorage.setItem("lion_user_orders", JSON.stringify(userOrders));
}

function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if(!grid) return;
    
    let filtered = products;
    if(currentFilter !== "all") {
        filtered = products.filter(p => p.category === currentFilter);
    }
    
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
    if(searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    
    grid.innerHTML = "";
    filtered.forEach(p => {
        const isOut = p.stock <= 0;
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${p.image}" class="product-img" alt="${p.name}">
            <h3 class="product-title">${p.name}</h3>
            <div class="product-price">${p.price.toLocaleString()} د.ع</div>
            <div class="product-stock">📦 المخزن: ${p.stock} قطعة</div>
            <button class="add-to-cart ${isOut ? 'out-of-stock' : ''}" data-id="${p.id}" ${isOut ? 'disabled' : ''}>${isOut ? '❌ نفذت الكمية' : '➕ أضف للسلة'}</button>
        `;
        grid.appendChild(card);
    });
    
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if(!product || product.stock <= 0) return;
    
    const existing = cart.find(item => item.id === productId);
    if(existing) {
        if(existing.quantity < product.stock) {
            existing.quantity++;
        } else {
            alert("لا يوجد مخزن كافي!");
            return;
        }
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCountSpan = document.getElementById("cartCount");
    const cartItemsDiv = document.getElementById("cartItemsList");
    let total = 0;
    let itemCount = 0;
    
    if(cartItemsDiv) {
        cartItemsDiv.innerHTML = "";
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if(!product) return;
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;
            const cartRow = document.createElement("div");
            cartRow.className = "cart-item";
            cartRow.innerHTML = `
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <small>${product.price.toLocaleString()} × ${item.quantity} = ${itemTotal.toLocaleString()}</small>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-qty-plus" data-id="${item.id}">+</button>
                    <button class="cart-qty-minus" data-id="${item.id}">-</button>
                    <button class="cart-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsDiv.appendChild(cartRow);
        });
        
        document.querySelectorAll(".cart-qty-plus").forEach(btn => {
            btn.addEventListener("click", () => changeQuantity(parseInt(btn.dataset.id), 1));
        });
        document.querySelectorAll(".cart-qty-minus").forEach(btn => {
            btn.addEventListener("click", () => changeQuantity(parseInt(btn.dataset.id), -1));
        });
        document.querySelectorAll(".cart-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                cart = cart.filter(i => i.id !== parseInt(btn.dataset.id));
                updateCartUI();
            });
        });
    }
    
    let discountAmount = 0;
    if(appliedCoupon) {
        const coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
        const validCoupon = coupons.find(c => c.code === appliedCoupon.code && (c.maxUses === null || c.usedCount < c.maxUses));
        if(validCoupon) {
            discountAmount = (total * appliedCoupon.discountPercent) / 100;
        } else {
            appliedCoupon = null;
            localStorage.removeItem("lion_coupon_applied");
        }
    }
    const grandTotal = total - discountAmount;
    
    if(document.getElementById("cartTotal")) document.getElementById("cartTotal").innerText = total.toLocaleString();
    if(document.getElementById("cartDiscount")) document.getElementById("cartDiscount").innerText = discountAmount.toLocaleString();
    if(document.getElementById("cartGrandTotal")) document.getElementById("cartGrandTotal").innerText = grandTotal.toLocaleString();
    if(cartCountSpan) cartCountSpan.innerText = itemCount;
    
    localStorage.setItem("lion_cart", JSON.stringify(cart));
    if(appliedCoupon) {
        localStorage.setItem("lion_coupon_applied", JSON.stringify(appliedCoupon));
    } else {
        localStorage.removeItem("lion_coupon_applied");
    }
}

function changeQuantity(id, delta) {
    const index = cart.findIndex(i => i.id === id);
    if(index !== -1) {
        const product = products.find(p => p.id === id);
        const newQty = cart[index].quantity + delta;
        if(newQty <= 0) {
            cart.splice(index,1);
        } else if(newQty <= product.stock) {
            cart[index].quantity = newQty;
        } else {
            alert("الكمية المطلوبة أكبر من المتوفر");
        }
        updateCartUI();
    }
}

// إتمام الطلب وإنشاء الفاتورة
let currentOrderData = null;

function setupEventListeners() {
    // تطبيق كود الخصم
    document.getElementById("applyCouponBtn")?.addEventListener("click", () => {
        const code = document.getElementById("couponCode").value.trim().toUpperCase();
        const coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
        const coupon = coupons.find(c => c.code === code);
        if(!coupon) { 
            alert("❌ كود خصم غير صالح"); 
            return; 
        }
        if(coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) { 
            alert("❌ هذا الكود انتهت صلاحيته"); 
            return; 
        }
        appliedCoupon = { code: coupon.code, discountPercent: coupon.discountPercent };
        updateCartUI();
        alert("✅ تم تطبيق الخصم بنجاح!");
    });
    
    // فتح/إغلاق السلة
    document.getElementById("cartToggleBtn")?.addEventListener("click", () => {
        document.getElementById("cartPanel").classList.toggle("hidden");
    });
    document.getElementById("closeCartBtn")?.addEventListener("click", () => {
        document.getElementById("cartPanel").classList.add("hidden");
    });
    
    // زر إتمام الطلب
    document.getElementById("checkoutBtn")?.addEventListener("click", () => {
        if(cart.length === 0) { 
            alert("🛒 السلة فارغة!"); 
            return; 
        }
        document.getElementById("customerModal").style.display = "flex";
    });
    
    // إغلاق المودالات
    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("customerModal").style.display = "none";
            document.getElementById("invoiceModal").style.display = "none";
            document.getElementById("ordersModal").style.display = "none";
        });
    });
    
    // نموذج بيانات العميل
    document.getElementById("customerForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("custName").value;
        const phone = document.getElementById("custPhone").value;
        const address = document.getElementById("custAddress").value;
        if(!name || !phone || !address) {
            alert("يرجى ملء جميع الحقول");
            return;
        }
        
        // توليد كود طلب فريد
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
        
        // بناء نص المنتجات
        let itemsText = "";
        cart.forEach(item => {
            const p = products.find(pr => pr.id === item.id);
            itemsText += `• ${p.name} × ${item.quantity} = ${(p.price * item.quantity).toLocaleString()} د.ع\n`;
        });
        
        // حفظ الطلب
        const order = {
            orderCode: orderCode,
            name: name,
            phone: phone,
            address: address,
            items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
            itemsText: itemsText,
            total: total,
            discountAmount: discountAmount,
            grandTotal: grandTotal,
            date: new Date().toISOString()
        };
        userOrders.unshift(order);
        saveUserOrders();
        
        // عرض الفاتورة
        const invoiceHtml = `
            <p><strong>🧾 كود الطلب:</strong> ${orderCode}</p>
            <p><strong>👤 الاسم:</strong> ${name}</p>
            <p><strong>📞 الهاتف:</strong> ${phone}</p>
            <p><strong>🏠 العنوان:</strong> ${address}</p>
            <hr>
            <h4>المنتجات:</h4>
            <pre style="font-family:inherit; white-space:pre-wrap">${itemsText}</pre>
            <hr>
            <p>💰 المجموع: ${total.toLocaleString()} د.ع</p>
            <p>🎟️ الخصم: -${discountAmount.toLocaleString()} د.ع</p>
            <p><strong>💵 الإجمالي النهائي: ${grandTotal.toLocaleString()} د.ع</strong></p>
        `;
        document.getElementById("invoiceDetails").innerHTML = invoiceHtml;
        
        currentOrderData = { name, phone, address, itemsText, total, discountAmount, grandTotal, orderCode };
        
        document.getElementById("customerModal").style.display = "none";
        document.getElementById("invoiceModal").style.display = "flex";
    });
    
    // إرسال عبر واتساب
    document.getElementById("sendWhatsAppBtn")?.addEventListener("click", () => {
        if(!currentOrderData) return;
        const data = currentOrderData;
        const message = `🦁 *طلب جديد من متجر ليون* 🦁\n\n📌 *كود الطلب:* ${data.orderCode}\n👤 *الاسم:* ${data.name}\n📞 *الهاتف:* ${data.phone}\n🏠 *العنوان:* ${data.address}\n\n🛍️ *المنتجات:*\n${data.itemsText}\n\n💰 *المجموع:* ${data.total.toLocaleString()} د.ع\n🎟️ *الخصم:* -${data.discountAmount.toLocaleString()} د.ع\n💎 *الإجمالي النهائي:* ${data.grandTotal.toLocaleString()} د.ع\n\n✅ شكراً لتسوقكم مع متجر ليون`;
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
        renderProducts();
        
        document.getElementById("invoiceModal").style.display = "none";
        alert("✅ تم إرسال الطلب بنجاح! شكراً لك");
        currentOrderData = null;
    });
    
    // البحث
    document.getElementById("searchInput")?.addEventListener("input", () => {
        renderProducts();
    });
    
    // أزرار الفلترة
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.category;
            renderProducts();
        });
    });
    
    // طلباتي
    document.getElementById("myOrdersBtn")?.addEventListener("click", (e) => {
        e.preventDefault();
        showUserOrders();
    });
    
    // أيقونة المستخدم (محاكاة تسجيل دخول بسيط)
    // تسجيل خروج
    document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
        e.preventDefault();
        currentUser = null;
        localStorage.removeItem("lion_current_user");
        alert("تم تسجيل الخروج");
    });
}

function showUserOrders() {
    const ordersModal = document.getElementById("ordersModal");
    const ordersList = document.getElementById("userOrdersList");
    
    if(userOrders.length === 0) {
        ordersList.innerHTML = "<p style='text-align:center'>📭 لا توجد طلبات سابقة</p>";
    } else {
        ordersList.innerHTML = userOrders.map(order => `
            <div style="background:#f9f9f9; border-radius:16px; padding:15px; margin-bottom:15px">
                <p><strong>🧾 ${order.orderCode}</strong></p>
                <p>📅 ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
                <p>💰 الإجمالي: ${order.grandTotal.toLocaleString()} د.ع</p>
                <details>
                    <summary style="color:#ff6a00; cursor:pointer">📋 تفاصيل الطلب</summary>
                    <pre style="white-space:pre-wrap; font-family:inherit; margin-top:10px">${order.itemsText}</pre>
                </details>
            </div>
        `).join('');
    }
    ordersModal.style.display = "flex";
}

// بدء التشغيل
document.addEventListener("DOMContentLoaded", loadAllData);
