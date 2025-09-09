// Spice Route Catering - Comprehensive Catering Reservation and Ordering System
// Main Application Logic with Firebase Integration

// Global state management
let currentUser = null;
let currentRole = null;
let currentCart = [];
let allProducts = [];
let allOrders = [];
let allCustomers = [];

// Simulated Firebase data (in real implementation, this would be Firestore)
let systemData = {
    users: [
        {
            id: 'admin1',
            email: 'admin@catering.com',
            password: 'password',
            role: 'admin',
            name: 'Admin User',
            createdAt: '2025-01-01T00:00:00Z'
        },
        {
            id: 'customer1',
            email: 'customer@demo.com',
            password: 'password',
            role: 'customer',
            name: 'Demo Customer',
            phone: '+91-9876543210',
            address: '123 Demo Street, Mumbai, Maharashtra',
            createdAt: '2025-01-15T00:00:00Z'
        }
    ],
    products: [
        {
            id: 'prod1',
            name: 'Royal Chicken Biryani',
            description: 'Aromatic basmati rice with tender chicken pieces, cooked with traditional spices',
            price: 299,
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d999?w=400',
            category: 'Traditional Indian',
            inStock: true,
            createdAt: '2025-01-01T00:00:00Z'
        },
        {
            id: 'prod2',
            name: 'Paneer Butter Masala',
            description: 'Creamy tomato-based curry with soft paneer cubes, served with rice',
            price: 249,
            image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
            category: 'Traditional Indian',
            inStock: true,
            createdAt: '2025-01-01T00:00:00Z'
        },
        {
            id: 'prod3',
            name: 'Dal Makhani with Rice',
            description: 'Rich and creamy black lentil curry with basmati rice',
            price: 199,
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
            category: 'Traditional Indian',
            inStock: true,
            createdAt: '2025-01-01T00:00:00Z'
        },
        {
            id: 'prod4',
            name: 'Tandoor Roti (Set of 4)',
            description: 'Fresh, warm wheat breads baked in traditional tandoor',
            price: 80,
            image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400',
            category: 'Traditional Indian',
            inStock: true,
            createdAt: '2025-01-01T00:00:00Z'
        },
        {
            id: 'prod5',
            name: 'Gulab Jamun (Per piece)',
            description: 'Soft, spongy milk dumplings soaked in rose-flavored syrup',
            price: 25,
            image: 'https://images.unsplash.com/photo-1571167963185-c4e9d8d93300?w=400',
            category: 'Desserts',
            inStock: true,
            createdAt: '2025-01-01T00:00:00Z'
        },
        {
            id: 'prod6',
            name: 'Masala Chai',
            description: 'Traditional Indian spiced tea with milk and aromatic spices',
            price: 30,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            category: 'Beverages',
            inStock: true,
            createdAt: '2025-01-01T00:00:00Z'
        },
        {
            id: 'prod7',
            name: 'Fresh Fruit Lassi',
            description: 'Refreshing yogurt-based drink blended with seasonal fruits',
            price: 45,
            image: 'https://images.unsplash.com/photo-1553787666-6c3e9ca88b57?w=400',
            category: 'Beverages',
            inStock: true,
            createdAt: '2025-01-01T00:00:00Z'
        },
        {
            id: 'prod8',
            name: 'Mixed Vegetable Curry',
            description: 'Seasonal vegetables cooked in aromatic spices with rice',
            price: 179,
            image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
            category: 'Traditional Indian',
            inStock: true,
            createdAt: '2025-01-01T00:00:00Z'
        }
    ],
    orders: [
        {
            id: 'order1',
            userId: 'customer1',
            items: [
                { productId: 'prod1', quantity: 2, price: 299, name: 'Royal Chicken Biryani' },
                { productId: 'prod5', quantity: 4, price: 25, name: 'Gulab Jamun (Per piece)' }
            ],
            total: 698,
            status: 'confirmed',
            deliveryAddress: '123 Demo Street, Mumbai',
            deliveryDate: '2025-08-16',
            deliveryTime: '2:00 PM',
            guestCount: 10,
            specialRequirements: 'Medium spice level',
            orderDate: '2025-08-15T15:30:00Z'
        }
    ],
    cart: []
};

