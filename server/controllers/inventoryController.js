const pool = require('../config/database');

// Receipts
exports.getAllReceipts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, 
        s.name as supplier_name, 
        w.name as warehouse_name,
        COUNT(ri.id) as items_count
      FROM receipts r
      LEFT JOIN suppliers s ON r.supplier_id = s.id
      LEFT JOIN warehouses w ON r.warehouse_id = w.id
      LEFT JOIN receipt_items ri ON r.id = ri.receipt_id
      GROUP BY r.id, s.name, w.name
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
};

exports.getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM receipts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
};

exports.createReceipt = async (req, res) => {
  const client = await pool.connect();
  try {
    const { supplier_id, warehouse_id, expected_date, reference_number, notes, items } = req.body;
    
    await client.query('BEGIN');
    
    const receiptResult = await client.query(
      `INSERT INTO receipts (reference_number, supplier_id, warehouse_id, expected_date, notes, status)
       VALUES ($1, $2, $3, $4, $5, 'draft') RETURNING *`,
      [reference_number, supplier_id, warehouse_id, expected_date, notes]
    );
    
    const receiptId = receiptResult.rows[0].id;
    
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO receipt_items (receipt_id, product_id, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5)`,
          [receiptId, item.product_id, item.quantity, item.unit_price, item.total_price]
        );
      }
    }
    
    await client.query('COMMIT');
    res.status(201).json({ message: 'Receipt created', receipt: receiptResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to create receipt' });
  } finally {
    client.release();
  }
};

exports.updateReceiptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE receipts SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    
    res.json({ message: 'Status updated', receipt: result.rows[0] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM receipts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    
    res.json({ message: 'Receipt deleted' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to delete receipt' });
  }
};

// Deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM deliveries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch delivery' });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const { warehouse_id, destination, delivery_date, notes } = req.body;
    
    const result = await pool.query(
      `INSERT INTO deliveries (reference_number, warehouse_id, destination, delivery_date, notes, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [`DEL-${Date.now()}`, warehouse_id, destination, delivery_date, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to create delivery' });
  }
};

// Transfers
exports.getAllTransfers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transfers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch transfers' });
  }
};

exports.getTransferById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM transfers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transfer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch transfer' });
  }
};

exports.createTransfer = async (req, res) => {
  try {
    const { from_warehouse_id, to_warehouse_id, transfer_date, notes } = req.body;
    
    const result = await pool.query(
      `INSERT INTO transfers (reference_number, from_warehouse_id, to_warehouse_id, transfer_date, notes, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [`TRF-${Date.now()}`, from_warehouse_id, to_warehouse_id, transfer_date, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to create transfer' });
  }
};

// Dashboard/Reports
exports.getDashboardStats = async (req, res) => {
  try {
    const receiptStats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as todays_receipts,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_validation,
        COUNT(*) FILTER (WHERE status = 'validated' AND DATE(updated_at) = CURRENT_DATE) as validated_today,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) as total_this_week
      FROM receipts
    `);
    
    const recentActivity = await pool.query(`
      SELECT * FROM activity_log 
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    res.json({
      receipts: receiptStats.rows[0],
      recentActivity: recentActivity.rows
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

exports.getInventoryReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, i.quantity, w.name as warehouse_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      ORDER BY p.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, i.quantity, w.name as warehouse_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      WHERE i.quantity <= p.reorder_level
      ORDER BY i.quantity ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch low stock' });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM activity_log 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

// ============ RECEIPT LINES ============

// Get all lines for a receipt
exports.getReceiptLines = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT ri.*, 
        p.name as product_name,
        p.sku,
        p.category,
        p.unit_price as product_unit_price
      FROM receipt_items ri
      LEFT JOIN products p ON ri.product_id = p.id
      WHERE ri.receipt_id = $1
      ORDER BY ri.id`,
      [id]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch receipt lines' });
  }
};

// Add a new line to a receipt
exports.addReceiptLine = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, quantity, unit_price, total_price, received_quantity } = req.body;
    
    const result = await pool.query(
      `INSERT INTO receipt_items 
       (receipt_id, product_id, quantity, unit_price, total_price, received_quantity)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, product_id, quantity, unit_price, total_price, received_quantity || 0]
    );
    
    res.status(201).json({ 
      message: 'Line added',
      line: result.rows[0] 
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to add line' });
  }
};

// Update a receipt line
exports.updateReceiptLine = async (req, res) => {
  try {
    const { id, lineId } = req.params;
    const { quantity, unit_price, total_price, received_quantity } = req.body;
    
    const result = await pool.query(
      `UPDATE receipt_items 
       SET quantity = COALESCE($1, quantity),
           unit_price = COALESCE($2, unit_price),
           total_price = COALESCE($3, total_price),
           received_quantity = COALESCE($4, received_quantity)
       WHERE id = $5 AND receipt_id = $6
       RETURNING *`,
      [quantity, unit_price, total_price, received_quantity, lineId, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Line not found' });
    }
    
    res.json({ 
      message: 'Line updated',
      line: result.rows[0] 
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to update line' });
  }
};

// Delete a receipt line
exports.deleteReceiptLine = async (req, res) => {
  try {
    const { id, lineId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM receipt_items WHERE id = $1 AND receipt_id = $2 RETURNING *',
      [lineId, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Line not found' });
    }
    
    res.json({ message: 'Line deleted' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to delete line' });
  }
};

// ============ DELIVERY LINES ============

exports.getDeliveryLines = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT di.*, 
        p.name as product_name,
        p.sku,
        p.category
      FROM delivery_items di
      LEFT JOIN products p ON di.product_id = p.id
      WHERE di.delivery_id = $1
      ORDER BY di.id`,
      [id]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch delivery lines' });
  }
};

exports.addDeliveryLine = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, quantity, unit_price } = req.body;
    
    const result = await pool.query(
      `INSERT INTO delivery_items (delivery_id, product_id, quantity, unit_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, product_id, quantity, unit_price || 0]
    );
    
    res.status(201).json({ 
      message: 'Line added',
      line: result.rows[0] 
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to add line' });
  }
};

exports.updateDeliveryLine = async (req, res) => {
  try {
    const { id, lineId } = req.params;
    const { quantity, unit_price } = req.body;
    
    const result = await pool.query(
      `UPDATE delivery_items 
       SET quantity = COALESCE($1, quantity),
           unit_price = COALESCE($2, unit_price)
       WHERE id = $3 AND delivery_id = $4
       RETURNING *`,
      [quantity, unit_price, lineId, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Line not found' });
    }
    
    res.json({ 
      message: 'Line updated',
      line: result.rows[0] 
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to update line' });
  }
};

exports.deleteDeliveryLine = async (req, res) => {
  try {
    const { id, lineId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM delivery_items WHERE id = $1 AND delivery_id = $2 RETURNING *',
      [lineId, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Line not found' });
    }
    
    res.json({ message: 'Line deleted' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to delete line' });
  }
};
