document.addEventListener("DOMContentLoaded", () => {
    const placeOrderBtn = document.getElementById("place-order-btn");
    const API_URL = 'http://localhost:3000/api';

    placeOrderBtn.addEventListener("click", async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login to place an order.');
            window.location.href = 'auth.html';
            return;
        }

        const shippingForm = document.getElementById('shipping-form');
        const paymentForm = document.getElementById('payment-form');

        if (!shippingForm.checkValidity() || !paymentForm.checkValidity()) {
            alert('Please fill out all required fields.');
            return;
        }

        const shippingAddress = {
            fullName: document.getElementById('fullName').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value,
        };

        const paymentDetails = {
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value,
        };

        try {
            const response = await fetch(`${API_URL}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, shippingAddress, paymentDetails })
            });

            if (response.ok) {
                const order = await response.json();
                alert('Order placed successfully!');
                window.location.href = `order-confirmation.html?orderId=${order.id}`;
            } else {
                const data = await response.json();
                alert(`Failed to place order: ${data.message}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing the order.');
        }
    });
});
