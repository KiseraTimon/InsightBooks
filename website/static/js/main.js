// -------------------------------------------------------------------------
// Global Script - Handles Cart Sync, Navbar Auth Indicators, Mobile Menu, Transitions
// -------------------------------------------------------------------------

window.InSightApp = {
    // Simulated Authentication helper
    isLoggedIn: function() {
        return localStorage.getItem('insight_books_user_logged_in') === 'true';
    },
    
    getUserEmail: function() {
        return localStorage.getItem('insight_books_user_email') || 'visitor@example.com';
    },

    getUserName: function() {
        return localStorage.getItem('insight_books_user_name') || 'Guest Reader';
    },

    login: function(email, name) {
        localStorage.setItem('insight_books_user_logged_in', 'true');
        localStorage.setItem('insight_books_user_email', email);
        localStorage.setItem('insight_books_user_name', name);
        this.updateAuthUI();
        this.showToast(`Welcome back, ${name}!`);
    },

    logout: function() {
        localStorage.removeItem('insight_books_user_logged_in');
        localStorage.removeItem('insight_books_user_email');
        localStorage.removeItem('insight_books_user_name');
        this.updateAuthUI();
        this.showToast('You have been logged out.', true);
    },

    updateAuthUI: function() {
        const userProfileLink = document.getElementById('user-profile-link');
        const navMenu = document.getElementById('nav-menu');
        
        if (this.isLoggedIn()) {
            if (userProfileLink) {
                userProfileLink.href = '/dashboard';
                userProfileLink.classList.add('logged-in');
                userProfileLink.setAttribute('aria-label', 'Go to Dashboard');
                userProfileLink.innerHTML = '<i class="fa-solid fa-user-check"></i>';
            }
            // Dynamically add Reads tab
            if (navMenu && !document.getElementById('nav-link-reads')) {
                const readsLink = document.createElement('a');
                readsLink.href = '/reads';
                readsLink.className = 'nav-link';
                readsLink.id = 'nav-link-reads';
                readsLink.textContent = 'Reads';
                
                // Find contact us link to insert before
                const contactLink = Array.from(navMenu.querySelectorAll('.nav-link'))
                    .find(el => el.textContent.toLowerCase().includes('contact'));
                if (contactLink) {
                    navMenu.insertBefore(readsLink, contactLink);
                } else {
                    navMenu.appendChild(readsLink);
                }
            }
        } else {
            if (userProfileLink) {
                userProfileLink.href = '/auth';
                userProfileLink.classList.remove('logged-in');
                userProfileLink.setAttribute('aria-label', 'Sign In');
                userProfileLink.innerHTML = '<i class="fa-solid fa-user"></i>';
            }
            // Remove Reads tab if present
            const readsLink = document.getElementById('nav-link-reads');
            if (readsLink) {
                readsLink.remove();
            }
        }
    },

    // Global Toast Notification Helper
    showToast: function(message, isError = false) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : ''}`;
        toast.innerHTML = `
            <i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

// -------------------------------------------------------------------------
// Helper for Dynamic Randomized Loaders
// -------------------------------------------------------------------------
function getLoaderHTML(type) {
    if (type === 'book-flip') {
        return `
            <div class="loader-content">
                <div class="book-loader">
                    <div class="book-page"></div>
                    <div class="book-page"></div>
                    <div class="book-page"></div>
                </div>
                <div class="loader-text">Gathering the pages...</div>
            </div>
        `;
    } else if (type === 'circular-tracker') {
        return `
            <div class="loader-content">
                <div class="spinner-loader"></div>
                <div class="loader-text">Curating your shelf...</div>
            </div>
        `;
    } else {
        return `
            <div class="loader-content">
                <div class="quill-loader"><i class="fa-solid fa-pen-nib"></i></div>
                <div class="loader-text">Opening the archives...</div>
            </div>
        `;
    }
}

