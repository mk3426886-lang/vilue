// admin.js - لوحة إدارة ماركت ليون

function showLogin() {
    document.getElementById("adminRoot").innerHTML = '';
    let div = document.createElement('div');
    div.className = 'login-screen';
    div.innerHTML = `
        <div class="login-card">
            <i class="fas fa-lock" style="font-size:48px; color:#ff6a00"></i>
            <h2 style="margin:12px 0">🔐 لوحة المدير</h2>
            <p>ماركت ليون</p>
            <input type="password" id="adminPassword" placeholder="كلمة المرور">
            <button id="loginBtn" class="admin-btn" style="width:100%">تأكيد الدخول</button>
            <div id="errorMsg" style="color:red; margin-top:12px; display:none">❌ كلمة مرور خاطئة</div>
        </div>
    `;
    document.body.appendChild(div);
    document.getElementById("loginBtn").onclick = () => {
        let pass = document.getElementById("adminPassword").value;
        if(pass === "lion2026") {
            div.remove();
            renderAdmin();
        } else {
            document.getElementById("errorMsg").style.display = "block";
            document.getElementById("adminPassword").value = "";
        }
    };
    document.getElementById("adminPassword").addEventListener("keypress", (e) => {
        if(e.key === "Enter") document.getElementById("loginBtn").click();
    });
}

