const ADMIN_PASS = 'lion2026';

// ===== التحقق =====
function login() {
    const pass = document.getElementById('adminPass').value;
    if (pass === ADMIN_PASS) {
        localStorage.setItem('adminLogged', 'true');
        showPanel();
    } else {
        alert('كلمة المرور خاطئة! سيتم إعادتك للمتجر...');
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('adminLogged');
    window.location.href = 'index.html';
}

function showPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').classList.add('active');
    initAdmin();
}

// ===== التهيئة =====
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('adminLogged') === 'true') {
        showPanel();
    }
});

function initAdmin() {
    renderProductsTable();
    renderStock();
    renderDiscounts();
    renderCategoriesList();
    renderSliderList();
    updateCategorySelects();
    document.getElementById('deliveryFeeInput').value = localStorage.getItem('deliveryFee') || 2000;
}

// ===== التبويبات =====
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    event.target.classList.add('active');
    
    if (tab === 'products') renderProductsTable();
    if (tab === 'stock') renderStock();
    if (tab === 'discounts') renderDiscounts();
    if (tab === 'categories') renderCategoriesList();
    if (tab === 'slider') renderSliderList();
}

// ===== المنتجات =====
function renderProductsTable() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;"></td>
            <td>${p.name}</td>
            <td>${p.price.toLocaleString()} د.ع</td>
            <td>${p.stock}</td>
            <td>${p.category}</td>
            <td><button class="btn-danger" onclick="deleteProduct(${p.id})">حذف</button></td>
        </tr>
    `).join('');
}

function addProduct() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    
    const product = {
        id: newId,
        name: document.getElementById('newProdName').value,
        desc: document.getElementById('newProdDesc').value,
        price: parseInt(document.getElementById('newProdPrice').value) || 0,
        stock: parseInt(document.getElementById('newProdStock').value) || 0,
        image: document.getElementById('newProdImage').value || 'https://via.placeholder.com/300x200',
        category: document.getElementById('newProdCategory').value
    };
    
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    
    // تفريغ الحقول
    document.getElementById('newProdName').value = '';
    document.getElementById('newProdDesc').value = '';
    document.getElementById('newProdPrice').value = '';
    document.getElementById('newProdStock').value = '';
    document.getElementById('newProdImage').value = '';
    
    renderProductsTable();
    renderStock();
    alert('تم إضافة المنتج ✅');
}

function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    renderProductsTable();
    renderStock();
}

// ===== المخزون =====
function renderStock() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tbody = document.getElementById('stockTable');
    const select = document.getElementById('stockProduct');
    
    tbody.innerHTML = products.map(p => {
        const status = p.stock > 10 ? '✅ جيد' : p.stock > 0 ? '⚠️ منخفض' : '❌ نفذ';
        return `
            <tr>
                <td>${p.name}</td>
                <td><strong>${p.stock}</strong></td>
                <td>${status}</td>
            </tr>
        `;
    }).join('');
    
    select.innerHTML = products.map(p => `<option value="${p.id}">${p.name} (المخزون: ${p.stock})</option>`).join('');
}

function updateStock() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const id = parseInt(document.getElementById('stockProduct').value);
    const amount = parseInt(document.getElementById('stockAmount').value) || 0;
    
    const product = products.find(p => p.id === id);
    if (product) {
        product.stock += amount;
        localStorage.setItem('products', JSON.stringify(products));
        renderStock();
        document.getElementById('stockAmount').value = '';
        alert(`تم تحديث مخزون ${product.name} إلى ${product.stock} ✅`);
    }
}

// ===== أكواد الخصم =====
function renderDiscounts() {
    const codes = JSON.parse(localStorage.getItem('discountCodes')) || [];
    const tbody = document.getElementById('discountsTable');
    
    tbody.innerHTML = codes.map(d => {
        const status = d.used >= d.maxUses ? '❌ منتهي' : '✅ نشط';
        return `
            <tr>
                <td><strong>${d.code}</strong></td>
                <td>${d.percentage}%</td>
                <td>${d.used}</td>
                <td>${d.maxUses}</td>
                <td>${status}</td>
            </tr>
        `;
    }).join('');
}

function createDiscount() {
    const codes = JSON.parse(localStorage.getItem('discountCodes')) || [];
    const code = document.getElementById('discCode').value.trim().toUpperCase();
    const percent = parseInt(document.getElementById('discPercent').value);
    const max = parseInt(document.getElementById('discMax').value);
    
    if (!code || !percent || !max) {
        alert('يرجى ملء جميع الحقول!');
        return;
    }
    
    codes.push({ code, percentage: percent, used: 0, maxUses: max });
    localStorage.setItem('discountCodes', JSON.stringify(codes));
    
    document.getElementById('discCode').value = '';
    document.getElementById('discPercent').value = '';
    document.getElementById('discMax').value = '';
    
    renderDiscounts();
    alert('تم إنشاء كود الخصم ✅');
}

// ===== الأقسام =====
function renderCategoriesList() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const div = document.getElementById('categoriesList');
    
    div.innerHTML = categories.map((cat, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:#f8f8f8; border-radius:10px; margin-bottom:8px;">
            <span>${cat}</span>
            <button class="btn-danger" onclick="deleteCategory(${i})">حذف</button>
        </div>
    `).join('');
}

function updateCategorySelects() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const select = document.getElementById('newProdCategory');
    select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

function addCategory() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const newCat = document.getElementById('newCategory').value.trim();
    
    if (!newCat || categories.includes(newCat)) {
        alert('القسم موجود أو فارغ!');
        return;
    }
    
    categories.push(newCat);
    localStorage.setItem('categories', JSON.stringify(categories));
    document.getElementById('newCategory').value = '';
    renderCategoriesList();
    updateCategorySelects();
}

function deleteCategory(index) {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories.splice(index, 1);
    localStorage.setItem('categories', JSON.stringify(categories));
    renderCategoriesList();
    updateCategorySelects();
}

// ===== السلايدر =====
function renderSliderList() {
    const sliders = JSON.parse(localStorage.getItem('sliders')) || [];
    const div = document.getElementById('sliderList');
    
    div.innerHTML = sliders.map((img, i) => `
        <div style="position:relative;">
            <img src="${img}" style="width:150px; height:100px; object-fit:cover; border-radius:10px;">
            <button onclick="deleteSlider(${i})" style="position:absolute; top:-8px; right:-8px; background:#e74c3c; color:#fff; border:none; width:25px; height:25px; border-radius:50%; cursor:pointer;">×</button>
        </div>
    `).join('');
}

function addSlider() {
    const sliders = JSON.parse(localStorage.getItem('sliders')) || [];
    const img = document.getElementById('sliderImage').value.trim();
    
    if (!img) return;
    sliders.push(img);
    localStorage.setItem('sliders', JSON.stringify(sliders));
    document.getElementById('sliderImage').value = '';
    renderSliderList();
}

function deleteSlider(index) {
    let sliders = JSON.parse(localStorage.getItem('sliders')) || [];
    sliders.splice(index, 1);
    localStorage.setItem('sliders', JSON.stringify(sliders));
    renderSliderList();
}

// ===== الإعدادات =====
function saveDeliveryFee() {
    const fee = parseInt(document.getElementById('deliveryFeeInput').value) || 2000;
    localStorage.setItem('deliveryFee', fee);
    alert('تم حفظ سعر التوصيل ✅');
}
