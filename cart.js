document.addEventListener("DOMContentLoaded", async () => {
    const cartContainer = document.getElementById("cart-container");
    const cartTotalEl = document.getElementById("cart-total");
    const placeOrderBtn = document.getElementById("place-order-btn");
    const couponCodeInput = document.getElementById("coupon-code");
    const applyCouponBtn = document.getElementById("apply-coupon-btn");
    const API_URL = 'https://arekatikameat-backend1.onrender.com/api';
    let cart = [];
    let products = [];
    let currentTotal = 0; // To store the current total before coupon
    let finalOrderTotal = 0; // To store the total after coupon application

    const coupons = {
        "AREKATIKAMEAT10": 10, // 10% discount
        "FREESHIP": 0 // Example for free shipping, though not implemented here
    };

    async function getProducts() {
        try {
            const response = await fetch(`${API_URL}/products`);
            products = await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async function getCart() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            cartContainer.innerHTML = '<p>Please login to view your cart.</p>';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/cart?userId=${userId}`);
            cart = await response.json();
            await getProducts();
            renderCart();
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }

    function renderCart() {
        cartContainer.innerHTML = '';
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalEl.textContent = '₹0';
            currentTotal = 0;
            finalOrderTotal = 0;
            return;
        }

        const table = document.createElement('table');
        table.className = 'table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');
        let total = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;

            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.title} (${item.weight})</td>
                <td>₹${item.price}</td>
                <td>
                    <input type="number" class="form-control" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                </td>
                <td>₹${itemTotal}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')">Remove</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        cartContainer.appendChild(table);
        currentTotal = total; // Store the original total
        finalOrderTotal = total; // Initialize final total with current total
        cartTotalEl.textContent = `₹${total}`;
    }

    applyCouponBtn.addEventListener('click', () => {
        const couponCode = couponCodeInput.value.toUpperCase();
        if (coupons[couponCode] !== undefined) {
            const discountPercentage = coupons[couponCode];
            const discountedTotal = currentTotal * (1 - discountPercentage / 100);
            finalOrderTotal = Math.ceil(discountedTotal); // Update final total
            cartTotalEl.textContent = `₹${finalOrderTotal}`;
            alert(`Coupon '${couponCode}' applied! You got ${discountPercentage}% off.`);
        } else {
            alert("Invalid coupon code.");
            finalOrderTotal = currentTotal; // Reset final total if invalid
            cartTotalEl.textContent = `₹${currentTotal}`; // Reset to original total if invalid
        }
    });

    window.updateQuantity = async function(itemId, quantity) {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, quantity: parseInt(quantity) })
            });

            if (response.ok) {
                getCart();
            } else {
                alert('Failed to update quantity.');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('An error occurred while updating the quantity.');
        }
    };

    window.removeFromCart = async function(itemId) {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                getCart();
            } else {
                alert('Failed to remove item from cart.');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            alert('An error occurred while removing the item from the.cart.');
        }
    };

    

    placeOrderBtn.addEventListener('click', async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login to place an order.');
            window.location.href = 'auth.html';
            return;
        }

        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (paymentMethod === 'UPI') {
            await placeOrder(userId, paymentMethod, finalOrderTotal);
        } else {
            await placeOrder(userId, paymentMethod, finalOrderTotal);
        }
    });

    async function placeOrder(userId, paymentMethod, totalAmount) {
        console.log('Attempting to place order with userId:', userId, 'paymentMethod:', paymentMethod, 'totalAmount:', totalAmount);
        const shippingAddress = {
            fullName: "Test User",
            address: "123 Test Street",
            city: "Test City",
            postalCode: "12345"
        }; // Using dummy address for now

        try {
            console.log('Sending checkout request to /api/orders/checkout');
            const response = await fetch(`${API_URL}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, shippingAddress, paymentMethod, total: totalAmount }) // Use totalAmount
            });
            console.log('Checkout response received:', response);

            if (response.ok) {
                const order = await response.json();
                console.log('Order placed successfully. Order details:', order);
                if (paymentMethod === 'UPI') {
                    console.log('Attempting to create payment order for orderId:', order.id);
                    const paymentResponse = await fetch(`${API_URL}/payment/create-order`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ amount: totalAmount, userId, orderId: order.id })
                    });
                    console.log('Payment response received:', paymentResponse);

                    if (paymentResponse.ok) {
                        const paymentData = await paymentResponse.json();
                        console.log('Payment data received:', paymentData);
                        window.location.href = paymentData.payment_link;
                    } else {
                        const errorData = await paymentResponse.json();
                        console.error('Failed to create payment order. Server response:', errorData);
                        alert('Failed to create payment order.');
                    }
                } else {
                    if (order && order.id) {
                        console.log('Redirecting to order confirmation page for orderId:', order.id);
                        window.location.replace('/order-confirmation.html?orderId=' + order.id);
                    } else {
                        console.error('Order ID is missing from the response.', order);
                        alert('Order placed, but failed to get order ID for redirection.');
                    }
                }
            } else {
                const data = await response.json();
                console.error('Failed to place order. Server response:', data);
                alert(`Failed to place order: ${data.message}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing the order. Please check the console for details.');
        }
    }

    getCart();
});
