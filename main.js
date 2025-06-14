// CronoShop.eu - Main JavaScript
// iOS Style E-commerce Platform

// Global State
let products = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('cronoshop_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('cronoshop_wishlist')) || [];
let currentCategory = 'all';
let currentSort = 'default';

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: "iPhone 15 Pro Max 256GB",
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 1199.99,
        originalPrice: 1399.99,
        category: "smartphone",
        rating: 4.8,
        reviews: 2847,
        discount: 14,
        badges: ["new", "discount"],
        amazonLink: "https://amzn.to/3example1",
        description: "Il nuovo iPhone 15 Pro Max con chip A17 Pro e fotocamera da 48MP"
    },
    {
        id: 2,
        name: "MacBook Air M2 13\"",
        image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 1099.99,
        originalPrice: 1299.99,
        category: "tech",
        rating: 4.9,
        reviews: 1523,
        discount: 15,
        badges: ["discount"],
        amazonLink: "https://amzn.to/3example2",
        description: "MacBook Air con chip M2, display Liquid Retina da 13.6\""
    },
    {
        id: 3,
        name: "AirPods Pro 2ª Gen",
        image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 199.99,
        originalPrice: 279.99,
        category: "tech",
        rating: 4.7,
        reviews: 8934,
        discount: 29,
        badges: ["flash", "discount"],
        amazonLink: "https://amzn.to/3example3",
        description: "AirPods Pro con cancellazione attiva del rumore"
    },
    {
        id: 4,
        name: "Nike Air Max 270",
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 89.99,
        originalPrice: 149.99,
        category: "fashion",
        rating: 4.5,
        reviews: 3421,
        discount: 40,
        badges: ["discount"],
        amazonLink: "https://amzn.to/3example4",
        description: "Sneakers Nike Air Max 270 - Comfort e stile"
    },
    {
        id: 5,
        name: "Samsung Galaxy S24 Ultra",
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 999.99,
        originalPrice: 1199.99,
        category: "smartphone",
        rating: 4.6,
        reviews: 2156,
        discount: 17,
        badges: ["new", "discount"],
        amazonLink: "https://amzn.to/3example5",
        description: "Samsung Galaxy S24 Ultra con S Pen integrata"
    },
    {
        id: 6,
        name: "Dyson V15 Detect",
        image: "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 449.99,
        originalPrice: 599.99,
        category: "casa",
        rating: 4.8,
        reviews: 1876,
        discount: 25,
        badges: ["discount"],
        amazonLink: "https://amzn.to/3example6",
        description: "Aspirapolvere senza filo Dyson V15 Detect"
    },
    {
        id: 7,
        name: "Levi's 501 Original Jeans",
        image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 59.99,
        originalPrice: 89.99,
        category: "fashion",
        rating: 4.4,
        reviews: 5632,
        discount: 33,
        badges: ["discount"],
        amazonLink: "https://amzn.to/3example7",
        description: "Jeans Levi's 501 Original - Taglio classico"
    },
    {
        id: 8,
        name: "iPad Pro 12.9\" M2",
        image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 899.99,
        originalPrice: 1099.99,
        category: "tech",
        rating: 4.9,
        reviews: 987,
        discount: 18,
        badges: ["new", "discount"],
        amazonLink: "https://amzn.to/3example8",
        description: "iPad Pro 12.9\" con chip M2 e display Liquid Retina XDR"
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    products = [...sampleProducts];
    filteredProducts = [...products];
    
    renderProducts();
    updateCartCount();
    updateWishlistCount();
    
    // Add affiliate tag to all Amazon links
    addAffiliateTag();
});

