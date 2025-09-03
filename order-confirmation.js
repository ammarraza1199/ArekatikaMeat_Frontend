document.addEventListener("DOMContentLoaded", async () => {
    const orderIdDisplay = document.getElementById("order-id-display");
    const estimatedDeliveryTime = document.getElementById("estimated-delivery-time");
    const orderItemsDetails = document.getElementById("order-items-details");
    const orderTotalDisplay = document.getElementById("order-total-display");
    const trackingList = document.getElementById("tracking-list");
    const API_URL = 'http://localhost:3000/api';

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (!orderId) {
        orderIdDisplay.textContent = 'N/A';
        estimatedDeliveryTime.textContent = 'No order ID found.';
        return;
    }

    orderIdDisplay.textContent = orderId;

    async function getOrderDetails() {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}`);
            if (response.ok) {
                const order = await response.json();
                renderOrderDetails(order);
                simulateTracking(order.status);
                generateEstimatedDeliveryTime();
            } else {
                orderIdDisplay.textContent = orderId;
                estimatedDeliveryTime.textContent = 'Order not found.';
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            orderIdDisplay.textContent = orderId;
            estimatedDeliveryTime.textContent = 'An error occurred.';
        }
    }

    function renderOrderDetails(order) {
        const itemsHtml = `<ul class="list-group list-group-flush order-items-list">
            ${order.items.map(item => `
                <li class="list-group-item">
                    <span class="item-name">${item.title} (Qty: ${item.quantity}, ${item.weight})</span>
                    <span class="item-quantity">Qty: ${item.quantity}</span>
                    <span class="item-price">₹${item.price * item.quantity}</span>
                </li>
            `).join('')}
        </ul>`;

        orderItemsDetails.innerHTML = itemsHtml;
        orderTotalDisplay.innerHTML = `Total: ₹${order.total}`;
    }

    function simulateTracking(initialStatus) {
        const steps = [
            'step-placed',
            'step-packed',
            'step-shipped',
            'step-on-the-way',
            'step-delivered'
        ];

        let currentStepIndex = steps.indexOf(`step-${initialStatus.toLowerCase().replace(/ /g, '-')}`);
        if (currentStepIndex === -1) currentStepIndex = 0; // Default to placed if status not recognized

        // Activate initial steps
        for (let i = 0; i <= currentStepIndex; i++) {
            const stepElement = document.getElementById(steps[i]);
            if (stepElement) {
                stepElement.classList.add('active');
            }
        }

        // Simulate progression
        const progressInterval = setInterval(() => {
            if (currentStepIndex < steps.length - 1) {
                currentStepIndex++;
                const stepElement = document.getElementById(steps[currentStepIndex]);
                if (stepElement) {
                    stepElement.classList.add('active');
                }
            } else {
                clearInterval(progressInterval);
            }
        }, 5000); // Advance every 5 seconds
    }

    function generateEstimatedDeliveryTime() {
        const now = new Date();
        const deliveryDate = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // 2 hours from now
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        estimatedDeliveryTime.textContent = deliveryDate.toLocaleTimeString('en-US', options);
    }

    getOrderDetails();
});
