// Navigation menu variables
const navMenu = document.querySelector(".nav-menu");
const openBtn = document.getElementById("menu-open-button");
const closeBtn = document.getElementById("menu-close-button");

// Cart variables
let cartCount = 0;
let cart = [];
const cartBtn = document.getElementById("floating-cart-btn");
const cartCountBadge = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartItemsDiv = document.getElementById("cart-items");
const closeCart = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const addToCartBtn = document.getElementById("add-to-cart-btn");


// Load cart from localStorage
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    cartCount = cart.length;
    cartCountBadge.textContent = cartCount;
}
    
// Open menu
openBtn.addEventListener("click", () => {
    navMenu.style.left = "0";
});

// Close menu
closeBtn.addEventListener("click", () => {
    navMenu.style.left = "-300px";
});


// Handle add to cart
function addToCart(product) {
    cart.push(product);
    cartCount = cart.length;

    // Save to local storage so its persistant across pages
    localStorage.setItem("cart", JSON.stringify(cart));


    // Update badge
    cartCountBadge.textContent = cartCount;

    // Bounce animation
    cartBtn.style.transform = "scale(1.15)";
    setTimeout(() => cartBtn.style.transform = "scale(1)", 180);

    // shake animation
    cartBtn.classList.add("shake");
    setTimeout(() => cartBtn.classList.remove("shake"), 400);

    updateCartPanel();
}

addToCartBtn.addEventListener("click", () => {
    if (!window.activeProduct) {
        alert("No product selected.");
        return;
    }

    if (!window.selectedSize) {
        alert("Please select a size.");
        return;
    }

    // Create a cart item
    const item = {
        id: window.activeProduct.id,
        name: window.activeProduct.name,
        price: window.activeProduct.price,
        size: window.selectSize, 
        image: activeProduct.image
    };

    addToCart(item);
});

function updateCartPanel() {
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach((p, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div class="cart-row">
                <img src="${p.image}" alt="${p.name}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;margin-right:8px;">
                <div style="flex:1">
                    <p style="margin:0;font-weight:600">${p.name}</p>
                    <p style="margin:0">Size: ${p.size}</p>
                    <p style="margin:0">R ${p.price.toLocaleString()}</p>
                </div>
                <div>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            </div>
            <hr>
        `;

        cartItemsDiv.appendChild(div);
    });

    // Add remove listeners
    cartItemsDiv.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = Number(e.target.dataset.index);
            removeFromCart(idx);
        });
    });
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) 
        return;

    cart.splice(index, 1);
    cartCount = cart.length;
    cartCountBadge.textContent = cartCount;

    if (cartCount === 0) {
        cartBtn.classList.add("cart-hidden");
        cartPanel.classList.remove("open");
    }

    updateCartPanel();
}

// open panel
cartBtn.addEventListener("click", () => {
    updateCartPanel();
    cartPanel.classList.add("open");
});

// close panel
document.getElementById("close-cart").addEventListener("click", () => {
    cartPanel.classList.remove("open");
});

// proceed to checkout
checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
});