// Utility functions
function logAction(action, details = '') {
    const timestamp = new Date().toISOString();
    const user = currentUser ? `${currentUser.name} (${currentUser.role})` : 'Anonymous';
    const logEntry = `[${timestamp}] ${user}: ${action}${details ? ' - ' + details : ''}`;
    console.log(logEntry);
    
    // In a real application, send this to a logging service
    // await logToFirestore(logEntry);
}

function showToast(message, type = 'info', title = '') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
    
    logAction('Toast notification', `${type}: ${message}`);
}

function showLoading() {
    document.getElementById('loadingIndicator').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingIndicator').classList.add('hidden');
}

function generateId(prefix = '') {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Page navigation functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    logAction('Page navigation', `Switched to ${pageId}`);
}

function showLanding() {
    showPage('landingPage');
    currentUser = null;
    currentRole = null;
    loadFeaturedProducts();
}

function showLogin(role) {
    currentRole = role;
    showPage('loginPage');
    document.getElementById('loginTitle').textContent = role === 'admin' ? 'Admin Login' : 'Customer Login';
    
    // Clear form
    document.getElementById('loginForm').reset();
    
    logAction('Login page accessed', `Role: ${role}`);
}

function showRegister() {
    showPage('registerPage');
    document.getElementById('registerForm').reset();
    logAction('Registration page accessed');
}

