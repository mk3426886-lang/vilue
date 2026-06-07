// ===== البيانات =====
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'ماوس لاسلكي', desc: 'ماوس احترافي للألعاب', price: 1500, stock: 12, image: 'https://via.placeholder.com/300x200?text=Mouse', category: 'اكسسوارات' },
    { id: 2, name: 'كيبورد ميكانيكي', desc: 'RGB مع مفاتيح زرقاء', price: 1800, stock: 8, image: 'https://via.placeholder.com/300x200?text=Keyboard', category: 'اكسسوارات' },
    { id: 3, name: 'شاحن لاسلكي', desc: 'شحن سريع 15 واط', price: 1200, stock: 20, image: 'https://via.placeholder.com/300x200?text=Charger', category: 'شواحن' },
    { id: 4, name: 'سماعات بلوتوث', desc: 'صوت نقي مع ميكروفون', price: 2500, stock: 5, image: 'https://via.placeholder.com/300x200?text=Headphones', category: 'صوتيات' }
];

let categories = JSON.parse(localStorage.getItem('categories')) || ['اكسسوارات', 'شواحن', 'صوتيات'];
let sliders = JSON.parse(localStorage.getItem('sliders')) || [
    'https://via.placeholder.com/800x300?text=عرض+1',
    'https://via.placeholder.com/800x300?text=عرض+2'
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let discountCodes = JSON.parse(localStorage.getItem('discountCodes')) || [];
let deliveryFee = parseInt(localStorage.getItem('deliveryFee')) || 2000;
let appliedDiscount = null;

// ===== التهيئة =====
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts('all');
    renderSlider();
    updateCartUI();
    startSlider();
});

// ===== التصنيفات =====
function renderCategories() {
    const nav = document.getElementById('categories-nav');
    nav.innerHTML = categories.map(cat => 
        `<button class="nav-btn" onclick="filterProducts('${cat}')">${cat}</button>`
    ).join('');
}

function filterProducts(category) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderProducts(category);
}

// ===== السلايدر =====
function renderSlider() {
    const slider = document.getElementById('slider');
    slider.innerHTML = sliders.map(img => `<img src="${img}" alt="عرض">`).join('');
}

function startSlider() {
    let index = 0;
    const slider = document.getElementById('slider');
    setInterval(() => {
        index = (index + 1) % sliders.length;
        slider.style.transform = `translateX(${index * -415}px)`;
    }, 4000);
}

// ===== المنتجات =====
function renderProducts(filter) {
    const grid = document.getElementById('productsGrid');
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    grid.innerHTML = filtered.map(product => {
        const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock';
        const stockText = product.stock > 10 ? `متوفر (${product.stock})` : product.stock > 0 ? `(${product.stock}) متبقي` : 'نفذ المخزون';
        const disabled = product.stock === 0 ? 'disabled' : '';
        
        return `
            <div class="product-card">
                <img src="${product.image}" class="product-img" alt="${product.name}">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-desc">${product.desc}</div>
                    <div class="stock-indicator ${stockStatus}">● ${stockText}</div>
                    <div class="product-price">${product.price.toLocaleString()} د.ع</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})" ${disabled}>
                        <i class="fas fa-cart-plus"></i> ${product.stock === 0 ? 'نفذ المخزون' : 'أضف إلى السلة'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== السلة =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        if (existing.quantity < product.stock) {
            existing.quantity++;
        } else {
            alert('الكمية المطلوبة غير متوفرة!');
            return;
        }
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    toggleCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!item) return;
    
    const newQty = item.quantity + change;
    if (newQty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    } else if (newQty <= product.stock) {
        item.quantity = newQty;
    } else {
        alert('الكمية المطلوبة غير متوفرة!');
        return;
    }
    
    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="text-align:center; padding:40px; color:#888;">السلة فارغة 🛒</div>';
    } else {
        cartItems.innerHTML = cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${product.name}</div>
                        <div class="cart-item-price">${(product.price * item.quantity).toLocaleString()} د.ع</div>
                        <div class="quantity-control">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="remove-item" onclick="removeFromCart(${item.id})">🗑️</div>
                </div>
            `;
        }).join('');
    }
    
    calculateTotal();
}

// ===== الخصم =====
function applyDiscount() {
    const code = document.getElementById('discountCode').value.trim();
    const discount = discountCodes.find(d => d.code === code && d.used < d.maxUses);
    
    if (!discount) {
        alert('كود الخصم غير صالح أو انتهت صلاحيته!');
        appliedDiscount = null;
        return;
    }
    
    appliedDiscount = discount;
    alert(`تم تطبيق خصم ${discount.percentage}% ✅`);
    calculateTotal();
}

function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);
    
    let discountAmount = 0;
    if (appliedDiscount) {
        discountAmount = Math.floor(subtotal * (appliedDiscount.percentage / 100));
    }
    
    const total = subtotal - discountAmount + deliveryFee;
    
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + ' د.ع';
    document.getElementById('discountAmount').textContent = discountAmount.toLocaleString() + ' د.ع';
    document.getElementById('deliveryFee').textContent = deliveryFee.toLocaleString() + ' د.ع';
    document.getElementById('totalPrice').textContent = total.toLocaleString() + ' د.ع';
}

