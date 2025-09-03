document.addEventListener("DOMContentLoaded", async () => {
    const cartContainer = document.getElementById("cart-container");
    const cartTotalEl = document.getElementById("cart-total");
    const placeOrderBtn = document.getElementById("place-order-btn");
    const API_URL = 'http://localhost:3000/api';
    let cart = [];
    let products = [];

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
        cartTotalEl.textContent = `₹${total}`;
    }

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
            const upiModal = new bootstrap.Modal(document.getElementById('upi-payment-modal'));
            upiModal.show();

            document.querySelectorAll('#upi-app-selection button').forEach(button => {
                button.addEventListener('click', () => {
                    document.getElementById('upi-app-selection').classList.add('d-none');
                    document.getElementById('qr-code-container').classList.remove('d-none');

                    setTimeout(() => {
                        const paymentStatus = document.getElementById('payment-status');
                        paymentStatus.innerHTML = '<p class="text-success">Payment Successful!</p>';
                        setTimeout(async () => {
                            await placeOrder(userId, paymentMethod);
                        }, 1000);
                    }, 4000);
                });
            });
        } else {
            placeOrder(userId, paymentMethod);
        }
    });

    async function placeOrder(userId, paymentMethod) {
        const shippingAddress = {
            fullName: "Test User",
            address: "123 Test Street",
            city: "Test City",
            postalCode: "12345"
        }; // Using dummy address for now

        try {
            const response = await fetch(`${API_URL}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, shippingAddress, paymentMethod })
            });

            if (response.ok) {
                const order = await response.json();
                console.log('Order placed successfully:', order);
                console.log('Attempting redirection...');
                setTimeout(() => {
                    window.location.href = `order-confirmation.html?orderId=${order.id}`;
                }, 0);
            } else {
                const data = await response.json();
                alert(`Failed to place order: ${data.message}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing the order.');
        }
    }

    getCart();
});
