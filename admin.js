document.addEventListener("DOMContentLoaded", () => {
    // Logout button logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            localStorage.removeItem('adminId'); // Clear admin session
            localStorage.removeItem('adminToken'); // Assuming a token might be used
            window.location.href = 'auth.html'; // Redirect to login page
        });
    }

    const API_URL = 'https://arekatikameat-backend1.onrender.com/api';
    const socket = io('https://arekatikameat-backend1.onrender.com');

    const totalOrdersEl = document.getElementById('total-orders');
    const itemsPackedEl = document.getElementById('items-packed');
    const totalRevenueEl = document.getElementById('total-revenue');
    const ordersTableBody = document.getElementById('orders-table-body');
    const productsTableBody = document.getElementById('products-table-body');
    const productForm = document.getElementById('product-form');
    const productModal = new bootstrap.Modal(document.getElementById('product-modal'));
    const productModalTitle = document.getElementById('product-modal-title');
    const productIdInput = document.getElementById('product-id');
    const productImageUpload = document.getElementById('product-image-upload');
    const dragDropArea = document.getElementById('drag-drop-area');
    const productImagePreview = document.getElementById('product-image-preview');

    let currentImageBase64 = null;

    // Helper function to handle image file
    function handleImageFile(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                productImagePreview.src = e.target.result;
                productImagePreview.style.display = 'block';
                currentImageBase64 = e.target.result; // Store Base64 string
                console.log('currentImageBase64 set:', currentImageBase64 ? currentImageBase64.substring(0, 50) + '...' : 'null'); // Debug log
            };
            reader.readAsDataURL(file);
        }
    }

    // Event Listeners for Image Upload
    productImageUpload.addEventListener('change', (e) => {
        handleImageFile(e.target.files[0]);
    });

    dragDropArea.addEventListener('click', () => {
        productImageUpload.click();
    });

    dragDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragDropArea.classList.add('dragover');
    });

    dragDropArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragDropArea.classList.remove('dragover');
    });

    dragDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragDropArea.classList.remove('dragover');
        handleImageFile(e.dataTransfer.files[0]);
    });

    let orders = [];
    let products = [];

    async function getDashboardStats() {
        try {
            const response = await fetch(`${API_URL}/admin/dashboard/stats`);
            const stats = await response.json();
            totalOrdersEl.textContent = stats.totalOrders;
            itemsPackedEl.textContent = stats.itemsPacked;
            totalRevenueEl.textContent = `₹${stats.totalRevenue}`;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    }

    async function getOrders() {
        try {
            const response = await fetch(`${API_URL}/admin/orders`);
            orders = await response.json();
            renderOrders();
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    async function getProducts() {
        try {
            const response = await fetch(`${API_URL}/products`);
            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function renderOrders() {
        ordersTableBody.innerHTML = '';
        orders.forEach(order => {
            const tr = document.createElement('tr');

            // Format items for display
            const itemsDisplay = order.items.map(item => {
                return `${item.title} (Qty: ${item.quantity}, ${item.weight})`;
            }).join('<br>'); // Use <br> for new lines within the cell

            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.userId}</td>
                <td>${itemsDisplay}</td> <!-- Display items here -->
                <td>${order.shippingAddress.address}, ${order.shippingAddress.city}</td>
                <td>₹${order.total}</td>
                <td>
                    <select class="form-select" onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="Order Placed" ${order.status === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
                        <option value="Packed" ${order.status === 'Packed' ? 'selected' : ''}>Packed</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">View</button>
                </td>
            `;
            ordersTableBody.appendChild(tr);
        });
    }

    function renderProducts() {
        productsTableBody.innerHTML = '';
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.title}</td>
                <td>₹${product.pricePerKg}</td>
                <td>${product.quantity}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                </td>
            `;
            productsTableBody.appendChild(tr);
        });
    }

    window.updateOrderStatus = async function(orderId, status) {
        try {
            await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            getDashboardStats();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    window.editProduct = function(productId) {
        const product = products.find(p => p.id === productId);
        productModalTitle.textContent = 'Edit Product';
        productIdInput.value = product.id;
        document.getElementById('product-title').value = product.title;
        document.getElementById('product-desc').value = product.desc;
        document.getElementById('product-price').value = product.pricePerKg;
        document.getElementById('product-discount').value = product.discount;
        document.getElementById('product-weights').value = product.weights.join(', ');
        // Clear previous image preview
        productImagePreview.style.display = 'none';
        productImagePreview.src = '#';
        currentImageBase64 = null; // Reset Base64 string

        if (product.image) {
            // If product has an image, display it in preview
            productImagePreview.src = product.image;
            productImagePreview.style.display = 'block';
            // If it's a Base64 string, store it, otherwise it's a URL
            if (product.image.startsWith('data:image')) {
                currentImageBase64 = product.image;
            }
        }
        document.getElementById('product-quantity').value = product.quantity;
        productModal.show();
    };

    window.deleteProduct = async function(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await fetch(`${API_URL}/admin/products/${productId}`, { method: 'DELETE' });
            getProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = productIdInput.value;
        const productData = {
            title: document.getElementById('product-title').value,
            desc: document.getElementById('product-desc').value,
            pricePerKg: parseFloat(document.getElementById('product-price').value),
            discount: parseFloat(document.getElementById('product-discount').value) || null,
            weights: document.getElementById('product-weights').value.split(',').map(w => w.trim()),
            // Use currentImageBase64 if a new image was uploaded, otherwise use existing product.image
            image: currentImageBase64 || (id ? products.find(p => p.id === id).image : null),
            quantity: parseInt(document.getElementById('product-quantity').value)
        };
        console.log('Sending product data:', productData); // Debug log

        try {
            let response; // Declare response variable
            if (id) {
                // Update product
                response = await fetch(`${API_URL}/admin/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            } else {
                // Add new product
                response = await fetch(`${API_URL}/admin/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }
            const data = await response.json(); // Get response data
            console.log('Server response:', response.status, data); // Debug log

            if (!response.ok) {
                alert(`Failed to save product: ${data.message || response.statusText}`);
            }

            productModal.hide();
            getProducts();
            // Reset image preview and Base64 string after successful save
            productImagePreview.style.display = 'none';
            productImagePreview.src = '#';
            currentImageBase64 = null;
        } catch (error) {
            console.error('Error saving product:', error);
            alert('An error occurred while saving the product.'); // Add alert for catch block
        }
    });

    // Socket.IO listeners
    socket.on('newOrder', (order) => {
        orders.unshift(order);
        renderOrders();
        getDashboardStats();
    });

    socket.on('productUpdate', () => {
        getProducts();
    });

    // Initial data load
    getDashboardStats();
    getOrders();
    getProducts();
});
