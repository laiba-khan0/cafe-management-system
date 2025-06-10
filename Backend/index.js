const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files from the Frontend directory
app.use(express.static(path.join(__dirname, 'Frontend')));

// Root route
app.get('/', (req, res) => {
  res.json('WELCOME TO CAFE MANAGEMENT SYSTEM');
});

// Customers
app.get('/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
app.post('/customers', async (req, res) => {
  const { full_name, email, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO customers (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [full_name, email, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Employees
app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
app.post('/employees', async (req, res) => {
  const { name, role, contact } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO employees (name, role, contact) VALUES ($1, $2, $3) RETURNING *',
      [name, role, contact]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inventory
app.get('/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
app.post('/inventory', async (req, res) => {
  const { item_name, quantity, unit_price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inventory (item_name, quantity, unit_price) VALUES ($1, $2, $3) RETURNING *',
      [item_name, quantity, unit_price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Menu Items
app.get('/menu_items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
app.post('/menu_items', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO menu_items (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders
app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
app.post('/orders', async (req, res) => {
  const { customer_id, order_date, total_amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (customer_id, order_date, total_amount) VALUES ($1, $2, $3) RETURNING *',
      [customer_id, order_date, total_amount]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order Items
app.get('/order_items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM order_items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
app.post('/order_items', async (req, res) => {
  const { order_id, item_id, quantity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [order_id, item_id, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payments
app.get('/payments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
app.post('/payments', async (req, res) => {
  const { order_id, amount, method, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO payments (order_id, amount, method, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, amount, method, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Suppliers
app.get('/suppliers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
app.post('/suppliers', async (req, res) => {
  const { name, contact } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO suppliers (name, contact) VALUES ($1, $2) RETURNING *',
      [name, contact]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tables
app.get('/tables', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tables');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
app.post('/tables', async (req, res) => {
  const { table_number, capacity, is_available } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tables (table_number, capacity, is_available) VALUES ($1, $2, $3) RETURNING *',
      [table_number, capacity, is_available]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});