document.addEventListener("DOMContentLoaded", async () => {
    const productGrid = document.getElementById("product-list");
    const API_URL = 'https://arekatikameat-backend1.onrender.com/api';
    let products = [];

    async function getProducts() {
        try {
            const response = await fetch(`${API_URL}/products`);
            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function renderProducts() {
        productGrid.innerHTML = '';
        products.forEach(item => {
            const col = document.createElement("div");
            col.className = "col-md-3";

            const defaultWeight = item.weights[0];
            const defaultWeightValue = parseFloat(defaultWeight) || 1;
            let defaultPrice = item.pricePerKg * defaultWeightValue;
            if (item.discount) {
                defaultPrice = Math.round(defaultPrice * (1 - item.discount / 100));
            }

            const imageUrl = getImageUrl(item.image);

            col.innerHTML = `
                <div class="card h-100 product-card">
                    <div class="product-image-container">
                        <img src="${imageUrl}" class="product-image" alt="${item.title}">
                        ${item.discount ? `<span class="discount-badge">${item.discount}% OFF</span>` : ""}
                        <button class="wishlist-btn">
                            <i class="bi bi-heart"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.desc}</p>
                        <div class="weights-container mb-3">
                            ${item.weights.map((w, idx) => `
                                <button class="weight-btn ${idx === 0 ? 'active' : ''}"
                                        onclick="updatePrice(this, ${item.pricePerKg}, ${item.discount || 0}, '${w}')">
                                    ${w}
                                </button>
                            `).join("")}
                        </div>
                        <div class="price-add-container">
                            <div class="price">
                                ${item.discount ?
                                    `<span class="original-price">₹${item.pricePerKg * defaultWeightValue}</span>
                                     <span class="discounted-price">₹${defaultPrice}</span>` :
                                    `<span class="regular-price">₹${defaultPrice}</span>`
                                }
                            </div>
                            <button class="add-btn" onclick="addToCart('${item.id}')">Add</button>
                        </div>
                    </div>
                </div>
            `;
            productGrid.appendChild(col);
        });
    }

    function getImageUrl(imagePath) {
        if (!imagePath) return '';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        let finalPath = imagePath;
        if (finalPath.startsWith('assets/')) {
            finalPath = finalPath.substring('assets/'.length);
        }

        return `https://arekatikameat-backend1.onrender.com/${finalPath}`;
    }

    window.updatePrice = function(button, basePrice, discount, weight) {
        const cardBody = button.closest(".card-body");
        const priceDiv = cardBody.querySelector(".price");
        const selectedWeight = weight;

        cardBody.querySelectorAll(".weight-btn").forEach(btn => {
            btn.classList.remove("active");
        });
        button.classList.add("active");

        const weightValue = parseFloat(selectedWeight) || 1;
        let price = basePrice * weightValue;

        if (discount) {
            const discountedPrice = Math.round(price * (1 - discount / 100));
            priceDiv.innerHTML = `
                <span class="original-price">₹${price}</span>
                <span class="discounted-price">₹${discountedPrice}</span>
            `;
        } else {
            priceDiv.innerHTML = `<span class="regular-price">₹${price}</span>`;
        }
    }

    window.addToCart = async function(productId) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login to add items to your cart.');
            window.location.href = 'auth.html';
            return;
        }

        const product = products.find(p => p.id === productId);
        const selectedWeight = product.weights[0]; // default to first weight for now

        try {
            const response = await fetch(`${API_URL}/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('userToken')}` // If using JWT
                },
                body: JSON.stringify({ userId, productId, quantity: 1, weight: selectedWeight })
            });

            if (response.ok) {
                alert('Item added to cart!');
            } else {
                const data = await response.json();
                alert(`Failed to add item to cart: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred while adding the item to the cart.');
        }
    }

    getProducts();
});