// Featured products for landing page
function loadFeaturedProducts() {
    const featuredProducts = systemData.products.slice(0, 4);
    const grid = document.getElementById('featuredGrid');
    
    grid.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <div class="product-header">
                    <h4 class="product-name">${product.name}</h4>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                </div>
                <div class="product-category">${product.category}</div>
                <p class="product-description">${product.description}</p>
            </div>
        </div>
    `).join('');
    
    logAction('Featured products loaded', `Count: ${featuredProducts.length}`);
}

// Authentication functions
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading();
    
    // Simulate API delay
    setTimeout(() => {
        const user = systemData.users.find(u => 
            u.email === email && 
            u.password === password && 
            u.role === currentRole
        );
        
        hideLoading();
        
        if (user) {
            currentUser = user;
            logAction('Login successful', `User: ${user.email}, Role: ${user.role}`);
            showToast('Welcome back!', 'success', 'Login Successful');
            
            // Navigate to appropriate dashboard
            if (user.role === 'admin') {
                showPage('adminDashboard');
                document.getElementById('adminUserName').textContent = user.name;
                loadAdminData();
            } else {
                showPage('customerDashboard');
                document.getElementById('customerUserName').textContent = user.name;
                loadCustomerData();
                loadCart();
            }
        } else {
            logAction('Login failed', `Email: ${email}, Role: ${currentRole}`);
            showToast('Invalid credentials. Please check your email and password.', 'error', 'Login Failed');
        }
    }, 1000);
});

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        address: document.getElementById('regAddress').value,
        password: document.getElementById('regPassword').value
    };
    
    showLoading();
    
    setTimeout(() => {
        // Check if email already exists
        const existingUser = systemData.users.find(u => u.email === formData.email);
        
        hideLoading();
        
        if (existingUser) {
            showToast('An account with this email already exists.', 'error', 'Registration Failed');
            return;
        }
        
        // Create new customer user
        const newUser = {
            id: generateId('customer_'),
            ...formData,
            role: 'customer',
            createdAt: new Date().toISOString()
        };
        
        systemData.users.push(newUser);
        
        logAction('Customer registration', `New user: ${formData.name} (${formData.email})`);
        showToast('Account created successfully! You can now login.', 'success', 'Registration Complete');
        showLogin('customer');
    }, 1000);
});

function logout() {
    logAction('Logout', `User: ${currentUser?.email || 'Unknown'}`);
    currentUser = null;
    currentRole = null;
    currentCart = [];
    updateCartUI();
    showLanding();
    showToast('You have been logged out successfully.', 'info', 'Logged Out');
}

// Tab management - Fixed version
function showCustomerTab(tabName) {
    // Hide all tab contents first
    const allTabContents = document.querySelectorAll('#customerDashboard .tab-content');
    allTabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const allTabBtns = document.querySelectorAll('#customerDashboard .tab-btn');
    allTabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = event ? event.target : document.querySelector(`[onclick="showCustomerTab('${tabName}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Load appropriate content based on tab
    switch (tabName) {
        case 'browse':
            loadProducts();
            break;
        case 'cart':
            displayCart();
            break;
        case 'orders':
            loadCustomerOrders();
            break;
        case 'profile':
            loadProfile();
            break;
    }
    
    logAction('Customer tab switched', `Tab: ${tabName}`);
}

function showAdminTab(tabName) {
    // Hide all tab contents first
    const allTabContents = document.querySelectorAll('#adminDashboard .tab-content');
    allTabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const allTabBtns = document.querySelectorAll('#adminDashboard .tab-btn');
    allTabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = event ? event.target : document.querySelector(`[onclick="showAdminTab('${tabName}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    switch (tabName) {
        case 'products':
            loadAdminProducts();
            break;
        case 'orders':
            loadAdminOrders();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'reports':
            loadReports();
            break;
    }
    
    logAction('Admin tab switched', `Tab: ${tabName}`);
}

// Customer functions
function loadCustomerData() {
    loadProducts();
    loadCustomerOrders();
    updateCartUI();
}

function loadProducts() {
    allProducts = [...systemData.products];
    displayProducts(allProducts);
    logAction('Products loaded for browsing', `Count: ${allProducts.length}`);
}

function displayProducts(products) {
    const grid = document.getElementById('menuGrid');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🍽️</div>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or check back later.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <div class="product-header">
                    <h4 class="product-name">${product.name}</h4>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                </div>
                <div class="product-category">${product.category}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${product.id}', -1)">-</button>
                        <input type="number" class="quantity-input" id="qty_${product.id}" value="1" min="1" max="50">
                        <button class="quantity-btn" onclick="updateQuantity('${product.id}', 1)">+</button>
                    </div>
                    <button class="btn btn--primary" onclick="addToCart('${product.id}')" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    let filteredProducts = [...allProducts];
    
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    displayProducts(filteredProducts);
    logAction('Products filtered', `Category: ${categoryFilter || 'All'}, Results: ${filteredProducts.length}`);
}

function updateQuantity(productId, change) {
    const input = document.getElementById(`qty_${productId}`);
    const currentValue = parseInt(input.value);
    const newValue = Math.max(1, Math.min(50, currentValue + change));
    input.value = newValue;
}

function addToCart(productId) {
    const product = systemData.products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty_${productId}`).value);
    
    if (!product || !product.inStock) {
        showToast('Product is currently out of stock.', 'error');
        return;
    }
    
    // Check if product already in cart
    const existingItem = currentCart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * existingItem.price;
    } else {
        currentCart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            total: product.price * quantity,
            image: product.image
        });
    }
    
    updateCartUI();
    logAction('Product added to cart', `Product: ${product.name}, Quantity: ${quantity}`);
    showToast(`${product.name} added to cart!`, 'success');
    
    // Reset quantity input
    document.getElementById(`qty_${productId}`).value = 1;
}