// ===== إتمام الطلب =====
function showCheckout() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);
    
    let discountAmount = 0;
    if (appliedDiscount) {
        discountAmount = Math.floor(subtotal * (appliedDiscount.percentage / 100));
    }
    
    const total = subtotal - discountAmount + deliveryFee;
    
    const invoiceHTML = `
        <strong>🧾 ملخص الطلب:</strong><br>
        ${cart.map(item => {
            const p = products.find(pr => pr.id === item.id);
            return `• ${p.name} × ${item.quantity} = ${(p.price * item.quantity).toLocaleString()} د.ع`;
        }).join('<br>')}
        <br><br>
        المجموع: ${subtotal.toLocaleString()} د.ع<br>
        ${appliedDiscount ? `الخصم (${appliedDiscount.percentage}%): -${discountAmount.toLocaleString()} د.ع<br>` : ''}
        التوصيل: ${deliveryFee.toLocaleString()} د.ع<br>
        <strong>الإجمالي: ${total.toLocaleString()} د.ع</strong>
    `;
    
    document.getElementById('invoicePreview').innerHTML = invoiceHTML;
    document.getElementById('checkoutModal').classList.add('active');
    toggleCart();
}

function confirmOrder() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const region = document.getElementById('customerRegion').value.trim();
    
    if (!name || !phone || !address || !region) {
        alert('يرجى ملء جميع الحقول!');
        return;
    }
    
    const orderId = 'LION-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);
    
    let discountAmount = 0;
    if (appliedDiscount) {
        discountAmount = Math.floor(subtotal * (appliedDiscount.percentage / 100));
        appliedDiscount.used++;
        localStorage.setItem('discountCodes', JSON.stringify(discountCodes));
    }
    
    const total = subtotal - discountAmount + deliveryFee;
    
    // حفظ الطلب
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = {
        id: orderId,
        date: new Date().toLocaleString('ar-IQ'),
        name, phone, address, region,
        items: cart.map(item => {
            const p = products.find(pr => pr.id === item.id);
            return { name: p.name, quantity: item.quantity, price: p.price };
        }),
        subtotal, discount: discountAmount, delivery: deliveryFee, total
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // تحديث المخزون
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        product.stock -= item.quantity;
    });
    localStorage.setItem('products', JSON.stringify(products));
    
    // رسالة الواتساب
    const message = `🦁 *طلب جديد من متجر ليون!*
    
📋 *كود الطلب:* ${orderId}
👤 *الاسم:* ${name}
📱 *الهاتف:* ${phone}
📍 *العنوان:* ${address}
🌍 *المنطقة:* ${region}

🛒 *المنتجات:*
${cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    return `• ${p.name} × ${item.quantity} = ${(p.price * item.quantity).toLocaleString()} د.ع`;
}).join('\n')}

💰 *المجموع:* ${subtotal.toLocaleString()} د.ع
${appliedDiscount ? `🎟️ *الخصم:* -${discountAmount.toLocaleString()} د.ع\n` : ''}
🚚 *التوصيل:* ${deliveryFee.toLocaleString()} د.ع
💵 *الإجمالي:* ${total.toLocaleString()} د.ع

💳 *طريقة الدفع:* الدفع عند الاستلام ✅`;

    const whatsappUrl = `https://wa.me/9647708574713?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // تفريغ السلة
    cart = [];
    saveCart();
    appliedDiscount = null;
    document.getElementById('discountCode').value = '';
    updateCartUI();
    closeModal('checkoutModal');
    renderProducts('all');
    
    alert(`تم إرسال الطلب بنجاح! 🎉\nكود الطلب: ${orderId}`);
}

// ===== طلباتي =====
function showMyOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const list = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:30px; color:#888;">لا توجد طلبات سابقة 📭</div>';
    } else {
        list.innerHTML = orders.slice().reverse().map(order => `
            <div class="order-card">
                <div class="order-id">#${order.id}</div>
                <div class="order-date">${order.date}</div>
                <div class="order-items">
                    ${order.items.map(i => `• ${i.name} × ${i.quantity}`).join('<br>')}
                    <br><strong>الإجمالي: ${order.total.toLocaleString()} د.ع</strong>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('ordersModal').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ===== مزامنة مع لوحة الإدارة =====
window.addEventListener('storage', (e) => {
    if (e.key === 'products') {
        products = JSON.parse(e.newValue);
        renderProducts('all');
    }
    if (e.key === 'categories') {
        categories = JSON.parse(e.newValue);
        renderCategories();
    }
    if (e.key === 'sliders') {
        sliders = JSON.parse(e.newValue);
        renderSlider();
    }
    if (e.key === 'deliveryFee') {
        deliveryFee = parseInt(e.newValue) || 2000;
    }
    if (e.key === 'discountCodes') {
        discountCodes = JSON.parse(e.newValue) || [];
    }
});
