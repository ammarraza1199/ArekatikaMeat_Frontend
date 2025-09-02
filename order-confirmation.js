document.addEventListener("DOMContentLoaded", async () => {
    const orderDetailsContainer = document.getElementById("order-details");
    const API_URL = 'http://localhost:3000/api';

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (!orderId) {
        orderDetailsContainer.innerHTML = '<p>No order ID found.</p>';
        return;
    }

    async function getOrderDetails() {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}`);
            if (response.ok) {
                const order = await response.json();
                renderOrderDetails(order);
            } else {
                orderDetailsContainer.innerHTML = '<p>Order not found.</p>';
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            orderDetailsContainer.innerHTML = '<p>An error occurred while fetching order details.</p>';
        }
    }

    function renderOrderDetails(order) {
        const itemsHtml = order.items.map(item => `
            <div>
                <span>${item.quantity} x ${item.weight}</span>
                <strong>${item.productId}</strong>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `).join('');

        orderDetailsContainer.innerHTML = `
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <h5>Items:</h5>
            ${itemsHtml}
            <h5>Shipping Address:</h5>
            <p>
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
            </p>
        `;
    }

    getOrderDetails();
});