function updateCartUI() {
    const cartCount = currentCart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

// Renamed to avoid conflicts
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (currentCart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛒</div>
                <h3>Your Cart is Empty</h3>
                <p>Add some delicious items to get started!</p>
                <button class="btn btn--primary" onclick="showCustomerTab('browse')">Browse Menu</button>
            </div>
        `;
        cartSummary.innerHTML = '';
        return;
    }
    
    cartItems.innerHTML = currentCart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatCurrency(item.price)} each</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', 1)">+</button>
            </div>
            <div class="cart-item-price">${formatCurrency(item.total)}</div>
            <button class="remove-btn" onclick="removeFromCart('${item.productId}')">Remove</button>
        </div>
    `).join('');
    
    const subtotal = currentCart.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + tax;
    
    cartSummary.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-row">
            <span>Subtotal</span>
            <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>GST (18%)</span>
            <span>${formatCurrency(tax)}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>${formatCurrency(total)}</span>
        </div>
        <button class="btn btn--primary btn--full-width" onclick="proceedToCheckout()" style="margin-top: 16px;">
            Proceed to Checkout
        </button>
    `;
    
    logAction('Cart viewed', `Items: ${currentCart.length}, Total: ₹${total}`);
}

// Alternative cart access function
function showCart() {
    showCustomerTab('cart');
}

function updateCartQuantity(productId, change) {
    const item = currentCart.find(i => i.productId === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        item.total = item.quantity * item.price;
        updateCartUI();
        displayCart();
        logAction('Cart quantity updated', `Product: ${item.name}, New quantity: ${item.quantity}`);
    }
}

function removeFromCart(productId) {
    const itemIndex = currentCart.findIndex(i => i.productId === productId);
    if (itemIndex > -1) {
        const item = currentCart[itemIndex];
        currentCart.splice(itemIndex, 1);
        updateCartUI();
        displayCart();
        logAction('Item removed from cart', `Product: ${item.name}`);
        showToast('Item removed from cart', 'info');
    }
}

function clearCart() {
    if (currentCart.length > 0 && confirm('Are you sure you want to clear your cart?')) {
        currentCart = [];
        updateCartUI();
        displayCart();
        logAction('Cart cleared', 'All items removed');
        showToast('Cart cleared successfully', 'info');
    }
}

function loadCart() {
    // In a real implementation, load cart from Firestore
    const savedCart = systemData.cart.filter(item => item.userId === currentUser.id);
    if (savedCart.length > 0) {
        currentCart = savedCart[0].items || [];
        updateCartUI();
    }
}

function proceedToCheckout() {
    if (currentCart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    // Pre-fill delivery address
    document.getElementById('deliveryAddress').value = currentUser.address || '';
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('deliveryDate').min = tomorrow.toISOString().split('T')[0];
    
    // Show order summary in modal
    const subtotal = currentCart.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    
    document.getElementById('orderSummary').innerHTML = `
        <h4>Order Summary</h4>
        ${currentCart.map(item => `
            <div class="summary-row">
                <span>${item.name} × ${item.quantity}</span>
                <span>${formatCurrency(item.total)}</span>
            </div>
        `).join('')}
        <div class="summary-row">
            <span>GST (18%)</span>
            <span>${formatCurrency(tax)}</span>
        </div>
        <div class="summary-row total">
            <span>Total Amount</span>
            <span>${formatCurrency(total)}</span>
        </div>
    `;
    
    showModal('checkoutModal');
    logAction('Checkout initiated', `Total: ₹${total}`);
}

function loadCustomerOrders() {
    const orders = systemData.orders.filter(order => order.userId === currentUser.id);
    const grid = document.getElementById('customerOrdersGrid');
    
    if (orders.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Your order history will appear here.</p>
                <button class="btn btn--primary" onclick="showCustomerTab('browse')">Start Shopping</button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <h4>Order #${order.id.slice(-8).toUpperCase()}</h4>
                    <div class="order-date">${formatDate(order.orderDate)}</div>
                </div>
                <div class="order-status">
                    <span class="status-badge ${order.status}">${order.status.replace('_', ' ')}</span>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: ${formatCurrency(order.total)}</div>
            <div class="order-actions">
                ${order.status === 'delivered' ? `
                    <button class="btn btn--outline btn--sm" onclick="reorderItems('${order.id}')">Reorder</button>
                ` : ''}
                ${order.status === 'pending' || order.status === 'confirmed' ? `
                    <button class="btn btn--outline btn--sm" onclick="cancelOrder('${order.id}')">Cancel</button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    logAction('Customer orders loaded', `Count: ${orders.length}`);
}