// Add Amazon Affiliate Tag
function addAffiliateTag() {
    const affiliateTag = 'tony6401-21';
    
    products.forEach(product => {
        if (product.amazonLink && !product.amazonLink.includes('tag=')) {
            const separator = product.amazonLink.includes('?') ? '&' : '?';
            product.amazonLink += `${separator}tag=${affiliateTag}`;
        }
    });
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin-bottom: 16px; opacity: 0.5;">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                </svg>
                <p style="color: var(--text-secondary);">Nessun prodotto trovato</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                
                <div class="product-badges">
                    ${product.badges.map(badge => `
                        <span class="badge ${badge}">
                            ${badge === 'new' ? 'Nuovo' : badge === 'discount' ? `-${product.discount}%` : 'Offerta'}
                        </span>
                    `).join('')}
                </div>
                
                <div class="product-actions">
                    <button class="action-btn wishlist-btn-card ${isInWishlist(product.id) ? 'active' : ''}" 
                            onclick="toggleWishlistItem(${product.id})" title="Aggiungi alla wishlist">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="${isInWishlist(product.id) ? 'currentColor' : 'none'}">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="action-btn cart-btn-card" onclick="addToCart(${product.id})" title="Aggiungi al carrello">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8v6a2 2 0 002 2h8a2 2 0 002-2v-6" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviews})</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">€${product.price}</span>
                    ${product.originalPrice ? `
                        <span class="original-price">€${product.originalPrice}</span>
                        <span class="discount-percent">-${product.discount}%</span>
                    ` : ''}
                </div>
                
                <button class="buy-btn" onclick="buyProduct('${product.amazonLink}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8v6a2 2 0 002 2h8a2 2 0 002-2v-6" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Acquista su Amazon
                </button>
            </div>
        </div>
    `).join('');
}

// Generate Star Rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<svg class="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }
    
    if (hasHalfStar) {
        stars += '<svg class="star" viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<svg class="star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }
    
    return stars;
}

// Filter Functions
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    applyFilters();
}

function sortProducts(sortType) {
    currentSort = sortType;
    applyFilters();
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    applySorting();
    renderProducts();
}

function applyFilters() {
    filteredProducts = products.filter(product => {
        return currentCategory === 'all' || product.category === currentCategory;
    });
    
    applySorting();
    renderProducts();
}

function applySorting() {
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'discount':
            filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            // Keep original order
            break;
    }
}

// Search Functions
function toggleSearch() {
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    
    searchContainer.classList.toggle('active');
    
    if (searchContainer.classList.contains('active')) {
        setTimeout(() => searchInput.focus(), 300);
    } else {
        searchInput.value = '';
        filterProducts();
    }
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cronoshop_cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show feedback
    showNotification('Prodotto aggiunto al carrello!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cronoshop_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.querySelector('.cart-count');
    
    cartCountEl.textContent = count;
    cartCountEl.classList.toggle('show', count > 0);
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        renderCartItems();
    }
}

function renderCartItems() {
    const content = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8v6a2 2 0 002 2h8a2 2 0 002-2v-6" stroke="currentColor" stroke-width="2"/>
                </svg>
                <p>Il tuo carrello è vuoto</p>
            </div>
        `;
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    content.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item" style="display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid var(--border-color);">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 14px; margin-bottom: 4px;">${item.name}</h4>
                        <p style="color: var(--primary-color); font-weight: 600;">€${item.price} x ${item.quantity}</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="background: var(--error-color); color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer;">×</button>
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
                <span>Totale:</span>
                <span style="color: var(--primary-color);">€${total.toFixed(2)}</span>
            </div>
            <button onclick="proceedToAmazon()" style="width: 100%; background: var(--primary-color); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Procedi su Amazon
            </button>
        </div>
    `;
}

// Wishlist Functions
function toggleWishlistItem(productId) {
    const isInList = isInWishlist(productId);
    
    if (isInList) {
        wishlist = wishlist.filter(id => id !== productId);
        showNotification('Rimosso dalla wishlist', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Aggiunto alla wishlist!', 'success');
    }
    
    localStorage.setItem('cronoshop_wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    // Update button state
    const btn = document.querySelector(`[onclick="toggleWishlistItem(${productId})"]`);
    if (btn) {
        btn.classList.toggle('active', !isInList);
        const svg = btn.querySelector('svg path');
        if (svg) {
            svg.setAttribute('fill', !isInList ? 'currentColor' : 'none');
        }
    }
}

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function updateWishlistCount() {
    const count = wishlist.length;
    const wishlistCountEl = document.querySelector('.wishlist-count');
    
    wishlistCountEl.textContent = count;
    wishlistCountEl.classList.toggle('show', count > 0);
}

function toggleWishlist() {
    const sidebar = document.getElementById('wishlistSidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        renderWishlistItems();
    }
}

function renderWishlistItems() {
    const content = document.getElementById('wishlistContent');
    
    if (wishlist.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <p>Nessun prodotto nella wishlist</p>
            </div>
        `;
        return;
    }
    
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    
    content.innerHTML = `
        <div class="wishlist-items">
            ${wishlistProducts.map(item => `
                <div class="wishlist-item" style="display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid var(--border-color);">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 14px; margin-bottom: 4px;">${item.name}</h4>
                        <p style="color: var(--primary-color); font-weight: 600;">€${item.price}</p>
                        <button onclick="addToCart(${item.id})" style="background: var(--primary-color); color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-top: 4px; cursor: pointer;">
                            Aggiungi al Carrello
                        </button>
                    </div>
                    <button onclick="toggleWishlistItem(${item.id})" style="background: var(--error-color); color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer;">×</button>
                </div>
            `).join('')}
        </div>
    `;
}

// Purchase Functions
function buyProduct(amazonLink) {
    // Track click (you can add analytics here)
    console.log('Product clicked:', amazonLink);
    
    // Open Amazon link in new tab
    window.open(amazonLink, '_blank', 'noopener,noreferrer');
}

function proceedToAmazon() {
    // For demo purposes, open first product in cart
    if (cart.length > 0) {
        window.open(cart[0].amazonLink, '_blank', 'noopener,noreferrer');
    }
}

// Utility Functions
function closeSidebars() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('wishlistSidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: var(--shadow-medium);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSidebars();
        
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer.classList.contains('active')) {
            toggleSearch();
        }
    }
    
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'k') {
            e.preventDefault();
            toggleSearch();
        }
    }
});

// Smooth scroll for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Initialize tooltips and other iOS-like interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add touch feedback for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

console.log('🛍️ CronoShop.eu loaded successfully!');
console.log('📱 iOS-style interface ready');
console.log('🔗 Amazon affiliate links configured with tag: tony6401-21');