function renderAdmin() {
    let products = JSON.parse(localStorage.getItem("lion_products") || "[]");
    let coupons = JSON.parse(localStorage.getItem("lion_coupons") || "[]");
    let orders = JSON.parse(localStorage.getItem("lion_orders") || "[]");
    let sliders = JSON.parse(localStorage.getItem("lion_sliders") || "[]");
    let deliveryFee = localStorage.getItem("lion_delivery_fee") || "3000";
    
    let html = `
        <div class="admin-wrap">
            <div class="admin-header">
                <h1><i class="fas fa-crown"></i> لوحة تحكم ماركت ليون</h1>
                <p>إدارة المنتجات - السلايدر - أكواد الخصم - سعر التوصيل</p>
            </div>
            <div class="admin-tabs">
                <div class="admin-tab active" data-tab="products">📦 منتجات</div>
                <div class="admin-tab" data-tab="add">➕ إضافة</div>
                <div class="admin-tab" data-tab="sliders">🖼️ سلايدر</div>
                <div class="admin-tab" data-tab="coupons">🏷️ أكواد</div>
                <div class="admin-tab" data-tab="delivery">🚚 التوصيل</div>
                <div class="admin-tab" data-tab="orders">📋 الطلبات</div>
                <div class="admin-tab" data-tab="reset">⚙️ إعدادات</div>
            </div>
            <div id="adminContent"></div>
        </div>
    `;
    document.getElementById("adminRoot").innerHTML = html;
    
    function loadTab(tab) {
        let cont = document.getElementById("adminContent");
        if(tab === "products") {
            cont.innerHTML = `<div class="admin-card"><h3>📦 المنتجات</h3><div style="overflow-x:auto"><table><thead><tr><th>الصورة</th><th>الاسم</th><th>السعر</th><th>المخزن</th><th>القسم</th><th>حذف</th></tr></thead><tbody id="prodsTable"></tbody></table></div></div>`;
            let tbody = document.getElementById("prodsTable");
            tbody.innerHTML = products.map(p => `
                <tr>
                    <td><img src="${p.image}" class="mini-img"></td>
                    <td><input type="text" value="${p.name}" class="edit-name" data-id="${p.id}" style="width:130px"></td>
                    <td><input type="number" value="${p.price}" class="edit-price" data-id="${p.id}" style="width:100px"></td>
                    <td><input type="number" value="${p.stock}" class="edit-stock" data-id="${p.id}" style="width:70px"></td>
                    <td>
                        <select class="edit-cat" data-id="${p.id}">
                            <option value="electronics" ${p.category === 'electronics' ? 'selected' : ''}>إلكترونيات</option>
                            <option value="clothing" ${p.category === 'clothing' ? 'selected' : ''}>ملابس</option>
                            <option value="accessories" ${p.category === 'accessories' ? 'selected' : ''}>إكسسوارات</option>
                        </select>
                    </td>
                    <td><button class="del-prod" data-id="${p.id}" style="background:#dc3545;color:white;border:none;padding:6px 12px;border-radius:30px">🗑️</button></td>
                </tr>
            `).join('');
            attachProdEvents();
        } 
        else if(tab === "add") {
            cont.innerHTML = `
                <div class="admin-card">
                    <h3>➕ إضافة منتج</h3>
                    <div class="form-grid">
                        <input type="text" id="newName" class="admin-input" placeholder="اسم المنتج">
                        <input type="number" id="newPrice" class="admin-input" placeholder="السعر">
                        <input type="number" id="newStock" class="admin-input" placeholder="الكمية">
                        <select id="newCat" class="admin-select"><option value="electronics">إلكترونيات</option><option value="clothing">ملابس</option><option value="accessories">إكسسوارات</option></select>
                        <input type="text" id="newImg" class="admin-input" placeholder="رابط الصورة (اتركه افتراضي)">
                    </div>
                    <button id="addProdBtn" class="admin-btn">➕ إضافة</button>
                </div>
            `;
            document.getElementById("addProdBtn").onclick = () => {
                let id = Date.now();
                let newP = {
                    id, name: document.getElementById("newName").value, price: parseInt(document.getElementById("newPrice").value),
                    stock: parseInt(document.getElementById("newStock").value), category: document.getElementById("newCat").value,
                    image: document.getElementById("newImg").value || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ff6a20'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40'%3E🛒%3C/text%3E%3C/svg%3E"
                };
                if(!newP.name || !newP.price) { alert("املأ البيانات"); return; }
                products.push(newP);
                localStorage.setItem("lion_products", JSON.stringify(products));
                alert("تمت الإضافة");
                loadTab("products");
            };
        }
        else if(tab === "sliders") {
            cont.innerHTML = `<div class="admin-card"><h3>🖼️ صور السلايدر</h3><div id="slidersList"></div><hr style="margin:20px 0"><input type="text" id="newSliderUrl" class="admin-input" placeholder="رابط الصورة"><button id="addSliderBtn" class="admin-btn" style="margin-top:12px">➕ إضافة صورة</button></div>`;
            refreshSliders();
            document.getElementById("addSliderBtn").onclick = () => {
                let url = document.getElementById("newSliderUrl").value;
                if(!url) { alert("أدخل رابط"); return; }
                sliders.push({ id: Date.now(), image: url });
                localStorage.setItem("lion_sliders", JSON.stringify(sliders));
                refreshSliders();
                document.getElementById("newSliderUrl").value = "";
            };
            function refreshSliders() {
                let container = document.getElementById("slidersList");
                container.innerHTML = sliders.map(s => `<div style="display:flex; justify-content:space-between; background:#f5f7fb; padding:12px; border-radius:28px; margin-bottom:10px"><img src="${s.image}" style="width:70px;height:45px;border-radius:16px"><button class="del-slider" data-id="${s.id}" style="background:#dc3545;color:white;border:none;padding:6px 18px;border-radius:30px">حذف</button></div>`).join('');
                document.querySelectorAll(".del-slider").forEach(btn => btn.onclick = () => { sliders = sliders.filter(s => s.id !== parseInt(btn.dataset.id)); localStorage.setItem("lion_sliders", JSON.stringify(sliders)); refreshSliders(); });
            }
        }
        else if(tab === "coupons") {
            cont.innerHTML = `<div class="admin-card"><h3>🏷️ أكواد الخصم</h3><div class="form-grid"><input type="text" id="cCode" placeholder="الكود"><input type="number" id="cPercent" placeholder="نسبة %"><input type="number" id="cMax" placeholder="حد أقصى (اتركه فارغاً)"></div><button id="createCoupon" class="admin-btn">✨ إنشاء</button><div id="couponsContainer" style="margin-top:25px"></div></div>`;
            refreshCoupons();
            document.getElementById("createCoupon").onclick = () => {
                let code = document.getElementById("cCode").value.trim().toUpperCase();
                let percent = parseFloat(document.getElementById("cPercent").value);
                let max = document.getElementById("cMax").value;
                max = max === "" ? null : parseInt(max);
                if(!code || isNaN(percent) || percent<=0 || percent>100) { alert("بيانات خاطئة"); return; }
                if(coupons.find(c => c.code === code)) { alert("الكود موجود"); return; }
                coupons.push({ code, discountPercent: percent, maxUses: max, usedCount: 0 });
                localStorage.setItem("lion_coupons", JSON.stringify(coupons));
                refreshCoupons();
                document.getElementById("cCode").value = "";
                document.getElementById("cPercent").value = "";
                document.getElementById("cMax").value = "";
            };
            function refreshCoupons() {
                let container = document.getElementById("couponsContainer");
                container.innerHTML = coupons.map((c, idx) => `<div style="display:flex; justify-content:space-between; background:#f5f7fb; padding:12px; border-radius:28px; margin-bottom:10px"><span><strong>${c.code}</strong> (${c.discountPercent}%) - استخدم ${c.usedCount}/${c.maxUses === null ? '∞' : c.maxUses}</span><button class="del-coupon" data-idx="${idx}" style="background:#dc3545;color:white;border:none;padding:6px 18px;border-radius:30px">حذف</button></div>`).join('');
                document.querySelectorAll(".del-coupon").forEach(btn => btn.onclick = () => { coupons.splice(parseInt(btn.dataset.idx), 1); localStorage.setItem("lion_coupons", JSON.stringify(coupons)); refreshCoupons(); });
            }
        }
        else if(tab === "delivery") {
            cont.innerHTML = `<div class="admin-card"><h3>🚚 سعر التوصيل</h3><div class="form-grid"><input type="number" id="deliveryValue" class="admin-input" value="${deliveryFee}" placeholder="سعر التوصيل"></div><button id="saveDelivery" class="admin-btn">حفظ السعر</button></div>`;
            document.getElementById("saveDelivery").onclick = () => {
                let newFee = parseInt(document.getElementById("deliveryValue").value);
                if(isNaN(newFee)) { alert("أدخل رقماً"); return; }
                localStorage.setItem("lion_delivery_fee", newFee);
                alert("تم تحديث سعر التوصيل");
                loadTab("delivery");
            };
        }
        else if(tab === "orders") {
            cont.innerHTML = `<div class="admin-card"><h3>📋 الطلبات</h3><div id="ordersAdminList"></div></div>`;
            let ordDiv = document.getElementById("ordersAdminList");
            if(orders.length === 0) ordDiv.innerHTML = "<p>لا توجد طلبات</p>";
            else {
                ordDiv.innerHTML = orders.map((o, idx) => `<div style="background:#f5f7fb; border-radius:28px; padding:16px; margin-bottom:14px"><p><strong>${o.code}</strong> | ${o.name} | ${o.phone}</p><p>${o.gov} - ${o.district} - ${o.near}</p><p>💰 ${o.grand} د.ع</p><button class="del-order" data-idx="${idx}" style="background:#dc3545;color:white;border:none;padding:6px 18px;border-radius:30px">حذف الطلب</button></div>`).join('');
                document.querySelectorAll(".del-order").forEach(btn => btn.onclick = () => { orders.splice(parseInt(btn.dataset.idx), 1); localStorage.setItem("lion_orders", JSON.stringify(orders)); loadTab("orders"); });
            }
        }
        else if(tab === "reset") {
            cont.innerHTML = `<div class="admin-card"><h3>⚙️ إعادة ضبط</h3><button id="resetAllBtn" class="admin-btn admin-btn-danger">⚠️ حذف كل البيانات</button><p style="margin-top:15px">سيتم مسح المنتجات والطلبات والسلايدر والأكواد</p></div>`;
            document.getElementById("resetAllBtn").onclick = () => { if(confirm("حذف كل شيء؟")) { localStorage.clear(); alert("تم المسح"); window.location.reload(); } };
        }
    }
    
    function attachProdEvents() {
        document.querySelectorAll(".edit-name").forEach(i => i.onchange = () => { let p = products.find(pr => pr.id === parseInt(i.dataset.id)); if(p) p.name = i.value; saveProds(); });
        document.querySelectorAll(".edit-price").forEach(i => i.onchange = () => { let p = products.find(pr => pr.id === parseInt(i.dataset.id)); if(p) p.price = parseInt(i.value); saveProds(); });
        document.querySelectorAll(".edit-stock").forEach(i => i.onchange = () => { let p = products.find(pr => pr.id === parseInt(i.dataset.id)); if(p) p.stock = parseInt(i.value); saveProds(); });
        document.querySelectorAll(".edit-cat").forEach(i => i.onchange = () => { let p = products.find(pr => pr.id === parseInt(i.dataset.id)); if(p) p.category = i.value; saveProds(); });
        document.querySelectorAll(".del-prod").forEach(btn => btn.onclick = () => { if(confirm("حذف المنتج؟")) { products = products.filter(p => p.id !== parseInt(btn.dataset.id)); saveProds(); loadTab("products"); } });
    }
    function saveProds() { localStorage.setItem("lion_products", JSON.stringify(products)); }
    
    document.querySelectorAll(".admin-tab").forEach(t => {
        t.onclick = () => {
            document.querySelectorAll(".admin-tab").forEach(tab => tab.classList.remove("active"));
            t.classList.add("active");
            loadTab(t.dataset.tab);
        };
    });
    loadTab("products");
}

document.addEventListener("DOMContentLoaded", showLogin);