function loadProfile() {
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profilePhone').value = currentUser.phone || '';
    document.getElementById('profileAddress').value = currentUser.address || '';
}

// Admin functions
function loadAdminData() {
    loadAdminProducts();
    loadAdminOrders();
    loadCustomers();
    loadReports();
}

function loadAdminProducts() {
    const grid = document.getElementById('adminProductsGrid');
    
    grid.innerHTML = systemData.products.map(product => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <div class="product-header">
                    <h4 class="product-name">${product.name}</h4>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                </div>
                <div class="product-category">${product.category}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="action-btn edit" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="action-btn delete" onclick="deleteProduct('${product.id}')">Delete</button>
                    <button class="action-btn ${product.inStock ? 'edit' : 'confirm'}" onclick="toggleStock('${product.id}')">
                        ${product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    logAction('Admin products loaded', `Count: ${systemData.products.length}`);
}

function loadAdminOrders() {
    const grid = document.getElementById('adminOrdersGrid');
    
    if (systemData.orders.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Customer orders will appear here.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = systemData.orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).map(order => {
        const customer = systemData.users.find(u => u.id === order.userId);
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Order #${order.id.slice(-8).toUpperCase()}</h4>
                        <div class="order-date">${formatDate(order.orderDate)}</div>
                        <div style="font-size: 14px; color: var(--color-text-secondary);">
                            Customer: ${customer?.name || 'Unknown'}<br>
                            Phone: ${customer?.phone || 'N/A'}<br>
                            Delivery: ${order.deliveryDate} at ${order.deliveryTime}<br>
                            ${order.guestCount ? `Guests: ${order.guestCount}` : ''}
                        </div>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${order.status}">${order.status.replace('_', ' ')}</span>
                        <div class="order-actions">
                            ${getOrderStatusActions(order)}
                        </div>
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>${formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">Total: ${formatCurrency(order.total)}</div>
                <div style="margin-top: 12px; font-size: 14px; color: var(--color-text-secondary);">
                    <strong>Address:</strong> ${order.deliveryAddress}<br>
                    ${order.specialRequirements ? `<strong>Special Requirements:</strong> ${order.specialRequirements}` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    logAction('Admin orders loaded', `Count: ${systemData.orders.length}`);
}

function getOrderStatusActions(order) {
    switch (order.status) {
        case 'pending':
            return `
                <button class="action-btn confirm" onclick="updateOrderStatus('${order.id}', 'confirmed')">Confirm</button>
                <button class="action-btn delete" onclick="updateOrderStatus('${order.id}', 'cancelled')">Cancel</button>
            `;
        case 'confirmed':
            return `
                <button class="action-btn preparing" onclick="updateOrderStatus('${order.id}', 'preparing')">Start Preparing</button>
            `;
        case 'preparing':
            return `
                <button class="action-btn ready" onclick="updateOrderStatus('${order.id}', 'ready_for_delivery')">Ready</button>
            `;
        case 'ready_for_delivery':
            return `
                <button class="action-btn deliver" onclick="updateOrderStatus('${order.id}', 'delivered')">Mark Delivered</button>
            `;
        default:
            return '';
    }
}

function loadCustomers() {
    const customers = systemData.users.filter(u => u.role === 'customer');
    const grid = document.getElementById('customersGrid');
    
    grid.innerHTML = customers.map(customer => {
        const orderCount = systemData.orders.filter(o => o.userId === customer.id).length;
        const totalSpent = systemData.orders
            .filter(o => o.userId === customer.id && o.status === 'delivered')
            .reduce((sum, o) => sum + o.total, 0);
        
        return `
            <div class="data-item">
                <div class="data-item-header">
                    <h4 class="data-item-title">${customer.name}</h4>
                    <div class="data-item-actions">
                        <span class="status-badge info">${orderCount} Orders</span>
                    </div>
                </div>
                <div class="data-item-content">
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Phone:</strong> ${customer.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> ${customer.address || 'N/A'}</p>
                    <p><strong>Total Spent:</strong> ${formatCurrency(totalSpent)}</p>
                    <p><strong>Member Since:</strong> ${formatDate(customer.createdAt)}</p>
                </div>
            </div>
        `;
    }).join('');
    
    logAction('Customers loaded', `Count: ${customers.length}`);
}

function loadReports() {
    const totalOrders = systemData.orders.length;
    const totalRevenue = systemData.orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.total, 0);
    const totalCustomers = systemData.users.filter(u => u.role === 'customer').length;
    const totalProducts = systemData.products.length;
    const pendingOrders = systemData.orders.filter(o => o.status === 'pending').length;
    const preparingOrders = systemData.orders.filter(o => o.status === 'preparing').length;
    
    document.getElementById('statsContent').innerHTML = `
        <div class="stat-item">
            <span class="stat-number">${totalOrders}</span>
            <div class="stat-label">Total Orders</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${formatCurrency(totalRevenue).replace('₹', '')}</span>
            <div class="stat-label">Revenue (₹)</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${totalCustomers}</span>
            <div class="stat-label">Customers</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${totalProducts}</span>
            <div class="stat-label">Products</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${pendingOrders}</span>
            <div class="stat-label">Pending Orders</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${preparingOrders}</span>
            <div class="stat-label">Preparing</div>
        </div>
    `;
    
    logAction('Reports loaded', 'Business statistics updated');
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    logAction('Modal opened', modalId);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    
    // Clear form if exists
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
    
    logAction('Modal closed', modalId);
}

function showAddProductModal() {
    showModal('addProductModal');
}

// Form submissions
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: generateId('prod_'),
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseInt(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value,
        inStock: true,
        createdAt: new Date().toISOString()
    };
    
    systemData.products.push(formData);
    loadAdminProducts();
    closeModal('addProductModal');
    
    logAction('Product added', `Name: ${formData.name}, Price: ₹${formData.price}, Category: ${formData.category}`);
    showToast('Product added successfully!', 'success', 'Product Added');
});

document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const subtotal = currentCart.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    
    const orderData = {
        id: generateId('order_'),
        userId: currentUser.id,
        items: [...currentCart],
        total: total,
        status: 'pending',
        deliveryAddress: document.getElementById('deliveryAddress').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        deliveryTime: document.getElementById('deliveryTime').value,
        guestCount: document.getElementById('guestCount').value || null,
        specialRequirements: document.getElementById('specialRequirements').value || null,
        orderDate: new Date().toISOString()
    };
    
    systemData.orders.push(orderData);
    
    // Clear cart after successful order
    currentCart = [];
    updateCartUI();
    
    closeModal('checkoutModal');
    showCustomerTab('orders');
    
    logAction('Order placed', `Order ID: ${orderData.id}, Total: ₹${total}, Items: ${orderData.items.length}`);
    showToast('Order placed successfully! You will receive a confirmation shortly.', 'success', 'Order Confirmed');
});

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const updatedData = {
        name: document.getElementById('profileName').value,
        phone: document.getElementById('profilePhone').value,
        address: document.getElementById('profileAddress').value
    };
    
    // Update user data
    Object.assign(currentUser, updatedData);
    
    // Update in system data
    const userIndex = systemData.users.findIndex(u => u.id === currentUser.id);
    if (userIndex > -1) {
        Object.assign(systemData.users[userIndex], updatedData);
    }
    
    // Update display name
    document.getElementById('customerUserName').textContent = currentUser.name;
    
    logAction('Profile updated', `Name: ${updatedData.name}, Phone: ${updatedData.phone}`);
    showToast('Profile updated successfully!', 'success', 'Profile Updated');
});