function initializeLoaderOverlay(overlay) {
    if (!overlay) return;
    
    // Check if there is an active transition cached
    let activeType = sessionStorage.getItem('insight_transition_animation');
    if (!activeType) {
        const types = ['book-flip', 'circular-tracker', 'quill-pulse'];
        activeType = types[Math.floor(Math.random() * types.length)];
        sessionStorage.setItem('insight_transition_animation', activeType);
    }
    overlay.innerHTML = getLoaderHTML(activeType);
}

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // Page Transitions Overlay Creation & Link Interceptions
    // -------------------------------------------------------------------------
    let transitionOverlay = document.querySelector('.page-transition-overlay');
    if (!transitionOverlay) {
        transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition-overlay active';
        document.body.appendChild(transitionOverlay);
    }
    
    // Initialize current loader graphics
    initializeLoaderOverlay(transitionOverlay);

    // Fade out overlay when page is fully loaded (images, CSS, everything)
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (transitionOverlay) {
                transitionOverlay.classList.remove('active');
            }
        }, 500); // Visual comfort delay
    });

    // Fallback: If page load event already fired or is slow, guarantee fadeout
    setTimeout(() => {
        if (transitionOverlay && transitionOverlay.classList.contains('active')) {
            transitionOverlay.classList.remove('active');
        }
    }, 2500);

    // Intercept navigation link clicks for smooth fade transitions
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        // Filter out: hash anchors, target blank, and disabled links
        if (
            href && 
            href.startsWith('/') && 
            !href.startsWith('/#') && 
            !anchor.getAttribute('target') && 
            !anchor.classList.contains('footer-link-disabled')
        ) {
            e.preventDefault();
            
            // Randomize next page loader graphic
            const types = ['book-flip', 'circular-tracker', 'quill-pulse'];
            const nextType = types[Math.floor(Math.random() * types.length)];
            sessionStorage.setItem('insight_transition_animation', nextType);
            
            transitionOverlay.innerHTML = getLoaderHTML(nextType);
            transitionOverlay.classList.add('active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 600); // Wait for fade-in transition
        }
    });

    // -------------------------------------------------------------------------
    // DOM Elements
    // -------------------------------------------------------------------------
    const navMenu = document.getElementById('nav-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const cartSubtotalVal = document.getElementById('cart-subtotal-val');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Initialize Auth UI
    window.InSightApp.updateAuthUI();

    // -------------------------------------------------------------------------
    // Mobile Navigation Menu Toggles
    // -------------------------------------------------------------------------
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-times';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close mobile menu on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });

    // -------------------------------------------------------------------------
    // Sidebar Cart Logic (Synchronized via LocalStorage)
    // -------------------------------------------------------------------------
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('insight_books_cart')) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('insight_books_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function toggleCart(isOpen) {
        if (isOpen) {
            updateCartUI(); // Fresh render before showing
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => toggleCart(true));
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

    function updateCartUI() {
        if (!cartItemsContainer) return;
        
        const cart = getCart();
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            if (checkoutBtn) checkoutBtn.disabled = false;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                totalItems += item.quantity;

                const cartItemEl = document.createElement('div');
                cartItemEl.className = 'cart-item';
                cartItemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="cart-item-cover">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-author">by ${item.author}</div>
                        <div class="cart-item-price">₹ ${item.price}/-</div>
                        <!-- Multi-Quantity adjusters -->
                        <div class="cart-item-qty">
                            <button class="qty-change-btn btn-minus" data-id="${item.id}">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-change-btn btn-plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                `;
                
                // Remove fully from cart
                cartItemEl.querySelector('.cart-item-remove').addEventListener('click', (e) => {
                    const idToRemove = parseInt(e.currentTarget.getAttribute('data-id'));
                    removeFromCart(idToRemove);
                });

                cartItemsContainer.appendChild(cartItemEl);
            });
        }

        if (cartBadge) cartBadge.textContent = totalItems;
        if (cartSubtotalVal) cartSubtotalVal.textContent = `₹ ${subtotal}/-`;
    }

    // Event delegation for quantity adjustments
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const btnMinus = e.target.closest('.btn-minus');
            const btnPlus = e.target.closest('.btn-plus');
            
            if (btnMinus) {
                const id = parseInt(btnMinus.getAttribute('data-id'), 10);
                window.InSightCart.updateQuantity(id, -1);
            } else if (btnPlus) {
                const id = parseInt(btnPlus.getAttribute('data-id'), 10);
                window.InSightCart.updateQuantity(id, 1);
            }
        });
    }

    // Expose Add to Cart and updates globally
    window.InSightCart = {
        add: function(product) {
            const cart = getCart();
            const existingIndex = cart.findIndex(item => item.id === product.id);
            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            saveCart(cart);
            window.InSightApp.showToast(`"${product.title}" added to cart!`);
            toggleCart(true);
        },
        updateQuantity: function(id, delta) {
            const cart = getCart();
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex > -1) {
                cart[itemIndex].quantity += delta;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                    window.InSightApp.showToast('Item removed from cart.');
                }
                saveCart(cart);
            }
        },
        open: function() {
            toggleCart(true);
        }
    };

    function removeFromCart(id) {
        let cart = getCart();
        const itemToRemove = cart.find(item => item.id === id);
        cart = cart.filter(item => item.id !== id);
        saveCart(cart);
        if (itemToRemove) {
            window.InSightApp.showToast(`Removed "${itemToRemove.title}" from cart.`, true);
        }
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.InSightApp.showToast('Thank you! Simulated checkout completed.');
            saveCart([]);
            toggleCart(false);
        });
    }

    // Initial render of cart badge on page load
    updateCartUI();
});
