const pool = require('../config/database');

class Receipt {
  static async findAll(filters = {}) {
    let query = `
      SELECT r.*, 
        s.name as supplier_name, 
        w.name as warehouse_name,
        COUNT(ri.id) as items_count
      FROM receipts r
      LEFT JOIN suppliers s ON r.supplier_id = s.id
      LEFT JOIN warehouses w ON r.warehouse_id = w.id
      LEFT JOIN receipt_items ri ON r.id = ri.receipt_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (filters.status) {
      query += ` AND r.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }
    
    if (filters.warehouse_id) {
      query += ` AND r.warehouse_id = $${paramCount}`;
      params.push(filters.warehouse_id);
      paramCount++;
    }
    
    if (filters.search) {
      query += ` AND (r.reference_number ILIKE $${paramCount} OR s.name ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }
    
    query += ' GROUP BY r.id, s.name, w.name ORDER BY r.created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }
  
  static async findById(id) {
    const receiptQuery = `
      SELECT r.*, 
        s.name as supplier_name, s.email as supplier_email,
        w.name as warehouse_name, w.location as warehouse_location,
        u.full_name as created_by_name
      FROM receipts r
      LEFT JOIN suppliers s ON r.supplier_id = s.id
      LEFT JOIN warehouses w ON r.warehouse_id = w.id
      LEFT JOIN users u ON r.created_by = u.id
      WHERE r.id = $1
    `;
    
    const result = await pool.query(receiptQuery, [id]);
    return result.rows[0];
  }
  
  static async create(receiptData, items, userId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const receiptQuery = `
        INSERT INTO receipts 
        (reference_number, supplier_id, warehouse_id, expected_date, notes, status, created_by)
        VALUES ($1, $2, $3, $4, $5, 'draft', $6)
        RETURNING *
      `;
      
      const receiptResult = await client.query(receiptQuery, [
        receiptData.reference_number,
        receiptData.supplier_id,
        receiptData.warehouse_id,
        receiptData.expected_date,
        receiptData.notes,
        userId
      ]);
      
      const receiptId = receiptResult.rows[0].id;
      
      // Insert receipt items
      if (items && items.length > 0) {
        for (const item of items) {
          await client.query(
            `INSERT INTO receipt_items 
             (receipt_id, product_id, quantity, unit_price, total_price)
             VALUES ($1, $2, $3, $4, $5)`,
            [receiptId, item.product_id, item.quantity, item.unit_price, item.total_price]
          );
        }
      }
      
      await client.query('COMMIT');
      return receiptResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
  
  static async updateStatus(id, status) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        `UPDATE receipts 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [status, id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Receipt not found');
      }
      
      const receipt = result.rows[0];
      
      // If validated, update inventory
      if (status === 'validated') {
        const items = await client.query(
          'SELECT * FROM receipt_items WHERE receipt_id = $1',
          [id]
        );
        
        for (const item of items.rows) {
          await client.query(
            `INSERT INTO inventory (product_id, warehouse_id, quantity, last_updated)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
             ON CONFLICT (product_id, warehouse_id)
             DO UPDATE SET 
               quantity = inventory.quantity + $3,
               last_updated = CURRENT_TIMESTAMP`,
            [item.product_id, receipt.warehouse_id, item.quantity]
          );
          
          await client.query(
            `INSERT INTO stock_movements 
             (product_id, warehouse_id, movement_type, quantity, reference_type, reference_id)
             VALUES ($1, $2, 'receipt', $3, 'receipt', $4)`,
            [item.product_id, receipt.warehouse_id, item.quantity, id]
          );
        }
      }
      
      await client.query('COMMIT');
      return receipt;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM receipts WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
  
  static async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as todays_receipts,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_validation,
        COUNT(*) FILTER (WHERE status = 'validated' AND DATE(updated_at) = CURRENT_DATE) as validated_today,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) as total_this_week
      FROM receipts
    `);
    return result.rows[0];
  }
}

module.exports = Receipt;