// Action functions
function updateOrderStatus(orderId, newStatus) {
    const order = systemData.orders.find(o => o.id === orderId);
    if (order) {
        const oldStatus = order.status;
        order.status = newStatus;
        
        if (newStatus === 'delivered') {
            order.deliveredAt = new Date().toISOString();
        }
        
        loadAdminOrders();
        
        const customer = systemData.users.find(u => u.id === order.userId);
        logAction('Order status updated', `Order: ${orderId}, Status: ${oldStatus} → ${newStatus}, Customer: ${customer?.name}`);
        showToast(`Order status updated to ${newStatus.replace('_', ' ')}`, 'success', 'Status Updated');
    }
}

function editProduct(productId) {
    const product = systemData.products.find(p => p.id === productId);
    if (product) {
        // Pre-fill form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image;
        
        showModal('addProductModal');
        
        // Change form behavior to update instead of create
        const form = document.getElementById('addProductForm');
        form.dataset.editId = productId;
        
        logAction('Product edit initiated', `Name: ${product.name}`);
    }
}

function deleteProduct(productId) {
    const product = systemData.products.find(p => p.id === productId);
    if (product && confirm(`Delete product "${product.name}"?`)) {
        systemData.products = systemData.products.filter(p => p.id !== productId);
        loadAdminProducts();
        
        logAction('Product deleted', `Name: ${product.name}, ID: ${productId}`);
        showToast('Product deleted successfully', 'info', 'Product Deleted');
    }
}

