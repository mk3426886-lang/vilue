// admin.js - لوحة الإدارة المتكاملة مع نافذة كلمة المرور

// =============== نظام التحقق من كلمة المرور ===============
function showPasswordModal() {
    // إخفاء محتوى الإدارة أولاً
    document.getElementById("adminContainer").innerHTML = '';
    
    const overlay = document.createElement('div');
    overlay.className = 'password-overlay';
    overlay.id = 'passwordOverlay';
    overlay.innerHTML = `
        <div class="password-box">
            <i class="fas fa-lock"></i>
            <h2>🔐 لوحة التحكم</h2>
            <p>متجر ليون | LION STORE</p>
            <input type="password" id="adminPassword" placeholder="••••••" autocomplete="off" maxlength="20">
            <button id="submitPassword">تأكيد الدخول</button>
            <div id="passwordError" class="error-msg">❌ كلمة المرور غير صحيحة</div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById("submitPassword").addEventListener("click", () => {
        const pwd = document.getElementById("adminPassword").value;
        if(pwd === "lion2026") {
            // إزالة الـ overlay وتحميل لوحة الإدارة
            overlay.remove();
            renderAdminPanel();
        } else {
            const errorDiv = document.getElementById("passwordError");
            errorDiv.style.display = "block";
            document.getElementById("adminPassword").value = "";
            document.getElementById("adminPassword").focus();
        }
    });
    
    document.getElementById("adminPassword").addEventListener("keypress", (e) => {
        if(e.key === "Enter") document.getElementById("submitPassword").click();
    });
}

// =============== لوحة الإدارة الرئيسية ===============
let currentAdminTab = "dashboard";
let products = [], coupons = [], orders = [], categories = [], sliders = [];

function renderAdminPanel() {
    loadAdminData();
    
    const container = document.getElementById("adminContainer");
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
                    <li data-tab="categories"><i class="fas fa-tags"></i> <span>الأقسام</span></li>
                    <li data-tab="sliders"><i class="fas fa-images"></i> <span>السلايدر</span></li>
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
            document.querySelectorAll(".admin-menu li").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            currentAdminTab = item.dataset.tab;
            loadAdminTabContent();
        });
    });
    
    // تفعيل التبويب الأول
    document.querySelector(".admin-menu li")?.classList.add("active");
    loadAdminTabContent();
}

function loadAdminData() {
    products = JSON.parse(localStorage.getItem("lion_products") || "[]");
    coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
    orders = JSON.parse(localStorage.getItem("lion_user_orders") || "[]");
    categories = JSON.parse(localStorage.getItem("lion_categories") || "[]");
    sliders = JSON.parse(localStorage.getItem("lion_sliders") || "[]");
    
    if(products.length === 0) {
        products = [
            { id: 1, name: "ماوس ذكي لاسلكي", price: 15000, stock: 9, image: "https://placehold.co/400x300?text=Mouse", categoryId: 1 },
            { id: 2, name: "لوحة مفاتيح ميكانيكية", price: 35000, stock: 3, image: "https://placehold.co/400x300?text=Keyboard", categoryId: 1 },
            { id: 3, name: "سماعات لاسلكية", price: 25000, stock: 5, image: "https://placehold.co/400x300?text=Headphones", categoryId: 1 },
            { id: 4, name: "تي شيرت قطني", price: 15000, stock: 10, image: "https://placehold.co/400x300?text=TShirt", categoryId: 2 },
            { id: 5, name: "حذاء رياضي", price: 55000, stock: 4, image: "https://placehold.co/400x300?text=Shoes", categoryId: 2 },
            { id: 6, name: "نظارة شمسية", price: 22000, stock: 7, image: "https://placehold.co/400x300?text=Glasses", categoryId: 3 }
        ];
        localStorage.setItem("lion_products", JSON.stringify(products));
    }
    
    if(categories.length === 0) {
        categories = [
            { id: 1, name: "إلكترونيات", icon: "fa-microchip", order: 1 },
            { id: 2, name: "ملابس", icon: "fa-tshirt", order: 2 },
            { id: 3, name: "إكسسوارات", icon: "fa-gem", order: 3 }
        ];
        localStorage.setItem("lion_categories", JSON.stringify(categories));
    }
    
    if(sliders.length === 0) {
        sliders = [
            { id: 1, image: "https://placehold.co/800x300?text=عرض+خاص+1" },
            { id: 2, image: "https://placehold.co/800x300?text=تخفيضات+الصيف" },
            { id: 3, image: "https://placehold.co/800x300?text=شحن+مجاني" }
        ];
        localStorage.setItem("lion_sliders", JSON.stringify(sliders));
    }
}

function saveProducts() { localStorage.setItem("lion_products", JSON.stringify(products)); }
function saveCoupons() { localStorage.setItem("lion_coupons", JSON.stringify(coupons)); }
function saveCategories() { localStorage.setItem("lion_categories", JSON.stringify(categories)); }
function saveSliders() { localStorage.setItem("lion_sliders", JSON.stringify(sliders)); }

function loadAdminTabContent() {
    const contentDiv = document.getElementById("adminContent");
    if(!contentDiv) return;
    
    if(currentAdminTab === "dashboard") {
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
            <div class="section-card"><h3 class="section-title">📊 لوحة التحكم</h3><p>مرحباً بك في لوحة تحكم متجر ليون</p></div>
        `;
    }
    else if(currentAdminTab === "products") {
        contentDiv.innerHTML = `
            <div class="section-card">
                <h3 class="section-title">📦 المنتجات</h3>
                <div class="products-table">
                    <table><thead><tr><th>الصورة</th><th>الاسم</th><th>السعر</th><th>المخزن</th><th>القسم</th><th>إجراءات</th></tr></thead><tbody id="productsTableBody"></tbody></table>
                </div>
            </div>
        `;
        const tbody = document.getElementById("productsTableBody");
        products.forEach(p => {
            const cat = categories.find(c => c.id === p.categoryId);
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><img src="${p.image}" class="product-img-thumb"></td>
                <td>${p.name}</td>
                <td><input type="number" value="${p.price}" class="price-input" data-id="${p.id}" style="width:100px"></td>
                <td><input type="number" value="${p.stock}" class="stock-input" data-id="${p.id}" style="width:70px"></td>
                <td>
                    <select class="category-select" data-id="${p.id}">
                        ${categories.map(c => `<option value="${c.id}" ${p.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </td>
                <td><button class="delete-product" data-id="${p.id}" style="background:#dc3545;color:white;border:none;padding:6px 12px;border-radius:8px">🗑️ حذف</button></td>
            `;
        });
        document.querySelectorAll(".stock-input").forEach(inp => {
            inp.addEventListener("change", () => {
                const id = parseInt(inp.dataset.id);
                const prod = products.find(p => p.id === id);
                if(prod) prod.stock = parseInt(inp.value);
                saveProducts();
                alert("✅ تم تحديث المخزن");
            });
        });
        document.querySelectorAll(".price-input").forEach(inp => {
            inp.addEventListener("change", () => {
                const id = parseInt(inp.dataset.id);
                const prod = products.find(p => p.id === id);
                if(prod) prod.price = parseInt(inp.value);
                saveProducts();
                alert("✅ تم تحديث السعر");
            });
        });
        document.querySelectorAll(".category-select").forEach(sel => {
            sel.addEventListener("change", () => {
                const id = parseInt(sel.dataset.id);
                const prod = products.find(p => p.id === id);
                if(prod) prod.categoryId = parseInt(sel.value);
                saveProducts();
                alert("✅ تم تحديث القسم");
            });
        });
        document.querySelectorAll(".delete-product").forEach(btn => {
            btn.addEventListener("click", () => {
                if(confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
                    const id = parseInt(btn.dataset.id);
                    products = products.filter(p => p.id !== id);
                    saveProducts();
                    loadAdminTabContent();
                }
            });
        });
    }
    else if(currentAdminTab === "add-product") {
        contentDiv.innerHTML = `
            <div class="section-card">
                <h3 class="section-title">➕ إضافة منتج</h3>
                <div class="form-row">
                    <input type="text" id="prodName" class="admin-input" placeholder="اسم المنتج">
                    <input type="number" id="prodPrice" class="admin-input" placeholder="السعر">
                    <input type="number" id="prodStock" class="admin-input" placeholder="الكمية">
                </div>
                <div class="form-row">
                    <select id="prodCategory" class="admin-select">
                        ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                    <input type="text" id="prodImage" class="admin-input" placeholder="رابط الصورة">
                </div>
                <button id="addProductBtn" class="admin-btn">➕ إضافة المنتج</button>
            </div>
        `;
        document.getElementById("addProductBtn")?.addEventListener("click", () => {
            const newId = Date.now();
            const newProduct = {
                id: newId,
                name: document.getElementById("prodName").value,
                price: parseInt(document.getElementById("prodPrice").value),
                stock: parseInt(document.getElementById("prodStock").value),
                categoryId: parseInt(document.getElementById("prodCategory").value),
                image: document.getElementById("prodImage").value || "https://placehold.co/400x300?text=Product"
            };
            if(!newProduct.name || !newProduct.price) { alert("يرجى ملء البيانات"); return; }
            products.push(newProduct);
            saveProducts();
            alert("✅ تم إضافة المنتج");
            loadAdminTabContent();
        });
    }
    else if(currentAdminTab === "categories") {
        contentDiv.innerHTML = `
            <div class="section-card">
                <h3 class="section-title">🏷️ الأقسام</h3>
                <div id="categoriesList"></div>
                <hr>
                <h4>➕ إضافة قسم جديد</h4>
                <div class="form-row">
                    <input type="text" id="newCatName" class="admin-input" placeholder="اسم القسم">
                    <input type="text" id="newCatIcon" class="admin-input" placeholder="أيقونة (مثل: fa-microchip)">
                    <input type="number" id="newCatOrder" class="admin-input" placeholder="الترتيب">
                </div>
                <button id="addCategoryBtn" class="admin-btn">➕ إضافة قسم</button>
            </div>
        `;
        const catsDiv = document.getElementById("categoriesList");
        catsDiv.innerHTML = categories.map(c => `
            <div class="coupon-item-admin">
                <span><i class="fas ${c.icon}"></i> ${c.name} (ترتيب: ${c.order})</span>
                <button class="delete-cat" data-id="${c.id}" style="background:#dc3545;color:white;border:none;padding:6px 12px;border-radius:8px">حذف</button>
            </div>
        `).join('');
        document.querySelectorAll(".delete-cat").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                categories = categories.filter(c => c.id !== id);
                saveCategories();
                loadAdminTabContent();
            });
        });
        document.getElementById("addCategoryBtn")?.addEventListener("click", () => {
            const newId = Date.now();
            categories.push({
                id: newId,
                name: document.getElementById("newCatName").value,
                icon: document.getElementById("newCatIcon").value || "fa-tag",
                order: parseInt(document.getElementById("newCatOrder").value) || categories.length + 1
            });
            saveCategories();
            alert("✅ تم إضافة القسم");
            loadAdminTabContent();
        });
    }
    else if(currentAdminTab === "sliders") {
        contentDiv.innerHTML = `
            <div class="section-card">
                <h3 class="section-title">🖼️ السلايدر</h3>
                <div id="slidersList"></div>
                <hr>
                <h4>➕ إضافة صورة جديدة</h4>
                <div class="form-row">
                    <input type="text" id="newSliderImage" class="admin-input" placeholder="رابط الصورة">
                </div>
                <button id="addSliderBtn" class="admin-btn">➕ إضافة صورة</button>
            </div>
        `;
        const slidersDiv = document.getElementById("slidersList");
        slidersDiv.innerHTML = sliders.map(s => `
            <div class="coupon-item-admin">
                <img src="${s.image}" style="width:60px;height:40px;object-fit:cover;border-radius:8px">
                <button class="delete-slider" data-id="${s.id}" style="background:#dc3545;color:white;border:none;padding:6px 12px;border-radius:8px">حذف</button>
            </div>
        `).join('');
        document.querySelectorAll(".delete-slider").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                sliders = sliders.filter(s => s.id !== id);
                saveSliders();
                loadAdminTabContent();
            });
        });
        document.getElementById("addSliderBtn")?.addEventListener("click", () => {
            const newId = Date.now();
            const imageUrl = document.getElementById("newSliderImage").value;
            if(!imageUrl) { alert("يرجى إدخال رابط الصورة"); return; }
            sliders.push({ id: newId, image: imageUrl });
            saveSliders();
            alert("✅ تم إضافة الصورة");
            loadAdminTabContent();
        });
    }
    else if(currentAdminTab === "coupons") {
        contentDiv.innerHTML = `
            <div class="section-card">
                <h3 class="section-title">🏷️ أكواد الخصم</h3>
                <div class="form-row">
                    <input type="text" id="couponCode" placeholder="الكود">
                    <input type="number" id="couponPercent" placeholder="نسبة الخصم %">
                    <input type="number" id="couponMaxUses" placeholder="الحد الأقصى (اتركه فارغاً)">
                </div>
                <button id="createCouponBtn" class="admin-btn">✨ إنشاء كود</button>
                <div id="couponsList" style="margin-top:20px"></div>
            </div>
        `;
        refreshCouponsList();
        document.getElementById("createCouponBtn")?.addEventListener("click", () => {
            const code = document.getElementById("couponCode").value.trim().toUpperCase();
            const percent = parseFloat(document.getElementById("couponPercent").value);
            let maxUses = document.getElementById("couponMaxUses").value;
            maxUses = maxUses === "" ? null : parseInt(maxUses);
            if(!code || isNaN(percent) || percent <= 0 || percent > 100) { alert("بيانات غير صحيحة"); return; }
            if(coupons.find(c => c.code === code)) { alert("الكود موجود مسبقاً"); return; }
            coupons.push({ code, discountPercent: percent, maxUses, usedCount: 0 });
            saveCoupons();
            alert("✅ تم إنشاء الكود");
            loadAdminTabContent();
        });
    }
    else if(currentAdminTab === "orders") {
        contentDiv.innerHTML = `<div class="section-card"><h3 class="section-title">📦 الطلبات</h3><div id="ordersListAdmin"></div></div>`;
        const ordersDiv = document.getElementById("ordersListAdmin");
        if(orders.length === 0) ordersDiv.innerHTML = "<p>لا توجد طلبات</p>";
        else {
            ordersDiv.innerHTML = orders.map((order, idx) => `
                <div class="coupon-item-admin">
                    <div><strong>${order.orderCode}</strong><br>${order.name}<br>${order.grandTotal.toLocaleString()} د.ع</div>
                    <button onclick="window.deleteOrder(${idx})" style="background:#dc3545;color:white;border:none;padding:6px 12px;border-radius:8px">حذف</button>
                </div>
            `).join('');
        }
        window.deleteOrder = (idx) => {
            orders.splice(idx,1);
            localStorage.setItem("lion_user_orders", JSON.stringify(orders));
            loadAdminTabContent();
        };
    }
    else if(currentAdminTab === "settings") {
        contentDiv.innerHTML = `<div class="section-card"><h3 class="section-title">⚙️ الإعدادات</h3><button id="resetDataBtn" class="admin-btn admin-btn-danger">إعادة ضبط المتجر بالكامل</button><p style="margin-top:15px">⚠️ تحذير: سيتم حذف جميع المنتجات والطلبات والأكواد</p></div>`;
        document.getElementById("resetDataBtn")?.addEventListener("click", () => {
            if(confirm("هل أنت متأكد؟ سيتم حذف كل شيء!")) {
                localStorage.clear();
                alert("تم إعادة الضبط");
                window.location.reload();
            }
        });
    }
}

function refreshCouponsList() {
    const container = document.getElementById("couponsList");
    if(!container) return;
    if(coupons.length === 0) container.innerHTML = "<p>لا توجد أكواد خصم</p>";
    else {
        container.innerHTML = coupons.map((c, idx) => `
            <div class="coupon-item-admin">
                <span><strong>${c.code}</strong> (${c.discountPercent}%) - استخدم ${c.usedCount}/${c.maxUses === null ? '∞' : c.maxUses}</span>
                <button onclick="window.deleteCoupon(${idx})" style="background:#dc3545;color:white;border:none;padding:6px 12px;border-radius:8px">حذف</button>
            </div>
        `).join('');
    }
    window.deleteCoupon = (idx) => {
        coupons.splice(idx,1);
        saveCoupons();
        loadAdminTabContent();
    };
}

// بدء التشغيل - عرض مودال كلمة المرور أولاً
document.addEventListener("DOMContentLoaded", () => {
    showPasswordModal();
});
