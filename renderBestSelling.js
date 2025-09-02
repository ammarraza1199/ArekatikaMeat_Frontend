async function renderBestSelling() {
    const carouselInner = document.querySelector("#bestSellingCarousel .carousel-inner");
    const itemsPerSlide = 4;
    let bestSelling = [];
    const API_URL = 'http://localhost:3000/api';

    try {
        const response = await fetch(`${API_URL}/products`);
        bestSelling = await response.json();
    } catch (error) {
        console.error('Error fetching best selling products:', error);
        return;
    }

    const totalSlides = Math.ceil(bestSelling.length / itemsPerSlide);

    for (let slide = 0; slide < totalSlides; slide++) {
        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item${slide === 0 ? " active" : ""}`;
        const row = document.createElement("div");
        row.className = "row g-3 justify-content-center";

        bestSelling.slice(slide * itemsPerSlide, slide * itemsPerSlide + itemsPerSlide)
            .forEach(item => {
                const col = document.createElement("div");
                col.className = "col-md-3";

                const defaultWeight = item.weights[0];
                const defaultWeightValue = parseFloat(defaultWeight) || 1;
                let defaultPrice = item.pricePerKg * defaultWeightValue;
                if (item.discount) {
                    defaultPrice = Math.round(defaultPrice * (1 - item.discount / 100));
                }

                col.innerHTML = `
                    <div class="card h-100 product-card">
                        <div class="product-image-container">
                            <img src="${item.image}" class="product-image" alt="${item.title}">
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
                row.appendChild(col);
            });
        carouselItem.appendChild(row);
        carouselInner.appendChild(carouselItem);
    }

    // Generate indicators dynamically
    const indicators = document.querySelector("#bestSellingCarousel .carousel-indicators");
    for (let i = 0; i < totalSlides; i++) {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("data-bs-target", "#bestSellingCarousel");
        button.setAttribute("data-bs-slide-to", i);
        if (i === 0) button.className = "active";
        indicators.appendChild(button);
    }
}

// Function to update price dynamically
function updatePrice(button, basePrice, discount, weight) {
    const cardBody = button.closest(".card-body");
    const priceDiv = cardBody.querySelector(".price");
    const selectedWeight = weight;

    // Update active state for weight buttons
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

async function addToCart(productId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Please login to add items to your cart.');
        window.location.href = 'auth.html';
        return;
    }

    const API_URL = 'http://localhost:3000/api';
    const response = await fetch(`${API_URL}/products/${productId}`);
    const product = await response.json();
    const selectedWeight = product.weights[0]; // default to first weight for now

    try {
        const response = await fetch(`${API_URL}/cart/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

document.addEventListener("DOMContentLoaded", renderBestSelling);