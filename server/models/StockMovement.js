const pool = require('../config/database');

class StockMovement {
  static async create(movementData) {
    const result = await pool.query(
      `INSERT INTO stock_movements 
       (product_id, warehouse_id, movement_type, quantity, reference_type, reference_id, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        movementData.product_id,
        movementData.warehouse_id,
        movementData.movement_type,
        movementData.quantity,
        movementData.reference_type,
        movementData.reference_id,
        movementData.notes,
        movementData.created_by
      ]
    );
    return result.rows[0];
  }
  
  static async findByProduct(productId, limit = 50) {
    const result = await pool.query(
      `SELECT sm.*, p.name as product_name, w.name as warehouse_name
       FROM stock_movements sm
       LEFT JOIN products p ON sm.product_id = p.id
       LEFT JOIN warehouses w ON sm.warehouse_id = w.id
       WHERE sm.product_id = $1
       ORDER BY sm.created_at DESC
       LIMIT $2`,
      [productId, limit]
    );
    return result.rows;
  }
  
  static async getRecentActivity(hours = 24) {
    const result = await pool.query(
      `SELECT 
        sm.movement_type as type,
        p.name as product,
        sm.quantity,
        sm.created_at as date,
        w.name as warehouse
       FROM stock_movements sm
       LEFT JOIN products p ON sm.product_id = p.id
       LEFT JOIN warehouses w ON sm.warehouse_id = w.id
       WHERE sm.created_at >= NOW() - INTERVAL '${hours} hours'
       ORDER BY sm.created_at DESC
       LIMIT 10`
    );
    return result.rows;
  }
}

module.exports = StockMovement;