function toggleStock(productId) {
    const product = systemData.products.find(p => p.id === productId);
    if (product) {
        product.inStock = !product.inStock;
        loadAdminProducts();
        
        logAction('Product stock toggled', `Name: ${product.name}, In Stock: ${product.inStock}`);
        showToast(`${product.name} is now ${product.inStock ? 'in stock' : 'out of stock'}`, 'info', 'Stock Updated');
    }
}

function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        updateOrderStatus(orderId, 'cancelled');
    }
}

function reorderItems(orderId) {
    const order = systemData.orders.find(o => o.id === orderId);
    if (order) {
        // Add all items from the order to cart
        order.items.forEach(item => {
            const existingItem = currentCart.find(cartItem => cartItem.productId === item.productId);
            
            if (existingItem) {
                existingItem.quantity += item.quantity;
                existingItem.total = existingItem.quantity * existingItem.price;
            } else {
                currentCart.push({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                    image: systemData.products.find(p => p.id === item.productId)?.image || ''
                });
            }
        });
        
        updateCartUI();
        showCustomerTab('cart');
        
        logAction('Order reordered', `Original order: ${orderId}, Items added: ${order.items.length}`);
        showToast('Items added to cart from previous order!', 'success', 'Reorder Complete');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    logAction('Application initialized', 'Spice Route Catering System loaded successfully');
    showToast('Welcome to Spice Route Catering!', 'info', 'Welcome');
    
    // Load featured products on landing page
    loadFeaturedProducts();
    
    // Set up click handlers for modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Set up keyboard handlers
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
    
    console.log('=== DEMO CREDENTIALS ===');
    console.log('Customer: customer@demo.com / password');
    console.log('Admin: admin@catering.com / password');
    console.log('========================');
    
    logAction('Demo credentials logged', 'Customer and Admin login details available in console');
});

// Additional utility functions for enhanced functionality
function searchProducts(query) {
    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displayProducts(filteredProducts);
    logAction('Product search', `Query: "${query}", Results: ${filteredProducts.length}`);
}

function sortProducts(criteria) {
    let sortedProducts = [...allProducts];
    
    switch (criteria) {
        case 'price_low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'category':
            sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
            break;
        default:
            break;
    }
    
    displayProducts(sortedProducts);
    logAction('Products sorted', `Criteria: ${criteria}`);
}

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        logAction,
        formatCurrency,
        generateId,
        systemData
    };
}