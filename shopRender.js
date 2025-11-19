function renderShop() {
    const container = document.getElementById("shop-container");
    if (!container) return;

    // Group products by category
    const categories = {};
    products.forEach(p => {
        if (!categories[p.category]) categories[p.category] = [];
        categories[p.category].push(p);
    });

    // Generate HTML sections
    container.innerHTML = Object.keys(categories).map(category => `
        <h3 class="section-title">${category}</h3>

        <div class="section-content">
            <ul class="shop-list">
                ${categories[category].map(product => `
                    <li class="product-card" data-id="${product.id}">
                        <img src="${product.image}" class="shop-image" alt="${product.alt || product.name}">
                        <div class="shop-details">
                            <h3 class="name">${product.name}</h3>
                            <p class="text">R ${product.price.toLocaleString()}</p>
                        </div>
                    </li>
                `).join("")}
            </ul>
        </div>
    `).join("");
}

renderShop();

// SEARCH FUNCTIONALITY
//Search bar
const searchInput = document.getElementById("search-input");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();

        const filteredProducts = products.filter(p =>
            p.name.toLowerCase().includes(query)
        );

        renderFilteredShop(filteredProducts);
    });
}

function renderFilteredShop(list) {
    const container = document.getElementById("shop-container");

    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<p style="padding:20px;">No products match your search.</p>`;
        return;
    }

    container.innerHTML = list.map(product => `
        <li class="product-card" data-id="${product.id}">
            <img src="${product.image}" class="shop-image" alt="${product.name}">
            <div class="shop-details">
                <h3 class="name">${product.name}</h3>
                <p class="text">R ${product.price.toLocaleString()}</p>
            </div>
        </li>
    `).join("");
}


// PRODUCT MODAL FUNCTIONALITY 
// Get modal elements
const modal = document.getElementById("product-modal");
const modalClose = document.getElementById("modal-close");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalSizes = document.getElementById("size-buttons");

let imageInterval = null;
window.activeProduct = null; // global / public so other scripts can access
window.selectedSize = null;

// Open modal when a product is clicked
document.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const product = products.find(p => p.id == card.dataset.id);
    if (!product) return;

// Reset modal image instantly, was having a bug where image would fade in from last image
    modalImage.style.opacity = 1;         
    modalImage.src = product.image; 

    // Fill modal content
    activeProduct = product; 
    modalName.textContent = product.name;
    modalPrice.textContent = "R" + product.price.toLocaleString();
    
    // Render sizes
    modalSizes.innerHTML = "";
    product.sizes.forEach(size => {
        const btn = document.createElement("button");
        btn.textContent = size;
        btn.addEventListener("click", () => selectSize(btn));
        modalSizes.appendChild(btn);
    });

    selectedSize = null;
    modal.style.display = "flex";

    // Start cycling images if a second image exists
    if (product.image1) {
        let currentImage = 0;
        const images = [product.image, product.image1];

        // Clear previous interval if any
        if (imageInterval) clearInterval(imageInterval);

        imageInterval = setInterval(() => {
            // fade out
            modalImage.style.opacity = 0;

            setTimeout(() => {
                currentImage = (currentImage + 1) % images.length;
                modalImage.src = images[currentImage];
            // fade in
            modalImage.style.opacity = 1;
            }, 1000); // match CSS transition duration
        }, 3000); // 3s per image
    }
});


// Close modal
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

function closeModal() {
    modal.style.display = "none";
    if (imageInterval) clearInterval(imageInterval); // stop cycling images
}

// Select size
function selectSize(btn) {
    document.querySelectorAll("#size-buttons button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedSize = btn.textContent;
}
