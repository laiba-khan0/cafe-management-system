const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Connected Successfully on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.json('Welcome to Café Management System!');
});

// Only allow safe table names
const allowedTables = [
  'categories', 'customers', 'employees', 'inventory', 'menu_items',
  'orders', 'order_items', 'payments', 'suppliers', 'tables'
];

// Dynamic GET data from table
app.get('/getData/:table', async (req, res) => {
  const { table } = req.params;
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: `Invalid table name: ${table}` });
  }
  try {
    const result = await pool.query(`SELECT * FROM ${table}`);
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching data from ${table}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Count rows in table
app.get('/getCount/:table', async (req, res) => {
  const { table } = req.params;
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: `Invalid table name: ${table}` });
  }
  try {
    const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add customer
app.post('/addCustomer', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, phone]
    );
    res.status(201).json({ message: "Customer added", customer: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add category
app.post('/addCategory', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    res.status(201).json({ message: "Category added", category: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add employee
app.post('/addEmployee', async (req, res) => {
  const { name, role, salary } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO employees (name, role, salary) VALUES ($1, $2, $3) RETURNING *`,
      [name, role, salary]
    );
    res.status(201).json({ message: "Employee added", employee: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add inventory item
app.post('/addInventory', async (req, res) => {
  const { item_name, quantity, supplier_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inventory (item_name, quantity, supplier_id) VALUES ($1, $2, $3) RETURNING *`,
      [item_name, quantity, supplier_id]
    );
    res.status(201).json({ message: "Inventory item added", inventory: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add menu item
app.post('/addMenuItem', async (req, res) => {
  const { name, price, category_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO menu_items (name, price, category_id) VALUES ($1, $2, $3) RETURNING *`,
      [name, price, category_id]
    );
    res.status(201).json({ message: "Menu item added", item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add supplier
app.post('/addSupplier', async (req, res) => {
  const { name, contact } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO suppliers (name, contact) VALUES ($1, $2) RETURNING *`,
      [name, contact]
    );
    res.status(201).json({ message: "Supplier added", supplier: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add payment
app.post('/addPayment', async (req, res) => {
  const { method, amount } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO payments (payment_method, amount_paid, payment_status, payment_date)
       VALUES ($1, $2, 'completed', CURRENT_TIMESTAMP) RETURNING *`,
      [method, amount]
    );
    res.status(201).json({ message: "Payment added", payment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add table (café seating)
app.post('/addTable', async (req, res) => {
  const { table_number, capacity } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tables (table_number, capacity) VALUES ($1, $2) RETURNING *`,
      [table_number, capacity]
    );
    res.status(201).json({ message: "Table added", table: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add order
app.post('/addOrder', async (req, res) => {
  const { customer_id, total_amount, table_id, payment_method } = req.body;

  try {
    const paymentResult = await pool.query(
      `INSERT INTO payments (payment_method, amount_paid, payment_status, payment_date)
       VALUES ($1, $2, 'completed', CURRENT_TIMESTAMP)
       RETURNING payment_id`,
      [payment_method, total_amount]
    );
    const payment_id = paymentResult.rows[0].payment_id;

    const orderResult = await pool.query(
      `INSERT INTO orders (customer_id, order_date, total_amount, status, payment_id, table_id)
       VALUES ($1, CURRENT_TIMESTAMP, $2, 'paid', $3, $4) RETURNING *`,
      [customer_id, total_amount, payment_id, table_id]
    );

    res.status(201).json({ message: 'Order created', order: orderResult.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// POST: Add order item
app.post('/addOrderItem', async (req, res) => {
  const { order_id, menu_item_id, quantity, price } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_purchase)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [order_id, menu_item_id, quantity, price]
    );
    res.status(201).json({ message: "Order item added", item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
