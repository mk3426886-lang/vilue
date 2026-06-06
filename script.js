// المنتجات المبدئية
const initialProducts = [
    { id: 1, name: "ماوس ذكي لاسلكي مريح", price: 1500, img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80", stock: 10 },
    { id: 2, name: "لوحة مفاتيح ميكانيكية مضيئة", price: 1500, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80", stock: 5 },
    { id: 3, name: "شاحن لاسلكي سريع ذكي", price: 1300, img: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&q=80", stock: 8 },
    { id: 4, name: "حامل ذكي للهاتف ومحول اتصالات", price: 1390, img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80", stock: 12 }
];

// رقم مدير المتجر المعتمد لإستلام الطلبات
const MANAGER_PHONE = "+9647708574713";

let products = JSON.parse(localStorage.getItem('lion_products')) || initialProducts;
let cart = [];
let activeCoupon = null;

let coupons = JSON.parse(localStorage.getItem('lion_coupons')) || {
    "LION10": { percent: 10, limit: 50, used: 0 }
};

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();
    populateAdminProductSelect();
});

function renderProducts() {
    const container = document.getElementById("productsContainer");
    if (!container) return;
    
    container.innerHTML = "";
    products.forEach(product => {
        const isOutOfStock = product.stock <= 0;
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-img">
            <h4>${product.name}</h4>
            <div class="product-price">${product.price.toLocaleString()} م.ي</div>
            <div class="product-stock">${isOutOfStock ? '<span style="color:red;">نفذت الكمية</span>' : `المتاح: ${product.stock} قطع`}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${isOutOfStock ? 'disabled' : ''}>
                ${isOutOfStock ? 'غير متوفر' : 'أضف إلى السلة 🛒'}
            </button>
        `;
        container.appendChild(card);
    });
    localStorage.setItem('lion_products', JSON.stringify(products));
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product || product.stock <= 0) return;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        if (cartItem.qty < product.stock) {
            cartItem.qty++;
        } else {
            alert("عذراً، هذا أقصى حد متوفر بالمتجر حالياً.");
            return;
        }
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cartItems");
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">السلة فارغة حالياً.</p>';
        document.getElementById("cartSubtotal").innerText = "0 م.ي";
        document.getElementById("cartTotal").innerText = "0 م.ي";
        document.getElementById("discountRow").style.display = "none";
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.qty;
        const itemRow = document.createElement("div");
        itemRow.className = "cart-item";
        itemRow.innerHTML = `
            <div><strong>${item.name}</strong><br><small>${item.price.toLocaleString()} م.ي × ${item.qty}</small></div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">❌</button>
        `;
        cartItemsContainer.appendChild(itemRow);
    });

    document.getElementById("cartSubtotal").innerText = `${subtotal.toLocaleString()} م.ي`;

    let discount = 0;
    if (activeCoupon) {
        discount = (subtotal * activeCoupon.percent) / 100;
        document.getElementById("discountRow").style.display = "flex";
        document.getElementById("cartDiscount").innerText = `-${discount.toLocaleString()} م.ي (${activeCoupon.code})`;
    } else {
        document.getElementById("discountRow").style.display = "none";
    }

    let total = subtotal - discount;
    document.getElementById("cartTotal").innerText = `${total.toLocaleString()} م.ي`;
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function applyCoupon() {
    const codeInput = document.getElementById("couponInput").value.trim().toUpperCase();
    if (!codeInput) return;

    if (coupons[codeInput]) {
        const coupon = coupons[codeInput];
        if (coupon.used < coupon.limit) {
            activeCoupon = { code: codeInput, percent: coupon.percent };
            alert(`تم تطبيق الخصم بنجاح! نسبة الخصم: ${coupon.percent}%`);
            updateCartUI();
        } else {
            alert("هذا الكود انتهت عدد مرات استخدامه المسموحة!");
        }
    } else {
        alert("كود الخصم غير صحيح أو منتهي الصلاحية!");
    }
}

function openCheckoutModal() {
    if (cart.length === 0) {
        alert("سلتك فارغة! أضف بعض المنتجات أولاً.");
        return;
    }
    document.getElementById("checkoutModal").classList.add("active");
}

function closeCheckoutModal() {
    document.getElementById("checkoutModal").classList.remove("active");
}

let currentOrderData = null;

function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("clientName").value.trim();
    const address = document.getElementById("clientAddress").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();

    const orderId = "LION-" + Math.floor(10000 + Math.random() * 90000);

    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let discount = activeCoupon ? (subtotal * activeCoupon.percent) / 100 : 0;
    let total = subtotal - discount;

    currentOrderData = {
        orderId: orderId, name: name, address: address, phone: phone,
        items: [...cart], subtotal: subtotal, discount: discount, total: total,
        couponCode: activeCoupon ? activeCoupon.code : null
    };

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) { product.stock -= cartItem.qty; }
    });

    if (activeCoupon && coupons[activeCoupon.code]) {
        coupons[activeCoupon.code].used++;
        localStorage.setItem('lion_coupons', JSON.stringify(coupons));
    }

    document.getElementById("orderIdDisplay").innerText = `#${orderId}`;
    
    let detailsHTML = "";
    currentOrderData.items.forEach(item => {
        detailsHTML += `
            <div class="receipt-item-line">
                <span>${item.name} (×${item.qty})</span>
                <span>${(item.price * item.qty).toLocaleString()} م.ي</span>
            </div>
        `;
    });
    detailsHTML += `<hr>`;
    if (discount > 0) {
        detailsHTML += `<div class="receipt-item-line" style="color: green;"><span>خصم الكود:</span><span>-${discount.toLocaleString()} م.ي</span></div>`;
    }
    detailsHTML += `<div class="receipt-item-line" style="font-weight:bold;"><span>المجموع النهائي:</span><span>${total.toLocaleString()} م.ي</span></div>`;
    detailsHTML += `<hr>`;
    detailsHTML += `<div style="font-size:0.8rem; color:#555;"><strong>اسم العميل:</strong> ${name}<br><strong>العنوان:</strong> ${address}<br><strong>الهاتف:</strong> ${phone}</div>`;

    document.getElementById("receiptDetails").innerHTML = detailsHTML;

    closeCheckoutModal();
    document.getElementById("receiptModal").classList.add("active");

    renderProducts();
    cart = [];
    activeCoupon = null;
    updateCartUI();
}

function sendToWhatsApp() {
    if (!currentOrderData) return;

    let message = `*📦 طلب جديد من متجر ليون | STORE 📦*\n\n`;
    message += `*🆔 كود الطلب:* \`${currentOrderData.orderId}\`\n`;
    message += `------------------------------------\n`;
    message += `*👤 تفاصيل العميل:*\n`;
    message += `• *الاسم:* ${currentOrderData.name}\n`;
    message += `• *العنوان:* ${currentOrderData.address}\n`;
    message += `• *الهاتف:* ${currentOrderData.phone}\n\n`;
    message += `*🛒 المنتجات المطلوبة:*\n`;
    
    currentOrderData.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (عدد: ${item.qty}) -> ${(item.price * item.qty).toLocaleString()} م.ي\n`;
    });
    
    message += `\n------------------------------------\n`;
    message += `*💰 الحساب الفردي:* ${currentOrderData.subtotal.toLocaleString()} م.ي\n`;
    if (currentOrderData.discount > 0) {
        message += `*🏷️ كود الخصم المستخدم:* ${currentOrderData.couponCode} (خصم -${currentOrderData.discount.toLocaleString()} م.ي)\n`;
    }
    message += `*🔥 الإجمالي النهائي المطلوب:* *${currentOrderData.total.toLocaleString()} م.ي*\n\n`;
    message += `📥 _يرجى مراجعة وتأكيد الطلب وشحنه للعميل._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${MANAGER_PHONE}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    document.getElementById("receiptModal").classList.remove("active");
    currentOrderData = null;
}

// لوحة تحكم المدير المشتركة
function populateAdminProductSelect() {
    const select = document.getElementById("productSelectAdmin");
    if (!select) return;
    select.innerHTML = "";
    products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.innerText = p.name;
        select.appendChild(opt);
    });
}

function addNewCoupon() {
    const code = document.getElementById("newCouponCode").value.trim().toUpperCase();
    const percent = parseInt(document.getElementById("newCouponPercent").value);
    const limit = parseInt(document.getElementById("newCouponLimit").value);

    if (!code || isNaN(percent) || isNaN(limit)) {
        alert("يرجى ملء جميع الحقول بشكل صحيح!");
        return;
    }

    coupons[code] = { percent: percent, limit: limit, used: 0 };
    localStorage.setItem('lion_coupons', JSON.stringify(coupons));
    alert(`تمت إضافة وتفعيل الكود [ ${code} ] بنجاح!`);
    
    document.getElementById("newCouponCode").value = "";
    document.getElementById("newCouponPercent").value = "";
    document.getElementById("newCouponLimit").value = "";
}

function addProductStock() {
    const productId = parseInt(document.getElementById("productSelectAdmin").value);
    const addedQty = parseInt(document.getElementById("newProductQty").value);

    if (isNaN(addedQty) || addedQty <= 0) {
        alert("يرجى كتابة كمية صحيحة.");
        return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
        product.stock += addedQty;
        renderProducts();
        alert(`تم تحديث المخزن! الكمية الحالية لـ (${product.name}) هي: ${product.stock}`);
        document.getElementById("newProductQty").value = "";
    }
}
