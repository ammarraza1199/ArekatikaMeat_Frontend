async function renderBestSelling() {
    const carouselInner = document.querySelector("#bestSellingCarousel .carousel-inner");
    const itemsPerSlide = 4;
    let bestSelling = [];
    const API_URL = 'https://arekatikameat-backend1.onrender.com/api';

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
                const defaultWeightValue = parseFloat(defaultWeight.replace(/[^0-9.]/g, ''));
                const unit = defaultWeight.replace(/[^a-zA-Z]/g, '');

                let weightInKg = defaultWeightValue;
                if (unit.toLowerCase() === 'g') {
                    weightInKg = defaultWeightValue / 1000;
                }

                let defaultPrice = item.pricePerKg * weightInKg;
                if (item.discount) {
                    defaultPrice = Math.ceil(defaultPrice * (1 - item.discount / 100));
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
                                        `<span class="original-price">₹${Math.ceil(item.pricePerKg * weightInKg)}</span>
                                         <span class="discounted-price">₹${defaultPrice}</span>` :
                                        `<span class="regular-price">₹${Math.ceil(defaultPrice)}</span>`
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

    const weightValue = parseFloat(selectedWeight.replace(/[^0-9.]/g, ''));
    const unit = selectedWeight.replace(/[^a-zA-Z]/g, '');

    let weightInKg = weightValue;
    if (unit.toLowerCase() === 'g') {
        weightInKg = weightValue / 1000;
    }

    let price = basePrice * weightInKg;

    if (discount) {
        const discountedPrice = Math.ceil(price * (1 - discount / 100));
        priceDiv.innerHTML = `
            <span class="original-price">₹${Math.ceil(price)}</span>
            <span class="discounted-price">₹${discountedPrice}</span>
        `;
    } else {
        priceDiv.innerHTML = `<span class="regular-price">₹${Math.ceil(price)}</span>`;
    }
}

async function addToCart(productId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Please login to add items to your cart.');
        window.location.href = 'auth.html';
        return;
    }

    const API_URL = 'https://arekatikameat-backend1.onrender.com/api';
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