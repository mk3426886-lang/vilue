// admin.js - لوحة الإدارة الكاملة
let currentAdminTab = "dashboard";

function checkAdminAuth() {
    let pwd = prompt("🔐 أدخل كلمة المرور للدخول إلى لوحة الإدارة:");
    if(pwd !== "lion2026") {
        window.location.href = "index.html";
        return false;
    }
    return true;
}

if(!checkAdminAuth()) {} else { renderAdmin(); }

function renderAdmin() {
    const container = document.getElementById("adminContainer");
    let products = JSON.parse(localStorage.getItem("lion_products") || "[]");
    let coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
    let orders = JSON.parse(localStorage.getItem("lion_user_orders") || "[]");
    
    container.innerHTML = `
        <div class="admin-wrapper">
            <div class="admin-sidebar">
                <div class="admin-logo">
                    <img src="https://placehold.co/200x200?text=LION" alt="Logo">
                    <h3>متجر ليون</h3>
                    <small>مدير النظام</small>
                </div>
                <ul class="admin-menu">
                    <li data-tab="dashboard"><i class="fas fa-chart-line"></i> <span>لوحة التحكم</span></li>
                    <li data-tab="products"><i class="fas fa-boxes"></i> <span>المنتجات</span></li>
                    <li data-tab="add-product"><i class="fas fa-plus-circle"></i> <span>إضافة منتج</span></li>
                    <li data-tab="coupons"><i class="fas fa-ticket-alt"></i> <span>أكواد الخصم</span></li>
                    <li data-tab="orders"><i class="fas fa-shopping-cart"></i> <span>الطلبات</span></li>
                    <li data-tab="settings"><i class="fas fa-cog"></i> <span>الإعدادات</span></li>
                </ul>
            </div>
            <div class="admin-content" id="adminContent"></div>
        </div>
    `;
    
    document.querySelectorAll(".admin-menu li").forEach(item => {
        item.addEventListener("click", () => {
            const tab = item.dataset.tab;
            currentAdminTab = tab;
            loadTabContent(tab, products, coupons, orders);
        });
    });
    
    loadTabContent("dashboard", products, coupons, orders);
}

