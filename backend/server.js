const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 3000;
const DB_FILE = './db.json';

app.use(cors());
app.use(bodyParser.json());

// Function to read the database
const readDB = () => {
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
};

// Function to write to the database
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- AUTHENTICATION ENDPOINTS ---

// User Signup
app.post('/api/auth/user/signup', (req, res) => {
  const db = readDB();
  const { email, password, firstName, lastName, phone } = req.body;

  if (db.users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: `user${Date.now()}`,
    email,
    password, // In a real app, you should hash the password
    firstName,
    lastName,
    phone,
    cart: []
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({ message: 'User created successfully' });
});

// User Login
app.post('/api/auth/user/login', (req, res) => {
  const db = readDB();
  const { email, password } = req.body;

  const user = db.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In a real app, you would return a JWT token here
  res.json({ message: 'Login successful', userId: user.id });
});

// Admin Signup
app.post('/api/auth/admin/signup', (req, res) => {
  const db = readDB();
  const { email, password, firstName, lastName, phone } = req.body;

  if (db.admins.find(admin => admin.email === email)) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const newAdmin = {
    id: `admin${Date.now()}`,
    email,
    password, // In a real app, you should hash the password
    firstName,
    lastName,
    phone
  };

  db.admins.push(newAdmin);
  writeDB(db);

  res.status(201).json({ message: 'Admin created successfully' });
});

// Admin Login
app.post('/api/auth/admin/login', (req, res) => {
  const db = readDB();
  const { email, password } = req.body;

  const admin = db.admins.find(a => a.email === email && a.password === password);

  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In a real app, you would return a JWT token here
  res.json({ message: 'Login successful', adminId: admin.id });
});


// --- PRODUCT ENDPOINTS ---
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products);
});

app.get('/api/products/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// --- CART ENDPOINTS ---

// Get user's cart
app.get('/api/cart', (req, res) => {
    const { userId } = req.query;
    const db = readDB();
    const user = db.users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.cart);
});

// Add item to cart
app.post('/api/cart/items', (req, res) => {
    const { userId, productId, quantity, weight } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const product = db.products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const cartItem = {
        id: `cart${Date.now()}`,
        productId,
        quantity,
        weight,
        price: product.pricePerKg,
        discount: product.discount
    };

    db.users[userIndex].cart.push(cartItem);
    writeDB(db);

    res.status(201).json(cartItem);
});

// Update item in cart
app.put('/api/cart/items/:itemId', (req, res) => {
    const { userId, quantity } = req.body;
    const { itemId } = req.params;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = db.users[userIndex].cart.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    db.users[userIndex].cart[itemIndex].quantity = quantity;
    writeDB(db);

    res.json(db.users[userIndex].cart[itemIndex]);
});

// Delete item from cart
app.delete('/api/cart/items/:itemId', (req, res) => {
    const { userId } = req.body;
    const { itemId } = req.params;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = db.users[userIndex].cart.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    db.users[userIndex].cart.splice(itemIndex, 1);
    writeDB(db);

    res.status(204).send();
});

// --- ORDER ENDPOINTS ---

// Create a new order
app.post('/api/orders/checkout', (req, res) => {
    const { userId, shippingAddress, paymentMethod } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const user = db.users[userIndex];
    if (user.cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = user.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = {
        id: `order${Date.now()}`,
        userId,
        items: user.cart,
        total,
        shippingAddress,
        paymentMethod,
        status: 'Order Placed',
        createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    db.users[userIndex].cart = []; // Clear the cart
    writeDB(db);

    io.emit('newOrder', newOrder); // Notify admins of the new order

    res.status(201).json(newOrder);
});

// Get user's order history
app.get('/api/orders', (req, res) => {
    const { userId } = req.query;
    const db = readDB();
    const userOrders = db.orders.filter(order => order.userId === userId);
    res.json(userOrders);
});

// Get a specific order
app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const db = readDB();
    const order = db.orders.find(o => o.id === orderId);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
});

// Get tracking info for an order
app.get('/api/orders/:orderId/track', (req, res) => {
    const { orderId } = req.params;
    const db = readDB();
    const order = db.orders.find(o => o.id === orderId);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    // In a real app, you would have more sophisticated tracking logic
    res.json({ orderId: order.id, status: order.status });
});

// --- ADMIN ENDPOINTS ---

// Get all orders
app.get('/api/admin/orders', (req, res) => {
    const db = readDB();
    res.json(db.orders);
});

// Update order status
app.put('/api/admin/orders/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const db = readDB();
    const orderIndex = db.orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Order not found' });
    }

    db.orders[orderIndex].status = status;
    writeDB(db);

    io.emit('orderStatusUpdate', { orderId, status });

    res.json(db.orders[orderIndex]);
});

// Add a new product
app.post('/api/admin/products', (req, res) => {
    const { title, desc, pricePerKg, discount, weights, image, quantity } = req.body;
    const db = readDB();

    const newProduct = {
        id: `prod${Date.now()}`,
        title,
        desc,
        pricePerKg,
        discount,
        weights,
        image,
        quantity
    };

    db.products.push(newProduct);
    writeDB(db);

    io.emit('productUpdate');

    res.status(201).json(newProduct);
});

// Update a product
app.put('/api/admin/products/:id', (req, res) => {
    const { id } = req.params;
    const { title, desc, pricePerKg, discount, weights, image, quantity } = req.body;
    const db = readDB();
    const productIndex = db.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = {
        ...db.products[productIndex],
        title,
        desc,
        pricePerKg,
        discount,
        weights,
        image,
        quantity
    };

    db.products[productIndex] = updatedProduct;
    writeDB(db);

    io.emit('productUpdate');

    res.json(updatedProduct);
});

// Delete a product
app.delete('/api/admin/products/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const productIndex = db.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    db.products.splice(productIndex, 1);
    writeDB(db);

    io.emit('productUpdate');

    res.status(204).send();
});

// Get dashboard stats
app.get('/api/admin/dashboard/stats', (req, res) => {
    const db = readDB();
    const totalOrders = db.orders.length;
    const itemsPacked = db.orders.filter(o => o.status === 'Packed').length;
    const totalRevenue = db.orders.reduce((sum, order) => sum + order.total, 0);

    res.json({ totalOrders, itemsPacked, totalRevenue });
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