function loadTabContent(tab, products, coupons, orders) {
    const contentDiv = document.getElementById("adminContent");
    if(!contentDiv) return;
    
    if(tab === "dashboard") {
        const totalProducts = products.length;
        const lowStock = products.filter(p => p.stock < 5).length;
        const totalCoupons = coupons.length;
        const totalOrders = orders.length;
        contentDiv.innerHTML = `
            <div class="stats-cards">
                <div class="stat-card"><i class="fas fa-box"></i><h3>${totalProducts}</h3><p>منتج</p></div>
                <div class="stat-card"><i class="fas fa-exclamation-triangle"></i><h3>${lowStock}</h3><p>مخزن منخفض</p></div>
                <div class="stat-card"><i class="fas fa-ticket-alt"></i><h3>${totalCoupons}</h3><p>كود خصم</p></div>
                <div class="stat-card"><i class="fas fa-shopping-cart"></i><h3>${totalOrders}</h3><p>طلب</p></div>
            </div>
            <div class="section-card"><h3 class="section-title">📊 آخر النشاطات</h3><p>مرحباً بك في لوحة تحكم متجر ليون</p></div>
        `;
    }
    else if(tab === "products") {
        contentDiv.innerHTML = `
            <div class="section-card">
                <h3 class="section-title">📦 قائمة المنتجات</h3>
                <div class="products-table">
                    <table>
                        <thead><tr><th>الصورة</th><th>الاسم</th><th>السعر</th><th>المخزن</th><th>القسم</th><th>إجراءات</th></tr></thead>
                        <tbody id="productsTableBody"></tbody>
                    </table>
                </div>
            </div>
        `;
        const tbody = document.getElementById("productsTableBody");
        products.forEach(p => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><img src="${p.image}" class="product-img-thumb"></td>
                <td>${p.name}</td>
                <td>${p.price.toLocaleString()} د.ع</td>
                <td><input type="number" value="${p.stock}" min="0" class="stock-input" data-id="${p.id}" style="width:70px"></td>
                <td>${p.category}</td>
                <td><button class="edit-btn" data-id="${p.id}"><i class="fas fa-edit"></i></button> <button class="delete-btn" data-id="${p.id}"><i class="fas fa-trash"></i></button></td>
            `;
        });
        document.querySelectorAll(".stock-input").forEach(inp => {
            inp.addEventListener("change", (e) => {
                const id = parseInt(inp.dataset.id);
                const newStock = parseInt(inp.value);
                const prod = products.find(p => p.id === id);
                if(prod) prod.stock = newStock;
                localStorage.setItem("lion_products", JSON.stringify(products));
                alert("تم تحديث المخزن");
            });
        });
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                if(confirm("حذف المنتج نهائياً؟")) {
                    const id = parseInt(btn.dataset.id);
                    products = products.filter(p => p.id !== id);
                    localStorage.setItem("lion_products", JSON.stringify(products));
                    loadTabContent("products", products, coupons, orders);
                }
            });
        });
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => editProduct(parseInt(btn.dataset.id), products, coupons, orders));
        });
    }
    else if(tab === "add-product") {
        contentDiv.innerHTML = `
            <div class="section-card">
                <h3 class="section-title">➕ إضافة منتج جديد</h3>
                <form id="addProductForm">
                    <div class="form-row">
                        <input type="text" id="prodName" class="admin-input" placeholder="اسم المنتج" required>
                        <input type="number" id="prodPrice" class="admin-input" placeholder="السعر" required>
                        <input type="number" id="prodStock" class="admin-input" placeholder="الكمية" required>
                    </div>
                    <div class="form-row">
                        <select id="prodCategory" class="admin-select">
                            <option value="electronics">إلكترونيات</option>
                            <option value="clothing">ملابس</option>
                            <option value="accessories">إكسسوارات</option>
                        </select>
                        <input type="text" id="prodImage" class="admin-input" placeholder="رابط الصورة">
                    </div>
                    <button type="submit" class="admin-btn">➕ إضافة المنتج</button>
                </form>
                <div id="imagePreview"></div>
            </div>
        `;
        document.getElementById("addProductForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const newId = Date.now();
            const newProduct = {
                id: newId,
                name: document.getElementById("prodName").value,
                price: parseInt(document.getElementById("prodPrice").value),
                stock: parseInt(document.getElementById("prodStock").value),
                category: document.getElementById("prodCategory").value,
                image: document.getElementById("prodImage").value || "https://placehold.co/400x300?text=Product"
            };
            products.push(newProduct);
            localStorage.setItem("lion_products", JSON.stringify(products));
            alert("تم إضافة المنتج بنجاح!");
            loadTabContent("products", products, coupons, orders);
        });
    }
    else if(tab === "coupons") {
        contentDiv.innerHTML = `
            <div class="section-card">
                <h3 class="section-title">🏷️ إدارة أكواد الخصم</h3>
                <form id="addCouponForm">
                    <div class="form-row">
                        <input type="text" id="couponCode" placeholder="الكود (مثل: LION20)" required>
                        <input type="number" id="couponPercent" placeholder="نسبة الخصم %" required>
                        <input type="number" id="couponMaxUses" placeholder="الحد الأقصى (اتركه فارغاً لغير محدود)">
                    </div>
                    <button type="submit" class="admin-btn">✨ إنشاء كود</button>
                </form>
                <div id="couponsList" style="margin-top:20px"></div>
            </div>
        `;
        refreshCouponsList(coupons);
        document.getElementById("addCouponForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const code = document.getElementById("couponCode").value.trim().toUpperCase();
            const percent = parseFloat(document.getElementById("couponPercent").value);
            let maxUses = document.getElementById("couponMaxUses").value;
            maxUses = maxUses === "" ? null : parseInt(maxUses);
            if(!code || isNaN(percent) || percent<=0 || percent>100) return alert("بيانات غير صحيحة");
            if(coupons.find(c => c.code === code)) return alert("الكود موجود مسبقاً");
            coupons.push({ code, discountPercent: percent, maxUses, usedCount: 0 });
            localStorage.setItem("lion_coupons", JSON.stringify(coupons));
            alert("تم إنشاء الكود");
            loadTabContent("coupons", products, coupons, orders);
        });
    }
    else if(tab === "orders") {
        contentDiv.innerHTML = `<div class="section-card"><h3 class="section-title">📦 الطلبات</h3><div id="ordersListAdmin"></div></div>`;
        const ordersDiv = document.getElementById("ordersListAdmin");
        if(orders.length === 0) ordersDiv.innerHTML = "<p>لا توجد طلبات بعد</p>";
        else {
            ordersDiv.innerHTML = orders.map((order, idx) => `
                <div class="coupon-item-admin"><span><strong>${order.orderCode}</strong> - ${order.name} - ${order.total.toLocaleString()} د.ع</span><button onclick="deleteOrder(${idx})" class="admin-btn-danger admin-btn">حذف</button></div>
            `).join('');
        }
        window.deleteOrder = (idx) => {
            orders.splice(idx,1);
            localStorage.setItem("lion_user_orders", JSON.stringify(orders));
            loadTabContent("orders", products, coupons, orders);
        };
    }
    else if(tab === "settings") {
        contentDiv.innerHTML = `<div class="section-card"><h3 class="section-title">⚙️ إعدادات المتجر</h3><button id="resetDataBtn" class="admin-btn-danger admin-btn">إعادة ضبط المتجر بالكامل</button><p style="margin-top:15px">⚠️ تحذير: سيتم حذف جميع المنتجات والطلبات والأكواد</p></div>`;
        document.getElementById("resetDataBtn")?.addEventListener("click", () => {
            if(confirm("هل أنت متأكد؟ سيتم حذف كل شيء!")) {
                localStorage.clear();
                alert("تم إعادة الضبط، قم بتحديث الصفحة");
                window.location.reload();
            }
        });
    }
}

function refreshCouponsList(coupons) {
    const container = document.getElementById("couponsList");
    if(!container) return;
    if(coupons.length === 0) container.innerHTML = "<p>لا توجد أكواد خصم</p>";
    else {
        container.innerHTML = coupons.map((c, idx) => `
            <div class="coupon-item-admin">
                <span><strong>${c.code}</strong> (${c.discountPercent}%) - استخدم ${c.usedCount}/${c.maxUses === null ? '∞' : c.maxUses}</span>
                <button onclick="deleteCoupon(${idx})" class="admin-btn-danger admin-btn" style="padding:5px 12px">حذف</button>
            </div>
        `).join('');
    }
    window.deleteCoupon = (idx) => {
        coupons.splice(idx,1);
        localStorage.setItem("lion_coupons", JSON.stringify(coupons));
        location.reload();
    };
}

function editProduct(id, products, coupons, orders) {
    const product = products.find(p => p.id === id);
    const newName = prompt("الاسم الجديد:", product.name);
    const newPrice = prompt("السعر الجديد:", product.price);
    const newCategory = prompt("القسم الجديد (electronics/clothing/accessories):", product.category);
    if(newName) product.name = newName;
    if(newPrice && !isNaN(newPrice)) product.price = parseFloat(newPrice);
    if(newCategory) product.category = newCategory;
    localStorage.setItem("lion_products", JSON.stringify(products));
    loadTabContent("products", products, coupons, orders);
}
